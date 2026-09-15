/**
 * Extract WooCommerce products from the WordPress SQL backup without importing
 * that backup into MongoDB/MySQL. It creates a reviewable remote-image catalog.
 *
 *   node scripts/build-wordpress-shop-catalog.mjs
 *   node scripts/build-wordpress-shop-catalog.mjs --media-manifest backend/uploads/products/wordpress-manifest.json
 *
 * The first command never changes the application database. Download the media
 * manifest first, then run the second command to write local /uploads URLs.
 */
import { createReadStream } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dumpPath = path.join(root, "wordpress-files/chooboho_1150396_db.sql");
const remoteOutput = path.join(root, "backend/src/modules/shop/data/wordpress-shop-catalog.remote.json");
const catalogOutputs = [
  path.join(root, "backend/src/modules/shop/data/shop-catalog.json"),
  path.join(root, "frontend/src/data/shop-catalog.json"),
];
const manifestFlag = process.argv.indexOf("--media-manifest");
const manifestPath = manifestFlag >= 0 ? path.resolve(process.cwd(), process.argv[manifestFlag + 1] || "") : "";

const roomBySlug = {
  livingroom: "living", bedroom: "bedroom", bedding: "bedding", diningroom: "dining",
  carpet: "carpet", lighting: "lighting", dishes: "dishes", decor: "decor",
};
const attributeLabels = {
  pa_collection: "کالکشن", pa_model: "مدل", pa_sofa: "نوع نشیمن", pa_woodcolor: "رنگ چوب",
  pa_fabric: "پارچه", "pa_cushion-fabric": "پارچه کوسن", "pa_tape-fabric": "پارچه نوار",
  pa_length: "طول", pa_width: "عرض", pa_height: "ارتفاع", pa_size: "سایز",
  pa_color: "رنگ", "pa_bedding-color": "رنگ", pa_material: "متریال",
};
function decodeSlug(value = "") {
  try { return decodeURIComponent(value); } catch { return value; }
}

function sqlValue(raw) {
  const value = raw.trim();
  if (value === "NULL") return null;
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/\\([0btnrZ'\\])/g, (_, char) => ({ 0: "\0", b: "\b", t: "\t", n: "\n", r: "\r", Z: "\x1a", "'": "'", "\\": "\\" })[char] ?? char);
  }
  return value;
}

function parseInsert(statement, onRow) {
  const header = /^\s*INSERT INTO `([^`]+)` \(([^]+?)\) VALUES\s*/.exec(statement);
  if (!header) return;
  const table = header[1];
  const columns = header[2].split(",").map((value) => value.replace(/[\s`]/g, ""));
  const values = statement.slice(header[0].length).replace(/;\s*$/, "");
  let tuple = null, field = "", fields = [], quoted = false, escaped = false;
  for (let index = 0; index < values.length; index++) {
    const char = values[index];
    if (quoted) {
      field += char;
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === "'") quoted = false;
      continue;
    }
    if (char === "'") { quoted = true; field += char; continue; }
    if (char === "(") { tuple = []; field = ""; fields = []; continue; }
    if (char === "," && tuple) { fields.push(sqlValue(field)); field = ""; continue; }
    if (char === ")" && tuple) {
      fields.push(sqlValue(field));
      const row = Object.fromEntries(columns.map((column, columnIndex) => [column, fields[columnIndex]]));
      onRow(table, row);
      tuple = null; field = ""; fields = [];
      continue;
    }
    if (tuple) field += char;
  }
}

async function eachStatement(file, callback) {
  let buffer = "", quoted = false, escaped = false;
  for await (const chunk of createReadStream(file, { encoding: "utf8", highWaterMark: 1024 * 1024 })) {
    const scanFrom = buffer.length;
    buffer += chunk;
    let start = 0;
    for (let index = scanFrom; index < buffer.length; index++) {
      const char = buffer[index];
      if (quoted) {
        if (escaped) escaped = false;
        else if (char === "\\") escaped = true;
        else if (char === "'") quoted = false;
      } else if (char === "'") quoted = true;
      else if (char === ";") {
        callback(buffer.slice(start, index + 1));
        start = index + 1;
      }
    }
    buffer = buffer.slice(start);
  }
  if (buffer.trim()) callback(buffer);
}

// Relationship rows have no text fields and are one row per line in this
// dump. Reading them separately avoids losing a relationship when an old
// malformed WordPress post value contains a broken SQL quote.
async function readTermRelationships(file, relations) {
  let active = false;
  const input = createInterface({ input: createReadStream(file, { encoding: "utf8" }), crlfDelay: Infinity });
  for await (const line of input) {
    if (line.startsWith("INSERT INTO `wp_term_relationships`")) { active = true; continue; }
    if (!active) continue;
    const match = /^\((\d+),\s*(\d+),\s*\d+\)[,;]/.exec(line);
    if (match) {
      if (!relations.has(match[1])) relations.set(match[1], []);
      relations.get(match[1]).push(match[2]);
    }
    if (line.endsWith(";")) active = false;
  }
}

async function readSimpleTermTables(file, terms, taxonomies) {
  let table = "";
  const input = createInterface({ input: createReadStream(file, { encoding: "utf8" }), crlfDelay: Infinity });
  for await (const line of input) {
    if (line.startsWith("INSERT INTO `wp_terms`")) { table = "wp_terms"; continue; }
    if (line.startsWith("INSERT INTO `wp_term_taxonomy`")) { table = "wp_term_taxonomy"; continue; }
    if (!table) continue;
    if (line.startsWith("(")) {
      const columns = table === "wp_terms" ? "`term_id`, `name`, `slug`, `term_group`" : "`term_taxonomy_id`, `term_id`, `taxonomy`, `description`, `parent`, `count`";
      parseInsert(`INSERT INTO \`${table}\` (${columns}) VALUES ${line.replace(/,$/, ";")}`, (parsedTable, row) => {
        if (parsedTable === "wp_terms") terms.set(String(row.term_id), row);
        else taxonomies.set(String(row.term_taxonomy_id), row);
      });
    }
    if (line.endsWith(";")) table = "";
  }
}

// Some old postmeta INSERT chunks include malformed HTML/quotes. The two
// shortcode keys are plain one-line values, so recover them independently.
async function readContentShortcodes(file, meta) {
  let active = false;
  const input = createInterface({ input: createReadStream(file, { encoding: "utf8" }), crlfDelay: Infinity });
  for await (const line of input) {
    if (line.startsWith("INSERT INTO `wp_postmeta`")) { active = true; continue; }
    if (!active) continue;
    const match = /^\(\d+,\s*(\d+),\s*'(desc_short_code|accordion_short_code)',\s*'(.*?)'\)[,;]$/.exec(line);
    if (match) {
      if (!meta.has(match[1])) meta.set(match[1], new Map());
      meta.get(match[1]).set(match[2], [match[3].replace(/\\(["'])/g, "$1")]);
    }
    if (line.endsWith(";")) active = false;
  }
}

async function readCmsBlocks(file, posts) {
  let active = false;
  const columns = "`ID`, `post_author`, `post_date`, `post_date_gmt`, `post_content`, `post_title`, `post_excerpt`, `post_status`, `comment_status`, `ping_status`, `post_password`, `post_name`, `to_ping`, `pinged`, `post_modified`, `post_modified_gmt`, `post_content_filtered`, `post_parent`, `guid`, `menu_order`, `post_type`, `post_mime_type`, `comment_count`";
  const input = createInterface({ input: createReadStream(file, { encoding: "utf8" }), crlfDelay: Infinity });
  for await (const line of input) {
    if (line.startsWith("INSERT INTO `wp_posts`")) { active = true; continue; }
    if (!active) continue;
    if (line.startsWith("(")) {
      parseInsert(`INSERT INTO \`wp_posts\` (${columns}) VALUES ${line.replace(/,$/, ";")}`, (_, row) => {
        if (row.post_type === "cms_block") posts.set(String(row.ID), row);
      });
    }
    if (line.endsWith(";")) active = false;
  }
}

function cleanText(value = "") {
  return String(value)
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, code.startsWith("x") ? 16 : 10)))
    .replace(/\s+/g, " ").trim();
}

function tableSpecs(html = "") {
  const specs = [];
  for (const match of html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...match[1].matchAll(/<t[hd][^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((cell) => cleanText(cell[1]));
    if (cells.length >= 2 && cells[0] && cells[1]) specs.push({ label: cells[0], value: cells.slice(1).join("، ") });
  }
  return specs;
}

function listSpecs(html = "") {
  return [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].flatMap((match) => {
    const text = cleanText(match[1]);
    const separator = text.indexOf(":");
    return separator > 0 ? [{ label: text.slice(0, separator).trim(), value: text.slice(separator + 1).trim() }] : [];
  });
}

function metaValues(meta, id, key) { return meta.get(id)?.get(key) || []; }
function metaValue(meta, id, key) { return metaValues(meta, id, key)[0] || ""; }
function numberOrUndefined(value) { const number = Number(value); return Number.isFinite(number) && number > 0 ? number : undefined; }
function makeImageUrl(attachment, meta, id) {
  if (!id) return "";
  const post = attachment.get(String(id));
  if (post?.guid && /^https?:\/\//.test(post.guid)) return post.guid;
  const attached = metaValue(meta, String(id), "_wp_attached_file");
  return attached ? `https://choobohonar.com/wp-content/uploads/${attached.replace(/^\/+/, "")}` : "";
}
function productStatus(status) { return status === "publish" ? "published" : status === "draft" || status === "pending" ? "draft" : "archived"; }

async function main() {
  const posts = new Map(), meta = new Map(), terms = new Map(), taxonomies = new Map(), relations = new Map(), lookup = new Map();
  let inserts = 0;
  await eachStatement(dumpPath, (statement) => parseInsert(statement, (table, row) => {
    inserts++;
    if (table === "wp_posts" && ["product", "product_variation", "attachment", "cms_block"].includes(row.post_type)) posts.set(String(row.ID), row);
    if (table === "wp_postmeta") {
      const id = String(row.post_id); if (!meta.has(id)) meta.set(id, new Map());
      const values = meta.get(id); if (!values.has(row.meta_key)) values.set(row.meta_key, []);
      values.get(row.meta_key).push(row.meta_value);
    }
    if (table === "wp_terms") terms.set(String(row.term_id), row);
    if (table === "wp_term_taxonomy") taxonomies.set(String(row.term_taxonomy_id), row);
    if (table === "wp_term_relationships") { const id = String(row.object_id); if (!relations.has(id)) relations.set(id, []); relations.get(id).push(String(row.term_taxonomy_id)); }
    if (table === "wp_wc_product_meta_lookup") lookup.set(String(row.product_id), row);
  }));
  relations.clear();
  terms.clear();
  taxonomies.clear();
  await readSimpleTermTables(dumpPath, terms, taxonomies);
  await readTermRelationships(dumpPath, relations);
  await readContentShortcodes(dumpPath, meta);
  await readCmsBlocks(dumpPath, posts);

  const termForTaxonomy = (taxonomy, slug) => [...taxonomies.values()].map((item) => ({ ...item, term: terms.get(String(item.term_id)) })).find((item) => item.taxonomy === taxonomy && item.term?.slug === slug)?.term;
  // The known early catalog row is a compact integrity check for the SQL parser.
  // Kept only in source comments; no application data depends on this ID.
  const assignedTerms = (id, taxonomy) => (relations.get(id) || []).map((taxonomyId) => taxonomies.get(taxonomyId)).filter((item) => item?.taxonomy === taxonomy).map((item) => terms.get(String(item.term_id))).filter(Boolean);
  const attachment = new Map([...posts].filter(([, post]) => post.post_type === "attachment"));
  // Older content blocks are frequently stored as draft while still rendered
  // by the Woo template, so status must not discard their product data.
  const cmsBlocks = [...posts.values()].filter((post) => post.post_type === "cms_block");
  const products = [...posts.values()].filter((post) => post.post_type === "product" && ["publish", "draft", "pending", "private"].includes(post.post_status));
  const contentBlockFromShortcode = (value) => {
    const blockId = /\[(?:html_block|cms_block)\s+id=["']?(\d+)/i.exec(String(value || ""))?.[1];
    const block = blockId ? posts.get(blockId) : undefined;
    return block?.post_type === "cms_block" ? block : undefined;
  };
  const variationsByParent = new Map();
  for (const variation of [...posts.values()].filter((post) => post.post_type === "product_variation")) {
    const parent = String(variation.post_parent); if (!variationsByParent.has(parent)) variationsByParent.set(parent, []); variationsByParent.get(parent).push(variation);
  }

  const remoteCatalog = products.map((post, index) => {
    const id = String(post.ID), productMeta = meta.get(id) || new Map();
    const productTermIds = new Set(relations.get(id) || []);
    // Woodmart/JetEngine keeps several product-detail tables as CMS blocks.
    // A block is assigned through the same WordPress terms as its product.
    const detailBlocks = cmsBlocks.filter((block) => (relations.get(String(block.ID)) || []).some((termId) => productTermIds.has(termId)));
    const categoryTerms = assignedTerms(id, "product_cat");
    const category = categoryTerms.find((term) => term.slug !== "uncategorized") || categoryTerms[0];
    // The legacy site placed mattresses under "اتاق خواب". In the new shop
    // they have their own customer-facing category, "کالای خواب".
    const isBeddingProduct = /تشک|بالش|روتختی|ملحفه|پتو|لحاف|کاور|روبالشی|سرویس\s*خواب|محافظ\s*تشک/.test(post.post_title);
    const room = isBeddingProduct ? "bedding" : roomBySlug[category?.slug] || roomBySlug[categoryTerms.map((term) => term.slug).find((slug) => roomBySlug[slug])] || "decor";
    const variationPosts = variationsByParent.get(id) || [];
    const attributeTaxonomies = (relations.get(id) || []).map((taxonomyId) => taxonomies.get(taxonomyId)?.taxonomy).filter((taxonomy) => taxonomy?.startsWith("pa_"));
    const attributes = [...new Set(attributeTaxonomies)].map((taxonomy) => {
      const values = assignedTerms(id, taxonomy);
      const variationKey = `attribute_${taxonomy}`;
      const usedInVariation = variationPosts.some((variation) => Boolean(metaValue(meta, String(variation.ID), variationKey)));
      return { id: taxonomy, name: attributeLabels[taxonomy] || taxonomy.replace(/^pa_/, "").replace(/[-_]/g, " "), taxonomy, hasVariations: usedInVariation, terms: values.map((term) => ({ id: Number(term.term_id), name: term.name, slug: term.slug, default: false })) };
    });
    const thumbnail = makeImageUrl(attachment, meta, metaValue(meta, id, "_thumbnail_id"));
    const gallery = [thumbnail, ...metaValue(meta, id, "_product_image_gallery").split(",").map((imageId) => makeImageUrl(attachment, meta, imageId))].filter(Boolean);
    const variants = variationPosts.map((variation) => {
      const variationId = String(variation.ID), variationMeta = meta.get(variationId) || new Map();
      const options = [...variationMeta.entries()].filter(([key]) => key.startsWith("attribute_")).map(([key, values]) => {
        const taxonomy = key.replace(/^attribute_/, ""), slug = String(values[0] || "");
        const term = termForTaxonomy(taxonomy, slug);
        const attribute = attributes.find((item) => item.taxonomy === taxonomy);
        return { name: attribute?.name || taxonomy.replace(/^pa_/, ""), value: term?.name || slug };
      }).filter((option) => option.value);
      const price = numberOrUndefined(metaValue(meta, variationId, "_price")) || numberOrUndefined(metaValue(meta, variationId, "_regular_price"));
      const regular = numberOrUndefined(metaValue(meta, variationId, "_regular_price"));
      return { id: variationId, sku: metaValue(meta, variationId, "_sku") || undefined, options, price, compareAtPrice: regular && price && regular > price ? regular : undefined, stockQty: metaValue(meta, variationId, "_stock_status") === "outofstock" ? 0 : 1, image: makeImageUrl(attachment, meta, metaValue(meta, variationId, "_thumbnail_id")) || undefined, enabled: variation.post_status === "publish" && metaValue(meta, variationId, "_stock_status") !== "outofstock" };
    });
    const productPrice = numberOrUndefined(metaValue(meta, id, "_price")) || numberOrUndefined(lookup.get(id)?.min_price) || Math.min(...variants.map((item) => item.price || Infinity));
    const regularPrice = numberOrUndefined(metaValue(meta, id, "_regular_price"));
    const matchingBlockSpecs = detailBlocks.flatMap((block) => tableSpecs(block.post_content));
    const specs = [
      ...tableSpecs(post.post_content),
      ...matchingBlockSpecs,
      ...[["طول", "_length"], ["عرض", "_width"], ["ارتفاع", "_height"], ["وزن", "_weight"]].map(([label, key]) => ({ label, value: metaValue(meta, id, key) })).filter((item) => item.value),
    ];
    const productDescription = cleanText(post.post_content);
    const detailsDescription = detailBlocks.find((block) => /توضیحات|description/i.test(block.post_title))?.post_content || "";
    const descriptionBlock = contentBlockFromShortcode(metaValue(meta, id, "desc_short_code"));
    const accordionBlock = contentBlockFromShortcode(metaValue(meta, id, "accordion_short_code"));
    if (descriptionBlock) specs.push(...tableSpecs(descriptionBlock.post_content), ...listSpecs(descriptionBlock.post_content));
    if (accordionBlock) specs.push(...tableSpecs(accordionBlock.post_content));
    return {
      id: Number(id), slug: decodeSlug(post.post_name || `product-${id}`), name: post.post_title, category: isBeddingProduct ? "کالای خواب" : category?.name || "محصول", room,
      status: productStatus(post.post_status), shortDescription: cleanText(post.post_excerpt) || productDescription.slice(0, 220) || cleanText(descriptionBlock?.post_content || detailsDescription).slice(0, 220), longDescription: productDescription || cleanText(descriptionBlock?.post_content || detailsDescription), specs: [...new Map(specs.map((item) => [`${item.label}:${item.value}`, item])).values()],
      image: gallery[0] || variants.find((item) => item.image)?.image || "", gallery: [...new Set(gallery)], categories: categoryTerms.map((term) => ({ id: Number(term.term_id), name: term.name, slug: term.slug })), attributes,
      prices: Number.isFinite(productPrice) ? { value: String(productPrice), regularValue: regularPrice ? String(regularPrice) : null, saleValue: null, minValue: String(productPrice), maxValue: String(numberOrUndefined(lookup.get(id)?.max_price) || productPrice), currencyCode: "IRT", currencySymbol: "تومان", minorUnit: 0 } : null,
      averageRating: metaValue(meta, id, "_wc_average_rating") || "0", reviewCount: Number(metaValue(meta, id, "_wc_review_count")) || 0,
      isPurchasable: metaValue(meta, id, "_stock_status") !== "outofstock", isInStock: variants.length ? variants.some((item) => item.enabled) : metaValue(meta, id, "_stock_status") !== "outofstock", hasOptions: attributes.some((item) => item.hasVariations), shopUrl: post.guid || "", variants, sortOrder: Number(post.menu_order) || index,
    };
  }).filter((item) => item.name && item.image);

  await writeFile(remoteOutput, `${JSON.stringify(remoteCatalog, null, 2)}\n`);
  let catalog = remoteCatalog;
  if (manifestPath) {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
    const local = (url) => manifest.images?.[url] || url;
    catalog = remoteCatalog.map((product) => ({ ...product, image: local(product.image), gallery: product.gallery.map(local), variants: product.variants.map((variant) => ({ ...variant, image: variant.image ? local(variant.image) : undefined })) }));
    const serialized = `${JSON.stringify(catalog, null, 2)}\n`;
    await Promise.all(catalogOutputs.map((file) => writeFile(file, serialized)));
  }
  const variants = remoteCatalog.reduce((sum, product) => sum + product.variants.length, 0);
  const images = new Set(remoteCatalog.flatMap((product) => [product.image, ...product.gallery, ...product.variants.map((variant) => variant.image)]).filter(Boolean));
  console.log(`Parsed ${inserts} SQL rows (${terms.size} terms, ${taxonomies.size} taxonomies, ${relations.size} term relationships). Wrote ${remoteCatalog.length} products, ${variants} variations, and ${images.size} unique remote images to ${path.relative(root, remoteOutput)}.`);
  if (!manifestPath) console.log("Next: node scripts/download-wordpress-product-images.mjs && node scripts/build-wordpress-shop-catalog.mjs --media-manifest backend/uploads/products/wordpress-manifest.json");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
