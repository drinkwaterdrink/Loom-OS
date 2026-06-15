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

export function visualFieldsToJsonSchema(fields: VisualField[]): JsonSchemaSubset {
  const properties: Record<string, JsonSchemaSubset> = {};
  const required: string[] = [];
  for (const field of fields) {
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(field.key)) {
      throw new Error(`Field key "${field.key}" must begin with a letter and use letters, numbers, or underscores.`);
    }
    if (properties[field.key]) throw new Error(`Field key "${field.key}" is duplicated.`);
    let schema: JsonSchemaSubset;
    if (!SIMPLE_TYPES.has(field.type)) {
      schema = semanticSchema(field.type);
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
      if (field.enumOptions.length === 0) throw new Error(`Enum field "${field.label}" needs at least one choice.`);
      schema = { type: "string", enum: field.enumOptions };
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

export function parseJsonSchemaToVisualFields(
  schema: JsonSchemaSubset,
  fieldTypes: Record<string, VisualFieldType> = {},
): ParsedVisualFields {
  if (schema.type !== "object" || !schema.properties) {
    return { mode: "advanced", fields: [], reason: "The root schema is not a visual object schema." };
  }
  const required = new Set(schema.required ?? []);
  const fields: VisualField[] = [];
  for (const [key, property] of Object.entries(schema.properties)) {
    const type = fieldTypes[key] ?? inferFieldType(property);
    if (!type) {
      return {
        mode: "advanced",
        fields: [],
        reason: `Field "${key}" uses a nested or advanced schema that cannot be edited safely as a visual card.`,
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
      author: edits.author || "User",
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
  return ThemeArtifactSchema.parse({
    ...artifact,
    updatedAt: new Date().toISOString(),
    meta: {
      ...artifact.meta,
      name: edits.name,
      description: edits.description,
      author: edits.author || "User",
      tags: edits.tags,
    },
    manifest: edits.manifest,
    design: edits.design,
  });
}
