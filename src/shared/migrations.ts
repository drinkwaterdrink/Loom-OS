import {
  LegacyLoomOSStateSchema,
  LoomOSStateSchema,
} from "./schemas";
import type {
  LegacyLoomOSState,
  LoomOSState,
} from "./types";

function migrateLegacyState(state: LegacyLoomOSState): LoomOSState {
  return LoomOSStateSchema.parse({
    schemaVersion: 2,
    identity: state.identity,
    generatedAt: state.generatedAt,
    source: {
      messageCount: state.source.messageCount,
      repaired: state.source.repaired,
      seedIdentity: null,
      connectionId: "",
    },
    activeModules: [
      "sceneKernel",
      "deltas",
      "castCore",
      "relationships",
      "storyThreads",
      "continuity",
    ],
    kernel: {
      ...state.kernel,
      date: "",
      time: "",
      elapsed: "",
      weather: "",
      pov: "",
      topic: "",
      theme: "",
      currentFocus: state.kernel.objective,
      nextFocus: "",
      currentRisk: state.continuityFirewall.risks[0]?.issue ?? "",
      stopMode: "",
      stopWhy: "",
    },
    delta: {
      headline: "Migrated from LoomOS State V1.",
      changedModules: [],
      changes: [],
      carriedForward: state.continuityFirewall.establishedFacts.slice(0, 6),
      newlyEstablished: [],
    },
    meters: [],
    scene: null,
    castMatrix: state.castMatrix.map((member, index) => ({
      id: `${member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "cast"}-${index + 1}`,
      name: member.name,
      kind: "npc",
      qty: 1,
      role: member.role,
      location: member.location,
      status: member.status,
      emotionalState: member.emotionalState,
      intent: member.goals[0] ?? "",
      pose: "",
      proximity: "",
      hands: "",
      awareness: "ambient",
      threat: {
        value: 0,
        pct: "0%",
        band: "none",
        color: "muted",
        note: "",
      },
      spotlight: {
        value: 50,
        pct: "50%",
        band: "present",
        color: "accent",
        trend: "unknown",
        note: "",
      },
      visualAnchor: "",
      identitySummary: `${member.role}; ${member.status}`,
      clothingSummary: "",
      goals: member.goals.slice(0, 6),
      relationships: member.relationships.slice(0, 6).map((rel) => ({ target: rel, axis: "general", value: 0 })),
      leverage: member.leverage.slice(0, 6),
      pockets: [],
      stableFacts: [],
      changed: false,
    })),
    worldState: {
      recentEnvironmentalChanges: [],
      activeHazards: [],
      rumors: [],
      secrets: state.continuityFirewall.secrets.slice(0, 8).map((secret) => ({
        secret,
        visibleHint: "",
        knownBy: [],
      })),
      loadedSigns: [],
    },
    storyState: {
      goals: [],
      conflicts: [],
      threadLoom: state.threadLoom.map((thread) => ({
        ...thread,
        priority: thread.urgency >= 5 ? "critical" : thread.urgency >= 3 ? "high" : "medium",
        progress: thread.status === "resolved" ? 10 : 0,
        pct: thread.status === "resolved" ? "100%" : "0%",
        color: thread.status === "resolved" ? "success" : "accent",
        label: thread.status,
      })),
      stakes: [],
      countdowns: [],
      autonomyQueue: [],
    },
    continuityFirewall: {
      establishedFacts: state.continuityFirewall.establishedFacts,
      antiRetconAnchors: state.kernel.constraints,
      pendingConsequences: state.continuityFirewall.pendingConsequences.slice(0, 30).map((c) => ({
        cause: c.slice(0, 500),
        pending: c.slice(0, 1600),
      })),
      offscreenState: [],
      bannedNext: [],
      impossibleNext: [],
      risks: state.continuityFirewall.risks,
      terms: [],
    },
    tools: {
      actionResolver: null,
      dialogueState: null,
      directorStyle: null,
      closenessState: null,
      imagePrompt: null,
    },
    auditLog: [{
      system: "migration",
      marker: "schemaVersion 1",
      result: "Converted to schemaVersion 2",
      repaired: false,
      notes: "Original V1 fields were preserved in their closest V2 modules.",
    }],
  });
}

export function migrateStateToCurrent(value: unknown): LoomOSState | null {
  const current = LoomOSStateSchema.safeParse(value);
  if (current.success) return current.data;

  const legacy = LegacyLoomOSStateSchema.safeParse(value);
  if (legacy.success) return migrateLegacyState(legacy.data);
  return null;
}
