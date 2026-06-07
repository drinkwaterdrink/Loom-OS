# Changelog

All notable changes to LoomOS Command Deck are documented here.

## [0.1.6] - 2026-06-07

### Added

- Schema & Prompt Studio in Tracker Settings, with a collapsible entry for every stock module showing its current generation schema, effective compiler instruction, exact module prompt block, and copy controls for both the module block and full generated compiler prompt.
- Safe stock generation-contract replacements for `schemaSummary` and `compilerInstruction`, alongside the existing additive guidance override. The strict State V2 Zod validator remains locked.
- `appearance` as the nineteenth stock module, with dedicated Track / Display / Inject controls and an expanded immutable physical profile for each cast member.
- Appearance fields for height, weight description, build, body type, frame, proportions, silhouette, body composition, shoulders, chest, bust, waist, hips, limbs, hands, complexion, facial details, hair, eyes, marks, scars, tattoos, piercings, birthmarks, unique features, posture, movement, voice, immutable traits, full description, and anchor.
- Dedicated cast appearance rendering, appearance-aware compiler seeds, optional compact appearance injection, and provider-shape normalization.

### Changed

- Cast Core now focuses on identity, presence, intent, status, awareness, goals, stable facts, and uncertainty; the Appearance module owns persistent physical identity.
- Old custom module presets are normalized with the new Appearance control automatically, so saved presets from earlier releases continue to load.
- Stock module inspection now distinguishes the locked runtime structure from editable generation guidance and exposes the full effective compiler prompt.

### Fixed

- Test fixtures now return deep-cloned state, preventing one mutation-focused test from contaminating later schema assertions.

## [0.1.5] - 2026-06-07

### Added

- Normalization V2 fallback saving: if first and repair compiler outputs are still invalid, LoomOS saves a minimal valid exact-swipe fallback state with an audit marker and visible recovery headline.
- Custom module schema builder with typed fields, field reorder/edit/delete, default values, enum options, numeric bounds, max item limits, display hints, and copyable expected JSON shape.
- Safe custom HTML/CSS template mode with starter templates, live preview, reset/copy controls, escaped data interpolation, HTML sanitization, CSS sanitization, and scoped selectors.
- Duplicate-as-custom action for stock modules.
- Copyable compiler debug report with normalization, fallback, and validation issue details.

### Changed

- Effective stock module catalog now merges override metadata for UI grouping/search/order, inspector labels, default Display/Inject preferences, prompt guidance, and duplicate-as-custom creation without mutating stock definitions.
- Compiler prompts now include effective stock schema summaries and custom field contracts, and explicitly require custom template modules to output data only.
- Normalization preserves the expanded character ledger fields while coercing common malformed provider shapes.

### Fixed

- Generation no longer loses the exact-swipe tracker state solely because cast goals, pockets, relationships, impossible moves, scene rows, pending consequences, or custom fields came back in shorthand or malformed shapes.
- Custom template output cannot execute model-authored scripts, event handlers, URLs, embedded frames, forms, external assets, or global CSS.

## [0.1.4] - 2026-06-07

### Added

- **State History Timeline**: A dedicated History tab lists every state snapshot generated for the active chat, sorted newest-first. Each entry shows scene name, timestamp, focus, location, cast/thread/risk counts, and delta headline. Click **Load** to inspect any historical state. Use the search bar to filter by scene, focus, location, or message ID. Active entries are highlighted. Delete buttons remove snapshots.
- **Injection Preview Panel**: A collapsible panel (toggled via `showInjectionPreview` in Settings) shows the exact compact injection text, estimated token count vs budget, included/omitted module lists, and a token bar visualization. A Copy button lets you grab the injection text. A warning banner appears when the budget is exceeded.
- **What Changed Modal**: A dedicated modal launched from the sticky header displays the current state's delta at a glance: headline, all changes with importance badges, carried-forward facts, newly-established facts, and current scene context (location, time, focus). Changes are rendered with a `+` icon and module/age/importance metadata.
- **Continuity Firewall Explainer**: The Continuity tab now includes an introductory explainer section describing the Firewall's purpose, a four-metric stats bar (Facts, Anchors, Pending, Offscreen), styled risk cards with severity badges and guardrail recommendations, and a safe-state banner when no conflicts are detected.

### Changed

- **renderHistoryTab/InjectionPreview/WhatChangedModal**: Isolated into standalone exported functions in `render.ts` for testability and code organization.
- **renderContinuity**: Refactored with enhanced explainer layout, risk card styling, and metric summary grid.
- **StateIdentitySchema**: Moved earlier in schemas.ts to fix a forward-reference crash affecting tests and module imports.
- **StateHistoryItem type**: Deduplicated — the manual interface was removed in favor of the auto-inferred `z.infer<typeof StateHistoryItemSchema>` type.

### Fixed

- **Circular schema reference**: `StateIdentitySchema` was referenced by `StateHistoryItemSchema` before being defined, causing `ReferenceError: Cannot access before initialization` in all test files. Moved the schema definition earlier to resolve.
- **Missing ModuleKey import**: `backend.ts` was using `ModuleKey` without importing it — added to the type import block.
- **Null InjectionPreview handling**: `frontend.ts` now guards `renderInjectionPreview` calls with a null check before passing the value.
- **Duplicate StateHistoryItem type**: Both a `z.infer` type alias and a manual interface existed with the same name — removed the duplicate interface.

## [0.1.3] - 2026-06-07

### Added

- **Mobile-First Tabbed Dashboard**: The main drawer and viewer modal now present state through five navigation tabs (Overview, Cast, World, Story, Continuity) instead of a single long scroll.
- **Sticky Header with Unified Controls**: A sticky command bar at the top of the drawer and modal provides always-visible Generate/Stop, Reload, Delete, and Open Viewer actions. The Generate button dynamically toggles to a pulsing "Stop Compile" button during active generation.
- **Collapsible Module Groups**: The Tracker Module Matrix settings now use collapsible `<details>` accordions per group (Core, Scene, Cast, World, Story, Tools, Custom) with tracked-module counts in each header badge.

### Changed

- **44px Touch Targets**: Module settings toggle buttons (Track / Display / Inject) are now 44px minimum-height grid cells, meeting accessibility tap-target standards on mobile devices.
- **Tab State Preservation**: The active tab, collapsible group open/closed state, scroll positions, and focused inputs are all captured and restored across dynamic re-renders.
- **Cast Cards Stack Vertically**: Cast matrix cards now render in a single-column list layout instead of a 2-column grid, preventing horizontal text overflow on narrow screens.
- **Shorter Button Labels**: Toolbar buttons use compact labels (Generate/Refresh/Delete/Enable) instead of verbose ones (Generate State/Refresh State/Delete Exact State/Enable Features).
- **Overview Card Polish**: The overview widget now shows active module count and cleaner location/time formatting.

### Fixed

- **Horizontal Overflow Hardening**: Applied `overflow-wrap: anywhere`, `min-width: 0`, and `overflow-x: hidden` across all grid/flex children to prevent any text from extending beyond the viewport.
- **Viewer Modal Scroll**: The tab pane in the viewer modal is now independently scrollable with overflow containment.
- **Module Group Details State**: Collapsible module groups correctly restore their open/closed state when settings toggles cause a re-render.

## [0.1.2] - 2026-06-07

### Added

- **Custom Module Preset Manager**: Fully integrated creation, duplication, deletion, renaming, and JSON import/export of user-defined module configurations.
- **Safe Custom Module Definitions**: Support for user-defined tracking modules with customizable LLM instructions, token limits, and multiple render formats (cards, bullets, chips, progress gauges).
- **Stop/Cancel Compiler Action**: Generation buttons in the drawer, modal, and latest-message widget now toggle to a cancel state to abort active compiler runs.
- **Dashboard Overview Block**: Summary metrics showing delta headline, location/time, cast count, thread count, risk levels, and injection status.
- **Collapsible Cast Cards**: Polished cast details with expandable visual anchors, pocket inventories, stable facts, and status chips.
- **Search & Bulk Actions**: Added module list searching with count indicators ("X of Y modules shown") and bulk actions to reset presets or inject recommended modules.

### Changed

- **Scroll & UI State Preservation**: Frontend preserves scroll offsets, `<details>` open/closed states, focused input selectors, and cursor selection ranges across dynamic panel re-renders.
- **Debounced Settings Save**: Rapid settings toggle checkboxes are debounced to prevent state loss and excessive storage writes.

### Fixed

- Resolved TypeScript type checking issues for custom preset assignments, Zod schema mappings, and details element restoration.
- Fixed test runner schema validation to require `customModuleData` field in fixtures.

## [0.1.1] - 2026-06-07

### Added

- Modular Track / Display / Inject controls for 18 story-state mechanics.
- Lite, Balanced, Full, Experimental, and Custom module presets.
- LoomOS State V2 with turn deltas, diagnostic meters, spatial state, expanded
  cast continuity, inventory, rumors, secrets, story tools, and audit entries.
- Native exact-swipe modal viewer available from the input action, drawer, and
  latest-message widget.
- Lumiverse connection discovery and a ready-connection selector.
- Generation pipeline phases, elapsed-time feedback, cancellation, and a
  configurable 30-300 second timeout.
- Compact nearest-prior-state compiler seeds for continuity and delta creation.
- Lazy V1 settings and state migration.
- Provider-tolerant generation response normalization.
- Version consistency validation.

### Changed

- Removed hardcoded generation token and temperature parameters so quiet
  generation can use the selected Lumiverse connection profile cleanly.
- Compact prompt injection now follows per-module Inject controls and a strict
  priority order.
- The drawer is now a settings/workspace surface while the modal is the primary
  in-chat dashboard.
- Core tracking modules remain enabled for continuity safety, while their
  Display and Inject controls remain configurable.

### Fixed

- Generation can no longer remain on "Compiling" indefinitely without a
  timeout or a visible failure.
- Generation accepts text returned as `content`, `text`, `output`, `response`,
  a raw string, or nested `message.content`.
- Invalid first and repair outputs never overwrite an existing valid snapshot.
- Repeated extension setup and teardown clean up owned listeners, timers,
  message widgets, jobs, modal handlers, and native UI handles.

## [0.1.0] - 2026-06-07

- Initial LoomOS Command Deck release with exact-swipe State V1, four dashboard
  panels, quiet generation, one repair pass, storage, and compact injection.
