import assert from "node:assert/strict";
import test from "node:test";
import { buildCompactInjection } from "../src/shared/compact";
import { DEFAULT_SETTINGS } from "../src/shared/schemas";
import { makeState } from "./fixtures";

test("compact injection stays under the configured budget", async () => {
  const budget = 100;
  const count = async (text: string) => Math.ceil(text.length / 4);
  const settings = {
    ...DEFAULT_SETTINGS,
    injectionTokenBudget: budget,
  };
  const result = await buildCompactInjection(makeState(), settings, count);

  assert.ok(await count(result) <= budget);
  assert.match(result, /^<loomos_state>/);
  assert.match(result, /<\/loomos_state>$/);
  assert.equal(result.includes("schemaVersion"), false);
  assert.equal(result.includes('"castMatrix"'), false);
});

test("compact injection respects per-module inject controls", async () => {
  const state = makeState();
  const settings = {
    ...DEFAULT_SETTINGS,
    injectionTokenBudget: 1000,
    moduleSettings: {
      ...DEFAULT_SETTINGS.moduleSettings,
      deltas: {
        ...DEFAULT_SETTINGS.moduleSettings.deltas,
        inject: false,
      },
      inventory: {
        ...DEFAULT_SETTINGS.moduleSettings.inventory,
        inject: false,
      },
    },
  };
  const result = await buildCompactInjection(
    state,
    settings,
    async (text) => Math.ceil(text.length / 4),
  );
  assert.equal(result.includes("delta:"), false);
  assert.equal(result.includes("item.Mara"), false);
  assert.match(result, /scene:/);
});

test("compact injection includes immutable appearance only when its module injects", async () => {
  const state = makeState();
  const count = async (text: string) => Math.ceil(text.length / 4);
  const enabledSettings = {
    ...DEFAULT_SETTINGS,
    injectionTokenBudget: 1600,
    moduleSettings: {
      ...DEFAULT_SETTINGS.moduleSettings,
      appearance: {
        ...DEFAULT_SETTINGS.moduleSettings.appearance,
        inject: true,
      },
    },
  };
  const included = await buildCompactInjection(state, enabledSettings, count);
  assert.match(included, /appearance=/);
  assert.match(included, /crescent scar|Slim with subtle curves|Dark, tied back/);

  const excluded = await buildCompactInjection(state, DEFAULT_SETTINGS, count);
  assert.equal(excluded.includes("appearance="), false);
});
