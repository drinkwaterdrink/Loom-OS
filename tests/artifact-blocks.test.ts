import assert from "node:assert/strict";
import test from "node:test";
import {
  applyArtifactBlockReplacement,
  artifactBlockLanguageLabel,
  artifactBlockTextDiffSummary,
  artifactBlockTextMetrics,
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
  const targets = enumerateArtifactBlockTargets(module);
  const paths = targets.map((target) => target.path);
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
  for (const path of ["meta", "visual", "prompt", "view.html", "view.css", "view.javascript", "fieldBuilder.fields"]) {
    assert.ok(findArtifactBlockTarget(module, path), path);
  }
  assert.equal(findArtifactBlockTarget(module, "prompt")?.category, "Prompt");
  assert.equal(findArtifactBlockTarget(module, "view.html")?.category, "View");
});

test("block target enumeration covers Theme artifact sections", () => {
  const theme = createStarterThemeArtifact();
  const targets = enumerateArtifactBlockTargets(theme);
  const paths = targets.map((target) => target.path);
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
  for (const path of ["meta", "manifest", "design.tokens", "design.style", "view.html", "view.css", "view.javascript"]) {
    assert.ok(findArtifactBlockTarget(theme, path), path);
  }
  assert.equal(findArtifactBlockTarget(theme, "design.tokens")?.category, "Design");
  assert.equal(artifactBlockLanguageLabel(findArtifactBlockTarget(theme, "view.javascript")!.language), "JS");
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
  assert.equal(findArtifactBlockTarget(blueprint, "settings")?.category, "Blueprint");
});

test("block metrics and summaries describe staged replacements", () => {
  const before = "one\ntwo";
  const after = "one\ntwo\nthree";
  assert.deepEqual(artifactBlockTextMetrics(before), { characters: 7, lines: 2 });
  assert.deepEqual(artifactBlockTextDiffSummary(before, after), {
    addedLines: 1,
    removedLines: 0,
    characterDelta: 6,
  });
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

test("unsafe HTML CSS and JavaScript block replacements are rejected", () => {
  const theme = createStarterThemeArtifact();
  assert.throws(() => applyArtifactBlockReplacement(
    theme,
    findArtifactBlockTarget(theme, "view.html")!,
    `<article onclick="alert(1)">bad</article>`,
  ), /event-handler/);
  assert.throws(() => applyArtifactBlockReplacement(
    theme,
    findArtifactBlockTarget(theme, "view.css")!,
    `.card { background: url(https://bad.example/bg.png); }`,
  ), /url\(\)|remote or executable/);
  assert.throws(() => applyArtifactBlockReplacement(
    theme,
    findArtifactBlockTarget(theme, "view.javascript")!,
    "fetch('https://bad.example')",
  ), /network access|restricted API/);
  assert.doesNotMatch(theme.view.html, /onclick/);
});

test("block replacement target identity must match artifact kind and path", () => {
  const module = createStarterModuleArtifact();
  const theme = createStarterThemeArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  assert.throws(() => applyArtifactBlockReplacement(theme, target, "Wrong artifact."), /does not match/);
  assert.throws(() => parseArtifactBlockRefinementText(JSON.stringify({
    target: { artifactId: "other", kind: "module", path: "prompt" },
    replacementValue: "Track trust.",
    changedPaths: ["prompt"],
  }), module, target), /artifactId/);
  assert.throws(() => parseArtifactBlockRefinementText(JSON.stringify({
    target: { artifactId: module.id, kind: "theme", path: "prompt" },
    replacementValue: "Track trust.",
    changedPaths: ["prompt"],
  }), module, target), /kind/);
  assert.throws(() => parseArtifactBlockRefinementText(JSON.stringify({
    target: { artifactId: module.id, kind: "module", path: "view.css" },
    replacementValue: "Track trust.",
    changedPaths: ["view.css"],
  }), module, target), /target path/);
});

test("block outputs must include replacementValue unless they are matching full artifacts", () => {
  const module = createStarterModuleArtifact();
  const target = findArtifactBlockTarget(module, "prompt")!;
  assert.throws(() => parseArtifactBlockRefinementText(JSON.stringify({
    target: { artifactId: module.id, kind: "module", path: "prompt" },
    summary: "Missing payload.",
    changedPaths: ["prompt"],
  }), module, target), /replacementValue/);
  assert.throws(() => parseArtifactBlockRefinementText(JSON.stringify({
    ...module,
    id: "different",
  }), module, target), /did not match/);
  assert.throws(() => parseArtifactBlockRefinementText(JSON.stringify({
    replacementValue: "Raw-ish JSON is not accepted without a target.",
  }), module, target), /result object/);
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
