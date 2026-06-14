import type {
  SpindleFrontendContext,
  SpindleModalHandle,
} from "lumiverse-spindle-types";
import type {
  BackendResponse,
  FrontendRequest,
} from "../shared/protocol";
import {
  BlueprintArtifactSchema,
  LoomOSArtifactSchema,
  ModuleCapsuleArtifactSchema,
  ThemeArtifactSchema,
  createStarterBlueprintArtifact,
  createStarterModuleArtifact,
  createStarterThemeArtifact,
  parseLoomOSArtifactText,
  parseLoomOSArtifact,
  sampleForArtifact,
  validateJsonSchemaSubset,
  parseLoomPack,
  LoomPackSchema,
  extractJsonText,
  type ArtifactLibrary,
  type ArtifactRecord,
  type BlueprintArtifact,
  type LoomOSArtifact,
  type ModuleCapsuleArtifact,
  type ThemeArtifact,
  type LoomPack,
} from "../shared/artifacts";
import type {
  LoomOSSettings,
  LoomOSState,
  StateHistoryItem,
} from "../shared/types";
import { buildViewerModel } from "../shared/viewerModel";
import { LoomOSSettingsSchema } from "../shared/schemas";
import {
  buildThemeDocument,
  inspectThemeComplexity,
  type ThemeDocumentOptions,
} from "../shared/themeRuntime";
import {
  mountCodeEditor,
  type CodeEditorHandle,
  type CodeEditorLanguage,
} from "./codeEditor";
import { escapeHtml, enrichViewerModelWithLayout, inspectLayoutDiagnostics } from "./render";

type WorkshopView = "library" | "ai" | "code" | "layout" | "preview" | "diagnostics" | "revisions";

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
      }, null, 2);
    }
    if (section === "html" || section === "css" || section === "javascript") {
      return artifact.view[section];
    }
  }
  if (artifact.kind === "theme") {
    if (section === "manifest") return JSON.stringify(artifact.manifest, null, 2);
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

function applyCodeValue(
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
      const value = json() as { defaults?: unknown; capabilities?: unknown };
      next.defaults = value.defaults as ModuleCapsuleArtifact["defaults"];
      next.capabilities = value.capabilities as ModuleCapsuleArtifact["capabilities"];
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
    if (section === "manifest") next.manifest = json();
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
  let settings = options.settings;
  let state = options.state;
  let history = options.history;
  let library = options.library;
  let activeView: WorkshopView = "library";
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
  let previewSize: "mobile" | "tablet" | "desktop" = "mobile";
  let generationRequestId: string | null = null;
  let generationStatus = "";
  let generationStartedAt = 0;
  let generationElapsedMs = 0;
  let elapsedTimer: ReturnType<typeof setInterval> | null = null;
  let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
  let destroyed = false;
  let modalDismissed = false;
  let layoutQuery = "";
  let layoutGroupBySlot = false;

  const modal: SpindleModalHandle = options.ctx.ui.showModal({
    title: "LoomOS Creator Workshop",
    width: Math.max(320, Math.min(1280, window.innerWidth - 4)),
    maxHeight: Math.max(520, window.innerHeight - 4),
  });
  modal.root.className = "loomos-root loomos-workshop-root";
  modal.root.dataset.skin = settings.skin;
  modal.root.dataset.view = "workshop";

  function selectedRecord(): ArtifactRecord | null {
    return library.records.find((record) => record.artifact.id === selectedId) ?? null;
  }

  function stopTimer(): void {
    if (elapsedTimer) clearInterval(elapsedTimer);
    elapsedTimer = null;
  }

  function scheduleAutosave(): void {
    if (autosaveTimer) clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      autosaveTimer = null;
      if (!workingArtifact || !codeEditor || activeView !== "code") return;
      try {
        const candidate = applyCodeValue(workingArtifact, codeSection, codeEditor.getValue());
        workingArtifact = candidate;
        codeError = "Draft autosaved";
        options.send({
          type: "save_artifact",
          requestId: options.requestId("artifact-autosave"),
          artifact: candidate,
        });
      } catch {
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
    if (!workingArtifact || activeView !== "code" || !codeEditor) return true;
    try {
      codeDraft = codeEditor.getValue();
      workingArtifact = applyCodeValue(workingArtifact, codeSection, codeDraft);
      codeError = "";
      return true;
    } catch (error) {
      codeError = error instanceof Error ? error.message : String(error);
      const errorRoot = modal.root.querySelector<HTMLElement>("[data-code-error]");
      if (errorRoot) errorRoot.textContent = codeError;
      return false;
    }
  }

  function chooseArtifact(artifact: LoomOSArtifact): void {
    codeEditor?.destroy();
    codeEditor = null;
    selectedId = artifact.id;
    workingArtifact = cloneArtifact(artifact);
    originalArtifact = cloneArtifact(artifact);
    stagedArtifact = null;
    codeSection = codeSections(artifact)[0]?.id ?? "meta";
    codeError = "";
  }

  function createArtifact(kind: LoomOSArtifact["kind"]): void {
    const artifact = kind === "module"
      ? createStarterModuleArtifact()
      : kind === "theme"
      ? createStarterThemeArtifact()
      : createStarterBlueprintArtifact();
    chooseArtifact(artifact);
    activeView = "code";
    render();
  }

  function libraryHtml(): string {
    const records = library.records;
    return `
      <section class="loomos-workshop-panel">
        <div class="loomos-workshop-heading">
          <div>
            <span class="loomos-kicker">Artifact library</span>
            <h2>Modules, themes, and complete trackers</h2>
          </div>
          <div class="loomos-workshop-actions-row">
            <button type="button" class="loomos-button loomos-btn-sm" data-workshop-action="open-export-pack">Export Loom Pack...</button>
            <label class="loomos-workshop-search">
              <span class="sr-only">Search artifacts</span>
              <input class="loomos-input" type="search" placeholder="Search library" data-workshop-search>
            </label>
          </div>
        </div>
        <div class="loomos-workshop-create-grid">
          <button type="button" data-workshop-action="create" data-kind="module"><strong>New Module</strong><span>Schema, prompt, and view</span></button>
          <button type="button" data-workshop-action="create" data-kind="theme"><strong>New Theme</strong><span>Full-screen tracker interface</span></button>
          <button type="button" data-workshop-action="create" data-kind="blueprint"><strong>New Blueprint</strong><span>Modules, theme, and settings</span></button>
        </div>
        <div class="loomos-workshop-library" data-workshop-library>
          ${records.length === 0 ? `
            <div class="loomos-empty">
              <h3>Your Workshop is empty</h3>
              <p>Create with AI, paste an artifact, or start from a native template.</p>
            </div>
          ` : records.map((record) => {
            const artifact = record.artifact;
            const active = artifact.id === settings.activeThemeId
              || settings.customModules.some((module) => module.artifactId === artifact.id);
            return `
              <article class="loomos-workshop-artifact${selectedId === artifact.id ? " is-selected" : ""}"
                data-artifact-row
                data-search="${escapeHtml(`${artifact.meta.name} ${artifact.meta.description} ${artifact.kind} ${artifact.meta.tags.join(" ")}`.toLowerCase())}">
                <button type="button" class="loomos-workshop-artifact-main" data-workshop-action="select" data-artifact-id="${escapeHtml(artifact.id)}">
                  <span class="loomos-artifact-kind">${escapeHtml(artifact.kind)}</span>
                  <strong>${escapeHtml(artifact.meta.name)}</strong>
                  <small>${escapeHtml(artifact.meta.description || "No description")}</small>
                </button>
                <div class="loomos-workshop-artifact-meta">
                  ${active ? `<span class="loomos-badge loomos-badge-ok">Installed</span>` : ""}
                  <span>r${record.revision}</span>
                  <span>${new Date(artifact.updatedAt).toLocaleDateString()}</span>
                </div>
              </article>`;
          }).join("")}
        </div>
      </section>`;
  }

  function aiHtml(): string {
    const kind = workingArtifact?.kind ?? "module";
    const changed = stagedArtifact ? changedTopLevelKeys(workingArtifact, stagedArtifact) : [];
    return `
      <section class="loomos-workshop-panel loomos-ai-creator">
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

  function codeHtml(): string {
    if (!workingArtifact) {
      return `<div class="loomos-empty"><h3>Select or create an artifact</h3><p>The code studio exposes every portable artifact field.</p></div>`;
    }
    const sections = codeSections(workingArtifact);
    return `
      <section class="loomos-workshop-panel loomos-code-studio">
        <div class="loomos-workshop-heading">
          <div><span class="loomos-kicker">${escapeHtml(workingArtifact.kind)} code studio</span><h2>${escapeHtml(workingArtifact.meta.name)}</h2></div>
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
          <button type="button" class="loomos-button loomos-button-primary" data-workshop-action="save">Save Revision</button>
        </div>
      </section>`;
  }

  function previewDocument(artifact: LoomOSArtifact): string {
    const previewTheme = previewThemeForArtifact(artifact);
    if (!previewTheme) {
      return `<!doctype html><body style="font-family:system-ui;background:#111;color:#eee;padding:20px"><h2>This Blueprint has no theme to preview.</h2></body>`;
    }
    const baseModel = enrichViewerModelWithLayout(
      buildViewerModel(state, settings, history, "Workshop preview"),
      state,
      settings
    );
    const model = artifact.kind === "module"
      ? {
          ...baseModel,
          data: sampleForArtifact(artifact),
          artifact: { id: artifact.id, meta: artifact.meta },
          meta: {
            ...baseModel.meta,
            name: artifact.meta.name,
          },
        }
      : baseModel;
    const runtime: ThemeDocumentOptions = {
      nonce: `preview-${artifact.id}`,
      developerModeEnabled: settings.developerMode,
    };
    return buildThemeDocument(previewTheme, model as typeof baseModel, runtime);
  }

  function saveLayoutFromDOM() {
    const container = modal.root.querySelector(".loomos-workshop-content");
    if (!container) return;

    const widgetCards = container.querySelectorAll(".loomos-widget-editor-card");
    const nextWidgets = settings.layout ? JSON.parse(JSON.stringify(settings.layout.widgets)) : [];

    widgetCards.forEach((card: any) => {
      const widgetId = card.dataset.widgetId;
      const widget = nextWidgets.find((w: any) => w.id === widgetId);
      if (!widget) return;

      const trackInput = card.querySelector("[data-widget-property='track']") as HTMLInputElement;
      const displayInput = card.querySelector("[data-widget-property='display']") as HTMLInputElement;
      const injectInput = card.querySelector("[data-widget-property='inject']") as HTMLInputElement;
      const slotSelect = card.querySelector("[data-widget-property='slot']") as HTMLSelectElement;
      const displayModeSelect = card.querySelector("[data-widget-property='displayMode']") as HTMLSelectElement;
      const priorityInput = card.querySelector("[data-widget-property='tokenPriority']") as HTMLInputElement;
      const orderInput = card.querySelector("[data-widget-property='order']") as HTMLInputElement;

      if (trackInput) widget.track = trackInput.checked;
      if (displayInput) widget.display = displayInput.checked;
      if (injectInput) widget.inject = injectInput.checked;
      if (slotSelect) widget.slot = slotSelect.value;
      if (displayModeSelect) widget.displayMode = displayModeSelect.value as any;
      if (priorityInput) widget.tokenPriority = Number(priorityInput.value);
      if (orderInput) widget.order = Number(orderInput.value);
    });

    nextWidgets.sort((a: any, b: any) => a.order - b.order);

    const responsiveModeSelect = container.querySelector("[data-layout-input='responsive-mode']") as HTMLSelectElement;
    const responsiveMode = responsiveModeSelect ? responsiveModeSelect.value : (settings.layout?.responsiveMode || "single-column");

    const layout = {
      slots: settings.layout?.slots || [],
      widgets: nextWidgets,
      responsiveMode: responsiveMode as any,
    };

    const moduleSettings = { ...settings.moduleSettings };
    for (const w of nextWidgets) {
      if (w.source === "stock") {
        moduleSettings[w.id as keyof typeof settings.moduleSettings] = {
          track: w.track,
          display: w.display,
          inject: w.inject,
        };
      } else {
        const cmIndex = settings.customModules.findIndex(c => c.id === w.id);
        if (cmIndex >= 0) {
          settings.customModules[cmIndex] = {
            ...settings.customModules[cmIndex]!,
            enabled: w.track,
            display: w.display,
            inject: w.inject,
          };
        }
      }
    }

    const nextSettings = LoomOSSettingsSchema.parse({
      ...settings,
      moduleSettings,
      layout,
    });

    settings.layout = nextSettings.layout;
    settings.moduleSettings = nextSettings.moduleSettings;
    settings.customModules = nextSettings.customModules;

    options.send({
      type: "save_settings",
      requestId: options.requestId("layout-save"),
      settings,
    });

    options.onStatus("Dashboard layout saved");
    render();
  }

  function renderWidgetEditorCard(w: any, slots: any[]): string {
    const slotsOptions = slots.map(s => `
      <option value="${s.id}" ${w.slot === s.id ? "selected" : ""}>${escapeHtml(s.label)}</option>
    `).join("");

    const displayModes = ["hero", "card", "compact", "rail", "timeline", "hidden"];
    const modeOptions = displayModes.map(m => `
      <option value="${m}" ${w.displayMode === m ? "selected" : ""}>${m}</option>
    `).join("");

    return `
      <div class="loomos-widget-editor-card" data-widget-id="${w.id}">
        <div class="loomos-widget-card-heading">
          <strong>${escapeHtml(w.label)}</strong>
          <span class="loomos-badge loomos-badge-source-${w.source}">${w.source}</span>
        </div>
        <div class="loomos-widget-card-id-row">
          <code>id: ${escapeHtml(w.id)}</code>
        </div>
        
        <div class="loomos-widget-card-controls">
          <div class="loomos-widget-control-switches">
            <label class="loomos-widget-switch">
              <input type="checkbox" data-widget-property="track" ${w.track ? "checked" : ""}>
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
            <button type="button" class="loomos-button loomos-button-primary loomos-btn-sm" data-layout-action="save-layout">Save Layout</button>
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

  function previewHtml(): string {
    const artifact = stagedArtifact ?? workingArtifact;
    if (!artifact) {
      return `<div class="loomos-empty"><h3>Nothing to preview</h3><p>Select an artifact from the library.</p></div>`;
    }
    return `
      <section class="loomos-workshop-panel loomos-preview-studio">
        <div class="loomos-workshop-heading">
          <div><span class="loomos-kicker">Isolated preview</span><h2>${escapeHtml(artifact.meta.name)}</h2></div>
          <div class="loomos-preview-sizes" role="group" aria-label="Preview size">
            ${(["mobile", "tablet", "desktop"] as const).map((size) => `
              <button type="button" data-workshop-action="preview-size" data-size="${size}" class="${previewSize === size ? "active" : ""}">${size}</button>
            `).join("")}
          </div>
        </div>
        <div class="loomos-preview-stage is-${previewSize}">
          <iframe title="Artifact preview" sandbox="allow-scripts" data-artifact-preview></iframe>
        </div>
        <p class="loomos-hint">Preview JavaScript runs only when both the artifact and LoomOS Developer Mode allow it.</p>
      </section>`;
  }

  function diagnosticsHtml(): string {
    if (!workingArtifact) {
      return `<div class="loomos-empty"><h3>No artifact selected</h3></div>`;
    }
    const rows = diagnosticsFor(workingArtifact);
    const sourceSize = JSON.stringify(workingArtifact).length;
    return `
      <section class="loomos-workshop-panel">
        <div class="loomos-workshop-heading">
          <div><span class="loomos-kicker">Compatibility report</span><h2>${escapeHtml(workingArtifact.meta.name)}</h2></div>
          <span class="loomos-badge">${Math.round(sourceSize / 1024)} KB</span>
        </div>
        <div class="loomos-diagnostic-list">
          ${rows.map((row) => `
            <div class="is-${row.level}"><strong>${row.level}</strong><span>${escapeHtml(row.text)}</span></div>
          `).join("")}
        </div>
        <dl class="loomos-facts">
          <div><dt>Artifact ID</dt><dd>${escapeHtml(workingArtifact.id)}</dd></div>
          <div><dt>Format</dt><dd>loomos-artifact v2</dd></div>
          <div><dt>Kind</dt><dd>${escapeHtml(workingArtifact.kind)}</dd></div>
          <div><dt>Revision</dt><dd>${selectedRecord()?.revision ?? "Unsaved"}</dd></div>
        </dl>
      </section>`;
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
        <div class="loomos-revision-list">
          ${[...record.revisions].reverse().map((revision) => `
            <article>
              <div><strong>Revision ${revision.revision}</strong><small>${new Date(revision.savedAt).toLocaleString()}</small></div>
              <button type="button" class="loomos-button loomos-btn-sm" data-workshop-action="restore" data-revision="${revision.revision}">Restore</button>
            </article>
          `).join("")}
        </div>
      </section>`;
  }

  function render(): void {
    if (destroyed) return;
    codeEditor?.destroy();
    codeEditor = null;
    modal.root.dataset.skin = settings.skin;
    const artifact = stagedArtifact ?? workingArtifact;
    modal.root.innerHTML = `
      <div class="loomos-workshop">
        <header class="loomos-workshop-core">
          <div>
            <span class="loomos-kicker">LoomOS Creator Workshop</span>
            <strong>${escapeHtml(artifact?.meta.name || "Artifact Library")}</strong>
          </div>
          <div class="loomos-workshop-core-actions">
            <button type="button" class="loomos-icon-button" data-workshop-action="import" title="Import artifact" aria-label="Import artifact">+</button>
            ${artifact ? `<button type="button" class="loomos-icon-button" data-workshop-action="export" title="Export artifact" aria-label="Export artifact">&#8595;</button>` : ""}
            ${workingArtifact ? `<button type="button" class="loomos-icon-button" data-workshop-action="duplicate" title="Duplicate artifact" aria-label="Duplicate artifact">&#10697;</button>` : ""}
            ${workingArtifact ? `<button type="button" class="loomos-icon-button" data-workshop-action="install" title="Install artifact" aria-label="Install artifact">&#10003;</button>` : ""}
            ${selectedRecord() ? `<button type="button" class="loomos-icon-button loomos-button-danger" data-workshop-action="delete" title="Delete artifact" aria-label="Delete artifact">&times;</button>` : ""}
            <button type="button" class="loomos-icon-button" data-workshop-action="close" title="Close Workshop" aria-label="Close Workshop">&times;</button>
          </div>
        </header>
        <nav class="loomos-workshop-nav" aria-label="Workshop views">
          ${([
            ["library", "Library"],
            ["ai", "AI Creator"],
            ["code", "Code"],
            ["layout", "Layout"],
            ["preview", "Preview"],
            ["diagnostics", "Diagnostics"],
            ["revisions", "Revisions"],
          ] as Array<[WorkshopView, string]>).map(([id, label]) => `
            <button type="button" data-workshop-view="${id}" class="${activeView === id ? "active" : ""}">${label}</button>
          `).join("")}
        </nav>
        <main class="loomos-workshop-content">
          ${activeView === "library" ? libraryHtml()
            : activeView === "ai" ? aiHtml()
            : activeView === "code" ? codeHtml()
            : activeView === "layout" ? layoutHtml()
            : activeView === "preview" ? previewHtml()
            : activeView === "diagnostics" ? diagnosticsHtml()
            : revisionsHtml()}
        </main>
      </div>`;

    if (activeView === "code" && workingArtifact) {
      const section = codeSections(workingArtifact).find((candidate) => candidate.id === codeSection)
        ?? codeSections(workingArtifact)[0]!;
      codeSection = section.id;
      codeDraft = codeValue(workingArtifact, codeSection);
      const host = modal.root.querySelector<HTMLElement>("[data-code-editor]");
      if (host) {
        codeEditor = mountCodeEditor(host, codeDraft, section.language, (value) => {
          codeDraft = value;
          const dirty = modal.root.querySelector<HTMLElement>("[data-code-error]");
          if (dirty) dirty.textContent = "Unsaved changes";
          scheduleAutosave();
        });
      }
    }

    if (activeView === "preview" && artifact) {
      const iframe = modal.root.querySelector<HTMLIFrameElement>("[data-artifact-preview]");
      if (iframe) iframe.srcdoc = previewDocument(artifact);
    }
  }

  async function openImport(): Promise<void> {
    const importModal = options.ctx.ui.showModal({
      title: "Import LoomOS Artifact",
      width: Math.min(720, window.innerWidth - 12),
      maxHeight: Math.min(760, window.innerHeight - 20),
    });
    importModal.root.className = "loomos-root";
    importModal.root.innerHTML = `
      <div class="loomos-prompt-dialog">
        <p class="loomos-hint">Paste raw JSON, fenced JSON from an AI, a version-1 LoomOS module, or upload a .json file.</p>
        <label class="loomos-file-drop"><span>Choose artifact JSON</span><input type="file" accept=".json,application/json" data-import-file></label>
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
        const json = extractJsonText(text);
        if (json && typeof json === "object" && "format" in json && json.format === "loomos-pack") {
          const pack = parseLoomPack(json);
          importModal.dismiss();
          openLoomPackInstall(pack);
        } else {
          const artifact = parseLoomOSArtifact(json);
          chooseArtifact(artifact);
          activeView = "preview";
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

  async function handleAction(button: HTMLElement): Promise<void> {
    const action = button.dataset.workshopAction;
    if (!action) return;
    if (action === "close") {
      modal.dismiss();
      return;
    }
    if (action === "create") {
      createArtifact((button.dataset.kind ?? "module") as LoomOSArtifact["kind"]);
      return;
    }
    if (action === "select") {
      const record = library.records.find((candidate) => candidate.artifact.id === button.dataset.artifactId);
      if (record) chooseArtifact(record.artifact);
      render();
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
    if (action === "duplicate" && workingArtifact) {
      chooseArtifact(duplicateArtifact(workingArtifact));
      selectedId = "";
      activeView = "code";
      codeError = "Unsaved duplicate";
      render();
      return;
    }
    if (action === "save" && workingArtifact) {
      if (!commitCodeDraft()) return;
      const artifact = LoomOSArtifactSchema.parse(workingArtifact);
      options.send({ type: "save_artifact", requestId: options.requestId("artifact-save"), artifact });
      options.onStatus(`Saving ${artifact.meta.name}`);
      return;
    }
    if (action === "install" && workingArtifact) {
      if (activeView === "code" && !commitCodeDraft()) return;
      if (workingArtifact.kind === "blueprint") {
        await openBlueprintInstall(workingArtifact);
      } else {
        options.send({
          type: "install_artifact",
          requestId: options.requestId("artifact-install"),
          artifact: workingArtifact,
          activateTheme: true,
        });
      }
      return;
    }
    if (action === "delete" && selectedRecord()) {
      const record = selectedRecord()!;
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
        kind: workingArtifact?.kind ?? ((modal.root.querySelector<HTMLElement>(".loomos-ai-kind-row .active")?.dataset.kind ?? "module") as LoomOSArtifact["kind"]),
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
      chooseArtifact(stagedArtifact);
      stagedArtifact = null;
      activeView = "preview";
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
      activeView = "preview";
      render();
      return;
    }
    if (action === "copy-builder-prompt") {
      const kind = workingArtifact?.kind ?? "module";
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
      activeView = "diagnostics";
      render();
      return;
    }
    if (action === "preview-size") {
      previewSize = (button.dataset.size ?? "mobile") as typeof previewSize;
      render();
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
      if (activeView === "code" && !commitCodeDraft()) return;
      activeView = (viewButton.dataset.workshopView ?? "library") as WorkshopView;
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
    if (input?.matches("[data-workshop-search]")) {
      const query = input.value.trim().toLowerCase();
      modal.root.querySelectorAll<HTMLElement>("[data-artifact-row]").forEach((row) => {
        row.hidden = Boolean(query) && !(row.dataset.search ?? "").includes(query);
      });
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
  };

  const onChange = (event: Event): void => {
    const target = event.target as HTMLElement | null;
    if (target?.matches("[data-layout-input='group-by-slot']")) {
      const checkbox = target as HTMLInputElement;
      layoutGroupBySlot = checkbox.checked;
      render();
      return;
    }
    if (target?.matches("[data-layout-input='responsive-mode']")) {
      const select = target as HTMLSelectElement;
      if (settings.layout) {
        settings.layout.responsiveMode = select.value as any;
      }
      render();
      return;
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
        } else if (activeView === "code") {
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
      settings = nextSettings;
      render();
    },
    updateState(nextState, nextHistory) {
      state = nextState;
      history = nextHistory;
      if (activeView === "preview") render();
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
