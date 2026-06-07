import type { LlmMessageDTO } from "lumiverse-spindle-types";
import {
  LoomOSCompiledStateSchema,
  LoomOSStateSchema,
} from "../shared/schemas";
import {
  buildStateCompilerPrompt,
  STATE_REPAIR_PROMPT,
} from "../shared/prompts";
import type {
  GenerationPhase,
  LoomOSState,
  ModuleKey,
  StateIdentity,
} from "../shared/types";

export type GenerateCompilerOutput = (
  messages: LlmMessageDTO[],
  signal: AbortSignal,
  attempt: 1 | 2,
) => Promise<string>;

export interface CompileRequest {
  identity: StateIdentity;
  transcript: string;
  messageCount: number;
  existingState: LoomOSState | null;
  seedState: LoomOSState | null;
  seedText: string;
  enabledModules: ModuleKey[];
  connectionId: string;
  signal: AbortSignal;
  generate: GenerateCompilerOutput;
  onPhase?: (phase: GenerationPhase, attempt: 1 | 2, message: string) => void;
}

export type CompileResult =
  | { ok: true; state: LoomOSState; repaired: boolean }
  | { ok: false; state: LoomOSState | null; error: string };

export function extractJsonObject(raw: string): unknown {
  const withoutFence = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  const firstBrace = withoutFence.indexOf("{");
  const lastBrace = withoutFence.lastIndexOf("}");
  if (firstBrace < 0 || lastBrace <= firstBrace) {
    throw new Error("Compiler output did not contain a JSON object.");
  }
  return JSON.parse(withoutFence.slice(firstBrace, lastBrace + 1));
}

function validationError(raw: string): string {
  try {
    const parsed = extractJsonObject(raw);
    const result = LoomOSCompiledStateSchema.safeParse(parsed);
    if (result.success) return "Unknown validation failure.";
    return result.error.issues
      .slice(0, 16)
      .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
      .join("\n");
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

export function parseCompilerOutput(
  raw: string,
  request: Pick<
    CompileRequest,
    "identity" | "messageCount" | "seedState" | "connectionId" | "enabledModules"
  >,
  repaired: boolean,
): LoomOSState {
  const compiled = LoomOSCompiledStateSchema.parse(extractJsonObject(raw));
  return LoomOSStateSchema.parse({
    ...compiled,
    activeModules: request.enabledModules,
    schemaVersion: 2,
    identity: request.identity,
    generatedAt: new Date().toISOString(),
    source: {
      messageCount: request.messageCount,
      repaired,
      seedIdentity: request.seedState?.identity ?? null,
      connectionId: request.connectionId,
    },
  });
}

function compilerUserMessage(request: CompileRequest): string {
  return [
    "TARGET IDENTITY:",
    JSON.stringify(request.identity),
    "",
    "PREVIOUS STATE SEED (compiler context only; may be null):",
    request.seedText || "null",
    "",
    "RECENT TRANSCRIPT:",
    request.transcript,
  ].join("\n");
}

export async function compileStateWithRepair(
  request: CompileRequest,
): Promise<CompileResult> {
  request.onPhase?.("building_prompt", 1, "Building the enabled-module compiler prompt.");
  const firstMessages: LlmMessageDTO[] = [
    { role: "system", content: buildStateCompilerPrompt(request.enabledModules) },
    { role: "user", content: compilerUserMessage(request) },
  ];

  request.onPhase?.("requesting", 1, "Requesting structured state from the selected connection.");
  const firstRaw = await request.generate(firstMessages, request.signal, 1);
  request.onPhase?.("validating", 1, "Validating State V2 output.");
  try {
    return {
      ok: true,
      state: parseCompilerOutput(firstRaw, request, false),
      repaired: false,
    };
  } catch {
    request.onPhase?.("repairing", 2, "Output was invalid; running the single repair pass.");
    const repairMessages: LlmMessageDTO[] = [
      {
        role: "system",
        content: `${STATE_REPAIR_PROMPT}\n\n${buildStateCompilerPrompt(request.enabledModules)}`,
      },
      {
        role: "user",
        content: [
          "Enabled modules:",
          request.enabledModules.join(", "),
          "",
          "Validation failures:",
          validationError(firstRaw),
          "",
          "Malformed output:",
          firstRaw.slice(0, 36_000),
        ].join("\n"),
      },
    ];

    const repairedRaw = await request.generate(repairMessages, request.signal, 2);
    request.onPhase?.("validating", 2, "Validating repaired State V2 output.");
    try {
      return {
        ok: true,
        state: parseCompilerOutput(repairedRaw, request, true),
        repaired: true,
      };
    } catch {
      return {
        ok: false,
        state: request.existingState,
        error: [
          "Compiler output remained invalid after one repair attempt.",
          validationError(repairedRaw),
        ].join(" "),
      };
    }
  }
}
