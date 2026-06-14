export const LOOMOS_STYLES = `
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
    background: var(--loomos-panel);
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
    align-items: center;
    background: color-mix(in srgb, var(--loomos-accent) 8%, var(--loomos-bg));
    border-color: var(--loomos-accent);
    display: grid;
    gap: 4px 10px;
    grid-template-columns: minmax(0, 1fr) auto;
    margin-top: 8px;
    padding: 10px 12px;
  }
  .loomos-compile-copy {
    align-items: center;
    display: flex;
    gap: 9px;
    min-width: 0;
  }
  .loomos-compile-copy > div {
    min-width: 0;
  }
  .loomos-compile-copy strong {
    display: block;
    font-size: 12px;
    line-height: 1.2;
  }
  .loomos-compile-copy p {
    color: var(--loomos-muted);
    font-size: 10px;
    line-height: 1.25;
    margin: 2px 0 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loomos-compile-dot {
    background: var(--loomos-accent);
    border-radius: 50%;
    flex: 0 0 8px;
    height: 8px;
    opacity: .9;
    width: 8px;
  }
  .loomos-generation-clock,
  [data-live-elapsed] {
    font-variant-numeric: tabular-nums;
  }
  .loomos-generation-clock {
    color: var(--loomos-ink);
    font-size: 20px;
    line-height: 1;
    min-width: 5ch;
    text-align: right;
  }
  .loomos-compile-status > small {
    color: var(--loomos-muted);
    font-size: 9px;
    grid-column: 1 / -1;
    padding-left: 17px;
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

  .loomos-schema-studio {
    border: 1px solid var(--loomos-border);
    border-radius: 8px;
    grid-column: 1 / -1;
    overflow: hidden;
  }
  .loomos-schema-studio > summary,
  .loomos-schema-module > summary {
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    list-style: none;
    padding: 10px;
  }
  .loomos-schema-studio > summary::-webkit-details-marker,
  .loomos-schema-module > summary::-webkit-details-marker {
    display: none;
  }
  .loomos-schema-studio > summary small {
    color: var(--loomos-muted);
    font-size: 10px;
  }
  .loomos-schema-studio-body {
    border-top: 1px solid var(--loomos-border);
    display: grid;
    gap: 10px;
    padding: 10px;
  }
  .loomos-schema-module-list {
    display: grid;
    gap: 7px;
  }
  .loomos-schema-module {
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 7px;
    overflow: hidden;
  }
  .loomos-schema-module > summary code {
    color: var(--loomos-muted);
    font-size: 10px;
    margin-left: 4px;
  }
  .loomos-schema-module-body {
    border-top: 1px solid var(--loomos-border);
    display: grid;
    gap: 10px;
    padding: 9px;
  }
  .loomos-contract-code {
    background: var(--loomos-bg);
    border: 1px solid var(--loomos-border);
    border-radius: 6px;
    font: 10px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    margin: 5px 0 0;
    max-height: 240px;
    overflow: auto;
    padding: 8px;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .loomos-contract-textarea {
    font: 10px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    min-height: 130px;
    resize: vertical;
    width: 100%;
  }
  .loomos-contract-textarea-full {
    min-height: 280px;
  }
  .loomos-schema-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .loomos-appearance-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
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
  .loomos-appearance-description,
  .loomos-clothing-description,
  .loomos-cast-description {
    color: var(--loomos-ink);
    font-size: 11px;
    line-height: 1.48;
    margin: 0;
  }
  .loomos-cast-description {
    color: color-mix(in srgb, var(--loomos-ink) 88%, var(--loomos-muted));
    margin: 7px 0;
  }
  .loomos-appearance-description,
  .loomos-clothing-description {
    margin-bottom: 8px;
  }
  .loomos-appearance-anchor {
    background: color-mix(in srgb, var(--loomos-accent) 7%, var(--loomos-surface-2));
    border-left: 3px solid var(--loomos-accent);
    border-radius: 5px;
    display: grid;
    gap: 2px;
    line-height: 1.4;
    margin-top: 8px;
    padding: 7px 8px;
  }
  .loomos-appearance-anchor b {
    color: var(--loomos-muted);
    font-size: 8px;
    text-transform: uppercase;
  }
  .loomos-clothing-facts {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .loomos-clothing-layers {
    display: grid;
    gap: 5px;
  }
  .loomos-clothing-layers > div {
    background: var(--loomos-surface-2);
    border: 1px solid var(--loomos-soft-border);
    border-radius: 6px;
    display: grid;
    gap: 2px;
    padding: 6px 7px;
  }
  .loomos-clothing-layers b {
    color: var(--loomos-accent);
    font-size: 8px;
    text-transform: uppercase;
  }
  .loomos-clothing-layers small {
    color: var(--loomos-muted);
    font-size: 9px;
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
    .loomos-settings-grid, .loomos-two-column, .loomos-facts, .loomos-card-grid, .loomos-meter-grid, .loomos-appearance-facts { grid-template-columns: 1fr; }
    .loomos-status { max-width: 100%; }
    .loomos-button { flex: 1 1 auto; }
    .loomos-stat-grid { grid-template-columns: repeat(2, 1fr); }
    .loomos-header-actions button { min-width: 70px; }
  }

  @media (prefers-reduced-motion: reduce) {
    .loomos-state-pill.is-busy i {
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

  /* 0.1.9 mobile workspace redesign */
  .loomos-root {
    --loomos-canvas: color-mix(in srgb, var(--loomos-bg) 92%, #000);
    --loomos-surface-1: var(--loomos-bg);
    --loomos-surface-2: var(--loomos-panel);
    --loomos-surface-3: color-mix(in srgb, var(--loomos-panel) 76%, var(--loomos-bg));
    --loomos-soft-accent: color-mix(in srgb, var(--loomos-accent) 12%, transparent);
    --loomos-soft-border: color-mix(in srgb, var(--loomos-border) 72%, transparent);
    background: transparent;
    align-content: start;
    align-items: start;
    font-size: 13px;
    gap: 8px;
    grid-auto-rows: max-content;
    line-height: 1.42;
    max-width: none;
    overflow: visible;
    padding: 0 8px calc(14px + env(safe-area-inset-bottom)) !important;
    width: 100%;
  }
  .loomos-root[data-view="modal"] {
    max-width: none;
    padding-inline: 8px !important;
    width: 100%;
  }
  .loomos-root .loomos-tab-pane {
    overflow: visible;
  }
  .loomos-header-sticky {
    align-self: start;
    background: var(--loomos-canvas);
    border: 1px solid var(--loomos-soft-border);
    border-top: 0;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 8px 24px rgb(0 0 0 / .16);
    margin: 0 -8px;
    padding: 8px 8px 7px;
    top: 0;
  }
  .loomos-context-bar {
    align-items: center;
    display: flex;
    gap: 10px;
    justify-content: space-between;
    min-height: 32px;
  }
  .loomos-context-bar .loomos-title {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0;
    overflow: hidden;
  }
  .loomos-context-bar .loomos-title strong {
    font-size: 12px;
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loomos-context-bar .loomos-title span {
    font-size: 10px;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loomos-state-pill {
    align-items: center;
    border: 1px solid var(--loomos-soft-border);
    border-radius: 999px;
    color: var(--loomos-muted);
    display: inline-flex;
    flex: none;
    font-size: 10px;
    font-weight: 700;
    gap: 5px;
    min-height: 26px;
    padding: 3px 8px;
  }
  .loomos-state-pill i {
    background: var(--loomos-muted);
    border-radius: 50%;
    display: block;
    height: 6px;
    width: 6px;
  }
  .loomos-state-pill.is-ready {
    color: #65d98b;
  }
  .loomos-state-pill.is-ready i {
    background: #65d98b;
    box-shadow: 0 0 0 3px rgb(101 217 139 / .12);
  }
  .loomos-state-pill.is-busy {
    color: var(--loomos-accent);
  }
  .loomos-state-pill.is-busy i {
    background: var(--loomos-accent);
  }
  .loomos-header-actions {
    display: grid;
    gap: 5px;
    grid-template-columns: minmax(108px, 1.7fr) repeat(3, minmax(58px, 1fr));
    margin-top: 6px;
  }
  .loomos-header-actions .loomos-button {
    border-radius: 7px;
    font-size: 11px;
    min-height: 40px;
    min-width: 0;
    padding: 5px 7px;
  }
  .loomos-header-actions .loomos-action-primary {
    font-weight: 800;
  }
  .loomos-header-actions .loomos-action-delete {
    background: color-mix(in srgb, #df5259 8%, transparent);
  }
  .loomos-button,
  .loomos-select,
  .loomos-input {
    border-color: var(--loomos-soft-border);
    border-radius: 7px;
  }
  .loomos-button {
    min-height: 40px;
  }
  .loomos-button-primary {
    box-shadow: inset 0 0 0 1px rgb(255 255 255 / .08);
  }
  .loomos-tabs-nav {
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(auto-fit, minmax(64px, 1fr));
    margin-top: 7px;
    overflow: visible;
    padding: 0;
  }
  .loomos-tab-btn {
    align-items: center;
    background: transparent;
    border: 1px solid transparent;
    border-radius: 7px;
    color: var(--loomos-muted);
    display: flex;
    font-size: 10px;
    gap: 5px;
    justify-content: center;
    min-height: 38px;
    padding: 5px 6px;
  }
  .loomos-tab-btn small {
    align-items: center;
    background: var(--loomos-surface-3);
    border-radius: 999px;
    color: var(--loomos-muted);
    display: inline-flex;
    font-size: 9px;
    height: 17px;
    justify-content: center;
    min-width: 17px;
    padding: 0 4px;
  }
  .loomos-tab-btn:hover {
    background: var(--loomos-surface-3);
  }
  .loomos-tab-btn.active {
    background: var(--loomos-soft-accent);
    border-color: color-mix(in srgb, var(--loomos-accent) 46%, var(--loomos-border));
    color: var(--loomos-ink);
  }
  .loomos-tab-btn.active small {
    background: var(--loomos-accent);
    color: var(--lumiverse-accent-fg, #fff);
  }
  .loomos-tab-pane {
    min-height: 0;
    padding-top: 1px;
  }
  .loomos-view-heading {
    align-items: end;
    display: flex;
    gap: 10px;
    justify-content: space-between;
    padding: 4px 2px 7px;
  }
  .loomos-view-heading h2 {
    font-size: 17px;
    line-height: 1.2;
    margin: 2px 0 0;
  }
  .loomos-view-heading .loomos-status {
    flex: none;
  }
  .loomos-dashboard {
    gap: 6px;
  }
  .loomos-shell,
  .loomos-section {
    background: var(--loomos-surface-1);
    border-color: var(--loomos-soft-border);
    border-radius: 8px;
  }
  .loomos-section > summary {
    display: grid;
    gap: 8px;
    grid-template-columns: minmax(0, 1fr) auto 14px;
    min-height: 44px;
    padding: 8px 10px;
  }
  .loomos-section > summary::after {
    color: var(--loomos-muted);
    content: "+";
    font-size: 16px;
    font-weight: 500;
    line-height: 1;
    text-align: center;
  }
  .loomos-section[open] > summary::after {
    content: "-";
  }
  .loomos-section-title {
    font-size: 12px;
    font-weight: 800;
  }
  .loomos-section-summary {
    color: var(--loomos-muted);
    font-size: 10px;
    max-width: 44vw;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loomos-section[open] > summary {
    border-bottom-color: var(--loomos-soft-border);
  }
  .loomos-section-body {
    background: transparent;
    border-radius: 0;
    padding: 10px;
  }
  .loomos-overview-card {
    background: var(--loomos-surface-1);
    border: 1px solid var(--loomos-soft-border);
    border-left: 3px solid var(--loomos-accent);
    border-radius: 8px;
    display: grid;
    gap: 8px;
    margin: 0;
    padding: 11px 12px;
  }
  .loomos-overview-topline {
    align-items: center;
    display: flex;
    justify-content: space-between;
  }
  .loomos-overview-inject-active,
  .loomos-overview-inject-inactive {
    border: 1px solid var(--loomos-soft-border);
    border-radius: 999px;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 7px;
  }
  .loomos-overview-headline {
    font-size: 15px;
    font-style: normal;
    line-height: 1.35;
    margin: 0;
  }
  .loomos-overview-location {
    color: var(--loomos-muted);
    display: flex;
    flex-wrap: wrap;
    font-size: 10px;
    gap: 4px 8px;
    margin: 0;
  }
  .loomos-overview-location strong {
    color: var(--loomos-ink);
  }
  .loomos-overview-stats {
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    margin: 0;
  }
  .loomos-overview-stats span {
    align-items: center;
    background: var(--loomos-surface-3);
    border-radius: 6px;
    color: var(--loomos-muted);
    display: flex;
    flex-direction: column;
    font-size: 9px;
    justify-content: center;
    min-height: 42px;
    white-space: normal;
  }
  .loomos-overview-stats b {
    color: var(--loomos-ink);
    font-size: 14px;
    line-height: 1.1;
  }
  .loomos-overview-actions {
    align-items: center;
    border-top: 1px solid var(--loomos-soft-border);
    display: grid;
    gap: 8px;
    grid-template-columns: auto minmax(0, 1fr);
    padding-top: 8px;
  }
  .loomos-overview-actions .loomos-button {
    min-height: 34px;
  }
  .loomos-overview-actions > span {
    color: var(--loomos-muted);
    font-size: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loomos-facts {
    gap: 5px 10px;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    margin: 5px 0 9px;
  }
  .loomos-facts div {
    border-top-color: var(--loomos-soft-border);
    padding-top: 5px;
  }
  .loomos-facts dt,
  .loomos-subhead,
  .loomos-field > span {
    font-size: 9px;
    letter-spacing: 0;
  }
  .loomos-facts dd {
    font-size: 11px;
  }
  .loomos-chip {
    background: var(--loomos-surface-3);
    border-color: transparent;
    border-radius: 6px;
    font-size: 10px;
    padding: 3px 6px;
  }
  .loomos-card,
  .loomos-meter {
    background: var(--loomos-surface-3);
    border-color: var(--loomos-soft-border);
    border-radius: 7px;
    padding: 9px;
  }
  .loomos-tools-workspace {
    display: grid;
    gap: 7px;
  }
  .loomos-tools-intro {
    background: var(--loomos-surface-1);
    border: 1px solid var(--loomos-soft-border);
    border-radius: 8px;
    display: grid;
    gap: 3px;
    padding: 10px;
  }
  .loomos-tools-intro strong {
    font-size: 13px;
  }
  .loomos-tools-intro p {
    color: var(--loomos-muted);
    font-size: 11px;
    margin: 0;
  }
  .loomos-tools-grid {
    display: grid;
    gap: 7px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .loomos-tool-card {
    align-content: start;
    display: grid;
    gap: 7px;
    min-height: 132px;
  }
  .loomos-tool-card.is-empty {
    border-style: dashed;
  }
  .loomos-tool-card-heading {
    align-items: start;
    display: flex;
    gap: 8px;
    justify-content: space-between;
  }
  .loomos-tool-card-heading strong {
    display: block;
    font-size: 13px;
    line-height: 1.25;
  }
  .loomos-tool-state {
    align-items: center;
    border: 1px solid var(--loomos-soft-border);
    border-radius: 999px;
    color: var(--loomos-muted);
    display: inline-flex;
    flex: none;
    font-size: 9px;
    font-weight: 800;
    min-height: 22px;
    padding: 2px 7px;
  }
  .loomos-tool-state.is-ready {
    color: #65d98b;
  }
  .loomos-tool-lead {
    color: var(--loomos-ink);
    font-size: 12px;
    font-weight: 750;
    line-height: 1.35;
    margin: 0;
  }
  .loomos-image-prompt-card {
    background: color-mix(in srgb, var(--loomos-accent) 5%, var(--loomos-surface-3));
    grid-column: 1 / -1;
  }
  .loomos-image-blueprint {
    border: 1px solid var(--loomos-soft-border);
    border-radius: 7px;
    padding: 7px;
  }
  .loomos-image-blueprint summary {
    color: var(--loomos-muted);
    cursor: pointer;
    font-size: 10px;
    font-weight: 800;
  }
  .loomos-image-blueprint .loomos-facts {
    margin-top: 7px;
  }
  .loomos-tool-meta {
    display: grid;
    gap: 5px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .loomos-tool-meta span {
    background: var(--loomos-surface-1);
    border: 1px solid var(--loomos-soft-border);
    border-radius: 7px;
    color: var(--loomos-muted);
    display: grid;
    font-size: 10px;
    gap: 1px;
    padding: 6px;
  }
  .loomos-tool-meta b {
    color: var(--loomos-ink);
    font-size: 8px;
    text-transform: uppercase;
  }
  .loomos-prompt-output {
    background: var(--loomos-canvas);
    border: 1px solid var(--loomos-soft-border);
    border-radius: 8px;
    display: grid;
    gap: 6px;
    padding: 8px;
  }
  .loomos-prompt-output-heading {
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: space-between;
  }
  .loomos-prompt-output-heading span {
    color: var(--loomos-muted);
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
  }
  .loomos-prompt-output pre {
    color: var(--loomos-ink);
    font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    margin: 0;
    max-height: 420px;
    overflow: auto;
    white-space: pre-wrap;
  }
  .loomos-prompt-details {
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .loomos-prompt-details details {
    border: 1px solid var(--loomos-soft-border);
    border-radius: 7px;
    padding: 7px;
  }
  .loomos-prompt-details summary {
    color: var(--loomos-muted);
    cursor: pointer;
    font-size: 10px;
    font-weight: 800;
  }
  .loomos-prompt-details p {
    margin: 6px 0 0;
  }
  .loomos-section[data-section="cast"] .loomos-section-body {
    padding: 0;
  }
  .loomos-section[data-section="cast"] .loomos-list {
    gap: 0;
  }
  .loomos-section[data-section="cast"] .loomos-card {
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--loomos-soft-border);
    border-radius: 0;
    padding: 11px 10px;
  }
  .loomos-section[data-section="cast"] .loomos-card:last-child {
    border-bottom: 0;
  }
  .loomos-cast-meta {
    display: grid;
    gap: 4px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    margin: 7px 0;
  }
  .loomos-cast-meta span {
    background: var(--loomos-surface-3);
    border-radius: 6px;
    color: var(--loomos-muted);
    display: grid;
    font-size: 10px;
    gap: 1px;
    padding: 5px 6px;
  }
  .loomos-cast-meta b {
    color: var(--loomos-ink);
    font-size: 8px;
    font-weight: 800;
    text-transform: uppercase;
  }
  .loomos-cast-summary {
    display: grid;
    gap: 6px;
    margin: 0;
  }
  .loomos-cast-summary div {
    display: grid;
    gap: 2px;
    grid-template-columns: 46px minmax(0, 1fr);
  }
  .loomos-cast-summary dt {
    color: var(--loomos-muted);
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
  }
  .loomos-cast-summary dd {
    font-size: 11px;
    margin: 0;
  }
  .loomos-cast-extra {
    background: transparent;
    border-color: var(--loomos-soft-border);
    border-radius: 7px;
  }
  .loomos-cast-extra > summary {
    min-height: 38px;
    padding: 7px 8px;
  }
  .loomos-settings-view {
    display: grid;
    gap: 7px;
  }
  .loomos-settings-grid {
    display: grid;
    gap: 7px;
    grid-template-columns: 1fr;
    margin: 0;
  }
  .loomos-settings-cluster,
  .loomos-preset-manager,
  .loomos-performance-info,
  .loomos-schema-studio,
  .loomos-module-selector {
    background: var(--loomos-surface-1);
    border: 1px solid var(--loomos-soft-border);
    border-radius: 8px;
    margin: 0;
    padding: 10px;
  }
  .loomos-settings-cluster-heading {
    display: grid;
    gap: 1px;
    margin-bottom: 8px;
  }
  .loomos-settings-cluster-heading strong {
    font-size: 12px;
  }
  .loomos-settings-cluster-heading span {
    color: var(--loomos-muted);
    font-size: 10px;
  }
  .loomos-settings-fields {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
  .loomos-settings-switches {
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin-bottom: 8px;
  }
  .loomos-check {
    background: var(--loomos-surface-3);
    border: 1px solid var(--loomos-soft-border);
    border-radius: 7px;
    min-height: 42px;
    padding: 6px 8px;
  }
  .loomos-preset-manager {
    padding-bottom: 10px;
  }
  .loomos-preset-actions .loomos-button,
  .loomos-bulk-actions .loomos-button,
  .loomos-schema-actions .loomos-button {
    min-height: 36px;
  }
  .loomos-module-group-details {
    border-color: var(--loomos-soft-border);
    border-radius: 7px;
    margin-bottom: 6px;
  }
  .loomos-module-group-summary {
    background: var(--loomos-surface-3);
    min-height: 44px;
    padding: 8px 9px;
  }
  .loomos-module-card {
    gap: 6px;
    padding: 10px 8px;
  }
  .loomos-history-tab {
    gap: 7px;
  }
  .loomos-history-list {
    gap: 5px;
    max-height: none;
    overflow: visible;
  }
  .loomos-history-entry {
    background: var(--loomos-surface-1);
    border-color: var(--loomos-soft-border);
    border-radius: 8px;
    padding: 9px 10px;
  }
  .loomos-history-entry-header {
    display: grid;
    gap: 3px 6px;
    grid-template-columns: minmax(0, 1fr) auto;
  }
  .loomos-history-time {
    color: var(--loomos-muted);
    font-size: 9px;
  }
  .loomos-history-entry-header .loomos-badge {
    grid-column: 1 / -1;
    justify-self: start;
  }
  .loomos-history-entry-meta {
    gap: 4px 8px;
  }
  .loomos-history-entry-actions .loomos-button {
    min-height: 36px;
  }
  .loomos-badge-warning {
    border-color: #d58a42;
    color: #d58a42;
  }
  .loomos-search-bar {
    background: var(--loomos-surface-1);
    border: 1px solid var(--loomos-soft-border);
    border-radius: 8px;
    margin: 0;
    padding: 5px;
  }
  .loomos-search-bar .loomos-input {
    background: transparent;
    border: 0;
    min-height: 36px;
  }
  .loomos-search-bar .loomos-input:focus-visible {
    outline: 0;
  }
  .loomos-compile-status {
    border-radius: 8px;
    margin-top: 0 !important;
  }
  .loomos-diagnostics > summary {
    cursor: pointer;
    font-size: 11px;
    font-weight: 800;
    list-style: none;
  }
  .loomos-diagnostics > summary::-webkit-details-marker {
    display: none;
  }
  .loomos-continuity-explainer-text {
    font-size: 11px;
  }
  .loomos-continuity-metric,
  .loomos-continuity-risk-card {
    background: var(--loomos-surface-3);
    border-color: var(--loomos-soft-border);
    border-radius: 7px;
  }
  .loomos-continuity-safe {
    border-radius: 7px;
  }

  @media (min-width: 760px) {
    .loomos-root {
      padding-inline: 10px !important;
    }
    .loomos-header-sticky {
      margin-inline: -10px;
      padding-inline: 10px;
    }
    .loomos-header-actions {
      grid-template-columns: minmax(140px, 1.6fr) repeat(4, minmax(72px, .7fr));
    }
    .loomos-card-grid,
    .loomos-meter-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .loomos-settings-fields {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (max-width: 620px) {
    .loomos-root {
      padding-inline: 6px !important;
    }
    .loomos-header-sticky {
      margin-inline: -6px;
      padding-inline: 6px;
    }
    .loomos-header-actions {
      grid-template-columns: minmax(112px, 1.65fr) repeat(3, minmax(54px, 1fr));
    }
    .loomos-header-actions .loomos-button {
      min-width: 0;
    }
    .loomos-tabs-nav {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .loomos-settings-grid,
    .loomos-two-column,
    .loomos-card-grid,
    .loomos-meter-grid,
    .loomos-tools-grid,
    .loomos-prompt-details {
      grid-template-columns: 1fr;
    }
    .loomos-facts,
    .loomos-appearance-facts {
      grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
    }
    .loomos-root[data-view="drawer"] .loomos-facts,
    .loomos-root[data-view="drawer"] .loomos-appearance-facts {
      grid-template-columns: repeat(auto-fit, minmax(125px, 1fr)) !important;
    }
  }

  @media (max-width: 380px) {
    .loomos-context-bar .loomos-title span {
      max-width: 190px;
    }
    .loomos-header-actions {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .loomos-header-actions .loomos-action-primary {
      grid-column: 1 / -1;
    }
    .loomos-tabs-nav {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .loomos-tab-btn {
      font-size: 9px;
      gap: 3px;
    }
    .loomos-settings-switches,
    .loomos-settings-fields {
      grid-template-columns: 1fr;
    }
    .loomos-overview-stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .loomos-cast-meta {
      grid-template-columns: 1fr;
    }
    .loomos-history-entry {
      display: grid;
    }
    .loomos-history-entry-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .loomos-state-pill.is-busy i {
      animation: none;
    }
  }

  /* 0.1.13 chat tracker viewer */
  .loomos-root[data-view="modal"] {
    container-name: loomos-viewer;
    container-type: inline-size;
    gap: 0;
    overflow-x: clip;
    padding: 0 6px calc(12px + env(safe-area-inset-bottom)) !important;
  }
  .loomos-viewer-shell,
  .loomos-viewer-frame {
    align-content: start;
    display: grid;
    gap: 8px;
    grid-auto-rows: max-content;
    min-width: 0;
  }
  .loomos-viewer-command {
    background: var(--loomos-canvas);
    border: 1px solid var(--loomos-soft-border);
    border-top: 0;
    border-radius: 0 0 8px 8px;
    display: grid;
    gap: 6px;
    margin-inline: -6px;
    padding: 6px 7px;
    position: sticky;
    top: 0;
    z-index: 110;
  }
  .loomos-viewer-context {
    display: grid;
    gap: 1px;
    min-width: 0;
  }
  .loomos-viewer-eyebrow {
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: space-between;
  }
  .loomos-viewer-context h1 {
    display: -webkit-box;
    font-size: 15px;
    line-height: 1.18;
    margin: 1px 0 2px;
    overflow: hidden;
    overflow-wrap: anywhere;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
  .loomos-viewer-context p,
  .loomos-viewer-context small {
    color: var(--loomos-muted);
    font-size: 10px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loomos-viewer-context small {
    color: color-mix(in srgb, var(--loomos-muted) 78%, transparent);
    font-size: 9px;
  }
  .loomos-viewer-command .loomos-state-pill {
    font-size: 9px;
    min-height: 22px;
    padding: 2px 6px;
  }
  .loomos-viewer-actions {
    display: grid;
    gap: 4px;
    grid-template-columns: minmax(92px, 1.35fr) repeat(2, minmax(62px, .8fr));
  }
  .loomos-viewer-actions .loomos-button {
    border-radius: 6px;
    font-size: 10px;
    min-height: 34px;
    padding: 4px 7px;
  }
  .loomos-viewer-primary {
    font-weight: 900;
  }
  .loomos-root[data-view="modal"] .loomos-viewer-tabs {
    background: var(--loomos-surface-2);
    border: 1px solid var(--loomos-soft-border);
    border-radius: 8px;
    display: grid;
    gap: 3px;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    margin: 0;
    padding: 4px;
    position: sticky;
    top: 88px;
    z-index: 105;
  }
  .loomos-root[data-view="modal"] .loomos-viewer-tabs .loomos-tab-btn {
    border-radius: 6px;
    min-height: 40px;
    padding: 5px 4px;
  }
  .loomos-viewer-pane {
    display: grid;
    gap: 7px;
    min-width: 0;
    padding-top: 0;
  }
  .loomos-root[data-view="modal"] .loomos-dashboard {
    gap: 7px;
  }
  .loomos-root[data-view="modal"] .loomos-overview-card {
    border-left-width: 4px;
    padding: 12px;
  }
  .loomos-root[data-view="modal"] .loomos-overview-headline {
    font-size: 16px;
    text-wrap: balance;
  }
  .loomos-root[data-view="modal"] .loomos-section,
  .loomos-root[data-view="modal"] .loomos-stock-template {
    box-shadow: 0 1px 0 rgb(255 255 255 / .025);
  }
  .loomos-root[data-view="modal"] .loomos-section[open] > summary {
    background: color-mix(in srgb, var(--loomos-surface-3) 72%, transparent);
  }
  .loomos-root[data-view="modal"] .loomos-cast-meta {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .loomos-root[data-view="modal"] .loomos-history-list {
    max-height: none;
    overflow: visible;
  }
  .loomos-root[data-view="modal"] .loomos-history-entry {
    display: grid;
    gap: 8px;
    grid-template-columns: minmax(0, 1fr) 92px;
    padding: 10px;
  }
  .loomos-root[data-view="modal"] .loomos-history-entry-actions {
    align-content: stretch;
    display: grid;
    gap: 5px;
    grid-template-columns: 1fr;
  }
  .loomos-root[data-view="modal"] .loomos-history-entry-actions .loomos-button {
    min-height: 40px;
    width: 100%;
  }
  .loomos-root[data-view="modal"] .loomos-history-active {
    box-shadow: inset 3px 0 0 var(--loomos-accent);
  }
  .loomos-stock-template {
    min-width: 0;
  }

  /* Schema and Presentation Studio */
  .loomos-creation-studio > summary {
    min-height: 48px;
  }
  .loomos-studio-hero {
    align-items: start;
    border-bottom: 1px solid var(--loomos-soft-border);
    display: flex;
    gap: 12px;
    justify-content: space-between;
    padding-bottom: 10px;
  }
  .loomos-studio-hero h3,
  .loomos-studio-library-heading h3,
  .loomos-editor-intro h3 {
    font-size: 15px;
    margin: 2px 0 4px;
  }
  .loomos-studio-hero p {
    color: var(--loomos-muted);
    font-size: 11px;
    margin: 0;
    max-width: 68ch;
  }
  .loomos-studio-actions {
    display: grid;
    gap: 6px;
    grid-template-columns: minmax(150px, 1.5fr) repeat(2, minmax(110px, 1fr));
  }
  .loomos-studio-library {
    display: grid;
    gap: 5px;
  }
  .loomos-studio-library-heading {
    align-items: end;
    display: flex;
    justify-content: space-between;
    padding: 8px 2px 4px;
  }
  .loomos-studio-library-heading > span {
    color: var(--loomos-muted);
    font-size: 11px;
  }
  .loomos-studio-module-row {
    align-items: center;
    border-top: 1px solid var(--loomos-soft-border);
    display: grid;
    gap: 8px;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 8px 2px;
  }
  .loomos-studio-module-copy {
    display: grid;
    gap: 3px;
    min-width: 0;
  }
  .loomos-studio-module-title {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
  .loomos-studio-module-title code {
    color: var(--loomos-muted);
    font-size: 9px;
  }
  .loomos-studio-module-copy p {
    color: var(--loomos-muted);
    font-size: 10px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loomos-studio-module-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: end;
  }
  .loomos-studio-empty {
    min-height: 64px;
  }
  .loomos-portable-dialog,
  .loomos-viewer-editor {
    display: grid;
    gap: 10px;
  }
  .loomos-portable-json {
    font: 11px/1.45 ui-monospace, SFMono-Regular, Consolas, monospace;
    min-height: 280px;
    resize: vertical;
  }
  .loomos-file-drop {
    align-items: center;
    background: var(--loomos-surface-3);
    border: 1px dashed color-mix(in srgb, var(--loomos-accent) 52%, var(--loomos-border));
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    min-height: 54px;
    padding: 8px;
  }
  .loomos-file-drop input {
    max-width: 190px;
  }
  .loomos-dialog-error {
    color: #e56b70;
    font-size: 11px;
    margin: 0;
  }
  .loomos-editor-intro {
    align-items: center;
    display: flex;
    gap: 12px;
    justify-content: space-between;
  }
  .loomos-code-grid {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .loomos-code-grid .loomos-code-editor {
    min-height: 280px;
  }
  .loomos-viewer-template-preview {
    background: var(--loomos-canvas);
    max-height: 420px;
    overflow: auto;
    padding: 6px;
  }

  /* Full-screen tracker runtime */
  .loomos-root[data-view="modal"] {
    align-content: stretch;
    align-items: stretch;
    container: loomos-viewer / inline-size;
    grid-auto-rows: minmax(0, 1fr);
    height: 100%;
    max-height: 100%;
    max-width: 100vw;
    overflow: hidden;
    padding: 0 !important;
    width: 100%;
  }
  .loomos-viewer-app {
    background: var(--loomos-canvas, #101114);
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    height: 100%;
    min-height: 0;
    width: 100%;
  }
  .loomos-viewer-core {
    align-items: center;
    background: color-mix(in srgb, var(--loomos-bg) 96%, #000);
    border-bottom: 1px solid var(--loomos-border);
    display: flex;
    gap: 8px;
    justify-content: space-between;
    min-height: 48px;
    padding: max(6px, env(safe-area-inset-top)) 8px 6px;
    position: relative;
    z-index: 110;
  }
  .loomos-viewer-core-context {
    display: grid;
    flex: 1;
    gap: 0;
    min-width: 0;
  }
  .loomos-viewer-core-context strong,
  .loomos-viewer-core-context span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loomos-viewer-core-context strong { font-size: 12px; }
  .loomos-viewer-core-context span { color: var(--loomos-muted); font-size: 9px; }
  .loomos-viewer-core-actions {
    align-items: center;
    display: flex;
    flex: 0 0 auto;
    gap: 5px;
  }
  .loomos-core-icon,
  .loomos-core-generate,
  .loomos-viewer-more > summary {
    align-items: center;
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 7px;
    color: var(--loomos-ink);
    cursor: pointer;
    display: inline-flex;
    justify-content: center;
    min-height: 34px;
  }
  .loomos-core-icon,
  .loomos-viewer-more > summary {
    font-size: 20px;
    height: 34px;
    list-style: none;
    padding: 0;
    width: 34px;
  }
  .loomos-viewer-more > summary::-webkit-details-marker { display: none; }
  .loomos-core-generate {
    background: var(--loomos-accent);
    border-color: var(--loomos-accent);
    color: var(--lumiverse-accent-fg, #fff);
    gap: 6px;
    min-width: 84px;
    padding: 0 10px;
  }
  .loomos-core-generate.is-busy {
    background: color-mix(in srgb, #df5259 24%, var(--loomos-panel));
    border-color: #df5259;
    color: #ff858a;
  }
  .loomos-core-generate b { font-size: 10px; }
  .loomos-viewer-more { position: relative; }
  .loomos-viewer-menu {
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 8px;
    box-shadow: 0 14px 36px rgba(0, 0, 0, .38);
    display: grid;
    min-width: min(250px, calc(100vw - 20px));
    overflow: hidden;
    position: absolute;
    right: 0;
    top: calc(100% + 6px);
    z-index: 120;
  }
  .loomos-viewer-menu button {
    align-items: center;
    background: transparent;
    border: 0;
    border-bottom: 1px solid var(--loomos-border);
    color: var(--loomos-ink);
    cursor: pointer;
    display: flex;
    font-size: 11px;
    justify-content: space-between;
    min-height: 40px;
    padding: 8px 11px;
    text-align: left;
  }
  .loomos-viewer-menu button:hover,
  .loomos-viewer-menu button:focus-visible {
    background: color-mix(in srgb, var(--loomos-accent) 10%, var(--loomos-panel));
  }
  .loomos-viewer-menu button.is-danger { color: #ff858a; }
  .loomos-viewer-stage {
    min-height: 0;
    overflow: hidden;
    position: relative;
  }
  .loomos-viewer-stage.is-native {
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: max(14px, env(safe-area-inset-bottom));
  }
  .loomos-viewer-stage.is-native > .loomos-viewer-tabs {
    top: 0;
  }
  .loomos-theme-frame {
    background: #101114;
    border: 0;
    display: block;
    height: 100%;
    width: 100%;
  }
  .loomos-theme-trust-note {
    background: #322a18;
    border-bottom: 1px solid #66552a;
    color: #f2d789;
    font-size: 10px;
    padding: 6px 10px;
  }
  .loomos-theme-trust-note + .loomos-theme-frame {
    height: calc(100% - 30px);
  }
  .loomos-viewer-utility,
  .loomos-viewer-stage > .loomos-viewer-tabs,
  .loomos-viewer-stage > .loomos-compile-status,
  .loomos-viewer-stage > .loomos-viewer-pane {
    margin-left: 8px;
    margin-right: 8px;
  }
  .loomos-viewer-utility {
    height: 100%;
    overflow: auto;
    padding: 10px 0 max(18px, env(safe-area-inset-bottom));
  }

  /* Creator Workshop */
  .loomos-workshop-root {
    --loomos-code-bg: #0e1015;
    --loomos-code-gutter: #171a20;
    align-content: stretch;
    align-items: stretch;
    grid-auto-rows: minmax(0, 1fr);
    height: 100%;
    max-height: 100%;
    max-width: 100vw;
    overflow: hidden;
    padding: 0 !important;
    width: 100%;
  }
  .loomos-workshop {
    background: var(--loomos-bg);
    display: grid;
    grid-template-rows: auto auto minmax(0, 1fr);
    height: 100%;
    min-height: 0;
  }
  .loomos-workshop-core {
    align-items: center;
    background: color-mix(in srgb, var(--loomos-panel) 95%, #000);
    border-bottom: 1px solid var(--loomos-border);
    display: flex;
    gap: 10px;
    justify-content: space-between;
    min-height: 52px;
    padding: max(8px, env(safe-area-inset-top)) 10px 8px;
  }
  .loomos-workshop-core > div:first-child {
    display: grid;
    min-width: 0;
  }
  .loomos-workshop-core strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loomos-workshop-core-actions {
    display: flex;
    flex: 0 0 auto;
    gap: 5px;
  }
  .loomos-workshop-nav {
    background: var(--loomos-bg);
    border-bottom: 1px solid var(--loomos-border);
    display: flex;
    gap: 2px;
    overflow-x: auto;
    padding: 5px 8px;
    scrollbar-width: none;
  }
  .loomos-workshop-nav::-webkit-scrollbar { display: none; }
  .loomos-workshop-nav button,
  .loomos-code-files button,
  .loomos-preview-sizes button,
  .loomos-ai-kind-row button {
    background: transparent;
    border: 1px solid transparent;
    border-radius: 6px;
    color: var(--loomos-muted);
    cursor: pointer;
    font-size: 10px;
    font-weight: 800;
    min-height: 32px;
    padding: 5px 9px;
    white-space: nowrap;
  }
  .loomos-workshop-nav button.active,
  .loomos-code-files button.active,
  .loomos-preview-sizes button.active,
  .loomos-ai-kind-row button.active {
    background: color-mix(in srgb, var(--loomos-accent) 14%, var(--loomos-panel));
    border-color: color-mix(in srgb, var(--loomos-accent) 55%, var(--loomos-border));
    color: var(--loomos-ink);
  }
  .loomos-workshop-content {
    min-height: 0;
    overflow: auto;
    padding: 10px 10px max(20px, env(safe-area-inset-bottom));
  }
  .loomos-workshop-panel {
    display: grid;
    gap: 12px;
    margin: 0 auto;
    max-width: 1120px;
    width: 100%;
  }
  .loomos-workshop-heading {
    align-items: end;
    display: flex;
    gap: 12px;
    justify-content: space-between;
  }
  .loomos-workshop-heading h2,
  .loomos-ai-stage h3 {
    font-size: 17px;
    margin: 2px 0 0;
  }
  .loomos-workshop-search { max-width: 280px; width: 42%; }
  .loomos-workshop-create-grid,
  .loomos-workshop-summary {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .loomos-workshop-create-grid > button {
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 8px;
    color: var(--loomos-ink);
    cursor: pointer;
    display: grid;
    gap: 3px;
    min-height: 72px;
    padding: 11px;
    text-align: left;
  }
  .loomos-workshop-create-grid > button:hover {
    border-color: var(--loomos-accent);
  }
  .loomos-workshop-create-grid span { color: var(--loomos-muted); font-size: 10px; }
  .loomos-workshop-library { display: grid; gap: 5px; }
  .loomos-workshop-artifact {
    align-items: center;
    border-bottom: 1px solid var(--loomos-border);
    display: grid;
    gap: 8px;
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 5px 0;
  }
  .loomos-workshop-artifact.is-selected {
    background: color-mix(in srgb, var(--loomos-accent) 7%, transparent);
  }
  .loomos-workshop-artifact-main {
    background: transparent;
    border: 0;
    color: var(--loomos-ink);
    cursor: pointer;
    display: grid;
    gap: 2px;
    padding: 7px;
    text-align: left;
  }
  .loomos-workshop-artifact-main small {
    color: var(--loomos-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .loomos-artifact-kind {
    color: #5eead4;
    font-size: 9px;
    font-weight: 900;
    text-transform: uppercase;
  }
  .loomos-workshop-artifact-meta {
    align-items: end;
    color: var(--loomos-muted);
    display: grid;
    font-size: 9px;
    gap: 2px;
    justify-items: end;
    padding-right: 8px;
  }
  .loomos-workshop-actions,
  .loomos-ai-kind-row,
  .loomos-code-files,
  .loomos-preview-sizes {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .loomos-ai-brief { min-height: 160px; resize: vertical; }
  .loomos-workshop-live-status { color: var(--loomos-muted); font-size: 10px; }
  .loomos-ai-stage {
    align-items: center;
    border-left: 3px solid #5eead4;
    display: flex;
    gap: 12px;
    justify-content: space-between;
    padding: 10px 12px;
  }
  .loomos-ai-stage p { color: var(--loomos-muted); margin: 3px 0 0; }
  .loomos-code-files {
    overflow-x: auto;
    scrollbar-width: none;
  }
  .loomos-code-files::-webkit-scrollbar { display: none; }
  .loomos-code-editor-host {
    border: 1px solid var(--loomos-border);
    border-radius: 7px;
    min-height: 300px;
    overflow: hidden;
  }
  .loomos-code-editor-host .cm-editor { min-height: 300px; }
  .loomos-code-editor-host .cm-scroller { max-height: min(58dvh, 620px); overflow: auto; }
  .loomos-preview-stage {
    align-self: start;
    background: #090a0d;
    border: 1px solid var(--loomos-border);
    display: grid;
    height: min(68dvh, 760px);
    justify-self: center;
    overflow: hidden;
    place-items: stretch;
    width: 100%;
  }
  .loomos-preview-stage.is-mobile { max-width: 390px; }
  .loomos-preview-stage.is-tablet { max-width: 760px; }
  .loomos-preview-stage.is-desktop { max-width: 1120px; }
  .loomos-preview-stage iframe { border: 0; height: 100%; width: 100%; }
  .loomos-diagnostic-list { display: grid; gap: 5px; }
  .loomos-diagnostic-list > div {
    align-items: start;
    border-left: 3px solid var(--loomos-border);
    display: grid;
    gap: 8px;
    grid-template-columns: 62px minmax(0, 1fr);
    padding: 7px 9px;
  }
  .loomos-diagnostic-list .is-ok { border-left-color: #45c58a; }
  .loomos-diagnostic-list .is-warning { border-left-color: #d6a64a; }
  .loomos-diagnostic-list .is-error { border-left-color: #df5259; }
  .loomos-diagnostic-list strong { font-size: 9px; text-transform: uppercase; }
  .loomos-revision-list { display: grid; gap: 5px; }
  .loomos-revision-list article {
    align-items: center;
    border-bottom: 1px solid var(--loomos-border);
    display: flex;
    justify-content: space-between;
    min-height: 48px;
    padding: 5px 0;
  }
  .loomos-revision-list article > div { display: grid; }
  .loomos-revision-list small { color: var(--loomos-muted); }
  .loomos-blueprint-parts { display: grid; gap: 5px; }
  .loomos-blueprint-parts .loomos-check {
    border-bottom: 1px solid var(--loomos-border);
    padding: 6px 0;
  }
  .loomos-blueprint-parts .loomos-check span { display: grid; }
  .loomos-workshop-summary {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .loomos-workshop-summary div {
    border-top: 1px solid var(--loomos-border);
    display: grid;
    padding: 8px 0;
    text-align: center;
  }
  .loomos-workshop-summary strong { font-size: 17px; }
  .loomos-workshop-summary span { color: var(--loomos-muted); font-size: 9px; text-transform: uppercase; }
  .sr-only {
    clip: rect(0, 0, 0, 0);
    clip-path: inset(50%);
    height: 1px;
    overflow: hidden;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  }

  @container loomos-viewer (max-width: 620px) {
    .loomos-viewer-actions {
      grid-template-columns: minmax(92px, 1.35fr) repeat(2, minmax(58px, .8fr));
    }
    .loomos-root[data-view="modal"] .loomos-viewer-tabs {
      grid-template-columns: repeat(4, minmax(0, 1fr));
      position: static;
    }
    .loomos-tools-grid,
    .loomos-prompt-details {
      grid-template-columns: 1fr;
    }
    .loomos-clothing-facts {
      grid-template-columns: 1fr;
    }
    .loomos-root[data-view="modal"] .loomos-overview-stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @container loomos-viewer (max-width: 420px) {
    .loomos-root[data-view="modal"] .loomos-history-entry {
      grid-template-columns: 1fr;
    }
    .loomos-root[data-view="modal"] .loomos-history-entry-actions {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .loomos-root[data-view="modal"] .loomos-cast-meta {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  @media (max-width: 620px) {
    .loomos-viewer-core-context { max-width: 42%; }
    .loomos-core-generate { min-width: 72px; padding: 0 8px; }
    .loomos-workshop-create-grid { grid-template-columns: 1fr; }
    .loomos-workshop-summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .loomos-workshop-heading,
    .loomos-ai-stage {
      align-items: stretch;
      flex-direction: column;
    }
    .loomos-workshop-search { max-width: none; width: 100%; }
    .loomos-workshop-artifact { grid-template-columns: minmax(0, 1fr) 64px; }
    .loomos-studio-actions,
    .loomos-code-grid {
      grid-template-columns: 1fr;
    }
    .loomos-studio-module-row {
      align-items: stretch;
      grid-template-columns: 1fr;
    }
    .loomos-studio-module-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .loomos-editor-intro,
    .loomos-studio-hero {
      align-items: stretch;
      flex-direction: column;
    }
  }
`;
