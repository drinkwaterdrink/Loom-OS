import type {
  LoomOSSettings,
  LoomOSState,
  ModuleKey,
} from "../shared/types";

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
    `<span class="loomos-chip">${escapeHtml(item)}</span>`
  ).join("")}</div>`;
}

function section(
  key: string,
  title: string,
  summary: string,
  body: string,
  open = false,
): string {
  return `
    <details class="loomos-section" data-section="${escapeHtml(key)}"${open ? " open" : ""}>
      <summary>
        <span>${escapeHtml(title)}</span>
        <small>${escapeHtml(summary)}</small>
      </summary>
      <div class="loomos-section-body">${body}</div>
    </details>`;
}

function renderKernel(state: LoomOSState): string {
  const kernel = state.kernel;
  return section("kernel", "Kernel", kernel.scene || "Current scene", `
    <div class="loomos-hero">
      <span class="loomos-kicker">Current focus</span>
      <strong>${escapeHtml(kernel.currentFocus || kernel.objective)}</strong>
      <p>${escapeHtml(kernel.summary)}</p>
    </div>
    <dl class="loomos-facts">
      <div><dt>Location</dt><dd>${escapeHtml(kernel.location)}</dd></div>
      <div><dt>Time</dt><dd>${escapeHtml(kernel.timeframe || `${kernel.date} ${kernel.time}`)}</dd></div>
      <div><dt>POV</dt><dd>${escapeHtml(kernel.pov)}</dd></div>
      <div><dt>Tone</dt><dd>${escapeHtml(kernel.tone)}</dd></div>
      <div><dt>Objective</dt><dd>${escapeHtml(kernel.objective)}</dd></div>
      <div><dt>Risk</dt><dd>${escapeHtml(kernel.currentRisk)}</dd></div>
      <div><dt>Next focus</dt><dd>${escapeHtml(kernel.nextFocus)}</dd></div>
      <div><dt>Stop mode</dt><dd>${escapeHtml(kernel.stopMode)}</dd></div>
    </dl>
    <div class="loomos-subhead">Constraints</div>
    ${chips(kernel.constraints)}
  `, true);
}

function renderDelta(state: LoomOSState): string {
  const delta = state.delta;
  return section("delta", "Delta", delta.headline || "No major change", `
    <div class="loomos-callout">${escapeHtml(delta.headline)}</div>
    <div class="loomos-list">
      ${delta.changes.length === 0
        ? `<p class="loomos-muted">No meaningful changes recorded.</p>`
        : delta.changes.map((change) => `
          <article class="loomos-row loomos-importance-${change.importance}">
            <div class="loomos-row-title">
              <strong>${escapeHtml(change.text)}</strong>
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
  `, true);
}

function renderMeters(state: LoomOSState): string {
  return section("meters", "Meters", `${state.meters.length} diagnostics`, `
    <div class="loomos-meter-grid">
      ${state.meters.length === 0
        ? `<p class="loomos-muted">No meter evidence in this state.</p>`
        : state.meters.map((meter) => `
          <article class="loomos-meter">
            <div class="loomos-row-title">
              <strong>${escapeHtml(meter.label)}</strong>
              <span>${escapeHtml(meter.pct)} | ${escapeHtml(meter.trend)}</span>
            </div>
            <div class="loomos-meter-track"><i style="width:${Math.max(0, Math.min(100, meter.value))}%"></i></div>
            <small>${escapeHtml(meter.band)} | ${escapeHtml(meter.note)}</small>
          </article>
        `).join("")}
    </div>
  `);
}

function renderCast(state: LoomOSState, settings: LoomOSSettings): string {
  return section("cast", "Cast Matrix", `${state.castMatrix.length} tracked`, `
    <div class="loomos-card-grid">
      ${state.castMatrix.length === 0
        ? `<p class="loomos-muted">No cast evidence in this state.</p>`
        : state.castMatrix.map((member) => `
          <article class="loomos-card">
            <div class="loomos-card-heading">
              <div>
                <span class="loomos-kicker">${escapeHtml(member.kind)}</span>
                <strong>${escapeHtml(member.name)}${member.qty > 1 ? ` x${member.qty}` : ""}</strong>
              </div>
              <span class="loomos-badge">${escapeHtml(member.awareness)}</span>
            </div>
            <p>${escapeHtml(member.status)}</p>
            <dl class="loomos-facts loomos-facts-tight">
              <div><dt>Location</dt><dd>${escapeHtml(member.location)}</dd></div>
              <div><dt>Intent</dt><dd>${escapeHtml(member.intent)}</dd></div>
              <div><dt>Emotion</dt><dd>${escapeHtml(member.emotionalState)}</dd></div>
              <div><dt>Threat</dt><dd>${escapeHtml(member.threat.pct)} | ${escapeHtml(member.threat.band)}</dd></div>
              ${visible(settings, "castVisuals")
                ? `<div><dt>Pose</dt><dd>${escapeHtml(member.pose)}</dd></div>
                   <div><dt>Proximity</dt><dd>${escapeHtml(member.proximity)}</dd></div>
                   <div><dt>Hands</dt><dd>${escapeHtml(member.hands)}</dd></div>
                   <div><dt>Spotlight</dt><dd>${escapeHtml(member.spotlight.pct)} | ${escapeHtml(member.spotlight.trend)}</dd></div>`
                : ""}
            </dl>
            ${visible(settings, "castVisuals") && member.visualAnchor
              ? `<div class="loomos-note">${escapeHtml(member.visualAnchor)}</div>`
              : ""}
            ${visible(settings, "clothing") && member.clothingSummary
              ? `<div class="loomos-subhead">Clothing</div><p>${escapeHtml(member.clothingSummary)}</p>`
              : ""}
            <div class="loomos-subhead">Goals</div>${chips(member.goals)}
            ${visible(settings, "relationships")
              ? `<div class="loomos-subhead">Relationships</div>${chips(member.relationships)}`
              : ""}
            ${visible(settings, "inventory")
              ? `<div class="loomos-subhead">Inventory</div>${chips(member.pockets.map((item) =>
                  `${item.name} x${item.qty}${item.known ? "" : " (unknown)"}`
                ))}`
              : ""}
          </article>
        `).join("")}
    </div>
  `, true);
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
          <div><dt>Sightline</dt><dd>${escapeHtml(scene.access.lineOfSight)}</dd></div>
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
  `);
}

function renderStory(state: LoomOSState): string {
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
            <p>${escapeHtml(thread.summary)}</p>
            <div class="loomos-meter-track"><i style="width:${Math.max(0, Math.min(100, thread.progress * 10))}%"></i></div>
            <small>Next pressure: ${escapeHtml(thread.nextPressure)}</small>
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
  `, true);
}

function renderContinuity(state: LoomOSState): string {
  const firewall = state.continuityFirewall;
  return section("continuity", "Continuity Firewall", `${firewall.risks.length} risks`, `
    <div class="loomos-stat-grid">
      <div><strong>${firewall.establishedFacts.length}</strong><span>facts</span></div>
      <div><strong>${firewall.antiRetconAnchors.length}</strong><span>anchors</span></div>
      <div><strong>${firewall.pendingConsequences.length}</strong><span>pending</span></div>
      <div><strong>${firewall.offscreenState.length}</strong><span>offscreen</span></div>
    </div>
    <div class="loomos-list">
      ${firewall.risks.length === 0
        ? `<p class="loomos-muted">No continuity conflicts detected.</p>`
        : firewall.risks.map((risk) => `
          <article class="loomos-row loomos-severity-${risk.severity}">
            <div class="loomos-row-title">
              <strong>${escapeHtml(risk.issue)}</strong>
              <span>${escapeHtml(risk.severity)}</span>
            </div>
            <p>${escapeHtml(risk.evidence)}</p>
            <small>Guardrail: ${escapeHtml(risk.recommendation)}</small>
          </article>
        `).join("")}
    </div>
    <div class="loomos-two-column">
      <div><div class="loomos-subhead">Anti-retcon anchors</div>${chips(firewall.antiRetconAnchors)}</div>
      <div><div class="loomos-subhead">Pending consequences</div>${chips(firewall.pendingConsequences)}</div>
      <div><div class="loomos-subhead">Banned next</div>${chips(firewall.bannedNext.map((item) =>
        `${item.text}${item.persistent ? " (persistent)" : ""}`
      ))}</div>
      <div><div class="loomos-subhead">Impossible next</div>${chips(firewall.impossibleNext)}</div>
    </div>
  `, true);
}

function renderTools(state: LoomOSState, settings: LoomOSSettings): string {
  const tools = state.tools;
  const blocks: string[] = [];
  if (visible(settings, "actionResolver") && tools.actionResolver) {
    blocks.push(`<article class="loomos-card">
      <span class="loomos-kicker">Action Resolver</span>
      <strong>${escapeHtml(tools.actionResolver.userAction)}</strong>
      <p>${escapeHtml(tools.actionResolver.worldResponse)}</p>
      <small>Risk: ${escapeHtml(tools.actionResolver.risk)}</small>
      ${chips(tools.actionResolver.blockers)}
    </article>`);
  }
  if (visible(settings, "dialogueState") && tools.dialogueState) {
    blocks.push(`<article class="loomos-card">
      <span class="loomos-kicker">Dialogue</span>
      <strong>${escapeHtml(tools.dialogueState.openThread)}</strong>
      <p>${escapeHtml(tools.dialogueState.socialMask)}</p>
      ${chips(tools.dialogueState.levers)}
    </article>`);
  }
  if (visible(settings, "directorStyle") && tools.directorStyle) {
    blocks.push(`<article class="loomos-card">
      <span class="loomos-kicker">Director Style</span>
      <strong>${escapeHtml(tools.directorStyle.primary)}</strong>
      <p>${escapeHtml(tools.directorStyle.push)}</p>
      ${chips(tools.directorStyle.voiceCues)}
    </article>`);
  }
  if (visible(settings, "closenessState") && tools.closenessState) {
    blocks.push(`<article class="loomos-card">
      <span class="loomos-kicker">Closeness</span>
      <strong>${escapeHtml(tools.closenessState.emotional)}</strong>
      <p>${escapeHtml(tools.closenessState.physical)}</p>
      ${chips(tools.closenessState.boundaries)}
    </article>`);
  }
  if (visible(settings, "imagePrompt") && tools.imagePrompt) {
    blocks.push(`<article class="loomos-card">
      <span class="loomos-kicker">Image Prompt</span>
      <strong>${escapeHtml(tools.imagePrompt.shot)} | ${escapeHtml(tools.imagePrompt.medium)}</strong>
      <p>${escapeHtml(tools.imagePrompt.subject)}</p>
      <small>${escapeHtml(tools.imagePrompt.hint)}</small>
    </article>`);
  }
  return blocks.length === 0
    ? ""
    : section("tools", "Tools", `${blocks.length} active`, `<div class="loomos-card-grid">${blocks.join("")}</div>`);
}

function renderAudit(state: LoomOSState): string {
  return section("audit", "Audit", `${state.auditLog.length} entries`, `
    <div class="loomos-list">
      ${state.auditLog.map((entry) => `
        <article class="loomos-row">
          <div class="loomos-row-title">
            <strong>${escapeHtml(entry.system)}</strong>
            <span>${escapeHtml(entry.marker)}</span>
          </div>
          <p>${escapeHtml(entry.result)}</p>
          <small>${entry.repaired ? "Repaired | " : ""}${escapeHtml(entry.notes)}</small>
        </article>
      `).join("") || `<p class="loomos-muted">No audit entries.</p>`}
    </div>
  `);
}

export function renderDashboard(
  state: LoomOSState,
  settings: LoomOSSettings,
): string {
  const sections = [
    visible(settings, "sceneKernel") ? renderKernel(state) : "",
    visible(settings, "deltas") ? renderDelta(state) : "",
    visible(settings, "meters") ? renderMeters(state) : "",
    visible(settings, "castCore") ? renderCast(state, settings) : "",
    visible(settings, "worldSpace") || visible(settings, "secretsRumors")
      ? renderWorld(state, settings)
      : "",
    visible(settings, "storyThreads") ? renderStory(state) : "",
    visible(settings, "continuity") ? renderContinuity(state) : "",
    renderTools(state, settings),
    visible(settings, "auditLog") ? renderAudit(state) : "",
  ].filter(Boolean);
  return sections.length > 0
    ? `<div class="loomos-dashboard">${sections.join("")}</div>`
    : `<div class="loomos-empty"><h3>All display modules are hidden</h3><p>Enable Display for one or more modules in the drawer settings. Stored state has not been deleted.</p></div>`;
}
