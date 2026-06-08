import assert from "node:assert/strict";
import test from "node:test";
import {
  exportCustomModuleBundle,
  exportStockModuleBundle,
  parseModuleBundle,
} from "../src/shared/moduleBundles";
import {
  renderStockModulePresentation,
  renderViewerPresentation,
} from "../src/shared/presentation";
import {
  CustomModuleSchema,
  LoomOSSettingsSchema,
} from "../src/shared/schemas";

test("stock module bundles preserve controls, contracts, and presentation", () => {
  const settings = LoomOSSettingsSchema.parse({
    stockModuleOverrides: {
      sceneKernel: {
        label: "Scene Core",
        presentationEnabled: true,
        htmlTemplate: "<section>{{title}}{{content}}</section>",
        cssTemplate: ".scene { color: red; }",
      },
    },
  });
  const bundle = exportStockModuleBundle("sceneKernel", settings);
  const parsed = parseModuleBundle(JSON.parse(JSON.stringify(bundle)));
  assert.equal(parsed.kind, "stock");
  if (parsed.kind !== "stock") return;
  assert.equal(parsed.key, "sceneKernel");
  assert.equal(parsed.override.presentationEnabled, true);
  assert.equal(parsed.override.label, "Scene Core");
});

test("custom module bundles round-trip and accept a legacy raw module", () => {
  const module = CustomModuleSchema.parse({
    id: "cmod_weather",
    label: "Weather",
    compilerInstruction: "Track weather.",
    htmlTemplate: "<div>{{summary}}</div>",
    cssTemplate: "div { color: cyan; }",
  });
  const bundled = parseModuleBundle(exportCustomModuleBundle(module));
  assert.equal(bundled.kind, "custom");
  const legacy = parseModuleBundle(module);
  assert.equal(legacy.kind, "custom");
});

test("viewer presentation preserves trusted slots and sanitizes user markup", () => {
  const rendered = renderViewerPresentation(
    `<script>alert(1)</script><div>{{navigation}}<main>{{content}}</main>{{command}}</div>`,
    `@import "https://bad"; .viewer { position: fixed; color: red; }`,
    {
      command: "<button>Generate</button>",
      navigation: "<nav>Pulse</nav>",
      content: "<section>Tracker</section>",
    },
  );
  assert.doesNotMatch(rendered.html, /script|alert/);
  assert.match(rendered.html, /<nav>Pulse<\/nav>/);
  assert.match(rendered.html, /<section>Tracker<\/section>/);
  assert.doesNotMatch(rendered.css, /@import|position:\s*fixed/);
});

test("stock presentation inserts escaped labels and trusted tracker content", () => {
  const rendered = renderStockModulePresentation(
    "sceneKernel",
    "<Scene>",
    "Current",
    "<p>Escaped tracker body</p>",
    true,
    "<details{{open}}><summary>{{title}}</summary>{{content}}</details>",
    ".module { color: white; }",
  );
  assert.match(rendered.html, /&lt;Scene&gt;/);
  assert.match(rendered.html, /<p>Escaped tracker body<\/p>/);
  assert.match(rendered.html, /details open/);
});
