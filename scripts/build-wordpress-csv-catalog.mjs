/**
 * Builds the safe, reviewable WordPress product seed from the WooCommerce CSV.
 *
 * The export contains 157 simple products, 281 variable parent products and
 * 528 variations. All 966 CSV rows are retained: parent rows become products
 * and variation rows become selectable variants of their matching parent.
 *
 * Run: node scripts/build-wordpress-csv-catalog.mjs
 */
import { createRequire } from "node:module";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const requireFromBackend = createRequire(join(root, "backend/package.json"));
const XLSX = requireFromBackend("xlsx");

const inputPath = join(
  root,
  "wordpress-files/wc-product-export-15-9-2026-1789498910475.csv",
);
const outputDir = join(root, "backend/src/modules/shop/data");
const catalogPath = join(outputDir, "wordpress-csv-catalog.json");
const categoryTreePath = join(outputDir, "wordpress-category-tree.json");

const ROOM_BY_ROOT = {
  "نشیمن": "living",
  "اتاق خواب": "bedroom",
  "کالای خواب": "bedding",
  "غذاخوری": "dining",
  "روشنایی": "lighting",
  "دکور": "decor",
  "اکسسوری": "decor",
  "ظروف": "dishes",
  "فرش": "carpet",
  "گلیم": "carpet",
};

function text(value) {
  return String(value ?? "").trim();
}

function asciiDigits(value) {
  return text(value)
    .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit));
}

function number(value) {
  const parsed = Number(asciiDigits(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function slugify(value) {
  return text(value)
    .toLowerCase()
    .replace(/[آأإ]/g, "ا")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "") || "product";
}

function uniqueStrings(values) {
  return [...new Set(values.map(text).filter(Boolean))];
}

function splitList(value) {
  return uniqueStrings(text(value).split(","));
}

function parseCategoryPaths(value) {
  return splitList(value)
    .map((path) => path.split(">").map(text).filter(Boolean))
    .filter((path) => path.length);
}

function primaryCategory(value) {
  const paths = parseCategoryPaths(value);
  const path = paths
    .filter((candidate) => candidate[0] in ROOM_BY_ROOT)
    .sort((a, b) => b.length - a.length)[0] || paths[0] || ["محصول جدید"];
  const rootCategory = path[0];

  // "فرش و گلیم" is intentionally a single category in the new system.
  // Legacy children such as دستبافت / ماشینی / گلیم are not imported.
  if (rootCategory === "فرش" || rootCategory === "گلیم") {
    return { category: "فرش و گلیم", room: "carpet", path: ["فرش و گلیم"] };
  }

  return {
    category: path.at(-1) || rootCategory,
    room: ROOM_BY_ROOT[rootCategory] || "decor",
    path,
  };
}

function attributesFrom(row) {
  const attributes = [];
  for (let index = 1; index <= 8; index += 1) {
    const name = text(row[`نام ${index} صفت`]);
    const values = splitList(row[`مقدار(های) ${index} صفت`]);
    if (!name || !values.length) continue;
    attributes.push({
      name,
      terms: values.map((value) => ({ name: value, slug: slugify(value) })),
      hasVariations: false,
    });
  }
  return attributes;
}

function variantFrom(row) {
  const salePrice = number(row["قیمت فروش ویژه"]);
  const regularPrice = number(row["قیمت عادی"]);
  const options = [];
  for (let index = 1; index <= 8; index += 1) {
    const name = text(row[`نام ${index} صفت`]);
    const value = text(row[`مقدار(های) ${index} صفت`]);
    if (name && value) options.push({ name, value });
  }
  const images = splitList(row["تصاویر"]);
  return {
    sku: asciiDigits(row["شناسه محصول"]) || undefined,
    options,
    price: salePrice ?? regularPrice,
    compareAtPrice: salePrice && regularPrice && salePrice < regularPrice ? regularPrice : undefined,
    stockQty: number(row["انبار"]) ?? 0,
    image: images[0] || undefined,
    enabled: text(row["منتشر شده"]) === "1",
    sourceRow: row.__row,
  };
}

function variationBaseName(value) {
  return text(value)
    .toLowerCase()
    .replace(/[آأإ]/g, "ا")
    .replace(/[يى]/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/\s*-\s*.*$/u, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matchVariationParent(variation, variableParents) {
  const baseName = variationBaseName(variation["نام"]);
  const matches = variableParents.filter((parent) => {
    const parentName = variationBaseName(parent["نام"]);
    return baseName.includes(parentName) || parentName.includes(baseName);
  });
  if (!matches.length) return undefined;
  return matches.sort((a, b) => {
    const aName = variationBaseName(a["نام"]);
    const bName = variationBaseName(b["نام"]);
    return Number(bName === baseName) - Number(aName === baseName) || bName.length - aName.length;
  })[0];
}

function makeCatalog(rows) {
  const slugs = new Map();
  const variableParents = rows.filter((row) => text(row["نوع"]) === "variable");
  const variationParents = new Map();
  for (const row of rows.filter((item) => text(item["نوع"]) === "variation")) {
    const parent = matchVariationParent(row, variableParents);
    if (parent) variationParents.set(row.__row, parent);
  }

  const allocateSlug = (name, externalCode, fallback) => {
    const baseSlug = slugify(name);
    const duplicate = slugs.get(baseSlug) || 0;
    slugs.set(baseSlug, duplicate + 1);
    return duplicate ? `${baseSlug}-${externalCode || fallback || duplicate + 1}` : baseSlug;
  };

  const parentProducts = rows
    .filter((row) => ["simple", "variable"].includes(text(row["نوع"])))
    .map((row, sortOrder) => {
      const name = text(row["نام"]);
      const externalCode = asciiDigits(row["شناسه محصول"]);
      const slug = allocateSlug(name, externalCode, row.__row);
      const gallery = splitList(row["تصاویر"]);
      const category = primaryCategory(row["دسته‌ها"]);
      const salePrice = number(row["قیمت فروش ویژه"]);
      const regularPrice = number(row["قیمت عادی"]);
      const stockQty = number(row["انبار"]);

      return {
        externalCode: externalCode || undefined,
        slug,
        name,
        category: category.category,
        room: category.room,
        categoryPath: category.path,
        status: text(row["منتشر شده"]) === "1" ? "published" : "draft",
        sourceType: text(row["نوع"]),
        sourceRow: row.__row,
        shortDescription: text(row["توضیح کوتاه"]),
        longDescription: text(row["توضیحات"]),
        image: gallery[0] || "",
        gallery,
        attributes: attributesFrom(row),
        prices: {
          value: salePrice ?? regularPrice ?? null,
          regularValue: salePrice && regularPrice && salePrice < regularPrice ? regularPrice : null,
        },
        stockQty: stockQty ?? 0,
        trackInventory: Boolean(text(row["انبار"])),
        inStock: text(row["در انبار؟"]) === "1",
        variants: [],
        sortOrder,
        source: "wordpress-csv-2026-09-15",
      };
    });

  const parentProductsBySourceRow = new Map(parentProducts.map((product) => [product.sourceRow, product]));
  const variationProducts = rows
    .filter((row) => text(row["نوع"]) === "variation")
    .map((row, index) => {
    const variant = variantFrom(row);
    const parent = parentProductsBySourceRow.get(variationParents.get(row.__row)?.__row);
    const fallbackCategory = {
      category: "محصولات بدون والد وردپرس",
      room: "decor",
      path: ["محصولات بدون والد وردپرس"],
    };
    const inherited = parent || fallbackCategory;
    return {
      externalCode: variant.sku,
      slug: allocateSlug(row["نام"], variant.sku, row.__row),
      name: text(row["نام"]),
      category: inherited.category,
      room: inherited.room,
      categoryPath: inherited.categoryPath || inherited.path,
      status: text(row["منتشر شده"]) === "1" ? "published" : "draft",
      sourceType: parent ? "variation" : "orphaned-variation",
      sourceRow: row.__row,
      shortDescription: parent?.shortDescription || "",
      longDescription: parent?.longDescription || "",
      image: variant.image || parent?.image || "",
      gallery: variant.image ? [variant.image, ...(parent?.gallery || []).filter((image) => image !== variant.image)] : parent?.gallery || [],
      attributes: variant.options.map((option) => ({ name: option.name, terms: [{ name: option.value, slug: slugify(option.value) }], hasVariations: true })),
      prices: { value: variant.price ?? null, regularValue: variant.compareAtPrice ?? null },
      stockQty: variant.stockQty,
      trackInventory: true,
      inStock: variant.enabled,
      variants: [],
      sortOrder: parentProducts.length + index,
      source: "wordpress-csv-2026-09-15",
    };
  });

  return [...parentProducts, ...variationProducts];
}

function addTreePath(root, path) {
  let node = root;
  for (const name of path) {
    let child = node.children.find((candidate) => candidate.name === name);
    if (!child) {
      child = { name, slug: slugify(name), productCount: 0, children: [] };
      node.children.push(child);
    }
    child.productCount += 1;
    node = child;
  }
}

function makeCategoryTree(catalog) {
  const tree = { name: "دسته‌بندی محصولات", children: [] };
  for (const product of catalog) addTreePath(tree, product.categoryPath);
  const sortTree = (node) => {
    node.children.sort((a, b) => a.name.localeCompare(b.name, "fa"));
    node.children.forEach(sortTree);
  };
  sortTree(tree);
  return {
    source: "wc-product-export-15-9-2026-1789498910475.csv",
    generatedAt: new Date().toISOString(),
    productScope: {
      catalogProducts: catalog.length,
      standaloneVariations: catalog.filter((product) => product.sourceType === "variation").length,
    },
    normalization: {
      carpetAndRug: "همه مسیرهای فرش و گلیم به دستهٔ واحد «فرش و گلیم» تبدیل شده‌اند و زیر‌دسته ندارند.",
    },
    categories: tree.children,
  };
}

const workbook = XLSX.readFile(inputPath, { raw: true });
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" }).map((row, index) => ({ ...row, __row: index + 2 }));
const catalog = makeCatalog(rows);
const categoryTree = makeCategoryTree(catalog);

mkdirSync(outputDir, { recursive: true });
writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`);
writeFileSync(categoryTreePath, `${JSON.stringify(categoryTree, null, 2)}\n`);

const counts = catalog.reduce((result, item) => {
  result[item.status] = (result[item.status] || 0) + 1;
  return result;
}, {});
console.log(`Created ${catalog.length} standalone products (${catalog.length} of ${rows.length} CSV rows): ${JSON.stringify(counts)}`);
console.log(`Wrote ${catalogPath}`);
console.log(`Wrote ${categoryTreePath}`);
