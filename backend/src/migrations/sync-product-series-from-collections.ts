import mongoose, { Schema } from 'mongoose';

type Collection = { name: string; series?: string; status?: string };
type Product = { _id: mongoose.Types.ObjectId; name: string; series?: string };

function normalize(value: string): string {
  return value.toLowerCase().replace(/[آأإ]/g, 'ا').replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/\s+/g, ' ').trim();
}

function collectionName(value: string): string {
  return value.trim().replace(/^کالکشن\s+/u, '').trim();
}

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/choob-va-honar';
  await mongoose.connect(uri);
  const CollectionModel = mongoose.model<Collection>('Collection', new Schema({}, { strict: false }));
  const ProductModel = mongoose.model<Product>('ShopProduct', new Schema({}, { strict: false }));
  const [collections, products] = await Promise.all([
    CollectionModel.find({ status: { $ne: 'archived' } }).lean(),
    ProductModel.find({}).lean(),
  ]);
  const rules = collections
    .map((collection) => ({ name: collectionName(collection.name || ''), series: String(collection.series || '').trim() }))
    .filter((rule) => rule.name)
    .sort((a, b) => normalize(b.name).length - normalize(a.name).length);

  const operations: mongoose.AnyBulkWriteOperation<Product>[] = [];
  const ambiguous: string[] = [];
  let alreadyCorrect = 0;
  for (const product of products) {
    const matches = rules.filter((rule) => normalize(product.name || '').includes(normalize(rule.name)));
    if (!matches.length) continue;
    const best = matches[0];
    if (matches.length > 1 && normalize(matches[1].name).length === normalize(best.name).length) {
      ambiguous.push(product.name);
      continue;
    }
    const series = best.series || best.name;
    if (normalize(product.series || '') === normalize(series)) {
      alreadyCorrect++;
      continue;
    }
    operations.push({ updateOne: { filter: { _id: product._id }, update: { $set: { series } } } });
  }
  if (operations.length) await ProductModel.bulkWrite(operations);
  console.log(JSON.stringify({ updated: operations.length, alreadyCorrect, ambiguous, scannedProducts: products.length }, null, 2));
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
