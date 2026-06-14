import assert from "node:assert/strict";
import test from "node:test";
import {
  createStarterThemeArtifact,
  ThemeArtifactSchema,
} from "../src/shared/artifacts";
import {
  buildThemeDocument,
  isAllowedThemeAction,
  renderThemeTemplate,
} from "../src/shared/themeRuntime";
import { buildViewerModel } from "../src/shared/viewerModel";
import { DEFAULT_SETTINGS } from "../src/shared/schemas";

test("theme templates support loops, conditions, partials, helpers, and escaped data", () => {
  const base = createStarterThemeArtifact();
  const theme = ThemeArtifactSchema.parse({
    ...base,
    view: {
      ...base.view,
      html: `
        <h1>{{uppercase kernel.scene}}</h1>
        {{#if cast}}<div>{{count cast}} cast</div>{{else}}<div>Empty</div>{{/if}}
        {{#each cast}}{{> person}}{{/each}}
        {{#unless continuity.risks}}<small>Stable</small>{{/unless}}
      `,
      partials: {
        person: "<p>{{@index}}: {{name}} / {{status}}</p>",
      },
    },
  });
  const model = buildViewerModel(null, DEFAULT_SETTINGS);
  model.kernel.scene = "<script>Moon room</script>";
  model.cast = [{
    name: "<Mara>",
    status: "Ready & waiting",
  } as typeof model.cast[number]];
  const html = renderThemeTemplate(theme, model);
  assert.match(html, /&lt;SCRIPT&gt;MOON ROOM&lt;\/SCRIPT&gt;/);
  assert.match(html, /1 cast/);
  assert.match(html, /0: &lt;Mara&gt; \/ Ready &amp; waiting/);
  assert.match(html, /Stable/);
  assert.doesNotMatch(html, /<script>Moon room/);
});

test("theme documents enforce the sandbox bridge and gate custom JavaScript", () => {
  const base = createStarterThemeArtifact();
  const theme = ThemeArtifactSchema.parse({
    ...base,
    manifest: {
      ...base.manifest,
      developerMode: true,
      capabilities: ["copy", "generation"],
    },
    view: {
      ...base.view,
      javascript: `window.__themeRan = true; const marker = "</script><script>bad()</script>";`,
    },
  });
  const model = buildViewerModel(null, DEFAULT_SETTINGS);
  const disabled = buildThemeDocument(theme, model, {
    nonce: "nonce-disabled",
    developerModeEnabled: false,
  });
  assert.match(disabled, /connect-src 'none'/);
  assert.match(disabled, /Object\.freeze/);
  assert.match(disabled, /nonce-disabled/);
  assert.doesNotMatch(disabled, /window\.__themeRan/);

  const enabled = buildThemeDocument(theme, model, {
    nonce: "nonce-enabled",
    developerModeEnabled: true,
  });
  assert.match(enabled, /window\.__themeRan/);
  assert.match(enabled, /<\\\/script>/);
  assert.doesNotMatch(enabled, /<\/script><script>bad/);
  assert.equal(isAllowedThemeAction("generate", theme.manifest.capabilities), true);
  assert.equal(isAllowedThemeAction("reload", theme.manifest.capabilities), false);
});

test("unsafe markup is removed before template rendering", () => {
  const base = createStarterThemeArtifact();
  const theme = ThemeArtifactSchema.parse({
    ...base,
    view: {
      ...base.view,
      html: `<script>alert(1)</script><iframe src="data:text/html,bad"></iframe><button onclick="bad()">{{kernel.scene}}</button>`,
    },
  });
  const html = renderThemeTemplate(theme, buildViewerModel(null, DEFAULT_SETTINGS));
  assert.doesNotMatch(html, /script|iframe|onclick|alert/);
  assert.match(html, /<button>/);
});
