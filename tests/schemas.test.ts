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
  assert.equal(DEFAULT_SETTINGS.skin, "auto");
});

test("a valid LoomOS state passes strict validation", () => {
  const state = makeState();
  assert.deepEqual(LoomOSStateSchema.parse(state), state);
});

test("invalid thread urgency is rejected", () => {
  const state = makeState();
  state.threadLoom[0]!.urgency = 9;
  assert.equal(LoomOSStateSchema.safeParse(state).success, false);
});
