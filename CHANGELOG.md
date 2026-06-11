# Changelog

All notable changes to LoomOS Command Deck are documented here.

## [0.1.13] - 2026-06-11

### Added

- Expanded adult character appearance tracking for detailed facial structure, complexion, body proportions, bust, glute/seat shape, attractive features, unique marks, multi-sentence portraits, and compact continuity anchors.
- Expanded clothing tracking for materials, texture, fit, drape, coverage, styling, condition, footwear, accessories, and up to eight garment layers.
- Structured GPT Image production fields for intent, environment, character continuity, action, composition, camera, lighting, color palette, materials, mood, text rendering, and hard constraints.
- Long-form 350-800 word GPT Image compiler guidance based on OpenAI's current image-generation prompting recommendations.
- Rich appearance, clothing, and image-prompt fixtures plus normalization, seed, schema, render, and UI regression coverage.

### Changed

- Compressed the chat tracker command header into a two-line title limit and one 34px-high Refresh, Reload, and Delete action row.
- Renamed the user-facing **Kernel** section to **Scene Context** and **Delta** to **Recent Changes**.
- Reorganized Cast cards into a visible portrait plus **Detailed Appearance**, **Detailed Clothing**, and **Current State & Inventory** disclosures.
- Raised normalized Image Prompt capacity from 3,000 to 8,000 characters and clothing layers from five to eight.
- Expanded the Image Prompt Tools card with structured art direction, hard constraints, and a larger full-prompt reading surface.

### Fixed

- Prevented rich appearance, clothing, and image-prompt output from being silently discarded or shortened by older normalization limits.
- Preserved the expanded appearance and wardrobe contract in the previous-state compiler seed for stronger long-running continuity.
- Reduced the amount of mobile viewport consumed before the tracker navigation and content become visible.

## [0.1.12] - 2026-06-11

### Added

- A live `MM:SS` generation clock in the compiling state pill, Stop button, and dedicated generation rail.
- Automatic timer startup for backend-initiated tracker generations, including automatic generation after assistant responses.
- Final elapsed duration in completed, failed, and cancelled generation status messages.
- A complete fake generation lifecycle in the local preview for mobile timer and responsiveness testing.
- Regression coverage for targeted response rendering, differential message widgets, frame-batched history controls, and automatic timer startup.

### Changed

- Replaced global message-widget teardown with signature-based differential updates.
- Mounted changed previous-message History widgets in batches of four with a short event-loop yield between batches.
- Decoupled drawer and viewer rendering from message-widget synchronization.
- Routed chat-state responses to widget synchronization only and History responses to targeted count/result updates.
- Deferred generated-state presentation until the completion response so a normal compile performs one final tracker render instead of rendering the same result repeatedly.
- Simplified generation visuals to stable, tabular-number layouts without infinite glow, filter, or progress-bar animation.

### Fixed

- Prevented large retained histories from freezing the chat while every previous-message tracker control was recreated.
- Prevented generation completion from triggering repeated full drawer, viewer, and message-widget rebuilds.
- Prevented automatic generations from running without a visible elapsed-time counter.
- Preserved responsive tab interaction and generated Tools output while compilation status updates are active.

## [0.1.11] - 2026-06-08

### Added

- A dedicated Tools workspace in both the drawer and chat tracker viewer, with explicit status cards for Action Resolver, Dialogue State, Director Style, Closeness State, and Image Prompt.
- A full Image Prompt presentation with aspect, shot, medium, subject, positive guidance, negative guidance, full prompt, generation hint, and one-tap copy action.
- Tool diagnostics for disabled, Display-hidden, Track-disabled, refresh-needed, null-output, and ready states.
- Regression coverage for Image Prompt visibility, full prompt rendering, Tools navigation, targeted History updates, and mobile-safe rendering rules.

### Changed

- Replaced timer-driven full application rerenders with in-place compiler status updates.
- History search now updates only the active results container instead of rebuilding the drawer, viewer, and every message widget on each keystroke.
- Expanded mobile viewer navigation to include Tools in a stable four-column grid.
- Replaced translucent blur-heavy sticky surfaces with crisp opaque surfaces and removed `content-visibility` from modal cards and history entries for embedded-webview stability.
- Updated the local preview with a complete generated Image Prompt fixture.

### Fixed

- Prevented the tracker viewer from appearing frozen during long compiler runs or rapid History filtering.
- Prevented the Tools section from disappearing when displayed tools returned `null`.
- Made newly enabled Image Prompt modules explain that the current exact-swipe tracker must be refreshed before generated output can appear.

## [0.1.10] - 2026-06-08

### Added

- A dedicated scene-first chat tracker viewer with its own tab state, compact command header, responsive three-by-two mobile navigation, container-query layouts, and dense module presentation.
- Schema & Presentation Studio controls for editing the viewer HTML/CSS shell with live preview, starter templates, safe content slots, sanitized markup, and scoped CSS.
- Stock module presentation overrides with editable HTML/CSS wrappers and safe `key`, `title`, `summary`, `content`, and `open` template tokens.
- Per-module JSON import/export for stock and custom modules, including module controls, generation contracts, typed custom fields, and presentation templates.
- Regression coverage for module bundle round-trips, presentation sanitization, viewer slots, and exact archived-state operations.

### Changed

- Rebuilt the pop-up tracker opened inside chat without changing the drawer's Setup-oriented organization.
- Separated viewer and drawer navigation state so browsing the modal no longer changes the active drawer workspace.
- Reorganized Schema & Prompt Studio into a compact module library and renamed it Schema & Presentation Studio.
- Increased the sanitizer processing window for presentation HTML/CSS to support the larger viewer and stock module editors.

### Fixed

- History Load and Delete controls now dispatch through the frontend action handler instead of rendering inert attributes.
- Historical states now load directly by exact stored `chatId + messageId + swipeId` identity rather than requiring the old message or swipe to remain live.
- Historical Delete now removes the exact archived file, returns the refreshed history list, and clears the viewer only when the deleted tracker was the active one.
- History search clearing and injection-preview copy controls now use the active event delegation path.

## [0.1.9] - 2026-06-08

### Added

- A dedicated drawer-only Setup workspace for presets, generation controls, context budgets, retention, schema tools, modules, diagnostics, and injection preview.
- Live count badges in the navigation for active modules, cast, scene items, live threads, continuity risks, retained history, and tracked modules.
- Responsive layout contracts covering full-width navigation, mobile safe areas, narrow-screen action reflow, flattened Cast rows, and compact History search.
- UI regression tests for the mobile workspace structure, Scene Pulse, Cast summaries, History archive, responsive navigation, and removal of gradient styling.
- Browser-safe preview module serving for reliable phone-sized visual QA.

### Changed

- Rebuilt the tracker menu as a compact mobile-first workspace with one sticky control dock instead of duplicated title, status, action, settings, and tab blocks.
- Replaced the horizontal tab strip with a full-width responsive grid: Pulse, Cast, World, Story, Memory, History, and Setup.
- Moved tracker settings out of the default content flow so compiled state begins directly below navigation.
- Redesigned Overview as Scene Pulse with a delta headline, location/time context, four stable metrics, injection status, current focus, and direct Review Changes action.
- Flattened Cast cards into dense character ledger rows with separate Location, Mood, Threat, Intent, and Status scanning zones.
- Simplified History into a compact exact-swipe archive without a large explanatory card or nested scroll region.
- Reduced nested card styling, large radii, padding, and decorative surfaces throughout the tracker while preserving all existing modules and controls.
- Expanded the viewer to use nearly the entire available mobile viewport and updated the local preview to model full-screen mobile modal behavior.
- Prevented sparse tabs from stretching across the viewport, and kept each workspace's intended default section open when switching views.

### Accessibility

- Important controls use 40-44px touch targets, visible focus styling, stable dimensions, semantic tab roles, and non-color status labels.
- Safe-area padding protects controls from mobile system UI, and reduced-motion preferences disable status animation.

## [0.1.8] - 2026-06-07

### Added

- Automatic assistant tracker compilation from Lumiverse's `GENERATION_ENDED` event, resolving the exact saved message and active swipe before generation.
- Inline Tracker History controls on previous messages, with separate buttons for every stored swipe tracker on that message.
- `historyRetentionLimit`, configurable from 1 to 1,000 trackers per chat with a default of 100.
- Runtime coverage for completed assistant generations, prefix-relative storage listings, and retention trimming.

### Changed

- History discovery now accepts both full storage paths and paths returned relative to the requested `spindle.userStorage.list()` prefix.
- Lowering the history retention setting trims the active chat immediately; every later tracker save reapplies the configured limit.
- Character-message rendering now schedules a full exact-state and history sync after Lumiverse finishes mounting the new response.

### Fixed

- Assistant-message automatic mode no longer depends on the user-message-oriented `MESSAGE_SENT` lifecycle alone.
- State History Timeline and previous-message tracker controls no longer disappear when Lumiverse returns relative storage-list entries.
- Duplicate assistant lifecycle notifications no longer launch competing tracker compilations for the same exact swipe.

## [0.1.7] - 2026-06-07

### Changed

- Increased the maximum compact injection token budget from 1,600 to 10,000.
- Increased the maximum compiler seed token budget from 2,400 to 10,000.
- Expanded in-app token guidance to explain the context-window tradeoffs of both budgets.
- Reworked the README Settings Reference into a comprehensive operational guide covering every stored setting and the distinct injection, compilation, display, storage, latency, and context effects.

### Added

- Boundary tests confirming that both token budgets accept 10,000 and reject 10,001.

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
