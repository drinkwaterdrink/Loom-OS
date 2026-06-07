import assert from "node:assert/strict";
import test from "node:test";
import { pathToFileURL } from "node:url";

const validCompilerOutput = {
  kernel: {
    scene: "Archive search",
    location: "North tower",
    timeframe: "Before dawn",
    tone: "Tense",
    objective: "Recover the ledger.",
    summary: "Mara searches the tower archive.",
    constraints: ["The east stair is blocked."],
  },
  castMatrix: [{
    name: "Mara",
    role: "Investigator",
    status: "Searching",
    location: "North tower",
    emotionalState: "Focused",
    goals: ["Find the ledger"],
    relationships: [],
    leverage: [],
  }],
  threadLoom: [{
    title: "Missing ledger",
    status: "active",
    urgency: 4,
    summary: "The ledger remains missing.",
    nextPressure: "Guards arrive.",
    participants: ["Mara"],
  }],
  continuityFirewall: {
    establishedFacts: ["The east stair is blocked."],
    pendingConsequences: ["Guards are approaching."],
    secrets: [],
    risks: [],
  },
};

test("built backend compiles, repairs, and stores exact swipe state", async () => {
  const frontendHandlers = [];
  const eventHandlers = new Map();
  const frontendMessages = [];
  const logs = [];
  const userFiles = new Map();
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
      setJson: async (path, value) => {
        userFiles.set(path, value);
      },
      exists: async (path) => userFiles.has(path),
      delete: async (path) => {
        userFiles.delete(path);
      },
      list: async (prefix = "") => [...userFiles.keys()].filter((path) => path.startsWith(prefix)),
    },
    chat: {
      getMessages: async () => [{
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
        role: "assistant",
      }],
    },
    generate: {
      quiet: async () => {
        generationCalls += 1;
        return {
          content: generationCalls === 1
            ? "invalid"
            : JSON.stringify(validCompilerOutput),
        };
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
    active: {
      chatId: "chat-1",
      messageId: "message-1",
      swipeId: 1,
    },
  }, "user-1");

  await frontendHandlers[0]({
    type: "generate_state",
    requestId: "generate-1",
    identity: {
      chatId: "chat-1",
      messageId: "message-1",
      swipeId: 1,
    },
  }, "user-1");

  const deadline = Date.now() + 2000;
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
  assert.deepEqual(stored.identity, {
    chatId: "chat-1",
    messageId: "message-1",
    swipeId: 1,
  });
  assert.equal(stored.source.repaired, true);
  assert.ok(frontendMessages.some(({ payload, userId }) =>
    userId === "user-1"
    && payload.type === "generation_status"
    && payload.status === "completed"
  ));

  backend.disposeBackend();
  assert.equal(frontendHandlers.length, 0);
  delete globalThis.spindle;
  delete globalThis.__loomosInterceptor;
});
