/** Download all remote images referenced by wordpress-shop-catalog.remote.json. */
import { createHash } from "node:crypto";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceFile = path.join(root, "backend/src/modules/shop/data/wordpress-shop-catalog.remote.json");
const outputDir = path.join(root, "backend/uploads/products");
const manifestFile = path.join(outputDir, "wordpress-manifest.json");
const concurrency = Math.max(1, Number(process.env.IMAGE_DOWNLOAD_CONCURRENCY || 6));
const dryRun = process.argv.includes("--dry-run");

function extension(url, contentType = "") {
  const fromUrl = path.extname(new URL(url).pathname).toLowerCase();
  if (/^\.(jpe?g|png|webp|gif|avif)$/i.test(fromUrl)) return fromUrl === ".jpeg" ? ".jpg" : fromUrl;
  if (/png/.test(contentType)) return ".png";
  if (/webp/.test(contentType)) return ".webp";
  if (/gif/.test(contentType)) return ".gif";
  return ".jpg";
}
async function exists(file) { try { await stat(file); return true; } catch { return false; } }
async function download(url) {
  const guessedFilename = `${createHash("sha256").update(url).digest("hex").slice(0, 24)}${extension(url)}`;
  const guessedTarget = path.join(outputDir, guessedFilename);
  if (await exists(guessedTarget)) return `/uploads/products/${guessedFilename}`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { headers: { "user-agent": "Choobohonar catalog migration/1.0" }, redirect: "follow" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = Buffer.from(await response.arrayBuffer());
      if (!body.length) throw new Error("empty response");
      const filename = `${createHash("sha256").update(url).digest("hex").slice(0, 24)}${extension(url, response.headers.get("content-type") || "")}`;
      const target = path.join(outputDir, filename), temp = `${target}.part`;
      if (!await exists(target) && !dryRun) { await writeFile(temp, body); await rename(temp, target); }
      return `/uploads/products/${filename}`;
    } catch (error) {
      if (attempt === 3) throw error;
      await new Promise((resolve) => setTimeout(resolve, attempt * 700));
    }
  }
}
async function main() {
  const catalog = JSON.parse(await readFile(sourceFile, "utf8"));
  const urls = [...new Set(catalog.flatMap((product) => [product.image, ...(product.gallery || []), ...(product.variants || []).map((variant) => variant.image)]).filter((url) => /^https?:\/\//.test(url)))];
  if (!urls.length) throw new Error("No remote product image URL found. Run build-wordpress-shop-catalog first.");
  await mkdir(outputDir, { recursive: true });
  const previous = await readFile(manifestFile, "utf8").then(JSON.parse).catch(() => ({ images: {}, failures: [] }));
  const images = { ...(previous.images || {}) }, failures = [];
  let cursor = 0, done = 0;
  const worker = async () => {
    while (cursor < urls.length) {
      const url = urls[cursor++];
      if (!images[url]) {
        try { images[url] = await download(url); } catch (error) { failures.push({ url, error: String(error) }); }
      }
      done++; process.stdout.write(`\rDownloaded ${done}/${urls.length}`);
    }
  };
  await Promise.all(Array.from({ length: concurrency }, worker));
  process.stdout.write("\n");
  await writeFile(manifestFile, `${JSON.stringify({ generatedAt: new Date().toISOString(), images, failures }, null, 2)}\n`);
  if (failures.length) { console.error(`${failures.length} image(s) failed; inspect ${manifestFile}`); process.exitCode = 1; return; }
  await rm(path.join(outputDir, ".keep"), { force: true });
  console.log(`Saved ${Object.keys(images).length} local image mappings in ${path.relative(root, manifestFile)}.`);
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
