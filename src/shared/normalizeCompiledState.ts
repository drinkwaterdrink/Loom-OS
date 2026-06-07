function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractString(value: unknown): string {
  if (typeof value === "string") return value;
  if (isRecord(value)) {
    for (const key of ["text", "rule", "issue", "claim", "reason", "description", "name", "title", "goal", "summary", "thing", "item"]) {
      const v = value[key];
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    for (const v of Object.values(value)) {
      if (typeof v === "string" && v.trim()) return v.trim();
    }
    return "";
  }
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function coerceStringArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) {
    const s = extractString(arr);
    return s ? [s] : [];
  }
  const result: string[] = [];
  for (const item of arr) {
    if (item === null || item === undefined) continue;
    if (typeof item === "string") {
      if (item.trim()) result.push(item.trim());
    } else if (isRecord(item)) {
      const extracted = extractString(item);
      if (extracted) result.push(extracted);
    } else if (typeof item === "number" || typeof item === "boolean") {
      result.push(String(item));
    }
  }
  return result;
}

function coercePocketItem(item: unknown): Record<string, unknown> | null {
  if (isRecord(item)) {
    const name = extractString(item) || "Unknown item";
    const type = typeof item.type === "string" && ["consumable", "concealed", "tool", "key", "evidence", "misc"].includes(item.type) ? item.type : "misc";
    let qty = 1;
    if (typeof item.qty === "number" && Number.isInteger(item.qty) && item.qty >= 0) {
      qty = item.qty;
    } else if (typeof item.qty === "string") {
      const parsed = parseInt(item.qty, 10);
      if (!isNaN(parsed) && parsed >= 0) qty = parsed;
    }
    const result: Record<string, unknown> = {
      name,
      type,
      qty,
      condition: typeof item.condition === "string" ? item.condition : "",
      known: typeof item.known === "boolean" ? item.known : true,
    };
    if (item.color !== undefined && typeof item.color === "string") result.color = item.color;
    if (item.changed !== undefined) result.changed = item.changed;
    if (item.changeNote !== undefined) result.changeNote = item.changeNote;
    return result;
  }
  if (typeof item === "string" && item.trim()) {
    return { name: item.trim(), type: "misc", qty: 1, condition: "", known: true };
  }
  return null;
}

function coerceRelationship(item: unknown): Record<string, unknown> | null {
  if (isRecord(item)) {
    const target = extractString(item) || "";
    if (!target) return null;
    return {
      target,
      axis: typeof item.axis === "string" && item.axis.trim() ? item.axis.trim() : "general",
      value: typeof item.value === "number" && item.value >= -100 && item.value <= 100 ? item.value : 0,
      ...(item.pct !== undefined ? { pct: item.pct } : {}),
      ...(item.label !== undefined ? { label: item.label } : {}),
      ...(item.color !== undefined ? { color: item.color } : {}),
      ...(item.trend !== undefined ? { trend: item.trend } : {}),
      ...(item.evidence !== undefined ? { evidence: item.evidence } : {}),
    };
  }
  if (typeof item === "string" && item.trim()) {
    return { target: item.trim(), axis: "general", value: 0 };
  }
  return null;
}

function coerceSetupEntry(item: unknown): Record<string, unknown> | null {
  if (isRecord(item)) {
    const thing = extractString(item) || "";
    if (!thing) return null;
    return {
      thing,
      ...(item.plantedBy !== undefined ? { plantedBy: item.plantedBy } : {}),
      ...(item.payoffWhen !== undefined ? { payoffWhen: item.payoffWhen } : {}),
      state: typeof item.state === "string" && ["LOADED", "HEATING", "FIRED", "DORMANT"].includes(item.state) ? item.state : "LOADED",
      ...(item.evidence !== undefined ? { evidence: item.evidence } : {}),
      ...(item.payoffHint !== undefined ? { payoffHint: item.payoffHint } : {}),
      ...(item.changed !== undefined ? { changed: item.changed } : {}),
      ...(item.changeNote !== undefined ? { changeNote: item.changeNote } : {}),
    };
  }
  if (typeof item === "string" && item.trim()) {
    return { thing: item.trim(), state: "LOADED" };
  }
  return null;
}

function coerceConsequenceEntry(item: unknown): Record<string, unknown> | null {
  if (isRecord(item)) {
    const cause = typeof item.cause === "string" ? item.cause.slice(0, 500) : "";
    const pending = typeof item.pending === "string" ? item.pending : extractString(item);
    if (!cause && !pending) return null;
    return {
      cause: cause || pending.slice(0, 500),
      pending: pending || cause,
      ...(item.trigger !== undefined ? { trigger: item.trigger } : {}),
      urgency: typeof item.urgency === "number" ? item.urgency : 5,
      ...(item.pct !== undefined ? { pct: item.pct } : {}),
      status: typeof item.status === "string" && ["PENDING", "ACTIVE", "FIRED", "RESOLVED", "DORMANT"].includes(item.status) ? item.status : "PENDING",
      ...(item.evidence !== undefined ? { evidence: item.evidence } : {}),
      ...(item.changed !== undefined ? { changed: item.changed } : {}),
      ...(item.changeNote !== undefined ? { changeNote: item.changeNote } : {}),
    };
  }
  if (typeof item === "string" && item.trim()) {
    return { cause: item.trim().slice(0, 500), pending: item.trim().slice(0, 1600), urgency: 5, status: "PENDING" };
  }
  return null;
}

function coerceAvoidNext(item: unknown): Record<string, unknown> | null {
  if (isRecord(item)) {
    const text = extractString(item) || "";
    if (!text) return null;
    return {
      text,
      ...(item.reason !== undefined ? { reason: item.reason } : {}),
      scope: typeof item.scope === "string" && ["turn", "scene", "persistent"].includes(item.scope) ? item.scope : "turn",
      ...(item.color !== undefined ? { color: item.color } : {}),
      source: typeof item.source === "string" && ["user", "system", "compiler"].includes(item.source) ? item.source : "compiler",
    };
  }
  if (typeof item === "string" && item.trim()) {
    return { text: item.trim(), scope: "turn", source: "compiler" };
  }
  return null;
}

function coerceTermEntry(item: unknown): Record<string, unknown> | null {
  if (isRecord(item)) {
    const party = extractString(item) || "";
    const term = typeof item.term === "string" ? item.term : "";
    if (!party && !term) return null;
    const result: Record<string, unknown> = {
      party: party || "Unknown",
      term: term || extractString(item) || "",
      status: typeof item.status === "string" && ["PENDING", "ACCEPTED", "REJECTED", "BROKEN", "EXPIRED", "UNKNOWN"].includes(item.status) ? item.status : "UNKNOWN",
    };
    if (item.risk !== undefined) result.risk = item.risk;
    if (item.binding !== undefined) result.binding = item.binding;
    if (item.evidence !== undefined) result.evidence = item.evidence;
    if (item.changed !== undefined) result.changed = item.changed;
    if (item.changeNote !== undefined) result.changeNote = item.changeNote;
    return result;
  }
  if (typeof item === "string" && item.trim()) {
    return { party: item.trim(), term: item.trim(), status: "UNKNOWN", binding: false };
  }
  return null;
}

function coerceAuditEntry(item: unknown): Record<string, unknown> | null {
  if (!isRecord(item)) return null;
  const system = typeof item.system === "string" && item.system.trim() ? item.system.trim() : "";
  const marker = typeof item.marker === "string" && item.marker.trim() ? item.marker.trim() : "";
  const result = typeof item.result === "string" && item.result.trim() ? item.result.trim() : extractString(item);
  if (!system && !marker && !result) return null;
  return {
    system: system || "compiler",
    marker: marker || "auto",
    result: result || "auto-normalized",
    repaired: typeof item.repaired === "boolean" ? item.repaired : false,
    notes: typeof item.notes === "string" ? item.notes : (extractString(item) || ""),
  };
}

function coerceStringFields(target: Record<string, unknown>, fields: string[]): void {
  for (const field of fields) {
    const val = target[field];
    if (val !== undefined) {
      target[field] = coerceStringArray(val);
    }
  }
}

export function normalizeCompilerOutput(raw: unknown): unknown {
  if (!isRecord(raw)) return raw;
  const root = { ...raw };

  if (isRecord(root.kernel)) {
    coerceStringFields(root.kernel as Record<string, unknown>, ["constraints"]);
  }

  if (Array.isArray(root.castMatrix)) {
    root.castMatrix = root.castMatrix.map((member: unknown) => {
      if (!isRecord(member)) return member;
      const m = { ...member } as Record<string, unknown>;

      coerceStringFields(m, ["goals", "stableFacts", "leverage"]);

      if (Array.isArray(m.pockets)) {
        m.pockets = m.pockets.map((item: unknown) => coercePocketItem(item)).filter(Boolean);
      }

      if (Array.isArray(m.relationships)) {
        m.relationships = m.relationships.map((item: unknown) => coerceRelationship(item)).filter(Boolean);
      }

      return m;
    });
  }

  if (isRecord(root.continuityFirewall)) {
    const fw = root.continuityFirewall as Record<string, unknown>;

    coerceStringFields(fw, ["establishedFacts", "antiRetconAnchors", "offscreenState", "impossibleNext"]);

    if (Array.isArray(fw.pendingConsequences)) {
      fw.pendingConsequences = fw.pendingConsequences.map((item: unknown) => coerceConsequenceEntry(item)).filter(Boolean);
    }

    if (Array.isArray(fw.bannedNext)) {
      fw.bannedNext = fw.bannedNext.map((item: unknown) => coerceAvoidNext(item)).filter(Boolean);
    }

    if (Array.isArray(fw.terms)) {
      fw.terms = fw.terms.map((item: unknown) => coerceTermEntry(item)).filter(Boolean);
    }
  }

  if (isRecord(root.scene)) {
    const scene = root.scene as Record<string, unknown>;
    coerceStringFields(scene, ["spatial"]);
    if (isRecord(scene.access)) {
      coerceStringFields(scene.access as Record<string, unknown>, ["items", "people"]);
    }
    if (isRecord(scene.carryover)) {
      coerceStringFields(scene.carryover as Record<string, unknown>, ["body", "room", "social"]);
    }
  }

  if (isRecord(root.worldState)) {
    const ws = root.worldState as Record<string, unknown>;
    coerceStringFields(ws, ["recentEnvironmentalChanges", "activeHazards"]);
    if (Array.isArray(ws.loadedSigns)) {
      ws.loadedSigns = ws.loadedSigns.map((item: unknown) => coerceSetupEntry(item)).filter(Boolean);
    }
  }

  if (isRecord(root.storyState)) {
    const ss = root.storyState as Record<string, unknown>;
    if (Array.isArray(ss.threadLoom)) {
      ss.threadLoom = (ss.threadLoom as unknown[]).map((thread: unknown) => {
        if (!isRecord(thread)) return thread;
        const t = { ...thread } as Record<string, unknown>;
        coerceStringFields(t, ["participants"]);
        return t;
      });
    }
  }

  if (isRecord(root.tools)) {
    const tools = root.tools as Record<string, unknown>;
    if (isRecord(tools.actionResolver)) {
      coerceStringFields(tools.actionResolver as Record<string, unknown>, ["blockers"]);
    }
    if (isRecord(tools.dialogueState)) {
      coerceStringFields(tools.dialogueState as Record<string, unknown>, ["levers", "taboos"]);
    }
    if (isRecord(tools.directorStyle)) {
      coerceStringFields(tools.directorStyle as Record<string, unknown>, ["voiceCues"]);
    }
    if (isRecord(tools.closenessState)) {
      coerceStringFields(tools.closenessState as Record<string, unknown>, ["consentSignals", "boundaries"]);
    }
  }

  if (Array.isArray(root.auditLog)) {
    root.auditLog = root.auditLog.map((item: unknown) => coerceAuditEntry(item)).filter(Boolean);
  }

  return root;
}
