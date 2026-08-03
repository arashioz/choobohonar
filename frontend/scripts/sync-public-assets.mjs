#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(scriptDir, "..");
const sourceRoot = process.env.STOREFRONT_ASSETS_ROOT
  ? resolve(process.env.STOREFRONT_ASSETS_ROOT)
  : "";
const checkOnly = process.argv.includes("--check");
const assetPattern = /["'](\/(?:images|videos)\/[^"']+)["']/g;
const sourceExtensions = new Set([".ts", ".tsx", ".json"]);

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function referencedAssets() {
  const references = new Set();
  for (const file of walk(join(appRoot, "src"))) {
    if (!sourceExtensions.has(extname(file))) continue;
    const body = readFileSync(file, "utf8");
    for (const match of body.matchAll(assetPattern)) {
      if (!match[1].includes("...")) references.add(match[1]);
    }
  }
  return [...references].sort();
}

function publicPath(asset) {
  return join(appRoot, "public", asset);
}

function sourcePath(asset) {
  return join(sourceRoot, asset);
}

function assertComplete(assets) {
  const missing = assets.filter((asset) => !existsSync(publicPath(asset)));
  if (!missing.length) {
    process.stdout.write(`Asset check passed: ${assets.length} local references are deployable.\n`);
    return;
  }

  process.stderr.write(`Missing ${missing.length} public assets:\n${missing.join("\n")}\n`);
  process.exitCode = 1;
}

async function optimizeImage(source, destination) {
  mkdirSync(dirname(destination), { recursive: true });
  await sharp(source)
    .rotate()
    .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, progressive: true, mozjpeg: true })
    .toFile(destination);
}

function optimizeVideo(source, destination) {
  mkdirSync(dirname(destination), { recursive: true });
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      source,
      "-map_metadata",
      "-1",
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "24",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      destination,
    ],
    { stdio: "inherit" },
  );

  if (result.error?.code === "ENOENT") {
    process.stderr.write("ffmpeg is unavailable; copied the source video without transcoding.\n");
    cpSync(source, destination);
    return;
  }
  if (result.status !== 0) throw new Error(`ffmpeg failed with status ${result.status}`);
}

async function sync(assets) {
  if (!sourceRoot || !existsSync(sourceRoot)) {
    throw new Error("Set STOREFRONT_ASSETS_ROOT to a public asset source directory.");
  }

  const unavailable = assets.filter((asset) => !existsSync(sourcePath(asset)));
  if (unavailable.length) {
    throw new Error(`Source is missing ${unavailable.length} assets:\n${unavailable.join("\n")}`);
  }

  const images = assets.filter((asset) => asset.startsWith("/images/"));
  const videos = assets.filter((asset) => asset.startsWith("/videos/"));
  const concurrency = 4;
  let cursor = 0;

  async function worker() {
    while (cursor < images.length) {
      const index = cursor++;
      const asset = images[index];
      await optimizeImage(sourcePath(asset), publicPath(asset));
      process.stdout.write(`[${index + 1}/${images.length}] ${asset}\n`);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));

  for (const asset of videos) {
    process.stdout.write(`Optimizing ${asset}\n`);
    optimizeVideo(sourcePath(asset), publicPath(asset));
  }
}

const assets = referencedAssets();

if (checkOnly) {
  assertComplete(assets);
} else {
  await sync(assets);
  assertComplete(assets);
}
