import assert from "node:assert/strict";
import test from "node:test";
import {
  ModuleCapsuleArtifactSchema,
  ThemeArtifactSchema,
  createStarterModuleArtifact,
  createStarterThemeArtifact,
} from "../src/shared/artifacts";
import {
  applyVisualModuleEdits,
  applyVisualThemeEdits,
  generateThemeDesignCss,
  parseJsonSchemaToVisualFields,
  visualFieldsToJsonSchema,
  type VisualField,
} from "../src/shared/visualBuilders";
import { buildThemeDocument } from "../src/shared/themeRuntime";
import { buildViewerModel } from "../src/shared/viewerModel";
import { DEFAULT_SETTINGS } from "../src/shared/schemas";

const fields: VisualField[] = [
  {
    key: "summary",
    label: "Summary",
    type: "longText",
    required: true,
    description: "Grounded state summary.",
    enumOptions: [],
  },
  {
    key: "pressure",
    label: "Pressure",
    type: "gauge",
    required: false,
    description: "Current pressure.",
    enumOptions: [],
    min: 0,
    max: 100,
    defaultValue: 25,
  },
  {
    key: "relationship",
    label: "Relationship",
    type: "relationship-edge",
    required: false,
    description: "",
    enumOptions: [],
  },
];

test("visual Field Builder converts simple and semantic fields to the JSON Schema subset", () => {
  const schema = visualFieldsToJsonSchema(fields);
  assert.equal(schema.type, "object");
  assert.deepEqual(schema.required, ["summary"]);
  assert.equal(schema.properties?.pressure?.type, "number");
  assert.equal(schema.properties?.pressure?.maximum, 100);
  assert.equal(schema.properties?.relationship?.properties?.target?.type, "string");
});

test("visual Field Builder parses simple existing schemas into field cards", () => {
  const parsed = parseJsonSchemaToVisualFields(visualFieldsToJsonSchema(fields), {
    relationship: "relationship-edge",
  });
  assert.equal(parsed.mode, "visual");
  assert.deepEqual(parsed.fields.map((field) => field.type), ["longText", "gauge", "relationship-edge"]);
});

test("complex schemas fall back to Advanced schema mode without rewriting the schema", () => {
  const artifact = createStarterModuleArtifact();
  const complex = ModuleCapsuleArtifactSchema.parse({
    ...artifact,
    schema: {
      type: "object",
      properties: {
        nested: {
          type: "object",
          properties: { deep: { type: "object", properties: {}, additionalProperties: false } },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  });
  const parsed = parseJsonSchemaToVisualFields(complex.schema);
  assert.equal(parsed.mode, "advanced");
  const edited = applyVisualModuleEdits(complex, {
    name: "Complex Module",
    description: "",
    author: "User",
    tags: [],
    trackingPurpose: "",
    prompt: complex.prompt,
    outputMode: "cards",
    defaults: complex.defaults,
    slotRecommendation: "main",
    displayModeRecommendation: "card",
    tokenPriorityRecommendation: 5,
    sampleData: {},
  });
  assert.deepEqual(edited.schema, complex.schema);
});

test("visual module edits produce a valid Module Capsule artifact", () => {
  const artifact = createStarterModuleArtifact();
  const edited = applyVisualModuleEdits(artifact, {
    name: "Relationship Pressure",
    description: "Tracks changing social pressure.",
    author: "",
    tags: ["social"],
    trackingPurpose: "Preserve relationship pressure.",
    prompt: "Track only grounded relationship evidence.",
    outputMode: "gauge",
    defaults: { ...artifact.defaults, inject: true, group: "Cast", maxItems: 8 },
    slotRecommendation: "cast",
    displayModeRecommendation: "card",
    tokenPriorityRecommendation: 8,
    sampleData: { summary: "Tense", pressure: 70 },
    fields,
  });
  assert.equal(ModuleCapsuleArtifactSchema.parse(edited).meta.author, "User");
  assert.equal(edited.visual?.outputMode, "gauge");
});

test("visual theme edits and design tokens produce a valid Theme artifact", () => {
  const artifact = createStarterThemeArtifact();
  const design = {
    ...artifact.design!,
    tokens: { ...artifact.design!.tokens, accent: "#ff66aa" },
    density: "compact" as const,
  };
  const edited = applyVisualThemeEdits(artifact, {
    name: "Rose Ledger",
    description: "A compact rose tracker.",
    author: "User",
    tags: ["rose"],
    manifest: { ...artifact.manifest, slots: ["hero", "main"] },
    design,
  });
  assert.equal(ThemeArtifactSchema.parse(edited).design?.tokens.accent, "#ff66aa");
  assert.match(generateThemeDesignCss(edited.design), /--loom-accent: #ff66aa/);
});

test("design token CSS generation rejects unsafe values and remote assets", () => {
  const theme = createStarterThemeArtifact();
  assert.throws(() => generateThemeDesignCss({
    ...theme.design!,
    tokens: { ...theme.design!.tokens, bg: "url(https://bad.example/image.png)" },
  }), /unsafe CSS value/);
  const css = generateThemeDesignCss(theme.design);
  assert.doesNotMatch(css, /url\s*\(|@import|https?:|javascript:/i);
});

test("old themes and modules without visual metadata remain valid", () => {
  const module = createStarterModuleArtifact();
  const theme = createStarterThemeArtifact();
  const { visual: _visual, ...oldModule } = module;
  const { design: _design, ...oldTheme } = theme;
  assert.equal(ModuleCapsuleArtifactSchema.parse(oldModule).kind, "module");
  assert.equal(ThemeArtifactSchema.parse(oldTheme).kind, "theme");
});

test("Theme runtime applies generated tokens without weakening sandbox or CSP", () => {
  const theme = createStarterThemeArtifact();
  const document = buildThemeDocument(theme, buildViewerModel(null, DEFAULT_SETTINGS), {
    nonce: "phase4",
    developerModeEnabled: false,
  });
  assert.match(document, /--loom-bg/);
  assert.match(document, /connect-src 'none'/);
  assert.doesNotMatch(document, /eval\s*\(|new Function|Function\s*\(/);
});

test("invalid visual edits fail before any save_artifact request can be sent", () => {
  const sent: unknown[] = [];
  const artifact = createStarterModuleArtifact();
  try {
    const edited = applyVisualModuleEdits(artifact, {
      name: "",
      description: "",
      author: "User",
      tags: [],
      trackingPurpose: "",
      prompt: artifact.prompt,
      outputMode: "cards",
      defaults: artifact.defaults,
      slotRecommendation: "main",
      displayModeRecommendation: "card",
      tokenPriorityRecommendation: 5,
      sampleData: {},
      fields,
    });
    sent.push({ type: "save_artifact", artifact: edited });
  } catch {
    // Invalid visual state remains local.
  }
  assert.equal(sent.length, 0);
});
