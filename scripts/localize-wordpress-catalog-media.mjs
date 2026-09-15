/**
 * Downloads every remote product image referenced by the WordPress catalog
 * and writes a portable catalog whose URLs point to local backend uploads.
 *
 * Output files:
 *   backend/uploads/products/<sha256>.<ext>
 *   backend/src/modules/shop/data/wordpress-csv-catalog.local.json
 *
 * Run from repository root:
 *   node scripts/localize-wordpress-catalog-media.mjs
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";

const root = process.cwd();
const inputPath = join(root, "backend/src/modules/shop/data/wordpress-csv-catalog.json");
const outputPath = join(root, "backend/src/modules/shop/data/wordpress-csv-catalog.local.json");
const mediaDir = join(root, "backend/uploads/products");
const publicPrefix = "/uploads/products";
const concurrency = 6;
const stats = { urls: 0, downloaded: 0, reused: 0, failed: 0 };
const cache = new Map();

function isRemote(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value);
}

function fileExtension(source, contentType) {
  const fromUrl = extname(new URL(source).pathname).toLowerCase();
  if (/^\.(jpe?g|png|webp|gif|avif|svg)$/i.test(fromUrl)) return fromUrl === ".jpeg" ? ".jpg" : fromUrl;
  const map = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/avif": ".avif",
    "image/svg+xml": ".svg",
  };
  return map[(contentType || "").split(";")[0].trim().toLowerCase()] || ".jpg";
}

async function localizeUrl(source) {
  if (!isRemote(source)) return source;
  if (cache.has(source)) return cache.get(source);
  const task = (async () => {
    stats.urls += 1;
    const hash = createHash("sha256").update(source).digest("hex");
    const extensionFromUrl = fileExtension(source, "");
    const existingFromUrl = join(mediaDir, `${hash}${extensionFromUrl}`);
    if (existsSync(existingFromUrl)) {
      stats.reused += 1;
      return `${publicPrefix}/${hash}${extensionFromUrl}`;
    }
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await fetch(source, {
          signal: AbortSignal.timeout(45_000),
          headers: { "User-Agent": "ChooboHonar-catalog-import/1.0" },
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const contentType = response.headers.get("content-type") || "";
        if (!contentType.toLowerCase().startsWith("image/")) throw new Error(`not an image (${contentType || "unknown"})`);
        const extension = fileExtension(source, contentType);
        const fileName = `${hash}${extension}`;
        const target = join(mediaDir, fileName);
        if (existsSync(target)) stats.reused += 1;
        else {
          const buffer = Buffer.from(await response.arrayBuffer());
          if (!buffer.length) throw new Error("empty image");
          writeFileSync(target, buffer);
          stats.downloaded += 1;
        }
        return `${publicPrefix}/${fileName}`;
      } catch (error) {
        if (attempt === 3) {
          stats.failed += 1;
          console.warn(`[image] keeping remote URL: ${source} (${error instanceof Error ? error.message : error})`);
          return source;
        }
      }
    }
    return source;
  })();
  cache.set(source, task);
  return task;
}

async function mapConcurrent(items, callback) {
  const results = new Array(items.length);
  let cursor = 0;
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await callback(items[index]);
    }
  }));
  return results;
}

mkdirSync(mediaDir, { recursive: true });
const catalog = JSON.parse(readFileSync(inputPath, "utf8"));
const urls = [...new Set(catalog.flatMap((product) => [
  product.image,
  ...(product.gallery || []),
  ...(product.variants || []).map((variant) => variant.image),
]).filter(isRemote))];
const localized = new Map(await mapConcurrent(urls, async (url) => [url, await localizeUrl(url)]));
const localCatalog = catalog.map((product) => ({
  ...product,
  image: localized.get(product.image) || product.image || "",
  gallery: (product.gallery || []).map((url) => localized.get(url) || url),
  variants: (product.variants || []).map((variant) => ({
    ...variant,
    image: localized.get(variant.image) || variant.image,
  })),
}));

writeFileSync(outputPath, `${JSON.stringify(localCatalog, null, 2)}\n`);
console.log(JSON.stringify({ products: localCatalog.length, output: outputPath, mediaDir, ...stats }));
