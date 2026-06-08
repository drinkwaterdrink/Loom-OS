import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { renderDashboard, renderHistoryTab } from "../src/frontend/render";
import { DEFAULT_SETTINGS } from "../src/shared/schemas";
import { makeState } from "./fixtures";

test("mobile workspace uses compact navigation and a dedicated setup view", async () => {
  const source = await readFile("src/frontend.ts", "utf8");
  assert.match(source, /label: "Pulse"/);
  assert.match(source, /label: "Memory"/);
  assert.match(source, /label: "Setup"/);
  assert.match(source, /activeTab === "settings"/);
  assert.match(source, /stickyHeaderHtml\(true, "drawer"\)/);
  assert.match(source, /renderAll\(false\)/);
  assert.match(source, /load_history_state/);
  assert.match(source, /delete_history_state/);
  assert.match(source, /data-tab-scope/);
  assert.match(source, /viewerCommandHtml/);
  assert.doesNotMatch(source, /<details class="loomos-shell loomos-settings"/);
});

test("responsive design layer uses full-width grid navigation and safe areas", async () => {
  const styles = await readFile("src/frontend/styles.ts", "utf8");
  assert.match(styles, /grid-template-columns:\s*repeat\(auto-fit, minmax\(64px, 1fr\)\)/);
  assert.match(styles, /env\(safe-area-inset-bottom\)/);
  assert.match(styles, /align-content:\s*start/);
  assert.match(styles, /grid-auto-rows:\s*max-content/);
  assert.match(styles, /@container loomos-viewer/);
  assert.match(styles, /\.loomos-viewer-command/);
  assert.match(styles, /\.loomos-section\[data-section="cast"\] \.loomos-card/);
  assert.match(styles, /@media \(max-width: 380px\)/);
  assert.doesNotMatch(styles, /linear-gradient/);
});

test("preview server serves browser modules with a JavaScript MIME type", async () => {
  const server = await readFile("scripts/serve-preview.mjs", "utf8");
  const preview = await readFile("preview/index.html", "utf8");
  assert.match(server, /"\.mjs": "text\/javascript; charset=utf-8"/);
  assert.match(preview, /src="\.\/mock-host\.js"/);
});

test("scene pulse and cast render as scan-first mobile content", () => {
  const state = makeState();
  const overview = renderDashboard(state, DEFAULT_SETTINGS, "overview");
  const cast = renderDashboard(state, DEFAULT_SETTINGS, "cast");
  assert.match(overview, /Scene pulse/);
  assert.match(overview, /Review changes/);
  assert.match(overview, /loomos-overview-stats/);
  assert.match(cast, /loomos-cast-meta/);
  assert.match(cast, /loomos-cast-summary/);
  assert.match(cast, /data-section="cast" open/);
});

test("history uses a compact archive heading and search surface", () => {
  const html = renderHistoryTab([], "", null);
  assert.match(html, /Exact-swipe archive/);
  assert.match(html, /Tracker history/);
  assert.match(html, /Search scene, focus, or location/);
});

test("schema studio exposes viewer editing and per-module portability", async () => {
  const source = await readFile("src/frontend.ts", "utf8");
  assert.match(source, /Schema & Presentation Studio/);
  assert.match(source, /data-studio-action="edit-viewer"/);
  assert.match(source, /data-studio-action="import-module"/);
  assert.match(source, /data-studio-action="export-stock"/);
  assert.match(source, /data-studio-action="export-custom"/);
});
