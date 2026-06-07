var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/shared/modules.ts
var MODULE_KEYS = [
  "sceneKernel",
  "deltas",
  "meters",
  "castCore",
  "castVisuals",
  "clothing",
  "relationships",
  "inventory",
  "worldSpace",
  "storyThreads",
  "continuity",
  "secretsRumors",
  "actionResolver",
  "dialogueState",
  "directorStyle",
  "closenessState",
  "imagePrompt",
  "auditLog"
];
var CORE_TRACKING_MODULES = /* @__PURE__ */ new Set([
  "sceneKernel",
  "deltas",
  "castCore",
  "storyThreads",
  "continuity"
]);
var MODULE_CATALOG = [
  {
    key: "sceneKernel",
    label: "Scene Kernel",
    group: "Core",
    core: true,
    intensity: "medium",
    description: "Scene, time, tone, focus, objective, and constraints.",
    schemaSummary: "scene, location, timeframe, date, time, elapsed, weather, pov, tone, topic, theme, objective, summary, currentFocus, nextFocus, currentRisk, stopMode, stopWhy, constraints[]",
    compilerInstruction: "Scene metadata, focus, and constraints from transcript and seed. Ground in transcript evidence; carry forward stable scene context.",
    injectionBehavior: "Injected as scene: location, time, focus line. Always included when enabled.",
    renderBehavior: "Overview tab \u2014 hero block with scene name, focus, summary, constraints, facts list."
  },
  {
    key: "deltas",
    label: "Turn Deltas",
    group: "Core",
    core: true,
    intensity: "medium",
    description: "Meaningful changes from the previous compiled state.",
    schemaSummary: "headline, changedModules[], changes[{text, age, module, importance}], carriedForward[], newlyEstablished[]",
    compilerInstruction: "Compare prior seed state with newest transcript evidence. Output real diffs with importance labels. Carry forward unchanged facts.",
    injectionBehavior: "Injected first as delta: headline and top 4 changes. Highest injection priority.",
    renderBehavior: "Overview tab \u2014 headline callout, change list with importance badges, two-column carried/newly."
  },
  {
    key: "meters",
    label: "Diagnostic Meters",
    group: "Scene",
    core: false,
    intensity: "light",
    description: "Tension, danger, coherence, hidden information, and omen.",
    schemaSummary: "id (enum), label, value 0-100, pct, band, color, trend (enum), note",
    compilerInstruction: "Diagnose scene tension, danger, social heat, coherence, hidden info, and omen based on current narrative pressure. Never command escalation.",
    injectionBehavior: "Not injected by default. Moderate value for scene awareness.",
    renderBehavior: "Overview tab \u2014 meter grid with bar visualization, trend icons, band labels."
  },
  {
    key: "castCore",
    label: "Cast Core",
    group: "Cast",
    core: true,
    intensity: "heavy",
    description: "Presence, intent, status, awareness, goals, anchors, appearance, clothing, current state, uncertainty.",
    schemaSummary: "id, name, kind, role, location, status, awareness, threat, spotlight, appearance{}, clothing{}, currentState{}, goals[], stableFacts[], continuity{}, changed, changeNote",
    compilerInstruction: "Track all named characters appearing in the scene. Include appearance, clothing state, current pose/hands/proximity, emotional state, intent, relationships, pocket items, stable facts, and uncertainty. Mark changed=true and add changeNote when any field updates. Carry forward stable visual identity. Crowd/background groups summarized compactly.",
    injectionBehavior: "Injected as cast.Name: status; intent; goal for POV/main/high-spotlight characters. Up to 6 entries.",
    renderBehavior: "Cast tab \u2014 full character ledger with search, filters, expandable detail panels. Overview tab \u2014 compact cast cards."
  },
  {
    key: "castVisuals",
    label: "Cast Visuals",
    group: "Cast",
    core: false,
    intensity: "light",
    description: "Pose, proximity, hands, visual anchor, and spotlight.",
    schemaSummary: "pose, proximity, hands, visualAnchor, spotlight{gauge}",
    compilerInstruction: "Update pose, proximity, hands, and spotlight from transcript evidence. Spotlight reflects narrative focus weight.",
    injectionBehavior: "Injected only if budget allows and imagePrompt or castVisuals inject is enabled.",
    renderBehavior: "Cast tab \u2014 shown in Current State section of character card. Visual anchor in Appearance section."
  },
  {
    key: "clothing",
    label: "Clothing",
    group: "Cast",
    core: false,
    intensity: "light",
    description: "Compact grounded clothing continuity with layers and condition.",
    schemaSummary: "summary, silhouette, palette, fabric, fit, condition, notable, layerCount, layers[{slot, text, state, color}]",
    compilerInstruction: "Track clothing state per character. Persist until changed by transcript evidence. Include silhouette, palette, notable items. Mark changed when clothing updates.",
    injectionBehavior: "Included only if changed or currently plot-relevant. Budget-aware.",
    renderBehavior: "Cast tab \u2014 Clothing section in expandable details. Shows layers with slot labels."
  },
  {
    key: "relationships",
    label: "Relationships",
    group: "Cast",
    core: false,
    intensity: "medium",
    description: "Relationship targets, emotional axes, trends, and evidence.",
    schemaSummary: "relSummary, relationships[{target, axis, value -100..100, pct, label, color, trend, evidence}]",
    compilerInstruction: "Track character relationships on axes (Trust, Fear, Attraction, Rivalry, etc.). Value -100 (hostile) to 100 (devoted). Include evidence from transcript. Update trends on each turn.",
    injectionBehavior: "Included only if active in the current scene. Budget-aware.",
    renderBehavior: "Cast tab \u2014 Relationships section with value bars, trend indicators, evidence text."
  },
  {
    key: "inventory",
    label: "Inventory",
    group: "World",
    core: false,
    intensity: "medium",
    description: "Pockets, ownership, condition, and important room items.",
    schemaSummary: "pockets[{name, type: consumable/concealed/tool/key/evidence/misc, qty, condition, known, color, changed, changeNote}]",
    compilerInstruction: "Track known pocket inventory per character. Type categorizes the item. Mark changed when items are acquired, used, or transferred. Only known items visible to the POV.",
    injectionBehavior: "Injected as item.Name: name x qty; condition. Budget-aware, only known items.",
    renderBehavior: "Cast tab \u2014 Pockets section in expandable details. Scene items in World tab."
  },
  {
    key: "worldSpace",
    label: "World & Space",
    group: "World",
    core: false,
    intensity: "medium",
    description: "Privacy, observers, light, blocking, exits, and hazards.",
    schemaSummary: "privacy, observerCount, observerPressure{gauge}, crowdNoise, crowdFlow, light{primary,secondary,quality,color}, spatial[], access{exit,lineOfSight,noiseMask,items[],people[]}, carryover{body[],room[],social[]}, items[]",
    compilerInstruction: "Update spatial scene state each turn. Exit accessibility, light, crowd dynamics, and spatial facts. Carry over body/room/social context.",
    injectionBehavior: "Injected as access: exit; sight; noise plus spatial facts. Medium priority.",
    renderBehavior: "World tab \u2014 scene facts grid, spatial chips, carryover columns, scene items."
  },
  {
    key: "storyThreads",
    label: "Story Threads",
    group: "Story",
    core: true,
    intensity: "heavy",
    description: "Goals, conflicts, threads, stakes, countdowns, spotlight queue, and autonomy.",
    schemaSummary: "goals[]{who, goal, status, note}, conflicts[]{a, b, label, severity}, threadLoom[], stakes[], countdowns[], spotlightQueue[], autonomyQueue[]",
    compilerInstruction: "Track narrative threads with urgency, progress, and next pressure. Goals track character objectives. Spotlight queue tracks which characters need narrative attention. Countdowns tick toward consequences.",
    injectionBehavior: "Injected as thread.title: status/urgency + next pressure. Top urgent threads first. Stakes included for active parties.",
    renderBehavior: "Story tab \u2014 thread loom list, goals, stakes, countdowns, spotlight queue card, autonomy queue."
  },
  {
    key: "continuity",
    label: "Continuity Firewall",
    group: "Story",
    core: true,
    intensity: "heavy",
    description: "Facts, anchors, consequences, avoided moves, terms, and risks.",
    schemaSummary: "establishedFacts[], antiRetconAnchors[], pendingConsequences[{cause, pending, trigger, urgency, status, evidence, changed}], offscreenState[], bannedNext[{text, reason, scope, color, source}], impossibleNext[], risks[]{severity, issue, evidence, recommendation}, terms[{party, term, risk, status, binding, evidence}]",
    compilerInstruction: "Protect story coherence. Maintain established facts and anti-retcon anchors. Track pending narrative consequences with urgency and trigger conditions. Log avoided moves with reason and scope. Track character agreements/terms. Detect continuity conflicts as risks.",
    injectionBehavior: "Injected as anchor:, pending:, and risk. entries. High priority for continuity safety.",
    renderBehavior: "Continuity tab \u2014 explainer, metrics bar, risk cards, facts/anchors/consequences/terms/avoid lists."
  },
  {
    key: "secretsRumors",
    label: "Secrets & Rumors",
    group: "World",
    core: false,
    intensity: "light",
    description: "Rumors, secrets, hints, and loaded signs/setups.",
    schemaSummary: "rumors[]{rumor, source, credibility, pct, color}, secrets[]{secret, visibleHint, knownBy[]}, loadedSigns[]{thing, plantedBy, payoffWhen, state, evidence, payoffHint, changed}",
    compilerInstruction: "Track rumors with credibility scores and sources. Secrets are reader-visible dramatic state. Loaded signs/setups track planted story elements with payoff conditions.",
    injectionBehavior: "Not injected by default. Low priority within budget.",
    renderBehavior: "World tab \u2014 rumors grid, secrets list, loaded signs with state badges."
  },
  {
    key: "actionResolver",
    label: "Action Resolver",
    group: "Tools",
    core: false,
    intensity: "medium",
    description: "Current action, world response, blockers, and risk.",
    schemaSummary: "userAction, worldResponse, risk, blockers[]",
    compilerInstruction: "Track the user's current action, its expected world response, risk assessment, and mechanical blockers.",
    injectionBehavior: "Injected as action: action; response; risk. Medium-high priority.",
    renderBehavior: "Overview tab \u2014 action card with response, risk, blocker chips."
  },
  {
    key: "dialogueState",
    label: "Dialogue State",
    group: "Tools",
    core: false,
    intensity: "experimental",
    description: "Open thread, masks, levers, and taboos.",
    schemaSummary: "openThread, socialMask, levers[], taboos[]",
    compilerInstruction: "Track active dialogue threads, social masks characters are wearing, conversational levers, and established taboos.",
    injectionBehavior: "Experimental \u2014 not injected by default.",
    renderBehavior: "Overview tab \u2014 dialogue card (only when enabled)."
  },
  {
    key: "directorStyle",
    label: "Director Style",
    group: "Tools",
    core: false,
    intensity: "experimental",
    description: "Optional scene direction and voice cues.",
    schemaSummary: "primary, mask, push, voiceCues[]",
    compilerInstruction: "Track optional director-style scene framing, narrative mask, push direction, and voice cues for the writer.",
    injectionBehavior: "Experimental \u2014 not injected by default.",
    renderBehavior: "Overview tab \u2014 director card (only when enabled)."
  },
  {
    key: "closenessState",
    label: "Closeness State",
    group: "Tools",
    core: false,
    intensity: "experimental",
    description: "Non-explicit emotional and physical closeness.",
    schemaSummary: "emotional, physical, consentSignals[], boundaries[]",
    compilerInstruction: "Track non-explicit emotional and physical closeness between characters. Always PG. Focus on consent signals and established boundaries.",
    injectionBehavior: "Experimental \u2014 not injected by default.",
    renderBehavior: "Overview tab \u2014 closeness card (only when enabled)."
  },
  {
    key: "imagePrompt",
    label: "Image Prompt",
    group: "Tools",
    core: false,
    intensity: "experimental",
    description: "Optional compact visual prompt assembly.",
    schemaSummary: "aspect, shot, medium, subject, positive, negative, full, hint",
    compilerInstruction: "Assemble a compact text-to-image prompt from the current scene if visually distinctive. Aspect, shot type, medium, subject, and style cues.",
    injectionBehavior: "Not injected by default. Consumes significant budget if enabled.",
    renderBehavior: "Overview tab \u2014 image prompt card with shot/medium, subject, hint."
  },
  {
    key: "auditLog",
    label: "Audit Log",
    group: "System",
    core: false,
    intensity: "light",
    description: "Compact compiler and repair diagnostics.",
    schemaSummary: "system, marker, result, repaired, notes",
    compilerInstruction: "Log each compiler run: system name, identity marker, validation result, repair flag, and notes. Minimum verbosity.",
    injectionBehavior: "Not injected.",
    renderBehavior: "Continuity tab \u2014 audit log list."
  }
];
function control(track, display = track, inject = false) {
  return { track, display, inject };
}
var BALANCED_MODULE_SETTINGS = {
  sceneKernel: control(true, true, true),
  deltas: control(true, true, true),
  meters: control(true, true, false),
  castCore: control(true, true, true),
  castVisuals: control(true, true, false),
  clothing: control(true, true, false),
  relationships: control(true, true, true),
  inventory: control(true, true, true),
  worldSpace: control(true, true, true),
  storyThreads: control(true, true, true),
  continuity: control(true, true, true),
  secretsRumors: control(true, true, false),
  actionResolver: control(true, true, true),
  dialogueState: control(false, false, false),
  directorStyle: control(false, false, false),
  closenessState: control(false, false, false),
  imagePrompt: control(false, false, false),
  auditLog: control(true, true, false)
};
function cloneControls(source) {
  return Object.fromEntries(
    MODULE_KEYS.map((key) => [key, { ...source[key] }])
  );
}
function moduleSettingsForPreset(preset) {
  const next = cloneControls(BALANCED_MODULE_SETTINGS);
  if (preset === "balanced") return next;
  if (preset === "lite") {
    for (const key of MODULE_KEYS) {
      const isCore = CORE_TRACKING_MODULES.has(key);
      next[key] = control(isCore, isCore, isCore);
    }
    next.actionResolver = control(true, true, true);
    return next;
  }
  for (const key of MODULE_KEYS) {
    const experimental = [
      "dialogueState",
      "directorStyle",
      "closenessState",
      "imagePrompt"
    ].includes(key);
    const track = preset === "experimental" || !experimental;
    next[key] = control(track, track, track && key !== "auditLog");
  }
  return next;
}
function normalizeModuleSettings(input) {
  const next = cloneControls(BALANCED_MODULE_SETTINGS);
  for (const key of MODULE_KEYS) {
    const candidate = input?.[key];
    if (candidate) {
      next[key] = {
        track: typeof candidate.track === "boolean" ? candidate.track : next[key].track,
        display: typeof candidate.display === "boolean" ? candidate.display : next[key].display,
        inject: typeof candidate.inject === "boolean" ? candidate.inject : next[key].inject
      };
    }
    if (CORE_TRACKING_MODULES.has(key)) {
      next[key].track = true;
    }
  }
  return next;
}
function getEffectiveModuleCatalog(settings) {
  const overrides = settings?.stockModuleOverrides ?? {};
  return MODULE_CATALOG.map((module, index) => {
    const override = overrides[module.key];
    const compilerInstruction = override?.compilerGuidanceAddendum ? `${module.compilerInstruction} [Override: ${override.compilerGuidanceAddendum}]`.trim() : module.compilerInstruction;
    return {
      ...module,
      label: override?.label ?? module.label,
      description: override?.description ?? module.description,
      group: override?.group ?? module.group,
      compilerInstruction,
      icon: override?.icon ?? "",
      displayOrder: override?.displayOrder ?? index * 10,
      intensityLabel: override?.intensityLabel ?? module.intensity,
      hiddenFromSettings: override?.hiddenFromSettings ?? false,
      defaultControl: {
        ...BALANCED_MODULE_SETTINGS[module.key],
        display: override?.defaultDisplay ?? BALANCED_MODULE_SETTINGS[module.key].display,
        inject: override?.defaultInject ?? BALANCED_MODULE_SETTINGS[module.key].inject
      },
      overridden: Boolean(override && Object.keys(override).length > 0)
    };
  }).sort((a, b) => a.displayOrder - b.displayOrder || a.label.localeCompare(b.label));
}
var MODULE_SCHEMA_STRUCTURES = {
  sceneKernel: "kernel.scene, kernel.location, kernel.timeframe, kernel.date, kernel.time, kernel.elapsed, kernel.weather, kernel.pov, kernel.tone, kernel.topic, kernel.theme, kernel.objective, kernel.summary, kernel.currentFocus, kernel.nextFocus, kernel.currentRisk, kernel.stopMode, kernel.stopWhy, kernel.constraints[]",
  deltas: "delta.headline, delta.changedModules[], delta.changes[{text, age, module, importance}], delta.carriedForward[], delta.newlyEstablished[]",
  meters: "meters[{id(tension|danger|socialHeat|coherence|hiddenInfo|omen), label, value 0-100, pct, band, color, trend(down|steady|up|unknown), note}]",
  castCore: "castMatrix[{id, name, kind(pov|main|npc|crowd|background), qty, role, location, status, awareness(none|ambient|watching|alerted|hostile), threat{value 0-10, pct, band, color, note}, spotlight{value 0-100, pct, band, color, trend, note}, appearance{}, clothing{}, currentState{}, goals[], stableFacts[], pockets[], relationships[], leverage[], changed, changeNote, continuity{}}]",
  castVisuals: "castMatrix[].currentState{pose, proximity, leftHand, rightHand, emotion, intent, physicalTell, injury}, castMatrix[].spotlight, castMatrix[].visualAnchor",
  clothing: "castMatrix[].clothing{summary, silhouette, palette, fabric, fit, condition, notable, layerCount, layers[{slot(outer|upper|lower|feet|accessory|other), text, state, color}]}",
  relationships: "castMatrix[].relSummary, castMatrix[].relationships[{target, axis, value -100..100, pct, label, color, trend, evidence}]",
  inventory: "castMatrix[].pockets[{name, type(consumable|concealed|tool|key|evidence|misc), qty, condition, known, color, changed, changeNote}]",
  worldSpace: "scene{privacy, observerCount, observerPressure{}, crowdNoise, crowdFlow, light{primary, secondary, quality, color}, spatial[], access{exit, lineOfSight, noiseMask, items[], people[]}, carryover{body[], room[], social[]}, items[{name, owner, location, condition, lastTouch, importance}]}",
  storyThreads: "storyState{goals[{who, goal, status(ACTIVE|BLOCKED|PROGRESSED|RESOLVED), note}], conflicts[{a, b, label, severity 1-3}], threadLoom[{title, status, urgency 0-5, priority, progress 0-10, pct, color, label, summary, nextPressure, participants[]}], stakes[{who, win, lose}], countdowns[{title, left, unit, pct, color}], spotlightQueue[{name, turnsSince, pct, color, need, reason}], autonomyQueue[{who, action, unlessInterruptedBy}]}",
  continuity: "continuityFirewall{establishedFacts[], antiRetconAnchors[], pendingConsequences[{cause, pending, trigger, urgency 0-10, pct, status(PENDING|ACTIVE|FIRED|RESOLVED|DORMANT), evidence, changed, changeNote}], offscreenState[], bannedNext[{text, reason, scope(turn|scene|persistent), color, source(user|system|compiler)}], impossibleNext[], risks[{severity, issue, evidence, recommendation}], terms[{party, term, risk, status, binding, evidence, changed}]}",
  secretsRumors: "worldState.rumors[{rumor, source, credibility 0-10, pct, color}], worldState.secrets[{secret, visibleHint, knownBy[]}], worldState.loadedSigns[{thing, plantedBy, payoffWhen, state(LOADED|HEATING|FIRED|DORMANT), evidence, payoffHint, changed}]",
  actionResolver: "tools.actionResolver{userAction, worldResponse, risk, blockers[]}",
  dialogueState: "tools.dialogueState{openThread, socialMask, levers[], taboos[]}",
  directorStyle: "tools.directorStyle{primary, mask, push, voiceCues[]}",
  closenessState: "tools.closenessState{emotional, physical, consentSignals[], boundaries[]}",
  imagePrompt: "tools.imagePrompt{aspect, shot, medium, subject, positive, negative, full, hint}",
  auditLog: "auditLog[{system, marker, result, repaired, notes}]"
};

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever,
  ZodNull: () => ZodNull,
  ZodNullable: () => ZodNullable,
  ZodNumber: () => ZodNumber,
  ZodObject: () => ZodObject,
  ZodOptional: () => ZodOptional,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly,
  ZodRecord: () => ZodRecord,
  ZodSchema: () => ZodType,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion,
  ZodUnknown: () => ZodUnknown,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs(_arg) {
  }
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "bigint")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var en_default = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default ? void 0 : en_default
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString = class _ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString.create = (params) => {
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber = class _ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean = class extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown = class extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever = class extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray = class _ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject = class _ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue, ctx) => {
          const defaultError = this._def.errorMap?.(issue, ctx).message ?? ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion = class _ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection = class extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord = class _ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral = class extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum = class _ZodEnum extends ZodType {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum.create = createZodEnum;
var ZodNativeEnum = class extends ZodType {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");
var ZodBranded = class extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly = class extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// src/shared/schemas.ts
var LoomOSSkinSchema = external_exports.enum([
  "auto",
  "dark_academia",
  "cyberpunk",
  "fantasy",
  "horror",
  "noir",
  "minimal"
]);
var AutoGenerationModeSchema = external_exports.enum([
  "off",
  "assistant",
  "every",
  "manual"
]);
var ModulePresetSchema = external_exports.string();
var ModuleKeySchema = external_exports.enum(MODULE_KEYS);
var ModuleControlSchema = external_exports.object({
  track: external_exports.boolean(),
  display: external_exports.boolean(),
  inject: external_exports.boolean()
}).strict();
var ModuleSettingsSchema = external_exports.object(
  Object.fromEntries(
    MODULE_KEYS.map((key) => [key, ModuleControlSchema])
  )
).strict();
var CustomModulePresetSchema = external_exports.object({
  id: external_exports.string().min(1).max(160),
  name: external_exports.string().trim().min(1).max(160),
  description: external_exports.string().trim().max(500).default(""),
  createdAt: external_exports.string().datetime().default(() => (/* @__PURE__ */ new Date()).toISOString()),
  updatedAt: external_exports.string().datetime().default(() => (/* @__PURE__ */ new Date()).toISOString()),
  moduleSettings: ModuleSettingsSchema
}).strict();
var CustomModuleFieldTypeSchema = external_exports.enum([
  "text",
  "longText",
  "number",
  "boolean",
  "enum",
  "gauge",
  "chips",
  "list"
]);
var CustomModuleFieldSchema = external_exports.object({
  id: external_exports.string().min(1).max(160),
  label: external_exports.string().trim().min(1).max(160),
  key: external_exports.string().trim().regex(/^[A-Za-z][A-Za-z0-9_]*$/).max(80),
  type: CustomModuleFieldTypeSchema,
  required: external_exports.boolean().default(false),
  description: external_exports.string().trim().max(500).default(""),
  defaultValue: external_exports.unknown().optional(),
  enumOptions: external_exports.array(external_exports.string().trim().min(1).max(160)).max(30).default([]),
  maxItems: external_exports.number().int().min(1).max(50).optional(),
  min: external_exports.number().finite().optional(),
  max: external_exports.number().finite().optional(),
  displayHint: external_exports.string().trim().max(160).optional()
}).strict().superRefine((field, context) => {
  if (field.type === "enum" && field.enumOptions.length === 0) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["enumOptions"],
      message: "Enum fields require at least one option."
    });
  }
  if (field.min !== void 0 && field.max !== void 0 && field.min > field.max) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["min"],
      message: "Minimum cannot exceed maximum."
    });
  }
});
var CustomModuleSchema = external_exports.object({
  id: external_exports.string().min(1).max(160),
  label: external_exports.string().trim().min(1).max(160),
  group: external_exports.string().trim().min(1).max(160).default("Custom"),
  description: external_exports.string().trim().max(500).default(""),
  enabled: external_exports.boolean().default(true),
  display: external_exports.boolean().default(true),
  inject: external_exports.boolean().default(true),
  compilerInstruction: external_exports.string().trim().max(1600),
  outputMode: external_exports.enum(["cards", "bullets", "chips", "gauge", "template"]).default("cards"),
  maxItems: external_exports.number().int().min(1).max(24).default(6),
  intensity: external_exports.enum(["light", "medium", "heavy", "experimental"]).default("medium"),
  displayOrder: external_exports.number().int().optional(),
  schemaFields: external_exports.array(CustomModuleFieldSchema).max(40).default([]),
  htmlTemplate: external_exports.string().max(8e3).default(""),
  cssTemplate: external_exports.string().max(8e3).default(""),
  templateEngine: external_exports.enum(["mustache-lite", "token-replace"]).default("mustache-lite"),
  allowHtmlTemplate: external_exports.boolean().default(false)
}).strict();
var StateIdentitySchema = external_exports.object({
  chatId: external_exports.string().min(1).max(300),
  messageId: external_exports.string().min(1).max(300),
  swipeId: external_exports.number().int().nonnegative()
}).strict();
var StateHistoryItemSchema = external_exports.object({
  identity: StateIdentitySchema,
  generatedAt: external_exports.string(),
  schemaVersion: external_exports.number().int(),
  kernelScene: external_exports.string(),
  kernelFocus: external_exports.string(),
  kernelLocation: external_exports.string(),
  kernelTime: external_exports.string(),
  deltaHeadline: external_exports.string(),
  castCount: external_exports.number().int(),
  threadCount: external_exports.number().int(),
  riskCount: external_exports.number().int(),
  repaired: external_exports.boolean(),
  seedIdentity: StateIdentitySchema.nullable(),
  activeModuleCount: external_exports.number().int()
}).strict();
var RawSettingsSchema = external_exports.object({
  schemaVersion: external_exports.literal(2).default(2),
  skin: LoomOSSkinSchema.default("auto"),
  autoGeneration: AutoGenerationModeSchema.default("manual"),
  injectionEnabled: external_exports.boolean().default(false),
  showInjectionPreview: external_exports.boolean().default(false),
  injectionTokenBudget: external_exports.number().int().min(80).max(1600).default(320),
  compilerSeedTokenBudget: external_exports.number().int().min(200).max(2400).default(900),
  recentMessageLimit: external_exports.number().int().min(4).max(80).default(24),
  generationTimeoutSeconds: external_exports.number().int().min(30).max(300).default(180),
  connectionId: external_exports.string().trim().max(200).default(""),
  modulePreset: ModulePresetSchema.default("balanced"),
  moduleSettings: ModuleSettingsSchema.default(BALANCED_MODULE_SETTINGS),
  stockModuleOverrides: external_exports.record(
    external_exports.string(),
    external_exports.object({
      label: external_exports.string().max(160).optional(),
      description: external_exports.string().max(500).optional(),
      group: external_exports.string().max(160).optional(),
      icon: external_exports.string().max(20).optional(),
      displayOrder: external_exports.number().int().optional(),
      intensityLabel: external_exports.string().max(40).optional(),
      defaultDisplay: external_exports.boolean().optional(),
      defaultInject: external_exports.boolean().optional(),
      compilerGuidanceAddendum: external_exports.string().max(1e3).optional(),
      injectionPriority: external_exports.number().int().optional(),
      renderHint: external_exports.string().max(200).optional(),
      hiddenFromSettings: external_exports.boolean().optional()
    }).strict()
  ).default({}),
  customModulePresets: external_exports.array(CustomModulePresetSchema).default([]),
  customModules: external_exports.array(CustomModuleSchema).default([])
}).strict();
function settingsInput(value) {
  if (typeof value !== "object" || value === null) return value;
  const source = value;
  const legacyPanels = typeof source.panels === "object" && source.panels !== null ? source.panels : {};
  const suppliedModules = typeof source.moduleSettings === "object" && source.moduleSettings !== null ? source.moduleSettings : void 0;
  const moduleSettings = normalizeModuleSettings(suppliedModules);
  const panelMap = {
    kernel: "sceneKernel",
    castMatrix: "castCore",
    threadLoom: "storyThreads",
    continuityFirewall: "continuity"
  };
  for (const [oldKey, newKey] of Object.entries(panelMap)) {
    if (typeof legacyPanels[oldKey] === "boolean" && !suppliedModules?.[newKey]) {
      moduleSettings[newKey].display = legacyPanels[oldKey];
    }
  }
  for (const key of CORE_TRACKING_MODULES) {
    moduleSettings[key].track = true;
  }
  return {
    schemaVersion: 2,
    skin: source.skin,
    autoGeneration: source.autoGeneration,
    injectionEnabled: source.injectionEnabled,
    showInjectionPreview: source.showInjectionPreview,
    injectionTokenBudget: source.injectionTokenBudget,
    compilerSeedTokenBudget: source.compilerSeedTokenBudget,
    recentMessageLimit: source.recentMessageLimit,
    generationTimeoutSeconds: source.generationTimeoutSeconds,
    connectionId: source.connectionId,
    modulePreset: source.modulePreset,
    moduleSettings,
    stockModuleOverrides: source.stockModuleOverrides,
    customModulePresets: source.customModulePresets,
    customModules: source.customModules
  };
}
var LoomOSSettingsSchema = external_exports.preprocess(settingsInput, RawSettingsSchema);
var ShortText = external_exports.string().trim().max(500);
var MediumText = external_exports.string().trim().max(1600);
var TinyText = external_exports.string().trim().max(160);
var PercentText = external_exports.string().trim().max(12);
var ColorText = external_exports.string().trim().max(40);
var TrendSchema = external_exports.enum(["down", "steady", "up", "unknown"]);
var GaugeSchema = external_exports.object({
  value: external_exports.number().min(0).max(100),
  pct: PercentText,
  band: TinyText,
  color: ColorText,
  trend: TrendSchema,
  note: ShortText
}).strict();
var KernelSchema = external_exports.object({
  scene: ShortText,
  location: ShortText,
  timeframe: ShortText,
  date: ShortText,
  time: ShortText,
  elapsed: ShortText,
  weather: ShortText,
  pov: ShortText,
  tone: ShortText,
  topic: ShortText,
  theme: ShortText,
  objective: MediumText,
  summary: MediumText,
  currentFocus: MediumText,
  nextFocus: MediumText,
  currentRisk: MediumText,
  stopMode: ShortText,
  stopWhy: MediumText,
  constraints: external_exports.array(ShortText).max(12)
}).strict();
var DeltaSchema = external_exports.object({
  headline: MediumText,
  changedModules: external_exports.array(ModuleKeySchema).max(MODULE_KEYS.length),
  changes: external_exports.array(external_exports.object({
    text: MediumText,
    age: ShortText,
    module: ModuleKeySchema,
    importance: external_exports.enum(["low", "medium", "high", "critical"])
  }).strict()).max(6),
  carriedForward: external_exports.array(MediumText).max(6),
  newlyEstablished: external_exports.array(MediumText).max(6)
}).strict();
var MeterSchema = GaugeSchema.extend({
  id: external_exports.enum(["tension", "danger", "socialHeat", "coherence", "hiddenInfo", "omen"]),
  label: TinyText
}).strict();
var SceneItemSchema = external_exports.object({
  name: TinyText,
  owner: TinyText,
  location: ShortText,
  condition: ShortText,
  lastTouch: ShortText,
  importance: external_exports.enum(["low", "medium", "high", "critical"])
}).strict();
var SceneSchema = external_exports.object({
  privacy: external_exports.enum(["private", "semi-private", "public", "exposed"]),
  observerCount: external_exports.number().int().nonnegative().max(1e4),
  observerPressure: GaugeSchema.omit({ value: true }).extend({
    value: external_exports.number().min(0).max(10)
  }).strict(),
  crowdNoise: ShortText,
  crowdFlow: ShortText,
  light: external_exports.object({
    primary: ShortText,
    secondary: ShortText,
    quality: ShortText,
    color: ColorText
  }).strict(),
  spatial: external_exports.array(MediumText).max(8),
  access: external_exports.object({
    exit: external_exports.enum(["FREE", "WATCHED", "BLOCKED"]),
    lineOfSight: ShortText,
    noiseMask: ShortText,
    items: external_exports.array(ShortText).max(5),
    people: external_exports.array(ShortText).max(5)
  }).strict(),
  carryover: external_exports.object({
    body: external_exports.array(ShortText).max(5),
    room: external_exports.array(ShortText).max(5),
    social: external_exports.array(ShortText).max(5)
  }).strict(),
  items: external_exports.array(SceneItemSchema).max(10)
}).strict();
var PocketItemSchema = external_exports.object({
  name: TinyText,
  type: external_exports.enum(["consumable", "concealed", "tool", "key", "evidence", "misc"]).default("misc"),
  qty: external_exports.number().int().nonnegative().max(9999),
  condition: ShortText,
  known: external_exports.boolean(),
  color: ColorText.optional(),
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional()
}).strict();
var LayerSchema = external_exports.object({
  slot: external_exports.enum(["outer", "upper", "lower", "feet", "accessory", "other"]),
  text: ShortText,
  state: ShortText.optional(),
  color: ColorText.optional()
}).strict();
var RelationshipEntrySchema = external_exports.object({
  target: TinyText,
  axis: ShortText,
  value: external_exports.number().min(-100).max(100),
  pct: PercentText.optional(),
  label: TinyText.optional(),
  color: ColorText.optional(),
  trend: TrendSchema.optional(),
  evidence: MediumText.optional()
}).strict();
var UncertaintyEntrySchema = external_exports.object({
  claim: MediumText,
  confidence: external_exports.number().min(0).max(10),
  label: external_exports.enum(["UNKNOWN", "DOUBTFUL", "POSSIBLE", "LIKELY", "CONFIRMED"]).default("UNKNOWN"),
  handling: ShortText.optional()
}).strict();
var AppearanceSchema = external_exports.object({
  species: ShortText.optional(),
  ageBand: ShortText.optional(),
  genderPresentation: ShortText.optional(),
  height: ShortText.optional(),
  build: ShortText.optional(),
  skin: ShortText.optional(),
  face: ShortText.optional(),
  facialStructure: ShortText.optional(),
  hair: ShortText.optional(),
  eyes: ShortText.optional(),
  voice: ShortText.optional(),
  movement: ShortText.optional(),
  distinguishingMarks: MediumText.optional(),
  presence: ShortText.optional(),
  fullDescription: MediumText.optional(),
  anchor: MediumText.optional()
}).strict();
var ClothingSchema = external_exports.object({
  summary: ShortText.optional(),
  silhouette: ShortText.optional(),
  palette: ShortText.optional(),
  fabric: ShortText.optional(),
  fit: ShortText.optional(),
  condition: ShortText.optional(),
  notable: ShortText.optional(),
  layerCount: external_exports.number().int().min(0).max(5).optional().default(0),
  layers: external_exports.array(LayerSchema).max(5).optional().default([])
}).strict();
var CurrentStateSchema = external_exports.object({
  injury: ShortText.optional(),
  pose: ShortText.optional(),
  proximity: ShortText.optional(),
  leftHand: ShortText.optional(),
  rightHand: ShortText.optional(),
  emotion: ShortText.optional(),
  intent: MediumText.optional(),
  physicalTell: ShortText.optional(),
  socialPosition: ShortText.optional()
}).strict();
var CastContinuitySchema = external_exports.object({
  lastConfirmed: ShortText.optional(),
  sourceHint: ShortText.optional(),
  uncertainty: external_exports.array(UncertaintyEntrySchema).max(4).optional().default([])
}).strict();
var CastMemberSchema = external_exports.object({
  id: external_exports.string().trim().min(1).max(160),
  name: external_exports.string().trim().min(1).max(160),
  kind: external_exports.enum(["pov", "main", "npc", "crowd", "background"]),
  qty: external_exports.number().int().positive().max(1e4),
  role: ShortText,
  location: ShortText,
  status: ShortText,
  awareness: external_exports.enum(["none", "ambient", "watching", "alerted", "hostile"]),
  threat: GaugeSchema.omit({ value: true, trend: true }).extend({
    value: external_exports.number().min(0).max(10)
  }).strict(),
  spotlight: GaugeSchema,
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional(),
  appearance: AppearanceSchema.optional().default({}),
  clothing: ClothingSchema.optional().default({}),
  currentState: CurrentStateSchema.optional().default({}),
  emotionalState: ShortText.optional().default(""),
  intent: MediumText.optional().default(""),
  pose: ShortText.optional().default(""),
  proximity: ShortText.optional().default(""),
  hands: ShortText.optional().default(""),
  visualAnchor: MediumText.optional().default(""),
  identitySummary: MediumText.optional().default(""),
  clothingSummary: MediumText.optional().default(""),
  relSummary: ShortText.optional(),
  relationships: external_exports.array(RelationshipEntrySchema).max(6).optional().default([]),
  leverage: external_exports.array(ShortText).max(6).optional().default([]),
  pockets: external_exports.array(PocketItemSchema).max(6).optional().default([]),
  goals: external_exports.array(ShortText).max(6).optional().default([]),
  stableFacts: external_exports.array(ShortText).max(8).optional().default([]),
  continuity: CastContinuitySchema.optional().default({})
}).strict();
var SetupEntrySchema = external_exports.object({
  thing: ShortText,
  plantedBy: ShortText.optional(),
  payoffWhen: MediumText.optional(),
  state: external_exports.enum(["LOADED", "HEATING", "FIRED", "DORMANT"]).default("LOADED"),
  evidence: MediumText.optional(),
  payoffHint: ShortText.optional(),
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional()
}).strict();
var WorldStateSchema = external_exports.object({
  recentEnvironmentalChanges: external_exports.array(MediumText).max(6),
  activeHazards: external_exports.array(MediumText).max(6),
  rumors: external_exports.array(external_exports.object({
    rumor: MediumText,
    source: ShortText,
    credibility: external_exports.number().min(0).max(10),
    pct: PercentText,
    color: ColorText
  }).strict()).max(8),
  secrets: external_exports.array(external_exports.object({
    secret: MediumText,
    visibleHint: MediumText,
    knownBy: external_exports.array(TinyText).max(6)
  }).strict()).max(8),
  loadedSigns: external_exports.array(SetupEntrySchema).max(8).optional().default([])
}).strict();
var StoryThreadSchema = external_exports.object({
  title: external_exports.string().trim().min(1).max(240),
  status: external_exports.enum(["dormant", "active", "escalating", "blocked", "resolved"]),
  urgency: external_exports.number().int().min(0).max(5),
  priority: external_exports.enum(["low", "medium", "high", "critical"]),
  progress: external_exports.number().min(0).max(10),
  pct: PercentText,
  color: ColorText,
  label: TinyText,
  summary: MediumText,
  nextPressure: MediumText,
  participants: external_exports.array(TinyText).max(12)
}).strict();
var SpotlightQueueEntrySchema = external_exports.object({
  name: TinyText,
  turnsSince: external_exports.number().int().nonnegative().default(0),
  pct: PercentText.optional(),
  color: ColorText.optional(),
  need: external_exports.enum(["active", "soon", "okay", "quiet", "background"]).default("okay"),
  reason: ShortText.optional()
}).strict();
var StoryStateSchema = external_exports.object({
  goals: external_exports.array(external_exports.object({
    who: TinyText,
    goal: MediumText,
    status: external_exports.enum(["ACTIVE", "BLOCKED", "PROGRESSED", "RESOLVED"]),
    note: MediumText
  }).strict()).max(10),
  conflicts: external_exports.array(external_exports.object({
    a: TinyText,
    b: TinyText,
    label: ShortText,
    severity: external_exports.number().int().min(1).max(3)
  }).strict()).max(8),
  threadLoom: external_exports.array(StoryThreadSchema).max(24),
  stakes: external_exports.array(external_exports.object({
    who: TinyText,
    win: MediumText,
    lose: MediumText
  }).strict()).max(8),
  countdowns: external_exports.array(external_exports.object({
    title: ShortText,
    left: external_exports.number().nonnegative(),
    unit: TinyText,
    pct: PercentText,
    color: ColorText
  }).strict()).max(8),
  autonomyQueue: external_exports.array(external_exports.object({
    who: TinyText,
    action: MediumText,
    unlessInterruptedBy: MediumText
  }).strict()).max(8),
  spotlightQueue: external_exports.array(SpotlightQueueEntrySchema).max(12).optional().default([])
}).strict();
var ContinuityRiskSchema = external_exports.object({
  severity: external_exports.enum(["low", "medium", "high", "critical"]),
  issue: MediumText,
  evidence: MediumText,
  recommendation: MediumText
}).strict();
var AvoidNextSchema = external_exports.object({
  text: MediumText,
  reason: ShortText.optional(),
  scope: external_exports.enum(["turn", "scene", "persistent"]).default("turn"),
  color: ColorText.optional(),
  source: external_exports.enum(["user", "system", "compiler"]).default("compiler")
}).strict();
var ConsequenceEntrySchema = external_exports.object({
  cause: ShortText,
  pending: MediumText,
  trigger: ShortText.optional(),
  urgency: external_exports.number().min(0).max(10).default(5),
  pct: PercentText.optional(),
  status: external_exports.enum(["PENDING", "ACTIVE", "FIRED", "RESOLVED", "DORMANT"]).default("PENDING"),
  evidence: MediumText.optional(),
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional()
}).strict();
var TermEntrySchema = external_exports.object({
  party: TinyText,
  term: MediumText,
  risk: ShortText.optional(),
  status: external_exports.enum(["PENDING", "ACCEPTED", "REJECTED", "BROKEN", "EXPIRED", "UNKNOWN"]).default("UNKNOWN"),
  binding: external_exports.boolean().optional().default(false),
  evidence: MediumText.optional(),
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional()
}).strict();
var ContinuityFirewallSchema = external_exports.object({
  establishedFacts: external_exports.array(MediumText).max(40),
  antiRetconAnchors: external_exports.array(MediumText).max(30),
  pendingConsequences: external_exports.array(ConsequenceEntrySchema).max(30).optional().default([]),
  offscreenState: external_exports.array(MediumText).max(24),
  bannedNext: external_exports.array(AvoidNextSchema).max(12).optional().default([]),
  impossibleNext: external_exports.array(MediumText).max(12),
  risks: external_exports.array(ContinuityRiskSchema).max(24),
  terms: external_exports.array(TermEntrySchema).max(10).optional().default([])
}).strict();
var ToolsSchema = external_exports.object({
  actionResolver: external_exports.object({
    userAction: MediumText,
    worldResponse: MediumText,
    risk: MediumText,
    blockers: external_exports.array(ShortText).max(6)
  }).strict().nullable(),
  dialogueState: external_exports.object({
    openThread: MediumText,
    socialMask: MediumText,
    levers: external_exports.array(ShortText).max(6),
    taboos: external_exports.array(ShortText).max(6)
  }).strict().nullable(),
  directorStyle: external_exports.object({
    primary: ShortText,
    mask: ShortText,
    push: MediumText,
    voiceCues: external_exports.array(ShortText).max(6)
  }).strict().nullable(),
  closenessState: external_exports.object({
    emotional: ShortText,
    physical: ShortText,
    consentSignals: external_exports.array(ShortText).max(6),
    boundaries: external_exports.array(ShortText).max(6)
  }).strict().nullable(),
  imagePrompt: external_exports.object({
    aspect: TinyText,
    shot: ShortText,
    medium: ShortText,
    subject: MediumText,
    positive: MediumText,
    negative: MediumText,
    full: external_exports.string().trim().max(3e3),
    hint: MediumText
  }).strict().nullable()
}).strict();
var AuditEntrySchema = external_exports.object({
  system: TinyText,
  marker: TinyText,
  result: ShortText,
  repaired: external_exports.boolean(),
  notes: MediumText
}).strict();
var CustomModuleItemSchema = external_exports.object({
  title: ShortText,
  text: MediumText,
  importance: external_exports.enum(["low", "medium", "high", "critical"]),
  color: ColorText.optional(),
  changed: external_exports.boolean().optional().default(false),
  changeNote: ShortText.optional()
}).strict();
var CustomModuleDataSchema = external_exports.object({
  moduleId: external_exports.string().min(1).max(160),
  label: ShortText,
  summary: MediumText.default(""),
  fields: external_exports.record(external_exports.unknown()).default({}),
  items: external_exports.array(CustomModuleItemSchema).max(24).default([])
}).strict();
var LoomOSCompiledStateSchema = external_exports.object({
  activeModules: external_exports.array(ModuleKeySchema).max(MODULE_KEYS.length),
  kernel: KernelSchema,
  delta: DeltaSchema,
  meters: external_exports.array(MeterSchema).max(6).default([]),
  scene: SceneSchema.nullable().default(null),
  castMatrix: external_exports.array(CastMemberSchema).max(24),
  worldState: WorldStateSchema.nullable().default(null),
  storyState: StoryStateSchema,
  continuityFirewall: ContinuityFirewallSchema,
  tools: ToolsSchema.default({
    actionResolver: null,
    dialogueState: null,
    directorStyle: null,
    closenessState: null,
    imagePrompt: null
  }),
  auditLog: external_exports.array(AuditEntrySchema).max(12).default([]),
  customModuleData: external_exports.array(CustomModuleDataSchema).default([])
}).strict();
var LoomOSStateSchema = LoomOSCompiledStateSchema.extend({
  schemaVersion: external_exports.literal(2),
  identity: StateIdentitySchema,
  generatedAt: external_exports.string().datetime(),
  source: external_exports.object({
    messageCount: external_exports.number().int().nonnegative(),
    repaired: external_exports.boolean(),
    seedIdentity: StateIdentitySchema.nullable(),
    connectionId: external_exports.string().max(200)
  }).strict()
}).strict();
var LegacyLoomOSStateSchema = external_exports.object({
  schemaVersion: external_exports.literal(1),
  identity: StateIdentitySchema,
  generatedAt: external_exports.string().datetime(),
  source: external_exports.object({
    messageCount: external_exports.number().int().nonnegative(),
    repaired: external_exports.boolean()
  }).strict(),
  kernel: external_exports.object({
    scene: ShortText,
    location: ShortText,
    timeframe: ShortText,
    tone: ShortText,
    objective: MediumText,
    summary: MediumText,
    constraints: external_exports.array(ShortText).max(12)
  }).strict(),
  castMatrix: external_exports.array(external_exports.object({
    name: external_exports.string().trim().min(1).max(160),
    role: ShortText,
    status: ShortText,
    location: ShortText,
    emotionalState: ShortText,
    goals: external_exports.array(ShortText).max(8),
    relationships: external_exports.array(ShortText).max(10),
    leverage: external_exports.array(ShortText).max(8)
  }).strict()).max(24),
  threadLoom: external_exports.array(external_exports.object({
    title: external_exports.string().trim().min(1).max(240),
    status: external_exports.enum(["dormant", "active", "escalating", "blocked", "resolved"]),
    urgency: external_exports.number().int().min(0).max(5),
    summary: MediumText,
    nextPressure: MediumText,
    participants: external_exports.array(TinyText).max(12)
  }).strict()).max(24),
  continuityFirewall: external_exports.object({
    establishedFacts: external_exports.array(MediumText).max(30),
    pendingConsequences: external_exports.array(MediumText).max(24),
    secrets: external_exports.array(MediumText).max(24),
    risks: external_exports.array(ContinuityRiskSchema).max(24)
  }).strict()
}).strict();
var DEFAULT_SETTINGS = LoomOSSettingsSchema.parse({});

// src/shared/customModuleFactory.ts
function createCustomModuleFromStock(key, settings, id) {
  const module = getEffectiveModuleCatalog(settings).find((candidate) => candidate.key === key);
  if (!module) throw new Error(`Unknown stock module: ${key}`);
  const control2 = settings.moduleSettings[key];
  return CustomModuleSchema.parse({
    id,
    label: `${module.label} Custom`,
    group: module.group,
    description: module.description,
    enabled: control2.track,
    display: control2.display,
    inject: control2.inject,
    compilerInstruction: module.compilerInstruction,
    outputMode: "cards",
    maxItems: 6,
    intensity: module.intensityLabel === "experimental" ? "experimental" : "medium",
    displayOrder: module.displayOrder + 1e3,
    schemaFields: []
  });
}

// src/shared/customTemplates.ts
var STARTER_CUSTOM_HTML = `<div class="cmod-card">
  <div class="cmod-title">{{label}}</div>
  <div class="cmod-summary">{{summary}}</div>
  <div class="cmod-items">
    {{#items}}
    <div class="cmod-item cmod-{{importance}}">
      <strong>{{title}}</strong>
      <p>{{text}}</p>
    </div>
    {{/items}}
  </div>
</div>`;
var STARTER_CUSTOM_CSS = `.cmod-card {
  border: 1px solid rgba(159,212,232,.22);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255,255,255,.04);
}
.cmod-title {
  font-weight: 900;
  text-transform: uppercase;
}
.cmod-item {
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(255,255,255,.04);
}`;
var BLOCKED_PAIRED_TAGS = /<(script|iframe|object|embed|form)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
var BLOCKED_SINGLE_TAGS = /<\/?(script|iframe|object|embed|link|meta|base|form)\b[^>]*>/gi;
var EVENT_ATTRIBUTES = /\s+on[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
var STYLE_ATTRIBUTES = /\s+style\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
var URL_ATTRIBUTES = /\s+(href|src|xlink:href|action|formaction)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi;
function escapeTemplateData(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function safeCustomModuleId(moduleId) {
  const safe = moduleId.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return (safe || "module").slice(0, 80);
}
function sanitizeCustomHtml(template) {
  return template.slice(0, 8e3).replace(BLOCKED_PAIRED_TAGS, "").replace(BLOCKED_SINGLE_TAGS, "").replace(EVENT_ATTRIBUTES, "").replace(STYLE_ATTRIBUTES, "").replace(URL_ATTRIBUTES, "").replace(/javascript\s*:/gi, "");
}
function sanitizeCustomCss(css) {
  return css.slice(0, 8e3).replace(/@import\b[^;]*;?/gi, "").replace(/url\s*\(\s*(['"]?)(?:https?:|data:|javascript:|\/\/)[\s\S]*?\1\s*\)/gi, "none").replace(/expression\s*\([^)]*\)/gi, "").replace(/behavior\s*:[^;}]*/gi, "").replace(/-moz-binding\s*:[^;}]*/gi, "").replace(/position\s*:\s*(?:fixed|sticky)\b/gi, "position: static").replace(/z-index\s*:[^;}]*/gi, "").replace(/<\/?style\b[^>]*>/gi, "");
}
function scopeSelectorList(selectorText, scope) {
  return selectorText.split(",").map((selector) => selector.trim()).filter(Boolean).map((selector) => {
    if (selector.startsWith(scope)) return selector;
    if (selector === ":root" || selector === "html" || selector === "body") return scope;
    return `${scope} ${selector}`;
  }).join(", ");
}
function scopeCustomCss(css, moduleId) {
  const scope = `.loomos-cmod-${safeCustomModuleId(moduleId)}`;
  const sanitized = sanitizeCustomCss(css);
  const rules = [];
  const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
  let match;
  while ((match = rulePattern.exec(sanitized)) !== null) {
    const selectors = match[1].trim();
    const declarations = match[2].trim();
    if (!selectors || selectors.startsWith("@") || !declarations) continue;
    rules.push(`${scopeSelectorList(selectors, scope)} {
${declarations}
}`);
  }
  return rules.join("\n");
}
function scalarFieldValue(data, key) {
  const value = data.fields?.[key];
  if (Array.isArray(value)) return value.map((item) => String(item)).join(", ");
  if (value && typeof value === "object") {
    const gauge = value;
    if (typeof gauge.pct === "string") return gauge.pct;
    if (typeof gauge.value === "number") return String(gauge.value);
    return JSON.stringify(value);
  }
  return String(value ?? "");
}
function replaceCommonTokens(template, module, data) {
  return template.replaceAll("{{label}}", escapeTemplateData(module.label)).replaceAll("{{summary}}", escapeTemplateData(data.summary)).replace(
    /\{\{fields\.([A-Za-z][A-Za-z0-9_]*)\}\}/g,
    (_match, key) => escapeTemplateData(scalarFieldValue(data, key))
  );
}
function renderCustomTemplate(module, data) {
  const wrapperClass = `loomos-cmod-${safeCustomModuleId(module.id)}`;
  const source = sanitizeCustomHtml(module.htmlTemplate || STARTER_CUSTOM_HTML);
  const withItems = source.replace(
    /\{\{#items\}\}([\s\S]*?)\{\{\/items\}\}/g,
    (_match, block) => data.items.slice(0, module.maxItems).map(
      (item) => block.replaceAll("{{title}}", escapeTemplateData(item.title)).replaceAll("{{text}}", escapeTemplateData(item.text)).replaceAll("{{importance}}", escapeTemplateData(item.importance)).replaceAll("{{color}}", escapeTemplateData(item.color ?? ""))
    ).join("")
  );
  const html = replaceCommonTokens(withItems, module, data).replace(/\{\{[^{}]+\}\}/g, "");
  const css = scopeCustomCss(module.cssTemplate || STARTER_CUSTOM_CSS, module.id);
  return { html, css, wrapperClass };
}
function customModuleExpectedShape(module) {
  const fields = Object.fromEntries(module.schemaFields.map((field) => {
    let example = field.defaultValue;
    if (example === void 0) {
      if (field.type === "number") example = field.min ?? 0;
      else if (field.type === "boolean") example = false;
      else if (field.type === "enum") example = field.enumOptions[0] ?? "";
      else if (field.type === "gauge") {
        example = {
          value: field.min ?? 0,
          pct: "0%",
          band: "unknown",
          color: "var(--loomos-muted)",
          trend: "unknown",
          note: ""
        };
      } else if (field.type === "chips" || field.type === "list") example = [];
      else example = "";
    }
    return [field.key, example];
  }));
  return {
    moduleId: module.id,
    label: module.label,
    summary: "",
    fields,
    items: [{
      title: "",
      text: "",
      importance: "medium",
      changed: false
    }]
  };
}

// src/frontend/render.ts
function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function visible(settings, key) {
  return settings.moduleSettings[key].display;
}
function chips(items, empty = "None recorded") {
  if (items.length === 0) return `<span class="loomos-muted">${escapeHtml(empty)}</span>`;
  return `<div class="loomos-chip-row">${items.map(
    (item) => `<span class="loomos-chip" title="${escapeHtml(item)}">${escapeHtml(item)}</span>`
  ).join("")}</div>`;
}
function clampProse(text, maxLength = 140) {
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
function section(key, title, summary, body, open = false) {
  return `
    <details class="loomos-section" data-section="${escapeHtml(key)}"${open ? " open" : ""}>
      <summary>
        <span>${escapeHtml(title)}</span>
        <small>${escapeHtml(summary)}</small>
      </summary>
      <div class="loomos-section-body">${body}</div>
    </details>`;
}
function renderKernel(state) {
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
  `, true);
}
function renderDelta(state) {
  const delta = state.delta;
  return section("delta", "Delta", delta.headline || "No major change", `
    <div class="loomos-callout">${clampProse(delta.headline, 140)}</div>
    <div class="loomos-list">
      ${delta.changes.length === 0 ? `<p class="loomos-muted">No meaningful changes recorded.</p>` : delta.changes.map((change) => `
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
  `, true);
}
function renderMeters(state) {
  return section("meters", "Meters", `${state.meters.length} diagnostics`, `
    <div class="loomos-meter-grid">
      ${state.meters.length === 0 ? `<p class="loomos-muted">No meter evidence in this state.</p>` : state.meters.map((meter) => {
    const trendIcon = {
      up: "\u{1F4C8}",
      down: "\u{1F4C9}",
      steady: "\u27A1\uFE0F",
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
  `);
}
function renderCast(state, settings) {
  return section("cast", "Cast Matrix", `${state.castMatrix.length} tracked`, `
    <div class="loomos-list">
      ${state.castMatrix.length === 0 ? `<p class="loomos-muted">No cast evidence in this state.</p>` : state.castMatrix.map((member) => {
    const hasExtra = member.pose || member.proximity || member.hands || member.visualAnchor || visible(settings, "clothing") && member.clothingSummary || member.goals.length > 0 || visible(settings, "relationships") && member.relationships.length > 0 || visible(settings, "inventory") && member.pockets.length > 0 || member.stableFacts.length > 0;
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
                  <span class="loomos-chip">\u{1F4CD} ${escapeHtml(member.location)}</span>
                  <span class="loomos-chip">\u{1F3AD} ${escapeHtml(member.emotionalState)}</span>
                  <span class="loomos-chip">\u26A0\uFE0F Threat: ${escapeHtml(member.threat.pct)}</span>
                </div>
                <p><strong>Intent:</strong> ${clampProse(member.intent, 100)}</p>
                <p><strong>Status:</strong> ${clampProse(member.status, 100)}</p>
                
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
                      ${visible(settings, "inventory") && member.pockets.length > 0 ? `<div class="loomos-subhead">Pockets</div>${chips(member.pockets.map((item) => `${item.name} x${item.qty}${item.known ? "" : " (unknown)"}`))}` : ""}
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
function renderWorld(state, settings) {
  const scene = state.scene;
  const world = state.worldState;
  const itemCount = scene?.items.length ?? 0;
  return section("world", "World & Space", `${itemCount} scene items`, `
    ${scene ? `<dl class="loomos-facts">
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
    ...scene.carryover.social
  ])}
        ${visible(settings, "inventory") ? `<div class="loomos-subhead">Scene items</div>${chips(scene.items.map(
    (item) => `${item.name}: ${item.location}; ${item.condition}`
  ))}` : ""}` : `<p class="loomos-muted">World and space tracking was not active for this snapshot.</p>`}
    ${world ? `<div class="loomos-two-column">
          <div><div class="loomos-subhead">Environmental changes</div>${chips(world.recentEnvironmentalChanges)}</div>
          <div><div class="loomos-subhead">Hazards</div>${chips(world.activeHazards)}</div>
        </div>
        ${visible(settings, "secretsRumors") ? `<div class="loomos-two-column">
              <div><div class="loomos-subhead">Rumors</div>${chips(world.rumors.map(
    (item) => `${item.rumor} (${item.credibility}/10)`
  ))}</div>
              <div><div class="loomos-subhead">Loaded signs</div>${chips(world.loadedSigns.map(
    (item) => `${item.thing}: ${item.state}`
  ))}</div>
            </div>` : ""}` : ""}
  `);
}
function renderStory(state) {
  const story = state.storyState;
  const live = story.threadLoom.filter((thread) => thread.status !== "resolved");
  return section("story", "Thread Loom", `${live.length} live threads`, `
    <div class="loomos-list">
      ${story.threadLoom.length === 0 ? `<p class="loomos-muted">No story threads recorded.</p>` : story.threadLoom.map((thread) => `
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
      <div><div class="loomos-subhead">Goals</div>${chips(story.goals.map(
    (goal) => `${goal.who}: ${goal.goal} [${goal.status}]`
  ))}</div>
      <div><div class="loomos-subhead">Stakes</div>${chips(story.stakes.map(
    (stake) => `${stake.who}: ${stake.win} / ${stake.lose}`
  ))}</div>
      <div><div class="loomos-subhead">Countdowns</div>${chips(story.countdowns.map(
    (item) => `${item.title}: ${item.left} ${item.unit}`
  ))}</div>
      <div><div class="loomos-subhead">Autonomy queue</div>${chips(story.autonomyQueue.map(
    (item) => `${item.who}: ${item.action}`
  ))}</div>
    </div>
  `, true);
}
function renderContinuity(state) {
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
  const riskCards = firewall.risks.length === 0 ? `<div class="loomos-continuity-safe"><strong>\u2705 No continuity conflicts detected.</strong> The current state is consistent with all established facts and anchors.</div>` : `<div class="loomos-continuity-risks">${firewall.risks.map((risk) => `
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
  `, true);
}
function renderTools(state, settings) {
  const tools = state.tools;
  const blocks = [];
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
  return blocks.length === 0 ? "" : section("tools", "Tools", `${blocks.length} active`, `<div class="loomos-card-grid">${blocks.join("")}</div>`);
}
function renderAudit(state) {
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
  `);
}
function renderOverviewCard(state, settings) {
  const deltaHeadline = state.delta?.headline || "No major changes";
  const location = state.kernel?.location || "Unknown location";
  const time = state.kernel?.timeframe || state.kernel?.time || "Unknown time";
  const activeCastCount = state.castMatrix?.filter((c) => c.kind === "pov" || c.kind === "main" || c.kind === "npc").length ?? 0;
  const threadCount = state.storyState?.threadLoom?.filter((t) => t.status !== "resolved").length ?? 0;
  const riskCount = state.continuityFirewall?.risks?.length ?? 0;
  const injectionStatus = settings.injectionEnabled ? "Enabled" : "Disabled";
  return `
    <div class="loomos-shell loomos-overview-card">
      <div class="loomos-kicker">Overview</div>
      <div class="loomos-overview-headline">${clampProse(deltaHeadline, 140)}</div>
      <div class="loomos-overview-details">
        <div><strong>Location:</strong> <span>${escapeHtml(location)} \xB7 ${escapeHtml(time)}</span></div>
        <div class="loomos-overview-stats">
          <span>\u{1F465} ${activeCastCount} Cast</span>
          <span>\u{1F9F5} ${threadCount} Threads</span>
          <span>\u26A0\uFE0F ${riskCount} Risks</span>
          <span>\u{1F4E6} ${state.activeModules.length} Modules</span>
          <span class="loomos-overview-inject-${settings.injectionEnabled ? "active" : "inactive"}">\u{1F489} Inject: ${injectionStatus}</span>
        </div>
      </div>
    </div>
  `;
}
function renderCustomModules(state, settings) {
  const customMods = settings.customModules || [];
  const results = [];
  for (const cm of customMods) {
    if (!cm.display) continue;
    const compiled = state.customModuleData?.find((m) => m.moduleId === cm.id);
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
      const fieldsHtml = fieldEntries.length > 0 ? `<dl class="loomos-custom-fields">${fieldEntries.map(([key, value]) => `
            <div>
              <dt>${escapeHtml(cm.schemaFields.find((field) => field.key === key)?.label ?? key)}</dt>
              <dd>${escapeHtml(
        Array.isArray(value) ? value.join(", ") : typeof value === "object" ? JSON.stringify(value) : value
      )}</dd>
            </div>
          `).join("")}</dl>` : "";
      if (cm.outputMode === "bullets") {
        body = `${fieldsHtml}
          <ul class="loomos-bullet-list">
            ${compiled.items.map((it) => `
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
            ${compiled.items.map((it) => `
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
            ${compiled.items.map((it) => {
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
            ${compiled.items.map((it) => `
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
function renderDashboard(state, settings, activeTab = "overview") {
  if (activeTab === "overview") {
    const overview = renderOverviewCard(state, settings);
    const sections = [
      visible(settings, "sceneKernel") ? renderKernel(state) : "",
      visible(settings, "deltas") ? renderDelta(state) : "",
      visible(settings, "meters") ? renderMeters(state) : "",
      renderTools(state, settings),
      ...renderCustomModules(state, settings)
    ].filter(Boolean);
    return sections.length > 0 ? `<div class="loomos-dashboard">${overview}${sections.join("")}</div>` : `<div class="loomos-dashboard">${overview}<div class="loomos-empty"><h3>All overview display modules are hidden</h3><p>Enable display for Kernel, Deltas, Meters, or Tools in the Settings tab.</p></div></div>`;
  }
  if (activeTab === "cast") {
    const sections = [
      visible(settings, "castCore") ? renderCast(state, settings) : ""
    ].filter(Boolean);
    return sections.length > 0 ? `<div class="loomos-dashboard">${sections.join("")}</div>` : `<div class="loomos-empty"><h3>Cast Core display is hidden</h3><p>Enable Cast Core display in settings.</p></div>`;
  }
  if (activeTab === "world") {
    const sections = [
      visible(settings, "worldSpace") || visible(settings, "secretsRumors") ? renderWorld(state, settings) : ""
    ].filter(Boolean);
    return sections.length > 0 ? `<div class="loomos-dashboard">${sections.join("")}</div>` : `<div class="loomos-empty"><h3>World modules are hidden</h3><p>Enable World & Space or Secrets & Rumors display in settings.</p></div>`;
  }
  if (activeTab === "story") {
    const sections = [
      visible(settings, "storyThreads") ? renderStory(state) : ""
    ].filter(Boolean);
    return sections.length > 0 ? `<div class="loomos-dashboard">${sections.join("")}</div>` : `<div class="loomos-empty"><h3>Story threads display is hidden</h3><p>Enable Story Threads display in settings.</p></div>`;
  }
  if (activeTab === "continuity") {
    const sections = [
      visible(settings, "continuity") ? renderContinuity(state) : "",
      visible(settings, "auditLog") ? renderAudit(state) : ""
    ].filter(Boolean);
    return sections.length > 0 ? `<div class="loomos-dashboard">${sections.join("")}</div>` : `<div class="loomos-empty"><h3>Continuity and Audit display are hidden</h3><p>Enable Continuity Firewall or Audit Log display in settings.</p></div>`;
  }
  return "";
}
function renderHistoryTab(items, filter, activeIdentity) {
  const filtered = filter ? items.filter(
    (item) => [item.kernelScene, item.kernelFocus, item.kernelLocation, item.deltaHeadline, item.identity.messageId].some((v) => v.toLowerCase().includes(filter.toLowerCase()))
  ) : items;
  return `
    <div class="loomos-history-tab">
      <div class="loomos-history-explainer">
        <p>The <strong>State History Timeline</strong> shows every state snapshot generated for this chat.
        Click any entry to load that state for inspection. Use the search bar to filter by scene, focus, or location.</p>
      </div>
      <div class="loomos-search-bar">
        <input class="loomos-input" type="text" placeholder="Filter history..." 
          data-loomos-action="filter-history" value="${escapeHtml(filter)}" />
        ${filter ? `<button class="loomos-button-clear" data-loomos-action="clear-history-filter">&times;</button>` : ""}
        <span class="loomos-search-count">${filtered.length} / ${items.length}</span>
      </div>
      ${filtered.length === 0 ? `<div class="loomos-empty"><h3>No matching history entries</h3><p>Try a different search term.</p></div>` : `<div class="loomos-history-list">${filtered.map((item) => {
    const isActive = activeIdentity?.chatId === item.identity.chatId && activeIdentity?.messageId === item.identity.messageId && activeIdentity?.swipeId === item.identity.swipeId;
    const repaired = item.repaired ? "\u{1F6E0}\uFE0F" : "";
    return `
              <article class="loomos-history-entry${isActive ? " loomos-history-active" : ""}">
                <div class="loomos-history-entry-main">
                  <div class="loomos-history-entry-header">
                    <strong>${escapeHtml(item.kernelScene || "N/A")}</strong>
                    <span class="loomos-badge">${escapeHtml(item.generatedAt)}</span>
                    ${repaired ? `<span class="loomos-badge" style="border-color:#d58a42;color:#d58a42;">repaired</span>` : ""}
                  </div>
                  <p class="loomos-history-entry-focus">${clampProse(item.kernelFocus, 100)}</p>
                  <div class="loomos-history-entry-meta">
                    <span>\u{1F4CD} ${escapeHtml(item.kernelLocation)}</span>
                    <span>\u{1F550} ${escapeHtml(item.kernelTime)}</span>
                    <span>\u{1F465} ${item.castCount}</span>
                    <span>\u{1F9F5} ${item.threadCount}</span>
                    <span>\u26A0\uFE0F ${item.riskCount}</span>
                  </div>
                  <p class="loomos-history-entry-delta">${clampProse(item.deltaHeadline, 120)}</p>
                </div>
                <div class="loomos-history-entry-actions">
                  <button class="loomos-button loomos-btn-sm" data-loomos-action="load-history-state" 
                    data-message-id="${escapeHtml(item.identity.messageId)}" data-swipe-id="${item.identity.swipeId}">
                    ${isActive ? "Current" : "Load"}
                  </button>
                  <button class="loomos-button loomos-button-danger loomos-btn-sm" data-loomos-action="delete-history-state"
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
function renderInjectionPreview(preview) {
  return `
    <div class="loomos-injection-preview">
      <div class="loomos-injection-preview-header">
        <span class="loomos-kicker">Injection Preview</span>
        <span class="loomos-badge ${preview.withinBudget ? "loomos-badge-ok" : "loomos-badge-over"}">
          ${preview.estimatedTokens} / ${preview.budget} tokens
        </span>
      </div>
      ${preview.warning ? `<div class="loomos-injection-preview-warning">\u26A0\uFE0F ${escapeHtml(preview.warning)}</div>` : ""}
      <div class="loomos-injection-preview-meta">
        ${preview.includedModules.length > 0 ? `<div class="loomos-injection-preview-modules">
              <span class="loomos-subhead">Included modules</span>
              <div class="loomos-chip-row">${preview.includedModules.map(
    (m) => `<span class="loomos-chip">${escapeHtml(m)}</span>`
  ).join("")}</div>
            </div>` : ""}
        ${preview.omittedModules.length > 0 ? `<div class="loomos-injection-preview-modules">
              <span class="loomos-subhead">Omitted modules</span>
              <div class="loomos-chip-row">${preview.omittedModules.map(
    (m) => `<span class="loomos-chip">${escapeHtml(m)}</span>`
  ).join("")}</div>
            </div>` : ""}
        <div class="loomos-injection-preview-tokenbar">
          <div class="loomos-meter-track">
            <i style="width:${Math.min(100, preview.estimatedTokens / Math.max(1, preview.budget) * 100)}%;
              ${preview.withinBudget ? "background:var(--loomos-accent)" : "background:#df5259"}"></i>
          </div>
          <span>${Math.round(preview.estimatedTokens / Math.max(1, preview.budget) * 100)}% of budget</span>
        </div>
      </div>
      <details class="loomos-cast-extra">
        <summary>Preview text (${preview.text.length} chars)</summary>
        <div class="loomos-cast-extra-body">
          <pre class="loomos-injection-preview-text">${escapeHtml(preview.text)}</pre>
          <button class="loomos-button loomos-btn-sm" data-loomos-action="copy-injection-preview">Copy</button>
        </div>
      </details>
    </div>
  `;
}
function renderWhatChangedModal(state) {
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
          ${delta.changes.length === 0 ? `<p class="loomos-muted">No changes recorded.</p>` : delta.changes.map((change) => `
              <div class="loomos-what-changed-change loomos-importance-${change.importance}">
                <div class="loomos-what-changed-change-icon">+</div>
                <div class="loomos-what-changed-change-body">
                  <strong>${clampProse(change.text, 140)}</strong>
                  <span class="loomos-what-changed-change-meta">
                    ${escapeHtml(change.module)} \xB7 ${escapeHtml(change.age)} \xB7 ${escapeHtml(change.importance)}
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

// src/frontend/styles.ts
var LOOMOS_STYLES = `
  .loomos-root {
    --loomos-bg: var(--lumiverse-fill-subtle, #17181d);
    --loomos-panel: var(--lumiverse-fill, #202127);
    --loomos-ink: var(--lumiverse-text, #f5f5f5);
    --loomos-muted: var(--lumiverse-text-muted, #aaa);
    --loomos-accent: var(--lumiverse-accent, #7c6cff);
    --loomos-border: var(--lumiverse-border, #3a3b43);
    box-sizing: border-box;
    color: var(--loomos-ink);
    display: grid;
    font-size: 13px;
    gap: 10px;
    line-height: 1.45;
    padding: 10px;
    max-width: calc(100vw - 16px);
    width: 100%;
    overflow-x: hidden;
    overflow-wrap: anywhere;
    word-break: break-word;
    padding-bottom: 72px !important;
  }
  .loomos-root[data-view="modal"] {
    max-width: calc(100vw - 16px);
    width: 100%;
    min-width: 0;
  }
  .loomos-root *, .loomos-root *::before, .loomos-root *::after {
    box-sizing: border-box;
    min-width: 0;
    max-width: 100%;
  }
  .loomos-root button, .loomos-root select, .loomos-root input, .loomos-root textarea {
    max-width: 100%;
    min-width: 0;
  }
  .loomos-root textarea {
    word-break: break-word;
    white-space: pre-wrap;
  }
  .loomos-root[data-skin="dark_academia"] { --loomos-bg:#17130f;--loomos-panel:#241d16;--loomos-ink:#ead9b7;--loomos-muted:#af9c78;--loomos-accent:#ba8b43;--loomos-border:#493a28; }
  .loomos-root[data-skin="cyberpunk"] { --loomos-bg:#090b18;--loomos-panel:#10152a;--loomos-ink:#e9faff;--loomos-muted:#8ea5c8;--loomos-accent:#25f2d0;--loomos-border:#304369; }
  .loomos-root[data-skin="fantasy"] { --loomos-bg:#111b17;--loomos-panel:#192821;--loomos-ink:#ecf1d0;--loomos-muted:#a9b995;--loomos-accent:#d4ad57;--loomos-border:#3f594b; }
  .loomos-root[data-skin="horror"] { --loomos-bg:#130b0c;--loomos-panel:#211012;--loomos-ink:#f0d8d8;--loomos-muted:#b68e91;--loomos-accent:#d24c52;--loomos-border:#51252a; }
  .loomos-root[data-skin="noir"] { --loomos-bg:#0d0d0d;--loomos-panel:#181818;--loomos-ink:#f0f0f0;--loomos-muted:#a4a4a4;--loomos-accent:#d7d7d7;--loomos-border:#3a3a3a; }
  .loomos-root[data-skin="minimal"] { --loomos-bg:#f5f5f4;--loomos-panel:#fff;--loomos-ink:#18181b;--loomos-muted:#71717a;--loomos-accent:#27272a;--loomos-border:#dededb; }
  
  .loomos-shell, .loomos-section {
    background: var(--loomos-bg);
    border: 1px solid var(--loomos-border);
    border-radius: 12px;
    min-width: 0;
    max-width: 100%;
  }
  .loomos-shell { padding: 10px; }
  .loomos-header {
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    flex-wrap: wrap;
    min-width: 0;
  }
  .loomos-title { display: grid; gap: 1px; min-width: 0; flex: 1; }
  .loomos-title strong { font-size: 15px; overflow-wrap: anywhere; }
  .loomos-title span, .loomos-muted, .loomos-row small, .loomos-card small { color: var(--loomos-muted); }
  .loomos-status, .loomos-badge {
    border: 1px solid var(--loomos-border);
    border-radius: 999px;
    color: var(--loomos-muted);
    font-size: 10px;
    padding: 3px 7px;
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  /* Sticky Header */
  .loomos-header-sticky {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--loomos-bg);
    border-bottom: 1px solid var(--loomos-border);
    margin: -10px -10px 10px -10px;
    padding: 10px 10px 6px 10px;
    border-radius: 0;
  }

  .loomos-header-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 8px;
    width: 100%;
  }
  .loomos-header-actions button {
    flex: 1 1 auto;
    font-size: 11px;
    min-width: 80px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .loomos-button, .loomos-select, .loomos-input {
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 8px;
    color: var(--loomos-ink);
    min-height: 34px;
    padding: 6px 9px;
    max-width: 100%;
    min-width: 0;
  }
  .loomos-button { cursor: pointer; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; text-align: center; }
  .loomos-button:hover, .loomos-button:focus-visible, .loomos-select:focus-visible, .loomos-input:focus-visible {
    border-color: var(--loomos-accent);
    outline: 2px solid color-mix(in srgb, var(--loomos-accent) 35%, transparent);
    outline-offset: 1px;
  }
  .loomos-button-primary { background: var(--loomos-accent); color: var(--lumiverse-accent-fg, #fff); }
  .loomos-button-danger { color: #e56b70; }
  .loomos-button:disabled, .loomos-input:disabled { cursor: not-allowed; opacity: .48; }

  /* Tabs Layout */
  .loomos-tabs-nav {
    display: flex;
    gap: 4px;
    overflow-x: auto;
    margin-top: 10px;
    padding-bottom: 2px;
    -webkit-overflow-scrolling: touch;
    width: 100%;
  }
  .loomos-tabs-nav::-webkit-scrollbar {
    display: none;
  }
  .loomos-tab-btn {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: var(--loomos-muted);
    cursor: pointer;
    font-size: 11px;
    font-weight: 700;
    padding: 6px 10px;
    white-space: nowrap;
    transition: all 0.15s ease;
  }
  .loomos-tab-btn:hover {
    color: var(--loomos-ink);
  }
  .loomos-tab-btn.active {
    border-bottom-color: var(--loomos-accent);
    color: var(--loomos-accent);
  }
  .loomos-tab-pane {
    width: 100%;
    min-width: 0;
  }

  .loomos-section > summary {
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    padding: 10px;
    cursor: pointer;
    font-weight: 800;
    list-style: none;
  }
  .loomos-section > summary::-webkit-details-marker { display: none; }
  .loomos-section > summary small { 
    color: var(--loomos-muted); 
    font-weight: 500; 
    max-width: 62%; 
    overflow: hidden; 
    text-overflow: ellipsis; 
    white-space: nowrap; 
  }
  .loomos-section[open] > summary { border-bottom: 1px solid var(--loomos-border); }
  .loomos-section-body { background: var(--loomos-panel); border-radius: 0 0 11px 11px; padding: 10px; min-width: 0; }
  
  .loomos-dashboard { display: grid; gap: 9px; min-width: 0; }
  .loomos-settings-grid, .loomos-two-column, .loomos-facts {
    display: grid;
    gap: 9px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    min-width: 0;
  }
  .loomos-settings-grid { margin-top: 10px; }
  .loomos-field { display: grid; gap: 4px; min-width: 0; max-width: 100%; }
  .loomos-field > span, .loomos-subhead { color: var(--loomos-muted); font-size: 10px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
  .loomos-check { align-items: center; display: flex; gap: 7px; min-height: 34px; cursor: pointer; }
  
  .loomos-kicker { color: var(--loomos-accent); display: block; font-size: 9px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
  .loomos-hero { display: grid; gap: 3px; min-width: 0; }
  .loomos-hero strong { font-size: 15px; overflow-wrap: anywhere; }
  .loomos-hero p, .loomos-card p, .loomos-row p { margin: 5px 0; overflow-wrap: anywhere; }
  
  .loomos-facts { margin: 9px 0; }
  .loomos-facts div { border-top: 1px solid var(--loomos-border); min-width: 0; padding-top: 5px; }
  .loomos-facts dt { color: var(--loomos-muted); font-size: 9px; text-transform: uppercase; }
  .loomos-facts dd { margin: 2px 0 0; overflow-wrap: anywhere; font-weight: 600; }
  
  .loomos-chip-row { display: flex; flex-wrap: wrap; gap: 5px; margin: 5px 0 8px; }
  .loomos-chip { 
    border: 1px solid var(--loomos-border); 
    border-radius: 999px; 
    color: var(--loomos-muted); 
    font-size: 10px; 
    padding: 2px 6px; 
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  .loomos-callout, .loomos-note { 
    border-left: 3px solid var(--loomos-accent); 
    margin-bottom: 8px; 
    padding: 7px 9px; 
    overflow-wrap: anywhere;
    background: color-mix(in srgb, var(--loomos-accent) 6%, var(--loomos-panel));
  }
  
  .loomos-list { display: grid; gap: 7px; min-width: 0; }
  .loomos-row { border-left: 2px solid var(--loomos-border); padding-left: 8px; min-width: 0; }
  .loomos-row-title { align-items: flex-start; display: flex; justify-content: space-between; gap: 8px; }
  .loomos-row-title strong { overflow-wrap: anywhere; font-size: 12px; }
  .loomos-row-title span { color: var(--loomos-muted); font-size: 9px; text-transform: uppercase; white-space: nowrap; }
  
  .loomos-severity-high, .loomos-priority-high, .loomos-importance-high { border-left-color: #d58a42; }
  .loomos-severity-critical, .loomos-priority-critical, .loomos-importance-critical { border-left-color: #df5259; }
  
  .loomos-card-grid, .loomos-meter-grid { display: grid; gap: 8px; grid-template-columns: repeat(2, minmax(0, 1fr)); min-width: 0; }
  .loomos-card, .loomos-meter { 
    background: color-mix(in srgb, var(--loomos-bg) 65%, transparent); 
    border: 1px solid var(--loomos-border); 
    border-radius: 9px; 
    padding: 9px; 
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .loomos-card-heading { align-items: flex-start; display: flex; justify-content: space-between; gap: 8px; }
  .loomos-card-heading strong { display: block; font-size: 13px; overflow-wrap: anywhere; }
  
  .loomos-meter-track { background: var(--loomos-border); border-radius: 999px; height: 6px; margin: 6px 0; overflow: hidden; }
  .loomos-meter-track i { background: var(--loomos-accent); display: block; height: 100%; }
  
  .loomos-stat-grid { display: grid; gap: 6px; grid-template-columns: repeat(4, 1fr); margin-bottom: 9px; min-width: 0; }
  .loomos-stat-grid div { border: 1px solid var(--loomos-border); border-radius: 8px; display: grid; padding: 6px; text-align: center; min-width: 0; }
  .loomos-stat-grid span { color: var(--loomos-muted); font-size: 9px; text-transform: uppercase; }
  
  .loomos-empty { padding: 24px 12px; text-align: center; }
  .loomos-empty h3 { margin: 0 0 5px; }
  .loomos-empty p { color: var(--loomos-muted); margin: 0 auto 12px; max-width: 440px; overflow-wrap: anywhere; }
  
  /* Collapsible matrix groups */
  .loomos-module-group-details {
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 10px;
    margin-bottom: 12px;
    overflow: hidden;
  }
  .loomos-module-group-summary {
    cursor: pointer;
    list-style: none;
    padding: 10px 12px;
    user-select: none;
    background: color-mix(in srgb, var(--loomos-bg) 40%, var(--loomos-panel));
  }
  .loomos-module-group-summary::-webkit-details-marker {
    display: none;
  }
  .loomos-module-group-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .loomos-module-group-header strong {
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .loomos-module-group-desc {
    color: var(--loomos-muted);
    display: block;
    font-size: 10px;
    margin-top: 4px;
    line-height: 1.35;
  }
  .loomos-module-group-content {
    border-top: 1px solid var(--loomos-border);
    background: var(--loomos-bg);
    display: grid;
    gap: 0;
  }

  .loomos-module-card {
    border-bottom: 1px solid var(--loomos-border);
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 10px;
    min-width: 0;
  }
  .loomos-module-card:last-child {
    border-bottom: none;
  }
  .loomos-module-info {
    min-width: 0;
  }
  .loomos-module-title-row {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: space-between;
  }
  .loomos-module-title-row strong {
    font-size: 12px;
  }
  .loomos-pills {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }
  .loomos-pill {
    border: 1px solid var(--loomos-border);
    border-radius: 4px;
    font-size: 9px;
    font-weight: 800;
    padding: 1px 4px;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .pill-core { border-color: #ba8b43; color: #ba8b43; }
  .pill-experimental { border-color: #d24c52; color: #d24c52; }
  .pill-injected { border-color: #25f2d0; color: #25f2d0; }
  .pill-hidden { border-color: var(--loomos-muted); color: var(--loomos-muted); }
  .pill-custom { border-color: #7c6cff; color: #7c6cff; }
  .pill-overridden { border-color: #d58a42; color: #d58a42; }

  /* 44px settings matrix buttons */
  .loomos-module-toggles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin-top: 4px;
  }
  .loomos-toggle-target {
    align-items: center;
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 6px;
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    gap: 6px;
    min-height: 44px; /* thumb-friendly 44px touch target */
    padding: 4px 6px;
    user-select: none;
    transition: all 0.15s ease;
  }
  .loomos-toggle-target:hover {
    border-color: var(--loomos-accent);
  }
  .loomos-toggle-target input {
    margin: 0;
    width: 15px;
    height: 15px;
  }
  .loomos-toggle-target span {
    font-size: 11px;
    font-weight: 700;
  }
  .loomos-toggle-target.active {
    background: color-mix(in srgb, var(--loomos-accent) 15%, var(--loomos-panel));
    border-color: var(--loomos-accent);
    color: var(--loomos-accent);
  }
  .loomos-toggle-target.locked {
    opacity: 0.7;
    cursor: not-allowed;
    background: color-mix(in srgb, var(--loomos-border) 25%, var(--loomos-panel));
  }
  
  .loomos-hint { color: var(--loomos-muted); font-size: 11px; grid-column: 1 / -1; margin: 0; }
  .loomos-diagnostic { 
    color: var(--loomos-muted); 
    font: 11px/1.5 ui-monospace, SFMono-Regular, Consolas, monospace; 
    white-space: pre-wrap; 
    overflow-x: auto;
    max-width: 100%;
  }

  /* Overview Widget */
  .loomos-overview-card {
    background: linear-gradient(135deg, var(--loomos-panel), var(--loomos-bg));
    border-left: 4px solid var(--loomos-accent);
    padding: 12px 14px;
    margin-bottom: 8px;
    min-width: 0;
  }
  .loomos-overview-headline {
    font-size: 14px;
    font-weight: 700;
    font-style: italic;
    color: var(--loomos-ink);
    margin: 6px 0 10px;
    line-height: 1.35;
    overflow-wrap: anywhere;
  }
  .loomos-overview-details {
    display: grid;
    gap: 6px;
    font-size: 11px;
    min-width: 0;
  }
  .loomos-overview-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 4px;
    color: var(--loomos-muted);
  }
  .loomos-overview-inject-active { color: #4cd27e; font-weight: 700; }
  .loomos-overview-inject-inactive { color: var(--loomos-muted); }

  .loomos-preset-manager {
    border-bottom: 1px solid var(--loomos-border);
    margin-bottom: 12px;
    padding-bottom: 12px;
    grid-column: 1 / -1;
  }
  .loomos-preset-select-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 6px;
    max-width: 100%;
  }
  .loomos-preset-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .loomos-preset-dirty-warning {
    color: #ba8b43;
    font-size: 10px;
    margin-top: 4px;
    font-weight: 700;
  }

  .loomos-search-bar {
    align-items: center;
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
    position: relative;
    width: 100%;
  }
  .loomos-search-bar input {
    flex: 1;
    padding-right: 24px;
    width: 100%;
  }
  .loomos-button-clear {
    background: transparent;
    border: none;
    color: var(--loomos-muted);
    cursor: pointer;
    font-size: 16px;
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    padding: 0 4px;
  }
  .loomos-button-clear:hover { color: var(--loomos-ink); }
  .loomos-search-count { color: var(--loomos-muted); font-size: 10px; white-space: nowrap; }
  
  .loomos-bulk-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 12px;
  }
  .loomos-btn-sm {
    font-size: 10px;
    min-height: 28px;
    padding: 2px 6px;
  }
  .loomos-module-groups {
    display: grid;
    gap: 0;
    width: 100%;
  }

  .loomos-compile-status {
    background: color-mix(in srgb, var(--loomos-accent) 8%, var(--loomos-bg));
    border-color: var(--loomos-accent);
  }
  .loomos-badge-compiling {
    background: var(--loomos-accent);
    color: #fff;
    font-weight: 800;
  }
  .loomos-button-pulse, .loomos-pulse {
    animation: loomos-glow-pulse 1.8s infinite;
  }
  @keyframes loomos-glow-pulse {
    0% { box-shadow: 0 0 0 0px color-mix(in srgb, var(--loomos-accent) 30%, transparent); }
    50% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--loomos-accent) 0%, transparent); }
    100% { box-shadow: 0 0 0 0px color-mix(in srgb, var(--loomos-accent) 30%, transparent); }
  }
  @keyframes loomos-bar-pulse {
    0% { opacity: 0.6; }
    50% { opacity: 1; }
    100% { opacity: 0.6; }
  }

  .loomos-prompt-dialog {
    display: grid;
    gap: 12px;
    padding: 15px;
    max-width: 100%;
  }
  .loomos-dialog-buttons {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    margin-top: 10px;
  }
  .loomos-custom-add-wrap {
    margin-top: 10px;
    text-align: right;
  }
  .loomos-custom-actions {
    display: flex;
    gap: 8px;
    margin-top: 4px;
  }
  .loomos-link-btn {
    background: transparent;
    border: none;
    color: var(--loomos-accent);
    cursor: pointer;
    font-size: 10px;
    font-weight: 700;
    padding: 0;
    text-decoration: underline;
  }
  .loomos-link-btn-danger { color: #e56b70; }

  .loomos-badge-severity-critical { background: #df5259; color: #fff; font-size: 8px; text-transform: uppercase; border-radius: 4px; padding: 1px 4px; }
  .loomos-badge-severity-high { background: #d58a42; color: #fff; font-size: 8px; text-transform: uppercase; border-radius: 4px; padding: 1px 4px; }
  .loomos-badge-severity-medium { background: var(--loomos-border); color: var(--loomos-ink); font-size: 8px; text-transform: uppercase; border-radius: 4px; padding: 1px 4px; }
  .loomos-badge-severity-low { background: var(--loomos-border); color: var(--loomos-muted); font-size: 8px; text-transform: uppercase; border-radius: 4px; padding: 1px 4px; }

  .loomos-bullet-list {
    margin: 4px 0 0;
    padding-left: 18px;
  }
  .loomos-bullet-list li {
    margin-bottom: 4px;
    overflow-wrap: anywhere;
  }

  .loomos-performance-info {
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 10px;
    padding: 10px;
    margin-top: 12px;
    grid-column: 1 / -1;
  }
  .loomos-perf-row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    margin-bottom: 6px;
    gap: 8px;
  }
  .loomos-perf-badge {
    border-radius: 4px;
    font-size: 9px;
    font-weight: 800;
    padding: 1px 6px;
    white-space: nowrap;
  }
  .intensity-lite { background: rgba(76, 210, 126, 0.15); color: #4cd27e; border: 1px solid #4cd27e; }
  .intensity-balanced { background: rgba(124, 108, 255, 0.15); color: #7c6cff; border: 1px solid #7c6cff; }
  .intensity-heavy { background: rgba(223, 82, 89, 0.15); color: #df5259; border: 1px solid #df5259; }
  
  .loomos-perf-warning {
    background: rgba(186, 139, 67, 0.12);
    border: 1px solid #ba8b43;
    border-radius: 6px;
    color: #ead9b7;
    font-size: 10px;
    margin: 8px 0;
    padding: 8px;
    overflow-wrap: anywhere;
  }
  .loomos-perf-details {
    color: var(--loomos-muted);
    font-size: 10px;
    margin-top: 8px;
    line-height: 1.35;
  }
  .loomos-perf-details p {
    margin: 4px 0;
  }

  .loomos-cast-extra {
    border: 1px solid var(--loomos-border);
    border-radius: 8px;
    margin-top: 6px;
    background: var(--loomos-bg);
    max-width: 100%;
  }
  .loomos-cast-extra > summary {
    padding: 6px 8px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    color: var(--loomos-muted);
    list-style: none;
  }
  .loomos-cast-extra > summary::-webkit-details-marker { display: none; }
  .loomos-cast-extra[open] > summary {
    border-bottom: 1px solid var(--loomos-border);
  }
  .loomos-cast-extra-body {
    padding: 8px;
    font-size: 11px;
    min-width: 0;
  }

  .loomos-prose-details {
    margin-top: 4px;
    max-width: 100%;
  }
  .loomos-prose-details summary {
    cursor: pointer;
    font-size: 10px;
    font-weight: 700;
    color: var(--loomos-accent);
    outline: none;
    list-style: none;
  }
  .loomos-prose-details summary::-webkit-details-marker { display: none; }
  .loomos-prose-details[open] summary {
    margin-bottom: 4px;
  }

  /* === History Timeline === */
  .loomos-history-tab {
    display: grid;
    gap: 10px;
    min-width: 0;
  }
  .loomos-history-explainer {
    background: color-mix(in srgb, var(--loomos-accent) 6%, var(--loomos-panel));
    border-left: 3px solid var(--loomos-accent);
    border-radius: 8px;
    font-size: 11px;
    line-height: 1.4;
    padding: 10px 12px;
  }
  .loomos-history-explainer p { margin: 0; }
  .loomos-history-list {
    display: grid;
    gap: 6px;
    max-height: 480px;
    overflow-y: auto;
    min-width: 0;
  }
  .loomos-history-entry {
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 10px;
    display: flex;
    gap: 8px;
    padding: 10px 12px;
    min-width: 0;
    transition: border-color 0.15s ease;
  }
  .loomos-history-entry:hover { border-color: var(--loomos-accent); }
  .loomos-history-entry.loomos-history-active {
    border-color: var(--loomos-accent);
    background: color-mix(in srgb, var(--loomos-accent) 8%, var(--loomos-panel));
  }
  .loomos-history-entry-main {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 4px;
  }
  .loomos-history-entry-header {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .loomos-history-entry-header strong { font-size: 12px; }
  .loomos-history-entry-focus {
    font-size: 11px;
    margin: 0;
    overflow-wrap: anywhere;
    color: var(--loomos-muted);
  }
  .loomos-history-entry-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    font-size: 10px;
    color: var(--loomos-muted);
  }
  .loomos-history-entry-delta {
    font-size: 11px;
    font-style: italic;
    margin: 2px 0 0;
    overflow-wrap: anywhere;
    color: var(--loomos-ink);
  }
  .loomos-history-entry-actions {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex-shrink: 0;
  }
  .loomos-history-entry-actions .loomos-button {
    min-width: 64px;
    text-align: center;
  }

  /* === Injection Preview === */
  .loomos-injection-preview {
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 10px;
    display: grid;
    gap: 8px;
    padding: 10px 12px;
    min-width: 0;
  }
  .loomos-injection-preview-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    flex-wrap: wrap;
  }
  .loomos-badge-ok {
    background: rgba(76, 210, 126, 0.15);
    border-color: #4cd27e;
    color: #4cd27e;
  }
  .loomos-badge-over {
    background: rgba(223, 82, 89, 0.15);
    border-color: #df5259;
    color: #df5259;
  }
  .loomos-injection-preview-warning {
    background: rgba(186, 139, 67, 0.12);
    border: 1px solid #ba8b43;
    border-radius: 6px;
    color: #ead9b7;
    font-size: 11px;
    padding: 8px 10px;
  }
  .loomos-injection-preview-meta {
    display: grid;
    gap: 8px;
  }
  .loomos-injection-preview-modules {
    display: grid;
    gap: 4px;
  }
  .loomos-injection-preview-tokenbar {
    display: grid;
    gap: 4px;
    font-size: 10px;
    color: var(--loomos-muted);
  }
  .loomos-injection-preview-text {
    background: var(--loomos-bg);
    border: 1px solid var(--loomos-border);
    border-radius: 6px;
    font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    max-height: 200px;
    overflow: auto;
    padding: 8px;
    white-space: pre-wrap;
    word-break: break-word;
    max-width: 100%;
  }

  /* === What Changed Modal === */
  .loomos-what-changed-modal {
    display: grid;
    gap: 14px;
    min-width: 0;
    max-width: 100%;
  }
  .loomos-what-changed-title {
    font-size: 16px;
    margin: 0;
  }
  .loomos-what-changed-headline {
    background: color-mix(in srgb, var(--loomos-accent) 6%, var(--loomos-panel));
    border-left: 3px solid var(--loomos-accent);
    border-radius: 8px;
    padding: 10px 12px;
  }
  .loomos-what-changed-headline p {
    font-size: 13px;
    font-weight: 600;
    margin: 4px 0 0;
    overflow-wrap: anywhere;
  }
  .loomos-what-changed-section {
    display: grid;
    gap: 6px;
  }
  .loomos-what-changed-change {
    align-items: flex-start;
    display: flex;
    gap: 8px;
    padding: 6px 8px;
    border-left: 2px solid var(--loomos-border);
  }
  .loomos-what-changed-change-icon {
    background: var(--loomos-accent);
    border-radius: 50%;
    color: #fff;
    flex-shrink: 0;
    font-size: 9px;
    font-weight: 900;
    height: 18px;
    line-height: 18px;
    text-align: center;
    width: 18px;
  }
  .loomos-what-changed-change-body {
    display: grid;
    gap: 2px;
    min-width: 0;
  }
  .loomos-what-changed-change-body strong {
    font-size: 12px;
    overflow-wrap: anywhere;
  }
  .loomos-what-changed-change-meta {
    color: var(--loomos-muted);
    font-size: 10px;
  }
  .loomos-what-changed-scene dd {
    overflow-wrap: anywhere;
  }

  /* === Continuity Explainer === */
  .loomos-continuity-explainer {
    display: grid;
    gap: 10px;
    margin-bottom: 6px;
  }
  .loomos-continuity-explainer-text {
    font-size: 11px;
    line-height: 1.45;
    margin: 0;
    overflow-wrap: anywhere;
  }
  .loomos-continuity-metrics {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
  .loomos-continuity-metric {
    background: var(--loomos-bg);
    border: 1px solid var(--loomos-border);
    border-radius: 8px;
    padding: 8px 6px;
    text-align: center;
    display: grid;
    gap: 2px;
  }
  .loomos-continuity-metric-value {
    font-size: 18px;
    font-weight: 900;
    color: var(--loomos-accent);
  }
  .loomos-continuity-metric-label {
    color: var(--loomos-muted);
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .loomos-continuity-safe {
    background: rgba(76, 210, 126, 0.08);
    border: 1px solid rgba(76, 210, 126, 0.25);
    border-radius: 8px;
    color: #4cd27e;
    font-size: 12px;
    padding: 12px 14px;
    text-align: center;
  }
  .loomos-continuity-risks {
    display: grid;
    gap: 8px;
  }
  .loomos-continuity-risk-card {
    background: var(--loomos-bg);
    border: 1px solid var(--loomos-border);
    border-radius: 10px;
    padding: 10px 12px;
    display: grid;
    gap: 6px;
  }
  .loomos-continuity-risk-header {
    align-items: center;
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }
  .loomos-continuity-risk-header strong {
    font-size: 12px;
    overflow-wrap: anywhere;
  }
  .loomos-continuity-risk-evidence {
    font-size: 11px;
    margin: 0;
    color: var(--loomos-muted);
    overflow-wrap: anywhere;
  }
  .loomos-continuity-risk-guardrail {
    background: color-mix(in srgb, var(--loomos-accent) 5%, var(--loomos-panel));
    border-radius: 6px;
    padding: 6px 8px;
    font-size: 11px;
  }
  .loomos-continuity-risk-guardrail p {
    margin: 2px 0 0;
    overflow-wrap: anywhere;
  }

  @media (max-width: 620px) {
    .loomos-root { padding: 6px; }
    .loomos-settings-grid, .loomos-two-column, .loomos-facts, .loomos-card-grid, .loomos-meter-grid { grid-template-columns: 1fr; }
    .loomos-status { max-width: 100%; }
    .loomos-button { flex: 1 1 auto; }
    .loomos-stat-grid { grid-template-columns: repeat(2, 1fr); }
    .loomos-header-actions button { min-width: 70px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .loomos-button-pulse, .loomos-pulse, .loomos-meter-track i {
      animation: none !important;
      transition: none !important;
    }
  }

  /* Cast cards stack vertically */
  .loomos-list .loomos-card {
    max-width: 100%;
  }

  /* Viewer modal scroll fix */
  .loomos-root .loomos-tab-pane {
    overflow-y: auto;
    overflow-x: hidden;
    min-width: 0;
  }

  /* Widget message bar polish */
  .loomos-widget-bar {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding: 4px 0;
  }

  /* Settings grid full-span items */
  .loomos-settings .loomos-module-selector,
  .loomos-settings .loomos-performance-info {
    grid-column: 1 / -1;
  }

  /* Tab pane auto height */
  .loomos-tab-pane:empty {
    display: none;
  }

  /* Ensure overview stat badges wrap gracefully */
  .loomos-overview-stats span {
    white-space: nowrap;
  }

  /* Drawer view (sidebar) layout hardening - force single column */
  .loomos-root[data-view="drawer"] .loomos-settings-grid,
  .loomos-root[data-view="drawer"] .loomos-two-column,
  .loomos-root[data-view="drawer"] .loomos-facts,
  .loomos-root[data-view="drawer"] .loomos-card-grid,
  .loomos-root[data-view="drawer"] .loomos-meter-grid,
  .loomos-root[data-view="drawer"] .loomos-stat-grid {
    grid-template-columns: 1fr !important;
  }

  .loomos-module-editor {
    display: grid;
    gap: 12px;
    min-width: 0;
  }
  .loomos-editor-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .loomos-full-span {
    grid-column: 1 / -1;
  }
  .loomos-editor-textarea {
    min-height: 90px;
  }
  .loomos-editor-section {
    border: 1px solid var(--loomos-border);
    border-radius: 8px;
    overflow: hidden;
  }
  .loomos-editor-section > summary {
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 9px 10px;
  }
  .loomos-editor-section-body {
    border-top: 1px solid var(--loomos-border);
    display: grid;
    gap: 10px;
    min-width: 0;
    padding: 10px;
  }
  .loomos-schema-field-list {
    display: grid;
    gap: 6px;
  }
  .loomos-schema-field-row {
    align-items: center;
    background: var(--loomos-bg);
    border: 1px solid var(--loomos-border);
    border-radius: 8px;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    min-width: 0;
    padding: 8px;
  }
  .loomos-schema-field-row small {
    color: var(--loomos-muted);
    display: block;
    font-size: 10px;
    margin-top: 2px;
    overflow-wrap: anywhere;
  }
  .loomos-icon-actions {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: flex-end;
  }
  .loomos-icon-button {
    align-items: center;
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 6px;
    color: var(--loomos-ink);
    cursor: pointer;
    display: inline-flex;
    font-size: 10px;
    min-height: 30px;
    padding: 4px 7px;
  }
  .loomos-icon-button:disabled {
    cursor: not-allowed;
    opacity: .45;
  }
  .loomos-shape-preview,
  .loomos-code-editor {
    background: var(--loomos-bg);
    border: 1px solid var(--loomos-border);
    border-radius: 8px;
    font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    max-width: 100%;
    min-width: 0;
    overflow: auto;
    padding: 8px;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .loomos-code-editor {
    min-height: 120px;
    resize: vertical;
  }
  .loomos-template-preview {
    background: var(--loomos-bg);
    border: 1px dashed var(--loomos-border);
    border-radius: 8px;
    min-height: 60px;
    overflow: hidden;
    padding: 8px;
  }
  .loomos-custom-fields {
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    margin: 0 0 10px;
  }
  .loomos-custom-fields div {
    background: var(--loomos-bg);
    border: 1px solid var(--loomos-border);
    border-radius: 8px;
    min-width: 0;
    padding: 7px;
  }
  .loomos-custom-fields dt {
    color: var(--loomos-muted);
    font-size: 9px;
    text-transform: uppercase;
  }
  .loomos-custom-fields dd {
    margin: 2px 0 0;
    overflow-wrap: anywhere;
  }
  .loomos-custom-template {
    max-width: 100%;
    min-width: 0;
    overflow-wrap: anywhere;
  }
`;

// src/frontend.ts
var ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v16H7a2 2 0 0 0-2 2V5.5A1 1 0 0 0 4 4.5Zm3-.5a1 1 0 0 0-1 1v11.17c.31-.11.65-.17 1-.17h11V4H7Zm2 3h6v2H9V7Zm0 4h6v2H9v-2Z"/></svg>`;
var EMPTY_PERMISSIONS = {
  generation: false,
  interceptor: false,
  chatMutation: false
};
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function requestId(prefix) {
  return `${prefix}:${crypto.randomUUID()}`;
}
function selected(value, current) {
  return value === current ? " selected" : "";
}
function checked(value) {
  return value ? " checked" : "";
}
function disabled(value) {
  return value ? " disabled" : "";
}
function skinLabel(value) {
  return {
    auto: "Auto",
    dark_academia: "Dark Academia",
    cyberpunk: "Cyberpunk",
    fantasy: "Fantasy",
    horror: "Horror",
    noir: "Noir",
    minimal: "Minimal"
  }[value];
}
function setup(ctx) {
  const cleanups = [];
  const removeStyle = ctx.dom.addStyle(LOOMOS_STYLES);
  let disposed = false;
  let settings = DEFAULT_SETTINGS;
  let permissions = EMPTY_PERMISSIONS;
  let connections = [];
  let activeIdentity = null;
  let state = null;
  let status = "Starting";
  let pipeline = null;
  let activeGenerationRequestId = null;
  let generationStartedAt = 0;
  let elapsedTimer = null;
  const messageWidgetCleanups = /* @__PURE__ */ new Map();
  let chatStates = [];
  let historyItems = [];
  let injectionPreview = null;
  let historyFilter = "";
  let modal = null;
  let modalListenerCleanup = null;
  let activeTab = "overview";
  const tab = ctx.ui.registerDrawerTab({
    id: "command-deck",
    title: "LoomOS Command Deck",
    shortName: "LoomOS",
    headerTitle: "LoomOS",
    description: "Modular story state, deltas, cast, world, and continuity",
    keywords: ["story", "continuity", "tracker", "state", "roleplay"],
    iconSvg: ICON
  });
  tab.root.classList.add("loomos-root");
  tab.root.dataset.view = "drawer";
  const inputAction = ctx.ui.registerInputBarAction({
    id: "open-command-deck",
    label: "Open LoomOS",
    subtitle: "View exact-swipe story state",
    iconSvg: ICON
  });
  function send(request) {
    if (!disposed) ctx.sendToBackend(request);
  }
  function currentRequest() {
    const active = ctx.getActiveChat();
    if (!active.chatId) return null;
    const messageId = ctx.messages.getLatestMessageId() ?? void 0;
    if (!messageId) return { chatId: active.chatId };
    if (activeIdentity && activeIdentity.chatId === active.chatId && activeIdentity.messageId === messageId) return activeIdentity;
    return { chatId: active.chatId, messageId };
  }
  function exactLabel() {
    return activeIdentity ? `${activeIdentity.messageId.slice(0, 8)} | swipe ${activeIdentity.swipeId}` : "No active message";
  }
  function hasExactStateForLatest() {
    const latest = ctx.messages.getLatestMessageId();
    return Boolean(
      latest && state && activeIdentity && state.identity.messageId === latest && state.identity.swipeId === activeIdentity.swipeId
    );
  }
  function stopElapsedTimer() {
    if (elapsedTimer) clearInterval(elapsedTimer);
    elapsedTimer = null;
  }
  function startElapsedTimer() {
    stopElapsedTimer();
    generationStartedAt = Date.now();
    elapsedTimer = setInterval(() => {
      if (!activeGenerationRequestId) {
        stopElapsedTimer();
        return;
      }
      renderAll();
    }, 1e3);
  }
  function elapsedLabel() {
    if (!activeGenerationRequestId || generationStartedAt === 0) return status;
    return `${status} | ${Math.floor((Date.now() - generationStartedAt) / 1e3)}s`;
  }
  function captureUiState() {
    const openDetails = /* @__PURE__ */ new Set();
    tab.root.querySelectorAll("details[data-details], details[data-section], details[data-group]").forEach((d) => {
      const key = d.getAttribute("data-details") || d.getAttribute("data-section") || d.getAttribute("data-group");
      if (key && d.open) openDetails.add(key);
    });
    if (modal) {
      modal.root.querySelectorAll("details[data-details], details[data-section], details[data-group]").forEach((d) => {
        const key = d.getAttribute("data-details") || d.getAttribute("data-section") || d.getAttribute("data-group");
        if (key && d.open) openDetails.add("modal:" + key);
      });
    }
    const searchQuery = tab.root.querySelector("[data-module-search]")?.value ?? "";
    const savedTab = activeTab;
    const scrollPositions = /* @__PURE__ */ new Map();
    let curr = tab.root;
    while (curr) {
      scrollPositions.set(curr, curr.scrollTop);
      curr = curr.parentElement;
    }
    if (modal) {
      let mcurr = modal.root;
      while (mcurr) {
        scrollPositions.set(mcurr, mcurr.scrollTop);
        mcurr = mcurr.parentElement;
      }
    }
    let focusedSelector = null;
    let selectionStart = null;
    let selectionEnd = null;
    const active = document.activeElement;
    if (active && (tab.root.contains(active) || modal && modal.root.contains(active))) {
      if (active.hasAttribute("data-setting")) {
        focusedSelector = `[data-setting="${active.getAttribute("data-setting")}"]`;
      } else if (active.hasAttribute("data-module") && active.hasAttribute("data-axis")) {
        focusedSelector = `[data-module="${active.getAttribute("data-module")}"][data-axis="${active.getAttribute("data-axis")}"]`;
      } else if (active.hasAttribute("data-custom-module") && active.hasAttribute("data-axis")) {
        focusedSelector = `[data-custom-module="${active.getAttribute("data-custom-module")}"][data-axis="${active.getAttribute("data-axis")}"]`;
      } else if (active.hasAttribute("data-module-search")) {
        focusedSelector = "[data-module-search]";
      } else if (active.hasAttribute("data-action")) {
        focusedSelector = `[data-action="${active.getAttribute("data-action")}"]`;
      } else if (active.hasAttribute("data-preset-action")) {
        focusedSelector = `[data-preset-action="${active.getAttribute("data-preset-action")}"]`;
      } else if (active.hasAttribute("data-custom-action")) {
        focusedSelector = `[data-custom-action="${active.getAttribute("data-custom-action")}"]`;
        if (active.hasAttribute("data-custom-id")) {
          focusedSelector += `[data-custom-id="${active.getAttribute("data-custom-id")}"]`;
        }
      }
      if (active instanceof HTMLInputElement) {
        selectionStart = active.selectionStart;
        selectionEnd = active.selectionEnd;
      }
    }
    return {
      scrollPositions,
      openDetails,
      searchQuery,
      savedTab,
      focusedSelector,
      selectionStart,
      selectionEnd
    };
  }
  function restoreUiState(uiSnapshot) {
    activeTab = uiSnapshot.savedTab;
    tab.root.querySelectorAll("details[data-details], details[data-section], details[data-group]").forEach((d) => {
      const key = d.getAttribute("data-details") || d.getAttribute("data-section") || d.getAttribute("data-group");
      if (key) d.open = uiSnapshot.openDetails.has(key);
    });
    if (modal) {
      modal.root.querySelectorAll("details[data-details], details[data-section], details[data-group]").forEach((d) => {
        const key = d.getAttribute("data-details") || d.getAttribute("data-section") || d.getAttribute("data-group");
        if (key) d.open = uiSnapshot.openDetails.has("modal:" + key);
      });
    }
    const searchInput = tab.root.querySelector("[data-module-search]");
    if (searchInput) {
      searchInput.value = uiSnapshot.searchQuery;
      const query = uiSnapshot.searchQuery.toLowerCase();
      tab.root.querySelectorAll("[data-module-row]").forEach((row) => {
        row.hidden = Boolean(query) && !(row.dataset.search ?? "").includes(query);
      });
    }
    for (const [el, scrollTop] of uiSnapshot.scrollPositions.entries()) {
      try {
        el.scrollTop = scrollTop;
      } catch {
      }
    }
    if (uiSnapshot.focusedSelector) {
      const el = tab.root.querySelector(uiSnapshot.focusedSelector) || modal && modal.root.querySelector(uiSnapshot.focusedSelector);
      if (el instanceof HTMLElement) {
        el.focus();
        if (el instanceof HTMLInputElement && uiSnapshot.selectionStart !== null && uiSnapshot.selectionEnd !== null) {
          try {
            el.setSelectionRange(uiSnapshot.selectionStart, uiSnapshot.selectionEnd);
          } catch {
          }
        }
      }
    }
  }
  function clearAllMessageWidgets() {
    for (const cleanup of messageWidgetCleanups.values()) {
      try {
        cleanup();
      } catch {
      }
    }
    messageWidgetCleanups.clear();
  }
  function refreshAllMessageWidgets() {
    clearAllMessageWidgets();
    const activeChat = ctx.getActiveChat();
    if (!activeChat.chatId) return;
    const latestId = ctx.messages.getLatestMessageId();
    for (const item of chatStates) {
      if (item.messageId === latestId) continue;
      const widgetKey = `${item.messageId}-sw${item.swipeId}`;
      const cleanup = ctx.messages.renderWidget({
        messageId: item.messageId,
        widgetId: `loomos-history-${item.swipeId}`,
        html: `
          <style>
            :root { color-scheme: light dark; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 2px 0;
              font-family: system-ui, -apple-system, sans-serif;
              color: var(--lumiverse-text-dim, #aaa);
            }
            .bar {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: var(--lumiverse-fill-subtle, rgba(255, 255, 255, 0.02));
              border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.05));
              border-radius: 6px;
              padding: 3px 6px;
              max-width: 100%;
              flex-wrap: nowrap;
            }
            button {
              background: var(--lumiverse-fill, rgba(255, 255, 255, 0.05));
              border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.1));
              border-radius: 4px;
              color: var(--lumiverse-text, #f5f5f5);
              cursor: pointer;
              font-size: 10px;
              font-weight: 500;
              height: 22px;
              padding: 0 6px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
              transition: all 0.2s ease;
            }
            button:hover {
              border-color: var(--lumiverse-accent, #7c6cff);
              background: rgba(124, 108, 255, 0.08);
            }
            .label-wrapper {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              font-size: 10px;
              white-space: nowrap;
            }
          </style>
          <div class="bar">
            <div class="label-wrapper">
              <span>\u{1F4DD} Tracker (swipe ${item.swipeId})</span>
            </div>
            <button id="open" type="button">Open Tracker</button>
          </div>
          <script>
            document.getElementById("open").addEventListener("click",()=>window.spindleSandbox.postMessage({type:"open"}));
          <\/script>
        `,
        minHeight: 24,
        maxHeight: 40
      }, (payload) => {
        if (isRecord(payload) && payload.type === "open") {
          activeIdentity = {
            chatId: activeChat.chatId,
            messageId: item.messageId,
            swipeId: item.swipeId
          };
          status = `Loaded historical state for swipe ${item.swipeId}`;
          send({ type: "get_state", requestId: requestId("state-hist"), identity: activeIdentity });
          openViewer();
        }
      });
      if (cleanup) {
        messageWidgetCleanups.set(widgetKey, cleanup);
      }
    }
    if (latestId) {
      const hasState = hasExactStateForLatest();
      const busy = activeGenerationRequestId !== null;
      const generateLabel = busy ? "Stop" : hasState ? "Refresh" : "Generate";
      const generateClass = busy ? "danger pulse" : "primary";
      const swipeText = activeIdentity ? `swipe ${activeIdentity.swipeId}` : "this swipe";
      const cleanup = ctx.messages.renderWidget({
        messageId: latestId,
        widgetId: "loomos-action",
        html: `
          <style>
            :root { color-scheme: light dark; }
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 2px 0;
              font-family: system-ui, -apple-system, sans-serif;
              color: var(--lumiverse-text, #f5f5f5);
            }
            .bar {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              background: var(--lumiverse-fill-subtle, rgba(255, 255, 255, 0.03));
              border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.08));
              border-radius: 8px;
              padding: 4px 8px;
              max-width: 100%;
              flex-wrap: nowrap;
            }
            button {
              background: var(--lumiverse-fill, rgba(255, 255, 255, 0.05));
              border: 1px solid var(--lumiverse-border, rgba(255, 255, 255, 0.1));
              border-radius: 6px;
              color: var(--lumiverse-text, #f5f5f5);
              cursor: pointer;
              font-size: 11px;
              font-weight: 600;
              height: 28px;
              padding: 0 10px;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              white-space: nowrap;
              transition: all 0.2s ease;
            }
            button:hover {
              border-color: var(--lumiverse-accent, #7c6cff);
              background: rgba(124, 108, 255, 0.08);
            }
            button.primary {
              background: var(--lumiverse-accent, #7c6cff);
              color: var(--lumiverse-accent-fg, #fff);
              border-color: var(--lumiverse-accent, #7c6cff);
            }
            button.primary:hover {
              opacity: 0.9;
              filter: brightness(1.1);
            }
            button.danger {
              border-color: #df5259;
              background: rgba(223, 82, 89, 0.15);
              color: #ff6b72;
            }
            button.pulse {
              animation: loomos-pulse 1.6s infinite;
            }
            button:disabled {
              cursor: not-allowed;
              opacity: 0.48;
            }
            .status-wrapper {
              display: inline-flex;
              align-items: center;
              gap: 6px;
              font-size: 10px;
              color: var(--lumiverse-text-dim, #aaa);
              margin-left: 4px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
            .status-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background-color: #71717a;
              display: inline-block;
            }
            .status-dot.active {
              background-color: #10b981;
              box-shadow: 0 0 6px #10b981;
            }
            @keyframes loomos-pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          </style>
          <div class="bar">
            <button id="open" type="button">\u{1F52E} Open LoomOS</button>
            <button id="generate" class="${generateClass}" type="button"${disabled(!permissions.generation || !permissions.chatMutation)}>${escapeHtml(generateLabel)}</button>
            <div class="status-wrapper">
              <i class="status-dot ${hasState ? "active" : ""}"></i>
              <span>${hasState ? `Exact state loaded (${swipeText})` : `No state for ${swipeText}`}</span>
            </div>
          </div>
          <script>
            document.getElementById("open").addEventListener("click",()=>window.spindleSandbox.postMessage({type:"open"}));
            document.getElementById("generate").addEventListener("click",()=>window.spindleSandbox.postMessage({type:"generate"}));
          <\/script>
        `,
        minHeight: 38,
        maxHeight: 80
      }, (payload) => {
        if (!isRecord(payload) || typeof payload.type !== "string") return;
        if (payload.type === "open") openViewer();
        if (payload.type === "generate") {
          if (activeGenerationRequestId) {
            send({ type: "cancel_generation", requestId: activeGenerationRequestId });
          } else {
            startGeneration();
          }
        }
      });
      if (cleanup) {
        messageWidgetCleanups.set(latestId, cleanup);
      }
    }
  }
  function compileStatusCardHtml() {
    if (!activeGenerationRequestId) return "";
    const elapsed = generationStartedAt ? Math.floor((Date.now() - generationStartedAt) / 1e3) : 0;
    const phaseLabel = pipeline ? pipeline.phase.replace("_", " ") : "resolving";
    return `
      <div class="loomos-shell loomos-compile-status loomos-pulse" style="margin-top: 8px;">
        <div class="loomos-row-title">
          <strong>Compiling Story State...</strong>
          <span class="loomos-badge loomos-badge-compiling">${elapsed}s</span>
        </div>
        <p>${escapeHtml(status)}</p>
        <div class="loomos-meter-track"><i style="width: 100%; animation: loomos-bar-pulse 2s infinite;"></i></div>
        <small>Phase: ${escapeHtml(phaseLabel)} | Attempt: ${pipeline ? pipeline.attempt : 1}/2</small>
      </div>
    `;
  }
  function checkIfPresetDirty() {
    const active = settings.modulePreset;
    let baseline;
    if (active === "custom") return false;
    if (active.startsWith("custom:")) {
      const presetId = active.substring(7);
      const custom2 = settings.customModulePresets?.find((p) => p.id === presetId);
      if (!custom2) return false;
      baseline = custom2.moduleSettings;
    } else {
      baseline = moduleSettingsForPreset(active);
    }
    for (const key of MODULE_KEYS) {
      const current = settings.moduleSettings[key];
      const base = baseline[key];
      if (!base) continue;
      if (current.track !== base.track || current.display !== base.display || current.inject !== base.inject) {
        return true;
      }
    }
    return false;
  }
  function renderPresetManager() {
    const presets = settings.customModulePresets || [];
    const activePreset = settings.modulePreset;
    const isDirty2 = checkIfPresetDirty();
    return `
      <div class="loomos-preset-manager">
        <span class="loomos-subhead">Preset Manager</span>
        <div class="loomos-preset-select-row">
          <select class="loomos-select" data-setting="modulePreset">
            <option value="lite"${selected("lite", activePreset)}>Lite (Built-in)</option>
            <option value="balanced"${selected("balanced", activePreset)}>Balanced (Built-in)</option>
            <option value="full"${selected("full", activePreset)}>Full (Built-in)</option>
            <option value="experimental"${selected("experimental", activePreset)}>Experimental (Built-in)</option>
            ${presets.map((p) => `
              <option value="custom:${escapeHtml(p.id)}"${selected("custom:" + p.id, activePreset)}>${escapeHtml(p.name)} (Custom)</option>
            `).join("")}
            <option value="custom"${selected("custom", activePreset)}>Custom Settings (Modified)</option>
          </select>
          <div class="loomos-preset-actions">
            <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="save-as" title="Save current settings as new custom preset">Save As...</button>
            ${activePreset.startsWith("custom:") ? `
              <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="update" title="Update active custom preset with current settings"${disabled(!isDirty2)}>Save Changes</button>
              <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="duplicate" title="Duplicate active custom preset">Duplicate</button>
              <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="rename" title="Rename active custom preset">Rename</button>
              <button type="button" class="loomos-button loomos-btn-sm loomos-button-danger" data-preset-action="delete" title="Delete active custom preset">Delete</button>
            ` : ""}
            <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="import" title="Import a preset JSON">Import</button>
            ${activePreset.startsWith("custom:") || activePreset === "custom" ? `
              <button type="button" class="loomos-button loomos-btn-sm" data-preset-action="export" title="Export active preset as JSON">Export</button>
            ` : ""}
          </div>
        </div>
        ${isDirty2 && activePreset.startsWith("custom:") ? `
          <div class="loomos-preset-dirty-warning">\u26A0\uFE0F Active preset "${escapeHtml(presets.find((p) => "custom:" + p.id === activePreset)?.name || "")}" has unsaved changes.</div>
        ` : ""}
      </div>
    `;
  }
  function renderTokenDiagnostics() {
    const trackedCount = MODULE_KEYS.filter((k) => settings.moduleSettings[k].track).length;
    const injectedCount = MODULE_KEYS.filter((k) => settings.moduleSettings[k].inject).length;
    let intensity = "Balanced";
    let intensityClass = "intensity-balanced";
    if (trackedCount <= 6) {
      intensity = "Lite";
      intensityClass = "intensity-lite";
    } else if (trackedCount >= 15) {
      intensity = "Experimental / Heavy";
      intensityClass = "intensity-heavy";
    } else if (trackedCount > 10) {
      intensity = "Heavy";
      intensityClass = "intensity-heavy";
    }
    const tooManyInjected = injectedCount > 8;
    return `
      <div class="loomos-performance-info">
        <span class="loomos-subhead">Token & Performance Guidance</span>
        <div class="loomos-perf-row">
          <span>Tracker Intensity:</span>
          <span class="loomos-perf-badge ${intensityClass}">${intensity}</span>
        </div>
        <div class="loomos-perf-row">
          <span>Active Modules:</span>
          <span>${trackedCount} tracked | ${injectedCount} injected</span>
        </div>
        ${tooManyInjected ? `
          <div class="loomos-perf-warning">
            \u26A0\uFE0F Warning: ${injectedCount} modules are set to inject. This might consume substantial context tokens. 
            <button type="button" class="loomos-link-btn" data-bulk-action="inject-recommended">Apply Recommended</button>
          </div>
        ` : ""}
        <div class="loomos-perf-details">
          <p><strong>Inject Budget (${settings.injectionTokenBudget} tokens)</strong>: Limits future story state injection size in normal generations.</p>
          <p><strong>Seed Budget (${settings.compilerSeedTokenBudget} tokens)</strong>: Limits prior state size when compiling turn deltas.</p>
        </div>
      </div>
    `;
  }
  function hasOverride(key) {
    const ov = settings.stockModuleOverrides?.[key];
    return ov !== void 0 && Object.keys(ov).length > 0;
  }
  function renderModuleMatrix() {
    const query = tab.root.querySelector("[data-module-search]")?.value.trim().toLowerCase() ?? "";
    const modules = getEffectiveModuleCatalog(settings).map((m) => {
      const control2 = settings.moduleSettings[m.key];
      const isCore = CORE_TRACKING_MODULES.has(m.key);
      const isExperimental = ["dialogueState", "directorStyle", "closenessState", "imagePrompt"].includes(m.key);
      const overridden = m.overridden;
      let pills = "";
      if (isCore) pills += `<span class="loomos-pill pill-core">Core</span>`;
      if (isExperimental) pills += `<span class="loomos-pill pill-experimental">Experimental</span>`;
      if (control2.inject) pills += `<span class="loomos-pill pill-injected">Injected</span>`;
      if (!control2.display) pills += `<span class="loomos-pill pill-hidden">Hidden</span>`;
      if (overridden) pills += `<span class="loomos-pill pill-overridden">Overridden</span>`;
      const effectiveLabel = m.label;
      const effectiveGroup = m.group;
      const effectiveDesc = m.description;
      const searchText = `${effectiveLabel} ${effectiveGroup} ${effectiveDesc} ${m.key}`.toLowerCase();
      const visible2 = !query || searchText.includes(query);
      const hidden = m.hiddenFromSettings;
      if (hidden) return { key: m.key, label: effectiveLabel, group: effectiveGroup, description: effectiveDesc, icon: m.icon, control: control2, isCore, pills, visible: false, isCustom: false, hidden: true };
      return {
        key: m.key,
        label: effectiveLabel,
        group: effectiveGroup,
        description: effectiveDesc,
        icon: m.icon,
        displayOrder: m.displayOrder,
        control: control2,
        isCore,
        pills,
        visible: visible2,
        isCustom: false,
        hidden: false
      };
    }).filter((m) => !m.hidden);
    const customModules = (settings.customModules || []).map((m) => {
      const pills = `<span class="loomos-pill pill-custom">Custom</span>` + (m.inject ? ` <span class="loomos-pill pill-injected">Injected</span>` : "") + (!m.display ? ` <span class="loomos-pill pill-hidden">Hidden</span>` : "");
      const searchText = `${m.label} ${m.group} ${m.description} ${m.compilerInstruction}`.toLowerCase();
      const visible2 = !query || searchText.includes(query);
      return {
        key: m.id,
        label: m.label,
        group: "Custom Modules",
        description: m.description || `Output Mode: ${m.outputMode} | Max Items: ${m.maxItems}`,
        icon: "",
        control: { track: m.enabled, display: m.display, inject: m.inject },
        isCore: false,
        pills,
        visible: visible2,
        isCustom: true,
        outputMode: m.outputMode,
        compilerInstruction: m.compilerInstruction,
        maxItems: m.maxItems,
        displayOrder: m.displayOrder ?? 1e4
      };
    });
    const allModules = [...modules, ...customModules].sort((a, b) => (a.displayOrder ?? 1e4) - (b.displayOrder ?? 1e4) || a.label.localeCompare(b.label));
    const visibleCount = allModules.filter((m) => m.visible).length;
    const totalCount = allModules.length;
    const groups = /* @__PURE__ */ new Map();
    for (const m of allModules) {
      if (!groups.has(m.group)) groups.set(m.group, []);
      groups.get(m.group).push(m);
    }
    let groupsHtml = "";
    for (const [groupName, groupModules] of groups.entries()) {
      const groupVisibleCount = groupModules.filter((m) => m.visible).length;
      if (groupVisibleCount === 0) continue;
      const enabledCount = groupModules.filter((m) => m.visible && m.control.track).length;
      const groupDesc = `${enabledCount} of ${groupVisibleCount} tracked`;
      groupsHtml += `
        <details class="loomos-module-group-details" data-group="grp_${escapeHtml(groupName)}">
          <summary class="loomos-module-group-summary">
            <div class="loomos-module-group-header">
              <strong>${escapeHtml(groupName)}</strong>
              <span class="loomos-badge">${escapeHtml(groupDesc)}</span>
            </div>
            <span class="loomos-module-group-desc">${groupVisibleCount} modules in this group</span>
          </summary>
          <div class="loomos-module-group-content">
            ${groupModules.map((m) => {
        if (!m.visible) return "";
        if (m.isCustom) {
          return `
                  <div class="loomos-module-card" data-module-row="${escapeHtml(m.key)}" data-custom="true" data-search="${escapeHtml((m.label + " " + m.group + " " + m.description).toLowerCase())}">
                    <div class="loomos-module-info">
                      <div class="loomos-module-title-row">
                        <strong>${escapeHtml(m.label)}</strong>
                        <div class="loomos-pills">${m.pills}</div>
                      </div>
                      <small>${escapeHtml(m.description)}</small>
                      <div class="loomos-custom-actions">
                        <button type="button" class="loomos-link-btn" data-custom-action="edit" data-custom-id="${escapeHtml(m.key)}">Edit</button>
                        <button type="button" class="loomos-link-btn" data-custom-action="duplicate" data-custom-id="${escapeHtml(m.key)}">Duplicate</button>
                        <button type="button" class="loomos-link-btn loomos-link-btn-danger" data-custom-action="delete" data-custom-id="${escapeHtml(m.key)}">Delete</button>
                      </div>
                    </div>
                    <div class="loomos-module-toggles">
                      <label class="loomos-toggle-target" title="Include custom module in compiler output">
                        <input type="checkbox" data-custom-module="${escapeHtml(m.key)}" data-axis="track"${checked(m.control.track)}>
                        <span>Track</span>
                      </label>
                      <label class="loomos-toggle-target" title="Show or hide custom module in dashboard">
                        <input type="checkbox" data-custom-module="${escapeHtml(m.key)}" data-axis="display"${checked(m.control.display)}>
                        <span>Display</span>
                      </label>
                      <label class="loomos-toggle-target" title="Allow compact custom state injection">
                        <input type="checkbox" data-custom-module="${escapeHtml(m.key)}" data-axis="inject"${checked(m.control.inject)}>
                        <span>Inject</span>
                      </label>
                    </div>
                  </div>
                `;
        }
        const overridden = hasOverride(m.key);
        return `
                <div class="loomos-module-card" data-module-row="${escapeHtml(m.key)}" data-search="${escapeHtml((m.key + " " + m.label + " " + m.group + " " + m.description).toLowerCase())}">
                  <div class="loomos-module-info">
                    <div class="loomos-module-title-row">
                      <strong>${m.icon ? `${escapeHtml(m.icon)} ` : ""}${escapeHtml(m.label)}</strong>
                      <div class="loomos-pills">${m.pills}</div>
                    </div>
                    <small>${escapeHtml(m.description)}</small>
                    <div class="loomos-stock-actions" style="margin-top: 6px; display: flex; gap: 6px;">
                      <button type="button" class="loomos-link-btn" data-stock-action="inspect" data-stock-key="${escapeHtml(m.key)}">Inspect</button>
                      <button type="button" class="loomos-link-btn" data-stock-action="edit" data-stock-key="${escapeHtml(m.key)}">Edit</button>
                      ${overridden ? `<button type="button" class="loomos-link-btn loomos-link-btn-danger" data-stock-action="reset" data-stock-key="${escapeHtml(m.key)}">Reset</button>` : ""}
                      <button type="button" class="loomos-link-btn" data-stock-action="duplicate-as-custom" data-stock-key="${escapeHtml(m.key)}">Duplicate as Custom</button>
                    </div>
                  </div>
                  <div class="loomos-module-toggles">
                    <label class="loomos-toggle-target" title="${m.isCore ? "Core tracking is always enabled" : "Include in compiler output"}">
                      <input type="checkbox" data-module="${escapeHtml(m.key)}" data-axis="track"${checked(m.control.track)}${disabled(m.isCore)}>
                      <span>Track${m.isCore ? " \u{1F512}" : ""}</span>
                    </label>
                    <label class="loomos-toggle-target" title="Show or hide in dashboard">
                      <input type="checkbox" data-module="${escapeHtml(m.key)}" data-axis="display"${checked(m.control.display)}>
                      <span>Display</span>
                    </label>
                    <label class="loomos-toggle-target" title="Allow compact state injection">
                      <input type="checkbox" data-module="${escapeHtml(m.key)}" data-axis="inject"${checked(m.control.inject)}>
                      <span>Inject</span>
                    </label>
                  </div>
                </div>
              `;
      }).join("")}
          </div>
        </details>
      `;
    }
    return `
      <div class="loomos-module-selector" style="grid-column: 1 / -1; margin-top: 12px;">
        <span class="loomos-subhead">Tracker Module Matrix</span>
        <div class="loomos-search-bar" style="margin-top: 4px;">
          <input class="loomos-input" type="search" data-module-search placeholder="Filter modules (cast, inventory, custom...)" value="${escapeHtml(query)}">
          ${query ? `<button class="loomos-button-clear" type="button" data-action="clear-search" title="Clear search">\xD7</button>` : ""}
          <span class="loomos-search-count">${visibleCount} of ${totalCount} shown</span>
        </div>
        <div class="loomos-bulk-actions">
          <button type="button" class="loomos-button loomos-btn-sm" data-bulk-action="enable-display">Show Matching</button>
          <button type="button" class="loomos-button loomos-btn-sm" data-bulk-action="disable-display">Hide Matching</button>
          <button type="button" class="loomos-button loomos-btn-sm" data-bulk-action="inject-recommended">Inject Recommended</button>
          <button type="button" class="loomos-button loomos-btn-sm" data-bulk-action="reset-presets">Reset Preset</button>
          ${Object.keys(settings.stockModuleOverrides || {}).length > 0 ? `<button type="button" class="loomos-button loomos-btn-sm" data-bulk-action="reset-all-overrides">Reset All Overrides</button>` : ""}
        </div>
        <div class="loomos-module-groups">
          ${groupsHtml || `<div class="loomos-empty-search" style="padding: 15px; text-align: center; color: var(--loomos-muted);">No matching modules found.</div>`}
        </div>
        <div class="loomos-custom-add-wrap">
          <button type="button" class="loomos-button loomos-button-primary loomos-btn-sm" data-custom-action="add">+ Add Custom Tracker Module</button>
        </div>
      </div>
    `;
  }
  function renderSettings() {
    return `
      <details class="loomos-shell loomos-settings" data-details="settings">
        <summary>Tracker Settings</summary>
        <div class="loomos-settings-grid">
          ${renderPresetManager()}
          <label class="loomos-field"><span>Skin</span><select class="loomos-select" data-setting="skin">
            ${["auto", "dark_academia", "cyberpunk", "fantasy", "horror", "noir", "minimal"].map(
      (skin) => `<option value="${skin}"${selected(skin, settings.skin)}>${skinLabel(skin)}</option>`
    ).join("")}
          </select></label>
          <label class="loomos-field"><span>Generation connection</span><select class="loomos-select" data-setting="connectionId">
            <option value="">Automatic ready connection</option>
            ${connections.map(
      (connection) => `<option value="${escapeHtml(connection.id)}"${selected(connection.id, settings.connectionId)}${disabled(!connection.ready)}>${escapeHtml(connection.name)} | ${escapeHtml(connection.model || connection.provider)}${connection.isDefault ? " (default)" : ""}${connection.ready ? "" : " (not ready)"}</option>`
    ).join("")}
          </select></label>
          <label class="loomos-field"><span>Auto generation</span><select class="loomos-select" data-setting="autoGeneration">
            <option value="manual"${selected("manual", settings.autoGeneration)}>Manual</option>
            <option value="assistant"${selected("assistant", settings.autoGeneration)}>Assistant messages</option>
            <option value="every"${selected("every", settings.autoGeneration)}>Every message</option>
            <option value="off"${selected("off", settings.autoGeneration)}>Off</option>
          </select></label>
          <label class="loomos-check"><input type="checkbox" data-setting="injectionEnabled"${checked(settings.injectionEnabled)}><span>Inject compact state</span></label>
          <label class="loomos-check"><input type="checkbox" data-setting="showInjectionPreview"${checked(settings.showInjectionPreview)}><span>Show injection preview</span></label>
          <label class="loomos-field"><span>Injection token budget</span><input class="loomos-input" type="number" min="80" max="1600" step="20" data-setting="injectionTokenBudget" value="${settings.injectionTokenBudget}"></label>
          <label class="loomos-field"><span>Recent messages</span><input class="loomos-input" type="number" min="4" max="80" data-setting="recentMessageLimit" value="${settings.recentMessageLimit}"></label>
          <label class="loomos-field"><span>Seed token budget</span><input class="loomos-input" type="number" min="200" max="2400" step="50" data-setting="compilerSeedTokenBudget" value="${settings.compilerSeedTokenBudget}"></label>
          <label class="loomos-field"><span>Generation timeout (seconds)</span><input class="loomos-input" type="number" min="30" max="300" step="10" data-setting="generationTimeoutSeconds" value="${settings.generationTimeoutSeconds}"></label>
          
          ${renderTokenDiagnostics()}
          ${renderModuleMatrix()}
        </div>
      </details>`;
  }
  function diagnosticText() {
    const lines = [
      `version: 0.1.5`,
      `identity: ${exactLabel()}`,
      `state: ${state ? `schema ${state.schemaVersion}, ${state.activeModules.length} modules` : "none"}`,
      `permissions: generation=${permissions.generation} chat=${permissions.chatMutation} interceptor=${permissions.interceptor}`,
      `connection: ${pipeline?.connectionId || settings.connectionId || "automatic"}`,
      `phase: ${pipeline?.phase || "idle"}`,
      `attempt: ${pipeline?.attempt || "-"}`,
      `elapsed: ${pipeline ? `${Math.round(pipeline.elapsedMs / 100) / 10}s` : "-"}`,
      `normalized: ${pipeline?.normalized === void 0 ? "-" : pipeline.normalized ? "yes" : "no"}`,
      `fallbackSaved: ${pipeline?.fallbackSaved === void 0 ? "-" : pipeline.fallbackSaved ? "yes" : "no"}`,
      ...pipeline?.issues?.length ? ["issues:", ...pipeline.issues.slice(0, 8).map((issue) => `- ${issue}`)] : []
    ];
    return lines.join("\n");
  }
  function emptyStateHtml() {
    return `<div class="loomos-shell loomos-empty">
      <h3>No state for this exact swipe</h3>
      <p>LoomOS never substitutes another swipe. Generate a fresh snapshot for ${escapeHtml(exactLabel())}.</p>
      <button class="loomos-button loomos-button-primary" data-action="generate"${disabled(!permissions.generation || !permissions.chatMutation || Boolean(activeGenerationRequestId))}>Generate State</button>
    </div>`;
  }
  function tabsNavHtml() {
    const tabs = [
      { id: "overview", label: "Overview" },
      { id: "cast", label: "Cast" },
      { id: "world", label: "World" },
      { id: "story", label: "Story" },
      { id: "continuity", label: "Continuity" },
      { id: "history", label: "History" }
    ];
    return `<nav class="loomos-tabs-nav">${tabs.map(
      (t) => `<button class="loomos-tab-btn${activeTab === t.id ? " active" : ""}" data-tab="${t.id}">${t.label}</button>`
    ).join("")}</nav>`;
  }
  function stickyHeaderHtml(showTabs) {
    const canGenerate = permissions.generation && permissions.chatMutation;
    const busy = activeGenerationRequestId !== null;
    const missingPermission = !permissions.generation || !permissions.chatMutation || settings.injectionEnabled && !permissions.interceptor;
    return `
      <div class="loomos-header-sticky">
        <div class="loomos-header">
          <div class="loomos-title"><strong>LoomOS Command Deck</strong><span>${escapeHtml(exactLabel())}</span></div>
          <span class="loomos-status" title="${escapeHtml(elapsedLabel())}">${escapeHtml(elapsedLabel())}</span>
        </div>
        <div class="loomos-header-actions">
          <button class="loomos-button loomos-button-primary" data-action="viewer">Open Viewer</button>
          ${busy ? `<button class="loomos-button loomos-button-danger loomos-button-pulse" data-action="cancel">Stop Compile</button>` : `<button class="loomos-button" data-action="generate"${disabled(!canGenerate)}>${state ? "Refresh" : "Generate"}</button>`}
          <button class="loomos-button" data-action="reload"${disabled(!permissions.chatMutation || busy)}>Reload</button>
          ${state && !busy ? `<button class="loomos-button loomos-button-danger" data-action="delete">Delete</button>` : ""}
          ${missingPermission ? `<button class="loomos-button" data-action="permissions">Enable</button>` : ""}
        </div>
        ${showTabs ? tabsNavHtml() : ""}
      </div>`;
  }
  function renderDrawer() {
    tab.root.dataset.skin = settings.skin;
    tab.root.dataset.view = "drawer";
    tab.root.innerHTML = `
      ${stickyHeaderHtml(Boolean(state) || historyItems.length > 0)}
      ${compileStatusCardHtml()}
      ${renderSettings()}
      <div class="loomos-tab-pane">
        ${activeTab === "history" ? renderHistoryTab(historyItems, historyFilter, activeIdentity) : activeTab === "injection" ? injectionPreview ? renderInjectionPreview(injectionPreview) : "" : state ? renderDashboard(state, settings, activeTab) : emptyStateHtml()}
      </div>
      <details class="loomos-shell loomos-settings" data-details="diagnostics">
        <summary>Pipeline Diagnostics</summary>
        <pre class="loomos-diagnostic">${escapeHtml(diagnosticText())}</pre>
        ${pipeline?.debugReport ? `<button type="button" class="loomos-button loomos-btn-sm" data-action="copy-debug-report">Copy Debug Report</button>` : ""}
      </details>
      ${settings.showInjectionPreview && injectionPreview ? renderInjectionPreview(injectionPreview) : ""}`;
  }
  function renderViewer() {
    if (!modal) return;
    modal.root.className = "loomos-root";
    modal.root.dataset.skin = settings.skin;
    modal.root.dataset.view = "modal";
    modal.setTitle(`LoomOS | ${exactLabel()}`);
    modal.root.innerHTML = `
      ${stickyHeaderHtml(Boolean(state) || historyItems.length > 0)}
      ${compileStatusCardHtml()}
      <div class="loomos-tab-pane">
        ${activeTab === "history" ? renderHistoryTab(historyItems, historyFilter, activeIdentity) : activeTab === "injection" ? injectionPreview ? renderInjectionPreview(injectionPreview) : "" : state ? renderDashboard(state, settings, activeTab) : emptyStateHtml()}
      </div>`;
  }
  function renderAll() {
    const uiState = captureUiState();
    renderDrawer();
    renderViewer();
    refreshAllMessageWidgets();
    restoreUiState(uiState);
  }
  function openViewer() {
    if (modal) {
      renderViewer();
      return;
    }
    modal = ctx.ui.showModal({
      title: `LoomOS | ${exactLabel()}`,
      width: Math.min(980, typeof window !== "undefined" ? window.innerWidth - 16 : 420),
      maxHeight: typeof window !== "undefined" ? Math.min(820, window.innerHeight - 32) : 600
    });
    const root = modal.root;
    const onClick = (event) => handleActionClick(event);
    root.addEventListener("click", onClick);
    const removeDismiss = modal.onDismiss(() => {
      root.removeEventListener("click", onClick);
      removeDismiss();
      modal = null;
      modalListenerCleanup = null;
    });
    modalListenerCleanup = () => {
      root.removeEventListener("click", onClick);
      removeDismiss();
      modal?.dismiss();
      modal = null;
    };
    renderViewer();
  }
  function readSettings() {
    const root = tab.root;
    const moduleSettings = Object.fromEntries(MODULE_KEYS.map((key) => {
      const current = settings.moduleSettings[key];
      const value = {
        track: CORE_TRACKING_MODULES.has(key) ? true : root.querySelector(`[data-module="${key}"][data-axis="track"]`)?.checked ?? current.track,
        display: root.querySelector(`[data-module="${key}"][data-axis="display"]`)?.checked ?? current.display,
        inject: root.querySelector(`[data-module="${key}"][data-axis="inject"]`)?.checked ?? current.inject
      };
      return [key, value];
    }));
    const customModules = (settings.customModules || []).map((m) => {
      const trackInput = root.querySelector(`[data-custom-module="${m.id}"][data-axis="track"]`);
      const displayInput = root.querySelector(`[data-custom-module="${m.id}"][data-axis="display"]`);
      const injectInput = root.querySelector(`[data-custom-module="${m.id}"][data-axis="inject"]`);
      return {
        ...m,
        enabled: trackInput ? trackInput.checked : m.enabled,
        display: displayInput ? displayInput.checked : m.display,
        inject: injectInput ? injectInput.checked : m.inject
      };
    });
    return LoomOSSettingsSchema.parse({
      ...settings,
      skin: root.querySelector('[data-setting="skin"]')?.value,
      modulePreset: root.querySelector('[data-setting="modulePreset"]')?.value,
      connectionId: root.querySelector('[data-setting="connectionId"]')?.value ?? "",
      autoGeneration: root.querySelector('[data-setting="autoGeneration"]')?.value,
      injectionEnabled: root.querySelector('[data-setting="injectionEnabled"]')?.checked,
      showInjectionPreview: root.querySelector('[data-setting="showInjectionPreview"]')?.checked,
      injectionTokenBudget: Number(root.querySelector('[data-setting="injectionTokenBudget"]')?.value),
      compilerSeedTokenBudget: Number(root.querySelector('[data-setting="compilerSeedTokenBudget"]')?.value),
      recentMessageLimit: Number(root.querySelector('[data-setting="recentMessageLimit"]')?.value),
      generationTimeoutSeconds: Number(root.querySelector('[data-setting="generationTimeoutSeconds"]')?.value),
      moduleSettings,
      customModules
    });
  }
  let saveSettingsTimeout = null;
  function saveCurrentSettingsDebounced() {
    try {
      settings = readSettings();
      if (saveSettingsTimeout) clearTimeout(saveSettingsTimeout);
      saveSettingsTimeout = setTimeout(() => {
        send({ type: "save_settings", requestId: requestId("settings"), settings });
        if (settings.showInjectionPreview && activeIdentity?.chatId) {
          send({ type: "preview_injection", requestId: requestId("preview-settings"), chatId: activeIdentity.chatId });
        }
      }, 600);
    } catch (error) {
      status = error instanceof Error ? error.message : String(error);
      renderAll();
    }
  }
  function applyModulePreset(preset) {
    let nextSettings;
    if (preset.startsWith("custom:")) {
      const presetId = preset.substring(7);
      const custom2 = settings.customModulePresets?.find((p) => p.id === presetId);
      if (custom2) {
        nextSettings = custom2.moduleSettings;
      } else {
        return;
      }
    } else if (preset !== "custom") {
      nextSettings = moduleSettingsForPreset(preset);
    } else {
      return;
    }
    for (const module of getEffectiveModuleCatalog(settings)) {
      nextSettings[module.key].display = module.defaultControl.display;
      nextSettings[module.key].inject = module.defaultControl.inject;
    }
    settings = LoomOSSettingsSchema.parse({
      ...settings,
      modulePreset: preset,
      moduleSettings: nextSettings
    });
    status = `Preset applied`;
    send({ type: "save_settings", requestId: requestId("preset"), settings });
    renderAll();
  }
  function startGeneration() {
    if (saveSettingsTimeout) {
      clearTimeout(saveSettingsTimeout);
      saveSettingsTimeout = null;
      send({ type: "save_settings", requestId: requestId("settings"), settings });
    }
    const identity = currentRequest();
    if (!identity?.messageId) {
      status = "Open a chat with at least one message first.";
      renderAll();
      return;
    }
    if (!permissions.generation || !permissions.chatMutation) {
      status = "Generation and chat access permissions are required.";
      renderAll();
      return;
    }
    activeGenerationRequestId = requestId("generate");
    status = "Resolving exact swipe";
    pipeline = null;
    startElapsedTimer();
    send({
      type: "generate_state",
      requestId: activeGenerationRequestId,
      identity
    });
    renderAll();
  }
  function reloadState() {
    const identity = currentRequest();
    if (!identity?.messageId) {
      activeIdentity = null;
      state = null;
      status = "No active message";
      renderAll();
      return;
    }
    status = "Loading exact swipe";
    send({ type: "get_state", requestId: requestId("state"), identity });
    renderAll();
  }
  async function deleteCurrentState() {
    const identity = currentRequest();
    if (!identity?.messageId) return;
    const { confirmed } = await ctx.ui.showConfirm({
      title: "Delete LoomOS State",
      message: "Delete the stored snapshot for this exact message and swipe?",
      variant: "danger",
      confirmLabel: "Delete"
    });
    if (!confirmed) return;
    send({ type: "delete_state", requestId: requestId("delete"), identity });
  }
  function showWhatChangedModal() {
    if (!state) return;
    const wm = ctx.ui.showModal({
      title: `What Changed - ${state.delta.headline.slice(0, 40) || "No headline"}`,
      width: 700,
      maxHeight: 700
    });
    wm.root.innerHTML = renderWhatChangedModal(state);
    wm.root.querySelector(".loomos-button[data-action='close']")?.addEventListener("click", () => wm.dismiss());
    const dismiss = wm.onDismiss(() => {
      dismiss();
    });
  }
  async function requestPermissions() {
    try {
      const requested = [
        "generation",
        "chat_mutation"
      ];
      if (settings.injectionEnabled) requested.push("interceptor");
      status = "Waiting for permission confirmation";
      renderAll();
      await ctx.permissions.request(requested, {
        reason: "LoomOS reads chat history for exact-swipe state, runs quiet generation, and optionally injects a compact summary."
      });
      send({ type: "refresh_permissions", requestId: requestId("permissions") });
      send({ type: "get_connections", requestId: requestId("connections") });
    } catch (error) {
      status = error instanceof Error ? error.message : String(error);
      renderAll();
    }
  }
  function syncFromHost(asReady) {
    const active = currentRequest();
    if (!active?.chatId) {
      activeIdentity = null;
      state = null;
      status = "No active chat";
      send({ type: "ready", active: null });
      renderAll();
      return;
    }
    status = "Loading exact swipe";
    if (asReady) {
      send({ type: "ready", active });
    } else {
      send({ type: "get_state", requestId: requestId("sync"), identity: active });
    }
    send({ type: "get_chat_states", requestId: requestId("chat-states-sync"), chatId: active.chatId });
    send({ type: "list_state_history", requestId: requestId("history-sync"), chatId: active.chatId });
    if (settings.showInjectionPreview) {
      send({ type: "preview_injection", requestId: requestId("preview-sync"), chatId: active.chatId });
    }
    renderAll();
  }
  function identityFromEvent(payload) {
    if (!isRecord(payload) || !isRecord(payload.message)) return null;
    const message = payload.message;
    const chatId = typeof payload.chatId === "string" ? payload.chatId : typeof message.chat_id === "string" ? message.chat_id : null;
    if (!chatId || typeof message.id !== "string" || typeof message.swipe_id !== "number") return null;
    return { chatId, messageId: message.id, swipeId: message.swipe_id };
  }
  async function handlePresetAction(action) {
    const activePreset = settings.modulePreset;
    const presets = settings.customModulePresets || [];
    if (action === "save-as") {
      const pm = ctx.ui.showModal({ title: "Save Custom Preset", width: 440, maxHeight: 300 });
      pm.root.innerHTML = `
        <div class="loomos-root loomos-prompt-dialog" data-skin="${settings.skin}">
          <label class="loomos-field">
            <span>Preset Name</span>
            <input class="loomos-input" type="text" id="preset-name" placeholder="My Custom Preset" required>
          </label>
          <label class="loomos-field">
            <span>Description</span>
            <input class="loomos-input" type="text" id="preset-desc" placeholder="Lite tracking plus cast visuals">
          </label>
          <div class="loomos-dialog-buttons">
            <button type="button" class="loomos-button loomos-button-primary" id="preset-confirm">Save</button>
            <button type="button" class="loomos-button" id="preset-cancel">Cancel</button>
          </div>
        </div>
      `;
      const onConfirm = () => {
        const name = pm.root.querySelector("#preset-name")?.value.trim();
        const desc = pm.root.querySelector("#preset-desc")?.value.trim() || "";
        if (!name) return;
        const newId = crypto.randomUUID();
        const newPreset = {
          id: newId,
          name,
          description: desc,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          moduleSettings: { ...settings.moduleSettings }
        };
        settings.customModulePresets = [...presets, newPreset];
        settings.modulePreset = "custom:" + newId;
        send({ type: "save_settings", requestId: requestId("preset-save"), settings });
        status = `Preset "${name}" saved`;
        pm.dismiss();
        renderAll();
      };
      pm.root.querySelector("#preset-confirm")?.addEventListener("click", onConfirm);
      pm.root.querySelector("#preset-cancel")?.addEventListener("click", () => pm.dismiss());
    }
    if (action === "update" && activePreset.startsWith("custom:")) {
      const presetId = activePreset.substring(7);
      const idx = presets.findIndex((p) => p.id === presetId);
      if (idx >= 0) {
        presets[idx] = {
          ...presets[idx],
          moduleSettings: { ...settings.moduleSettings },
          updatedAt: (/* @__PURE__ */ new Date()).toISOString()
        };
        settings.customModulePresets = [...presets];
        send({ type: "save_settings", requestId: requestId("preset-update"), settings });
        status = `Preset "${presets[idx].name}" updated`;
        renderAll();
      }
    }
    if (action === "duplicate" && activePreset.startsWith("custom:")) {
      const presetId = activePreset.substring(7);
      const original = presets.find((p) => p.id === presetId);
      if (original) {
        const newId = crypto.randomUUID();
        const duplicatePreset = {
          id: newId,
          name: original.name + " (Copy)",
          description: original.description,
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          moduleSettings: { ...original.moduleSettings }
        };
        settings.customModulePresets = [...presets, duplicatePreset];
        settings.modulePreset = "custom:" + newId;
        settings.moduleSettings = { ...original.moduleSettings };
        send({ type: "save_settings", requestId: requestId("preset-dup"), settings });
        status = `Preset duplicated as "${duplicatePreset.name}"`;
        renderAll();
      }
    }
    if (action === "rename" && activePreset.startsWith("custom:")) {
      const presetId = activePreset.substring(7);
      const original = presets.find((p) => p.id === presetId);
      if (!original) return;
      const pm = ctx.ui.showModal({ title: "Rename Preset", width: 440, maxHeight: 240 });
      pm.root.innerHTML = `
        <div class="loomos-root loomos-prompt-dialog" data-skin="${settings.skin}">
          <label class="loomos-field">
            <span>New Name</span>
            <input class="loomos-input" type="text" id="preset-name" value="${escapeHtml(original.name)}" required>
          </label>
          <div class="loomos-dialog-buttons">
            <button type="button" class="loomos-button loomos-button-primary" id="preset-confirm">Rename</button>
            <button type="button" class="loomos-button" id="preset-cancel">Cancel</button>
          </div>
        </div>
      `;
      const onConfirm = () => {
        const name = pm.root.querySelector("#preset-name")?.value.trim();
        if (!name) return;
        const idx = presets.findIndex((p) => p.id === presetId);
        if (idx >= 0) {
          presets[idx] = {
            ...presets[idx],
            name,
            updatedAt: (/* @__PURE__ */ new Date()).toISOString()
          };
          settings.customModulePresets = [...presets];
          send({ type: "save_settings", requestId: requestId("preset-rename"), settings });
          status = `Preset renamed to "${name}"`;
        }
        pm.dismiss();
        renderAll();
      };
      pm.root.querySelector("#preset-confirm")?.addEventListener("click", onConfirm);
      pm.root.querySelector("#preset-cancel")?.addEventListener("click", () => pm.dismiss());
    }
    if (action === "delete" && activePreset.startsWith("custom:")) {
      const presetId = activePreset.substring(7);
      const original = presets.find((p) => p.id === presetId);
      if (!original) return;
      const { confirmed } = await ctx.ui.showConfirm({
        title: "Delete Preset",
        message: `Delete the custom preset "${original.name}"? This cannot be undone.`,
        variant: "danger",
        confirmLabel: "Delete"
      });
      if (confirmed) {
        settings.customModulePresets = presets.filter((p) => p.id !== presetId);
        settings.modulePreset = "balanced";
        settings.moduleSettings = moduleSettingsForPreset("balanced");
        send({ type: "save_settings", requestId: requestId("preset-delete"), settings });
        status = `Preset "${original.name}" deleted`;
        renderAll();
      }
    }
    if (action === "export" && (activePreset.startsWith("custom:") || activePreset === "custom")) {
      let exportObj;
      if (activePreset.startsWith("custom:")) {
        const presetId = activePreset.substring(7);
        const original = presets.find((p) => p.id === presetId);
        if (original) {
          exportObj = original;
        }
      } else {
        exportObj = {
          id: "exported-settings",
          name: "Exported Custom Settings",
          description: "Direct export of unsaved settings",
          createdAt: (/* @__PURE__ */ new Date()).toISOString(),
          updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          moduleSettings: settings.moduleSettings
        };
      }
      if (exportObj) {
        const jsonStr = JSON.stringify(exportObj, null, 2);
        const pm = ctx.ui.showModal({ title: "Export Preset", width: 500, maxHeight: 400 });
        pm.root.innerHTML = `
          <div class="loomos-root loomos-prompt-dialog" data-skin="${settings.skin}">
            <label class="loomos-field">
              <span>Copy JSON Content:</span>
              <textarea class="loomos-input" id="export-json" style="height: 180px; font-family: monospace; font-size: 11px;" readonly>${escapeHtml(jsonStr)}</textarea>
            </label>
            <div class="loomos-dialog-buttons">
              <button type="button" class="loomos-button loomos-button-primary" id="export-copy">Copy to Clipboard</button>
              <button type="button" class="loomos-button" id="export-close">Close</button>
            </div>
          </div>
        `;
        pm.root.querySelector("#export-copy")?.addEventListener("click", async () => {
          try {
            await navigator.clipboard.writeText(jsonStr);
            status = "Copied to clipboard";
            pm.dismiss();
            renderAll();
          } catch {
            const txt = pm.root.querySelector("#export-json");
            if (txt) {
              txt.select();
              document.execCommand("copy");
              status = "Copied to clipboard";
              pm.dismiss();
              renderAll();
            }
          }
        });
        pm.root.querySelector("#export-close")?.addEventListener("click", () => pm.dismiss());
      }
    }
    if (action === "import") {
      const pm = ctx.ui.showModal({ title: "Import Preset", width: 500, maxHeight: 400 });
      pm.root.innerHTML = `
        <div class="loomos-root loomos-prompt-dialog" data-skin="${settings.skin}">
          <label class="loomos-field">
            <span>Paste Preset JSON:</span>
            <textarea class="loomos-input" id="import-json" style="height: 180px; font-family: monospace; font-size: 11px;" placeholder='{
  "name": "My Preset",
  "moduleSettings": { ... }
}' required></textarea>
          </label>
          <div class="loomos-dialog-buttons">
            <button type="button" class="loomos-button loomos-button-primary" id="import-confirm">Import</button>
            <button type="button" class="loomos-button" id="import-cancel">Cancel</button>
          </div>
        </div>
      `;
      const onConfirm = () => {
        const jsonStr = pm.root.querySelector("#import-json")?.value.trim();
        if (!jsonStr) return;
        try {
          const parsed = JSON.parse(jsonStr);
          const result = CustomModulePresetSchema.safeParse({
            id: parsed.id || crypto.randomUUID(),
            name: parsed.name || "Imported Preset",
            description: parsed.description || "Imported from JSON",
            createdAt: parsed.createdAt || (/* @__PURE__ */ new Date()).toISOString(),
            updatedAt: parsed.updatedAt || (/* @__PURE__ */ new Date()).toISOString(),
            moduleSettings: parsed.moduleSettings
          });
          if (result.success) {
            const imported = result.data;
            if (presets.some((p) => p.id === imported.id)) {
              imported.id = crypto.randomUUID();
            }
            settings.customModulePresets = [...presets, imported];
            settings.modulePreset = "custom:" + imported.id;
            settings.moduleSettings = imported.moduleSettings;
            send({ type: "save_settings", requestId: requestId("preset-import"), settings });
            status = `Preset "${imported.name}" imported`;
            pm.dismiss();
            renderAll();
          } else {
            alert("Invalid preset schema: " + result.error.issues.map((i) => i.message).join(", "));
          }
        } catch (err) {
          alert("Failed to parse JSON: " + (err instanceof Error ? err.message : String(err)));
        }
      };
      pm.root.querySelector("#import-confirm")?.addEventListener("click", onConfirm);
      pm.root.querySelector("#import-cancel")?.addEventListener("click", () => pm.dismiss());
    }
  }
  function handleStockModuleAction(action, moduleKey) {
    if (action === "inspect") {
      const entry = MODULE_CATALOG.find((m) => m.key === moduleKey);
      if (!entry) return;
      const ov = settings.stockModuleOverrides?.[moduleKey];
      const schemaStructure = MODULE_SCHEMA_STRUCTURES[moduleKey] || "No structure summary available.";
      const html = `
        <div class="loomos-root loomos-prompt-dialog" data-skin="${settings.skin}">
          <details class="loomos-cast-extra" open>
            <summary>Module Info</summary>
            <div class="loomos-cast-extra-body" style="display:grid;gap:4px;font-size:11px;">
              <p><strong>Key:</strong> <code>${escapeHtml(entry.key)}</code></p>
              <p><strong>Stock Label:</strong> ${escapeHtml(entry.label)}</p>
              <p><strong>Effective Label:</strong> ${escapeHtml(ov?.label || entry.label)}</p>
              <p><strong>Group:</strong> ${escapeHtml(ov?.group || entry.group)}</p>
              <p><strong>Core:</strong> ${entry.core ? "Yes (locked)" : "No"}</p>
              <p><strong>Default Track:</strong> ${BALANCED_MODULE_SETTINGS[entry.key].track} / <strong>Default Display:</strong> ${BALANCED_MODULE_SETTINGS[entry.key].display} / <strong>Default Inject:</strong> ${BALANCED_MODULE_SETTINGS[entry.key].inject}</p>
              <p><strong>Current Track:</strong> ${settings.moduleSettings[entry.key].track} / <strong>Current Display:</strong> ${settings.moduleSettings[entry.key].display} / <strong>Current Inject:</strong> ${settings.moduleSettings[entry.key].inject}</p>
              <p><strong>Intensity:</strong> ${ov?.intensityLabel || entry.intensity}</p>
              ${ov ? `<p><strong style="color:#d58a42;">Overridden fields:</strong> ${Object.keys(ov).join(", ")}</p>` : ""}
            </div>
          </details>
          <details class="loomos-cast-extra">
            <summary>Stock Description</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;"><p>${escapeHtml(entry.description)}</p></div>
          </details>
          ${ov?.description ? `<details class="loomos-cast-extra"><summary>Override Description</summary><div class="loomos-cast-extra-body" style="font-size:11px;"><p>${escapeHtml(ov.description)}</p></div></details>` : ""}
          <details class="loomos-cast-extra">
            <summary>Schema / Structure</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;">
              <pre style="background:var(--loomos-bg);padding:8px;border-radius:6px;overflow-x:auto;white-space:pre-wrap;word-break:break-word;max-width:100%;font-size:10px;line-height:1.45;">${escapeHtml(schemaStructure)}</pre>
              <button type="button" class="loomos-button loomos-btn-sm" data-action="copy-schema" data-copy="${escapeHtml(schemaStructure)}" style="margin-top:6px;">Copy Structure</button>
            </div>
          </details>
          <details class="loomos-cast-extra">
            <summary>Compiler Instruction</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;"><p>${escapeHtml(entry.compilerInstruction)}</p>
            ${ov?.compilerGuidanceAddendum ? `<p><strong>Override addendum:</strong> ${escapeHtml(ov.compilerGuidanceAddendum)}</p>` : ""}</div>
          </details>
          <details class="loomos-cast-extra">
            <summary>Injection Behavior</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;"><p>${escapeHtml(entry.injectionBehavior)}</p>
            ${ov?.injectionPriority ? `<p><strong>Override injection priority:</strong> ${ov.injectionPriority}</p>` : ""}</div>
          </details>
          <details class="loomos-cast-extra">
            <summary>Render Behavior</summary>
            <div class="loomos-cast-extra-body" style="font-size:11px;"><p>${escapeHtml(entry.renderBehavior)}</p>
            ${ov?.renderHint ? `<p><strong>Override render hint:</strong> ${escapeHtml(ov.renderHint)}</p>` : ""}</div>
          </details>
          <div class="loomos-dialog-buttons">
            <button type="button" class="loomos-button loomos-button-primary" data-action="close-inspect">Close</button>
          </div>
        </div>
      `;
      const im = ctx.ui.showModal({ title: `Inspect: ${ov?.label || entry.label}`, width: Math.min(700, window.innerWidth - 16), maxHeight: Math.min(700, window.innerHeight - 32) });
      im.root.className = "loomos-root";
      im.root.innerHTML = html;
      im.root.querySelector("[data-action='close-inspect']")?.addEventListener("click", () => im.dismiss());
      im.root.querySelector("[data-action='copy-schema']")?.addEventListener("click", async (e) => {
        const btn = e.currentTarget;
        const text = btn?.dataset.copy || "";
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = "Copied!";
          setTimeout(() => {
            btn.textContent = "Copy Structure";
          }, 2e3);
        } catch {
          btn.textContent = "Copy failed";
        }
      });
      const dismiss = im.onDismiss(() => {
        dismiss();
      });
      return;
    }
    if (action === "edit") {
      const entry = MODULE_CATALOG.find((m) => m.key === moduleKey);
      if (!entry) return;
      const ov = settings.stockModuleOverrides?.[moduleKey];
      const em = ctx.ui.showModal({ title: `Edit Override: ${ov?.label || entry.label}`, width: Math.min(600, window.innerWidth - 16), maxHeight: Math.min(650, window.innerHeight - 32) });
      em.root.className = "loomos-root";
      em.root.innerHTML = `
        <div class="loomos-prompt-dialog" data-skin="${settings.skin}">
          <label class="loomos-field"><span>Label override</span><input class="loomos-input" type="text" id="sm-label" value="${escapeHtml(ov?.label || "")}" placeholder="${escapeHtml(entry.label)}"></label>
          <label class="loomos-field"><span>Group override</span><input class="loomos-input" type="text" id="sm-group" value="${escapeHtml(ov?.group || "")}" placeholder="${escapeHtml(entry.group)}"></label>
          <label class="loomos-field"><span>Description override</span><input class="loomos-input" type="text" id="sm-desc" value="${escapeHtml(ov?.description || "")}" placeholder="${escapeHtml(entry.description)}"></label>
          <label class="loomos-field"><span>Icon/Emoji</span><input class="loomos-input" type="text" id="sm-icon" value="${escapeHtml(ov?.icon || "")}" placeholder="e.g. \u{1F3AD}" maxlength="20"></label>
          <label class="loomos-field"><span>Display order</span><input class="loomos-input" type="number" id="sm-order" value="${ov?.displayOrder ?? ""}" placeholder="Auto"></label>
          <label class="loomos-field"><span>Intensity label</span><input class="loomos-input" type="text" id="sm-intensity" value="${escapeHtml(ov?.intensityLabel || "")}" placeholder="${escapeHtml(entry.intensity)}"></label>
          <label class="loomos-field"><span>Compiler guidance addendum</span><textarea class="loomos-input" id="sm-addendum" style="height:60px;" placeholder="Extra compiler instruction for this module">${escapeHtml(ov?.compilerGuidanceAddendum || "")}</textarea></label>
          <label class="loomos-field"><span>Injection priority (higher = injected first)</span><input class="loomos-input" type="number" id="sm-priority" value="${ov?.injectionPriority ?? ""}" placeholder="Auto"></label>
          <label class="loomos-field"><span>Render hint</span><input class="loomos-input" type="text" id="sm-render-hint" value="${escapeHtml(ov?.renderHint || "")}" placeholder="Custom render behavior hint"></label>
          <label class="loomos-check" style="margin-top:4px;"><input type="checkbox" id="sm-hidden"${checked(ov?.hiddenFromSettings === true)}><span>Hidden from settings</span></label>
          <label class="loomos-check"><input type="checkbox" id="sm-def-display"${checked(ov?.defaultDisplay === true)}><span>Default display enabled</span></label>
          <label class="loomos-check"><input type="checkbox" id="sm-def-inject"${checked(ov?.defaultInject === true)}><span>Default inject enabled</span></label>
          <div class="loomos-dialog-buttons">
            <button type="button" class="loomos-button loomos-button-primary" id="sm-save">Save Override</button>
            <button type="button" class="loomos-button" id="sm-cancel">Cancel</button>
          </div>
        </div>
      `;
      em.root.querySelector("#sm-save")?.addEventListener("click", () => {
        const override = {};
        const label = em.root.querySelector("#sm-label")?.value.trim();
        if (label) override.label = label;
        const group = em.root.querySelector("#sm-group")?.value.trim();
        if (group) override.group = group;
        const desc = em.root.querySelector("#sm-desc")?.value.trim();
        if (desc) override.description = desc;
        const icon = em.root.querySelector("#sm-icon")?.value.trim();
        if (icon) override.icon = icon;
        const order = em.root.querySelector("#sm-order")?.value;
        if (order) {
          const n = parseInt(order, 10);
          if (!isNaN(n)) override.displayOrder = n;
        }
        const intensity = em.root.querySelector("#sm-intensity")?.value.trim();
        if (intensity) override.intensityLabel = intensity;
        const addendum = em.root.querySelector("#sm-addendum")?.value.trim();
        if (addendum) override.compilerGuidanceAddendum = addendum;
        const priority = em.root.querySelector("#sm-priority")?.value;
        if (priority) {
          const n = parseInt(priority, 10);
          if (!isNaN(n)) override.injectionPriority = n;
        }
        const renderHint = em.root.querySelector("#sm-render-hint")?.value.trim();
        if (renderHint) override.renderHint = renderHint;
        override.hiddenFromSettings = em.root.querySelector("#sm-hidden")?.checked ?? false;
        override.defaultDisplay = em.root.querySelector("#sm-def-display")?.checked ?? false;
        override.defaultInject = em.root.querySelector("#sm-def-inject")?.checked ?? false;
        settings = LoomOSSettingsSchema.parse({
          ...settings,
          stockModuleOverrides: {
            ...settings.stockModuleOverrides,
            [moduleKey]: Object.keys(override).length > 0 ? override : void 0
          }
        });
        send({ type: "save_settings", requestId: requestId("stock-override"), settings });
        status = `Override saved for "${ov?.label || entry.label}"`;
        em.dismiss();
        renderAll();
      });
      em.root.querySelector("#sm-cancel")?.addEventListener("click", () => em.dismiss());
      const dismiss = em.onDismiss(() => {
        dismiss();
      });
      return;
    }
    if (action === "reset") {
      const entry = MODULE_CATALOG.find((m) => m.key === moduleKey);
      if (!entry) return;
      const newOverrides = { ...settings.stockModuleOverrides };
      delete newOverrides[moduleKey];
      settings = LoomOSSettingsSchema.parse({
        ...settings,
        stockModuleOverrides: newOverrides
      });
      send({ type: "save_settings", requestId: requestId("stock-reset"), settings });
      status = `Override reset for "${entry.label}"`;
      renderAll();
      return;
    }
    if (action === "duplicate-as-custom") {
      const key = moduleKey;
      if (!MODULE_KEYS.includes(key)) return;
      const custom2 = createCustomModuleFromStock(
        key,
        settings,
        "cmod_" + crypto.randomUUID().replace(/-/g, "").substring(0, 12)
      );
      settings = LoomOSSettingsSchema.parse({
        ...settings,
        customModules: [...settings.customModules, custom2]
      });
      send({ type: "save_settings", requestId: requestId("stock-duplicate"), settings });
      status = `"${custom2.label}" created`;
      renderAll();
    }
  }
  async function openCustomModuleEditor(original, customMods) {
    const isEdit = Boolean(original);
    let draft = CustomModuleSchema.parse(original ?? {
      id: "cmod_" + crypto.randomUUID().replace(/-/g, "").substring(0, 12),
      label: "New Custom Module",
      group: "Custom",
      description: "",
      enabled: true,
      display: true,
      inject: true,
      compilerInstruction: "Track grounded evidence for this module.",
      outputMode: "cards",
      maxItems: 6,
      intensity: "medium",
      displayOrder: 1e4,
      schemaFields: [],
      htmlTemplate: STARTER_CUSTOM_HTML,
      cssTemplate: STARTER_CUSTOM_CSS,
      templateEngine: "mustache-lite",
      allowHtmlTemplate: false
    });
    let schemaFields = [...draft.schemaFields];
    let editingFieldId = null;
    const pm = ctx.ui.showModal({
      title: isEdit ? "Edit Custom Module" : "Add Custom Module",
      width: Math.min(760, window.innerWidth - 16),
      maxHeight: Math.min(820, window.innerHeight - 32)
    });
    const readDefaultValue = () => {
      const raw = pm.root.querySelector("#field-default")?.value.trim() ?? "";
      if (!raw) return void 0;
      try {
        return JSON.parse(raw);
      } catch {
        return raw;
      }
    };
    const syncDraft = () => {
      const currentLabel = pm.root.querySelector("#mod-label")?.value;
      if (currentLabel === void 0) return;
      draft = {
        ...draft,
        label: currentLabel,
        group: pm.root.querySelector("#mod-group")?.value ?? draft.group,
        description: pm.root.querySelector("#mod-desc")?.value ?? draft.description,
        compilerInstruction: pm.root.querySelector("#mod-instruction")?.value ?? draft.compilerInstruction,
        outputMode: pm.root.querySelector("#mod-output-mode")?.value ?? draft.outputMode,
        intensity: pm.root.querySelector("#mod-intensity")?.value ?? draft.intensity,
        maxItems: Number(pm.root.querySelector("#mod-max")?.value || draft.maxItems),
        displayOrder: Number(pm.root.querySelector("#mod-order")?.value || draft.displayOrder || 1e4),
        allowHtmlTemplate: pm.root.querySelector("#mod-allow-template")?.checked ?? draft.allowHtmlTemplate,
        templateEngine: pm.root.querySelector("#mod-template-engine")?.value ?? draft.templateEngine,
        htmlTemplate: pm.root.querySelector("#mod-html")?.value ?? draft.htmlTemplate,
        cssTemplate: pm.root.querySelector("#mod-css")?.value ?? draft.cssTemplate
      };
    };
    const renderEditor = () => {
      const editing = schemaFields.find((field) => field.id === editingFieldId);
      const previewModule = CustomModuleSchema.parse({
        ...draft,
        label: draft.label.trim() || "Custom Module",
        compilerInstruction: draft.compilerInstruction.trim() || "Track grounded evidence.",
        schemaFields
      });
      pm.root.className = "loomos-root";
      pm.root.innerHTML = `
        <div class="loomos-prompt-dialog loomos-module-editor" data-skin="${settings.skin}">
          <div class="loomos-editor-grid">
            <label class="loomos-field"><span>Label</span><input class="loomos-input" id="mod-label" value="${escapeHtml(draft.label)}"></label>
            <label class="loomos-field"><span>Group</span><input class="loomos-input" id="mod-group" value="${escapeHtml(draft.group)}"></label>
            <label class="loomos-field loomos-full-span"><span>Description</span><input class="loomos-input" id="mod-desc" value="${escapeHtml(draft.description)}"></label>
            <label class="loomos-field loomos-full-span"><span>Compiler Instruction</span><textarea class="loomos-input loomos-editor-textarea" id="mod-instruction" maxlength="1600">${escapeHtml(draft.compilerInstruction)}</textarea></label>
            <label class="loomos-field"><span>Output Mode</span><select class="loomos-select" id="mod-output-mode">
              ${["cards", "bullets", "chips", "gauge", "template"].map(
        (mode) => `<option value="${mode}"${draft.outputMode === mode ? " selected" : ""}>${mode}</option>`
      ).join("")}
            </select></label>
            <label class="loomos-field"><span>Intensity</span><select class="loomos-select" id="mod-intensity">
              ${["light", "medium", "heavy", "experimental"].map(
        (value) => `<option value="${value}"${draft.intensity === value ? " selected" : ""}>${value}</option>`
      ).join("")}
            </select></label>
            <label class="loomos-field"><span>Max Items</span><input class="loomos-input" type="number" id="mod-max" min="1" max="24" value="${draft.maxItems}"></label>
            <label class="loomos-field"><span>Display Order</span><input class="loomos-input" type="number" id="mod-order" value="${draft.displayOrder ?? 1e4}"></label>
          </div>

          <details class="loomos-editor-section" open>
            <summary>Schema Builder <span class="loomos-badge">${schemaFields.length} fields</span></summary>
            <div class="loomos-editor-section-body">
              <div class="loomos-schema-field-list">
                ${schemaFields.map((field, index) => `
                  <div class="loomos-schema-field-row">
                    <div><strong>${escapeHtml(field.label)}</strong><small>${escapeHtml(field.key)} | ${escapeHtml(field.type)}${field.required ? " | required" : ""}</small></div>
                    <div class="loomos-icon-actions">
                      <button type="button" class="loomos-icon-button" data-field-action="up" data-field-id="${escapeHtml(field.id)}" title="Move up"${index === 0 ? " disabled" : ""}>&#8593;</button>
                      <button type="button" class="loomos-icon-button" data-field-action="down" data-field-id="${escapeHtml(field.id)}" title="Move down"${index === schemaFields.length - 1 ? " disabled" : ""}>&#8595;</button>
                      <button type="button" class="loomos-icon-button" data-field-action="edit" data-field-id="${escapeHtml(field.id)}" title="Edit field">Edit</button>
                      <button type="button" class="loomos-icon-button loomos-button-danger" data-field-action="delete" data-field-id="${escapeHtml(field.id)}" title="Delete field">&times;</button>
                    </div>
                  </div>
                `).join("") || `<p class="loomos-muted">No structured fields yet.</p>`}
              </div>
              <div class="loomos-two-column">
                <label class="loomos-field"><span>Field Label</span><input class="loomos-input" id="field-label" value="${escapeHtml(editing?.label ?? "")}"></label>
                <label class="loomos-field"><span>Field Key</span><input class="loomos-input" id="field-key" value="${escapeHtml(editing?.key ?? "")}" placeholder="stableKey"></label>
                <label class="loomos-field"><span>Type</span><select class="loomos-select" id="field-type">
                  ${["text", "longText", "number", "boolean", "enum", "gauge", "chips", "list"].map(
        (type) => `<option value="${type}"${editing?.type === type ? " selected" : ""}>${type}</option>`
      ).join("")}
                </select></label>
                <label class="loomos-check"><input type="checkbox" id="field-required"${checked(editing?.required ?? false)}><span>Required</span></label>
                <label class="loomos-field loomos-full-span"><span>Description</span><input class="loomos-input" id="field-desc" value="${escapeHtml(editing?.description ?? "")}"></label>
                <label class="loomos-field"><span>Default JSON Value</span><input class="loomos-input" id="field-default" value="${escapeHtml(editing?.defaultValue === void 0 ? "" : JSON.stringify(editing.defaultValue))}"></label>
                <label class="loomos-field"><span>Enum Options</span><input class="loomos-input" id="field-enums" value="${escapeHtml(editing?.enumOptions.join(", ") ?? "")}"></label>
                <label class="loomos-field"><span>Max Items</span><input class="loomos-input" type="number" id="field-max-items" min="1" max="50" value="${editing?.maxItems ?? ""}"></label>
                <label class="loomos-field"><span>Display Hint</span><input class="loomos-input" id="field-display-hint" value="${escapeHtml(editing?.displayHint ?? "")}"></label>
                <label class="loomos-field"><span>Minimum</span><input class="loomos-input" type="number" id="field-min" value="${editing?.min ?? ""}"></label>
                <label class="loomos-field"><span>Maximum</span><input class="loomos-input" type="number" id="field-max" value="${editing?.max ?? ""}"></label>
              </div>
              <div class="loomos-dialog-buttons">
                <button type="button" class="loomos-button loomos-button-primary" id="field-save">${editing ? "Update Field" : "Add Field"}</button>
                ${editing ? `<button type="button" class="loomos-button" id="field-cancel">Cancel Edit</button>` : ""}
                <button type="button" class="loomos-button" id="shape-copy">Copy JSON Shape</button>
              </div>
              <pre class="loomos-shape-preview">${escapeHtml(JSON.stringify(customModuleExpectedShape(previewModule), null, 2))}</pre>
            </div>
          </details>

          <details class="loomos-editor-section"${draft.outputMode === "template" ? " open" : ""}>
            <summary>HTML/CSS Template <span class="loomos-badge">Sanitized</span></summary>
            <div class="loomos-editor-section-body">
              <label class="loomos-check"><input type="checkbox" id="mod-allow-template"${checked(draft.allowHtmlTemplate)}><span>Allow sanitized HTML template rendering</span></label>
              <label class="loomos-field"><span>Template Engine</span><select class="loomos-select" id="mod-template-engine">
                <option value="mustache-lite"${draft.templateEngine === "mustache-lite" ? " selected" : ""}>Mustache Lite</option>
                <option value="token-replace"${draft.templateEngine === "token-replace" ? " selected" : ""}>Token Replace</option>
              </select></label>
              <p class="loomos-perf-warning">No scripts, event attributes, iframes, external assets, links, or external CSS. Templates are sanitized and compiled data is escaped.</p>
              <label class="loomos-field"><span>HTML Template</span><textarea class="loomos-input loomos-code-editor" id="mod-html" maxlength="8000">${escapeHtml(draft.htmlTemplate)}</textarea></label>
              <label class="loomos-field"><span>CSS Template</span><textarea class="loomos-input loomos-code-editor" id="mod-css" maxlength="8000">${escapeHtml(draft.cssTemplate)}</textarea></label>
              <div class="loomos-dialog-buttons">
                <button type="button" class="loomos-button" id="template-reset">Reset Starter</button>
                <button type="button" class="loomos-button" id="template-copy">Copy Template</button>
                <button type="button" class="loomos-button loomos-button-primary" id="template-preview">Refresh Preview</button>
              </div>
              <div class="loomos-template-preview" id="template-preview-root"></div>
            </div>
          </details>

          <div class="loomos-dialog-buttons loomos-editor-footer">
            <button type="button" class="loomos-button loomos-button-primary" id="mod-confirm">${isEdit ? "Save Changes" : "Add Module"}</button>
            <button type="button" class="loomos-button" id="mod-cancel">Cancel</button>
          </div>
        </div>`;
      pm.root.querySelector("#field-save")?.addEventListener("click", () => {
        syncDraft();
        const label = pm.root.querySelector("#field-label")?.value.trim() ?? "";
        const key = pm.root.querySelector("#field-key")?.value.trim() ?? "";
        if (!label || !key) {
          status = "Field label and key are required";
          return;
        }
        const maxItemsRaw = pm.root.querySelector("#field-max-items")?.value.trim();
        const minRaw = pm.root.querySelector("#field-min")?.value.trim();
        const maxRaw = pm.root.querySelector("#field-max")?.value.trim();
        const field = CustomModuleFieldSchema.parse({
          id: editing?.id ?? "field_" + crypto.randomUUID().replace(/-/g, "").substring(0, 10),
          label,
          key,
          type: pm.root.querySelector("#field-type")?.value,
          required: pm.root.querySelector("#field-required")?.checked,
          description: pm.root.querySelector("#field-desc")?.value.trim() ?? "",
          defaultValue: readDefaultValue(),
          enumOptions: (pm.root.querySelector("#field-enums")?.value ?? "").split(",").map((value) => value.trim()).filter(Boolean),
          maxItems: maxItemsRaw ? Number(maxItemsRaw) : void 0,
          min: minRaw ? Number(minRaw) : void 0,
          max: maxRaw ? Number(maxRaw) : void 0,
          displayHint: pm.root.querySelector("#field-display-hint")?.value.trim() || void 0
        });
        schemaFields = editing ? schemaFields.map((candidate) => candidate.id === editing.id ? field : candidate) : [...schemaFields, field];
        editingFieldId = null;
        renderEditor();
      });
      pm.root.querySelector("#field-cancel")?.addEventListener("click", () => {
        syncDraft();
        editingFieldId = null;
        renderEditor();
      });
      pm.root.querySelectorAll("[data-field-action]").forEach((button) => {
        button.addEventListener("click", () => {
          syncDraft();
          const fieldId = button.dataset.fieldId;
          const fieldAction = button.dataset.fieldAction;
          const index = schemaFields.findIndex((field) => field.id === fieldId);
          if (index < 0) return;
          if (fieldAction === "edit") editingFieldId = fieldId ?? null;
          if (fieldAction === "delete") schemaFields = schemaFields.filter((field) => field.id !== fieldId);
          if (fieldAction === "up" && index > 0) {
            [schemaFields[index - 1], schemaFields[index]] = [schemaFields[index], schemaFields[index - 1]];
          }
          if (fieldAction === "down" && index < schemaFields.length - 1) {
            [schemaFields[index], schemaFields[index + 1]] = [schemaFields[index + 1], schemaFields[index]];
          }
          renderEditor();
        });
      });
      pm.root.querySelector("#shape-copy")?.addEventListener("click", async () => {
        syncDraft();
        const module = CustomModuleSchema.parse({
          ...draft,
          label: draft.label.trim() || "Custom Module",
          compilerInstruction: draft.compilerInstruction.trim() || "Track grounded evidence.",
          schemaFields
        });
        await navigator.clipboard.writeText(JSON.stringify(customModuleExpectedShape(module), null, 2));
        status = "Expected JSON shape copied";
      });
      pm.root.querySelector("#template-reset")?.addEventListener("click", () => {
        syncDraft();
        draft.htmlTemplate = STARTER_CUSTOM_HTML;
        draft.cssTemplate = STARTER_CUSTOM_CSS;
        renderEditor();
      });
      pm.root.querySelector("#template-copy")?.addEventListener("click", async () => {
        syncDraft();
        await navigator.clipboard.writeText(`${draft.htmlTemplate}

/* CSS */
${draft.cssTemplate}`);
        status = "Template copied";
      });
      pm.root.querySelector("#template-preview")?.addEventListener("click", () => {
        syncDraft();
        const module = CustomModuleSchema.parse({
          ...draft,
          label: draft.label.trim() || "Custom Module",
          compilerInstruction: draft.compilerInstruction.trim() || "Track grounded evidence.",
          schemaFields
        });
        const sample = CustomModuleDataSchema.parse({
          ...customModuleExpectedShape(module),
          summary: "Live sanitized preview",
          items: [{
            title: "Sample Item",
            text: "Compiled data is escaped before insertion.",
            importance: "medium",
            changed: false
          }]
        });
        const preview = renderCustomTemplate(module, sample);
        const root = pm.root.querySelector("#template-preview-root");
        if (root) {
          root.innerHTML = `<style>${preview.css}</style><section class="loomos-custom-template ${preview.wrapperClass}">${preview.html}</section>`;
        }
      });
      pm.root.querySelector("#mod-confirm")?.addEventListener("click", () => {
        syncDraft();
        const validated = CustomModuleSchema.parse({
          ...draft,
          label: draft.label.trim(),
          group: draft.group.trim() || "Custom",
          description: draft.description.trim(),
          compilerInstruction: draft.compilerInstruction.trim(),
          schemaFields
        });
        settings = LoomOSSettingsSchema.parse({
          ...settings,
          customModules: isEdit ? customMods.map((module) => module.id === validated.id ? validated : module) : [...customMods, validated]
        });
        send({ type: "save_settings", requestId: requestId("custom-mod"), settings });
        status = isEdit ? `Custom module "${validated.label}" updated` : `Custom module "${validated.label}" added`;
        pm.dismiss();
        renderAll();
      });
      pm.root.querySelector("#mod-cancel")?.addEventListener("click", () => pm.dismiss());
    };
    renderEditor();
  }
  async function handleCustomModuleAction(action, moduleId) {
    const customMods = settings.customModules || [];
    if (action === "add" || action === "edit" && moduleId) {
      const original = action === "edit" ? customMods.find((m) => m.id === moduleId) : void 0;
      if (action === "edit" && !original) return;
      await openCustomModuleEditor(original, customMods);
      return;
    }
    if (action === "duplicate" && moduleId) {
      const original = customMods.find((m) => m.id === moduleId);
      if (original) {
        const newId = "cmod_" + crypto.randomUUID().replace(/-/g, "").substring(0, 12);
        const dup = CustomModuleSchema.parse({
          ...original,
          id: newId,
          label: original.label + " (Copy)",
          enabled: original.enabled,
          display: original.display,
          inject: original.inject
        });
        settings.customModules = [...customMods, dup];
        send({ type: "save_settings", requestId: requestId("custom-dup"), settings });
        status = `Custom module duplicated as "${dup.label}"`;
        renderAll();
      }
    }
    if (action === "delete" && moduleId) {
      const original = customMods.find((m) => m.id === moduleId);
      if (!original) return;
      const { confirmed } = await ctx.ui.showConfirm({
        title: "Delete Custom Module",
        message: `Delete custom module "${original.label}"? Old states containing this module's compiled data will retain their data but it will no longer compile on new generations.`,
        variant: "danger",
        confirmLabel: "Delete"
      });
      if (confirmed) {
        settings.customModules = customMods.filter((m) => m.id !== moduleId);
        send({ type: "save_settings", requestId: requestId("custom-delete"), settings });
        status = `Custom module "${original.label}" deleted`;
        renderAll();
      }
    }
  }
  function handleBulkAction(action) {
    const query = tab.root.querySelector("[data-module-search]")?.value.trim().toLowerCase() ?? "";
    const matchesQuery = (label, group, description) => {
      if (!query) return true;
      const text = `${label} ${group} ${description}`.toLowerCase();
      return text.includes(query);
    };
    if (action === "enable-display") {
      for (const m of getEffectiveModuleCatalog(settings)) {
        if (matchesQuery(m.label, m.group, m.description)) {
          settings.moduleSettings[m.key].display = true;
        }
      }
      if (settings.customModules) {
        for (const m of settings.customModules) {
          if (matchesQuery(m.label, m.group, m.description || "")) {
            m.display = true;
          }
        }
      }
      status = "Enabled display for matches";
    }
    if (action === "disable-display") {
      for (const m of getEffectiveModuleCatalog(settings)) {
        if (matchesQuery(m.label, m.group, m.description)) {
          settings.moduleSettings[m.key].display = false;
        }
      }
      if (settings.customModules) {
        for (const m of settings.customModules) {
          if (matchesQuery(m.label, m.group, m.description || "")) {
            m.display = false;
          }
        }
      }
      status = "Disabled display for matches";
    }
    if (action === "inject-recommended") {
      for (const m of getEffectiveModuleCatalog(settings)) {
        settings.moduleSettings[m.key].inject = m.defaultControl.inject;
      }
      status = "Reset injection to recommended modules";
    }
    if (action === "reset-presets") {
      const activePreset = settings.modulePreset;
      if (activePreset === "custom" || activePreset.startsWith("custom:")) {
        applyModulePreset("balanced");
      } else {
        applyModulePreset(activePreset);
      }
      return;
    }
    if (action === "reset-all-overrides") {
      settings = LoomOSSettingsSchema.parse({
        ...settings,
        stockModuleOverrides: {}
      });
      send({ type: "save_settings", requestId: requestId("reset-overrides"), settings });
      status = "All stock module overrides reset";
      saveCurrentSettingsDebounced();
      renderAll();
      return;
    }
    saveCurrentSettingsDebounced();
    renderAll();
  }
  function handleBackendMessage(payload) {
    if (!isRecord(payload) || typeof payload.type !== "string") return;
    const response = payload;
    switch (response.type) {
      case "bootstrap":
        settings = response.settings;
        permissions = response.permissions;
        connections = response.connections;
        activeIdentity = response.identity;
        state = response.state;
        status = response.identity ? response.state ? "Exact swipe state loaded" : "Ready to generate" : "No active message";
        if (activeIdentity?.chatId) {
          send({ type: "get_chat_states", requestId: requestId("chat-states"), chatId: activeIdentity.chatId });
          send({ type: "list_state_history", requestId: requestId("history"), chatId: activeIdentity.chatId });
          if (settings.showInjectionPreview) {
            send({ type: "preview_injection", requestId: requestId("preview"), chatId: activeIdentity.chatId });
          }
        }
        break;
      case "settings":
        settings = response.settings;
        status = "Settings saved";
        break;
      case "connections":
        connections = response.connections;
        status = connections.length > 0 ? "Connections refreshed" : "No ready connections found";
        break;
      case "state":
        activeIdentity = response.identity;
        state = response.state;
        status = response.state ? "Exact swipe state loaded" : "No state for this swipe";
        if (activeIdentity?.chatId) {
          send({ type: "get_chat_states", requestId: requestId("chat-states"), chatId: activeIdentity.chatId });
          send({ type: "list_state_history", requestId: requestId("history"), chatId: activeIdentity.chatId });
          if (settings.showInjectionPreview) {
            send({ type: "preview_injection", requestId: requestId("preview"), chatId: activeIdentity.chatId });
          }
        }
        break;
      case "permissions":
        permissions = response.permissions;
        status = "Permissions updated";
        break;
      case "generation_status":
        if (response.report) pipeline = response.report;
        if (response.status === "started" || response.status === "progress") {
          activeGenerationRequestId = response.requestId;
          if (response.identity) activeIdentity = response.identity;
          status = response.message ?? "Compiling story state";
        } else {
          if (activeGenerationRequestId === response.requestId) activeGenerationRequestId = null;
          stopElapsedTimer();
          status = response.message ?? (response.status === "completed" ? "State compiled" : response.status);
          if (activeIdentity?.chatId) {
            send({ type: "get_chat_states", requestId: requestId("chat-states"), chatId: activeIdentity.chatId });
          }
        }
        break;
      case "chat_states":
        if (response.chatId === ctx.getActiveChat().chatId) {
          chatStates = response.states;
          refreshAllMessageWidgets();
        }
        break;
      case "state_history":
        historyItems = response.items;
        break;
      case "injection_preview":
        injectionPreview = response.preview;
        break;
      case "error":
        if (response.requestId === activeGenerationRequestId) {
          activeGenerationRequestId = null;
          stopElapsedTimer();
        }
        status = response.message;
        break;
    }
    renderAll();
  }
  function handleActionClick(event) {
    const target = event.target;
    if (!target) return;
    const tabBtn = target.closest("[data-tab]");
    if (tabBtn) {
      const newTab = tabBtn.dataset.tab;
      if (newTab && newTab !== activeTab) {
        activeTab = newTab;
        renderAll();
      }
      return;
    }
    const actionBtn = target.closest("[data-action]");
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      if (action === "viewer") openViewer();
      if (action === "generate") startGeneration();
      if (action === "reload") reloadState();
      if (action === "cancel" && activeGenerationRequestId) {
        send({ type: "cancel_generation", requestId: activeGenerationRequestId });
      }
      if (action === "delete") void deleteCurrentState();
      if (action === "permissions") void requestPermissions();
      if (action === "what-changed" && state) void showWhatChangedModal();
      if (action === "copy-debug-report" && pipeline?.debugReport) {
        void navigator.clipboard.writeText(pipeline.debugReport).then(() => {
          status = "Debug report copied";
          renderAll();
        });
      }
      if (action === "clear-search") {
        const searchInput = tab.root.querySelector("[data-module-search]");
        if (searchInput) {
          searchInput.value = "";
          renderAll();
        }
      }
      return;
    }
    const presetBtn = target.closest("[data-preset-action]");
    if (presetBtn) {
      const actionCamel = presetBtn.getAttribute("data-preset-action");
      if (actionCamel) void handlePresetAction(actionCamel);
      return;
    }
    const stockBtn = target.closest("[data-stock-action]");
    if (stockBtn) {
      const action = stockBtn.getAttribute("data-stock-action");
      const key = stockBtn.getAttribute("data-stock-key");
      if (action && key) handleStockModuleAction(action, key);
      return;
    }
    const customBtn = target.closest("[data-custom-action]");
    if (customBtn) {
      const action = customBtn.getAttribute("data-custom-action");
      const id = customBtn.getAttribute("data-custom-id") || void 0;
      if (action) void handleCustomModuleAction(action, id);
      return;
    }
    const bulkBtn = target.closest("[data-bulk-action]");
    if (bulkBtn) {
      const action = bulkBtn.getAttribute("data-bulk-action");
      if (action) handleBulkAction(action);
      return;
    }
  }
  function handleRootChange(event) {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    if (target.dataset.setting === "modulePreset") {
      applyModulePreset(target.value);
      return;
    }
    if (target.matches("[data-module], [data-custom-module]")) {
      if (!settings.modulePreset.startsWith("custom:")) {
        settings.modulePreset = "custom";
        const selectEl = tab.root.querySelector('[data-setting="modulePreset"]');
        if (selectEl) selectEl.value = "custom";
      }
      saveCurrentSettingsDebounced();
    } else if (target.matches("[data-setting]")) {
      saveCurrentSettingsDebounced();
    }
  }
  function handleRootInput(event) {
    const target = event.target;
    if (!target?.matches("[data-module-search]")) return;
    const query = target.value.trim().toLowerCase();
    tab.root.querySelectorAll("[data-module-row]").forEach((row) => {
      row.hidden = Boolean(query) && !(row.dataset.search ?? "").includes(query);
    });
    const allModules = tab.root.querySelectorAll("[data-module-row]");
    const visibleModules = tab.root.querySelectorAll("[data-module-row]:not([hidden])");
    const countSpan = tab.root.querySelector(".loomos-search-count");
    if (countSpan) {
      countSpan.textContent = `${visibleModules.length} of ${allModules.length} shown`;
    }
    const clearBtn = tab.root.querySelector('[data-action="clear-search"]');
    if (clearBtn) {
      clearBtn.style.display = query ? "block" : "none";
    }
  }
  tab.root.addEventListener("click", handleActionClick);
  tab.root.addEventListener("change", handleRootChange);
  tab.root.addEventListener("input", handleRootInput);
  cleanups.push(() => tab.root.removeEventListener("click", handleActionClick));
  cleanups.push(() => tab.root.removeEventListener("change", handleRootChange));
  cleanups.push(() => tab.root.removeEventListener("input", handleRootInput));
  cleanups.push(inputAction.onClick(openViewer));
  cleanups.push(tab.onActivate(() => syncFromHost(false)));
  cleanups.push(ctx.onBackendMessage(handleBackendMessage));
  cleanups.push(ctx.events.on("CHAT_SWITCHED", () => syncFromHost(true)));
  cleanups.push(ctx.events.on("MESSAGE_SENT", () => syncFromHost(false)));
  cleanups.push(ctx.events.on("MESSAGE_EDITED", () => syncFromHost(false)));
  cleanups.push(ctx.events.on("MESSAGE_SWIPED", (payload) => {
    const identity = identityFromEvent(payload);
    const latest = ctx.messages.getLatestMessageId();
    if (identity?.messageId && identity.messageId === latest) {
      status = "Loading selected swipe";
      send({ type: "get_state", requestId: requestId("swipe"), identity });
      send({ type: "get_chat_states", requestId: requestId("chat-states-swipe"), chatId: identity.chatId });
      send({ type: "list_state_history", requestId: requestId("history-swipe"), chatId: identity.chatId });
      renderAll();
    }
  }));
  cleanups.push(ctx.events.on("SWIPE_EDITED", (payload) => {
    const identity = identityFromEvent(payload);
    if (identity) {
      send({ type: "get_state", requestId: requestId("swipe-edit"), identity });
      send({ type: "get_chat_states", requestId: requestId("chat-states-swipe-edit"), chatId: identity.chatId });
      send({ type: "list_state_history", requestId: requestId("history-swipe-edit"), chatId: identity.chatId });
    }
  }));
  cleanups.push(ctx.events.on("CHARACTER_MESSAGE_RENDERED", refreshAllMessageWidgets));
  cleanups.push(ctx.events.on("USER_MESSAGE_RENDERED", refreshAllMessageWidgets));
  renderAll();
  syncFromHost(true);
  return () => {
    if (disposed) return;
    const chatId = ctx.getActiveChat().chatId ?? void 0;
    send({ type: "frontend_disposed", chatId });
    if (activeGenerationRequestId) {
      send({ type: "cancel_generation", requestId: activeGenerationRequestId });
    }
    disposed = true;
    stopElapsedTimer();
    clearAllMessageWidgets();
    modalListenerCleanup?.();
    modalListenerCleanup = null;
    for (const cleanup of cleanups.splice(0).reverse()) {
      try {
        cleanup();
      } catch {
      }
    }
    inputAction.destroy();
    tab.destroy();
    removeStyle();
    ctx.dom.cleanup();
  };
}
export {
  setup
};
