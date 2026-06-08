import type { ModuleKey } from "./modules";
import {
  escapeTemplateData,
  sanitizeCustomHtml,
  scopeCustomCss,
} from "./customTemplates";

export const STARTER_VIEWER_HTML = `<div class="viewer-frame">
  <header class="viewer-command-slot">{{command}}</header>
  <div class="viewer-navigation-slot">{{navigation}}</div>
  <main class="viewer-content-slot">{{content}}</main>
</div>`;

export const STARTER_VIEWER_CSS = `.viewer-frame {
  display: grid;
  gap: 8px;
}
.viewer-content-slot {
  min-width: 0;
}`;

export const STARTER_STOCK_MODULE_HTML = `<details class="module-frame" data-section="{{key}}"{{open}}>
  <summary class="module-heading">
    <strong>{{title}}</strong>
    <span>{{summary}}</span>
  </summary>
  <div class="module-content">{{content}}</div>
</details>`;

export const STARTER_STOCK_MODULE_CSS = `.module-frame {
  border: 1px solid var(--loomos-soft-border);
  border-radius: 8px;
  background: var(--loomos-surface-1);
}
.module-heading {
  align-items: center;
  display: flex;
  justify-content: space-between;
  min-height: 44px;
  padding: 8px 10px;
}
.module-content {
  border-top: 1px solid var(--loomos-soft-border);
  padding: 10px;
}`;

function replaceTrustedSlot(
  source: string,
  token: string,
  value: string,
): string {
  return source.replaceAll(`{{${token}}}`, value);
}

export function renderViewerPresentation(
  htmlTemplate: string,
  cssTemplate: string,
  slots: {
    command: string;
    navigation: string;
    content: string;
  },
): { html: string; css: string; wrapperClass: string } {
  const wrapperClass = "loomos-cmod-viewer-shell";
  const selected = htmlTemplate.includes("{{content}}")
    ? htmlTemplate
    : STARTER_VIEWER_HTML;
  let html = sanitizeCustomHtml(selected || STARTER_VIEWER_HTML);
  html = replaceTrustedSlot(html, "command", slots.command);
  html = replaceTrustedSlot(html, "navigation", slots.navigation);
  html = replaceTrustedSlot(html, "content", slots.content);
  html = html.replace(/\{\{[^{}]+\}\}/g, "");
  return {
    html,
    css: scopeCustomCss(cssTemplate || STARTER_VIEWER_CSS, "viewer-shell"),
    wrapperClass,
  };
}

export function renderStockModulePresentation(
  moduleKey: ModuleKey,
  title: string,
  summary: string,
  content: string,
  open: boolean,
  htmlTemplate: string,
  cssTemplate: string,
): { html: string; css: string; wrapperClass: string } {
  const wrapperClass = `loomos-cmod-stock-${moduleKey.toLowerCase()}`;
  const selected = htmlTemplate.includes("{{content}}")
    ? htmlTemplate
    : STARTER_STOCK_MODULE_HTML;
  let html = sanitizeCustomHtml(selected || STARTER_STOCK_MODULE_HTML);
  html = html
    .replaceAll("{{key}}", escapeTemplateData(moduleKey))
    .replaceAll("{{title}}", escapeTemplateData(title))
    .replaceAll("{{summary}}", escapeTemplateData(summary))
    .replaceAll("{{open}}", open ? " open" : "");
  html = replaceTrustedSlot(html, "content", content);
  html = html.replace(/\{\{[^{}]+\}\}/g, "");
  return {
    html,
    css: scopeCustomCss(cssTemplate || STARTER_STOCK_MODULE_CSS, `stock-${moduleKey}`),
    wrapperClass,
  };
}
