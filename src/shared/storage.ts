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

export function resolveStorageListPath(prefix: string, listedPath: string): string {
  const normalizedPrefix = prefix.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  const normalizedPath = listedPath.replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (
    normalizedPath === normalizedPrefix
    || normalizedPath.startsWith(`${normalizedPrefix}/`)
    || normalizedPath.startsWith("chats/")
  ) {
    return normalizedPath;
  }
  return `${normalizedPrefix}/${normalizedPath}`;
}

export function parseChatStateStoragePath(
  listedPath: string,
  chatId: string,
): { messageId: string; swipeId: number } | null {
  const prefix = `chats/${encodeStorageSegment(chatId)}/messages`;
  const fullPath = resolveStorageListPath(prefix, listedPath);
  const parts = fullPath.split("/");
  if (
    parts.length !== 6
    || parts[0] !== "chats"
    || parts[1] !== encodeStorageSegment(chatId)
    || parts[2] !== "messages"
    || parts[4] !== "swipes"
  ) {
    return null;
  }
  const swipeMatch = /^(\d+)\.json$/.exec(parts[5] ?? "");
  if (!swipeMatch) return null;
  try {
    const messageId = decodeURIComponent(parts[3] ?? "");
    if (!messageId) return null;
    return { messageId, swipeId: Number(swipeMatch[1]) };
  } catch {
    return null;
  }
}

export function stateStoragePath(identity: StateIdentity): string {
  const parsed = StateIdentitySchema.parse(identity);
  return `${messageStatePrefix(parsed.chatId, parsed.messageId)}/${parsed.swipeId}.json`;
}
