/** Clears only the requested shop collection; requires an explicit target. */
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import { ShopProductSchema } from '../modules/shop/schemas/shop-product.schema';
import { ShopCategorySchema } from '../modules/shop/schemas/shop-category.schema';

dotenv.config();

const target = process.argv.includes('--products')
  ? 'products'
  : process.argv.includes('--categories')
    ? 'categories'
    : '';

async function main() {
  if (!target || !process.argv.includes('--confirm')) {
    throw new Error('Run with exactly one target: --products or --categories, plus --confirm.');
  }
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/choob-va-honar';
  await mongoose.connect(mongoUri);
  const Model = target === 'products'
    ? mongoose.models.ShopProduct || mongoose.model('ShopProduct', ShopProductSchema)
    : mongoose.models.ShopCategory || mongoose.model('ShopCategory', ShopCategorySchema);
  const result = await Model.deleteMany({});
  console.log(`Deleted ${result.deletedCount} shop ${target}.`);
  await mongoose.disconnect();
}

main().catch(async (error) => {
  await mongoose.disconnect().catch(() => undefined);
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
