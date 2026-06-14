import type { LlmMessageDTO } from "lumiverse-spindle-types";
import {
  ARTIFACT_FORMAT,
  ARTIFACT_VERSION,
  VIEWER_MODEL_VERSION,
  createStarterBlueprintArtifact,
  createStarterModuleArtifact,
  createStarterThemeArtifact,
  parseLoomOSArtifactText,
  type LoomOSArtifact,
} from "../shared/artifacts";

export type ArtifactGenerationKind = LoomOSArtifact["kind"];

export interface ArtifactGenerationRequest {
  kind: ArtifactGenerationKind;
  brief: string;
  currentArtifact?: LoomOSArtifact | null;
  signal: AbortSignal;
  generate: (
    messages: LlmMessageDTO[],
    signal: AbortSignal,
    attempt: 1 | 2,
  ) => Promise<string>;
  onProgress?: (attempt: 1 | 2, message: string) => void;
}

export interface ArtifactGenerationResult {
  artifact: LoomOSArtifact;
  repaired: boolean;
  issues: string[];
}

function starterForKind(kind: ArtifactGenerationKind): LoomOSArtifact {
  if (kind === "theme") return createStarterThemeArtifact();
  if (kind === "blueprint") return createStarterBlueprintArtifact();
  return createStarterModuleArtifact();
}

function artifactContract(kind: ArtifactGenerationKind): string {
  const common = `Every artifact must include:
- format: "${ARTIFACT_FORMAT}"
- version: ${ARTIFACT_VERSION}
- kind: "${kind}"
- id: stable identifier beginning with a letter and using only letters, numbers, underscores, or hyphens
- createdAt and updatedAt: ISO timestamps
- meta: name, description, author, tags`;

  if (kind === "module") {
    return `${common}
- schema: a JSON Schema Draft 7 subset using only type, title, description, default, enum, properties, required, additionalProperties, items, minItems, maxItems, minLength, maxLength, minimum, maximum
- prompt: precise generation instructions that request semantic story state only
- view: HTML, CSS, optional isolated JavaScript, and optional partials
- sampleData: realistic data matching schema
- defaults: track, display, inject, group, maxItems, intensity, displayOrder
- capabilities: any of copy, collapse, navigation, reload, generation, history
The root schema should normally be an object. Do not ask the model to generate display colors, percentages, counts, visibility flags, or labels that LoomOS can derive.`;
  }
  if (kind === "theme") {
    return `${common}
- manifest: viewerModelVersion=${VIEWER_MODEL_VERSION}, developerMode, capabilities, minWidth, preferredColorScheme
- view: complete responsive HTML, CSS, optional isolated JavaScript, and reusable partials
- sampleData
Templates support escaped {{path}}, {{#if path}}, {{#unless path}}, {{#each path}}, {{else}}, {{> partial}}, and helpers count, percent, json, uppercase, lowercase, fallback.
ViewerModelV1 paths include meta, counts, kernel, delta, meters, scene, cast, world, story, continuity, tools, audit, and modules.
Use data-loom-action for bridge actions. Theme JavaScript may call window.LoomOS.action(name, payload) and read window.LoomOS.model. It has no network, storage, host DOM, or Spindle access.`;
  }
  return `${common}
- modules: complete module artifacts
- theme: one complete theme artifact or null
- settings: optional recommended injectionEnabled, injectionTokenBudget, compilerSeedTokenBudget, historyRetentionLimit, and developerMode
Every embedded artifact must use the same version-2 contract.`;
}

function systemPrompt(kind: ArtifactGenerationKind): string {
  return `You are the LoomOS Creator Workshop artifact engineer.
Return exactly one JSON object and no Markdown fences or commentary.
Create a production-ready, mobile-first ${kind} artifact.
Preserve grounded tracker semantics, concise generation instructions, readable typography, accessible controls, and responsive layouts.
Never include external URLs, remote assets, network calls, eval, Function constructors, storage access, parent DOM access, or Spindle APIs.
JavaScript is optional and must use only the isolated LoomOS bridge.

${artifactContract(kind)}

Valid starter shape:
${JSON.stringify(starterForKind(kind), null, 2)}`;
}

function userPrompt(request: ArtifactGenerationRequest): string {
  return [
    request.currentArtifact
      ? "Revise the current artifact according to the request. Preserve working details not explicitly changed."
      : "Create a new artifact according to the request.",
    "",
    "REQUEST:",
    request.brief.trim(),
    "",
    request.currentArtifact
      ? `CURRENT ARTIFACT:\n${JSON.stringify(request.currentArtifact, null, 2)}`
      : "",
  ].filter(Boolean).join("\n");
}

function parseExpected(raw: string, kind: ArtifactGenerationKind): LoomOSArtifact {
  const artifact = parseLoomOSArtifactText(raw);
  if (artifact.kind !== kind) {
    throw new Error(`Expected a ${kind} artifact but received ${artifact.kind}.`);
  }
  return artifact;
}

export async function generateArtifactWithRepair(
  request: ArtifactGenerationRequest,
): Promise<ArtifactGenerationResult> {
  request.onProgress?.(1, `Generating ${request.kind} draft.`);
  const messages: LlmMessageDTO[] = [
    { role: "system", content: systemPrompt(request.kind) },
    { role: "user", content: userPrompt(request) },
  ];
  const firstRaw = await request.generate(messages, request.signal, 1);
  try {
    return {
      artifact: parseExpected(firstRaw, request.kind),
      repaired: false,
      issues: [],
    };
  } catch (error) {
    const issue = error instanceof Error ? error.message : String(error);
    request.onProgress?.(2, `Repairing artifact: ${issue.split("\n")[0] ?? "invalid output"}`);
    const repairMessages: LlmMessageDTO[] = [
      {
        role: "system",
        content: `${systemPrompt(request.kind)}

Repair the malformed artifact. Satisfy every contract exactly and return only the corrected JSON object.`,
      },
      {
        role: "user",
        content: [
          "VALIDATION FAILURE:",
          issue.slice(0, 6000),
          "",
          "MALFORMED OUTPUT:",
          firstRaw.slice(0, 80_000),
        ].join("\n"),
      },
    ];
    const repairedRaw = await request.generate(repairMessages, request.signal, 2);
    return {
      artifact: parseExpected(repairedRaw, request.kind),
      repaired: true,
      issues: [issue],
    };
  }
}
