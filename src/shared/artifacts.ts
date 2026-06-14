import { z } from "zod";
import { parseModuleBundle } from "./moduleBundles";
import { CustomModuleSchema } from "./schemas";
import type { CustomModule } from "./types";

export const ARTIFACT_FORMAT = "loomos-artifact" as const;
export const ARTIFACT_VERSION = 2 as const;
export const VIEWER_MODEL_VERSION = 1 as const;
export const ARTIFACT_LIBRARY_PATH = "artifacts/library-v2.json";
export const ARTIFACT_REVISION_LIMIT = 20;

const ArtifactIdSchema = z.string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[A-Za-z][A-Za-z0-9_-]*$/);

const ArtifactMetaSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(1200).default(""),
  author: z.string().trim().max(160).default(""),
  tags: z.array(z.string().trim().min(1).max(80)).max(24).default([]),
}).strict();

export type JsonSchemaPrimitiveType =
  | "object"
  | "array"
  | "string"
  | "number"
  | "integer"
  | "boolean";

export interface JsonSchemaSubset {
  type: JsonSchemaPrimitiveType;
  title?: string;
  description?: string;
  default?: unknown;
  enum?: Array<string | number | boolean>;
  properties?: Record<string, JsonSchemaSubset>;
  required?: string[];
  additionalProperties?: boolean;
  items?: JsonSchemaSubset;
  minItems?: number;
  maxItems?: number;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
}

export interface ArtifactDiagnostic {
  path: string;
  message: string;
}

const SUPPORTED_SCHEMA_KEYS = new Set([
  "type",
  "title",
  "description",
  "default",
  "enum",
  "properties",
  "required",
  "additionalProperties",
  "items",
  "minItems",
  "maxItems",
  "minLength",
  "maxLength",
  "minimum",
  "maximum",
]);

const SUPPORTED_SCHEMA_TYPES = new Set<JsonSchemaPrimitiveType>([
  "object",
  "array",
  "string",
  "number",
  "integer",
  "boolean",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function validateFiniteNumber(
  value: unknown,
  path: string,
  diagnostics: ArtifactDiagnostic[],
  integer = false,
): void {
  if (
    typeof value !== "number"
    || !Number.isFinite(value)
    || (integer && !Number.isInteger(value))
  ) {
    diagnostics.push({ path, message: integer ? "Expected an integer." : "Expected a finite number." });
  }
}

function validateSchemaNode(
  value: unknown,
  path: string,
  depth: number,
  diagnostics: ArtifactDiagnostic[],
): void {
  if (depth > 12) {
    diagnostics.push({ path, message: "Schema nesting cannot exceed 12 levels." });
    return;
  }
  if (!isRecord(value)) {
    diagnostics.push({ path, message: "Expected a schema object." });
    return;
  }

  for (const key of Object.keys(value)) {
    if (!SUPPORTED_SCHEMA_KEYS.has(key)) {
      diagnostics.push({ path: `${path}.${key}`, message: `Unsupported JSON Schema keyword "${key}".` });
    }
  }

  const type = value.type;
  if (typeof type !== "string" || !SUPPORTED_SCHEMA_TYPES.has(type as JsonSchemaPrimitiveType)) {
    diagnostics.push({
      path: `${path}.type`,
      message: "Type must be object, array, string, number, integer, or boolean.",
    });
    return;
  }

  if (value.title !== undefined && typeof value.title !== "string") {
    diagnostics.push({ path: `${path}.title`, message: "Title must be a string." });
  }
  if (value.description !== undefined && typeof value.description !== "string") {
    diagnostics.push({ path: `${path}.description`, message: "Description must be a string." });
  }
  if (value.enum !== undefined) {
    if (
      !Array.isArray(value.enum)
      || value.enum.length === 0
      || value.enum.length > 80
      || value.enum.some((item) => !["string", "number", "boolean"].includes(typeof item))
    ) {
      diagnostics.push({
        path: `${path}.enum`,
        message: "Enum must contain 1-80 string, number, or boolean values.",
      });
    }
  }

  for (const key of ["minItems", "maxItems", "minLength", "maxLength"] as const) {
    if (value[key] !== undefined) validateFiniteNumber(value[key], `${path}.${key}`, diagnostics, true);
  }
  for (const key of ["minimum", "maximum"] as const) {
    if (value[key] !== undefined) validateFiniteNumber(value[key], `${path}.${key}`, diagnostics);
  }

  if (
    typeof value.minItems === "number"
    && typeof value.maxItems === "number"
    && value.minItems > value.maxItems
  ) {
    diagnostics.push({ path, message: "minItems cannot exceed maxItems." });
  }
  if (
    typeof value.minLength === "number"
    && typeof value.maxLength === "number"
    && value.minLength > value.maxLength
  ) {
    diagnostics.push({ path, message: "minLength cannot exceed maxLength." });
  }
  if (
    typeof value.minimum === "number"
    && typeof value.maximum === "number"
    && value.minimum > value.maximum
  ) {
    diagnostics.push({ path, message: "minimum cannot exceed maximum." });
  }

  if (type === "object") {
    if (!isRecord(value.properties)) {
      diagnostics.push({ path: `${path}.properties`, message: "Object schemas require properties." });
      return;
    }
    const propertyEntries = Object.entries(value.properties);
    if (propertyEntries.length > 120) {
      diagnostics.push({ path: `${path}.properties`, message: "An object may define at most 120 properties." });
    }
    for (const [key, child] of propertyEntries) {
      if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(key)) {
        diagnostics.push({
          path: `${path}.properties.${key}`,
          message: "Property names must begin with a letter and use only letters, numbers, or underscores.",
        });
      }
      validateSchemaNode(child, `${path}.properties.${key}`, depth + 1, diagnostics);
    }
    if (value.required !== undefined) {
      if (
        !Array.isArray(value.required)
        || value.required.some((item) => typeof item !== "string")
      ) {
        diagnostics.push({ path: `${path}.required`, message: "required must be an array of property names." });
      } else {
        for (const key of value.required) {
          if (!(key in value.properties)) {
            diagnostics.push({
              path: `${path}.required`,
              message: `Required property "${key}" is not declared in properties.`,
            });
          }
        }
      }
    }
    if (
      value.additionalProperties !== undefined
      && typeof value.additionalProperties !== "boolean"
    ) {
      diagnostics.push({
        path: `${path}.additionalProperties`,
        message: "additionalProperties must be true or false.",
      });
    }
  }

  if (type === "array") {
    if (value.items === undefined) {
      diagnostics.push({ path: `${path}.items`, message: "Array schemas require an items schema." });
    } else {
      validateSchemaNode(value.items, `${path}.items`, depth + 1, diagnostics);
    }
  }
}

export function validateJsonSchemaSubset(value: unknown): ArtifactDiagnostic[] {
  const diagnostics: ArtifactDiagnostic[] = [];
  validateSchemaNode(value, "schema", 0, diagnostics);
  return diagnostics;
}

const JsonSchemaSubsetSchema = z.unknown().superRefine((value, context) => {
  for (const diagnostic of validateJsonSchemaSubset(value)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: `${diagnostic.path}: ${diagnostic.message}`,
    });
  }
}).transform((value) => value as JsonSchemaSubset);

export const ThemeCapabilitySchema = z.enum([
  "copy",
  "collapse",
  "navigation",
  "reload",
  "generation",
  "history",
]);

const ArtifactViewSchema = z.object({
  html: z.string().max(120_000).default(""),
  css: z.string().max(120_000).default(""),
  javascript: z.string().max(80_000).default(""),
  partials: z.record(z.string().max(40_000)).default({}),
}).strict();

const ArtifactBaseSchema = z.object({
  format: z.literal(ARTIFACT_FORMAT),
  version: z.literal(ARTIFACT_VERSION),
  id: ArtifactIdSchema,
  createdAt: z.string().datetime().default(() => new Date().toISOString()),
  updatedAt: z.string().datetime().default(() => new Date().toISOString()),
  meta: ArtifactMetaSchema,
}).strict();

export const ModuleCapsuleArtifactSchema = ArtifactBaseSchema.extend({
  kind: z.literal("module"),
  schema: JsonSchemaSubsetSchema,
  prompt: z.string().trim().min(1).max(24_000),
  view: ArtifactViewSchema,
  sampleData: z.unknown().default({}),
  defaults: z.object({
    track: z.boolean().default(true),
    display: z.boolean().default(true),
    inject: z.boolean().default(false),
    group: z.string().trim().min(1).max(160).default("Custom"),
    maxItems: z.number().int().min(1).max(80).default(12),
    intensity: z.enum(["light", "medium", "heavy", "experimental"]).default("medium"),
    displayOrder: z.number().int().default(10_000),
  }).strict().default({}),
  capabilities: z.array(ThemeCapabilitySchema).max(8).default([]),
}).strict();

export const ThemeArtifactSchema = ArtifactBaseSchema.extend({
  kind: z.literal("theme"),
  manifest: z.object({
    viewerModelVersion: z.literal(VIEWER_MODEL_VERSION),
    developerMode: z.boolean().default(false),
    capabilities: z.array(ThemeCapabilitySchema).max(8).default([]),
    minWidth: z.number().int().min(280).max(2400).default(320),
    preferredColorScheme: z.enum(["auto", "dark", "light"]).default("auto"),
  }).strict(),
  view: ArtifactViewSchema,
  sampleData: z.unknown().default({}),
}).strict();

export const BlueprintArtifactSchema = ArtifactBaseSchema.extend({
  kind: z.literal("blueprint"),
  modules: z.array(ModuleCapsuleArtifactSchema).max(80).default([]),
  theme: ThemeArtifactSchema.nullable().default(null),
  settings: z.object({
    injectionEnabled: z.boolean().optional(),
    injectionTokenBudget: z.number().int().min(80).max(10_000).optional(),
    compilerSeedTokenBudget: z.number().int().min(200).max(10_000).optional(),
    historyRetentionLimit: z.number().int().min(1).max(1000).optional(),
    developerMode: z.boolean().optional(),
  }).strict().default({}),
}).strict();

export const LoomOSArtifactSchema = z.discriminatedUnion("kind", [
  ModuleCapsuleArtifactSchema,
  ThemeArtifactSchema,
  BlueprintArtifactSchema,
]);

export type ModuleCapsuleArtifact = z.infer<typeof ModuleCapsuleArtifactSchema>;
export type ThemeArtifact = z.infer<typeof ThemeArtifactSchema>;
export type BlueprintArtifact = z.infer<typeof BlueprintArtifactSchema>;
export type LoomOSArtifact = z.infer<typeof LoomOSArtifactSchema>;
export type ThemeCapability = z.infer<typeof ThemeCapabilitySchema>;

export const ArtifactRevisionSchema = z.object({
  revision: z.number().int().positive(),
  savedAt: z.string().datetime(),
  artifact: LoomOSArtifactSchema,
}).strict();

export const ArtifactRecordSchema = z.object({
  artifact: LoomOSArtifactSchema,
  revision: z.number().int().positive(),
  revisions: z.array(ArtifactRevisionSchema).max(ARTIFACT_REVISION_LIMIT),
}).strict();

export const ArtifactLibrarySchema = z.object({
  format: z.literal("loomos-artifact-library"),
  version: z.literal(2),
  records: z.array(ArtifactRecordSchema).max(240).default([]),
}).strict();

export type ArtifactRevision = z.infer<typeof ArtifactRevisionSchema>;
export type ArtifactRecord = z.infer<typeof ArtifactRecordSchema>;
export type ArtifactLibrary = z.infer<typeof ArtifactLibrarySchema>;

export const EMPTY_ARTIFACT_LIBRARY: ArtifactLibrary = {
  format: "loomos-artifact-library",
  version: 2,
  records: [],
};

function slug(value: string): string {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return normalized || "artifact";
}

function moduleFieldsToJsonSchema(module: CustomModule): JsonSchemaSubset {
  const properties: Record<string, JsonSchemaSubset> = {};
  const required: string[] = [];
  for (const field of module.schemaFields) {
    let schema: JsonSchemaSubset;
    if (field.type === "number" || field.type === "gauge") {
      schema = {
        type: "number",
        ...(field.min !== undefined ? { minimum: field.min } : {}),
        ...(field.max !== undefined ? { maximum: field.max } : {}),
      };
    } else if (field.type === "boolean") {
      schema = { type: "boolean" };
    } else if (field.type === "enum") {
      schema = { type: "string", enum: field.enumOptions };
    } else if (field.type === "chips" || field.type === "list") {
      schema = {
        type: "array",
        items: { type: "string" },
        maxItems: field.maxItems ?? 24,
      };
    } else {
      schema = {
        type: "string",
        maxLength: field.type === "longText" ? 1600 : 500,
      };
    }
    properties[field.key] = {
      ...schema,
      title: field.label,
      description: field.description,
      ...(field.defaultValue !== undefined ? { default: field.defaultValue } : {}),
    };
    if (field.required) required.push(field.key);
  }
  return {
    type: "object",
    properties,
    required,
    additionalProperties: false,
  };
}

function legacyModuleToArtifact(module: CustomModule): ModuleCapsuleArtifact {
  const now = new Date().toISOString();
  return ModuleCapsuleArtifactSchema.parse({
    format: ARTIFACT_FORMAT,
    version: ARTIFACT_VERSION,
    kind: "module",
    id: module.id,
    createdAt: now,
    updatedAt: now,
    meta: {
      name: module.label,
      description: module.description,
      tags: ["legacy-v1"],
    },
    schema: moduleFieldsToJsonSchema(module),
    prompt: module.compilerInstruction,
    view: {
      html: module.htmlTemplate,
      css: module.cssTemplate,
      javascript: "",
      partials: {},
    },
    sampleData: {},
    defaults: {
      track: module.enabled,
      display: module.display,
      inject: module.inject,
      group: module.group,
      maxItems: module.maxItems,
      intensity: module.intensity,
      displayOrder: module.displayOrder ?? 10_000,
    },
  });
}

function normalizeArtifactEnvelope(value: unknown): unknown {
  if (!isRecord(value)) return value;
  if (value.format !== ARTIFACT_FORMAT || value.version !== ARTIFACT_VERSION) return value;
  const meta = isRecord(value.meta) ? value.meta : {};
  const kind = typeof value.kind === "string" ? value.kind : "artifact";
  const name = typeof meta.name === "string" && meta.name.trim()
    ? meta.name.trim()
    : `${kind[0]?.toUpperCase() ?? ""}${kind.slice(1)} Artifact`;
  const id = typeof value.id === "string" && value.id.trim()
    ? value.id
    : `${slug(name)}_${Math.random().toString(36).slice(2, 8)}`;
  return {
    ...value,
    id,
    meta: {
      name,
      description: "",
      author: "",
      tags: [],
      ...meta,
    },
  };
}

export function extractJsonText(raw: string): unknown {
  const trimmed = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  const first = trimmed.indexOf("{");
  const last = trimmed.lastIndexOf("}");
  if (first < 0 || last <= first) {
    throw new Error("The input does not contain a JSON object.");
  }
  return JSON.parse(trimmed.slice(first, last + 1));
}

export function parseLoomOSArtifact(value: unknown): LoomOSArtifact {
  const current = LoomOSArtifactSchema.safeParse(normalizeArtifactEnvelope(value));
  if (current.success) return current.data;

  try {
    const legacy = parseModuleBundle(value);
    if (legacy.kind === "custom") return legacyModuleToArtifact(legacy.module);
    const now = new Date().toISOString();
    return ModuleCapsuleArtifactSchema.parse({
      format: ARTIFACT_FORMAT,
      version: ARTIFACT_VERSION,
      kind: "module",
      id: `stock_${legacy.key}`,
      createdAt: now,
      updatedAt: now,
      meta: {
        name: legacy.override.label || legacy.key,
        description: legacy.override.description || `Migrated stock module ${legacy.key}.`,
        tags: ["legacy-v1", "stock-module"],
      },
      schema: {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: true,
      },
      prompt: legacy.override.compilerInstructionOverride
        || legacy.override.compilerGuidanceAddendum
        || `Track the ${legacy.key} module using grounded transcript evidence.`,
      view: {
        html: legacy.override.htmlTemplate || "",
        css: legacy.override.cssTemplate || "",
        javascript: "",
        partials: {},
      },
      sampleData: {},
      defaults: {
        track: legacy.control.track,
        display: legacy.control.display,
        inject: legacy.control.inject,
        group: legacy.override.group || "Migrated Stock",
      },
    });
  } catch {
    throw new Error(
      current.error.issues
        .map((issue) => `${issue.path.join(".") || "artifact"}: ${issue.message}`)
        .join("\n"),
    );
  }
}

export function parseLoomOSArtifactText(raw: string): LoomOSArtifact {
  return parseLoomOSArtifact(extractJsonText(raw));
}

function fieldTypeForSchema(schema: JsonSchemaSubset): CustomModule["schemaFields"][number]["type"] {
  if (schema.type === "boolean") return "boolean";
  if (schema.enum?.length) return "enum";
  if (schema.type === "number" || schema.type === "integer") return "number";
  if (schema.type === "array") return "list";
  if (schema.type === "string" && (schema.maxLength ?? 0) > 500) return "longText";
  return "text";
}

export function artifactToCustomModule(artifact: ModuleCapsuleArtifact): CustomModule {
  const properties = artifact.schema.type === "object"
    ? artifact.schema.properties ?? {}
    : { value: artifact.schema };
  const required = new Set(artifact.schema.required ?? []);
  const schemaFields = Object.entries(properties).slice(0, 40).map(([key, schema], index) => ({
    id: `field_${slug(key)}_${index}`,
    label: schema.title || key.replace(/[_-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    key: key.replace(/-/g, "_"),
    type: fieldTypeForSchema(schema),
    required: required.has(key),
    description: schema.description || "",
    defaultValue: schema.default,
    enumOptions: (schema.enum ?? []).map(String),
    maxItems: schema.maxItems,
    min: schema.minimum,
    max: schema.maximum,
    displayHint: schema.type,
  }));
  return CustomModuleSchema.parse({
    id: artifact.id,
    artifactId: artifact.id,
    label: artifact.meta.name,
    group: artifact.defaults.group,
    description: artifact.meta.description,
    enabled: artifact.defaults.track,
    display: artifact.defaults.display,
    inject: artifact.defaults.inject,
    compilerInstruction: artifact.prompt,
    outputMode: artifact.view.html ? "template" : "cards",
    maxItems: artifact.defaults.maxItems,
    intensity: artifact.defaults.intensity,
    displayOrder: artifact.defaults.displayOrder,
    schemaFields,
    jsonSchema: artifact.schema,
    sampleData: artifact.sampleData,
    htmlTemplate: artifact.view.html,
    cssTemplate: artifact.view.css,
    javascriptTemplate: artifact.view.javascript,
    templateEngine: "mustache-lite",
    allowHtmlTemplate: Boolean(artifact.view.html),
    capabilities: artifact.capabilities,
  });
}

export function createStarterModuleArtifact(): ModuleCapsuleArtifact {
  const now = new Date().toISOString();
  return ModuleCapsuleArtifactSchema.parse({
    format: ARTIFACT_FORMAT,
    version: ARTIFACT_VERSION,
    kind: "module",
    id: `module_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: now,
    updatedAt: now,
    meta: {
      name: "New Tracker Module",
      description: "A portable LoomOS tracker module.",
      tags: [],
    },
    schema: {
      type: "object",
      properties: {
        summary: {
          type: "string",
          title: "Summary",
          description: "A grounded summary of the tracked state.",
          maxLength: 1200,
        },
      },
      required: ["summary"],
      additionalProperties: false,
    },
    prompt: "Track only grounded transcript evidence. Carry stable facts forward and use empty values when evidence is absent.",
    view: {
      html: `<section class="capsule">
  <h2>{{meta.name}}</h2>
  <p>{{data.summary}}</p>
</section>`,
      css: `.capsule {
  border: 1px solid var(--loom-border, #3a3b43);
  border-radius: 8px;
  padding: 12px;
}`,
      javascript: "",
      partials: {},
    },
    sampleData: { summary: "Sample tracked state." },
    defaults: {},
  });
}

export function createStarterThemeArtifact(): ThemeArtifact {
  const now = new Date().toISOString();
  return ThemeArtifactSchema.parse({
    format: ARTIFACT_FORMAT,
    version: ARTIFACT_VERSION,
    kind: "theme",
    id: `theme_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: now,
    updatedAt: now,
    meta: {
      name: "New Tracker Theme",
      description: "A full-screen LoomOS tracker theme.",
      tags: [],
    },
    manifest: {
      viewerModelVersion: VIEWER_MODEL_VERSION,
      developerMode: false,
      capabilities: ["copy", "collapse", "navigation"],
    },
    view: {
      html: `<main class="tracker">
  <header>
    <span class="eyebrow">Current scene</span>
    <h1>{{kernel.scene}}</h1>
    <p>{{kernel.location}} · {{kernel.timeframe}}</p>
  </header>
  <section class="summary">
    <h2>{{kernel.currentFocus}}</h2>
    <p>{{kernel.summary}}</p>
  </section>
  <section>
    <h2>Cast</h2>
    <div class="cast-grid">
      {{#each cast}}
      <article>
        <strong>{{name}}</strong>
        <span>{{role}}</span>
        <p>{{status}}</p>
      </article>
      {{/each}}
    </div>
  </section>
</main>`,
      css: `:root {
  color-scheme: dark;
  font-family: Inter, system-ui, sans-serif;
}
body {
  margin: 0;
  background: #101114;
  color: #f4f4f5;
}
.tracker {
  display: grid;
  gap: 14px;
  padding: 16px;
}
header {
  border-left: 3px solid #5eead4;
  padding-left: 12px;
}
h1, h2, p {
  margin: 0;
}
.eyebrow {
  color: #5eead4;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
}
.summary, article {
  border: 1px solid #303239;
  border-radius: 8px;
  padding: 12px;
}
.cast-grid {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}`,
      javascript: "",
      partials: {},
    },
    sampleData: {},
  });
}

export function createStarterBlueprintArtifact(): BlueprintArtifact {
  const now = new Date().toISOString();
  return BlueprintArtifactSchema.parse({
    format: ARTIFACT_FORMAT,
    version: ARTIFACT_VERSION,
    kind: "blueprint",
    id: `blueprint_${Math.random().toString(36).slice(2, 9)}`,
    createdAt: now,
    updatedAt: now,
    meta: {
      name: "New Tracker Blueprint",
      description: "A complete LoomOS module and theme package.",
      tags: [],
    },
    modules: [],
    theme: null,
    settings: {},
  });
}

export function upsertArtifactRecord(
  library: ArtifactLibrary,
  artifact: LoomOSArtifact,
): { library: ArtifactLibrary; record: ArtifactRecord } {
  const parsedArtifact = LoomOSArtifactSchema.parse({
    ...artifact,
    updatedAt: new Date().toISOString(),
  });
  const previous = library.records.find((record) => record.artifact.id === parsedArtifact.id);
  const nextRevision = (previous?.revision ?? 0) + 1;
  const revision: ArtifactRevision = {
    revision: nextRevision,
    savedAt: new Date().toISOString(),
    artifact: parsedArtifact,
  };
  const record: ArtifactRecord = {
    artifact: parsedArtifact,
    revision: nextRevision,
    revisions: [...(previous?.revisions ?? []), revision].slice(-ARTIFACT_REVISION_LIMIT),
  };
  return {
    library: ArtifactLibrarySchema.parse({
      ...library,
      records: [
        ...library.records.filter((candidate) => candidate.artifact.id !== parsedArtifact.id),
        record,
      ].sort((a, b) => b.artifact.updatedAt.localeCompare(a.artifact.updatedAt)),
    }),
    record,
  };
}

export function restoreArtifactRecord(
  library: ArtifactLibrary,
  artifactId: string,
  revision: number,
): { library: ArtifactLibrary; record: ArtifactRecord } {
  const existing = library.records.find((record) => record.artifact.id === artifactId);
  const snapshot = existing?.revisions.find((candidate) => candidate.revision === revision);
  if (!existing || !snapshot) throw new Error("That artifact revision no longer exists.");
  return upsertArtifactRecord(library, {
    ...snapshot.artifact,
    updatedAt: new Date().toISOString(),
  });
}

export function deleteArtifactRecord(
  library: ArtifactLibrary,
  artifactId: string,
): ArtifactLibrary {
  return ArtifactLibrarySchema.parse({
    ...library,
    records: library.records.filter((record) => record.artifact.id !== artifactId),
  });
}

function defaultForSchema(schema: JsonSchemaSubset): unknown {
  if (schema.default !== undefined) return structuredClone(schema.default);
  if (schema.type === "object") {
    return Object.fromEntries(
      Object.entries(schema.properties ?? {}).map(([key, child]) => [key, defaultForSchema(child)]),
    );
  }
  if (schema.type === "array") return [];
  if (schema.type === "boolean") return false;
  if (schema.type === "number" || schema.type === "integer") return schema.minimum ?? 0;
  return schema.enum?.[0] ?? "";
}

export function sampleForArtifact(artifact: LoomOSArtifact): unknown {
  if (artifact.kind === "module") {
    return isRecord(artifact.sampleData) && Object.keys(artifact.sampleData).length > 0
      ? artifact.sampleData
      : defaultForSchema(artifact.schema);
  }
  return artifact.kind === "theme" ? artifact.sampleData : {};
}

export function normalizeValueForJsonSchema(
  value: unknown,
  schema: JsonSchemaSubset,
  depth = 0,
): unknown {
  if (depth > 12) return defaultForSchema(schema);
  if (schema.enum?.length) {
    return schema.enum.includes(value as never) ? value : schema.default ?? schema.enum[0];
  }
  if (schema.type === "object") {
    const source = isRecord(value) ? value : {};
    return Object.fromEntries(
      Object.entries(schema.properties ?? {}).map(([key, child]) => [
        key,
        normalizeValueForJsonSchema(source[key], child, depth + 1),
      ]),
    );
  }
  if (schema.type === "array") {
    const values = Array.isArray(value) ? value : [];
    const itemSchema = schema.items ?? { type: "string" };
    return values
      .slice(0, schema.maxItems ?? 80)
      .map((item) => normalizeValueForJsonSchema(item, itemSchema, depth + 1));
  }
  if (schema.type === "boolean") return typeof value === "boolean" ? value : Boolean(schema.default);
  if (schema.type === "number" || schema.type === "integer") {
    let numeric = typeof value === "number" && Number.isFinite(value)
      ? value
      : typeof schema.default === "number"
      ? schema.default
      : schema.minimum ?? 0;
    if (schema.type === "integer") numeric = Math.round(numeric);
    if (schema.minimum !== undefined) numeric = Math.max(schema.minimum, numeric);
    if (schema.maximum !== undefined) numeric = Math.min(schema.maximum, numeric);
    return numeric;
  }
  const text = typeof value === "string" ? value : typeof schema.default === "string" ? schema.default : "";
  return text.slice(0, schema.maxLength ?? 4000);
}
