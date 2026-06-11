import assert from "node:assert/strict";
import test from "node:test";
import {
  buildFallbackCompiledState,
  normalizeCompiledState,
} from "../src/shared/normalizeCompiledState";
import {
  DEFAULT_SETTINGS,
  LoomOSCompiledStateSchema,
  LoomOSStateSchema,
} from "../src/shared/schemas";
import { trackedModuleKeys } from "../src/shared/modules";
import { compiledState, identity } from "./fixtures";

function malformedState(): Record<string, any> {
  return JSON.parse(JSON.stringify(compiledState));
}

test("normalization v2 repairs common provider shape mismatches", () => {
  const input = malformedState();
  input.castMatrix[0].goals = [{ goal: "Recover the ledger" }];
  input.castMatrix[0].pockets = "Brass key";
  input.continuityFirewall.impossibleNext = [{ text: "Use the collapsed stair" }];
  input.kernel.constraints = { text: "Do not split the party" };
  input.scene.items = ["Torn page"];

  const result = normalizeCompiledState(input, {
    enabledModules: trackedModuleKeys(DEFAULT_SETTINGS),
  });

  assert.deepEqual(result.state.castMatrix[0]?.goals, ["Recover the ledger"]);
  assert.equal(result.state.castMatrix[0]?.pockets[0]?.name, "Brass key");
  assert.deepEqual(result.state.continuityFirewall.impossibleNext, ["Use the collapsed stair"]);
  assert.deepEqual(result.state.kernel.constraints, ["Do not split the party"]);
  assert.equal(result.state.scene?.items[0]?.name, "Torn page");
});

test("normalization v2 completes missing shells and child arrays", () => {
  const result = normalizeCompiledState({
    activeModules: ["sceneKernel", "bogus"],
    kernel: { scene: "Archive" },
    storyState: {},
    continuityFirewall: {},
  }, {
    enabledModules: trackedModuleKeys(DEFAULT_SETTINGS),
  });

  assert.ok(result.state.delta);
  assert.deepEqual(result.state.castMatrix, []);
  assert.deepEqual(result.state.storyState.goals, []);
  assert.deepEqual(result.state.storyState.threadLoom, []);
  assert.deepEqual(result.state.tools, {
    actionResolver: null,
    dialogueState: null,
    directorStyle: null,
    closenessState: null,
    imagePrompt: null,
  });
  assert.deepEqual(result.state.auditLog, []);
  assert.deepEqual(result.state.customModuleData, []);
  assert.equal(LoomOSCompiledStateSchema.safeParse(result.state).success, true);
});

test("normalization v2 replaces malformed enums and gauges safely", () => {
  const input = malformedState();
  input.castMatrix[0].kind = "hero";
  input.castMatrix[0].awareness = "omniscient";
  input.castMatrix[0].spotlight = null;
  input.scene.privacy = "secret";
  input.scene.access.exit = "TELEPORT";
  input.storyState.threadLoom[0].status = "paused";
  input.storyState.threadLoom[0].priority = "urgent";
  input.continuityFirewall.risks[0].severity = "catastrophic";

  const { state } = normalizeCompiledState(input, {
    enabledModules: trackedModuleKeys(DEFAULT_SETTINGS),
  });

  assert.equal(state.castMatrix[0]?.kind, "npc");
  assert.equal(state.castMatrix[0]?.awareness, "ambient");
  assert.equal(state.castMatrix[0]?.spotlight.band, "unknown");
  assert.equal(state.scene?.privacy, "semi-private");
  assert.equal(state.scene?.access.exit, "FREE");
  assert.equal(state.storyState.threadLoom[0]?.status, "active");
  assert.equal(state.storyState.threadLoom[0]?.priority, "medium");
  assert.equal(state.continuityFirewall.risks[0]?.severity, "medium");
});

test("normalization preserves expanded character and continuity ledger fields", () => {
  const input = malformedState();
  const { state } = normalizeCompiledState(input, {
    enabledModules: trackedModuleKeys(DEFAULT_SETTINGS),
  });
  const member = state.castMatrix[0]!;
  assert.equal(member.appearance.species, "Human");
  assert.equal(member.clothing.layers[0]?.slot, "outer");
  assert.equal(member.currentState.rightHand, "Holding a lantern");
  assert.equal(member.relationships[0]?.evidence, "Iven concealed a torn page.");
  assert.equal(member.continuity.uncertainty[0]?.label, "POSSIBLE");
  assert.equal(state.worldState?.loadedSigns[0]?.payoffHint, "The soot will connect Iven to the hidden page.");
  assert.equal(state.storyState.spotlightQueue[0]?.need, "soon");
});

test("custom schema fields normalize malformed compiled values", () => {
  const customModule = DEFAULT_SETTINGS.customModules.concat({
    id: "cmod_romance",
    label: "Romance Tension",
    group: "Custom",
    description: "",
    enabled: true,
    display: true,
    inject: false,
    compilerInstruction: "Track grounded romantic tension.",
    outputMode: "template" as const,
    maxItems: 4,
    intensity: "medium" as const,
    displayOrder: 500,
    schemaFields: [
      {
        id: "field_tension",
        label: "Tension",
        key: "tension",
        type: "gauge" as const,
        required: true,
        description: "",
        enumOptions: [],
        min: 0,
        max: 100,
      },
      {
        id: "field_signals",
        label: "Signals",
        key: "signals",
        type: "chips" as const,
        required: false,
        description: "",
        enumOptions: [],
        maxItems: 3,
      },
    ],
    htmlTemplate: "",
    cssTemplate: "",
    templateEngine: "mustache-lite" as const,
    allowHtmlTemplate: true,
  });
  const input = malformedState();
  input.customModuleData = [{
    moduleId: "cmod_romance",
    label: "Romance Tension",
    fields: {
      tension: "bad",
      signals: { text: "lingering eye contact" },
    },
    items: ["A guarded compliment"],
  }];

  const { state } = normalizeCompiledState(input, {
    enabledModules: trackedModuleKeys(DEFAULT_SETTINGS),
    customModules: customModule,
  });
  const custom = state.customModuleData[0]!;
  assert.equal((custom.fields.tension as Record<string, unknown>).value, 0);
  assert.deepEqual(custom.fields.signals, ["lingering eye contact"]);
  assert.equal(custom.items[0]?.title, "A guarded compliment");
});

test("fallback compiled state is minimal and validates as exact State V2", () => {
  const compiled = buildFallbackCompiledState({
    enabledModules: trackedModuleKeys(DEFAULT_SETTINGS),
    seedState: null,
    transcript: "[0 USER]\nThe archive door closes.",
    notes: "kernel.scene: Expected string",
  });
  const state = {
    ...compiled,
    schemaVersion: 2 as const,
    identity,
    generatedAt: "2026-06-07T12:00:00.000Z",
    source: {
      messageCount: 1,
      repaired: true,
      seedIdentity: null,
      connectionId: "connection-1",
    },
  };
  assert.equal(LoomOSStateSchema.safeParse(state).success, true);
  assert.equal(state.delta.headline, "Compiler output was invalid; saved minimal fallback state.");
  assert.equal(state.auditLog[0]?.result, "fallback_state_saved");
});

test("appearance normalization preserves deep immutable traits and repairs shorthand arrays", () => {
  const input = malformedState();
  input.castMatrix[0].appearance = {
    hair: { description: "Silver curls" },
    eyes: "Amber",
    bodyType: "Curvy",
    bust: "Full",
    glutes: "Full and rounded",
    uniqueFeatures: { text: "Star-shaped birthmark at the collarbone" },
    attractiveFeatures: "Expressive eyes and balanced curves",
    immutableTraits: [
      { text: "Amber eyes" },
      "Silver curls",
    ],
  };
  const { state } = normalizeCompiledState(input, {
    enabledModules: trackedModuleKeys(DEFAULT_SETTINGS),
  });
  const appearance = state.castMatrix[0]!.appearance;
  assert.equal(appearance.hair, "Silver curls");
  assert.equal(appearance.bodyType, "Curvy");
  assert.equal(appearance.bust, "Full");
  assert.equal(appearance.glutes, "Full and rounded");
  assert.equal(appearance.uniqueFeatures, "Star-shaped birthmark at the collarbone");
  assert.equal(appearance.attractiveFeatures, "Expressive eyes and balanced curves");
  assert.deepEqual(appearance.immutableTraits, ["Amber eyes", "Silver curls"]);
  assert.equal(LoomOSCompiledStateSchema.safeParse(state).success, true);
});

test("normalization preserves expanded clothing and GPT Image production fields", () => {
  const input = malformedState();
  input.castMatrix[0].clothing = {
    summary: "A detailed tailored outfit.",
    styling: "Collar raised and belt knotted.",
    coverage: "Full sleeves and trousers.",
    footwear: "Weathered leather boots.",
    accessories: "Gloves and a document satchel.",
    layerCount: 8,
    layers: Array.from({ length: 8 }, (_, index) => ({
      slot: "other",
      text: `Layer ${index + 1}`,
    })),
  };
  input.tools.imagePrompt = {
    aspect: "16:9",
    shot: "Wide",
    medium: "Photorealistic",
    subject: "Two adults in an observatory.",
    positive: "Grounded detail.",
    negative: "No text.",
    intent: "A production-ready scene image.",
    composition: "Balanced two-shot.",
    camera: "35mm eye level.",
    lighting: "Moonlight and lantern light.",
    colorPalette: "Copper and charcoal.",
    environment: "Rain-lashed observatory.",
    characterContinuity: "Preserve established faces and clothing.",
    action: "They confront one another.",
    materials: "Wet wool and aged brass.",
    mood: "Tense.",
    textRendering: "No visible text.",
    constraints: ["Exactly two adults", "Readable hands"],
    full: "X".repeat(7000),
    hint: "Keep continuity exact.",
  };
  const { state } = normalizeCompiledState(input, {
    enabledModules: trackedModuleKeys(DEFAULT_SETTINGS),
  });
  assert.equal(state.castMatrix[0]!.clothing.layers.length, 8);
  assert.equal(state.castMatrix[0]!.clothing.styling, "Collar raised and belt knotted.");
  assert.equal(state.tools.imagePrompt?.characterContinuity, "Preserve established faces and clothing.");
  assert.equal(state.tools.imagePrompt?.constraints.length, 2);
  assert.equal(state.tools.imagePrompt?.full.length, 7000);
});
