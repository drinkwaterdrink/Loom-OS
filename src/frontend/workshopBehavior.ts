import {
  BlueprintArtifactSchema,
  LoomOSArtifactSchema,
  ModuleCapsuleArtifactSchema,
  ThemeArtifactSchema,
  extractJsonText,
  parseLoomOSArtifact,
  parseLoomPack,
  type ArtifactLibrary,
  type ArtifactRecord,
  type LoomOSArtifact,
  type LoomPack,
  type ModuleCapsuleArtifact,
  type ThemeArtifact,
} from "../shared/artifacts";
import type { FrontendRequest } from "../shared/protocol";
import { LoomOSSettingsSchema } from "../shared/schemas";
import type {
  LoomOSSettings,
  LoomOSState,
  StateHistoryItem,
  WidgetInstance,
} from "../shared/types";
import type { ViewerModelV1 } from "../shared/viewerModel";
import { buildThemeDocument } from "../shared/themeRuntime";
import { escapeHtml, renderDashboard } from "./render";
import { LOOMOS_STYLES } from "./styles";

export type WorkshopView =
  | "home"
  | "packs"
  | "modules"
  | "layout"
  | "theme"
  | "test-lab"
  | "advanced-code"
  | "revisions";

export type PreviewSurface = "theme" | "native";
export type PreviewDataMode = "current" | "empty" | "dense";

export const WORKSHOP_NAV: ReadonlyArray<{
  id: WorkshopView;
  label: string;
  description: string;
}> = [
  { id: "home", label: "Home", description: "Setup overview and quick actions" },
  { id: "packs", label: "Packs", description: "Import, export, and manage portable artifacts" },
  { id: "modules", label: "Modules", description: "Track, display, inject, and place modules" },
  { id: "layout", label: "Layout", description: "Arrange widgets into responsive slots" },
  { id: "theme", label: "Theme", description: "Preview and activate visual shells" },
  { id: "test-lab", label: "Test Lab", description: "Compare preview sizes, data, and diagnostics" },
  { id: "advanced-code", label: "Advanced Code", description: "Edit JSON, HTML, CSS, and JavaScript" },
  { id: "revisions", label: "Revisions", description: "Restore saved artifact snapshots" },
];

export interface PackFilter {
  query: string;
  kind: "all" | LoomOSArtifact["kind"];
}

export function artifactMatchesPackFilter(
  artifact: LoomOSArtifact,
  filter: PackFilter,
): boolean {
  const query = filter.query.trim().toLowerCase();
  const searchable = [
    artifact.meta.name,
    artifact.meta.description,
    artifact.kind,
    ...artifact.meta.tags,
  ].join(" ").toLowerCase();
  return (!query || searchable.includes(query))
    && (filter.kind === "all" || artifact.kind === filter.kind);
}

export interface ModuleFilter {
  query: string;
  source: string;
  group: string;
  status: string;
}

export interface ModuleFilterItem {
  search: string;
  source: string;
  group: string;
  status: string;
  track: boolean;
  display: boolean;
  inject: boolean;
}

export function widgetMatchesModuleFilter(
  item: ModuleFilterItem,
  filter: ModuleFilter,
): boolean {
  const query = filter.query.trim().toLowerCase();
  const matchesStatus = filter.status === "all"
    || item.status === filter.status
    || (filter.status === "tracked" && item.track)
    || (filter.status === "displayed" && item.display)
    || (filter.status === "injected" && item.inject);
  return (!query || item.search.toLowerCase().includes(query))
    && (filter.source === "all" || item.source === filter.source)
    && (filter.group === "all" || item.group === filter.group)
    && matchesStatus;
}

export function activeSetupCounts(settings: LoomOSSettings): {
  widgets: number;
  tracked: number;
  injected: number;
} {
  const widgets = settings.layout?.widgets.filter((widget) => widget.display).length ?? 0;
  const tracked = settings.layout?.widgets.filter((widget) => widget.track).length ?? 0;
  const injected = settings.layout?.widgets.filter((widget) => widget.inject).length ?? 0;
  return { widgets, tracked, injected };
}

export type WidgetControlPatch = Pick<WidgetInstance, "id"> & Partial<
  Pick<
    WidgetInstance,
    "track" | "display" | "inject" | "slot" | "displayMode" | "tokenPriority" | "order"
  >
>;

export function applyWorkshopLayoutEdits(
  settings: LoomOSSettings,
  patches: WidgetControlPatch[],
  responsiveMode = settings.layout?.responsiveMode ?? "single-column",
): LoomOSSettings {
  const patchById = new Map(patches.map((patch) => [patch.id, patch]));
  const widgets = (settings.layout?.widgets ?? []).map((widget) => {
    const patch = patchById.get(widget.id);
    return patch ? { ...widget, ...patch } : { ...widget };
  }).sort((left, right) => left.order - right.order);
  const moduleSettings = structuredClone(settings.moduleSettings);
  const customModules = structuredClone(settings.customModules);

  for (const widget of widgets) {
    if (widget.source === "stock" && widget.moduleId in moduleSettings) {
      moduleSettings[widget.moduleId as keyof typeof moduleSettings] = {
        track: widget.track,
        display: widget.display,
        inject: widget.inject,
      };
      continue;
    }
    const customIndex = customModules.findIndex((module) =>
      module.id === widget.moduleId || module.artifactId === widget.moduleId
    );
    if (customIndex >= 0) {
      customModules[customIndex] = {
        ...customModules[customIndex]!,
        enabled: widget.track,
        display: widget.display,
        inject: widget.inject,
      };
    }
  }

  return LoomOSSettingsSchema.parse({
    ...settings,
    moduleSettings,
    customModules,
    layout: {
      slots: settings.layout?.slots ?? [],
      widgets,
      responsiveMode,
    },
  });
}

export type WorkshopSaveTarget = "settings" | "artifact" | null;

export function workshopSaveTarget(
  view: WorkshopView,
  hasWorkingArtifact: boolean,
  settingsDirty: boolean,
  codeDirty: boolean,
): WorkshopSaveTarget {
  if ((view === "modules" || view === "theme") && hasWorkingArtifact && codeDirty) {
    return "artifact";
  }
  if (view === "modules" || view === "layout") {
    return settingsDirty ? "settings" : null;
  }
  if ((view === "advanced-code" || view === "test-lab") && hasWorkingArtifact) {
    return codeDirty ? "artifact" : null;
  }
  return null;
}

export function workshopInstallTarget(
  view: WorkshopView,
  workingArtifact: LoomOSArtifact | null,
  stagedArtifact: LoomOSArtifact | null,
  activeTheme: ThemeArtifact | null,
): LoomOSArtifact | null {
  if (view === "home" || view === "layout") return null;
  if (view === "modules") return workingArtifact?.kind === "module" ? workingArtifact : null;
  if (view === "theme") {
    return workingArtifact?.kind === "theme" ? workingArtifact : activeTheme;
  }
  if (view === "test-lab" && stagedArtifact) return stagedArtifact;
  return workingArtifact;
}

export function selectedArtifactRecord(
  library: ArtifactLibrary,
  artifactId: string,
): ArtifactRecord | null {
  return library.records.find((record) => record.artifact.id === artifactId) ?? null;
}

export function mobilePreviewState(
  current: boolean,
  action: "open" | "close" | "toggle",
): boolean {
  if (action === "open") return true;
  if (action === "close") return false;
  return !current;
}

export type WorkshopImport =
  | { kind: "pack"; pack: LoomPack }
  | { kind: "artifact"; artifact: LoomOSArtifact };

export function parseWorkshopImportText(text: string): WorkshopImport {
  const value = extractJsonText(text);
  if (value && typeof value === "object" && "format" in value && value.format === "loomos-pack") {
    return { kind: "pack", pack: parseLoomPack(value) };
  }
  return { kind: "artifact", artifact: parseLoomOSArtifact(value) };
}

function cloneArtifact<T extends LoomOSArtifact>(artifact: T): T {
  return structuredClone(artifact);
}

export function applyWorkshopCodeValue(
  artifact: LoomOSArtifact,
  section: string,
  raw: string,
): LoomOSArtifact {
  const next = cloneArtifact(artifact);
  const json = () => JSON.parse(raw);
  if (section === "meta") {
    const identity = json() as {
      id?: unknown;
      meta?: unknown;
      createdAt?: unknown;
      updatedAt?: unknown;
    };
    return LoomOSArtifactSchema.parse({
      ...next,
      id: identity.id,
      meta: identity.meta,
      createdAt: identity.createdAt,
      updatedAt: new Date().toISOString(),
    });
  }
  if (next.kind === "module") {
    if (section === "schema") next.schema = json();
    if (section === "prompt") next.prompt = raw;
    if (section === "sample") next.sampleData = json();
    if (section === "defaults") {
      const value = json() as { defaults?: unknown; capabilities?: unknown; visual?: unknown };
      next.defaults = value.defaults as ModuleCapsuleArtifact["defaults"];
      next.capabilities = value.capabilities as ModuleCapsuleArtifact["capabilities"];
      next.visual = value.visual as ModuleCapsuleArtifact["visual"];
    }
    if (section === "html" || section === "css" || section === "javascript") {
      next.view[section] = raw;
    }
    return ModuleCapsuleArtifactSchema.parse({
      ...next,
      updatedAt: new Date().toISOString(),
    });
  }
  if (next.kind === "theme") {
    if (section === "manifest") {
      const value = json() as { manifest?: unknown; design?: unknown };
      if (value && typeof value === "object" && "manifest" in value) {
        next.manifest = value.manifest as ThemeArtifact["manifest"];
        next.design = value.design as ThemeArtifact["design"];
      } else {
        next.manifest = value as unknown as ThemeArtifact["manifest"];
      }
    }
    if (section === "partials") next.view.partials = json();
    if (section === "sample") next.sampleData = json();
    if (section === "html" || section === "css" || section === "javascript") {
      next.view[section] = raw;
    }
    return ThemeArtifactSchema.parse({
      ...next,
      updatedAt: new Date().toISOString(),
    });
  }
  if (next.kind === "blueprint") {
    if (section === "modules") next.modules = json();
    if (section === "theme") next.theme = json();
    if (section === "settings") next.settings = json();
    return BlueprintArtifactSchema.parse({
      ...next,
      updatedAt: new Date().toISOString(),
    });
  }
  return LoomOSArtifactSchema.parse(next);
}

export type SaveArtifactRequest = Extract<FrontendRequest, { type: "save_artifact" }>;

export function saveWorkshopCodeDraft(
  artifact: LoomOSArtifact,
  section: string,
  raw: string,
  requestId: string,
  send: (request: SaveArtifactRequest) => void,
): { ok: true; artifact: LoomOSArtifact } | { ok: false; artifact: LoomOSArtifact; error: string } {
  try {
    const next = applyWorkshopCodeValue(artifact, section, raw);
    send({ type: "save_artifact", requestId, artifact: next });
    return { ok: true, artifact: next };
  } catch (error) {
    return {
      ok: false,
      artifact,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

export function buildWorkshopThemePreviewDocument(
  theme: ThemeArtifact,
  model: ViewerModelV1,
  developerModeEnabled: boolean,
  nonce = `preview-${theme.id}`,
): string {
  return buildThemeDocument(theme, model, { nonce, developerModeEnabled });
}

export function buildWorkshopNativePreviewDocument(
  state: LoomOSState | null,
  settings: LoomOSSettings,
  history: StateHistoryItem[],
  dataMode: PreviewDataMode,
): string {
  const previewState = dataMode === "empty" ? null : state;
  const content = previewState
    ? renderDashboard(previewState, settings, "overview")
    : `<div class="loomos-empty"><h3>Empty exact-swipe state</h3><p>Generate a tracker or switch Data to Current to inspect live content.</p></div>`;
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${LOOMOS_STYLES}</style></head>
<body class="loomos-root" data-skin="${escapeHtml(settings.skin)}" data-history-count="${history.length}" style="margin:0;padding:10px;background:var(--loomos-bg);color:var(--loomos-ink)">
${content}
</body></html>`;
}
