import assert from "node:assert/strict";
import test from "node:test";
import { DEFAULT_SETTINGS } from "../src/shared/schemas";
import { buildStateSeedForCompiler } from "../src/shared/seed";
import { makeState } from "./fixtures";

test("compiler seed is compact continuity context with its own identity", () => {
  const state = makeState();
  const seed = buildStateSeedForCompiler(state, DEFAULT_SETTINGS);
  assert.ok(seed.length <= DEFAULT_SETTINGS.compilerSeedTokenBudget * 4);
  assert.match(seed, /"messageId":"message beta"/);
  assert.match(seed, /"anchors"/);
  assert.equal(seed.includes('"auditLog"'), false);
  assert.equal(seed.includes('"generatedAt":"2026-06-07'), true);
  assert.match(seed, /"bodyType":"Slim with subtle curves"/);
  assert.match(seed, /"immutableTraits":\["Dark tied-back hair","Keen grey eyes"\]/);
});
