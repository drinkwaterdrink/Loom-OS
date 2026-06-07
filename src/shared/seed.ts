import type {
  LoomOSSettings,
  LoomOSState,
} from "./types";

function compactText(value: string, max = 240): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function trimJsonToBudget(value: unknown, tokenBudget: number): string {
  const serialized = JSON.stringify(value);
  const maxChars = Math.max(800, tokenBudget * 4);
  if (serialized.length <= maxChars) return serialized;
  return JSON.stringify({
    snapshotExcerpt: serialized.slice(0, maxChars - 120),
    truncated: true,
  });
}

export function buildStateSeedForCompiler(
  state: LoomOSState,
  settings: LoomOSSettings,
): string {
  const modules = settings.moduleSettings;
  const seed = {
    identity: state.identity,
    generatedAt: state.generatedAt,
    kernel: {
      scene: compactText(state.kernel.scene),
      location: compactText(state.kernel.location),
      timeframe: compactText(state.kernel.timeframe),
      date: compactText(state.kernel.date),
      time: compactText(state.kernel.time),
      elapsed: compactText(state.kernel.elapsed),
      pov: compactText(state.kernel.pov),
      tone: compactText(state.kernel.tone),
      objective: compactText(state.kernel.objective),
      currentFocus: compactText(state.kernel.currentFocus),
      currentRisk: compactText(state.kernel.currentRisk),
      constraints: state.kernel.constraints.slice(0, 8).map(compactText),
    },
    cast: state.castMatrix.slice(0, 10).map((member) => ({
      id: member.id,
      name: member.name,
      kind: member.kind,
      location: compactText(member.location),
      status: compactText(member.status),
      intent: compactText(member.intent),
      clothing: modules.clothing.track ? compactText(member.clothingSummary) : undefined,
      goals: member.goals.slice(0, 4).map(compactText),
      relationships: modules.relationships.track
        ? member.relationships.slice(0, 4).map(compactText)
        : undefined,
      pockets: modules.inventory.track
        ? member.pockets.slice(0, 4).map((item) => ({
            name: item.name,
            qty: item.qty,
            condition: compactText(item.condition),
            known: item.known,
          }))
        : undefined,
      stableFacts: member.stableFacts.slice(0, 4).map(compactText),
    })),
    story: {
      threads: state.storyState.threadLoom
        .filter((thread) => thread.status !== "resolved")
        .slice(0, 8)
        .map((thread) => ({
          title: thread.title,
          status: thread.status,
          urgency: thread.urgency,
          progress: thread.progress,
          nextPressure: compactText(thread.nextPressure),
        })),
      countdowns: state.storyState.countdowns.slice(0, 4),
      stakes: state.storyState.stakes.slice(0, 4),
    },
    continuity: {
      facts: state.continuityFirewall.establishedFacts.slice(0, 12).map(compactText),
      anchors: state.continuityFirewall.antiRetconAnchors.slice(0, 10).map(compactText),
      pending: state.continuityFirewall.pendingConsequences.slice(0, 10).map(compactText),
      offscreen: state.continuityFirewall.offscreenState.slice(0, 8).map(compactText),
      persistentBans: state.continuityFirewall.bannedNext
        .filter((item) => item.persistent)
        .slice(0, 6)
        .map((item) => compactText(item.text)),
    },
    world: modules.worldSpace.track && state.scene
      ? {
          privacy: state.scene.privacy,
          access: state.scene.access,
          spatial: state.scene.spatial.slice(0, 6).map(compactText),
          items: modules.inventory.track ? state.scene.items.slice(0, 6) : undefined,
        }
      : undefined,
  };
  return trimJsonToBudget(seed, settings.compilerSeedTokenBudget);
}
