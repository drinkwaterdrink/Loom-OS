import type {
  CustomModule,
  CustomModuleData,
} from "./types";

export const STARTER_CUSTOM_HTML = `<div class="cmod-card">
  <div class="cmod-title">{{label}}</div>
  <div class="cmod-summary">{{summary}}</div>
  <div class="cmod-items">
    {{#items}}
    <div class="cmod-item cmod-{{importance}}">
      <strong>{{title}}</strong>
      <p>{{text}}</p>
    </div>
    {{/items}}
  </div>
</div>`;

export const STARTER_CUSTOM_CSS = `.cmod-card {
  border: 1px solid rgba(159,212,232,.22);
  border-radius: 8px;
  padding: 10px;
  background: rgba(255,255,255,.04);
}
.cmod-title {
  font-weight: 900;
  text-transform: uppercase;
}
.cmod-item {
  margin-top: 8px;
  padding: 8px;
  border-radius: 8px;
  background: rgba(255,255,255,.04);
}`;

const BLOCKED_PAIRED_TAGS = /<(script|iframe|object|embed|form)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const BLOCKED_SINGLE_TAGS = /<\/?(script|iframe|object|embed|link|meta|base|form)\b[^>]*>/gi;
const EVENT_ATTRIBUTES = /\s+on[a-z0-9_-]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const STYLE_ATTRIBUTES = /\s+style\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi;
const URL_ATTRIBUTES = /\s+(href|src|xlink:href|action|formaction)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi;

export function escapeTemplateData(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function safeCustomModuleId(moduleId: string): string {
  const safe = moduleId.toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "");
  return (safe || "module").slice(0, 80);
}

export function sanitizeCustomHtml(template: string): string {
  return template
    .slice(0, 8000)
    .replace(BLOCKED_PAIRED_TAGS, "")
    .replace(BLOCKED_SINGLE_TAGS, "")
    .replace(EVENT_ATTRIBUTES, "")
    .replace(STYLE_ATTRIBUTES, "")
    .replace(URL_ATTRIBUTES, "")
    .replace(/javascript\s*:/gi, "");
}

export function sanitizeCustomCss(css: string): string {
  return css
    .slice(0, 8000)
    .replace(/@import\b[^;]*;?/gi, "")
    .replace(/url\s*\(\s*(['"]?)(?:https?:|data:|javascript:|\/\/)[\s\S]*?\1\s*\)/gi, "none")
    .replace(/expression\s*\([^)]*\)/gi, "")
    .replace(/behavior\s*:[^;}]*/gi, "")
    .replace(/-moz-binding\s*:[^;}]*/gi, "")
    .replace(/position\s*:\s*(?:fixed|sticky)\b/gi, "position: static")
    .replace(/z-index\s*:[^;}]*/gi, "")
    .replace(/<\/?style\b[^>]*>/gi, "");
}

function scopeSelectorList(selectorText: string, scope: string): string {
  return selectorText
    .split(",")
    .map((selector) => selector.trim())
    .filter(Boolean)
    .map((selector) => {
      if (selector.startsWith(scope)) return selector;
      if (selector === ":root" || selector === "html" || selector === "body") return scope;
      return `${scope} ${selector}`;
    })
    .join(", ");
}

export function scopeCustomCss(css: string, moduleId: string): string {
  const scope = `.loomos-cmod-${safeCustomModuleId(moduleId)}`;
  const sanitized = sanitizeCustomCss(css);
  const rules: string[] = [];
  const rulePattern = /([^{}]+)\{([^{}]*)\}/g;
  let match: RegExpExecArray | null;
  while ((match = rulePattern.exec(sanitized)) !== null) {
    const selectors = match[1]!.trim();
    const declarations = match[2]!.trim();
    if (!selectors || selectors.startsWith("@") || !declarations) continue;
    rules.push(`${scopeSelectorList(selectors, scope)} {\n${declarations}\n}`);
  }
  return rules.join("\n");
}

function scalarFieldValue(data: CustomModuleData, key: string): string {
  const value = data.fields?.[key];
  if (Array.isArray(value)) return value.map((item) => String(item)).join(", ");
  if (value && typeof value === "object") {
    const gauge = value as Record<string, unknown>;
    if (typeof gauge.pct === "string") return gauge.pct;
    if (typeof gauge.value === "number") return String(gauge.value);
    return JSON.stringify(value);
  }
  return String(value ?? "");
}

function replaceCommonTokens(
  template: string,
  module: CustomModule,
  data: CustomModuleData,
): string {
  return template
    .replaceAll("{{label}}", escapeTemplateData(module.label))
    .replaceAll("{{summary}}", escapeTemplateData(data.summary))
    .replace(/\{\{fields\.([A-Za-z][A-Za-z0-9_]*)\}\}/g, (_match, key: string) =>
      escapeTemplateData(scalarFieldValue(data, key))
    );
}

export function renderCustomTemplate(
  module: CustomModule,
  data: CustomModuleData,
): { html: string; css: string; wrapperClass: string } {
  const wrapperClass = `loomos-cmod-${safeCustomModuleId(module.id)}`;
  const source = sanitizeCustomHtml(module.htmlTemplate || STARTER_CUSTOM_HTML);
  const withItems = source.replace(/\{\{#items\}\}([\s\S]*?)\{\{\/items\}\}/g, (_match, block: string) =>
    data.items.slice(0, module.maxItems).map((item) =>
      block
        .replaceAll("{{title}}", escapeTemplateData(item.title))
        .replaceAll("{{text}}", escapeTemplateData(item.text))
        .replaceAll("{{importance}}", escapeTemplateData(item.importance))
        .replaceAll("{{color}}", escapeTemplateData(item.color ?? ""))
    ).join("")
  );
  const html = replaceCommonTokens(withItems, module, data)
    .replace(/\{\{[^{}]+\}\}/g, "");
  const css = scopeCustomCss(module.cssTemplate || STARTER_CUSTOM_CSS, module.id);
  return { html, css, wrapperClass };
}

export function customModuleExpectedShape(module: CustomModule): Record<string, unknown> {
  const fields = Object.fromEntries(module.schemaFields.map((field) => {
    let example: unknown = field.defaultValue;
    if (example === undefined) {
      if (field.type === "number") example = field.min ?? 0;
      else if (field.type === "boolean") example = false;
      else if (field.type === "enum") example = field.enumOptions[0] ?? "";
      else if (field.type === "gauge") {
        example = {
          value: field.min ?? 0,
          pct: "0%",
          band: "unknown",
          color: "var(--loomos-muted)",
          trend: "unknown",
          note: "",
        };
      } else if (field.type === "chips" || field.type === "list") example = [];
      else example = "";
    }
    return [field.key, example];
  }));

  return {
    moduleId: module.id,
    label: module.label,
    summary: "",
    fields,
    items: [{
      title: "",
      text: "",
      importance: "medium",
      changed: false,
    }],
  };
}
