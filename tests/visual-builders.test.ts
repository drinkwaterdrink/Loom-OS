import assert from "node:assert/strict";
import test from "node:test";
import {
  ModuleCapsuleArtifactSchema,
  ThemeArtifactSchema,
  createStarterModuleArtifact,
  createStarterThemeArtifact,
  validateThemeDesignTokenValue,
} from "../src/shared/artifacts";
import {
  applyVisualModuleEdits,
  applyVisualThemeEdits,
  generateThemeDesignCss,
  parseJsonSchemaToVisualFields,
  parseVisualSampleData,
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

test("visual Field Builder rejects invalid and duplicate keys", () => {
  assert.throws(() => visualFieldsToJsonSchema([
    { ...fields[0]!, key: "1bad" },
  ]), /must begin with a letter/);
  assert.throws(() => visualFieldsToJsonSchema([
    fields[0]!,
    { ...fields[0]!, label: "Duplicate" },
  ]), /duplicated/);
});

test("visual Field Builder rejects empty enums, inverted ranges, and invalid maxItems", () => {
  assert.throws(() => visualFieldsToJsonSchema([
    { ...fields[0]!, type: "enum", enumOptions: [] },
  ]), /at least one choice/);
  assert.throws(() => visualFieldsToJsonSchema([
    { ...fields[1]!, min: 80, max: 20 },
  ]), /Minimum cannot exceed maximum/);
  assert.throws(() => visualFieldsToJsonSchema([
    { ...fields[0]!, type: "list", maxItems: 0 },
  ]), /integer from 1 to 80/);
  assert.throws(() => visualFieldsToJsonSchema([
    { ...fields[0]!, type: "array", maxItems: 81 },
  ]), /integer from 1 to 80/);
});

test("visual Field Builder validates typed defaults", () => {
  assert.throws(() => visualFieldsToJsonSchema([
    { ...fields[1]!, defaultValue: Number.NaN },
  ]), /must be a number/);
  assert.throws(() => visualFieldsToJsonSchema([
    { ...fields[0]!, type: "enum", enumOptions: ["calm"], defaultValue: "tense" },
  ]), /must match one of its enum choices/);
  assert.equal(visualFieldsToJsonSchema([
    { ...fields[0]!, type: "boolean", defaultValue: false },
  ]).properties?.summary?.default, false);
});

test("semantic field metadata round-trips every guided semantic type", () => {
  const semanticTypes = [
    "character-linked",
    "item-linked",
    "timeline-event",
    "relationship-edge",
    "object",
    "array",
  ] as const;
  const semanticFields: VisualField[] = semanticTypes.map((type, index) => ({
    key: `field${index}`,
    label: type,
    type,
    required: index % 2 === 0,
    description: `${type} help`,
    enumOptions: [],
    ...(type === "array" ? { maxItems: 12 } : {}),
  }));
  const parsed = parseJsonSchemaToVisualFields(
    visualFieldsToJsonSchema(semanticFields),
    Object.fromEntries(semanticFields.map((field) => [field.key, field.type])),
  );
  assert.equal(parsed.mode, "visual");
  assert.deepEqual(parsed.fields.map((field) => field.type), semanticTypes);
  assert.equal(parsed.fields.at(-1)?.maxItems, 12);
});

test("stale visual field metadata cannot flatten nested object or array schemas", () => {
  const nestedObject = parseJsonSchemaToVisualFields({
    type: "object",
    properties: {
      profile: {
        type: "object",
        properties: { name: { type: "string", maxLength: 500 } },
        required: ["name"],
        additionalProperties: false,
      },
    },
    additionalProperties: false,
  }, { profile: "object" });
  assert.equal(nestedObject.mode, "advanced");

  const nestedArray = parseJsonSchemaToVisualFields({
    type: "object",
    properties: {
      entries: {
        type: "array",
        items: {
          type: "object",
          properties: { label: { type: "string", maxLength: 500 } },
          additionalProperties: false,
        },
        maxItems: 10,
      },
    },
    additionalProperties: false,
  }, { entries: "array" });
  assert.equal(nestedArray.mode, "advanced");
});

test("required fields missing from properties force safe Advanced mode", () => {
  const parsed = parseJsonSchemaToVisualFields({
    type: "object",
    properties: { summary: { type: "string" } },
    required: ["missing"],
    additionalProperties: false,
  });
  assert.equal(parsed.mode, "advanced");
  assert.match(parsed.reason, /not declared/);
  assert.throws(() => ModuleCapsuleArtifactSchema.parse({
    ...createStarterModuleArtifact(),
    schema: {
      type: "object",
      properties: { summary: { type: "string" } },
      required: ["missing"],
      additionalProperties: false,
    },
  }), /not declared in properties/);
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
  assert.equal(JSON.stringify(edited.schema), JSON.stringify(complex.schema));
});

test("visual module edits produce a valid Module Capsule artifact", () => {
  const artifact = createStarterModuleArtifact();
  const edited = applyVisualModuleEdits(artifact, {
    name: "Relationship Pressure",
    description: "Tracks changing social pressure.",
    author: artifact.meta.author,
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

test("visual module edits preserve imported author, source templates, and capabilities", () => {
  const artifact = ModuleCapsuleArtifactSchema.parse({
    ...createStarterModuleArtifact(),
    meta: { ...createStarterModuleArtifact().meta, author: "" },
    view: {
      html: "<article>{{summary}}</article>",
      css: ".summary { color: red; }",
      javascript: "window.LoomOS.action('copy', 'summary')",
      partials: { row: "<span>{{this}}</span>" },
    },
    capabilities: ["copy"],
  });
  const edited = applyVisualModuleEdits(artifact, {
    name: "Imported Module",
    description: "Still imported.",
    author: artifact.meta.author,
    tags: ["imported"],
    trackingPurpose: "Track imported state.",
    prompt: artifact.prompt,
    outputMode: "template",
    defaults: artifact.defaults,
    slotRecommendation: "main",
    displayModeRecommendation: "card",
    tokenPriorityRecommendation: 5,
    sampleData: artifact.sampleData,
  });
  assert.equal(edited.meta.author, "");
  assert.deepEqual(edited.view, artifact.view);
  assert.deepEqual(edited.capabilities, artifact.capabilities);
});

test("invalid module identity, prompt, and sample JSON remain rejected", () => {
  const artifact = createStarterModuleArtifact();
  const edits = {
    name: artifact.meta.name,
    description: artifact.meta.description,
    author: artifact.meta.author,
    tags: artifact.meta.tags,
    trackingPurpose: artifact.visual?.trackingPurpose ?? "",
    prompt: artifact.prompt,
    outputMode: artifact.visual?.outputMode ?? "cards" as const,
    defaults: artifact.defaults,
    slotRecommendation: artifact.visual?.slotRecommendation ?? "main",
    displayModeRecommendation: artifact.visual?.displayModeRecommendation ?? "card" as const,
    tokenPriorityRecommendation: artifact.visual?.tokenPriorityRecommendation ?? 5,
    sampleData: artifact.sampleData,
  };
  assert.throws(() => applyVisualModuleEdits(artifact, { ...edits, name: "" }), /too small|at least/i);
  assert.throws(() => applyVisualModuleEdits(artifact, { ...edits, prompt: "" }), /too small|at least/i);
  assert.throws(() => parseVisualSampleData("{"), /valid JSON/);
  assert.deepEqual(parseVisualSampleData('{"summary":"ok"}'), { summary: "ok" });
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

test("visual theme edits normalize slots and preserve all source files", () => {
  const artifact = ThemeArtifactSchema.parse({
    ...createStarterThemeArtifact(),
    view: {
      html: "<main>{{meta.title}}</main>",
      css: ".phase41-marker { color: var(--loom-accent); }",
      javascript: "window.LoomOS.action('copy', 'ok')",
      partials: { card: "<article>{{this}}</article>" },
    },
  });
  const edited = applyVisualThemeEdits(artifact, {
    name: artifact.meta.name,
    description: artifact.meta.description,
    author: artifact.meta.author,
    tags: artifact.meta.tags,
    manifest: {
      ...artifact.manifest,
      slots: [" hero ", "main", "hero", "", "main"],
    },
    design: artifact.design!,
  });
  assert.deepEqual(edited.manifest.slots, ["hero", "main"]);
  assert.deepEqual(edited.view, artifact.view);
  const baseEdits = {
    name: artifact.meta.name,
    description: artifact.meta.description,
    author: artifact.meta.author,
    tags: artifact.meta.tags,
    design: artifact.design!,
  };
  assert.throws(() => applyVisualThemeEdits(artifact, {
    ...baseEdits,
    manifest: { ...artifact.manifest, minWidth: 120 },
  }), /greater than or equal to 280/);
  assert.throws(() => applyVisualThemeEdits(artifact, {
    ...baseEdits,
    manifest: {
      ...artifact.manifest,
      capabilities: ["network" as never],
    },
  }), /Invalid enum value/);
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

test("design tokens use strict safe-value allowlists", () => {
  const unsafe = [
    "url(image.png)",
    "@import 'theme.css'",
    "http://bad.example",
    "https://bad.example",
    "javascript:alert(1)",
    "data:image/png;base64,AAAA",
    "expression(alert(1))",
    "var(--outside-color)",
    "var(--loom-unknown)",
    "red; color: blue",
    "red}",
    "<style>",
    "red/*comment*/",
    "red\u0007",
  ];
  for (const value of unsafe) {
    assert.equal(validateThemeDesignTokenValue("accent", value), false, value);
  }
  assert.equal(validateThemeDesignTokenValue("accent", "#1a2b3c"), true);
  assert.equal(validateThemeDesignTokenValue("accent", "#12345"), false);
  assert.equal(validateThemeDesignTokenValue("accent", "#1234567"), false);
  assert.equal(validateThemeDesignTokenValue("accent", "rgba(10, 20, 30, .5)"), true);
  assert.equal(validateThemeDesignTokenValue("accent", "hsl(210 50% 40% / 80%)"), true);
  assert.equal(validateThemeDesignTokenValue("gap", "0.75rem"), true);
  assert.equal(validateThemeDesignTokenValue("fontBody", "\"Segoe UI\", system-ui, sans-serif"), true);
  assert.equal(validateThemeDesignTokenValue("accent", "var(--loom-text)"), true);
});

test("generated design CSS exposes only controlled loom variables and rules", () => {
  const css = generateThemeDesignCss(createStarterThemeArtifact().design);
  const customProperties = [...css.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1]);
  assert.ok(customProperties.length >= 16);
  assert.ok(customProperties.every((property) => property?.startsWith("--loom-")));
  assert.doesNotMatch(css, /@import|@font-face|url\s*\(|https?:|javascript:|data:/i);
  assert.match(css, /^:root \{/);
});

test("old themes and modules without visual metadata remain valid", () => {
  const module = createStarterModuleArtifact();
  const theme = createStarterThemeArtifact();
  const { visual: _visual, ...oldModule } = module;
  const { design: _design, ...oldTheme } = theme;
  assert.equal(ModuleCapsuleArtifactSchema.parse(oldModule).kind, "module");
  assert.equal(ThemeArtifactSchema.parse(oldTheme).kind, "theme");
  const document = buildThemeDocument(oldTheme, buildViewerModel(null, DEFAULT_SETTINGS), {
    nonce: "old-theme",
    developerModeEnabled: false,
  });
  assert.doesNotMatch(document, /--loom-bg/);
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

test("token CSS is prepended before existing Theme CSS and JavaScript remains gated", () => {
  const theme = ThemeArtifactSchema.parse({
    ...createStarterThemeArtifact(),
    manifest: { ...createStarterThemeArtifact().manifest, developerMode: true },
    view: {
      ...createStarterThemeArtifact().view,
      css: ".phase41-marker { color: red; }",
      javascript: "window.phase41Executed = true;",
    },
  });
  const disabled = buildThemeDocument(theme, buildViewerModel(null, DEFAULT_SETTINGS), {
    nonce: "phase41-disabled",
    developerModeEnabled: false,
  });
  assert.ok(disabled.indexOf("--loom-bg") < disabled.indexOf(".phase41-marker"));
  assert.doesNotMatch(disabled, /window\.phase41Executed/);
  const enabled = buildThemeDocument(theme, buildViewerModel(null, DEFAULT_SETTINGS), {
    nonce: "phase41-enabled",
    developerModeEnabled: true,
  });
  assert.match(enabled, /window\.phase41Executed/);
  assert.match(enabled, /connect-src 'none'/);
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
