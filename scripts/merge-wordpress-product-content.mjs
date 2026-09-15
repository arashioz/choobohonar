/**
 * Merges WordPress product titles and descriptions from a phpMyAdmin JSON
 * export into both catalog seed files. WooCommerce stores the full product
 * copy in cms_block records referenced through `desc_short_code` metadata.
 *
 * Run: node scripts/merge-wordpress-product-content.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const databasePath = join(root, "wordpress-files/chooboho_1150396_db (1).json");
const catalogPaths = [
  join(root, "backend/src/modules/shop/data/wordpress-csv-catalog.json"),
  join(root, "backend/src/modules/shop/data/wordpress-csv-catalog.local.json"),
];

function text(value) {
  return String(value ?? "").trim();
}

function normalized(value) {
  return text(value)
    .toLowerCase()
    .replace(/[آأإ]/g, "ا")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function htmlToText(value) {
  return text(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&#8211;/g, "–")
    .replace(/&#8217;/g, "’")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function usable(value) {
  const result = text(value);
  return result && result !== "Array" ? result : "";
}

function blockId(value) {
  return usable(value).match(/\[html_block\s+id=["']?(\d+)/i)?.[1];
}

const database = JSON.parse(readFileSync(databasePath, "utf8"));
const posts = database.find((item) => item.type === "table" && item.name === "wp_posts")?.data || [];
const metadata = database.find((item) => item.type === "table" && item.name === "wp_postmeta")?.data || [];
const productsByName = new Map();
const postsById = new Map(posts.map((post) => [String(post.ID), post]));
const metaByPost = new Map();

for (const meta of metadata) {
  const postId = String(meta.post_id);
  const values = metaByPost.get(postId) || new Map();
  values.set(String(meta.meta_key), usable(meta.meta_value));
  metaByPost.set(postId, values);
}
for (const post of posts.filter((post) => post.post_type === "product")) {
  const key = normalized(post.post_title);
  if (!key) continue;
  productsByName.set(key, [...(productsByName.get(key) || []), post]);
}

function detailsFor(name) {
  const candidates = productsByName.get(normalized(name)) || [];
  if (!candidates.length) return undefined;
  const ranked = candidates
    .map((post) => {
      const meta = metaByPost.get(String(post.ID)) || new Map();
      const block = postsById.get(blockId(meta.get("desc_short_code")));
      const longDescription = usable(block?.post_content) || usable(post.post_content);
      const shortDescription =
        usable(meta.get("archive_variable_description")) ||
        usable(meta.get("variable_description")) ||
        usable(meta.get("_yoast_wpseo_metadesc")) ||
        htmlToText(longDescription).slice(0, 320);
      return { post, longDescription, shortDescription };
    })
    .sort((a, b) =>
      b.longDescription.length - a.longDescription.length ||
      b.shortDescription.length - a.shortDescription.length ||
      Number(b.post.post_status === "publish") - Number(a.post.post_status === "publish"),
    );
  return ranked[0];
}

let matched = 0;
let longDescriptions = 0;
let shortDescriptions = 0;
let unmatched = 0;
for (const catalogPath of catalogPaths) {
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
  const merged = catalog.map((product) => {
    const details = detailsFor(product.name);
    if (!details) {
      unmatched += 1;
      return product;
    }
    matched += 1;
    if (details.longDescription) longDescriptions += 1;
    if (details.shortDescription) shortDescriptions += 1;
    return {
      ...product,
      name: text(details.post.post_title) || product.name,
      shortDescription: details.shortDescription || product.shortDescription || "",
      longDescription: details.longDescription || product.longDescription || "",
      wordpressPostId: String(details.post.ID),
    };
  });
  writeFileSync(catalogPath, `${JSON.stringify(merged, null, 2)}\n`);
}

console.log(JSON.stringify({
  files: catalogPaths.length,
  productsPerFile: JSON.parse(readFileSync(catalogPaths[0], "utf8")).length,
  matched: matched / catalogPaths.length,
  longDescriptions: longDescriptions / catalogPaths.length,
  shortDescriptions: shortDescriptions / catalogPaths.length,
  unmatched: unmatched / catalogPaths.length,
}));
