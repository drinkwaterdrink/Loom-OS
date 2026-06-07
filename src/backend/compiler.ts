import type { LlmMessageDTO } from "lumiverse-spindle-types";
import {
  LoomOSCompiledStateSchema,
  LoomOSStateSchema,
} from "../shared/schemas";
import {
  STATE_COMPILER_PROMPT,
  STATE_REPAIR_PROMPT,
} from "../shared/prompts";
import type { LoomOSState, StateIdentity } from "../shared/types";

export type GenerateCompilerOutput = (
  messages: LlmMessageDTO[],
  signal: AbortSignal,
) => Promise<string>;

export interface CompileRequest {
  identity: StateIdentity;
  transcript: string;
  messageCount: number;
  existingState: LoomOSState | null;
  signal: AbortSignal;
  generate: GenerateCompilerOutput;
}

export type CompileResult =
  | { ok: true; state: LoomOSState; repaired: boolean }
  | { ok: false; state: LoomOSState | null; error: string };

function extractJsonObject(raw: string): unknown {
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
    if (result.success) {
      return "Unknown validation failure.";
    }
    return result.error.issues
      .slice(0, 12)
      .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
      .join("\n");
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

export function parseCompilerOutput(
  raw: string,
  identity: StateIdentity,
  messageCount: number,
  repaired: boolean,
): LoomOSState {
  const compiled = LoomOSCompiledStateSchema.parse(extractJsonObject(raw));
  return LoomOSStateSchema.parse({
    ...compiled,
    schemaVersion: 1,
    identity,
    generatedAt: new Date().toISOString(),
    source: {
      messageCount,
      repaired,
    },
  });
}

export async function compileStateWithRepair(
  request: CompileRequest,
): Promise<CompileResult> {
  const firstMessages: LlmMessageDTO[] = [
    { role: "system", content: STATE_COMPILER_PROMPT },
    {
      role: "user",
      content: `Compile state for this transcript:\n\n${request.transcript}`,
    },
  ];

  const firstRaw = await request.generate(firstMessages, request.signal);
  try {
    return {
      ok: true,
      state: parseCompilerOutput(
        firstRaw,
        request.identity,
        request.messageCount,
        false,
      ),
      repaired: false,
    };
  } catch {
    const repairMessages: LlmMessageDTO[] = [
      { role: "system", content: STATE_REPAIR_PROMPT },
      {
        role: "user",
        content: [
          "Validation failures:",
          validationError(firstRaw),
          "",
          "Malformed output:",
          firstRaw.slice(0, 24_000),
        ].join("\n"),
      },
    ];

    const repairedRaw = await request.generate(repairMessages, request.signal);
    try {
      return {
        ok: true,
        state: parseCompilerOutput(
          repairedRaw,
          request.identity,
          request.messageCount,
          true,
        ),
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
