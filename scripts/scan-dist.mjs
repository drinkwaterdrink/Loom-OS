import { readFile } from "node:fs/promises";

const source = await readFile("dist/backend.js", "utf8");
const checks = [
  ["filesystem import", /(?:from\s*|require\()\s*["'](?:node:)?fs(?:\/promises)?["']/],
  ["synchronous filesystem access", /\breadFileSync\s*\(/],
  ["Bun file access", /\bBun\.(?:file|write)\s*\(/],
  ["subprocess access", /\b(?:child_process|Bun\.spawn|Bun\.spawnSync)\b/],
  ["worker/process cluster access", /\b(?:worker_threads|cluster)\b/],
  ["raw networking", /(?:from\s*|require\()\s*["'](?:node:)?(?:net|tls|dgram|http|https)["']/],
  ["database access", /\b(?:node:sqlite|bun:sqlite)\b/],
  ["environment access", /\bprocess\.env\b/],
  ["process termination", /\bprocess\.exit\s*\(/],
  ["eval", /\beval\s*\(/],
  ["Function constructor", /\bnew\s+Function\s*\(|\bFunction\s*\(/],
];

const findings = checks.filter(([, pattern]) => pattern.test(source));
if (findings.length > 0) {
  console.error("Backend scanner findings:");
  for (const [label] of findings) {
    console.error(`- ${label}`);
  }
  process.exitCode = 1;
} else {
  console.log("Backend scanner passed.");
}
