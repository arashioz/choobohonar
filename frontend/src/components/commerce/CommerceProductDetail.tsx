"use client";

import { useEffect, useLayoutEffect, useMemo, useState, type CSSProperties, type Dispatch, type SetStateAction } from "react";
import { scrollToTop } from "@/lib/lenis-control";
import Image from "next/image";
import Link from "next/link";
import ProductRichDescription from "@/components/products/ProductRichDescription";
import type { ShopProduct } from "@/data/products";
import { formatSelectedCatalogPrice, getCollectionName, getCraftAttributes, getHighestPricedVariant, getProductAttributeOptions, headboardMaterialLabel, isHeadboardMaterialAttribute, isOptionCompatibleWithSelection, purchaseAttributeLabel, selectionForAttributeOption, selectionFromVariant, variantMatchingSelection, type PurchaseAttribute } from "@/lib/commerce";
import { isUploadedMedia } from "@/lib/media";
import { getProductDeliveryLeadTime } from "@/lib/product-delivery";
import { cn, toFa } from "@/lib/utils";
import { useCart, type CartOption } from "@/components/commerce/cart/CartProvider";
import type { MaterialSwatch } from "@/lib/storefront-products";

const roomCategoryPaths = {
  living: "livingroom",
  bedroom: "bedroom",
  bedding: "bedding",
  dining: "diningroom",
  decor: "decor",
  carpet: "carpet",
  lighting: "lighting",
  dishes: "decor",
} as const;

function isWoodDisplay(attribute: { label: string; role: string; ui: string }) {
  return attribute.role === "display" && (attribute.ui === "swatch" || /چوب|متریال|پرداخت|فینیش|رویه|wood|material|finish/i.test(attribute.label));
}

function isFabricDisplay(attribute: { label: string; role: string }) {
  return attribute.role === "display" && /پارچه|fabric|کوسن|cushion/i.test(attribute.label);
}

function normalizeSwatchKey(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[آأإ]/g, "ا")
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/روکش|سند\s*بلاست|کد/g, "")
    .replace(/[\s‌ـ\-_/]+/g, "");
}

/** Studio material photos sit on a large white field; zoom the sample into the 36px circle. */
function materialSwatchFill(image: string): CSSProperties {
  return {
    backgroundImage: `url(${image})`,
    backgroundSize: "250%",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

function swatchButtonClass(active: boolean) {
  return cn(
    "relative box-border size-9 shrink-0 overflow-hidden rounded-full border p-0 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest",
    active ? "border-2 border-forest ring-2 ring-inset ring-forest/20" : "border-forest/15 hover:border-forest/45",
  );
}

function matchSwatch(swatches: MaterialSwatch[], value: string) {
  const normalized = normalizeSwatchKey(value);
  if (!normalized) return undefined;
  return swatches.find((item) => {
    const keys = [item.slug, item.name, item.color, item.code, ...(item.aliases || [])];
    return keys.some((key) => key && (key === value || normalizeSwatchKey(key) === normalized));
  });
}

export default function CommerceProductDetail({
  product,
  materials = [],
}: {
  product: ShopProduct;
  materials?: MaterialSwatch[];
}) {
  const { addProduct, addItem } = useCart();
  const gallery = product.gallery.length ? product.gallery : [product.image];
  const [activeImage, setActiveImage] = useState(gallery[0]);
  const attributes = useMemo(() => getProductAttributeOptions(product), [product]);
  const craftAttributes = useMemo(() => getCraftAttributes(product), [product]);
  const swatches = useMemo(() => materials.filter((item) => item.sample !== false), [materials]);
  const assignedSwatches = useMemo(() => {
    const fromProduct = (product.finishes || [])
      .map((slug) => matchSwatch(swatches, slug) || { slug, name: slug, family: "wood", color: slug, hex: "", image: "", excerpt: "", href: `/materials/wood/${slug}` })
      .filter((item, index, list) => list.findIndex((entry) => entry.slug === item.slug) === index);
    if (fromProduct.length) return fromProduct;
    const materialOptions = attributes.find(isWoodDisplay)?.options || [];
    return materialOptions
      .map((option) => {
        const matched = matchSwatch(swatches, option.label) || matchSwatch(swatches, option.id);
        if (matched) return matched;
        return {
          slug: option.id || option.label,
          name: option.label,
          family: "wood",
          color: option.label,
          hex: "",
          image: "",
          excerpt: "",
          href: "",
        };
      })
      .filter((item, index, list) => list.findIndex((entry) => entry.slug === item.slug || entry.name === item.name) === index);
  }, [attributes, product.finishes, swatches]);
  const materialAttribute = attributes.find(isWoodDisplay);
  const headboardMaterialAttribute = attributes.find((attribute) => isHeadboardMaterialAttribute(attribute.label) || attribute.role === "linked");
  const selectableAttributes = attributes.filter((attribute) => attribute.role === "purchase");
  const displayAttributes = attributes.filter(
    (attribute) => attribute.role === "display" && !isWoodDisplay(attribute) && !isFabricDisplay(attribute),
  );
  const fabricAttributes = attributes.filter(isFabricDisplay);
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    selectionFromVariant(attributes, getHighestPricedVariant(product)),
  );
  const selectedHeadboardMaterial = headboardMaterialAttribute?.options.find((option) => option.id === selected[headboardMaterialAttribute.id]);
  const visibleSwatches = assignedSwatches;
  const initialMaterial = assignedSwatches[0]?.slug
    || matchSwatch(swatches, materialAttribute?.options.find((option) => option.default)?.label || materialAttribute?.options[0]?.label || "")?.slug
    || visibleSwatches[0]?.slug
    || "";
  const [selectedMaterial, setSelectedMaterial] = useState(initialMaterial);
  const [added, setAdded] = useState(false);
  const collection = getCollectionName(product);
  const selectedVariant = useMemo(
    () => variantMatchingSelection(product, attributes, selected),
    [attributes, product, selected],
  );
  const mappedMaterialImage = useMemo(() => {
    for (const mapping of product.materialImageMappings || []) {
      const attribute = attributes.find((item) => item.label.trim() === mapping.attribute.trim());
      const selectedOption = attribute?.options.find((item) => item.id === selected[attribute.id]);
      if (selectedOption?.label.trim() === mapping.value.trim() && mapping.image) return mapping.image;
    }
    return "";
  }, [attributes, product.materialImageMappings, selected]);
  const priceValue = Number(selectedVariant?.price ?? product.prices?.value ?? 0);
  const canAddToCart =
    product.isInStock &&
    product.isPurchasable &&
    Number.isFinite(priceValue) &&
    priceValue > 0 &&
    (!product.variants?.length || Boolean(selectedVariant && (selectedVariant.stockQty > 0 || product.isInStock)));

  useLayoutEffect(() => {
    scrollToTop();
  }, [product.slug]);

  useEffect(() => {
    if (selectedVariant?.image) setActiveImage(selectedVariant.image);
  }, [selectedVariant?.image]);

  useEffect(() => {
    if (mappedMaterialImage) setActiveImage(mappedMaterialImage);
  }, [mappedMaterialImage]);

  const selectMaterial = (slug: string) => {
    const next = visibleSwatches.find((item) => item.slug === slug);
    if (!next) return;
    setSelectedMaterial(next.slug);
    setAdded(false);
    if (materialAttribute) {
      const option = materialAttribute.options.find(
        (entry) =>
          matchSwatch([next], entry.label) || matchSwatch([next], entry.id),
      );
      if (option)
        setSelected((current) => ({ ...current, [materialAttribute.id]: option.id }));
    }
  };

  const handleAddToCart = () => {
    const options: CartOption[] = [...selectableAttributes, ...displayAttributes]
      .map((attribute) => {
        const option = attribute.options.find((item) => item.id === selected[attribute.id]);
        return option
          ? { id: attribute.id, label: attribute.label, valueId: option.id, value: option.label }
          : null;
      })
      .filter((option): option is CartOption => Boolean(option));
    const material = visibleSwatches.find((item) => item.slug === selectedMaterial);
    if (selectedHeadboardMaterial) {
      options.push({
        id: headboardMaterialAttribute?.id || "headboard-material",
        label: headboardMaterialLabel(selectedHeadboardMaterial.label),
        valueId: selectedHeadboardMaterial.id,
        value: selectedHeadboardMaterial.label,
      });
    } else if (material) {
      options.push({ id: materialAttribute?.id || "material", label: materialAttribute?.label || "متریال", valueId: material.slug, value: material.name });
    }
    if (selectedVariant?.price) {
      addItem({ productId: product.id, slug: product.slug, name: product.name, category: product.category, image: product.image, unitPrice: selectedVariant.price, currencySymbol: product.prices?.currencySymbol || "تومان", options: [...options, { id: "variant", label: "ترکیب", valueId: selectedVariant.id, value: selectedVariant.options.map((option) => option.value).join(" / ") }] });
    } else addProduct(product, options);
    setAdded(true);
  };

  return (
    <>
      <section className="bg-paper pb-24 pt-28 md:pb-32 md:pt-36">
        <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-16">
          <nav className="mb-8 flex flex-wrap items-center gap-2 text-xs text-forest/50">
            <Link href="/" className="hover:text-forest">خانه</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-forest">محصولات</Link>
            <span>/</span>
            <Link href={`/products/category/${roomCategoryPaths[product.room]}`} className="hover:text-forest">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-forest">{product.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)] lg:gap-16 xl:gap-24">
            <div className="min-w-0">
              <div className="relative aspect-[4/5] overflow-hidden bg-forest/[0.04] md:aspect-[5/6]">
                {activeImage ? (
                  <Image
                    key={activeImage}
                    src={activeImage}
                    alt={product.name}
                    fill
                    priority
                    unoptimized={isUploadedMedia(activeImage)}
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover animate-[commerce-image-in_600ms_cubic-bezier(0.16,1,0.3,1)]"
                  />
                ) : null}
                <div className="absolute right-5 top-5 flex flex-col gap-2">
                  {!product.isInStock ? (
                    <span className="rounded-full bg-paper/90 px-4 py-2 text-xs font-medium text-brick backdrop-blur-md">
                      ناموجود
                    </span>
                  ) : null}
                  {collection ? (
                    <span className="rounded-full bg-forest/85 px-4 py-2 text-xs font-medium text-paper backdrop-blur-md">
                      کالکشن {collection}
                    </span>
                  ) : null}
                </div>
                <a href={activeImage} target="_blank" rel="noopener noreferrer" className="absolute bottom-5 left-5 flex h-12 w-12 items-center justify-center rounded-full bg-paper/90 text-forest backdrop-blur-md" aria-label="بازکردن تصویر اصلی محصول">
                  ↗
                </a>
              </div>

              {gallery.length > 1 ? (
                <div className="no-scrollbar mt-3 flex gap-3 overflow-x-auto">
                  {gallery.map((src, index) => (
                    <button
                      key={`${src}-${index}`}
                      type="button"
                      onClick={() => setActiveImage(src)}
                      className={cn(
                        "relative aspect-square w-24 shrink-0 overflow-hidden border transition-colors md:w-28",
                        activeImage === src ? "border-forest" : "border-transparent opacity-65 hover:opacity-100",
                      )}
                    >
                      <Image src={src} alt={`${product.name}، تصویر ${toFa(index + 1)}`} fill unoptimized={isUploadedMedia(src)} sizes="112px" className="object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="lg:sticky lg:top-28 lg:self-start">
              <h1 className="text-[clamp(3rem,6vw,6rem)] font-extralight leading-[0.88] tracking-tightest text-forest">
                {product.name}
              </h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-forest/60">{product.shortDescription}</p>

              <div className="mt-8 flex items-end justify-between gap-6 border-y border-forest/10 py-6">
                <div>
                  <p className="text-xs text-forest/45">قیمت</p>
                  <p className="mt-2 text-2xl font-light text-forest">{formatSelectedCatalogPrice(product, selectedVariant)}</p>
                </div>
                {product.reviewCount > 0 ? (
                  <div className="text-left">
                    <p className="text-sm text-brick">★★★★★</p>
                    <p className="mt-1 text-xs text-forest/45">{toFa(product.reviewCount)} نظر</p>
                  </div>
                ) : null}
              </div>

              <div className="mt-7 space-y-7">
                {selectableAttributes.map((attribute) => (
                  <AttributePills
                    key={attribute.id}
                    product={product}
                    attributes={attributes}
                    attribute={attribute}
                    selected={selected}
                    setSelected={setSelected}
                    setAdded={setAdded}
                  />
                ))}
                {fabricAttributes.map((attribute) => {
                  const label = purchaseAttributeLabel(attribute.label, attribute.options.map((option) => option.label));
                  return (
                    <fieldset key={attribute.id}>
                      <legend className="text-sm font-medium text-forest">{label}</legend>
                      <div className="mt-3 flex flex-wrap items-center gap-2.5">
                        {attribute.options.map((option) => {
                          const swatch = matchSwatch(swatches, option.label);
                          const active = selected[attribute.id] === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => { setSelected((current) => ({ ...current, [attribute.id]: option.id })); setAdded(false); }}
                              title={option.label}
                              aria-label={`انتخاب ${label} ${option.label}`}
                              aria-pressed={active}
                              className={swatchButtonClass(active)}
                            >
                              {swatch?.image ? <span className="absolute inset-0" style={materialSwatchFill(swatch.image)} /> : <span className="absolute inset-0" style={{ backgroundColor: swatch?.hex || "#c9b8a3" }} />}
                              <span className="sr-only">{option.label}</span>
                            </button>
                          );
                        })}
                        <span className="mr-1 text-xs text-forest/70">{attribute.options.find((item) => item.id === selected[attribute.id])?.label}</span>
                      </div>
                    </fieldset>
                  );
                })}
                {displayAttributes.map((attribute) => {
                  const optionLabels = attribute.options.map((option) => option.label);
                  const label = purchaseAttributeLabel(attribute.label, optionLabels);
                  const selectedOption = attribute.options.find((option) => option.id === selected[attribute.id]);
                  if (attribute.ui === "readonly" || attribute.options.length === 1) {
                    return (
                      <fieldset key={attribute.id}>
                        <legend className="text-sm font-medium text-forest">{label}</legend>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-forest">{selectedOption?.label || attribute.options[0]?.label}</span>
                        </div>
                      </fieldset>
                    );
                  }
                  return (
                    <AttributePills
                      key={attribute.id}
                      product={product}
                      attributes={attributes}
                      attribute={attribute}
                      selected={selected}
                      setSelected={setSelected}
                      setAdded={setAdded}
                    />
                  );
                })}
                {selectedHeadboardMaterial ? (
                  <fieldset>
                    <legend className="text-sm font-medium text-forest">{headboardMaterialLabel(selectedHeadboardMaterial.label)}</legend>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="h-4 w-4 shrink-0 rounded-full border border-forest/30 bg-transparent" aria-hidden />
                      <span className="text-xs text-forest">{selectedHeadboardMaterial.label}</span>
                    </div>
                  </fieldset>
                ) : visibleSwatches.length ? (
                  <fieldset>
                    <legend className="text-sm font-medium text-forest">{materialAttribute?.label || "متریال"}</legend>
                    <div className="mt-3 flex flex-wrap items-center gap-2.5">
                      {visibleSwatches.map((item) => {
                        const isSelected = item.slug === selectedMaterial;
                        return (
                          <button
                            key={item.slug}
                            type="button"
                            onClick={() => selectMaterial(item.slug)}
                            title={item.name}
                            aria-label={`انتخاب متریال ${item.name}`}
                            aria-pressed={isSelected}
                            className={swatchButtonClass(isSelected)}
                          >
                            {item.image ? (
                              <span className="absolute inset-0" style={materialSwatchFill(item.image)} />
                            ) : (
                              <span className="absolute inset-0" style={{ backgroundColor: item.hex || "#c9b8a3" }} />
                            )}
                            <span className="sr-only">{item.name}</span>
                          </button>
                        );
                      })}
                      {(() => {
                        const selectedSwatch = visibleSwatches.find((item) => item.slug === selectedMaterial);
                        if (!selectedSwatch) return null;
                        return selectedSwatch.href ? (
                          <Link href={selectedSwatch.href} className="mr-1 text-xs text-brick underline-offset-4 hover:underline">
                            {selectedSwatch.name}
                          </Link>
                        ) : (
                          <span className="mr-1 text-xs text-forest/70">{selectedSwatch.name}</span>
                        );
                      })()}
                    </div>
                  </fieldset>
                ) : null}
              </div>

              <div className="mt-9 grid gap-3 sm:grid-cols-[1fr_auto] lg:grid-cols-1 xl:grid-cols-[1fr_auto]">
                {canAddToCart ? (
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-forest px-7 text-sm font-medium text-paper transition-all duration-300 hover:bg-brick active:scale-[0.985]"
                  >
                    {added ? "افزودن یک عدد دیگر" : "افزودن به سبد خرید"}
                    <span className="text-lg">+</span>
                  </button>
                ) : (
                  <Link
                    href="/contact/consultation"
                    className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-forest px-7 text-sm font-medium text-paper transition-colors hover:bg-brick"
                  >
                    استعلام و ثبت سفارش <span>←</span>
                  </Link>
                )}
                <Link
                  href="/contact/consultation"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-forest/20 px-6 text-sm text-forest transition-colors hover:border-forest"
                >
                  مشاوره
                </Link>
              </div>

              {added ? (
                <div role="status" aria-live="polite" className="mt-3 flex items-center justify-between gap-4 rounded-2xl bg-peach/35 px-5 py-4 text-sm text-forest">
                  <span>محصول با انتخاب‌های شما به سبد اضافه شد.</span>
                  <Link href="/cart" className="shrink-0 font-medium text-brick transition-colors hover:text-forest">
                    مشاهده سبد ←
                  </Link>
                </div>
              ) : null}

              <div className="mt-8 grid grid-cols-3 divide-x-reverse divide-x divide-forest/10 border-t border-forest/10 pt-6 text-center">
                <TrustItem title="زمان تحویل" detail={getProductDeliveryLeadTime(product).label} />
                <TrustItem title="ارسال تخصصی" detail="سراسر کشور" />
                <TrustItem title="پشتیبانی" detail="پیش و پس از خرید" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-forest py-24 text-paper md:py-32 lg:py-40">
        <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-16">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p className="eyebrow text-peach">Material & Craft</p>
              <h2 className="mt-6 text-[clamp(3rem,6vw,6rem)] font-extralight leading-[0.88] tracking-tightest">
                زیبایی، از جزئیات آغاز می‌شود
              </h2>
            </div>
            <div className="grid gap-px bg-paper/15 sm:grid-cols-2">
              {craftAttributes.map((attribute, index) => (
                <div key={attribute.id} className="bg-forest p-6 md:p-8">
                  <p className="font-display text-2xl text-peach">0{toFa(index + 1)}</p>
                  <h3 className="mt-4 text-xl font-light">{attribute.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-paper/60">
                    {attribute.terms.map((term) => term.name).join("، ") || "قابل انتخاب در زمان سفارش"}
                  </p>
                </div>
              ))}
              {!craftAttributes.length ? (
                <div className="col-span-full bg-forest p-8 text-paper/65">
                  مشخصات فنی تکمیلی پس از اتصال API جدید نمایش داده می‌شود.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {(product.longDescription || product.specs?.length) ? (
        <section className="bg-paper py-20 md:py-28">
          <div className="mx-auto grid w-full max-w-container gap-10 px-6 md:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:px-16">
            <div>
              <p className="eyebrow text-brick">جزئیات محصول</p>
              <h2 className="mt-5 text-4xl font-extralight text-forest md:text-6xl">توضیحات و ابعاد</h2>
            </div>
            <div>
              {product.longDescription ? <ProductRichDescription html={product.longDescription} /> : null}
              {product.specs?.length ? (
                <dl className="mt-8 divide-y divide-forest/10 border-y border-forest/10">
                  {product.specs.map((spec, index) => <div key={`${spec.label}-${index}`} className="grid grid-cols-2 gap-5 py-4 text-sm"><dt className="font-medium text-forest">{spec.label}</dt><dd className="text-forest/65">{spec.value}</dd></div>)}
                </dl>
              ) : null}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function AttributePills({
  product,
  attributes,
  attribute,
  selected,
  setSelected,
  setAdded,
}: {
  product: ShopProduct;
  attributes: PurchaseAttribute[];
  attribute: PurchaseAttribute;
  selected: Record<string, string>;
  setSelected: Dispatch<SetStateAction<Record<string, string>>>;
  setAdded: (value: boolean) => void;
}) {
  const optionLabels = attribute.options.map((option) => option.label);
  const label = purchaseAttributeLabel(attribute.label, optionLabels);
  const selectedOption = attribute.options.find((option) => option.id === selected[attribute.id]);
  return (
    <fieldset>
      <div className="flex items-center gap-3">
        <legend className="text-sm font-medium text-forest">{label}</legend>
        {selectedOption ? <span className="text-xs text-forest/45">{selectedOption.label}</span> : null}
      </div>
      <div className="mt-3 flex flex-wrap justify-start gap-2" dir="rtl">
        {attribute.options.map((option) => {
          const compatible = isOptionCompatibleWithSelection(product, attributes, selected, attribute.id, option.id);
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                setSelected((current) => selectionForAttributeOption(product, attributes, current, attribute.id, option.id));
                setAdded(false);
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-xs transition-colors",
                selected[attribute.id] === option.id
                  ? "border-forest bg-forest text-paper"
                  : compatible
                    ? "border-forest/15 text-forest/65 hover:border-forest/40 hover:text-forest"
                    : "border-forest/10 text-forest/35 hover:border-forest/30 hover:text-forest/60",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function TrustItem({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="px-2 first:pr-0 last:pl-0">
      <p className="text-xs font-medium text-forest">{title}</p>
      <p className="mt-1 text-[10px] text-forest/40">{detail}</p>
    </div>
  );
}
