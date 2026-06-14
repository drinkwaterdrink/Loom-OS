import type {
  ChatMessageDTO,
  ConnectionProfileDTO,
  GenerationEndedPayloadDTO,
  LlmMessageDTO,
  MessageSwipedPayloadDTO,
  SwipeEditedPayloadDTO,
} from "lumiverse-spindle-types";
import { compileStateWithRepair } from "./backend/compiler";
import { runQuietGeneration } from "./backend/generation";
import { generateArtifactWithRepair } from "./backend/artifactGeneration";
import {
  deleteArtifact,
  loadArtifactLibrary,
  restoreArtifact,
  saveArtifact,
} from "./backend/artifactStorage";
import { buildCompactInjection } from "./shared/compact";
import { migrateStateToCurrent } from "./shared/migrations";
import { trackedModuleKeys, MODULE_KEYS } from "./shared/modules";
import type {
  BackendResponse,
  FrontendRequest,
  IdentityRequest,
} from "./shared/protocol";
import {
  DEFAULT_SETTINGS,
  LoomOSSettingsSchema,
  LoomOSStateSchema,
  StateHistoryItemSchema,
  StateIdentitySchema,
} from "./shared/schemas";
import { buildStateSeedForCompiler } from "./shared/seed";
import {
  encodeStorageSegment,
  messageStatePrefix,
  parseChatStateStoragePath,
  resolveStorageListPath,
  SETTINGS_PATH,
  stateStoragePath,
} from "./shared/storage";
import type {
  ConnectionSummary,
  GenerationPhase,
  InjectionPreview,
  LoomOSSettings,
  LoomOSState,
  ModuleKey,
  PermissionSnapshot,
  StateHistoryItem,
  StateIdentity,
} from "./shared/types";
import {
  LoomOSArtifactSchema,
  artifactToCustomModule,
  type LoomOSArtifact,
  type ModuleCapsuleArtifact,
  type ThemeArtifact,
} from "./shared/artifacts";

declare const spindle: import("lumiverse-spindle-types").SpindleAPI;

const EXTENSION_ID = "loomos_command_deck";
const disposers: Array<() => void> = [];
const activeChatByUser = new Map<string, string>();
const usersByChat = new Map<string, Set<string>>();
const jobs = new Map<string, { controller: AbortController; identityKey: string }>();
const jobByIdentity = new Map<string, string>();
const automaticGenerationKeys = new Set<string>();

let interceptorRegistered = false;
let interceptorEnabled = spindle.permissions.has("interceptor");
let disposed = false;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function permissionSnapshot(): PermissionSnapshot {
  return {
    generation: spindle.permissions.has("generation"),
    interceptor: spindle.permissions.has("interceptor"),
    chatMutation: spindle.permissions.has("chat_mutation"),
  };
}

function send(payload: BackendResponse, userId: string): void {
  if (!disposed) spindle.sendToFrontend(payload, userId);
}

function rememberUserChat(userId: string, chatId: string | null): void {
  const previous = activeChatByUser.get(userId);
  if (previous && previous !== chatId) {
    const previousUsers = usersByChat.get(previous);
    previousUsers?.delete(userId);
    if (previousUsers?.size === 0) usersByChat.delete(previous);
  }
  if (!chatId) {
    activeChatByUser.delete(userId);
    return;
  }
  activeChatByUser.set(userId, chatId);
  const users = usersByChat.get(chatId) ?? new Set<string>();
  users.add(userId);
  usersByChat.set(chatId, users);
}

function eventUsers(chatId: string, eventUserId?: string): string[] {
  if (eventUserId) {
    rememberUserChat(eventUserId, chatId);
    return [eventUserId];
  }
  return [...(usersByChat.get(chatId) ?? [])];
}

async function getSettings(userId: string): Promise<LoomOSSettings> {
  const raw = await spindle.userStorage.getJson<unknown>(SETTINGS_PATH, {
    fallback: DEFAULT_SETTINGS,
    userId,
  });
  const parsed = LoomOSSettingsSchema.safeParse(raw);
  if (parsed.success) {
    if (!isRecord(raw) || raw.schemaVersion !== 2) {
      await spindle.userStorage.setJson(SETTINGS_PATH, parsed.data, {
        indent: 2,
        userId,
      });
    }
    return parsed.data;
  }
  spindle.log.warn("Invalid LoomOS settings found; defaults will be used.");
  return DEFAULT_SETTINGS;
}

async function saveSettings(
  settings: LoomOSSettings,
  userId: string,
): Promise<LoomOSSettings> {
  const parsed = LoomOSSettingsSchema.parse(settings);
  await spindle.userStorage.setJson(SETTINGS_PATH, parsed, { indent: 2, userId });
  const activeChatId = activeChatByUser.get(userId);
  if (activeChatId) {
    await trimStateHistory(activeChatId, userId, parsed.historyRetentionLimit);
  }
  return parsed;
}

async function getMessages(chatId: string): Promise<ChatMessageDTO[]> {
  if (!spindle.permissions.has("chat_mutation")) {
    throw new Error("PERMISSION_DENIED: chat_mutation is required to read chat history.");
  }
  return spindle.chat.getMessages(chatId);
}

async function resolveIdentity(requested: IdentityRequest): Promise<StateIdentity> {
  const messages = await getMessages(requested.chatId);
  const messageId = requested.messageId ?? messages.at(-1)?.id;
  if (!messageId) throw new Error("This chat has no message to attach LoomOS state to.");
  const message = messages.find((candidate) => candidate.id === messageId);
  if (!message) throw new Error("The requested message no longer exists in this chat.");
  const swipeId = requested.swipeId ?? message.swipe_id;
  if (!Number.isInteger(swipeId) || swipeId < 0 || swipeId >= message.swipes.length) {
    throw new Error("The requested swipe no longer exists for this message.");
  }
  return StateIdentitySchema.parse({
    chatId: requested.chatId,
    messageId,
    swipeId,
  });
}

async function loadState(
  identity: StateIdentity,
  userId: string,
): Promise<LoomOSState | null> {
  const path = stateStoragePath(identity);
  const raw = await spindle.userStorage.getJson<unknown>(path, {
    fallback: null,
    userId,
  });
  const state = migrateStateToCurrent(raw);
  if (!state) return null;
  if (
    state.identity.chatId !== identity.chatId
    || state.identity.messageId !== identity.messageId
    || state.identity.swipeId !== identity.swipeId
  ) {
    spindle.log.warn("Ignored a LoomOS state file with mismatched identity.");
    return null;
  }
  if (isRecord(raw) && raw.schemaVersion === 1) {
    await spindle.userStorage.setJson(path, state, { indent: 2, userId });
  }
  return state;
}

async function persistState(
  state: LoomOSState,
  userId: string,
  historyRetentionLimit?: number,
): Promise<LoomOSState> {
  const parsed = LoomOSStateSchema.parse(state);
  await spindle.userStorage.setJson(stateStoragePath(parsed.identity), parsed, {
    indent: 2,
    userId,
  });
  const limit = historyRetentionLimit ?? (await getSettings(userId)).historyRetentionLimit;
  await trimStateHistory(parsed.identity.chatId, userId, limit, parsed.identity);
  return parsed;
}

async function deleteState(identity: StateIdentity, userId: string): Promise<void> {
  const path = stateStoragePath(identity);
  if (await spindle.userStorage.exists(path, userId)) {
    await spindle.userStorage.delete(path, userId);
  }
}

async function invalidateMessageStates(
  chatId: string,
  messageId: string,
  userId: string,
): Promise<void> {
  const prefix = messageStatePrefix(chatId, messageId);
  const paths = await spindle.userStorage.list(prefix, userId);
  await Promise.all(paths.map((path) =>
    spindle.userStorage.delete(resolveStorageListPath(prefix, path), userId)
  ));
}

async function listChatStates(
  chatId: string,
  userId: string,
): Promise<Array<{ messageId: string; swipeId: number }>> {
  const prefix = `chats/${encodeStorageSegment(chatId)}/messages`;
  try {
    const files = await spindle.userStorage.list(prefix, userId);
    const results: Array<{ messageId: string; swipeId: number }> = [];
    for (const file of files) {
      const parsed = parseChatStateStoragePath(file, chatId);
      if (parsed) results.push(parsed);
    }
    return results;
  } catch (error) {
    spindle.log.warn(`LoomOS could not list chat states: ${errorMessage(error)}`);
    return [];
  }
}

async function buildStateHistory(
  chatId: string,
  userId: string,
): Promise<StateHistoryItem[]> {
  const items: StateHistoryItem[] = [];
  try {
    const states = await listChatStates(chatId, userId);
    for (const entry of states) {
      const identity: StateIdentity = {
        chatId,
        messageId: entry.messageId,
        swipeId: entry.swipeId,
      };
      const fullState = await loadState(identity, userId);
      if (!fullState) continue;
      const raw = {
        identity,
        generatedAt: fullState.generatedAt,
        schemaVersion: fullState.schemaVersion,
        kernelScene: fullState.kernel.scene,
        kernelFocus: fullState.kernel.currentFocus || fullState.kernel.objective,
        kernelLocation: fullState.kernel.location,
        kernelTime: fullState.kernel.timeframe || `${fullState.kernel.date} ${fullState.kernel.time}`,
        deltaHeadline: fullState.delta.headline,
        castCount: fullState.castMatrix.length,
        threadCount: fullState.storyState.threadLoom.filter(t => t.status !== "resolved").length,
        riskCount: fullState.continuityFirewall.risks.length,
        repaired: fullState.source.repaired,
        seedIdentity: fullState.source.seedIdentity,
        activeModuleCount: fullState.activeModules.length,
      };
      items.push(StateHistoryItemSchema.parse(raw));
    }
    items.sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));
  } catch (error) {
    spindle.log.warn(`LoomOS could not build state history: ${errorMessage(error)}`);
  }
  return items;
}

async function trimStateHistory(
  chatId: string,
  userId: string,
  limit: number,
  protectedIdentity?: StateIdentity,
): Promise<void> {
  let history = await buildStateHistory(chatId, userId);
  if (protectedIdentity) {
    const protectedPath = stateStoragePath(protectedIdentity);
    const protectedItem = history.find((item) => stateStoragePath(item.identity) === protectedPath);
    if (protectedItem) {
      history = [
        protectedItem,
        ...history.filter((item) => stateStoragePath(item.identity) !== protectedPath),
      ];
    }
  }
  const excess = history.slice(limit);
  if (excess.length === 0) return;
  await Promise.all(excess.map((item) => deleteState(item.identity, userId)));
}

async function buildInjectionPreview(
  chatId: string,
  userId: string,
): Promise<InjectionPreview | null> {
  try {
    const settings = await getSettings(userId);
    const messages = await getMessages(chatId);
    const latest = messages.at(-1);
    if (!latest) return null;
    const identity = StateIdentitySchema.parse({
      chatId,
      messageId: latest.id,
      swipeId: latest.swipe_id,
    });
    const state = await loadState(identity, userId);
    if (!state) return null;

    const budget = settings.injectionTokenBudget;
    const allFragments: string[] = [];
    const includedNames: string[] = [];
    const omittedNames: string[] = [];

    const enabled = (key: ModuleKey) =>
      settings.moduleSettings[key].track
      && settings.moduleSettings[key].inject
      && state.activeModules.includes(key);

    for (const modKey of MODULE_KEYS) {
      if (!settings.moduleSettings[modKey].track) continue;
      if (settings.moduleSettings[modKey].inject && state.activeModules.includes(modKey)) {
        includedNames.push(modKey);
      } else {
        omittedNames.push(modKey);
      }
    }

    const enabledCustomMods = settings.customModules || [];
    for (const cm of enabledCustomMods) {
      if (cm.enabled && cm.inject) {
        includedNames.push("cmod:" + cm.label);
      } else if (cm.enabled) {
        omittedNames.push("cmod:" + cm.label);
      }
    }

    const compact = await buildCompactInjection(state, settings, async (text) => {
      try {
        return (await spindle.tokens.countText(text, { userId })).total_tokens;
      } catch {
        return Math.ceil(text.length / 4);
      }
    });

    const tokenResult = await (async () => {
      try {
        return (await spindle.tokens.countText(compact, { userId })).total_tokens;
      } catch {
        return Math.ceil(compact.length / 4);
      }
    })();

    const withinBudget = tokenResult <= budget;
    let warning: string | null = null;
    if (!withinBudget) {
      warning = `Injection is ${tokenResult - budget} tokens over the configured budget of ${budget}. Some data was dropped.`;
    } else if (tokenResult > budget * 0.8) {
      warning = `Injection is near the budget limit (${tokenResult}/${budget} tokens).`;
    }

    return {
      text: compact,
      estimatedTokens: tokenResult,
      budget,
      withinBudget,
      includedModules: includedNames,
      omittedModules: omittedNames,
      warning,
    };
  } catch (error) {
    spindle.log.warn(`LoomOS injection preview failed: ${errorMessage(error)}`);
    return null;
  }
}

async function sendExactState(
  userId: string,
  identity: StateIdentity,
  requestId?: string,
): Promise<void> {
  send({
    type: "state",
    requestId,
    identity,
    state: await loadState(identity, userId),
  }, userId);
}

function transcriptContent(message: ChatMessageDTO, identity: StateIdentity): string {
  if (message.id !== identity.messageId) return message.content;
  return message.swipes[identity.swipeId] ?? message.content;
}

async function buildTranscript(
  identity: StateIdentity,
  settings: LoomOSSettings,
  messages?: ChatMessageDTO[],
): Promise<{ transcript: string; messageCount: number; messages: ChatMessageDTO[] }> {
  const allMessages = messages ?? await getMessages(identity.chatId);
  const targetIndex = allMessages.findIndex((message) => message.id === identity.messageId);
  if (targetIndex < 0) throw new Error("The target message disappeared before compilation.");
  const start = Math.max(0, targetIndex + 1 - settings.recentMessageLimit);
  const selected = allMessages.slice(start, targetIndex + 1);
  const transcript = selected.map((message) => {
    const role = message.is_user ? "USER" : "ASSISTANT";
    const name = message.name ? ` ${message.name}` : "";
    const content = transcriptContent(message, identity).slice(0, 12_000);
    return `[${message.index_in_chat} ${role}${name}]\n${content}`;
  }).join("\n\n");
  return { transcript, messageCount: selected.length, messages: allMessages };
}

async function loadCompilationSeed(
  identity: StateIdentity,
  userId: string,
  settings: LoomOSSettings,
  messages: ChatMessageDTO[],
  exactState: LoomOSState | null,
): Promise<{ state: LoomOSState | null; text: string }> {
  if (exactState) {
    return {
      state: exactState,
      text: buildStateSeedForCompiler(exactState, settings),
    };
  }
  const targetIndex = messages.findIndex((message) => message.id === identity.messageId);
  for (let index = targetIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message) continue;
    const previousIdentity = StateIdentitySchema.parse({
      chatId: identity.chatId,
      messageId: message.id,
      swipeId: message.swipe_id,
    });
    const previous = await loadState(previousIdentity, userId);
    if (previous) {
      return {
        state: previous,
        text: buildStateSeedForCompiler(previous, settings),
      };
    }
  }
  return { state: null, text: "null" };
}

function connectionSummary(connection: ConnectionProfileDTO): ConnectionSummary {
  return {
    id: connection.id,
    name: connection.name,
    provider: connection.provider,
    model: connection.model,
    isDefault: connection.is_default,
    ready: connection.has_api_key,
  };
}

async function listConnections(userId: string): Promise<ConnectionSummary[]> {
  if (!spindle.permissions.has("generation")) return [];
  try {
    return (await spindle.connections.list(userId)).map(connectionSummary);
  } catch (error) {
    spindle.log.warn(`LoomOS could not list connections: ${errorMessage(error)}`);
    return [];
  }
}

function chooseConnection(
  connections: ConnectionSummary[],
  requestedId: string,
): ConnectionSummary | null {
  if (requestedId) {
    const selected = connections.find((connection) => connection.id === requestedId);
    if (!selected) throw new Error("The selected LoomOS connection no longer exists.");
    if (!selected.ready) throw new Error(`Connection "${selected.name}" has no API key configured.`);
    return selected;
  }
  return connections.find((connection) => connection.isDefault && connection.ready)
    ?? connections.find((connection) => connection.ready)
    ?? null;
}

function requestJobKey(userId: string, requestId: string): string {
  return `${userId}:${requestId}`;
}

function identityJobKey(userId: string, identity: StateIdentity): string {
  return `${userId}:${stateStoragePath(identity)}`;
}

function abortJob(jobKey: string): void {
  jobs.get(jobKey)?.controller.abort();
}

async function generateState(
  requestId: string,
  requested: IdentityRequest,
  userId: string,
): Promise<void> {
  if (!spindle.permissions.has("generation")) {
    throw new Error("PERMISSION_DENIED: generation is required to compile LoomOS state.");
  }

  const startedAt = Date.now();
  const identity = await resolveIdentity(requested);
  const settings = await getSettings(userId);
  const existingState = await loadState(identity, userId);
  const transcriptResult = await buildTranscript(identity, settings);
  const connections = await listConnections(userId);
  const connection = chooseConnection(connections, settings.connectionId);
  if (!connection) {
    throw new Error("No ready Lumiverse LLM connection is available. Configure a connection, then retry.");
  }

  const controller = new AbortController();
  const jobKey = requestJobKey(userId, requestId);
  const identityKey = identityJobKey(userId, identity);
  const previousJob = jobByIdentity.get(identityKey);
  if (previousJob) abortJob(previousJob);
  jobs.set(jobKey, { controller, identityKey });
  jobByIdentity.set(identityKey, jobKey);

  const progress = (
    phase: GenerationPhase,
    attempt: 1 | 2,
    message: string,
  ) => {
    send({
      type: "generation_status",
      requestId,
      status: "progress",
      identity,
      message,
      report: {
        phase,
        attempt,
        elapsedMs: Date.now() - startedAt,
        connectionId: connection.id,
        message,
      },
    }, userId);
  };

  send({
    type: "generation_status",
    requestId,
    status: "started",
    identity,
    message: `Preparing ${connection.name} (${connection.model || connection.provider}).`,
    report: {
      phase: "resolving",
      attempt: 1,
      elapsedMs: 0,
      connectionId: connection.id,
      message: "Resolved exact message and swipe.",
    },
  }, userId);

  try {
    progress("loading_seed", 1, "Loading continuity seed from this or the nearest prior message.");
    const seed = await loadCompilationSeed(
      identity,
      userId,
      settings,
      transcriptResult.messages,
      existingState,
    );
    const enabledModules = trackedModuleKeys(settings);
    const compiled = await compileStateWithRepair({
      identity,
      transcript: transcriptResult.transcript,
      messageCount: transcriptResult.messageCount,
      existingState,
      seedState: seed.state,
      seedText: seed.text,
      enabledModules,
      customModules: settings.customModules,
      stockModuleOverrides: settings.stockModuleOverrides,
      connectionId: connection.id,
      signal: controller.signal,
      onPhase: progress,
      generate: async (messages, signal) =>
        runQuietGeneration(spindle, {
          messages,
          connectionId: connection.id,
          userId,
          timeoutMs: settings.generationTimeoutSeconds * 1000,
          parentSignal: signal,
        }),
    });

    if (controller.signal.aborted) throw new DOMException("Generation cancelled.", "AbortError");
    if (!compiled.ok) {
      send({ type: "state", requestId, identity, state: compiled.state }, userId);
      send({
        type: "generation_status",
        requestId,
        status: "failed",
        identity,
        message: compiled.error,
      }, userId);
      return;
    }

    progress("saving", compiled.repaired ? 2 : 1, "Saving validated exact-swipe state.");
    const state = await persistState(
      compiled.state,
      userId,
      settings.historyRetentionLimit,
    );
    send({ type: "state", requestId, identity, state }, userId);
    send({
      type: "generation_status",
      requestId,
      status: "completed",
      identity,
      message: compiled.fallbackSaved
        ? "Compiler output stayed invalid; a minimal valid fallback state was saved."
        : compiled.repaired
        ? "State compiled after one repair pass."
        : compiled.normalized
        ? "State normalized, validated, and saved."
        : "State compiled and saved.",
      report: {
        phase: "saving",
        attempt: compiled.repaired ? 2 : 1,
        elapsedMs: Date.now() - startedAt,
        connectionId: connection.id,
        message: compiled.fallbackSaved ? "Minimal fallback state saved." : "Validated state saved.",
        normalized: compiled.normalized,
        fallbackSaved: compiled.fallbackSaved,
        issues: compiled.issues.slice(0, 8),
        debugReport: compiled.debugReport,
      },
    }, userId);
  } catch (error) {
    if (controller.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
      send({
        type: "generation_status",
        requestId,
        status: "cancelled",
        identity,
        message: "Generation cancelled.",
      }, userId);
      return;
    }
    const message = errorMessage(error);
    spindle.log.error(`LoomOS generation failed (${connection.id}): ${message}`);
    send({
      type: "generation_status",
      requestId,
      status: "failed",
      identity,
      message,
    }, userId);
  } finally {
    if (jobs.get(jobKey)?.controller === controller) jobs.delete(jobKey);
    if (jobByIdentity.get(identityKey) === jobKey) jobByIdentity.delete(identityKey);
  }
}

async function generateArtifactDraft(
  requestId: string,
  kind: LoomOSArtifact["kind"],
  brief: string,
  currentArtifact: LoomOSArtifact | null | undefined,
  userId: string,
): Promise<void> {
  if (!spindle.permissions.has("generation")) {
    throw new Error("PERMISSION_DENIED: generation is required to create LoomOS artifacts.");
  }
  if (!brief.trim()) throw new Error("Describe the module, theme, or Blueprint you want to create.");

  const startedAt = Date.now();
  const settings = await getSettings(userId);
  const connections = await listConnections(userId);
  const connection = chooseConnection(connections, settings.connectionId);
  if (!connection) {
    throw new Error("No ready Lumiverse LLM connection is available. Configure a connection, then retry.");
  }

  const controller = new AbortController();
  const jobKey = requestJobKey(userId, requestId);
  jobs.set(jobKey, { controller, identityKey: `artifact:${requestId}` });
  send({
    type: "artifact_generation_status",
    requestId,
    status: "started",
    message: `Preparing ${connection.name}.`,
    elapsedMs: 0,
    attempt: 1,
  }, userId);

  try {
    const result = await generateArtifactWithRepair({
      kind,
      brief: brief.slice(0, 12_000),
      currentArtifact: currentArtifact
        ? LoomOSArtifactSchema.parse(currentArtifact)
        : null,
      signal: controller.signal,
      onProgress: (attempt, message) => {
        send({
          type: "artifact_generation_status",
          requestId,
          status: "progress",
          message,
          elapsedMs: Date.now() - startedAt,
          attempt,
        }, userId);
      },
      generate: async (messages, signal) =>
        runQuietGeneration(spindle, {
          messages,
          connectionId: connection.id,
          userId,
          timeoutMs: settings.generationTimeoutSeconds * 1000,
          parentSignal: signal,
        }),
    });
    if (controller.signal.aborted) throw new DOMException("Generation cancelled.", "AbortError");
    send({
      type: "artifact_generation_status",
      requestId,
      status: "completed",
      message: result.repaired
        ? "Artifact validated after one repair pass."
        : "Artifact draft validated.",
      elapsedMs: Date.now() - startedAt,
      attempt: result.repaired ? 2 : 1,
      artifact: result.artifact,
      issues: result.issues.slice(0, 8),
    }, userId);
  } catch (error) {
    if (controller.signal.aborted || (error instanceof Error && error.name === "AbortError")) {
      send({
        type: "artifact_generation_status",
        requestId,
        status: "cancelled",
        message: "Artifact generation cancelled.",
        elapsedMs: Date.now() - startedAt,
        attempt: 1,
      }, userId);
      return;
    }
    send({
      type: "artifact_generation_status",
      requestId,
      status: "failed",
      message: errorMessage(error),
      elapsedMs: Date.now() - startedAt,
      attempt: 1,
    }, userId);
  } finally {
    if (jobs.get(jobKey)?.controller === controller) jobs.delete(jobKey);
  }
}

function mergeInstalledModule(
  modules: LoomOSSettings["customModules"],
  artifact: ModuleCapsuleArtifact,
): LoomOSSettings["customModules"] {
  const compiled = artifactToCustomModule(artifact);
  const existingIndex = modules.findIndex((module) =>
    module.artifactId === artifact.id || module.id === artifact.id
  );
  if (existingIndex < 0) return [...modules, compiled];
  return modules.map((module, index) => index === existingIndex ? compiled : module);
}

async function installArtifact(
  artifactValue: LoomOSArtifact,
  selectedArtifactIds: string[] | undefined,
  applySettings: boolean,
  activateTheme: boolean,
  userId: string,
): Promise<{
  settings: LoomOSSettings;
  installedIds: string[];
  message: string;
}> {
  const artifact = LoomOSArtifactSchema.parse(artifactValue);
  const selected = new Set(selectedArtifactIds ?? []);
  const installedIds: string[] = [];
  let settings = await getSettings(userId);
  await saveArtifact(spindle, userId, artifact);

  const installModule = async (module: ModuleCapsuleArtifact): Promise<void> => {
    await saveArtifact(spindle, userId, module);
    settings = LoomOSSettingsSchema.parse({
      ...settings,
      customModules: mergeInstalledModule(settings.customModules, module),
    });
    installedIds.push(module.id);
  };
  const installTheme = async (theme: ThemeArtifact): Promise<void> => {
    await saveArtifact(spindle, userId, theme);
    settings = LoomOSSettingsSchema.parse({
      ...settings,
      activeThemeId: activateTheme ? theme.id : settings.activeThemeId,
    });
    installedIds.push(theme.id);
  };

  if (artifact.kind === "module") {
    await installModule(artifact);
  } else if (artifact.kind === "theme") {
    await installTheme(artifact);
  } else {
    const defaultAll = selected.size === 0;
    for (const module of artifact.modules) {
      if (defaultAll || selected.has(module.id)) await installModule(module);
    }
    if (artifact.theme && (defaultAll || selected.has(artifact.theme.id))) {
      await installTheme(artifact.theme);
    }
    if (applySettings) {
      settings = LoomOSSettingsSchema.parse({
        ...settings,
        ...artifact.settings,
      });
    }
    installedIds.push(artifact.id);
  }

  settings = await saveSettings(settings, userId);
  return {
    settings,
    installedIds,
    message: installedIds.length === 0
      ? "Blueprint saved to the library without activating any parts."
      : `Installed ${installedIds.length} artifact${installedIds.length === 1 ? "" : "s"}.`,
  };
}

function parseFrontendRequest(payload: unknown): FrontendRequest {
  if (!isRecord(payload) || typeof payload.type !== "string") {
    throw new Error("Invalid LoomOS frontend request.");
  }
  return payload as FrontendRequest;
}

async function handleFrontendRequest(payload: unknown, userId: string): Promise<void> {
  let requestId: string | undefined;
  try {
    const request = parseFrontendRequest(payload);
    requestId = "requestId" in request ? request.requestId : undefined;
    switch (request.type) {
      case "ready": {
        rememberUserChat(userId, request.active?.chatId ?? null);
        const settings = await getSettings(userId);
        const identity = request.active
          ? await resolveIdentity(request.active).catch(() => null)
          : null;
        send({
          type: "bootstrap",
          settings,
          permissions: permissionSnapshot(),
          connections: await listConnections(userId),
          identity,
          state: identity ? await loadState(identity, userId) : null,
          artifacts: await loadArtifactLibrary(spindle, userId),
        }, userId);
        return;
      }
      case "frontend_disposed":
        rememberUserChat(userId, null);
        return;
      case "get_settings":
        send({ type: "settings", requestId, settings: await getSettings(userId) }, userId);
        return;
      case "save_settings":
        send({
          type: "settings",
          requestId,
          settings: await saveSettings(request.settings, userId),
        }, userId);
        return;
      case "get_connections":
        send({ type: "connections", requestId, connections: await listConnections(userId) }, userId);
        return;
      case "get_state": {
        const identity = await resolveIdentity(request.identity);
        rememberUserChat(userId, identity.chatId);
        await sendExactState(userId, identity, requestId);
        return;
      }
      case "load_history_state": {
        const identity = StateIdentitySchema.parse(request.identity);
        rememberUserChat(userId, identity.chatId);
        send({
          type: "state",
          requestId,
          identity,
          state: await loadState(identity, userId),
        }, userId);
        return;
      }
      case "save_state": {
        const resolvedIdentity = await resolveIdentity(request.state.identity);
        if (
          resolvedIdentity.chatId !== request.state.identity.chatId
          || resolvedIdentity.messageId !== request.state.identity.messageId
          || resolvedIdentity.swipeId !== request.state.identity.swipeId
        ) {
          throw new Error("State identity does not match the live message swipe.");
        }
        const state = await persistState(request.state, userId);
        send({ type: "state", requestId, identity: state.identity, state }, userId);
        return;
      }
      case "delete_state": {
        const identity = await resolveIdentity(request.identity);
        await deleteState(identity, userId);
        send({ type: "state", requestId, identity, state: null }, userId);
        return;
      }
      case "delete_history_state": {
        const identity = StateIdentitySchema.parse(request.identity);
        await deleteState(identity, userId);
        send({
          type: "history_state_deleted",
          requestId,
          chatId: identity.chatId,
          identity,
          items: await buildStateHistory(identity.chatId, userId),
        }, userId);
        return;
      }
      case "generate_state":
        void generateState(request.requestId, request.identity, userId).catch((error) => {
          send({
            type: "generation_status",
            requestId: request.requestId,
            status: "failed",
            message: errorMessage(error),
          }, userId);
        });
        return;
      case "cancel_generation":
        abortJob(requestJobKey(userId, request.requestId));
        return;
      case "refresh_permissions":
        send({ type: "permissions", requestId, permissions: permissionSnapshot() }, userId);
        return;
      case "get_chat_states": {
        const states = await listChatStates(request.chatId, userId);
        send({ type: "chat_states", requestId, chatId: request.chatId, states }, userId);
        return;
      }
      case "list_state_history": {
        const history = await buildStateHistory(request.chatId, userId);
        send({ type: "state_history", requestId, chatId: request.chatId, items: history }, userId);
        return;
      }
      case "preview_injection": {
        const preview = await buildInjectionPreview(request.chatId, userId);
        send({ type: "injection_preview", requestId, preview }, userId);
        return;
      }
      case "get_artifacts":
        send({
          type: "artifacts",
          requestId,
          library: await loadArtifactLibrary(spindle, userId),
        }, userId);
        return;
      case "save_artifact": {
        const saved = await saveArtifact(
          spindle,
          userId,
          LoomOSArtifactSchema.parse(request.artifact),
        );
        send({
          type: "artifact_saved",
          requestId: request.requestId,
          library: saved.library,
          record: saved.record,
        }, userId);
        return;
      }
      case "delete_artifact": {
        let nextSettings = await getSettings(userId);
        nextSettings = LoomOSSettingsSchema.parse({
          ...nextSettings,
          activeThemeId: nextSettings.activeThemeId === request.artifactId
            ? ""
            : nextSettings.activeThemeId,
          customModules: nextSettings.customModules.filter((module) =>
            module.artifactId !== request.artifactId
          ),
        });
        await saveSettings(nextSettings, userId);
        const library = await deleteArtifact(spindle, userId, request.artifactId);
        send({
          type: "artifact_deleted",
          requestId: request.requestId,
          library,
          artifactId: request.artifactId,
          settings: nextSettings,
        }, userId);
        return;
      }
      case "restore_artifact": {
        const restored = await restoreArtifact(
          spindle,
          userId,
          request.artifactId,
          request.revision,
        );
        send({
          type: "artifact_saved",
          requestId: request.requestId,
          library: restored.library,
          record: restored.record,
        }, userId);
        return;
      }
      case "generate_artifact":
        void generateArtifactDraft(
          request.requestId,
          request.kind,
          request.brief,
          request.currentArtifact,
          userId,
        ).catch((error) => {
          send({
            type: "artifact_generation_status",
            requestId: request.requestId,
            status: "failed",
            message: errorMessage(error),
            elapsedMs: 0,
            attempt: 1,
          }, userId);
        });
        return;
      case "cancel_artifact_generation":
        abortJob(requestJobKey(userId, request.requestId));
        return;
      case "install_artifact": {
        const installed = await installArtifact(
          request.artifact,
          request.selectedArtifactIds,
          request.applySettings ?? false,
          request.activateTheme ?? true,
          userId,
        );
        send({
          type: "artifact_installed",
          requestId: request.requestId,
          settings: installed.settings,
          library: await loadArtifactLibrary(spindle, userId),
          installedIds: installed.installedIds,
          message: installed.message,
        }, userId);
        return;
      }
    }
  } catch (error) {
    send({ type: "error", requestId, message: errorMessage(error) }, userId);
  }
}

function eventMessage(payload: unknown): ChatMessageDTO | null {
  if (!isRecord(payload)) return null;
  const message = isRecord(payload.message) ? payload.message : payload;
  if (
    typeof message.id !== "string"
    || typeof message.chat_id !== "string"
    || typeof message.swipe_id !== "number"
    || !Array.isArray(message.swipes)
  ) return null;
  return message as unknown as ChatMessageDTO;
}

async function queueAutomaticGeneration(
  identity: StateIdentity,
  userId: string,
): Promise<void> {
  const key = identityJobKey(userId, identity);
  if (automaticGenerationKeys.has(key)) return;
  automaticGenerationKeys.add(key);
  try {
    await generateState(
      `auto:${identity.messageId}:${identity.swipeId}:${Date.now()}`,
      identity,
      userId,
    );
  } finally {
    automaticGenerationKeys.delete(key);
  }
}

async function handleAutomaticMessage(
  message: ChatMessageDTO,
  eventUserId?: string,
): Promise<void> {
  const identity = StateIdentitySchema.parse({
    chatId: message.chat_id,
    messageId: message.id,
    swipeId: message.swipe_id,
  });
  for (const userId of eventUsers(message.chat_id, eventUserId)) {
    await sendExactState(userId, identity);
    const settings = await getSettings(userId);
    const shouldGenerate = settings.autoGeneration === "every"
      || (settings.autoGeneration === "assistant" && !message.is_user);
    if (shouldGenerate && spindle.permissions.has("generation")) {
      void queueAutomaticGeneration(identity, userId).catch((error) => {
        spindle.log.warn(`LoomOS automatic generation skipped: ${errorMessage(error)}`);
      });
    }
  }
}

async function handleMessageEdited(payload: unknown, eventUserId?: string): Promise<void> {
  const message = eventMessage(payload);
  if (!message) return;
  const identity = StateIdentitySchema.parse({
    chatId: message.chat_id,
    messageId: message.id,
    swipeId: message.swipe_id,
  });
  for (const userId of eventUsers(message.chat_id, eventUserId)) {
    await deleteState(identity, userId);
    await sendExactState(userId, identity);
  }
}

async function handleMessageSwiped(
  payload: MessageSwipedPayloadDTO,
  eventUserId?: string,
): Promise<void> {
  const activeIdentity = StateIdentitySchema.parse({
    chatId: payload.chatId,
    messageId: payload.message.id,
    swipeId: payload.message.swipe_id,
  });
  for (const userId of eventUsers(payload.chatId, eventUserId)) {
    if (payload.action === "deleted") {
      await invalidateMessageStates(payload.chatId, payload.message.id, userId);
    } else if (payload.action === "updated" || payload.action === "added") {
      await deleteState(StateIdentitySchema.parse({
        chatId: payload.chatId,
        messageId: payload.message.id,
        swipeId: payload.swipeId,
      }), userId);
    }
    await sendExactState(userId, activeIdentity);
  }
}

async function handleSwipeEdited(
  payload: SwipeEditedPayloadDTO,
  eventUserId?: string,
): Promise<void> {
  const identity = StateIdentitySchema.parse({
    chatId: payload.chatId,
    messageId: payload.message.id,
    swipeId: payload.message.swipe_id,
  });
  for (const userId of eventUsers(payload.chatId, eventUserId)) {
    await invalidateMessageStates(payload.chatId, payload.message.id, userId);
    await sendExactState(userId, identity);
  }
}

async function handleMessageDeleted(payload: unknown, eventUserId?: string): Promise<void> {
  if (!isRecord(payload) || typeof payload.chatId !== "string" || typeof payload.messageId !== "string") return;
  for (const userId of eventUsers(payload.chatId, eventUserId)) {
    await invalidateMessageStates(payload.chatId, payload.messageId, userId);
  }
}

async function handleMessageSent(payload: unknown, eventUserId?: string): Promise<void> {
  const message = eventMessage(payload);
  if (!message) return;
  await handleAutomaticMessage(message, eventUserId);
}

async function handleGenerationEnded(
  payload: GenerationEndedPayloadDTO,
  eventUserId?: string,
): Promise<void> {
  if (payload.error || !payload.messageId) return;
  let message: ChatMessageDTO | undefined;
  for (const delay of [0, 75, 200]) {
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      message = (await getMessages(payload.chatId))
        .find((candidate) => candidate.id === payload.messageId);
    } catch (error) {
      spindle.log.warn(`LoomOS could not resolve completed generation: ${errorMessage(error)}`);
      return;
    }
    if (message) break;
  }
  if (!message) {
    spindle.log.warn(`LoomOS could not find saved generated message ${payload.messageId}.`);
    return;
  }
  await handleAutomaticMessage(message, eventUserId);
}

function tryRegisterInterceptor(): void {
  if (interceptorRegistered || !spindle.permissions.has("interceptor")) return;
  interceptorRegistered = true;
  interceptorEnabled = true;
  spindle.registerInterceptor(async (messages, context) => {
    if (!interceptorEnabled || disposed || !isRecord(context)) return messages;
    if (context.generationType === "quiet" || typeof context.chatId !== "string") return messages;
    if (!spindle.permissions.has("chat_mutation")) return messages;
    const chatId = context.chatId;
    const chatUsers = usersByChat.get(chatId);
    if (!chatUsers || chatUsers.size !== 1) return messages;
    const userId = [...chatUsers][0]!;
    try {
      const settings = await getSettings(userId);
      if (!settings.injectionEnabled) return messages;
      const storedMessages = await getMessages(chatId);
      const latest = storedMessages.at(-1);
      if (!latest) return messages;
      const identity = StateIdentitySchema.parse({
        chatId,
        messageId: latest.id,
        swipeId: latest.swipe_id,
      });
      const state = await loadState(identity, userId);
      if (!state) return messages;
      const compact = await buildCompactInjection(state, settings, async (text) => {
        try {
          return (await spindle.tokens.countText(text, { userId })).total_tokens;
        } catch {
          return Math.ceil(text.length / 4);
        }
      });
      const injected: LlmMessageDTO = { role: "system", content: compact };
      return {
        messages: [injected, ...messages],
        breakdown: [{ messageIndex: 0, name: "LoomOS Story State" }],
      };
    } catch (error) {
      spindle.log.warn(`LoomOS injection skipped: ${errorMessage(error)}`);
      return messages;
    }
  }, 70);
}

function disposeBackend(): void {
  if (disposed) return;
  disposed = true;
  interceptorEnabled = false;
  for (const { controller } of jobs.values()) controller.abort();
  jobs.clear();
  jobByIdentity.clear();
  automaticGenerationKeys.clear();
  for (const dispose of disposers.splice(0).reverse()) {
    try {
      dispose();
    } catch {
      // Continue runtime shutdown.
    }
  }
  activeChatByUser.clear();
  usersByChat.clear();
}

disposers.push(spindle.onFrontendMessage((payload, userId) => {
  void handleFrontendRequest(payload, userId);
}));
disposers.push(spindle.on("MESSAGE_SENT", (payload, userId) => {
  void handleMessageSent(payload, userId);
}));
disposers.push(spindle.on("GENERATION_ENDED", (payload, userId) => {
  void handleGenerationEnded(payload, userId);
}));
disposers.push(spindle.on("MESSAGE_EDITED", (payload, userId) => {
  void handleMessageEdited(payload, userId);
}));
disposers.push(spindle.on("MESSAGE_DELETED", (payload, userId) => {
  void handleMessageDeleted(payload, userId);
}));
disposers.push(spindle.on("MESSAGE_SWIPED", (payload, userId) => {
  void handleMessageSwiped(payload, userId);
}));
disposers.push(spindle.on("SWIPE_EDITED", (payload, userId) => {
  void handleSwipeEdited(payload, userId);
}));
disposers.push(spindle.permissions.onDenied(({ permission, operation }) => {
  spindle.log.warn(`LoomOS permission denied: ${permission} for ${operation}.`);
}));
disposers.push(spindle.permissions.onChanged(({ permission, granted }) => {
  if (permission === "generation" && !granted) {
    for (const { controller } of jobs.values()) controller.abort();
  }
  if (permission === "interceptor") {
    interceptorEnabled = granted;
    if (granted) tryRegisterInterceptor();
  }
  for (const userId of activeChatByUser.keys()) {
    send({ type: "permissions", permissions: permissionSnapshot() }, userId);
  }
}));
disposers.push(spindle.on("SPINDLE_EXTENSION_UNLOADED", (payload) => {
  if (isRecord(payload) && payload.extensionId === EXTENSION_ID) disposeBackend();
}));

tryRegisterInterceptor();
spindle.log.info("LoomOS Command Deck backend loaded.");

export { disposeBackend };
