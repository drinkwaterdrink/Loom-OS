# LoomOS Command Deck

Current release: **0.1.9**

LoomOS is a full-stack Lumiverse Spindle extension that compiles roleplay chat history into an exact-swipe, structured story operating system. It tracks what changed, what must remain true, where everyone and everything is, which story threads are active, and what compact context is useful for future replies.

---

## Key Features & Upgrades in 0.1.9

- **Mobile workspace redesign**: The drawer and viewer now use the full available width with a compact sticky control dock, safe-area padding, and no redundant internal title block.
- **Scan-first navigation**: A stable full-width navigation grid replaces the cramped horizontal strip. Pulse, Cast, World, Story, Memory, History, and Setup expose useful live counts.
- **Dedicated Setup workspace**: Settings, presets, token controls, schema tools, diagnostics, and module configuration no longer push tracker content down on every view.
- **Denser tracker views**: Scene Pulse, Cast, History, expandable sections, facts, and metrics were flattened and reorganized to reduce nested cards and wasted vertical space.
- **Responsive polish**: Important actions use 40-44px touch targets, narrow screens receive dedicated layouts, desktop views gain denser grids, and motion respects reduced-motion preferences.

---

## Table of Contents

- [Mobile Workspace](#mobile-workspace)
- [Workspace Views](#workspace-views)
- [Control Dock](#control-dock)
- [State History Timeline](#state-history-timeline)
- [Injection Preview Panel](#injection-preview-panel)
- [What Changed Modal](#what-changed-modal)
- [Latest-Message Tracker Widget](#latest-message-tracker-widget)
- [Tracker Modules Catalog](#tracker-modules-catalog)
- [Schema & Prompt Studio](#schema--prompt-studio)
- [Immutable Appearance Module](#immutable-appearance-module)
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

## Mobile Workspace

LoomOS is designed as a compact operational workspace rather than a stack of dashboard cards. The sticky top dock contains exact-swipe context, current sync or compilation state, primary commands, and navigation. It uses the full drawer or modal width, respects mobile safe areas, and leaves scrolling to the Lumiverse host instead of creating competing nested scroll regions.

On narrow screens the navigation automatically becomes a four-column grid. The labels and count badges remain stable, so changing state cannot resize or shift the control surface. The drawer always exposes Setup, including when the active swipe has no tracker yet. The viewer omits Setup and stays focused on reading state.

## Workspace Views

The drawer presents seven workspaces. The viewer presents the six tracker-reading workspaces. Tab choice, scroll position, focused controls, and expandable section states are preserved across re-renders.

### Pulse
A scan-first scene summary showing the latest delta, location, timeframe, injection state, and stable counts for cast, threads, risks, and active modules. **Review changes** opens the focused delta modal. Kernel, Delta, Meters, Tools, and custom modules remain available as compact expandable sections below it.

- **Kernel** — Scene name, current focus, summary, POV, tone, objective, risk, stop mode, and constraints.
- **Delta** — Headline, all changes with importance badges (low/medium/high/critical), carried-forward facts, and newly-established facts.
- **Meters** — Diagnostic gauges (tension, danger, coherence, etc.) with trend indicators, bar visualization, and band labels.
- **Tools** — Action Resolver, Dialogue State, Director Style, Closeness State, and Image Prompt cards (visibility controlled by settings).
- **Custom Modules** — User-defined module cards rendered in their configured output mode (cards, bullets, chips, gauge, or sanitized template).

### Cast
Full cast matrix with all tracked characters. Each card shows name, kind (POV/main/NPC/crowd), quantity, awareness level, location, emotional state, threat rating, intent, and status. A dedicated **Immutable Appearance** profile presents persistent physical traits when the Appearance module is displayed. A separate "Visuals & Pockets" section contains turn-level pose, proximity, hands, visual anchor, clothing summary, goals, relationships, pocket inventories, and stable facts. Card visibility respects per-module Display settings.

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

### Memory
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

Use the search bar to filter by scene, focus, location, or message ID. Click **Load** to inspect any historical snapshot. The currently active state is highlighted. Delete buttons remove unwanted snapshots from storage. Previous chat messages also receive an inline **Tracker history** control when they have stored state, with one button per saved swipe.

### Setup
The drawer-only Setup workspace contains:

- Preset selection and custom preset management
- Auto-generation, connection, transcript depth, and timeout controls
- Injection, seed, retention, preview, and appearance controls
- Token and performance guidance
- Schema & Prompt Studio
- Stock and custom module configuration
- Pipeline diagnostics and optional injection preview

---

## Control Dock

A compact sticky command dock pins to the top of both the drawer and viewer. It shows the exact message/swipe, current status text, and a visible `Synced`, `Compiling`, or `No state` indicator. Commands reflow without overlapping at narrow widths.

| Button | Action |
|---|---|
| **Generate tracker / Refresh tracker / Stop compile** | One primary action that changes with the current state and compilation status |
| **Viewer** | Opens the full-screen-friendly tracker viewer from the drawer |
| **Reload** | Refresh exact-swipe state from storage |
| **Delete** | Remove the current exact-swipe snapshot |
| **Enable** | Request missing Lumiverse permissions when needed |

---

## State History Timeline

Accessed via the **History** tab. All states are listed newest-first with full metadata. The search bar supports real-time filtering across scene, focus, location, and message ID fields. Click **Load** to replace the current dashboard view with the selected historical state. The actively-loaded state is visually distinguished. The **Delete** button on each entry removes the snapshot from storage (no confirmation dialog — use with care).

The history is fetched on every state sync and stored in memory for the session. LoomOS stores one current tracker per exact `chatId + messageId + swipeId` identity. The `historyRetentionLimit` setting keeps the newest trackers for the chat and permanently deletes older entries after a tracker save or when the configured limit is reduced.

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

Opened via **Review changes** in the Pulse summary. Provides a focused delta breakdown:

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

LoomOS has 19 built-in modules and unlimited custom modules:

| Group | Module Key | Description | Core (locked Track) |
|---|---|---|---|
| **Core** | `sceneKernel` | Basic scene details, POV, objective, and stop triggers | ✅ |
|  | `deltas` | Direct diff comparison between the previous turn and the current | ✅ |
| **Scene** | `meters` | Tension, danger, and coherence diagnostic gauges | |
| **Cast** | `castCore` | Core presence, status, goals, and visual anchors | ✅ |
|  | `appearance` | Persistent physical identity, body description, facial details, marks, and immutable anchors | |
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

## Schema & Prompt Studio

Open **Setup -> Schema & Prompt Studio** to inspect every stock module contract without reading source code. Each module entry exposes:

- The effective generation schema sent to the compiler.
- The effective compiler instruction.
- The exact per-module prompt block.
- The full compiler prompt containing the global rules, State V2 example, and selected module contract.
- Copy controls for one module or the complete stock contract catalog.
- Inspect, Edit / Replace, and Reset actions.

The stock editor supports three prompt-level controls:

| Control | Behavior |
|---|---|
| **Generation schema replacement** | Replaces the module's schema guidance shown to the LLM |
| **Compiler instruction replacement** | Replaces the stock module instruction |
| **Additional compiler guidance** | Appends extra rules after the effective instruction |

These controls intentionally do not rewrite the runtime Zod schema. Generated output must still fit the stable State V2 fields before it can be saved. For a genuinely different data shape, duplicate a stock module as custom and use the custom Schema Builder.

---

## Immutable Appearance Module

The `appearance` module owns `castMatrix[].appearance` and is enabled for Track and Display in the Balanced preset. Inject is off by default to conserve prompt budget.

It can retain:

- Identity basics: species, age band, apparent age, and gender presentation.
- Scale and build: height, weight description, build, body type, frame, silhouette, body composition, and proportions.
- Body shape: shoulders, chest, bust, waist, hips, arms, legs, and hands.
- Surface and facial identity: skin, complexion, face, facial structure, hair, eyes, eyebrows, nose, lips, ears, and facial hair.
- Distinguishing identity: scars, tattoos, piercings, birthmarks, marks, unique features, and immutable trait chips.
- Presentation: posture, movement, voice, presence, full description, and a compact immutable anchor.

Compiler safety rules keep this non-explicit and evidence-based. LoomOS does not infer exact measurements, cup sizes, numeric weight, hidden anatomy, or unsupported physical details. Unknown fields remain empty, while established traits persist through the previous-state seed until the transcript changes them.

---

## Track / Display / Inject Controls

Every module has three independent toggles configured in the **Setup** workspace under the Module Groups accordion:

| Toggle | Effect |
|---|---|
| **Track** | Include the module in the LLM's state compiler output. When off, the module is excluded from compilation entirely. |
| **Display** | Render the module's dashboard panels in the drawer and modal. When off, the module's data is still tracked and injected but not shown in the UI. |
| **Inject** | Append the compiled module data to the next prompt injection payload. When off, the module is tracked and displayed but not sent to the LLM as context. |

Toggle buttons are 44px minimum-height touch targets meeting mobile accessibility standards. Each button shows a checkbox and label. Active modules show a highlighted accent state. Core modules display a locked indicator on their Track toggle.

---

## Settings Reference

All settings are stored per user in `settings.json` inside `spindle.userStorage`. They do not alter the original Lumiverse chat messages.

| Setting | Default | Range | What it does and affects |
|---|---|---|---|
| `skin` | `"auto"` | auto, dark_academia, cyberpunk, fantasy, horror, noir, minimal | Changes only LoomOS colors and presentation. It does not affect generation, stored tracker data, or injection. |
| `autoGeneration` | `"manual"` | off, assistant, every, manual | Controls when LoomOS compiles a new exact-swipe state. `manual` waits for Generate; `assistant` compiles after assistant messages; `every` reacts to every supported message event; `off` disables automatic compilation while manual controls remain available. More frequent compilation uses more generation calls. |
| `injectionEnabled` | `false` | boolean | Enables the outgoing prompt interceptor. When on, LoomOS adds a compact `<loomos_state>` block to future roleplay generations. This can improve continuity but consumes model context. It does not change the saved tracker state itself. |
| `showInjectionPreview` | `false` | boolean | Shows the exact compact state text, estimated token usage, included modules, and omitted modules in the drawer. This is diagnostic UI only and does not enable injection by itself. |
| `injectionTokenBudget` | `320` | 80–10,000 | Maximum estimated tokens LoomOS may use for compact state injection. Raising it allows more enabled Inject modules and details to reach future roleplay responses. Lowering it favors only the highest-priority continuity fragments. Very large values can crowd out character cards, world info, chat history, and other prompt content within the model's context window. |
| `compilerSeedTokenBudget` | `900` | 200–10,000 | Maximum approximate size of the nearest prior tracker state passed to the quiet state compiler. Raising it preserves more cast, appearance, inventory, thread, continuity, world, and custom-module history between snapshots. Lowering it reduces compiler input cost but may discard older detail. This budget affects tracker compilation, not normal roleplay injection. |
| `recentMessageLimit` | `24` | 4–80 | Number of recent chat messages supplied to the state compiler. Higher values give the compiler more transcript evidence but increase input size and generation latency. Lower values are faster but may miss facts that were stated farther back unless they survived in the prior state seed. |
| `historyRetentionLimit` | `100` | 1–1,000 | Maximum number of exact-swipe tracker files retained for each chat. After a tracker is saved, LoomOS sorts the chat's trackers by generation time and permanently deletes the oldest entries above this limit. Lowering the setting trims the active chat immediately. This controls extension storage and history length, not model context. |
| `generationTimeoutSeconds` | `180` | 30–300 | Maximum time allowed for a quiet compiler or repair generation before LoomOS aborts it. Increase this for slow providers or large prompts. Decrease it for faster failure recovery. It does not control normal Lumiverse roleplay generation time. |
| `connectionId` | `""` | string, max 200 | Selects the Lumiverse connection/profile used for quiet tracker compilation. Empty means LoomOS chooses an available ready connection. The selected provider, model, and connection profile can affect JSON reliability, speed, cost, and tracker detail. |
| `modulePreset` | `"balanced"` | built-in or custom preset ID | Selects a saved Track/Display/Inject configuration. Changing it updates module controls together; it does not delete previously stored state fields. Manual module changes switch the active configuration to custom. |
| `moduleSettings` | balanced defaults | per-module Track/Display/Inject controls | Determines which stock data the compiler requests, which sections the dashboard shows, and which compiled fragments may enter future prompt injection. Track affects future compiled snapshots; Display affects UI only; Inject affects prompt context only. |
| `stockModuleOverrides` | `{}` | per-module object | Stores stock module label, description, group, ordering, visibility, default preferences, prompt-facing schema replacement, compiler instruction replacement, and additional guidance. These overrides affect module presentation and compiler prompting, while the strict State V2 storage validator remains unchanged. |
| `customModulePresets` | `[]` | array | Stores named snapshots of stock module Track/Display/Inject controls for quick switching. Presets do not contain compiled story state. |
| `customModules` | `[]` | array | Defines user-created trackers, their compiler instructions, editable field schemas, output modes, templates, ordering, and Track/Display/Inject behavior. Enabled custom modules increase compiler prompt size and may increase generated state size. |

### Understanding the Two Token Budgets

The budgets apply to different generation paths:

1. **Injection budget**: saved tracker state -> future normal roleplay prompt. It influences what the roleplay model remembers from LoomOS.
2. **Seed budget**: previous tracker state -> next quiet tracker compilation. It influences what the tracker compiler can carry forward while building a new snapshot.

They are independent. Raising the seed budget does not increase normal prompt injection, and raising the injection budget does not give the compiler more previous-state detail.

The `10,000` ceiling is a configurable maximum, not a recommended default. The usable value depends on the context window and on how much room must remain for chat history, character definitions, world information, presets, and the model's response.

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

The Setup workspace includes a preset manager for saving and loading module configurations:

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
6. Immutable Appearance anchors when Appearance Inject is enabled
7. Spatial coordinates, pocket inventory, and active countdowns
8. Rumors, secrets, and custom modules (with budget headroom)

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
  "activeModules": ["sceneKernel", "deltas", "castCore", "appearance"],
  "kernel": { "scene": "...", "location": "...", "pov": "...", "constraints": [], ... },
  "delta": { "headline": "...", "changes": [], "carriedForward": [], "newlyEstablished": [] },
  "meters": [ { "id": "tension", "label": "Tension", "value": 50, "trend": "steady", ... } ],
  "scene": { "privacy": "semi-private", "access": { "exit": "WATCHED", ... }, "items": [], ... },
  "castMatrix": [
    {
      "id": "mara",
      "name": "Mara",
      "kind": "pov",
      "appearance": {
        "height": "Average",
        "bodyType": "Slim with subtle curves",
        "hair": "Dark, tied back",
        "eyes": "Keen grey",
        "immutableTraits": ["Dark tied-back hair", "Keen grey eyes"]
      },
      "pockets": []
    }
  ],
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

The State History Timeline (`list_state_history`) normalizes both full and prefix-relative `spindle.userStorage.list()` results, loads all retained state files for the current chat, extracts a summary from each, and returns them sorted by `generatedAt` descending. The frontend caches these in memory, supports search filtering and per-entry deletion, and mounts Tracker History controls on previous messages. Retention trimming keeps only the newest `historyRetentionLimit` exact-swipe trackers.

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
| `tests/ui-redesign.test.ts` | Mobile workspace navigation, safe-area layout, Scene Pulse, Cast, and History redesign contracts |

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
