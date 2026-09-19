import assert from "node:assert/strict";
import test from "node:test";
import type { GalleryItem } from "../data/gallery";
import type { GalleryTasteAnswers } from "../data/gallery-taste";
import { MAX_PRODUCT_INSERTS, allowedProductRooms, isTasteState, mixGalleryFeed, parseTasteAnswers } from "./gallery-taste";

const answers: GalleryTasteAnswers = {
  space: "home",
  material: "fabric",
  atmosphere: "layered",
  object: "furniture",
};

function item(partial: Partial<GalleryItem> & Pick<GalleryItem, "id" | "tag">): GalleryItem {
  return {
    src: "/x.jpg",
    alt: partial.id,
    caption: partial.caption || partial.id,
    bento: "square",
    ...partial,
  };
}

test("furniture-only drops accessory product rooms", () => {
  const rooms = allowedProductRooms(answers);
  assert.equal(Array.isArray(rooms) && rooms.includes("living"), true);
  assert.equal(Array.isArray(rooms) && rooms.includes("decor"), false);
});

test("mix interleaves scored products and caps inserts", () => {
  const editorial = [
    item({ id: "e1", tag: "project", caption: "نشیمن آکنون خانگی" }),
    item({ id: "e2", tag: "collection", caption: "کالکشن سولو" }),
    item({ id: "e3", tag: "behind-scenes", caption: "جزئیات کارگاه" }),
    item({ id: "e4", tag: "event", caption: "رویداد شوروم" }),
  ];
  const products = [
    item({ id: "p-living", tag: "product", productCategory: "living", caption: "مبل نشیمن" }),
    item({ id: "p-decor", tag: "product", productCategory: "decor", caption: "ساعت" }),
    item({ id: "p-light", tag: "product", productCategory: "lighting", caption: "آباژور" }),
    ...Array.from({ length: 12 }, (_, index) =>
      item({ id: `p-bed-${index}`, tag: "product", productCategory: "bedroom", caption: "تخت" }),
    ),
  ];
  const mixed = mixGalleryFeed(editorial, products, answers);
  const shopIds = mixed.filter((entry) => entry.tag === "product").map((entry) => entry.id);
  assert.ok(shopIds.includes("p-living"));
  assert.equal(shopIds.includes("p-decor"), false);
  assert.equal(shopIds.includes("p-light"), false);
  assert.ok(shopIds.length <= MAX_PRODUCT_INSERTS);
  assert.ok(mixed[0].tag !== "product");
});

test("lighting object prefers lighting products before other rooms", () => {
  const editorial = [
    item({ id: "e1", tag: "project", caption: "ویلای شناژ شمال" }),
    item({ id: "e2", tag: "project", caption: "نشیمن خانگی" }),
  ];
  const products = [
    item({ id: "p-sofa", tag: "product", productCategory: "living", caption: "کاناپه" }),
    item({ id: "p-lamp-a", tag: "product", productCategory: "lighting", caption: "آباژور گالن" }),
    item({ id: "p-lamp-b", tag: "product", productCategory: "lighting", caption: "آباژور فیری" }),
  ];
  const mixed = mixGalleryFeed(editorial, products, {
    space: "villa",
    material: "dark-wood",
    atmosphere: "nature",
    object: "lighting",
  });
  const shopIds = mixed.filter((entry) => entry.tag === "product").map((entry) => entry.id);
  assert.deepEqual(shopIds.slice(0, 2), ["p-lamp-a", "p-lamp-b"]);
});

test("parseTasteAnswers rejects unknown options", () => {
  assert.deepEqual(parseTasteAnswers(answers), answers);
  assert.equal(parseTasteAnswers({ ...answers, space: "office" }), null);
  assert.equal(parseTasteAnswers(null), null);
});

test("taste state accepts skip and complete only", () => {
  assert.equal(isTasteState({ status: "skipped" }), true);
  assert.equal(isTasteState({ status: "complete", answers }), true);
  assert.equal(isTasteState({ status: "complete" }), false);
});
