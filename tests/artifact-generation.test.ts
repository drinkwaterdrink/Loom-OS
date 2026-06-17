import assert from "node:assert/strict";
import test from "node:test";
import { generateArtifactWithRepair } from "../src/backend/artifactGeneration";
import {
  buildArtifactBlockRefinementMessages,
  refineArtifactBlockWithRepair,
} from "../src/backend/artifactBlockRefinement";
import { createStarterModuleArtifact } from "../src/shared/artifacts";
import { findArtifactBlockTarget } from "../src/shared/artifactBlocks";

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

test("block refinement prompts include only selected block plus bounded context", () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  const messages = buildArtifactBlockRefinementMessages({
    artifact: module,
    target,
    instruction: "Make the prompt more concise.",
    signal: new AbortController().signal,
    generate: async () => "{}",
  });
  const prompt = messages.map((message) => message.content).join("\n");
  assert.match(prompt, /selected block path is "prompt"/);
  assert.match(prompt, /BOUNDED BLOCK CONTEXT/);
  assert.match(prompt, /currentValue/);
  assert.doesNotMatch(prompt, /complete responsive HTML/);
  assert.doesNotMatch(prompt, /grid-template-columns/);
});

test("block refinement repair pass validates replacement after malformed output", async () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  const attempts: number[] = [];
  const result = await refineArtifactBlockWithRepair({
    artifact: module,
    target,
    instruction: "Make the prompt concise.",
    signal: new AbortController().signal,
    generate: async (_messages, _signal, attempt) => {
      attempts.push(attempt);
      if (attempt === 1) return "not json";
      return JSON.stringify({
        target: { artifactId: module.id, kind: "module", path: "prompt" },
        replacementValue: "Track grounded changes concisely.",
        summary: "Shortened prompt.",
        warnings: [],
        changedPaths: ["prompt"],
        repaired: true,
        issues: [],
      });
    },
  });
  assert.deepEqual(attempts, [1, 2]);
  assert.equal(result.repaired, true);
  assert.equal(result.artifact.kind, "module");
  if (result.artifact.kind === "module") {
    assert.equal(result.artifact.prompt, "Track grounded changes concisely.");
  }
});

test("block refinement rejects blank instructions before generation", async () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  let calls = 0;
  await assert.rejects(() => refineArtifactBlockWithRepair({
    artifact: module,
    target,
    instruction: "   ",
    signal: new AbortController().signal,
    generate: async () => {
      calls += 1;
      return "{}";
    },
  }), /Describe the block change/);
  assert.equal(calls, 0);
});

test("block refinement cancellation stops before model generation", async () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  const controller = new AbortController();
  controller.abort();
  let calls = 0;
  await assert.rejects(() => refineArtifactBlockWithRepair({
    artifact: module,
    target,
    instruction: "Make the prompt concise.",
    signal: controller.signal,
    generate: async () => {
      calls += 1;
      return "{}";
    },
  }), /cancelled|AbortError/);
  assert.equal(calls, 0);
});

test("block refinement cancellation stops before repair output is applied", async () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  const controller = new AbortController();
  const attempts: number[] = [];
  await assert.rejects(() => refineArtifactBlockWithRepair({
    artifact: module,
    target,
    instruction: "Make the prompt concise.",
    signal: controller.signal,
    generate: async (_messages, _signal, attempt) => {
      attempts.push(attempt);
      if (attempt === 1) return "not json";
      controller.abort();
      return JSON.stringify({
        target: { artifactId: module.id, kind: "module", path: "prompt" },
        replacementValue: "This should not be applied.",
        summary: "Prepared.",
        warnings: [],
        changedPaths: ["prompt"],
        repaired: true,
        issues: [],
      });
    },
  }), /cancelled|AbortError/);
  assert.deepEqual(attempts, [1, 2]);
});
