import assert from "node:assert/strict";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { compiledState } from "./fixtures.ts";

test("built backend compiles, repairs, and stores exact swipe State V2", async () => {
  const frontendHandlers = [];
  const eventHandlers = new Map();
  const frontendMessages = [];
  const logs = [];
  const userFiles = new Map();
  let chatMessages = [{
    id: "message-1",
    chat_id: "chat-1",
    index_in_chat: 0,
    is_user: false,
    name: "Mara",
    content: "Second swipe",
    send_date: 1,
    swipe_id: 1,
    swipes: ["First swipe", "Second swipe"],
    swipe_dates: [1, 2],
    extra: {},
    metadata: {},
    parent_message_id: null,
    branch_id: null,
    created_at: 1,
  }];
  let generationCalls = 0;

  const onEvent = (name, handler) => {
    const handlers = eventHandlers.get(name) ?? [];
    handlers.push(handler);
    eventHandlers.set(name, handlers);
    return () => {
      const current = eventHandlers.get(name) ?? [];
      eventHandlers.set(name, current.filter((candidate) => candidate !== handler));
    };
  };

  globalThis.spindle = {
    log: {
      info: (...args) => logs.push(["info", ...args]),
      warn: (...args) => logs.push(["warn", ...args]),
      error: (...args) => logs.push(["error", ...args]),
    },
    permissions: {
      has: (permission) => ["generation", "chat_mutation", "interceptor"].includes(permission),
      getGranted: async () => ["generation", "chat_mutation", "interceptor"],
      onChanged: (handler) => onEvent("PERMISSION_CHANGED", handler),
      onDenied: (handler) => onEvent("PERMISSION_DENIED", handler),
    },
    onFrontendMessage: (handler) => {
      frontendHandlers.push(handler);
      return () => {
        const index = frontendHandlers.indexOf(handler);
        if (index >= 0) frontendHandlers.splice(index, 1);
      };
    },
    sendToFrontend: (payload, userId) => frontendMessages.push({ payload, userId }),
    on: onEvent,
    registerInterceptor: (handler, priority) => {
      globalThis.__loomosInterceptor = { handler, priority };
    },
    userStorage: {
      getJson: async (path, options = {}) => userFiles.has(path) ? userFiles.get(path) : options.fallback,
      setJson: async (path, value) => userFiles.set(path, value),
      exists: async (path) => userFiles.has(path),
      delete: async (path) => userFiles.delete(path),
      list: async (prefix = "") => [...userFiles.keys()]
        .filter((path) => path.startsWith(prefix))
        .map((path) => path.slice(prefix.length).replace(/^\/+/, "")),
    },
    chat: {
      getMessages: async () => chatMessages,
    },
    connections: {
      list: async () => [{
        id: "connection-1",
        name: "Mock Connection",
        provider: "mock",
        api_url: "",
        model: "mock-model",
        preset_id: null,
        is_default: true,
        has_api_key: true,
        metadata: {},
        reasoning_bindings: null,
        created_at: 1,
        updated_at: 1,
      }],
      get: async () => null,
    },
    generate: {
      quiet: async () => {
        generationCalls += 1;
        return generationCalls === 1
          ? { text: "invalid" }
          : { message: { content: JSON.stringify(compiledState) } };
      },
    },
    tokens: {
      countText: async (text) => ({
        total_tokens: Math.ceil(text.length / 4),
        model: "mock",
        modelSource: "main",
        tokenizer_id: null,
        tokenizer_name: "mock",
        approximate: true,
      }),
    },
  };

  const backendUrl = `${pathToFileURL(`${process.cwd()}/dist/backend.js`).href}?test=${Date.now()}`;
  const backend = await import(backendUrl);
  assert.equal(frontendHandlers.length, 1);
  assert.ok(logs.some((entry) => entry[1] === "LoomOS Command Deck backend loaded."));
  assert.equal(globalThis.__loomosInterceptor.priority, 70);

  await frontendHandlers[0]({
    type: "ready",
    active: { chatId: "chat-1", messageId: "message-1", swipeId: 1 },
  }, "user-1");

  await frontendHandlers[0]({
    type: "generate_state",
    requestId: "generate-1",
    identity: { chatId: "chat-1", messageId: "message-1", swipeId: 1 },
  }, "user-1");

  const deadline = Date.now() + 3000;
  while (
    !frontendMessages.some(({ payload }) =>
      payload.type === "generation_status" && payload.status === "completed"
    )
    && Date.now() < deadline
  ) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  assert.equal(generationCalls, 2);
  const stored = userFiles.get("chats/chat-1/messages/message-1/swipes/1.json");
  assert.ok(stored);
  assert.equal(stored.schemaVersion, 2);
  assert.deepEqual(stored.identity, {
    chatId: "chat-1",
    messageId: "message-1",
    swipeId: 1,
  });
  assert.equal(stored.source.repaired, true);
  assert.equal(stored.source.connectionId, "connection-1");
  assert.ok(frontendMessages.some(({ payload, userId }) =>
    userId === "user-1"
    && payload.type === "generation_status"
    && payload.status === "progress"
    && payload.report?.phase === "repairing"
  ));
  assert.ok(frontendMessages.some(({ payload }) =>
    payload.type === "bootstrap" && payload.connections.length === 1
  ));
  assert.equal(eventHandlers.get("GENERATION_ENDED")?.length, 1);

  const bootstrap = frontendMessages.find(({ payload }) => payload.type === "bootstrap")?.payload;
  assert.ok(bootstrap && bootstrap.type === "bootstrap");
  await frontendHandlers[0]({
    type: "save_settings",
    requestId: "settings-auto",
    settings: {
      ...bootstrap.settings,
      autoGeneration: "assistant",
      historyRetentionLimit: 1,
    },
  }, "user-1");

  chatMessages = [...chatMessages, {
    id: "message-2",
    chat_id: "chat-1",
    index_in_chat: 1,
    is_user: false,
    name: "Mara",
    content: "A newly generated assistant response.",
    send_date: 3,
    swipe_id: 0,
    swipes: ["A newly generated assistant response."],
    swipe_dates: [3],
    extra: {},
    metadata: {},
    parent_message_id: "message-1",
    branch_id: null,
    created_at: 3,
  }];
  eventHandlers.get("GENERATION_ENDED")[0]({
    generationId: "roleplay-generation-1",
    chatId: "chat-1",
    messageId: "message-2",
    content: "A newly generated assistant response.",
    generationType: "normal",
  }, "user-1");

  const autoDeadline = Date.now() + 3000;
  while (
    !userFiles.has("chats/chat-1/messages/message-2/swipes/0.json")
    && Date.now() < autoDeadline
  ) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  assert.equal(generationCalls, 3);
  assert.ok(userFiles.has("chats/chat-1/messages/message-2/swipes/0.json"));
  assert.equal(userFiles.has("chats/chat-1/messages/message-1/swipes/1.json"), false);

  await frontendHandlers[0]({
    type: "list_state_history",
    requestId: "history-relative-list",
    chatId: "chat-1",
  }, "user-1");
  const historyDeadline = Date.now() + 1000;
  let historyResponse;
  while (!historyResponse && Date.now() < historyDeadline) {
    historyResponse = frontendMessages.find(({ payload }) =>
      payload.type === "state_history" && payload.requestId === "history-relative-list"
    )?.payload;
    if (!historyResponse) await new Promise((resolve) => setTimeout(resolve, 10));
  }
  assert.ok(historyResponse && historyResponse.type === "state_history");
  assert.equal(historyResponse.items.length, 1);
  assert.equal(historyResponse.items[0].identity.messageId, "message-2");

  await frontendHandlers[0]({
    type: "load_history_state",
    requestId: "history-load",
    identity: { chatId: "chat-1", messageId: "message-2", swipeId: 0 },
  }, "user-1");
  const historyLoadDeadline = Date.now() + 1000;
  while (
    !frontendMessages.some(({ payload }) => payload.requestId === "history-load")
    && Date.now() < historyLoadDeadline
  ) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  assert.ok(
    frontendMessages.some(({ payload }) =>
      payload.type === "state"
      && payload.requestId === "history-load"
      && payload.state?.identity.messageId === "message-2"
    ),
    JSON.stringify(frontendMessages
      .map(({ payload }) => payload)
      .filter((payload) => payload.requestId === "history-load" || payload.type === "error")),
  );

  await frontendHandlers[0]({
    type: "delete_history_state",
    requestId: "history-delete",
    identity: { chatId: "chat-1", messageId: "message-2", swipeId: 0 },
  }, "user-1");
  const historyDeleteDeadline = Date.now() + 1000;
  while (
    !frontendMessages.some(({ payload }) => payload.requestId === "history-delete")
    && Date.now() < historyDeleteDeadline
  ) {
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  assert.equal(userFiles.has("chats/chat-1/messages/message-2/swipes/0.json"), false);
  assert.ok(frontendMessages.some(({ payload }) =>
    payload.type === "history_state_deleted"
    && payload.requestId === "history-delete"
    && payload.items.length === 0
  ));

  backend.disposeBackend();
  assert.equal(frontendHandlers.length, 0);
  delete globalThis.spindle;
  delete globalThis.__loomosInterceptor;
});
