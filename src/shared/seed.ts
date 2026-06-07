import type {
  LoomOSSettings,
  LoomOSState,
} from "./types";

function compactText(value: string, max = 240): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function hasAppearanceEvidence(
  appearance: LoomOSState["castMatrix"][number]["appearance"],
): boolean {
  return Object.values(appearance ?? {}).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );
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
      appearance: modules.appearance.track && hasAppearanceEvidence(member.appearance)
        ? {
            species: member.appearance.species,
            ageBand: member.appearance.ageBand,
            apparentAge: member.appearance.apparentAge,
            genderPresentation: member.appearance.genderPresentation,
            height: member.appearance.height,
            weight: member.appearance.weight,
            build: member.appearance.build,
            bodyType: member.appearance.bodyType,
            frame: member.appearance.frame,
            proportions: member.appearance.proportions,
            silhouette: member.appearance.silhouette,
            shoulders: member.appearance.shoulders,
            bust: member.appearance.bust,
            waist: member.appearance.waist,
            hips: member.appearance.hips,
            skin: member.appearance.skin,
            complexion: member.appearance.complexion,
            hair: member.appearance.hair,
            eyes: member.appearance.eyes,
            distinguishingMarks: member.appearance.distinguishingMarks,
            scars: member.appearance.scars,
            tattoos: member.appearance.tattoos,
            piercings: member.appearance.piercings,
            uniqueFeatures: member.appearance.uniqueFeatures,
            immutableTraits: member.appearance.immutableTraits?.slice(0, 8),
            presence: member.appearance.presence,
            anchor: member.appearance.anchor,
          }
        : undefined,
      clothing: modules.clothing.track
        ? {
            summary: compactText(member.clothing?.summary ?? member.clothingSummary ?? ""),
            layerCount: member.clothing?.layerCount ?? 0,
            notable: compactText(member.clothing?.notable ?? ""),
          }
        : undefined,
      currentState: modules.castVisuals.track && member.currentState
        ? {
            pose: compactText(member.currentState.pose ?? member.pose ?? ""),
            proximity: compactText(member.currentState.proximity ?? member.proximity ?? ""),
            hands: compactText(member.currentState.leftHand ?? member.hands ?? ""),
            emotion: compactText(member.currentState.emotion ?? member.emotionalState ?? ""),
            injury: compactText(member.currentState.injury ?? ""),
          }
        : undefined,
      changed: member.changed,
      goals: member.goals.slice(0, 4).map(compactText),
      relationships: modules.relationships.track
        ? member.relationships.slice(0, 4).map((rel) => ({
            target: rel.target,
            value: rel.value,
            trend: rel.trend,
            evidence: rel.evidence ? compactText(rel.evidence) : undefined,
          }))
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
      uncertainty: member.continuity?.uncertainty?.slice(0, 3).map((u) => ({
        claim: compactText(u.claim),
        confidence: u.confidence,
        label: u.label,
      })),
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
      pending: state.continuityFirewall.pendingConsequences.slice(0, 10).map((item) =>
        compactText(typeof item === "string" ? item : item.pending)
      ),
      offscreen: state.continuityFirewall.offscreenState.slice(0, 8).map(compactText),
      persistentBans: state.continuityFirewall.bannedNext
        .filter((item) => item.scope === "persistent")
        .slice(0, 6)
        .map((item) => compactText(item.text)),
      terms: state.continuityFirewall.terms?.slice(0, 6).map((item) => ({
        party: item.party,
        term: compactText(item.term),
        status: item.status,
      })),
    },
    world: modules.worldSpace.track && state.scene
      ? {
          privacy: state.scene.privacy,
          access: state.scene.access,
          spatial: state.scene.spatial.slice(0, 6).map(compactText),
          items: modules.inventory.track ? state.scene.items.slice(0, 6) : undefined,
        }
      : undefined,
    custom: (state.customModuleData || [])
      .filter((m) => settings.customModules?.find(cm => cm.id === m.moduleId && cm.enabled))
      .map((m) => ({
        id: m.moduleId,
        summary: compactText(m.summary),
        items: m.items.slice(0, 4).map((it) => ({
          title: it.title,
          text: compactText(it.text),
          importance: it.importance
        }))
      }))
  };
  return trimJsonToBudget(seed, settings.compilerSeedTokenBudget);
}
