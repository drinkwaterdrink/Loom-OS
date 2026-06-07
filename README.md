# LoomOS Command Deck

Current release: **0.1.5**

LoomOS is a full-stack Lumiverse Spindle extension that compiles roleplay chat history into an exact-swipe, structured story operating system. It tracks what changed, what must remain true, where everyone and everything is, which story threads are active, and what compact context is useful for future replies.

---

## Key Features & Upgrades in 0.1.5

- **Normalization V2 fallback path**: Compiler JSON is normalized into a complete minimum State V2 shell before strict validation. If the first output and the single repair output both remain invalid, LoomOS saves a minimal valid exact-swipe fallback state instead of leaving the tracker empty.
- **Expanded shape repair**: Goals, pockets, relationships, impossible moves, scene items, pending consequences, banned next actions, terms, gauges, enums, world rows, tools, and custom module data are coerced where safe without inventing story facts.
- **Stock module effective catalog**: Built-in modules now use a merged effective catalog for labels, descriptions, groups, icons, ordering, hidden state, default Display/Inject values, prompt guidance, inspector output, and duplicate-as-custom creation.
- **Custom module schema builder**: Custom modules support typed fields (`text`, `longText`, `number`, `boolean`, `enum`, `gauge`, `chips`, `list`) with reorderable definitions, default values, enum options, min/max constraints, max item limits, display hints, and a copyable expected JSON shape.
- **Safe HTML/CSS templates**: Custom modules can render escaped compiled data through user-authored templates. Scripts, iframes, forms, event handlers, URL attributes, inline styles, external CSS/assets, unsafe CSS URLs, fixed/sticky positioning, and z-index rules are stripped; CSS selectors are scoped to the module wrapper.
- **Better diagnostics**: The pipeline panel shows normalization, fallback, and the first validation issues, with a copyable debug report for deeper troubleshooting.

---

## Table of Contents

- [Dashboard Tabs](#dashboard-tabs)
- [Sticky Header Controls](#sticky-header-controls)
- [State History Timeline](#state-history-timeline)
- [Injection Preview Panel](#injection-preview-panel)
- [What Changed Modal](#what-changed-modal)
- [Latest-Message Tracker Widget](#latest-message-tracker-widget)
- [Tracker Modules Catalog](#tracker-modules-catalog)
- [Track / Display / Inject Controls](#track--display--inject-controls)
- [Settings Reference](#settings-reference)
- [Theme Skins](#theme-skins)
- [Prompt Injection Priority](#prompt-injection-priority)
- [State V2 Schema](#state-v2-schema)
- [Exact Swipe & History Architecture](#exact-swipe--history-architecture)
- [Safety and Permissions](#safety-and-permissions)
- [Development and Testing](#development-and-testing)
- [Installation in Lumiverse](#installation-in-lumiverse)

---

## Dashboard Tabs

The drawer and viewer modal present compiled state through six navigation tabs. Tab state, scroll position, and collapsible section states are preserved across re-renders.

### Overview
A high-level summary block showing the current delta headline, location and timeframe, plus inline counts for active cast members, story threads, continuity risks, active module count, and injection status. Below the overview are expandable sections for:

- **Kernel** — Scene name, current focus, summary, POV, tone, objective, risk, stop mode, and constraints.
- **Delta** — Headline, all changes with importance badges (low/medium/high/critical), carried-forward facts, and newly-established facts.
- **Meters** — Diagnostic gauges (tension, danger, coherence, etc.) with trend indicators, bar visualization, and band labels.
- **Tools** — Action Resolver, Dialogue State, Director Style, Closeness State, and Image Prompt cards (visibility controlled by settings).
- **Custom Modules** — User-defined module cards rendered in their configured output mode (cards, bullets, chips, gauge, or sanitized template).

### Cast
Full cast matrix with all tracked characters. Each card shows name, kind (POV/main/NPC/crowd), quantity, awareness level, location, emotional state, threat rating, intent, and status. A collapsible "Visuals & Pockets" section contains pose, proximity, hands, visual anchor, clothing summary, goals, relationships, pocket inventories, and stable facts. Card visibility respects per-module Display settings.

### World
Spatial and environmental state:
- **Scene** — Privacy level, observer pressure, crowd noise/flow, lighting, exit accessibility, line-of-sight, spatial facts, and carryover (body/room/social).
- **Scene Items** — Named items with owner, location, condition, and last touch (requires Inventory display enabled).
- **World State** — Recent environmental changes, active hazards, rumors (with credibility scores), and loaded signs (with state indicators). Secrets & Rumors display is toggleable.

### Story
Narrative structure:
- **Thread Loom** — All threads with title, status, urgency, progress bar, and next pressure. Live threads are counted in the section header.
- **Goals** — Character goals with status indicators.
- **Stakes** — Win/lose conditions per character.
- **Countdowns** — Timed events with remaining turns.
- **Autonomy Queue** — Pending NPC actions and interruption conditions.

### Continuity
The **Continuity Firewall** protects story coherence:
- **Explainer** — A descriptive introduction explaining the Firewall's purpose.
- **Metrics Bar** — Counts of established facts, anti-retcon anchors, pending consequences, and offscreen state items.
- **Risk Cards** — Each detected conflict rendered as a card with severity badge (low/medium/high/critical), evidence, and guardrail recommendation. When no conflicts exist, a green safe-state banner is shown.
- **Established Facts & Anchors** — Collapsible lists of all tracked facts and retcon-prevention anchors.
- **Consequences & Offscreen** — Pending narrative consequences and offscreen state items.
- **Banned / Impossible Next** — Moves the story should avoid, with persistence flags.
- **Audit Log** — Compiler steps, validation results, and repair history.

### History
The **State History Timeline** shows every state snapshot generated for the active chat, sorted newest-first. Each entry displays:
- Scene name and generation timestamp
- Repaired badge (if applicable)
- Kernel focus, location, and time
- Cast, thread, and risk counts
- Delta headline

Use the search bar to filter by scene, focus, location, or message ID. Click **Load** to inspect any historical snapshot. The currently active state is highlighted. Delete buttons remove unwanted snapshots from storage.

---

## Sticky Header Controls

A sticky command bar pins to the top of both the drawer and viewer modal:

| Button | Action |
|---|---|
| **What Changed** | Opens the delta-focused modal showing exactly what changed in this state |
| **Generate / Stop Compile** | Single button that dynamically toggles between "Generate" (or "Refresh") and a pulsing "Stop Compile" during active compilation |
| **Reload** | Refresh exact-swipe state from storage |
| **Delete** | Remove the current exact-swipe snapshot |
| **Enable** | Request missing Lumiverse permissions when needed |

---

## State History Timeline

Accessed via the **History** tab. All states are listed newest-first with full metadata. The search bar supports real-time filtering across scene, focus, location, and message ID fields. Click **Load** to replace the current dashboard view with the selected historical state. The actively-loaded state is visually distinguished. The **Delete** button on each entry removes the snapshot from storage (no confirmation dialog — use with care).

The history is fetched on every state sync and stored in memory for the session.

---

## Injection Preview Panel

When `showInjectionPreview` is enabled in Settings, a dedicated panel appears showing the exact compact injection text that would be sent to the LLM on future generations.

**Panel contents:**
- Token count vs configured budget (colored green if within budget, red if over)
- Warning banner when the budget is exceeded
- Lists of included and omitted modules
- Token bar visualization showing percentage of budget used
- Collapsible `<details>` section with the full injection text in a monospace `<pre>` block
- **Copy** button to copy the injection text to clipboard

The preview is regenerated each time the state syncs or when the setting is toggled.

---

## What Changed Modal

Opened via the **What Changed** button in the sticky header. Provides a focused delta breakdown:

- **Headline** — The one-line summary of the most important change.
- **Changes** — Each change rendered with a `+` icon, full text, module name, age (e.g., "this turn"), and importance badge.
- **Carried Forward** — Facts that persisted from the previous state.
- **Newly Established** — Facts established for the first time in this state.
- **Scene Context** — Current location, time, and focus for spatial reference.

---

## Latest-Message Tracker Widget

When viewing the latest message in a chat, LoomOS renders a widget bar beneath the message. The widget shows:
- **Open Tracker** button — Opens the full LoomOS dashboard in a modal for the exact message/swipe.
- Module status chips indicating which modules are active.

Each message-swipe combination gets a unique widget ID, so multiple swipes in the same conversation each have their own independent LoomOS widget.

---

## Tracker Modules Catalog

LoomOS has 18 built-in modules and unlimited custom modules:

| Group | Module Key | Description | Core (locked Track) |
|---|---|---|---|
| **Core** | `sceneKernel` | Basic scene details, POV, objective, and stop triggers | ✅ |
|  | `deltas` | Direct diff comparison between the previous turn and the current | ✅ |
| **Scene** | `meters` | Tension, danger, and coherence diagnostic gauges | |
| **Cast** | `castCore` | Core presence, status, goals, and visual anchors | ✅ |
|  | `castVisuals` | Spatial arrangement, poses, and Spotlight metrics | |
|  | `clothing` | Grounded clothing and wardrobe continuity | |
|  | `relationships` | Emotional standings and character alignments | |
|  | `inventory` | Pocket inventories and item conditions | |
| **World** | `worldSpace` | Environmental changes, active hazards, and scene items | |
|  | `secretsRumors` | Hidden secrets and reader-visible clues | |
| **Story** | `storyThreads` | Escalation countdowns, goals, stakes, and thread progressions | ✅ |
|  | `continuity` | Banned next actions, retcon blockers, and offscreen state | ✅ |
| **Tools** | `actionResolver` | Action resolving, blocker checking, and world response | |
|  | `dialogueState` | Social masks, taboos, and current conversational thread | |
|  | `directorStyle` | Mask constraints, voice cues, and push direction | |
|  | `closenessState` | Emotional/physical closeness and boundaries | |
|  | `imagePrompt` | Dynamic text-to-image prompts for scenes | |
| **System** | `auditLog` | Compiler steps, validation failures, and repairs | |

Five continuity-critical modules are locked **Track: on** for system safety. Their Display and Inject controls remain freely configurable.

---

## Track / Display / Inject Controls

Every module has three independent toggles configured in the **Settings** tab under the Module Groups accordion:

| Toggle | Effect |
|---|---|
| **Track** | Include the module in the LLM's state compiler output. When off, the module is excluded from compilation entirely. |
| **Display** | Render the module's dashboard panels in the drawer and modal. When off, the module's data is still tracked and injected but not shown in the UI. |
| **Inject** | Append the compiled module data to the next prompt injection payload. When off, the module is tracked and displayed but not sent to the LLM as context. |

Toggle buttons are 44px minimum-height touch targets meeting mobile accessibility standards. Each button shows a checkbox and label. Active modules show a highlighted accent state. Core modules display a locked indicator on their Track toggle.

---

## Settings Reference

All settings are stored in `settings.json` inside `spindle.userStorage`.

| Setting | Default | Range | Description |
|---|---|---|---|
| `skin` | `"auto"` | auto, dark_academia, cyberpunk, fantasy, horror, noir, minimal | Visual theme |
| `autoGeneration` | `"manual"` | off, assistant, every, manual | Automatic generation trigger |
| `injectionEnabled` | `false` | boolean | Enable compact prompt injection |
| `showInjectionPreview` | `false` | boolean | Show injection preview panel in drawer |
| `injectionTokenBudget` | `320` | 80–1600 | Max tokens for compact injection |
| `compilerSeedTokenBudget` | `900` | 200–2400 | Max tokens for compiler seed context |
| `recentMessageLimit` | `24` | 4–80 | Number of recent messages to compile |
| `generationTimeoutSeconds` | `180` | 30–300 | LLM generation timeout |
| `connectionId` | `""` | string (max 200) | Preferred Lumiverse connection ID |
| `modulePreset` | `"balanced"` | string | Active module preset name |
| `moduleSettings` | (balanced defaults) | per-module object | Per-module Track/Display/Inject toggles |
| `customModulePresets` | `[]` | array | Saved module preset configurations |
| `customModules` | `[]` | array | User-defined custom tracking modules |

### Custom Module Configuration

Each custom module has these fields:

| Field | Default | Description |
|---|---|---|
| `id` | (required) | Unique identifier (1-160 chars) |
| `label` | (required) | Display name (1-160 chars) |
| `group` | `"Custom"` | Module group for the settings accordion |
| `description` | `""` | Short description (max 500 chars) |
| `enabled` | `true` | Whether the module is active |
| `display` | `true` | Whether to render dashboard panels |
| `inject` | `true` | Whether to include in prompt injection |
| `compilerInstruction` | (required) | LLM instruction for what to track (max 1600 chars) |
| `outputMode` | `"cards"` | Render format: cards, bullets, chips, gauge, or sanitized template |
| `schemaFields` | `[]` | Typed custom field definitions used for compiler validation and rendering |
| `htmlTemplate` / `cssTemplate` | `""` | User-authored template source, capped at 8,000 characters each |
| `allowHtmlTemplate` | `false` | Opt-in switch for sanitized HTML/CSS template rendering |
| `maxItems` | `6` | Max items to track (1-24) |

### Module Preset Manager

The Settings tab includes a preset manager for saving and loading module configurations:

| Action | Description |
|---|---|
| **Save As** | Capture current module checklist and save under a custom name |
| **Update** | Apply current checklist states to the active preset |
| **Duplicate** | Clone an existing preset |
| **Rename** | Change preset name or description |
| **Delete** | Remove a preset |
| **Import/Export** | Serialize presets to/from JSON |

---

## Theme Skins

Seven built-in CSS skins, selected via the `skin` setting:

| Skin | Description |
|---|---|
| **Auto** | Adapts to the host Lumiverse theme |
| **Dark Academia** | Warm scholarly browns and golds |
| **Cyberpunk** | Neon teals, deep navy, and bright accents |
| **Fantasy** | Forest greens, earthy tones, and gold |
| **Horror** | Blood reds, charcoal, and stark contrast |
| **Noir** | Pure grayscale with sharp black/white |
| **Minimal** | Clean light-mode with subtle borders |

---

## Prompt Injection Priority

When compact injection is active, LoomOS inserts state data into future generations according to a strict priority schedule under the configured token budget:

1. Turn Deltas and headlines
2. Scene Kernel, location, and constraints
3. Continuity Firewall anchors and consequences
4. Action Resolver state
5. Cast Core poses, intent, and goals
6. Spatial coordinates, pocket inventory, and active countdowns
7. Rumors, secrets, and custom modules (with budget headroom)

Modules with Inject disabled are excluded. The budget is checked after each priority tier, and lower-priority data is truncated if the budget is exceeded.

---

## State V2 Schema

Each compiled state contains the following structure:

```json
{
  "schemaVersion": 2,
  "identity": { "chatId": "...", "messageId": "...", "swipeId": 0 },
  "generatedAt": "ISO Timestamp",
  "source": {
    "messageCount": 0,
    "repaired": false,
    "seedIdentity": { "chatId": "...", "messageId": "...", "swipeId": 0 },
    "connectionId": "..."
  },
  "activeModules": ["sceneKernel", "deltas", "castCore"],
  "kernel": { "scene": "...", "location": "...", "pov": "...", "constraints": [], ... },
  "delta": { "headline": "...", "changes": [], "carriedForward": [], "newlyEstablished": [] },
  "meters": [ { "id": "tension", "label": "Tension", "value": 50, "trend": "steady", ... } ],
  "scene": { "privacy": "semi-private", "access": { "exit": "WATCHED", ... }, "items": [], ... },
  "castMatrix": [ { "id": "mara", "name": "Mara", "kind": "pov", "pockets": [], ... } ],
  "worldState": { "recentEnvironmentalChanges": [], "activeHazards": [], "rumors": [], ... },
  "storyState": { "threadLoom": [], "goals": [], "stakes": [], "countdowns": [], ... },
  "continuityFirewall": { "establishedFacts": [], "risks": [], "bannedNext": [], ... },
  "tools": { "actionResolver": {}, "dialogueState": null, ... },
  "auditLog": [ { "system": "compiler", "result": "Valid State V2", ... } ],
  "customModuleData": [
    {
      "moduleId": "custom-mod-id",
      "label": "Sanity Tracker",
      "summary": "Mara's sanity is wavering",
      "items": [
        { "title": "Sanity Level", "text": "65% - Unsettled", "importance": "medium" }
      ]
    }
  ]
}
```

---

## Exact Swipe & History Architecture

LoomOS relies on exact swipe tracking. State documents are stored using the path:

```
chats/{chatId}/messages/{messageId}/swipes/{swipeId}.json
```

### State Lifecycle

1. **Discovery** — When a user opens a chat or swipes to a different message, LoomOS discovers the active identity (chat, message, swipe).
2. **Seed Loading** — It searches backwards through the chat's message history to find the nearest valid compiled state as compiler seed context.
3. **Compilation** — The compiler sends the seed + recent transcript to the LLM, requesting a new structured state with delta changes.
4. **Repair** — If the LLM output fails Zod schema validation, a single repair pass re-prompts the LLM with the validation errors.
5. **Storage** — The valid (or repaired) state is persisted to `spindle.userStorage` under the exact identity path.
6. **Injection** — When `injectionEnabled` is on, the compact state is injected into subsequent outgoing messages.

### History Timeline

The State History Timeline (`list_state_history`) loads all state files for the current chat, extracts a summary from each, and returns them sorted by `generatedAt` descending. The frontend caches these in memory and supports search filtering and per-entry deletion.

---

## Safety and Permissions

LoomOS requires three Lumiverse permissions:

| Permission | Usage | Degraded Behavior |
|---|---|---|
| `generation` | Running quiet compiler steps and listing active LLM connections | Generate controls remain disabled |
| `chat_mutation` | Reading chat history via `spindle.chat.getMessages()` (LoomOS never mutates messages) | No state loading or compilation |
| `interceptor` | Injecting compact state into outgoing prompts via `spindle.registerInterceptor()` | Dashboard still works without injection |

The extension does not request `chats`, `context_handler`, `ui_panels`, `event_tracking`, or `app_manipulation`.

`tokens` is not a manifest permission. `spindle.tokens.countText()` is a free API available to all extensions.

---

## Development and Testing

```powershell
# Install dependencies
npm.cmd install

# Run complete validation (version check, typecheck, build, test suite, dist scanner)
npm.cmd run validate

# Preview UI in browser
npm.cmd run preview
```

### Local Preview

Open the local developer preview to test dashboard layouts, mobile touch elements, scroll stability, and CSS aesthetics:

```
http://127.0.0.1:4173/preview/index.html
```

### Test Structure

Tests use the Node.js built-in test runner with `tsx` for TypeScript support:

| Test file | Coverage |
|---|---|
| `tests/schemas.test.ts` | Zod schema validation, defaults, error handling |
| `tests/compiler.test.ts` | LLM output parsing, repair logic, seed context |
| `tests/compact.test.ts` | Compact injection building, budget enforcement, module controls |
| `tests/generation.test.ts` | Generation pipeline, timeouts, cancellation |
| `tests/storage.test.ts` | State path encoding, storage round-trips |
| `tests/migrations.test.ts` | V1-to-V2 migration, legacy field mapping |
| `tests/seed.test.ts` | Compiler seed building, continuity context |
| `tests/upgrades.test.ts` | Settings upgrade paths |
| `tests/backend-runtime.test.mjs` | Full backend compile-and-store integration test |
| `tests/render.test.ts` | Dashboard rendering functions, history tab, injection preview, what-changed modal |

---

## Installation in Lumiverse

Install LoomOS directly in Lumiverse via the Spindle Extension Manager:

1. Open **Extensions** from the Lumiverse sidebar.
2. Click **Install from Git URL**.
3. Paste: `https://github.com/drinkwaterdrink/Loom-OS.git`
4. Select branch `Loom-OS-2-AG` (active development).
5. Grant the three requested permissions.
6. Click **Open LoomOS** from the input action deck to compile the current message's state.
7. Use the **Open Tracker** widget beneath the latest message, or open the drawer tab for the full dashboard.
