import type { SpindleFrontendContext } from "lumiverse-spindle-types";
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
  LoomOSSettings,
  LoomOSState,
  PermissionSnapshot,
  StateIdentity,
} from "./shared/types";

const ICON = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path fill="currentColor" d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H7a2 2 0 0 0-2 2V5.5A1 1 0 0 0 4 4.5Zm3-.5a1 1 0 0 0-1 1v11.17c.31-.11.65-.17 1-.17h11V4H7Zm2 3h6v2H9V7Zm0 4h6v2H9v-2Z"/>
  </svg>`;

const EMPTY_PERMISSIONS: PermissionSnapshot = {
  generation: false,
  interceptor: false,
  chatMutation: false,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function requestId(prefix: string): string {
  return `${prefix}:${crypto.randomUUID()}`;
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

function selected(value: string, current: string): string {
  return value === current ? " selected" : "";
}

function checked(value: boolean): string {
  return value ? " checked" : "";
}

function disabled(value: boolean): string {
  return value ? " disabled" : "";
}

function severityClass(severity: string): string {
  return `loomos-severity-${severity}`;
}

function renderKernel(state: LoomOSState): string {
  return `
    <section class="loomos-panel">
      <div class="loomos-panel-heading">
        <span class="loomos-kicker">Kernel</span>
        <strong>${escapeHtml(state.kernel.scene || "Current scene")}</strong>
      </div>
      <p>${escapeHtml(state.kernel.summary)}</p>
      <dl class="loomos-facts">
        <div><dt>Location</dt><dd>${escapeHtml(state.kernel.location)}</dd></div>
        <div><dt>Time</dt><dd>${escapeHtml(state.kernel.timeframe)}</dd></div>
        <div><dt>Tone</dt><dd>${escapeHtml(state.kernel.tone)}</dd></div>
        <div><dt>Objective</dt><dd>${escapeHtml(state.kernel.objective)}</dd></div>
      </dl>
      ${state.kernel.constraints.length > 0
        ? `<div class="loomos-chip-row">${state.kernel.constraints.map((item) =>
          `<span class="loomos-chip">${escapeHtml(item)}</span>`
        ).join("")}</div>`
        : ""}
    </section>`;
}

function renderCast(state: LoomOSState): string {
  return `
    <section class="loomos-panel">
      <div class="loomos-panel-heading">
        <span class="loomos-kicker">Cast Matrix</span>
        <strong>${state.castMatrix.length} tracked</strong>
      </div>
      <div class="loomos-list">
        ${state.castMatrix.length === 0
          ? `<p class="loomos-muted">No cast evidence in this state.</p>`
          : state.castMatrix.map((member) => `
            <article class="loomos-row">
              <div class="loomos-row-title">
                <strong>${escapeHtml(member.name)}</strong>
                <span>${escapeHtml(member.location)}</span>
              </div>
              <p>${escapeHtml(member.status)}</p>
              <small>${escapeHtml(member.emotionalState)} · ${escapeHtml(member.goals[0] ?? "No active goal")}</small>
            </article>
          `).join("")}
      </div>
    </section>`;
}

function renderThreads(state: LoomOSState): string {
  return `
    <section class="loomos-panel">
      <div class="loomos-panel-heading">
        <span class="loomos-kicker">Thread Loom</span>
        <strong>${state.threadLoom.filter((thread) => thread.status !== "resolved").length} live</strong>
      </div>
      <div class="loomos-list">
        ${state.threadLoom.length === 0
          ? `<p class="loomos-muted">No active story threads detected.</p>`
          : state.threadLoom.map((thread) => `
            <article class="loomos-row">
              <div class="loomos-row-title">
                <strong>${escapeHtml(thread.title)}</strong>
                <span>${escapeHtml(thread.status)} · ${thread.urgency}/5</span>
              </div>
              <p>${escapeHtml(thread.summary)}</p>
              <small>Pressure: ${escapeHtml(thread.nextPressure)}</small>
            </article>
          `).join("")}
      </div>
    </section>`;
}

function renderFirewall(state: LoomOSState): string {
  const firewall = state.continuityFirewall;
  return `
    <section class="loomos-panel">
      <div class="loomos-panel-heading">
        <span class="loomos-kicker">Continuity Firewall</span>
        <strong>${firewall.risks.length} risks</strong>
      </div>
      <div class="loomos-list">
        ${firewall.risks.length === 0
          ? `<p class="loomos-muted">No continuity conflicts detected.</p>`
          : firewall.risks.map((risk) => `
            <article class="loomos-row ${severityClass(risk.severity)}">
              <div class="loomos-row-title">
                <strong>${escapeHtml(risk.issue)}</strong>
                <span>${escapeHtml(risk.severity)}</span>
              </div>
              <p>${escapeHtml(risk.evidence)}</p>
              <small>Guardrail: ${escapeHtml(risk.recommendation)}</small>
            </article>
          `).join("")}
      </div>
      <div class="loomos-mini-grid">
        <div><strong>${firewall.establishedFacts.length}</strong><span>facts</span></div>
        <div><strong>${firewall.pendingConsequences.length}</strong><span>pending</span></div>
        <div><strong>${firewall.secrets.length}</strong><span>secrets</span></div>
      </div>
    </section>`;
}

function setupStyles(ctx: SpindleFrontendContext): () => void {
  return ctx.dom.addStyle(`
    .loomos-root {
      --loomos-bg: var(--lumiverse-fill-subtle);
      --loomos-panel: var(--lumiverse-fill);
      --loomos-ink: var(--lumiverse-text);
      --loomos-muted: var(--lumiverse-text-muted);
      --loomos-accent: var(--lumiverse-accent);
      --loomos-border: var(--lumiverse-border);
      color: var(--loomos-ink);
      display: grid;
      gap: 10px;
      padding: 10px;
      font-size: 13px;
      line-height: 1.45;
    }
    .loomos-root[data-skin="dark_academia"] {
      --loomos-bg: #17130f;
      --loomos-panel: #241d16;
      --loomos-ink: #ead9b7;
      --loomos-muted: #af9c78;
      --loomos-accent: #ba8b43;
      --loomos-border: #493a28;
    }
    .loomos-root[data-skin="cyberpunk"] {
      --loomos-bg: #090b18;
      --loomos-panel: #10152a;
      --loomos-ink: #e9faff;
      --loomos-muted: #8ea5c8;
      --loomos-accent: #25f2d0;
      --loomos-border: #304369;
    }
    .loomos-root[data-skin="fantasy"] {
      --loomos-bg: #111b17;
      --loomos-panel: #192821;
      --loomos-ink: #ecf1d0;
      --loomos-muted: #a9b995;
      --loomos-accent: #d4ad57;
      --loomos-border: #3f594b;
    }
    .loomos-root[data-skin="horror"] {
      --loomos-bg: #130b0c;
      --loomos-panel: #211012;
      --loomos-ink: #f0d8d8;
      --loomos-muted: #b68e91;
      --loomos-accent: #d24c52;
      --loomos-border: #51252a;
    }
    .loomos-root[data-skin="noir"] {
      --loomos-bg: #0d0d0d;
      --loomos-panel: #181818;
      --loomos-ink: #f0f0f0;
      --loomos-muted: #a4a4a4;
      --loomos-accent: #d7d7d7;
      --loomos-border: #3a3a3a;
    }
    .loomos-root[data-skin="minimal"] {
      --loomos-bg: #f5f5f4;
      --loomos-panel: #ffffff;
      --loomos-ink: #18181b;
      --loomos-muted: #71717a;
      --loomos-accent: #27272a;
      --loomos-border: #dededb;
    }
    .loomos-shell {
      background: var(--loomos-bg);
      border: 1px solid var(--loomos-border);
      border-radius: 12px;
      padding: 10px;
    }
    .loomos-header, .loomos-toolbar, .loomos-panel-heading, .loomos-row-title {
      align-items: center;
      display: flex;
      gap: 8px;
      justify-content: space-between;
    }
    .loomos-title { display: grid; gap: 2px; }
    .loomos-title strong { font-size: 15px; letter-spacing: .02em; }
    .loomos-title span, .loomos-muted, .loomos-row small { color: var(--loomos-muted); }
    .loomos-status {
      border: 1px solid var(--loomos-border);
      border-radius: 999px;
      color: var(--loomos-muted);
      font-size: 11px;
      max-width: 55%;
      overflow: hidden;
      padding: 3px 7px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .loomos-toolbar { flex-wrap: wrap; justify-content: flex-start; margin-top: 10px; }
    .loomos-button, .loomos-select, .loomos-input {
      background: var(--loomos-panel);
      border: 1px solid var(--loomos-border);
      border-radius: 8px;
      color: var(--loomos-ink);
      min-height: 34px;
      padding: 6px 9px;
    }
    .loomos-button { cursor: pointer; font-weight: 650; }
    .loomos-button:hover, .loomos-button:focus-visible { border-color: var(--loomos-accent); outline: none; }
    .loomos-button-primary { background: var(--loomos-accent); color: var(--lumiverse-accent-fg, #fff); }
    .loomos-button-danger { color: #df6469; }
    .loomos-button:disabled { cursor: not-allowed; opacity: .48; }
    .loomos-grid { display: grid; gap: 10px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .loomos-panel {
      background: var(--loomos-panel);
      border: 1px solid var(--loomos-border);
      border-radius: 10px;
      min-width: 0;
      padding: 10px;
    }
    .loomos-panel p { margin: 7px 0; }
    .loomos-panel-heading { align-items: flex-start; }
    .loomos-panel-heading strong { font-size: 12px; text-align: right; }
    .loomos-kicker {
      color: var(--loomos-accent);
      font-size: 10px;
      font-weight: 800;
      letter-spacing: .11em;
      text-transform: uppercase;
    }
    .loomos-facts { display: grid; gap: 5px; grid-template-columns: repeat(2, minmax(0, 1fr)); margin: 8px 0 0; }
    .loomos-facts div { border-top: 1px solid var(--loomos-border); padding-top: 5px; }
    .loomos-facts dt { color: var(--loomos-muted); font-size: 10px; text-transform: uppercase; }
    .loomos-facts dd { margin: 2px 0 0; overflow-wrap: anywhere; }
    .loomos-chip-row { display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px; }
    .loomos-chip { border: 1px solid var(--loomos-border); border-radius: 999px; color: var(--loomos-muted); font-size: 10px; padding: 2px 6px; }
    .loomos-list { display: grid; gap: 7px; margin-top: 8px; }
    .loomos-row { border-left: 2px solid var(--loomos-border); padding-left: 8px; }
    .loomos-row-title { align-items: flex-start; }
    .loomos-row-title strong { overflow-wrap: anywhere; }
    .loomos-row-title span { color: var(--loomos-muted); font-size: 10px; text-transform: uppercase; }
    .loomos-severity-high { border-left-color: #d58a42; }
    .loomos-severity-critical { border-left-color: #df5259; }
    .loomos-mini-grid { display: grid; gap: 6px; grid-template-columns: repeat(3, 1fr); margin-top: 9px; }
    .loomos-mini-grid div { border: 1px solid var(--loomos-border); border-radius: 8px; display: grid; padding: 6px; text-align: center; }
    .loomos-mini-grid span { color: var(--loomos-muted); font-size: 10px; text-transform: uppercase; }
    .loomos-empty { padding: 22px 12px; text-align: center; }
    .loomos-empty h3 { margin: 0 0 5px; }
    .loomos-empty p { color: var(--loomos-muted); margin: 0 auto 12px; max-width: 360px; }
    .loomos-settings summary { cursor: pointer; font-weight: 700; }
    .loomos-settings-grid { display: grid; gap: 9px; grid-template-columns: repeat(2, minmax(0, 1fr)); margin-top: 10px; }
    .loomos-field { display: grid; gap: 4px; min-width: 0; }
    .loomos-field > span { color: var(--loomos-muted); font-size: 11px; }
    .loomos-check { align-items: center; display: flex; gap: 7px; min-height: 34px; }
    .loomos-panel-toggles { display: flex; flex-wrap: wrap; gap: 8px; grid-column: 1 / -1; }
    .loomos-warning { border-color: #9d783d; color: #d9ae65; }
    @media (max-width: 620px) {
      .loomos-root { padding: 6px; }
      .loomos-grid, .loomos-settings-grid { grid-template-columns: 1fr; }
      .loomos-facts { grid-template-columns: 1fr; }
      .loomos-status { max-width: 48%; }
      .loomos-button { flex: 1 1 auto; }
    }
  `);
}

export function setup(ctx: SpindleFrontendContext): () => void {
  const cleanups: Array<() => void> = [];
  const removeStyle = setupStyles(ctx);
  let disposed = false;
  let settings = DEFAULT_SETTINGS;
  let permissions = EMPTY_PERMISSIONS;
  let activeIdentity: StateIdentity | null = null;
  let state: LoomOSState | null = null;
  let status = "Starting";
  let activeGenerationRequestId: string | null = null;
  let messageActionCleanup: (() => void) | null = null;

  const tab = ctx.ui.registerDrawerTab({
    id: "command-deck",
    title: "LoomOS Command Deck",
    shortName: "LoomOS",
    headerTitle: "LoomOS",
    description: "Story state, cast, threads, and continuity",
    keywords: ["story", "continuity", "tracker", "state", "roleplay"],
    iconSvg: ICON,
  });
  tab.root.classList.add("loomos-root");

  const inputAction = ctx.ui.registerInputBarAction({
    id: "open-command-deck",
    label: "Open LoomOS",
    subtitle: "Inspect story state",
    iconSvg: ICON,
  });

  function send(request: FrontendRequest): void {
    if (!disposed) {
      ctx.sendToBackend(request);
    }
  }

  function currentRequest(): IdentityRequest | null {
    const active = ctx.getActiveChat();
    if (!active.chatId) {
      return null;
    }
    const messageId = ctx.messages.getLatestMessageId() ?? undefined;
    if (!messageId) {
      return { chatId: active.chatId };
    }
    if (
      activeIdentity
      && activeIdentity.chatId === active.chatId
      && activeIdentity.messageId === messageId
    ) {
      return activeIdentity;
    }
    return { chatId: active.chatId, messageId };
  }

  function hasExactStateForLatest(): boolean {
    const latest = ctx.messages.getLatestMessageId();
    return Boolean(
      latest
      && state
      && activeIdentity
      && state.identity.messageId === latest
      && activeIdentity.messageId === latest,
    );
  }

  function widgetHtml(): string {
    const hasState = hasExactStateForLatest();
    const busy = activeGenerationRequestId !== null;
    const generateLabel = busy ? "Compiling..." : hasState ? "Refresh LoomOS" : "Generate LoomOS";
    return `
      <style>
        :root { color-scheme: light dark; }
        * { box-sizing: border-box; }
        body { margin: 0; padding: 5px 0; font: 12px/1.25 system-ui, sans-serif; color: var(--lumiverse-text); }
        .bar { align-items: center; display: flex; flex-wrap: wrap; gap: 6px; }
        button {
          background: var(--lumiverse-fill-subtle);
          border: 1px solid var(--lumiverse-border);
          border-radius: 7px;
          color: var(--lumiverse-text);
          cursor: pointer;
          min-height: 30px;
          padding: 5px 8px;
        }
        button.primary { border-color: var(--lumiverse-accent); }
        button:disabled { cursor: not-allowed; opacity: .5; }
        .state { color: var(--lumiverse-text-dim); font-size: 10px; }
      </style>
      <div class="bar">
        <button id="open" type="button">Open Deck</button>
        <button id="generate" class="primary" type="button"${disabled(!permissions.generation || !permissions.chatMutation || busy)}>${escapeHtml(generateLabel)}</button>
        <span class="state">${hasState ? "Exact swipe state loaded" : "No state for this swipe"}</span>
      </div>
      <script>
        document.getElementById("open").addEventListener("click", () => {
          window.spindleSandbox.postMessage({ type: "open" });
        });
        document.getElementById("generate").addEventListener("click", () => {
          window.spindleSandbox.postMessage({ type: "generate" });
        });
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
      if (payload.type === "open") {
        tab.activate();
      } else if (payload.type === "generate") {
        startGeneration();
      }
    });
  }

  function renderSettings(): string {
    return `
      <details class="loomos-shell loomos-settings">
        <summary>Settings</summary>
        <div class="loomos-settings-grid">
          <label class="loomos-field">
            <span>Skin</span>
            <select class="loomos-select" data-setting="skin">
              ${(["auto", "dark_academia", "cyberpunk", "fantasy", "horror", "noir", "minimal"] as const).map((skin) =>
                `<option value="${skin}"${selected(skin, settings.skin)}>${skinLabel(skin)}</option>`
              ).join("")}
            </select>
          </label>
          <label class="loomos-field">
            <span>Auto generation</span>
            <select class="loomos-select" data-setting="autoGeneration">
              <option value="manual"${selected("manual", settings.autoGeneration)}>Manual</option>
              <option value="assistant"${selected("assistant", settings.autoGeneration)}>Assistant messages</option>
              <option value="every"${selected("every", settings.autoGeneration)}>Every message</option>
              <option value="off"${selected("off", settings.autoGeneration)}>Off</option>
            </select>
          </label>
          <label class="loomos-check">
            <input type="checkbox" data-setting="injectionEnabled"${checked(settings.injectionEnabled)}>
            <span>Inject compact state</span>
          </label>
          <label class="loomos-field">
            <span>Injection token budget</span>
            <input class="loomos-input" type="number" min="80" max="1200" step="20" data-setting="injectionTokenBudget" value="${settings.injectionTokenBudget}">
          </label>
          <label class="loomos-field">
            <span>Recent messages</span>
            <input class="loomos-input" type="number" min="4" max="80" data-setting="recentMessageLimit" value="${settings.recentMessageLimit}">
          </label>
          <label class="loomos-field">
            <span>Connection ID (optional)</span>
            <input class="loomos-input" type="text" maxlength="200" data-setting="connectionId" value="${escapeHtml(settings.connectionId)}" placeholder="Use active connection">
          </label>
          <div class="loomos-panel-toggles">
            <label class="loomos-check"><input type="checkbox" data-panel="kernel"${checked(settings.panels.kernel)}>Kernel</label>
            <label class="loomos-check"><input type="checkbox" data-panel="castMatrix"${checked(settings.panels.castMatrix)}>Cast</label>
            <label class="loomos-check"><input type="checkbox" data-panel="threadLoom"${checked(settings.panels.threadLoom)}>Threads</label>
            <label class="loomos-check"><input type="checkbox" data-panel="continuityFirewall"${checked(settings.panels.continuityFirewall)}>Firewall</label>
          </div>
        </div>
      </details>`;
  }

  function render(): void {
    tab.root.dataset.skin = settings.skin;
    const canGenerate = permissions.generation && permissions.chatMutation;
    const missingPermission = !permissions.generation
      || !permissions.chatMutation
      || (settings.injectionEnabled && !permissions.interceptor);
    const exactLabel = activeIdentity
      ? `${activeIdentity.messageId.slice(0, 8)} · swipe ${activeIdentity.swipeId}`
      : "No active message";

    const panels = state
      ? [
          settings.panels.kernel ? renderKernel(state) : "",
          settings.panels.castMatrix ? renderCast(state) : "",
          settings.panels.threadLoom ? renderThreads(state) : "",
          settings.panels.continuityFirewall ? renderFirewall(state) : "",
        ].join("")
      : `
        <div class="loomos-shell loomos-empty">
          <h3>No state for this exact swipe</h3>
          <p>LoomOS will not reuse another message or swipe. Generate a fresh snapshot for ${escapeHtml(exactLabel)}.</p>
          <button class="loomos-button loomos-button-primary" data-action="generate"${disabled(!canGenerate || activeGenerationRequestId !== null)}>Generate State</button>
        </div>`;

    tab.root.innerHTML = `
      <div class="loomos-shell">
        <div class="loomos-header">
          <div class="loomos-title">
            <strong>LoomOS Command Deck</strong>
            <span>${escapeHtml(exactLabel)}</span>
          </div>
          <span class="loomos-status">${escapeHtml(status)}</span>
        </div>
        <div class="loomos-toolbar">
          <button class="loomos-button loomos-button-primary" data-action="generate"${disabled(!canGenerate || activeGenerationRequestId !== null)}>${state ? "Refresh" : "Generate"}</button>
          <button class="loomos-button" data-action="reload"${disabled(!permissions.chatMutation)}>Reload</button>
          ${activeGenerationRequestId
            ? `<button class="loomos-button" data-action="cancel">Cancel</button>`
            : ""}
          ${state
            ? `<button class="loomos-button loomos-button-danger" data-action="delete">Delete State</button>`
            : ""}
          ${missingPermission
            ? `<button class="loomos-button loomos-warning" data-action="permissions">Enable Features</button>`
            : ""}
        </div>
      </div>
      ${renderSettings()}
      <div class="loomos-grid">${panels}</div>`;

    refreshMessageAction();
  }

  function readSettings(): LoomOSSettings {
    const root = tab.root;
    const next = {
      skin: root.querySelector<HTMLSelectElement>('[data-setting="skin"]')?.value,
      autoGeneration: root.querySelector<HTMLSelectElement>('[data-setting="autoGeneration"]')?.value,
      injectionEnabled: root.querySelector<HTMLInputElement>('[data-setting="injectionEnabled"]')?.checked,
      injectionTokenBudget: Number(root.querySelector<HTMLInputElement>('[data-setting="injectionTokenBudget"]')?.value),
      recentMessageLimit: Number(root.querySelector<HTMLInputElement>('[data-setting="recentMessageLimit"]')?.value),
      connectionId: root.querySelector<HTMLInputElement>('[data-setting="connectionId"]')?.value ?? "",
      panels: {
        kernel: root.querySelector<HTMLInputElement>('[data-panel="kernel"]')?.checked,
        castMatrix: root.querySelector<HTMLInputElement>('[data-panel="castMatrix"]')?.checked,
        threadLoom: root.querySelector<HTMLInputElement>('[data-panel="threadLoom"]')?.checked,
        continuityFirewall: root.querySelector<HTMLInputElement>('[data-panel="continuityFirewall"]')?.checked,
      },
    };
    return LoomOSSettingsSchema.parse(next);
  }

  function saveCurrentSettings(): void {
    try {
      settings = readSettings();
      status = "Saving settings";
      send({
        type: "save_settings",
        requestId: requestId("settings"),
        settings,
      });
      render();
    } catch (error) {
      status = error instanceof Error ? error.message : String(error);
      render();
    }
  }

  function startGeneration(): void {
    const identity = currentRequest();
    if (!identity || !identity.messageId) {
      status = "Open a chat with at least one message first.";
      render();
      return;
    }
    if (!permissions.generation || !permissions.chatMutation) {
      status = "Generation and chat access permissions are required.";
      render();
      return;
    }
    activeGenerationRequestId = requestId("generate");
    status = "Compiling story state";
    send({
      type: "generate_state",
      requestId: activeGenerationRequestId,
      identity,
    });
    render();
  }

  function reloadState(): void {
    const identity = currentRequest();
    if (!identity || !identity.messageId) {
      activeIdentity = null;
      state = null;
      status = "No active message";
      render();
      return;
    }
    status = "Loading exact swipe";
    send({
      type: "get_state",
      requestId: requestId("state"),
      identity,
    });
    render();
  }

  async function deleteCurrentState(): Promise<void> {
    const identity = currentRequest();
    if (!identity || !identity.messageId) return;
    const { confirmed } = await ctx.ui.showConfirm({
      title: "Delete LoomOS State",
      message: "Delete the stored snapshot for this exact message and swipe?",
      variant: "danger",
      confirmLabel: "Delete",
    });
    if (!confirmed) return;
    send({
      type: "delete_state",
      requestId: requestId("delete"),
      identity,
    });
  }

  async function requestPermissions(): Promise<void> {
    try {
      status = "Waiting for permission confirmation";
      render();
      await ctx.permissions.request(
        ["generation", "chat_mutation", "interceptor"],
        {
          reason: "LoomOS reads chat history to compile swipe-specific state, runs quiet generation, and optionally injects a compact state summary.",
        },
      );
      send({
        type: "refresh_permissions",
        requestId: requestId("permissions"),
      });
    } catch (error) {
      status = error instanceof Error ? error.message : String(error);
      render();
    }
  }

  function syncFromHost(asReady: boolean): void {
    const active = currentRequest();
    if (!active?.chatId) {
      activeIdentity = null;
      state = null;
      status = "No active chat";
      send({ type: "ready", active: null });
      render();
      return;
    }
    status = "Loading exact swipe";
    if (asReady) {
      send({ type: "ready", active });
    } else {
      send({
        type: "get_state",
        requestId: requestId("sync"),
        identity: active,
      });
    }
    render();
  }

  function identityFromEvent(payload: unknown): IdentityRequest | null {
    if (!isRecord(payload) || !isRecord(payload.message)) return null;
    const message = payload.message;
    const chatId = typeof payload.chatId === "string"
      ? payload.chatId
      : typeof message.chat_id === "string"
      ? message.chat_id
      : null;
    if (
      !chatId
      || typeof message.id !== "string"
      || typeof message.swipe_id !== "number"
    ) {
      return null;
    }
    return {
      chatId,
      messageId: message.id,
      swipeId: message.swipe_id,
    };
  }

  function handleBackendMessage(payload: unknown): void {
    if (!isRecord(payload) || typeof payload.type !== "string") return;
    const response = payload as unknown as BackendResponse;
    switch (response.type) {
      case "bootstrap":
        settings = response.settings;
        permissions = response.permissions;
        activeIdentity = response.identity;
        state = response.state;
        status = response.identity
          ? response.state
            ? "State loaded"
            : "Ready to generate"
          : "No active message";
        break;
      case "settings":
        settings = response.settings;
        status = "Settings saved";
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
        if (response.status === "started") {
          activeGenerationRequestId = response.requestId;
          if (response.identity) activeIdentity = response.identity;
          status = "Compiling story state";
        } else {
          if (activeGenerationRequestId === response.requestId) {
            activeGenerationRequestId = null;
          }
          status = response.message
            ?? (response.status === "completed" ? "State compiled" : response.status);
        }
        break;
      case "error":
        status = response.message;
        break;
    }
    render();
  }

  function handleRootClick(event: Event): void {
    const target = (event.target as Element | null)?.closest<HTMLElement>("[data-action]");
    const action = target?.dataset.action;
    if (!action) return;
    if (action === "generate") startGeneration();
    if (action === "reload") reloadState();
    if (action === "cancel" && activeGenerationRequestId) {
      send({
        type: "cancel_generation",
        requestId: activeGenerationRequestId,
      });
    }
    if (action === "delete") void deleteCurrentState();
    if (action === "permissions") void requestPermissions();
  }

  function handleRootChange(event: Event): void {
    const target = event.target as HTMLElement | null;
    if (target?.matches("[data-setting], [data-panel]")) {
      saveCurrentSettings();
    }
  }

  tab.root.addEventListener("click", handleRootClick);
  tab.root.addEventListener("change", handleRootChange);
  cleanups.push(() => tab.root.removeEventListener("click", handleRootClick));
  cleanups.push(() => tab.root.removeEventListener("change", handleRootChange));
  cleanups.push(inputAction.onClick(() => tab.activate()));
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
      send({
        type: "get_state",
        requestId: requestId("swipe"),
        identity,
      });
      render();
    }
  }));
  cleanups.push(ctx.events.on("SWIPE_EDITED", (payload) => {
    const identity = identityFromEvent(payload);
    if (identity) {
      send({
        type: "get_state",
        requestId: requestId("swipe-edit"),
        identity,
      });
    }
  }));
  cleanups.push(ctx.events.on("CHARACTER_MESSAGE_RENDERED", refreshMessageAction));
  cleanups.push(ctx.events.on("USER_MESSAGE_RENDERED", refreshMessageAction));

  render();
  syncFromHost(true);

  return () => {
    if (disposed) return;
    const chatId = ctx.getActiveChat().chatId ?? undefined;
    send({ type: "frontend_disposed", chatId });
    if (activeGenerationRequestId) {
      send({
        type: "cancel_generation",
        requestId: activeGenerationRequestId,
      });
    }
    disposed = true;
    messageActionCleanup?.();
    messageActionCleanup = null;
    for (const cleanup of cleanups.splice(0).reverse()) {
      try {
        cleanup();
      } catch {
        // Continue tearing down all owned handles.
      }
    }
    inputAction.destroy();
    tab.destroy();
    removeStyle();
    ctx.dom.cleanup();
  };
}
