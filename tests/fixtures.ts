import type {
  LoomOSCompiledState,
  LoomOSState,
  StateIdentity,
} from "../src/shared/types";

export const identity: StateIdentity = {
  chatId: "chat/alpha",
  messageId: "message beta",
  swipeId: 2,
};

export const compiledState: LoomOSCompiledState = {
  kernel: {
    scene: "A locked observatory",
    location: "North tower",
    timeframe: "Minutes before dawn",
    tone: "Tense and intimate",
    objective: "Find the missing ledger before the guards arrive.",
    summary: "Mara and Iven search the observatory while mistrust builds.",
    constraints: ["The east stair is blocked.", "The bell has not rung."],
  },
  castMatrix: [
    {
      name: "Mara",
      role: "Investigator",
      status: "Searching the upper gallery",
      location: "North tower",
      emotionalState: "Controlled panic",
      goals: ["Recover the ledger"],
      relationships: ["Distrusts Iven"],
      leverage: ["Knows the guard rotation"],
    },
  ],
  threadLoom: [
    {
      title: "The missing ledger",
      status: "escalating",
      urgency: 5,
      summary: "The ledger can expose the court.",
      nextPressure: "The guards reach the tower.",
      participants: ["Mara", "Iven"],
    },
  ],
  continuityFirewall: {
    establishedFacts: ["The east stair is blocked."],
    pendingConsequences: ["The guards are approaching."],
    secrets: ["Iven already found one torn page."],
    risks: [
      {
        severity: "high",
        issue: "Do not use the east stair.",
        evidence: "It collapsed two turns ago.",
        recommendation: "Keep movement inside the tower or use the roof.",
      },
    ],
  },
};

export function makeState(overrides: Partial<LoomOSState> = {}): LoomOSState {
  return {
    ...compiledState,
    schemaVersion: 1,
    identity,
    generatedAt: "2026-06-07T12:00:00.000Z",
    source: {
      messageCount: 12,
      repaired: false,
    },
    ...overrides,
  };
}
