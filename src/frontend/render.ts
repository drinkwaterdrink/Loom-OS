import type {
  LoomOSSettings,
  LoomOSState,
  ModuleKey,
  StateHistoryItem,
  StateIdentity,
  InjectionPreview,
} from "../shared/types";
import { renderCustomTemplate } from "../shared/customTemplates";
import { renderStockModulePresentation } from "../shared/presentation";

export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function visible(settings: LoomOSSettings, key: ModuleKey): boolean {
  return settings.moduleSettings[key].display;
}

function chips(items: string[], empty = "None recorded"): string {
  if (items.length === 0) return `<span class="loomos-muted">${escapeHtml(empty)}</span>`;
  return `<div class="loomos-chip-row">${items.map((item) =>
    `<span class="loomos-chip" title="${escapeHtml(item)}">${escapeHtml(item)}</span>`
  ).join("")}</div>`;
}

function clampProse(text: string, maxLength = 140): string {
  const clean = escapeHtml(text);
  if (clean.length <= maxLength) return clean;
  
  return `
    <span class="loomos-prose-clamped">
      ${clean.substring(0, maxLength)}...
      <details class="loomos-prose-details">
        <summary>Show more</summary>
        <span style="display: block; margin-top: 4px; color: var(--loomos-ink); font-weight: normal; font-style: normal;">${clean}</span>
      </details>
    </span>
  `;
}

function renderAppearanceProfile(
  appearance: LoomOSState["castMatrix"][number]["appearance"],
): string {
  const allFields: Array<[string, unknown]> = [
    ["Species", appearance.species],
    ["Age band", appearance.ageBand],
    ["Apparent age", appearance.apparentAge],
    ["Gender presentation", appearance.genderPresentation],
    ["Height", appearance.height],
    ["Weight", appearance.weight],
    ["Build", appearance.build],
    ["Body type", appearance.bodyType],
    ["Frame", appearance.frame],
    ["Proportions", appearance.proportions],
    ["Silhouette", appearance.silhouette],
    ["Body composition", appearance.bodyComposition],
    ["Shoulders", appearance.shoulders],
    ["Chest", appearance.chest],
    ["Bust", appearance.bust],
    ["Waist", appearance.waist],
    ["Hips", appearance.hips],
    ["Arms", appearance.arms],
    ["Legs", appearance.legs],
    ["Hands", appearance.hands],
    ["Skin", appearance.skin],
    ["Complexion", appearance.complexion],
    ["Face", appearance.face],
    ["Facial structure", appearance.facialStructure],
    ["Hair", appearance.hair],
    ["Eyes", appearance.eyes],
    ["Eyebrows", appearance.eyebrows],
    ["Nose", appearance.nose],
    ["Lips", appearance.lips],
    ["Ears", appearance.ears],
    ["Facial hair", appearance.facialHair],
    ["Posture", appearance.posture],
    ["Movement", appearance.movement],
    ["Voice", appearance.voice],
    ["Distinguishing marks", appearance.distinguishingMarks],
    ["Scars", appearance.scars],
    ["Tattoos", appearance.tattoos],
    ["Piercings", appearance.piercings],
    ["Birthmarks", appearance.birthmarks],
    ["Unique features", appearance.uniqueFeatures],
    ["Presence", appearance.presence],
    ["Full description", appearance.fullDescription],
    ["Immutable anchor", appearance.anchor],
  ];
  const fields = allFields.filter(([, value]) => Boolean(value));
  const immutableTraits = appearance.immutableTraits ?? [];
  if (fields.length === 0 && immutableTraits.length === 0) return "";
  return `
    <details class="loomos-cast-extra">
      <summary>Immutable Appearance</summary>
      <div class="loomos-cast-extra-body">
        ${fields.length > 0 ? `<dl class="loomos-facts loomos-appearance-facts">
          ${fields.map(([label, value]) => `
            <div><dt>${escapeHtml(label)}</dt><dd>${clampProse(String(value), 180)}</dd></div>
          `).join("")}
        </dl>` : ""}
        ${immutableTraits.length > 0
          ? `<div class="loomos-subhead">Immutable traits</div>${chips(immutableTraits)}`
          : ""}
      </div>
    </details>
  `;
}

function section(
  key: string,
  title: string,
  summary: string,
  body: string,
  open = false,
  settings?: LoomOSSettings,
  moduleKey?: ModuleKey,
): string {
  const presentation = moduleKey
    ? settings?.stockModuleOverrides?.[moduleKey]
    : undefined;
  if (
    moduleKey
    && presentation?.presentationEnabled
  ) {
    const rendered = renderStockModulePresentation(
      moduleKey,
      title,
      summary,
      body,
      open,
      presentation.htmlTemplate ?? "",
      presentation.cssTemplate ?? "",
    );
    return `
      <style>${rendered.css}</style>
      <section class="loomos-stock-template ${rendered.wrapperClass}" data-module-presentation="${escapeHtml(moduleKey)}">
        ${rendered.html}
      </section>`;
  }
  return `
    <details class="loomos-section" data-section="${escapeHtml(key)}"${open ? " open" : ""}>
      <summary>
        <span class="loomos-section-title">${escapeHtml(title)}</span>
        <span class="loomos-section-summary">${escapeHtml(summary)}</span>
      </summary>
      <div class="loomos-section-body">${body}</div>
    </details>`;
}

function renderKernel(state: LoomOSState, settings: LoomOSSettings): string {
  const kernel = state.kernel;
  return section("kernel", "Kernel", kernel.scene || "Current scene", `
    <div class="loomos-hero">
      <span class="loomos-kicker">Current focus</span>
      <strong>${clampProse(kernel.currentFocus || kernel.objective, 120)}</strong>
      <p>${clampProse(kernel.summary, 160)}</p>
    </div>
    <dl class="loomos-facts">
      <div><dt>Location</dt><dd>${escapeHtml(kernel.location)}</dd></div>
      <div><dt>Time</dt><dd>${escapeHtml(kernel.timeframe || `${kernel.date} ${kernel.time}`)}</dd></div>
      <div><dt>POV</dt><dd>${escapeHtml(kernel.pov)}</dd></div>
      <div><dt>Tone</dt><dd>${escapeHtml(kernel.tone)}</dd></div>
      <div><dt>Objective</dt><dd>${clampProse(kernel.objective, 120)}</dd></div>
      <div><dt>Risk</dt><dd>${clampProse(kernel.currentRisk, 120)}</dd></div>
      <div><dt>Next focus</dt><dd>${clampProse(kernel.nextFocus, 120)}</dd></div>
      <div><dt>Stop mode</dt><dd>${escapeHtml(kernel.stopMode)}</dd></div>
    </dl>
    <div class="loomos-subhead">Constraints</div>
    ${chips(kernel.constraints)}
  `, false, settings, "sceneKernel");
}

function renderDelta(state: LoomOSState, settings: LoomOSSettings): string {
  const delta = state.delta;
  return section("delta", "Delta", delta.headline || "No major change", `
    <div class="loomos-callout">${clampProse(delta.headline, 140)}</div>
    <div class="loomos-list">
      ${delta.changes.length === 0
        ? `<p class="loomos-muted">No meaningful changes recorded.</p>`
        : delta.changes.map((change) => `
          <article class="loomos-row loomos-importance-${change.importance}">
            <div class="loomos-row-title">
              <strong>${clampProse(change.text, 120)}</strong>
              <span>${escapeHtml(change.module)}</span>
            </div>
            <small>${escapeHtml(change.age)} | ${escapeHtml(change.importance)}</small>
          </article>
        `).join("")}
    </div>
    <div class="loomos-two-column">
      <div><div class="loomos-subhead">Newly established</div>${chips(delta.newlyEstablished)}</div>
      <div><div class="loomos-subhead">Carried forward</div>${chips(delta.carriedForward)}</div>
    </div>
  `, false, settings, "deltas");
}

function renderMeters(state: LoomOSState, settings: LoomOSSettings): string {
  return section("meters", "Meters", `${state.meters.length} diagnostics`, `
    <div class="loomos-meter-grid">
      ${state.meters.length === 0
        ? `<p class="loomos-muted">No meter evidence in this state.</p>`
        : state.meters.map((meter) => {
            const trendIcon = {
              up: "📈",
              down: "📉",
              steady: "➡️",
              unknown: ""
            }[meter.trend] || "";
            const colorStyle = meter.color ? `background-color: ${escapeHtml(meter.color)}` : "";
            return `
              <article class="loomos-meter">
                <div class="loomos-row-title">
                  <strong>${escapeHtml(meter.label)}</strong>
                  <span>${escapeHtml(meter.pct)} (${meter.value}/100) ${trendIcon}</span>
                </div>
                <div class="loomos-meter-track"><i style="width:${Math.max(0, Math.min(100, meter.value))}%; ${colorStyle}"></i></div>
                <small><strong>${escapeHtml(meter.band)}</strong> | ${clampProse(meter.note, 100)}</small>
              </article>
            `;
          }).join("")}
    </div>
  `, false, settings, "meters");
}

function renderCast(state: LoomOSState, settings: LoomOSSettings): string {
  return section("cast", "Cast Matrix", `${state.castMatrix.length} tracked`, `
    <div class="loomos-list">
      ${state.castMatrix.length === 0
        ? `<p class="loomos-muted">No cast evidence in this state.</p>`
        : state.castMatrix.map((member) => {
            const appearanceHtml = visible(settings, "appearance")
              ? renderAppearanceProfile(member.appearance)
              : "";
            const hasExtra = member.pose || member.proximity || member.hands || member.visualAnchor || 
                             (visible(settings, "clothing") && member.clothingSummary) || 
                             member.goals.length > 0 || 
                             (visible(settings, "relationships") && member.relationships.length > 0) || 
                             (visible(settings, "inventory") && member.pockets.length > 0) || 
                             member.stableFacts.length > 0;
            return `
              <article class="loomos-card">
                <div class="loomos-card-heading">
                  <div>
                    <span class="loomos-kicker">${escapeHtml(member.kind)}</span>
                    <strong>${escapeHtml(member.name)}${member.qty > 1 ? ` x${member.qty}` : ""}</strong>
                  </div>
                  <span class="loomos-badge">${escapeHtml(member.awareness)}</span>
                </div>
                <div class="loomos-cast-meta">
                  <span><b>Location</b>${escapeHtml(member.location)}</span>
                  <span><b>Mood</b>${escapeHtml(member.emotionalState)}</span>
                  <span><b>Threat</b>${escapeHtml(member.threat.pct)}</span>
                </div>
                <dl class="loomos-cast-summary">
                  <div><dt>Intent</dt><dd>${clampProse(member.intent, 100)}</dd></div>
                  <div><dt>Status</dt><dd>${clampProse(member.status, 100)}</dd></div>
                </dl>
                ${appearanceHtml}
                
                ${hasExtra ? `
                  <details class="loomos-cast-extra">
                    <summary>Visuals & Pockets</summary>
                    <div class="loomos-cast-extra-body" style="display: grid; gap: 6px;">
                      ${member.pose ? `<p><strong>Pose:</strong> ${clampProse(member.pose, 100)}</p>` : ""}
                      ${member.proximity ? `<p><strong>Proximity:</strong> ${clampProse(member.proximity, 100)}</p>` : ""}
                      ${member.hands ? `<p><strong>Hands:</strong> ${clampProse(member.hands, 100)}</p>` : ""}
                      ${member.visualAnchor ? `<p><strong>Visual Anchor:</strong> ${clampProse(member.visualAnchor, 100)}</p>` : ""}
                      ${visible(settings, "clothing") && member.clothingSummary ? `<p><strong>Clothing:</strong> ${clampProse(member.clothingSummary, 100)}</p>` : ""}
                      ${member.goals.length > 0 ? `<div class="loomos-subhead">Goals</div>${chips(member.goals)}` : ""}
                      ${visible(settings, "relationships") && member.relationships.length > 0 ? `<div class="loomos-subhead">Relationships</div>${chips(member.relationships.map((r) => `${r.target}: ${r.axis}=${r.value}${r.evidence ? ` (${r.evidence.slice(0, 60)})` : ""}`))}` : ""}
                      ${visible(settings, "inventory") && member.pockets.length > 0 ? `<div class="loomos-subhead">Pockets</div>${chips(member.pockets.map(item => `${item.name} x${item.qty}${item.known ? "" : " (unknown)"}`))}` : ""}
                      ${member.stableFacts.length > 0 ? `<div class="loomos-subhead">Stable Facts</div>${chips(member.stableFacts)}` : ""}
                    </div>
                  </details>
                ` : ""}
              </article>
            `;
          }).join("")}
    </div>
  `, true, settings, "castCore");
}

function renderWorld(state: LoomOSState, settings: LoomOSSettings): string {
  const scene = state.scene;
  const world = state.worldState;
  const itemCount = scene?.items.length ?? 0;
  return section("world", "World & Space", `${itemCount} scene items`, `
    ${scene
      ? `<dl class="loomos-facts">
          <div><dt>Privacy</dt><dd>${escapeHtml(scene.privacy)}</dd></div>
          <div><dt>Observers</dt><dd>${scene.observerCount} | ${escapeHtml(scene.observerPressure.band)}</dd></div>
          <div><dt>Crowd</dt><dd>${escapeHtml(scene.crowdNoise)} / ${escapeHtml(scene.crowdFlow)}</dd></div>
          <div><dt>Light</dt><dd>${escapeHtml(scene.light.primary)} | ${escapeHtml(scene.light.quality)}</dd></div>
          <div><dt>Exit</dt><dd>${escapeHtml(scene.access.exit)}</dd></div>
          <div><dt>Sightline</dt><dd>${clampProse(scene.access.lineOfSight, 100)}</dd></div>
        </dl>
        <div class="loomos-subhead">Spatial facts</div>${chips(scene.spatial)}
        <div class="loomos-subhead">Carryover</div>${chips([
          ...scene.carryover.body,
          ...scene.carryover.room,
          ...scene.carryover.social,
        ])}
        ${visible(settings, "inventory")
          ? `<div class="loomos-subhead">Scene items</div>${chips(scene.items.map((item) =>
              `${item.name}: ${item.location}; ${item.condition}`
            ))}`
          : ""}`
      : `<p class="loomos-muted">World and space tracking was not active for this snapshot.</p>`}
    ${world
      ? `<div class="loomos-two-column">
          <div><div class="loomos-subhead">Environmental changes</div>${chips(world.recentEnvironmentalChanges)}</div>
          <div><div class="loomos-subhead">Hazards</div>${chips(world.activeHazards)}</div>
        </div>
        ${visible(settings, "secretsRumors")
          ? `<div class="loomos-two-column">
              <div><div class="loomos-subhead">Rumors</div>${chips(world.rumors.map((item) =>
                `${item.rumor} (${item.credibility}/10)`
              ))}</div>
              <div><div class="loomos-subhead">Loaded signs</div>${chips(world.loadedSigns.map((item) =>
                `${item.thing}: ${item.state}`
              ))}</div>
            </div>`
          : ""}`
      : ""}
  `, true, settings, "worldSpace");
}

function renderStory(state: LoomOSState, settings: LoomOSSettings): string {
  const story = state.storyState;
  const live = story.threadLoom.filter((thread) => thread.status !== "resolved");
  return section("story", "Thread Loom", `${live.length} live threads`, `
    <div class="loomos-list">
      ${story.threadLoom.length === 0
        ? `<p class="loomos-muted">No story threads recorded.</p>`
        : story.threadLoom.map((thread) => `
          <article class="loomos-row loomos-priority-${thread.priority}">
            <div class="loomos-row-title">
              <strong>${escapeHtml(thread.title)}</strong>
              <span>${escapeHtml(thread.status)} | ${thread.urgency}/5</span>
            </div>
            <p>${clampProse(thread.summary, 120)}</p>
            <div class="loomos-meter-track"><i style="width:${Math.max(0, Math.min(100, thread.progress * 10))}%"></i></div>
            <small>Next pressure: ${clampProse(thread.nextPressure, 100)}</small>
          </article>
        `).join("")}
    </div>
    <div class="loomos-two-column">
      <div><div class="loomos-subhead">Goals</div>${chips(story.goals.map((goal) =>
        `${goal.who}: ${goal.goal} [${goal.status}]`
      ))}</div>
      <div><div class="loomos-subhead">Stakes</div>${chips(story.stakes.map((stake) =>
        `${stake.who}: ${stake.win} / ${stake.lose}`
      ))}</div>
      <div><div class="loomos-subhead">Countdowns</div>${chips(story.countdowns.map((item) =>
        `${item.title}: ${item.left} ${item.unit}`
      ))}</div>
      <div><div class="loomos-subhead">Autonomy queue</div>${chips(story.autonomyQueue.map((item) =>
        `${item.who}: ${item.action}`
      ))}</div>
    </div>
  `, true, settings, "storyThreads");
}

function renderContinuity(state: LoomOSState, settings: LoomOSSettings): string {
  const firewall = state.continuityFirewall;
  const riskCount = firewall.risks.length;
  
  const explainerHtml = `
    <div class="loomos-continuity-explainer">
      <p class="loomos-continuity-explainer-text">
        The <strong>Continuity Firewall</strong> protects story coherence by tracking 
        established facts, detecting conflicts, and preventing retcons. 
        It evaluates each new state against anchors before accepting it.
      </p>
      <div class="loomos-continuity-metrics">
        <div class="loomos-continuity-metric">
          <span class="loomos-continuity-metric-value">${firewall.establishedFacts.length}</span>
          <span class="loomos-continuity-metric-label">Facts</span>
        </div>
        <div class="loomos-continuity-metric">
          <span class="loomos-continuity-metric-value">${firewall.antiRetconAnchors.length}</span>
          <span class="loomos-continuity-metric-label">Anchors</span>
        </div>
        <div class="loomos-continuity-metric">
          <span class="loomos-continuity-metric-value">${firewall.pendingConsequences.length}</span>
          <span class="loomos-continuity-metric-label">Pending</span>
        </div>
        <div class="loomos-continuity-metric">
          <span class="loomos-continuity-metric-value">${firewall.offscreenState.length}</span>
          <span class="loomos-continuity-metric-label">Offscreen</span>
        </div>
      </div>
    </div>
  `;

  const riskCards = firewall.risks.length === 0
    ? `<div class="loomos-continuity-safe"><strong>No continuity conflicts detected.</strong> The current state is consistent with all established facts and anchors.</div>`
    : `<div class="loomos-continuity-risks">${firewall.risks.map((risk) => `
        <div class="loomos-continuity-risk-card loomos-severity-${risk.severity}">
          <div class="loomos-continuity-risk-header">
            <strong>${clampProse(risk.issue, 100)}</strong>
            <span class="loomos-badge loomos-badge-severity-${risk.severity}">${escapeHtml(risk.severity)}</span>
          </div>
          <p class="loomos-continuity-risk-evidence">${clampProse(risk.evidence, 140)}</p>
          <div class="loomos-continuity-risk-guardrail">
            <span class="loomos-kicker">Guardrail</span>
            <p>${clampProse(risk.recommendation, 120)}</p>
          </div>
        </div>
      `).join("")}</div>`;

  return section("continuity", "Continuity Firewall", `${riskCount} risks`, `
    ${explainerHtml}
    ${riskCards}
    
    <details class="loomos-cast-extra">
      <summary>Established Facts &nbsp;(${firewall.establishedFacts.length})</summary>
      <div class="loomos-cast-extra-body" style="display: grid; gap: 6px;">
        <div class="loomos-subhead">Established Facts</div>
        ${chips(firewall.establishedFacts)}
        <div class="loomos-subhead">Anti-retcon Anchors</div>
        ${chips(firewall.antiRetconAnchors)}
      </div>
    </details>
    
    <details class="loomos-cast-extra">
      <summary>Consequences & Offscreen &nbsp;(${firewall.pendingConsequences.length + firewall.offscreenState.length})</summary>
      <div class="loomos-cast-extra-body" style="display: grid; gap: 6px;">
        <div class="loomos-subhead">Pending Consequences</div>
        ${chips(firewall.pendingConsequences.map((c) => `${c.pending}${c.status !== "PENDING" ? ` [${c.status}]` : ""}`))}
        <div class="loomos-subhead">Offscreen State</div>
        ${chips(firewall.offscreenState)}
      </div>
    </details>
    
    <details class="loomos-cast-extra">
      <summary>Banned / Impossible Next &nbsp;(${firewall.bannedNext.length + firewall.impossibleNext.length})</summary>
      <div class="loomos-cast-extra-body" style="display: grid; gap: 6px;">
        <div class="loomos-subhead">Banned next moves</div>
        ${chips(firewall.bannedNext.map((item) => `${item.text}${item.scope === "persistent" ? " (persistent)" : ""}`))}
        <div class="loomos-subhead">Impossible next moves</div>
        ${chips(firewall.impossibleNext)}
      </div>
    </details>
  `, true, settings, "continuity");
}

function renderTools(state: LoomOSState, settings: LoomOSSettings): string {
  const tools = state.tools;
  const blocks: string[] = [];
  if (visible(settings, "actionResolver") && tools.actionResolver) {
    blocks.push(`<article class="loomos-card">
      <span class="loomos-kicker">Action Resolver</span>
      <strong>${clampProse(tools.actionResolver.userAction, 100)}</strong>
      <p>${clampProse(tools.actionResolver.worldResponse, 120)}</p>
      <small>Risk: ${clampProse(tools.actionResolver.risk, 100)}</small>
      ${chips(tools.actionResolver.blockers)}
    </article>`);
  }
  if (visible(settings, "dialogueState") && tools.dialogueState) {
    blocks.push(`<article class="loomos-card">
      <span class="loomos-kicker">Dialogue</span>
      <strong>${clampProse(tools.dialogueState.openThread, 100)}</strong>
      <p>${clampProse(tools.dialogueState.socialMask, 120)}</p>
      ${chips(tools.dialogueState.levers)}
    </article>`);
  }
  if (visible(settings, "directorStyle") && tools.directorStyle) {
    blocks.push(`<article class="loomos-card">
      <span class="loomos-kicker">Director Style</span>
      <strong>${clampProse(tools.directorStyle.primary, 100)}</strong>
      <p>${clampProse(tools.directorStyle.push, 120)}</p>
      ${chips(tools.directorStyle.voiceCues)}
    </article>`);
  }
  if (visible(settings, "closenessState") && tools.closenessState) {
    blocks.push(`<article class="loomos-card">
      <span class="loomos-kicker">Closeness</span>
      <strong>${clampProse(tools.closenessState.emotional, 100)}</strong>
      <p>${clampProse(tools.closenessState.physical, 120)}</p>
      ${chips(tools.closenessState.boundaries)}
    </article>`);
  }
  if (visible(settings, "imagePrompt") && tools.imagePrompt) {
    blocks.push(`<article class="loomos-card">
      <span class="loomos-kicker">Image Prompt</span>
      <strong>${escapeHtml(tools.imagePrompt.shot)} | ${escapeHtml(tools.imagePrompt.medium)}</strong>
      <p>${clampProse(tools.imagePrompt.subject, 120)}</p>
      <small>${clampProse(tools.imagePrompt.hint, 100)}</small>
    </article>`);
  }
  return blocks.length === 0
    ? ""
    : section("tools", "Tools", `${blocks.length} active`, `<div class="loomos-card-grid">${blocks.join("")}</div>`);
}

function renderAudit(state: LoomOSState, settings: LoomOSSettings): string {
  return section("audit", "Audit", `${state.auditLog.length} entries`, `
    <div class="loomos-list">
      ${state.auditLog.map((entry) => `
        <article class="loomos-row">
          <div class="loomos-row-title">
            <strong>${escapeHtml(entry.system)}</strong>
            <span>${escapeHtml(entry.marker)}</span>
          </div>
          <p>${clampProse(entry.result, 120)}</p>
          <small>${entry.repaired ? "Repaired | " : ""}${clampProse(entry.notes, 100)}</small>
        </article>
      `).join("") || `<p class="loomos-muted">No audit entries.</p>`}
    </div>
  `, false, settings, "auditLog");
}

function renderOverviewCard(state: LoomOSState, settings: LoomOSSettings): string {
  const deltaHeadline = state.delta?.headline || "No major changes";
  const location = state.kernel?.location || "Unknown location";
  const time = state.kernel?.timeframe || state.kernel?.time || "Unknown time";
  const activeCastCount = state.castMatrix?.filter(c => c.kind === "pov" || c.kind === "main" || c.kind === "npc").length ?? 0;
  const threadCount = state.storyState?.threadLoom?.filter(t => t.status !== "resolved").length ?? 0;
  const riskCount = state.continuityFirewall?.risks?.length ?? 0;
  const injectionStatus = settings.injectionEnabled ? "Enabled" : "Disabled";

  return `
    <section class="loomos-overview-card">
      <div class="loomos-overview-topline">
        <span class="loomos-kicker">Scene pulse</span>
        <span class="loomos-overview-inject-${settings.injectionEnabled ? "active" : "inactive"}">Injection ${injectionStatus}</span>
      </div>
      <h2 class="loomos-overview-headline">${clampProse(deltaHeadline, 180)}</h2>
      <p class="loomos-overview-location"><strong>${escapeHtml(location)}</strong><span>${escapeHtml(time)}</span></p>
      <div class="loomos-overview-stats">
        <span><b>${activeCastCount}</b>Cast</span>
        <span><b>${threadCount}</b>Threads</span>
        <span><b>${riskCount}</b>Risks</span>
        <span><b>${state.activeModules.length}</b>Modules</span>
      </div>
      <div class="loomos-overview-actions">
        <button type="button" class="loomos-button loomos-btn-sm" data-action="what-changed">Review changes</button>
        <span>${escapeHtml(state.kernel.currentFocus || state.kernel.objective)}</span>
      </div>
    </section>
  `;
}

function renderCustomModules(state: LoomOSState, settings: LoomOSSettings): string[] {
  const customMods = settings.customModules || [];
  const results: string[] = [];

  for (const cm of customMods) {
    if (!cm.display) continue;
    const compiled = state.customModuleData?.find(m => m.moduleId === cm.id);
    if (!compiled) continue;

    const itemCount = compiled.items?.length ?? 0;
    const fieldEntries = Object.entries(compiled.fields ?? {});
    let body = "";

    if (cm.outputMode === "template" && cm.allowHtmlTemplate) {
      const rendered = renderCustomTemplate(cm, compiled);
      body = `
        <style>${rendered.css}</style>
        <section class="loomos-custom-template ${rendered.wrapperClass}">
          ${rendered.html}
        </section>
      `;
    } else if (itemCount === 0 && fieldEntries.length === 0) {
      body = `<p class="loomos-muted">No evidence compiled for this custom module.</p>`;
    } else {
      const fieldsHtml = fieldEntries.length > 0
        ? `<dl class="loomos-custom-fields">${fieldEntries.map(([key, value]) => `
            <div>
              <dt>${escapeHtml(cm.schemaFields.find((field) => field.key === key)?.label ?? key)}</dt>
              <dd>${escapeHtml(
                Array.isArray(value)
                  ? value.join(", ")
                  : typeof value === "object"
                  ? JSON.stringify(value)
                  : value
              )}</dd>
            </div>
          `).join("")}</dl>`
        : "";
      if (cm.outputMode === "bullets") {
        body = `${fieldsHtml}
          <ul class="loomos-bullet-list">
            ${compiled.items.map(it => `
              <li>
                <strong>${escapeHtml(it.title)}</strong>: ${clampProse(it.text, 100)}
                <span class="loomos-badge loomos-badge-severity-${it.importance}" style="font-size: 7px; vertical-align: middle; margin-left: 4px;">${it.importance}</span>
              </li>
            `).join("")}
          </ul>
        `;
      } else if (cm.outputMode === "chips") {
        body = `${fieldsHtml}
          <div class="loomos-chip-row" style="margin-top: 4px;">
            ${compiled.items.map(it => `
              <span class="loomos-chip" style="${it.color ? `border-color:${escapeHtml(it.color)}` : ""}">
                <strong>${escapeHtml(it.title)}</strong>: ${clampProse(it.text, 80)}
                <span class="loomos-badge loomos-badge-severity-${it.importance}" style="font-size: 7px; margin-left: 2px;">${it.importance}</span>
              </span>
            `).join("")}
          </div>
        `;
      } else if (cm.outputMode === "gauge") {
        body = `${fieldsHtml}
          <div class="loomos-meter-grid">
            ${compiled.items.map(it => {
              const match = it.text.match(/(\d+)%/);
              const pctValue = match ? Number(match[1]) : 50;
              const colorStyle = it.color ? `background-color: ${escapeHtml(it.color)}` : "";
              return `
                <div class="loomos-meter">
                  <div class="loomos-row-title">
                    <strong>${escapeHtml(it.title)}</strong>
                    <span>${escapeHtml(it.text)}</span>
                  </div>
                  <div class="loomos-meter-track"><i style="width:${pctValue}%; ${colorStyle}"></i></div>
                  <small>Importance: <strong>${it.importance}</strong></small>
                </div>
              `;
            }).join("")}
          </div>
        `;
      } else {
        body = `${fieldsHtml}
          <div class="loomos-card-grid">
            ${compiled.items.map(it => `
              <div class="loomos-card" style="${it.color ? `border-left: 3px solid ${escapeHtml(it.color)}` : ""}">
                <div class="loomos-card-heading">
                  <strong>${escapeHtml(it.title)}</strong>
                  <span class="loomos-badge loomos-badge-severity-${it.importance}">${it.importance}</span>
                </div>
                <p>${clampProse(it.text, 120)}</p>
              </div>
            `).join("")}
          </div>
        `;
      }
    }

    results.push(
      section(
        "cmod_" + cm.id,
        cm.label,
        compiled.summary || `${itemCount} items`,
        body,
        false
      )
    );
  }

  return results;
}

export function renderDashboard(
  state: LoomOSState,
  settings: LoomOSSettings,
  activeTab = "overview",
): string {
  if (activeTab === "overview") {
    const overview = renderOverviewCard(state, settings);
    const sections = [
      visible(settings, "sceneKernel") ? renderKernel(state, settings) : "",
      visible(settings, "deltas") ? renderDelta(state, settings) : "",
      visible(settings, "meters") ? renderMeters(state, settings) : "",
      renderTools(state, settings),
      ...renderCustomModules(state, settings),
    ].filter(Boolean);
    return sections.length > 0
      ? `<div class="loomos-dashboard">${overview}${sections.join("")}</div>`
      : `<div class="loomos-dashboard">${overview}<div class="loomos-empty"><h3>All overview display modules are hidden</h3><p>Enable display for Kernel, Deltas, Meters, or Tools in Setup.</p></div></div>`;
  }
  
  if (activeTab === "cast") {
    const sections = [
      visible(settings, "castCore") || visible(settings, "appearance")
        ? renderCast(state, settings)
        : "",
    ].filter(Boolean);
    return sections.length > 0
      ? `<div class="loomos-dashboard">${sections.join("")}</div>`
      : `<div class="loomos-empty"><h3>Cast modules are hidden</h3><p>Enable Cast Core or Immutable Appearance display in settings.</p></div>`;
  }
  
  if (activeTab === "world") {
    const sections = [
      visible(settings, "worldSpace") || visible(settings, "secretsRumors")
        ? renderWorld(state, settings)
        : "",
    ].filter(Boolean);
    return sections.length > 0
      ? `<div class="loomos-dashboard">${sections.join("")}</div>`
      : `<div class="loomos-empty"><h3>World modules are hidden</h3><p>Enable World & Space or Secrets & Rumors display in settings.</p></div>`;
  }
  
  if (activeTab === "story") {
    const sections = [
      visible(settings, "storyThreads") ? renderStory(state, settings) : "",
    ].filter(Boolean);
    return sections.length > 0
      ? `<div class="loomos-dashboard">${sections.join("")}</div>`
      : `<div class="loomos-empty"><h3>Story threads display is hidden</h3><p>Enable Story Threads display in settings.</p></div>`;
  }
  
  if (activeTab === "continuity") {
    const sections = [
      visible(settings, "continuity") ? renderContinuity(state, settings) : "",
      visible(settings, "auditLog") ? renderAudit(state, settings) : "",
    ].filter(Boolean);
    return sections.length > 0
      ? `<div class="loomos-dashboard">${sections.join("")}</div>`
      : `<div class="loomos-empty"><h3>Continuity and Audit display are hidden</h3><p>Enable Continuity Firewall or Audit Log display in settings.</p></div>`;
  }

  return "";
}

export function renderHistoryTab(
  items: StateHistoryItem[],
  filter: string,
  activeIdentity: StateIdentity | null,
): string {
  const filtered = filter
    ? items.filter((item) =>
        [item.kernelScene, item.kernelFocus, item.kernelLocation, item.deltaHeadline, item.identity.messageId]
          .some((v) => v.toLowerCase().includes(filter.toLowerCase())),
      )
    : items;

  return `
    <div class="loomos-history-tab">
      <header class="loomos-view-heading">
        <div><span class="loomos-kicker">Exact-swipe archive</span><h2>Tracker history</h2></div>
        <span class="loomos-status">${items.length} retained</span>
      </header>
      <div class="loomos-search-bar">
        <input class="loomos-input" type="search" placeholder="Search scene, focus, or location"
          data-history-filter value="${escapeHtml(filter)}" aria-label="Filter tracker history" />
        ${filter ? `<button class="loomos-button-clear" data-action="clear-history-filter" title="Clear history search" aria-label="Clear history search">&times;</button>` : ""}
        <span class="loomos-search-count">${filtered.length} / ${items.length}</span>
      </div>
      ${filtered.length === 0
        ? `<div class="loomos-empty"><h3>No matching history entries</h3><p>Try a different search term.</p></div>`
        : `<div class="loomos-history-list">${filtered.map((item) => {
            const isActive =
              activeIdentity?.chatId === item.identity.chatId &&
              activeIdentity?.messageId === item.identity.messageId &&
              activeIdentity?.swipeId === item.identity.swipeId;
            return `
              <article class="loomos-history-entry${isActive ? " loomos-history-active" : ""}">
                <div class="loomos-history-entry-main">
                  <div class="loomos-history-entry-header">
                    <strong>${escapeHtml(item.kernelScene || "N/A")}</strong>
                    <span class="loomos-history-time">${escapeHtml(item.generatedAt)}</span>
                    ${item.repaired ? `<span class="loomos-badge loomos-badge-warning">repaired</span>` : ""}
                  </div>
                  <p class="loomos-history-entry-focus">${clampProse(item.kernelFocus, 100)}</p>
                  <div class="loomos-history-entry-meta">
                    <span>${escapeHtml(item.kernelLocation)}</span>
                    <span>${escapeHtml(item.kernelTime)}</span>
                    <span>${item.castCount} cast</span>
                    <span>${item.threadCount} threads</span>
                    <span>${item.riskCount} risks</span>
                  </div>
                  <p class="loomos-history-entry-delta">${clampProse(item.deltaHeadline, 120)}</p>
                </div>
                <div class="loomos-history-entry-actions">
                  <button class="loomos-button loomos-btn-sm" data-action="load-history-state"
                    data-chat-id="${escapeHtml(item.identity.chatId)}"
                    data-message-id="${escapeHtml(item.identity.messageId)}" data-swipe-id="${item.identity.swipeId}"
                    ${isActive ? "disabled" : ""}>
                    ${isActive ? "Current" : "Load"}
                  </button>
                  <button class="loomos-button loomos-button-danger loomos-btn-sm" data-action="delete-history-state"
                      data-chat-id="${escapeHtml(item.identity.chatId)}"
                      data-message-id="${escapeHtml(item.identity.messageId)}" data-swipe-id="${item.identity.swipeId}">
                      Delete
                    </button>
                </div>
              </article>
            `;
          }).join("")}</div>`}
    </div>
  `;
}

export function renderInjectionPreview(
  preview: InjectionPreview,
): string {
  return `
    <div class="loomos-injection-preview">
      <div class="loomos-injection-preview-header">
        <span class="loomos-kicker">Injection Preview</span>
        <span class="loomos-badge ${preview.withinBudget ? "loomos-badge-ok" : "loomos-badge-over"}">
          ${preview.estimatedTokens} / ${preview.budget} tokens
        </span>
      </div>
      ${preview.warning
        ? `<div class="loomos-injection-preview-warning">⚠️ ${escapeHtml(preview.warning)}</div>`
        : ""}
      <div class="loomos-injection-preview-meta">
        ${preview.includedModules.length > 0
          ? `<div class="loomos-injection-preview-modules">
              <span class="loomos-subhead">Included modules</span>
              <div class="loomos-chip-row">${preview.includedModules.map((m) =>
                `<span class="loomos-chip">${escapeHtml(m)}</span>`
              ).join("")}</div>
            </div>`
          : ""}
        ${preview.omittedModules.length > 0
          ? `<div class="loomos-injection-preview-modules">
              <span class="loomos-subhead">Omitted modules</span>
              <div class="loomos-chip-row">${preview.omittedModules.map((m) =>
                `<span class="loomos-chip">${escapeHtml(m)}</span>`
              ).join("")}</div>
            </div>`
          : ""}
        <div class="loomos-injection-preview-tokenbar">
          <div class="loomos-meter-track">
            <i style="width:${Math.min(100, (preview.estimatedTokens / Math.max(1, preview.budget)) * 100)}%;
              ${preview.withinBudget ? "background:var(--loomos-accent)" : "background:#df5259"}"></i>
          </div>
          <span>${Math.round((preview.estimatedTokens / Math.max(1, preview.budget)) * 100)}% of budget</span>
        </div>
      </div>
      <details class="loomos-cast-extra">
        <summary>Preview text (${preview.text.length} chars)</summary>
        <div class="loomos-cast-extra-body">
          <pre class="loomos-injection-preview-text">${escapeHtml(preview.text)}</pre>
          <button class="loomos-button loomos-btn-sm" data-action="copy-injection-preview">Copy</button>
        </div>
      </details>
    </div>
  `;
}

export function renderWhatChangedModal(state: LoomOSState): string {
  const delta = state.delta;
  return `
    <div class="loomos-what-changed-modal">
      <h3 class="loomos-what-changed-title">What Changed</h3>
      <div class="loomos-what-changed-headline">
        <span class="loomos-kicker">Headline</span>
        <p>${escapeHtml(delta.headline || "No headline")}</p>
      </div>
      
      <div class="loomos-what-changed-section">
        <span class="loomos-subhead">Changes (${delta.changes.length})</span>
        <div class="loomos-list">
          ${delta.changes.length === 0
            ? `<p class="loomos-muted">No changes recorded.</p>`
            : delta.changes.map((change) => `
              <div class="loomos-what-changed-change loomos-importance-${change.importance}">
                <div class="loomos-what-changed-change-icon">+</div>
                <div class="loomos-what-changed-change-body">
                  <strong>${clampProse(change.text, 140)}</strong>
                  <span class="loomos-what-changed-change-meta">
                    ${escapeHtml(change.module)} · ${escapeHtml(change.age)} · ${escapeHtml(change.importance)}
                  </span>
                </div>
              </div>
            `).join("")}
        </div>
      </div>
      
      <div class="loomos-two-column">
        <div class="loomos-what-changed-section">
          <span class="loomos-subhead">Carried forward (${delta.carriedForward.length})</span>
          ${chips(delta.carriedForward, "Nothing carried forward")}
        </div>
        <div class="loomos-what-changed-section">
          <span class="loomos-subhead">Newly established (${delta.newlyEstablished.length})</span>
          ${chips(delta.newlyEstablished, "Nothing newly established")}
        </div>
      </div>
      
      <div class="loomos-what-changed-scene">
        <span class="loomos-subhead">Scene</span>
        <dl class="loomos-facts">
          <div><dt>Location</dt><dd>${escapeHtml(state.kernel?.location || "N/A")}</dd></div>
          <div><dt>Time</dt><dd>${escapeHtml(state.kernel?.timeframe || state.kernel?.time || "N/A")}</dd></div>
          <div><dt>Focus</dt><dd>${clampProse(state.kernel?.currentFocus || "N/A", 100)}</dd></div>
        </dl>
      </div>
    </div>
  `;
}
