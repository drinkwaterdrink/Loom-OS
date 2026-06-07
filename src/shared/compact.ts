import type { LoomOSState } from "./types";

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
  tokenBudget: number,
  countTokens: TokenCounter,
): Promise<string> {
  const open = "<loomos_state>";
  const close = "</loomos_state>";
  const fragments = [
    `scene: ${xmlEscape(state.kernel.scene)}`,
    `location_time: ${xmlEscape(`${state.kernel.location}; ${state.kernel.timeframe}`)}`,
    `objective: ${xmlEscape(state.kernel.objective)}`,
    `continuity_constraints: ${state.kernel.constraints.slice(0, 5).map(xmlEscape).join(" | ")}`,
    ...state.castMatrix.slice(0, 6).map((member) =>
      `cast.${xmlEscape(member.name, 80)}: ${xmlEscape(member.status)}; goal=${xmlEscape(member.goals[0] ?? "unknown")}`,
    ),
    ...state.threadLoom
      .filter((thread) => thread.status !== "resolved")
      .slice(0, 6)
      .map((thread) =>
        `thread.${xmlEscape(thread.title, 100)}: ${thread.status}/${thread.urgency}; ${xmlEscape(thread.nextPressure)}`,
      ),
    ...state.continuityFirewall.pendingConsequences.slice(0, 4).map((item) =>
      `pending: ${xmlEscape(item)}`,
    ),
    ...state.continuityFirewall.risks
      .filter((risk) => risk.severity === "high" || risk.severity === "critical")
      .slice(0, 4)
      .map((risk) => `risk.${risk.severity}: ${xmlEscape(risk.issue)}`),
  ].filter((fragment) => !fragment.endsWith(": "));

  const selected: string[] = [];
  for (const fragment of fragments) {
    const candidate = `${open}\n${[...selected, fragment].join("\n")}\n${close}`;
    if (await countTokens(candidate) <= tokenBudget) {
      selected.push(fragment);
    }
  }

  if (selected.length === 0) {
    const fallback = `${open}\nscene: ${xmlEscape(state.kernel.scene, Math.max(24, tokenBudget * 2))}\n${close}`;
    return fallback;
  }

  return `${open}\n${selected.join("\n")}\n${close}`;
}
