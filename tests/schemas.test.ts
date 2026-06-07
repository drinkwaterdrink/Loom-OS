import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_SETTINGS,
  LoomOSStateSchema,
} from "../src/shared/schemas";
import { makeState } from "./fixtures";

test("settings defaults are complete and conservative", () => {
  assert.equal(DEFAULT_SETTINGS.autoGeneration, "manual");
  assert.equal(DEFAULT_SETTINGS.injectionEnabled, false);
  assert.equal(DEFAULT_SETTINGS.injectionTokenBudget, 320);
  assert.equal(DEFAULT_SETTINGS.moduleSettings.sceneKernel.track, true);
  assert.equal(DEFAULT_SETTINGS.moduleSettings.appearance.track, true);
  assert.equal(DEFAULT_SETTINGS.moduleSettings.dialogueState.track, false);
  assert.equal(DEFAULT_SETTINGS.skin, "auto");
});

test("a valid LoomOS state passes strict validation", () => {
  const state = makeState();
  assert.deepEqual(LoomOSStateSchema.parse(state), state);
});

test("a minimal V2 state with disabled optional modules validates", () => {
  const state = makeState({
    activeModules: [
      "sceneKernel",
      "deltas",
      "castCore",
      "storyThreads",
      "continuity",
    ],
    meters: [],
    scene: null,
    worldState: null,
    tools: {
      actionResolver: null,
      dialogueState: null,
      directorStyle: null,
      closenessState: null,
      imagePrompt: null,
    },
    auditLog: [],
  });
  assert.equal(LoomOSStateSchema.safeParse(state).success, true);
});

test("invalid thread urgency is rejected", () => {
  const state = makeState();
  state.storyState.threadLoom[0]!.urgency = 9;
  assert.equal(LoomOSStateSchema.safeParse(state).success, false);
});

test("expanded immutable appearance fields validate", () => {
  const state = makeState();
  const appearance = state.castMatrix[0]!.appearance;
  assert.equal(appearance.bodyType, "Slim with subtle curves");
  assert.equal(appearance.bust, "Modest");
  assert.equal(appearance.uniqueFeatures, "A faint crescent scar beneath the left eye");
  assert.deepEqual(appearance.immutableTraits, ["Dark tied-back hair", "Keen grey eyes"]);
  assert.equal(LoomOSStateSchema.safeParse(state).success, true);
});
