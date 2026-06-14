import type {
  ArtifactDiagnostic,
  ThemeArtifact,
  ThemeCapability,
} from "./artifacts";
import type { ViewerModelV1 } from "./viewerModel";

interface TemplateScope {
  value: unknown;
  root: unknown;
  index?: number;
}

const templateCache = new Map<string, string>();

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function resolvePath(scope: TemplateScope, path: string): unknown {
  const clean = path.trim();
  if (clean === "this" || clean === ".") return scope.value;
  if (clean === "@index") return scope.index ?? 0;
  const fromRoot = clean.startsWith("@root.");
  const source = fromRoot ? scope.root : scope.value;
  const segments = (fromRoot ? clean.slice(6) : clean)
    .split(".")
    .map((segment) => segment.trim())
    .filter(Boolean);
  let current: unknown = source;
  for (const segment of segments) {
    if (Array.isArray(current) && /^\d+$/.test(segment)) {
      current = current[Number(segment)];
    } else if (isRecord(current)) {
      current = current[segment];
    } else {
      return undefined;
    }
  }
  return current;
}

function truthy(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (isRecord(value)) return Object.keys(value).length > 0;
  return Boolean(value);
}

function renderHelper(expression: string, scope: TemplateScope): string {
  const [name, ...args] = expression.trim().split(/\s+/);
  if (!name) return "";
  if (args.length === 0) return escapeHtml(resolvePath(scope, name));
  const value = resolvePath(scope, args[0] ?? "");
  if (name === "count") {
    return escapeHtml(Array.isArray(value) ? value.length : isRecord(value) ? Object.keys(value).length : 0);
  }
  if (name === "percent") {
    const numeric = typeof value === "number" && Number.isFinite(value) ? value : 0;
    return escapeHtml(`${Math.round(numeric)}%`);
  }
  if (name === "json") return escapeHtml(JSON.stringify(value, null, 2));
  if (name === "uppercase") return escapeHtml(String(value ?? "").toUpperCase());
  if (name === "lowercase") return escapeHtml(String(value ?? "").toLowerCase());
  if (name === "fallback") {
    const fallback = args.slice(1).join(" ").replace(/^["']|["']$/g, "");
    return escapeHtml(truthy(value) ? value : fallback);
  }
  return "";
}

function findMatchingBlock(
  source: string,
  start: number,
  blockName: string,
): { bodyStart: number; elseStart: number; endStart: number; end: number } | null {
  const openEnd = source.indexOf("}}", start);
  if (openEnd < 0) return null;
  let depth = 1;
  let cursor = openEnd + 2;
  let elseStart = -1;
  while (cursor < source.length) {
    const next = source.indexOf("{{", cursor);
    if (next < 0) return null;
    const tokenEnd = source.indexOf("}}", next);
    if (tokenEnd < 0) return null;
    const token = source.slice(next + 2, tokenEnd).trim();
    if (token.startsWith(`#${blockName} `)) depth += 1;
    if (token === `/${blockName}`) {
      depth -= 1;
      if (depth === 0) {
        return {
          bodyStart: openEnd + 2,
          elseStart,
          endStart: next,
          end: tokenEnd + 2,
        };
      }
    }
    if (token === "else" && depth === 1 && elseStart < 0) elseStart = next;
    cursor = tokenEnd + 2;
  }
  return null;
}

function renderBlocks(source: string, scope: TemplateScope): string {
  let output = source;
  const blockPattern = /\{\{#(each|if|unless)\s+([^{}]+)\}\}/;
  let match = blockPattern.exec(output);
  while (match) {
    const [opening, blockName, path] = match;
    const start = match.index;
    const bounds = findMatchingBlock(output, start, blockName ?? "");
    if (!bounds) {
      output = output.slice(0, start) + output.slice(start + opening.length);
      match = blockPattern.exec(output);
      continue;
    }
    const bodyEnd = bounds.elseStart >= 0 ? bounds.elseStart : bounds.endStart;
    const body = output.slice(bounds.bodyStart, bodyEnd);
    const alternate = bounds.elseStart >= 0
      ? output.slice(output.indexOf("}}", bounds.elseStart) + 2, bounds.endStart)
      : "";
    const value = resolvePath(scope, path ?? "");
    let rendered = "";
    if (blockName === "each") {
      const entries = Array.isArray(value)
        ? value.map((item, index) => ({ item, index }))
        : isRecord(value)
        ? Object.values(value).map((item, index) => ({ item, index }))
        : [];
      rendered = entries.length > 0
        ? entries.map(({ item, index }) => renderTemplateInternal(body, {
            value: item,
            root: scope.root,
            index,
          })).join("")
        : renderTemplateInternal(alternate, scope);
    } else {
      const condition = blockName === "unless" ? !truthy(value) : truthy(value);
      rendered = renderTemplateInternal(condition ? body : alternate, scope);
    }
    output = output.slice(0, start) + rendered + output.slice(bounds.end);
    match = blockPattern.exec(output);
  }
  return output;
}

function renderTemplateInternal(source: string, scope: TemplateScope): string {
  const withBlocks = renderBlocks(source, scope);
  return withBlocks
    .replace(/\{\{\{\s*([^{}]+?)\s*\}\}\}/g, (_match, expression: string) =>
      renderHelper(expression, scope)
    )
    .replace(/\{\{\s*([^{}#/][^{}]*?)\s*\}\}/g, (_match, expression: string) =>
      renderHelper(expression, scope)
    )
    .replace(/\{\{[^{}]+\}\}/g, "");
}

function expandPartials(source: string, partials: Record<string, string>): string {
  let output = source;
  for (let pass = 0; pass < 8; pass += 1) {
    let changed = false;
    output = output.replace(/\{\{>\s*([A-Za-z][A-Za-z0-9_-]*)\s*\}\}/g, (_match, name: string) => {
      changed = true;
      return partials[name] ?? "";
    });
    if (!changed) break;
  }
  return output;
}

function stripUnsafeTemplateMarkup(source: string): string {
  return source
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "");
}

export function renderThemeTemplate(
  theme: ThemeArtifact,
  model: ViewerModelV1,
): string {
  const cacheKey = `${theme.id}:${theme.updatedAt}:${theme.view.html.length}:${Object.keys(theme.view.partials).length}`;
  let source = templateCache.get(cacheKey);
  if (!source) {
    source = stripUnsafeTemplateMarkup(expandPartials(theme.view.html, theme.view.partials));
    templateCache.set(cacheKey, source);
    if (templateCache.size > 30) templateCache.delete(templateCache.keys().next().value ?? "");
  }
  return renderTemplateInternal(source, { value: model, root: model });
}

export function inspectThemeComplexity(theme: ThemeArtifact): ArtifactDiagnostic[] {
  const diagnostics: ArtifactDiagnostic[] = [];
  const templateBytes = theme.view.html.length + theme.view.css.length + theme.view.javascript.length;
  const nodeSignals = (theme.view.html.match(/<[A-Za-z][^>]*>/g) ?? []).length;
  const loopSignals = (theme.view.html.match(/\{\{#each\b/g) ?? []).length;
  if (templateBytes > 240_000) {
    diagnostics.push({ path: "view", message: "Theme source exceeds the 240 KB recommended runtime budget." });
  }
  if (nodeSignals > 1800) {
    diagnostics.push({ path: "view.html", message: "Theme declares more than 1,800 static elements." });
  }
  if (loopSignals > 40) {
    diagnostics.push({ path: "view.html", message: "Theme declares more than 40 loops." });
  }
  if (theme.manifest.developerMode && !theme.view.javascript.trim()) {
    diagnostics.push({ path: "view.javascript", message: "Developer Mode is enabled but no JavaScript is present." });
  }
  return diagnostics;
}

function jsonForScript(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

export interface ThemeDocumentOptions {
  nonce: string;
  developerModeEnabled: boolean;
}

export function buildThemeDocument(
  theme: ThemeArtifact,
  model: ViewerModelV1,
  options: ThemeDocumentOptions,
): string {
  const rendered = renderThemeTemplate(theme, model);
  const allowed = theme.manifest.capabilities;
  const javascriptEnabled = theme.manifest.developerMode
    && options.developerModeEnabled
    && theme.view.javascript.trim().length > 0;
  const themeScript = javascriptEnabled
    ? `try {\n${theme.view.javascript.replace(/<\/script/gi, "<\\/script")}\n} catch (error) { window.LoomOS.reportError(error); }`
    : "";
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: blob:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:; connect-src 'none'; media-src data: blob:; object-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'">
  <style>
    * { box-sizing: border-box; }
    html, body { min-height: 100%; width: 100%; }
    body { margin: 0; overflow-wrap: anywhere; }
    button, input, select, textarea { font: inherit; }
    :focus-visible { outline: 2px solid #5eead4; outline-offset: 2px; }
    ${theme.view.css}
  </style>
</head>
<body>
  ${rendered}
  <script>
    (() => {
      "use strict";
      const channel = ${jsonForScript(options.nonce)};
      const allowed = new Set(${jsonForScript(allowed)});
      const aliases = {
        copy: "copy",
        "collapse-all": "collapse",
        "expand-all": "collapse",
        "select-tab": "navigation",
        reload: "reload",
        generate: "generation",
        stop: "generation",
        history: "history"
      };
      const send = (action, payload) => {
        const capability = aliases[action];
        if (!capability || !allowed.has(capability)) return false;
        if (action === "collapse-all" || action === "expand-all") {
          document.querySelectorAll("details").forEach((details) => {
            details.open = action === "expand-all";
          });
          return true;
        }
        parent.postMessage({ source: "loomos-theme", channel, action, payload }, "*");
        return true;
      };
      Object.defineProperty(window, "LoomOS", {
        configurable: false,
        enumerable: true,
        writable: false,
        value: Object.freeze({
          model: Object.freeze(${jsonForScript(model)}),
          action: send,
          reportError(error) {
            parent.postMessage({
              source: "loomos-theme",
              channel,
              action: "runtime-error",
              payload: String(error && error.message ? error.message : error)
            }, "*");
          }
        })
      });
      document.addEventListener("click", (event) => {
        const target = event.target instanceof Element
          ? event.target.closest("[data-loom-action]")
          : null;
        if (!target) return;
        const action = target.getAttribute("data-loom-action") || "";
        const payload = target.getAttribute("data-loom-value") || "";
        if (send(action, payload)) event.preventDefault();
      });
      window.addEventListener("error", (event) => window.LoomOS.reportError(event.error || event.message));
      window.addEventListener("unhandledrejection", (event) => window.LoomOS.reportError(event.reason));
      ${themeScript}
    })();
  </script>
</body>
</html>`;
}

export function isAllowedThemeAction(
  action: string,
  capabilities: ThemeCapability[],
): boolean {
  const required: Partial<Record<string, ThemeCapability>> = {
    copy: "copy",
    "collapse-all": "collapse",
    "expand-all": "collapse",
    "select-tab": "navigation",
    reload: "reload",
    generate: "generation",
    stop: "generation",
    history: "history",
  };
  const capability = required[action];
  return Boolean(capability && capabilities.includes(capability));
}
