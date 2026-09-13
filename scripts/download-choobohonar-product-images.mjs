/**
 * Downloads every unique product and variation image in the WooCommerce export
 * into the backend's persistent uploads volume.
 *
 * Usage:
 *   node scripts/download-choobohonar-product-images.mjs --dry-run
 *   node scripts/download-choobohonar-product-images.mjs
 *
 * The generated manifest maps each original URL to its local `/uploads/...`
 * URL. The catalog import script uses this manifest so the storefront never
 * has to request images from the old WooCommerce host.
 */

import { createHash } from "node:crypto";
import { mkdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, "..");
const inputFile = path.join(root, "frontend/src/data/choobohonar-products.json");
const outputDir = path.join(root, "backend/uploads/products");
const manifestFile = path.join(outputDir, "manifest.json");
const dryRun = process.argv.includes("--dry-run");
const force = process.argv.includes("--force");
const concurrency = Math.max(1, Number(process.env.IMAGE_DOWNLOAD_CONCURRENCY || 6));

function sourceImageUrls(product) {
  const urls = (product.images || []).map((image) => image?.src);
  for (const variation of product.variations || []) {
    // `full_src` is the original image; `src` is often only a resized copy.
    urls.push(variation?.image?.full_src || variation?.image?.url || variation?.image?.src);
  }
  return urls.filter((url) => typeof url === "string" && /^https?:\/\//i.test(url));
}

function extensionFor(url, contentType = "") {
  const fromUrl = path.extname(new URL(url).pathname).toLowerCase();
  if (/^\.(?:avif|gif|jpe?g|png|webp)$/i.test(fromUrl)) return fromUrl === ".jpeg" ? ".jpg" : fromUrl;
  if (contentType.includes("png")) return ".png";
  if (contentType.includes("webp")) return ".webp";
  if (contentType.includes("avif")) return ".avif";
  if (contentType.includes("gif")) return ".gif";
  return ".jpg";
}

function fileBase(url) {
  // The URL hash makes names stable and prevents Persian-name/collision issues.
  return createHash("sha256").update(url).digest("hex").slice(0, 24);
}

async function exists(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

async function download(url, index, total) {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: { "User-Agent": "Choobohonar catalog migration/1.0" },
        signal: AbortSignal.timeout(60_000),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const type = response.headers.get("content-type") || "";
      if (!type.startsWith("image/")) throw new Error(`Unexpected content-type: ${type || "none"}`);
      const extension = extensionFor(url, type);
      const filename = `${fileBase(url)}${extension}`;
      const target = path.join(outputDir, filename);
      const localUrl = `/uploads/products/${filename}`;
      if (!force && await exists(target)) return { url, localUrl, skipped: true };

      const temp = `${target}.part`;
      await writeFile(temp, Buffer.from(await response.arrayBuffer()));
      await rename(temp, target); // Atomic: incomplete images are never published.
      return { url, localUrl, skipped: false };
    } catch (error) {
      lastError = error;
      if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 800));
    }
  }
  throw new Error(`${url}: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

async function main() {
  const input = JSON.parse(await readFile(inputFile, "utf8"));
  const urls = [...new Set(input.products.flatMap(sourceImageUrls))];
  console.log(`${input.products.length} products, ${urls.length} unique image URLs.`);
  console.log(`Destination: ${outputDir}`);
  if (dryRun) {
    console.log("Dry run only; no files were downloaded.");
    return;
  }

  await mkdir(outputDir, { recursive: true });
  const localImages = {};
  const failures = [];
  let cursor = 0;

  async function worker() {
    while (cursor < urls.length) {
      const index = cursor++;
      const url = urls[index];
      try {
        const result = await download(url, index, urls.length);
        localImages[url] = result.localUrl;
        console.log(`[${index + 1}/${urls.length}] ${result.skipped ? "kept" : "saved"} ${result.localUrl}`);
      } catch (error) {
        failures.push({ url, error: error instanceof Error ? error.message : String(error) });
        console.error(`[${index + 1}/${urls.length}] FAILED ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, urls.length) }, worker));
  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceFile: path.relative(root, inputFile),
    destination: "/uploads/products",
    images: localImages,
    failures,
  };
  await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`Manifest: ${manifestFile}`);
  if (failures.length) process.exitCode = 1;
}

main().catch(async (error) => {
  // Remove a possible partial temp file only when the process is interrupted
  // before its atomic rename. Existing completed images remain untouched.
  if (error?.path?.endsWith?.(".part")) await unlink(error.path).catch(() => {});
  console.error(error);
  process.exitCode = 1;
});
