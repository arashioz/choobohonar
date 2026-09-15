/** Seeds the normalized WordPress category tree into ShopCategory. */
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { readFileSync } from 'fs';
import { join } from 'path';
import { ShopCategorySchema } from '../modules/shop/schemas/shop-category.schema';

dotenv.config();

type TreeNode = { name: string; slug: string; productCount: number; children?: TreeNode[] };
const roomByRoot: Record<string, string> = {
  نشیمن: 'living', 'اتاق خواب': 'bedroom', 'کالای خواب': 'bedding', غذاخوری: 'dining', روشنایی: 'lighting', دکور: 'decor', اکسسوری: 'decor', ظروف: 'dishes', 'فرش و گلیم': 'carpet',
};

async function main() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/choob-va-honar';
  const treePath = join(process.cwd(), 'src/modules/shop/data/wordpress-category-tree.json');
  const tree = JSON.parse(readFileSync(treePath, 'utf8')) as { categories?: TreeNode[] };
  const rows: Array<Record<string, unknown>> = [];
  const visit = (nodes: TreeNode[], parentSlug = '', room = '') => nodes.forEach((node) => {
    const nodeRoom = room || roomByRoot[node.name] || 'decor';
    const slug = parentSlug ? `${parentSlug}/${node.slug}` : node.slug;
    rows.push({ slug, name: node.name, parentSlug, room: nodeRoom, productCount: node.productCount, depth: parentSlug ? parentSlug.split('/').length : 0, sortOrder: rows.length, source: 'wordpress-csv-2026-09-15' });
    visit(node.children || [], slug, nodeRoom);
  });
  visit(tree.categories || []);
  await mongoose.connect(mongoUri);
  const ShopCategory = mongoose.models.ShopCategory || mongoose.model('ShopCategory', ShopCategorySchema);
  const result = rows.length ? await ShopCategory.bulkWrite(rows.map((row) => ({ updateOne: { filter: { slug: row.slug }, update: { $set: row }, upsert: true } })) as never) : { upsertedCount: 0, modifiedCount: 0 };
  console.log(JSON.stringify({ categories: rows.length, upserted: result.upsertedCount, modified: result.modifiedCount }));
  await mongoose.disconnect();
}

main().catch(async (error) => {
  await mongoose.disconnect().catch(() => undefined);
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
