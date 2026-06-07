import assert from "node:assert/strict";
import test from "node:test";
import { migrateStateToCurrent } from "../src/shared/migrations";
import {
  DEFAULT_SETTINGS,
  LoomOSSettingsSchema,
  LoomOSStateSchema,
} from "../src/shared/schemas";
import { makeState } from "./fixtures";

test("legacy settings receive V2 module defaults and panel visibility", () => {
  const settings = LoomOSSettingsSchema.parse({
    skin: "noir",
    autoGeneration: "manual",
    injectionEnabled: false,
    injectionTokenBudget: 320,
    recentMessageLimit: 24,
    connectionId: "",
    panels: {
      kernel: true,
      castMatrix: false,
      threadLoom: true,
      continuityFirewall: true,
    },
  });
  assert.equal(settings.schemaVersion, 2);
  assert.equal(settings.moduleSettings.sceneKernel.track, true);
  assert.equal(settings.moduleSettings.castCore.display, false);
  assert.equal(settings.moduleSettings.actionResolver.track, true);
  assert.equal(settings.historyRetentionLimit, 100);
});

test("legacy State V1 migrates without losing exact identity", () => {
  const legacy = {
    schemaVersion: 1,
    identity: { chatId: "chat", messageId: "message", swipeId: 3 },
    generatedAt: "2026-06-01T12:00:00.000Z",
    source: { messageCount: 4, repaired: false },
    kernel: {
      scene: "Archive",
      location: "Tower",
      timeframe: "Dawn",
      tone: "Tense",
      objective: "Find the page",
      summary: "The search continues.",
      constraints: ["East stair blocked"],
    },
    castMatrix: [{
      name: "Mara",
      role: "Investigator",
      status: "Searching",
      location: "Tower",
      emotionalState: "Focused",
      goals: ["Find the page"],
      relationships: [],
      leverage: [],
    }],
    threadLoom: [{
      title: "Missing page",
      status: "active",
      urgency: 3,
      summary: "The page is missing.",
      nextPressure: "Guards arrive.",
      participants: ["Mara"],
    }],
    continuityFirewall: {
      establishedFacts: ["East stair blocked"],
      pendingConsequences: ["Guards arrive"],
      secrets: ["Iven has the page"],
      risks: [],
    },
  };
  const migrated = migrateStateToCurrent(legacy);
  assert.ok(migrated);
  assert.equal(migrated.schemaVersion, 2);
  assert.deepEqual(migrated.identity, legacy.identity);
  assert.equal(migrated.storyState.threadLoom[0]?.title, "Missing page");
  assert.equal(migrated.worldState?.secrets[0]?.secret, "Iven has the page");
  assert.equal(LoomOSStateSchema.safeParse(migrated).success, true);
});

test("current V2 states pass through migration unchanged", () => {
  const current = makeState();
  assert.deepEqual(migrateStateToCurrent(current), current);
  assert.equal(DEFAULT_SETTINGS.modulePreset, "balanced");
});
