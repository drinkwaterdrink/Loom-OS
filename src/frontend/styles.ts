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
  }
  .loomos-shell { padding: 10px; }
  .loomos-header, .loomos-toolbar, .loomos-row-title, .loomos-card-heading {
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: space-between;
  }
  .loomos-title { display: grid; gap: 1px; min-width: 0; }
  .loomos-title strong { font-size: 15px; }
  .loomos-title span, .loomos-muted, .loomos-row small, .loomos-card small { color: var(--loomos-muted); }
  .loomos-status, .loomos-badge {
    border: 1px solid var(--loomos-border);
    border-radius: 999px;
    color: var(--loomos-muted);
    font-size: 10px;
    padding: 3px 7px;
  }
  .loomos-status { max-width: 55%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .loomos-toolbar { flex-wrap: wrap; justify-content: flex-start; margin-top: 10px; }
  .loomos-button, .loomos-select, .loomos-input {
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 8px;
    color: var(--loomos-ink);
    min-height: 34px;
    padding: 6px 9px;
  }
  .loomos-button { cursor: pointer; font-weight: 700; }
  .loomos-button:hover, .loomos-button:focus-visible, .loomos-select:focus-visible, .loomos-input:focus-visible {
    border-color: var(--loomos-accent);
    outline: 2px solid color-mix(in srgb, var(--loomos-accent) 35%, transparent);
    outline-offset: 1px;
  }
  .loomos-button-primary { background: var(--loomos-accent); color: var(--lumiverse-accent-fg, #fff); }
  .loomos-button-danger { color: #e56b70; }
  .loomos-button:disabled, .loomos-input:disabled { cursor: not-allowed; opacity: .48; }
  .loomos-settings > summary, .loomos-section > summary {
    cursor: pointer;
    font-weight: 800;
    list-style: none;
  }
  .loomos-settings > summary { padding: 2px; }
  .loomos-section > summary {
    align-items: center;
    display: flex;
    gap: 8px;
    justify-content: space-between;
    padding: 10px;
  }
  .loomos-section > summary small { color: var(--loomos-muted); font-weight: 500; max-width: 62%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .loomos-section[open] > summary { border-bottom: 1px solid var(--loomos-border); }
  .loomos-section-body { background: var(--loomos-panel); border-radius: 0 0 11px 11px; padding: 10px; }
  .loomos-dashboard { display: grid; gap: 9px; }
  .loomos-settings-grid, .loomos-two-column, .loomos-facts {
    display: grid;
    gap: 9px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .loomos-settings-grid { margin-top: 10px; }
  .loomos-field { display: grid; gap: 4px; min-width: 0; }
  .loomos-field > span, .loomos-subhead { color: var(--loomos-muted); font-size: 10px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; }
  .loomos-check { align-items: center; display: flex; gap: 7px; min-height: 34px; }
  .loomos-kicker { color: var(--loomos-accent); display: block; font-size: 9px; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }
  .loomos-hero { display: grid; gap: 3px; }
  .loomos-hero strong { font-size: 15px; }
  .loomos-hero p, .loomos-card p, .loomos-row p { margin: 5px 0; }
  .loomos-facts { margin: 9px 0; }
  .loomos-facts div { border-top: 1px solid var(--loomos-border); min-width: 0; padding-top: 5px; }
  .loomos-facts dt { color: var(--loomos-muted); font-size: 9px; text-transform: uppercase; }
  .loomos-facts dd { margin: 2px 0 0; overflow-wrap: anywhere; }
  .loomos-facts-tight { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .loomos-chip-row { display: flex; flex-wrap: wrap; gap: 5px; margin: 5px 0 8px; }
  .loomos-chip { border: 1px solid var(--loomos-border); border-radius: 999px; color: var(--loomos-muted); font-size: 10px; padding: 2px 6px; }
  .loomos-callout, .loomos-note { border-left: 3px solid var(--loomos-accent); margin-bottom: 8px; padding: 7px 9px; }
  .loomos-list { display: grid; gap: 7px; }
  .loomos-row { border-left: 2px solid var(--loomos-border); padding-left: 8px; }
  .loomos-row-title { align-items: flex-start; }
  .loomos-row-title strong { overflow-wrap: anywhere; }
  .loomos-row-title span { color: var(--loomos-muted); font-size: 9px; text-transform: uppercase; }
  .loomos-severity-high, .loomos-priority-high, .loomos-importance-high { border-left-color: #d58a42; }
  .loomos-severity-critical, .loomos-priority-critical, .loomos-importance-critical { border-left-color: #df5259; }
  .loomos-card-grid, .loomos-meter-grid { display: grid; gap: 8px; grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .loomos-card, .loomos-meter { background: color-mix(in srgb, var(--loomos-bg) 65%, transparent); border: 1px solid var(--loomos-border); border-radius: 9px; padding: 9px; }
  .loomos-card-heading { align-items: flex-start; }
  .loomos-card-heading strong { display: block; }
  .loomos-meter-track { background: var(--loomos-border); border-radius: 999px; height: 5px; margin: 6px 0; overflow: hidden; }
  .loomos-meter-track i { background: var(--loomos-accent); display: block; height: 100%; }
  .loomos-stat-grid { display: grid; gap: 6px; grid-template-columns: repeat(4, 1fr); margin-bottom: 9px; }
  .loomos-stat-grid div { border: 1px solid var(--loomos-border); border-radius: 8px; display: grid; padding: 6px; text-align: center; }
  .loomos-stat-grid span { color: var(--loomos-muted); font-size: 9px; text-transform: uppercase; }
  .loomos-empty { padding: 24px 12px; text-align: center; }
  .loomos-empty h3 { margin: 0 0 5px; }
  .loomos-empty p { color: var(--loomos-muted); margin: 0 auto 12px; max-width: 440px; }
  .loomos-module-wrap { border: 1px solid var(--loomos-border); border-radius: 9px; grid-column: 1 / -1; overflow: hidden; }
  .loomos-module-head, .loomos-module-row { align-items: center; display: grid; gap: 6px; grid-template-columns: minmax(145px, 1fr) repeat(3, 54px); padding: 7px 8px; }
  .loomos-module-head { background: var(--loomos-bg); color: var(--loomos-muted); font-size: 9px; font-weight: 900; text-align: center; text-transform: uppercase; }
  .loomos-module-head span:first-child { text-align: left; }
  .loomos-module-row { border-top: 1px solid var(--loomos-border); }
  .loomos-module-row label:first-child { min-width: 0; }
  .loomos-module-row strong, .loomos-module-row small { display: block; }
  .loomos-module-row small { color: var(--loomos-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .loomos-module-row input { justify-self: center; }
  .loomos-hint { color: var(--loomos-muted); font-size: 11px; grid-column: 1 / -1; margin: 0; }
  .loomos-diagnostic { color: var(--loomos-muted); font: 11px/1.5 ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre-wrap; }
  @media (max-width: 620px) {
    .loomos-root { padding: 6px; }
    .loomos-settings-grid, .loomos-two-column, .loomos-facts, .loomos-card-grid, .loomos-meter-grid { grid-template-columns: 1fr; }
    .loomos-status { max-width: 46%; }
    .loomos-button { flex: 1 1 auto; }
    .loomos-stat-grid { grid-template-columns: repeat(2, 1fr); }
    .loomos-module-head, .loomos-module-row { grid-template-columns: minmax(118px, 1fr) repeat(3, 44px); padding-inline: 6px; }
    .loomos-module-row small { display: none; }
  }

  /* Upgraded LoomOS command deck design elements */
  .loomos-overview-card {
    background: linear-gradient(135deg, var(--loomos-panel), var(--loomos-bg));
    border-left: 4px solid var(--loomos-accent);
    padding: 12px 14px;
    margin-bottom: 8px;
  }
  .loomos-overview-headline {
    font-size: 15px;
    font-weight: 700;
    font-style: italic;
    color: var(--loomos-ink);
    margin: 6px 0 10px;
    line-height: 1.35;
  }
  .loomos-overview-details {
    display: grid;
    gap: 6px;
    font-size: 11px;
  }
  .loomos-overview-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 4px;
    color: var(--loomos-muted);
  }
  .loomos-overview-inject-active {
    color: #4cd27e;
  }
  .loomos-overview-inject-inactive {
    color: var(--loomos-muted);
  }

  .loomos-preset-manager {
    border-bottom: 1px solid var(--loomos-border);
    margin-bottom: 12px;
    padding-bottom: 12px;
  }
  .loomos-preset-select-row {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 6px;
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
  }
  .loomos-search-bar input {
    flex: 1;
    padding-right: 24px;
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
  .loomos-button-clear:hover {
    color: var(--loomos-ink);
  }
  .loomos-search-count {
    color: var(--loomos-muted);
    font-size: 10px;
    white-space: nowrap;
  }
  .loomos-bulk-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 12px;
  }
  .loomos-btn-sm {
    font-size: 10px;
    min-height: 26px;
    padding: 2px 6px;
  }
  .loomos-module-groups {
    display: grid;
    gap: 12px;
  }
  .loomos-module-group-card {
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 10px;
    overflow: hidden;
  }
  .loomos-module-group-title {
    background: color-mix(in srgb, var(--loomos-bg) 40%, var(--loomos-panel));
    border-bottom: 1px solid var(--loomos-border);
    color: var(--loomos-ink);
    font-size: 11px;
    font-weight: 900;
    letter-spacing: .06em;
    padding: 6px 10px;
    text-transform: uppercase;
  }
  .loomos-module-group-list {
    display: grid;
    gap: 0;
  }
  .loomos-module-card {
    border-bottom: 1px solid var(--loomos-border);
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px;
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
  }
  .loomos-pill {
    border: 1px solid var(--loomos-border);
    border-radius: 4px;
    font-size: 9px;
    font-weight: 800;
    padding: 1px 4px;
    text-transform: uppercase;
  }
  .pill-core {
    border-color: #ba8b43;
    color: #ba8b43;
  }
  .pill-experimental {
    border-color: #d24c52;
    color: #d24c52;
  }
  .pill-injected {
    border-color: #25f2d0;
    color: #25f2d0;
  }
  .pill-hidden {
    border-color: var(--loomos-muted);
    color: var(--loomos-muted);
  }
  .pill-custom {
    border-color: #7c6cff;
    color: #7c6cff;
  }
  .loomos-module-toggles {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: flex-start;
  }
  .loomos-toggle-target {
    align-items: center;
    background: var(--loomos-bg);
    border: 1px solid var(--loomos-border);
    border-radius: 6px;
    cursor: pointer;
    display: inline-flex;
    gap: 6px;
    min-height: 38px;
    padding: 4px 8px;
    user-select: none;
  }
  .loomos-toggle-target:hover {
    border-color: var(--loomos-accent);
  }
  .loomos-toggle-target input {
    margin: 0;
  }
  .loomos-toggle-target span {
    font-size: 11px;
    font-weight: 700;
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
  .loomos-link-btn-danger {
    color: #e56b70;
  }

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
  }

  .loomos-performance-info {
    background: var(--loomos-panel);
    border: 1px solid var(--loomos-border);
    border-radius: 10px;
    padding: 10px;
    margin-top: 12px;
  }
  .loomos-perf-row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    margin-bottom: 6px;
  }
  .loomos-perf-badge {
    border-radius: 4px;
    font-size: 9px;
    font-weight: 800;
    padding: 1px 6px;
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
  }
  .loomos-cast-extra > summary {
    padding: 6px 8px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    color: var(--loomos-muted);
  }
  .loomos-cast-extra[open] > summary {
    border-bottom: 1px solid var(--loomos-border);
  }
  .loomos-cast-extra-body {
    padding: 8px;
    font-size: 11px;
  }

  .loomos-root {
    padding-bottom: 64px !important;
  }
`;
