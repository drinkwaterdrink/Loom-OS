import assert from "node:assert/strict";
import test from "node:test";
import { renderDashboard } from "../src/frontend/render";
import { LoomOSSettingsSchema } from "../src/shared/schemas";
import { makeState } from "./fixtures";

test("custom structured fields and sanitized template output render in dashboard", () => {
  const settings = LoomOSSettingsSchema.parse({
    customModules: [{
      id: "location-atmosphere",
      label: "Location Atmosphere",
      group: "World",
      description: "",
      enabled: true,
      display: true,
      inject: false,
      compilerInstruction: "Track grounded atmosphere.",
      outputMode: "template",
      maxItems: 4,
      schemaFields: [{
        id: "field_mood",
        label: "Mood",
        key: "mood",
        type: "text",
        required: true,
        description: "",
        enumOptions: [],
      }],
      allowHtmlTemplate: true,
      htmlTemplate: `<div class="atmosphere">{{fields.mood}} {{#items}}<b>{{title}}</b>{{/items}}</div>`,
      cssTemplate: `.atmosphere { overflow-wrap: anywhere; }`,
    }],
  });
  const state = makeState({
    customModuleData: [{
      moduleId: "location-atmosphere",
      label: "Location Atmosphere",
      summary: "Storm-lit",
      fields: { mood: "<tense>" },
      items: [{
        title: "Rain",
        text: "Hard against the dome",
        importance: "medium",
        changed: false,
      }],
    }],
  });

  const html = renderDashboard(state, settings, "overview");
  assert.match(html, /loomos-custom-template/);
  assert.match(html, /loomos-cmod-location-atmosphere/);
  assert.match(html, /&lt;tense&gt;/);
  assert.equal(html.includes("<tense>"), false);
  assert.match(html, /overflow-wrap: anywhere/);
});
