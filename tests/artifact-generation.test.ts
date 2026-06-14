import assert from "node:assert/strict";
import test from "node:test";
import { generateArtifactWithRepair } from "../src/backend/artifactGeneration";
import { createStarterModuleArtifact } from "../src/shared/artifacts";

test("artifact AI generation validates once and repairs malformed output", async () => {
  const valid = createStarterModuleArtifact();
  const attempts: number[] = [];
  const result = await generateArtifactWithRepair({
    kind: "module",
    brief: "Track immutable physical appearance in detail.",
    signal: new AbortController().signal,
    generate: async (messages, _signal, attempt) => {
      attempts.push(attempt);
      const prompt = messages.map((message) => message.content).join("\n");
      if (attempt === 1) {
        assert.match(prompt, /JSON Schema Draft 7 subset/);
        assert.match(prompt, /semantic story state only/);
        return `{"kind":"module"}`;
      }
      assert.match(prompt, /VALIDATION FAILURE/);
      return JSON.stringify(valid);
    },
  });
  assert.deepEqual(attempts, [1, 2]);
  assert.equal(result.repaired, true);
  assert.equal(result.artifact.id, valid.id);
  assert.equal(result.issues.length, 1);
});
