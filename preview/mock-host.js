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
    "sceneKernel", "deltas", "meters", "castCore", "castVisuals", "appearance", "clothing",
    "relationships", "inventory", "worldSpace", "storyThreads", "continuity",
    "secretsRumors", "actionResolver", "imagePrompt", "auditLog",
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
      appearance: {
        species: "Human",
        ageBand: "Adult",
        apparentAge: "Early thirties",
        genderPresentation: "Woman",
        height: "Average height",
        weight: "Light for her height",
        build: "Lean and fine-boned",
        bodyType: "Slim with restrained curves",
        frame: "Narrow shoulders and long legs",
        proportions: "Long-legged, defined waist, balanced rounded hips",
        silhouette: "A narrow, practical silhouette softened at the waist and hips",
        shoulders: "Narrow and gently sloped",
        bust: "Modest and proportionate",
        waist: "Clearly defined",
        hips: "Balanced and softly rounded",
        glutes: "Compact, rounded, and proportionate to her slim frame",
        skin: "Fair with a cool undertone",
        complexion: "Clear with wind-reddened cheeks",
        face: "Heart-shaped face with high cheekbones and a tapered chin",
        facialStructure: "Fine-boned with an alert brow and precise jawline",
        hair: "Ink-dark shoulder-length hair in a practical low knot, with rain-curled wisps at the temples",
        eyes: "Storm-grey eyes beneath straight dark brows",
        nose: "Straight narrow bridge",
        lips: "Defined cupid's bow and a serious resting line",
        uniqueFeatures: "A faint crescent scar beneath the left eye",
        attractiveFeatures: "Expressive grey eyes, elegant cheekbones, a defined waist, and balanced rounded hips",
        presence: "Quiet, controlled intensity",
        immutableTraits: ["Storm-grey eyes", "Ink-dark low knot", "Crescent scar beneath left eye"],
        fullDescription: "Mara is a lean, fine-boned adult woman of average height, with a long-legged silhouette, narrow shoulders, a defined waist, and balanced rounded hips. Her ink-dark hair is pulled into a practical low knot, leaving rain-curled wisps around a heart-shaped face with high cheekbones, a straight nose, and a faint crescent scar beneath her left eye. Storm-grey eyes and an alert brow give her an incisive, watchful beauty, while her compact curves and controlled posture keep her presence restrained rather than delicate.",
        anchor: "Preserve Mara's storm-grey eyes, ink-dark low knot, crescent scar, lean long-legged proportions, defined waist, and restrained watchful presence.",
      },
      clothing: {
        summary: "Mara wears a fitted charcoal wool investigator's coat over a smoke-blue linen shirt and high-waisted black trousers. The coat follows her narrow shoulders and defined waist before opening over the hips; rain has darkened the hem and soot smears the left sleeve. Close black leather gloves, weathered ankle boots, and a slim cross-body document satchel complete the practical tailored outfit.",
        silhouette: "Narrow tailored shoulders, cinched waist, straight trouser line, knee-length coat",
        palette: "Charcoal, smoke blue, matte black, weathered brass",
        fabric: "Dense rain-darkened wool, softly wrinkled linen, worn leather, and brushed brass",
        fit: "Close through the shoulders and waist with movement ease; trousers skim the hips and taper at the ankle",
        condition: "Rain-damp hem, soot-smeared left sleeve, otherwise carefully maintained",
        styling: "Collar turned up, shirt buttoned high, coat belt knotted rather than buckled",
        coverage: "High neckline, full sleeves, full-length trousers, knee-length outer layer",
        footwear: "Black leather ankle boots with low stacked heels and wet scuffed toes",
        accessories: "Close leather gloves, brass watch chain, slim document satchel",
        notable: "Fresh soot on the left sleeve and a small tear beside one pocket",
        layerCount: 5,
        layers: [
          { slot: "outer", text: "Knee-length charcoal wool investigator's coat with fitted waist and brass closures", state: "Rain-darkened hem, soot-stained left sleeve" },
          { slot: "upper", text: "Smoke-blue linen shirt with a high buttoned collar", state: "Softly wrinkled but intact" },
          { slot: "lower", text: "High-waisted matte-black trousers tapered at the ankle", state: "Damp cuffs" },
          { slot: "feet", text: "Black leather ankle boots with low stacked heels", state: "Wet and lightly scuffed" },
          { slot: "accessory", text: "Black gloves, brass watch chain, and slim document satchel", state: "Archive dust on the gloves" },
        ],
      },
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
      appearance: {
        species: "Human",
        ageBand: "Adult",
        apparentAge: "Late thirties",
        genderPresentation: "Man",
        height: "Tall",
        build: "Broad-shouldered and rangy",
        bodyType: "Athletic but travel-worn",
        face: "Angular face with a strong nose and tired mouth",
        hair: "Dark brown hair pushed back carelessly, damp at the temples",
        eyes: "Hazel eyes with amber flecks",
        uniqueFeatures: "A pale line through the right eyebrow",
        attractiveFeatures: "Strong profile, broad shoulders, expressive hazel eyes",
        presence: "Defensive charisma under visible fatigue",
        immutableTraits: ["Hazel eyes", "Scar through right eyebrow", "Tall rangy frame"],
        fullDescription: "Iven is a tall adult man with a rangy athletic build, broad shoulders, and an angular face sharpened by fatigue. Damp dark-brown hair has been pushed back from hazel eyes flecked with amber, and a pale scar cuts through his right eyebrow. His strong profile and guarded mouth can read as striking, but his posture is currently compressed by secrecy and the pressure of the approaching guards.",
        anchor: "Preserve Iven's tall rangy frame, broad shoulders, hazel eyes, damp pushed-back hair, and scar through the right eyebrow.",
      },
      clothing: {
        summary: "Iven wears a weathered deep-brown leather coat over a rumpled cream shirt and dark work trousers. The coat hangs open enough to expose its inner pocket, where the torn page creates a slight angular bulge; one glove is marked with black soot.",
        silhouette: "Broad shoulders, open long coat, straight dark trousers",
        palette: "Deep brown, cream, soot black, tarnished bronze",
        fabric: "Weathered leather, rumpled cotton, heavy twill",
        fit: "Coat broad through the shoulders and loose through the torso",
        condition: "Rain-speckled, creased, and travel-worn",
        styling: "Open coat, loosened collar, one glove partly removed",
        coverage: "Full sleeves and trousers with open throat",
        footwear: "Mud-darkened leather boots",
        accessories: "One soot-marked glove and a narrow bronze belt buckle",
        notable: "A torn paper edge is barely visible inside the coat",
        layerCount: 4,
        layers: [
          { slot: "outer", text: "Long weathered deep-brown leather coat", state: "Rain-speckled and hanging open" },
          { slot: "upper", text: "Rumpled cream cotton shirt with loosened collar", state: "Damp at the neck" },
          { slot: "lower", text: "Dark heavy-twill work trousers", state: "Creased and road-worn" },
          { slot: "accessory", text: "Soot-marked leather glove and bronze-buckled belt", state: "Right glove visibly stained" },
        ],
      },
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
    imagePrompt: {
      aspect: "16:9",
      shot: "Wide cinematic two-shot",
      medium: "Photorealistic cinematic photography",
      subject: "Mara and Iven face each other across the telescope dais while rain and moonlight cut through the observatory dome.",
      positive: "Copper observatory, rain-streaked glass, cold moonlight, single amber lantern, wet wool coats, visible soot, tense expressions, readable hands.",
      negative: "Text, watermark, extra limbs, malformed hands, modern objects, flat lighting, cropped faces.",
      intent: "Create a continuity-accurate cinematic scene still for an adult gothic mystery roleplay, emphasizing the instant Mara notices evidence that Iven is hiding something.",
      composition: "Wide 16:9 environmental two-shot. Mara occupies the left foreground beside the archive desk; Iven stands in the right midground at the brass telescope dais. The splintering lower door remains visible in the deep background. Use the telescope arm and rain-streaked dome ribs as leading lines between the characters.",
      camera: "Eye-level viewpoint with a restrained 35mm documentary-cinema feel. Frame both adults from approximately mid-thigh upward, keep both faces and both active hands readable, and preserve enough environment to establish the observatory geometry.",
      lighting: "Cold blue-white moonlight enters through rain-streaked glass from camera left, while a single amber lantern near Mara provides a warm low key. Brass surfaces catch narrow highlights; faces remain readable without flat fill light.",
      colorPalette: "Oxidized copper, charcoal wool, smoke blue, deep brown leather, moonlit steel blue, and restrained amber.",
      environment: "A Victorian-inspired copper observatory and archive in hard rain: curved dome ribs, aged brass telescope machinery, scattered ledger papers, wet glass, archive cabinets, a splintering lower door, and no modern technology.",
      characterContinuity: "Mara: adult woman, lean long-legged proportions, narrow shoulders, defined waist, balanced rounded hips, storm-grey eyes, heart-shaped face, ink-dark low knot, crescent scar beneath left eye, fitted charcoal coat, smoke-blue shirt, black trousers, black gloves, brass key in hand, soot on left sleeve. Iven: adult man, tall rangy athletic build, broad shoulders, hazel eyes, damp pushed-back dark-brown hair, scar through right eyebrow, weathered brown leather coat, cream shirt, dark trousers, soot-marked glove, torn paper edge hidden inside coat.",
      action: "Mara turns the brass telescope key in one gloved hand while studying the soot on Iven's raised glove. Iven angles toward the west ladder and presses his other hand close to the hidden page inside his coat. Their gaze meets; neither character smiles.",
      materials: "Wet dense wool with visible nap, worn leather with softened creases, rumpled linen and cotton, aged brushed brass, oxidized copper, rain-beaded glass, soot, torn fibrous paper, and splintered painted wood.",
      mood: "Tense, intimate, conspiratorial, and grounded; the scene should feel like a real dramatic production still rather than a posed fantasy poster.",
      textRendering: "No visible text, captions, labels, logos, signatures, or watermarks anywhere in the image.",
      constraints: ["Exactly two visible adult characters", "Preserve established faces, body proportions, scars, hair, and clothing", "Both active hands and the soot-marked glove must be readable", "Do not crop Mara's key or Iven's hidden-paper gesture", "No modern objects", "No extra limbs or malformed hands"],
      full: "INTENT\nCreate a continuity-accurate, photorealistic cinematic production still for an adult gothic mystery roleplay. Capture the precise instant Mara recognizes that Iven may be concealing evidence, with narrative clarity more important than spectacle.\n\nSCENE AND ENVIRONMENT\nInside a Victorian-inspired copper observatory and archive during hard pre-dawn rain. Curved dome ribs, aged brass telescope machinery, rain-beaded glass, archive cabinets, scattered ledger papers, and a visibly splintering lower door establish the location. No modern technology. The west ladder is visible beyond Iven. Rain and distant guard pressure should be felt through vibration, wet surfaces, and the failing door rather than shown as extra people.\n\nSUBJECTS AND CONTINUITY\nExactly two visible adults. Mara stands in the left foreground: lean and fine-boned, average height, long-legged proportions, narrow shoulders, defined waist, balanced rounded hips, storm-grey eyes, heart-shaped face, high cheekbones, ink-dark hair in a low knot, and a faint crescent scar beneath the left eye. She wears a fitted charcoal wool investigator's coat with a rain-darkened hem and soot on the left sleeve, a smoke-blue high-collared shirt, high-waisted black trousers, close black gloves, weathered ankle boots, and a slim document satchel. Iven stands at the right midground: tall, rangy, broad-shouldered, angular face, hazel eyes, damp pushed-back dark-brown hair, and a scar through his right eyebrow. He wears a weathered deep-brown leather coat, rumpled cream shirt, dark work trousers, and one soot-marked glove.\n\nACTION AND POSE\nMara holds a brass telescope key in one gloved hand while studying the soot on Iven's raised glove. Iven angles his body toward the west ladder and keeps his other hand close to the torn ledger page hidden inside his coat. Their gaze meets. Both faces, both active hands, the key, soot, and the subtle paper edge must remain readable.\n\nCOMPOSITION AND CAMERA\nWide 16:9 environmental two-shot from an eye-level 35mm documentary-cinema viewpoint, framed approximately mid-thigh upward. Mara occupies the left third, Iven the right third, with the telescope arm and dome ribs creating leading lines between them. Keep the splintering door in the deep background and preserve negative space around their eyelines.\n\nLIGHTING, COLOR, AND MATERIALS\nCold moonlight enters from camera left through rain-streaked glass; one amber lantern near Mara provides a restrained warm key. Use oxidized copper, charcoal, smoke blue, deep brown, steel blue, and amber. Render wet wool nap, worn leather creases, rumpled cloth, brushed brass, rain droplets, soot, torn fibrous paper, and splintered wood with grounded tactile detail.\n\nMEDIUM AND FINISH\nPhotorealistic professional cinematic photography, natural skin texture, restrained contrast, believable anatomy, coherent hands, realistic fabric behavior, and subtle film grain. The result should feel like a frame from a prestige mystery drama, not a fantasy poster.\n\nTEXT AND CONSTRAINTS\nNo text, captions, labels, logos, signatures, or watermarks. Exactly two adult characters. No extra people, limbs, or fingers. Do not crop Mara's key, Iven's glove, either face, or the hidden-paper gesture. Preserve every established appearance and wardrobe detail.",
      hint: "Keep both faces, Iven's soot-marked glove, and the splintering lower door readable.",
    },
  },
  auditLog: [{ system: "compiler", marker: "message-preview / swipe 1", result: "Valid State V2", repaired: false, notes: "Balanced preset compiled." }],
};

const moduleKeys = [
  "sceneKernel", "deltas", "meters", "castCore", "castVisuals", "clothing",
  "appearance", "relationships", "inventory", "worldSpace", "storyThreads", "continuity",
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
  showInjectionPreview: false,
  injectionTokenBudget: 320,
  compilerSeedTokenBudget: 900,
  recentMessageLimit: 24,
  historyRetentionLimit: 100,
  generationTimeoutSeconds: 180,
  connectionId: "",
  viewerTemplateEnabled: false,
  viewerHtmlTemplate: "",
  viewerCssTemplate: "",
  modulePreset: "balanced",
  moduleSettings,
  customModulePresets: [],
  customModules: [],
  stockModuleOverrides: {},
  activeThemeId: "",
  developerMode: false,
};

const archivedState = JSON.parse(JSON.stringify(seededState));
archivedState.identity = { chatId: "chat-preview", messageId: "message-prior", swipeId: 0 };
archivedState.generatedAt = "2026-06-07T11:42:00.000Z";
archivedState.source.seedIdentity = null;
archivedState.kernel.scene = "The flooded records room";
archivedState.kernel.location = "Lower observatory archive";
archivedState.kernel.timeframe = "Half an hour before dawn";
archivedState.kernel.currentFocus = "Find a dry route back to the north tower.";
archivedState.delta.headline = "Floodwater cut off the eastern archive corridor.";

let previewStates = [seededState, archivedState];
const generationTimers = new Map();

function toHistoryItem(state) {
  return {
    identity: state.identity,
    generatedAt: state.generatedAt,
    schemaVersion: state.schemaVersion,
    kernelScene: state.kernel.scene,
    kernelFocus: state.kernel.currentFocus,
    kernelLocation: state.kernel.location,
    kernelTime: state.kernel.timeframe,
    deltaHeadline: state.delta.headline,
    castCount: state.castMatrix.length,
    threadCount: state.storyState.threadLoom.length,
    riskCount: state.continuityFirewall.risks.length,
    repaired: state.source.repaired,
    seedIdentity: state.source.seedIdentity,
    activeModuleCount: state.activeModules.length,
  };
}

function sameIdentity(left, right) {
  return left.chatId === right.chatId
    && left.messageId === right.messageId
    && left.swipeId === right.swipeId;
}

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
    if (payload.type === "ready") {
      queueMicrotask(() => backendHandler({
        type: "bootstrap",
        settings: defaultSettings,
        permissions: { generation: true, interceptor: true, chatMutation: true },
        connections: [{
          id: "preview-connection", name: "Preview Connection", provider: "mock",
          model: "loom-preview", isDefault: true, ready: true,
        }],
        identity: seededState.identity,
        state: seededState,
        artifacts: { format: "loomos-artifact-library", version: 2, records: [] },
      }));
    } else if (payload.type === "generate_state") {
      const startedAt = Date.now();
      const timers = [];
      generationTimers.set(payload.requestId, timers);
      queueMicrotask(() => backendHandler({
        type: "generation_status",
        requestId: payload.requestId,
        status: "started",
        identity: payload.identity,
        message: "Reading exact-swipe context",
      }));
      timers.push(setTimeout(() => backendHandler({
        type: "generation_status",
        requestId: payload.requestId,
        status: "progress",
        identity: payload.identity,
        message: "Compiling active modules",
      }), 1500));
      timers.push(setTimeout(() => backendHandler({
        type: "generation_status",
        requestId: payload.requestId,
        status: "progress",
        identity: payload.identity,
        message: "Validating continuity",
      }), 3500));
      timers.push(setTimeout(() => {
        const generatedState = {
          ...seededState,
          generatedAt: new Date().toISOString(),
          identity: {
            ...seededState.identity,
            swipeId: payload.identity?.swipeId ?? seededState.identity.swipeId,
          },
        };
        previewStates = [
          generatedState,
          ...previewStates.filter((candidate) => !sameIdentity(candidate.identity, generatedState.identity)),
        ];
        backendHandler({
          type: "state",
          requestId: payload.requestId,
          identity: generatedState.identity,
          state: generatedState,
        });
        backendHandler({
          type: "generation_status",
          requestId: payload.requestId,
          status: "completed",
          identity: generatedState.identity,
          message: "Tracker generated",
          report: {
            phase: "completed",
            attempt: 1,
            elapsedMs: Date.now() - startedAt,
            connectionId: "preview-connection",
            normalized: true,
            fallbackSaved: false,
            issues: [],
          },
        });
        generationTimers.delete(payload.requestId);
      }, 6000));
    } else if (payload.type === "cancel_generation") {
      for (const timer of generationTimers.get(payload.requestId) ?? []) clearTimeout(timer);
      generationTimers.delete(payload.requestId);
      queueMicrotask(() => backendHandler({
        type: "generation_status",
        requestId: payload.requestId,
        status: "cancelled",
        message: "Generation cancelled",
      }));
    } else if (payload.type === "get_state" || payload.type === "load_history_state") {
      const requested = payload.identity ?? seededState.identity;
      const found = previewStates.find((candidate) => sameIdentity(candidate.identity, requested)) ?? null;
      queueMicrotask(() => backendHandler({
        type: "state",
        requestId: payload.requestId,
        identity: requested,
        state: found,
      }));
    } else if (payload.type === "delete_state" || payload.type === "delete_history_state") {
      const requested = payload.identity ?? seededState.identity;
      previewStates = previewStates.filter((candidate) => !sameIdentity(candidate.identity, requested));
      queueMicrotask(() => backendHandler(payload.type === "delete_history_state"
        ? {
            type: "history_state_deleted",
            requestId: payload.requestId,
            chatId: requested.chatId,
            identity: requested,
            items: previewStates.map(toHistoryItem),
          }
        : {
            type: "state",
            requestId: payload.requestId,
            identity: requested,
            state: null,
          }));
    } else if (payload.type === "save_settings") {
      Object.assign(defaultSettings, payload.settings);
      queueMicrotask(() => backendHandler({ type: "settings", requestId: payload.requestId, settings: defaultSettings }));
    } else if (payload.type === "get_chat_states") {
      queueMicrotask(() => backendHandler({
        type: "chat_states",
        requestId: payload.requestId,
        chatId: payload.chatId,
        states: previewStates.map((state) => ({
          messageId: state.identity.messageId,
          swipeId: state.identity.swipeId,
        })),
      }));
    } else if (payload.type === "list_state_history") {
      queueMicrotask(() => backendHandler({
        type: "state_history",
        requestId: payload.requestId,
        chatId: payload.chatId,
        items: previewStates.map(toHistoryItem),
      }));
    }
  },
  onBackendMessage(handler) {
    backendHandler = handler;
    return () => { backendHandler = () => {}; };
  },
};

const extensionCleanup = setup(ctx);
window.loomosPreviewCleanup = () => {
  for (const timers of generationTimers.values()) {
    for (const timer of timers) clearTimeout(timer);
  }
  generationTimers.clear();
  extensionCleanup();
};

const previewParams = new URLSearchParams(window.location.search);
setTimeout(() => {
  if (previewParams.get("viewer") === "1") {
    document.getElementById("input-actions")?.click();
  }
  setTimeout(() => {
    const tabName = previewParams.get("tab");
    if (tabName) {
      document.querySelector(`[data-tab="${CSS.escape(tabName)}"]`)?.click();
    }
  }, 80);
}, 80);
