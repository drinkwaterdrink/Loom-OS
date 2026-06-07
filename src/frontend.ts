import type {
  SpindleFrontendContext,
  SpindleModalHandle,
} from "lumiverse-spindle-types";
import {
  CORE_TRACKING_MODULES,
  MODULE_CATALOG,
  MODULE_KEYS,
  moduleSettingsForPreset,
  BALANCED_MODULE_SETTINGS,
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
} from "./shared/schemas";
import type {
  ConnectionSummary,
  GenerationPipelineReport,
  LoomOSSettings,
  LoomOSState,
  ModuleControl,
  ModuleKey,
  ModulePreset,
  PermissionSnapshot,
  StateIdentity,
} from "./shared/types";
import {
  escapeHtml,
  renderDashboard,
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
  const messageWidgetCleanups = new Map<string, () => void>();
  let chatStates: Array<{ messageId: string; swipeId: number }> = [];
  let modal: SpindleModalHandle | null = null;
  let modalListenerCleanup: (() => void) | null = null;

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
    tab.root.querySelectorAll("details[data-details], details[data-section]").forEach((d) => {
      const key = d.getAttribute("data-details") || d.getAttribute("data-section");
      if (key && (d as HTMLDetailsElement).open) openDetails.add(key);
    });
    if (modal) {
      modal.root.querySelectorAll("details[data-details], details[data-section]").forEach((d) => {
        const key = d.getAttribute("data-details") || d.getAttribute("data-section");
        if (key && (d as HTMLDetailsElement).open) openDetails.add("modal:" + key);
      });
    }

    const searchQuery = tab.root.querySelector<HTMLInputElement>("[data-module-search]")?.value ?? "";
    
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
      focusedSelector,
      selectionStart,
      selectionEnd
    };
  }

  function restoreUiState(state: ReturnType<typeof captureUiState>) {
    tab.root.querySelectorAll<HTMLDetailsElement>("details[data-details], details[data-section]").forEach((d) => {
      const key = d.getAttribute("data-details") || d.getAttribute("data-section");
      if (key) d.open = state.openDetails.has(key);
    });
    if (modal) {
      modal.root.querySelectorAll<HTMLDetailsElement>("details[data-details], details[data-section]").forEach((d) => {
        const key = d.getAttribute("data-details") || d.getAttribute("data-section");
        if (key) d.open = state.openDetails.has("modal:" + key);
      });
    }

    const searchInput = tab.root.querySelector<HTMLInputElement>("[data-module-search]");
    if (searchInput) {
      searchInput.value = state.searchQuery;
      const query = state.searchQuery.toLowerCase();
      tab.root.querySelectorAll<HTMLElement>("[data-module-row]").forEach((row) => {
        row.hidden = Boolean(query) && !(row.dataset.search ?? "").includes(query);
      });
    }

    for (const [el, scrollTop] of state.scrollPositions.entries()) {
      try {
        el.scrollTop = scrollTop;
      } catch {
        // ignore
      }
    }

    if (state.focusedSelector) {
      const el = tab.root.querySelector(state.focusedSelector) || (modal && modal.root.querySelector(state.focusedSelector));
      if (el instanceof HTMLElement) {
        el.focus();
        if (el instanceof HTMLInputElement && state.selectionStart !== null && state.selectionEnd !== null) {
          try {
            el.setSelectionRange(state.selectionStart, state.selectionEnd);
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

    // 1. Render widgets for all historical messages that have state
    for (const item of chatStates) {
      if (item.messageId === latestId) continue;

      const cleanup = ctx.messages.renderWidget({
        messageId: item.messageId,
        widgetId: "loomos-action-history",
        html: `
          <style>
            :root{color-scheme:light dark}body{margin:0;padding:2px 0;font:11px system-ui,sans-serif;color:var(--lumiverse-text-dim)}
            .bar{align-items:center;display:flex;gap:8px}
            button{background:var(--lumiverse-fill-subtle);border:1px solid var(--lumiverse-border);border-radius:6px;color:var(--lumiverse-text);cursor:pointer;padding:3px 6px;font-size:10px}
            button:hover{border-color:var(--lumiverse-accent)}
          </style>
          <div class="bar">
            <span>📝 LoomOS State (swipe ${item.swipeId})</span>
            <button id="open" type="button">Open State</button>
          </div>
          <script>
            document.getElementById("open").addEventListener("click",()=>window.spindleSandbox.postMessage({type:"open"}));
          </script>
        `,
        minHeight: 24,
        maxHeight: 40,
      }, (payload) => {
        if (isRecord(payload) && payload.type === "open") {
          activeIdentity = {
            chatId: activeChat.chatId!,
            messageId: item.messageId,
            swipeId: item.swipeId
          };
          status = `Loaded historical state for swipe ${item.swipeId}`;
          send({ type: "get_state", requestId: requestId("state-hist"), identity: activeIdentity });
          openViewer();
        }
      });

      if (cleanup) {
        messageWidgetCleanups.set(item.messageId, cleanup);
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
            :root{color-scheme:light dark}*{box-sizing:border-box}body{margin:0;padding:4px 0;font:12px/1.25 system-ui,sans-serif;color:var(--lumiverse-text)}
            .bar{align-items:center;display:flex;flex-wrap:wrap;gap:6px}
            button{background:var(--lumiverse-fill-subtle);border:1px solid var(--lumiverse-border);border-radius:7px;color:var(--lumiverse-text);cursor:pointer;min-height:30px;padding:5px 8px}
            button.primary{border-color:var(--lumiverse-accent)}
            button.danger{border-color:#df5259;background:rgba(223,82,89,0.15)}
            button.pulse{animation:loomos-pulse 1.6s infinite}
            button:disabled{cursor:not-allowed;opacity:.5}
            .state{color:var(--lumiverse-text-dim);font-size:10px}
            @keyframes loomos-pulse{0%{opacity:1}50%{opacity:0.6}100%{opacity:1}}
          </style>
          <div class="bar">
            <button id="open" type="button">Open LoomOS</button>
            <button id="generate" class="${generateClass}" type="button"${disabled(!permissions.generation || !permissions.chatMutation)}>${escapeHtml(generateLabel)}</button>
            <span class="state">${hasState ? `Exact state loaded (${swipeText})` : `No state for ${swipeText}`}</span>
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
          <p><strong>Inject Budget (${settings.injectionTokenBudget} tokens)</strong>: Limits future story state injection size in normal generations.</p>
          <p><strong>Seed Budget (${settings.compilerSeedTokenBudget} tokens)</strong>: Limits prior state size when compiling turn deltas.</p>
        </div>
      </div>
    `;
  }

  function renderModuleMatrix(): string {
    const query = tab.root.querySelector<HTMLInputElement>("[data-module-search]")?.value.trim().toLowerCase() ?? "";
    
    const modules = MODULE_CATALOG.map((m) => {
      const control = settings.moduleSettings[m.key];
      const isCore = CORE_TRACKING_MODULES.has(m.key);
      const isExperimental = ["dialogueState", "directorStyle", "closenessState", "imagePrompt"].includes(m.key);
      
      let pills = "";
      if (isCore) pills += `<span class="loomos-pill pill-core">Core</span>`;
      if (isExperimental) pills += `<span class="loomos-pill pill-experimental">Experimental</span>`;
      if (control.inject) pills += `<span class="loomos-pill pill-injected">Injected</span>`;
      if (!control.display) pills += `<span class="loomos-pill pill-hidden">Hidden</span>`;
      
      const searchText = `${m.label} ${m.group} ${m.description}`.toLowerCase();
      const visible = !query || searchText.includes(query);

      return {
        key: m.key,
        label: m.label,
        group: m.group,
        description: m.description,
        control,
        isCore,
        pills,
        visible,
        isCustom: false
      };
    });

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
        control: { track: m.enabled, display: m.display, inject: m.inject },
        isCore: false,
        pills,
        visible,
        isCustom: true,
        outputMode: m.outputMode,
        compilerInstruction: m.compilerInstruction,
        maxItems: m.maxItems
      };
    });

    const allModules = [...modules, ...customModules];
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

      groupsHtml += `
        <div class="loomos-module-group-card" style="margin-top: 10px;">
          <div class="loomos-module-group-title">${escapeHtml(groupName)}</div>
          <div class="loomos-module-group-list">
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

              return `
                <div class="loomos-module-card" data-module-row="${escapeHtml(m.key)}" data-search="${escapeHtml((m.label + " " + m.group + " " + m.description).toLowerCase())}">
                  <div class="loomos-module-info">
                    <div class="loomos-module-title-row">
                      <strong>${escapeHtml(m.label)}</strong>
                      <div class="loomos-pills">${m.pills}</div>
                    </div>
                    <small>${escapeHtml(m.description)}</small>
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
        </div>
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
          <label class="loomos-field"><span>Injection token budget</span><input class="loomos-input" type="number" min="80" max="1600" step="20" data-setting="injectionTokenBudget" value="${settings.injectionTokenBudget}"></label>
          <label class="loomos-field"><span>Recent messages</span><input class="loomos-input" type="number" min="4" max="80" data-setting="recentMessageLimit" value="${settings.recentMessageLimit}"></label>
          <label class="loomos-field"><span>Seed token budget</span><input class="loomos-input" type="number" min="200" max="2400" step="50" data-setting="compilerSeedTokenBudget" value="${settings.compilerSeedTokenBudget}"></label>
          <label class="loomos-field"><span>Generation timeout (seconds)</span><input class="loomos-input" type="number" min="30" max="300" step="10" data-setting="generationTimeoutSeconds" value="${settings.generationTimeoutSeconds}"></label>
          
          ${renderTokenDiagnostics()}
          ${renderModuleMatrix()}
        </div>
      </details>`;
  }

  function diagnosticText(): string {
    const lines = [
      `version: 0.1.2`,
      `identity: ${exactLabel()}`,
      `state: ${state ? `schema ${state.schemaVersion}, ${state.activeModules.length} modules` : "none"}`,
      `permissions: generation=${permissions.generation} chat=${permissions.chatMutation} interceptor=${permissions.interceptor}`,
      `connection: ${pipeline?.connectionId || settings.connectionId || "automatic"}`,
      `phase: ${pipeline?.phase || "idle"}`,
      `attempt: ${pipeline?.attempt || "-"}`,
      `elapsed: ${pipeline ? `${Math.round(pipeline.elapsedMs / 100) / 10}s` : "-"}`,
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

  function toolbarHtml(): string {
    const canGenerate = permissions.generation && permissions.chatMutation;
    const busy = activeGenerationRequestId !== null;
    const missingPermission = !permissions.generation
      || !permissions.chatMutation
      || (settings.injectionEnabled && !permissions.interceptor);
    return `<div class="loomos-toolbar">
      <button class="loomos-button loomos-button-primary" data-action="viewer">Open Viewer</button>
      ${busy 
        ? `<button class="loomos-button loomos-button-danger loomos-button-pulse" data-action="cancel">Stop Compile</button>`
        : `<button class="loomos-button" data-action="generate"${disabled(!canGenerate)}>${state ? "Refresh State" : "Generate State"}</button>`
      }
      <button class="loomos-button" data-action="reload"${disabled(!permissions.chatMutation || busy)}>Reload</button>
      ${state && !busy ? `<button class="loomos-button loomos-button-danger" data-action="delete">Delete Exact State</button>` : ""}
      ${missingPermission ? `<button class="loomos-button" data-action="permissions">Enable Features</button>` : ""}
    </div>`;
  }

  function renderDrawer(): void {
    tab.root.dataset.skin = settings.skin;
    tab.root.innerHTML = `
      <div class="loomos-shell">
        <div class="loomos-header">
          <div class="loomos-title"><strong>LoomOS Command Deck</strong><span>${escapeHtml(exactLabel())}</span></div>
          <span class="loomos-status" title="${escapeHtml(elapsedLabel())}">${escapeHtml(elapsedLabel())}</span>
        </div>
        ${toolbarHtml()}
      </div>
      ${compileStatusCardHtml()}
      ${renderSettings()}
      ${state ? renderDashboard(state, settings) : emptyStateHtml()}
      <details class="loomos-shell loomos-settings" data-details="diagnostics">
        <summary>Pipeline Diagnostics</summary>
        <pre class="loomos-diagnostic">${escapeHtml(diagnosticText())}</pre>
      </details>`;
  }

  function renderViewer(): void {
    if (!modal) return;
    modal.root.className = "loomos-root";
    modal.root.dataset.skin = settings.skin;
    modal.setTitle(`LoomOS | ${exactLabel()}`);
    modal.root.innerHTML = `
      <div class="loomos-shell">
        <div class="loomos-header">
          <div class="loomos-title"><strong>${state ? escapeHtml(state.kernel.scene || "Story State") : "Exact Swipe State"}</strong><span>${escapeHtml(exactLabel())}</span></div>
          <span class="loomos-status">${escapeHtml(elapsedLabel())}</span>
        </div>
        ${toolbarHtml()}
      </div>
      ${compileStatusCardHtml()}
      ${state ? renderDashboard(state, settings) : emptyStateHtml()}`;
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
      width: 980,
      maxHeight: 820,
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
      injectionTokenBudget: Number(root.querySelector<HTMLInputElement>('[data-setting="injectionTokenBudget"]')?.value),
      compilerSeedTokenBudget: Number(root.querySelector<HTMLInputElement>('[data-setting="compilerSeedTokenBudget"]')?.value),
      recentMessageLimit: Number(root.querySelector<HTMLInputElement>('[data-setting="recentMessageLimit"]')?.value),
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
    renderAll();
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

  async function handleCustomModuleAction(action: string, moduleId?: string): Promise<void> {
    const customMods = settings.customModules || [];
    
    if (action === "add" || (action === "edit" && moduleId)) {
      const isEdit = action === "edit";
      const original = isEdit ? customMods.find(m => m.id === moduleId) : null;
      if (isEdit && !original) return;
      
      const pm = ctx.ui.showModal({ title: isEdit ? "Edit Custom Module" : "Add Custom Module", width: 500, maxHeight: 600 });
      pm.root.innerHTML = `
        <div class="loomos-root loomos-prompt-dialog" data-skin="${settings.skin}">
          <label class="loomos-field">
            <span>Label</span>
            <input class="loomos-input" type="text" id="mod-label" value="${original ? escapeHtml(original.label) : ""}" placeholder="e.g. Magic Rules" required>
          </label>
          <label class="loomos-field">
            <span>Group</span>
            <input class="loomos-input" type="text" id="mod-group" value="${original ? escapeHtml(original.group) : "Custom"}" placeholder="e.g. World or Custom">
          </label>
          <label class="loomos-field">
            <span>Description</span>
            <input class="loomos-input" type="text" id="mod-desc" value="${original ? escapeHtml(original.description) : ""}" placeholder="Short summary of this module">
          </label>
          <label class="loomos-field">
            <span>Compiler Instruction (max 1600 chars)</span>
            <textarea class="loomos-input" id="mod-instruction" style="height: 100px;" placeholder="Instructions for the compiler. e.g. Track active spell effects, magic costs, and rules. Include severity or cost." required>${original ? escapeHtml(original.compilerInstruction) : ""}</textarea>
          </label>
          <label class="loomos-field">
            <span>Output Mode</span>
            <select class="loomos-select" id="mod-output-mode">
              <option value="cards"${original && original.outputMode === "cards" ? " selected" : ""}>Cards (grid of key-value panels)</option>
              <option value="bullets"${original && original.outputMode === "bullets" ? " selected" : ""}>Bullets (simple list)</option>
              <option value="chips"${original && original.outputMode === "chips" ? " selected" : ""}>Chips (inline badges)</option>
              <option value="gauge"${original && original.outputMode === "gauge" ? " selected" : ""}>Gauge (progress bar)</option>
            </select>
          </label>
          <label class="loomos-field">
            <span>Max Items (1 to 24)</span>
            <input class="loomos-input" type="number" id="mod-max" min="1" max="24" value="${original ? original.maxItems : 6}">
          </label>
          <div class="loomos-dialog-buttons">
            <button type="button" class="loomos-button loomos-button-primary" id="mod-confirm">${isEdit ? "Save Changes" : "Add Module"}</button>
            <button type="button" class="loomos-button" id="mod-cancel">Cancel</button>
          </div>
        </div>
      `;
      
      const onConfirm = () => {
        const label = pm.root.querySelector<HTMLInputElement>("#mod-label")?.value.trim();
        const group = pm.root.querySelector<HTMLInputElement>("#mod-group")?.value.trim() || "Custom";
        const desc = pm.root.querySelector<HTMLInputElement>("#mod-desc")?.value.trim() || "";
        const instruction = pm.root.querySelector<HTMLTextAreaElement>("#mod-instruction")?.value.trim();
        const outputMode = pm.root.querySelector<HTMLSelectElement>("#mod-output-mode")?.value as "cards" | "bullets" | "chips" | "gauge";
        const maxItems = Number(pm.root.querySelector<HTMLInputElement>("#mod-max")?.value || 6);
        
        if (!label || !instruction) return;
        
        const validated = CustomModuleSchema.parse({
          id: original ? original.id : "cmod_" + crypto.randomUUID().replace(/-/g, "").substring(0, 12),
          label,
          group,
          description: desc,
          enabled: original ? original.enabled : true,
          display: original ? original.display : true,
          inject: original ? original.inject : true,
          compilerInstruction: instruction,
          outputMode,
          maxItems
        });
        
        if (isEdit) {
          settings.customModules = customMods.map(m => m.id === moduleId ? validated : m);
        } else {
          settings.customModules = [...customMods, validated];
        }
        
        send({ type: "save_settings", requestId: requestId("custom-mod"), settings });
        status = isEdit ? `Custom module "${label}" updated` : `Custom module "${label}" added`;
        pm.dismiss();
        renderAll();
      };
      
      pm.root.querySelector("#mod-confirm")?.addEventListener("click", onConfirm);
      pm.root.querySelector("#mod-cancel")?.addEventListener("click", () => pm.dismiss());
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
      for (const m of MODULE_CATALOG) {
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
      for (const m of MODULE_CATALOG) {
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
      for (const m of MODULE_CATALOG) {
        settings.moduleSettings[m.key].inject = BALANCED_MODULE_SETTINGS[m.key].inject;
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
        }
        break;
      case "settings":
        settings = response.settings;
        status = "Settings saved";
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
          }
        }
        break;
      case "chat_states":
        if (response.chatId === ctx.getActiveChat().chatId) {
          chatStates = response.states;
          refreshAllMessageWidgets();
        }
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
      renderAll();
    }
  }));
  cleanups.push(ctx.events.on("SWIPE_EDITED", (payload) => {
    const identity = identityFromEvent(payload);
    if (identity) {
      send({ type: "get_state", requestId: requestId("swipe-edit"), identity });
      send({ type: "get_chat_states", requestId: requestId("chat-states-swipe-edit"), chatId: identity.chatId });
    }
  }));
  cleanups.push(ctx.events.on("CHARACTER_MESSAGE_RENDERED", refreshAllMessageWidgets));
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
