import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  getEffectiveModuleCatalog,
} from "../src/shared/modules";
import {
  buildStateCompilerPrompt,
  buildStockModuleContractDocument,
  buildStockModulePromptBlock,
} from "../src/shared/prompts";
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

test("stock schema and compiler replacements become the effective generation contract", () => {
  const overrides = {
    appearance: {
      schemaSummaryOverride: "castMatrix[].appearance{hair, eyes, immutableTraits[]}",
      compilerInstructionOverride: "Track only transcript-confirmed immutable physical traits.",
      compilerGuidanceAddendum: "Preserve the existing visual anchor.",
    },
  };
  const effective = getEffectiveModuleCatalog({ stockModuleOverrides: overrides })
    .find((module) => module.key === "appearance")!;
  assert.equal(effective.schemaSummary, overrides.appearance.schemaSummaryOverride);
  assert.match(effective.compilerInstruction, /Track only transcript-confirmed/);
  assert.match(effective.compilerInstruction, /Preserve the existing visual anchor/);

  const block = buildStockModulePromptBlock("appearance", overrides);
  assert.match(block, /immutableTraits/);
  assert.match(block, /Track only transcript-confirmed/);

  const fullPrompt = buildStateCompilerPrompt(["castCore", "appearance"], [], overrides);
  assert.match(fullPrompt, /Never infer exact measurements/);
  assert.match(fullPrompt, /immutableTraits/);
});

test("stock module contract document exposes every current module template", () => {
  const document = buildStockModuleContractDocument();
  assert.match(document, /Immutable Appearance \(appearance\)/);
  assert.match(document, /Generation schema|Schema:/);
  assert.match(document, /Injection behavior:/);
  assert.match(document, /Render behavior:/);
});

test("image prompt contract follows the GPT Image production brief structure", () => {
  const prompt = buildStateCompilerPrompt(["imagePrompt"], []);
  assert.match(prompt, /GPT Image prompt rules/);
  assert.match(prompt, /INTENT; SCENE/);
  assert.match(prompt, /350-800 words/);
  assert.match(prompt, /photorealistic/);
  assert.match(prompt, /characterContinuity/);
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
  assert.match(source, /Creator Workshop/);
  assert.match(source, /nested JSON Schema editor/);
  assert.match(source, /Generation schema replacement/);
  assert.match(source, /Compiler instruction replacement/);
  assert.match(source, /Copy Full Prompt/);
  assert.match(source, /stockModuleOverrides:\s*\{/);
  assert.match(source, /delete newOverrides\[moduleKey\]/);
  assert.match(source, /createCustomModuleFromStock/);
});
