import type {
  LoomOSSettings,
  LoomOSState,
  ModuleKey,
} from "./types";

export type TokenCounter = (text: string) => Promise<number>;

function clean(value: string, max = 260): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function xmlEscape(value: string, max = 260): string {
  return clean(value, max)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

export async function buildCompactInjection(
  state: LoomOSState,
  settings: LoomOSSettings,
  countTokens: TokenCounter,
): Promise<string> {
  const open = "<loomos_state>";
  const close = "</loomos_state>";
  const enabled = (key: ModuleKey) =>
    settings.moduleSettings[key].track
    && settings.moduleSettings[key].inject
    && state.activeModules.includes(key);
  const fragments: string[] = [];

  if (enabled("deltas")) {
    fragments.push(`delta: ${xmlEscape(state.delta.headline)}`);
    fragments.push(...state.delta.changes.slice(0, 4).map((change) =>
      `change.${change.module}.${change.importance}: ${xmlEscape(change.text)}`
    ));
  }
  if (enabled("sceneKernel")) {
    fragments.push(
      `scene: ${xmlEscape(state.kernel.scene)}; location=${xmlEscape(state.kernel.location)}; time=${xmlEscape(state.kernel.timeframe)}`,
      `focus: ${xmlEscape(state.kernel.currentFocus || state.kernel.objective)}`,
    );
  }
  if (enabled("continuity")) {
    fragments.push(...state.continuityFirewall.antiRetconAnchors.slice(0, 6).map((item) =>
      `anchor: ${xmlEscape(item)}`
    ));
    fragments.push(...state.continuityFirewall.pendingConsequences.slice(0, 5).map((item) =>
      `pending: ${xmlEscape(item)}`
    ));
  }
  if (enabled("actionResolver") && state.tools.actionResolver) {
    const resolver = state.tools.actionResolver;
    fragments.push(
      `action: ${xmlEscape(resolver.userAction)}; response=${xmlEscape(resolver.worldResponse)}; risk=${xmlEscape(resolver.risk)}`,
    );
  }
  if (enabled("castCore")) {
    fragments.push(...state.castMatrix
      .filter((member) => member.kind === "pov" || member.kind === "main" || member.spotlight.value >= 45)
      .slice(0, 6)
      .map((member) =>
        `cast.${xmlEscape(member.name, 80)}: ${xmlEscape(member.status)}; intent=${xmlEscape(member.intent)}; goal=${xmlEscape(member.goals[0] ?? "")}`
      ));
  }
  if (enabled("worldSpace") && state.scene) {
    fragments.push(
      `access: ${state.scene.access.exit}; sight=${xmlEscape(state.scene.access.lineOfSight)}; noise=${xmlEscape(state.scene.access.noiseMask)}`,
      ...state.scene.spatial.slice(0, 4).map((item) => `space: ${xmlEscape(item)}`),
    );
  }
  if (enabled("inventory")) {
    fragments.push(...state.castMatrix.flatMap((member) =>
      member.pockets
        .filter((item) => item.known)
        .slice(0, 3)
        .map((item) =>
          `item.${xmlEscape(member.name, 60)}: ${xmlEscape(item.name)} x${item.qty}; ${xmlEscape(item.condition)}`
        )
    ).slice(0, 8));
  }
  if (enabled("storyThreads")) {
    fragments.push(...state.storyState.threadLoom
      .filter((thread) => thread.status !== "resolved")
      .sort((a, b) => b.urgency - a.urgency)
      .slice(0, 6)
      .map((thread) =>
        `thread.${xmlEscape(thread.title, 100)}: ${thread.status}/${thread.urgency}; ${xmlEscape(thread.nextPressure)}`
      ));
    fragments.push(...state.storyState.stakes.slice(0, 3).map((stake) =>
      `stakes.${xmlEscape(stake.who, 80)}: win=${xmlEscape(stake.win)}; lose=${xmlEscape(stake.lose)}`
    ));
  }
  if (enabled("continuity")) {
    fragments.push(...state.continuityFirewall.risks
      .filter((risk) => risk.severity === "high" || risk.severity === "critical")
      .slice(0, 4)
      .map((risk) => `risk.${risk.severity}: ${xmlEscape(risk.issue)}`));
  }

  const selected: string[] = [];
  for (const fragment of fragments.filter((item) => !item.endsWith(": "))) {
    const candidate = `${open}\n${[...selected, fragment].join("\n")}\n${close}`;
    if (await countTokens(candidate) <= settings.injectionTokenBudget) {
      selected.push(fragment);
    }
  }

  if (selected.length === 0) {
    return `${open}\nscene: ${xmlEscape(state.kernel.scene, Math.max(24, settings.injectionTokenBudget * 2))}\n${close}`;
  }
  return `${open}\n${selected.join("\n")}\n${close}`;
}
