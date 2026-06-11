import {
  getEffectiveModuleCatalog,
  type ModuleKey,
  type StockModuleOverrides,
} from "./modules";
import type { CustomModule } from "./types";

const CORE_CONTRACT = `
Always return these top-level keys:
- activeModules: enabled module keys actually represented
- kernel: scene/location/time/tone/focus/objective/summary/risk/constraints
- delta: headline, changedModules, up to 6 changes, carriedForward, newlyEstablished
- castMatrix: compact cast records
- storyState: goals, conflicts, threadLoom, stakes, countdowns, autonomyQueue
- continuityFirewall: facts, anchors, consequences, offscreen state, banned/impossible next, risks

Return optional module containers only through their stable top-level locations:
- meters: diagnostic meter array
- scene: privacy, observers, light, spatial/access/carryover/items
- worldState: environmental changes, hazards, rumors, secrets, loaded signs
- tools: actionResolver, dialogueState, directorStyle, closenessState, imagePrompt
- auditLog: compact compiler audit entries

For disabled optional modules use [] or null as appropriate. Never omit required
core objects. Every object and array must match the supplied contract names.`;

const STATE_SHAPE_GUIDE = `
Exact JSON field contract (values below are type examples, not story facts):
{
  "activeModules": ["sceneKernel"],
  "kernel": {
    "scene": "", "location": "", "timeframe": "", "date": "", "time": "",
    "elapsed": "", "weather": "", "pov": "", "tone": "", "topic": "",
    "theme": "", "objective": "", "summary": "", "currentFocus": "",
    "nextFocus": "", "currentRisk": "", "stopMode": "", "stopWhy": "",
    "constraints": []
  },
  "delta": {
    "headline": "", "changedModules": [],
    "changes": [{"text":"","age":"","module":"deltas","importance":"medium"}],
    "carriedForward": [], "newlyEstablished": []
  },
  "meters": [{
    "id": "tension", "label": "Tension", "value": 0, "pct": "0%",
    "band": "", "color": "", "trend": "unknown", "note": ""
  }],
  "scene": {
    "privacy": "private", "observerCount": 0,
    "observerPressure": {
      "value": 0, "pct": "0%", "band": "", "color": "",
      "trend": "unknown", "note": ""
    },
    "crowdNoise": "", "crowdFlow": "",
    "light": {"primary":"","secondary":"","quality":"","color":""},
    "spatial": [],
    "access": {
      "exit": "FREE", "lineOfSight": "", "noiseMask": "",
      "items": [], "people": []
    },
    "carryover": {"body":[],"room":[],"social":[]},
    "items": [{
      "name":"","owner":"","location":"","condition":"","lastTouch":"",
      "importance":"medium"
    }]
  },
  "castMatrix": [{
    "id":"","name":"","kind":"npc","qty":1,"role":"","location":"",
    "status":"","awareness":"ambient","changed":false,
    "threat":{"value":0,"pct":"0%","band":"","color":"","note":""},
    "spotlight":{"value":0,"pct":"0%","band":"","color":"","trend":"unknown","note":""},
    "appearance":{
      "species":"","ageBand":"","apparentAge":"","genderPresentation":"",
      "height":"","weight":"","build":"","bodyType":"","frame":"",
      "proportions":"","silhouette":"","bodyComposition":"",
      "shoulders":"","chest":"","bust":"","waist":"","hips":"","glutes":"",
      "arms":"","legs":"","hands":"","skin":"","complexion":"",
      "face":"","facialStructure":"","hair":"","eyes":"","eyebrows":"",
      "nose":"","lips":"","ears":"","facialHair":"","voice":"",
      "movement":"","posture":"","distinguishingMarks":"","scars":"",
      "tattoos":"","piercings":"","birthmarks":"","uniqueFeatures":"",
      "attractiveFeatures":"",
      "immutableTraits":[],"presence":"","fullDescription":"","anchor":""
    },
    "clothing":{
      "summary":"","silhouette":"","palette":"","fabric":"","fit":"",
      "condition":"","notable":"","styling":"","coverage":"",
      "footwear":"","accessories":"","layerCount":0,"layers":[]
    },
    "currentState":{"pose":"","proximity":"","leftHand":"","rightHand":"","emotion":"","intent":"","injury":""},
    "emotionalState":"","intent":"","pose":"","proximity":"","hands":"",
    "visualAnchor":"","identitySummary":"","clothingSummary":"",
    "goals":[],"relationships":[],"leverage":[],"pockets":[],"stableFacts":[],"continuity":{}
  }],
  "worldState": {
    "recentEnvironmentalChanges":[],"activeHazards":[],
    "rumors":[{"rumor":"","source":"","credibility":0,"pct":"0%","color":""}],
    "secrets":[{"secret":"","visibleHint":"","knownBy":[]}],
    "loadedSigns":[{"thing":"","plantedBy":"","payoffWhen":"","state":"LOADED","payoffHint":""}]
  },
  "storyState": {
    "goals":[{"who":"","goal":"","status":"ACTIVE","note":""}],
    "conflicts":[{"a":"","b":"","label":"","severity":1}],
    "threadLoom":[{
      "title":"","status":"active","urgency":0,"priority":"medium",
      "progress":0,"pct":"0%","color":"","label":"","summary":"",
      "nextPressure":"","participants":[]
    }],
    "stakes":[{"who":"","win":"","lose":""}],
    "countdowns":[{"title":"","left":0,"unit":"","pct":"0%","color":""}],
    "spotlightQueue":[{"name":"","turnsSince":0,"need":"okay","reason":""}],
    "autonomyQueue":[{"who":"","action":"","unlessInterruptedBy":""}]
  },
  "continuityFirewall": {
    "establishedFacts":[],"antiRetconAnchors":[],"offscreenState":[],
    "pendingConsequences":[{"cause":"","pending":"","urgency":5,"status":"PENDING"}],
    "bannedNext":[{"text":"","reason":"","scope":"turn","source":"compiler"}],
    "impossibleNext":[],
    "risks":[{"severity":"medium","issue":"","evidence":"","recommendation":""}],
    "terms":[{"party":"","term":"","status":"UNKNOWN","binding":false}]
  },
  "tools": {
    "actionResolver": {
      "userAction":"","worldResponse":"","risk":"","blockers":[]
    },
    "dialogueState": {
      "openThread":"","socialMask":"","levers":[],"taboos":[]
    },
    "directorStyle": {
      "primary":"","mask":"","push":"","voiceCues":[]
    },
    "closenessState": {
      "emotional":"","physical":"","consentSignals":[],"boundaries":[]
    },
    "imagePrompt": {
      "aspect":"","shot":"","medium":"","subject":"","positive":"",
      "negative":"","intent":"","composition":"","camera":"",
      "lighting":"","colorPalette":"","environment":"",
      "characterContinuity":"","action":"","materials":"","mood":"",
      "textRendering":"","constraints":[],"full":"","hint":""
    }
  },
  "auditLog": [{
    "system":"compiler","marker":"","result":"","repaired":false,"notes":""
  }]
}

For disabled optional modules: meters=[], scene=null, worldState=null, the
corresponding tools member=null, and auditLog=[]. Empty optional arrays inside an
enabled object are valid. Do not emit example rows when there is no evidence.`;

export function buildStockModulePromptBlock(
  key: ModuleKey,
  overrides: StockModuleOverrides = {},
): string {
  const module = getEffectiveModuleCatalog({ stockModuleOverrides: overrides })
    .find((candidate) => candidate.key === key);
  if (!module) return "";
  return [
    `- ${module.key} (${module.label}): ${module.compilerInstruction}`,
    `  Schema: ${module.schemaSummary}`,
  ].join("\n");
}

export function buildStockModuleContractDocument(
  overrides: StockModuleOverrides = {},
): string {
  return getEffectiveModuleCatalog({ stockModuleOverrides: overrides })
    .map((module) => [
      `# ${module.label} (${module.key})`,
      `Group: ${module.group}`,
      `Description: ${module.description}`,
      `Schema: ${module.schemaSummary}`,
      `Compiler instruction: ${module.compilerInstruction}`,
      `Injection behavior: ${module.injectionBehavior}`,
      `Render behavior: ${module.renderBehavior}`,
      "",
      buildStockModulePromptBlock(module.key, overrides),
    ].join("\n"))
    .join("\n\n");
}

export function buildStateCompilerPrompt(
  enabledModules: ModuleKey[],
  customModules: CustomModule[] = [],
  overrides: StockModuleOverrides = {},
): string {
  const enabled = getEffectiveModuleCatalog({ stockModuleOverrides: overrides })
    .filter((module) => enabledModules.includes(module.key))
    .map((module) => {
      return buildStockModulePromptBlock(module.key, overrides);
    })
    .join("\n");

  const enabledCustom = customModules
    .filter((m) => m.enabled)
    .map((m) => {
      const fields = Object.fromEntries(m.schemaFields.map((field) => {
        if (field.type === "number") return [field.key, field.defaultValue ?? field.min ?? 0];
        if (field.type === "boolean") return [field.key, field.defaultValue ?? false];
        if (field.type === "enum") return [field.key, field.defaultValue ?? field.enumOptions[0] ?? ""];
        if (field.type === "gauge") {
          return [field.key, {
            value: field.defaultValue ?? field.min ?? 0,
            pct: "0%",
            band: "unknown",
            color: "var(--loomos-muted)",
            trend: "unknown",
            note: "",
          }];
        }
        if (field.type === "chips" || field.type === "list") return [field.key, []];
        return [field.key, field.defaultValue ?? ""];
      }));
      return [
        `- customModuleData[moduleId=${m.id}] (${m.label}): ${m.compilerInstruction}`,
        `  maxItems=${m.maxItems}; outputMode=${m.outputMode}; fields=${JSON.stringify(fields)}`,
        "  Output data only. Never output HTML, CSS, scripts, or template markup.",
      ].join("\n");
    })
    .join("\n");

  const trackingText = enabled + (enabledCustom ? "\n\nEnabled custom tracking modules:\n" + enabledCustom : "");

  let customContract = "";
  let customShape = "";
  if (customModules.some((m) => m.enabled)) {
    customContract = `
- customModuleData: Array of compiled custom modules. For each enabled custom module, append an entry with the exact moduleId, label, a turn summary, a fields object using only its declared schema field keys, and an items array (up to its maxItems limit) containing title, text, importance (low/medium/high/critical), and optional color.`;
    
    customShape = `,
  "customModuleData": [
    {
      "moduleId": "custom_module_id",
      "label": "Custom Module Label",
      "summary": "Turn summary",
      "fields": {},
      "items": [
        {
          "title": "Item title",
          "text": "Item text description",
          "importance": "medium",
          "color": "#ff0000"
        }
      ]
    }
  ]`;
  }

  const coreContractWithCustom = CORE_CONTRACT + customContract;
  const appearanceRules = enabledModules.includes("appearance")
    ? `
- For each named adult character, populate grounded appearance fields when transcript or seed evidence exists.
- Treat appearance as persistent identity state. Carry it forward unchanged unless the transcript explicitly changes it.
- Write fullDescription as a coherent 3-6 sentence visual portrait, not a terse keyword list. Write anchor as a concise identity lock for future turns.
- Describe hair color, length, texture and styling; eye color, shape and expression; facial structure and features; complexion and skin details; height and weight impression; frame, build, musculature or softness; shoulders, chest or bust, waist, hips, glute or seat shape, limbs, hands, posture, movement, voice, marks, scars, tattoos, piercings, attractive features, and unique identifiers when evidence supports them.
- Never infer exact measurements, cup sizes, numeric weight, hidden anatomy, or unsupported sexual details. Only populate bust, glutes, and attractiveFeatures for confirmed or assumed adults. Keep any minor or age-ambiguous description neutral.
- Use empty strings and arrays for unknown appearance fields. Never reset established appearance each turn.`
    : `
- Appearance tracking is disabled. Preserve an empty appearance object and do not invent new physical traits.`;
  
  // Insert customShape before the closing brace in STATE_SHAPE_GUIDE
  const closingBraceIdx = STATE_SHAPE_GUIDE.lastIndexOf("}");
  const shapeGuideWithCustom = STATE_SHAPE_GUIDE.substring(0, closingBraceIdx) + customShape + "\n}";

  return `You are LoomOS, a strict story-state compiler.

Analyze only the supplied identity, previous state seed, and transcript.
Do not continue the story. Do not roleplay. Do not address the user.
Return exactly one JSON object with no Markdown fences or commentary.

Enabled tracking modules:
${trackingText}

${coreContractWithCustom}

${shapeGuideWithCustom}

Rules:
- Ground every claim in the transcript or previous seed.
- The previous seed is continuity context, never proof that the target swipe already has state.
- Compare the seed with the newest transcript evidence and produce real delta fields.
- Carry stable facts forward unless the transcript explicitly changes them.
- Never invent changes to location, identity, clothing, injuries, ownership, relationships, or offscreen state.
- Use empty arrays and compact empty strings when evidence is absent.
- Respect all array limits. Keep prose compact and operational.
- Precompute pct, label/band, color, and trend fields wherever the contract asks for them.
- Meters diagnose current state only. They never command escalation.
- Keep character tracking non-explicit. When age is unspecified, treat characters as adults and never output minors.
- Do not reveal hidden chain-of-thought. Secrets are reader-visible dramatic state only.
- activeModules must contain only enabled module keys.
- For custom modules, output structured data only. The user-authored renderer owns HTML and CSS.
- Respect each custom schema field key, type, enum options, required flag, numeric range, and maxItems.
- Empty schema defaults are valid when the transcript has no evidence.
- Use numeric ranges exactly as named: percentages 0-100, threat/observer pressure 0-10, urgency 0-5, conflict severity 1-3.

Character depth rules:
${appearanceRules}
- Clothing persists until transcript explicitly shows change. Write clothing.summary as a coherent 2-4 sentence outfit description and separately track up to 8 visible layers (outer/upper/lower/feet/accessory/other).
- For clothing, include garment type, cut, color, pattern, material, texture, fit, coverage, closures, condition, wear, wetness, damage, stains, accessories, footwear, and how the outfit sits on or moves with the body when evidence supports it.
- Mark clothing.changed=true when clothing updates, including when a garment is added, removed, opened, shifted, damaged, wet, stained, or transferred.
- Update currentState (pose, proximity, leftHand, rightHand, emotion, intent, physicalTell, injury) from latest transcript actions and descriptions.
- Relationships: use axis labels (Trust, Fear, Attraction, Rivalry, Loyalty, Debt). Value -100 (hostile) to 100 (devoted). Include evidence for changes.
- Spot trends (up/down/steady) on relationship values.
- Set changed=true and add changeNote whenever a character's location, clothing, inventory, pose, emotional state, awareness, relationship, or intent changes from the previous turn.
- Uncertainty: log claims that are not yet fully confirmed with confidence 0-10 and appropriate label.
- Crowd/background groups: summarize compactly with qty. Do not over-individualize.
- Never output explicit anatomical details. Focus on grounded, useful continuity.
- When age is unspecified, assume adult. Never output minors.
- Spotlight queue: track turnsSince each named character last had narrative focus. Use need: active/soon/okay/quiet/background.
- Character-level castMatrix[].goals are always compact strings. Structured goals with who/goal/status/note fields belong only in storyState.goals.

GPT Image prompt rules:
- When imagePrompt is enabled, build a production-ready visual brief from the exact tracker state rather than a short tag list.
- Follow this order inside tools.imagePrompt.full: INTENT; SCENE AND ENVIRONMENT; SUBJECTS AND CONTINUITY; ACTION AND POSE; COMPOSITION; CAMERA; LIGHTING AND COLOR; MATERIALS AND TEXTURE; MEDIUM AND FINISH; TEXT; CONSTRAINTS.
- Use short labeled sections or line breaks. Use concrete natural language and avoid repetitive quality buzzwords or keyword stuffing.
- Preserve each character's established appearance, clothing, body proportions, marks, visible accessories, pose, gaze, hands, and object interactions. Do not contradict appearance or clothing modules.
- Specify subject scale and body framing, whether feet must be visible, gaze direction, hand placement, foreground/midground/background placement, camera angle, viewpoint, perspective, atmosphere, and negative space when relevant.
- For photorealistic output, say photorealistic, real photograph, professional photography, or an equivalent direct cue. Treat lens and camera details as high-level visual guidance rather than exact physical simulation.
- State explicit invariants and exclusions: no watermark, no unintended text, no logos or trademarks, no extra people or limbs, no malformed hands, no cropped required body parts, and no continuity drift unless requested.
- If text should appear, put the exact text and placement in textRendering. Otherwise use "No text in the image."
- Use a detailed 350-800 word full prompt when the tracker contains enough visual evidence. Prefer specificity over filler; do not invent missing scene or character facts.
`;
}

export const STATE_REPAIR_PROMPT = `Repair a malformed LoomOS State V2 compiler result.
Return exactly one corrected JSON object and no Markdown or explanation.
Keep only supported fields, satisfy all required core objects, obey array
limits, and use null or empty arrays for disabled modules.
Do not add new story events or unsupported facts.

SHAPE CORRECTIONS (fix these common mistakes):
- castMatrix[].goals MUST be string[], not objects. If you wrote an object like {"goal":"Find X"}, extract "Find X" as a string in the array.
- castMatrix[].pockets MUST be object[] with {name, type, qty, condition, known}. If you wrote a plain string, wrap it in {name: string, type:"misc", qty:1, condition:"", known:true}.
- castMatrix[].stableFacts MUST be string[], not objects. Extract text from objects.
- castMatrix[].leverage MUST be string[], not objects. Extract text from objects.
- continuityFirewall.impossibleNext MUST be string[], not objects. Extract text from objects.
- continuityFirewall.establishedFacts MUST be string[], not objects.
- continuityFirewall.antiRetconAnchors MUST be string[], not objects.
- continuityFirewall.offscreenState MUST be string[], not objects.
- continuityFirewall.pendingConsequences MUST be object[] with {cause, pending, urgency, status}.
- continuityFirewall.bannedNext MUST be object[] with {text, reason, scope, source}.
- continuityFirewall.terms MUST be object[] with {party, term, status, binding}.
- kernel.constraints MUST be string[], not objects.
- scene.spatial MUST be string[], not objects.
- scene.access.items MUST be string[], not objects.
- scene.access.people MUST be string[], not objects.
- storyState.threadLoom[].participants MUST be string[], not objects.

EXAMPLES:
- BAD: "goals": [{"goal": "Find the baths"}]
  GOOD: "goals": ["Find the baths"]
- BAD: "pockets": ["Lock pick"]
  GOOD: "pockets": [{"name": "Lock pick", "type": "tool", "qty": 1, "condition": "Good", "known": true}]
- BAD: "impossibleNext": [{"text": "Using the east stair"}]
  GOOD: "impossibleNext": ["Using the east stair"]
- BAD: "pendingConsequences": ["The guards are approaching"]
  GOOD: "pendingConsequences": [{"cause": "Guards patrol", "pending": "The guards are approaching", "urgency": 5, "status": "PENDING"}]
- BAD: "relationships": ["Iven: Trust=30"]
  GOOD: "relationships": [{"target": "Iven", "axis": "Trust", "value": 30}]
`;
