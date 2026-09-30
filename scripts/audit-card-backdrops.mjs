#!/usr/bin/env node
/**
 * Opens storefront listing pages in headless Chrome and reports product cards
 * whose photo loaded but got no edge-matched backdrop (the card frame shows two colours).
 *
 *   node scripts/audit-card-backdrops.mjs [base-url] [path ...]
 *   node scripts/audit-card-backdrops.mjs http://109.122.246.24 /products/category/bedding
 *
 * Without paths it audits /products and every /products/category/* linked from it.
 */
import { spawn } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";

const CHROME =
  process.env.CHROME_PATH ||
  (process.platform === "darwin"
    ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    : "google-chrome");
const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const CARD_IMG = "img.media-hover.object-contain";
const port = 9400 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(join(tmpdir(), "card-audit-"));

async function listingPaths() {
  if (process.argv.length > 3) return process.argv.slice(3);
  const html = await (await fetch(`${base}/products`)).text();
  const categories = [...new Set(html.match(/\/products\/category\/[^"'?#\s]+/g) || [])];
  return ["/products", ...categories];
}

const chrome = spawn(
  CHROME,
  ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "--window-size=1400,1000", "about:blank"],
  { stdio: "ignore" },
);
const shutdown = async (code) => {
  const exited = new Promise((resolve) => chrome.once("exit", resolve));
  chrome.kill("SIGKILL");
  await exited;
  rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  process.exit(code);
};

let target;
for (let i = 0; i < 60 && !target; i++) {
  try {
    target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page");
  } catch {}
  if (!target) await sleep(250);
}
if (!target) {
  console.error(`Could not start Chrome at ${CHROME} (set CHROME_PATH).`);
  await shutdown(2);
}

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve) => ws.addEventListener("open", resolve));
let nextId = 0;
const pending = new Map();
ws.addEventListener("message", (message) => {
  const data = JSON.parse(message.data);
  if (data.id && pending.has(data.id)) {
    pending.get(data.id)(data);
    pending.delete(data.id);
  }
});
const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++nextId;
    pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
const evaluate = async (expression) =>
  (await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })).result?.result?.value;

await send("Page.enable");
let failures = 0;

for (const path of await listingPaths()) {
  await send("Page.navigate", { url: base + path });
  await sleep(6000);
  // Lazy images only load near the viewport, and onLoad runs after decode.
  await evaluate(`(async () => {
    for (const img of document.querySelectorAll('${CARD_IMG}')) {
      img.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 250));
    }
  })()`);
  await sleep(4000);
  const report = await evaluate(`(() => {
    const cards = [...document.querySelectorAll('${CARD_IMG}')].map((img) => ({
      src: img.getAttribute('src'),
      loaded: img.complete && img.naturalWidth > 0,
      matched: img.parentElement.querySelectorAll(':scope > span[style*="gradient"]').length === 2,
    }));
    const loaded = cards.filter((card) => card.loaded);
    return { total: cards.length, loaded: loaded.length, unmatched: loaded.filter((card) => !card.matched).map((card) => card.src) };
  })()`);
  if (!report) {
    console.log(`${path}: could not read page`);
    failures++;
    continue;
  }
  const status = report.unmatched.length ? "FAIL" : "ok";
  console.log(`${status.padEnd(4)} ${path}: ${report.loaded}/${report.total} loaded, ${report.unmatched.length} unmatched`);
  for (const src of report.unmatched) console.log(`       ${src}`);
  failures += report.unmatched.length;
}

await shutdown(failures ? 1 : 0);
