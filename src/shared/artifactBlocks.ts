import {
  BlueprintArtifactSchema,
  LoomOSArtifactSchema,
  ModuleCapsuleArtifactSchema,
  ThemeArtifactSchema,
  ThemeDesignSchema,
  extractJsonText,
  validateJsonSchemaSubset,
  type BlueprintArtifact,
  type JsonSchemaSubset,
  type LoomOSArtifact,
  type ModuleCapsuleArtifact,
  type ThemeArtifact,
} from "./artifacts";

export type ArtifactBlockLanguage = "json" | "text" | "html" | "css" | "javascript";
export type ArtifactBlockMode = "replace" | "patch";

export interface ArtifactBlockTarget {
  artifactId: string;
  kind: LoomOSArtifact["kind"];
  path: string;
  label: string;
  language: ArtifactBlockLanguage;
  mode: ArtifactBlockMode;
  currentValue: unknown;
  surroundingContext?: Record<string, unknown>;
  safetyRules?: string[];
}

export interface ArtifactBlockRefinementResult {
  target: ArtifactBlockTarget;
  replacementValue?: unknown;
  patch?: unknown;
  summary: string;
  warnings: string[];
  changedPaths: string[];
  repaired: boolean;
  issues: string[];
}

export interface AppliedArtifactBlockRefinement {
  artifact: LoomOSArtifact;
  result: ArtifactBlockRefinementResult;
}

const TEXT_SECURITY_RULES = [
  "Do not introduce remote assets, URLs, network calls, eval, Function constructors, storage access, external scripts, or parent DOM access.",
  "Return only the selected block replacement. Do not change unrelated artifact paths.",
];

function cloneArtifact<T extends LoomOSArtifact>(artifact: T): T {
  return structuredClone(artifact);
}

function jsonTarget(
  artifact: LoomOSArtifact,
  path: string,
  label: string,
  currentValue: unknown,
  surroundingContext: Record<string, unknown> = {},
): ArtifactBlockTarget {
  return {
    artifactId: artifact.id,
    kind: artifact.kind,
    path,
    label,
    language: "json",
    mode: "replace",
    currentValue,
    surroundingContext,
    safetyRules: TEXT_SECURITY_RULES,
  };
}

function textTarget(
  artifact: LoomOSArtifact,
  path: string,
  label: string,
  language: ArtifactBlockLanguage,
  currentValue: string,
  surroundingContext: Record<string, unknown> = {},
): ArtifactBlockTarget {
  return {
    artifactId: artifact.id,
    kind: artifact.kind,
    path,
    label,
    language,
    mode: "replace",
    currentValue,
    surroundingContext,
    safetyRules: TEXT_SECURITY_RULES,
  };
}

function moduleTargets(module: ModuleCapsuleArtifact): ArtifactBlockTarget[] {
  const properties = module.schema.properties ?? {};
  return [
    jsonTarget(module, "meta", "Metadata", module.meta, { artifactName: module.meta.name }),
    jsonTarget(module, "schema", "Field schema", module.schema, {
      required: module.schema.required ?? [],
      propertyKeys: Object.keys(properties),
    }),
    textTarget(module, "prompt", "Tracking purpose / prompt", "text", module.prompt, {
      schemaKeys: Object.keys(properties),
      sampleKeys: module.sampleData && typeof module.sampleData === "object"
        ? Object.keys(module.sampleData as Record<string, unknown>)
        : [],
    }),
    jsonTarget(module, "sampleData", "Sample data", module.sampleData, {
      schemaKeys: Object.keys(properties),
    }),
    jsonTarget(module, "defaults", "Defaults", module.defaults, { group: module.defaults.group }),
    jsonTarget(module, "visual", "Visual metadata", module.visual ?? {}, {
      outputMode: module.visual?.outputMode ?? "cards",
    }),
    textTarget(module, "view.html", "Module HTML", "html", module.view.html, {
      cssLength: module.view.css.length,
      javascriptLength: module.view.javascript.length,
    }),
    textTarget(module, "view.css", "Module CSS", "css", module.view.css, {
      htmlLength: module.view.html.length,
    }),
    textTarget(module, "view.javascript", "Module JavaScript", "javascript", module.view.javascript, {
      developerNote: "Module JavaScript is isolated and optional.",
    }),
    jsonTarget(module, "view.partials", "Module partials", module.view.partials, {
      partialNames: Object.keys(module.view.partials),
    }),
    jsonTarget(module, "fieldBuilder.fields", "Field Builder fields", properties, {
      required: module.schema.required ?? [],
    }),
    ...Object.entries(properties).map(([key, value]) =>
      jsonTarget(module, `schema.properties.${key}`, `Field definition: ${key}`, value, {
        required: module.schema.required?.includes(key) ?? false,
      })
    ),
  ];
}

function themeTargets(theme: ThemeArtifact): ArtifactBlockTarget[] {
  const design = ThemeDesignSchema.parse(theme.design ?? {});
  return [
    jsonTarget(theme, "meta", "Metadata", theme.meta, { artifactName: theme.meta.name }),
    jsonTarget(theme, "manifest", "Manifest", theme.manifest, {
      slots: theme.manifest.slots ?? [],
      capabilities: theme.manifest.capabilities,
    }),
    jsonTarget(theme, "design.tokens", "Design tokens", design.tokens, {
      tokenNames: Object.keys(design.tokens),
    }),
    jsonTarget(theme, "design.style", "Design style settings", {
      typography: design.typography,
      backgroundStyle: design.backgroundStyle,
      panelStyle: design.panelStyle,
      borderStyle: design.borderStyle,
      density: design.density,
      headerStyle: design.headerStyle,
      widgetStyle: design.widgetStyle,
      mobileNotes: design.mobileNotes,
      previewSurface: design.previewSurface,
    }, {
      tokenNames: Object.keys(design.tokens),
    }),
    textTarget(theme, "view.html", "Theme HTML", "html", theme.view.html, {
      slots: theme.manifest.slots ?? [],
      partialNames: Object.keys(theme.view.partials),
    }),
    textTarget(theme, "view.css", "Theme CSS", "css", theme.view.css, {
      tokenNames: Object.keys(design.tokens),
    }),
    textTarget(theme, "view.javascript", "Theme JavaScript", "javascript", theme.view.javascript, {
      developerMode: theme.manifest.developerMode,
    }),
    jsonTarget(theme, "view.partials", "Theme partials", theme.view.partials, {
      partialNames: Object.keys(theme.view.partials),
    }),
    jsonTarget(theme, "sampleData", "Sample data", theme.sampleData, {}),
    jsonTarget(theme, "manifest.slots", "Declared slots", theme.manifest.slots ?? [], {}),
    ...(theme.manifest.slots ?? []).map((slot) =>
      textTarget(theme, `manifest.slots.${slot}`, `Slot section: ${slot}`, "text", slot, {
        declaredSlots: theme.manifest.slots ?? [],
      })
    ),
  ];
}

function blueprintTargets(blueprint: BlueprintArtifact): ArtifactBlockTarget[] {
  return [
    jsonTarget(blueprint, "meta", "Metadata", blueprint.meta, { artifactName: blueprint.meta.name }),
    jsonTarget(blueprint, "settings", "Recommended settings", blueprint.settings, {}),
    jsonTarget(blueprint, "modules", "Module list", blueprint.modules, {
      moduleIds: blueprint.modules.map((module) => module.id),
    }),
    jsonTarget(blueprint, "theme", "Embedded theme", blueprint.theme, {
      themeId: blueprint.theme?.id ?? null,
    }),
    ...blueprint.modules.map((module) =>
      jsonTarget(blueprint, `modules.${module.id}`, `Embedded module: ${module.meta.name}`, module, {
        moduleIds: blueprint.modules.map((candidate) => candidate.id),
      })
    ),
  ];
}

export function enumerateArtifactBlockTargets(artifact: LoomOSArtifact): ArtifactBlockTarget[] {
  if (artifact.kind === "module") return moduleTargets(artifact);
  if (artifact.kind === "theme") return themeTargets(artifact);
  return blueprintTargets(artifact);
}

export function findArtifactBlockTarget(
  artifact: LoomOSArtifact,
  path: string,
): ArtifactBlockTarget | null {
  return enumerateArtifactBlockTargets(artifact).find((target) => target.path === path) ?? null;
}

function getBlockValue(artifact: LoomOSArtifact, path: string): unknown {
  return enumerateArtifactBlockTargets(artifact).find((target) => target.path === path)?.currentValue;
}

function assertTargetMatches(artifact: LoomOSArtifact, target: ArtifactBlockTarget): void {
  if (artifact.id !== target.artifactId) {
    throw new Error(`Block target artifact "${target.artifactId}" does not match "${artifact.id}".`);
  }
  if (artifact.kind !== target.kind) {
    throw new Error(`Block target kind "${target.kind}" does not match "${artifact.kind}".`);
  }
  if (!findArtifactBlockTarget(artifact, target.path)) {
    throw new Error(`Block target path "${target.path}" is not available for ${artifact.kind} artifacts.`);
  }
}

function applyToModule(
  artifact: ModuleCapsuleArtifact,
  path: string,
  replacement: unknown,
): ModuleCapsuleArtifact {
  const next = cloneArtifact(artifact);
  if (path === "meta") next.meta = replacement as ModuleCapsuleArtifact["meta"];
  else if (path === "schema") next.schema = replacement as JsonSchemaSubset;
  else if (path === "prompt") next.prompt = String(replacement);
  else if (path === "sampleData") next.sampleData = replacement;
  else if (path === "defaults") next.defaults = replacement as ModuleCapsuleArtifact["defaults"];
  else if (path === "visual") next.visual = replacement as ModuleCapsuleArtifact["visual"];
  else if (path === "view.html") next.view.html = String(replacement);
  else if (path === "view.css") next.view.css = String(replacement);
  else if (path === "view.javascript") next.view.javascript = String(replacement);
  else if (path === "view.partials") next.view.partials = replacement as ModuleCapsuleArtifact["view"]["partials"];
  else if (path === "fieldBuilder.fields") {
    next.schema = {
      ...next.schema,
      type: "object",
      properties: replacement as Record<string, JsonSchemaSubset>,
    };
  } else if (path.startsWith("schema.properties.")) {
    const key = path.slice("schema.properties.".length);
    next.schema = {
      ...next.schema,
      type: "object",
      properties: {
        ...(next.schema.properties ?? {}),
        [key]: replacement as JsonSchemaSubset,
      },
    };
  } else {
    throw new Error(`Unsupported Module block path "${path}".`);
  }
  if (path === "schema" || path === "fieldBuilder.fields" || path.startsWith("schema.properties.")) {
    const diagnostics = validateJsonSchemaSubset(next.schema);
    if (diagnostics.length) throw new Error(diagnostics.map((issue) => `${issue.path}: ${issue.message}`).join(" "));
  }
  return ModuleCapsuleArtifactSchema.parse({ ...next, updatedAt: new Date().toISOString() });
}

function applyToTheme(
  artifact: ThemeArtifact,
  path: string,
  replacement: unknown,
): ThemeArtifact {
  const next = cloneArtifact(artifact);
  const design = ThemeDesignSchema.parse(next.design ?? {});
  if (path === "meta") next.meta = replacement as ThemeArtifact["meta"];
  else if (path === "manifest") next.manifest = replacement as ThemeArtifact["manifest"];
  else if (path === "design.tokens") next.design = { ...design, tokens: replacement as typeof design.tokens };
  else if (path === "design.style") next.design = { ...design, ...(replacement as Partial<typeof design>) };
  else if (path === "view.html") next.view.html = String(replacement);
  else if (path === "view.css") next.view.css = String(replacement);
  else if (path === "view.javascript") next.view.javascript = String(replacement);
  else if (path === "view.partials") next.view.partials = replacement as ThemeArtifact["view"]["partials"];
  else if (path === "sampleData") next.sampleData = replacement;
  else if (path === "manifest.slots") next.manifest.slots = replacement as string[];
  else if (path.startsWith("manifest.slots.")) {
    const previous = path.slice("manifest.slots.".length);
    const value = String(replacement).trim();
    next.manifest.slots = (next.manifest.slots ?? []).map((slot) => slot === previous ? value : slot);
  } else {
    throw new Error(`Unsupported Theme block path "${path}".`);
  }
  return ThemeArtifactSchema.parse({ ...next, updatedAt: new Date().toISOString() });
}

function applyToBlueprint(
  artifact: BlueprintArtifact,
  path: string,
  replacement: unknown,
): BlueprintArtifact {
  const next = cloneArtifact(artifact);
  if (path === "meta") next.meta = replacement as BlueprintArtifact["meta"];
  else if (path === "settings") next.settings = replacement as BlueprintArtifact["settings"];
  else if (path === "modules") next.modules = replacement as BlueprintArtifact["modules"];
  else if (path === "theme") next.theme = replacement as BlueprintArtifact["theme"];
  else if (path.startsWith("modules.")) {
    const moduleId = path.slice("modules.".length);
    const module = ModuleCapsuleArtifactSchema.parse(replacement);
    next.modules = next.modules.map((candidate) => candidate.id === moduleId ? module : candidate);
  } else {
    throw new Error(`Unsupported Blueprint block path "${path}".`);
  }
  return BlueprintArtifactSchema.parse({ ...next, updatedAt: new Date().toISOString() });
}

export function applyArtifactBlockReplacement(
  artifact: LoomOSArtifact,
  target: ArtifactBlockTarget,
  replacement: unknown,
): AppliedArtifactBlockRefinement {
  assertTargetMatches(artifact, target);
  const next = artifact.kind === "module"
    ? applyToModule(artifact, target.path, replacement)
    : artifact.kind === "theme"
    ? applyToTheme(artifact, target.path, replacement)
    : applyToBlueprint(artifact, target.path, replacement);
  return {
    artifact: next,
    result: {
      target,
      replacementValue: replacement,
      summary: `Prepared replacement for ${target.label}.`,
      warnings: [],
      changedPaths: [target.path],
      repaired: false,
      issues: [],
    },
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function pathAllowedForTarget(path: string, targetPath: string): boolean {
  return path === targetPath || path.startsWith(`${targetPath}.`);
}

export function boundedBlockContext(
  artifact: LoomOSArtifact,
  target: ArtifactBlockTarget,
): Record<string, unknown> {
  return {
    artifactId: artifact.id,
    kind: artifact.kind,
    name: artifact.meta.name,
    target: {
      path: target.path,
      label: target.label,
      language: target.language,
      mode: target.mode,
      currentValue: target.currentValue,
    },
    surroundingContext: target.surroundingContext ?? {},
    availableSiblingPaths: enumerateArtifactBlockTargets(artifact)
      .map((candidate) => candidate.path)
      .filter((path) => path !== target.path)
      .slice(0, 20),
  };
}

export function parseArtifactBlockRefinementText(
  raw: string,
  artifact: LoomOSArtifact,
  target: ArtifactBlockTarget,
  repaired = false,
): AppliedArtifactBlockRefinement {
  const value = extractJsonText(raw);
  let payload = value;
  let summary = "Block refinement prepared.";
  let warnings: string[] = [];
  let changedPaths = [target.path];

  if (isRecord(value) && value.target && value.replacementValue !== undefined) {
    const outputTarget = isRecord(value.target) ? value.target : {};
    const outputPath = String(outputTarget.path ?? target.path);
    if (outputPath !== target.path) {
      throw new Error(`Model returned target path "${outputPath}" but "${target.path}" was requested.`);
    }
    const outputChangedPaths = Array.isArray(value.changedPaths)
      ? value.changedPaths.map(String)
      : [target.path];
    const unrelated = outputChangedPaths.filter((path) => !pathAllowedForTarget(path, target.path));
    if (unrelated.length) {
      throw new Error(`Model attempted to change unrelated paths: ${unrelated.join(", ")}.`);
    }
    payload = value.replacementValue;
    summary = typeof value.summary === "string" ? value.summary : summary;
    warnings = Array.isArray(value.warnings) ? value.warnings.map(String).slice(0, 8) : [];
    changedPaths = outputChangedPaths.length ? outputChangedPaths : [target.path];
  } else if (isRecord(value) && value.format === "loomos-artifact") {
    const fullArtifact = LoomOSArtifactSchema.parse(value);
    if (fullArtifact.id !== artifact.id || fullArtifact.kind !== artifact.kind) {
      throw new Error("Full-artifact block output did not match the selected artifact.");
    }
    payload = getBlockValue(fullArtifact, target.path);
    if (payload === undefined) throw new Error(`Could not extract "${target.path}" from full artifact output.`);
    summary = "Model returned a full artifact; only the requested block was extracted.";
    warnings = ["Full artifact output was bounded to the selected block."];
  }

  const applied = applyArtifactBlockReplacement(artifact, target, payload);
  return {
    artifact: applied.artifact,
    result: {
      ...applied.result,
      summary,
      warnings,
      changedPaths,
      repaired,
    },
  };
}
