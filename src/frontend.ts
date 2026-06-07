import type {
  SpindleFrontendContext,
  SpindleModalHandle,
} from "lumiverse-spindle-types";
import {
  CORE_TRACKING_MODULES,
  MODULE_CATALOG,
  MODULE_KEYS,
  MODULE_SCHEMA_STRUCTURES,
  getEffectiveModuleCatalog,
  moduleSettingsForPreset,
  BALANCED_MODULE_SETTINGS,
  type StockModuleOverride,
} from "./shared/modules";
import type {
  BackendResponse,
  FrontendRequest,
  IdentityRequest,
} from "./shared/protocol";
import {
  DEFAULT_SETTINGS,
  LoomOSSettingsSchema,
  CustomModulePresetSchema,
  CustomModuleSchema,
  CustomModuleFieldSchema,
  CustomModuleDataSchema,
} from "./shared/schemas";
import type {
  ConnectionSummary,
  CustomModuleField,
  GenerationPipelineReport,
  InjectionPreview,
  LoomOSSettings,
  LoomOSState,
  ModuleControl,
  ModuleKey,
  ModulePreset,
  PermissionSnapshot,
  StateHistoryItem,
  StateIdentity,
} from "./shared/types";
import { createCustomModuleFromStock } from "./shared/customModuleFactory";
import {
  buildStateCompilerPrompt,
  buildStockModuleContractDocument,
  buildStockModulePromptBlock,
} from "./shared/prompts";
import {
  customModuleExpectedShape,
  renderCustomTemplate,
  STARTER_CUSTOM_CSS,
  STARTER_CUSTOM_HTML,
} from "./shared/customTemplates";
import {
  escapeHtml,
  renderDashboard,
  renderHistoryTab,
  renderInjectionPreview,
  renderWhatChangedModal,
} from "./frontend/render";
import { LOOMOS_STYLES } from "./frontend/styles";

const ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H7a2 2 0 0 0-2 2V5.5A1 1 0 0 0 4 4.5Zm3-.5a1 1 0 0 0-1 1v11.17c.31-.11.65-.17 1-.17h11V4H7Zm2 3h6v2H9V7Zm0 4h6v2H9v-2Z"/></svg>`;

const EMPTY_PERMISSIONS: PermissionSnapshot = {
  generation: false,
  interceptor: false,
  chatMutation: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function requestId(prefix: string): string {
  return `${prefix}:${crypto.randomUUID()}`;
}

function selected(value: string, current: string): string {
  return value === current ? " selected" : "";
}

function checked(value: boolean): string {
  return value ? " checked" : "";
}

function disabled(value: boolean): string {
  return value ? " disabled" : "";
}

function skinLabel(value: LoomOSSettings["skin"]): string {
  return {
    auto: "Auto",
    dark_academia: "Dark Academia",
    cyberpunk: "Cyberpunk",
    fantasy: "Fantasy",
    horror: "Horror",
    noir: "Noir",
    minimal: "Minimal",
  }[value];
}

function presetLabel(value: ModulePreset): string {
  return value[0]!.toUpperCase() + value.slice(1);
}

export function setup(ctx: SpindleFrontendContext): () => void {
  const cleanups: Array<() => void> = [];
  const removeStyle = ctx.dom.addStyle(LOOMOS_STYLES);
  let disposed = false;
  let settings = DEFAULT_SETTINGS;
  let permissions = EMPTY_PERMISSIONS;
  let connections: ConnectionSummary[] = [];
  let activeIdentity: StateIdentity | null = null;
  let state: LoomOSState | null = null;
  let status = "Starting";
  let pipeline: GenerationPipelineReport | null = null;
  let activeGenerationRequestId: string | null = null;
  let generationStartedAt = 0;
  let elapsedTimer: ReturnType<typeof setInterval> | null = null;
  let hostSyncTimeout: ReturnType<typeof setTimeout> | null = null;
  const messageWidgetCleanups = new Map<string, () => void>();
  let chatStates: Array<{ messageId: string; swipeId: number }> = [];
  let historyItems: StateHistoryItem[] = [];
  let injectionPreview: InjectionPreview | null = null;
  let historyFilter = "";
  let modal: SpindleModalHandle | null = null;
  let modalListenerCleanup: (() => void) | null = null;
  let activeTab = "overview";

  const tab = ctx.ui.registerDrawerTab({
    id: "command-deck",
    title: "LoomOS Command Deck",
    shortName: "LoomOS",
    headerTitle: "LoomOS",
    description: "Modular story state, deltas, cast, world, and continuity",
    keywords: ["story", "continuity", "tracker", "state", "roleplay"],
    iconSvg: ICON,
  });
  tab.root.classList.add("loomos-root");
  tab.root.dataset.view = "drawer";

  const inputAction = ctx.ui.registerInputBarAction({
    id: "open-command-deck",
    label: "Open LoomOS",
    subtitle: "View exact-swipe story state",
    iconSvg: ICON,
  });

  function send(request: FrontendRequest): void {
    if (!disposed) ctx.sendToBackend(request);
  }

  function currentRequest(): IdentityRequest | null {
    const active = ctx.getActiveChat();
    if (!active.chatId) return null;
    const messageId = ctx.messages.getLatestMessageId() ?? undefined;
    if (!messageId) return { chatId: active.chatId };
    if (
      activeIdentity
      && activeIdentity.chatId === active.chatId
      && activeIdentity.messageId === messageId
    ) return activeIdentity;
    return { chatId: active.chatId, messageId };
  }

  function exactLabel(): string {
    return activeIdentity
      ? `${activeIdentity.messageId.slice(0, 8)} | swipe ${activeIdentity.swipeId}`
      : "No active message";
  }

  function hasExactStateForLatest(): boolean {
    const latest = ctx.messages.getLatestMessageId();
    return Boolean(
      latest
      && state
      && activeIdentity
      && state.identity.messageId === latest
      && state.identity.swipeId === activeIdentity.swipeId,
    );
  }

  function stopElapsedTimer(): void {
    if (elapsedTimer) clearInterval(elapsedTimer);
    elapsedTimer = null;
  }

  function startElapsedTimer(): void {
    stopElapsedTimer();
    generationStartedAt = Date.now();
    elapsedTimer = setInterval(() => {
      if (!activeGenerationRequestId) {
        stopElapsedTimer();
        return;
      }
      renderAll();
    }, 1000);
  }

  function elapsedLabel(): string {
    if (!activeGenerationRequestId || generationStartedAt === 0) return status;
    return `${status} | ${Math.floor((Date.now() - generationStartedAt) / 1000)}s`;
  }

  function captureUiState() {
    const openDetails = new Set<string>();
    tab.root.querySelectorAll("details[data-details], details[data-section], details[data-group]").forEach((d) => {
      const key = d.getAttribute("data-details") || d.getAttribute("data-section") || d.getAttribute("data-group");
      if (key && (d as HTMLDetailsElement).open) openDetails.add(key);
    });
    if (modal) {
      modal.root.querySelectorAll("details[data-details], details[data-section], details[data-group]").forEach((d) => {
        const key = d.getAttribute("data-details") || d.getAttribute("data-section") || d.getAttribute("data-group");
        if (key && (d as HTMLDetailsElement).open) openDetails.add("modal:" + key);
      });
    }

    const searchQuery = tab.root.querySelector<HTMLInputElement>("[data-module-search]")?.value ?? "";
    const savedTab = activeTab;
    
    const scrollPositions = new Map<HTMLElement, number>();
    let curr: HTMLElement | null = tab.root;
    while (curr) {
      scrollPositions.set(curr, curr.scrollTop);
      curr = curr.parentElement;
    }
    if (modal) {
      let mcurr: HTMLElement | null = modal.root;
      while (mcurr) {
        scrollPositions.set(mcurr, mcurr.scrollTop);
        mcurr = mcurr.parentElement;
      }
    }

    let focusedSelector: string | null = null;
    let selectionStart: number | null = null;
    let selectionEnd: number | null = null;
    const active = document.activeElement;
    if (active && (tab.root.contains(active) || (modal && modal.root.contains(active)))) {
      if (active.hasAttribute("data-setting")) {
        focusedSelector = `[data-setting="${active.getAttribute("data-setting")}"]`;
      } else if (active.hasAttribute("data-module") && active.hasAttribute("data-axis")) {
        focusedSelector = `[data-module="${active.getAttribute("data-module")}"][data-axis="${active.getAttribute("data-axis")}"]`;
      } else if (active.hasAttribute("data-custom-module") && active.hasAttribute("data-axis")) {
        focusedSelector = `[data-custom-module="${active.getAttribute("data-custom-module")}"][data-axis="${active.getAttribute("data-axis")}"]`;
      } else if (active.hasAttribute("data-module-search")) {
        focusedSelector = "[data-module-search]";
      } else if (active.hasAttribute("data-action")) {
        focusedSelector = `[data-action="${active.getAttribute("data-action")}"]`;
      } else if (active.hasAttribute("data-preset-action")) {
        focusedSelector = `[data-preset-action="${active.getAttribute("data-preset-action")}"]`;
      } else if (active.hasAttribute("data-custom-action")) {
        focusedSelector = `[data-custom-action="${active.getAttribute("data-custom-action")}"]`;
        if (active.hasAttribute("data-custom-id")) {
          focusedSelector += `[data-custom-id="${active.getAttribute("data-custom-id")}"]`;
        }
      }
      
      if (active instanceof HTMLInputElement) {
        selectionStart = active.selectionStart;
        selectionEnd = active.selectionEnd;
      }
    }

    return {
      scrollPositions,
      openDetails,
      searchQuery,
      savedTab,
      focusedSelector,
      selectionStart,
      selectionEnd
    };
  }

  function restoreUiState(uiSnapshot: ReturnType<typeof captureUiState>) {
    activeTab = uiSnapshot.savedTab;

    tab.root.querySelectorAll<HTMLDetailsElement>("details[data-details], details[data-section], details[data-group]").forEach((d) => {
      const key = d.getAttribute("data-details") || d.getAttribute("data-section") || d.getAttribute("data-group");
      if (key) d.open = uiSnapshot.openDetails.has(key);
    });
    if (modal) {
      modal.root.querySelectorAll<HTMLDetailsElement>("details[data-details], details[data-section], details[data-group]").forEach((d) => {
        const key = d.getAttribute("data-details") || d.getAttribute("data-section") || d.getAttribute("data-group");
        if (key) d.open = uiSnapshot.openDetails.has("modal:" + key);
      });
    }

    const searchInput = tab.root.querySelector<HTMLInputElement>("[data-module-search]");
    if (searchInput) {
      searchInput.value = uiSnapshot.searchQuery;
      const query = uiSnapshot.searchQuery.toLowerCase();
      tab.root.querySelectorAll<HTMLElement>("[data-module-row]").forEach((row) => {
        row.hidden = Boolean(query) && !(row.dataset.search ?? "").includes(query);
      });
    }

    for (const [el, scrollTop] of uiSnapshot.scrollPositions.entries()) {
      try {
        el.scrollTop = scrollTop;
      } catch {
        // ignore
      }
    }

    if (uiSnapshot.focusedSelector) {
      const el = tab.root.querySelector(uiSnapshot.focusedSelector) || (modal && modal.root.querySelector(uiSnapshot.focusedSelector));
      if (el instanceof HTMLElement) {
        el.focus();
        if (el instanceof HTMLInputElement && uiSnapshot.selectionStart !== null && uiSnapshot.selectionEnd !== null) {
          try {
            el.setSelectionRange(uiSnapshot.selectionStart, uiSnapshot.selectionEnd);
          } catch {
            // ignore
          }
        }
      }
    }
  }

  function clearAllMessageWidgets(): void {
    for (const cleanup of messageWidgetCleanups.values()) {
      try {
        cleanup();
      } catch {
        // ignore
      }
    }
    messageWidgetCleanups.clear();
  }

  function refreshAllMessageWidgets(): void {
    clearAllMessageWidgets();

    const activeChat = ctx.getActiveChat();
    if (!activeChat.chatId) return;

    const latestId = ctx.messages.getLatestMessageId();

    const historyByMessage = new Map<string, StateHistoryItem[]>();
    for (const item of historyItems) {
      if (item.identity.messageId === latestId) continue;
      const entries = historyByMessage.get(item.identity.messageId) ?? [];
      entries.push(item);
      historyByMessage.set(item.identity.messageId, entries);
    }

    // 1. Render one history control on each previous message with stored trackers.
    for (const [messageId, entries] of historyByMessage) {
      const widgetKey = `history:${messageId}`;
      const widgetId = `loomos-history-${messageId.replace(/[^A-Za-z0-9_-]/g, "_").slice(0, 64)}`;
      const buttons = entries.map((item) => `
        <button type="button" data-swipe="${item.identity.swipeId}" title="Open tracker for swipe ${item.identity.swipeId}">
          ${entries.length === 1 ? "Open Tracker" : `Swipe ${item.identity.swipeId}`}
        </button>
      `).join("");

      const cleanup = ctx.messages.renderWidget({
        messageId,
        widgetId,
        html: `
          <style>
            :root { color-scheme: light dark; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 2px 0;
              font-family: system-ui, -apple-system, sans-serif;
              color: var(--lumiverse-text-dim, #aaa);
            }
            .bar {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: var(--lumiverse-fill-subtle, rgba(255, 255, 255, 0.02));
              border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.05));
              border-radius: 6px;
              padding: 3px 6px;
              max-width: 100%;
              flex-wrap: wrap;
            }
            button {
              background: var(--lumiverse-fill, rgba(255, 255, 255, 0.05));
              border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.1));
              border-radius: 4px;
              color: var(--lumiverse-text, #f5f5f5);
              cursor: pointer;
              font-size: 10px;
              font-weight: 500;
              height: 22px;
              padding: 0 6px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
              transition: all 0.2s ease;
            }
            button:hover {
              border-color: var(--lumiverse-accent, #7c6cff);
              background: rgba(124, 108, 255, 0.08);
            }
            .label-wrapper {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              font-size: 10px;
              white-space: nowrap;
            }
          </style>
          <div class="bar">
            <div class="label-wrapper">
              <span>Tracker history${entries.length > 1 ? ` (${entries.length})` : ""}</span>
            </div>
            ${buttons}
          </div>
          <script>
            document.querySelectorAll("[data-swipe]").forEach((button) => {
              button.addEventListener("click", () => window.spindleSandbox.postMessage({
                type: "open",
                swipeId: Number(button.dataset.swipe)
              }));
            });
          </script>
        `,
        minHeight: 28,
        maxHeight: 96,
      }, (payload) => {
        if (isRecord(payload) && payload.type === "open" && typeof payload.swipeId === "number") {
          const selectedState = entries.find((item) =>
            item.identity.swipeId === payload.swipeId
          );
          if (!selectedState) return;
          activeIdentity = {
            chatId: activeChat.chatId!,
            messageId,
            swipeId: selectedState.identity.swipeId,
          };
          status = `Loaded historical state for swipe ${selectedState.identity.swipeId}`;
          send({ type: "get_state", requestId: requestId("state-hist"), identity: activeIdentity });
          openViewer();
        }
      });

      if (cleanup) {
        messageWidgetCleanups.set(widgetKey, cleanup);
      }
    }

    // 2. Render widget for latest message (always rendered)
    if (latestId) {
      const hasState = hasExactStateForLatest();
      const busy = activeGenerationRequestId !== null;
      const generateLabel = busy ? "Stop" : hasState ? "Refresh" : "Generate";
      const generateClass = busy ? "danger pulse" : "primary";
      const swipeText = activeIdentity ? `swipe ${activeIdentity.swipeId}` : "this swipe";
      
      const cleanup = ctx.messages.renderWidget({
        messageId: latestId,
        widgetId: "loomos-action",
        html: `
          <style>
            :root { color-scheme: light dark; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 2px 0;
              font-family: system-ui, -apple-system, sans-serif;
              color: var(--lumiverse-text, #f5f5f5);
            }
            .bar {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: var(--lumiverse-fill-subtle, rgba(255, 255, 255, 0.03));
              border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.08));
              border-radius: 8px;
              padding: 4px 8px;
              max-width: 100%;
              flex-wrap: nowrap;
            }
            button {
              background: var(--lumiverse-fill, rgba(255, 255, 255, 0.05));
              border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.1));
              border-radius: 6px;
              color: var(--lumiverse-text, #f5f5f5);
              cursor: pointer;
              font-size: 11px;
              font-weight: 600;
              height: 28px;
              padding: 0 10px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
              transition: all 0.2s ease;
            }
            button:hover {
              border-color: var(--lumiverse-accent, #7c6cff);
              background: rgba(124, 108, 255, 0.08);
            }
            button.primary {
              background: var(--lumiverse-accent, #7c6cff);
              color: var(--lumiverse-accent-fg, #fff);
              border-color: var(--lumiverse-accent, #7c6cff);
            }
            button.primary:hover {
              opacity: 0.9;
              filter: brightness(1.1);
            }
            button.danger {
              border-color: #df5259;
              background: rgba(223, 82, 89, 0.15);
              color: #ff6b72;
            }
            button.pulse {
              animation: loomos-pulse 1.6s infinite;
            }
            button:disabled {
              cursor: not-allowed;
              opacity: 0.48;
            }
            .status-wrapper {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 10px;
              color: var(--lumiverse-text-dim, #aaa);
              margin-left: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .status-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #71717a;
              display: inline-block;
            }
            .status-dot.active {
              background-color: #10b981;
              box-shadow: 0 0 6px #10b981;
            }
            @keyframes loomos-pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          </style>
          <div class="bar">
            <button id="open" type="button">🔮 Open LoomOS</button>
            <button id="generate" class="${generateClass}" type="button"${disabled(!permissions.generation || !permissions.chatMutation)}>${escapeHtml(generateLabel)}</button>
            <div class="status-wrapper">
              <i class="status-dot ${hasState ? "active" : ""}"></i>
              <span>${hasState ? `Exact state loaded (${swipeText})` : `No state for ${swipeText}`}</span>
            </div>
          </div>
          <script>
            document.getElementById("open").addEventListener("click",()=>window.spindleSandbox.postMessage({type:"open"}));
            document.getElementById("generate").addEventListener("click",()=>window.spindleSandbox.postMessage({type:"generate"}));
          </script>
        `,
        minHeight: 38,
        maxHeight: 80,
      }, (payload) => {
        if (!isRecord(payload) || typeof payload.type !== "string") return;
        if (payload.type === "open") openViewer();
        if (payload.type === "generate") {
          if (activeGenerationRequestId) {
            send({ type: "cancel_generation", requestId: activeGenerationRequestId });
          } else {
            startGeneration();
          }
        }
      });

      if (cleanup) {
        messageWidgetCleanups.set(latestId, cleanup);
      }
    }
  }

  function compileStatusCardHtml(): string {
    if (!activeGenerationRequestId) return "";
    const elapsed = generationStartedAt ? Math.floor((Date.now() - generationStartedAt) / 1000) : 0;
    const phaseLabel = pipeline ? pipeline.phase.replace("_", " ") : "resolving";
    return `
      <div class="loomos-shell loomos-compile-status loomos-pulse" style="margin-top: 8px;">
        <div class="loomos-row-title">
          <strong>Compiling Story State...</strong>
          <span class="loomos-badge loomos-badge-compiling">${elapsed}s</span>
        </div>
        <p>${escapeHtml(status)}</p>
        <div class="loomos-meter-track"><i style="width: 100%; animation: loomos-bar-pulse 2s infinite;"></i></div>
        <small>Phase: ${escapeHtml(phaseLabel)} | Attempt: ${pipeline ? pipeline.attempt : 1}/2</small>
      </div>
    `;
  }

  function checkIfPresetDirty(): boolean {
    const active = settings.modulePreset;
    let baseline: Record<ModuleKey, ModuleControl>;
    if (active === "custom") return false;
    if (active.startsWith("custom:")) {
      const presetId = active.substring(7);
      const custom = settings.customModulePresets?.find(p => p.id === presetId);
      if (!custom) return false;
      baseline = custom.moduleSettings;
    } else {
      baseline = moduleSettingsForPreset(active as Exclude<ModulePreset, "custom">);
    }

    for (const key of MODULE_KEYS) {
      const current = settings.moduleSettings[key];
      const base = baseline[key];
      if (!base) continue;
      if (current.track !== base.track || current.display !== base.display || current.inject !== base.inject) {
        return true;
      }
    }
    return false;
  }

  function renderPresetManager(): string {
    const presets = settings.customModulePresets || [];
    const activePreset = settings.modulePreset;
    const isDirty = checkIfPresetDirty();

    return `
      <div class="loomos-preset-manager">
        <span class="loomos-subhead">Preset Manager</span>
        <div class="loomos-preset-select-row">
          <select class="loomos-select" data-setting="modulePreset">
            <option value="lite"${selected("lite", activePreset)}>Lite (Built-in)</option>
            <option value="balanced"${selected("balanced", activePreset)}>Balanced (Built-in)</option>
            <option value="full"${selected("full", activePreset)}>Full (Built-in)</option>
            <option value="experimental"${selected("experimental", activePreset)}>Experimental (Built-in)</option>
            ${presets.map((p) => `
              <option value="custom:${escapeHtml(p.id)}"${selected("custom:" + p.id, activePreset)}>${escapeHtml(p.name)} (Custom)</option>
            `).join("")}
            <option value="custom"${selected("custom", activePreset)}>Custom Settings (Modified)</option>
          </select>
          <div class="loomos-preset-actions">
            <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="save-as" title="Save current settings as new custom preset">Save As...</button>
            ${activePreset.startsWith("custom:") ? `
              <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="update" title="Update active custom preset with current settings"${disabled(!isDirty)}>Save Changes</button>
              <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="duplicate" title="Duplicate active custom preset">Duplicate</button>
              <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="rename" title="Rename active custom preset">Rename</button>
              <button type="button" class="loomos-button loomos-btn-sm loomos-button-danger" data-preset-action="delete" title="Delete active custom preset">Delete</button>
            ` : ""}
            <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="import" title="Import a preset JSON">Import</button>
            ${activePreset.startsWith("custom:") || activePreset === "custom" ? `
              <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="export" title="Export active preset as JSON">Export</button>
            ` : ""}
          </div>
        </div>
        ${isDirty && activePreset.startsWith("custom:") ? `
          <div class="loomos-preset-dirty-warning">⚠️ Active preset "${escapeHtml(presets.find(p => "custom:" + p.id === activePreset)?.name || "")}" has unsaved changes.</div>
        ` : ""}
      </div>
    `;
  }

  function renderTokenDiagnostics(): string {
    const trackedCount = MODULE_KEYS.filter(k => settings.moduleSettings[k].track).length;
    const injectedCount = MODULE_KEYS.filter(k => settings.moduleSettings[k].inject).length;
    
    let intensity = "Balanced";
    let intensityClass = "intensity-balanced";
    if (trackedCount <= 6) {
      intensity = "Lite";
      intensityClass = "intensity-lite";
    } else if (trackedCount >= 15) {
      intensity = "Experimental / Heavy";
      intensityClass = "intensity-heavy";
    } else if (trackedCount > 10) {
      intensity = "Heavy";
      intensityClass = "intensity-heavy";
    }

    const tooManyInjected = injectedCount > 8;

    return `
      <div class="loomos-performance-info">
        <span class="loomos-subhead">Token & Performance Guidance</span>
        <div class="loomos-perf-row">
          <span>Tracker Intensity:</span>
          <span class="loomos-perf-badge ${intensityClass}">${intensity}</span>
        </div>
        <div class="loomos-perf-row">
          <span>Active Modules:</span>
          <span>${trackedCount} tracked | ${injectedCount} injected</span>
        </div>
        ${tooManyInjected ? `
          <div class="loomos-perf-warning">
            ⚠️ Warning: ${injectedCount} modules are set to inject. This might consume substantial context tokens. 
            <button type="button" class="loomos-link-btn" data-bulk-action="inject-recommended">Apply Recommended</button>
          </div>
        ` : ""}
        <div class="loomos-perf-details">
          <p><strong>Inject Budget (${settings.injectionTokenBudget} tokens)</strong>: Caps how much compiled state LoomOS may add to future roleplay prompts. Higher values preserve more enabled Inject modules but consume more model context.</p>
          <p><strong>Seed Budget (${settings.compilerSeedTokenBudget} tokens)</strong>: Caps the nearest prior state supplied to the tracker compiler. Higher values improve long-form continuity but leave less context room for transcript messages.</p>
          <p><strong>History Retention (${settings.historyRetentionLimit} trackers)</strong>: Keeps the newest exact-swipe trackers in this chat and permanently trims older stored trackers after saves.</p>
        </div>
      </div>
    `;
  }

  function renderSchemaPromptStudio(): string {
    const modules = getEffectiveModuleCatalog(settings);
    return `
      <details class="loomos-schema-studio" data-details="schema-prompt-studio">
        <summary>
          <span>Schema & Prompt Studio</span>
          <small>${modules.length} stock module templates</small>
        </summary>
        <div class="loomos-schema-studio-body">
          <p class="loomos-hint">These are the exact generation-facing contracts used by the compiler. Schema and compiler replacements affect prompting; the strict State V2 runtime validator remains locked for storage safety.</p>
          <div class="loomos-bulk-actions">
            <button type="button" class="loomos-button loomos-btn-sm" data-action="copy-schema-catalog">Copy All Module Contracts</button>
          </div>
          <div class="loomos-schema-module-list">
            ${modules.map((module) => {
              const stock = MODULE_CATALOG.find((candidate) => candidate.key === module.key)!;
              const overridden = module.overridden;
              const promptBlock = buildStockModulePromptBlock(module.key, settings.stockModuleOverrides);
              return `
                <details class="loomos-schema-module">
                  <summary>
                    <span>${escapeHtml(module.label)} <code>${escapeHtml(module.key)}</code></span>
                    <span class="loomos-badge">${overridden ? "Customized" : "Stock"}</span>
                  </summary>
                  <div class="loomos-schema-module-body">
                    <div>
                      <span class="loomos-subhead">Effective generation schema</span>
                      <pre class="loomos-contract-code">${escapeHtml(module.schemaSummary)}</pre>
                    </div>
                    ${module.schemaSummary !== stock.schemaSummary ? `
                      <details class="loomos-cast-extra">
                        <summary>Stock schema template</summary>
                        <div class="loomos-cast-extra-body"><pre class="loomos-contract-code">${escapeHtml(stock.schemaSummary)}</pre></div>
                      </details>
                    ` : ""}
                    <div>
                      <span class="loomos-subhead">Effective compiler instruction</span>
                      <pre class="loomos-contract-code">${escapeHtml(module.compilerInstruction)}</pre>
                    </div>
                    <details class="loomos-cast-extra">
                      <summary>Exact module prompt block</summary>
                      <div class="loomos-cast-extra-body"><pre class="loomos-contract-code">${escapeHtml(promptBlock)}</pre></div>
                    </details>
                    <div class="loomos-schema-actions">
                      <button type="button" class="loomos-button loomos-btn-sm" data-stock-action="inspect" data-stock-key="${escapeHtml(module.key)}">Inspect Full Contract</button>
                      <button type="button" class="loomos-button loomos-btn-sm" data-stock-action="edit" data-stock-key="${escapeHtml(module.key)}">Edit / Replace</button>
                      <button type="button" class="loomos-button loomos-btn-sm" data-action="copy-module-prompt" data-schema-module="${escapeHtml(module.key)}">Copy Prompt Block</button>
                      <button type="button" class="loomos-button loomos-btn-sm" data-action="copy-full-module-prompt" data-schema-module="${escapeHtml(module.key)}">Copy Full Generated Prompt</button>
                      ${overridden ? `<button type="button" class="loomos-button loomos-button-danger loomos-btn-sm" data-stock-action="reset" data-stock-key="${escapeHtml(module.key)}">Reset</button>` : ""}
                    </div>
                  </div>
                </details>
              `;
            }).join("")}
          </div>
        </div>
      </details>
    `;
  }

  function hasOverride(key: string): boolean {
    const ov = settings.stockModuleOverrides?.[key];
    return ov !== undefined && Object.keys(ov).length > 0;
  }

  function renderModuleMatrix(): string {
    const query = tab.root.querySelector<HTMLInputElement>("[data-module-search]")?.value.trim().toLowerCase() ?? "";
    
    const modules = getEffectiveModuleCatalog(settings).map((m) => {
      const control = settings.moduleSettings[m.key];
      const isCore = CORE_TRACKING_MODULES.has(m.key);
      const isExperimental = ["dialogueState", "directorStyle", "closenessState", "imagePrompt"].includes(m.key);
      const overridden = m.overridden;
      
      let pills = "";
      if (isCore) pills += `<span class="loomos-pill pill-core">Core</span>`;
      if (isExperimental) pills += `<span class="loomos-pill pill-experimental">Experimental</span>`;
      if (control.inject) pills += `<span class="loomos-pill pill-injected">Injected</span>`;
      if (!control.display) pills += `<span class="loomos-pill pill-hidden">Hidden</span>`;
      if (overridden) pills += `<span class="loomos-pill pill-overridden">Overridden</span>`;
      
      const effectiveLabel = m.label;
      const effectiveGroup = m.group;
      const effectiveDesc = m.description;
      const searchText = `${effectiveLabel} ${effectiveGroup} ${effectiveDesc} ${m.key}`.toLowerCase();
      const visible = !query || searchText.includes(query);

      const hidden = m.hiddenFromSettings;
      if (hidden) return { key: m.key, label: effectiveLabel, group: effectiveGroup, description: effectiveDesc, icon: m.icon, control, isCore, pills, visible: false, isCustom: false, hidden: true };

      return {
        key: m.key,
        label: effectiveLabel,
        group: effectiveGroup,
        description: effectiveDesc,
        icon: m.icon,
        displayOrder: m.displayOrder,
        control,
        isCore,
        pills,
        visible,
        isCustom: false,
        hidden: false,
      };
    }).filter((m) => !m.hidden);

    const customModules = (settings.customModules || []).map((m) => {
      const pills = `<span class="loomos-pill pill-custom">Custom</span>` + 
                    (m.inject ? ` <span class="loomos-pill pill-injected">Injected</span>` : "") +
                    (!m.display ? ` <span class="loomos-pill pill-hidden">Hidden</span>` : "");
      const searchText = `${m.label} ${m.group} ${m.description} ${m.compilerInstruction}`.toLowerCase();
      const visible = !query || searchText.includes(query);

      return {
        key: m.id,
        label: m.label,
        group: "Custom Modules",
        description: m.description || `Output Mode: ${m.outputMode} | Max Items: ${m.maxItems}`,
        icon: "",
        control: { track: m.enabled, display: m.display, inject: m.inject },
        isCore: false,
        pills,
        visible,
        isCustom: true,
        outputMode: m.outputMode,
        compilerInstruction: m.compilerInstruction,
        maxItems: m.maxItems,
        displayOrder: m.displayOrder ?? 10_000,
      };
    });

    const allModules = [...modules, ...customModules]
      .sort((a, b) => (a.displayOrder ?? 10_000) - (b.displayOrder ?? 10_000) || a.label.localeCompare(b.label));
    const visibleCount = allModules.filter((m) => m.visible).length;
    const totalCount = allModules.length;

    const groups = new Map<string, typeof allModules>();
    for (const m of allModules) {
      if (!groups.has(m.group)) groups.set(m.group, []);
      groups.get(m.group)!.push(m);
    }

    let groupsHtml = "";
    for (const [groupName, groupModules] of groups.entries()) {
      const groupVisibleCount = groupModules.filter((m) => m.visible).length;
      if (groupVisibleCount === 0) continue;
      const enabledCount = groupModules.filter((m) => m.visible && m.control.track).length;
      const groupDesc = `${enabledCount} of ${groupVisibleCount} tracked`;

      groupsHtml += `
        <details class="loomos-module-group-details" data-group="grp_${escapeHtml(groupName)}">
          <summary class="loomos-module-group-summary">
            <div class="loomos-module-group-header">
              <strong>${escapeHtml(groupName)}</strong>
              <span class="loomos-badge">${escapeHtml(groupDesc)}</span>
            </div>
            <span class="loomos-module-group-desc">${groupVisibleCount} modules in this group</span>
          </summary>
          <div class="loomos-module-group-content">
            ${groupModules.map((m) => {
              if (!m.visible) return "";
              
              if (m.isCustom) {
                return `
                  <div class="loomos-module-card" data-module-row="${escapeHtml(m.key)}" data-custom="true" data-search="${escapeHtml((m.label + " " + m.group + " " + m.description).toLowerCase())}">
                    <div class="loomos-module-info">
                      <div class="loomos-module-title-row">
                        <strong>${escapeHtml(m.label)}</strong>
                        <div class="loomos-pills">${m.pills}</div>
                      </div>
                      <small>${escapeHtml(m.description)}</small>
                      <div class="loomos-custom-actions">
                        <button type="button" class="loomos-link-btn" data-custom-action="edit" data-custom-id="${escapeHtml(m.key)}">Edit</button>
                        <button type="button" class="loomos-link-btn" data-custom-action="duplicate" data-custom-id="${escapeHtml(m.key)}">Duplicate</button>
                        <button type="button" class="loomos-link-btn loomos-link-btn-danger" data-custom-action="delete" data-custom-id="${escapeHtml(m.key)}">Delete</button>
                      </div>
                    </div>
                    <div class="loomos-module-toggles">
                      <label class="loomos-toggle-target" title="Include custom module in compiler output">
                        <input type="checkbox" data-custom-module="${escapeHtml(m.key)}" data-axis="track"${checked(m.control.track)}>
                        <span>Track</span>
                      </label>
                      <label class="loomos-toggle-target" title="Show or hide custom module in dashboard">
                        <input type="checkbox" data-custom-module="${escapeHtml(m.key)}" data-axis="display"${checked(m.control.display)}>
                        <span>Display</span>
                      </label>
                      <label class="loomos-toggle-target" title="Allow compact custom state injection">
                        <input type="checkbox" data-custom-module="${escapeHtml(m.key)}" data-axis="inject"${checked(m.control.inject)}>
                        <span>Inject</span>
                      </label>
                    </div>
                  </div>
                `;
              }

              const overridden = hasOverride(m.key);
              return `
                <div class="loomos-module-card" data-module-row="${escapeHtml(m.key)}" data-search="${escapeHtml((m.key + " " + m.label + " " + m.group + " " + m.description).toLowerCase())}">
                  <div class="loomos-module-info">
                    <div class="loomos-module-title-row">
                      <strong>${m.icon ? `${escapeHtml(m.icon)} ` : ""}${escapeHtml(m.label)}</strong>
                      <div class="loomos-pills">${m.pills}</div>
                    </div>
                    <small>${escapeHtml(m.description)}</small>
                    <div class="loomos-stock-actions" style="margin-top: 6px; display: flex; gap: 6px;">
                      <button type="button" class="loomos-link-btn" data-stock-action="inspect" data-stock-key="${escapeHtml(m.key)}">Inspect</button>
                      <button type="button" class="loomos-link-btn" data-stock-action="edit" data-stock-key="${escapeHtml(m.key)}">Edit</button>
                      ${overridden ? `<button type="button" class="loomos-link-btn loomos-link-btn-danger" data-stock-action="reset" data-stock-key="${escapeHtml(m.key)}">Reset</button>` : ""}
                      <button type="button" class="loomos-link-btn" data-stock-action="duplicate-as-custom" data-stock-key="${escapeHtml(m.key)}">Duplicate as Custom</button>
                    </div>
                  </div>
                  <div class="loomos-module-toggles">
                    <label class="loomos-toggle-target" title="${m.isCore ? "Core tracking is always enabled" : "Include in compiler output"}">
                      <input type="checkbox" data-module="${escapeHtml(m.key)}" data-axis="track"${checked(m.control.track)}${disabled(m.isCore)}>
                      <span>Track${m.isCore ? " 🔒" : ""}</span>
                    </label>
                    <label class="loomos-toggle-target" title="Show or hide in dashboard">
                      <input type="checkbox" data-module="${escapeHtml(m.key)}" data-axis="display"${checked(m.control.display)}>
                      <span>Display</span>
                    </label>
                    <label class="loomos-toggle-target" title="Allow compact state injection">
                      <input type="checkbox" data-module="${escapeHtml(m.key)}" data-axis="inject"${checked(m.control.inject)}>
                      <span>Inject</span>
                    </label>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        </details>
      `;
    }

    return `
      <div class="loomos-module-selector" style="grid-column: 1 / -1; margin-top: 12px;">
        <span class="loomos-subhead">Tracker Module Matrix</span>
        <div class="loomos-search-bar" style="margin-top: 4px;">
          <input class="loomos-input" type="search" data-module-search placeholder="Filter modules (cast, inventory, custom...)" value="${escapeHtml(query)}">
          ${query ? `<button class="loomos-button-clear" type="button" data-action="clear-search" title="Clear search">×</button>` : ""}
          <span class="loomos-search-count">${visibleCount} of ${totalCount} shown</span>
        </div>
        <div class="loomos-bulk-actions">
          <button type="button" class="loomos-button loomos-btn-sm" data-bulk-action="enable-display">Show Matching</button>
          <button type="button" class="loomos-button loomos-btn-sm" data-bulk-action="disable-display">Hide Matching</button>
          <button type="button" class="loomos-button loomos-btn-sm" data-bulk-action="inject-recommended">Inject Recommended</button>
          <button type="button" class="loomos-button loomos-btn-sm" data-bulk-action="reset-presets">Reset Preset</button>
          ${Object.keys(settings.stockModuleOverrides || {}).length > 0 ? `<button type="button" class="loomos-button loomos-btn-sm" data-bulk-action="reset-all-overrides">Reset All Overrides</button>` : ""}
        </div>
        <div class="loomos-module-groups">
          ${groupsHtml || `<div class="loomos-empty-search" style="padding: 15px; text-align: center; color: var(--loomos-muted);">No matching modules found.</div>`}
        </div>
        <div class="loomos-custom-add-wrap">
          <button type="button" class="loomos-button loomos-button-primary loomos-btn-sm" data-custom-action="add">+ Add Custom Tracker Module</button>
        </div>
      </div>
    `;
  }

  function renderSettings(): string {
    return `
      <details class="loomos-shell loomos-settings" data-details="settings">
        <summary>Tracker Settings</summary>
        <div class="loomos-settings-grid">
          ${renderPresetManager()}
          <label class="loomos-field"><span>Skin</span><select class="loomos-select" data-setting="skin">
            ${(["auto", "dark_academia", "cyberpunk", "fantasy", "horror", "noir", "minimal"] as const).map((skin) =>
              `<option value="${skin}"${selected(skin, settings.skin)}>${skinLabel(skin)}</option>`
            ).join("")}
          </select></label>
          <label class="loomos-field"><span>Generation connection</span><select class="loomos-select" data-setting="connectionId">
            <option value="">Automatic ready connection</option>
            ${connections.map((connection) =>
              `<option value="${escapeHtml(connection.id)}"${selected(connection.id, settings.connectionId)}${disabled(!connection.ready)}>${escapeHtml(connection.name)} | ${escapeHtml(connection.model || connection.provider)}${connection.isDefault ? " (default)" : ""}${connection.ready ? "" : " (not ready)"}</option>`
            ).join("")}
          </select></label>
          <label class="loomos-field"><span>Auto generation</span><select class="loomos-select" data-setting="autoGeneration">
            <option value="manual"${selected("manual", settings.autoGeneration)}>Manual</option>
            <option value="assistant"${selected("assistant", settings.autoGeneration)}>Assistant messages</option>
            <option value="every"${selected("every", settings.autoGeneration)}>Every message</option>
            <option value="off"${selected("off", settings.autoGeneration)}>Off</option>
          </select></label>
          <label class="loomos-check"><input type="checkbox" data-setting="injectionEnabled"${checked(settings.injectionEnabled)}><span>Inject compact state</span></label>
          <label class="loomos-check"><input type="checkbox" data-setting="showInjectionPreview"${checked(settings.showInjectionPreview)}><span>Show injection preview</span></label>
          <label class="loomos-field"><span>Injection token budget</span><input class="loomos-input" type="number" min="80" max="10000" step="20" data-setting="injectionTokenBudget" value="${settings.injectionTokenBudget}"></label>
          <label class="loomos-field"><span>Recent messages</span><input class="loomos-input" type="number" min="4" max="80" data-setting="recentMessageLimit" value="${settings.recentMessageLimit}"></label>
          <label class="loomos-field"><span>History trackers kept</span><input class="loomos-input" type="number" min="1" max="1000" data-setting="historyRetentionLimit" value="${settings.historyRetentionLimit}"></label>
          <label class="loomos-field"><span>Seed token budget</span><input class="loomos-input" type="number" min="200" max="10000" step="50" data-setting="compilerSeedTokenBudget" value="${settings.compilerSeedTokenBudget}"></label>
          <label class="loomos-field"><span>Generation timeout (seconds)</span><input class="loomos-input" type="number" min="30" max="300" step="10" data-setting="generationTimeoutSeconds" value="${settings.generationTimeoutSeconds}"></label>
          
          ${renderTokenDiagnostics()}
          ${renderSchemaPromptStudio()}
          ${renderModuleMatrix()}
        </div>
      </details>`;
  }

  function diagnosticText(): string {
    const lines = [
      `version: 0.1.8`,
      `identity: ${exactLabel()}`,
      `state: ${state ? `schema ${state.schemaVersion}, ${state.activeModules.length} modules` : "none"}`,
      `permissions: generation=${permissions.generation} chat=${permissions.chatMutation} interceptor=${permissions.interceptor}`,
      `connection: ${pipeline?.connectionId || settings.connectionId || "automatic"}`,
      `phase: ${pipeline?.phase || "idle"}`,
      `attempt: ${pipeline?.attempt || "-"}`,
      `elapsed: ${pipeline ? `${Math.round(pipeline.elapsedMs / 100) / 10}s` : "-"}`,
      `normalized: ${pipeline?.normalized === undefined ? "-" : pipeline.normalized ? "yes" : "no"}`,
      `fallbackSaved: ${pipeline?.fallbackSaved === undefined ? "-" : pipeline.fallbackSaved ? "yes" : "no"}`,
      ...(pipeline?.issues?.length
        ? ["issues:", ...pipeline.issues.slice(0, 8).map((issue) => `- ${issue}`)]
        : []),
    ];
    return lines.join("\n");
  }

  function emptyStateHtml(): string {
    return `<div class="loomos-shell loomos-empty">
      <h3>No state for this exact swipe</h3>
      <p>LoomOS never substitutes another swipe. Generate a fresh snapshot for ${escapeHtml(exactLabel())}.</p>
      <button class="loomos-button loomos-button-primary" data-action="generate"${disabled(!permissions.generation || !permissions.chatMutation || Boolean(activeGenerationRequestId))}>Generate State</button>
    </div>`;
  }

  function tabsNavHtml(): string {
    const tabs = [
      { id: "overview", label: "Overview" },
      { id: "cast", label: "Cast" },
      { id: "world", label: "World" },
      { id: "story", label: "Story" },
      { id: "continuity", label: "Continuity" },
      { id: "history", label: "History" },
    ];
    return `<nav class="loomos-tabs-nav">${tabs.map(t =>
      `<button class="loomos-tab-btn${activeTab === t.id ? " active" : ""}" data-tab="${t.id}">${t.label}</button>`
    ).join("")}</nav>`;
  }

  function stickyHeaderHtml(showTabs: boolean): string {
    const canGenerate = permissions.generation && permissions.chatMutation;
    const busy = activeGenerationRequestId !== null;
    const missingPermission = !permissions.generation
      || !permissions.chatMutation
      || (settings.injectionEnabled && !permissions.interceptor);
    return `
      <div class="loomos-header-sticky">
        <div class="loomos-header">
          <div class="loomos-title"><strong>LoomOS Command Deck</strong><span>${escapeHtml(exactLabel())}</span></div>
          <span class="loomos-status" title="${escapeHtml(elapsedLabel())}">${escapeHtml(elapsedLabel())}</span>
        </div>
        <div class="loomos-header-actions">
          <button class="loomos-button loomos-button-primary" data-action="viewer">Open Viewer</button>
          ${busy
            ? `<button class="loomos-button loomos-button-danger loomos-button-pulse" data-action="cancel">Stop Compile</button>`
            : `<button class="loomos-button" data-action="generate"${disabled(!canGenerate)}>${state ? "Refresh" : "Generate"}</button>`
          }
          <button class="loomos-button" data-action="reload"${disabled(!permissions.chatMutation || busy)}>Reload</button>
          ${state && !busy ? `<button class="loomos-button loomos-button-danger" data-action="delete">Delete</button>` : ""}
          ${missingPermission ? `<button class="loomos-button" data-action="permissions">Enable</button>` : ""}
        </div>
        ${showTabs ? tabsNavHtml() : ""}
      </div>`;
  }

  function renderDrawer(): void {
    tab.root.dataset.skin = settings.skin;
    tab.root.dataset.view = "drawer";
    tab.root.innerHTML = `
      ${stickyHeaderHtml(Boolean(state) || historyItems.length > 0)}
      ${compileStatusCardHtml()}
      ${renderSettings()}
      <div class="loomos-tab-pane">
        ${activeTab === "history"
          ? renderHistoryTab(historyItems, historyFilter, activeIdentity)
          : activeTab === "injection"
          ? injectionPreview ? renderInjectionPreview(injectionPreview) : ""
          : state
            ? renderDashboard(state, settings, activeTab)
            : emptyStateHtml()
        }
      </div>
      <details class="loomos-shell loomos-settings" data-details="diagnostics">
        <summary>Pipeline Diagnostics</summary>
        <pre class="loomos-diagnostic">${escapeHtml(diagnosticText())}</pre>
        ${pipeline?.debugReport ? `<button type="button" class="loomos-button loomos-btn-sm" data-action="copy-debug-report">Copy Debug Report</button>` : ""}
      </details>
      ${settings.showInjectionPreview && injectionPreview ? renderInjectionPreview(injectionPreview) : ""}`;
  }

  function renderViewer(): void {
    if (!modal) return;
    modal.root.className = "loomos-root";
    modal.root.dataset.skin = settings.skin;
    modal.root.dataset.view = "modal";
    modal.setTitle(`LoomOS | ${exactLabel()}`);
    modal.root.innerHTML = `
      ${stickyHeaderHtml(Boolean(state) || historyItems.length > 0)}
      ${compileStatusCardHtml()}
      <div class="loomos-tab-pane">
        ${activeTab === "history"
          ? renderHistoryTab(historyItems, historyFilter, activeIdentity)
          : activeTab === "injection"
          ? injectionPreview ? renderInjectionPreview(injectionPreview) : ""
          : state
            ? renderDashboard(state, settings, activeTab)
            : emptyStateHtml()
        }
      </div>`;
  }

  function renderAll(): void {
    const uiState = captureUiState();
    renderDrawer();
    renderViewer();
    refreshAllMessageWidgets();
    restoreUiState(uiState);
  }

  function openViewer(): void {
    if (modal) {
      renderViewer();
      return;
    }
    modal = ctx.ui.showModal({
      title: `LoomOS | ${exactLabel()}`,
      width: Math.min(980, typeof window !== "undefined" ? window.innerWidth - 16 : 420),
      maxHeight: typeof window !== "undefined" ? Math.min(820, window.innerHeight - 32) : 600,
    });
    const root = modal.root;
    const onClick = (event: Event) => handleActionClick(event);
    root.addEventListener("click", onClick);
    const removeDismiss = modal.onDismiss(() => {
      root.removeEventListener("click", onClick);
      removeDismiss();
      modal = null;
      modalListenerCleanup = null;
    });
    modalListenerCleanup = () => {
      root.removeEventListener("click", onClick);
      removeDismiss();
      modal?.dismiss();
      modal = null;
    };
    renderViewer();
  }

  function readSettings(): LoomOSSettings {
    const root = tab.root;
    const moduleSettings = Object.fromEntries(MODULE_KEYS.map((key) => {
      const current = settings.moduleSettings[key];
      const value = {
        track: CORE_TRACKING_MODULES.has(key)
          ? true
          : root.querySelector<HTMLInputElement>(`[data-module="${key}"][data-axis="track"]`)?.checked ?? current.track,
        display: root.querySelector<HTMLInputElement>(`[data-module="${key}"][data-axis="display"]`)?.checked ?? current.display,
        inject: root.querySelector<HTMLInputElement>(`[data-module="${key}"][data-axis="inject"]`)?.checked ?? current.inject,
      };
      return [key, value];
    })) as LoomOSSettings["moduleSettings"];

    const customModules = (settings.customModules || []).map((m) => {
      const trackInput = root.querySelector<HTMLInputElement>(`[data-custom-module="${m.id}"][data-axis="track"]`);
      const displayInput = root.querySelector<HTMLInputElement>(`[data-custom-module="${m.id}"][data-axis="display"]`);
      const injectInput = root.querySelector<HTMLInputElement>(`[data-custom-module="${m.id}"][data-axis="inject"]`);
      return {
        ...m,
        enabled: trackInput ? trackInput.checked : m.enabled,
        display: displayInput ? displayInput.checked : m.display,
        inject: injectInput ? injectInput.checked : m.inject,
      };
    });

    return LoomOSSettingsSchema.parse({
      ...settings,
      skin: root.querySelector<HTMLSelectElement>('[data-setting="skin"]')?.value,
      modulePreset: root.querySelector<HTMLSelectElement>('[data-setting="modulePreset"]')?.value,
      connectionId: root.querySelector<HTMLSelectElement>('[data-setting="connectionId"]')?.value ?? "",
      autoGeneration: root.querySelector<HTMLSelectElement>('[data-setting="autoGeneration"]')?.value,
      injectionEnabled: root.querySelector<HTMLInputElement>('[data-setting="injectionEnabled"]')?.checked,
      showInjectionPreview: root.querySelector<HTMLInputElement>('[data-setting="showInjectionPreview"]')?.checked,
      injectionTokenBudget: Number(root.querySelector<HTMLInputElement>('[data-setting="injectionTokenBudget"]')?.value),
      compilerSeedTokenBudget: Number(root.querySelector<HTMLInputElement>('[data-setting="compilerSeedTokenBudget"]')?.value),
      recentMessageLimit: Number(root.querySelector<HTMLInputElement>('[data-setting="recentMessageLimit"]')?.value),
      historyRetentionLimit: Number(root.querySelector<HTMLInputElement>('[data-setting="historyRetentionLimit"]')?.value),
      generationTimeoutSeconds: Number(root.querySelector<HTMLInputElement>('[data-setting="generationTimeoutSeconds"]')?.value),
      moduleSettings,
      customModules,
    });
  }

  let saveSettingsTimeout: ReturnType<typeof setTimeout> | null = null;
  function saveCurrentSettingsDebounced(): void {
    try {
      settings = readSettings();
      if (saveSettingsTimeout) clearTimeout(saveSettingsTimeout);
      saveSettingsTimeout = setTimeout(() => {
        send({ type: "save_settings", requestId: requestId("settings"), settings });
        if (settings.showInjectionPreview && activeIdentity?.chatId) {
          send({ type: "preview_injection", requestId: requestId("preview-settings"), chatId: activeIdentity.chatId });
        }
      }, 600);
    } catch (error) {
      status = error instanceof Error ? error.message : String(error);
      renderAll();
    }
  }

  function applyModulePreset(preset: string): void {
    let nextSettings: Record<ModuleKey, ModuleControl>;
    if (preset.startsWith("custom:")) {
      const presetId = preset.substring(7);
      const custom = settings.customModulePresets?.find(p => p.id === presetId);
      if (custom) {
        nextSettings = custom.moduleSettings;
      } else {
        return;
      }
    } else if (preset !== "custom") {
      nextSettings = moduleSettingsForPreset(preset as Exclude<ModulePreset, "custom">);
    } else {
      return;
    }

    for (const module of getEffectiveModuleCatalog(settings)) {
      nextSettings[module.key].display = module.defaultControl.display;
      nextSettings[module.key].inject = module.defaultControl.inject;
    }

    settings = LoomOSSettingsSchema.parse({
      ...settings,
      modulePreset: preset,
      moduleSettings: nextSettings,
    });
    status = `Preset applied`;
    send({ type: "save_settings", requestId: requestId("preset"), settings });
    renderAll();
  }

  function startGeneration(): void {
    if (saveSettingsTimeout) {
      clearTimeout(saveSettingsTimeout);
      saveSettingsTimeout = null;
      send({ type: "save_settings", requestId: requestId("settings"), settings });
    }

    const identity = currentRequest();
    if (!identity?.messageId) {
      status = "Open a chat with at least one message first.";
      renderAll();
      return;
    }
    if (!permissions.generation || !permissions.chatMutation) {
      status = "Generation and chat access permissions are required.";
      renderAll();
      return;
    }
    activeGenerationRequestId = requestId("generate");
    status = "Resolving exact swipe";
    pipeline = null;
    startElapsedTimer();
    send({
      type: "generate_state",
      requestId: activeGenerationRequestId,
      identity,
    });
    renderAll();
  }

  function reloadState(): void {
    const identity = currentRequest();
    if (!identity?.messageId) {
      activeIdentity = null;
      state = null;
      status = "No active message";
      renderAll();
      return;
    }
    status = "Loading exact swipe";
    send({ type: "get_state", requestId: requestId("state"), identity });
    renderAll();
  }

  async function deleteCurrentState(): Promise<void> {
    const identity = currentRequest();
    if (!identity?.messageId) return;
    const { confirmed } = await ctx.ui.showConfirm({
      title: "Delete LoomOS State",
      message: "Delete the stored snapshot for this exact message and swipe?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!confirmed) return;
    send({ type: "delete_state", requestId: requestId("delete"), identity });
  }

  function showWhatChangedModal(): void {
    if (!state) return;
    const wm = ctx.ui.showModal({
      title: `What Changed - ${state.delta.headline.slice(0, 40) || "No headline"}`,
      width: 700,
      maxHeight: 700,
    });
    wm.root.innerHTML = renderWhatChangedModal(state);
    wm.root.querySelector(".loomos-button[data-action='close']")?.addEventListener("click", () => wm.dismiss());
    const dismiss = wm.onDismiss(() => { dismiss(); });
  }

  async function requestPermissions(): Promise<void> {
    try {
      const requested: Array<"generation" | "chat_mutation" | "interceptor"> = [
        "generation",
        "chat_mutation",
      ];
      if (settings.injectionEnabled) requested.push("interceptor");
      status = "Waiting for permission confirmation";
      renderAll();
      await ctx.permissions.request(requested, {
        reason: "LoomOS reads chat history for exact-swipe state, runs quiet generation, and optionally injects a compact summary.",
      });
      send({ type: "refresh_permissions", requestId: requestId("permissions") });
      send({ type: "get_connections", requestId: requestId("connections") });
    } catch (error) {
      status = error instanceof Error ? error.message : String(error);
      renderAll();
    }
  }

  function syncFromHost(asReady: boolean): void {
    const active = currentRequest();
    if (!active?.chatId) {
      activeIdentity = null;
      state = null;
      status = "No active chat";
      send({ type: "ready", active: null });
      renderAll();
      return;
    }
    status = "Loading exact swipe";
    if (asReady) {
      send({ type: "ready", active });
    } else {
      send({ type: "get_state", requestId: requestId("sync"), identity: active });
    }
    send({ type: "get_chat_states", requestId: requestId("chat-states-sync"), chatId: active.chatId });
    send({ type: "list_state_history", requestId: requestId("history-sync"), chatId: active.chatId });
    if (settings.showInjectionPreview) {
      send({ type: "preview_injection", requestId: requestId("preview-sync"), chatId: active.chatId });
    }
    renderAll();
  }

  function scheduleHostSync(): void {
    if (hostSyncTimeout) clearTimeout(hostSyncTimeout);
    hostSyncTimeout = setTimeout(() => {
      hostSyncTimeout = null;
      syncFromHost(false);
    }, 75);
  }

  function identityFromEvent(payload: unknown): IdentityRequest | null {
    if (!isRecord(payload) || !isRecord(payload.message)) return null;
    const message = payload.message;
    const chatId = typeof payload.chatId === "string"
      ? payload.chatId
      : typeof message.chat_id === "string"
      ? message.chat_id
      : null;
    if (!chatId || typeof message.id !== "string" || typeof message.swipe_id !== "number") return null;
    return { chatId, messageId: message.id, swipeId: message.swipe_id };
  }

  async function handlePresetAction(action: string): Promise<void> {
    const activePreset = settings.modulePreset;
    const presets = settings.customModulePresets || [];
    
    if (action === "save-as") {
      const pm = ctx.ui.showModal({ title: "Save Custom Preset", width: 440, maxHeight: 300 });
      pm.root.innerHTML = `
        <div class="loomos-root loomos-prompt-dialog" data-skin="${settings.skin}">
          <label class="loomos-field">
            <span>Preset Name</span>
            <input class="loomos-input" type="text" id="preset-name" placeholder="My Custom Preset" required>
          </label>
          <label class="loomos-field">
            <span>Description</span>
            <input class="loomos-input" type="text" id="preset-desc" placeholder="Lite tracking plus cast visuals">
          </label>
          <div class="loomos-dialog-buttons">
            <button type="button" class="loomos-button loomos-button-primary" id="preset-confirm">Save</button>
            <button type="button" class="loomos-button" id="preset-cancel">Cancel</button>
          </div>
        </div>
      `;
      
      const onConfirm = () => {
        const name = pm.root.querySelector<HTMLInputElement>("#preset-name")?.value.trim();
        const desc = pm.root.querySelector<HTMLInputElement>("#preset-desc")?.value.trim() || "";
        if (!name) return;
        
        const newId = crypto.randomUUID();
        const newPreset = {
          id: newId,
          name,
          description: desc,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          moduleSettings: { ...settings.moduleSettings }
        };
        
        settings.customModulePresets = [...presets, newPreset];
        settings.modulePreset = "custom:" + newId;
        
        send({ type: "save_settings", requestId: requestId("preset-save"), settings });
        status = `Preset "${name}" saved`;
        pm.dismiss();
        renderAll();
      };
      
      pm.root.querySelector("#preset-confirm")?.addEventListener("click", onConfirm);
      pm.root.querySelector("#preset-cancel")?.addEventListener("click", () => pm.dismiss());
    }
    
    if (action === "update" && activePreset.startsWith("custom:")) {
      const presetId = activePreset.substring(7);
      const idx = presets.findIndex(p => p.id === presetId);
      if (idx >= 0) {
        presets[idx] = {
          ...presets[idx]!,
          moduleSettings: { ...settings.moduleSettings },
          updatedAt: new Date().toISOString()
        };
        settings.customModulePresets = [...presets];
        send({ type: "save_settings", requestId: requestId("preset-update"), settings });
        status = `Preset "${presets[idx]!.name}" updated`;
        renderAll();
      }
    }
    
    if (action === "duplicate" && activePreset.startsWith("custom:")) {
      const presetId = activePreset.substring(7);
      const original = presets.find(p => p.id === presetId);
      if (original) {
        const newId = crypto.randomUUID();
        const duplicatePreset = {
          id: newId,
          name: original.name + " (Copy)",
          description: original.description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          moduleSettings: { ...original.moduleSettings }
        };
        settings.customModulePresets = [...presets, duplicatePreset];
        settings.modulePreset = "custom:" + newId;
        settings.moduleSettings = { ...original.moduleSettings };
        send({ type: "save_settings", requestId: requestId("preset-dup"), settings });
        status = `Preset duplicated as "${duplicatePreset.name}"`;
        renderAll();
      }
    }
    
    if (action === "rename" && activePreset.startsWith("custom:")) {
      const presetId = activePreset.substring(7);
      const original = presets.find(p => p.id === presetId);
      if (!original) return;
      
      const pm = ctx.ui.showModal({ title: "Rename Preset", width: 440, maxHeight: 240 });
      pm.root.innerHTML = `
        <div class="loomos-root loomos-prompt-dialog" data-skin="${settings.skin}">
          <label class="loomos-field">
            <span>New Name</span>
            <input class="loomos-input" type="text" id="preset-name" value="${escapeHtml(original.name)}" required>
          </label>
          <div class="loomos-dialog-buttons">
            <button type="button" class="loomos-button loomos-button-primary" id="preset-confirm">Rename</button>
            <button type="button" class="loomos-button" id="preset-cancel">Cancel</button>
          </div>
        </div>
      `;
      
      const onConfirm = () => {
        const name = pm.root.querySelector<HTMLInputElement>("#preset-name")?.value.trim();
        if (!name) return;
        
        const idx = presets.findIndex(p => p.id === presetId);
        if (idx >= 0) {
          presets[idx] = {
            ...presets[idx]!,
            name,
            updatedAt: new Date().toISOString()
          };
          settings.customModulePresets = [...presets];
          send({ type: "save_settings", requestId: requestId("preset-rename"), settings });
          status = `Preset renamed to "${name}"`;
        }
        pm.dismiss();
        renderAll();
      };
      
      pm.root.querySelector("#preset-confirm")?.addEventListener("click", onConfirm);
      pm.root.querySelector("#preset-cancel")?.addEventListener("click", () => pm.dismiss());
    }
    
    if (action === "delete" && activePreset.startsWith("custom:")) {
      const presetId = activePreset.substring(7);
      const original = presets.find(p => p.id === presetId);
      if (!original) return;
      
      const { confirmed } = await ctx.ui.showConfirm({
        title: "Delete Preset",
        message: `Delete the custom preset "${original.name}"? This cannot be undone.`,
        variant: "danger",
        confirmLabel: "Delete"
      });
      
      if (confirmed) {
        settings.customModulePresets = presets.filter(p => p.id !== presetId);
        settings.modulePreset = "balanced";
        settings.moduleSettings = moduleSettingsForPreset("balanced");
        send({ type: "save_settings", requestId: requestId("preset-delete"), settings });
        status = `Preset "${original.name}" deleted`;
        renderAll();
      }
    }
    
    if (action === "export" && (activePreset.startsWith("custom:") || activePreset === "custom")) {
      let exportObj;
      if (activePreset.startsWith("custom:")) {
        const presetId = activePreset.substring(7);
        const original = presets.find(p => p.id === presetId);
        if (original) {
          exportObj = original;
        }
      } else {
        exportObj = {
          id: "exported-settings",
          name: "Exported Custom Settings",
          description: "Direct export of unsaved settings",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          moduleSettings: settings.moduleSettings
        };
      }
      
      if (exportObj) {
        const jsonStr = JSON.stringify(exportObj, null, 2);
        const pm = ctx.ui.showModal({ title: "Export Preset", width: 500, maxHeight: 400 });
        pm.root.innerHTML = `
          <div class="loomos-root loomos-prompt-dialog" data-skin="${settings.skin}">
            <label class="loomos-field">
              <span>Copy JSON Content:</span>
              <textarea class="loomos-input" id="export-json" style="height: 180px; font-family: monospace; font-size: 11px;" readonly>${escapeHtml(jsonStr)}</textarea>
            </label>
            <div class="loomos-dialog-buttons">
              <button type="button" class="loomos-button loomos-button-primary" id="export-copy">Copy to Clipboard</button>
              <button type="button" class="loomos-button" id="export-close">Close</button>
            </div>
          </div>
        `;
        
        pm.root.querySelector("#export-copy")?.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(jsonStr);
            status = "Copied to clipboard";
            pm.dismiss();
            renderAll();
          } catch {
            const txt = pm.root.querySelector<HTMLTextAreaElement>("#export-json");
            if (txt) {
              txt.select();
              document.execCommand("copy");
              status = "Copied to clipboard";
              pm.dismiss();
              renderAll();
            }
          }
        });
        pm.root.querySelector("#export-close")?.addEventListener("click", () => pm.dismiss());
      }
    }
    
    if (action === "import") {
      const pm = ctx.ui.showModal({ title: "Import Preset", width: 500, maxHeight: 400 });
      pm.root.innerHTML = `
        <div class="loomos-root loomos-prompt-dialog" data-skin="${settings.skin}">
          <label class="loomos-field">
            <span>Paste Preset JSON:</span>
            <textarea class="loomos-input" id="import-json" style="height: 180px; font-family: monospace; font-size: 11px;" placeholder='{\n  "name": "My Preset",\n  "moduleSettings": { ... }\n}' required></textarea>
          </label>
          <div class="loomos-dialog-buttons">
            <button type="button" class="loomos-button loomos-button-primary" id="import-confirm">Import</button>
            <button type="button" class="loomos-button" id="import-cancel">Cancel</button>
          </div>
        </div>
      `;
      
      const onConfirm = () => {
        const jsonStr = pm.root.querySelector<HTMLTextAreaElement>("#import-json")?.value.trim();
        if (!jsonStr) return;
        
        try {
          const parsed = JSON.parse(jsonStr);
          const result = CustomModulePresetSchema.safeParse({
            id: parsed.id || crypto.randomUUID(),
            name: parsed.name || "Imported Preset",
            description: parsed.description || "Imported from JSON",
            createdAt: parsed.createdAt || new Date().toISOString(),
            updatedAt: parsed.updatedAt || new Date().toISOString(),
            moduleSettings: parsed.moduleSettings
          });
          
          if (result.success) {
            const imported = result.data;
            if (presets.some(p => p.id === imported.id)) {
              imported.id = crypto.randomUUID();
            }
            settings.customModulePresets = [...presets, imported];
            settings.modulePreset = "custom:" + imported.id;
            settings.moduleSettings = imported.moduleSettings;
            send({ type: "save_settings", requestId: requestId("preset-import"), settings });
            status = `Preset "${imported.name}" imported`;
            pm.dismiss();
            renderAll();
          } else {
            alert("Invalid preset schema: " + result.error.issues.map(i => i.message).join(", "));
          }
        } catch (err) {
          alert("Failed to parse JSON: " + (err instanceof Error ? err.message : String(err)));
        }
      };
      
      pm.root.querySelector("#import-confirm")?.addEventListener("click", onConfirm);
      pm.root.querySelector("#import-cancel")?.addEventListener("click", () => pm.dismiss());
    }
  }

  function handleStockModuleAction(action: string, moduleKey: string): void {
    if (action === "inspect") {
      const entry = MODULE_CATALOG.find((m) => m.key === moduleKey);
      if (!entry) return;
      const ov = settings.stockModuleOverrides?.[moduleKey];
      const effective = getEffectiveModuleCatalog(settings).find((m) => m.key === entry.key)!;
      const schemaStructure = MODULE_SCHEMA_STRUCTURES[moduleKey as keyof typeof MODULE_SCHEMA_STRUCTURES] || "No structure summary available.";
      const modulePrompt = buildStockModulePromptBlock(entry.key, settings.stockModuleOverrides);
      const fullPrompt = buildStateCompilerPrompt([entry.key], [], settings.stockModuleOverrides);
      const html = `
        <div class="loomos-root loomos-prompt-dialog" data-skin="${settings.skin}">
          <details class="loomos-cast-extra" open>
            <summary>Module Info</summary>
            <div class="loomos-cast-extra-body" style="display:grid;gap:4px;font-size:11px;">
              <p><strong>Key:</strong> <code>${escapeHtml(entry.key)}</code></p>
              <p><strong>Stock Label:</strong> ${escapeHtml(entry.label)}</p>
              <p><strong>Effective Label:</strong> ${escapeHtml(effective.label)}</p>
              <p><strong>Stock Group:</strong> ${escapeHtml(entry.group)} / <strong>Effective Group:</strong> ${escapeHtml(effective.group)}</p>
              <p><strong>Core:</strong> ${entry.core ? "Yes (locked)" : "No"}</p>
              <p><strong>Default Track:</strong> ${BALANCED_MODULE_SETTINGS[entry.key].track} / <strong>Default Display:</strong> ${BALANCED_MODULE_SETTINGS[entry.key].display} / <strong>Default Inject:</strong> ${BALANCED_MODULE_SETTINGS[entry.key].inject}</p>
              <p><strong>Current Track:</strong> ${settings.moduleSettings[entry.key].track} / <strong>Current Display:</strong> ${settings.moduleSettings[entry.key].display} / <strong>Current Inject:</strong> ${settings.moduleSettings[entry.key].inject}</p>
              <p><strong>Intensity:</strong> ${escapeHtml(effective.intensityLabel)}</p>
              ${ov ? `<p><strong style="color:#d58a42;">Overridden fields:</strong> ${Object.keys(ov).join(", ")}</p>` : ""}
            </div>
          </details>
          <details class="loomos-cast-extra">
            <summary>Stock Description</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;"><p>${escapeHtml(entry.description)}</p></div>
          </details>
          ${ov?.description ? `<details class="loomos-cast-extra"><summary>Override Description</summary><div class="loomos-cast-extra-body" style="font-size:11px;"><p>${escapeHtml(ov.description)}</p></div></details>` : ""}
          <details class="loomos-cast-extra">
            <summary>Runtime State V2 Structure (locked)</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;">
              <p class="loomos-hint">This path is enforced by Zod and cannot be changed from settings.</p>
              <pre class="loomos-contract-code">${escapeHtml(schemaStructure)}</pre>
              <button type="button" class="loomos-button loomos-btn-sm" data-action="copy-schema" data-copy="${escapeHtml(schemaStructure)}" style="margin-top:6px;">Copy Structure</button>
            </div>
          </details>
          <details class="loomos-cast-extra">
            <summary>Generation Schema Template</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;">
              <div class="loomos-subhead">Stock</div>
              <pre class="loomos-contract-code">${escapeHtml(entry.schemaSummary)}</pre>
              <div class="loomos-subhead">Effective</div>
              <pre class="loomos-contract-code">${escapeHtml(effective.schemaSummary)}</pre>
            </div>
          </details>
          <details class="loomos-cast-extra">
            <summary>Compiler Instruction</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;">
              <div class="loomos-subhead">Stock</div>
              <pre class="loomos-contract-code">${escapeHtml(entry.compilerInstruction)}</pre>
              <div class="loomos-subhead">Effective</div>
              <pre class="loomos-contract-code">${escapeHtml(effective.compilerInstruction)}</pre>
            </div>
          </details>
          <details class="loomos-cast-extra">
            <summary>Exact Module Prompt Block</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;">
              <textarea class="loomos-input loomos-contract-textarea" id="inspect-module-prompt" readonly>${escapeHtml(modulePrompt)}</textarea>
              <button type="button" class="loomos-button loomos-btn-sm" data-copy-contract="inspect-module-prompt">Copy Module Prompt</button>
            </div>
          </details>
          <details class="loomos-cast-extra">
            <summary>Full Generated Compiler Prompt</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;">
              <p class="loomos-hint">Includes the global compiler contract, full State V2 example, shared rules, and this module's effective schema and instruction.</p>
              <textarea class="loomos-input loomos-contract-textarea loomos-contract-textarea-full" id="inspect-full-prompt" readonly>${escapeHtml(fullPrompt)}</textarea>
              <button type="button" class="loomos-button loomos-btn-sm" data-copy-contract="inspect-full-prompt">Copy Full Prompt</button>
            </div>
          </details>
          <details class="loomos-cast-extra">
            <summary>Injection Behavior</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;"><p>${escapeHtml(entry.injectionBehavior)}</p>
            ${ov?.injectionPriority ? `<p><strong>Override injection priority:</strong> ${ov.injectionPriority}</p>` : ""}</div>
          </details>
          <details class="loomos-cast-extra">
            <summary>Render Behavior</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;"><p>${escapeHtml(entry.renderBehavior)}</p>
            ${ov?.renderHint ? `<p><strong>Override render hint:</strong> ${escapeHtml(ov.renderHint)}</p>` : ""}</div>
          </details>
          <div class="loomos-dialog-buttons">
            <button type="button" class="loomos-button loomos-button-primary" data-action="close-inspect">Close</button>
          </div>
        </div>
      `;
      const im = ctx.ui.showModal({ title: `Inspect: ${effective.label}`, width: Math.min(760, window.innerWidth - 16), maxHeight: Math.min(760, window.innerHeight - 32) });
      im.root.className = "loomos-root";
      im.root.innerHTML = html;
      im.root.querySelector("[data-action='close-inspect']")?.addEventListener("click", () => im.dismiss());
      im.root.querySelector("[data-action='copy-schema']")?.addEventListener("click", async (e) => {
        const btn = e.currentTarget as HTMLElement;
        const text = btn?.dataset.copy || "";
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = "Copied!";
          setTimeout(() => { btn.textContent = "Copy Structure"; }, 2000);
        } catch {
          btn.textContent = "Copy failed";
        }
      });
      im.root.querySelectorAll<HTMLElement>("[data-copy-contract]").forEach((button) => {
        button.addEventListener("click", async () => {
          const id = button.dataset.copyContract;
          const value = id
            ? im.root.querySelector<HTMLTextAreaElement>(`#${id}`)?.value ?? ""
            : "";
          try {
            await navigator.clipboard.writeText(value);
            button.textContent = "Copied";
          } catch {
            button.textContent = "Copy failed";
          }
        });
      });
      const dismiss = im.onDismiss(() => { dismiss(); });
      return;
    }

    if (action === "edit") {
      const entry = MODULE_CATALOG.find((m) => m.key === moduleKey);
      if (!entry) return;
      const ov = settings.stockModuleOverrides?.[moduleKey];

      const em = ctx.ui.showModal({ title: `Edit Override: ${ov?.label || entry.label}`, width: Math.min(600, window.innerWidth - 16), maxHeight: Math.min(650, window.innerHeight - 32) });
      em.root.className = "loomos-root";
      em.root.innerHTML = `
        <div class="loomos-prompt-dialog" data-skin="${settings.skin}">
          <div class="loomos-note"><strong>Generation contract override:</strong> Replace the prompt-facing schema or compiler instruction here. The stored State V2 Zod schema remains locked, so replacements must still describe compatible output fields.</div>
          <label class="loomos-field"><span>Label override</span><input class="loomos-input" type="text" id="sm-label" value="${escapeHtml(ov?.label || "")}" placeholder="${escapeHtml(entry.label)}"></label>
          <label class="loomos-field"><span>Group override</span><input class="loomos-input" type="text" id="sm-group" value="${escapeHtml(ov?.group || "")}" placeholder="${escapeHtml(entry.group)}"></label>
          <label class="loomos-field"><span>Description override</span><input class="loomos-input" type="text" id="sm-desc" value="${escapeHtml(ov?.description || "")}" placeholder="${escapeHtml(entry.description)}"></label>
          <label class="loomos-field"><span>Icon/Emoji</span><input class="loomos-input" type="text" id="sm-icon" value="${escapeHtml(ov?.icon || "")}" placeholder="e.g. 🎭" maxlength="20"></label>
          <label class="loomos-field"><span>Display order</span><input class="loomos-input" type="number" id="sm-order" value="${ov?.displayOrder ?? ""}" placeholder="Auto"></label>
          <label class="loomos-field"><span>Intensity label</span><input class="loomos-input" type="text" id="sm-intensity" value="${escapeHtml(ov?.intensityLabel || "")}" placeholder="${escapeHtml(entry.intensity)}"></label>
          <label class="loomos-field"><span>Generation schema replacement</span><textarea class="loomos-input loomos-contract-textarea" id="sm-schema-override" placeholder="${escapeHtml(entry.schemaSummary)}">${escapeHtml(ov?.schemaSummaryOverride || "")}</textarea></label>
          <label class="loomos-field"><span>Compiler instruction replacement</span><textarea class="loomos-input loomos-contract-textarea" id="sm-compiler-override" placeholder="${escapeHtml(entry.compilerInstruction)}">${escapeHtml(ov?.compilerInstructionOverride || "")}</textarea></label>
          <label class="loomos-field"><span>Additional compiler guidance</span><textarea class="loomos-input" id="sm-addendum" style="height:80px;" placeholder="Appended after the effective compiler instruction">${escapeHtml(ov?.compilerGuidanceAddendum || "")}</textarea></label>
          <label class="loomos-field"><span>Injection priority (higher = injected first)</span><input class="loomos-input" type="number" id="sm-priority" value="${ov?.injectionPriority ?? ""}" placeholder="Auto"></label>
          <label class="loomos-field"><span>Render hint</span><input class="loomos-input" type="text" id="sm-render-hint" value="${escapeHtml(ov?.renderHint || "")}" placeholder="Custom render behavior hint"></label>
          <label class="loomos-check" style="margin-top:4px;"><input type="checkbox" id="sm-hidden"${checked(ov?.hiddenFromSettings === true)}><span>Hidden from settings</span></label>
          <label class="loomos-check"><input type="checkbox" id="sm-def-display"${checked(ov?.defaultDisplay === true)}><span>Default display enabled</span></label>
          <label class="loomos-check"><input type="checkbox" id="sm-def-inject"${checked(ov?.defaultInject === true)}><span>Default inject enabled</span></label>
          <div class="loomos-dialog-buttons">
            <button type="button" class="loomos-button loomos-button-primary" id="sm-save">Save Override</button>
            <button type="button" class="loomos-button" id="sm-cancel">Cancel</button>
          </div>
        </div>
      `;

      em.root.querySelector("#sm-save")?.addEventListener("click", () => {
        const override: StockModuleOverride = {};
        const label = em.root.querySelector<HTMLInputElement>("#sm-label")?.value.trim();
        if (label) override.label = label;
        const group = em.root.querySelector<HTMLInputElement>("#sm-group")?.value.trim();
        if (group) override.group = group;
        const desc = em.root.querySelector<HTMLInputElement>("#sm-desc")?.value.trim();
        if (desc) override.description = desc;
        const icon = em.root.querySelector<HTMLInputElement>("#sm-icon")?.value.trim();
        if (icon) override.icon = icon;
        const order = em.root.querySelector<HTMLInputElement>("#sm-order")?.value;
        if (order) { const n = parseInt(order, 10); if (!isNaN(n)) override.displayOrder = n; }
        const intensity = em.root.querySelector<HTMLInputElement>("#sm-intensity")?.value.trim();
        if (intensity) override.intensityLabel = intensity;
        const schemaOverride = em.root.querySelector<HTMLTextAreaElement>("#sm-schema-override")?.value.trim();
        if (schemaOverride) override.schemaSummaryOverride = schemaOverride;
        const compilerOverride = em.root.querySelector<HTMLTextAreaElement>("#sm-compiler-override")?.value.trim();
        if (compilerOverride) override.compilerInstructionOverride = compilerOverride;
        const addendum = em.root.querySelector<HTMLTextAreaElement>("#sm-addendum")?.value.trim();
        if (addendum) override.compilerGuidanceAddendum = addendum;
        const priority = em.root.querySelector<HTMLInputElement>("#sm-priority")?.value;
        if (priority) { const n = parseInt(priority, 10); if (!isNaN(n)) override.injectionPriority = n; }
        const renderHint = em.root.querySelector<HTMLInputElement>("#sm-render-hint")?.value.trim();
        if (renderHint) override.renderHint = renderHint;
        override.hiddenFromSettings = em.root.querySelector<HTMLInputElement>("#sm-hidden")?.checked ?? false;
        override.defaultDisplay = em.root.querySelector<HTMLInputElement>("#sm-def-display")?.checked ?? false;
        override.defaultInject = em.root.querySelector<HTMLInputElement>("#sm-def-inject")?.checked ?? false;

        settings = LoomOSSettingsSchema.parse({
          ...settings,
          stockModuleOverrides: {
            ...settings.stockModuleOverrides,
            [moduleKey]: Object.keys(override).length > 0 ? override : undefined,
          },
        });
        send({ type: "save_settings", requestId: requestId("stock-override"), settings });
        status = `Override saved for "${ov?.label || entry.label}"`;
        em.dismiss();
        renderAll();
      });

      em.root.querySelector("#sm-cancel")?.addEventListener("click", () => em.dismiss());
      const dismiss = em.onDismiss(() => { dismiss(); });
      return;
    }

    if (action === "reset") {
      const entry = MODULE_CATALOG.find((m) => m.key === moduleKey);
      if (!entry) return;
      const newOverrides = { ...settings.stockModuleOverrides };
      delete newOverrides[moduleKey];
      settings = LoomOSSettingsSchema.parse({
        ...settings,
        stockModuleOverrides: newOverrides,
      });
      send({ type: "save_settings", requestId: requestId("stock-reset"), settings });
      status = `Override reset for "${entry.label}"`;
      renderAll();
      return;
    }

    if (action === "duplicate-as-custom") {
      const key = moduleKey as ModuleKey;
      if (!MODULE_KEYS.includes(key)) return;
      const custom = createCustomModuleFromStock(
        key,
        settings,
        "cmod_" + crypto.randomUUID().replace(/-/g, "").substring(0, 12),
      );
      settings = LoomOSSettingsSchema.parse({
        ...settings,
        customModules: [...settings.customModules, custom],
      });
      send({ type: "save_settings", requestId: requestId("stock-duplicate"), settings });
      status = `"${custom.label}" created`;
      renderAll();
    }
  }

  async function openCustomModuleEditor(
    original: LoomOSSettings["customModules"][number] | undefined,
    customMods: LoomOSSettings["customModules"],
  ): Promise<void> {
    const isEdit = Boolean(original);
    let draft = CustomModuleSchema.parse(original ?? {
      id: "cmod_" + crypto.randomUUID().replace(/-/g, "").substring(0, 12),
      label: "New Custom Module",
      group: "Custom",
      description: "",
      enabled: true,
      display: true,
      inject: true,
      compilerInstruction: "Track grounded evidence for this module.",
      outputMode: "cards",
      maxItems: 6,
      intensity: "medium",
      displayOrder: 10_000,
      schemaFields: [],
      htmlTemplate: STARTER_CUSTOM_HTML,
      cssTemplate: STARTER_CUSTOM_CSS,
      templateEngine: "mustache-lite",
      allowHtmlTemplate: false,
    });
    let schemaFields: CustomModuleField[] = [...draft.schemaFields];
    let editingFieldId: string | null = null;
    const pm = ctx.ui.showModal({
      title: isEdit ? "Edit Custom Module" : "Add Custom Module",
      width: Math.min(760, window.innerWidth - 16),
      maxHeight: Math.min(820, window.innerHeight - 32),
    });

    const readDefaultValue = (): unknown => {
      const raw = pm.root.querySelector<HTMLInputElement>("#field-default")?.value.trim() ?? "";
      if (!raw) return undefined;
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    };

    const syncDraft = (): void => {
      const currentLabel = pm.root.querySelector<HTMLInputElement>("#mod-label")?.value;
      if (currentLabel === undefined) return;
      draft = {
        ...draft,
        label: currentLabel,
        group: pm.root.querySelector<HTMLInputElement>("#mod-group")?.value ?? draft.group,
        description: pm.root.querySelector<HTMLInputElement>("#mod-desc")?.value ?? draft.description,
        compilerInstruction: pm.root.querySelector<HTMLTextAreaElement>("#mod-instruction")?.value ?? draft.compilerInstruction,
        outputMode: (pm.root.querySelector<HTMLSelectElement>("#mod-output-mode")?.value ?? draft.outputMode) as typeof draft.outputMode,
        intensity: (pm.root.querySelector<HTMLSelectElement>("#mod-intensity")?.value ?? draft.intensity) as typeof draft.intensity,
        maxItems: Number(pm.root.querySelector<HTMLInputElement>("#mod-max")?.value || draft.maxItems),
        displayOrder: Number(pm.root.querySelector<HTMLInputElement>("#mod-order")?.value || draft.displayOrder || 10_000),
        allowHtmlTemplate: pm.root.querySelector<HTMLInputElement>("#mod-allow-template")?.checked ?? draft.allowHtmlTemplate,
        templateEngine: (pm.root.querySelector<HTMLSelectElement>("#mod-template-engine")?.value ?? draft.templateEngine) as typeof draft.templateEngine,
        htmlTemplate: pm.root.querySelector<HTMLTextAreaElement>("#mod-html")?.value ?? draft.htmlTemplate,
        cssTemplate: pm.root.querySelector<HTMLTextAreaElement>("#mod-css")?.value ?? draft.cssTemplate,
      };
    };

    const renderEditor = (): void => {
      const editing = schemaFields.find((field) => field.id === editingFieldId);
      const previewModule = CustomModuleSchema.parse({
        ...draft,
        label: draft.label.trim() || "Custom Module",
        compilerInstruction: draft.compilerInstruction.trim() || "Track grounded evidence.",
        schemaFields,
      });
      pm.root.className = "loomos-root";
      pm.root.innerHTML = `
        <div class="loomos-prompt-dialog loomos-module-editor" data-skin="${settings.skin}">
          <div class="loomos-editor-grid">
            <label class="loomos-field"><span>Label</span><input class="loomos-input" id="mod-label" value="${escapeHtml(draft.label)}"></label>
            <label class="loomos-field"><span>Group</span><input class="loomos-input" id="mod-group" value="${escapeHtml(draft.group)}"></label>
            <label class="loomos-field loomos-full-span"><span>Description</span><input class="loomos-input" id="mod-desc" value="${escapeHtml(draft.description)}"></label>
            <label class="loomos-field loomos-full-span"><span>Compiler Instruction</span><textarea class="loomos-input loomos-editor-textarea" id="mod-instruction" maxlength="1600">${escapeHtml(draft.compilerInstruction)}</textarea></label>
            <label class="loomos-field"><span>Output Mode</span><select class="loomos-select" id="mod-output-mode">
              ${(["cards", "bullets", "chips", "gauge", "template"] as const).map((mode) =>
                `<option value="${mode}"${draft.outputMode === mode ? " selected" : ""}>${mode}</option>`
              ).join("")}
            </select></label>
            <label class="loomos-field"><span>Intensity</span><select class="loomos-select" id="mod-intensity">
              ${(["light", "medium", "heavy", "experimental"] as const).map((value) =>
                `<option value="${value}"${draft.intensity === value ? " selected" : ""}>${value}</option>`
              ).join("")}
            </select></label>
            <label class="loomos-field"><span>Max Items</span><input class="loomos-input" type="number" id="mod-max" min="1" max="24" value="${draft.maxItems}"></label>
            <label class="loomos-field"><span>Display Order</span><input class="loomos-input" type="number" id="mod-order" value="${draft.displayOrder ?? 10_000}"></label>
          </div>

          <details class="loomos-editor-section" open>
            <summary>Schema Builder <span class="loomos-badge">${schemaFields.length} fields</span></summary>
            <div class="loomos-editor-section-body">
              <div class="loomos-schema-field-list">
                ${schemaFields.map((field, index) => `
                  <div class="loomos-schema-field-row">
                    <div><strong>${escapeHtml(field.label)}</strong><small>${escapeHtml(field.key)} | ${escapeHtml(field.type)}${field.required ? " | required" : ""}</small></div>
                    <div class="loomos-icon-actions">
                      <button type="button" class="loomos-icon-button" data-field-action="up" data-field-id="${escapeHtml(field.id)}" title="Move up"${index === 0 ? " disabled" : ""}>&#8593;</button>
                      <button type="button" class="loomos-icon-button" data-field-action="down" data-field-id="${escapeHtml(field.id)}" title="Move down"${index === schemaFields.length - 1 ? " disabled" : ""}>&#8595;</button>
                      <button type="button" class="loomos-icon-button" data-field-action="edit" data-field-id="${escapeHtml(field.id)}" title="Edit field">Edit</button>
                      <button type="button" class="loomos-icon-button loomos-button-danger" data-field-action="delete" data-field-id="${escapeHtml(field.id)}" title="Delete field">&times;</button>
                    </div>
                  </div>
                `).join("") || `<p class="loomos-muted">No structured fields yet.</p>`}
              </div>
              <div class="loomos-two-column">
                <label class="loomos-field"><span>Field Label</span><input class="loomos-input" id="field-label" value="${escapeHtml(editing?.label ?? "")}"></label>
                <label class="loomos-field"><span>Field Key</span><input class="loomos-input" id="field-key" value="${escapeHtml(editing?.key ?? "")}" placeholder="stableKey"></label>
                <label class="loomos-field"><span>Type</span><select class="loomos-select" id="field-type">
                  ${(["text", "longText", "number", "boolean", "enum", "gauge", "chips", "list"] as const).map((type) =>
                    `<option value="${type}"${editing?.type === type ? " selected" : ""}>${type}</option>`
                  ).join("")}
                </select></label>
                <label class="loomos-check"><input type="checkbox" id="field-required"${checked(editing?.required ?? false)}><span>Required</span></label>
                <label class="loomos-field loomos-full-span"><span>Description</span><input class="loomos-input" id="field-desc" value="${escapeHtml(editing?.description ?? "")}"></label>
                <label class="loomos-field"><span>Default JSON Value</span><input class="loomos-input" id="field-default" value="${escapeHtml(editing?.defaultValue === undefined ? "" : JSON.stringify(editing.defaultValue))}"></label>
                <label class="loomos-field"><span>Enum Options</span><input class="loomos-input" id="field-enums" value="${escapeHtml(editing?.enumOptions.join(", ") ?? "")}"></label>
                <label class="loomos-field"><span>Max Items</span><input class="loomos-input" type="number" id="field-max-items" min="1" max="50" value="${editing?.maxItems ?? ""}"></label>
                <label class="loomos-field"><span>Display Hint</span><input class="loomos-input" id="field-display-hint" value="${escapeHtml(editing?.displayHint ?? "")}"></label>
                <label class="loomos-field"><span>Minimum</span><input class="loomos-input" type="number" id="field-min" value="${editing?.min ?? ""}"></label>
                <label class="loomos-field"><span>Maximum</span><input class="loomos-input" type="number" id="field-max" value="${editing?.max ?? ""}"></label>
              </div>
              <div class="loomos-dialog-buttons">
                <button type="button" class="loomos-button loomos-button-primary" id="field-save">${editing ? "Update Field" : "Add Field"}</button>
                ${editing ? `<button type="button" class="loomos-button" id="field-cancel">Cancel Edit</button>` : ""}
                <button type="button" class="loomos-button" id="shape-copy">Copy JSON Shape</button>
              </div>
              <pre class="loomos-shape-preview">${escapeHtml(JSON.stringify(customModuleExpectedShape(previewModule), null, 2))}</pre>
            </div>
          </details>

          <details class="loomos-editor-section"${draft.outputMode === "template" ? " open" : ""}>
            <summary>HTML/CSS Template <span class="loomos-badge">Sanitized</span></summary>
            <div class="loomos-editor-section-body">
              <label class="loomos-check"><input type="checkbox" id="mod-allow-template"${checked(draft.allowHtmlTemplate)}><span>Allow sanitized HTML template rendering</span></label>
              <label class="loomos-field"><span>Template Engine</span><select class="loomos-select" id="mod-template-engine">
                <option value="mustache-lite"${draft.templateEngine === "mustache-lite" ? " selected" : ""}>Mustache Lite</option>
                <option value="token-replace"${draft.templateEngine === "token-replace" ? " selected" : ""}>Token Replace</option>
              </select></label>
              <p class="loomos-perf-warning">No scripts, event attributes, iframes, external assets, links, or external CSS. Templates are sanitized and compiled data is escaped.</p>
              <label class="loomos-field"><span>HTML Template</span><textarea class="loomos-input loomos-code-editor" id="mod-html" maxlength="8000">${escapeHtml(draft.htmlTemplate)}</textarea></label>
              <label class="loomos-field"><span>CSS Template</span><textarea class="loomos-input loomos-code-editor" id="mod-css" maxlength="8000">${escapeHtml(draft.cssTemplate)}</textarea></label>
              <div class="loomos-dialog-buttons">
                <button type="button" class="loomos-button" id="template-reset">Reset Starter</button>
                <button type="button" class="loomos-button" id="template-copy">Copy Template</button>
                <button type="button" class="loomos-button loomos-button-primary" id="template-preview">Refresh Preview</button>
              </div>
              <div class="loomos-template-preview" id="template-preview-root"></div>
            </div>
          </details>

          <div class="loomos-dialog-buttons loomos-editor-footer">
            <button type="button" class="loomos-button loomos-button-primary" id="mod-confirm">${isEdit ? "Save Changes" : "Add Module"}</button>
            <button type="button" class="loomos-button" id="mod-cancel">Cancel</button>
          </div>
        </div>`;

      pm.root.querySelector("#field-save")?.addEventListener("click", () => {
        syncDraft();
        const label = pm.root.querySelector<HTMLInputElement>("#field-label")?.value.trim() ?? "";
        const key = pm.root.querySelector<HTMLInputElement>("#field-key")?.value.trim() ?? "";
        if (!label || !key) {
          status = "Field label and key are required";
          return;
        }
        const maxItemsRaw = pm.root.querySelector<HTMLInputElement>("#field-max-items")?.value.trim();
        const minRaw = pm.root.querySelector<HTMLInputElement>("#field-min")?.value.trim();
        const maxRaw = pm.root.querySelector<HTMLInputElement>("#field-max")?.value.trim();
        const field = CustomModuleFieldSchema.parse({
          id: editing?.id ?? "field_" + crypto.randomUUID().replace(/-/g, "").substring(0, 10),
          label,
          key,
          type: pm.root.querySelector<HTMLSelectElement>("#field-type")?.value,
          required: pm.root.querySelector<HTMLInputElement>("#field-required")?.checked,
          description: pm.root.querySelector<HTMLInputElement>("#field-desc")?.value.trim() ?? "",
          defaultValue: readDefaultValue(),
          enumOptions: (pm.root.querySelector<HTMLInputElement>("#field-enums")?.value ?? "")
            .split(",").map((value) => value.trim()).filter(Boolean),
          maxItems: maxItemsRaw ? Number(maxItemsRaw) : undefined,
          min: minRaw ? Number(minRaw) : undefined,
          max: maxRaw ? Number(maxRaw) : undefined,
          displayHint: pm.root.querySelector<HTMLInputElement>("#field-display-hint")?.value.trim() || undefined,
        });
        schemaFields = editing
          ? schemaFields.map((candidate) => candidate.id === editing.id ? field : candidate)
          : [...schemaFields, field];
        editingFieldId = null;
        renderEditor();
      });
      pm.root.querySelector("#field-cancel")?.addEventListener("click", () => {
        syncDraft();
        editingFieldId = null;
        renderEditor();
      });
      pm.root.querySelectorAll<HTMLElement>("[data-field-action]").forEach((button) => {
        button.addEventListener("click", () => {
          syncDraft();
          const fieldId = button.dataset.fieldId;
          const fieldAction = button.dataset.fieldAction;
          const index = schemaFields.findIndex((field) => field.id === fieldId);
          if (index < 0) return;
          if (fieldAction === "edit") editingFieldId = fieldId ?? null;
          if (fieldAction === "delete") schemaFields = schemaFields.filter((field) => field.id !== fieldId);
          if (fieldAction === "up" && index > 0) {
            [schemaFields[index - 1], schemaFields[index]] = [schemaFields[index]!, schemaFields[index - 1]!];
          }
          if (fieldAction === "down" && index < schemaFields.length - 1) {
            [schemaFields[index], schemaFields[index + 1]] = [schemaFields[index + 1]!, schemaFields[index]!];
          }
          renderEditor();
        });
      });
      pm.root.querySelector("#shape-copy")?.addEventListener("click", async () => {
        syncDraft();
        const module = CustomModuleSchema.parse({
          ...draft,
          label: draft.label.trim() || "Custom Module",
          compilerInstruction: draft.compilerInstruction.trim() || "Track grounded evidence.",
          schemaFields,
        });
        await navigator.clipboard.writeText(JSON.stringify(customModuleExpectedShape(module), null, 2));
        status = "Expected JSON shape copied";
      });
      pm.root.querySelector("#template-reset")?.addEventListener("click", () => {
        syncDraft();
        draft.htmlTemplate = STARTER_CUSTOM_HTML;
        draft.cssTemplate = STARTER_CUSTOM_CSS;
        renderEditor();
      });
      pm.root.querySelector("#template-copy")?.addEventListener("click", async () => {
        syncDraft();
        await navigator.clipboard.writeText(`${draft.htmlTemplate}\n\n/* CSS */\n${draft.cssTemplate}`);
        status = "Template copied";
      });
      pm.root.querySelector("#template-preview")?.addEventListener("click", () => {
        syncDraft();
        const module = CustomModuleSchema.parse({
          ...draft,
          label: draft.label.trim() || "Custom Module",
          compilerInstruction: draft.compilerInstruction.trim() || "Track grounded evidence.",
          schemaFields,
        });
        const sample = CustomModuleDataSchema.parse({
          ...customModuleExpectedShape(module),
          summary: "Live sanitized preview",
          items: [{
            title: "Sample Item",
            text: "Compiled data is escaped before insertion.",
            importance: "medium",
            changed: false,
          }],
        });
        const preview = renderCustomTemplate(module, sample);
        const root = pm.root.querySelector<HTMLElement>("#template-preview-root");
        if (root) {
          root.innerHTML = `<style>${preview.css}</style><section class="loomos-custom-template ${preview.wrapperClass}">${preview.html}</section>`;
        }
      });
      pm.root.querySelector("#mod-confirm")?.addEventListener("click", () => {
        syncDraft();
        const validated = CustomModuleSchema.parse({
          ...draft,
          label: draft.label.trim(),
          group: draft.group.trim() || "Custom",
          description: draft.description.trim(),
          compilerInstruction: draft.compilerInstruction.trim(),
          schemaFields,
        });
        settings = LoomOSSettingsSchema.parse({
          ...settings,
          customModules: isEdit
            ? customMods.map((module) => module.id === validated.id ? validated : module)
            : [...customMods, validated],
        });
        send({ type: "save_settings", requestId: requestId("custom-mod"), settings });
        status = isEdit ? `Custom module "${validated.label}" updated` : `Custom module "${validated.label}" added`;
        pm.dismiss();
        renderAll();
      });
      pm.root.querySelector("#mod-cancel")?.addEventListener("click", () => pm.dismiss());
    };

    renderEditor();
  }

  async function handleCustomModuleAction(action: string, moduleId?: string): Promise<void> {
    const customMods = settings.customModules || [];

    if (action === "add" || (action === "edit" && moduleId)) {
      const original = action === "edit" ? customMods.find((m) => m.id === moduleId) : undefined;
      if (action === "edit" && !original) return;
      await openCustomModuleEditor(original, customMods);
      return;
    }

    if (action === "duplicate" && moduleId) {
      const original = customMods.find(m => m.id === moduleId);
      if (original) {
        const newId = "cmod_" + crypto.randomUUID().replace(/-/g, "").substring(0, 12);
        const dup = CustomModuleSchema.parse({
          ...original,
          id: newId,
          label: original.label + " (Copy)",
          enabled: original.enabled,
          display: original.display,
          inject: original.inject
        });
        settings.customModules = [...customMods, dup];
        send({ type: "save_settings", requestId: requestId("custom-dup"), settings });
        status = `Custom module duplicated as "${dup.label}"`;
        renderAll();
      }
    }
    
    if (action === "delete" && moduleId) {
      const original = customMods.find(m => m.id === moduleId);
      if (!original) return;
      
      const { confirmed } = await ctx.ui.showConfirm({
        title: "Delete Custom Module",
        message: `Delete custom module "${original.label}"? Old states containing this module's compiled data will retain their data but it will no longer compile on new generations.`,
        variant: "danger",
        confirmLabel: "Delete"
      });
      
      if (confirmed) {
        settings.customModules = customMods.filter(m => m.id !== moduleId);
        send({ type: "save_settings", requestId: requestId("custom-delete"), settings });
        status = `Custom module "${original.label}" deleted`;
        renderAll();
      }
    }
  }

  function handleBulkAction(action: string): void {
    const query = tab.root.querySelector<HTMLInputElement>("[data-module-search]")?.value.trim().toLowerCase() ?? "";
    
    const matchesQuery = (label: string, group: string, description: string) => {
      if (!query) return true;
      const text = `${label} ${group} ${description}`.toLowerCase();
      return text.includes(query);
    };

    if (action === "enable-display") {
      for (const m of getEffectiveModuleCatalog(settings)) {
        if (matchesQuery(m.label, m.group, m.description)) {
          settings.moduleSettings[m.key].display = true;
        }
      }
      if (settings.customModules) {
        for (const m of settings.customModules) {
          if (matchesQuery(m.label, m.group, m.description || "")) {
            m.display = true;
          }
        }
      }
      status = "Enabled display for matches";
    }
    
    if (action === "disable-display") {
      for (const m of getEffectiveModuleCatalog(settings)) {
        if (matchesQuery(m.label, m.group, m.description)) {
          settings.moduleSettings[m.key].display = false;
        }
      }
      if (settings.customModules) {
        for (const m of settings.customModules) {
          if (matchesQuery(m.label, m.group, m.description || "")) {
            m.display = false;
          }
        }
      }
      status = "Disabled display for matches";
    }
    
    if (action === "inject-recommended") {
      for (const m of getEffectiveModuleCatalog(settings)) {
        settings.moduleSettings[m.key].inject = m.defaultControl.inject;
      }
      status = "Reset injection to recommended modules";
    }
    
    if (action === "reset-presets") {
      const activePreset = settings.modulePreset;
      if (activePreset === "custom" || activePreset.startsWith("custom:")) {
        applyModulePreset("balanced");
      } else {
        applyModulePreset(activePreset);
      }
      return;
    }

    if (action === "reset-all-overrides") {
      settings = LoomOSSettingsSchema.parse({
        ...settings,
        stockModuleOverrides: {},
      });
      send({ type: "save_settings", requestId: requestId("reset-overrides"), settings });
      status = "All stock module overrides reset";
      saveCurrentSettingsDebounced();
      renderAll();
      return;
    }
    
    saveCurrentSettingsDebounced();
    renderAll();
  }

  function handleBackendMessage(payload: unknown): void {
    if (!isRecord(payload) || typeof payload.type !== "string") return;
    const response = payload as unknown as BackendResponse;
    switch (response.type) {
      case "bootstrap":
        settings = response.settings;
        permissions = response.permissions;
        connections = response.connections;
        activeIdentity = response.identity;
        state = response.state;
        status = response.identity
          ? response.state ? "Exact swipe state loaded" : "Ready to generate"
          : "No active message";
        
        if (activeIdentity?.chatId) {
          send({ type: "get_chat_states", requestId: requestId("chat-states"), chatId: activeIdentity.chatId });
          send({ type: "list_state_history", requestId: requestId("history"), chatId: activeIdentity.chatId });
          if (settings.showInjectionPreview) {
            send({ type: "preview_injection", requestId: requestId("preview"), chatId: activeIdentity.chatId });
          }
        }
        break;
      case "settings":
        settings = response.settings;
        status = "Settings saved";
        if (activeIdentity?.chatId) {
          send({ type: "get_chat_states", requestId: requestId("chat-states-settings"), chatId: activeIdentity.chatId });
          send({ type: "list_state_history", requestId: requestId("history-settings"), chatId: activeIdentity.chatId });
        }
        break;
      case "connections":
        connections = response.connections;
        status = connections.length > 0 ? "Connections refreshed" : "No ready connections found";
        break;
      case "state":
        activeIdentity = response.identity;
        state = response.state;
        status = response.state ? "Exact swipe state loaded" : "No state for this swipe";
        
        if (activeIdentity?.chatId) {
          send({ type: "get_chat_states", requestId: requestId("chat-states"), chatId: activeIdentity.chatId });
          send({ type: "list_state_history", requestId: requestId("history"), chatId: activeIdentity.chatId });
          if (settings.showInjectionPreview) {
            send({ type: "preview_injection", requestId: requestId("preview"), chatId: activeIdentity.chatId });
          }
        }
        break;
      case "permissions":
        permissions = response.permissions;
        status = "Permissions updated";
        break;
      case "generation_status":
        if (response.report) pipeline = response.report;
        if (response.status === "started" || response.status === "progress") {
          activeGenerationRequestId = response.requestId;
          if (response.identity) activeIdentity = response.identity;
          status = response.message ?? "Compiling story state";
        } else {
          if (activeGenerationRequestId === response.requestId) activeGenerationRequestId = null;
          stopElapsedTimer();
          status = response.message ?? (response.status === "completed" ? "State compiled" : response.status);
          
          if (activeIdentity?.chatId) {
            send({ type: "get_chat_states", requestId: requestId("chat-states"), chatId: activeIdentity.chatId });
            send({ type: "list_state_history", requestId: requestId("history-generation"), chatId: activeIdentity.chatId });
          }
        }
        break;
      case "chat_states":
        if (response.chatId === ctx.getActiveChat().chatId) {
          chatStates = response.states;
          refreshAllMessageWidgets();
        }
        break;
      case "state_history":
        historyItems = response.items;
        refreshAllMessageWidgets();
        break;
      case "injection_preview":
        injectionPreview = response.preview;
        break;
      case "error":
        if (response.requestId === activeGenerationRequestId) {
          activeGenerationRequestId = null;
          stopElapsedTimer();
        }
        status = response.message;
        break;
    }
    renderAll();
  }

  function handleActionClick(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    // Tab click handling
    const tabBtn = target.closest<HTMLElement>("[data-tab]");
    if (tabBtn) {
      const newTab = tabBtn.dataset.tab;
      if (newTab && newTab !== activeTab) {
        activeTab = newTab;
        renderAll();
      }
      return;
    }

    const actionBtn = target.closest<HTMLElement>("[data-action]");
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      if (action === "viewer") openViewer();
      if (action === "generate") startGeneration();
      if (action === "reload") reloadState();
      if (action === "cancel" && activeGenerationRequestId) {
        send({ type: "cancel_generation", requestId: activeGenerationRequestId });
      }
      if (action === "delete") void deleteCurrentState();
      if (action === "permissions") void requestPermissions();
      if (action === "what-changed" && state) void showWhatChangedModal();
      if (action === "copy-debug-report" && pipeline?.debugReport) {
        void navigator.clipboard.writeText(pipeline.debugReport).then(() => {
          status = "Debug report copied";
          renderAll();
        });
      }
      if (action === "copy-schema-catalog") {
        const text = buildStockModuleContractDocument(settings.stockModuleOverrides);
        void navigator.clipboard.writeText(text).then(() => {
          status = "All stock module contracts copied";
          renderAll();
        }).catch(() => {
          status = "Could not copy module contracts";
          renderAll();
        });
      }
      if (action === "copy-module-prompt" || action === "copy-full-module-prompt") {
        const key = actionBtn.dataset.schemaModule as ModuleKey | undefined;
        if (key && MODULE_KEYS.includes(key)) {
          const text = action === "copy-module-prompt"
            ? buildStockModulePromptBlock(key, settings.stockModuleOverrides)
            : buildStateCompilerPrompt([key], [], settings.stockModuleOverrides);
          void navigator.clipboard.writeText(text).then(() => {
            status = action === "copy-module-prompt"
              ? "Module prompt block copied"
              : "Full generated compiler prompt copied";
            renderAll();
          }).catch(() => {
            status = "Could not copy compiler prompt";
            renderAll();
          });
        }
      }
      if (action === "clear-search") {
        const searchInput = tab.root.querySelector<HTMLInputElement>("[data-module-search]");
        if (searchInput) {
          searchInput.value = "";
          renderAll();
        }
      }
      return;
    }

    const presetBtn = target.closest<HTMLElement>("[data-preset-action]");
    if (presetBtn) {
      const actionCamel = presetBtn.getAttribute("data-preset-action");
      if (actionCamel) void handlePresetAction(actionCamel);
      return;
    }

    const stockBtn = target.closest<HTMLElement>("[data-stock-action]");
    if (stockBtn) {
      const action = stockBtn.getAttribute("data-stock-action");
      const key = stockBtn.getAttribute("data-stock-key");
      if (action && key) handleStockModuleAction(action, key);
      return;
    }

    const customBtn = target.closest<HTMLElement>("[data-custom-action]");
    if (customBtn) {
      const action = customBtn.getAttribute("data-custom-action");
      const id = customBtn.getAttribute("data-custom-id") || undefined;
      if (action) void handleCustomModuleAction(action, id);
      return;
    }

    const bulkBtn = target.closest<HTMLElement>("[data-bulk-action]");
    if (bulkBtn) {
      const action = bulkBtn.getAttribute("data-bulk-action");
      if (action) handleBulkAction(action);
      return;
    }
  }

  function handleRootChange(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    
    if (target.dataset.setting === "modulePreset") {
      applyModulePreset(target.value);
      return;
    }
    
    if (target.matches("[data-module], [data-custom-module]")) {
      if (!settings.modulePreset.startsWith("custom:")) {
        settings.modulePreset = "custom";
        const selectEl = tab.root.querySelector<HTMLSelectElement>('[data-setting="modulePreset"]');
        if (selectEl) selectEl.value = "custom";
      }
      saveCurrentSettingsDebounced();
    } else if (target.matches("[data-setting]")) {
      saveCurrentSettingsDebounced();
    }
  }

  function handleRootInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target?.matches("[data-module-search]")) return;
    const query = target.value.trim().toLowerCase();
    
    tab.root.querySelectorAll<HTMLElement>("[data-module-row]").forEach((row) => {
      row.hidden = Boolean(query) && !(row.dataset.search ?? "").includes(query);
    });

    const allModules = tab.root.querySelectorAll<HTMLElement>("[data-module-row]");
    const visibleModules = tab.root.querySelectorAll<HTMLElement>("[data-module-row]:not([hidden])");
    const countSpan = tab.root.querySelector(".loomos-search-count");
    if (countSpan) {
      countSpan.textContent = `${visibleModules.length} of ${allModules.length} shown`;
    }
    
    const clearBtn = tab.root.querySelector<HTMLElement>('[data-action="clear-search"]');
    if (clearBtn) {
      clearBtn.style.display = query ? "block" : "none";
    }
  }

  tab.root.addEventListener("click", handleActionClick);
  tab.root.addEventListener("change", handleRootChange);
  tab.root.addEventListener("input", handleRootInput);
  cleanups.push(() => tab.root.removeEventListener("click", handleActionClick));
  cleanups.push(() => tab.root.removeEventListener("change", handleRootChange));
  cleanups.push(() => tab.root.removeEventListener("input", handleRootInput));
  cleanups.push(inputAction.onClick(openViewer));
  cleanups.push(tab.onActivate(() => syncFromHost(false)));
  cleanups.push(ctx.onBackendMessage(handleBackendMessage));
  cleanups.push(ctx.events.on("CHAT_SWITCHED", () => syncFromHost(true)));
  cleanups.push(ctx.events.on("MESSAGE_SENT", () => syncFromHost(false)));
  cleanups.push(ctx.events.on("MESSAGE_EDITED", () => syncFromHost(false)));
  cleanups.push(ctx.events.on("MESSAGE_SWIPED", (payload) => {
    const identity = identityFromEvent(payload);
    const latest = ctx.messages.getLatestMessageId();
    if (identity?.messageId && identity.messageId === latest) {
      status = "Loading selected swipe";
      send({ type: "get_state", requestId: requestId("swipe"), identity });
      send({ type: "get_chat_states", requestId: requestId("chat-states-swipe"), chatId: identity.chatId });
      send({ type: "list_state_history", requestId: requestId("history-swipe"), chatId: identity.chatId });
      renderAll();
    }
  }));
  cleanups.push(ctx.events.on("SWIPE_EDITED", (payload) => {
    const identity = identityFromEvent(payload);
    if (identity) {
      send({ type: "get_state", requestId: requestId("swipe-edit"), identity });
      send({ type: "get_chat_states", requestId: requestId("chat-states-swipe-edit"), chatId: identity.chatId });
      send({ type: "list_state_history", requestId: requestId("history-swipe-edit"), chatId: identity.chatId });
    }
  }));
  cleanups.push(ctx.events.on("CHARACTER_MESSAGE_RENDERED", scheduleHostSync));
  cleanups.push(ctx.events.on("USER_MESSAGE_RENDERED", refreshAllMessageWidgets));

  renderAll();
  syncFromHost(true);

  return () => {
    if (disposed) return;
    const chatId = ctx.getActiveChat().chatId ?? undefined;
    send({ type: "frontend_disposed", chatId });
    if (activeGenerationRequestId) {
      send({ type: "cancel_generation", requestId: activeGenerationRequestId });
    }
    disposed = true;
    stopElapsedTimer();
    if (hostSyncTimeout) clearTimeout(hostSyncTimeout);
    clearAllMessageWidgets();
    modalListenerCleanup?.();
    modalListenerCleanup = null;
    for (const cleanup of cleanups.splice(0).reverse()) {
      try {
        cleanup();
      } catch {
        // Continue tearing down owned handles.
      }
    }
    inputAction.destroy();
    tab.destroy();
    removeStyle();
    ctx.dom.cleanup();
  };
}
