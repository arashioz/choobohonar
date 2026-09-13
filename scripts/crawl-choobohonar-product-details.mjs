/**
 * Enriches the Store API export with content only available in the rendered
 * WooCommerce product page: accordion descriptions, seat-type tables and
 * dimensions. The Store API deliberately returns these fields empty.
 *
 * Run:
 *   node scripts/crawl-choobohonar-product-details.mjs
 *   node scripts/crawl-choobohonar-product-details.mjs --dry-run
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const sourceFile = path.join(root, "frontend/src/data/choobohonar-products.json");
const outputFile = path.join(root, "frontend/src/data/choobohonar-product-details.json");
const dryRun = process.argv.includes("--dry-run");
const concurrency = Math.max(1, Number(process.env.PRODUCT_DETAIL_CONCURRENCY || 3));

function decodeHtml(value = "") {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:x0*([0-9a-f]+)|([0-9]+));/gi, (_, hex, decimal) => String.fromCodePoint(Number.parseInt(hex || decimal, hex ? 16 : 10)));
}

function text(value = "") {
  return decodeHtml(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|li|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function tableRows(html) {
  return [...html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].flatMap((row) => {
    const cells = [...row[1].matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => text(cell[1]));
    return cells.length >= 2 && cells[0] && cells[1] ? [{ label: cells[0], value: cells.slice(1).join("، ") }] : [];
  });
}

function accordions(html) {
  const labels = [...html.matchAll(/<div\b[^>]*class="[^"]*jet-toggle__label-text[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)];
  return labels.map((match, index) => {
    const end = labels[index + 1]?.index ?? html.length;
    const section = html.slice(match.index, end);
    const content = section.match(/jet-toggle__content-inner[^>]*>([\s\S]*)/i)?.[1] || "";
    return { title: text(match[1]), content: text(content), specs: tableRows(content) };
  }).filter((item) => item.title && item.content);
}

async function fetchDetails(product) {
  // Numeric query URLs are accepted by the source site while direct Persian
  // permalink requests can be blocked by its WAF.
  const url = `https://choobohonar.com/?p=${product.id}&post_type=product`;
  const response = await fetch(url, {
    headers: { "User-Agent": "Googlebot", Accept: "text/html,application/xhtml+xml" },
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const items = accordions(await response.text());
  const selected = items.filter((item) => ["نوع نشیمن", "توضیحات", "ابعاد"].includes(item.title));
  const description = selected.find((item) => item.title === "توضیحات")?.content || "";
  const specs = selected.flatMap((item) => item.specs);
  const dimensions = selected.find((item) => item.title === "ابعاد")?.content || "";
  if (dimensions && !specs.some((item) => item.label === "ابعاد")) specs.push({ label: "ابعاد", value: dimensions });
  return { id: product.id, slug: decodeURIComponent(product.slug), accordions: selected, longDescription: description, specs };
}

async function main() {
  const source = JSON.parse(await readFile(sourceFile, "utf8"));
  console.log(`${source.products.length} product pages queued.`);
  if (dryRun) return;
  const details = {};
  const failures = [];
  let cursor = 0;
  async function worker() {
    while (cursor < source.products.length) {
      const index = cursor++;
      const product = source.products[index];
      try {
        const result = await fetchDetails(product);
        details[String(product.id)] = result;
        console.log(`[${index + 1}/${source.products.length}] ${product.name}: ${result.accordions.length} sections`);
      } catch (error) {
        failures.push({ id: product.id, slug: product.slug, error: error instanceof Error ? error.message : String(error) });
        console.error(`[${index + 1}/${source.products.length}] FAILED ${product.name}`);
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, source.products.length) }, worker));
  await writeFile(outputFile, `${JSON.stringify({ generatedAt: new Date().toISOString(), source: "rendered WooCommerce pages", details, failures }, null, 2)}\n`);
  console.log(`Wrote ${Object.keys(details).length} records, ${failures.length} failures: ${outputFile}`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
