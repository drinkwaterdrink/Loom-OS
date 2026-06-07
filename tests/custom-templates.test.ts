import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  customModuleExpectedShape,
  renderCustomTemplate,
  sanitizeCustomCss,
  sanitizeCustomHtml,
  scopeCustomCss,
  STARTER_CUSTOM_CSS,
  STARTER_CUSTOM_HTML,
} from "../src/shared/customTemplates";
import { CustomModuleSchema } from "../src/shared/schemas";

const module = CustomModuleSchema.parse({
  id: "romance-tension",
  label: "Romance Tension",
  group: "Custom",
  description: "",
  enabled: true,
  display: true,
  inject: false,
  compilerInstruction: "Track grounded tension.",
  outputMode: "template",
  maxItems: 4,
  schemaFields: [{
    id: "field_1",
    label: "Intensity",
    key: "intensity",
    type: "number",
    required: true,
    description: "",
    defaultValue: 0,
    enumOptions: [],
    min: 0,
    max: 100,
  }],
  allowHtmlTemplate: true,
  htmlTemplate: STARTER_CUSTOM_HTML,
  cssTemplate: STARTER_CUSTOM_CSS,
});

test("template output mode and custom schema fields validate", () => {
  assert.equal(module.outputMode, "template");
  assert.equal(module.schemaFields[0]?.key, "intensity");
  const shape = customModuleExpectedShape(module) as { fields: Record<string, unknown> };
  assert.equal(shape.fields.intensity, 0);
});

test("HTML sanitizer strips active and external content", () => {
  const sanitized = sanitizeCustomHtml(
    `<script>alert(1)</script><iframe src="https://bad"></iframe><div onclick="go()"><a href="javascript:go()">Safe</a></div>`,
  );
  assert.equal(/script|iframe|onclick|javascript:/i.test(sanitized), false);
  assert.match(sanitized, /<div><a>Safe<\/a><\/div>/);
});

test("CSS sanitizer removes external resources and scopes selectors", () => {
  const sanitized = sanitizeCustomCss(`@import "https://bad"; .card { background:url(https://bad/x.png); }`);
  assert.equal(/@import|https?:|url\s*\(/i.test(sanitized), false);
  const scoped = scopeCustomCss(".card, body { color: red; }", "module-one");
  assert.match(scoped, /\.loomos-cmod-module-one \.card/);
  assert.match(scoped, /\.loomos-cmod-module-one\s*\{/);
});

test("template renderer escapes LLM data and keeps output bounded", () => {
  const rendered = renderCustomTemplate(module, {
    moduleId: module.id,
    label: module.label,
    summary: `<img src=x onerror=alert(1)>`,
    fields: { intensity: 80 },
    items: [{
      title: "<script>bad</script>",
      text: "<b>not trusted</b>",
      importance: "high",
      changed: false,
    }],
  });
  assert.equal(rendered.html.includes("<script>"), false);
  assert.match(rendered.html, /&lt;script&gt;bad&lt;\/script&gt;/);
  assert.match(rendered.html, /&lt;b&gt;not trusted&lt;\/b&gt;/);
  assert.match(rendered.wrapperClass, /^loomos-cmod-/);
  assert.equal(rendered.css.includes("http"), false);
});

test("custom module editor wires schema and template controls", async () => {
  const source = await readFile("src/frontend.ts", "utf8");
  assert.match(source, /Schema Builder/);
  assert.match(source, /data-field-action="up"/);
  assert.match(source, /data-field-action="down"/);
  assert.match(source, /data-field-action="edit"/);
  assert.match(source, /data-field-action="delete"/);
  assert.match(source, /id="shape-copy">Copy JSON Shape/);
  assert.match(source, /id="template-reset">Reset Starter/);
  assert.match(source, /id="template-copy">Copy Template/);
  assert.match(source, /id="template-preview">Refresh Preview/);
  assert.match(source, /renderCustomTemplate\(module, sample\)/);
});
