import assert from "node:assert/strict";
import test from "node:test";
import { LoomOSSettingsSchema } from "../src/shared/schemas";
import { LoomPackPresetSchema, LoomPackSchema } from "../src/shared/artifacts";
import { enrichViewerModelWithLayout, inspectLayoutDiagnostics } from "../src/frontend/render";
import { buildViewerModel, type ViewerModelV1 } from "../src/shared/viewerModel";
import type { LoomOSSettings, LoomOSState } from "../src/shared/types";

function makeMockState(): LoomOSState {
  return {
    schemaVersion: 2,
    identity: { chatId: "chat1", messageId: "msg1", swipeId: 0 },
    generatedAt: "2026-06-14T15:30:56Z",
    source: {
      messageCount: 0,
      repaired: false,
      seedIdentity: null,
      connectionId: "",
    },
    kernel: { scene: "", location: "", timeframe: "", date: "", time: "", elapsed: "", weather: "", pov: "", tone: "", topic: "", theme: "", objective: "", summary: "", currentFocus: "", nextFocus: "", currentRisk: "", stopMode: "", stopWhy: "", constraints: [] },
    delta: { headline: "", changedModules: [], changes: [], carriedForward: [], newlyEstablished: [] },
    meters: [],
    scene: null,
    castMatrix: [],
    worldState: null,
    storyState: { goals: [], conflicts: [], threadLoom: [], stakes: [], countdowns: [], autonomyQueue: [], spotlightQueue: [] },
    continuityFirewall: { establishedFacts: [], antiRetconAnchors: [], pendingConsequences: [], offscreenState: [], bannedNext: [], impossibleNext: [], risks: [], terms: [] },
    tools: { actionResolver: null, dialogueState: null, directorStyle: null, closenessState: null, imagePrompt: null },
    auditLog: [],
    activeModules: [],
    customModuleData: [],
  };
}

// 1. default layout generation from current settings
test("default layout generation from current settings", () => {
  const settings = LoomOSSettingsSchema.parse({});
  assert.ok(settings.layout);
  assert.ok(Array.isArray(settings.layout.slots));
  assert.ok(settings.layout.widgets.length > 0);
  
  // Verify default slots are there
  const slotIds = settings.layout.slots.map(s => s.id);
  assert.ok(slotIds.includes("hero"));
  assert.ok(slotIds.includes("main"));
  assert.ok(slotIds.includes("cast"));
});

// 2. old settings without layout still normalize
test("old settings without layout still normalize", () => {
  const oldSettings = {
    schemaVersion: 2,
    autoGeneration: "manual",
    moduleSettings: {
      sceneKernel: { track: true, display: true, inject: false }
    }
  };
  const parsed = LoomOSSettingsSchema.parse(oldSettings);
  assert.ok(parsed.layout);
  assert.equal(parsed.layout.responsiveMode, "single-column");
  const kernelWidget = parsed.layout.widgets.find(w => w.id === "sceneKernel");
  assert.ok(kernelWidget);
  assert.equal(kernelWidget.track, true);
  assert.equal(kernelWidget.display, true);
  assert.equal(kernelWidget.inject, false);
});

// 3. Loom Pack preset with layout parses correctly
test("Loom Pack preset with layout parses correctly", () => {
  const presetData = {
    name: "Preset with Layout",
    description: "Testing presets layout",
    layout: {
      slots: [
        { id: "hero", label: "Hero Banner", description: "Top area", maxWidgets: 2 }
      ],
      widgets: [
        { id: "sceneKernel", moduleId: "sceneKernel", source: "stock", label: "Scene", slot: "hero", order: 0, track: true, display: true, inject: false, displayMode: "hero", tokenPriority: 0, localOverrides: {} }
      ],
      responsiveMode: "adaptive-grid"
    }
  };
  const parsed = LoomPackPresetSchema.parse(presetData);
  assert.ok(parsed.layout);
  assert.equal(parsed.layout.responsiveMode, "adaptive-grid");
  assert.equal(parsed.layout.widgets[0]?.id, "sceneKernel");
});

// 4. old Loom Packs without layout still parse
test("old Loom Packs without layout still parse", () => {
  const presetData = {
    name: "Old Preset",
    description: "No layout"
  };
  const parsed = LoomPackPresetSchema.parse(presetData);
  assert.equal(parsed.layout, undefined);
});

// 5. pack import/export preserves layout
test("pack import/export preserves layout", () => {
  const packData = {
    format: "loomos-pack",
    version: 1,
    id: "pack-test",
    meta: { name: "Test Pack", author: "Tester", description: "Pack containing layout" },
    artifacts: [],
    preset: {
      name: "Preset with Layout",
      description: "Testing presets layout",
      layout: {
        slots: [
          { id: "hero", label: "Hero Banner", description: "Top area", maxWidgets: 2 }
        ],
        widgets: [
          { id: "sceneKernel", moduleId: "sceneKernel", source: "stock", label: "Scene", slot: "hero", order: 0, track: true, display: true, inject: false, displayMode: "hero", tokenPriority: 0, localOverrides: {} }
        ],
        responsiveMode: "desktop-split"
      }
    }
  };
  
  const parsed = LoomPackSchema.parse(packData);
  assert.ok(parsed.preset?.layout);
  assert.equal(parsed.preset.layout.responsiveMode, "desktop-split");
});

// 6. applying custom preset preserves/restores layout
test("applying custom preset preserves/restores layout", () => {
  const baseSettings = LoomOSSettingsSchema.parse({});
  const customPreset = {
    id: "custom:preset1",
    name: "Preset 1",
    description: "A custom preset",
    moduleSettings: {
      sceneKernel: { track: true, display: false, inject: true }
    },
    layout: {
      slots: baseSettings.layout!.slots,
      widgets: baseSettings.layout!.widgets.map(w => w.id === "sceneKernel" ? { ...w, slot: "cast" } : w),
      responsiveMode: "adaptive-grid" as const
    }
  };

  const nextSettings = LoomOSSettingsSchema.parse({
    ...baseSettings,
    layout: customPreset.layout,
    moduleSettings: {
      ...baseSettings.moduleSettings,
      ...customPreset.moduleSettings
    }
  });

  assert.equal(nextSettings.layout?.responsiveMode, "adaptive-grid");
  const kernelWidget = nextSettings.layout?.widgets.find(w => w.id === "sceneKernel");
  assert.equal(kernelWidget?.slot, "cast");
});

// 7. widgets group into slots in correct order
test("widgets group into slots in correct order", () => {
  const settings = LoomOSSettingsSchema.parse({});
  const layout = settings.layout!;
  // Reorder widgets and assign slots
  layout.widgets = [
    { id: "deltas", moduleId: "deltas", source: "stock", label: "Deltas", slot: "hero", order: 5, track: true, display: true, inject: false, displayMode: "card", tokenPriority: 0, localOverrides: {} },
    { id: "sceneKernel", moduleId: "sceneKernel", source: "stock", label: "Scene", slot: "hero", order: 2, track: true, display: true, inject: false, displayMode: "hero", tokenPriority: 0, localOverrides: {} }
  ];

  const state = makeMockState();
  const baseModel = buildViewerModel(state, settings, [], "active");
  const enriched = enrichViewerModelWithLayout(baseModel, state, { ...settings, layout });

  assert.ok(enriched.layout);
  const heroGroup = enriched.layout.slotsGrouped["hero"];
  assert.ok(heroGroup);
  // Order 2 (sceneKernel) should come before Order 5 (deltas)
  assert.equal(heroGroup.widgets[0]?.id, "sceneKernel");
  assert.equal(heroGroup.widgets[1]?.id, "deltas");
});

// 8. hidden widgets do not render
test("hidden widgets do not render", () => {
  const settings = LoomOSSettingsSchema.parse({});
  const layout = settings.layout!;
  // Hide one widget and verify renderedContent is empty
  layout.widgets = layout.widgets.map(w => w.id === "sceneKernel" ? { ...w, display: false } : w);

  const state = makeMockState();
  const baseModel = buildViewerModel(state, settings, [], "active");
  const enriched = enrichViewerModelWithLayout(baseModel, state, { ...settings, layout });

  assert.ok(enriched.layout);
  const kernelWidget = enriched.layout.widgets.find(w => w.id === "sceneKernel");
  assert.ok(kernelWidget);
  assert.equal(kernelWidget.renderedContent, "");
});

// 9. missing module widget produces diagnostic
test("missing module widget produces diagnostic", () => {
  const settings = LoomOSSettingsSchema.parse({});
  const layout = settings.layout!;
  
  // Add a widget pointing to a missing custom module
  layout.widgets.push({
    id: "nonexistent",
    moduleId: "nonexistent",
    source: "custom",
    label: "Missing Module",
    slot: "main",
    order: 100,
    track: true,
    display: true,
    inject: false,
    displayMode: "card",
    tokenPriority: 0,
    localOverrides: {}
  });

  const diagnostics = inspectLayoutDiagnostics(layout, settings, null);
  const missingWarning = diagnostics.find(d => d.message.includes("references missing custom module"));
  assert.ok(missingWarning);
  assert.equal(missingWarning.severity, "warning");
});

// 10. old themes without slots render unchanged
test("old themes without slots render unchanged", () => {
  const settings = LoomOSSettingsSchema.parse({});
  const state = makeMockState();
  const baseModel = buildViewerModel(state, settings, [], "active");
  const enriched = enrichViewerModelWithLayout(baseModel, state, settings);

  // Old monolithic model properties should still be present
  assert.equal(enriched.version, 1);
  assert.ok(enriched.meta);
  assert.ok(enriched.kernel);
});

// 11. track/display/inject behavior remains synchronized
test("track/display/inject behavior remains synchronized", () => {
  const settings = LoomOSSettingsSchema.parse({
    moduleSettings: {
      sceneKernel: { track: true, display: false, inject: true }
    }
  });

  const kernelWidget = settings.layout?.widgets.find(w => w.id === "sceneKernel");
  assert.ok(kernelWidget);
  assert.equal(kernelWidget.track, true);
  assert.equal(kernelWidget.display, false);
  assert.equal(kernelWidget.inject, true);
});
