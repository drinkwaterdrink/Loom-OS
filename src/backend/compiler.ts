import type { LlmMessageDTO } from "lumiverse-spindle-types";
import {
  LoomOSCompiledStateSchema,
  LoomOSStateSchema,
} from "../shared/schemas";
import {
  buildFallbackCompiledState,
  CompiledStateNormalizationError,
  normalizeCompiledState,
  type NormalizationReport,
} from "../shared/normalizeCompiledState";
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
import type { StockModuleOverrides } from "../shared/modules";

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
  customModules?: any[];
  stockModuleOverrides?: StockModuleOverrides;
  connectionId: string;
  signal: AbortSignal;
  generate: GenerateCompilerOutput;
  onPhase?: (phase: GenerationPhase, attempt: 1 | 2, message: string) => void;
}

export type CompileResult =
  | {
      ok: true;
      state: LoomOSState;
      repaired: boolean;
      normalized: boolean;
      fallbackSaved: boolean;
      issues: string[];
      debugReport: string;
    }
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

function rawValidationIssues(raw: string): string[] {
  try {
    const parsed = extractJsonObject(raw);
    const result = LoomOSCompiledStateSchema.safeParse(parsed);
    if (result.success) return [];
    return result.error.issues
      .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`);
  } catch (error) {
    return [error instanceof Error ? error.message : String(error)];
  }
}

function parseCompilerOutputDetailed(
  raw: string,
  request: Pick<
    CompileRequest,
    "identity" | "messageCount" | "seedState" | "connectionId" | "enabledModules" | "customModules"
  >,
  repaired: boolean,
): { state: LoomOSState; report: NormalizationReport } {
  const normalized = normalizeCompiledState(extractJsonObject(raw), {
    enabledModules: request.enabledModules,
    customModules: request.customModules,
  });
  const state = LoomOSStateSchema.parse({
    ...normalized.state,
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
  return { state, report: normalized.report };
}

export function parseCompilerOutput(
  raw: string,
  request: Pick<
    CompileRequest,
    "identity" | "messageCount" | "seedState" | "connectionId" | "enabledModules" | "customModules"
  >,
  repaired: boolean,
): LoomOSState {
  return parseCompilerOutputDetailed(raw, request, repaired).state;
}

function normalizeFailureIssues(error: unknown, raw: string): string[] {
  if (error instanceof CompiledStateNormalizationError) return error.report.issues;
  const rawIssues = rawValidationIssues(raw);
  return rawIssues.length > 0
    ? rawIssues
    : [error instanceof Error ? error.message : String(error)];
}

function debugReport(firstIssues: string[], repairIssues: string[], fallbackSaved: boolean): string {
  return [
    "LoomOS compiler debug report",
    "Normalization attempted: yes",
    `Fallback saved: ${fallbackSaved ? "yes" : "no"}`,
    "",
    "First output issues:",
    ...(firstIssues.length > 0 ? firstIssues : ["none"]),
    "",
    "Repair output issues:",
    ...(repairIssues.length > 0 ? repairIssues : ["none"]),
  ].join("\n");
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
    {
      role: "system",
      content: buildStateCompilerPrompt(
        request.enabledModules,
        request.customModules,
        request.stockModuleOverrides,
      ),
    },
    { role: "user", content: compilerUserMessage(request) },
  ];

  request.onPhase?.("requesting", 1, "Requesting structured state from the selected connection.");
  const firstRaw = await request.generate(firstMessages, request.signal, 1);
  request.onPhase?.("validating", 1, "Normalizing and validating State V2 output.");
  let firstIssues: string[] = [];
  try {
    const parsed = parseCompilerOutputDetailed(firstRaw, request, false);
    return {
      ok: true,
      state: parsed.state,
      repaired: false,
      normalized: parsed.report.normalized,
      fallbackSaved: false,
      issues: [],
      debugReport: debugReport([], [], false),
    };
  } catch (error) {
    firstIssues = normalizeFailureIssues(error, firstRaw);
    request.onPhase?.(
      "repairing",
      2,
      `Output remained invalid after normalization; repairing ${firstIssues[0] ?? "schema mismatch"}.`,
    );
    const repairMessages: LlmMessageDTO[] = [
      {
        role: "system",
        content: `${STATE_REPAIR_PROMPT}\n\n${buildStateCompilerPrompt(
          request.enabledModules,
          request.customModules,
          request.stockModuleOverrides,
        )}`,
      },
      {
        role: "user",
        content: [
          "Enabled modules:",
          request.enabledModules.join(", "),
          "",
          "Validation failures:",
          firstIssues.slice(0, 8).join("\n"),
          "",
          "Malformed output:",
          firstRaw.slice(0, 36_000),
        ].join("\n"),
      },
    ];

    const repairedRaw = await request.generate(repairMessages, request.signal, 2);
    request.onPhase?.("validating", 2, "Normalizing and validating repaired State V2 output.");
    try {
      const parsed = parseCompilerOutputDetailed(repairedRaw, request, true);
      return {
        ok: true,
        state: parsed.state,
        repaired: true,
        normalized: parsed.report.normalized,
        fallbackSaved: false,
        issues: firstIssues.slice(0, 8),
        debugReport: debugReport(firstIssues, [], false),
      };
    } catch (error) {
      const repairIssues = normalizeFailureIssues(error, repairedRaw);
      const issues = [...firstIssues, ...repairIssues].slice(0, 8);
      const fallbackCompiled = buildFallbackCompiledState({
        enabledModules: request.enabledModules,
        seedState: request.seedState ?? request.existingState,
        transcript: request.transcript,
        notes: issues.join(" | "),
      });
      const state = LoomOSStateSchema.parse({
        ...fallbackCompiled,
        schemaVersion: 2,
        identity: request.identity,
        generatedAt: new Date().toISOString(),
        source: {
          messageCount: request.messageCount,
          repaired: true,
          seedIdentity: request.seedState?.identity ?? null,
          connectionId: request.connectionId,
        },
      });
      return {
        ok: true,
        state,
        repaired: true,
        normalized: true,
        fallbackSaved: true,
        issues,
        debugReport: debugReport(firstIssues, repairIssues, true),
      };
    }
  }
}
