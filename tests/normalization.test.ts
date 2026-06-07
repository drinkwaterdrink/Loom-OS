import assert from "node:assert/strict";
import test from "node:test";
import { LoomOSCompiledStateSchema } from "../src/shared/schemas";
import { normalizeCompilerOutput } from "../src/shared/normalizeCompiledState";
import { buildStateCompilerPrompt, STATE_REPAIR_PROMPT } from "../src/shared/prompts";
import { LoomOSSettingsSchema } from "../src/shared/schemas";

function makeState(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    activeModules: ["sceneKernel", "deltas", "castCore", "continuity", "storyThreads"],
    kernel: { scene: "Test", location: "Room", timeframe: "Now", date: "", time: "", elapsed: "", weather: "", pov: "", tone: "", topic: "", theme: "", objective: "", summary: "", currentFocus: "", nextFocus: "", currentRisk: "", stopMode: "", stopWhy: "", constraints: [] },
    delta: { headline: "Test", changedModules: [], changes: [], carriedForward: [], newlyEstablished: [] },
    meters: [],
    scene: null,
    castMatrix: [],
    worldState: null,
    storyState: { goals: [], conflicts: [], threadLoom: [], stakes: [], countdowns: [], autonomyQueue: [] },
    continuityFirewall: { establishedFacts: [], antiRetconAnchors: [], pendingConsequences: [], offscreenState: [], bannedNext: [], impossibleNext: [], risks: [], terms: [] },
    tools: { actionResolver: null, dialogueState: null, directorStyle: null, closenessState: null, imagePrompt: null },
    auditLog: [],
    ...overrides,
  };
}

test("A) goals object -> coerced to string[]", () => {
  const raw = makeState({ castMatrix: [{ id: "a", name: "A", kind: "npc", qty: 1, role: "", location: "", status: "", awareness: "ambient", threat: { value: 0, pct: "0%", band: "", color: "", note: "" }, spotlight: { value: 50, pct: "50%", band: "", color: "", trend: "steady", note: "" }, goals: [{ goal: "Find the baths" }] }] });
  const normalized = normalizeCompilerOutput(raw);
  const cast = (normalized as any).castMatrix[0];
  assert.deepEqual(cast.goals, ["Find the baths"]);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("A2) goals string -> string[]", () => {
  const raw = makeState({ castMatrix: [{ id: "a", name: "A", kind: "npc", qty: 1, role: "", location: "", status: "", awareness: "ambient", threat: { value: 0, pct: "0%", band: "", color: "", note: "" }, spotlight: { value: 50, pct: "50%", band: "", color: "", trend: "steady", note: "" }, goals: "Find the baths" }] });
  const normalized = normalizeCompilerOutput(raw);
  const cast = (normalized as any).castMatrix[0];
  assert.deepEqual(cast.goals, ["Find the baths"]);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("B) stableFacts object -> string[]", () => {
  const raw = makeState({ castMatrix: [{ id: "a", name: "A", kind: "npc", qty: 1, role: "", location: "", status: "", awareness: "ambient", threat: { value: 0, pct: "0%", band: "", color: "", note: "" }, spotlight: { value: 50, pct: "50%", band: "", color: "", trend: "steady", note: "" }, stableFacts: [{ text: "Mara cannot reveal her patron." }] }] });
  const normalized = normalizeCompilerOutput(raw);
  const cast = (normalized as any).castMatrix[0];
  assert.deepEqual(cast.stableFacts, ["Mara cannot reveal her patron."]);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("C) leverage object -> string[]", () => {
  const raw = makeState({ castMatrix: [{ id: "a", name: "A", kind: "npc", qty: 1, role: "", location: "", status: "", awareness: "ambient", threat: { value: 0, pct: "0%", band: "", color: "", note: "" }, spotlight: { value: 50, pct: "50%", band: "", color: "", trend: "steady", note: "" }, leverage: [{ text: "Knows the guard rotation" }] }] });
  const normalized = normalizeCompilerOutput(raw);
  const cast = (normalized as any).castMatrix[0];
  assert.deepEqual(cast.leverage, ["Knows the guard rotation"]);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("D) pockets string -> object with defaults", () => {
  const raw = makeState({ castMatrix: [{ id: "a", name: "A", kind: "npc", qty: 1, role: "", location: "", status: "", awareness: "ambient", threat: { value: 0, pct: "0%", band: "", color: "", note: "" }, spotlight: { value: 50, pct: "50%", band: "", color: "", trend: "steady", note: "" }, pockets: ["Lock pick"] }] });
  const normalized = normalizeCompilerOutput(raw);
  const cast = (normalized as any).castMatrix[0];
  assert.equal(cast.pockets[0].name, "Lock pick");
  assert.equal(cast.pockets[0].type, "misc");
  assert.equal(cast.pockets[0].qty, 1);
  assert.equal(cast.pockets[0].known, true);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("D2) pockets partial object -> object with defaults", () => {
  const raw = makeState({ castMatrix: [{ id: "a", name: "A", kind: "npc", qty: 1, role: "", location: "", status: "", awareness: "ambient", threat: { value: 0, pct: "0%", band: "", color: "", note: "" }, spotlight: { value: 50, pct: "50%", band: "", color: "", trend: "steady", note: "" }, pockets: [{ name: "Sword", qty: "2", type: "tool" }] }] });
  const normalized = normalizeCompilerOutput(raw);
  const cast = (normalized as any).castMatrix[0];
  assert.equal(cast.pockets[0].name, "Sword");
  assert.equal(cast.pockets[0].qty, 2);
  assert.equal(cast.pockets[0].known, true);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("E) impossibleNext object -> string[]", () => {
  const raw = makeState({ continuityFirewall: { establishedFacts: [], antiRetconAnchors: [], offscreenState: [], impossibleNext: [{ text: "Using the east stair" }], risks: [] } });
  const normalized = normalizeCompilerOutput(raw);
  const fw = (normalized as any).continuityFirewall;
  assert.deepEqual(fw.impossibleNext, ["Using the east stair"]);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("F) establishedFacts object -> string[]", () => {
  const raw = makeState({ continuityFirewall: { establishedFacts: [{ text: "The east stair is blocked." }], antiRetconAnchors: [], offscreenState: [], impossibleNext: [], risks: [] } });
  const normalized = normalizeCompilerOutput(raw);
  const fw = (normalized as any).continuityFirewall;
  assert.deepEqual(fw.establishedFacts, ["The east stair is blocked."]);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("K) relationships string -> object", () => {
  const raw = makeState({ castMatrix: [{ id: "a", name: "A", kind: "npc", qty: 1, role: "", location: "", status: "", awareness: "ambient", threat: { value: 0, pct: "0%", band: "", color: "", note: "" }, spotlight: { value: 50, pct: "50%", band: "", color: "", trend: "steady", note: "" }, relationships: ["Iven: Trust=30"] }] });
  const normalized = normalizeCompilerOutput(raw);
  const cast = (normalized as any).castMatrix[0];
  assert.equal(cast.relationships[0].target, "Iven: Trust=30");
  assert.equal(cast.relationships[0].axis, "general");
  assert.equal(cast.relationships[0].value, 0);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("M) pendingConsequences string -> object", () => {
  const raw = makeState({ continuityFirewall: { establishedFacts: [], antiRetconAnchors: [], offscreenState: [], impossibleNext: [], risks: [], pendingConsequences: ["The guards are approaching."] } });
  const normalized = normalizeCompilerOutput(raw);
  const fw = (normalized as any).continuityFirewall;
  assert.equal(fw.pendingConsequences[0].cause, "The guards are approaching.");
  assert.equal(fw.pendingConsequences[0].pending, "The guards are approaching.");
  assert.equal(fw.pendingConsequences[0].urgency, 5);
  assert.equal(fw.pendingConsequences[0].status, "PENDING");
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("N) bannedNext string -> object", () => {
  const raw = makeState({ continuityFirewall: { establishedFacts: [], antiRetconAnchors: [], offscreenState: [], impossibleNext: [], risks: [], bannedNext: ["Do not reveal Iven's page."] } });
  const normalized = normalizeCompilerOutput(raw);
  const fw = (normalized as any).continuityFirewall;
  assert.equal(fw.bannedNext[0].text, "Do not reveal Iven's page.");
  assert.equal(fw.bannedNext[0].scope, "turn");
  assert.equal(fw.bannedNext[0].source, "compiler");
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("O) bad audit rows dropped", () => {
  const raw = makeState({ auditLog: [{ system: "", marker: "", result: "", repaired: false, notes: "" }, { system: "compiler", marker: "test", result: "ok", repaired: false, notes: "" }] });
  const normalized = normalizeCompilerOutput(raw);
  const log = (normalized as any).auditLog;
  assert.equal(log.length, 1);
  assert.equal(log[0].system, "compiler");
});

test("kernel.constraints object -> string[]", () => {
  const raw = makeState({ kernel: { scene: "Test", location: "", timeframe: "", date: "", time: "", elapsed: "", weather: "", pov: "", tone: "", topic: "", theme: "", objective: "", summary: "", currentFocus: "", nextFocus: "", currentRisk: "", stopMode: "", stopWhy: "", constraints: [{ text: "The east stair is blocked." }] } });
  const normalized = normalizeCompilerOutput(raw);
  const k = (normalized as any).kernel;
  assert.deepEqual(k.constraints, ["The east stair is blocked."]);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("scene.spatial object -> string[]", () => {
  const raw = makeState({
    scene: { privacy: "private", observerCount: 0, observerPressure: { value: 0, pct: "0%", band: "", color: "", trend: "steady", note: "" }, crowdNoise: "", crowdFlow: "", light: { primary: "", secondary: "", quality: "", color: "" }, spatial: [{ text: "The telescope dais." }], access: { exit: "FREE", lineOfSight: "", noiseMask: "", items: [], people: [] }, carryover: { body: [], room: [], social: [] }, items: [] },
  });
  const normalized = normalizeCompilerOutput(raw);
  assert.deepEqual((normalized as any).scene.spatial, ["The telescope dais."]);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("participants object -> string[]", () => {
  const raw = makeState({ storyState: { goals: [], conflicts: [], threadLoom: [{ title: "T", status: "active", urgency: 1, priority: "medium", progress: 0, pct: "0%", color: "", label: "", summary: "", nextPressure: "", participants: [{ name: "Mara" }] }], stakes: [], countdowns: [], autonomyQueue: [] } });
  const normalized = normalizeCompilerOutput(raw);
  const thread = (normalized as any).storyState.threadLoom[0];
  assert.deepEqual(thread.participants, ["Mara"]);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("terms string -> object", () => {
  const raw = makeState({ continuityFirewall: { establishedFacts: [], antiRetconAnchors: [], offscreenState: [], impossibleNext: [], risks: [], terms: [{ party: "Mara", term: "Do not reveal patron", binding: false, status: "UNKNOWN" }] } });
  const normalized = normalizeCompilerOutput(raw);
  const terms = (normalized as any).continuityFirewall.terms;
  assert.equal(terms[0].party, "Mara");
  assert.equal(terms[0].status, "UNKNOWN");
  assert.equal(terms[0].binding, false);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("complete normalization + validation end-to-end", () => {
  const raw = makeState({
    castMatrix: [{ id: "a", name: "A", kind: "npc", qty: 1, role: "", location: "", status: "", awareness: "ambient", threat: { value: 0, pct: "0%", band: "", color: "", note: "" }, spotlight: { value: 50, pct: "50%", band: "", color: "", trend: "steady", note: "" }, goals: [{ goal: "Recover ledger" }], stableFacts: [{ text: "Mara cannot reveal patron" }], leverage: [{ text: "Knows guard rotation" }], pockets: ["Lock pick"], relationships: ["Iven: Trust=30"] }],
    continuityFirewall: { establishedFacts: [{ text: "East stair blocked" }], antiRetconAnchors: [{ text: "No east stair" }], offscreenState: [{ text: "Guards below" }], impossibleNext: [{ text: "Using east stair" }], pendingConsequences: ["Guards approaching"], bannedNext: ["Do not reveal page"], risks: [], terms: [{ party: "Mara", term: "Don't reveal patron", status: "ACCEPTED", binding: true }] },
  });
  const normalized = normalizeCompilerOutput(raw);
  const r = LoomOSCompiledStateSchema.safeParse(normalized);
  assert.ok(r.success);
});

test("repair prompt contains shape correction examples", () => {
  assert.ok(STATE_REPAIR_PROMPT.includes("castMatrix[].goals MUST be string[]"));
  assert.ok(STATE_REPAIR_PROMPT.includes("castMatrix[].pockets MUST be object[]"));
  assert.ok(STATE_REPAIR_PROMPT.includes("continuityFirewall.impossibleNext MUST be string[]"));
  assert.ok(STATE_REPAIR_PROMPT.includes("GOOD: \"goals\": [\"Find the baths\"]"));
  assert.ok(STATE_REPAIR_PROMPT.includes("GOOD: \"pockets\": [{\"name\""));
});

test("stock module overrides validate in settings", () => {
  const r = LoomOSSettingsSchema.safeParse({
    stockModuleOverrides: {
      castCore: {
        label: "Custom Cast Label",
        description: "Custom description",
        compilerGuidanceAddendum: "Focus on cloak details",
        hiddenFromSettings: false,
      },
    },
  });
  assert.ok(r.success);
  const overrides = r.data?.stockModuleOverrides;
  assert.equal(overrides?.castCore?.label, "Custom Cast Label");
});

test("override compiler guidance reaches prompt", () => {
  const overrides = { castCore: { compilerGuidanceAddendum: "Focus on cloak details" } };
  const prompt = buildStateCompilerPrompt(["castCore"], [], overrides);
  assert.ok(prompt.includes("Focus on cloak details"));
  assert.ok(prompt.includes("[Additional guidance:"));
});

test("empty overrides produce no override text in prompt", () => {
  const prompt = buildStateCompilerPrompt(["castCore"], [], undefined);
  assert.ok(!prompt.includes("[Additional guidance:"));
});
