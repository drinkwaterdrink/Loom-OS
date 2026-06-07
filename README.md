# LoomOS Command Deck

Current release: **0.1.3**

LoomOS is a full-stack Lumiverse Spindle extension that compiles roleplay chat history into an exact-swipe, structured story operating system. It tracks what changed, what must remain true, where everyone and everything is, which story threads are active, and what compact context is useful for future replies.

---

## Key Features & Upgrades in 0.1.3

### 1. Mobile-First Tabbed Dashboard
The drawer and viewer modal now present compiled state through five navigation tabs instead of a single long scrollable panel:
- **Overview**: Scene kernel, delta headline, diagnostic meters, tools, and custom module cards.
- **Cast**: Full cast matrix with collapsible visual anchors, pockets, relationships, and stable facts.
- **World**: Spatial facts, scene items, environmental hazards, rumors, and loaded signs.
- **Story**: Thread loom, goals, stakes, countdowns, and autonomy queue.
- **Continuity**: Firewall risks, established facts, anti-retcon anchors, and banned/impossible moves.

Switching tabs is instant and preserves scroll position and open/closed section states.

### 2. Sticky Header with Unified Controls
A sticky command bar pins to the top of both the drawer and viewer modal, providing always-visible access to:
- **Open Viewer**: Launch the full-size modal from the drawer.
- **Generate / Stop Compile**: A single button that dynamically toggles between "Generate" (or "Refresh") and a pulsing "Stop Compile" during active compilation runs.
- **Reload**: Refresh exact-swipe state from storage.
- **Delete**: Remove the current exact-swipe snapshot.
- **Enable**: Request missing permissions when needed.

### 3. Collapsible Module Groups
The Tracker Module Matrix settings panel now organizes modules into collapsible `<details>` accordion groups (Core, Scene, Cast, World, Story, Tools, Custom Modules). Each group header shows a badge with "X of Y tracked" counts so you can see module coverage at a glance without expanding every group.

### 4. 44px Touch-Friendly Toggles
Module Track / Display / Inject checkboxes are now rendered as 44px minimum-height grid cells that meet mobile accessibility tap-target standards. No more accidentally toggling the wrong checkbox on small screens.

### 5. Custom Module Preset Manager
LoomOS allows you to group your preferred active modules into saved configurations called presets. You can manage presets directly within the settings drawer and modal panel:
- **Save As**: Capture the current module checklist status and save it under a custom name and description.
- **Update**: Apply the current checklist states to the active custom preset.
- **Duplicate**: Clone an existing custom preset for fast variation.
- **Rename**: Change the name or description of any custom preset.
- **Delete**: Remove obsolete custom presets.
- **Import/Export**: Presets are serialized to clean JSON, making them easy to share or back up.

### 6. Safe Custom Module Definitions
Extend the compiled story-state beyond the 18 built-in core and optional modules:
- Create **Custom Modules** dynamically (stored securely inside `settings.json` within `spindle.userStorage`).
- Configure customized **Compiler Instructions** instructing the LLM on what to track (e.g., *"Track the character's Sanity level based on horror elements"*).
- Select a tailored **Output Render Mode**:
  - `cards`: Render details as structured cards.
  - `bullets`: Display as a concise bullet list.
  - `chips`: Render status values as compact pills/badges.
  - `gauge`: Render a visual progress bar indicating levels or percentages.
- Set strict **Token Limits** and **maxItems** (1-24) to keep context windows clean.
- Custom module states are dynamically validated and stored under a unified `customModuleData` field in the State V2 schema, preserving schema compatibility and type-safety.

### 7. Stop & Cancel Compilation Action
Never get locked out during a slow generation run:
- The main **Generate** button inside the drawer, modal, and latest-message widget toggles into a **Stop Compile** action when compilation is active.
- Clicking **Stop** immediately cancels the underlying prompt generation, aborts the LLM connection cleanly, and resets the UI status.

### 8. UI Scroll & State Preservation
LoomOS completely solves the annoying issue of losing your spot when settings are updated or the dashboard re-renders:
- **Scroll Positions**: Remembers and restores the vertical scroll offset of all details panels.
- **Interactive Details**: Remembers which `<details>` sections, cast cards, and module groups were expanded (`open` state) and restores them exactly.
- **Tab State**: The active dashboard tab is preserved across re-renders.
- **Cursor Focus & Text Selection**: Restores active input focus, search text query inputs, and text selection ranges (`selectionStart` and `selectionEnd`) during edits.
- **Debounced Save Settings**: Toggling checkboxes rapidly is debounced to avoid state loss and prevent excessive disk reads/writes.

### 9. Polished Dashboard Layout
- **Dashboard Overview**: A high-level metric block showing the latest delta headline, current location and timeframe, counts of active cast members, story threads, pending risks, active module count, and injection status.
- **Collapsible Cast Cards**: Primary info (name, kind, emotional state, and intent) is shown upfront, while deep continuity facts (visual anchor, pockets, relationships, stable facts) are kept inside clean collapsible details.
- **Module Search & Bulk Actions**: Filter through modules with real-time count indicators ("X of Y modules shown"). Reset presets or bulk-apply recommended modules with single clicks.

---

## Tracker Modules Catalog

LoomOS has 18 built-in modules grouped logically:

| Group | Modules | Description |
| --- | --- | --- |
| **Core** | Scene Kernel | Basic scene details, POV, objective, and stop triggers. |
| | Turn Deltas | Direct diff comparison between the previous turn and the current. |
| **Scene** | Diagnostic Meters | Tension, danger, and coherence metrics. |
| **Cast** | Cast Core | Core presence, status, goals, and anchors. |
| | Cast Visuals | Spatial arrangement, poses, and Spotlight metrics. |
| | Clothing | Grounded clothing and wardrobe continuity. |
| | Relationships | Emotional standings and character alignments. |
| **World** | Inventory | Pocket inventories and item conditions. |
| | World & Space | Environmental changes, active hazards, and rumors. |
| | Secrets & Rumors | Hidden secrets and reader-visible clues. |
| **Story** | Story Threads | Escalation countdowns and thread progressions. |
| | Continuity Firewall | Banned next actions, retcon blockers, and offscreen state. |
| **Tools** | Action Resolver | Action resolving, blocker checking, and world response. |
| | Dialogue State | Social masks, taboos, and current conversational thread. |
| | Director Style | Mask constraints, voices cues, and push direction. |
| | Closeness State | Emotional/physical closeness and boundaries. |
| | Image Prompt | Dynamic text-to-image prompts for scenes. |
| **System**| Audit Log | Compiler steps, validation failures, and repairs. |

*Note: The five continuity-critical modules (Scene Kernel, Turn Deltas, Cast Core, Story Threads, and Continuity Firewall) are locked to **Track** on for system safety. However, you can freely toggle their Display and Inject permissions.*

---

## Track, Display, Inject

Every module has three independent controls:
- **Track**: Include the module in the LLM's state compiler output.
- **Display**: Render the module's dashboard panels in the modal or drawer.
- **Inject**: Append the compiled module data to the next prompt injection.

---

## State V2 Schema

Each compiled state contains the following structure:
```json
{
  "schemaVersion": 2,
  "identity": { "chatId": "...", "messageId": "...", "swipeId": 0 },
  "generatedAt": "ISO Timestamp",
  "source": { "messageCount": 0, "repaired": false, "connectionId": "..." },
  "activeModules": ["sceneKernel", "deltas", "castCore"],
  "kernel": { ... },
  "delta": { ... },
  "meters": [ ... ],
  "scene": { ... },
  "castMatrix": [ ... ],
  "worldState": { ... },
  "storyState": { ... },
  "continuityFirewall": { ... },
  "tools": { ... },
  "auditLog": [ ... ],
  "customModuleData": [
    {
      "moduleId": "custom-mod-id",
      "label": "Custom Label",
      "summary": "Turn summary text",
      "items": [
        { "title": "Item 1", "text": "Details", "importance": "medium", "color": "#00ff00" }
      ]
    }
  ]
}
```

---

## Exact Swipe & History Architecture

LoomOS relies on exact swipe tracking. It stores documents using the path:
```text
chats/{chatId}/messages/{messageId}/swipes/{swipeId}.json
```
When a user swipes or edits messages, LoomOS reads that exact key. When generating a new state, it searches backwards to find the nearest valid compiled state in the chat timeline, using it as a compiler seed context. The compiler compares this seed against the recent transcript turns to compute precise, non-contradictory delta changes.

---

## Prompt Injection Priority

When compact injection is active, LoomOS inserts state data into future generations according to a strict priority schedule under the user-configured token budget:
1. Turn Deltas and headlines.
2. Scene Kernel, location, and constraints.
3. Continuity Firewall anchors and consequences.
4. Action Resolver state.
5. Cast Core poses, intent, and goals.
6. Spatial coordinates, pocket inventory, and active countdowns.
7. Rumors, secrets, and custom modules (with budget headroom).

---

## Theme Skins

LoomOS ships with seven built-in skins:
- **Auto** (adapts to the Lumiverse host)
- **Dark Academia** – warm scholarly tones
- **Cyberpunk** – neon teals and deep navy
- **Fantasy** – forest greens and gold
- **Horror** – blood reds and charcoal
- **Noir** – stark grayscale
- **Minimal** – clean light mode

---

## Safety and Permissions

LoomOS requires three permissions:
- `generation`: Running quiet compiler steps and listing active LLM connections.
- `chat_mutation`: Standard Spindle permission required to fetch chat histories (LoomOS reads history but never mutates/edits your messages).
- `interceptor`: Injecting the compiled state into outgoing prompts.

---

## Development and Testing

Verify code correctness and run automated tests locally:

```powershell
# Install dependencies
npm.cmd install

# Run complete validation (version check, typecheck, build, test suite, and scanner)
npm.cmd run validate

# Preview UI in browser
npm.cmd run preview
```

### Local Preview
Open the local developer preview to test dashboard layouts, mobile touch elements, scroll stability, and CSS aesthetics:
```text
http://127.0.0.1:4173/preview/index.html
```

---

## Installation in Lumiverse

Install LoomOS directly in Lumiverse via the Spindle Extension Manager:
1. Paste the Git URL: `https://github.com/drinkwaterdrink/Loom-OS.git`
2. Select the branch (e.g. `Loom-OS-2-AG` for active updates).
3. Grant permissions, click **Open LoomOS** from the input action deck, and compile!
