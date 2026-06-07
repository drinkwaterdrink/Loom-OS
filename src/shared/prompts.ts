import {
  MODULE_CATALOG,
  type ModuleKey,
} from "./modules";

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
    "appearance":{},
    "clothing":{"summary":"","layerCount":0,"layers":[]},
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
      "negative":"","full":"","hint":""
    }
  },
  "auditLog": [{
    "system":"compiler","marker":"","result":"","repaired":false,"notes":""
  }]
}

For disabled optional modules: meters=[], scene=null, worldState=null, the
corresponding tools member=null, and auditLog=[]. Empty optional arrays inside an
enabled object are valid. Do not emit example rows when there is no evidence.`;

export function buildStateCompilerPrompt(
  enabledModules: ModuleKey[],
  customModules?: any[],
  overrides?: Record<string, { compilerGuidanceAddendum?: string }>,
): string {
  const enabled = MODULE_CATALOG
    .filter((module) => enabledModules.includes(module.key))
    .map((module) => {
      const base = `- ${module.key}: ${module.description}`;
      const addendum = overrides?.[module.key]?.compilerGuidanceAddendum;
      return addendum ? `${base} [Override: ${addendum}]` : base;
    })
    .join("\n");

  const enabledCustom = (customModules || [])
    .filter((m) => m.enabled)
    .map((m) => `- customModuleData[moduleId=${m.id}] (${m.label}): ${m.compilerInstruction} (maxItems: ${m.maxItems || 6})`)
    .join("\n");

  const trackingText = enabled + (enabledCustom ? "\n\nEnabled custom tracking modules:\n" + enabledCustom : "");

  let customContract = "";
  let customShape = "";
  if (customModules && customModules.some((m) => m.enabled)) {
    customContract = `
- customModuleData: Array of compiled custom modules. For each enabled custom module, append an entry with the exact moduleId, label, a turn summary, and an array of items (up to its maxItems limit) containing title, text, importance (low/medium/high/critical), and optional color.`;
    
    customShape = `,
  "customModuleData": [
    {
      "moduleId": "custom_module_id",
      "label": "Custom Module Label",
      "summary": "Turn summary",
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
- Use numeric ranges exactly as named: percentages 0-100, threat/observer pressure 0-10, urgency 0-5, conflict severity 1-3.

Character depth rules:
- For each named character, include appearance fields (species, ageBand, height, build, skin, hair, eyes, voice, presence) when transcript evidence exists. Use empty object {} otherwise.
- Carry forward appearance from seed unless contradicted. Never reset appearance each turn.
- Clothing persists until transcript explicitly shows change. Track layers (outer/upper/lower/feet/accessory). Mark clothing.changed=true when clothing updates.
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
