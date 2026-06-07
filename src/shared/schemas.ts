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

export const ModulePresetSchema = z.string();

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

const PresetModuleSettingsSchema = z.preprocess(
  (value) => normalizeModuleSettings(
    typeof value === "object" && value !== null
      ? value as Partial<Record<typeof MODULE_KEYS[number], Partial<z.infer<typeof ModuleControlSchema>>>>
      : undefined,
  ),
  ModuleSettingsSchema,
);

export const CustomModulePresetSchema = z.object({
  id: z.string().min(1).max(160),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(500).default(""),
  createdAt: z.string().datetime().default(() => new Date().toISOString()),
  updatedAt: z.string().datetime().default(() => new Date().toISOString()),
  moduleSettings: PresetModuleSettingsSchema,
}).strict();

export const CustomModuleFieldTypeSchema = z.enum([
  "text",
  "longText",
  "number",
  "boolean",
  "enum",
  "gauge",
  "chips",
  "list",
]);

export const CustomModuleFieldSchema = z.object({
  id: z.string().min(1).max(160),
  label: z.string().trim().min(1).max(160),
  key: z.string().trim().regex(/^[A-Za-z][A-Za-z0-9_]*$/).max(80),
  type: CustomModuleFieldTypeSchema,
  required: z.boolean().default(false),
  description: z.string().trim().max(500).default(""),
  defaultValue: z.unknown().optional(),
  enumOptions: z.array(z.string().trim().min(1).max(160)).max(30).default([]),
  maxItems: z.number().int().min(1).max(50).optional(),
  min: z.number().finite().optional(),
  max: z.number().finite().optional(),
  displayHint: z.string().trim().max(160).optional(),
}).strict().superRefine((field, context) => {
  if (field.type === "enum" && field.enumOptions.length === 0) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["enumOptions"],
      message: "Enum fields require at least one option.",
    });
  }
  if (field.min !== undefined && field.max !== undefined && field.min > field.max) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["min"],
      message: "Minimum cannot exceed maximum.",
    });
  }
});

export const CustomModuleSchema = z.object({
  id: z.string().min(1).max(160),
  label: z.string().trim().min(1).max(160),
  group: z.string().trim().min(1).max(160).default("Custom"),
  description: z.string().trim().max(500).default(""),
  enabled: z.boolean().default(true),
  display: z.boolean().default(true),
  inject: z.boolean().default(true),
  compilerInstruction: z.string().trim().max(1600),
  outputMode: z.enum(["cards", "bullets", "chips", "gauge", "template"]).default("cards"),
  maxItems: z.number().int().min(1).max(24).default(6),
  intensity: z.enum(["light", "medium", "heavy", "experimental"]).default("medium"),
  displayOrder: z.number().int().optional(),
  schemaFields: z.array(CustomModuleFieldSchema).max(40).default([]),
  htmlTemplate: z.string().max(8000).default(""),
  cssTemplate: z.string().max(8000).default(""),
  templateEngine: z.enum(["mustache-lite", "token-replace"]).default("mustache-lite"),
  allowHtmlTemplate: z.boolean().default(false),
}).strict();

export const StateIdentitySchema = z.object({
  chatId: z.string().min(1).max(300),
  messageId: z.string().min(1).max(300),
  swipeId: z.number().int().nonnegative(),
}).strict();

export const StateHistoryItemSchema = z.object({
  identity: StateIdentitySchema,
  generatedAt: z.string(),
  schemaVersion: z.number().int(),
  kernelScene: z.string(),
  kernelFocus: z.string(),
  kernelLocation: z.string(),
  kernelTime: z.string(),
  deltaHeadline: z.string(),
  castCount: z.number().int(),
  threadCount: z.number().int(),
  riskCount: z.number().int(),
  repaired: z.boolean(),
  seedIdentity: StateIdentitySchema.nullable(),
  activeModuleCount: z.number().int(),
}).strict();

const RawSettingsSchema = z.object({
  schemaVersion: z.literal(2).default(2),
  skin: LoomOSSkinSchema.default("auto"),
  autoGeneration: AutoGenerationModeSchema.default("manual"),
  injectionEnabled: z.boolean().default(false),
  showInjectionPreview: z.boolean().default(false),
  injectionTokenBudget: z.number().int().min(80).max(10000).default(320),
  compilerSeedTokenBudget: z.number().int().min(200).max(10000).default(900),
  recentMessageLimit: z.number().int().min(4).max(80).default(24),
  generationTimeoutSeconds: z.number().int().min(30).max(300).default(180),
  connectionId: z.string().trim().max(200).default(""),
  modulePreset: ModulePresetSchema.default("balanced"),
  moduleSettings: ModuleSettingsSchema.default(BALANCED_MODULE_SETTINGS),
  stockModuleOverrides: z.record(
    z.string(),
    z.object({
      label: z.string().max(160).optional(),
      description: z.string().max(500).optional(),
      group: z.string().max(160).optional(),
      icon: z.string().max(20).optional(),
      displayOrder: z.number().int().optional(),
      intensityLabel: z.string().max(40).optional(),
      defaultDisplay: z.boolean().optional(),
      defaultInject: z.boolean().optional(),
      compilerGuidanceAddendum: z.string().max(1000).optional(),
      compilerInstructionOverride: z.string().max(6000).optional(),
      schemaSummaryOverride: z.string().max(6000).optional(),
      injectionPriority: z.number().int().optional(),
      renderHint: z.string().max(200).optional(),
      hiddenFromSettings: z.boolean().optional(),
    }).strict(),
  ).default({}),
  customModulePresets: z.array(CustomModulePresetSchema).default([]),
  customModules: z.array(CustomModuleSchema).default([]),
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
    showInjectionPreview: source.showInjectionPreview,
    injectionTokenBudget: source.injectionTokenBudget,
    compilerSeedTokenBudget: source.compilerSeedTokenBudget,
    recentMessageLimit: source.recentMessageLimit,
    generationTimeoutSeconds: source.generationTimeoutSeconds,
    connectionId: source.connectionId,
    modulePreset: source.modulePreset,
    moduleSettings,
    stockModuleOverrides: source.stockModuleOverrides,
    customModulePresets: source.customModulePresets,
    customModules: source.customModules,
  };
}

export const LoomOSSettingsSchema = z.preprocess(settingsInput, RawSettingsSchema);

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
  type: z.enum(["consumable", "concealed", "tool", "key", "evidence", "misc"]).default("misc"),
  qty: z.number().int().nonnegative().max(9999),
  condition: ShortText,
  known: z.boolean(),
  color: ColorText.optional(),
  changed: z.boolean().optional().default(false),
  changeNote: ShortText.optional(),
}).strict();

const LayerSchema = z.object({
  slot: z.enum(["outer", "upper", "lower", "feet", "accessory", "other"]),
  text: ShortText,
  state: ShortText.optional(),
  color: ColorText.optional(),
}).strict();

const RelationshipEntrySchema = z.object({
  target: TinyText,
  axis: ShortText,
  value: z.number().min(-100).max(100),
  pct: PercentText.optional(),
  label: TinyText.optional(),
  color: ColorText.optional(),
  trend: TrendSchema.optional(),
  evidence: MediumText.optional(),
}).strict();

const UncertaintyEntrySchema = z.object({
  claim: MediumText,
  confidence: z.number().min(0).max(10),
  label: z.enum(["UNKNOWN", "DOUBTFUL", "POSSIBLE", "LIKELY", "CONFIRMED"]).default("UNKNOWN"),
  handling: ShortText.optional(),
}).strict();

const AppearanceSchema = z.object({
  species: ShortText.optional(),
  ageBand: ShortText.optional(),
  apparentAge: ShortText.optional(),
  genderPresentation: ShortText.optional(),
  height: ShortText.optional(),
  weight: ShortText.optional(),
  build: ShortText.optional(),
  bodyType: ShortText.optional(),
  frame: ShortText.optional(),
  proportions: MediumText.optional(),
  silhouette: ShortText.optional(),
  bodyComposition: ShortText.optional(),
  shoulders: ShortText.optional(),
  chest: ShortText.optional(),
  bust: ShortText.optional(),
  waist: ShortText.optional(),
  hips: ShortText.optional(),
  arms: ShortText.optional(),
  legs: ShortText.optional(),
  hands: ShortText.optional(),
  skin: ShortText.optional(),
  complexion: ShortText.optional(),
  face: ShortText.optional(),
  facialStructure: ShortText.optional(),
  hair: ShortText.optional(),
  eyes: ShortText.optional(),
  eyebrows: ShortText.optional(),
  nose: ShortText.optional(),
  lips: ShortText.optional(),
  ears: ShortText.optional(),
  facialHair: ShortText.optional(),
  voice: ShortText.optional(),
  movement: ShortText.optional(),
  posture: ShortText.optional(),
  distinguishingMarks: MediumText.optional(),
  scars: MediumText.optional(),
  tattoos: MediumText.optional(),
  piercings: MediumText.optional(),
  birthmarks: MediumText.optional(),
  uniqueFeatures: MediumText.optional(),
  immutableTraits: z.array(ShortText).max(16).optional().default([]),
  presence: ShortText.optional(),
  fullDescription: MediumText.optional(),
  anchor: MediumText.optional(),
}).strict();

const ClothingSchema = z.object({
  summary: ShortText.optional(),
  silhouette: ShortText.optional(),
  palette: ShortText.optional(),
  fabric: ShortText.optional(),
  fit: ShortText.optional(),
  condition: ShortText.optional(),
  notable: ShortText.optional(),
  layerCount: z.number().int().min(0).max(5).optional().default(0),
  layers: z.array(LayerSchema).max(5).optional().default([]),
}).strict();

const CurrentStateSchema = z.object({
  injury: ShortText.optional(),
  pose: ShortText.optional(),
  proximity: ShortText.optional(),
  leftHand: ShortText.optional(),
  rightHand: ShortText.optional(),
  emotion: ShortText.optional(),
  intent: MediumText.optional(),
  physicalTell: ShortText.optional(),
  socialPosition: ShortText.optional(),
}).strict();

const CastContinuitySchema = z.object({
  lastConfirmed: ShortText.optional(),
  sourceHint: ShortText.optional(),
  uncertainty: z.array(UncertaintyEntrySchema).max(4).optional().default([]),
}).strict();

export const CastMemberSchema = z.object({
  id: z.string().trim().min(1).max(160),
  name: z.string().trim().min(1).max(160),
  kind: z.enum(["pov", "main", "npc", "crowd", "background"]),
  qty: z.number().int().positive().max(10000),
  role: ShortText,
  location: ShortText,
  status: ShortText,
  awareness: z.enum(["none", "ambient", "watching", "alerted", "hostile"]),
  threat: GaugeSchema.omit({ value: true, trend: true }).extend({
    value: z.number().min(0).max(10),
  }).strict(),
  spotlight: GaugeSchema,
  changed: z.boolean().optional().default(false),
  changeNote: ShortText.optional(),
  
  appearance: AppearanceSchema.optional().default({}),
  clothing: ClothingSchema.optional().default({}),
  currentState: CurrentStateSchema.optional().default({}),
  
  emotionalState: ShortText.optional().default(""),
  intent: MediumText.optional().default(""),
  pose: ShortText.optional().default(""),
  proximity: ShortText.optional().default(""),
  hands: ShortText.optional().default(""),
  visualAnchor: MediumText.optional().default(""),
  identitySummary: MediumText.optional().default(""),
  clothingSummary: MediumText.optional().default(""),

  relSummary: ShortText.optional(),
  relationships: z.array(RelationshipEntrySchema).max(6).optional().default([]),
  leverage: z.array(ShortText).max(6).optional().default([]),

  pockets: z.array(PocketItemSchema).max(6).optional().default([]),

  goals: z.array(ShortText).max(6).optional().default([]),
  stableFacts: z.array(ShortText).max(8).optional().default([]),
  continuity: CastContinuitySchema.optional().default({}),
}).strict();

const SetupEntrySchema = z.object({
  thing: ShortText,
  plantedBy: ShortText.optional(),
  payoffWhen: MediumText.optional(),
  state: z.enum(["LOADED", "HEATING", "FIRED", "DORMANT"]).default("LOADED"),
  evidence: MediumText.optional(),
  payoffHint: ShortText.optional(),
  changed: z.boolean().optional().default(false),
  changeNote: ShortText.optional(),
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
  loadedSigns: z.array(SetupEntrySchema).max(8).optional().default([]),
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

const SpotlightQueueEntrySchema = z.object({
  name: TinyText,
  turnsSince: z.number().int().nonnegative().default(0),
  pct: PercentText.optional(),
  color: ColorText.optional(),
  need: z.enum(["active", "soon", "okay", "quiet", "background"]).default("okay"),
  reason: ShortText.optional(),
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
  spotlightQueue: z.array(SpotlightQueueEntrySchema).max(12).optional().default([]),
}).strict();

export const ContinuityRiskSchema = z.object({
  severity: z.enum(["low", "medium", "high", "critical"]),
  issue: MediumText,
  evidence: MediumText,
  recommendation: MediumText,
}).strict();

const AvoidNextSchema = z.object({
  text: MediumText,
  reason: ShortText.optional(),
  scope: z.enum(["turn", "scene", "persistent"]).default("turn"),
  color: ColorText.optional(),
  source: z.enum(["user", "system", "compiler"]).default("compiler"),
}).strict();

const ConsequenceEntrySchema = z.object({
  cause: ShortText,
  pending: MediumText,
  trigger: ShortText.optional(),
  urgency: z.number().min(0).max(10).default(5),
  pct: PercentText.optional(),
  status: z.enum(["PENDING", "ACTIVE", "FIRED", "RESOLVED", "DORMANT"]).default("PENDING"),
  evidence: MediumText.optional(),
  changed: z.boolean().optional().default(false),
  changeNote: ShortText.optional(),
}).strict();

const TermEntrySchema = z.object({
  party: TinyText,
  term: MediumText,
  risk: ShortText.optional(),
  status: z.enum(["PENDING", "ACCEPTED", "REJECTED", "BROKEN", "EXPIRED", "UNKNOWN"]).default("UNKNOWN"),
  binding: z.boolean().optional().default(false),
  evidence: MediumText.optional(),
  changed: z.boolean().optional().default(false),
  changeNote: ShortText.optional(),
}).strict();

export const ContinuityFirewallSchema = z.object({
  establishedFacts: z.array(MediumText).max(40),
  antiRetconAnchors: z.array(MediumText).max(30),
  pendingConsequences: z.array(ConsequenceEntrySchema).max(30).optional().default([]),
  offscreenState: z.array(MediumText).max(24),
  bannedNext: z.array(AvoidNextSchema).max(12).optional().default([]),
  impossibleNext: z.array(MediumText).max(12),
  risks: z.array(ContinuityRiskSchema).max(24),
  terms: z.array(TermEntrySchema).max(10).optional().default([]),
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

export const CustomModuleItemSchema = z.object({
  title: ShortText,
  text: MediumText,
  importance: z.enum(["low", "medium", "high", "critical"]),
  color: ColorText.optional(),
  changed: z.boolean().optional().default(false),
  changeNote: ShortText.optional(),
}).strict();

export const CustomModuleDataSchema = z.object({
  moduleId: z.string().min(1).max(160),
  label: ShortText,
  summary: MediumText.default(""),
  fields: z.record(z.unknown()).default({}),
  items: z.array(CustomModuleItemSchema).max(24).default([]),
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
  customModuleData: z.array(CustomModuleDataSchema).default([]),
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
