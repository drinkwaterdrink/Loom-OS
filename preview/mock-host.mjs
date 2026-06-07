import { setup } from "../dist/frontend.js";

const baseGauge = {
  value: 58,
  pct: "58%",
  band: "elevated",
  color: "accent",
  trend: "up",
  note: "Pressure increased this turn.",
};

const seededState = {
  schemaVersion: 2,
  identity: { chatId: "chat-preview", messageId: "message-preview", swipeId: 1 },
  generatedAt: "2026-06-07T12:00:00.000Z",
  source: {
    messageCount: 18,
    repaired: false,
    seedIdentity: { chatId: "chat-preview", messageId: "message-prior", swipeId: 0 },
    connectionId: "preview-connection",
  },
  activeModules: [
    "sceneKernel", "deltas", "meters", "castCore", "castVisuals", "clothing",
    "relationships", "inventory", "worldSpace", "storyThreads", "continuity",
    "secretsRumors", "actionResolver", "auditLog",
  ],
  kernel: {
    scene: "The locked observatory",
    location: "North tower archive",
    timeframe: "Minutes before dawn",
    date: "Third day of winter",
    time: "Pre-dawn",
    elapsed: "Eleven minutes",
    weather: "Hard rain",
    pov: "Mara Vey",
    tone: "Tense, intimate, conspiratorial",
    topic: "The missing ledger",
    theme: "Trust under pressure",
    objective: "Recover the missing ledger before the guards breach the tower.",
    summary: "Mara and Iven search the observatory while their fragile alliance begins to fracture.",
    currentFocus: "Decide whether to confront Iven about the soot on his glove.",
    nextFocus: "Choose the roof hatch or west ladder.",
    currentRisk: "The lower observatory door is failing.",
    stopMode: "decision",
    stopWhy: "Mara must act before the guards enter.",
    constraints: [
      "The east stair collapsed.",
      "Mara does not know Iven has a torn page.",
      "The guards are one landing below.",
    ],
  },
  delta: {
    headline: "The guards reached the landing and Iven's hidden page became easier to notice.",
    changedModules: ["deltas", "worldSpace", "castCore", "storyThreads"],
    changes: [
      { text: "The guards are now directly below the observatory.", age: "this turn", module: "worldSpace", importance: "critical" },
      { text: "Soot on Iven's glove is now visible to Mara.", age: "this turn", module: "castVisuals", importance: "high" },
    ],
    carriedForward: ["The east stair remains unusable.", "Iven still conceals the torn page."],
    newlyEstablished: ["The lower observatory door is starting to splinter."],
  },
  meters: [
    { id: "tension", label: "Tension", ...baseGauge, value: 82, pct: "82%", band: "critical" },
    { id: "coherence", label: "Coherence", ...baseGauge, value: 91, pct: "91%", band: "stable", trend: "steady" },
    { id: "hiddenInfo", label: "Hidden Info", ...baseGauge, value: 68, pct: "68%", band: "loaded" },
  ],
  scene: {
    privacy: "exposed",
    observerCount: 6,
    observerPressure: { ...baseGauge, value: 8, pct: "80%", band: "closing in" },
    crowdNoise: "Boots and shouted orders",
    crowdFlow: "Upward toward the observatory",
    light: { primary: "Cold moonlight", secondary: "Single lantern", quality: "Broken shadows", color: "blue-gold" },
    spatial: ["The roof hatch is above the telescope dais.", "The west ladder is visible from the gallery.", "The east stair is collapsed."],
    access: {
      exit: "WATCHED",
      lineOfSight: "The west ladder crosses the guards' approach.",
      noiseMask: "Rain drums against the copper dome.",
      items: ["Telescope", "Archive desk"],
      people: ["Mara", "Iven"],
    },
    carryover: {
      body: ["Mara has soot on her left sleeve."],
      room: ["The lower door is splintering."],
      social: ["Mara distrusts Iven but still needs him."],
    },
    items: [
      { name: "Torn ledger page", owner: "Iven", location: "Inside coat", condition: "Soot-stained", lastTouch: "Iven concealed it", importance: "critical" },
      { name: "Brass telescope key", owner: "Mara", location: "Right pocket", condition: "Good", lastTouch: "Mara used it", importance: "high" },
    ],
  },
  castMatrix: [
    {
      id: "mara-vey", name: "Mara Vey", kind: "pov", qty: 1, role: "Investigator",
      location: "Upper gallery", status: "Watching Iven while listening to the door",
      emotionalState: "Controlled panic", intent: "Recover the ledger and preserve her patron's identity",
      pose: "Half-crouched beside the archive desk", proximity: "Across the dais from Iven",
      hands: "One hand on the telescope key", awareness: "alerted",
      threat: { ...baseGauge, value: 3, pct: "30%", band: "low", trend: "steady" },
      spotlight: { ...baseGauge, value: 72, pct: "72%", band: "primary" },
      visualAnchor: "Rain-dark coat, soot-marked sleeve, brass key in hand.",
      identitySummary: "An investigator hiding the identity of her patron.",
      clothingSummary: "Dark wool coat, leather gloves, soot on the left sleeve.",
      goals: ["Recover the ledger", "Keep her patron secret"],
      relationships: [
        { target: "Iven", axis: "trust", value: -45 },
        { target: "Iven", axis: "dependence", value: 60 },
      ],
      leverage: ["Knows the guard rotation"],
      pockets: [{ name: "Brass telescope key", type: "key", qty: 1, condition: "Good", known: true }],
      stableFacts: ["Mara cannot reveal who sent her."],
    },
    {
      id: "iven", name: "Iven", kind: "main", qty: 1, role: "Reluctant accomplice",
      location: "Telescope dais", status: "Concealing a torn ledger page",
      emotionalState: "Defensive", intent: "Escape unseen without surrendering the page",
      pose: "Angled toward the west ladder", proximity: "Across the dais from Mara",
      hands: "Right hand near his inner coat", awareness: "watching",
      threat: { ...baseGauge, value: 4, pct: "40%", band: "uncertain" },
      spotlight: { ...baseGauge, value: 64, pct: "64%", band: "secondary" },
      visualAnchor: "Soot on one glove and a torn paper edge beneath his coat.",
      identitySummary: "A compromised ally withholding evidence.",
      clothingSummary: "Weathered coat, one soot-marked glove.",
      goals: ["Escape unseen", "Keep the torn page"],
      relationships: [{ target: "Mara", axis: "protectiveness", value: 55 }],
      leverage: ["Possesses a torn page"],
      pockets: [{ name: "Torn ledger page", type: "evidence", qty: 1, condition: "Soot-stained", known: false }],
      stableFacts: ["Iven found the page before Mara entered the gallery."],
    },
  ],
  worldState: {
    recentEnvironmentalChanges: ["Rain intensified.", "The lower door began to splinter."],
    activeHazards: ["Guards are one landing below.", "The east stair is collapsed."],
    rumors: [{ rumor: "The Regent keeps private accounts in a hidden ledger.", source: "Court staff", credibility: 8, pct: "80%", color: "warning" }],
    secrets: [{ secret: "Iven has a torn page.", visibleHint: "Soot and a paper edge beneath his coat.", knownBy: ["Iven"] }],
    loadedSigns: [{ thing: "Soot on Iven's glove", loadedBy: "He handled the page", firesWhen: "Mara looks closely", state: "HEATING" }],
  },
  storyState: {
    goals: [{ who: "Mara", goal: "Recover the ledger", status: "ACTIVE", note: "The full ledger remains missing." }],
    conflicts: [{ a: "Mara", b: "Iven", label: "Withheld evidence", severity: 2 }],
    threadLoom: [
      {
        title: "The missing ledger", status: "escalating", urgency: 5, priority: "critical",
        progress: 3, pct: "30%", color: "danger", label: "Escalating",
        summary: "The ledger can expose the Regent's private accounts.",
        nextPressure: "The guards breach the lower observatory door.", participants: ["Mara", "Iven"],
      },
      {
        title: "Iven's hidden page", status: "active", urgency: 4, priority: "high",
        progress: 5, pct: "50%", color: "warning", label: "Loaded",
        summary: "Iven concealed evidence from Mara.",
        nextPressure: "Mara notices the soot on his glove.", participants: ["Mara", "Iven"],
      },
    ],
    stakes: [{ who: "Mara", win: "Expose the Regent.", lose: "Her patron is implicated." }],
    countdowns: [{ title: "Door breach", left: 2, unit: "turns", pct: "25%", color: "danger" }],
    autonomyQueue: [{ who: "Iven", action: "Move toward the west ladder.", unlessInterruptedBy: "Mara confronts him." }],
  },
  continuityFirewall: {
    establishedFacts: ["The east stair collapsed.", "The guards are below the observatory."],
    antiRetconAnchors: ["Do not use the east stair.", "Mara does not know Iven has the page."],
    pendingConsequences: ["The tower door will fail soon.", "Mara may discover Iven's deception."],
    offscreenState: ["Six guards are advancing from the lower landing."],
    bannedNext: [{ text: "Do not reveal the hidden page without an observable trigger.", persistent: false }],
    impossibleNext: ["Escape down the collapsed east stair."],
    risks: [
      { severity: "high", issue: "Do not route anyone down the east stair.", evidence: "It collapsed in the previous turn.", recommendation: "Use the roof hatch or west ladder." },
      { severity: "medium", issue: "Mara does not yet know Iven has the page.", evidence: "He concealed it before she entered.", recommendation: "Keep her decisions consistent with that ignorance." },
    ],
  },
  tools: {
    actionResolver: {
      userAction: "Mara studies Iven's glove while the door shudders.",
      worldResponse: "The soot and paper edge become observable, but the guards gain ground.",
      risk: "Confronting him costs escape time.",
      blockers: ["Low light", "Immediate guard pressure"],
    },
    dialogueState: null,
    directorStyle: null,
    closenessState: null,
    imagePrompt: null,
  },
  auditLog: [{ system: "compiler", marker: "message-preview / swipe 1", result: "Valid State V2", repaired: false, notes: "Balanced preset compiled." }],
};

const moduleKeys = [
  "sceneKernel", "deltas", "meters", "castCore", "castVisuals", "clothing",
  "relationships", "inventory", "worldSpace", "storyThreads", "continuity",
  "secretsRumors", "actionResolver", "dialogueState", "directorStyle",
  "closenessState", "imagePrompt", "auditLog",
];
const active = new Set(seededState.activeModules);
const moduleSettings = Object.fromEntries(moduleKeys.map((key) => [
  key,
  { track: active.has(key), display: active.has(key), inject: ["sceneKernel", "deltas", "castCore", "relationships", "inventory", "worldSpace", "storyThreads", "continuity", "actionResolver"].includes(key) },
]));
const defaultSettings = {
  schemaVersion: 2,
  skin: "cyberpunk",
  autoGeneration: "manual",
  injectionEnabled: true,
  injectionTokenBudget: 320,
  compilerSeedTokenBudget: 900,
  recentMessageLimit: 24,
  generationTimeoutSeconds: 180,
  connectionId: "",
  modulePreset: "balanced",
  moduleSettings,
  customModulePresets: [],
  customModules: [],
  stockModuleOverrides: [],
};

const eventHandlers = new Map();
let backendHandler = () => {};

function modalHandle(options) {
  const backdrop = document.createElement("div");
  backdrop.className = "mock-modal-backdrop";
  const shell = document.createElement("section");
  shell.className = "mock-modal";
  const header = document.createElement("header");
  const title = document.createElement("strong");
  title.textContent = options.title;
  const close = document.createElement("button");
  close.type = "button";
  close.textContent = "Close";
  const root = document.createElement("div");
  root.className = "mock-modal-body";
  header.append(title, close);
  shell.append(header, root);
  backdrop.append(shell);
  document.body.append(backdrop);
  const dismissHandlers = new Set();
  const dismiss = () => {
    backdrop.remove();
    for (const handler of dismissHandlers) handler();
  };
  close.addEventListener("click", dismiss);
  return {
    root,
    modalId: `preview-${Date.now()}`,
    dismiss,
    setTitle(value) { title.textContent = value; },
    onDismiss(handler) {
      dismissHandlers.add(handler);
      return () => dismissHandlers.delete(handler);
    },
  };
}

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
        root, tabId: "preview", setTitle() {}, setShortName() {}, setBadge() {},
        activate() {}, destroy() { root.remove(); }, onActivate() { return () => {}; },
      };
    },
    registerInputBarAction() {
      const button = document.getElementById("input-actions");
      const handlers = new Set();
      const listener = () => handlers.forEach((handler) => handler());
      button.addEventListener("click", listener);
      return {
        actionId: "preview-action",
        setLabel(label) { button.textContent = label; },
        setSubtitle() {},
        setEnabled(enabled) { button.disabled = !enabled; },
        onClick(handler) { handlers.add(handler); return () => handlers.delete(handler); },
        destroy() { button.removeEventListener("click", listener); },
      };
    },
    showModal: modalHandle,
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
      return () => { root.innerHTML = ""; };
    },
  },
  getActiveChat: () => ({ chatId: "chat-preview", characterId: "character-preview" }),
  sendToBackend(payload) {
    if (payload.type === "ready" || payload.type === "get_state") {
      queueMicrotask(() => backendHandler({
        type: payload.type === "ready" ? "bootstrap" : "state",
        settings: defaultSettings,
        permissions: { generation: true, interceptor: true, chatMutation: true },
        connections: [{
          id: "preview-connection", name: "Preview Connection", provider: "mock",
          model: "loom-preview", isDefault: true, ready: true,
        }],
        identity: seededState.identity,
        state: seededState,
      }));
    } else if (payload.type === "save_settings") {
      Object.assign(defaultSettings, payload.settings);
      queueMicrotask(() => backendHandler({ type: "settings", requestId: payload.requestId, settings: defaultSettings }));
    }
  },
  onBackendMessage(handler) {
    backendHandler = handler;
    return () => { backendHandler = () => {}; };
  },
};

window.loomosPreviewCleanup = setup(ctx);
