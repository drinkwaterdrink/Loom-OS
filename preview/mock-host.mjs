import { setup } from "../dist/frontend.js";

const seededState = {
  schemaVersion: 1,
  identity: {
    chatId: "chat-preview",
    messageId: "message-preview",
    swipeId: 1,
  },
  generatedAt: "2026-06-07T12:00:00.000Z",
  source: {
    messageCount: 18,
    repaired: false,
  },
  kernel: {
    scene: "The locked observatory",
    location: "North tower archive",
    timeframe: "Minutes before dawn",
    tone: "Tense, intimate, conspiratorial",
    objective: "Recover the missing ledger before the guards breach the tower.",
    summary: "Mara and Iven search the observatory while their fragile alliance begins to fracture.",
    constraints: [
      "The east stair collapsed.",
      "The bell has not rung.",
      "Mara cannot reveal who sent her.",
    ],
  },
  castMatrix: [
    {
      name: "Mara Vey",
      role: "Investigator",
      status: "Searching the upper gallery",
      location: "North tower",
      emotionalState: "Controlled panic",
      goals: ["Recover the ledger", "Keep her patron secret"],
      relationships: ["Distrusts Iven"],
      leverage: ["Knows the guard rotation"],
    },
    {
      name: "Iven",
      role: "Reluctant accomplice",
      status: "Hiding a torn ledger page",
      location: "Telescope dais",
      emotionalState: "Defensive",
      goals: ["Escape unseen"],
      relationships: ["Protective of Mara despite himself"],
      leverage: ["Possesses a torn page"],
    },
  ],
  threadLoom: [
    {
      title: "The missing ledger",
      status: "escalating",
      urgency: 5,
      summary: "The ledger can expose the Regent's private accounts.",
      nextPressure: "The guards breach the lower observatory door.",
      participants: ["Mara Vey", "Iven"],
    },
    {
      title: "Iven's hidden page",
      status: "active",
      urgency: 3,
      summary: "Iven concealed evidence from Mara.",
      nextPressure: "Mara notices soot on his glove.",
      participants: ["Mara Vey", "Iven"],
    },
  ],
  continuityFirewall: {
    establishedFacts: [
      "The east stair collapsed.",
      "The guards are below the observatory.",
    ],
    pendingConsequences: [
      "The tower doors will fail soon.",
      "Mara may discover Iven's deception.",
    ],
    secrets: [
      "Iven already found one torn page.",
    ],
    risks: [
      {
        severity: "high",
        issue: "Do not route anyone down the east stair.",
        evidence: "It collapsed in the previous turn.",
        recommendation: "Use the roof, west ladder, or remain inside the tower.",
      },
      {
        severity: "medium",
        issue: "Mara does not know Iven has the page.",
        evidence: "He concealed it before she entered the gallery.",
        recommendation: "Keep her dialogue and decisions consistent with that ignorance.",
      },
    ],
  },
};

const defaultSettings = {
  skin: "cyberpunk",
  autoGeneration: "manual",
  injectionEnabled: true,
  injectionTokenBudget: 320,
  recentMessageLimit: 24,
  connectionId: "",
  panels: {
    kernel: true,
    castMatrix: true,
    threadLoom: true,
    continuityFirewall: true,
  },
};

const eventHandlers = new Map();
let backendHandler = () => {};

const ctx = {
  dom: {
    addStyle(css) {
      const style = document.createElement("style");
      style.textContent = css;
      document.head.append(style);
      return () => style.remove();
    },
    cleanup() {},
  },
  ui: {
    registerDrawerTab() {
      const root = document.createElement("div");
      document.getElementById("drawer").append(root);
      return {
        root,
        tabId: "preview",
        setTitle() {},
        setShortName() {},
        setBadge() {},
        activate() {},
        destroy() {
          root.remove();
        },
        onActivate() {
          return () => {};
        },
      };
    },
    registerInputBarAction() {
      const button = document.getElementById("input-actions");
      const handlers = new Set();
      const listener = () => handlers.forEach((handler) => handler());
      button.addEventListener("click", listener);
      return {
        actionId: "preview-action",
        setLabel(label) {
          button.textContent = label;
        },
        setSubtitle() {},
        setEnabled(enabled) {
          button.disabled = !enabled;
        },
        onClick(handler) {
          handlers.add(handler);
          return () => handlers.delete(handler);
        },
        destroy() {
          button.removeEventListener("click", listener);
        },
      };
    },
    showConfirm: async () => ({ confirmed: true }),
  },
  events: {
    on(name, handler) {
      const handlers = eventHandlers.get(name) ?? new Set();
      handlers.add(handler);
      eventHandlers.set(name, handlers);
      return () => handlers.delete(handler);
    },
    emit() {},
  },
  permissions: {
    getGranted: async () => ["generation", "chat_mutation", "interceptor"],
    request: async () => ["generation", "chat_mutation", "interceptor"],
  },
  messages: {
    getLatestMessageId: () => "message-preview",
    renderWidget(options) {
      const root = document.getElementById("message-widget");
      root.innerHTML = options.html.replace(/<script[\s\S]*?<\/script>/g, "");
      return () => {
        root.innerHTML = "";
      };
    },
  },
  getActiveChat: () => ({
    chatId: "chat-preview",
    characterId: "character-preview",
  }),
  sendToBackend(payload) {
    if (payload.type === "ready" || payload.type === "get_state") {
      queueMicrotask(() => backendHandler({
        type: payload.type === "ready" ? "bootstrap" : "state",
        settings: defaultSettings,
        permissions: {
          generation: true,
          interceptor: true,
          chatMutation: true,
        },
        identity: seededState.identity,
        state: seededState,
      }));
    } else if (payload.type === "save_settings") {
      queueMicrotask(() => backendHandler({
        type: "settings",
        requestId: payload.requestId,
        settings: payload.settings,
      }));
    }
  },
  onBackendMessage(handler) {
    backendHandler = handler;
    return () => {
      backendHandler = () => {};
    };
  },
};

window.loomosPreviewCleanup = setup(ctx);
