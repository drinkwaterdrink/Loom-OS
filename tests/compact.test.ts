import assert from "node:assert/strict";
import test from "node:test";
import { buildCompactInjection } from "../src/shared/compact";
import { makeState } from "./fixtures";

test("compact injection stays under the configured budget", async () => {
  const budget = 100;
  const count = async (text: string) => Math.ceil(text.length / 4);
  const result = await buildCompactInjection(makeState(), budget, count);

  assert.ok(await count(result) <= budget);
  assert.match(result, /^<loomos_state>/);
  assert.match(result, /<\/loomos_state>$/);
  assert.equal(result.includes("schemaVersion"), false);
  assert.equal(result.includes('"castMatrix"'), false);
});
