import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getEffectiveModuleCatalog,
} from "../src/shared/modules";
import { buildStateCompilerPrompt } from "../src/shared/prompts";
import { DEFAULT_SETTINGS, LoomOSSettingsSchema } from "../src/shared/schemas";
import { createCustomModuleFromStock } from "../src/shared/customModuleFactory";

test("effective catalog applies stock metadata overrides without mutating stock entries", () => {
  const settings = LoomOSSettingsSchema.parse({
    stockModuleOverrides: {
      sceneKernel: {
        label: "Scene Compass",
        group: "Foundation",
        description: "Custom effective description.",
        compilerGuidanceAddendum: "Emphasize immediate physical constraints.",
      },
    },
  });
  const effective = getEffectiveModuleCatalog(settings).find((module) => module.key === "sceneKernel")!;
  assert.equal(effective.label, "Scene Compass");
  assert.equal(effective.group, "Foundation");
  assert.equal(effective.description, "Custom effective description.");
  assert.match(effective.compilerInstruction, /immediate physical constraints/);
  assert.notEqual(getEffectiveModuleCatalog()[0]?.label, "Scene Compass");
});

test("stock compiler guidance override reaches the compiler prompt", () => {
  const prompt = buildStateCompilerPrompt(
    ["sceneKernel"],
    [],
    {
      sceneKernel: {
        compilerGuidanceAddendum: "Track the locked vault door.",
      },
    },
  );
  assert.match(prompt, /Track the locked vault door/);
});

test("duplicate stock as custom creates a valid independent custom module", () => {
  const settings = LoomOSSettingsSchema.parse({
    stockModuleOverrides: {
      inventory: {
        label: "Inventory Ledger",
        group: "Records",
        description: "Detailed ownership ledger.",
        compilerGuidanceAddendum: "Prioritize item transfers.",
      },
    },
  });
  const custom = createCustomModuleFromStock("inventory", settings, "cmod_inventory");
  assert.equal(custom.label, "Inventory Ledger Custom");
  assert.equal(custom.group, "Records");
  assert.match(custom.compilerInstruction, /Prioritize item transfers/);
  assert.equal(custom.outputMode, "cards");
});

test("frontend renders stock actions and editor/inspector handlers", async () => {
  const source = await readFile("src/frontend.ts", "utf8");
  for (const action of ["inspect", "edit", "reset", "duplicate-as-custom"]) {
    assert.match(source, new RegExp(`data-stock-action="${action}"`));
  }
  assert.match(source, /Copy Structure/);
  assert.match(source, /Save Override/);
  assert.match(source, /stockModuleOverrides:\s*\{/);
  assert.match(source, /delete newOverrides\[moduleKey\]/);
  assert.match(source, /createCustomModuleFromStock/);
});
