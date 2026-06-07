import assert from "node:assert/strict";
import test from "node:test";
import {
  normalizeGenerationText,
  runQuietGeneration,
} from "../src/backend/generation";

test("generation adapter accepts supported provider response shapes", () => {
  assert.equal(normalizeGenerationText("raw"), "raw");
  assert.equal(normalizeGenerationText({ content: "content" }), "content");
  assert.equal(normalizeGenerationText({ text: "text" }), "text");
  assert.equal(normalizeGenerationText({ output: "output" }), "output");
  assert.equal(normalizeGenerationText({ response: "response" }), "response");
  assert.equal(normalizeGenerationText({ message: "message" }), "message");
  assert.equal(normalizeGenerationText({ message: { content: "nested" } }), "nested");
});

test("generation adapter rejects empty responses clearly", () => {
  assert.throws(
    () => normalizeGenerationText({ content: "" }),
    /without textual content/,
  );
});

test("quiet generation aborts with a clear timeout", async () => {
  const spindle = {
    generate: {
      quiet: ({ signal }: { signal?: AbortSignal }) =>
        new Promise((_, reject) => {
          signal?.addEventListener("abort", () => {
            reject(new DOMException("Aborted", "AbortError"));
          }, { once: true });
        }),
    },
  } as unknown as import("lumiverse-spindle-types").SpindleAPI;

  await assert.rejects(
    runQuietGeneration(spindle, {
      messages: [{ role: "user", content: "Hello" }],
      connectionId: "connection-1",
      userId: "user-1",
      timeoutMs: 20,
      parentSignal: new AbortController().signal,
    }),
    /timed out after 20 ms/,
  );
});
