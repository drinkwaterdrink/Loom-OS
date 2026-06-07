export const MODULE_KEYS = [
  "sceneKernel",
  "deltas",
  "meters",
  "castCore",
  "castVisuals",
  "clothing",
  "relationships",
  "inventory",
  "worldSpace",
  "storyThreads",
  "continuity",
  "secretsRumors",
  "actionResolver",
  "dialogueState",
  "directorStyle",
  "closenessState",
  "imagePrompt",
  "auditLog",
] as const;

export type ModuleKey = typeof MODULE_KEYS[number];
export type ModulePreset = "lite" | "balanced" | "full" | "experimental" | "custom" | string;

export interface ModuleControl {
  track: boolean;
  display: boolean;
  inject: boolean;
}

export const CORE_TRACKING_MODULES = new Set<ModuleKey>([
  "sceneKernel",
  "deltas",
  "castCore",
  "storyThreads",
  "continuity",
]);

export interface ModuleCatalogEntry {
  key: ModuleKey;
  label: string;
  group: string;
  description: string;
  core: boolean;
  intensity: "light" | "medium" | "heavy" | "experimental";
  schemaSummary: string;
  compilerInstruction: string;
  injectionBehavior: string;
  renderBehavior: string;
}

export const MODULE_CATALOG: ReadonlyArray<ModuleCatalogEntry> = [
  { key: "sceneKernel", label: "Scene Kernel", group: "Core", core: true, intensity: "medium",
    description: "Scene, time, tone, focus, objective, and constraints.",
    schemaSummary: "scene, location, timeframe, date, time, elapsed, weather, pov, tone, topic, theme, objective, summary, currentFocus, nextFocus, currentRisk, stopMode, stopWhy, constraints[]",
    compilerInstruction: "Scene metadata, focus, and constraints from transcript and seed. Ground in transcript evidence; carry forward stable scene context.",
    injectionBehavior: "Injected as scene: location, time, focus line. Always included when enabled.",
    renderBehavior: "Overview tab — hero block with scene name, focus, summary, constraints, facts list." },
  { key: "deltas", label: "Turn Deltas", group: "Core", core: true, intensity: "medium",
    description: "Meaningful changes from the previous compiled state.",
    schemaSummary: "headline, changedModules[], changes[{text, age, module, importance}], carriedForward[], newlyEstablished[]",
    compilerInstruction: "Compare prior seed state with newest transcript evidence. Output real diffs with importance labels. Carry forward unchanged facts.",
    injectionBehavior: "Injected first as delta: headline and top 4 changes. Highest injection priority.",
    renderBehavior: "Overview tab — headline callout, change list with importance badges, two-column carried/newly." },
  { key: "meters", label: "Diagnostic Meters", group: "Scene", core: false, intensity: "light",
    description: "Tension, danger, coherence, hidden information, and omen.",
    schemaSummary: "id (enum), label, value 0-100, pct, band, color, trend (enum), note",
    compilerInstruction: "Diagnose scene tension, danger, social heat, coherence, hidden info, and omen based on current narrative pressure. Never command escalation.",
    injectionBehavior: "Not injected by default. Moderate value for scene awareness.",
    renderBehavior: "Overview tab — meter grid with bar visualization, trend icons, band labels." },
  { key: "castCore", label: "Cast Core", group: "Cast", core: true, intensity: "heavy",
    description: "Presence, intent, status, awareness, goals, anchors, appearance, clothing, current state, uncertainty.",
    schemaSummary: "id, name, kind, role, location, status, awareness, threat, spotlight, appearance{}, clothing{}, currentState{}, goals[], stableFacts[], continuity{}, changed, changeNote",
    compilerInstruction: "Track all named characters appearing in the scene. Include appearance, clothing state, current pose/hands/proximity, emotional state, intent, relationships, pocket items, stable facts, and uncertainty. Mark changed=true and add changeNote when any field updates. Carry forward stable visual identity. Crowd/background groups summarized compactly.",
    injectionBehavior: "Injected as cast.Name: status; intent; goal for POV/main/high-spotlight characters. Up to 6 entries.",
    renderBehavior: "Cast tab — full character ledger with search, filters, expandable detail panels. Overview tab — compact cast cards." },
  { key: "castVisuals", label: "Cast Visuals", group: "Cast", core: false, intensity: "light",
    description: "Pose, proximity, hands, visual anchor, and spotlight.",
    schemaSummary: "pose, proximity, hands, visualAnchor, spotlight{gauge}",
    compilerInstruction: "Update pose, proximity, hands, and spotlight from transcript evidence. Spotlight reflects narrative focus weight.",
    injectionBehavior: "Injected only if budget allows and imagePrompt or castVisuals inject is enabled.",
    renderBehavior: "Cast tab — shown in Current State section of character card. Visual anchor in Appearance section." },
  { key: "clothing", label: "Clothing", group: "Cast", core: false, intensity: "light",
    description: "Compact grounded clothing continuity with layers and condition.",
    schemaSummary: "summary, silhouette, palette, fabric, fit, condition, notable, layerCount, layers[{slot, text, state, color}]",
    compilerInstruction: "Track clothing state per character. Persist until changed by transcript evidence. Include silhouette, palette, notable items. Mark changed when clothing updates.",
    injectionBehavior: "Included only if changed or currently plot-relevant. Budget-aware.",
    renderBehavior: "Cast tab — Clothing section in expandable details. Shows layers with slot labels." },
  { key: "relationships", label: "Relationships", group: "Cast", core: false, intensity: "medium",
    description: "Relationship targets, emotional axes, trends, and evidence.",
    schemaSummary: "relSummary, relationships[{target, axis, value -100..100, pct, label, color, trend, evidence}]",
    compilerInstruction: "Track character relationships on axes (Trust, Fear, Attraction, Rivalry, etc.). Value -100 (hostile) to 100 (devoted). Include evidence from transcript. Update trends on each turn.",
    injectionBehavior: "Included only if active in the current scene. Budget-aware.",
    renderBehavior: "Cast tab — Relationships section with value bars, trend indicators, evidence text." },
  { key: "inventory", label: "Inventory", group: "World", core: false, intensity: "medium",
    description: "Pockets, ownership, condition, and important room items.",
    schemaSummary: "pockets[{name, type: consumable/concealed/tool/key/evidence/misc, qty, condition, known, color, changed, changeNote}]",
    compilerInstruction: "Track known pocket inventory per character. Type categorizes the item. Mark changed when items are acquired, used, or transferred. Only known items visible to the POV.",
    injectionBehavior: "Injected as item.Name: name x qty; condition. Budget-aware, only known items.",
    renderBehavior: "Cast tab — Pockets section in expandable details. Scene items in World tab." },
  { key: "worldSpace", label: "World & Space", group: "World", core: false, intensity: "medium",
    description: "Privacy, observers, light, blocking, exits, and hazards.",
    schemaSummary: "privacy, observerCount, observerPressure{gauge}, crowdNoise, crowdFlow, light{primary,secondary,quality,color}, spatial[], access{exit,lineOfSight,noiseMask,items[],people[]}, carryover{body[],room[],social[]}, items[]",
    compilerInstruction: "Update spatial scene state each turn. Exit accessibility, light, crowd dynamics, and spatial facts. Carry over body/room/social context.",
    injectionBehavior: "Injected as access: exit; sight; noise plus spatial facts. Medium priority.",
    renderBehavior: "World tab — scene facts grid, spatial chips, carryover columns, scene items." },
  { key: "storyThreads", label: "Story Threads", group: "Story", core: true, intensity: "heavy",
    description: "Goals, conflicts, threads, stakes, countdowns, spotlight queue, and autonomy.",
    schemaSummary: "goals[]{who, goal, status, note}, conflicts[]{a, b, label, severity}, threadLoom[], stakes[], countdowns[], spotlightQueue[], autonomyQueue[]",
    compilerInstruction: "Track narrative threads with urgency, progress, and next pressure. Goals track character objectives. Spotlight queue tracks which characters need narrative attention. Countdowns tick toward consequences.",
    injectionBehavior: "Injected as thread.title: status/urgency + next pressure. Top urgent threads first. Stakes included for active parties.",
    renderBehavior: "Story tab — thread loom list, goals, stakes, countdowns, spotlight queue card, autonomy queue." },
  { key: "continuity", label: "Continuity Firewall", group: "Story", core: true, intensity: "heavy",
    description: "Facts, anchors, consequences, avoided moves, terms, and risks.",
    schemaSummary: "establishedFacts[], antiRetconAnchors[], pendingConsequences[{cause, pending, trigger, urgency, status, evidence, changed}], offscreenState[], bannedNext[{text, reason, scope, color, source}], impossibleNext[], risks[]{severity, issue, evidence, recommendation}, terms[{party, term, risk, status, binding, evidence}]",
    compilerInstruction: "Protect story coherence. Maintain established facts and anti-retcon anchors. Track pending narrative consequences with urgency and trigger conditions. Log avoided moves with reason and scope. Track character agreements/terms. Detect continuity conflicts as risks.",
    injectionBehavior: "Injected as anchor:, pending:, and risk. entries. High priority for continuity safety.",
    renderBehavior: "Continuity tab — explainer, metrics bar, risk cards, facts/anchors/consequences/terms/avoid lists." },
  { key: "secretsRumors", label: "Secrets & Rumors", group: "World", core: false, intensity: "light",
    description: "Rumors, secrets, hints, and loaded signs/setups.",
    schemaSummary: "rumors[]{rumor, source, credibility, pct, color}, secrets[]{secret, visibleHint, knownBy[]}, loadedSigns[]{thing, plantedBy, payoffWhen, state, evidence, payoffHint, changed}",
    compilerInstruction: "Track rumors with credibility scores and sources. Secrets are reader-visible dramatic state. Loaded signs/setups track planted story elements with payoff conditions.",
    injectionBehavior: "Not injected by default. Low priority within budget.",
    renderBehavior: "World tab — rumors grid, secrets list, loaded signs with state badges." },
  { key: "actionResolver", label: "Action Resolver", group: "Tools", core: false, intensity: "medium",
    description: "Current action, world response, blockers, and risk.",
    schemaSummary: "userAction, worldResponse, risk, blockers[]",
    compilerInstruction: "Track the user's current action, its expected world response, risk assessment, and mechanical blockers.",
    injectionBehavior: "Injected as action: action; response; risk. Medium-high priority.",
    renderBehavior: "Overview tab — action card with response, risk, blocker chips." },
  { key: "dialogueState", label: "Dialogue State", group: "Tools", core: false, intensity: "experimental",
    description: "Open thread, masks, levers, and taboos.",
    schemaSummary: "openThread, socialMask, levers[], taboos[]",
    compilerInstruction: "Track active dialogue threads, social masks characters are wearing, conversational levers, and established taboos.",
    injectionBehavior: "Experimental — not injected by default.",
    renderBehavior: "Overview tab — dialogue card (only when enabled)." },
  { key: "directorStyle", label: "Director Style", group: "Tools", core: false, intensity: "experimental",
    description: "Optional scene direction and voice cues.",
    schemaSummary: "primary, mask, push, voiceCues[]",
    compilerInstruction: "Track optional director-style scene framing, narrative mask, push direction, and voice cues for the writer.",
    injectionBehavior: "Experimental — not injected by default.",
    renderBehavior: "Overview tab — director card (only when enabled)." },
  { key: "closenessState", label: "Closeness State", group: "Tools", core: false, intensity: "experimental",
    description: "Non-explicit emotional and physical closeness.",
    schemaSummary: "emotional, physical, consentSignals[], boundaries[]",
    compilerInstruction: "Track non-explicit emotional and physical closeness between characters. Always PG. Focus on consent signals and established boundaries.",
    injectionBehavior: "Experimental — not injected by default.",
    renderBehavior: "Overview tab — closeness card (only when enabled)." },
  { key: "imagePrompt", label: "Image Prompt", group: "Tools", core: false, intensity: "experimental",
    description: "Optional compact visual prompt assembly.",
    schemaSummary: "aspect, shot, medium, subject, positive, negative, full, hint",
    compilerInstruction: "Assemble a compact text-to-image prompt from the current scene if visually distinctive. Aspect, shot type, medium, subject, and style cues.",
    injectionBehavior: "Not injected by default. Consumes significant budget if enabled.",
    renderBehavior: "Overview tab — image prompt card with shot/medium, subject, hint." },
  { key: "auditLog", label: "Audit Log", group: "System", core: false, intensity: "light",
    description: "Compact compiler and repair diagnostics.",
    schemaSummary: "system, marker, result, repaired, notes",
    compilerInstruction: "Log each compiler run: system name, identity marker, validation result, repair flag, and notes. Minimum verbosity.",
    injectionBehavior: "Not injected.",
    renderBehavior: "Continuity tab — audit log list." },
];

function control(track: boolean, display = track, inject = false): ModuleControl {
  return { track, display, inject };
}

export const BALANCED_MODULE_SETTINGS: Record<ModuleKey, ModuleControl> = {
  sceneKernel: control(true, true, true),
  deltas: control(true, true, true),
  meters: control(true, true, false),
  castCore: control(true, true, true),
  castVisuals: control(true, true, false),
  clothing: control(true, true, false),
  relationships: control(true, true, true),
  inventory: control(true, true, true),
  worldSpace: control(true, true, true),
  storyThreads: control(true, true, true),
  continuity: control(true, true, true),
  secretsRumors: control(true, true, false),
  actionResolver: control(true, true, true),
  dialogueState: control(false, false, false),
  directorStyle: control(false, false, false),
  closenessState: control(false, false, false),
  imagePrompt: control(false, false, false),
  auditLog: control(true, true, false),
};

function cloneControls(
  source: Record<ModuleKey, ModuleControl>,
): Record<ModuleKey, ModuleControl> {
  return Object.fromEntries(
    MODULE_KEYS.map((key) => [key, { ...source[key] }]),
  ) as Record<ModuleKey, ModuleControl>;
}

export function moduleSettingsForPreset(
  preset: Exclude<ModulePreset, "custom">,
): Record<ModuleKey, ModuleControl> {
  const next = cloneControls(BALANCED_MODULE_SETTINGS);
  if (preset === "balanced") return next;

  if (preset === "lite") {
    for (const key of MODULE_KEYS) {
      const isCore = CORE_TRACKING_MODULES.has(key);
      next[key] = control(isCore, isCore, isCore);
    }
    next.actionResolver = control(true, true, true);
    return next;
  }

  for (const key of MODULE_KEYS) {
    const experimental = [
      "dialogueState",
      "directorStyle",
      "closenessState",
      "imagePrompt",
    ].includes(key);
    const track = preset === "experimental" || !experimental;
    next[key] = control(track, track, track && key !== "auditLog");
  }
  return next;
}

export function normalizeModuleSettings(
  input: Partial<Record<ModuleKey, Partial<ModuleControl>>> | undefined,
): Record<ModuleKey, ModuleControl> {
  const next = cloneControls(BALANCED_MODULE_SETTINGS);
  for (const key of MODULE_KEYS) {
    const candidate = input?.[key];
    if (candidate) {
      next[key] = {
        track: typeof candidate.track === "boolean" ? candidate.track : next[key].track,
        display: typeof candidate.display === "boolean" ? candidate.display : next[key].display,
        inject: typeof candidate.inject === "boolean" ? candidate.inject : next[key].inject,
      };
    }
    if (CORE_TRACKING_MODULES.has(key)) {
      next[key].track = true;
    }
  }
  return next;
}

export interface StockModuleOverride {
  label?: string;
  description?: string;
  group?: string;
  icon?: string;
  displayOrder?: number;
  intensityLabel?: string;
  defaultDisplay?: boolean;
  defaultInject?: boolean;
  compilerGuidanceAddendum?: string;
  injectionPriority?: number;
  renderHint?: string;
  hiddenFromSettings?: boolean;
}

export type StockModuleOverrides = Partial<Record<ModuleKey, StockModuleOverride>>;

export const MODULE_SCHEMA_STRUCTURES: Record<ModuleKey, string> = {
  sceneKernel: "kernel.scene, kernel.location, kernel.timeframe, kernel.date, kernel.time, kernel.elapsed, kernel.weather, kernel.pov, kernel.tone, kernel.topic, kernel.theme, kernel.objective, kernel.summary, kernel.currentFocus, kernel.nextFocus, kernel.currentRisk, kernel.stopMode, kernel.stopWhy, kernel.constraints[]",
  deltas: "delta.headline, delta.changedModules[], delta.changes[{text, age, module, importance}], delta.carriedForward[], delta.newlyEstablished[]",
  meters: "meters[{id(tension|danger|socialHeat|coherence|hiddenInfo|omen), label, value 0-100, pct, band, color, trend(down|steady|up|unknown), note}]",
  castCore: "castMatrix[{id, name, kind(pov|main|npc|crowd|background), qty, role, location, status, awareness(none|ambient|watching|alerted|hostile), threat{value 0-10, pct, band, color, note}, spotlight{value 0-100, pct, band, color, trend, note}, appearance{}, clothing{}, currentState{}, goals[], stableFacts[], pockets[], relationships[], leverage[], changed, changeNote, continuity{}}]",
  castVisuals: "castMatrix[].currentState{pose, proximity, leftHand, rightHand, emotion, intent, physicalTell, injury}, castMatrix[].spotlight, castMatrix[].visualAnchor",
  clothing: "castMatrix[].clothing{summary, silhouette, palette, fabric, fit, condition, notable, layerCount, layers[{slot(outer|upper|lower|feet|accessory|other), text, state, color}]}",
  relationships: "castMatrix[].relSummary, castMatrix[].relationships[{target, axis, value -100..100, pct, label, color, trend, evidence}]",
  inventory: "castMatrix[].pockets[{name, type(consumable|concealed|tool|key|evidence|misc), qty, condition, known, color, changed, changeNote}]",
  worldSpace: "scene{privacy, observerCount, observerPressure{}, crowdNoise, crowdFlow, light{primary, secondary, quality, color}, spatial[], access{exit, lineOfSight, noiseMask, items[], people[]}, carryover{body[], room[], social[]}, items[{name, owner, location, condition, lastTouch, importance}]}",
  storyThreads: "storyState{goals[{who, goal, status(ACTIVE|BLOCKED|PROGRESSED|RESOLVED), note}], conflicts[{a, b, label, severity 1-3}], threadLoom[{title, status, urgency 0-5, priority, progress 0-10, pct, color, label, summary, nextPressure, participants[]}], stakes[{who, win, lose}], countdowns[{title, left, unit, pct, color}], spotlightQueue[{name, turnsSince, pct, color, need, reason}], autonomyQueue[{who, action, unlessInterruptedBy}]}",
  continuity: "continuityFirewall{establishedFacts[], antiRetconAnchors[], pendingConsequences[{cause, pending, trigger, urgency 0-10, pct, status(PENDING|ACTIVE|FIRED|RESOLVED|DORMANT), evidence, changed, changeNote}], offscreenState[], bannedNext[{text, reason, scope(turn|scene|persistent), color, source(user|system|compiler)}], impossibleNext[], risks[{severity, issue, evidence, recommendation}], terms[{party, term, risk, status, binding, evidence, changed}]}",
  secretsRumors: "worldState.rumors[{rumor, source, credibility 0-10, pct, color}], worldState.secrets[{secret, visibleHint, knownBy[]}], worldState.loadedSigns[{thing, plantedBy, payoffWhen, state(LOADED|HEATING|FIRED|DORMANT), evidence, payoffHint, changed}]",
  actionResolver: "tools.actionResolver{userAction, worldResponse, risk, blockers[]}",
  dialogueState: "tools.dialogueState{openThread, socialMask, levers[], taboos[]}",
  directorStyle: "tools.directorStyle{primary, mask, push, voiceCues[]}",
  closenessState: "tools.closenessState{emotional, physical, consentSignals[], boundaries[]}",
  imagePrompt: "tools.imagePrompt{aspect, shot, medium, subject, positive, negative, full, hint}",
  auditLog: "auditLog[{system, marker, result, repaired, notes}]",
};

export function trackedModuleKeys(
  settings: { moduleSettings: Record<ModuleKey, ModuleControl> },
): ModuleKey[] {
  return MODULE_KEYS.filter((key) => settings.moduleSettings[key].track);
}
