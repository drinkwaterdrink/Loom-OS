import { readFile } from "node:fs/promises";

const packageJson = JSON.parse(await readFile("package.json", "utf8"));
const packageLock = JSON.parse(await readFile("package-lock.json", "utf8"));
const spindle = JSON.parse(await readFile("spindle.json", "utf8"));
const frontend = await readFile("src/frontend.ts", "utf8");
const readme = await readFile("README.md", "utf8");
const changelog = await readFile("CHANGELOG.md", "utf8");

const version = packageJson.version;
const checks = [
  ["package-lock root", packageLock.version],
  ["package-lock package", packageLock.packages?.[""]?.version],
  ["spindle manifest", spindle.version],
];
const mismatches = checks.filter(([, candidate]) => candidate !== version);
if (!frontend.includes(`version: ${version}`)) {
  mismatches.push(["frontend diagnostics", "missing"]);
}
if (!readme.includes(`Current release: **${version}**`)) {
  mismatches.push(["README release", "missing"]);
}
if (!changelog.includes(`## [${version}]`)) {
  mismatches.push(["CHANGELOG release", "missing"]);
}

if (mismatches.length > 0) {
  console.error(`Version consistency failed for ${version}:`);
  for (const [label, candidate] of mismatches) {
    console.error(`- ${label}: ${candidate}`);
  }
  process.exitCode = 1;
} else {
  console.log(`Version consistency passed (${version}).`);
}
