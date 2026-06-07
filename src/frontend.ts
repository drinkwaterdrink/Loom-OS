import type {
  SpindleFrontendContext,
  SpindleModalHandle,
} from "lumiverse-spindle-types";
import {
  CORE_TRACKING_MODULES,
  MODULE_CATALOG,
  MODULE_KEYS,
  moduleSettingsForPreset,
} from "./shared/modules";
import type {
  BackendResponse,
  FrontendRequest,
  IdentityRequest,
} from "./shared/protocol";
import {
  DEFAULT_SETTINGS,
  LoomOSSettingsSchema,
} from "./shared/schemas";
import type {
  ConnectionSummary,
  GenerationPipelineReport,
  LoomOSSettings,
  LoomOSState,
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
  let messageActionCleanup: (() => void) | null = null;
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

  function widgetHtml(): string {
    const hasState = hasExactStateForLatest();
    const busy = activeGenerationRequestId !== null;
    const generateLabel = busy ? "Compiling..." : hasState ? "Refresh" : "Generate";
    return `
      <style>
        :root{color-scheme:light dark}*{box-sizing:border-box}body{margin:0;padding:5px 0;font:12px/1.25 system-ui,sans-serif;color:var(--lumiverse-text)}
        .bar{align-items:center;display:flex;flex-wrap:wrap;gap:6px}button{background:var(--lumiverse-fill-subtle);border:1px solid var(--lumiverse-border);border-radius:7px;color:var(--lumiverse-text);cursor:pointer;min-height:30px;padding:5px 8px}
        button.primary{border-color:var(--lumiverse-accent)}button:disabled{cursor:not-allowed;opacity:.5}.state{color:var(--lumiverse-text-dim);font-size:10px}
      </style>
      <div class="bar">
        <button id="open" type="button">Open LoomOS</button>
        <button id="generate" class="primary" type="button"${disabled(!permissions.generation || !permissions.chatMutation || busy)}>${escapeHtml(generateLabel)}</button>
        <span class="state">${hasState ? "Exact swipe state loaded" : "No state for this swipe"}</span>
      </div>
      <script>
        document.getElementById("open").addEventListener("click",()=>window.spindleSandbox.postMessage({type:"open"}));
        document.getElementById("generate").addEventListener("click",()=>window.spindleSandbox.postMessage({type:"generate"}));
      </script>`;
  }

  function refreshMessageAction(): void {
    messageActionCleanup?.();
    messageActionCleanup = null;
    const messageId = ctx.messages.getLatestMessageId();
    if (!messageId) return;
    messageActionCleanup = ctx.messages.renderWidget({
      messageId,
      widgetId: "loomos-action",
      html: widgetHtml(),
      minHeight: 38,
      maxHeight: 80,
    }, (payload) => {
      if (!isRecord(payload) || typeof payload.type !== "string") return;
      if (payload.type === "open") openViewer();
      if (payload.type === "generate") startGeneration();
    });
  }

  function renderModuleMatrix(): string {
    return `
      <div class="loomos-module-wrap">
        <div class="loomos-module-head"><span>Module</span><span>Track</span><span>Display</span><span>Inject</span></div>
        ${MODULE_CATALOG.map((module) => {
          const control = settings.moduleSettings[module.key];
          const core = CORE_TRACKING_MODULES.has(module.key);
          return `<div class="loomos-module-row" data-module-row="${module.key}" data-search="${escapeHtml(`${module.label} ${module.group} ${module.description}`.toLowerCase())}">
            <label><strong>${escapeHtml(module.label)}</strong><small>${escapeHtml(module.description)}</small></label>
            <input type="checkbox" aria-label="Track ${escapeHtml(module.label)}" data-module="${module.key}" data-axis="track"${checked(control.track)}${disabled(core)} title="${core ? "Core tracking is always enabled" : "Include in compiler output"}">
            <input type="checkbox" aria-label="Display ${escapeHtml(module.label)}" data-module="${module.key}" data-axis="display"${checked(control.display)} title="Show or hide without deleting stored data">
            <input type="checkbox" aria-label="Inject ${escapeHtml(module.label)}" data-module="${module.key}" data-axis="inject"${checked(control.inject)} title="Allow compact prompt injection">
          </div>`;
        }).join("")}
      </div>`;
  }

  function renderSettings(): string {
    return `
      <details class="loomos-shell loomos-settings">
        <summary>Tracker Settings</summary>
        <div class="loomos-settings-grid">
          <label class="loomos-field"><span>Skin</span><select class="loomos-select" data-setting="skin">
            ${(["auto", "dark_academia", "cyberpunk", "fantasy", "horror", "noir", "minimal"] as const).map((skin) =>
              `<option value="${skin}"${selected(skin, settings.skin)}>${skinLabel(skin)}</option>`
            ).join("")}
          </select></label>
          <label class="loomos-field"><span>Module preset</span><select class="loomos-select" data-setting="modulePreset">
            ${(["lite", "balanced", "full", "experimental", "custom"] as const).map((preset) =>
              `<option value="${preset}"${selected(preset, settings.modulePreset)}>${presetLabel(preset)}</option>`
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
          <label class="loomos-field"><span>Find a module</span><input class="loomos-input" type="search" data-module-search placeholder="Cast, inventory, continuity..."></label>
          <p class="loomos-hint">Track changes compiler output. Display only changes the UI and never deletes data. Inject controls the compact future-context summary. Core tracking stays on for continuity safety.</p>
          ${renderModuleMatrix()}
        </div>
      </details>`;
  }

  function diagnosticText(): string {
    const lines = [
      `version: 0.1.1`,
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
    const missingPermission = !permissions.generation
      || !permissions.chatMutation
      || (settings.injectionEnabled && !permissions.interceptor);
    return `<div class="loomos-toolbar">
      <button class="loomos-button loomos-button-primary" data-action="viewer">Open Viewer</button>
      <button class="loomos-button" data-action="generate"${disabled(!canGenerate || Boolean(activeGenerationRequestId))}>${state ? "Refresh State" : "Generate State"}</button>
      <button class="loomos-button" data-action="reload"${disabled(!permissions.chatMutation)}>Reload</button>
      ${activeGenerationRequestId ? `<button class="loomos-button" data-action="cancel">Cancel</button>` : ""}
      ${state ? `<button class="loomos-button loomos-button-danger" data-action="delete">Delete Exact State</button>` : ""}
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
      ${renderSettings()}
      ${state ? renderDashboard(state, settings) : emptyStateHtml()}
      <details class="loomos-shell loomos-settings">
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
      ${state ? renderDashboard(state, settings) : emptyStateHtml()}`;
  }

  function renderAll(): void {
    renderDrawer();
    renderViewer();
    refreshMessageAction();
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
    });
  }

  function saveCurrentSettings(): void {
    try {
      settings = readSettings();
      status = "Saving settings";
      send({ type: "save_settings", requestId: requestId("settings"), settings });
      renderAll();
    } catch (error) {
      status = error instanceof Error ? error.message : String(error);
      renderAll();
    }
  }

  function applyPreset(preset: Exclude<ModulePreset, "custom">): void {
    settings = LoomOSSettingsSchema.parse({
      ...settings,
      modulePreset: preset,
      moduleSettings: moduleSettingsForPreset(preset),
    });
    status = `${presetLabel(preset)} preset applied`;
    send({ type: "save_settings", requestId: requestId("preset"), settings });
    renderAll();
  }

  function startGeneration(): void {
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
    if (asReady) send({ type: "ready", active });
    else send({ type: "get_state", requestId: requestId("sync"), identity: active });
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
    const target = (event.target as Element | null)?.closest<HTMLElement>("[data-action]");
    const action = target?.dataset.action;
    if (!action) return;
    if (action === "viewer") openViewer();
    if (action === "generate") startGeneration();
    if (action === "reload") reloadState();
    if (action === "cancel" && activeGenerationRequestId) {
      send({ type: "cancel_generation", requestId: activeGenerationRequestId });
    }
    if (action === "delete") void deleteCurrentState();
    if (action === "permissions") void requestPermissions();
  }

  function handleRootChange(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    if (target.dataset.setting === "modulePreset") {
      const preset = target.value as ModulePreset;
      if (preset !== "custom") {
        applyPreset(preset);
        return;
      }
    }
    if (target.matches("[data-module]")) {
      const preset = tab.root.querySelector<HTMLSelectElement>('[data-setting="modulePreset"]');
      if (preset) preset.value = "custom";
    }
    if (target.matches("[data-setting], [data-module]")) saveCurrentSettings();
  }

  function handleRootInput(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    if (!target?.matches("[data-module-search]")) return;
    const query = target.value.trim().toLowerCase();
    tab.root.querySelectorAll<HTMLElement>("[data-module-row]").forEach((row) => {
      row.hidden = Boolean(query) && !(row.dataset.search ?? "").includes(query);
    });
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
      renderAll();
    }
  }));
  cleanups.push(ctx.events.on("SWIPE_EDITED", (payload) => {
    const identity = identityFromEvent(payload);
    if (identity) send({ type: "get_state", requestId: requestId("swipe-edit"), identity });
  }));
  cleanups.push(ctx.events.on("CHARACTER_MESSAGE_RENDERED", refreshMessageAction));
  cleanups.push(ctx.events.on("USER_MESSAGE_RENDERED", refreshMessageAction));

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
    modalListenerCleanup?.();
    modalListenerCleanup = null;
    messageActionCleanup?.();
    messageActionCleanup = null;
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
