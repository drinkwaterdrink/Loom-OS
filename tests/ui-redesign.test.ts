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

test("creator workshop exposes the Phase 3 navigation and responsive workspace", async () => {
  const source = await readFile("src/frontend.ts", "utf8");
  const workshop = await readFile("src/frontend/workshop.ts", "utf8");
  const behavior = await readFile("src/frontend/workshopBehavior.ts", "utf8");
  const styles = await readFile("src/frontend/styles.ts", "utf8");
  assert.match(source, /Creator Workshop/);
  assert.match(source, /activeThemeId/);
  assert.match(source, /developerMode/);
  assert.match(workshop, /LoomOS Creator Workshop/);
  for (const view of ["home", "packs", "modules", "layout", "theme", "test-lab", "advanced-code", "revisions"]) {
    assert.match(behavior, new RegExp(`id: "${view}"`));
  }
  assert.match(workshop, /loomos-workshop-rail/);
  assert.match(workshop, /loomos-workshop-preview-pane/);
  assert.match(workshop, /loomos-workshop-bottom-actions/);
  assert.match(workshop, /loomos-mobile-preview/);
  assert.match(styles, /grid-template-columns:\s*minmax\(190px, 224px\) minmax\(420px, 1fr\) minmax\(310px, 390px\)/);
  assert.match(styles, /@media \(max-width: 760px\)/);
  assert.match(styles, /\.loomos-workshop-bottom-actions/);
  assert.match(styles, /div:has\(> \.loomos-workshop-root\)/);
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /overflow-x:\s*hidden/);
});

test("creator workshop preserves artifact, Loom Pack, layout, and advanced code actions", async () => {
  const workshop = await readFile("src/frontend/workshop.ts", "utf8");
  assert.match(workshop, /CodeMirror 6/);
  assert.match(workshop, /sandbox="allow-scripts"/);
  for (const action of [
    "create",
    "import",
    "open-export-pack",
    "export-artifact",
    "duplicate-artifact",
    "install-artifact",
    "delete-artifact",
    "save",
    "restore",
    "generate-ai",
    "preview-artifact",
  ]) {
    assert.match(workshop, new RegExp(`data-workshop-action="${action}"`));
  }
  assert.match(workshop, /install_loom_pack/);
  assert.match(workshop, /LoomPackSchema\.parse/);
  assert.match(workshop, /layout:\s*settings\.layout/);
  assert.match(workshop, /data-layout-action="reset-layout"/);
  assert.match(workshop, /data-layout-action="save-layout"/);
  assert.match(workshop, /function saveLayoutFromDOM/);
});

test("advanced code and preview keep valid-artifact and sandbox boundaries", async () => {
  const workshop = await readFile("src/frontend/workshop.ts", "utf8");
  const behavior = await readFile("src/frontend/workshopBehavior.ts", "utf8");
  assert.match(workshop, /activeView !== "advanced-code"/);
  assert.match(workshop, /applyWorkshopCodeValue\(workingArtifact, codeSection, codeDraft\)/);
  assert.match(workshop, /saveWorkshopCodeDraft/);
  assert.match(workshop, /Draft contains invalid data and has not replaced the last valid revision/);
  assert.match(workshop, /LoomOSArtifactSchema\.parse\(workingArtifact\)/);
  assert.match(workshop, /buildViewerModel\(previewState, settings, history, "Workshop preview"\)/);
  assert.match(workshop, /enrichViewerModelWithLayout/);
  assert.match(behavior, /buildThemeDocument/);
  assert.match(behavior, /renderDashboard/);
  assert.match(workshop, /nativePreviewDocument/);
  assert.match(workshop, /inspectLayoutDiagnostics/);
  assert.match(workshop, /inspectThemeComplexity/);
  assert.match(workshop, /Developer Mode/);
  assert.doesNotMatch(`${workshop}\n${behavior}`, /\beval\s*\(/);
  assert.doesNotMatch(`${workshop}\n${behavior}`, /new Function/);
});

test("creator workshop exposes unified module and theme controls", async () => {
  const workshop = await readFile("src/frontend/workshop.ts", "utf8");
  assert.match(workshop, /let settings = LoomOSSettingsSchema\.parse\(options\.settings\)/);
  assert.match(workshop, /settings = LoomOSSettingsSchema\.parse\(nextSettings\)/);
  assert.match(workshop, /Unified module manager/);
  assert.match(workshop, /data-widget-property="track"/);
  assert.match(workshop, /data-widget-property="display"/);
  assert.match(workshop, /data-widget-property="inject"/);
  assert.match(workshop, /data-widget-property="slot"/);
  assert.match(workshop, /data-widget-property="displayMode"/);
  assert.match(workshop, /Core · Track locked/);
  assert.match(workshop, /Theme references missing layout slot/);
  assert.match(workshop, /Install & Activate/);
  assert.match(workshop, /data-workshop-action="install"/);
});

test("Phase 4 visual builders remain mobile-first and keep Advanced Code available", async () => {
  const workshop = await readFile("src/frontend/workshop.ts", "utf8");
  const builders = await readFile("src/shared/visualBuilders.ts", "utf8");
  const styles = await readFile("src/frontend/styles.ts", "utf8");
  assert.match(workshop, /Module Builder/);
  assert.match(workshop, /Field Builder/);
  assert.match(workshop, /Theme Builder/);
  assert.match(workshop, /Design Tokens/);
  assert.match(workshop, /open-advanced-code/);
  assert.match(workshop, /data-design-token/);
  assert.match(workshop, /data-ai-mode="create"/);
  assert.match(workshop, /data-ai-mode="refine"/);
  assert.match(workshop, /Generate a separate new Module, Theme, or Blueprint/);
  assert.match(workshop, /Revise the currently selected artifact/);
  assert.match(workshop, /aiBrief/);
  assert.match(workshop, /aiCreatorGenerateRequest\(aiMode, aiKind, workingArtifact/);
  assert.match(workshop, /chooseArtifact\(stagedArtifact, false\)/);
  assert.match(workshop, /activeView = "test-lab"/);
  assert.match(workshop, /Invalid form input stays visible in the editor/);
  assert.match(workshop, /syncMobilePreviewOverlay/);
  assert.match(workshop, /visualDraftValid/);
  assert.match(workshop, /Install blocked\. Fix the invalid visual draft first/);
  assert.match(workshop, /JavaScript runs only when this flag and the user's LoomOS Developer Mode setting/);
  assert.match(builders, /visualFieldsToJsonSchema/);
  assert.match(builders, /parseJsonSchemaToVisualFields/);
  assert.match(styles, /\.loomos-visual-form-grid/);
  assert.match(styles, /\.loomos-token-grid/);
  assert.match(styles, /\.loomos-ai-mode-row/);
  assert.match(styles, /min-height:\s*44px/);
  assert.match(styles, /\.loomos-field-enum/);
  assert.match(styles, /overflow-wrap: anywhere/);
  assert.doesNotMatch(builders, /\beval\s*\(|new Function|Function\s*\(/);
  assert.doesNotMatch(builders, /fetch\s*\(|XMLHttpRequest|WebSocket/);
});

test("Phase 5 block-level AI refinement UI is exposed without replacing full AI Creator", async () => {
  const workshop = await readFile("src/frontend/workshop.ts", "utf8");
  const styles = await readFile("src/frontend/styles.ts", "utf8");
  const protocol = await readFile("src/shared/protocol.ts", "utf8");
  assert.match(protocol, /refine_artifact_block/);
  assert.match(protocol, /cancel_artifact_block_refinement/);
  assert.match(protocol, /artifact_block_refinement_status/);
  assert.match(workshop, /Refine this block/);
  assert.match(workshop, /data-block-refine-instruction/);
  assert.match(workshop, /Apply Block Change/);
  assert.match(workshop, /discard-block-refine/);
  assert.match(workshop, /Refine metadata/);
  assert.match(workshop, /Refine field schema/);
  assert.match(workshop, /Refine module HTML/);
  assert.match(workshop, /Refine design tokens/);
  assert.match(workshop, /Refine theme CSS/);
  assert.match(workshop, /Generate Draft/);
  assert.match(workshop, /Generate Revision/);
  assert.match(styles, /\.loomos-block-refine/);
  assert.match(styles, /\.loomos-block-diff/);
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
