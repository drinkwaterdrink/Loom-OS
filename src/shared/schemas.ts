import { z } from "zod";
import {
  BALANCED_MODULE_SETTINGS,
  CORE_TRACKING_MODULES,
  MODULE_KEYS,
  normalizeModuleSettings,
} from "./modules";

export const LoomOSSkinSchema = z.enum([
  "auto",
  "dark_academia",
  "cyberpunk",
  "fantasy",
  "horror",
  "noir",
  "minimal",
]);

export const AutoGenerationModeSchema = z.enum([
  "off",
  "assistant",
  "every",
  "manual",
]);

export const ModulePresetSchema = z.enum([
  "lite",
  "balanced",
  "full",
  "experimental",
  "custom",
]);

export const ModuleKeySchema = z.enum(MODULE_KEYS);
export const ModuleControlSchema = z.object({
  track: z.boolean(),
  display: z.boolean(),
  inject: z.boolean(),
}).strict();

const ModuleSettingsSchema = z.object(
  Object.fromEntries(
    MODULE_KEYS.map((key) => [key, ModuleControlSchema]),
  ) as Record<typeof MODULE_KEYS[number], typeof ModuleControlSchema>,
).strict();

const RawSettingsSchema = z.object({
  schemaVersion: z.literal(2).default(2),
  skin: LoomOSSkinSchema.default("auto"),
  autoGeneration: AutoGenerationModeSchema.default("manual"),
  injectionEnabled: z.boolean().default(false),
  injectionTokenBudget: z.number().int().min(80).max(1600).default(320),
  compilerSeedTokenBudget: z.number().int().min(200).max(2400).default(900),
  recentMessageLimit: z.number().int().min(4).max(80).default(24),
  generationTimeoutSeconds: z.number().int().min(30).max(300).default(180),
  connectionId: z.string().trim().max(200).default(""),
  modulePreset: ModulePresetSchema.default("balanced"),
  moduleSettings: ModuleSettingsSchema.default(BALANCED_MODULE_SETTINGS),
}).strict();

function settingsInput(value: unknown): unknown {
  if (typeof value !== "object" || value === null) return value;
  const source = value as Record<string, unknown>;
  const legacyPanels = typeof source.panels === "object" && source.panels !== null
    ? source.panels as Record<string, unknown>
    : {};
  const suppliedModules = typeof source.moduleSettings === "object"
    && source.moduleSettings !== null
    ? source.moduleSettings as Partial<Record<typeof MODULE_KEYS[number], Record<string, unknown>>>
    : undefined;
  const moduleSettings = normalizeModuleSettings(suppliedModules);

  const panelMap = {
    kernel: "sceneKernel",
    castMatrix: "castCore",
    threadLoom: "storyThreads",
    continuityFirewall: "continuity",
  } as const;
  for (const [oldKey, newKey] of Object.entries(panelMap)) {
    if (typeof legacyPanels[oldKey] === "boolean" && !suppliedModules?.[newKey]) {
      moduleSettings[newKey].display = legacyPanels[oldKey] as boolean;
    }
  }

  for (const key of CORE_TRACKING_MODULES) {
    moduleSettings[key].track = true;
  }

  return {
    schemaVersion: 2,
    skin: source.skin,
    autoGeneration: source.autoGeneration,
    injectionEnabled: source.injectionEnabled,
    injectionTokenBudget: source.injectionTokenBudget,
    compilerSeedTokenBudget: source.compilerSeedTokenBudget,
    recentMessageLimit: source.recentMessageLimit,
    generationTimeoutSeconds: source.generationTimeoutSeconds,
    connectionId: source.connectionId,
    modulePreset: source.modulePreset,
    moduleSettings,
  };
}

export const LoomOSSettingsSchema = z.preprocess(settingsInput, RawSettingsSchema);

export const StateIdentitySchema = z.object({
  chatId: z.string().min(1).max(300),
  messageId: z.string().min(1).max(300),
  swipeId: z.number().int().nonnegative(),
}).strict();

const ShortText = z.string().trim().max(500);
const MediumText = z.string().trim().max(1600);
const TinyText = z.string().trim().max(160);
const PercentText = z.string().trim().max(12);
const ColorText = z.string().trim().max(40);
const TrendSchema = z.enum(["down", "steady", "up", "unknown"]);

const GaugeSchema = z.object({
  value: z.number().min(0).max(100),
  pct: PercentText,
  band: TinyText,
  color: ColorText,
  trend: TrendSchema,
  note: ShortText,
}).strict();

export const KernelSchema = z.object({
  scene: ShortText,
  location: ShortText,
  timeframe: ShortText,
  date: ShortText,
  time: ShortText,
  elapsed: ShortText,
  weather: ShortText,
  pov: ShortText,
  tone: ShortText,
  topic: ShortText,
  theme: ShortText,
  objective: MediumText,
  summary: MediumText,
  currentFocus: MediumText,
  nextFocus: MediumText,
  currentRisk: MediumText,
  stopMode: ShortText,
  stopWhy: MediumText,
  constraints: z.array(ShortText).max(12),
}).strict();

export const DeltaSchema = z.object({
  headline: MediumText,
  changedModules: z.array(ModuleKeySchema).max(MODULE_KEYS.length),
  changes: z.array(z.object({
    text: MediumText,
    age: ShortText,
    module: ModuleKeySchema,
    importance: z.enum(["low", "medium", "high", "critical"]),
  }).strict()).max(6),
  carriedForward: z.array(MediumText).max(6),
  newlyEstablished: z.array(MediumText).max(6),
}).strict();

export const MeterSchema = GaugeSchema.extend({
  id: z.enum(["tension", "danger", "socialHeat", "coherence", "hiddenInfo", "omen"]),
  label: TinyText,
}).strict();

const SceneItemSchema = z.object({
  name: TinyText,
  owner: TinyText,
  location: ShortText,
  condition: ShortText,
  lastTouch: ShortText,
  importance: z.enum(["low", "medium", "high", "critical"]),
}).strict();

export const SceneSchema = z.object({
  privacy: z.enum(["private", "semi-private", "public", "exposed"]),
  observerCount: z.number().int().nonnegative().max(10000),
  observerPressure: GaugeSchema.omit({ value: true }).extend({
    value: z.number().min(0).max(10),
  }).strict(),
  crowdNoise: ShortText,
  crowdFlow: ShortText,
  light: z.object({
    primary: ShortText,
    secondary: ShortText,
    quality: ShortText,
    color: ColorText,
  }).strict(),
  spatial: z.array(MediumText).max(8),
  access: z.object({
    exit: z.enum(["FREE", "WATCHED", "BLOCKED"]),
    lineOfSight: ShortText,
    noiseMask: ShortText,
    items: z.array(ShortText).max(5),
    people: z.array(ShortText).max(5),
  }).strict(),
  carryover: z.object({
    body: z.array(ShortText).max(5),
    room: z.array(ShortText).max(5),
    social: z.array(ShortText).max(5),
  }).strict(),
  items: z.array(SceneItemSchema).max(10),
}).strict();

const PocketItemSchema = z.object({
  name: TinyText,
  type: TinyText,
  qty: z.number().int().nonnegative().max(9999),
  condition: ShortText,
  known: z.boolean(),
}).strict();

export const CastMemberSchema = z.object({
  id: z.string().trim().min(1).max(160),
  name: z.string().trim().min(1).max(160),
  kind: z.enum(["pov", "main", "npc", "crowd", "background"]),
  qty: z.number().int().positive().max(10000),
  role: ShortText,
  location: ShortText,
  status: ShortText,
  emotionalState: ShortText,
  intent: MediumText,
  pose: ShortText,
  proximity: ShortText,
  hands: ShortText,
  awareness: z.enum(["none", "ambient", "watching", "alerted", "hostile"]),
  threat: GaugeSchema.omit({ value: true, trend: true }).extend({
    value: z.number().min(0).max(10),
  }).strict(),
  spotlight: GaugeSchema,
  visualAnchor: MediumText,
  identitySummary: MediumText,
  clothingSummary: MediumText,
  goals: z.array(ShortText).max(6),
  relationships: z.array(ShortText).max(8),
  leverage: z.array(ShortText).max(6),
  pockets: z.array(PocketItemSchema).max(6),
  stableFacts: z.array(ShortText).max(6),
}).strict();

export const WorldStateSchema = z.object({
  recentEnvironmentalChanges: z.array(MediumText).max(6),
  activeHazards: z.array(MediumText).max(6),
  rumors: z.array(z.object({
    rumor: MediumText,
    source: ShortText,
    credibility: z.number().min(0).max(10),
    pct: PercentText,
    color: ColorText,
  }).strict()).max(8),
  secrets: z.array(z.object({
    secret: MediumText,
    visibleHint: MediumText,
    knownBy: z.array(TinyText).max(6),
  }).strict()).max(8),
  loadedSigns: z.array(z.object({
    thing: ShortText,
    loadedBy: MediumText,
    firesWhen: MediumText,
    state: z.enum(["LOADED", "HEATING", "FIRED", "DORMANT"]),
  }).strict()).max(8),
}).strict();

export const StoryThreadSchema = z.object({
  title: z.string().trim().min(1).max(240),
  status: z.enum(["dormant", "active", "escalating", "blocked", "resolved"]),
  urgency: z.number().int().min(0).max(5),
  priority: z.enum(["low", "medium", "high", "critical"]),
  progress: z.number().min(0).max(10),
  pct: PercentText,
  color: ColorText,
  label: TinyText,
  summary: MediumText,
  nextPressure: MediumText,
  participants: z.array(TinyText).max(12),
}).strict();

export const StoryStateSchema = z.object({
  goals: z.array(z.object({
    who: TinyText,
    goal: MediumText,
    status: z.enum(["ACTIVE", "BLOCKED", "PROGRESSED", "RESOLVED"]),
    note: MediumText,
  }).strict()).max(10),
  conflicts: z.array(z.object({
    a: TinyText,
    b: TinyText,
    label: ShortText,
    severity: z.number().int().min(1).max(3),
  }).strict()).max(8),
  threadLoom: z.array(StoryThreadSchema).max(24),
  stakes: z.array(z.object({
    who: TinyText,
    win: MediumText,
    lose: MediumText,
  }).strict()).max(8),
  countdowns: z.array(z.object({
    title: ShortText,
    left: z.number().nonnegative(),
    unit: TinyText,
    pct: PercentText,
    color: ColorText,
  }).strict()).max(8),
  autonomyQueue: z.array(z.object({
    who: TinyText,
    action: MediumText,
    unlessInterruptedBy: MediumText,
  }).strict()).max(8),
}).strict();

export const ContinuityRiskSchema = z.object({
  severity: z.enum(["low", "medium", "high", "critical"]),
  issue: MediumText,
  evidence: MediumText,
  recommendation: MediumText,
}).strict();

export const ContinuityFirewallSchema = z.object({
  establishedFacts: z.array(MediumText).max(40),
  antiRetconAnchors: z.array(MediumText).max(30),
  pendingConsequences: z.array(MediumText).max(30),
  offscreenState: z.array(MediumText).max(24),
  bannedNext: z.array(z.object({
    text: MediumText,
    persistent: z.boolean(),
  }).strict()).max(12),
  impossibleNext: z.array(MediumText).max(12),
  risks: z.array(ContinuityRiskSchema).max(24),
}).strict();

export const ToolsSchema = z.object({
  actionResolver: z.object({
    userAction: MediumText,
    worldResponse: MediumText,
    risk: MediumText,
    blockers: z.array(ShortText).max(6),
  }).strict().nullable(),
  dialogueState: z.object({
    openThread: MediumText,
    socialMask: MediumText,
    levers: z.array(ShortText).max(6),
    taboos: z.array(ShortText).max(6),
  }).strict().nullable(),
  directorStyle: z.object({
    primary: ShortText,
    mask: ShortText,
    push: MediumText,
    voiceCues: z.array(ShortText).max(6),
  }).strict().nullable(),
  closenessState: z.object({
    emotional: ShortText,
    physical: ShortText,
    consentSignals: z.array(ShortText).max(6),
    boundaries: z.array(ShortText).max(6),
  }).strict().nullable(),
  imagePrompt: z.object({
    aspect: TinyText,
    shot: ShortText,
    medium: ShortText,
    subject: MediumText,
    positive: MediumText,
    negative: MediumText,
    full: z.string().trim().max(3000),
    hint: MediumText,
  }).strict().nullable(),
}).strict();

export const AuditEntrySchema = z.object({
  system: TinyText,
  marker: TinyText,
  result: ShortText,
  repaired: z.boolean(),
  notes: MediumText,
}).strict();

export const LoomOSCompiledStateSchema = z.object({
  activeModules: z.array(ModuleKeySchema).max(MODULE_KEYS.length),
  kernel: KernelSchema,
  delta: DeltaSchema,
  meters: z.array(MeterSchema).max(6).default([]),
  scene: SceneSchema.nullable().default(null),
  castMatrix: z.array(CastMemberSchema).max(24),
  worldState: WorldStateSchema.nullable().default(null),
  storyState: StoryStateSchema,
  continuityFirewall: ContinuityFirewallSchema,
  tools: ToolsSchema.default({
    actionResolver: null,
    dialogueState: null,
    directorStyle: null,
    closenessState: null,
    imagePrompt: null,
  }),
  auditLog: z.array(AuditEntrySchema).max(12).default([]),
}).strict();

export const LoomOSStateSchema = LoomOSCompiledStateSchema.extend({
  schemaVersion: z.literal(2),
  identity: StateIdentitySchema,
  generatedAt: z.string().datetime(),
  source: z.object({
    messageCount: z.number().int().nonnegative(),
    repaired: z.boolean(),
    seedIdentity: StateIdentitySchema.nullable(),
    connectionId: z.string().max(200),
  }).strict(),
}).strict();

export const LegacyLoomOSStateSchema = z.object({
  schemaVersion: z.literal(1),
  identity: StateIdentitySchema,
  generatedAt: z.string().datetime(),
  source: z.object({
    messageCount: z.number().int().nonnegative(),
    repaired: z.boolean(),
  }).strict(),
  kernel: z.object({
    scene: ShortText,
    location: ShortText,
    timeframe: ShortText,
    tone: ShortText,
    objective: MediumText,
    summary: MediumText,
    constraints: z.array(ShortText).max(12),
  }).strict(),
  castMatrix: z.array(z.object({
    name: z.string().trim().min(1).max(160),
    role: ShortText,
    status: ShortText,
    location: ShortText,
    emotionalState: ShortText,
    goals: z.array(ShortText).max(8),
    relationships: z.array(ShortText).max(10),
    leverage: z.array(ShortText).max(8),
  }).strict()).max(24),
  threadLoom: z.array(z.object({
    title: z.string().trim().min(1).max(240),
    status: z.enum(["dormant", "active", "escalating", "blocked", "resolved"]),
    urgency: z.number().int().min(0).max(5),
    summary: MediumText,
    nextPressure: MediumText,
    participants: z.array(TinyText).max(12),
  }).strict()).max(24),
  continuityFirewall: z.object({
    establishedFacts: z.array(MediumText).max(30),
    pendingConsequences: z.array(MediumText).max(24),
    secrets: z.array(MediumText).max(24),
    risks: z.array(ContinuityRiskSchema).max(24),
  }).strict(),
}).strict();

export const DEFAULT_SETTINGS = LoomOSSettingsSchema.parse({});
