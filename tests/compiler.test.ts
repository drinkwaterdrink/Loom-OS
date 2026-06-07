import assert from "node:assert/strict";
import test from "node:test";
import { compileStateWithRepair } from "../src/backend/compiler";
import { trackedModuleKeys } from "../src/shared/modules";
import { DEFAULT_SETTINGS } from "../src/shared/schemas";
import { compiledState, identity, makeState } from "./fixtures";

test("compiler retries exactly once and accepts repaired JSON", async () => {
  const outputs = [
    "not json",
    JSON.stringify(compiledState),
  ];
  let calls = 0;
  const result = await compileStateWithRepair({
    identity,
    transcript: "[0 USER]\nHello",
    messageCount: 1,
    existingState: null,
    seedState: null,
    seedText: "null",
    enabledModules: trackedModuleKeys(DEFAULT_SETTINGS),
    connectionId: "connection-1",
    signal: new AbortController().signal,
    generate: async () => outputs[calls++]!,
  });

  assert.equal(calls, 2);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.repaired, true);
    assert.deepEqual(result.state.identity, identity);
    assert.equal(result.state.source.repaired, true);
  }
});

test("double invalid output saves a valid minimal fallback exact-swipe state", async () => {
  const existing = makeState();
  let calls = 0;
  const result = await compileStateWithRepair({
    identity,
    transcript: "[0 USER]\nHello",
    messageCount: 1,
    existingState: existing,
    seedState: existing,
    seedText: JSON.stringify(existing),
    enabledModules: trackedModuleKeys(DEFAULT_SETTINGS),
    connectionId: "connection-1",
    signal: new AbortController().signal,
    generate: async () => {
      calls += 1;
      return calls === 1 ? "not json" : "still not json";
    },
  });

  assert.equal(calls, 2);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.fallbackSaved, true);
    assert.equal(result.state.source.repaired, true);
    assert.deepEqual(result.state.identity, identity);
    assert.equal(result.state.delta.headline, "Compiler output was invalid; saved minimal fallback state.");
    assert.equal(result.state.auditLog[0]?.result, "fallback_state_saved");
  }
});
