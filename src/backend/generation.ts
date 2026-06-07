import type {
  LlmMessageDTO,
  SpindleAPI,
} from "lumiverse-spindle-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function normalizeGenerationText(result: unknown): string {
  if (typeof result === "string" && result.trim()) return result;
  if (!isRecord(result)) {
    throw new Error("Lumiverse generation returned an unsupported response.");
  }
  for (const key of ["content", "text", "output", "response"]) {
    const value = result[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  const message = result.message;
  if (typeof message === "string" && message.trim()) return message;
  if (isRecord(message) && typeof message.content === "string" && message.content.trim()) {
    return message.content;
  }
  throw new Error("Lumiverse generation completed without textual content.");
}

export interface QuietGenerationRequest {
  messages: LlmMessageDTO[];
  connectionId: string;
  userId: string;
  timeoutMs: number;
  parentSignal: AbortSignal;
}

export async function runQuietGeneration(
  spindle: SpindleAPI,
  request: QuietGenerationRequest,
): Promise<string> {
  const controller = new AbortController();
  let timedOut = false;
  const onAbort = () => controller.abort();
  request.parentSignal.addEventListener("abort", onAbort, { once: true });
  if (request.parentSignal.aborted) controller.abort();
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, request.timeoutMs);

  try {
    const result = await spindle.generate.quiet({
      type: "quiet",
      messages: request.messages,
      connection_id: request.connectionId || undefined,
      reasoning: { source: "off" },
      userId: request.userId,
      signal: controller.signal,
    });
    return normalizeGenerationText(result);
  } catch (error) {
    if (timedOut) {
      const duration = request.timeoutMs >= 1000
        ? `${Math.round(request.timeoutMs / 1000)} seconds`
        : `${request.timeoutMs} ms`;
      throw new Error(`Generation timed out after ${duration}.`);
    }
    throw error;
  } finally {
    clearTimeout(timer);
    request.parentSignal.removeEventListener("abort", onAbort);
  }
}
