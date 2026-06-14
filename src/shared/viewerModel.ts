import type {
  LoomOSSettings,
  LoomOSState,
  StateHistoryItem,
} from "./types";
import { VIEWER_MODEL_VERSION } from "./artifacts";

export interface ViewerModelV1 {
  version: 1;
  meta: {
    generatedAt: string;
    identity: LoomOSState["identity"] | null;
    exactLabel: string;
    status: string;
    activeThemeId: string;
  };
  counts: {
    modules: number;
    cast: number;
    threads: number;
    risks: number;
    history: number;
    customModules: number;
  };
  kernel: LoomOSState["kernel"];
  delta: LoomOSState["delta"];
  meters: LoomOSState["meters"];
  scene: LoomOSState["scene"];
  cast: LoomOSState["castMatrix"];
  world: LoomOSState["worldState"];
  story: LoomOSState["storyState"];
  continuity: LoomOSState["continuityFirewall"];
  tools: LoomOSState["tools"];
  audit: LoomOSState["auditLog"];
  modules: Record<string, {
    id: string;
    label: string;
    summary: string;
    fields: Record<string, unknown>;
    items: LoomOSState["customModuleData"][number]["items"];
  }>;
}

function emptyState(): Pick<
  ViewerModelV1,
  "kernel" | "delta" | "meters" | "scene" | "cast" | "world" | "story" | "continuity" | "tools" | "audit"
> {
  return {
    kernel: {
      scene: "",
      location: "",
      timeframe: "",
      date: "",
      time: "",
      elapsed: "",
      weather: "",
      pov: "",
      tone: "",
      topic: "",
      theme: "",
      objective: "",
      summary: "",
      currentFocus: "",
      nextFocus: "",
      currentRisk: "",
      stopMode: "",
      stopWhy: "",
      constraints: [],
    },
    delta: {
      headline: "",
      changedModules: [],
      changes: [],
      carriedForward: [],
      newlyEstablished: [],
    },
    meters: [],
    scene: null,
    cast: [],
    world: null,
    story: {
      goals: [],
      conflicts: [],
      threadLoom: [],
      stakes: [],
      countdowns: [],
      autonomyQueue: [],
      spotlightQueue: [],
    },
    continuity: {
      establishedFacts: [],
      antiRetconAnchors: [],
      pendingConsequences: [],
      offscreenState: [],
      bannedNext: [],
      impossibleNext: [],
      risks: [],
      terms: [],
    },
    tools: {
      actionResolver: null,
      dialogueState: null,
      directorStyle: null,
      closenessState: null,
      imagePrompt: null,
    },
    audit: [],
  };
}

export function buildViewerModel(
  state: LoomOSState | null,
  settings: LoomOSSettings,
  history: StateHistoryItem[] = [],
  status = "",
): ViewerModelV1 {
  const fallback = emptyState();
  const modules = Object.fromEntries(
    (state?.customModuleData ?? []).map((module) => [
      module.moduleId,
      {
        id: module.moduleId,
        label: module.label,
        summary: module.summary,
        fields: module.fields,
        items: module.items,
      },
    ]),
  );
  return {
    version: VIEWER_MODEL_VERSION,
    meta: {
      generatedAt: state?.generatedAt ?? "",
      identity: state?.identity ?? null,
      exactLabel: state
        ? `${state.identity.messageId.slice(0, 8)} | swipe ${state.identity.swipeId}`
        : "No exact-swipe tracker",
      status,
      activeThemeId: settings.activeThemeId,
    },
    counts: {
      modules: state?.activeModules.length ?? 0,
      cast: state?.castMatrix.length ?? 0,
      threads: state?.storyState.threadLoom.filter((thread) => thread.status !== "resolved").length ?? 0,
      risks: state?.continuityFirewall.risks.length ?? 0,
      history: history.length,
      customModules: Object.keys(modules).length,
    },
    kernel: state?.kernel ?? fallback.kernel,
    delta: state?.delta ?? fallback.delta,
    meters: state?.meters ?? fallback.meters,
    scene: state?.scene ?? fallback.scene,
    cast: state?.castMatrix ?? fallback.cast,
    world: state?.worldState ?? fallback.world,
    story: state?.storyState ?? fallback.story,
    continuity: state?.continuityFirewall ?? fallback.continuity,
    tools: state?.tools ?? fallback.tools,
    audit: state?.auditLog ?? fallback.audit,
    modules,
  };
}
