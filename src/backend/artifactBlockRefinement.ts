import type { LlmMessageDTO } from "lumiverse-spindle-types";
import {
  ARTIFACT_FORMAT,
  ARTIFACT_VERSION,
  VIEWER_MODEL_VERSION,
  type LoomOSArtifact,
} from "../shared/artifacts";
import {
  boundedBlockContext,
  parseArtifactBlockRefinementText,
  type AppliedArtifactBlockRefinement,
  type ArtifactBlockTarget,
} from "../shared/artifactBlocks";

export interface ArtifactBlockRefinementRequest {
  artifact: LoomOSArtifact;
  target: ArtifactBlockTarget;
  instruction: string;
  signal: AbortSignal;
  generate: (
    messages: LlmMessageDTO[],
    signal: AbortSignal,
    attempt: 1 | 2,
  ) => Promise<string>;
  onProgress?: (attempt: 1 | 2, message: string) => void;
}

export interface ArtifactBlockRefinementGenerationResult extends AppliedArtifactBlockRefinement {
  repaired: boolean;
  issues: string[];
}

function throwIfAborted(signal: AbortSignal): void {
  if (!signal.aborted) return;
  throw new DOMException("Block refinement cancelled.", "AbortError");
}

function artifactBlockContract(artifact: LoomOSArtifact, target: ArtifactBlockTarget): string {
  const common = `Artifact contract:
- format is "${ARTIFACT_FORMAT}", version is ${ARTIFACT_VERSION}
- selected artifact kind is "${artifact.kind}" and id is "${artifact.id}"
- selected block path is "${target.path}"
- selected block language is "${target.language}"
- output must be strict JSON with target.path, replacementValue, summary, warnings, changedPaths, repaired, and issues
- changedPaths must contain only "${target.path}" or child paths under it
- do not rewrite unrelated fields or return commentary outside JSON`;

  if (artifact.kind === "module") {
    return `${common}
Module blocks must preserve the v2 Module Capsule contract. Schema replacements must remain in the allowed JSON Schema subset. Prompt replacements must request semantic story state only. HTML, CSS, JavaScript, and partials must not include remote assets, network calls, eval, Function constructors, storage access, parent DOM access, or external scripts.`;
  }
  if (artifact.kind === "theme") {
    return `${common}
Theme blocks must preserve ViewerModelV${VIEWER_MODEL_VERSION} compatibility. Design token replacements must use local safe token values only. Theme JavaScript remains optional and gated by Developer Mode; never add network, storage, parent DOM, eval, Function constructors, or external assets.`;
  }
  return `${common}
Blueprint blocks must preserve embedded Module and Theme v2 contracts. Do not alter embedded artifacts outside the selected Blueprint block.`;
}

function systemPrompt(artifact: LoomOSArtifact, target: ArtifactBlockTarget): string {
  return `You are the LoomOS Creator Workshop block-refinement engineer.
Return exactly one JSON object and no Markdown fences.
Change only the selected block. The backend will apply only that block and validate the full artifact afterward.
If the user asks for unrelated changes, keep them as warnings instead of changing other paths.

Security rules:
- no remote assets, URLs, network calls, eval, Function constructors, storage access, parent DOM access, external scripts, or Spindle APIs
- do not weaken sandbox, CSP, Developer Mode gating, exact-swipe storage, compiler behavior, or restricted raw renderedContent behavior
- keep outputs bounded to the selected block

${artifactBlockContract(artifact, target)}

Expected JSON shape:
{
  "target": { "artifactId": "${artifact.id}", "kind": "${artifact.kind}", "path": "${target.path}" },
  "replacementValue": <${target.language === "json" ? "JSON value" : "string"}>,
  "summary": "short user-facing summary",
  "warnings": [],
  "changedPaths": ["${target.path}"],
  "repaired": false,
  "issues": []
}`;
}

function userPrompt(request: ArtifactBlockRefinementRequest): string {
  return [
    "USER INSTRUCTION:",
    request.instruction.trim(),
    "",
    "BOUNDED BLOCK CONTEXT:",
    JSON.stringify(boundedBlockContext(request.artifact, request.target), null, 2),
  ].join("\n");
}

export function buildArtifactBlockRefinementMessages(
  request: ArtifactBlockRefinementRequest,
): LlmMessageDTO[] {
  return [
    { role: "system", content: systemPrompt(request.artifact, request.target) },
    { role: "user", content: userPrompt(request) },
  ];
}

export async function refineArtifactBlockWithRepair(
  request: ArtifactBlockRefinementRequest,
): Promise<ArtifactBlockRefinementGenerationResult> {
  if (!request.instruction.trim()) throw new Error("Describe the block change you want AI to make.");
  throwIfAborted(request.signal);
  request.onProgress?.(1, `Refining ${request.target.label}.`);
  const messages = buildArtifactBlockRefinementMessages(request);
  const firstRaw = await request.generate(messages, request.signal, 1);
  throwIfAborted(request.signal);
  try {
    const applied = parseArtifactBlockRefinementText(firstRaw, request.artifact, request.target, false);
    return { ...applied, repaired: false, issues: applied.result.issues };
  } catch (error) {
    const issue = error instanceof Error ? error.message : String(error);
    throwIfAborted(request.signal);
    request.onProgress?.(2, `Repairing block output: ${issue.split("\n")[0] ?? "invalid output"}`);
    const repairMessages: LlmMessageDTO[] = [
      {
        role: "system",
        content: `${systemPrompt(request.artifact, request.target)}

Repair the malformed block result. Return only the strict JSON object for target path "${request.target.path}".`,
      },
      {
        role: "user",
        content: [
          "VALIDATION FAILURE:",
          issue.slice(0, 6000),
          "",
          "MALFORMED OUTPUT:",
          firstRaw.slice(0, 80_000),
          "",
          "BOUNDED BLOCK CONTEXT:",
          JSON.stringify(boundedBlockContext(request.artifact, request.target), null, 2),
        ].join("\n"),
      },
    ];
    const repairedRaw = await request.generate(repairMessages, request.signal, 2);
    throwIfAborted(request.signal);
    const applied = parseArtifactBlockRefinementText(repairedRaw, request.artifact, request.target, true);
    return {
      ...applied,
      result: {
        ...applied.result,
        repaired: true,
        issues: [issue, ...applied.result.issues],
      },
      repaired: true,
      issues: [issue],
    };
  }
}
