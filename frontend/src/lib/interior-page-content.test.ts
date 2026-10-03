import assert from "node:assert/strict";
import test from "node:test";
import { readInteriorPageContent } from "./interior-page-content";

const seeded = {
  data: {
    items: {
      hero: { image: "/images/projects/aknoon-residence/04.jpg", title: "تیتر ذخیره‌شده" },
      styles: [
        { id: "luxury", label: "لوکس جابه‌جا", description: "جزئیات", image: "/uploads/luxury.png" },
        { id: "minimal", label: "مینیمال ذخیره‌شده", description: "ساده", image: "https://choobohonar.com/uploads/minimal.jpg" },
      ],
      customizationPieces: [
        { id: "custom-bedroom", image: "/uploads/bed.webp", href: "/projects/custom-bed", title: "تخت", eyebrow: "خواب", description: "شرح" },
      ],
      moodboardImages: [
        { id: "mb-02", src: "/uploads/mood.jpg", alt: "جزئیات", tags: "minimal, modern" },
      ],
    },
  },
};

test("reads the seeded items object and keeps uploaded image paths", () => {
  const content = readInteriorPageContent(seeded);
  assert.equal(content.hero.title, "تیتر ذخیره‌شده");
  assert.equal(content.hero.image, "/images/projects/aknoon-residence/04.jpg");
  assert.equal(content.hero.primaryCtaLabel, "شروع فرم سفارش طراحی");
  const minimal = content.styles.find((style) => style.id === "minimal");
  const luxury = content.styles.find((style) => style.id === "luxury");
  assert.equal(minimal?.label, "مینیمال ذخیره‌شده");
  assert.equal(minimal?.image, "/uploads/minimal.jpg");
  assert.equal(luxury?.image, "/uploads/luxury.png");
  assert.equal(content.customizationPieces.find((piece) => piece.id === "custom-bedroom")?.image, "/uploads/bed.webp");
  assert.equal(content.customizationPieces.find((piece) => piece.id === "custom-bedroom")?.href, "/projects/custom-bed");
  assert.equal(content.customizationPieces.find((piece) => piece.id === "custom-living")?.href, "/projects/aknoon-residence");
  const mood = content.moodboardImages.find((image) => image.id === "mb-02");
  assert.equal(mood?.src, "/uploads/mood.jpg");
  assert.deepEqual(mood?.tags, ["minimal", "modern"]);
  assert.equal(content.styles.length, 6);
  assert.equal(content.moodboardImages.length, 12);
});

test("flattened public page payload uses items", () => {
  const content = readInteriorPageContent({ items: seeded.data.items, slug: "interior" });
  assert.equal(content.hero.title, "تیتر ذخیره‌شده");
  assert.equal(content.styles.find((style) => style.id === "minimal")?.image, "/uploads/minimal.jpg");
});
