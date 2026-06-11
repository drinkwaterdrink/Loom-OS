import {
  LoomOSCompiledStateSchema,
} from "./schemas";
import {
  MODULE_KEYS,
  type ModuleKey,
} from "./modules";
import type {
  CustomModule,
  CustomModuleField,
  LoomOSCompiledState,
  LoomOSState,
} from "./types";

type RecordValue = Record<string, unknown>;

export interface NormalizeCompiledStateOptions {
  enabledModules: ModuleKey[];
  customModules?: CustomModule[];
}

export interface NormalizationReport {
  normalized: boolean;
  changes: string[];
  issues: string[];
}

export class CompiledStateNormalizationError extends Error {
  readonly report: NormalizationReport;

  constructor(report: NormalizationReport) {
    super(report.issues.slice(0, 8).join("\n") || "Compiled state normalization failed.");
    this.name = "CompiledStateNormalizationError";
    this.report = report;
  }
}

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneJson(value: unknown): unknown {
  if (value === undefined) return {};
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return {};
  }
}

function asRecord(value: unknown): RecordValue {
  return isRecord(value) ? value : {};
}

function mark(changes: string[], path: string): void {
  if (!changes.includes(path)) changes.push(path);
}

function textFromValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (!isRecord(value)) return "";
  for (const key of [
    "goal",
    "text",
    "summary",
    "title",
    "name",
    "issue",
    "description",
    "secret",
    "rumor",
    "action",
    "target",
    "label",
    "note",
    "value",
  ]) {
    if (value[key] !== undefined) {
      const extracted = textFromValue(value[key]);
      if (extracted) return extracted;
    }
  }
  return "";
}

function text(value: unknown, max: number, fallback = ""): string {
  return (textFromValue(value) || fallback).replace(/\s+/g, " ").trim().slice(0, max);
}

function numberValue(value: unknown, min: number, max: number, fallback: number): number {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) return fallback;
  return Math.max(min, Math.min(max, numeric));
}

function integerValue(value: unknown, min: number, max: number, fallback: number): number {
  return Math.trunc(numberValue(value, min, max, fallback));
}

function booleanValue(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true" || value === 1) return true;
  if (value === "false" || value === 0) return false;
  return fallback;
}

function enumValue<T extends string>(
  value: unknown,
  allowed: readonly T[],
  fallback: T,
): T {
  return typeof value === "string" && allowed.includes(value as T)
    ? value as T
    : fallback;
}

function arrayValue(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === "") return [];
  return [value];
}

function stringArray(value: unknown, maxItems: number, maxLength: number): string[] {
  return arrayValue(value)
    .map((item) => text(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

export function defaultGauge(maxValue = 100): {
  value: number;
  pct: string;
  band: string;
  color: string;
  trend: "down" | "steady" | "up" | "unknown";
  note: string;
} {
  return {
    value: 0,
    pct: "0%",
    band: "unknown",
    color: "var(--loomos-muted)",
    trend: "unknown",
    note: "",
  };
}

function normalizeGauge(value: unknown, maxValue = 100) {
  const source = asRecord(value);
  const gauge = defaultGauge(maxValue);
  gauge.value = numberValue(source.value, 0, maxValue, 0);
  gauge.pct = text(source.pct, 12, `${Math.round((gauge.value / maxValue) * 100)}%`);
  gauge.band = text(source.band, 160, "unknown");
  gauge.color = text(source.color, 40, "var(--loomos-muted)");
  gauge.trend = enumValue(source.trend, ["down", "steady", "up", "unknown"] as const, "unknown");
  gauge.note = text(source.note, 500);
  return gauge;
}

export function defaultKernel() {
  return {
    scene: "",
    location: "",
    timeframe: "",
    date: "",
    time: "",
    elapsed: "",
    weather: "",
    pov: "",
    tone: "",
    topic: "",
    theme: "",
    objective: "",
    summary: "",
    currentFocus: "",
    nextFocus: "",
    currentRisk: "",
    stopMode: "",
    stopWhy: "",
    constraints: [] as string[],
  };
}

function normalizeKernel(value: unknown) {
  const source = asRecord(value);
  const result = defaultKernel();
  for (const key of [
    "scene",
    "location",
    "timeframe",
    "date",
    "time",
    "elapsed",
    "weather",
    "pov",
    "tone",
    "topic",
    "theme",
    "stopMode",
  ] as const) {
    result[key] = text(source[key], 500);
  }
  for (const key of [
    "objective",
    "summary",
    "currentFocus",
    "nextFocus",
    "currentRisk",
    "stopWhy",
  ] as const) {
    result[key] = text(source[key], 1600);
  }
  result.constraints = stringArray(source.constraints, 12, 500);
  return result;
}

export function defaultDelta() {
  return {
    headline: "",
    changedModules: [] as ModuleKey[],
    changes: [] as Array<{
      text: string;
      age: string;
      module: ModuleKey;
      importance: "low" | "medium" | "high" | "critical";
    }>,
    carriedForward: [] as string[],
    newlyEstablished: [] as string[],
  };
}

function normalizeDelta(value: unknown, enabledModules: ModuleKey[]) {
  const source = asRecord(value);
  const result = defaultDelta();
  result.headline = text(source.headline, 1600);
  result.changedModules = arrayValue(source.changedModules)
    .filter((item): item is ModuleKey => typeof item === "string" && MODULE_KEYS.includes(item as ModuleKey))
    .filter((item) => enabledModules.includes(item))
    .slice(0, MODULE_KEYS.length);
  result.changes = arrayValue(source.changes)
    .map((item) => {
      const row = asRecord(item);
      const rowText = text(row.text ?? item, 1600);
      if (!rowText) return null;
      return {
        text: rowText,
        age: text(row.age, 500),
        module: enumValue(row.module, MODULE_KEYS, "deltas"),
        importance: enumValue(row.importance, ["low", "medium", "high", "critical"] as const, "medium"),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 6);
  result.carriedForward = stringArray(source.carriedForward, 6, 1600);
  result.newlyEstablished = stringArray(source.newlyEstablished, 6, 1600);
  return result;
}

function normalizePocket(value: unknown) {
  if (typeof value === "string") {
    const name = text(value, 160);
    return name ? { name, type: "misc", qty: 1, condition: "", known: true } : null;
  }
  if (!isRecord(value)) return null;
  const name = text(value.name ?? value.item ?? value.title ?? value.text, 160);
  if (!name) return null;
  return {
    name,
    type: enumValue(
      value.type,
      ["consumable", "concealed", "tool", "key", "evidence", "misc"] as const,
      "misc",
    ),
    qty: integerValue(value.qty ?? value.quantity, 0, 9999, 1),
    condition: text(value.condition, 500),
    known: booleanValue(value.known, true),
    ...(text(value.color, 40) ? { color: text(value.color, 40) } : {}),
    changed: booleanValue(value.changed, false),
    ...(text(value.changeNote, 500) ? { changeNote: text(value.changeNote, 500) } : {}),
  };
}

function normalizeRelationship(value: unknown) {
  if (typeof value === "string") {
    const target = text(value, 500);
    return target ? { target, axis: "general", value: 0 } : null;
  }
  if (!isRecord(value)) return null;
  const target = text(value.target ?? value.name ?? value.text ?? value.summary, 500);
  if (!target) return null;
  const pct = text(value.pct, 12);
  const label = text(value.label, 160);
  const color = text(value.color, 40);
  const evidence = text(value.evidence, 1600);
  return {
    target,
    axis: text(value.axis ?? value.type, 500, "general"),
    value: numberValue(value.value, -100, 100, 0),
    ...(pct ? { pct } : {}),
    ...(label ? { label } : {}),
    ...(color ? { color } : {}),
    ...(value.trend !== undefined
      ? { trend: enumValue(value.trend, ["down", "steady", "up", "unknown"] as const, "unknown") }
      : {}),
    ...(evidence ? { evidence } : {}),
  };
}

function normalizeOptionalTextObject(value: unknown, fields: readonly string[]): RecordValue {
  const source = asRecord(value);
  return Object.fromEntries(fields.flatMap((field) => {
    const normalized = text(source[field], field === "fullDescription" || field === "anchor" ? 1600 : 500);
    return normalized ? [[field, normalized]] : [];
  }));
}

function normalizeAppearance(value: unknown): RecordValue {
  const source = asRecord(value);
  const mediumFields = new Set([
    "proportions",
    "distinguishingMarks",
    "scars",
    "tattoos",
    "piercings",
    "birthmarks",
    "uniqueFeatures",
    "attractiveFeatures",
    "fullDescription",
    "anchor",
  ]);
  const fields = [
    "species",
    "ageBand",
    "apparentAge",
    "genderPresentation",
    "height",
    "weight",
    "build",
    "bodyType",
    "frame",
    "proportions",
    "silhouette",
    "bodyComposition",
    "shoulders",
    "chest",
    "bust",
    "waist",
    "hips",
    "glutes",
    "arms",
    "legs",
    "hands",
    "skin",
    "complexion",
    "face",
    "facialStructure",
    "hair",
    "eyes",
    "eyebrows",
    "nose",
    "lips",
    "ears",
    "facialHair",
    "voice",
    "movement",
    "posture",
    "distinguishingMarks",
    "scars",
    "tattoos",
    "piercings",
    "birthmarks",
    "uniqueFeatures",
    "attractiveFeatures",
    "presence",
    "fullDescription",
    "anchor",
  ] as const;
  return {
    ...Object.fromEntries(fields.flatMap((field) => {
      const normalized = text(source[field], mediumFields.has(field) ? 1600 : 500);
      return normalized ? [[field, normalized]] : [];
    })),
    immutableTraits: stringArray(source.immutableTraits, 16, 500),
  };
}

function normalizeClothing(value: unknown): RecordValue {
  const source = asRecord(value);
  const layers = arrayValue(source.layers)
    .map((item) => {
      const row = asRecord(item);
      const layerText = text(row.text ?? row.description ?? item, 500);
      if (!layerText) return null;
      const state = text(row.state, 500);
      const color = text(row.color, 40);
      return {
        slot: enumValue(
          row.slot,
          ["outer", "upper", "lower", "feet", "accessory", "other"] as const,
          "other",
        ),
        text: layerText,
        ...(state ? { state } : {}),
        ...(color ? { color } : {}),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 8);
  const mediumFields = new Set([
    "summary",
    "fabric",
    "fit",
    "condition",
    "notable",
    "styling",
    "coverage",
    "footwear",
    "accessories",
  ]);
  const fields = [
    "summary",
    "silhouette",
    "palette",
    "fabric",
    "fit",
    "condition",
    "notable",
    "styling",
    "coverage",
    "footwear",
    "accessories",
  ] as const;
  return {
    ...Object.fromEntries(fields.flatMap((field) => {
      const normalized = text(source[field], mediumFields.has(field) ? 1600 : 500);
      return normalized ? [[field, normalized]] : [];
    })),
    layerCount: integerValue(source.layerCount, 0, 8, layers.length),
    layers,
  };
}

function normalizeCastContinuity(value: unknown): RecordValue {
  const source = asRecord(value);
  const uncertainty = arrayValue(source.uncertainty)
    .map((item) => {
      const row = asRecord(item);
      const claim = text(row.claim ?? row.text ?? item, 1600);
      if (!claim) return null;
      const handling = text(row.handling, 500);
      return {
        claim,
        confidence: numberValue(row.confidence, 0, 10, 0),
        label: enumValue(
          row.label,
          ["UNKNOWN", "DOUBTFUL", "POSSIBLE", "LIKELY", "CONFIRMED"] as const,
          "UNKNOWN",
        ),
        ...(handling ? { handling } : {}),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 4);
  const lastConfirmed = text(source.lastConfirmed, 500);
  const sourceHint = text(source.sourceHint, 500);
  return {
    ...(lastConfirmed ? { lastConfirmed } : {}),
    ...(sourceHint ? { sourceHint } : {}),
    uncertainty,
  };
}

export function defaultCastMember(partial: RecordValue = {}) {
  const name = text(partial.name, 160, "Unknown");
  return {
    id: text(partial.id, 160, name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "unknown"),
    name,
    kind: "npc" as "pov" | "main" | "npc" | "crowd" | "background",
    qty: 1,
    role: "",
    location: "",
    status: "",
    emotionalState: "",
    intent: "",
    pose: "",
    proximity: "",
    hands: "",
    awareness: "ambient" as "none" | "ambient" | "watching" | "alerted" | "hostile",
    threat: {
      value: 0,
      pct: "0%",
      band: "unknown",
      color: "var(--loomos-muted)",
      note: "",
    },
    spotlight: defaultGauge(),
    visualAnchor: "",
    identitySummary: "",
    clothingSummary: "",
    goals: [] as string[],
    relationships: [] as Array<{ target: string; axis: string; value: number }>,
    leverage: [] as string[],
    pockets: [] as Array<{
      name: string;
      type: string;
      qty: number;
      condition: string;
      known: boolean;
    }>,
    stableFacts: [] as string[],
  };
}

function normalizeCastMember(value: unknown, index: number) {
  const source = asRecord(value);
  if (!Object.keys(source).length && typeof value !== "string") return null;
  const base = defaultCastMember({
    name: source.name ?? (typeof value === "string" ? value : `Unknown ${index + 1}`),
    id: source.id,
  });
  base.kind = enumValue(source.kind, ["pov", "main", "npc", "crowd", "background"] as const, "npc");
  base.qty = integerValue(source.qty, 1, 10000, 1);
  base.role = text(source.role, 500);
  base.location = text(source.location, 500);
  base.status = text(source.status, 500);
  base.emotionalState = text(source.emotionalState, 500);
  base.intent = text(source.intent, 1600);
  base.pose = text(source.pose, 500);
  base.proximity = text(source.proximity, 500);
  base.hands = text(source.hands, 500);
  base.awareness = enumValue(source.awareness, ["none", "ambient", "watching", "alerted", "hostile"] as const, "ambient");
  const threat = normalizeGauge(source.threat, 10);
  base.threat = {
    value: threat.value,
    pct: threat.pct,
    band: threat.band,
    color: threat.color,
    note: threat.note,
  };
  base.spotlight = normalizeGauge(source.spotlight);
  base.visualAnchor = text(source.visualAnchor, 1600);
  base.identitySummary = text(source.identitySummary, 1600);
  base.clothingSummary = text(source.clothingSummary, 1600);
  base.goals = stringArray(source.goals, 6, 500);
  base.relationships = arrayValue(source.relationships)
    .map(normalizeRelationship)
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 8);
  base.leverage = stringArray(source.leverage, 6, 500);
  base.pockets = arrayValue(source.pockets)
    .map(normalizePocket)
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 6);
  base.stableFacts = stringArray(source.stableFacts, 6, 500);
  const changeNote = text(source.changeNote, 500);
  const relSummary = text(source.relSummary, 500);
  return {
    ...base,
    changed: booleanValue(source.changed, false),
    ...(changeNote ? { changeNote } : {}),
    appearance: normalizeAppearance(source.appearance),
    clothing: normalizeClothing(source.clothing),
    currentState: normalizeOptionalTextObject(source.currentState, [
      "injury",
      "pose",
      "proximity",
      "leftHand",
      "rightHand",
      "emotion",
      "intent",
      "physicalTell",
      "socialPosition",
    ]),
    ...(relSummary ? { relSummary } : {}),
    continuity: normalizeCastContinuity(source.continuity),
  };
}

function normalizeSceneItem(value: unknown) {
  if (typeof value === "string") {
    const name = text(value, 160);
    return name
      ? { name, owner: "", location: "", condition: "", lastTouch: "", importance: "medium" as const }
      : null;
  }
  if (!isRecord(value)) return null;
  const name = text(value.name ?? value.title ?? value.text, 160);
  if (!name) return null;
  return {
    name,
    owner: text(value.owner, 160),
    location: text(value.location, 500),
    condition: text(value.condition, 500),
    lastTouch: text(value.lastTouch, 500),
    importance: enumValue(value.importance, ["low", "medium", "high", "critical"] as const, "medium"),
  };
}

export function defaultScene() {
  return {
    privacy: "semi-private" as "private" | "semi-private" | "public" | "exposed",
    observerCount: 0,
    observerPressure: defaultGauge(10),
    crowdNoise: "",
    crowdFlow: "",
    light: {
      primary: "",
      secondary: "",
      quality: "",
      color: "",
    },
    spatial: [] as string[],
    access: {
      exit: "FREE" as "FREE" | "WATCHED" | "BLOCKED",
      lineOfSight: "",
      noiseMask: "",
      items: [] as string[],
      people: [] as string[],
    },
    carryover: {
      body: [] as string[],
      room: [] as string[],
      social: [] as string[],
    },
    items: [] as Array<NonNullable<ReturnType<typeof normalizeSceneItem>>>,
  };
}

function normalizeScene(value: unknown) {
  const source = asRecord(value);
  const result = defaultScene();
  result.privacy = enumValue(source.privacy, ["private", "semi-private", "public", "exposed"] as const, "semi-private");
  result.observerCount = integerValue(source.observerCount, 0, 10000, 0);
  result.observerPressure = normalizeGauge(source.observerPressure, 10);
  result.crowdNoise = text(source.crowdNoise, 500);
  result.crowdFlow = text(source.crowdFlow, 500);
  const light = asRecord(source.light);
  result.light = {
    primary: text(light.primary, 500),
    secondary: text(light.secondary, 500),
    quality: text(light.quality, 500),
    color: text(light.color, 40),
  };
  result.spatial = stringArray(source.spatial, 8, 1600);
  const access = asRecord(source.access);
  result.access = {
    exit: enumValue(access.exit, ["FREE", "WATCHED", "BLOCKED"] as const, "FREE"),
    lineOfSight: text(access.lineOfSight, 500),
    noiseMask: text(access.noiseMask, 500),
    items: stringArray(access.items, 5, 500),
    people: stringArray(access.people, 5, 500),
  };
  const carryover = asRecord(source.carryover);
  result.carryover = {
    body: stringArray(carryover.body, 5, 500),
    room: stringArray(carryover.room, 5, 500),
    social: stringArray(carryover.social, 5, 500),
  };
  result.items = arrayValue(source.items)
    .map(normalizeSceneItem)
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 10);
  return result;
}

export function defaultWorldState() {
  return {
    recentEnvironmentalChanges: [] as string[],
    activeHazards: [] as string[],
    rumors: [] as Array<{
      rumor: string;
      source: string;
      credibility: number;
      pct: string;
      color: string;
    }>,
    secrets: [] as Array<{
      secret: string;
      visibleHint: string;
      knownBy: string[];
    }>,
    loadedSigns: [] as Array<{
      thing: string;
      plantedBy?: string;
      payoffWhen?: string;
      state: "LOADED" | "HEATING" | "FIRED" | "DORMANT";
      evidence?: string;
      payoffHint?: string;
      changed: boolean;
      changeNote?: string;
    }>,
  };
}

function normalizeWorldState(value: unknown) {
  const source = asRecord(value);
  const result = defaultWorldState();
  result.recentEnvironmentalChanges = stringArray(source.recentEnvironmentalChanges, 6, 1600);
  result.activeHazards = stringArray(source.activeHazards, 6, 1600);
  result.rumors = arrayValue(source.rumors)
    .map((item) => {
      const row = asRecord(item);
      const rumor = text(row.rumor ?? item, 1600);
      if (!rumor) return null;
      const credibility = numberValue(row.credibility, 0, 10, 0);
      return {
        rumor,
        source: text(row.source, 500),
        credibility,
        pct: text(row.pct, 12, `${Math.round(credibility * 10)}%`),
        color: text(row.color, 40, "var(--loomos-muted)"),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 8);
  result.secrets = arrayValue(source.secrets)
    .map((item) => {
      const row = asRecord(item);
      const secret = text(row.secret ?? item, 1600);
      if (!secret) return null;
      return {
        secret,
        visibleHint: text(row.visibleHint, 1600),
        knownBy: stringArray(row.knownBy, 6, 160),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 8);
  result.loadedSigns = arrayValue(source.loadedSigns)
    .map((item) => {
      const row = asRecord(item);
      const thing = text(row.thing ?? row.name ?? item, 500);
      if (!thing) return null;
      return {
        thing,
        ...(text(row.plantedBy ?? row.loadedBy, 500) ? { plantedBy: text(row.plantedBy ?? row.loadedBy, 500) } : {}),
        ...(text(row.payoffWhen ?? row.firesWhen, 1600) ? { payoffWhen: text(row.payoffWhen ?? row.firesWhen, 1600) } : {}),
        state: enumValue(row.state, ["LOADED", "HEATING", "FIRED", "DORMANT"] as const, "LOADED"),
        ...(text(row.evidence, 1600) ? { evidence: text(row.evidence, 1600) } : {}),
        ...(text(row.payoffHint, 500) ? { payoffHint: text(row.payoffHint, 500) } : {}),
        changed: booleanValue(row.changed, false),
        ...(text(row.changeNote, 500) ? { changeNote: text(row.changeNote, 500) } : {}),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 8);
  return result;
}

export function defaultStoryState() {
  return {
    goals: [] as Array<{ who: string; goal: string; status: "ACTIVE" | "BLOCKED" | "PROGRESSED" | "RESOLVED"; note: string }>,
    conflicts: [] as Array<{ a: string; b: string; label: string; severity: number }>,
    threadLoom: [] as Array<RecordValue>,
    stakes: [] as Array<{ who: string; win: string; lose: string }>,
    countdowns: [] as Array<{ title: string; left: number; unit: string; pct: string; color: string }>,
    spotlightQueue: [] as Array<{
      name: string;
      turnsSince: number;
      pct?: string;
      color?: string;
      need: "active" | "soon" | "okay" | "quiet" | "background";
      reason?: string;
    }>,
    autonomyQueue: [] as Array<{ who: string; action: string; unlessInterruptedBy: string }>,
  };
}

function normalizeStoryState(value: unknown) {
  const source = asRecord(value);
  const result = defaultStoryState();
  result.goals = arrayValue(source.goals)
    .map((item) => {
      if (typeof item === "string") {
        const goal = text(item, 1600);
        return goal ? { who: "Unknown", goal, status: "ACTIVE" as const, note: "" } : null;
      }
      const row = asRecord(item);
      const goal = text(row.goal ?? row.text ?? row.summary ?? row.title, 1600);
      if (!goal) return null;
      return {
        who: text(row.who, 160, "Unknown"),
        goal,
        status: enumValue(row.status, ["ACTIVE", "BLOCKED", "PROGRESSED", "RESOLVED"] as const, "ACTIVE"),
        note: text(row.note, 1600),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 10);
  result.conflicts = arrayValue(source.conflicts)
    .map((item) => {
      const row = asRecord(item);
      const label = text(row.label ?? row.text ?? item, 500);
      if (!label) return null;
      return {
        a: text(row.a, 160),
        b: text(row.b, 160),
        label,
        severity: integerValue(row.severity, 1, 3, 1),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 8);
  result.threadLoom = arrayValue(source.threadLoom)
    .map((item) => {
      const row = asRecord(item);
      const title = text(row.title ?? row.name ?? row.text, 240);
      if (!title) return null;
      const progress = numberValue(row.progress, 0, 10, 0);
      return {
        title,
        status: enumValue(row.status, ["dormant", "active", "escalating", "blocked", "resolved"] as const, "active"),
        urgency: integerValue(row.urgency, 0, 5, 0),
        priority: enumValue(row.priority, ["low", "medium", "high", "critical"] as const, "medium"),
        progress,
        pct: text(row.pct, 12, `${Math.round(progress * 10)}%`),
        color: text(row.color, 40, "var(--loomos-muted)"),
        label: text(row.label, 160, "active"),
        summary: text(row.summary, 1600),
        nextPressure: text(row.nextPressure, 1600),
        participants: stringArray(row.participants, 12, 160),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 24);
  result.stakes = arrayValue(source.stakes)
    .map((item) => {
      const row = asRecord(item);
      const who = text(row.who, 160);
      const win = text(row.win, 1600);
      const lose = text(row.lose, 1600);
      return who || win || lose ? { who, win, lose } : null;
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 8);
  result.countdowns = arrayValue(source.countdowns)
    .map((item) => {
      const row = asRecord(item);
      const title = text(row.title ?? row.name ?? item, 500);
      if (!title) return null;
      return {
        title,
        left: numberValue(row.left, 0, Number.MAX_SAFE_INTEGER, 0),
        unit: text(row.unit, 160),
        pct: text(row.pct, 12, "0%"),
        color: text(row.color, 40, "var(--loomos-muted)"),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 8);
  result.spotlightQueue = arrayValue(source.spotlightQueue)
    .map((item) => {
      const row = asRecord(item);
      const name = text(row.name ?? row.who ?? item, 160);
      if (!name) return null;
      const pct = text(row.pct, 12);
      const color = text(row.color, 40);
      const reason = text(row.reason, 500);
      return {
        name,
        turnsSince: integerValue(row.turnsSince, 0, Number.MAX_SAFE_INTEGER, 0),
        ...(pct ? { pct } : {}),
        ...(color ? { color } : {}),
        need: enumValue(row.need, ["active", "soon", "okay", "quiet", "background"] as const, "okay"),
        ...(reason ? { reason } : {}),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 12);
  result.autonomyQueue = arrayValue(source.autonomyQueue)
    .map((item) => {
      const row = asRecord(item);
      const action = text(row.action ?? row.text ?? item, 1600);
      if (!action) return null;
      return {
        who: text(row.who, 160, "Unknown"),
        action,
        unlessInterruptedBy: text(row.unlessInterruptedBy, 1600),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 8);
  return result;
}

export function defaultContinuityFirewall() {
  return {
    establishedFacts: [] as string[],
    antiRetconAnchors: [] as string[],
    pendingConsequences: [] as Array<{
      cause: string;
      pending: string;
      trigger?: string;
      urgency: number;
      pct?: string;
      status: "PENDING" | "ACTIVE" | "FIRED" | "RESOLVED" | "DORMANT";
      evidence?: string;
      changed: boolean;
      changeNote?: string;
    }>,
    offscreenState: [] as string[],
    bannedNext: [] as Array<{
      text: string;
      reason?: string;
      scope: "turn" | "scene" | "persistent";
      color?: string;
      source: "user" | "system" | "compiler";
    }>,
    impossibleNext: [] as string[],
    risks: [] as Array<{ severity: "low" | "medium" | "high" | "critical"; issue: string; evidence: string; recommendation: string }>,
    terms: [] as Array<{
      party: string;
      term: string;
      risk?: string;
      status: "PENDING" | "ACCEPTED" | "REJECTED" | "BROKEN" | "EXPIRED" | "UNKNOWN";
      binding: boolean;
      evidence?: string;
      changed: boolean;
      changeNote?: string;
    }>,
  };
}

function normalizeContinuityFirewall(value: unknown) {
  const source = asRecord(value);
  const result = defaultContinuityFirewall();
  result.establishedFacts = stringArray(source.establishedFacts, 40, 1600);
  result.antiRetconAnchors = stringArray(source.antiRetconAnchors, 30, 1600);
  result.pendingConsequences = arrayValue(source.pendingConsequences)
    .map((item) => {
      const row = asRecord(item);
      const pending = text(row.pending ?? row.text ?? row.summary ?? item, 1600);
      const cause = text(row.cause ?? row.reason ?? pending, 500);
      if (!pending && !cause) return null;
      const trigger = text(row.trigger, 500);
      const pct = text(row.pct, 12);
      const evidence = text(row.evidence, 1600);
      const changeNote = text(row.changeNote, 500);
      return {
        cause: cause || pending.slice(0, 500),
        pending: pending || cause,
        ...(trigger ? { trigger } : {}),
        urgency: numberValue(row.urgency, 0, 10, 5),
        ...(pct ? { pct } : {}),
        status: enumValue(row.status, ["PENDING", "ACTIVE", "FIRED", "RESOLVED", "DORMANT"] as const, "PENDING"),
        ...(evidence ? { evidence } : {}),
        changed: booleanValue(row.changed, false),
        ...(changeNote ? { changeNote } : {}),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 30);
  result.offscreenState = stringArray(source.offscreenState, 24, 1600);
  result.bannedNext = arrayValue(source.bannedNext)
    .map((item) => {
      if (typeof item === "string") {
        const rowText = text(item, 1600);
        return rowText ? { text: rowText, scope: "turn" as const, source: "compiler" as const } : null;
      }
      const row = asRecord(item);
      const rowText = text(row.text ?? row.issue ?? row.summary, 1600);
      if (!rowText) return null;
      const reason = text(row.reason, 500);
      const color = text(row.color, 40);
      return {
        text: rowText,
        ...(reason ? { reason } : {}),
        scope: enumValue(
          row.scope,
          ["turn", "scene", "persistent"] as const,
          booleanValue(row.persistent, false) ? "persistent" : "turn",
        ),
        ...(color ? { color } : {}),
        source: enumValue(row.source, ["user", "system", "compiler"] as const, "compiler"),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 12);
  result.impossibleNext = stringArray(source.impossibleNext, 12, 1600);
  result.risks = arrayValue(source.risks)
    .map((item) => {
      if (typeof item === "string") {
        const issue = text(item, 1600);
        return issue ? { severity: "medium" as const, issue, evidence: "", recommendation: "" } : null;
      }
      const row = asRecord(item);
      const issue = text(row.issue ?? row.text ?? row.summary, 1600);
      if (!issue) return null;
      return {
        severity: enumValue(row.severity, ["low", "medium", "high", "critical"] as const, "medium"),
        issue,
        evidence: text(row.evidence, 1600),
        recommendation: text(row.recommendation, 1600),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 24);
  result.terms = arrayValue(source.terms)
    .map((item) => {
      const row = asRecord(item);
      const term = text(row.term ?? row.text ?? row.summary ?? item, 1600);
      const party = text(row.party ?? row.who, 160, "Unknown");
      if (!term) return null;
      const risk = text(row.risk, 500);
      const evidence = text(row.evidence, 1600);
      const changeNote = text(row.changeNote, 500);
      return {
        party,
        term,
        ...(risk ? { risk } : {}),
        status: enumValue(
          row.status,
          ["PENDING", "ACCEPTED", "REJECTED", "BROKEN", "EXPIRED", "UNKNOWN"] as const,
          "UNKNOWN",
        ),
        binding: booleanValue(row.binding, false),
        ...(evidence ? { evidence } : {}),
        changed: booleanValue(row.changed, false),
        ...(changeNote ? { changeNote } : {}),
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 10);
  return result;
}

export function defaultTools() {
  return {
    actionResolver: null,
    dialogueState: null,
    directorStyle: null,
    closenessState: null,
    imagePrompt: null,
  } as {
    actionResolver: RecordValue | null;
    dialogueState: RecordValue | null;
    directorStyle: RecordValue | null;
    closenessState: RecordValue | null;
    imagePrompt: RecordValue | null;
  };
}

function normalizeTools(value: unknown) {
  const source = asRecord(value);
  const result = defaultTools();
  if (isRecord(source.actionResolver)) {
    result.actionResolver = {
      userAction: text(source.actionResolver.userAction, 1600),
      worldResponse: text(source.actionResolver.worldResponse, 1600),
      risk: text(source.actionResolver.risk, 1600),
      blockers: stringArray(source.actionResolver.blockers, 6, 500),
    };
  }
  if (isRecord(source.dialogueState)) {
    result.dialogueState = {
      openThread: text(source.dialogueState.openThread, 1600),
      socialMask: text(source.dialogueState.socialMask, 1600),
      levers: stringArray(source.dialogueState.levers, 6, 500),
      taboos: stringArray(source.dialogueState.taboos, 6, 500),
    };
  }
  if (isRecord(source.directorStyle)) {
    result.directorStyle = {
      primary: text(source.directorStyle.primary, 500),
      mask: text(source.directorStyle.mask, 500),
      push: text(source.directorStyle.push, 1600),
      voiceCues: stringArray(source.directorStyle.voiceCues, 6, 500),
    };
  }
  if (isRecord(source.closenessState)) {
    result.closenessState = {
      emotional: text(source.closenessState.emotional, 500),
      physical: text(source.closenessState.physical, 500),
      consentSignals: stringArray(source.closenessState.consentSignals, 6, 500),
      boundaries: stringArray(source.closenessState.boundaries, 6, 500),
    };
  }
  if (isRecord(source.imagePrompt)) {
    result.imagePrompt = {
      aspect: text(source.imagePrompt.aspect, 160),
      shot: text(source.imagePrompt.shot, 500),
      medium: text(source.imagePrompt.medium, 500),
      subject: text(source.imagePrompt.subject, 1600),
      positive: text(source.imagePrompt.positive, 1600),
      negative: text(source.imagePrompt.negative, 1600),
      intent: text(source.imagePrompt.intent, 1600),
      composition: text(source.imagePrompt.composition, 1600),
      camera: text(source.imagePrompt.camera, 1600),
      lighting: text(source.imagePrompt.lighting, 1600),
      colorPalette: text(source.imagePrompt.colorPalette, 1600),
      environment: text(source.imagePrompt.environment, 1600),
      characterContinuity: text(source.imagePrompt.characterContinuity, 4000),
      action: text(source.imagePrompt.action, 1600),
      materials: text(source.imagePrompt.materials, 1600),
      mood: text(source.imagePrompt.mood, 1600),
      textRendering: text(source.imagePrompt.textRendering, 1600),
      constraints: stringArray(source.imagePrompt.constraints, 16, 1600),
      full: text(source.imagePrompt.full, 8000),
      hint: text(source.imagePrompt.hint, 1600),
    };
  }
  return result;
}

function normalizeCustomField(value: unknown, field: CustomModuleField): unknown {
  if (value === undefined || value === null || value === "") {
    if (field.defaultValue !== undefined) return cloneJson(field.defaultValue);
    if (field.type === "number") return field.min ?? 0;
    if (field.type === "boolean") return false;
    if (field.type === "enum") return field.enumOptions[0] ?? "";
    if (field.type === "gauge") return defaultGauge(field.max ?? 100);
    if (field.type === "chips" || field.type === "list") return [];
    return "";
  }
  if (field.type === "text") return text(value, 500);
  if (field.type === "longText") return text(value, 1600);
  if (field.type === "number") {
    return numberValue(value, field.min ?? -1_000_000, field.max ?? 1_000_000, Number(field.defaultValue) || 0);
  }
  if (field.type === "boolean") return booleanValue(value, Boolean(field.defaultValue));
  if (field.type === "enum") return enumValue(value, field.enumOptions, field.enumOptions[0] ?? "");
  if (field.type === "gauge") return normalizeGauge(value, field.max ?? 100);
  if (field.type === "chips") return stringArray(value, field.maxItems ?? 24, 160);
  if (field.type === "list") {
    return arrayValue(value)
      .filter((item) => typeof item === "string" || isRecord(item))
      .slice(0, field.maxItems ?? 24)
      .map((item) => typeof item === "string" ? text(item, 1600) : cloneJson(item));
  }
  return value;
}

function normalizeCustomModuleData(value: unknown, customModules: CustomModule[]) {
  return arrayValue(value)
    .map((item) => {
      const row = asRecord(item);
      const moduleId = text(row.moduleId ?? row.id, 160);
      if (!moduleId) return null;
      const module = customModules.find((candidate) => candidate.id === moduleId);
      const fieldsSource = asRecord(row.fields);
      const fields = module
        ? Object.fromEntries(module.schemaFields.map((field) => [
            field.key,
            normalizeCustomField(fieldsSource[field.key], field),
          ]))
        : Object.fromEntries(Object.entries(fieldsSource).slice(0, 40));
      const items = arrayValue(row.items)
        .map((entry) => {
          if (typeof entry === "string") {
            const entryText = text(entry, 1600);
            return entryText
              ? {
                  title: entryText.slice(0, 80),
                  text: entryText,
                  importance: "medium" as const,
                }
              : null;
          }
          const itemRow = asRecord(entry);
          const itemText = text(itemRow.text ?? itemRow.summary ?? itemRow.description ?? itemRow.title, 1600);
          const title = text(itemRow.title ?? itemRow.name ?? itemText, 500);
          if (!title && !itemText) return null;
          const color = text(itemRow.color, 40);
          return {
            title: title || itemText.slice(0, 80),
            text: itemText,
            importance: enumValue(itemRow.importance, ["low", "medium", "high", "critical"] as const, "medium"),
            ...(color ? { color } : {}),
          };
        })
        .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
        .slice(0, module?.maxItems ?? 24);
      return {
        moduleId,
        label: text(row.label, 500, module?.label ?? moduleId),
        summary: text(row.summary, 1600),
        fields,
        items,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .slice(0, 80);
}

export function normalizeCompiledState(
  value: unknown,
  options: NormalizeCompiledStateOptions,
): { state: LoomOSCompiledState; report: NormalizationReport } {
  const cloned = cloneJson(value);
  const source = asRecord(cloned);
  const changes: string[] = [];
  if (!isRecord(cloned)) mark(changes, "root");

  const enabled = options.enabledModules.filter((key) => MODULE_KEYS.includes(key));
  const activeModules = arrayValue(source.activeModules)
    .filter((item): item is ModuleKey => typeof item === "string" && MODULE_KEYS.includes(item as ModuleKey))
    .filter((item) => enabled.includes(item));
  const normalizedActive = activeModules.length > 0 ? activeModules : enabled;
  if (JSON.stringify(source.activeModules) !== JSON.stringify(normalizedActive)) mark(changes, "activeModules");

  const wantsScene = enabled.some((key) => ["worldSpace", "inventory"].includes(key));
  const wantsWorld = enabled.some((key) => ["worldSpace", "secretsRumors"].includes(key));
  const normalized = {
    activeModules: normalizedActive,
    kernel: normalizeKernel(source.kernel),
    delta: normalizeDelta(source.delta, enabled),
    meters: arrayValue(source.meters)
      .map((item) => {
        const row = asRecord(item);
        const id = enumValue(row.id, ["tension", "danger", "socialHeat", "coherence", "hiddenInfo", "omen"] as const, "");
        if (!id) return null;
        return {
          id,
          label: text(row.label, 160, id),
          ...normalizeGauge(row),
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .slice(0, 6),
    scene: source.scene !== null && (isRecord(source.scene) || wantsScene)
      ? normalizeScene(source.scene)
      : null,
    castMatrix: arrayValue(source.castMatrix)
      .map(normalizeCastMember)
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .slice(0, 24),
    worldState: source.worldState !== null && (isRecord(source.worldState) || wantsWorld)
      ? normalizeWorldState(source.worldState)
      : null,
    storyState: normalizeStoryState(source.storyState),
    continuityFirewall: normalizeContinuityFirewall(source.continuityFirewall),
    tools: normalizeTools(source.tools),
    auditLog: arrayValue(source.auditLog)
      .map((item) => {
        const row = asRecord(item);
        const system = text(row.system, 160);
        const result = text(row.result ?? item, 500);
        if (!system && !result) return null;
        return {
          system: system || "compiler",
          marker: text(row.marker, 160),
          result,
          repaired: booleanValue(row.repaired, false),
          notes: text(row.notes, 1600),
        };
      })
      .filter((item): item is NonNullable<typeof item> => Boolean(item))
      .slice(0, 12),
    customModuleData: normalizeCustomModuleData(source.customModuleData, options.customModules ?? []),
  };

  const parsed = LoomOSCompiledStateSchema.safeParse(normalized);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) =>
      `${issue.path.join(".") || "root"}: ${issue.message}`
    );
    throw new CompiledStateNormalizationError({
      normalized: true,
      changes,
      issues,
    });
  }
  return {
    state: parsed.data,
    report: {
      normalized: changes.length > 0 || JSON.stringify(cloned) !== JSON.stringify(parsed.data),
      changes,
      issues: [],
    },
  };
}

export function normalizeCompilerOutput(value: unknown): unknown {
  const source = asRecord(value);
  const enabledModules = arrayValue(source.activeModules)
    .filter((item): item is ModuleKey =>
      typeof item === "string" && MODULE_KEYS.includes(item as ModuleKey)
    );
  return normalizeCompiledState(value, {
    enabledModules: enabledModules.length > 0 ? enabledModules : [...MODULE_KEYS],
  }).state;
}

function transcriptKernel(transcript: string) {
  const lines = transcript
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("["));
  const summary = lines.slice(-2).join(" ").replace(/\s+/g, " ").slice(0, 1600);
  return {
    ...defaultKernel(),
    scene: summary.slice(0, 500),
    summary,
    currentFocus: summary,
  };
}

export function buildFallbackCompiledState(request: {
  enabledModules: ModuleKey[];
  seedState: LoomOSState | null;
  transcript: string;
  notes: string;
}): LoomOSCompiledState {
  const seed = request.seedState;
  const kernel = seed
    ? {
        ...defaultKernel(),
        scene: seed.kernel.scene,
        location: seed.kernel.location,
        timeframe: seed.kernel.timeframe,
        date: seed.kernel.date,
        time: seed.kernel.time,
        elapsed: seed.kernel.elapsed,
        weather: seed.kernel.weather,
        pov: seed.kernel.pov,
        tone: seed.kernel.tone,
        topic: seed.kernel.topic,
        theme: seed.kernel.theme,
        objective: seed.kernel.objective,
        summary: seed.kernel.summary,
        currentFocus: seed.kernel.currentFocus,
        currentRisk: seed.kernel.currentRisk,
        constraints: seed.kernel.constraints.slice(0, 12),
      }
    : transcriptKernel(request.transcript);
  return LoomOSCompiledStateSchema.parse({
    activeModules: request.enabledModules,
    kernel,
    delta: {
      ...defaultDelta(),
      headline: "Compiler output was invalid; saved minimal fallback state.",
    },
    meters: [],
    scene: null,
    castMatrix: [],
    worldState: null,
    storyState: defaultStoryState(),
    continuityFirewall: seed
      ? {
          ...defaultContinuityFirewall(),
          establishedFacts: seed.continuityFirewall.establishedFacts.slice(0, 20),
          antiRetconAnchors: seed.continuityFirewall.antiRetconAnchors.slice(0, 15),
          pendingConsequences: seed.continuityFirewall.pendingConsequences.slice(0, 15),
          offscreenState: seed.continuityFirewall.offscreenState.slice(0, 12),
        }
      : defaultContinuityFirewall(),
    tools: defaultTools(),
    auditLog: [{
      system: "compiler",
      marker: "normalization_v2",
      result: "fallback_state_saved",
      repaired: true,
      notes: text(request.notes, 1600),
    }],
    customModuleData: [],
  });
}
