import type {
  SpindleFrontendContext,
  SpindleModalHandle,
} from "lumiverse-spindle-types";
import type {
  BackendResponse,
  FrontendRequest,
} from "../shared/protocol";
import {
  LoomOSArtifactSchema,
  ThemeArtifactSchema,
  ThemeDesignSchema,
  createStarterBlueprintArtifact,
  createStarterModuleArtifact,
  createStarterThemeArtifact,
  sampleForArtifact,
  validateJsonSchemaSubset,
  LoomPackSchema,
  type ArtifactLibrary,
  type ArtifactRecord,
  type BlueprintArtifact,
  type LoomOSArtifact,
  type ModuleCapsuleArtifact,
  type ThemeArtifact,
  type ThemeCapability,
  type LoomPack,
} from "../shared/artifacts";
import {
  applyVisualModuleEdits,
  applyVisualThemeEdits,
  parseJsonSchemaToVisualFields,
  type VisualField,
} from "../shared/visualBuilders";
import type {
  LoomOSSettings,
  LoomOSState,
  StateHistoryItem,
} from "../shared/types";
import { buildViewerModel } from "../shared/viewerModel";
import { LoomOSSettingsSchema } from "../shared/schemas";
import {
  CORE_TRACKING_MODULES,
  getEffectiveModuleCatalog,
  type ModuleKey,
} from "../shared/modules";
import {
  inspectThemeComplexity,
} from "../shared/themeRuntime";
import {
  mountCodeEditor,
  type CodeEditorHandle,
  type CodeEditorLanguage,
} from "./codeEditor";
import {
  escapeHtml,
  enrichViewerModelWithLayout,
  inspectLayoutDiagnostics,
} from "./render";
import {
  WORKSHOP_NAV,
  activeSetupCounts,
  applyWorkshopCodeValue,
  applyWorkshopLayoutEdits,
  artifactMatchesPackFilter,
  buildWorkshopNativePreviewDocument,
  buildWorkshopThemePreviewDocument,
  mobilePreviewState,
  parseWorkshopImportText,
  saveWorkshopCodeDraft,
  selectedArtifactRecord,
  widgetMatchesModuleFilter,
  workshopInstallTarget,
  workshopSaveTarget,
  type PreviewDataMode,
  type PreviewSurface,
  type WidgetControlPatch,
  type WorkshopView,
} from "./workshopBehavior";

type PreviewSize = "mobile" | "tablet" | "desktop";

export interface CreatorWorkshopOptions {
  ctx: SpindleFrontendContext;
  settings: LoomOSSettings;
  state: LoomOSState | null;
  history: StateHistoryItem[];
  library: ArtifactLibrary;
  send: (request: FrontendRequest) => void;
  requestId: (prefix: string) => string;
  onStatus: (message: string) => void;
  onClose?: () => void;
}

export interface CreatorWorkshopHandle {
  updateLibrary(library: ArtifactLibrary): void;
  updateSettings(settings: LoomOSSettings): void;
  updateState(state: LoomOSState | null, history: StateHistoryItem[]): void;
  handleBackendResponse(response: BackendResponse): boolean;
  destroy(): void;
}

interface CodeSection {
  id: string;
  label: string;
  language: CodeEditorLanguage;
}

function cloneArtifact<T extends LoomOSArtifact>(artifact: T): T {
  return structuredClone(artifact);
}

function duplicateArtifact(artifact: LoomOSArtifact): LoomOSArtifact {
  const now = new Date().toISOString();
  const suffix = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  return LoomOSArtifactSchema.parse({
    ...cloneArtifact(artifact),
    id: `${artifact.id}_copy_${suffix}`,
    createdAt: now,
    updatedAt: now,
    meta: {
      ...artifact.meta,
      name: `${artifact.meta.name} Copy`,
    },
  });
}

function safeFilename(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "") || "loomos-artifact";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function downloadJson(filename: string, value: unknown): void {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function codeSections(artifact: LoomOSArtifact): CodeSection[] {
  const common: CodeSection[] = [{ id: "meta", label: "Identity", language: "json" }];
  if (artifact.kind === "module") {
    return [
      ...common,
      { id: "schema", label: "Data Schema", language: "json" },
      { id: "prompt", label: "AI Instructions", language: "text" },
      { id: "html", label: "HTML", language: "html" },
      { id: "css", label: "CSS", language: "css" },
      { id: "javascript", label: "JavaScript", language: "javascript" },
      { id: "sample", label: "Sample Data", language: "json" },
      { id: "defaults", label: "Defaults", language: "json" },
    ];
  }
  if (artifact.kind === "theme") {
    return [
      ...common,
      { id: "manifest", label: "Manifest", language: "json" },
      { id: "html", label: "HTML", language: "html" },
      { id: "css", label: "CSS", language: "css" },
      { id: "javascript", label: "JavaScript", language: "javascript" },
      { id: "partials", label: "Partials", language: "json" },
      { id: "sample", label: "Sample Data", language: "json" },
    ];
  }
  return [
    ...common,
    { id: "modules", label: "Modules", language: "json" },
    { id: "theme", label: "Theme", language: "json" },
    { id: "settings", label: "Settings", language: "json" },
  ];
}

function codeValue(artifact: LoomOSArtifact, section: string): string {
  if (section === "meta") {
    return JSON.stringify({
      id: artifact.id,
      meta: artifact.meta,
      createdAt: artifact.createdAt,
      updatedAt: artifact.updatedAt,
    }, null, 2);
  }
  if (artifact.kind === "module") {
    if (section === "schema") return JSON.stringify(artifact.schema, null, 2);
    if (section === "prompt") return artifact.prompt;
    if (section === "sample") return JSON.stringify(artifact.sampleData, null, 2);
    if (section === "defaults") {
      return JSON.stringify({
        defaults: artifact.defaults,
        capabilities: artifact.capabilities,
        visual: artifact.visual,
      }, null, 2);
    }
    if (section === "html" || section === "css" || section === "javascript") {
      return artifact.view[section];
    }
  }
  if (artifact.kind === "theme") {
    if (section === "manifest") return JSON.stringify({
      manifest: artifact.manifest,
      design: artifact.design,
    }, null, 2);
    if (section === "partials") return JSON.stringify(artifact.view.partials, null, 2);
    if (section === "sample") return JSON.stringify(artifact.sampleData, null, 2);
    if (section === "html" || section === "css" || section === "javascript") {
      return artifact.view[section];
    }
  }
  if (artifact.kind === "blueprint") {
    if (section === "modules") return JSON.stringify(artifact.modules, null, 2);
    if (section === "theme") return JSON.stringify(artifact.theme, null, 2);
    if (section === "settings") return JSON.stringify(artifact.settings, null, 2);
  }
  return "";
}

function diagnosticsFor(artifact: LoomOSArtifact): Array<{ level: "ok" | "warning" | "error"; text: string }> {
  const diagnostics: Array<{ level: "ok" | "warning" | "error"; text: string }> = [];
  const parsed = LoomOSArtifactSchema.safeParse(artifact);
  if (!parsed.success) {
    diagnostics.push(...parsed.error.issues.map((issue) => ({
      level: "error" as const,
      text: `${issue.path.join(".") || "artifact"}: ${issue.message}`,
    })));
    return diagnostics;
  }
  if (artifact.kind === "module") {
    const schemaIssues = validateJsonSchemaSubset(artifact.schema);
    diagnostics.push(...schemaIssues.map((issue) => ({
      level: "error" as const,
      text: `${issue.path}: ${issue.message}`,
    })));
    if (artifact.prompt.length > 12_000) {
      diagnostics.push({ level: "warning", text: "The module prompt exceeds 12,000 characters." });
    }
    if (!artifact.view.html.trim()) {
      diagnostics.push({ level: "warning", text: "No custom module HTML is defined; native cards will be used." });
    }
  }
  const themes = artifact.kind === "theme"
    ? [artifact]
    : artifact.kind === "blueprint" && artifact.theme
    ? [artifact.theme]
    : [];
  for (const theme of themes) {
    diagnostics.push(...inspectThemeComplexity(theme).map((issue) => ({
      level: "warning" as const,
      text: `${issue.path}: ${issue.message}`,
    })));
    if (theme.manifest.developerMode && theme.view.javascript.trim()) {
      diagnostics.push({
        level: "warning",
        text: "Interactive JavaScript requires Developer Mode trust before it will run.",
      });
    }
  }
  if (diagnostics.length === 0) {
    diagnostics.push({ level: "ok", text: "Artifact is valid and ready to preview or install." });
  }
  return diagnostics;
}

function changedTopLevelKeys(before: LoomOSArtifact | null, after: LoomOSArtifact): string[] {
  if (!before || before.kind !== after.kind) return Object.keys(after);
  const beforeRecord = before as unknown as Record<string, unknown>;
  const afterRecord = after as unknown as Record<string, unknown>;
  return Object.keys(afterRecord).filter((key) =>
    JSON.stringify(beforeRecord[key]) !== JSON.stringify(afterRecord[key])
  );
}

function externalBuilderPrompt(kind: LoomOSArtifact["kind"]): string {
  const starter = kind === "module"
    ? createStarterModuleArtifact()
    : kind === "theme"
    ? createStarterThemeArtifact()
    : createStarterBlueprintArtifact();
  return `Create a production-ready LoomOS ${kind} artifact.
Return exactly one JSON object with no Markdown commentary.
Use format "loomos-artifact", version 2, and kind "${kind}".
Keep generation data semantic. LoomOS derives display counts, percentages, colors, labels, and visibility.
Themes are mobile-first and use escaped Handlebars-compatible paths, #if, #unless, #each, else, partials, and the helpers count, percent, json, uppercase, lowercase, and fallback.
Interactive themes may use window.LoomOS.model and window.LoomOS.action(), but must not use network requests, storage, parent DOM access, eval, Function constructors, or external assets.

STARTER CONTRACT:
${JSON.stringify(starter, null, 2)}`;
}

function previewThemeForArtifact(
  artifact: LoomOSArtifact,
): ThemeArtifact | null {
  if (artifact.kind === "theme") return artifact;
  if (artifact.kind === "blueprint") return artifact.theme;
  return ThemeArtifactSchema.parse({
    format: "loomos-artifact",
    version: 2,
    kind: "theme",
    id: `preview_${artifact.id}`,
    createdAt: artifact.createdAt,
    updatedAt: artifact.updatedAt,
    meta: artifact.meta,
    manifest: {
      viewerModelVersion: 1,
      developerMode: Boolean(artifact.view.javascript.trim()),
      capabilities: artifact.capabilities,
      minWidth: 320,
      preferredColorScheme: "auto",
    },
    view: artifact.view,
    sampleData: artifact.sampleData,
  });
}

export function openCreatorWorkshop(
  options: CreatorWorkshopOptions,
): CreatorWorkshopHandle {
  let settings = LoomOSSettingsSchema.parse(options.settings);
  let state = options.state;
  let history = options.history;
  let library = options.library;
  let activeView: WorkshopView = "home";
  let selectedId = library.records[0]?.artifact.id ?? "";
  let workingArtifact = selectedId
    ? cloneArtifact(library.records.find((record) => record.artifact.id === selectedId)!.artifact)
    : null;
  let originalArtifact = workingArtifact ? cloneArtifact(workingArtifact) : null;
  let stagedArtifact: LoomOSArtifact | null = null;
  let codeSection = workingArtifact ? codeSections(workingArtifact)[0]?.id ?? "meta" : "meta";
  let codeEditor: CodeEditorHandle | null = null;
  let codeDraft = "";
  let codeError = "";
  let visualError = "";
  let codeDirty = false;
  let settingsDirty = false;
  let previewSize: PreviewSize = "mobile";
  let previewSurface: PreviewSurface = "theme";
  let previewDataMode: PreviewDataMode = "current";
  let mobilePreviewOpen = false;
  let generationRequestId: string | null = null;
  let generationStatus = "";
  let generationStartedAt = 0;
  let generationElapsedMs = 0;
  let aiKind: LoomOSArtifact["kind"] = "module";
  let elapsedTimer: ReturnType<typeof setInterval> | null = null;
  let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
  let destroyed = false;
  let modalDismissed = false;
  let layoutQuery = "";
  let layoutGroupBySlot = true;
  let packQuery = "";
  let packKindFilter = "all";
  let railQuery = "";
  let moduleQuery = "";
  let moduleSourceFilter = "all";
  let moduleGroupFilter = "all";
  let moduleStatusFilter = "all";

  const modal: SpindleModalHandle = options.ctx.ui.showModal({
    title: "LoomOS Creator Workshop",
    width: Math.max(320, Math.min(1280, window.innerWidth - 4)),
    maxHeight: Math.max(520, window.innerHeight - 4),
  });
  modal.root.className = "loomos-root loomos-workshop-root";
  modal.root.dataset.skin = settings.skin;
  modal.root.dataset.view = "workshop";

  function selectedRecord(): ArtifactRecord | null {
    return selectedArtifactRecord(library, selectedId);
  }

  function stopTimer(): void {
    if (elapsedTimer) clearInterval(elapsedTimer);
    elapsedTimer = null;
  }

  function scheduleAutosave(): void {
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      autosaveTimer = null;
      if (!workingArtifact || !codeEditor || activeView !== "advanced-code") return;
      const result = saveWorkshopCodeDraft(
        workingArtifact,
        codeSection,
        codeEditor.getValue(),
        options.requestId("artifact-autosave"),
        options.send,
      );
      if (result.ok) {
        workingArtifact = result.artifact;
        codeDirty = false;
        codeError = "Draft autosaved";
        const errorRoot = modal.root.querySelector<HTMLElement>("[data-code-error]");
        if (errorRoot) errorRoot.textContent = codeError;
        updateDirtyActionState();
      } else {
        codeError = "Draft contains invalid data and has not replaced the last valid revision.";
        const errorRoot = modal.root.querySelector<HTMLElement>("[data-code-error]");
        if (errorRoot) errorRoot.textContent = codeError;
      }
    }, 1800);
  }

  function startTimer(initialMs = 0): void {
    stopTimer();
    generationStartedAt = Date.now() - initialMs;
    elapsedTimer = setInterval(() => {
      generationElapsedMs = Date.now() - generationStartedAt;
      const root = modal.root.querySelector<HTMLElement>("[data-workshop-elapsed]");
      if (root) root.textContent = `${Math.floor(generationElapsedMs / 1000)}s`;
    }, 1000);
  }

  function commitCodeDraft(): boolean {
    if (!workingArtifact || activeView !== "advanced-code" || !codeEditor) return true;
    try {
      codeDraft = codeEditor.getValue();
      workingArtifact = applyWorkshopCodeValue(workingArtifact, codeSection, codeDraft);
      codeError = "";
      return true;
    } catch (error) {
      codeError = error instanceof Error ? error.message : String(error);
      const errorRoot = modal.root.querySelector<HTMLElement>("[data-code-error]");
      if (errorRoot) errorRoot.textContent = codeError;
      return false;
    }
  }

  function saveCodeDraft(prefix = "artifact-save"): boolean {
    if (!workingArtifact || !codeEditor || activeView !== "advanced-code") return false;
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = null;
    const result = saveWorkshopCodeDraft(
      workingArtifact,
      codeSection,
      codeEditor.getValue(),
      options.requestId(prefix),
      options.send,
    );
    if (!result.ok) {
      codeError = result.error;
      const errorRoot = modal.root.querySelector<HTMLElement>("[data-code-error]");
      if (errorRoot) errorRoot.textContent = codeError;
      return false;
    }
    workingArtifact = result.artifact;
    codeDirty = false;
    codeError = "Revision saved";
    const errorRoot = modal.root.querySelector<HTMLElement>("[data-code-error]");
    if (errorRoot) errorRoot.textContent = codeError;
    updateDirtyActionState();
    options.onStatus(`Saving ${workingArtifact.meta.name}`);
    return true;
  }

  function saveCommittedArtifact(prefix = "artifact-save"): boolean {
    if (!workingArtifact) return false;
    try {
      const artifact = LoomOSArtifactSchema.parse(workingArtifact);
      options.send({
        type: "save_artifact",
        requestId: options.requestId(prefix),
        artifact,
      });
      workingArtifact = artifact;
      codeDirty = false;
      codeError = "Revision saved";
      const errorRoot = modal.root.querySelector<HTMLElement>("[data-code-error]");
      if (errorRoot) errorRoot.textContent = codeError;
      updateDirtyActionState();
      options.onStatus(`Saving ${artifact.meta.name}`);
      return true;
    } catch (error) {
      codeError = error instanceof Error ? error.message : String(error);
      return false;
    }
  }

  function prepareAdvancedCodeTransition(): boolean {
    if (activeView !== "advanced-code") return true;
    if (!commitCodeDraft()) return false;
    if (!codeDirty) return true;
    return saveCodeDraft("artifact-transition-save");
  }

  function prepareForRender(): boolean {
    if (activeView === "advanced-code" && !commitCodeDraft()) return false;
    if ((activeView === "modules" || activeView === "theme") && !applyVisualBuilderFromDOM()) return false;
    if ((activeView === "modules" || activeView === "layout") && settingsDirty) {
      captureLayoutFromDOM(false);
    }
    return true;
  }

  function prepareViewTransition(): boolean {
    if (activeView === "advanced-code") return prepareAdvancedCodeTransition();
    if ((activeView === "modules" || activeView === "theme") && !applyVisualBuilderFromDOM()) return false;
    if (codeDirty && !saveCommittedArtifact("artifact-transition-save")) return false;
    if ((activeView === "modules" || activeView === "layout") && settingsDirty) {
      captureLayoutFromDOM(false);
    }
    return true;
  }

  function chooseArtifact(artifact: LoomOSArtifact, saved = true): void {
    codeEditor?.destroy();
    codeEditor = null;
    selectedId = artifact.id;
    workingArtifact = cloneArtifact(artifact);
    originalArtifact = cloneArtifact(artifact);
    stagedArtifact = null;
    codeSection = codeSections(artifact)[0]?.id ?? "meta";
    codeError = "";
    visualError = "";
    codeDirty = !saved;
  }

  function createArtifact(kind: LoomOSArtifact["kind"]): void {
    const artifact = kind === "module"
      ? createStarterModuleArtifact()
      : kind === "theme"
      ? createStarterThemeArtifact()
      : createStarterBlueprintArtifact();
    chooseArtifact(artifact, false);
    activeView = kind === "module" ? "modules" : kind === "theme" ? "theme" : "advanced-code";
    render();
  }

  function activeThemeRecord(): ArtifactRecord | null {
    return library.records.find((record) =>
      record.artifact.kind === "theme" && record.artifact.id === settings.activeThemeId
    ) ?? null;
  }

  function installedArtifact(artifact: LoomOSArtifact): boolean {
    return artifact.id === settings.activeThemeId
      || settings.customModules.some((module) => module.artifactId === artifact.id);
  }

  function setupCounts(): {
    widgets: number;
    tracked: number;
    injected: number;
  } {
    return activeSetupCounts(settings);
  }

  function quickAction(
    action: string,
    title: string,
    description: string,
    kind?: LoomOSArtifact["kind"],
  ): string {
    return `
      <button type="button" class="loomos-workshop-quick-action"
        data-workshop-action="${action}"${kind ? ` data-kind="${kind}"` : ""}>
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(description)}</span>
      </button>`;
  }

  function homeHtml(): string {
    const counts = setupCounts();
    const activeTheme = activeThemeRecord()?.artifact;
    return `
      <section class="loomos-workshop-panel loomos-workshop-home">
        <div class="loomos-workshop-hero">
          <div>
            <span class="loomos-kicker">LoomOS Builder</span>
            <h1>Build a tracker without living in JSON.</h1>
            <p>Import a complete Loom Pack, tune its modules and layout, then preview and install it. Advanced source editing stays available when you need full control.</p>
          </div>
          <span class="loomos-status-pill ${state ? "is-ready" : ""}">
            ${state ? "Exact-swipe state ready" : "Previewing without live state"}
          </span>
        </div>

        <div class="loomos-setup-summary" aria-label="Active setup summary">
          <article><span>Active theme</span><strong>${escapeHtml(activeTheme?.meta.name ?? "Native tracker")}</strong></article>
          <article><span>Visible widgets</span><strong>${counts.widgets}</strong></article>
          <article><span>Tracked modules</span><strong>${counts.tracked}</strong></article>
          <article><span>Injection</span><strong>${settings.injectionEnabled ? `On · ${counts.injected} modules` : "Off"}</strong></article>
        </div>

        <section class="loomos-workshop-section">
          <div class="loomos-section-heading">
            <div><span class="loomos-kicker">Start here</span><h2>Common workflows</h2></div>
          </div>
          <div class="loomos-workshop-quick-grid">
            ${quickAction("import", "Import Loom Pack", "Bring in a portable tracker package or artifact.")}
            ${quickAction("open-export-pack", "Export Loom Pack", "Bundle artifacts, layout, and active settings.")}
            ${quickAction("create", "New Tracker Blueprint", "Start a complete modules, theme, and settings package.", "blueprint")}
            ${quickAction("open-active-setup", "Open Active Setup", "Manage every tracked, displayed, and injected module.")}
            ${quickAction("preview-tracker", "Preview Tracker", "Compare theme and native output across screen sizes.")}
          </div>
        </section>

        <details class="loomos-workshop-disclosure">
          <summary>
            <span><strong>AI Creator</strong><small>Create or refine a module, theme, or blueprint.</small></span>
            <span aria-hidden="true">+</span>
          </summary>
          ${aiHtml(true)}
        </details>
      </section>`;
  }

  function artifactKindLabel(kind: LoomOSArtifact["kind"]): string {
    if (kind === "blueprint") return "Tracker Blueprint";
    if (kind === "module") return "Tracking Module";
    return "Visual Theme";
  }

  function packsHtml(): string {
    const records = library.records;
    return `
      <section class="loomos-workshop-panel">
        <div class="loomos-workshop-heading">
          <div>
            <span class="loomos-kicker">Portable library</span>
            <h2>Packs and artifacts</h2>
            <p class="loomos-workshop-lede">A Loom Pack is the shareable package. Blueprints, Modules, and Themes are the editable artifacts inside it.</p>
          </div>
          <div class="loomos-workshop-actions">
            <button type="button" class="loomos-button loomos-button-primary" data-workshop-action="import">Import Loom Pack</button>
            <button type="button" class="loomos-button" data-workshop-action="open-export-pack">Export Loom Pack</button>
          </div>
        </div>

        <div class="loomos-artifact-glossary" aria-label="Artifact types">
          <article><strong>Loom Pack</strong><span>Portable full package with artifacts and optional setup preset.</span></article>
          <article><strong>Blueprint</strong><span>Complete tracker setup artifact with Modules, Theme, and settings.</span></article>
          <article><strong>Module</strong><span>One tracking contract, prompt, and presentation.</span></article>
          <article><strong>Theme</strong><span>Visual shell for the tracker stage.</span></article>
          <article><strong>Legacy Module Preset</strong><span>Older stock Track, Display, and Inject toggle snapshot.</span></article>
        </div>

        <div class="loomos-filter-bar">
          <label class="loomos-filter-search">
            <span class="sr-only">Search artifacts</span>
            <input class="loomos-input" type="search" placeholder="Search name, tag, or description" value="${escapeHtml(packQuery)}" data-workshop-search>
          </label>
          <label>
            <span>Type</span>
            <select class="loomos-select" data-pack-kind-filter>
              <option value="all"${packKindFilter === "all" ? " selected" : ""}>All artifacts</option>
              <option value="blueprint"${packKindFilter === "blueprint" ? " selected" : ""}>Blueprints</option>
              <option value="module"${packKindFilter === "module" ? " selected" : ""}>Modules</option>
              <option value="theme"${packKindFilter === "theme" ? " selected" : ""}>Themes</option>
            </select>
          </label>
        </div>

        <div class="loomos-artifact-card-grid" data-workshop-library>
          ${records.length === 0 ? `
            <div class="loomos-empty">
              <h3>Your Workshop is empty</h3>
              <p>Import a Loom Pack, paste an artifact, or create a new Blueprint.</p>
            </div>
          ` : records.map((record) => {
            const artifact = record.artifact;
            const active = installedArtifact(artifact);
            return `
              <article class="loomos-artifact-card${selectedId === artifact.id ? " is-selected" : ""}"
                data-artifact-row
                data-kind="${artifact.kind}"
                data-search="${escapeHtml(`${artifact.meta.name} ${artifact.meta.description} ${artifact.kind} ${artifact.meta.tags.join(" ")}`.toLowerCase())}">
                <button type="button" class="loomos-artifact-card-main" data-workshop-action="select" data-artifact-id="${escapeHtml(artifact.id)}">
                  <span class="loomos-artifact-kind">${escapeHtml(artifactKindLabel(artifact.kind))}</span>
                  <strong>${escapeHtml(artifact.meta.name)}</strong>
                  <span>${escapeHtml(artifact.meta.description || "No description")}</span>
                </button>
                <div class="loomos-artifact-card-badges">
                  ${active ? `<span class="loomos-badge loomos-badge-ok">Installed</span>` : ""}
                  <span class="loomos-badge">r${record.revision}</span>
                  <span class="loomos-badge">${new Date(artifact.updatedAt).toLocaleDateString()}</span>
                </div>
                <div class="loomos-artifact-card-actions">
                  <button type="button" class="loomos-button" data-workshop-action="preview-artifact" data-artifact-id="${escapeHtml(artifact.id)}">Preview</button>
                  <button type="button" class="loomos-button" data-workshop-action="edit-artifact" data-artifact-id="${escapeHtml(artifact.id)}">Edit</button>
                  <button type="button" class="loomos-button" data-workshop-action="export-artifact" data-artifact-id="${escapeHtml(artifact.id)}">Export</button>
                  <button type="button" class="loomos-button" data-workshop-action="duplicate-artifact" data-artifact-id="${escapeHtml(artifact.id)}">Duplicate</button>
                  <button type="button" class="loomos-button loomos-button-primary" data-workshop-action="install-artifact" data-artifact-id="${escapeHtml(artifact.id)}">Install</button>
                  <button type="button" class="loomos-button loomos-button-danger" data-workshop-action="delete-artifact" data-artifact-id="${escapeHtml(artifact.id)}">Delete</button>
                </div>
              </article>`;
          }).join("")}
        </div>

        ${settings.customModulePresets.length > 0 ? `
          <details class="loomos-workshop-disclosure">
            <summary><span><strong>Legacy Module Presets</strong><small>${settings.customModulePresets.length} saved toggle presets remain available in Setup.</small></span><span aria-hidden="true">+</span></summary>
            <div class="loomos-legacy-preset-list">
              ${settings.customModulePresets.map((preset) => `
                <article><strong>${escapeHtml(preset.name)}</strong><span>${escapeHtml(preset.description || "Stock module toggle preset")}</span></article>
              `).join("")}
            </div>
          </details>
        ` : ""}
      </section>`;
  }

  function aiHtml(embedded = false): string {
    const kind = workingArtifact?.kind ?? aiKind;
    const changed = stagedArtifact ? changedTopLevelKeys(workingArtifact, stagedArtifact) : [];
    return `
      <section class="${embedded ? "loomos-ai-creator loomos-ai-creator-embedded" : "loomos-workshop-panel loomos-ai-creator"}">
        <div class="loomos-workshop-heading">
          <div>
            <span class="loomos-kicker">Built-in creator</span>
            <h2>${workingArtifact ? `Refine ${escapeHtml(workingArtifact.meta.name)}` : "Create an artifact with AI"}</h2>
          </div>
          <button type="button" class="loomos-button" data-workshop-action="copy-builder-prompt">Copy External AI Prompt</button>
        </div>
        <div class="loomos-ai-kind-row" role="group" aria-label="Artifact type">
          ${(["module", "theme", "blueprint"] as const).map((value) => `
            <button type="button" data-workshop-action="ai-kind" data-kind="${value}" class="${kind === value ? "active" : ""}"${workingArtifact ? " disabled" : ""}>${value}</button>
          `).join("")}
        </div>
        <label class="loomos-field">
          <span>What should LoomOS build or change?</span>
          <textarea class="loomos-input loomos-ai-brief" data-ai-brief placeholder="Describe the tracker data, interface, visual direction, interactions, and mobile priorities."></textarea>
        </label>
        <div class="loomos-workshop-actions">
          ${generationRequestId
            ? `<button type="button" class="loomos-button loomos-button-danger" data-workshop-action="cancel-ai">Stop <span data-workshop-elapsed>${Math.floor(generationElapsedMs / 1000)}s</span></button>`
            : `<button type="button" class="loomos-button loomos-button-primary" data-workshop-action="generate-ai"${settings.connectionId === "" ? "" : ""}>${workingArtifact ? "Generate Revision" : "Generate Draft"}</button>`
          }
          <span class="loomos-workshop-live-status">${escapeHtml(generationStatus || "AI output is staged until you accept it.")}</span>
        </div>
        ${stagedArtifact ? `
          <section class="loomos-ai-stage">
            <div>
              <span class="loomos-kicker">Validated draft</span>
              <h3>${escapeHtml(stagedArtifact.meta.name)}</h3>
              <p>Changed: ${changed.map(escapeHtml).join(", ") || "new artifact"}</p>
            </div>
            <div class="loomos-workshop-actions">
              <button type="button" class="loomos-button" data-workshop-action="preview-stage">Preview</button>
              <button type="button" class="loomos-button loomos-button-primary" data-workshop-action="accept-stage">Accept Draft</button>
              <button type="button" class="loomos-button loomos-button-danger" data-workshop-action="discard-stage">Discard</button>
            </div>
          </section>
        ` : ""}
      </section>`;
  }

  function advancedCodeHtml(): string {
    if (!workingArtifact) {
      return `<div class="loomos-empty"><h3>Select or create an artifact</h3><p>Advanced Code exposes every portable artifact field without changing the last valid revision until validation succeeds.</p></div>`;
    }
    const sections = codeSections(workingArtifact);
    return `
      <section class="loomos-workshop-panel loomos-code-studio">
        <div class="loomos-advanced-notice">
          <strong>Advanced developer workspace</strong>
          <span>Edit raw JSON, prompt text, HTML, CSS, JavaScript, partials, and sample data. Invalid drafts stay local and never replace the last valid artifact.</span>
        </div>
        <div class="loomos-workshop-heading">
          <div><span class="loomos-kicker">${escapeHtml(workingArtifact.kind)} source</span><h2>${escapeHtml(workingArtifact.meta.name)}</h2></div>
          <span class="loomos-badge">CodeMirror 6</span>
        </div>
        <nav class="loomos-code-files" aria-label="Artifact files">
          ${sections.map((section) => `
            <button type="button" data-workshop-action="code-section" data-code-section="${section.id}" class="${codeSection === section.id ? "active" : ""}">${escapeHtml(section.label)}</button>
          `).join("")}
        </nav>
        <div class="loomos-code-editor-host" data-code-editor></div>
        <p class="loomos-dialog-error" data-code-error role="alert">${escapeHtml(codeError)}</p>
        <div class="loomos-workshop-actions">
          <button type="button" class="loomos-button" data-workshop-action="format-code">Format JSON</button>
          <button type="button" class="loomos-button" data-workshop-action="validate">Validate</button>
          <button type="button" class="loomos-button loomos-button-primary" data-workshop-action="save" data-workshop-code-save${codeDirty ? "" : " disabled"}>Save Revision</button>
        </div>
      </section>`;
  }

  function visualFieldCard(field: VisualField, index: number): string {
    const types = [
      "text", "longText", "number", "integer", "boolean", "enum", "gauge", "chips", "list",
      "object", "array", "character-linked", "item-linked", "timeline-event", "relationship-edge",
    ];
    return `
      <article class="loomos-visual-field-card" data-visual-field>
        <div class="loomos-visual-field-heading">
          <strong>Field ${index + 1}</strong>
          <div class="loomos-field-card-actions">
            <button type="button" class="loomos-button" data-workshop-action="move-field-up" data-field-index="${index}" aria-label="Move field up">Up</button>
            <button type="button" class="loomos-button" data-workshop-action="move-field-down" data-field-index="${index}" aria-label="Move field down">Down</button>
            <button type="button" class="loomos-button loomos-button-danger" data-workshop-action="delete-field" data-field-index="${index}">Delete</button>
          </div>
        </div>
        <div class="loomos-visual-form-grid">
          <label><span>Key</span><input class="loomos-input" data-field-property="key" value="${escapeHtml(field.key)}"></label>
          <label><span>Label</span><input class="loomos-input" data-field-property="label" value="${escapeHtml(field.label)}"></label>
          <label><span>Type</span><select class="loomos-select" data-field-property="type">
            ${types.map((type) => `<option value="${type}"${field.type === type ? " selected" : ""}>${type}</option>`).join("")}
          </select></label>
          <label class="loomos-widget-switch"><input type="checkbox" data-field-property="required"${field.required ? " checked" : ""}><span>Required</span></label>
          <label class="loomos-visual-span"><span>Description / help</span><input class="loomos-input" data-field-property="description" value="${escapeHtml(field.description)}"></label>
          <label><span>Default</span><input class="loomos-input" data-field-property="default" value="${escapeHtml(field.defaultValue === undefined ? "" : String(field.defaultValue))}"></label>
          <label><span>Enum choices</span><input class="loomos-input" data-field-property="enum" value="${escapeHtml(field.enumOptions.join(", "))}" placeholder="calm, tense, critical"></label>
          <label><span>Minimum</span><input type="number" class="loomos-input" data-field-property="min" value="${field.min ?? ""}"></label>
          <label><span>Maximum</span><input type="number" class="loomos-input" data-field-property="max" value="${field.max ?? ""}"></label>
          <label><span>Max items</span><input type="number" min="1" max="80" class="loomos-input" data-field-property="maxItems" value="${field.maxItems ?? ""}"></label>
        </div>
      </article>`;
  }

  function moduleBuilderHtml(module: ModuleCapsuleArtifact): string {
    const parsed = parseJsonSchemaToVisualFields(module.schema, module.visual?.fieldTypes);
    const visual = module.visual ?? {
      trackingPurpose: module.meta.description,
      outputMode: module.view.html ? "template" as const : "cards" as const,
      slotRecommendation: "main",
      displayModeRecommendation: "card" as const,
      tokenPriorityRecommendation: 5,
      fieldTypes: {},
    };
    return `
      <section class="loomos-visual-builder" data-visual-builder="module">
        <div class="loomos-workshop-heading">
          <div><span class="loomos-kicker">Guided artifact editor</span><h2>Module Builder</h2>
          <p class="loomos-workshop-lede">Visual controls write the same v2 Module artifact used by Advanced Code.</p></div>
          <div class="loomos-workshop-actions">
            <button type="button" class="loomos-button" data-workshop-action="open-advanced-code">Advanced Code</button>
            <button type="button" class="loomos-button loomos-button-primary" data-workshop-action="save-context" data-workshop-code-save${codeDirty ? "" : " disabled"}>Save Revision</button>
          </div>
        </div>
        <p class="loomos-dialog-error" data-visual-error role="alert">${escapeHtml(visualError)}</p>
        <details open class="loomos-builder-section">
          <summary><strong>Identity and purpose</strong><span>Names, ownership, and compiler intent</span></summary>
          <div class="loomos-visual-form-grid">
            <label><span>Name</span><input class="loomos-input" data-visual-input="name" value="${escapeHtml(module.meta.name)}"></label>
            <label><span>Author</span><input class="loomos-input" data-visual-input="author" value="${escapeHtml(module.meta.author || "User")}"></label>
            <label class="loomos-visual-span"><span>Description</span><textarea class="loomos-input" data-visual-input="description">${escapeHtml(module.meta.description)}</textarea></label>
            <label class="loomos-visual-span"><span>Tags</span><input class="loomos-input" data-visual-input="tags" value="${escapeHtml(module.meta.tags.join(", "))}"></label>
            <label><span>Group</span><input class="loomos-input" data-visual-input="group" value="${escapeHtml(module.defaults.group)}"></label>
            <label><span>Output mode</span><select class="loomos-select" data-visual-input="outputMode">${["cards", "bullets", "chips", "gauge", "template"].map((value) => `<option${visual.outputMode === value ? " selected" : ""}>${value}</option>`).join("")}</select></label>
            <label class="loomos-visual-span"><span>Tracking purpose</span><textarea class="loomos-input" data-visual-input="trackingPurpose">${escapeHtml(visual.trackingPurpose)}</textarea></label>
            <label class="loomos-visual-span"><span>Compiler instruction</span><textarea class="loomos-input loomos-builder-prompt" data-visual-input="prompt">${escapeHtml(module.prompt)}</textarea></label>
          </div>
        </details>
        <details open class="loomos-builder-section">
          <summary><strong>Defaults and placement</strong><span>Install recommendations</span></summary>
          <div class="loomos-visual-form-grid">
            <label class="loomos-widget-switch"><input type="checkbox" data-visual-input="track"${module.defaults.track ? " checked" : ""}><span>Track</span></label>
            <label class="loomos-widget-switch"><input type="checkbox" data-visual-input="display"${module.defaults.display ? " checked" : ""}><span>Display</span></label>
            <label class="loomos-widget-switch"><input type="checkbox" data-visual-input="inject"${module.defaults.inject ? " checked" : ""}><span>Inject</span></label>
            <label><span>Display order</span><input type="number" class="loomos-input" data-visual-input="displayOrder" value="${module.defaults.displayOrder}"></label>
            <label><span>Intensity</span><select class="loomos-select" data-visual-input="intensity">${["light", "medium", "heavy", "experimental"].map((value) => `<option${module.defaults.intensity === value ? " selected" : ""}>${value}</option>`).join("")}</select></label>
            <label><span>Max items</span><input type="number" min="1" max="80" class="loomos-input" data-visual-input="maxItems" value="${module.defaults.maxItems}"></label>
            <label><span>Slot</span><input class="loomos-input" data-visual-input="slotRecommendation" value="${escapeHtml(visual.slotRecommendation)}"></label>
            <label><span>Display mode</span><select class="loomos-select" data-visual-input="displayModeRecommendation">${["hero", "card", "compact", "rail", "timeline", "hidden"].map((value) => `<option${visual.displayModeRecommendation === value ? " selected" : ""}>${value}</option>`).join("")}</select></label>
            <label><span>Token priority</span><input type="number" min="0" max="100" class="loomos-input" data-visual-input="tokenPriorityRecommendation" value="${visual.tokenPriorityRecommendation}"></label>
          </div>
        </details>
        <details open class="loomos-builder-section">
          <summary><strong>Field Builder</strong><span>${parsed.mode === "visual" ? `${parsed.fields.length} visual fields` : "Advanced schema required"}</span></summary>
          ${parsed.mode === "advanced" ? `<div class="loomos-inline-warning"><strong>Advanced schema required.</strong> ${escapeHtml(parsed.reason)} The existing schema is preserved until edited in Advanced Code.</div>` : `
            <div class="loomos-workshop-actions"><button type="button" class="loomos-button loomos-button-primary" data-workshop-action="add-field">Add field</button></div>
            <div class="loomos-visual-field-list">${parsed.fields.map(visualFieldCard).join("")}</div>
          `}
          <label class="loomos-widget-switch"><input type="checkbox" data-visual-input="advancedSchema"${parsed.mode === "advanced" ? " checked disabled" : ""}><span>Advanced schema mode</span></label>
        </details>
        <details class="loomos-builder-section">
          <summary><strong>Sample data and presentation</strong><span>Preview content and optional custom HTML/CSS</span></summary>
          <label class="loomos-field"><span>Sample data JSON</span><textarea class="loomos-input loomos-portable-json" data-visual-input="sampleData">${escapeHtml(JSON.stringify(module.sampleData, null, 2))}</textarea></label>
          <div class="loomos-module-builder-preview">
            <article>
              <span class="loomos-kicker">Native card preview</span>
              <h3>${escapeHtml(module.meta.name)}</h3>
              <p>${escapeHtml(module.meta.description)}</p>
              <pre>${escapeHtml(JSON.stringify(sampleForArtifact(module), null, 2))}</pre>
            </article>
            <article>
              <span class="loomos-kicker">Generated schema</span>
              <strong>${parsed.mode === "visual" ? `${parsed.fields.length} fields · ${parsed.fields.filter((field) => field.required).length} required` : "Advanced schema"}</strong>
              <p>Estimated compiler instruction size: ${Math.ceil(module.prompt.length / 4)} tokens.</p>
            </article>
          </div>
          ${module.view.html || module.view.css ? `<div class="loomos-source-summary"><strong>Custom presentation detected</strong><span>HTML ${module.view.html.length} chars · CSS ${module.view.css.length} chars</span><button type="button" class="loomos-button" data-workshop-action="open-advanced-code">Edit HTML/CSS</button></div>` : ""}
        </details>
      </section>`;
  }

  function modulesHtml(): string {
    const layout = settings.layout;
    if (!layout) {
      return `<div class="loomos-empty"><h3>No module layout found</h3><p>Reset Layout to rebuild module cards from current settings.</p></div>`;
    }
    const catalog = getEffectiveModuleCatalog(settings);
    const groups = [...new Set([
      ...catalog.map((module) => module.group),
      ...settings.customModules.map((module) => module.group),
    ])].sort();
    const builder = workingArtifact?.kind === "module" ? moduleBuilderHtml(workingArtifact) : "";
    return `
      <section class="loomos-workshop-panel loomos-modules-studio">
        ${builder}
        <div class="loomos-workshop-heading">
          <div>
            <span class="loomos-kicker">Unified module manager</span>
            <h2>Modules</h2>
            <p class="loomos-workshop-lede">Track controls compiler output, Display controls the tracker UI, and Inject controls future roleplay context.</p>
          </div>
          <button type="button" class="loomos-button loomos-button-primary" data-workshop-action="save-context" data-workshop-settings-save${settingsDirty ? "" : " disabled"}>Save Modules</button>
        </div>
        <div class="loomos-filter-bar loomos-module-filter-bar">
          <label class="loomos-filter-search">
            <span class="sr-only">Search modules</span>
            <input class="loomos-input" type="search" placeholder="Search modules" value="${escapeHtml(moduleQuery)}" data-module-filter="search">
          </label>
          <label><span>Source</span><select class="loomos-select" data-module-filter="source">
            ${["all", "stock", "custom", "artifact"].map((value) =>
              `<option value="${value}"${moduleSourceFilter === value ? " selected" : ""}>${value === "all" ? "All sources" : value}</option>`
            ).join("")}
          </select></label>
          <label><span>Group</span><select class="loomos-select" data-module-filter="group">
            <option value="all"${moduleGroupFilter === "all" ? " selected" : ""}>All groups</option>
            ${groups.map((group) => `<option value="${escapeHtml(group)}"${moduleGroupFilter === group ? " selected" : ""}>${escapeHtml(group)}</option>`).join("")}
          </select></label>
          <label><span>Status</span><select class="loomos-select" data-module-filter="status">
            ${[
              ["all", "All statuses"],
              ["tracked", "Tracked"],
              ["displayed", "Displayed"],
              ["injected", "Injected"],
              ["warning", "Needs attention"],
            ].map(([value, label]) =>
              `<option value="${value}"${moduleStatusFilter === value ? " selected" : ""}>${label}</option>`
            ).join("")}
          </select></label>
        </div>
        <div class="loomos-module-card-list">
          ${layout.widgets.map((widget) => renderWidgetEditorCard(widget, layout.slots, "modules")).join("")}
        </div>
      </section>`;
  }

  function themeSlotWarnings(theme: ThemeArtifact): string[] {
    const available = new Set(settings.layout?.slots.map((slot) => slot.id) ?? []);
    return (theme.manifest.slots ?? [])
      .filter((slot) => !available.has(slot))
      .map((slot) => `Theme references missing layout slot "${slot}".`);
  }

  function themeManifestHtml(theme: ThemeArtifact): string {
    return `
      <dl class="loomos-theme-manifest">
        <div><dt>Slots</dt><dd>${escapeHtml(theme.manifest.slots?.join(", ") || "Monolithic / no declared slots")}</dd></div>
        <div><dt>Developer Mode</dt><dd>${theme.manifest.developerMode ? "Required for interactive JavaScript" : "Not required"}</dd></div>
        <div><dt>Capabilities</dt><dd>${escapeHtml(theme.manifest.capabilities.join(", ") || "None")}</dd></div>
        <div><dt>Color scheme</dt><dd>${escapeHtml(theme.manifest.preferredColorScheme)}</dd></div>
        <div><dt>Minimum width</dt><dd>${theme.manifest.minWidth}px</dd></div>
      </dl>`;
  }

  function themeBuilderHtml(theme: ThemeArtifact): string {
    const design = ThemeDesignSchema.parse(theme.design ?? {});
    const tokenLabels: Array<[keyof typeof design.tokens, string]> = [
      ["bg", "Background"], ["panel", "Panel"], ["card", "Card"], ["text", "Text"],
      ["muted", "Muted"], ["accent", "Accent"], ["danger", "Danger"], ["warning", "Warning"],
      ["success", "Success"], ["border", "Border"], ["radiusSm", "Radius small"],
      ["radiusMd", "Radius medium"], ["radiusLg", "Radius large"], ["gap", "Spacing"],
      ["fontDisplay", "Display font"], ["fontBody", "Body font"],
    ];
    const capabilities: ThemeCapability[] = ["copy", "collapse", "navigation", "reload", "generation", "history"];
    return `
      <section class="loomos-visual-builder" data-visual-builder="theme">
        <div class="loomos-workshop-heading">
          <div><span class="loomos-kicker">Guided artifact editor</span><h2>Theme Builder</h2>
          <p class="loomos-workshop-lede">Manifest controls and safe design tokens update the same Theme artifact used by Advanced Code.</p></div>
          <div class="loomos-workshop-actions">
            <button type="button" class="loomos-button" data-workshop-action="open-advanced-code">Advanced Code</button>
            <button type="button" class="loomos-button loomos-button-primary" data-workshop-action="save-context" data-workshop-code-save${codeDirty ? "" : " disabled"}>Save Revision</button>
          </div>
        </div>
        <p class="loomos-dialog-error" data-visual-error role="alert">${escapeHtml(visualError)}</p>
        <details open class="loomos-builder-section">
          <summary><strong>Theme identity</strong><span>Metadata and runtime manifest</span></summary>
          <div class="loomos-visual-form-grid">
            <label><span>Name</span><input class="loomos-input" data-visual-input="name" value="${escapeHtml(theme.meta.name)}"></label>
            <label><span>Author</span><input class="loomos-input" data-visual-input="author" value="${escapeHtml(theme.meta.author || "User")}"></label>
            <label class="loomos-visual-span"><span>Description</span><textarea class="loomos-input" data-visual-input="description">${escapeHtml(theme.meta.description)}</textarea></label>
            <label class="loomos-visual-span"><span>Tags</span><input class="loomos-input" data-visual-input="tags" value="${escapeHtml(theme.meta.tags.join(", "))}"></label>
            <label><span>Preferred color scheme</span><select class="loomos-select" data-visual-input="preferredColorScheme">${["auto", "dark", "light"].map((value) => `<option${theme.manifest.preferredColorScheme === value ? " selected" : ""}>${value}</option>`).join("")}</select></label>
            <label><span>Minimum width</span><input type="number" min="280" max="2400" class="loomos-input" data-visual-input="minWidth" value="${theme.manifest.minWidth}"></label>
            <label class="loomos-widget-switch"><input type="checkbox" data-visual-input="developerMode"${theme.manifest.developerMode ? " checked" : ""}><span>Developer Mode</span></label>
            <label class="loomos-visual-span"><span>Declared slots</span><input class="loomos-input" data-visual-input="slots" value="${escapeHtml((theme.manifest.slots ?? []).join(", "))}" placeholder="hero, main, cast"></label>
          </div>
          <div class="loomos-capability-grid">${capabilities.map((capability) => `<label class="loomos-widget-switch"><input type="checkbox" data-theme-capability="${capability}"${theme.manifest.capabilities.includes(capability) ? " checked" : ""}><span>${capability}</span></label>`).join("")}</div>
        </details>
        <details open class="loomos-builder-section">
          <summary><strong>Design system</strong><span>Safe structured visual choices</span></summary>
          <div class="loomos-visual-form-grid">
            ${([
              ["typography", design.typography, ["system", "editorial", "compact", "technical"]],
              ["backgroundStyle", design.backgroundStyle, ["solid", "soft-gradient", "layered"]],
              ["panelStyle", design.panelStyle, ["flat", "raised", "glass"]],
              ["borderStyle", design.borderStyle, ["subtle", "strong", "none"]],
              ["density", design.density, ["compact", "comfortable", "spacious"]],
              ["headerStyle", design.headerStyle, ["plain", "accent-line", "panel"]],
              ["widgetStyle", design.widgetStyle, ["cards", "divided", "minimal"]],
              ["previewSurface", design.previewSurface, ["theme", "native"]],
            ] as const).map(([key, current, values]) => `<label><span>${key.replace(/([A-Z])/g, " $1")}</span><select class="loomos-select" data-visual-input="${key}">${values.map((value) => `<option${current === value ? " selected" : ""}>${value}</option>`).join("")}</select></label>`).join("")}
            <label class="loomos-visual-span"><span>Mobile behavior notes</span><textarea class="loomos-input" data-visual-input="mobileNotes">${escapeHtml(design.mobileNotes)}</textarea></label>
          </div>
        </details>
        <details open class="loomos-builder-section">
          <summary><strong>Design Tokens</strong><span>Local CSS variables only; no remote assets or URL values</span></summary>
          <div class="loomos-token-grid">${tokenLabels.map(([key, label]) => `<label><span>${label}</span><input class="loomos-input" data-design-token="${key}" value="${escapeHtml(design.tokens[key])}"></label>`).join("")}</div>
        </details>
      </section>`;
  }

  function themeHtml(): string {
    const themes = library.records.filter((record) => record.artifact.kind === "theme");
    const active = activeThemeRecord();
    const builder = workingArtifact?.kind === "theme" ? themeBuilderHtml(workingArtifact) : "";
    return `
      <section class="loomos-workshop-panel loomos-theme-studio">
        ${builder}
        <div class="loomos-workshop-heading">
          <div>
            <span class="loomos-kicker">Visual shell</span>
            <h2>Theme</h2>
            <p class="loomos-workshop-lede">Themes control the tracker stage only. Generate, Reload, History, and recovery remain native LoomOS controls.</p>
          </div>
          <button type="button" class="loomos-button" data-workshop-action="create" data-kind="theme">New Theme</button>
        </div>

        <article class="loomos-active-theme-card">
          <div>
            <span class="loomos-kicker">Active theme</span>
            <h3>${escapeHtml(active?.artifact.meta.name ?? "Native LoomOS tracker")}</h3>
            <p>${escapeHtml(active?.artifact.meta.description ?? "No custom Theme is active. The native tracker remains fully available.")}</p>
          </div>
          ${active ? `<button type="button" class="loomos-button" data-workshop-action="preview-artifact" data-artifact-id="${escapeHtml(active.artifact.id)}">Preview Active Theme</button>` : ""}
        </article>

        <div class="loomos-theme-library">
          ${themes.length === 0 ? `<div class="loomos-empty"><h3>No custom themes yet</h3><p>Import a Loom Pack or create a Theme artifact.</p></div>` : themes.map((record) => {
            const theme = record.artifact as ThemeArtifact;
            const warnings = themeSlotWarnings(theme);
            const isActive = theme.id === settings.activeThemeId;
            return `
              <article class="loomos-theme-card${isActive ? " is-active" : ""}">
                <div class="loomos-theme-card-heading">
                  <div><span class="loomos-artifact-kind">Theme</span><h3>${escapeHtml(theme.meta.name)}</h3></div>
                  ${isActive ? `<span class="loomos-badge loomos-badge-ok">Active</span>` : `<span class="loomos-badge">r${record.revision}</span>`}
                </div>
                <p>${escapeHtml(theme.meta.description || "No description")}</p>
                ${themeManifestHtml(theme)}
                ${warnings.length > 0 ? `<div class="loomos-inline-warning">${warnings.map(escapeHtml).join("<br>")}</div>` : ""}
                <div class="loomos-artifact-card-actions">
                  <button type="button" class="loomos-button" data-workshop-action="preview-artifact" data-artifact-id="${escapeHtml(theme.id)}">Preview</button>
                  <button type="button" class="loomos-button" data-workshop-action="edit-artifact" data-artifact-id="${escapeHtml(theme.id)}">Visual Builder</button>
                  <button type="button" class="loomos-button loomos-button-primary" data-workshop-action="install-artifact" data-artifact-id="${escapeHtml(theme.id)}">${isActive ? "Reinstall" : "Install & Activate"}</button>
                </div>
              </article>`;
          }).join("")}
        </div>
      </section>`;
  }

  function previewArtifact(): LoomOSArtifact | null {
    if (stagedArtifact) return stagedArtifact;
    if (workingArtifact) return workingArtifact;
    return activeThemeRecord()?.artifact ?? null;
  }

  function previewModelFor(
    artifact: LoomOSArtifact,
    dataMode: PreviewDataMode,
  ): Record<string, unknown> {
    const previewState = dataMode === "empty" ? null : state;
    const baseModel = enrichViewerModelWithLayout(
      buildViewerModel(previewState, settings, history, "Workshop preview"),
      previewState,
      settings,
    ) as unknown as Record<string, unknown>;
    if (artifact.kind === "module") {
      return {
        ...baseModel,
        data: dataMode === "empty" ? {} : sampleForArtifact(artifact),
        artifact: { id: artifact.id, meta: artifact.meta },
        meta: {
          ...(baseModel.meta as Record<string, unknown>),
          name: artifact.meta.name,
        },
      };
    }
    const sampleData = artifact.kind === "theme"
      ? artifact.sampleData
      : artifact.kind === "blueprint"
      ? artifact.theme?.sampleData
      : null;
    if (dataMode === "dense" && isRecord(sampleData)) {
      return {
        ...baseModel,
        ...sampleData,
        meta: {
          ...(baseModel.meta as Record<string, unknown>),
          ...(isRecord(sampleData.meta) ? sampleData.meta : {}),
        },
      };
    }
    return baseModel;
  }

  function previewDocument(
    artifact: LoomOSArtifact,
    dataMode: PreviewDataMode = previewDataMode,
  ): string {
    const previewTheme = previewThemeForArtifact(artifact);
    if (!previewTheme) {
      return `<!doctype html><body style="font-family:system-ui;background:#111;color:#eee;padding:20px"><h2>This Blueprint has no theme to preview.</h2></body>`;
    }
    const model = previewModelFor(artifact, dataMode);
    return buildWorkshopThemePreviewDocument(
      previewTheme,
      model as unknown as ReturnType<typeof buildViewerModel>,
      settings.developerMode,
      `preview-${artifact.id}`,
    );
  }

  function nativePreviewDocument(dataMode: PreviewDataMode = previewDataMode): string {
    return buildWorkshopNativePreviewDocument(state, settings, history, dataMode);
  }

  function diagnosticsSummaryHtml(): string {
    const artifact = previewArtifact();
    const artifactRows = artifact ? diagnosticsFor(artifact) : [];
    const theme = artifact
      ? previewThemeForArtifact(artifact)
      : activeThemeRecord()?.artifact as ThemeArtifact | undefined;
    const layoutRows = settings.layout
      ? inspectLayoutDiagnostics(settings.layout, settings, theme ?? null)
      : [];
    const errors = artifactRows.filter((row) => row.level === "error").length;
    const warnings = artifactRows.filter((row) => row.level === "warning").length + layoutRows.length;
    return `
      <div class="loomos-preview-diagnostics">
        <div><strong>${errors}</strong><span>Errors</span></div>
        <div><strong>${warnings}</strong><span>Warnings</span></div>
        <div><strong>${settings.layout?.widgets.filter((widget) => widget.display).length ?? 0}</strong><span>Visible</span></div>
      </div>
      ${layoutRows.slice(0, 3).map((row) => `<p class="loomos-preview-warning">${escapeHtml(row.message)}</p>`).join("")}`;
  }

  function previewFrameHtml(
    surface: PreviewSurface = previewSurface,
    dataMode: PreviewDataMode = previewDataMode,
    compact = false,
  ): string {
    const artifact = previewArtifact();
    if (surface === "theme" && !artifact) {
      return `<div class="loomos-empty"><h3>No Theme to preview</h3><p>Select a Theme, Module, or Blueprint from Packs.</p></div>`;
    }
    return `
      <div class="loomos-preview-stage is-${previewSize}${compact ? " is-compact" : ""}">
        <iframe title="${surface === "native" ? "Native tracker preview" : "Theme preview"}"
          sandbox="allow-scripts"
          data-workshop-preview-frame
          data-preview-surface="${surface}"
          data-preview-mode="${dataMode}"></iframe>
      </div>`;
  }

  function testLabHtml(): string {
    const artifact = previewArtifact();
    const theme = artifact ? previewThemeForArtifact(artifact) : null;
    const themeDiagnostics = theme ? inspectThemeComplexity(theme) : [];
    const layoutDiagnostics = settings.layout
      ? inspectLayoutDiagnostics(settings.layout, settings, theme)
      : [];
    return `
      <section class="loomos-workshop-panel loomos-test-lab">
        <div class="loomos-workshop-heading">
          <div>
            <span class="loomos-kicker">Safe preview workspace</span>
            <h2>Test Lab</h2>
            <p class="loomos-workshop-lede">Compare the isolated Theme and native tracker without duplicating native Generate, Reload, or History controls.</p>
          </div>
        </div>
        <div class="loomos-test-controls">
          <div>
            <span>Preview</span>
            <div class="loomos-segmented" role="group" aria-label="Preview surface">
              ${(["theme", "native"] as const).map((surface) => `<button type="button" data-workshop-action="preview-surface" data-surface="${surface}" class="${previewSurface === surface ? "active" : ""}">${surface === "theme" ? "Theme" : "Native"}</button>`).join("")}
            </div>
          </div>
          <div>
            <span>Viewport</span>
            <div class="loomos-segmented" role="group" aria-label="Preview size">
              ${(["mobile", "tablet", "desktop"] as const).map((size) => `<button type="button" data-workshop-action="preview-size" data-size="${size}" class="${previewSize === size ? "active" : ""}">${size}</button>`).join("")}
            </div>
          </div>
          <div>
            <span>Data</span>
            <div class="loomos-segmented" role="group" aria-label="Preview data">
              ${([
                ["current", "Current"],
                ["empty", "Empty"],
                ["dense", "Dense sample"],
              ] as const).map(([mode, label]) => `<button type="button" data-workshop-action="preview-data" data-data-mode="${mode}" class="${previewDataMode === mode ? "active" : ""}">${label}</button>`).join("")}
            </div>
          </div>
        </div>
        ${previewFrameHtml(previewSurface, previewDataMode)}
        <div class="loomos-test-diagnostic-grid">
          <section><h3>Layout diagnostics</h3>${layoutDiagnostics.length ? layoutDiagnostics.map((row) => `<p>${escapeHtml(row.message)}</p>`).join("") : `<p class="is-ok">Layout is internally consistent.</p>`}</section>
          <section><h3>Theme complexity</h3>${themeDiagnostics.length ? themeDiagnostics.map((row) => `<p>${escapeHtml(`${row.path}: ${row.message}`)}</p>`).join("") : `<p class="is-ok">No complexity warnings.</p>`}</section>
          <section><h3>Injection</h3><p>${settings.injectionEnabled ? `Enabled with a ${settings.injectionTokenBudget}-token budget. Exact injection text remains available in Setup.` : "Disabled for normal roleplay generations."}</p></section>
        </div>
      </section>`;
  }

  function captureLayoutFromDOM(sendChanges: boolean): boolean {
    const container = modal.root.querySelector(".loomos-workshop-center");
    if (!container || !settings.layout) return false;

    const widgetCards = container.querySelectorAll(".loomos-widget-editor-card");
    const patches: WidgetControlPatch[] = [];
    widgetCards.forEach((card) => {
      const widgetId = (card as HTMLElement).dataset.widgetId;
      if (!widgetId) return;
      const trackInput = card.querySelector("[data-widget-property='track']") as HTMLInputElement;
      const displayInput = card.querySelector("[data-widget-property='display']") as HTMLInputElement;
      const injectInput = card.querySelector("[data-widget-property='inject']") as HTMLInputElement;
      const slotSelect = card.querySelector("[data-widget-property='slot']") as HTMLSelectElement;
      const displayModeSelect = card.querySelector("[data-widget-property='displayMode']") as HTMLSelectElement;
      const priorityInput = card.querySelector("[data-widget-property='tokenPriority']") as HTMLInputElement;
      const orderInput = card.querySelector("[data-widget-property='order']") as HTMLInputElement;

      patches.push({
        id: widgetId,
        ...(trackInput ? { track: trackInput.checked } : {}),
        ...(displayInput ? { display: displayInput.checked } : {}),
        ...(injectInput ? { inject: injectInput.checked } : {}),
        ...(slotSelect ? { slot: slotSelect.value } : {}),
        ...(displayModeSelect
          ? { displayMode: displayModeSelect.value as WidgetControlPatch["displayMode"] }
          : {}),
        ...(priorityInput ? { tokenPriority: Number(priorityInput.value) || 0 } : {}),
        ...(orderInput ? { order: Number(orderInput.value) || 0 } : {}),
      });
    });

    const responsiveModeSelect = container.querySelector("[data-layout-input='responsive-mode']") as HTMLSelectElement;
    const responsiveMode = (responsiveModeSelect?.value
      ?? settings.layout.responsiveMode) as NonNullable<LoomOSSettings["layout"]>["responsiveMode"];
    settings = applyWorkshopLayoutEdits(settings, patches, responsiveMode);
    if (sendChanges) {
      options.send({
        type: "save_settings",
        requestId: options.requestId("layout-save"),
        settings,
      });
      settingsDirty = false;
      options.onStatus(activeView === "modules" ? "Module settings saved" : "Dashboard layout saved");
      render();
    }
    return true;
  }

  function saveLayoutFromDOM(): void {
    captureLayoutFromDOM(true);
  }

  function renderWidgetEditorCard(
    w: any,
    slots: any[],
    context: "layout" | "modules" = "layout",
  ): string {
    const slotsOptions = slots.map(s => `
      <option value="${s.id}" ${w.slot === s.id ? "selected" : ""}>${escapeHtml(s.label)}</option>
    `).join("");

    const displayModes = ["hero", "card", "compact", "rail", "timeline", "hidden"];
    const modeOptions = displayModes.map(m => `
      <option value="${m}" ${w.displayMode === m ? "selected" : ""}>${m}</option>
    `).join("");

    const stockMeta = w.source === "stock"
      ? getEffectiveModuleCatalog(settings).find((module) => module.key === w.moduleId)
      : null;
    const customMeta = settings.customModules.find((module) =>
      module.id === w.moduleId || module.artifactId === w.moduleId
    );
    const group = stockMeta?.group ?? customMeta?.group ?? "Custom";
    const core = w.source === "stock" && CORE_TRACKING_MODULES.has(w.moduleId as ModuleKey);
    const warning = (!w.track && (w.display || w.inject)) || (w.inject && !w.track);
    const status = w.track ? "tracked" : w.display ? "displayed" : w.inject ? "injected" : "inactive";
    const artifactId = customMeta?.artifactId;
    return `
      <div class="loomos-widget-editor-card${warning ? " has-warning" : ""}"
        data-widget-id="${escapeHtml(w.id)}"
        data-module-card
        data-source="${escapeHtml(w.source)}"
        data-group="${escapeHtml(group)}"
        data-status="${warning ? "warning" : status}"
        data-search="${escapeHtml(`${w.label} ${w.moduleId} ${group} ${w.source}`.toLowerCase())}">
        <div class="loomos-widget-card-heading">
          <div>
            <strong>${escapeHtml(w.label)}</strong>
            <span>${escapeHtml(group)}</span>
          </div>
          <div class="loomos-widget-card-badges">
            <span class="loomos-badge loomos-badge-source-${w.source}">${w.source}</span>
            ${core ? `<span class="loomos-badge">Core · Track locked</span>` : ""}
            ${warning ? `<span class="loomos-badge loomos-badge-warning">Needs attention</span>` : ""}
          </div>
        </div>
        <div class="loomos-widget-card-id-row">
          <code>${escapeHtml(w.moduleId)}</code>
          <span>${w.track ? "Tracked" : "Not tracked"} · ${w.display ? "Displayed" : "Hidden"} · ${w.inject ? "Injected" : "Not injected"}</span>
        </div>
        
        <div class="loomos-widget-card-controls">
          <div class="loomos-widget-control-switches">
            <label class="loomos-widget-switch">
              <input type="checkbox" data-widget-property="track" ${w.track ? "checked" : ""}${core ? " disabled" : ""}>
              <span>Track</span>
            </label>
            <label class="loomos-widget-switch">
              <input type="checkbox" data-widget-property="display" ${w.display ? "checked" : ""}>
              <span>Display</span>
            </label>
            <label class="loomos-widget-switch">
              <input type="checkbox" data-widget-property="inject" ${w.inject ? "checked" : ""}>
              <span>Inject</span>
            </label>
          </div>

          <div class="loomos-widget-selectors">
            <label>
              <span>Slot</span>
              <select data-widget-property="slot" class="loomos-select">
                ${slotsOptions}
              </select>
            </label>

            <label>
              <span>Display Mode</span>
              <select data-widget-property="displayMode" class="loomos-select">
                ${modeOptions}
              </select>
            </label>

            <label class="loomos-widget-priority">
              <span>Priority</span>
              <input type="number" data-widget-property="tokenPriority" class="loomos-input" value="${w.tokenPriority}">
            </label>

            <label class="loomos-widget-order">
              <span>Order</span>
              <input type="number" data-widget-property="order" class="loomos-input" value="${w.order}">
            </label>
          </div>
          ${context === "modules" ? `
            <div class="loomos-module-card-actions">
              ${artifactId ? `
                <button type="button" class="loomos-button" data-workshop-action="edit-artifact" data-artifact-id="${escapeHtml(artifactId)}">Edit Artifact</button>
                <button type="button" class="loomos-button" data-workshop-action="duplicate-artifact" data-artifact-id="${escapeHtml(artifactId)}">Duplicate</button>
                <button type="button" class="loomos-button loomos-button-danger" data-workshop-action="delete-artifact" data-artifact-id="${escapeHtml(artifactId)}">Delete</button>
              ` : `<span class="loomos-hint">${w.source === "stock" ? "Stock schema and prompt overrides remain available in Setup." : "Legacy custom module editing remains available in Setup."}</span>`}
            </div>
          ` : ""}
        </div>
      </div>
    `;
  }

  function layoutHtml(): string {
    const layout = settings.layout;
    if (!layout) {
      return `<div class="loomos-empty"><h3>No layout settings found</h3></div>`;
    }

    const theme = selectedRecord()?.artifact.kind === "theme" ? selectedRecord()?.artifact as ThemeArtifact : null;
    const diagnostics = inspectLayoutDiagnostics(layout, settings, theme);
    const activeWidgets = layout.widgets;

    const queryLower = layoutQuery.toLowerCase().trim();
    const filteredWidgets = activeWidgets.filter((w) =>
      w.label.toLowerCase().includes(queryLower) ||
      w.moduleId.toLowerCase().includes(queryLower)
    );

    const slots = layout.slots;

    return `
      <section class="loomos-workshop-panel loomos-layout-studio">
        <div class="loomos-workshop-heading">
          <div><span class="loomos-kicker">Interactive slot builder</span><h2>Dashboard Layout</h2></div>
          <div style="display:flex; gap:8px;">
            <button type="button" class="loomos-button loomos-btn-sm" data-layout-action="reset-layout" title="Reset layout to default settings">Reset Layout</button>
            <button type="button" class="loomos-button loomos-button-primary loomos-btn-sm" data-layout-action="save-layout" data-workshop-settings-save${settingsDirty ? "" : " disabled"}>Save Layout</button>
          </div>
        </div>

        ${diagnostics.length > 0 ? `
          <div class="loomos-layout-diagnostics">
            ${diagnostics.map(d => `
              <div class="loomos-layout-diag-item is-${d.severity}">
                <strong>${d.severity.toUpperCase()}:</strong> ${escapeHtml(d.message)}
              </div>
            `).join("")}
          </div>
        ` : ""}

        <div class="loomos-layout-controls">
          <div class="loomos-layout-search-row">
            <input type="text" placeholder="Search widgets..." class="loomos-input loomos-layout-search" value="${escapeHtml(layoutQuery)}" data-layout-input="search">
            <label class="loomos-checkbox-label" style="user-select:none; cursor:pointer;">
              <input type="checkbox" data-layout-input="group-by-slot" ${layoutGroupBySlot ? "checked" : ""}>
              <span>Group by slot</span>
            </label>
            <label class="loomos-layout-responsive-mode">
              <span>Responsive:</span>
              <select data-layout-input="responsive-mode" class="loomos-select">
                <option value="single-column" ${layout.responsiveMode === "single-column" ? "selected" : ""}>Single Column</option>
                <option value="adaptive-grid" ${layout.responsiveMode === "adaptive-grid" ? "selected" : ""}>Adaptive Grid</option>
                <option value="desktop-split" ${layout.responsiveMode === "desktop-split" ? "selected" : ""}>Desktop Split</option>
              </select>
            </label>
          </div>
        </div>

        <div class="loomos-layout-builder-container">
          ${layoutGroupBySlot ? `
            <div class="loomos-layout-slots-grid">
              ${slots.map(slot => {
                const slotWidgets = filteredWidgets.filter(w => w.slot === slot.id);
                return `
                  <div class="loomos-layout-slot-card" data-slot-id="${slot.id}">
                    <div class="loomos-layout-slot-header">
                      <strong>${escapeHtml(slot.label)}</strong>
                      <span class="loomos-badge">${slotWidgets.length}</span>
                    </div>
                    <p class="loomos-layout-slot-desc">${escapeHtml(slot.description)}</p>
                    <div class="loomos-layout-slot-widgets">
                      ${slotWidgets.length === 0 ? `<p class="loomos-muted" style="font-size:11px; padding:8px;">No widgets in this slot.</p>` : ""}
                      ${slotWidgets.map(w => renderWidgetEditorCard(w, slots)).join("")}
                    </div>
                  </div>
                `;
              }).join("")}
            </div>
          ` : `
            <div class="loomos-layout-widgets-list">
              ${filteredWidgets.length === 0 ? `<div class="loomos-empty"><h3>No widgets match search</h3></div>` : ""}
              ${filteredWidgets.map(w => renderWidgetEditorCard(w, slots)).join("")}
            </div>
          `}
        </div>
      </section>
    `;
  }

  function revisionsHtml(): string {
    const record = selectedRecord();
    if (!record) {
      return `<div class="loomos-empty"><h3>No saved revisions</h3><p>Save the artifact once to begin its revision history.</p></div>`;
    }
    return `
      <section class="loomos-workshop-panel">
        <div class="loomos-workshop-heading">
          <div><span class="loomos-kicker">Revision history</span><h2>${escapeHtml(record.artifact.meta.name)}</h2></div>
          <span class="loomos-badge">${record.revisions.length} snapshots</span>
        </div>
        <div class="loomos-revision-list loomos-revision-card-list">
          ${[...record.revisions].reverse().map((revision) => `
            <article class="loomos-revision-card">
              <div>
                <span class="loomos-artifact-kind">${escapeHtml(revision.artifact.kind)}</span>
                <strong>Revision ${revision.revision}</strong>
                <small>Saved ${new Date(revision.savedAt).toLocaleString()}</small>
              </div>
              <div class="loomos-revision-actions">
                <button type="button" class="loomos-button" data-workshop-action="duplicate-revision" data-revision="${revision.revision}">Duplicate</button>
                <button type="button" class="loomos-button loomos-button-primary" data-workshop-action="restore" data-revision="${revision.revision}">Restore</button>
              </div>
            </article>
          `).join("")}
        </div>
      </section>`;
  }

  function viewHtml(): string {
    if (activeView === "home") return homeHtml();
    if (activeView === "packs") return packsHtml();
    if (activeView === "modules") return modulesHtml();
    if (activeView === "layout") return layoutHtml();
    if (activeView === "theme") return themeHtml();
    if (activeView === "test-lab") return testLabHtml();
    if (activeView === "advanced-code") return advancedCodeHtml();
    return revisionsHtml();
  }

  function leftRailHtml(): string {
    const counts = setupCounts();
    const selected = selectedRecord()?.artifact;
    return `
      <aside class="loomos-workshop-rail">
        <div class="loomos-workshop-brand">
          <span class="loomos-kicker">LoomOS</span>
          <strong>Creator Workshop</strong>
          <small>Build, test, and install tracker systems.</small>
        </div>
        <nav class="loomos-workshop-nav" aria-label="Workshop sections">
          ${WORKSHOP_NAV.map((item) => `
            <button type="button" data-workshop-view="${item.id}" class="${activeView === item.id ? "active" : ""}">
              <strong>${item.label}</strong>
              <span>${item.description}</span>
            </button>
          `).join("")}
        </nav>
        <label class="loomos-rail-search">
          <span>Library search</span>
          <input class="loomos-input" type="search" placeholder="Find an artifact" value="${escapeHtml(railQuery)}" data-workshop-global-search>
        </label>
        <div class="loomos-rail-library">
          ${library.records.map((record) => `
            <button type="button" data-workshop-action="select" data-artifact-id="${escapeHtml(record.artifact.id)}"
              data-rail-artifact
              data-search="${escapeHtml(`${record.artifact.meta.name} ${record.artifact.kind}`.toLowerCase())}"
              class="${selectedId === record.artifact.id ? "active" : ""}">
              <span>${escapeHtml(record.artifact.meta.name)}</span><small>${escapeHtml(record.artifact.kind)}</small>
            </button>
          `).join("") || `<p class="loomos-muted">No saved artifacts.</p>`}
        </div>
        <button type="button" class="loomos-button loomos-rail-view-all" data-workshop-view="packs">View all in Packs</button>
        <div class="loomos-rail-summary">
          <span>Active setup</span>
          <strong>${escapeHtml(activeThemeRecord()?.artifact.meta.name ?? "Native tracker")}</strong>
          <small>${counts.tracked} tracked · ${counts.widgets} visible · injection ${settings.injectionEnabled ? "on" : "off"}</small>
          ${selected ? `<small>Selected: ${escapeHtml(selected.meta.name)}</small>` : ""}
        </div>
      </aside>`;
  }

  function rightPreviewHtml(): string {
    const artifact = previewArtifact();
    return `
      <aside class="loomos-workshop-preview-pane">
        <div class="loomos-preview-pane-heading">
          <div><span class="loomos-kicker">Live preview</span><strong>${escapeHtml(artifact?.meta.name ?? "Active setup")}</strong></div>
          <button type="button" class="loomos-button" data-workshop-action="preview-tracker">Open Test Lab</button>
        </div>
        <div class="loomos-preview-pane-controls">
          <div class="loomos-segmented" role="group" aria-label="Live preview surface">
            <button type="button" data-workshop-action="preview-surface" data-surface="theme" class="${previewSurface === "theme" ? "active" : ""}">Theme</button>
            <button type="button" data-workshop-action="preview-surface" data-surface="native" class="${previewSurface === "native" ? "active" : ""}">Native</button>
          </div>
          <span>${previewSize}</span>
        </div>
        ${previewFrameHtml(previewSurface, previewDataMode, true)}
        ${diagnosticsSummaryHtml()}
      </aside>`;
  }

  function mobilePreviewHtml(): string {
    if (!mobilePreviewOpen) return "";
    return `
      <section class="loomos-mobile-preview" role="dialog" aria-modal="true" aria-label="Workshop preview">
        <header>
          <div><span class="loomos-kicker">Preview</span><strong>${escapeHtml(previewArtifact()?.meta.name ?? "Active setup")}</strong></div>
          <button type="button" class="loomos-button" data-workshop-action="close-mobile-preview">Back to editor</button>
        </header>
        <div class="loomos-mobile-preview-controls">
          <div class="loomos-segmented" role="group" aria-label="Preview surface">
            <button type="button" data-workshop-action="preview-surface" data-surface="theme" class="${previewSurface === "theme" ? "active" : ""}">Theme</button>
            <button type="button" data-workshop-action="preview-surface" data-surface="native" class="${previewSurface === "native" ? "active" : ""}">Native</button>
          </div>
          <div class="loomos-segmented" role="group" aria-label="Preview size">
            ${(["mobile", "tablet", "desktop"] as const).map((size) => `<button type="button" data-workshop-action="preview-size" data-size="${size}" class="${previewSize === size ? "active" : ""}">${size}</button>`).join("")}
          </div>
        </div>
        ${previewFrameHtml(previewSurface, previewDataMode)}
      </section>`;
  }

  function syncMobilePreviewOverlay(): void {
    modal.root.querySelector(".loomos-mobile-preview")?.remove();
    if (!mobilePreviewOpen) return;
    const workshop = modal.root.querySelector(".loomos-workshop");
    workshop?.insertAdjacentHTML("beforeend", mobilePreviewHtml());
    mountPreviewFrames();
  }

  function mountPreviewFrames(): void {
    const artifact = previewArtifact();
    modal.root.querySelectorAll<HTMLIFrameElement>("[data-workshop-preview-frame]").forEach((iframe) => {
      const surface = iframe.dataset.previewSurface === "native" ? "native" : "theme";
      const dataMode = (iframe.dataset.previewMode ?? "current") as PreviewDataMode;
      if (surface === "native") {
        iframe.srcdoc = nativePreviewDocument(dataMode);
      } else if (artifact) {
        iframe.srcdoc = previewDocument(artifact, dataMode);
      }
    });
  }

  function updateDirtyActionState(): void {
    modal.root.querySelectorAll<HTMLButtonElement>("[data-workshop-settings-save]").forEach((button) => {
      button.disabled = !settingsDirty;
    });
    modal.root.querySelectorAll<HTMLButtonElement>("[data-workshop-code-save]").forEach((button) => {
      button.disabled = !codeDirty;
    });
    const contextSave = modal.root.querySelector<HTMLButtonElement>("[data-workshop-context-save]");
    if (contextSave) {
      contextSave.disabled = !workshopSaveTarget(
        activeView,
        Boolean(workingArtifact),
        settingsDirty,
        codeDirty,
      );
    }
  }

  function render(): void {
    if (destroyed) return;
    codeEditor?.destroy();
    codeEditor = null;
    modal.root.dataset.skin = settings.skin;
    const artifact = stagedArtifact ?? workingArtifact;
    const currentNav = WORKSHOP_NAV.find((item) => item.id === activeView)!;
    const saveTarget = workshopSaveTarget(activeView, Boolean(workingArtifact), settingsDirty, codeDirty);
    const activeTheme = activeThemeRecord()?.artifact as ThemeArtifact | undefined;
    const installTarget = workshopInstallTarget(
      activeView,
      workingArtifact,
      stagedArtifact,
      activeTheme ?? null,
    );
    const saveLabel = saveTarget === "artifact"
      ? "Save Revision"
      : activeView === "modules"
      ? "Save Modules"
      : activeView === "layout"
      ? "Save Layout"
      : "Save";
    const installLabel = installTarget?.kind === "theme" ? "Install Theme" : "Install";
    modal.root.innerHTML = `
      <div class="loomos-workshop">
        <header class="loomos-workshop-core">
          <button type="button" class="loomos-workshop-back" data-workshop-action="back" aria-label="${activeView === "home" ? "Close Workshop" : "Back to Workshop Home"}">Back</button>
          <div class="loomos-workshop-core-context">
            <span class="loomos-kicker">${escapeHtml(currentNav.label)}</span>
            <strong>${escapeHtml(artifact?.meta.name || "Active setup")}</strong>
            <small>${escapeHtml(currentNav.description)}</small>
          </div>
          <label class="loomos-mobile-view-select">
            <span class="sr-only">Workshop section</span>
            <select class="loomos-select" data-workshop-view-select>
              ${WORKSHOP_NAV.map((item) => `<option value="${item.id}"${activeView === item.id ? " selected" : ""}>${item.label}</option>`).join("")}
            </select>
          </label>
          <div class="loomos-workshop-core-actions">
            <button type="button" class="loomos-button" data-workshop-action="import">Import</button>
            <button type="button" class="loomos-button" data-workshop-action="close">Close</button>
          </div>
        </header>
        <div class="loomos-workshop-shell">
          ${leftRailHtml()}
          <main class="loomos-workshop-center">
            ${viewHtml()}
          </main>
          ${rightPreviewHtml()}
        </div>
        <footer class="loomos-workshop-bottom-actions">
          <button type="button" class="loomos-button" data-workshop-action="mobile-preview">Preview</button>
          <button type="button" class="loomos-button" data-workshop-action="save-context" data-workshop-context-save${saveTarget ? "" : " disabled"}>${saveLabel}</button>
          <button type="button" class="loomos-button loomos-button-primary" data-workshop-action="install"${installTarget ? "" : " disabled"}>${installLabel}</button>
        </footer>
        ${mobilePreviewHtml()}
      </div>`;

    if (activeView === "advanced-code" && workingArtifact) {
      const section = codeSections(workingArtifact).find((candidate) => candidate.id === codeSection)
        ?? codeSections(workingArtifact)[0]!;
      codeSection = section.id;
      codeDraft = codeValue(workingArtifact, codeSection);
      const host = modal.root.querySelector<HTMLElement>("[data-code-editor]");
      if (host) {
        codeEditor = mountCodeEditor(host, codeDraft, section.language, (value) => {
          codeDraft = value;
          codeDirty = true;
          const dirty = modal.root.querySelector<HTMLElement>("[data-code-error]");
          if (dirty) dirty.textContent = "Unsaved changes";
          updateDirtyActionState();
          scheduleAutosave();
        });
      }
    }
    mountPreviewFrames();
    applyPackFilters();
    applyModuleFilters();
    applyRailFilters();
  }

  async function openImport(): Promise<void> {
    const importModal = options.ctx.ui.showModal({
      title: "Import LoomOS Artifact",
      width: Math.min(720, window.innerWidth - 12),
      maxHeight: Math.min(760, window.innerHeight - 20),
    });
    importModal.root.className = "loomos-root";
    importModal.root.dataset.view = "modal";
    importModal.root.innerHTML = `
      <div class="loomos-prompt-dialog">
        <p class="loomos-hint">Paste raw JSON, fenced JSON from an AI, a Loom Pack, a version-1 LoomOS module, or upload a .json/.loompack file.</p>
        <label class="loomos-file-drop"><span>Choose Loom Pack or artifact</span><input type="file" accept=".json,.loompack,application/json" data-import-file></label>
        <textarea class="loomos-input loomos-portable-json" data-import-json placeholder='{"format":"loomos-artifact","version":2,...}'></textarea>
        <p class="loomos-dialog-error" data-import-error role="alert"></p>
        <div class="loomos-dialog-buttons">
          <button type="button" class="loomos-button loomos-button-primary" data-import-confirm>Stage Artifact</button>
          <button type="button" class="loomos-button" data-import-cancel>Cancel</button>
        </div>
      </div>`;
    const textarea = importModal.root.querySelector<HTMLTextAreaElement>("[data-import-json]");
    importModal.root.querySelector<HTMLInputElement>("[data-import-file]")?.addEventListener("change", async (event) => {
      const file = (event.currentTarget as HTMLInputElement).files?.[0];
      if (file && textarea) textarea.value = await file.text();
    });
    importModal.root.querySelector("[data-import-confirm]")?.addEventListener("click", () => {
      try {
        const text = textarea?.value ?? "";
        const imported = parseWorkshopImportText(text);
        if (imported.kind === "pack") {
          importModal.dismiss();
          openLoomPackInstall(imported.pack);
        } else {
          chooseArtifact(imported.artifact, false);
          activeView = "test-lab";
          importModal.dismiss();
          render();
        }
      } catch (error) {
        const errorRoot = importModal.root.querySelector<HTMLElement>("[data-import-error]");
        if (errorRoot) errorRoot.textContent = error instanceof Error ? error.message : String(error);
      }
    });
    importModal.root.querySelector("[data-import-cancel]")?.addEventListener("click", () => importModal.dismiss());
  }

  async function openBlueprintInstall(blueprint: BlueprintArtifact): Promise<void> {
    const installModal = options.ctx.ui.showModal({
      title: "Review Blueprint Installation",
      width: Math.min(720, window.innerWidth - 12),
      maxHeight: Math.min(780, window.innerHeight - 20),
    });
    installModal.root.className = "loomos-root";
    installModal.root.dataset.view = "modal";
    const parts = [
      ...blueprint.modules.map((module) => ({ id: module.id, name: module.meta.name, kind: "module" })),
      ...(blueprint.theme ? [{ id: blueprint.theme.id, name: blueprint.theme.meta.name, kind: "theme" }] : []),
    ];
    installModal.root.innerHTML = `
      <div class="loomos-prompt-dialog">
        <p class="loomos-hint">Choose which native LoomOS artifacts to install. Existing artifacts with the same ID receive a new revision.</p>
        <div class="loomos-blueprint-parts">
          ${parts.map((part) => `
            <label class="loomos-check">
              <input type="checkbox" data-blueprint-part="${escapeHtml(part.id)}" checked>
              <span><strong>${escapeHtml(part.name)}</strong><small>${escapeHtml(part.kind)}</small></span>
            </label>
          `).join("") || `<p class="loomos-muted">This Blueprint contains no modules or theme.</p>`}
        </div>
        <label class="loomos-check"><input type="checkbox" data-blueprint-settings><span>Apply recommended settings</span></label>
        <label class="loomos-check"><input type="checkbox" data-blueprint-activate checked><span>Activate included theme</span></label>
        <div class="loomos-dialog-buttons">
          <button type="button" class="loomos-button loomos-button-primary" data-blueprint-confirm>Install Selected</button>
          <button type="button" class="loomos-button" data-blueprint-cancel>Cancel</button>
        </div>
      </div>`;
    installModal.root.querySelector("[data-blueprint-confirm]")?.addEventListener("click", () => {
      const selectedArtifactIds = [...installModal.root.querySelectorAll<HTMLInputElement>("[data-blueprint-part]:checked")]
        .map((input) => input.dataset.blueprintPart!)
        .filter(Boolean);
      options.send({
        type: "install_artifact",
        requestId: options.requestId("artifact-install"),
        artifact: blueprint,
        selectedArtifactIds,
        applySettings: installModal.root.querySelector<HTMLInputElement>("[data-blueprint-settings]")?.checked ?? false,
        activateTheme: installModal.root.querySelector<HTMLInputElement>("[data-blueprint-activate]")?.checked ?? true,
      });
      installModal.dismiss();
    });
    installModal.root.querySelector("[data-blueprint-cancel]")?.addEventListener("click", () => installModal.dismiss());
  }

  async function openLoomPackInstall(pack: LoomPack): Promise<void> {
    const installModal = options.ctx.ui.showModal({
      title: "Review Loom Pack Installation",
      width: Math.min(720, window.innerWidth - 12),
      maxHeight: Math.min(780, window.innerHeight - 20),
    });
    installModal.root.className = "loomos-root";
    installModal.root.dataset.view = "modal";
    
    let artifactsHtml = "";
    if (pack.artifacts.length === 0) {
      artifactsHtml = `<p class="loomos-muted">This package contains no artifacts.</p>`;
    } else {
      artifactsHtml = pack.artifacts.map((art) => {
        let html = `
        <div class="loomos-pack-artifact-group" style="margin-bottom: 8px;">
          <label class="loomos-check" style="font-weight: 600;">
            <input type="checkbox" data-pack-part="${escapeHtml(art.id)}" data-pack-kind="${escapeHtml(art.kind)}" checked>
            <span><strong>${escapeHtml(art.meta.name)}</strong> <small class="loomos-badge">${escapeHtml(art.kind)}</small></span>
          </label>`;
        if (art.kind === "blueprint") {
          if (art.modules.length > 0 || art.theme) {
            html += `<div class="loomos-blueprint-subparts" style="padding-left: 20px; display: flex; flex-direction: column; gap: 6px; border-left: 2px solid var(--loomos-border, rgba(255,255,255,0.1)); margin-left: 8px; margin-top: 4px;">`;
            for (const subMod of art.modules) {
              html += `
              <label class="loomos-check">
                <input type="checkbox" data-pack-part="${escapeHtml(subMod.id)}" data-pack-parent="${escapeHtml(art.id)}" data-pack-kind="module" checked>
                <span>${escapeHtml(subMod.meta.name)} <small class="loomos-badge">module</small></span>
              </label>`;
            }
            if (art.theme) {
              html += `
              <label class="loomos-check">
                <input type="checkbox" data-pack-part="${escapeHtml(art.theme.id)}" data-pack-parent="${escapeHtml(art.id)}" data-pack-kind="theme" checked>
                <span>${escapeHtml(art.theme.meta.name)} <small class="loomos-badge">theme</small></span>
              </label>`;
            }
            html += `</div>`;
          }
        }
        html += `</div>`;
        return html;
      }).join("");
    }

    installModal.root.innerHTML = `
      <div class="loomos-prompt-dialog" style="display: flex; flex-direction: column; gap: 16px; padding: 16px;">
        <div>
          <p class="loomos-kicker" style="margin-bottom: 4px; font-weight: bold;">Loom Pack: ${escapeHtml(pack.meta.name)}</p>
          <p class="loomos-hint" style="color: var(--loomos-muted);">${escapeHtml(pack.meta.description || "No description provided.")}</p>
        </div>
        
        <div class="loomos-blueprint-parts" style="max-height: 240px; overflow-y: auto; display: flex; flex-direction: column; gap: 4px;">
          ${artifactsHtml}
        </div>

        <div class="loomos-form-group" style="display: flex; flex-direction: column; gap: 6px;">
          <label class="loomos-label" style="font-weight: 600;">Installation Mode</label>
          <select class="loomos-input" data-pack-install-mode style="width: 100%; padding: 8px; border-radius: 4px; background: var(--loomos-bg-alt); border: 1px solid var(--loomos-border); color: var(--loomos-ink);">
            <option value="install_all" selected>Install Selected</option>
            <option value="library_only">Save to Library Only</option>
            <option value="modules_only">Install Modules Only</option>
            <option value="theme_only">Install Theme Only</option>
          </select>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${pack.preset ? `
            <label class="loomos-check">
              <input type="checkbox" data-pack-apply-settings checked>
              <span>Apply Bundled Settings Preset</span>
            </label>
          ` : ""}
          <label class="loomos-check">
            <input type="checkbox" data-pack-activate-theme checked>
            <span>Activate Pack Theme</span>
          </label>
        </div>

        <div class="loomos-dialog-buttons" style="display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px;">
          <button type="button" class="loomos-button loomos-button-primary" data-pack-confirm>Install Package</button>
          <button type="button" class="loomos-button" data-pack-cancel>Cancel</button>
        </div>
      </div>`;

    installModal.root.querySelector(".loomos-blueprint-parts")?.addEventListener("change", (e) => {
      const target = e.target as HTMLInputElement;
      if (target && target.dataset.packPart && !target.dataset.packParent) {
        const parentId = target.dataset.packPart;
        installModal.root.querySelectorAll<HTMLInputElement>(`input[data-pack-parent="${parentId}"]`).forEach((sub) => {
          sub.checked = target.checked;
        });
      }
    });

    const modeSelect = installModal.root.querySelector<HTMLSelectElement>("[data-pack-install-mode]");
    const presetCheckbox = installModal.root.querySelector<HTMLInputElement>("[data-pack-apply-settings]");
    const activateThemeCheckbox = installModal.root.querySelector<HTMLInputElement>("[data-pack-activate-theme]");

    const updateVisibility = () => {
      const mode = modeSelect?.value;
      const libraryOnly = mode === "library_only";
      if (presetCheckbox) {
        presetCheckbox.disabled = libraryOnly;
        presetCheckbox.parentElement!.style.opacity = libraryOnly ? "0.5" : "1";
      }
      if (activateThemeCheckbox) {
        activateThemeCheckbox.disabled = libraryOnly || mode === "modules_only";
        activateThemeCheckbox.parentElement!.style.opacity = (libraryOnly || mode === "modules_only") ? "0.5" : "1";
      }
    };
    modeSelect?.addEventListener("change", updateVisibility);
    updateVisibility();

    installModal.root.querySelector("[data-pack-confirm]")?.addEventListener("click", () => {
      const selectedIds = [...installModal.root.querySelectorAll<HTMLInputElement>("input[data-pack-part]:checked")]
        .map((input) => input.dataset.packPart!)
        .filter(Boolean);

      const installMode = modeSelect?.value as "library_only" | "install_all" | "modules_only" | "theme_only";
      const applyPreset = presetCheckbox ? (!presetCheckbox.disabled && presetCheckbox.checked) : false;
      const activateTheme = activateThemeCheckbox ? (!activateThemeCheckbox.disabled && activateThemeCheckbox.checked) : false;

      options.send({
        type: "install_loom_pack",
        requestId: options.requestId("loompack-install"),
        pack,
        selectedArtifactIds: selectedIds,
        installMode,
        activateTheme,
        applyPreset,
      });

      options.onStatus(`Installing Loom Pack "${pack.meta.name}"...`);
      installModal.dismiss();
    });

    installModal.root.querySelector("[data-pack-cancel]")?.addEventListener("click", () => installModal.dismiss());
  }

  async function openExportPack(): Promise<void> {
    const exportModal = options.ctx.ui.showModal({
      title: "Export Loom Pack",
      width: Math.min(720, window.innerWidth - 12),
      maxHeight: Math.min(780, window.innerHeight - 20),
    });
    exportModal.root.className = "loomos-root";
    exportModal.root.dataset.view = "modal";
    exportModal.root.innerHTML = `
      <div class="loomos-prompt-dialog">
        <p class="loomos-hint">Bundle multiple artifacts and your active preset settings into a portable .loompack file.</p>
        <label class="loomos-field">
          <span>Pack Name</span>
          <input class="loomos-input" type="text" data-pack-name value="Loom Pack">
        </label>
        <label class="loomos-field">
          <span>Description</span>
          <textarea class="loomos-input" data-pack-description placeholder="Portable tracking workspace bundle"></textarea>
        </label>
        <div class="loomos-blueprint-parts" style="max-height: 200px; overflow-y: auto; margin-bottom: 8px;">
          ${library.records.map((record) => `
            <label class="loomos-check">
              <input type="checkbox" data-pack-artifact="${escapeHtml(record.artifact.id)}" checked>
              <span><strong>${escapeHtml(record.artifact.meta.name)}</strong><small>${escapeHtml(record.artifact.kind)}</small></span>
            </label>
          `).join("") || `<p class="loomos-muted">No artifacts in library to export.</p>`}
        </div>
        <label class="loomos-check">
          <input type="checkbox" data-pack-include-settings checked>
          <span>Include active preset settings</span>
        </label>
        <div class="loomos-dialog-buttons">
          <button type="button" class="loomos-button loomos-button-primary" data-pack-confirm>Export Package</button>
          <button type="button" class="loomos-button" data-pack-cancel>Cancel</button>
        </div>
      </div>`;

    exportModal.root.querySelector("[data-pack-confirm]")?.addEventListener("click", () => {
      const packName = exportModal.root.querySelector<HTMLInputElement>("[data-pack-name]")?.value.trim() || "Loom Pack";
      const packDescription = exportModal.root.querySelector<HTMLTextAreaElement>("[data-pack-description]")?.value.trim() || "";
      const includeSettings = exportModal.root.querySelector<HTMLInputElement>("[data-pack-include-settings]")?.checked ?? false;
      const selectedArtifactIds = [...exportModal.root.querySelectorAll<HTMLInputElement>("[data-pack-artifact]:checked")]
        .map((input) => input.dataset.packArtifact!)
        .filter(Boolean);

      const artifactsToInclude = library.records
        .filter((record) => selectedArtifactIds.includes(record.artifact.id))
        .map((record) => record.artifact);

      let preset: LoomPack["preset"] = null;
      if (includeSettings) {
        preset = {
          name: `${packName} Preset`,
          description: packDescription || "Bundled settings preset.",
          moduleSettings: settings.moduleSettings,
          activeThemeId: selectedArtifactIds.includes(settings.activeThemeId) ? settings.activeThemeId : undefined,
          layout: settings.layout,
          settings: {
            injectionEnabled: settings.injectionEnabled,
            injectionTokenBudget: settings.injectionTokenBudget,
            compilerSeedTokenBudget: settings.compilerSeedTokenBudget,
            historyRetentionLimit: settings.historyRetentionLimit,
            developerMode: settings.developerMode,
          },
        };
      }

      const slug = (val: string) => val.trim().toLowerCase().replace(/[^a-z0-9_-]+/g, "_").replace(/^_+|_+$/g, "") || "pack";
      const packPayload = {
        format: "loomos-pack" as const,
        version: 1 as const,
        id: `pack_${slug(packName)}_${Math.random().toString(36).slice(2, 8)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        meta: {
          name: packName,
          description: packDescription,
          author: "User",
          tags: ["loomos-pack"],
        },
        artifacts: artifactsToInclude,
        preset,
      };

      try {
        const validatedPack = LoomPackSchema.parse(packPayload);
        downloadJson(`${safeFilename(packName)}.loompack`, validatedPack);
        options.onStatus(`Exported Loom Pack "${packName}"`);
        exportModal.dismiss();
      } catch (error) {
        options.onStatus(`Export failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    });

    exportModal.root.querySelector("[data-pack-cancel]")?.addEventListener("click", () => exportModal.dismiss());
  }

  function artifactRecordById(artifactId: string | undefined): ArtifactRecord | null {
    if (!artifactId) return null;
    return selectedArtifactRecord(library, artifactId);
  }

  async function installArtifactValue(artifact: LoomOSArtifact): Promise<void> {
    chooseArtifact(artifact);
    if (artifact.kind === "blueprint") {
      await openBlueprintInstall(artifact);
      return;
    }
    options.send({
      type: "install_artifact",
      requestId: options.requestId("artifact-install"),
      artifact,
      activateTheme: artifact.kind === "theme",
    });
    options.onStatus(`Installing ${artifact.meta.name}`);
  }

  async function deleteArtifactRecord(record: ArtifactRecord): Promise<void> {
    const { confirmed } = await options.ctx.ui.showConfirm({
      title: "Delete LoomOS Artifact",
      message: `Delete "${record.artifact.meta.name}" and uninstall its active theme or module? Revision history for this artifact will also be removed.`,
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!confirmed) return;
    options.send({
      type: "delete_artifact",
      requestId: options.requestId("artifact-delete"),
      artifactId: record.artifact.id,
    });
  }

  function visualValue(root: HTMLElement, key: string): string {
    return root.querySelector<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
      `[data-visual-input="${key}"]`,
    )?.value ?? "";
  }

  function visualChecked(root: HTMLElement, key: string): boolean {
    return root.querySelector<HTMLInputElement>(`[data-visual-input="${key}"]`)?.checked ?? false;
  }

  function visualNumber(root: HTMLElement, key: string, fallback: number): number {
    const value = Number(visualValue(root, key));
    return Number.isFinite(value) ? value : fallback;
  }

  function collectVisualFields(root: HTMLElement): VisualField[] {
    return [...root.querySelectorAll<HTMLElement>("[data-visual-field]")].map((card) => {
      const value = (key: string) =>
        card.querySelector<HTMLInputElement | HTMLSelectElement>(`[data-field-property="${key}"]`)?.value ?? "";
      const numeric = (key: string): number | undefined => {
        const raw = value(key);
        if (!raw.trim()) return undefined;
        const parsed = Number(raw);
        return Number.isFinite(parsed) ? parsed : undefined;
      };
      const type = value("type") as VisualField["type"];
      const rawDefault = value("default");
      let defaultValue: unknown = rawDefault || undefined;
      if (rawDefault && ["number", "integer", "gauge"].includes(type)) {
        const parsed = Number(rawDefault);
        if (Number.isFinite(parsed)) defaultValue = parsed;
      }
      if (rawDefault && type === "boolean") defaultValue = rawDefault === "true";
      return {
        key: value("key").trim(),
        label: value("label").trim(),
        type,
        required: card.querySelector<HTMLInputElement>("[data-field-property='required']")?.checked ?? false,
        description: value("description").trim(),
        defaultValue,
        enumOptions: value("enum").split(",").map((item) => item.trim()).filter(Boolean),
        min: numeric("min"),
        max: numeric("max"),
        maxItems: numeric("maxItems"),
      };
    });
  }

  function applyVisualBuilderFromDOM(): boolean {
    const root = modal.root.querySelector<HTMLElement>("[data-visual-builder]");
    if (!root || !workingArtifact) return true;
    try {
      if (workingArtifact.kind === "module" && root.dataset.visualBuilder === "module") {
        workingArtifact = applyVisualModuleEdits(workingArtifact, {
          name: visualValue(root, "name"),
          description: visualValue(root, "description"),
          author: visualValue(root, "author"),
          tags: visualValue(root, "tags").split(",").map((tag) => tag.trim()).filter(Boolean),
          trackingPurpose: visualValue(root, "trackingPurpose"),
          prompt: visualValue(root, "prompt"),
          outputMode: visualValue(root, "outputMode") as NonNullable<ModuleCapsuleArtifact["visual"]>["outputMode"],
          defaults: {
            track: visualChecked(root, "track"),
            display: visualChecked(root, "display"),
            inject: visualChecked(root, "inject"),
            group: visualValue(root, "group"),
            maxItems: visualNumber(root, "maxItems", workingArtifact.defaults.maxItems),
            intensity: visualValue(root, "intensity") as ModuleCapsuleArtifact["defaults"]["intensity"],
            displayOrder: visualNumber(root, "displayOrder", workingArtifact.defaults.displayOrder),
          },
          slotRecommendation: visualValue(root, "slotRecommendation"),
          displayModeRecommendation: visualValue(root, "displayModeRecommendation") as NonNullable<ModuleCapsuleArtifact["visual"]>["displayModeRecommendation"],
          tokenPriorityRecommendation: visualNumber(root, "tokenPriorityRecommendation", 5),
          sampleData: JSON.parse(visualValue(root, "sampleData") || "{}"),
          fields: visualChecked(root, "advancedSchema") ? undefined : collectVisualFields(root),
        });
      } else if (workingArtifact.kind === "theme" && root.dataset.visualBuilder === "theme") {
        const design = ThemeDesignSchema.parse({
          typography: visualValue(root, "typography"),
          backgroundStyle: visualValue(root, "backgroundStyle"),
          panelStyle: visualValue(root, "panelStyle"),
          borderStyle: visualValue(root, "borderStyle"),
          density: visualValue(root, "density"),
          headerStyle: visualValue(root, "headerStyle"),
          widgetStyle: visualValue(root, "widgetStyle"),
          mobileNotes: visualValue(root, "mobileNotes"),
          previewSurface: visualValue(root, "previewSurface"),
          tokens: Object.fromEntries(
            [...root.querySelectorAll<HTMLInputElement>("[data-design-token]")]
              .map((input) => [input.dataset.designToken, input.value]),
          ),
        });
        workingArtifact = applyVisualThemeEdits(workingArtifact, {
          name: visualValue(root, "name"),
          description: visualValue(root, "description"),
          author: visualValue(root, "author"),
          tags: visualValue(root, "tags").split(",").map((tag) => tag.trim()).filter(Boolean),
          manifest: {
            viewerModelVersion: 1,
            developerMode: visualChecked(root, "developerMode"),
            capabilities: [...root.querySelectorAll<HTMLInputElement>("[data-theme-capability]:checked")]
              .map((input) => input.dataset.themeCapability as ThemeCapability),
            minWidth: visualNumber(root, "minWidth", workingArtifact.manifest.minWidth),
            preferredColorScheme: visualValue(root, "preferredColorScheme") as ThemeArtifact["manifest"]["preferredColorScheme"],
            slots: visualValue(root, "slots").split(",").map((slot) => slot.trim()).filter(Boolean),
          },
          design,
        });
        previewSurface = design.previewSurface;
      }
      codeDirty = true;
      visualError = "";
      const errorRoot = modal.root.querySelector<HTMLElement>("[data-visual-error]");
      if (errorRoot) errorRoot.textContent = "";
      updateDirtyActionState();
      mountPreviewFrames();
      return true;
    } catch (error) {
      visualError = error instanceof Error ? error.message : String(error);
      const errorRoot = modal.root.querySelector<HTMLElement>("[data-visual-error]");
      if (errorRoot) errorRoot.textContent = visualError;
      return false;
    }
  }

  function applyPackFilters(): void {
    modal.root.querySelectorAll<HTMLElement>("[data-artifact-row]").forEach((row) => {
      const record = artifactRecordById(
        row.querySelector<HTMLElement>("[data-artifact-id]")?.dataset.artifactId,
      );
      row.hidden = !record || !artifactMatchesPackFilter(record.artifact, {
        query: packQuery,
        kind: packKindFilter as "all" | LoomOSArtifact["kind"],
      });
    });
  }

  function applyModuleFilters(): void {
    modal.root.querySelectorAll<HTMLElement>("[data-module-card]").forEach((card) => {
      const track = card.querySelector<HTMLInputElement>("[data-widget-property='track']")?.checked ?? false;
      const display = card.querySelector<HTMLInputElement>("[data-widget-property='display']")?.checked ?? false;
      const inject = card.querySelector<HTMLInputElement>("[data-widget-property='inject']")?.checked ?? false;
      card.hidden = !widgetMatchesModuleFilter({
        search: card.dataset.search ?? "",
        source: card.dataset.source ?? "",
        group: card.dataset.group ?? "",
        status: !track && (display || inject) ? "warning" : card.dataset.status ?? "",
        track,
        display,
        inject,
      }, {
        query: moduleQuery,
        source: moduleSourceFilter,
        group: moduleGroupFilter,
        status: moduleStatusFilter,
      });
    });
  }

  function applyRailFilters(): void {
    const query = railQuery.trim().toLowerCase();
    modal.root.querySelectorAll<HTMLElement>("[data-rail-artifact]").forEach((row) => {
      row.hidden = Boolean(query) && !(row.dataset.search ?? "").includes(query);
    });
  }

  async function handleAction(button: HTMLElement): Promise<void> {
    const action = button.dataset.workshopAction;
    if (!action) return;
    if (action === "close") {
      if (!prepareViewTransition()) return;
      modal.dismiss();
      return;
    }
    if (action === "back") {
      if (activeView === "home") {
        modal.dismiss();
      } else {
        if (!prepareViewTransition()) return;
        activeView = "home";
        render();
      }
      return;
    }
    if (action === "create") {
      if (!prepareViewTransition()) return;
      createArtifact((button.dataset.kind ?? "module") as LoomOSArtifact["kind"]);
      return;
    }
    if (action === "select") {
      if (!prepareViewTransition()) return;
      const record = library.records.find((candidate) => candidate.artifact.id === button.dataset.artifactId);
      if (record) chooseArtifact(record.artifact);
      render();
      return;
    }
    if (action === "open-active-setup") {
      if (!prepareViewTransition()) return;
      activeView = "modules";
      render();
      return;
    }
    if (action === "preview-tracker") {
      if (!prepareViewTransition()) return;
      activeView = "test-lab";
      render();
      return;
    }
    if (action === "mobile-preview") {
      // Invalid form input stays visible in the editor while the overlay uses
      // the last valid working artifact.
      prepareForRender();
      mobilePreviewOpen = mobilePreviewState(mobilePreviewOpen, "open");
      syncMobilePreviewOverlay();
      return;
    }
    if (action === "close-mobile-preview") {
      mobilePreviewOpen = mobilePreviewState(mobilePreviewOpen, "close");
      syncMobilePreviewOverlay();
      return;
    }
    if (action === "import") {
      await openImport();
      return;
    }
    if (action === "open-export-pack") {
      await openExportPack();
      return;
    }
    if (action === "export" && (stagedArtifact ?? workingArtifact)) {
      const artifact = stagedArtifact ?? workingArtifact!;
      downloadJson(`${safeFilename(artifact.meta.name)}.loomos.json`, artifact);
      options.onStatus(`Exported ${artifact.meta.name}`);
      return;
    }
    if (["preview-artifact", "edit-artifact", "export-artifact", "duplicate-artifact", "install-artifact", "delete-artifact"].includes(action)) {
      if (!prepareViewTransition()) return;
      const record = artifactRecordById(button.dataset.artifactId);
      if (!record) return;
      if (action === "preview-artifact") {
        chooseArtifact(record.artifact);
        activeView = "test-lab";
        render();
      } else if (action === "edit-artifact") {
        chooseArtifact(record.artifact);
        activeView = record.artifact.kind === "module"
          ? "modules"
          : record.artifact.kind === "theme"
          ? "theme"
          : "advanced-code";
        render();
      } else if (action === "export-artifact") {
        downloadJson(`${safeFilename(record.artifact.meta.name)}.loomos.json`, record.artifact);
        options.onStatus(`Exported ${record.artifact.meta.name}`);
      } else if (action === "duplicate-artifact") {
        chooseArtifact(duplicateArtifact(record.artifact), false);
        activeView = "advanced-code";
        codeError = "Unsaved duplicate";
        render();
      } else if (action === "install-artifact") {
        await installArtifactValue(record.artifact);
      } else {
        await deleteArtifactRecord(record);
      }
      return;
    }
    if (action === "duplicate" && workingArtifact) {
      if (!prepareForRender()) return;
      chooseArtifact(duplicateArtifact(workingArtifact), false);
      activeView = "advanced-code";
      codeError = "Unsaved duplicate";
      render();
      return;
    }
    if (action === "open-advanced-code") {
      if (!applyVisualBuilderFromDOM()) return;
      activeView = "advanced-code";
      render();
      return;
    }
    if (action === "add-field") {
      const root = modal.root.querySelector<HTMLElement>("[data-visual-builder='module']");
      const list = root?.querySelector<HTMLElement>(".loomos-visual-field-list");
      if (!root || !list || !applyVisualBuilderFromDOM()) return;
      const index = list.querySelectorAll("[data-visual-field]").length;
      list.insertAdjacentHTML("beforeend", visualFieldCard({
        key: `field${index + 1}`,
        label: `Field ${index + 1}`,
        type: "text",
        required: false,
        description: "",
        enumOptions: [],
      }, index));
      applyVisualBuilderFromDOM();
      return;
    }
    if (["delete-field", "move-field-up", "move-field-down"].includes(action)) {
      const card = button.closest<HTMLElement>("[data-visual-field]");
      const list = card?.parentElement;
      if (!card || !list) return;
      if (action === "delete-field") card.remove();
      if (action === "move-field-up" && card.previousElementSibling) {
        list.insertBefore(card, card.previousElementSibling);
      }
      if (action === "move-field-down" && card.nextElementSibling) {
        list.insertBefore(card.nextElementSibling, card);
      }
      applyVisualBuilderFromDOM();
      render();
      return;
    }
    if (action === "save-context") {
      if ((activeView === "modules" || activeView === "theme") && modal.root.querySelector("[data-visual-builder]")) {
        if (applyVisualBuilderFromDOM()) saveCommittedArtifact();
        return;
      }
      const saveTarget = workshopSaveTarget(
        activeView,
        Boolean(workingArtifact),
        settingsDirty,
        codeDirty,
      );
      if (saveTarget === "settings") {
        saveLayoutFromDOM();
        return;
      }
      if (saveTarget === "artifact") {
        if (activeView === "advanced-code") saveCodeDraft();
        else saveCommittedArtifact();
      }
      return;
    }
    if (action === "save" && workingArtifact) {
      saveCodeDraft();
      return;
    }
    if (action === "install") {
      if (activeView === "advanced-code") {
        if (!prepareAdvancedCodeTransition()) return;
      } else if (!prepareForRender()) {
        return;
      }
      const activeTheme = activeThemeRecord()?.artifact as ThemeArtifact | undefined;
      const installTarget = workshopInstallTarget(
        activeView,
        workingArtifact,
        stagedArtifact,
        activeTheme ?? null,
      );
      if (installTarget) await installArtifactValue(installTarget);
      return;
    }
    if (action === "delete" && selectedRecord()) {
      await deleteArtifactRecord(selectedRecord()!);
      return;
    }
    if (action === "ai-kind") {
      aiKind = (button.dataset.kind ?? "module") as LoomOSArtifact["kind"];
      render();
      return;
    }
    if (action === "generate-ai") {
      const brief = modal.root.querySelector<HTMLTextAreaElement>("[data-ai-brief]")?.value.trim() ?? "";
      if (!brief) {
        generationStatus = "Describe what you want the AI to build.";
        render();
        return;
      }
      generationRequestId = options.requestId("artifact-generate");
      generationStatus = "Starting artifact generation";
      generationElapsedMs = 0;
      startTimer();
      options.send({
        type: "generate_artifact",
        requestId: generationRequestId,
        kind: workingArtifact?.kind ?? aiKind,
        brief,
        currentArtifact: workingArtifact,
      });
      render();
      return;
    }
    if (action === "cancel-ai" && generationRequestId) {
      options.send({ type: "cancel_artifact_generation", requestId: generationRequestId });
      return;
    }
    if (action === "accept-stage" && stagedArtifact) {
      if (!prepareViewTransition()) return;
      chooseArtifact(stagedArtifact, false);
      stagedArtifact = null;
      activeView = "test-lab";
      generationStatus = "Draft accepted. Save or install when ready.";
      render();
      return;
    }
    if (action === "discard-stage") {
      stagedArtifact = null;
      generationStatus = "Draft discarded.";
      render();
      return;
    }
    if (action === "preview-stage") {
      if (!prepareViewTransition()) return;
      activeView = "test-lab";
      render();
      return;
    }
    if (action === "copy-builder-prompt") {
      const kind = workingArtifact?.kind ?? aiKind;
      await navigator.clipboard.writeText(externalBuilderPrompt(kind));
      generationStatus = "External AI builder prompt copied.";
      render();
      return;
    }
    if (action === "code-section" && workingArtifact) {
      if (!commitCodeDraft()) return;
      codeSection = button.dataset.codeSection ?? codeSection;
      render();
      return;
    }
    if (action === "format-code" && codeEditor) {
      const section = codeSections(workingArtifact!).find((candidate) => candidate.id === codeSection);
      if (section?.language === "json") {
        try {
          codeEditor.setValue(JSON.stringify(JSON.parse(codeEditor.getValue()), null, 2));
          codeError = "";
        } catch (error) {
          codeError = error instanceof Error ? error.message : String(error);
        }
      }
      return;
    }
    if (action === "validate" && workingArtifact) {
      if (!commitCodeDraft()) return;
      activeView = "test-lab";
      render();
      return;
    }
    if (action === "preview-surface") {
      if (!prepareForRender()) return;
      previewSurface = button.dataset.surface === "native" ? "native" : "theme";
      render();
      return;
    }
    if (action === "preview-size") {
      if (!prepareForRender()) return;
      previewSize = (button.dataset.size ?? "mobile") as PreviewSize;
      render();
      return;
    }
    if (action === "preview-data") {
      if (!prepareForRender()) return;
      previewDataMode = (button.dataset.dataMode ?? "current") as PreviewDataMode;
      render();
      return;
    }
    if (action === "duplicate-revision" && selectedId) {
      if (!prepareViewTransition()) return;
      const record = selectedRecord();
      const revision = record?.revisions.find((candidate) =>
        candidate.revision === Number(button.dataset.revision)
      );
      if (revision) {
        chooseArtifact(duplicateArtifact(revision.artifact), false);
        activeView = "advanced-code";
        codeError = `Unsaved copy of revision ${revision.revision}`;
        render();
      }
      return;
    }
    if (action === "restore" && selectedId) {
      options.send({
        type: "restore_artifact",
        requestId: options.requestId("artifact-restore"),
        artifactId: selectedId,
        revision: Number(button.dataset.revision),
      });
    }
  }

  const onClick = (event: Event): void => {
    const target = event.target as HTMLElement | null;
    const viewButton = target?.closest<HTMLElement>("[data-workshop-view]");
    if (viewButton) {
      if (!prepareViewTransition()) return;
      activeView = (viewButton.dataset.workshopView ?? "home") as WorkshopView;
      render();
      return;
    }
    const actionButton = target?.closest<HTMLElement>("[data-workshop-action]");
    if (actionButton) {
      void handleAction(actionButton);
      return;
    }
    const layoutActionButton = target?.closest<HTMLElement>("[data-layout-action]");
    if (layoutActionButton) {
      const action = layoutActionButton.dataset.layoutAction;
      if (action === "reset-layout") {
        const nextSettings = LoomOSSettingsSchema.parse({
          ...settings,
          layout: undefined,
        });
        settings.layout = nextSettings.layout;
        settings.moduleSettings = nextSettings.moduleSettings;
        settings.customModules = nextSettings.customModules;
        options.send({
          type: "save_settings",
          requestId: options.requestId("layout-reset"),
          settings,
        });
        settingsDirty = false;
        options.onStatus("Dashboard layout reset to defaults");
        render();
      } else if (action === "save-layout") {
        saveLayoutFromDOM();
      }
      return;
    }
  };

  const onInput = (event: Event): void => {
    const input = event.target as HTMLInputElement | null;
    if (input?.matches("[data-visual-input], [data-field-property], [data-design-token]")) {
      applyVisualBuilderFromDOM();
      return;
    }
    if (input?.matches("[data-workshop-search]")) {
      packQuery = input.value;
      applyPackFilters();
      return;
    }
    if (input?.matches("[data-workshop-global-search]")) {
      railQuery = input.value;
      const query = railQuery.trim().toLowerCase();
      modal.root.querySelectorAll<HTMLElement>("[data-rail-artifact]").forEach((row) => {
        row.hidden = Boolean(query) && !(row.dataset.search ?? "").includes(query);
      });
      return;
    }
    if (input?.matches("[data-module-filter='search']")) {
      moduleQuery = input.value;
      applyModuleFilters();
      return;
    }
    if (input?.matches("[data-layout-input='search']")) {
      const query = input.value.trim().toLowerCase();
      layoutQuery = input.value;
      modal.root.querySelectorAll<HTMLElement>(".loomos-widget-editor-card").forEach((card) => {
        const label = card.querySelector("strong")?.textContent?.toLowerCase() ?? "";
        const id = card.dataset.widgetId?.toLowerCase() ?? "";
        const matches = label.includes(query) || id.includes(query);
        card.style.display = matches ? "" : "none";
      });
      return;
    }
    if (input?.matches("[data-widget-property]")) {
      settingsDirty = true;
      updateDirtyActionState();
      applyModuleFilters();
    }
  };

  const onChange = (event: Event): void => {
    const target = event.target as HTMLElement | null;
    if (target?.matches("[data-visual-input], [data-field-property], [data-design-token], [data-theme-capability]")) {
      applyVisualBuilderFromDOM();
      return;
    }
    if (target?.matches("[data-workshop-view-select]")) {
      if (!prepareViewTransition()) return;
      activeView = (target as HTMLSelectElement).value as WorkshopView;
      render();
      return;
    }
    if (target?.matches("[data-pack-kind-filter]")) {
      packKindFilter = (target as HTMLSelectElement).value;
      applyPackFilters();
      return;
    }
    if (target?.matches("[data-module-filter='source']")) {
      moduleSourceFilter = (target as HTMLSelectElement).value;
      applyModuleFilters();
      return;
    }
    if (target?.matches("[data-module-filter='group']")) {
      moduleGroupFilter = (target as HTMLSelectElement).value;
      applyModuleFilters();
      return;
    }
    if (target?.matches("[data-module-filter='status']")) {
      moduleStatusFilter = (target as HTMLSelectElement).value;
      applyModuleFilters();
      return;
    }
    if (target?.matches("[data-layout-input='group-by-slot']")) {
      if (!prepareForRender()) return;
      const checkbox = target as HTMLInputElement;
      layoutGroupBySlot = checkbox.checked;
      render();
      return;
    }
    if (target?.matches("[data-layout-input='responsive-mode']")) {
      settingsDirty = true;
      captureLayoutFromDOM(false);
      render();
      return;
    }
    if (target?.matches("[data-widget-property]")) {
      settingsDirty = true;
      updateDirtyActionState();
      applyModuleFilters();
    }
  };

  modal.root.addEventListener("click", onClick);
  modal.root.addEventListener("input", onInput);
  modal.root.addEventListener("change", onChange);
  const removeDismiss = modal.onDismiss(() => {
    modalDismissed = true;
    handle.destroy();
  });

  const handle: CreatorWorkshopHandle = {
    updateLibrary(nextLibrary) {
      library = nextLibrary;
      const current = selectedId
        ? library.records.find((record) => record.artifact.id === selectedId)
        : null;
      if (current && !stagedArtifact) {
        originalArtifact = cloneArtifact(current.artifact);
        if (!workingArtifact || workingArtifact.id !== current.artifact.id) {
          chooseArtifact(current.artifact);
        } else if (activeView === "advanced-code") {
          return;
        }
      } else if (!current && selectedId) {
        const fallback = library.records[0]?.artifact;
        if (fallback) {
          chooseArtifact(fallback);
        } else {
          selectedId = "";
          workingArtifact = null;
          originalArtifact = null;
          stagedArtifact = null;
        }
      }
      render();
    },
    updateSettings(nextSettings) {
      settings = LoomOSSettingsSchema.parse(nextSettings);
      if (activeView === "advanced-code" && codeEditor) return;
      render();
    },
    updateState(nextState, nextHistory) {
      state = nextState;
      history = nextHistory;
      if (activeView === "test-lab" || mobilePreviewOpen) render();
    },
    handleBackendResponse(response) {
      if (response.type !== "artifact_generation_status") return false;
      if (generationRequestId && response.requestId !== generationRequestId) return false;
      generationStatus = response.message;
      generationElapsedMs = response.elapsedMs;
      if (response.status === "started" || response.status === "progress") {
        if (!generationRequestId) generationRequestId = response.requestId;
        if (!elapsedTimer) startTimer(response.elapsedMs);
      } else {
        stopTimer();
        generationRequestId = null;
        if (response.status === "completed" && response.artifact) {
          stagedArtifact = response.artifact;
        }
      }
      render();
      return true;
    },
    destroy() {
      if (destroyed) return;
      destroyed = true;
      stopTimer();
      if (autosaveTimer) clearTimeout(autosaveTimer);
      autosaveTimer = null;
      codeEditor?.destroy();
      codeEditor = null;
      modal.root.removeEventListener("click", onClick);
      modal.root.removeEventListener("input", onInput);
      modal.root.removeEventListener("change", onChange);
      removeDismiss();
      if (!modalDismissed) {
        try {
          modal.dismiss();
        } catch {
          // Modal may already be dismissed by the host.
        }
      }
      options.onClose?.();
    },
  };

  render();
  return handle;
}
