import assert from "node:assert/strict";
import test from "node:test";
import { pathToFileURL } from "node:url";
import {
  createStarterModuleArtifact,
  createStarterThemeArtifact,
  parseLoomOSArtifactText,
} from "../src/shared/artifacts";
import { DEFAULT_SETTINGS } from "../src/shared/schemas";

test("Loom Pack installation correctness", async () => {
  const frontendHandlers: Array<(request: any, userId: string) => Promise<void>> = [];
  const frontendMessages: any[] = [];
  const userFiles = new Map<string, any>();
  const logs: any[] = [];

  (globalThis as any).spindle = {
    log: {
      info: (...args: any[]) => logs.push(["info", ...args]),
      warn: (...args: any[]) => logs.push(["warn", ...args]),
      error: (...args: any[]) => logs.push(["error", ...args]),
    },
    permissions: {
      has: () => true,
      getGranted: async () => ["generation", "chat_mutation", "interceptor"],
      onChanged: () => () => {},
      onDenied: () => () => {},
    },
    onFrontendMessage: (handler: any) => {
      frontendHandlers.push(handler);
      return () => {
        const index = frontendHandlers.indexOf(handler);
        if (index >= 0) frontendHandlers.splice(index, 1);
      };
    },
    sendToFrontend: (payload: any, userId: string) => {
      frontendMessages.push({ payload, userId });
    },
    on: () => () => {},
    registerInterceptor: () => {},
    userStorage: {
      getJson: async (path: string, options: any = {}) => {
        return userFiles.has(path) ? userFiles.get(path) : options.fallback;
      },
      setJson: async (path: string, value: any) => {
        userFiles.set(path, value);
      },
      exists: async (path: string) => userFiles.has(path),
      delete: async (path: string) => {
        userFiles.delete(path);
      },
      list: async (prefix: string = "") => {
        return [...userFiles.keys()]
          .filter((path) => path.startsWith(prefix))
          .map((path) => path.slice(prefix.length).replace(/^\/+/, ""));
      },
    },
    chat: {
      getMessages: async () => [],
    },
    connections: {
      list: async () => [],
      get: async () => null,
    },
    generate: {
      quiet: async () => ({ text: "" }),
    },
    tokens: {
      countText: async (text: string) => ({ total_tokens: 0 }),
    },
  } as any;

  // Dynamically import the built backend to register handlers
  const backendUrl = `${pathToFileURL(`${process.cwd()}/dist/backend.js`).href}?test=${Date.now()}`;
  await import(backendUrl);

  assert.equal(frontendHandlers.length, 1);
  const handleMessage = frontendHandlers[0]!;

  const waitForResponse = async (requestId: string, type: string) => {
    const deadline = Date.now() + 1000;
    while (Date.now() < deadline) {
      const msg = frontendMessages.find(
        (m) => m.payload.requestId === requestId && m.payload.type === type
      );
      if (msg) return msg.payload;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error(`Timeout waiting for response of type ${type} with request id ${requestId}`);
  };

  const waitForError = async (requestId: string) => {
    const deadline = Date.now() + 1000;
    while (Date.now() < deadline) {
      const msg = frontendMessages.find(
        (m) => m.payload.requestId === requestId && m.payload.type === "error"
      );
      if (msg) return msg.payload;
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    throw new Error(`Timeout waiting for error response with request id ${requestId}`);
  };

  // 1. Setup mock artifacts for test pack
  const moduleArt = createStarterModuleArtifact();
  moduleArt.id = "test_module_id";
  moduleArt.meta.name = "Test Module";

  const themeArt = createStarterThemeArtifact();
  themeArt.id = "test_theme_id";
  themeArt.meta.name = "Test Theme";

  const testPack = {
    format: "loomos-pack" as const,
    version: 1 as const,
    id: "pack_test_install",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    meta: {
      name: "Test Pack",
      description: "Pack for testing",
      author: "Test User",
      tags: [],
    },
    artifacts: [moduleArt, themeArt],
    preset: {
      name: "Test Preset",
      description: "Test Preset Desc",
      moduleSettings: {
        sceneKernel: { track: true, display: true, inject: false },
        test_module_id: { track: true, display: true, inject: true },
      },
      settings: {
        injectionTokenBudget: 500,
        developerMode: true,
      },
    },
  };

  // --- Scenario A: Library only installation ---
  userFiles.set("settings.json", DEFAULT_SETTINGS);
  userFiles.delete("artifacts/library-v2.json");
  frontendMessages.length = 0;

  await handleMessage({
    type: "install_loom_pack",
    requestId: "req-lib-only",
    pack: testPack,
    selectedArtifactIds: ["test_module_id", "test_theme_id"],
    installMode: "library_only",
    activateTheme: false,
    applyPreset: false,
  }, "user-1");

  const resLib = await waitForResponse("req-lib-only", "artifact_installed");
  assert.equal(resLib.installedIds.length, 2);
  // Settings should be completely untouched
  assert.deepEqual(resLib.settings, DEFAULT_SETTINGS);

  // Check saved records
  const library = userFiles.get("artifacts/library-v2.json");
  assert.ok(library);
  assert.equal(library.records.length, 2);
  assert.ok(library.records.some((r: any) => r.artifact.id === "test_module_id"));
  assert.ok(library.records.some((r: any) => r.artifact.id === "test_theme_id"));

  // --- Scenario B: Install Module only adds to settings.customModules ---
  userFiles.set("settings.json", DEFAULT_SETTINGS);
  frontendMessages.length = 0;

  await handleMessage({
    type: "install_loom_pack",
    requestId: "req-install-module",
    pack: testPack,
    selectedArtifactIds: ["test_module_id"],
    installMode: "modules_only",
    activateTheme: false,
    applyPreset: false,
  }, "user-1");

  const resMod = await waitForResponse("req-install-module", "artifact_installed");
  assert.equal(resMod.installedIds.length, 1);
  assert.equal(resMod.installedIds[0], "test_module_id");
  assert.ok(resMod.settings.customModules.some((m: any) => m.artifactId === "test_module_id"));
  assert.equal(resMod.settings.activeThemeId, DEFAULT_SETTINGS.activeThemeId); // Unchanged

  // --- Scenario C: Install Theme can activate activeThemeId ---
  userFiles.set("settings.json", DEFAULT_SETTINGS);
  frontendMessages.length = 0;

  await handleMessage({
    type: "install_loom_pack",
    requestId: "req-install-theme-act",
    pack: testPack,
    selectedArtifactIds: ["test_theme_id"],
    installMode: "theme_only",
    activateTheme: true,
    applyPreset: false,
  }, "user-1");

  const resThemeAct = await waitForResponse("req-install-theme-act", "artifact_installed");
  assert.equal(resThemeAct.settings.activeThemeId, "test_theme_id"); // Theme activated!

  // --- Scenario D: Keep current theme leaves activeThemeId unchanged ---
  userFiles.set("settings.json", DEFAULT_SETTINGS);
  frontendMessages.length = 0;

  await handleMessage({
    type: "install_loom_pack",
    requestId: "req-install-theme-keep",
    pack: testPack,
    selectedArtifactIds: ["test_theme_id"],
    installMode: "theme_only",
    activateTheme: false,
    applyPreset: false,
  }, "user-1");

  const resThemeKeep = await waitForResponse("req-install-theme-keep", "artifact_installed");
  assert.equal(resThemeKeep.settings.activeThemeId, DEFAULT_SETTINGS.activeThemeId); // Left unchanged!

  // --- Scenario E: Apply preset merges moduleSettings and settings budgets correctly ---
  userFiles.set("settings.json", {
    ...DEFAULT_SETTINGS,
    moduleSettings: {
      ...DEFAULT_SETTINGS.moduleSettings,
      sceneKernel: { track: false, display: false, inject: true },
      castCore: { track: true, display: true, inject: false },
    },
    developerMode: false,
  });
  frontendMessages.length = 0;

  await handleMessage({
    type: "install_loom_pack",
    requestId: "req-apply-preset",
    pack: testPack,
    selectedArtifactIds: ["test_module_id"],
    installMode: "install_all",
    activateTheme: false,
    applyPreset: true,
  }, "user-1");

  const resPreset = await waitForResponse("req-apply-preset", "artifact_installed");
  assert.equal(resPreset.settings.injectionTokenBudget, 500);
  assert.equal(resPreset.settings.developerMode, true);
  assert.equal(resPreset.settings.historyRetentionLimit, DEFAULT_SETTINGS.historyRetentionLimit);
  assert.deepEqual(resPreset.settings.moduleSettings.sceneKernel, { track: true, display: true, inject: false });
  assert.deepEqual(resPreset.settings.moduleSettings.castCore, { track: true, display: true, inject: false });
  
  const testCM = resPreset.settings.customModules.find((m: any) => m.artifactId === "test_module_id");
  assert.ok(testCM);
  assert.equal(testCM.enabled, true);
  assert.equal(testCM.display, true);
  assert.equal(testCM.inject, true);

  assert.equal(resPreset.settings.modulePreset, "custom:pack_test_install");

  // --- Scenario F: Partial install does not install unchecked artifacts ---
  userFiles.set("settings.json", DEFAULT_SETTINGS);
  userFiles.delete("artifacts/library-v2.json");
  frontendMessages.length = 0;

  await handleMessage({
    type: "install_loom_pack",
    requestId: "req-partial",
    pack: testPack,
    selectedArtifactIds: ["test_module_id"],
    installMode: "install_all",
    activateTheme: true,
    applyPreset: false,
  }, "user-1");

  const resPartial = await waitForResponse("req-partial", "artifact_installed");
  assert.equal(resPartial.installedIds.length, 1);
  assert.equal(resPartial.installedIds[0], "test_module_id");
  assert.equal(resPartial.settings.activeThemeId, DEFAULT_SETTINGS.activeThemeId);

  // --- Scenario G: Invalid pack rejects cleanly ---
  frontendMessages.length = 0;
  await handleMessage({
    type: "install_loom_pack",
    requestId: "req-invalid",
    pack: { format: "invalid-format" } as any,
    selectedArtifactIds: [],
    installMode: "install_all",
    activateTheme: false,
    applyPreset: false,
  }, "user-1");

  const resInvalid = await waitForError("req-invalid");
  assert.ok(resInvalid.message);

  // --- Scenario H: Legacy artifact import still works ---
  const legacyModuleRaw = `
  {
    "id": "legacy_weather",
    "label": "Weather Memory",
    "description": "Tracks weather.",
    "compilerInstruction": "Tracks weather.",
    "schemaFields": [
      {
        "id": "field_weather",
        "label": "Conditions",
        "key": "conditions",
        "type": "text",
        "required": true
      }
    ],
    "htmlTemplate": "<article>{{conditions}}</article>",
    "cssTemplate": "article { color: white; }",
    "allowHtmlTemplate": true
  }`;
  
  const parsedLegacy = parseLoomOSArtifactText(legacyModuleRaw);
  assert.equal(parsedLegacy.kind, "module");
  assert.equal(parsedLegacy.meta.name, "Weather Memory");
  assert.equal(parsedLegacy.version, 2);

  delete (globalThis as any).spindle;
});
