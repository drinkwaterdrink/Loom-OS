import assert from "node:assert/strict";
import test from "node:test";
import {
  renderDashboard,
  renderHistoryTab,
  renderInjectionPreview,
  renderWhatChangedModal,
} from "../src/frontend/render";
import { DEFAULT_SETTINGS, LoomOSSettingsSchema } from "../src/shared/schemas";
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
  const match = html.match(/data-action="delete-history-state"/g);
  assert.equal(match?.length, 2);
  assert.match(html, /data-action="load-history-state"/);
  assert.match(html, /data-chat-id="chat\/alpha"/);
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

test("cast dashboard renders detailed appearance and clothing profiles", async () => {
  const state = makeState();
  const html = renderDashboard(state, DEFAULT_SETTINGS, "cast");
  assert.match(html, /Detailed Appearance/);
  assert.match(html, /Detailed Clothing/);
  assert.match(html, /Slim with subtle curves/);
  assert.match(html, /Compact and rounded/);
  assert.match(html, /Expressive grey eyes/);
  assert.match(html, /A faint crescent scar beneath the left eye/);
  assert.match(html, /Dark tied-back hair/);
  assert.match(html, /charcoal wool investigator/);
  assert.match(html, /Materials &amp; texture/);
  assert.match(html, /Current State & Inventory/);
});

test("tools workspace explains when image prompt needs a refreshed tracker", () => {
  const settings = LoomOSSettingsSchema.parse({
    ...DEFAULT_SETTINGS,
    moduleSettings: {
      ...DEFAULT_SETTINGS.moduleSettings,
      imagePrompt: { track: true, display: true, inject: false },
    },
  });
  const html = renderDashboard(makeState(), settings, "tools");
  assert.match(html, /Creative utilities/);
  assert.match(html, /Image Prompt/);
  assert.match(html, /Refresh needed/);
  assert.match(html, /data-action="generate"/);
});

test("image prompt renders its complete generator payload and copy action", () => {
  const settings = LoomOSSettingsSchema.parse({
    ...DEFAULT_SETTINGS,
    moduleSettings: {
      ...DEFAULT_SETTINGS.moduleSettings,
      imagePrompt: { track: true, display: true, inject: false },
    },
  });
  const state = makeState();
  state.activeModules.push("imagePrompt");
  state.tools.imagePrompt = {
    aspect: "16:9",
    shot: "Wide establishing shot",
    medium: "Cinematic digital painting",
    subject: "Mara and Iven in the rain-lit observatory.",
    positive: "Copper dome, moonlight, wet wool, tense expressions.",
    negative: "Text, watermark, extra fingers.",
    intent: "A continuity-accurate dramatic scene illustration.",
    composition: "Mara occupies the left third and Iven the right third.",
    camera: "Eye-level 35mm environmental portrait.",
    lighting: "Cold moonlight with one warm lantern key.",
    colorPalette: "Copper, charcoal, smoke blue, and amber.",
    environment: "A rain-lashed brass observatory.",
    characterContinuity: "Preserve Mara's grey eyes, dark low knot, crescent scar, and fitted charcoal coat.",
    action: "Mara studies the soot on Iven's glove.",
    materials: "Wet wool, worn leather, aged brass, rain-streaked glass.",
    mood: "Tense, intimate, conspiratorial.",
    textRendering: "No text, captions, signatures, or watermarks.",
    constraints: ["Exactly two adult characters", "Hands visible and anatomically coherent"],
    full: "INTENT: A continuity-accurate dramatic scene illustration.\n\nSCENE: Wide cinematic view of Mara and Iven in a rain-lit observatory.",
    hint: "Keep both characters readable.",
  };
  const html = renderDashboard(state, settings, "tools");
  assert.match(html, /Wide cinematic view/);
  assert.match(html, /GPT Image production brief/);
  assert.match(html, /Structured art direction/);
  assert.match(html, /Character continuity/);
  assert.match(html, /Exactly two adult characters/);
  assert.match(html, /Positive guidance/);
  assert.match(html, /Negative guidance/);
  assert.match(html, /data-action="copy-image-prompt"/);
  assert.match(html, /16:9/);
});

test("stock presentation can use the safe starter HTML with custom CSS only", () => {
  const settings = LoomOSSettingsSchema.parse({
    ...DEFAULT_SETTINGS,
    stockModuleOverrides: {
      sceneKernel: {
        presentationEnabled: true,
        cssTemplate: ".module-frame { border-width: 2px; }",
      },
    },
  });
  const html = renderDashboard(makeState(), settings, "overview");
  assert.match(html, /data-module-presentation="sceneKernel"/);
  assert.match(html, /loomos-cmod-stock-scenekernel/);
  assert.match(html, /class="module-frame"/);
  assert.match(html, /border-width: 2px/);
});
