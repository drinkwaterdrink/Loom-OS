import {
  ModuleCapsuleArtifactSchema,
  ThemeArtifactSchema,
  ThemeDesignSchema,
  type JsonSchemaSubset,
  type ModuleCapsuleArtifact,
  type ThemeArtifact,
  type ThemeDesign,
  type ThemeDesignTokens,
  type VisualFieldType,
} from "./artifacts";

export interface VisualField {
  key: string;
  label: string;
  type: VisualFieldType;
  required: boolean;
  description: string;
  defaultValue?: unknown;
  enumOptions: string[];
  min?: number;
  max?: number;
  maxItems?: number;
}

export interface ParsedVisualFields {
  mode: "visual" | "advanced";
  fields: VisualField[];
  reason: string;
}

const SIMPLE_TYPES = new Set<VisualFieldType>([
  "text", "longText", "number", "integer", "boolean", "enum", "gauge", "chips", "list",
]);
const FIELD_KEY = /^[A-Za-z][A-Za-z0-9_]*$/;
const MAX_VISUAL_ARRAY_ITEMS = 80;

function titleForKey(key: string): string {
  return key.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function semanticSchema(type: VisualFieldType): JsonSchemaSubset {
  if (type === "character-linked") {
    return {
      type: "object",
      properties: {
        characterId: { type: "string", title: "Character ID", maxLength: 160 },
        name: { type: "string", title: "Name", maxLength: 160 },
      },
      required: ["name"],
      additionalProperties: false,
    };
  }
  if (type === "item-linked") {
    return {
      type: "object",
      properties: {
        itemId: { type: "string", title: "Item ID", maxLength: 160 },
        name: { type: "string", title: "Name", maxLength: 160 },
        quantity: { type: "integer", title: "Quantity", minimum: 0 },
        status: { type: "string", title: "Status", maxLength: 240 },
      },
      required: ["name"],
      additionalProperties: false,
    };
  }
  if (type === "timeline-event") {
    return {
      type: "object",
      properties: {
        title: { type: "string", maxLength: 240 },
        time: { type: "string", maxLength: 160 },
        status: { type: "string", maxLength: 160 },
      },
      required: ["title"],
      additionalProperties: false,
    };
  }
  if (type === "relationship-edge") {
    return {
      type: "object",
      properties: {
        target: { type: "string", maxLength: 160 },
        axis: { type: "string", maxLength: 160 },
        value: { type: "number", minimum: -100, maximum: 100 },
      },
      required: ["target", "axis"],
      additionalProperties: false,
    };
  }
  if (type === "object") {
    return { type: "object", properties: {}, required: [], additionalProperties: false };
  }
  return { type: "array", items: { type: "string", maxLength: 500 }, maxItems: 24 };
}

function validateFieldDefault(field: VisualField): void {
  if (field.defaultValue === undefined) return;
  const value = field.defaultValue;
  if (
    (field.type === "number" || field.type === "gauge")
    && (typeof value !== "number" || !Number.isFinite(value))
  ) {
    throw new Error(`Default for "${field.label}" must be a number.`);
  }
  if (field.type === "integer" && (!Number.isInteger(value))) {
    throw new Error(`Default for "${field.label}" must be an integer.`);
  }
  if (field.type === "boolean" && typeof value !== "boolean") {
    throw new Error(`Default for "${field.label}" must be true or false.`);
  }
  if (field.type === "enum" && !field.enumOptions.includes(String(value))) {
    throw new Error(`Default for "${field.label}" must match one of its enum choices.`);
  }
  if ((field.type === "chips" || field.type === "list" || field.type === "array") && !Array.isArray(value)) {
    throw new Error(`Default for "${field.label}" must be a JSON array.`);
  }
  if (
    ["object", "character-linked", "item-linked", "timeline-event", "relationship-edge"].includes(field.type)
    && (typeof value !== "object" || value === null || Array.isArray(value))
  ) {
    throw new Error(`Default for "${field.label}" must be a JSON object.`);
  }
}

export function visualFieldsToJsonSchema(fields: VisualField[]): JsonSchemaSubset {
  const properties: Record<string, JsonSchemaSubset> = {};
  const required: string[] = [];
  for (const field of fields) {
    if (!FIELD_KEY.test(field.key)) {
      throw new Error(`Field key "${field.key}" must begin with a letter and use letters, numbers, or underscores.`);
    }
    if (properties[field.key]) throw new Error(`Field key "${field.key}" is duplicated.`);
    if (
      field.min !== undefined
      && field.max !== undefined
      && field.min > field.max
    ) {
      throw new Error(`Minimum cannot exceed maximum for field "${field.label}".`);
    }
    if (
      (field.type === "chips" || field.type === "list" || field.type === "array")
      && field.maxItems !== undefined
      && (!Number.isInteger(field.maxItems) || field.maxItems < 1 || field.maxItems > MAX_VISUAL_ARRAY_ITEMS)
    ) {
      throw new Error(`Max items for "${field.label}" must be an integer from 1 to ${MAX_VISUAL_ARRAY_ITEMS}.`);
    }
    validateFieldDefault(field);
    let schema: JsonSchemaSubset;
    if (!SIMPLE_TYPES.has(field.type)) {
      schema = semanticSchema(field.type);
      if (field.type === "array" && field.maxItems !== undefined) {
        schema = { ...schema, maxItems: field.maxItems };
      }
    } else if (field.type === "number" || field.type === "integer" || field.type === "gauge") {
      schema = {
        type: field.type === "integer" ? "integer" : "number",
        ...(field.type === "gauge" ? { minimum: field.min ?? 0, maximum: field.max ?? 100 } : {}),
        ...(field.min !== undefined ? { minimum: field.min } : {}),
        ...(field.max !== undefined ? { maximum: field.max } : {}),
      };
    } else if (field.type === "boolean") {
      schema = { type: "boolean" };
    } else if (field.type === "enum") {
      const choices = [...new Set(field.enumOptions.map((choice) => choice.trim()).filter(Boolean))];
      if (choices.length === 0) throw new Error(`Enum field "${field.label}" needs at least one choice.`);
      schema = { type: "string", enum: choices };
    } else if (field.type === "chips" || field.type === "list") {
      schema = { type: "array", items: { type: "string", maxLength: 500 }, maxItems: field.maxItems ?? 24 };
    } else {
      schema = { type: "string", maxLength: field.type === "longText" ? 4000 : 500 };
    }
    properties[field.key] = {
      ...schema,
      title: field.label || titleForKey(field.key),
      description: field.description,
      ...(field.defaultValue !== undefined ? { default: field.defaultValue } : {}),
    };
    if (field.required) required.push(field.key);
  }
  return { type: "object", properties, required, additionalProperties: false };
}

function inferFieldType(schema: JsonSchemaSubset): VisualFieldType | null {
  if (schema.enum?.length) return "enum";
  if (schema.type === "boolean") return "boolean";
  if (schema.type === "integer") return "integer";
  if (schema.type === "number") return schema.minimum === 0 && schema.maximum === 100 ? "gauge" : "number";
  if (schema.type === "string") return (schema.maxLength ?? 0) > 500 ? "longText" : "text";
  if (schema.type === "array" && schema.items?.type === "string") return "list";
  if (schema.type === "object" && Object.keys(schema.properties ?? {}).length === 0) return "object";
  return null;
}

function stableShape(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableShape).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableShape(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}

function fieldTypeMatchesSchema(type: VisualFieldType, schema: JsonSchemaSubset): boolean {
  const { title: _title, description: _description, default: _default, ...shape } = schema;
  let expected: JsonSchemaSubset;
  if (type === "text") expected = { type: "string", maxLength: 500 };
  else if (type === "longText") expected = { type: "string", maxLength: 4000 };
  else if (type === "enum") {
    if (!schema.enum?.length) return false;
    expected = { type: "string", enum: schema.enum };
  }
  else if (type === "number" || type === "integer" || type === "gauge") {
    expected = {
      type: type === "integer" ? "integer" : "number",
      ...(schema.minimum !== undefined ? { minimum: schema.minimum } : {}),
      ...(schema.maximum !== undefined ? { maximum: schema.maximum } : {}),
    };
    if (type === "gauge" && (schema.minimum === undefined || schema.maximum === undefined)) return false;
  } else if (type === "boolean") expected = { type: "boolean" };
  else if (type === "chips" || type === "list" || type === "array") {
    if (schema.maxItems === undefined) return false;
    expected = {
      type: "array",
      items: { type: "string", maxLength: 500 },
      maxItems: schema.maxItems,
    };
  } else {
    expected = semanticSchema(type);
  }
  return stableShape(shape) === stableShape(expected);
}

export function parseJsonSchemaToVisualFields(
  schema: JsonSchemaSubset,
  fieldTypes: Record<string, VisualFieldType> = {},
): ParsedVisualFields {
  if (schema.type !== "object" || !schema.properties) {
    return { mode: "advanced", fields: [], reason: "The root schema is not a visual object schema." };
  }
  const required = new Set(schema.required ?? []);
  const propertyKeys = new Set(Object.keys(schema.properties));
  for (const key of required) {
    if (!propertyKeys.has(key)) {
      return {
        mode: "advanced",
        fields: [],
        reason: `Required field "${key}" is not declared in schema properties.`,
      };
    }
  }
  const fields: VisualField[] = [];
  for (const [key, property] of Object.entries(schema.properties)) {
    const type = fieldTypes[key] ?? inferFieldType(property);
    if (!type || !fieldTypeMatchesSchema(type, property)) {
      return {
        mode: "advanced",
        fields: [],
        reason: `Field "${key}" uses a nested, mismatched, or advanced schema that cannot be edited safely as a visual card.`,
      };
    }
    fields.push({
      key,
      label: property.title || titleForKey(key),
      type,
      required: required.has(key),
      description: property.description ?? "",
      defaultValue: property.default,
      enumOptions: (property.enum ?? []).map(String),
      min: property.minimum,
      max: property.maximum,
      maxItems: property.maxItems,
    });
  }
  return { mode: "visual", fields, reason: "" };
}

export interface VisualModuleEdits {
  name: string;
  description: string;
  author: string;
  tags: string[];
  trackingPurpose: string;
  prompt: string;
  outputMode: NonNullable<ModuleCapsuleArtifact["visual"]>["outputMode"];
  defaults: ModuleCapsuleArtifact["defaults"];
  slotRecommendation: string;
  displayModeRecommendation: NonNullable<ModuleCapsuleArtifact["visual"]>["displayModeRecommendation"];
  tokenPriorityRecommendation: number;
  sampleData: unknown;
  fields?: VisualField[];
}

export function parseVisualSampleData(raw: string): unknown {
  try {
    return JSON.parse(raw || "{}");
  } catch {
    throw new Error("Sample data must be valid JSON.");
  }
}

export function applyVisualModuleEdits(
  artifact: ModuleCapsuleArtifact,
  edits: VisualModuleEdits,
): ModuleCapsuleArtifact {
  return ModuleCapsuleArtifactSchema.parse({
    ...artifact,
    updatedAt: new Date().toISOString(),
    meta: {
      ...artifact.meta,
      name: edits.name,
      description: edits.description,
      author: edits.author,
      tags: edits.tags,
    },
    prompt: edits.prompt,
    schema: edits.fields ? visualFieldsToJsonSchema(edits.fields) : artifact.schema,
    sampleData: edits.sampleData,
    defaults: edits.defaults,
    visual: {
      trackingPurpose: edits.trackingPurpose,
      outputMode: edits.outputMode,
      slotRecommendation: edits.slotRecommendation,
      displayModeRecommendation: edits.displayModeRecommendation,
      tokenPriorityRecommendation: edits.tokenPriorityRecommendation,
      fieldTypes: edits.fields
        ? Object.fromEntries(edits.fields.map((field) => [field.key, field.type]))
        : artifact.visual?.fieldTypes ?? {},
    },
  });
}

const TOKEN_NAMES: Record<keyof ThemeDesignTokens, string> = {
  bg: "--loom-bg",
  panel: "--loom-panel",
  card: "--loom-card",
  text: "--loom-text",
  muted: "--loom-muted",
  accent: "--loom-accent",
  danger: "--loom-danger",
  warning: "--loom-warning",
  success: "--loom-success",
  border: "--loom-border",
  radiusSm: "--loom-radius-sm",
  radiusMd: "--loom-radius-md",
  radiusLg: "--loom-radius-lg",
  gap: "--loom-gap",
  fontDisplay: "--loom-font-display",
  fontBody: "--loom-font-body",
};

export function generateThemeDesignCss(designInput: ThemeDesign | undefined): string {
  if (!designInput) return "";
  const design = ThemeDesignSchema.parse(designInput);
  const declarations = Object.entries(design.tokens).map(([key, value]) =>
    `  ${TOKEN_NAMES[key as keyof ThemeDesignTokens]}: ${value};`
  ).join("\n");
  const density = design.density === "compact" ? ".75" : design.density === "spacious" ? "1.25" : "1";
  const background = design.backgroundStyle === "soft-gradient"
    ? "linear-gradient(145deg, var(--loom-bg), var(--loom-panel))"
    : design.backgroundStyle === "layered"
    ? "linear-gradient(180deg, var(--loom-panel), var(--loom-bg) 38%)"
    : "var(--loom-bg)";
  const shadow = design.panelStyle === "raised"
    ? "0 10px 30px rgba(0,0,0,.22)"
    : design.panelStyle === "glass"
    ? "0 8px 24px rgba(0,0,0,.16)"
    : "none";
  const border = design.borderStyle === "none"
    ? "transparent"
    : design.borderStyle === "strong"
    ? "var(--loom-accent)"
    : "var(--loom-border)";
  const headerBorder = design.headerStyle === "accent-line" ? "3px solid var(--loom-accent)" : "0";
  const widgetBorder = design.widgetStyle === "minimal" ? "transparent" : border;
  return `:root {\n${declarations}\n}
body { background: ${background}; color: var(--loom-text); font-family: var(--loom-font-body); }
h1, h2, h3, strong { font-family: var(--loom-font-display); }
.tracker { gap: calc(var(--loom-gap) * ${density}); }
.tracker > header { border-left: ${headerBorder}; }
.tracker section, .tracker article, .summary {
  background: var(--loom-card);
  border-color: ${widgetBorder};
  border-radius: var(--loom-radius-md);
  box-shadow: ${shadow};
}`;
}

export interface VisualThemeEdits {
  name: string;
  description: string;
  author: string;
  tags: string[];
  manifest: ThemeArtifact["manifest"];
  design: ThemeDesign;
}

export function applyVisualThemeEdits(
  artifact: ThemeArtifact,
  edits: VisualThemeEdits,
): ThemeArtifact {
  const slots = edits.manifest.slots
    ? [...new Set(edits.manifest.slots.map((slot) => slot.trim()).filter(Boolean))]
    : undefined;
  return ThemeArtifactSchema.parse({
    ...artifact,
    updatedAt: new Date().toISOString(),
    meta: {
      ...artifact.meta,
      name: edits.name,
      description: edits.description,
      author: edits.author,
      tags: edits.tags,
    },
    manifest: {
      ...edits.manifest,
      ...(slots ? { slots } : {}),
    },
    design: edits.design,
  });
}
