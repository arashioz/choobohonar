#!/usr/bin/env node
/**
 * Packages all brandbook static assets for backend deployment.
 * Output: brandbook-assets-v1.0.0.zip + brandbook-assets-manifest.json (repo root, gitignored)
 *
 * Usage: node scripts/package-brand-assets.mjs
 */

import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import {
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
  existsSync,
} from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
const PUBLIC_BRAND = join(ROOT, "admin/public/brand");
const VERSION = "1.0.0";
const ZIP_NAME = `brandbook-assets-v${VERSION}.zip`;
const MANIFEST_NAME = "brandbook-assets-manifest.json";

const SOURCE_USAGE = {
  "brandbook.ts": join(ROOT, "admin/src/data/brandbook.ts"),
  "ImageryGallery.tsx": join(
    ROOT,
    "admin/src/components/brandbook/sections/ImageryGallery.tsx",
  ),
  "VisualIdentity.tsx": join(
    ROOT,
    "admin/src/components/brandbook/sections/VisualIdentity.tsx",
  ),
  "brandbook/page.tsx": join(ROOT, "admin/src/app/brandbook/page.tsx"),
  "ChatPanel.tsx": join(
    ROOT,
    "admin/src/components/brandbook/layout/ChatPanel.tsx",
  ),
  "login/page.tsx": join(ROOT, "admin/src/app/login/page.tsx"),
  "AdminSidebar.tsx": join(
    ROOT,
    "admin/src/components/layout/AdminSidebar.tsx",
  ),
};

const SKIP = [/^guideline\/assets\/_debug-/];

function walk(dir, base = dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const rel = relative(base, full).replace(/\\/g, "/");
    if (SKIP.some((re) => re.test(rel))) continue;
    const st = statSync(full);
    if (st.isDirectory()) entries.push(...walk(full, base));
    else entries.push({ full, rel, size: st.size });
  }
  return entries;
}

function sha256(filePath) {
  return createHash("sha256")
    .update(readFileSync(filePath))
    .digest("hex")
    .slice(0, 16);
}

function category(relPath) {
  if (relPath.startsWith("heritage/")) return "heritage";
  if (relPath.startsWith("imagery/")) return "imagery";
  if (relPath.startsWith("guideline/assets/collateral/")) return "collateral";
  if (relPath.startsWith("guideline/assets/")) return "guideline-assets";
  if (relPath.startsWith("guideline/")) return "guideline-reference";
  if (relPath.startsWith("downloads/")) return "downloads";
  return "root";
}

function findUsage(publicUrl) {
  const hits = [];
  for (const [source, filePath] of Object.entries(SOURCE_USAGE)) {
    if (!existsSync(filePath)) continue;
    const content = readFileSync(filePath, "utf8");
    if (content.includes(publicUrl)) hits.push(source);
  }
  return hits;
}

function main() {
  if (!existsSync(PUBLIC_BRAND)) {
    console.error("Missing admin/public/brand");
    process.exit(1);
  }

  const files = walk(PUBLIC_BRAND).sort((a, b) => a.rel.localeCompare(b.rel));

  const assets = files.map(({ full, rel, size }) => {
    const publicUrl = `/brand/${rel}`;
    return {
      publicUrl,
      deployPath: `admin/public/brand/${rel}`,
      zipPath: `brand/${rel}`,
      category: category(rel),
      extension: extname(rel).slice(1).toLowerCase(),
      sizeBytes: size,
      sha256: sha256(full),
      usedIn: findUsage(publicUrl),
    };
  });

  const manifest = {
    version: VERSION,
    generatedAt: new Date().toISOString(),
    instructions: {
      fa: "محتوای zip را در admin/public/ استخراج کنید تا مسیر publicUrl در runtime در دسترس باشد.",
      en: "Extract the zip into admin/public/ so each publicUrl resolves at runtime.",
    },
    extractTo: "admin/public/",
    zipStructure: "brand/<relative-path>",
    totalFiles: assets.length,
    totalBytes: assets.reduce((n, a) => n + a.sizeBytes, 0),
    assets,
  };

  const manifestPath = join(ROOT, MANIFEST_NAME);
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

  const downloadsOnly = join(ROOT, "admin/public/brand/downloads");
  const userZip = join(downloadsOnly, "choobohonar-brand-assets.zip");
  if (existsSync(downloadsOnly)) {
    execSync(`cd "${downloadsOnly}" && zip -r -q "${userZip}" . -x "*.zip"`, {
      stdio: "inherit",
    });
  }

  const zipPath = join(ROOT, ZIP_NAME);
  const staging = join(ROOT, ".brand-assets-staging");
  execSync(`rm -rf "${staging}" && mkdir -p "${staging}/brand"`, {
    stdio: "inherit",
  });
  execSync(
    `cd "${PUBLIC_BRAND}" && find . -type f ! -path './guideline/assets/_debug-*' -print0 | while IFS= read -r -d '' f; do mkdir -p "${staging}/brand/$(dirname "$f")"; cp "$f" "${staging}/brand/$f"; done`,
    { stdio: "inherit", shell: "/bin/bash" },
  );
  execSync(`cp "${manifestPath}" "${staging}/MANIFEST.json"`, {
    stdio: "inherit",
  });
  execSync(`cd "${staging}" && zip -r -q "${zipPath}" brand MANIFEST.json`, {
    stdio: "inherit",
  });
  execSync(`rm -rf "${staging}"`, { stdio: "inherit" });

  if (existsSync(userZip)) {
    console.log(
      "User download pack included: admin/public/brand/downloads/choobohonar-brand-assets.zip",
    );
  }

  console.log(`Manifest: ${MANIFEST_NAME} (${assets.length} assets)`);
  console.log(`Zip: ${ZIP_NAME} (${(manifest.totalBytes / 1024 / 1024).toFixed(2)} MB)`);
}

main();
