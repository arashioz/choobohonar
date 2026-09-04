import mongoose, { Schema } from 'mongoose';

type Product = { _id: mongoose.Types.ObjectId; slug: string; name: string; series?: string };
type NamedCollection = { name: string; series?: string; status?: string };
type CmsCollection = {
  _id: mongoose.Types.ObjectId;
  title: string;
  status?: string;
  data?: { productSlugs?: string[]; productIds?: string[]; seriesName?: string; series?: string };
};
type MatchRule = { name: string; series: string };

function normalize(value: string): string {
  return value.toLowerCase().replace(/[آأإ]/g, 'ا').replace(/[يى]/g, 'ی').replace(/ك/g, 'ک').replace(/\s+/g, ' ').trim();
}

function collectionName(value: string): string {
  return value.trim().replace(/^کالکشن\s+/u, '').trim();
}

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

function rulesForCmsCollection(collection: CmsCollection): MatchRule[] {
  const data = collection.data || {};
  const names = unique([String(data.seriesName || ''), String(data.series || ''), collectionName(collection.title || '')]);
  return names.map((name) => ({ name, series: String(data.seriesName || data.series || name).trim() }));
}

function matches(product: Product, rules: MatchRule[]): MatchRule[] {
  const title = normalize(product.name || '');
  return rules.filter((rule) => title.includes(normalize(rule.name)));
}

async function main() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/choob-va-honar';
  await mongoose.connect(uri);

  const ProductModel = mongoose.model<Product>('ShopProduct', new Schema({}, { strict: false }));
  const NamedCollectionModel = mongoose.model<NamedCollection>('Collection', new Schema({}, { strict: false }));
  // The collections in «مدیریت آثار» are CMS entries. Membership is stored
  // in data.productSlugs, not in the standalone Collection model.
  const CmsCollectionModel = mongoose.model<CmsCollection>('CmsSyncCollection', new Schema({}, { strict: false }), 'cms_entries');
  const [products, namedCollections, cmsCollections] = await Promise.all([
    ProductModel.find({}).lean(),
    NamedCollectionModel.find({ status: { $ne: 'archived' } }).lean(),
    CmsCollectionModel.find({ kind: 'collection', status: { $ne: 'archived' } }).lean(),
  ]);

  const namedRules = namedCollections
    .map((collection) => ({ name: collectionName(collection.name || ''), series: String(collection.series || '').trim() }))
    .filter((rule) => rule.name);
  const allRules = [...namedRules, ...cmsCollections.flatMap(rulesForCmsCollection)]
    .sort((a, b) => normalize(b.name).length - normalize(a.name).length);

  const productOperations: mongoose.AnyBulkWriteOperation<Product>[] = [];
  for (const product of products) {
    const found = matches(product, allRules);
    if (!found.length) continue;
    const best = found[0];
    if (found.length > 1 && normalize(found[1].name).length === normalize(best.name).length && normalize(found[1].name) !== normalize(best.name)) continue;
    const series = best.series || best.name;
    if (normalize(product.series || '') !== normalize(series)) {
      productOperations.push({ updateOne: { filter: { _id: product._id }, update: { $set: { series } } } });
    }
  }

  const cmsOperations: mongoose.AnyBulkWriteOperation<CmsCollection>[] = [];
  const collectionsUpdated: Array<{ title: string; added: number }> = [];
  for (const collection of cmsCollections) {
    const matchedSlugs = products.filter((product) => matches(product, rulesForCmsCollection(collection)).length > 0).map((product) => product.slug);
    const existing = Array.isArray(collection.data?.productSlugs) ? collection.data!.productSlugs! : [];
    const next = unique([...existing, ...matchedSlugs]);
    if (next.length === existing.length) continue;
    cmsOperations.push({ updateOne: { filter: { _id: collection._id }, update: { $set: { 'data.productSlugs': next, 'data.productIds': next } } } });
    collectionsUpdated.push({ title: collection.title, added: next.length - existing.length });
  }

  if (productOperations.length) await ProductModel.bulkWrite(productOperations);
  if (cmsOperations.length) await CmsCollectionModel.bulkWrite(cmsOperations);
  console.log(JSON.stringify({
    scannedProducts: products.length,
    cmsCollectionsFound: cmsCollections.length,
    productSeriesUpdated: productOperations.length,
    cmsCollectionsUpdated: collectionsUpdated,
  }, null, 2));
  await mongoose.disconnect();
}

main().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exitCode = 1;
});
