import assert from "node:assert/strict";
import test from "node:test";
import {
  WORKSHOP_NAV,
  aiCreatorCurrentArtifact,
  aiCreatorGenerateRequest,
  aiCreatorSelectedKind,
  activeSetupCounts,
  applyWorkshopCodeValue,
  applyWorkshopLayoutEdits,
  artifactMatchesPackFilter,
  blockRefinementResponseCanStage,
  buildWorkshopNativePreviewDocument,
  buildWorkshopThemePreviewDocument,
  externalBuilderPrompt,
  mobilePreviewState,
  normalizeAiCreatorMode,
  parseWorkshopImportText,
  saveWorkshopCodeDraft,
  selectedArtifactRecord,
  widgetMatchesModuleFilter,
  workshopInstallTarget,
  workshopSaveLabel,
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
import { findArtifactBlockTarget } from "../src/shared/artifactBlocks";
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

test("bottom Save labels match visual artifact and settings actions", () => {
  assert.equal(workshopSaveLabel("modules", null, true), "Save Revision");
  assert.equal(workshopSaveLabel("theme", "artifact", true), "Save Revision");
  assert.equal(workshopSaveLabel("modules", "settings", false), "Save Modules");
  assert.equal(workshopSaveLabel("layout", "settings", false), "Save Layout");
});

test("AI Creator create mode routes kind selection independently of selected artifact", () => {
  const theme = createStarterThemeArtifact();
  assert.equal(normalizeAiCreatorMode("create", true), "create");
  assert.equal(aiCreatorSelectedKind("create", "module", theme), "module");
  assert.equal(aiCreatorSelectedKind("create", "blueprint", theme), "blueprint");
  assert.equal(aiCreatorCurrentArtifact("create", theme), null);

  const request = aiCreatorGenerateRequest(
    "create",
    "blueprint",
    theme,
    "ai-create",
    "Build a tracker pack.",
  );
  assert.equal(request.kind, "blueprint");
  assert.equal(request.currentArtifact, null);
});

test("AI Creator refine mode routes to the selected artifact and keeps create fallback safe", () => {
  const theme = createStarterThemeArtifact();
  assert.equal(normalizeAiCreatorMode("refine", false), "create");
  assert.equal(aiCreatorSelectedKind("refine", "module", null), "module");
  assert.equal(aiCreatorSelectedKind("refine", "module", theme), "theme");
  assert.equal(aiCreatorCurrentArtifact("refine", theme)?.id, theme.id);

  const request = aiCreatorGenerateRequest(
    "refine",
    "module",
    theme,
    "ai-refine",
    "Tighten the active theme.",
  );
  assert.equal(request.kind, "theme");
  assert.equal(request.currentArtifact?.id, theme.id);
});

test("AI Creator external prompts use create kind or refine selected artifact", () => {
  const theme = createStarterThemeArtifact();
  const createPrompt = externalBuilderPrompt(aiCreatorSelectedKind("create", "module", theme));
  assert.match(createPrompt, /kind "module"/);
  assert.doesNotMatch(createPrompt, /REFINE CURRENT ARTIFACT/);

  const refinePrompt = externalBuilderPrompt(
    aiCreatorSelectedKind("refine", "module", theme),
    aiCreatorCurrentArtifact("refine", theme),
  );
  assert.match(refinePrompt, /kind "theme"/);
  assert.match(refinePrompt, /REFINE CURRENT ARTIFACT/);
  assert.match(refinePrompt, new RegExp(theme.id));
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

test("valid Advanced Code edits synchronize visual Module and Theme metadata", () => {
  const module = createStarterModuleArtifact();
  const editedModule = applyWorkshopCodeValue(module, "defaults", JSON.stringify({
    defaults: module.defaults,
    capabilities: module.capabilities,
    visual: {
      ...module.visual,
      trackingPurpose: "Track a revised purpose.",
      outputMode: "chips",
    },
  }));
  assert.equal(editedModule.kind, "module");
  if (editedModule.kind === "module") {
    assert.equal(editedModule.visual?.trackingPurpose, "Track a revised purpose.");
    assert.equal(editedModule.visual?.outputMode, "chips");
  }

  const theme = createStarterThemeArtifact();
  const editedTheme = applyWorkshopCodeValue(theme, "manifest", JSON.stringify({
    manifest: theme.manifest,
    design: {
      ...theme.design,
      tokens: { ...theme.design?.tokens, accent: "#abcdef" },
    },
  }));
  assert.equal(editedTheme.kind, "theme");
  if (editedTheme.kind === "theme") assert.equal(editedTheme.design?.tokens.accent, "#abcdef");
});

test("invalid Advanced Code edits retain the last valid visual artifact", () => {
  const module = createStarterModuleArtifact();
  assert.throws(() => applyWorkshopCodeValue(module, "defaults", JSON.stringify({
    defaults: module.defaults,
    capabilities: module.capabilities,
    visual: {
      ...module.visual,
      outputMode: "unsupported",
    },
  })), /Invalid enum value/);
  assert.equal(module.visual?.outputMode, "cards");

  const theme = createStarterThemeArtifact();
  assert.throws(() => applyWorkshopCodeValue(theme, "manifest", JSON.stringify({
    manifest: { ...theme.manifest, minWidth: 100 },
    design: theme.design,
  })), /greater than or equal to 280/);
  assert.equal(theme.manifest.minWidth, 320);
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
  assert.equal(workshopInstallTarget("modules", module, null, theme)?.id, module.id);
  assert.equal(workshopInstallTarget("theme", module, null, theme)?.id, theme.id);
  assert.equal(workshopInstallTarget("test-lab", module, blueprint, theme)?.id, blueprint.id);
  assert.equal(mobilePreviewState(false, "open"), true);
  assert.equal(mobilePreviewState(true, "close"), false);
  assert.equal(mobilePreviewState(false, "toggle"), true);
});

test("block refinement responses stage only for the active artifact request and target", () => {
  const module = createStarterModuleArtifact();
  const theme = createStarterThemeArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  const response = {
    type: "artifact_block_refinement_status" as const,
    requestId: "block-1",
    status: "completed" as const,
    message: "done",
    elapsedMs: 120,
    attempt: 1 as const,
    artifact: { ...module, prompt: "Track only grounded trust changes." },
    result: {
      target,
      replacementValue: "Track only grounded trust changes.",
      summary: "Prepared prompt.",
      warnings: [],
      changedPaths: ["prompt"],
      repaired: false,
      issues: [],
    },
  };

  assert.equal(blockRefinementResponseCanStage(response, "block-1", module, "prompt"), true);
  assert.equal(blockRefinementResponseCanStage(response, "block-2", module, "prompt"), false);
  assert.equal(blockRefinementResponseCanStage(response, "block-1", theme, "prompt"), false);
  assert.equal(blockRefinementResponseCanStage(response, "block-1", module, "view.css"), false);
  assert.equal(blockRefinementResponseCanStage(response, "block-1", module, "prompt", new Set(["block-1"])), false);
});
