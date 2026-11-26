// Verifies that (1) every static t("key") used in src exists in en.js and
// (2) fr.js and ar.js have exactly the keys en.js has (plural forms aside).
// Usage: npm run i18n:check
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const root = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const load = async (lng) => (await import(pathToFileURL(join(root, `src/i18n/locales/${lng}.js`)).href)).default;

const flatten = (obj, prefix = "") =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === "object" ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`]
  );

const PLURAL = /_(zero|one|two|few|many|other)$/;
const base = (k) => k.replace(PLURAL, "");

const en = new Set(flatten(await load("en")));
const enBase = new Set([...en].map(base));
let problems = 0;

for (const lng of ["fr", "ar"]) {
  const keys = new Set(flatten(await load(lng)));
  const keysBase = new Set([...keys].map(base));
  const missing = [...en].filter((k) => !keys.has(k) && !(PLURAL.test(k) && keysBase.has(base(k))));
  const extra = [...keys].filter((k) => !enBase.has(base(k)));
  if (missing.length) console.error(`✗ ${lng}: missing ${missing.length}\n  ${missing.join("\n  ")}`);
  if (extra.length) console.error(`✗ ${lng}: unknown ${extra.length}\n  ${extra.join("\n  ")}`);
  problems += missing.length + extra.length;
  if (!missing.length && !extra.length) console.log(`✓ ${lng}: ${keys.size} keys match en`);
}

// Static keys used in source
const files = [];
const walk = (dir) =>
  readdirSync(dir).forEach((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(jsx?|mjs)$/.test(f) && !/\.test\./.test(f)) files.push(p);
  });
walk(join(root, "src"));

const used = new Set();
for (const f of files) {
  const src = readFileSync(f, "utf8");
  for (const m of src.matchAll(/\bt\(\s*["']([a-zA-Z0-9_.]+)["']/g)) used.add(m[1]);
  for (const m of src.matchAll(/["'](validation\.[a-zA-Z]+)["']/g)) used.add(m[1]);
}
const unknown = [...used].filter((k) => !en.has(k) && !enBase.has(k));
if (unknown.length) console.error(`✗ keys used in code but missing from en.js:\n  ${unknown.join("\n  ")}`);
else console.log(`✓ ${used.size} static keys used in code all exist in en.js`);
problems += unknown.length;

process.exit(problems ? 1 : 0);
