import assert from "node:assert/strict";
import test from "node:test";
import {
  renderHistoryTab,
  renderInjectionPreview,
  renderWhatChangedModal,
} from "../src/frontend/render";
import { DEFAULT_SETTINGS } from "../src/shared/schemas";
import { makeState } from "./fixtures";
import type { StateHistoryItem, InjectionPreview, StateIdentity } from "../src/shared/types";

const historyItems: StateHistoryItem[] = [
  {
    identity: { chatId: "chat/alpha", messageId: "message alpha", swipeId: 0 },
    generatedAt: "2026-06-07T11:00:00.000Z",
    schemaVersion: 2,
    kernelScene: "A locked observatory",
    kernelFocus: "Search the telescope dais.",
    kernelLocation: "North tower",
    kernelTime: "Minutes before dawn",
    deltaHeadline: "Iven concealed a torn ledger page.",
    castCount: 2,
    threadCount: 1,
    riskCount: 1,
    repaired: false,
    seedIdentity: null,
    activeModuleCount: 8,
  },
  {
    identity: { chatId: "chat/alpha", messageId: "message beta", swipeId: 2 },
    generatedAt: "2026-06-07T12:00:00.000Z",
    schemaVersion: 2,
    kernelScene: "A locked observatory",
    kernelFocus: "Choose an escape route.",
    kernelLocation: "North tower",
    kernelTime: "Minutes before dawn",
    deltaHeadline: "Mara found a loose board.",
    castCount: 2,
    threadCount: 2,
    riskCount: 0,
    repaired: true,
    seedIdentity: null,
    activeModuleCount: 8,
  },
];

test("renderHistoryTab renders empty state", () => {
  const html = renderHistoryTab([], "", null);
  assert.match(html, /No matching history entries/);
  assert.doesNotMatch(html, /loomos-history-entry/);
});

test("renderHistoryTab renders items when present", () => {
  const html = renderHistoryTab(historyItems, "", null);
  assert.match(html, /message alpha/);
  assert.match(html, /message beta/);
  assert.match(html, /Search the telescope dais/);
  assert.match(html, /Choose an escape route/);
});

test("renderHistoryTab filters by search term", () => {
  const html = renderHistoryTab(historyItems, "escape", null);
  assert.doesNotMatch(html, /message alpha/);
  assert.match(html, /Choose an escape route/);
});

test("renderHistoryTab highlights active entry", () => {
  const html = renderHistoryTab(historyItems, "", {
    chatId: "chat/alpha",
    messageId: "message beta",
    swipeId: 2,
  });
  assert.match(html, /loomos-history-active/);
});

test("renderHistoryTab shows delete buttons", () => {
  const html = renderHistoryTab(historyItems, "", null);
  const match = html.match(/data-loomos-action="delete-history-state"/g);
  assert.equal(match?.length, 2);
});

test("renderInjectionPreview shows within budget", () => {
  const preview: InjectionPreview = {
    text: "<loomos_state>test</loomos_state>",
    estimatedTokens: 50,
    budget: 200,
    withinBudget: true,
    includedModules: ["kernel", "deltas"],
    omittedModules: ["meters"],
    warning: null,
  };
  const html = renderInjectionPreview(preview);
  assert.match(html, /50 \/ 200 tokens/);
  assert.match(html, /loomos-badge-ok/);
  assert.match(html, /kernel/);
  assert.match(html, /meters/);
  assert.doesNotMatch(html, /Warning/);
});

test("renderInjectionPreview shows over budget", () => {
  const preview: InjectionPreview = {
    text: "<loomos_state>test</loomos_state>",
    estimatedTokens: 950,
    budget: 500,
    withinBudget: false,
    includedModules: ["kernel"],
    omittedModules: [],
    warning: "Budget exceeded by 450 tokens",
  };
  const html = renderInjectionPreview(preview);
  assert.match(html, /loomos-badge-over/);
  assert.match(html, /Budget exceeded/);
});

test("renderWhatChangedModal renders all sections", () => {
  const state = makeState();
  const html = renderWhatChangedModal(state);
  assert.match(html, /What Changed/);
  assert.match(html, /Iven concealed a torn ledger page/);
  assert.match(html, /Iven now holds a torn ledger page/);
  assert.match(html, /The east stair remains blocked/);
  assert.match(html, /Iven found one torn page/);
  assert.match(html, /North tower/);
  assert.match(html, /Minutes before dawn/);
});

test("enhanced renderContinuity renders explainer and metrics", async () => {
  const state = makeState();
  const { renderDashboard } = await import("../src/frontend/render");
  const html = renderDashboard(state, DEFAULT_SETTINGS, "continuity");
  assert.match(html, /Continuity Firewall/);
  assert.match(html, /established facts/);
  assert.match(html, /1 risks/);
  assert.match(html, /loomos-continuity-explainer/);
  assert.match(html, /loomos-continuity-metric-value/);
  assert.match(html, /loomos-continuity-risk-guardrail/);
  assert.match(html, /Do not use the east stair/);
});

test("cast dashboard renders the dedicated immutable appearance profile", async () => {
  const state = makeState();
  const { renderDashboard } = await import("../src/frontend/render");
  const html = renderDashboard(state, DEFAULT_SETTINGS, "cast");
  assert.match(html, /Immutable Appearance/);
  assert.match(html, /Slim with subtle curves/);
  assert.match(html, /Modest/);
  assert.match(html, /A faint crescent scar beneath the left eye/);
  assert.match(html, /Dark tied-back hair/);
});
