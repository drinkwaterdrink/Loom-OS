import assert from "node:assert/strict";
import test from "node:test";
import {
  WORKSHOP_NAV,
  activeSetupCounts,
  applyWorkshopLayoutEdits,
  artifactMatchesPackFilter,
  buildWorkshopNativePreviewDocument,
  buildWorkshopThemePreviewDocument,
  mobilePreviewState,
  parseWorkshopImportText,
  saveWorkshopCodeDraft,
  selectedArtifactRecord,
  widgetMatchesModuleFilter,
  workshopInstallTarget,
  workshopSaveTarget,
} from "../src/frontend/workshopBehavior";
import {
  EMPTY_ARTIFACT_LIBRARY,
  artifactToCustomModule,
  createStarterBlueprintArtifact,
  createStarterModuleArtifact,
  createStarterThemeArtifact,
  upsertArtifactRecord,
} from "../src/shared/artifacts";
import { LoomOSSettingsSchema } from "../src/shared/schemas";
import { buildViewerModel } from "../src/shared/viewerModel";
import { makeState } from "./fixtures";

test("Workshop navigation contains every Phase 3 view in order", () => {
  assert.deepEqual(WORKSHOP_NAV.map((item) => item.id), [
    "home",
    "packs",
    "modules",
    "layout",
    "theme",
    "test-lab",
    "advanced-code",
    "revisions",
  ]);
});

test("pack filtering matches search text and artifact kind", () => {
  const module = {
    ...createStarterModuleArtifact(),
    meta: {
      ...createStarterModuleArtifact().meta,
      name: "Relationship Pressure",
      description: "Tracks changing trust.",
      tags: ["social"],
    },
  };
  const theme = createStarterThemeArtifact();
  assert.equal(artifactMatchesPackFilter(module, { query: "trust", kind: "all" }), true);
  assert.equal(artifactMatchesPackFilter(module, { query: "social", kind: "module" }), true);
  assert.equal(artifactMatchesPackFilter(module, { query: "social", kind: "theme" }), false);
  assert.equal(artifactMatchesPackFilter(theme, { query: "relationship", kind: "all" }), false);
});

test("module filtering combines source, group, status, and search", () => {
  const item = {
    search: "relationship pressure social artifact",
    source: "artifact",
    group: "Cast",
    status: "tracked",
    track: true,
    display: true,
    inject: false,
  };
  assert.equal(widgetMatchesModuleFilter(item, {
    query: "pressure",
    source: "artifact",
    group: "Cast",
    status: "displayed",
  }), true);
  assert.equal(widgetMatchesModuleFilter(item, {
    query: "",
    source: "stock",
    group: "Cast",
    status: "all",
  }), false);
  assert.equal(widgetMatchesModuleFilter({
    ...item,
    status: "warning",
    track: false,
    inject: true,
  }, {
    query: "",
    source: "all",
    group: "all",
    status: "warning",
  }), true);
});

test("layout edits keep stock and custom Track Display Inject controls synchronized", () => {
  const artifact = createStarterModuleArtifact();
  const customModule = artifactToCustomModule(artifact);
  const settings = LoomOSSettingsSchema.parse({ customModules: [customModule] });
  const customWidget = settings.layout!.widgets.find((widget) => widget.moduleId === customModule.id)!;
  const next = applyWorkshopLayoutEdits(settings, [
    {
      id: "meters",
      track: false,
      display: false,
      inject: false,
      slot: "hidden",
      displayMode: "hidden",
      tokenPriority: 4,
      order: 90,
    },
    {
      id: customWidget.id,
      track: true,
      display: false,
      inject: true,
      slot: "main",
      displayMode: "compact",
      tokenPriority: 9,
      order: 12,
    },
  ], "adaptive-grid");

  assert.deepEqual(next.moduleSettings.meters, {
    track: false,
    display: false,
    inject: false,
  });
  assert.equal(next.customModules[0]?.enabled, true);
  assert.equal(next.customModules[0]?.display, false);
  assert.equal(next.customModules[0]?.inject, true);
  assert.equal(next.layout?.responsiveMode, "adaptive-grid");
  assert.equal(next.layout?.widgets.find((widget) => widget.id === customWidget.id)?.tokenPriority, 9);
});

test("active setup counts derive from normalized layout widgets", () => {
  const settings = LoomOSSettingsSchema.parse({});
  const counts = activeSetupCounts(settings);
  assert.equal(counts.tracked, settings.layout!.widgets.filter((widget) => widget.track).length);
  assert.equal(counts.widgets, settings.layout!.widgets.filter((widget) => widget.display).length);
  assert.equal(counts.injected, settings.layout!.widgets.filter((widget) => widget.inject).length);
});

test("bottom Save routing is scoped to dirty settings or artifact changes", () => {
  assert.equal(workshopSaveTarget("layout", false, true, false), "settings");
  assert.equal(workshopSaveTarget("modules", false, true, false), "settings");
  assert.equal(workshopSaveTarget("advanced-code", true, false, true), "artifact");
  assert.equal(workshopSaveTarget("test-lab", true, false, true), "artifact");
  assert.equal(workshopSaveTarget("advanced-code", true, false, false), null);
  assert.equal(workshopSaveTarget("home", true, true, true), null);
});

test("preview builders use the real Theme runtime and native dashboard renderer", () => {
  const settings = LoomOSSettingsSchema.parse({});
  const state = makeState();
  const theme = createStarterThemeArtifact();
  const model = buildViewerModel(state, settings, [], "Workshop test");
  const themeDocument = buildWorkshopThemePreviewDocument(theme, model, false, "qa-nonce");
  const nativeDocument = buildWorkshopNativePreviewDocument(state, settings, [], "current");

  assert.match(themeDocument, /Content-Security-Policy/);
  assert.match(themeDocument, /Current scene/);
  assert.match(themeDocument, /qa-nonce/);
  assert.match(nativeDocument, /Scene pulse/);
  assert.match(nativeDocument, /data-history-count="0"/);
});

test("import detection distinguishes Loom Packs, v2 artifacts, and legacy modules", () => {
  const artifact = createStarterModuleArtifact();
  const pack = {
    format: "loomos-pack" as const,
    version: 1 as const,
    id: "pack_workshop_qa",
    meta: { name: "Workshop QA", description: "", author: "", tags: [] },
    artifacts: [artifact],
    preset: null,
  };
  const legacy = artifactToCustomModule(artifact);

  assert.equal(parseWorkshopImportText(JSON.stringify(pack)).kind, "pack");
  assert.equal(parseWorkshopImportText(JSON.stringify(artifact)).kind, "artifact");
  const legacyImport = parseWorkshopImportText(JSON.stringify(legacy));
  assert.equal(legacyImport.kind, "artifact");
  if (legacyImport.kind === "artifact") assert.equal(legacyImport.artifact.kind, "module");
});

test("invalid code drafts never send save_artifact while valid drafts do", () => {
  const artifact = createStarterModuleArtifact();
  const sent: unknown[] = [];
  const invalid = saveWorkshopCodeDraft(
    artifact,
    "schema",
    "{",
    "invalid-save",
    (request) => sent.push(request),
  );
  assert.equal(invalid.ok, false);
  assert.equal(sent.length, 0);

  const valid = saveWorkshopCodeDraft(
    artifact,
    "prompt",
    "Track grounded changes and preserve stable facts.",
    "valid-save",
    (request) => sent.push(request),
  );
  assert.equal(valid.ok, true);
  assert.equal(sent.length, 1);
  assert.equal((sent[0] as { type?: string }).type, "save_artifact");
});

test("selection, contextual installs, and mobile preview routing stay explicit", () => {
  const module = createStarterModuleArtifact();
  const theme = createStarterThemeArtifact();
  const blueprint = {
    ...createStarterBlueprintArtifact(),
    modules: [module],
    theme,
  };
  const saved = upsertArtifactRecord(EMPTY_ARTIFACT_LIBRARY, module).library;

  assert.equal(selectedArtifactRecord(saved, module.id)?.artifact.id, module.id);
  assert.equal(selectedArtifactRecord(saved, "missing"), null);
  assert.equal(workshopInstallTarget("modules", module, null, theme), null);
  assert.equal(workshopInstallTarget("theme", module, null, theme)?.id, theme.id);
  assert.equal(workshopInstallTarget("test-lab", module, blueprint, theme)?.id, blueprint.id);
  assert.equal(mobilePreviewState(false, "open"), true);
  assert.equal(mobilePreviewState(true, "close"), false);
  assert.equal(mobilePreviewState(false, "toggle"), true);
});
