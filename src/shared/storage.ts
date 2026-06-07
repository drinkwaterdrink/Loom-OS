import { StateIdentitySchema } from "./schemas";
import type { StateIdentity } from "./types";

export const SETTINGS_PATH = "settings.json";

export function encodeStorageSegment(value: string): string {
  return encodeURIComponent(value).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export function messageStatePrefix(chatId: string, messageId: string): string {
  return [
    "chats",
    encodeStorageSegment(chatId),
    "messages",
    encodeStorageSegment(messageId),
    "swipes",
  ].join("/");
}

export function stateStoragePath(identity: StateIdentity): string {
  const parsed = StateIdentitySchema.parse(identity);
  return `${messageStatePrefix(parsed.chatId, parsed.messageId)}/${parsed.swipeId}.json`;
}
