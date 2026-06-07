import assert from "node:assert/strict";
import test from "node:test";
import { LoomOSSettingsSchema, LoomOSStateSchema } from "../src/shared/schemas";
import { buildStateCompilerPrompt } from "../src/shared/prompts";
import { makeState } from "./fixtures";
import type { LoomOSSettings } from "../src/shared/types";

test("core modules cannot be disabled during settings parsing", () => {
  const rawSettings = {
    schemaVersion: 2,
    moduleSettings: {
      sceneKernel: { track: false, display: false, inject: false },
      deltas: { track: false, display: true, inject: true },
    },
  };
  const parsed = LoomOSSettingsSchema.parse(rawSettings);
  assert.equal(parsed.moduleSettings.sceneKernel.track, true);
  assert.equal(parsed.moduleSettings.deltas.track, true);
});

test("custom presets validate and serialize in settings", () => {
  const rawSettings: Partial<LoomOSSettings> = {
    modulePreset: "custom:preset-123",
    customModulePresets: [
      {
        id: "preset-123",
        name: "My Custom Preset",
        description: "A testing preset",
        createdAt: "2026-06-07T00:00:00Z",
        updatedAt: "2026-06-07T00:00:00Z",
        moduleSettings: {
          sceneKernel: { track: true, display: true, inject: true },
          deltas: { track: true, display: true, inject: true },
          meters: { track: true, display: false, inject: false },
          castCore: { track: true, display: true, inject: true },
          castVisuals: { track: false, display: false, inject: false },
          clothing: { track: false, display: false, inject: false },
          relationships: { track: false, display: false, inject: false },
          inventory: { track: false, display: false, inject: false },
          worldSpace: { track: false, display: false, inject: false },
          storyThreads: { track: true, display: true, inject: true },
          continuity: { track: true, display: true, inject: true },
          secretsRumors: { track: false, display: false, inject: false },
          actionResolver: { track: false, display: false, inject: false },
          dialogueState: { track: false, display: false, inject: false },
          directorStyle: { track: false, display: false, inject: false },
          closenessState: { track: false, display: false, inject: false },
          imagePrompt: { track: false, display: false, inject: false },
          auditLog: { track: false, display: false, inject: false },
        },
      },
    ],
  };

  const parsed = LoomOSSettingsSchema.parse(rawSettings);
  assert.equal(parsed.modulePreset, "custom:preset-123");
  assert.equal(parsed.customModulePresets.length, 1);
  assert.equal(parsed.customModulePresets[0]?.name, "My Custom Preset");
});

test("custom modules validate and serialize in settings", () => {
  const rawSettings = {
    customModules: [
      {
        id: "custom-mod-1",
        label: "Faction Rep",
        group: "Custom",
        description: "Tracks faction reputation",
        enabled: true,
        display: true,
        inject: true,
        compilerInstruction: "Track faction standings dynamically",
        outputMode: "gauge",
        maxItems: 4,
        intensity: "medium",
      },
    ],
  };

  const parsed = LoomOSSettingsSchema.parse(rawSettings);
  assert.equal(parsed.customModules.length, 1);
  assert.equal(parsed.customModules[0]?.id, "custom-mod-1");
  assert.equal(parsed.customModules[0]?.outputMode, "gauge");
});

test("compiler prompt builder incorporates custom modules dynamically", () => {
  const customModules = LoomOSSettingsSchema.parse({
    customModules: [
    {
      id: "custom-mod-1",
      group: "Custom",
      label: "Faction Rep",
      enabled: true,
      display: true,
      inject: true,
      description: "",
      compilerInstruction: "Track Faction Standings",
      outputMode: "cards",
      maxItems: 4,
    },
    ],
  }).customModules;

  const prompt = buildStateCompilerPrompt(["sceneKernel"], customModules);
  assert.ok(prompt.includes("customModuleData[moduleId=custom-mod-1]"));
  assert.ok(prompt.includes("Track Faction Standings"));
  assert.ok(prompt.includes("customModuleData"));
  assert.ok(prompt.includes("moduleId"));
});

test("state schema validates compiled custom module data", () => {
  const state = makeState({
    customModuleData: [
      {
        moduleId: "custom-mod-1",
        label: "Faction Rep",
        summary: "Standing has improved",
        fields: {},
        items: [
          {
            title: "Mages Guild",
            text: "Friendly",
            importance: "high",
            color: "#00ff00",
            changed: false,
          },
        ],
      },
    ],
  });

  const parsed = LoomOSStateSchema.parse(state);
  assert.equal(parsed.customModuleData?.length, 1);
  assert.equal(parsed.customModuleData?.[0]?.moduleId, "custom-mod-1");
  assert.equal(parsed.customModuleData?.[0]?.items[0]?.title, "Mages Guild");
});
