# Changelog

All notable changes to LoomOS Command Deck are documented here.

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
