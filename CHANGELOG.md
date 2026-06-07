# Changelog

All notable changes to LoomOS Command Deck are documented here.

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
