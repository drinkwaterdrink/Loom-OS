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
                <small><strong>${escapeHtml(meter.band)}</strong> | ${escapeHtml(meter.note)}</small>
              </article>
            `;
          }).join("")}
    </div>
  `);
}

function renderCast(state: LoomOSState, settings: LoomOSSettings): string {
  return section("cast", "Cast Matrix", `${state.castMatrix.length} tracked`, `
    <div class="loomos-card-grid">
      ${state.castMatrix.length === 0
        ? `<p class="loomos-muted">No cast evidence in this state.</p>`
        : state.castMatrix.map((member) => {
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
                <div class="loomos-chip-row" style="margin: 4px 0 8px;">
                  <span class="loomos-chip">📍 ${escapeHtml(member.location)}</span>
                  <span class="loomos-chip">🎭 ${escapeHtml(member.emotionalState)}</span>
                  <span class="loomos-chip">⚠️ Threat: ${escapeHtml(member.threat.pct)} (${escapeHtml(member.threat.band)})</span>
                </div>
                <p><strong>Intent:</strong> ${escapeHtml(member.intent)}</p>
                <p><strong>Status:</strong> ${escapeHtml(member.status)}</p>
                
                ${hasExtra ? `
                  <details class="loomos-cast-extra">
                    <summary>Visuals & Pockets</summary>
                    <div class="loomos-cast-extra-body" style="display: grid; gap: 6px;">
                      ${member.pose ? `<p><strong>Pose:</strong> ${escapeHtml(member.pose)}</p>` : ""}
                      ${member.proximity ? `<p><strong>Proximity:</strong> ${escapeHtml(member.proximity)}</p>` : ""}
                      ${member.hands ? `<p><strong>Hands:</strong> ${escapeHtml(member.hands)}</p>` : ""}
                      ${member.visualAnchor ? `<p><strong>Visual Anchor:</strong> ${escapeHtml(member.visualAnchor)}</p>` : ""}
                      ${visible(settings, "clothing") && member.clothingSummary ? `<p><strong>Clothing:</strong> ${escapeHtml(member.clothingSummary)}</p>` : ""}
                      ${member.goals.length > 0 ? `<div class="loomos-subhead">Goals</div>${chips(member.goals)}` : ""}
                      ${visible(settings, "relationships") && member.relationships.length > 0 ? `<div class="loomos-subhead">Relationships</div>${chips(member.relationships)}` : ""}
                      ${visible(settings, "inventory") && member.pockets.length > 0 ? `<div class="loomos-subhead">Pockets</div>${chips(member.pockets.map(item => `${item.name} x${item.qty}${item.known ? "" : " (unknown)"}`))} : ""` : ""}
                      ${member.stableFacts.length > 0 ? `<div class="loomos-subhead">Stable Facts</div>${chips(member.stableFacts)}` : ""}
                    </div>
                  </details>
                ` : ""}
              </article>
            `;
          }).join("")}
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
    <div class="loomos-list">
      ${firewall.risks.length === 0
        ? `<p class="loomos-muted" style="margin-bottom: 12px;">✅ No continuity conflicts detected.</p>`
        : firewall.risks.map((risk) => `
          <article class="loomos-row loomos-severity-${risk.severity}">
            <div class="loomos-row-title">
              <strong>${escapeHtml(risk.issue)}</strong>
              <span class="loomos-badge loomos-badge-severity-${risk.severity}">${escapeHtml(risk.severity)}</span>
            </div>
            <p>${escapeHtml(risk.evidence)}</p>
            <small>Guardrail: ${escapeHtml(risk.recommendation)}</small>
          </article>
        `).join("")}
    </div>
    
    <div class="loomos-stat-grid" style="margin-top: 10px;">
      <div><strong>${firewall.establishedFacts.length}</strong><span>facts</span></div>
      <div><strong>${firewall.antiRetconAnchors.length}</strong><span>anchors</span></div>
      <div><strong>${firewall.pendingConsequences.length}</strong><span>pending</span></div>
      <div><strong>${firewall.offscreenState.length}</strong><span>offscreen</span></div>
    </div>
    
    <details class="loomos-cast-extra" style="margin-top: 10px;">
      <summary>Established Facts & Anchors</summary>
      <div class="loomos-cast-extra-body" style="display: grid; gap: 6px;">
        <div class="loomos-subhead">Established Facts (${firewall.establishedFacts.length})</div>
        ${chips(firewall.establishedFacts)}
        <div class="loomos-subhead">Anti-retcon Anchors (${firewall.antiRetconAnchors.length})</div>
        ${chips(firewall.antiRetconAnchors)}
      </div>
    </details>
    
    <details class="loomos-cast-extra" style="margin-top: 6px;">
      <summary>Consequences & Offscreen State</summary>
      <div class="loomos-cast-extra-body" style="display: grid; gap: 6px;">
        <div class="loomos-subhead">Pending Consequences (${firewall.pendingConsequences.length})</div>
        ${chips(firewall.pendingConsequences)}
        <div class="loomos-subhead">Offscreen State (${firewall.offscreenState.length})</div>
        ${chips(firewall.offscreenState)}
      </div>
    </details>
    
    <details class="loomos-cast-extra" style="margin-top: 6px;">
      <summary>Banned / Impossible Next</summary>
      <div class="loomos-cast-extra-body" style="display: grid; gap: 6px;">
        <div class="loomos-subhead">Banned next moves</div>
        ${chips(firewall.bannedNext.map((item) => `${item.text}${item.persistent ? " (persistent)" : ""}`))}
        <div class="loomos-subhead">Impossible next moves</div>
        ${chips(firewall.impossibleNext)}
      </div>
    </details>
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

function renderOverviewCard(state: LoomOSState, settings: LoomOSSettings): string {
  const deltaHeadline = state.delta?.headline || "No major changes";
  const location = state.kernel?.location || "Unknown location";
  const time = state.kernel?.timeframe || state.kernel?.time || "Unknown time";
  const activeCastCount = state.castMatrix?.filter(c => c.kind === "pov" || c.kind === "main" || c.kind === "npc").length ?? 0;
  const threadCount = state.storyState?.threadLoom?.filter(t => t.status !== "resolved").length ?? 0;
  const riskCount = state.continuityFirewall?.risks?.length ?? 0;
  const injectionStatus = settings.injectionEnabled ? "Enabled" : "Disabled";

  return `
    <div class="loomos-shell loomos-overview-card">
      <div class="loomos-kicker">Overview</div>
      <div class="loomos-overview-headline">"${escapeHtml(deltaHeadline)}"</div>
      <div class="loomos-overview-details">
        <div><strong>Location:</strong> <span>${escapeHtml(location)} (${escapeHtml(time)})</span></div>
        <div class="loomos-overview-stats">
          <span>👥 ${activeCastCount} Cast</span>
          <span>🧵 ${threadCount} Threads</span>
          <span>⚠️ ${riskCount} Risks</span>
          <span class="loomos-overview-inject-${settings.injectionEnabled ? "active" : "inactive"}">💉 Inject: ${injectionStatus}</span>
        </div>
      </div>
    </div>
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
    let body = "";

    if (itemCount === 0) {
      body = `<p class="loomos-muted">No evidence compiled for this custom module.</p>`;
    } else {
      if (cm.outputMode === "bullets") {
        body = `
          <ul class="loomos-bullet-list">
            ${compiled.items.map(it => `
              <li>
                <strong>${escapeHtml(it.title)}</strong>: ${escapeHtml(it.text)}
                <span class="loomos-badge loomos-badge-severity-${it.importance}" style="font-size: 7px; vertical-align: middle; margin-left: 4px;">${it.importance}</span>
              </li>
            `).join("")}
          </ul>
        `;
      } else if (cm.outputMode === "chips") {
        body = `
          <div class="loomos-chip-row" style="margin-top: 4px;">
            ${compiled.items.map(it => `
              <span class="loomos-chip" style="${it.color ? `border-color:${escapeHtml(it.color)}` : ""}">
                <strong>${escapeHtml(it.title)}</strong>: ${escapeHtml(it.text)}
                <span class="loomos-badge loomos-badge-severity-${it.importance}" style="font-size: 7px; margin-left: 2px;">${it.importance}</span>
              </span>
            `).join("")}
          </div>
        `;
      } else if (cm.outputMode === "gauge") {
        body = `
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
        body = `
          <div class="loomos-card-grid">
            ${compiled.items.map(it => `
              <div class="loomos-card" style="${it.color ? `border-left: 3px solid ${escapeHtml(it.color)}` : ""}">
                <div class="loomos-card-heading">
                  <strong>${escapeHtml(it.title)}</strong>
                  <span class="loomos-badge loomos-badge-severity-${it.importance}">${it.importance}</span>
                </div>
                <p>${escapeHtml(it.text)}</p>
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
    ...renderCustomModules(state, settings),
    visible(settings, "auditLog") ? renderAudit(state) : "",
  ].filter(Boolean);

  const overview = renderOverviewCard(state, settings);

  return sections.length > 0
    ? `<div class="loomos-dashboard">${overview}${sections.join("")}</div>`
    : `<div class="loomos-empty"><h3>All display modules are hidden</h3><p>Enable Display for one or more modules in the drawer settings. Stored state has not been deleted.</p></div>`;
}
