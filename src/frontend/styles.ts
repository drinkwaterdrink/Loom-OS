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
    max-width: 100%;
    overflow-x: hidden;
    padding-bottom: 72px !important;
  }
  .loomos-root *, .loomos-root *::before, .loomos-root *::after { box-sizing: border-box; }
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
`;
