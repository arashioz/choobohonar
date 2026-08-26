import { createHash } from 'crypto';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { pipeline } from 'stream/promises';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/choob-va-honar';
const uploadRoot = process.env.UPLOAD_DIR || join(process.cwd(), 'uploads');
const mediaRoot = join(uploadRoot, 'migrated');
const publicPrefix = '/uploads/migrated';
const dryRun = process.argv.includes('--dry-run');
const cache = new Map<string, Promise<string>>();
const stats = { scanned: 0, localized: 0, skipped: 0, failed: 0 };

function isRemote(value: unknown): value is string {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

function isMediaKey(key: string) {
  return /^(image|images|gallery|src|coverImage|featuredImages)$/i.test(key);
}

function extension(contentType: string, source: string) {
  const fromUrl = extname(new URL(source).pathname).toLowerCase();
  if (/^\.(jpe?g|png|webp|gif|avif|svg)$/i.test(fromUrl)) return fromUrl;
  const map: Record<string, string> = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/gif': '.gif', 'image/avif': '.avif', 'image/svg+xml': '.svg' };
  return map[contentType.split(';')[0].trim().toLowerCase()] || '.bin';
}

async function localizeUrl(source: string): Promise<string> {
  const existing = cache.get(source);
  if (existing) return existing;
  const task = (async () => {
    stats.scanned += 1;
    const hash = createHash('sha1').update(source).digest('hex');
    if (dryRun) return `${publicPrefix}/${hash}.jpg`;
    try {
      mkdirSync(mediaRoot, { recursive: true });
      const response = await fetch(source, { signal: AbortSignal.timeout(30000), headers: { 'User-Agent': 'ChooboHonar-media-migration/1.0' } });
      if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.toLowerCase().startsWith('image/')) throw new Error(`not an image (${contentType || 'unknown'})`);
      const file = `${hash}${extension(contentType, source)}`;
      const target = join(mediaRoot, file);
      if (!existsSync(target)) await pipeline(response.body as unknown as NodeJS.ReadableStream, createWriteStream(target));
      stats.localized += 1;
      return `${publicPrefix}/${file}`;
    } catch (error) {
      stats.failed += 1;
      console.warn(`[media] keeping remote URL (${source}):`, error instanceof Error ? error.message : error);
      return source;
    }
  })();
  cache.set(source, task);
  return task;
}

async function localize(value: unknown, key = ''): Promise<unknown> {
  if (isRemote(value) && (isMediaKey(key) || !key)) return localizeUrl(value);
  if (Array.isArray(value)) return Promise.all(value.map((item) => localize(item, key)));
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [childKey, childValue] of Object.entries(value)) result[childKey] = await localize(childValue, childKey);
    return result;
  }
  return value;
}

async function migrateCollection(name: string, mediaFields: string[]) {
  const collection = mongoose.connection.collection(name);
  const cursor = collection.find({});
  while (await cursor.hasNext()) {
    const document = await cursor.next();
    if (!document) continue;
    const update: Record<string, unknown> = {};
    for (const field of mediaFields) {
      if (document[field] !== undefined) update[field] = await localize(document[field], field);
    }
    if (!dryRun && Object.keys(update).length) await collection.updateOne({ _id: document._id }, { $set: update });
  }
}

async function main() {
  console.log(`[media] connecting to MongoDB${dryRun ? ' (dry run)' : ''}…`);
  await mongoose.connect(mongoUri);
  await migrateCollection('shop_products', ['image', 'gallery']);
  await migrateCollection('cms_entries', ['images', 'data']);
  console.log(`[media] scanned=${stats.scanned} localized=${stats.localized} skipped=${stats.skipped} failed=${stats.failed}`);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error('[media] migration failed:', error);
  await mongoose.disconnect().catch(() => undefined);
  process.exit(1);
});
