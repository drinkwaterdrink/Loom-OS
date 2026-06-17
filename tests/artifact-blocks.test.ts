import assert from "node:assert/strict";
import test from "node:test";
import {
  applyArtifactBlockReplacement,
  boundedBlockContext,
  enumerateArtifactBlockTargets,
  findArtifactBlockTarget,
  parseArtifactBlockRefinementText,
} from "../src/shared/artifactBlocks";
import {
  createStarterBlueprintArtifact,
  createStarterModuleArtifact,
  createStarterThemeArtifact,
} from "../src/shared/artifacts";

test("block target enumeration covers Module artifact sections", () => {
  const module = createStarterModuleArtifact();
  const paths = enumerateArtifactBlockTargets(module).map((target) => target.path);
  for (const path of [
    "meta",
    "schema",
    "prompt",
    "sampleData",
    "defaults",
    "visual",
    "view.html",
    "view.css",
    "view.javascript",
    "view.partials",
    "fieldBuilder.fields",
  ]) {
    assert.ok(paths.includes(path), path);
  }
});

test("block target enumeration covers Theme artifact sections", () => {
  const theme = createStarterThemeArtifact();
  const paths = enumerateArtifactBlockTargets(theme).map((target) => target.path);
  for (const path of [
    "meta",
    "manifest",
    "design.tokens",
    "design.style",
    "view.html",
    "view.css",
    "view.javascript",
    "view.partials",
    "sampleData",
    "manifest.slots",
  ]) {
    assert.ok(paths.includes(path), path);
  }
});

test("block target enumeration covers Blueprint artifact sections", () => {
  const module = createStarterModuleArtifact();
  const theme = createStarterThemeArtifact();
  const blueprint = {
    ...createStarterBlueprintArtifact(),
    modules: [module],
    theme,
  };
  const paths = enumerateArtifactBlockTargets(blueprint).map((target) => target.path);
  assert.ok(paths.includes("meta"));
  assert.ok(paths.includes("settings"));
  assert.ok(paths.includes("modules"));
  assert.ok(paths.includes("theme"));
  assert.ok(paths.includes(`modules.${module.id}`));
});

test("applying a prompt replacement to a Module produces a valid artifact", () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  const applied = applyArtifactBlockReplacement(module, target, "Track grounded emotional pressure only.");
  assert.equal(applied.artifact.kind, "module");
  if (applied.artifact.kind === "module") {
    assert.equal(applied.artifact.prompt, "Track grounded emotional pressure only.");
    assert.notEqual(applied.artifact.updatedAt, module.updatedAt);
  }
});

test("applying schema replacement validates the JSON Schema subset", () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "schema")!;
  const schema = {
    type: "object",
    properties: {
      summary: { type: "string", maxLength: 500 },
    },
    required: ["summary"],
    additionalProperties: false,
  };
  const applied = applyArtifactBlockReplacement(module, target, schema);
  assert.equal(applied.artifact.kind, "module");
  if (applied.artifact.kind === "module") {
    assert.deepEqual(applied.artifact.schema, schema);
  }
});

test("invalid schema block is rejected and does not mutate the artifact", () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "schema")!;
  assert.throws(() => applyArtifactBlockReplacement(module, target, {
    type: "object",
    properties: { summary: { type: "string" } },
    required: ["missing"],
    additionalProperties: false,
  }), /not declared in properties/);
  assert.deepEqual(module.schema, createStarterModuleArtifact().schema);
});

test("applying Theme CSS replacement preserves manifest, HTML, and JavaScript", () => {
  const theme = {
    ...createStarterThemeArtifact(),
    view: {
      html: "<main>{{meta.title}}</main>",
      css: ".old { color: red; }",
      javascript: "window.LoomOS.action('copy', 'ok')",
      partials: {},
    },
  };
  const target = findArtifactBlockTarget(theme, "view.css")!;
  const applied = applyArtifactBlockReplacement(theme, target, ".new { color: var(--loom-accent); }");
  assert.equal(applied.artifact.kind, "theme");
  if (applied.artifact.kind === "theme") {
    assert.equal(applied.artifact.view.css, ".new { color: var(--loom-accent); }");
    assert.equal(applied.artifact.view.html, theme.view.html);
    assert.equal(applied.artifact.view.javascript, theme.view.javascript);
    assert.deepEqual(applied.artifact.manifest, theme.manifest);
  }
});

test("unsafe design token refinement is rejected", () => {
  const theme = createStarterThemeArtifact();
  const target = findArtifactBlockTarget(theme, "design.tokens")!;
  assert.throws(() => applyArtifactBlockReplacement(theme, target, {
    ...theme.design!.tokens,
    bg: "url(https://bad.example/bg.png)",
  }), /unsafe CSS value/);
  assert.equal(theme.design!.tokens.bg, "#101114");
});

test("unrelated path changes in block output are rejected", () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  assert.throws(() => parseArtifactBlockRefinementText(JSON.stringify({
    target: { artifactId: module.id, kind: "module", path: "prompt" },
    replacementValue: "Track trust.",
    summary: "changed",
    warnings: [],
    changedPaths: ["prompt", "view.css"],
    repaired: false,
    issues: [],
  }), module, target), /unrelated paths/);
});

test("full artifact returned to a block request does not overwrite unrelated fields", () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  const full = {
    ...module,
    prompt: "Track only the requested trust block.",
    view: { ...module.view, css: ".attempted-unrelated-change { color: red; }" },
  };
  const applied = parseArtifactBlockRefinementText(JSON.stringify(full), module, target);
  assert.equal(applied.artifact.kind, "module");
  if (applied.artifact.kind === "module") {
    assert.equal(applied.artifact.prompt, "Track only the requested trust block.");
    assert.equal(applied.artifact.view.css, module.view.css);
  }
});

test("block refine request context includes selected block plus bounded context", () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  const context = boundedBlockContext(module, target);
  const serialized = JSON.stringify(context);
  assert.match(serialized, /currentValue/);
  assert.match(serialized, /availableSiblingPaths/);
  assert.doesNotMatch(serialized, new RegExp(module.view.css.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("staged block apply mutates only after validation while discard can leave artifact unchanged", () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  const staged = parseArtifactBlockRefinementText(JSON.stringify({
    target: { artifactId: module.id, kind: "module", path: "prompt" },
    replacementValue: "Track the accepted block only.",
    summary: "Prepared prompt.",
    warnings: [],
    changedPaths: ["prompt"],
    repaired: false,
    issues: [],
  }), module, target);
  assert.equal(module.prompt, createStarterModuleArtifact().prompt);
  const applied = applyArtifactBlockReplacement(module, target, staged.result.replacementValue);
  assert.equal(applied.artifact.kind, "module");
  if (applied.artifact.kind === "module") assert.equal(applied.artifact.prompt, "Track the accepted block only.");
});
