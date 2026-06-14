import assert from "node:assert/strict";
import test from "node:test";
import {
  ARTIFACT_REVISION_LIMIT,
  EMPTY_ARTIFACT_LIBRARY,
  artifactToCustomModule,
  createStarterBlueprintArtifact,
  createStarterModuleArtifact,
  deleteArtifactRecord,
  normalizeValueForJsonSchema,
  parseLoomOSArtifact,
  parseLoomOSArtifactText,
  restoreArtifactRecord,
  upsertArtifactRecord,
  validateJsonSchemaSubset,
} from "../src/shared/artifacts";
import { CustomModuleSchema } from "../src/shared/schemas";

test("artifact v2 accepts nested schemas and rejects unsupported or unstable fields", () => {
  const valid = {
    type: "object",
    properties: {
      appearance: {
        type: "object",
        properties: {
          eyes: { type: "string", maxLength: 120 },
          measurements: {
            type: "array",
            items: {
              type: "object",
              properties: {
                label: { type: "string" },
                value: { type: "number", minimum: 0 },
              },
              required: ["label", "value"],
              additionalProperties: false,
            },
            maxItems: 12,
          },
        },
        required: ["eyes"],
        additionalProperties: false,
      },
    },
    required: ["appearance"],
    additionalProperties: false,
  };
  assert.deepEqual(validateJsonSchemaSubset(valid), []);

  const invalid = structuredClone(valid) as Record<string, unknown>;
  invalid.$ref = "#/definitions/appearance";
  const appearance = (invalid.properties as Record<string, Record<string, unknown>>).appearance!;
  (appearance.properties as Record<string, unknown>)["unstable-field"] = { type: "string" };
  const messages = validateJsonSchemaSubset(invalid).map((issue) => issue.message).join("\n");
  assert.match(messages, /Unsupported JSON Schema keyword/);
  assert.match(messages, /letters, numbers, or underscores/);
});

test("legacy custom modules migrate to portable module capsules", () => {
  const legacy = CustomModuleSchema.parse({
    id: "legacy_weather",
    label: "Weather Memory",
    description: "Tracks persistent weather.",
    compilerInstruction: "Track only established weather.",
    schemaFields: [{
      id: "field_weather",
      label: "Conditions",
      key: "conditions",
      type: "text",
      required: true,
    }],
    htmlTemplate: "<article>{{conditions}}</article>",
    cssTemplate: "article { color: white; }",
    allowHtmlTemplate: true,
  });
  const artifact = parseLoomOSArtifact(legacy);
  assert.equal(artifact.kind, "module");
  if (artifact.kind !== "module") return;
  assert.equal(artifact.version, 2);
  assert.equal(artifact.meta.name, "Weather Memory");
  assert.equal(artifact.schema.type, "object");

  const installed = artifactToCustomModule(artifact);
  assert.equal(installed.artifactId, artifact.id);
  assert.equal((installed.jsonSchema as { type?: string } | undefined)?.type, "object");
  assert.equal(installed.compilerInstruction, legacy.compilerInstruction);
  assert.equal(installed.htmlTemplate, legacy.htmlTemplate);
});

test("artifact text import accepts fenced AI JSON", () => {
  const artifact = createStarterModuleArtifact();
  const parsed = parseLoomOSArtifactText(`Here is the artifact:\n\`\`\`json\n${JSON.stringify(artifact)}\n\`\`\``);
  assert.equal(parsed.id, artifact.id);
  assert.equal(parsed.kind, "module");
});

test("artifact revisions are bounded, restorable, and deletable", () => {
  const base = createStarterModuleArtifact();
  let library = EMPTY_ARTIFACT_LIBRARY;
  for (let index = 1; index <= ARTIFACT_REVISION_LIMIT + 2; index += 1) {
    const result = upsertArtifactRecord(library, {
      ...base,
      meta: { ...base.meta, description: `Revision ${index}` },
    });
    library = result.library;
  }
  const record = library.records[0]!;
  assert.equal(record.revision, ARTIFACT_REVISION_LIMIT + 2);
  assert.equal(record.revisions.length, ARTIFACT_REVISION_LIMIT);
  assert.equal(record.revisions[0]?.revision, 3);

  const restored = restoreArtifactRecord(library, base.id, 5);
  assert.equal(restored.record.revision, ARTIFACT_REVISION_LIMIT + 3);
  assert.equal(restored.record.artifact.meta.description, "Revision 5");
  assert.equal(deleteArtifactRecord(restored.library, base.id).records.length, 0);
});

test("schema normalization clamps nested semantic data and removes unknown fields", () => {
  const schema = {
    type: "object" as const,
    properties: {
      score: { type: "integer" as const, minimum: 0, maximum: 10 },
      tags: {
        type: "array" as const,
        maxItems: 2,
        items: { type: "string" as const, maxLength: 5 },
      },
      nested: {
        type: "object" as const,
        properties: {
          active: { type: "boolean" as const, default: true },
        },
        required: ["active"],
        additionalProperties: false,
      },
    },
    required: ["score", "nested"],
    additionalProperties: false,
  };
  assert.deepEqual(normalizeValueForJsonSchema({
    score: 13.8,
    tags: ["1234567", "ok", "ignored"],
    nested: { extra: "removed" },
    unknown: true,
  }, schema), {
    score: 10,
    tags: ["12345", "ok"],
    nested: { active: true },
  });
});

test("blueprints retain complete embedded artifacts", () => {
  const module = createStarterModuleArtifact();
  const blueprint = createStarterBlueprintArtifact();
  const parsed = parseLoomOSArtifact({
    ...blueprint,
    modules: [module],
  });
  assert.equal(parsed.kind, "blueprint");
  if (parsed.kind !== "blueprint") return;
  assert.equal(parsed.modules[0]?.id, module.id);
});
