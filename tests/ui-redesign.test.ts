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
  assert.match(source, /label: "Tools"/);
  assert.match(source, /label: "Setup"/);
  assert.match(source, /activeTab === "settings"/);
  assert.match(source, /stickyHeaderHtml\(true, "drawer"\)/);
  assert.match(source, /renderAll\(false\)/);
  assert.match(source, /load_history_state/);
  assert.match(source, /delete_history_state/);
  assert.match(source, /data-tab-scope/);
  assert.match(source, /viewerCoreBarHtml/);
  assert.match(source, /buildThemeDocument/);
  assert.match(source, /openCreatorWorkshop/);
  assert.match(source, /updateLiveStatusDom/);
  assert.match(source, /updateHistorySurface/);
  assert.doesNotMatch(source, /<details class="loomos-shell loomos-settings"/);
});

test("responsive design layer uses full-width grid navigation and safe areas", async () => {
  const styles = await readFile("src/frontend/styles.ts", "utf8");
  assert.match(styles, /grid-template-columns:\s*repeat\(auto-fit, minmax\(64px, 1fr\)\)/);
  assert.match(styles, /env\(safe-area-inset-bottom\)/);
  assert.match(styles, /align-content:\s*start/);
  assert.match(styles, /grid-auto-rows:\s*max-content/);
  assert.match(styles, /@container loomos-viewer/);
  assert.match(styles, /\.loomos-viewer-core/);
  assert.match(styles, /\.loomos-viewer-stage/);
  assert.match(styles, /\.loomos-theme-frame/);
  assert.match(styles, /\.loomos-workshop/);
  assert.match(styles, /\.loomos-code-editor-host/);
  assert.match(styles, /-webkit-line-clamp:\s*2/);
  assert.match(styles, /\.loomos-tools-grid/);
  assert.match(styles, /\.loomos-image-prompt-card/);
  assert.match(styles, /\.loomos-image-blueprint/);
  assert.match(styles, /\.loomos-clothing-layers/);
  assert.match(styles, /\.loomos-section\[data-section="cast"\] \.loomos-card/);
  assert.match(styles, /@media \(max-width: 380px\)/);
  assert.doesNotMatch(styles, /linear-gradient/);
  assert.doesNotMatch(styles, /content-visibility/);
  assert.doesNotMatch(styles, /backdrop-filter/);
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
  assert.match(html, /data-history-results/);
});

test("creator workshop exposes portable artifacts, code editing, and isolated preview", async () => {
  const source = await readFile("src/frontend.ts", "utf8");
  const workshop = await readFile("src/frontend/workshop.ts", "utf8");
  assert.match(source, /Creator Workshop/);
  assert.match(source, /activeThemeId/);
  assert.match(source, /developerMode/);
  assert.match(workshop, /LoomOS Creator Workshop/);
  assert.match(workshop, /CodeMirror 6/);
  assert.match(workshop, /sandbox="allow-scripts"/);
  assert.match(workshop, /data-workshop-action="duplicate"/);
  assert.match(workshop, /data-workshop-action="export"/);
  assert.match(workshop, /data-workshop-action="install"/);
});

test("tracker updates avoid global widget and surface rebuilds", async () => {
  const source = await readFile("src/frontend.ts", "utf8");
  const renderAll = source.match(/function renderAll[\s\S]*?\n  }\n\n  function updateLiveStatusDom/)?.[0] ?? "";
  assert.doesNotMatch(renderAll, /refreshAllMessageWidgets/);
  assert.match(source, /messageWidgetSignatures/);
  assert.match(source, /mountedHistoryWidgets >= 4/);
  assert.match(source, /refreshAllMessageWidgets\(syncVersion\)/);
  assert.match(source, /case "chat_states":[\s\S]*?renderMode = "none"/);
  assert.match(source, /case "state_history":[\s\S]*?renderMode = "history"/);
  assert.match(source, /updateHistoryMetadataDom/);
});

test("generation clock covers manual and automatic compiler runs", async () => {
  const source = await readFile("src/frontend.ts", "utf8");
  const styles = await readFile("src/frontend/styles.ts", "utf8");
  const preview = await readFile("preview/mock-host.js", "utf8");
  assert.match(source, /function formatElapsed/);
  assert.match(source, /startElapsedTimer\(response\.report\?\.elapsedMs \?\? 0\)/);
  assert.match(source, /data-live-elapsed/);
  assert.match(source, /Generating tracker/);
  assert.match(source, /formatElapsed\(finalElapsedMs\)/);
  assert.match(styles, /font-variant-numeric:\s*tabular-nums/);
  assert.doesNotMatch(styles, /loomos-glow-pulse/);
  assert.match(preview, /payload\.type === "generate_state"/);
  assert.match(preview, /status: "completed"/);
});
