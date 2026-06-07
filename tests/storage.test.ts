import assert from "node:assert/strict";
import test from "node:test";
import {
  messageStatePrefix,
  parseChatStateStoragePath,
  resolveStorageListPath,
  stateStoragePath,
} from "../src/shared/storage";
import { identity } from "./fixtures";

test("state path is keyed by chat, message, and swipe", () => {
  assert.equal(
    stateStoragePath(identity),
    "chats/chat%2Falpha/messages/message%20beta/swipes/2.json",
  );
});

test("message prefix cannot be escaped with path separators", () => {
  const prefix = messageStatePrefix("../../chat", "../message");
  assert.equal(prefix.includes("../"), false);
  assert.equal(prefix.startsWith("chats/"), true);
});

test("storage list paths normalize full and prefix-relative host results", () => {
  const prefix = "chats/chat/messages";
  assert.equal(
    resolveStorageListPath(prefix, "message/swipes/2.json"),
    "chats/chat/messages/message/swipes/2.json",
  );
  assert.equal(
    resolveStorageListPath(prefix, "chats/chat/messages/message/swipes/2.json"),
    "chats/chat/messages/message/swipes/2.json",
  );
});

test("chat state paths parse from full and prefix-relative listings", () => {
  assert.deepEqual(
    parseChatStateStoragePath("message%20one/swipes/3.json", "chat/alpha"),
    { messageId: "message one", swipeId: 3 },
  );
  assert.deepEqual(
    parseChatStateStoragePath(
      "chats/chat%2Falpha/messages/message%20one/swipes/3.json",
      "chat/alpha",
    ),
    { messageId: "message one", swipeId: 3 },
  );
  assert.equal(parseChatStateStoragePath("unrelated.json", "chat/alpha"), null);
});
