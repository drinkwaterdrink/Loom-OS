import assert from "node:assert/strict";
import test from "node:test";
import { compileStateWithRepair } from "../src/backend/compiler";
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

test("invalid output never replaces an existing valid state", async () => {
  const existing = makeState();
  let calls = 0;
  const result = await compileStateWithRepair({
    identity,
    transcript: "[0 USER]\nHello",
    messageCount: 1,
    existingState: existing,
    signal: new AbortController().signal,
    generate: async () => {
      calls += 1;
      return calls === 1 ? "{}" : '{"kernel":null}';
    },
  });

  assert.equal(calls, 2);
  assert.equal(result.ok, false);
  if (!result.ok) {
    assert.equal(result.state, existing);
  }
});
