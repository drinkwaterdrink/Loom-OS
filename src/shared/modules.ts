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

export const MODULE_CATALOG: ReadonlyArray<{
  key: ModuleKey;
  label: string;
  group: string;
  description: string;
}> = [
  { key: "sceneKernel", label: "Scene Kernel", group: "Core", description: "Scene, time, tone, focus, objective, and constraints." },
  { key: "deltas", label: "Turn Deltas", group: "Core", description: "Meaningful changes from the previous compiled state." },
  { key: "meters", label: "Diagnostic Meters", group: "Scene", description: "Tension, danger, coherence, hidden information, and omen." },
  { key: "castCore", label: "Cast Core", group: "Cast", description: "Presence, intent, status, awareness, goals, and anchors." },
  { key: "castVisuals", label: "Cast Visuals", group: "Cast", description: "Pose, proximity, hands, visual anchor, and spotlight." },
  { key: "clothing", label: "Clothing", group: "Cast", description: "Compact grounded clothing continuity." },
  { key: "relationships", label: "Relationships", group: "Cast", description: "Relationship state, leverage, and social pressure." },
  { key: "inventory", label: "Inventory", group: "World", description: "Pockets, ownership, condition, and important room items." },
  { key: "worldSpace", label: "World & Space", group: "World", description: "Privacy, observers, light, blocking, exits, and hazards." },
  { key: "storyThreads", label: "Story Threads", group: "Story", description: "Goals, conflicts, threads, stakes, countdowns, and autonomy." },
  { key: "continuity", label: "Continuity Firewall", group: "Story", description: "Facts, anchors, consequences, impossible moves, and risks." },
  { key: "secretsRumors", label: "Secrets & Rumors", group: "World", description: "Rumors, secrets, hints, and loaded signs." },
  { key: "actionResolver", label: "Action Resolver", group: "Tools", description: "Current action, world response, blockers, and risk." },
  { key: "dialogueState", label: "Dialogue State", group: "Tools", description: "Open thread, masks, levers, and taboos." },
  { key: "directorStyle", label: "Director Style", group: "Tools", description: "Optional scene direction and voice cues." },
  { key: "closenessState", label: "Closeness State", group: "Tools", description: "Non-explicit emotional and physical closeness." },
  { key: "imagePrompt", label: "Image Prompt", group: "Tools", description: "Optional compact visual prompt assembly." },
  { key: "auditLog", label: "Audit Log", group: "System", description: "Compact compiler and repair diagnostics." },
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

export function trackedModuleKeys(
  settings: { moduleSettings: Record<ModuleKey, ModuleControl> },
): ModuleKey[] {
  return MODULE_KEYS.filter((key) => settings.moduleSettings[key].track);
}
