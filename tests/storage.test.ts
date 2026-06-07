import assert from "node:assert/strict";
import test from "node:test";
import {
  messageStatePrefix,
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
