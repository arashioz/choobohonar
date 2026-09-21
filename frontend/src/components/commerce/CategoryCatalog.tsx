"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CommerceProductCard from "@/components/commerce/CommerceProductCard";
import FadeUp from "@/components/motion/FadeUp";
import type { ShopProduct } from "@/data/products";
import {
  getFamiliesInProducts,
  getTypesInProducts,
  productMatchesFamily,
  productMatchesType,
} from "@/data/product-families";
import { getCollectionName } from "@/lib/commerce";
import { isUploadedMedia } from "@/lib/media";
import { cn, toFa } from "@/lib/utils";

type CategoryCatalogProps = {
  products: ShopProduct[];
  categoryLabel: string;
  campaignImage: string;
  campaign?: { title: string; subtitle: string; image: string } | null;
};

type SortMode = "featured" | "newest" | "popular" | "price-asc" | "price-desc";

function numericPrice(product: ShopProduct): number {
  return Number(product.prices?.value ?? Number.MAX_SAFE_INTEGER);
}

export default function CategoryCatalog({ products, categoryLabel, campaignImage, campaign }: CategoryCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [family, setFamily] = useState(searchParams.get("family") ?? "all");
  const [type, setType] = useState(searchParams.get("type") ?? "all");
  const [collection, setCollection] = useState(searchParams.get("collection") ?? "all");
  const [stockOnly, setStockOnly] = useState(searchParams.get("stock") === "1");
  const [sort, setSort] = useState<SortMode>((searchParams.get("sort") as SortMode) ?? "featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(18);
  const catalogRef = useRef<HTMLElement>(null);
  const scrollToProductsAfterSync = useRef(false);

  const familyOptions = useMemo(() => getFamiliesInProducts(products), [products]);
  const typeOptions = useMemo(() => getTypesInProducts(products, family), [family, products]);
  const showTypeFilter = family !== "all" && typeOptions.length > 1;

  const collectionOptions = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      const name = getCollectionName(product);
      if (name) counts.set(name, (counts.get(name) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [products]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("fa");
    const next = products.filter((product) => {
      if (normalizedQuery) {
        const haystack = `${product.name} ${product.category} ${product.shortDescription}`.toLocaleLowerCase("fa");
        if (!haystack.includes(normalizedQuery)) return false;
      }
      if (family !== "all" && !productMatchesFamily(product, family)) return false;
      if (type !== "all" && !productMatchesType(product, type)) return false;
      if (collection !== "all" && getCollectionName(product) !== collection) return false;
      if (stockOnly && !product.isInStock) return false;
      return true;
    });

    if (sort === "newest") next.sort((a, b) => b.id - a.id);
    if (sort === "popular") next.sort((a, b) => b.reviewCount - a.reviewCount);
    if (sort === "price-asc") next.sort((a, b) => numericPrice(a) - numericPrice(b));
    if (sort === "price-desc") next.sort((a, b) => numericPrice(b) - numericPrice(a));
    return next;
  }, [collection, family, products, query, sort, stockOnly, type]);

  useEffect(() => {
    setVisibleCount(18);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (family !== "all") params.set("family", family);
    if (type !== "all") params.set("type", type);
    if (collection !== "all") params.set("collection", collection);
    if (stockOnly) params.set("stock", "1");
    if (sort !== "featured") params.set("sort", sort);
    const nextUrl = params.size ? `${pathname}?${params}` : pathname;
    const currentUrl = `${pathname}${searchParams.size ? `?${searchParams}` : ""}`;
    // Avoid a no-op navigation on mount: preserving an old scroll position
    // can otherwise place a short, filtered catalog at the footer.
    if (nextUrl === currentUrl) return;
    const timeout = window.setTimeout(() => {
      router.replace(nextUrl, { scroll: false });
      if (scrollToProductsAfterSync.current) {
        scrollToProductsAfterSync.current = false;
        window.requestAnimationFrame(() => {
          const top = catalogRef.current?.getBoundingClientRect().top;
          if (top !== undefined) window.scrollTo({ top: Math.max(0, window.scrollY + top - 92), behavior: "auto" });
        });
      }
    }, 180);
    return () => window.clearTimeout(timeout);
  }, [collection, family, pathname, query, router, searchParams, sort, stockOnly, type]);

  useEffect(() => {
    if (!filterOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [filterOpen]);

  const visible = filtered.slice(0, visibleCount);
  const activeFilterCount = Number(family !== "all") + Number(type !== "all") + Number(collection !== "all") + Number(stockOnly);
  const filtersActive = family !== "all" || type !== "all" || collection !== "all" || Boolean(query.trim()) || stockOnly;

  const selectFamily = (next: string) => {
    scrollToProductsAfterSync.current = true;
    setFamily(next);
    setType("all");
  };

  const clearFilters = () => {
    scrollToProductsAfterSync.current = true;
    setFamily("all");
    setType("all");
    setCollection("all");
    setStockOnly(false);
  };

  const filterPanel = (
    <div className="space-y-9">
      <div className="flex items-center justify-between border-b border-forest/10 pb-4">
        <h3 className="text-lg font-medium text-forest">فیلتر محصولات</h3>
        {activeFilterCount ? (
          <button type="button" onClick={clearFilters} className="text-xs text-brick hover:text-forest">
            پاک‌کردن همه
          </button>
        ) : null}
      </div>

      {showTypeFilter ? (
        <fieldset>
          <legend className="text-sm font-medium text-forest">نوع محصول</legend>
          <ScrollableFilterList className="max-h-64">
            <FilterRadio label="همه انواع" count={family === "all" ? products.length : products.filter((product) => productMatchesFamily(product, family)).length} active={type === "all"} onClick={() => { scrollToProductsAfterSync.current = true; setType("all"); }} />
            {typeOptions.map(({ type: option, count }) => (
              <FilterRadio key={option.slug} label={option.label} count={count} active={type === option.slug} onClick={() => { scrollToProductsAfterSync.current = true; setType(option.slug); }} />
            ))}
          </ScrollableFilterList>
        </fieldset>
      ) : null}

      {collectionOptions.length ? (
        <fieldset>
          <legend className="text-sm font-medium text-forest">کالکشن</legend>
          <ScrollableFilterList>
            <FilterRadio label="همه کالکشن‌ها" count={products.length} active={collection === "all"} onClick={() => { scrollToProductsAfterSync.current = true; setCollection("all"); }} />
            {collectionOptions.map(([label, count]) => (
              <FilterRadio
                key={label}
                label={label}
                count={count}
                active={collection === label}
                onClick={() => { scrollToProductsAfterSync.current = true; setCollection(label); }}
              />
            ))}
          </ScrollableFilterList>
        </fieldset>
      ) : null}

      <label className="flex cursor-pointer items-center justify-between gap-4 border-y border-forest/10 py-5 text-sm text-forest">
        <span>فقط محصولات موجود</span>
        <span className={cn("relative h-6 w-11 rounded-full transition-colors", stockOnly ? "bg-forest" : "bg-forest/15")}>
          <input type="checkbox" checked={stockOnly} onChange={(event) => { scrollToProductsAfterSync.current = true; setStockOnly(event.target.checked); }} className="sr-only" />
          <span
            className={cn(
              "absolute top-1 h-4 w-4 rounded-full bg-paper transition-all",
              stockOnly ? "left-1" : "left-6",
            )}
          />
        </span>
      </label>
    </div>
  );

  return (
    <section ref={catalogRef} className="bg-paper py-20 md:py-28">
      <div className="mx-auto w-full max-w-container px-6 md:px-10 lg:px-16">
        {familyOptions.length ? (
          <div className="mb-8 border-b border-forest/10 pb-6">
            <p className="mb-3 text-xs tracking-[0.16em] text-forest/45">دسته</p>
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
              <button type="button" onClick={() => selectFamily("all")} className={cn("shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors", family === "all" ? "bg-forest text-paper" : "border border-forest/15 text-forest hover:border-forest")}>همه محصولات</button>
              {familyOptions.map(({ family: option, count }) => (
                <button key={option.slug} type="button" onClick={() => selectFamily(option.slug)} className={cn("shrink-0 rounded-full px-5 py-2.5 text-sm transition-colors", family === option.slug ? "bg-forest text-paper" : "border border-forest/15 text-forest hover:border-forest")}>{option.label} <span className="mr-1 text-xs opacity-70">{toFa(count)}</span></button>
              ))}
            </div>
          </div>
        ) : null}
        <div className="sticky top-[68px] z-30 -mx-6 border-y border-forest/10 bg-paper/95 px-6 py-4 backdrop-blur-xl md:-mx-10 md:px-10 lg:-mx-16 lg:px-16">
          <div className="mx-auto flex max-w-container flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative min-w-0 flex-1">
              <span className="sr-only">جستجو در {categoryLabel}</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`جستجو در ${categoryLabel}...`}
                className="h-12 w-full rounded-full border border-forest/15 bg-white/60 pr-12 pl-5 text-sm text-forest outline-none transition-colors placeholder:text-forest/40 focus:border-forest/40"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 text-forest/45" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m16.5 16.5 4 4" />
              </svg>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-forest/15 px-5 text-sm text-forest lg:hidden"
              >
                فیلترها
                {activeFilterCount ? <span className="rounded-full bg-forest px-2 py-0.5 text-[10px] text-paper">{toFa(activeFilterCount)}</span> : null}
              </button>
              <label className="relative flex-1 sm:flex-none">
                <span className="sr-only">مرتب‌سازی</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortMode)}
                  className="h-12 w-full appearance-none rounded-full border border-forest/15 bg-transparent pr-5 pl-10 text-sm text-forest outline-none sm:min-w-44"
                >
                  <option value="featured">منتخب ما</option>
                  <option value="newest">جدیدترین</option>
                  <option value="popular">محبوب‌ترین</option>
                  <option value="price-asc">قیمت، کم به زیاد</option>
                  <option value="price-desc">قیمت، زیاد به کم</option>
                </select>
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest/45">⌄</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:items-start xl:grid-cols-[18rem_minmax(0,1fr)]">
          <aside data-lenis-prevent className="sticky top-40 hidden max-h-[calc(100svh-11rem)] overflow-y-auto overscroll-contain lg:block">{filterPanel}</aside>

          <div className="min-w-0">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-forest/10 pb-5 text-sm text-forest/55">
              <p>{toFa(filtered.length)} نتیجه</p>
              <div className="flex flex-wrap gap-2">
                {family !== "all" ? <ActiveChip label={familyOptions.find((item) => item.family.slug === family)?.family.label ?? family} onRemove={() => selectFamily("all")} /> : null}
                {type !== "all" ? <ActiveChip label={typeOptions.find((item) => item.type.slug === type)?.type.label ?? type} onRemove={() => { scrollToProductsAfterSync.current = true; setType("all"); }} /> : null}
                {collection !== "all" ? <ActiveChip label={`کالکشن ${collection}`} onRemove={() => { scrollToProductsAfterSync.current = true; setCollection("all"); }} /> : null}
                {stockOnly ? <ActiveChip label="موجود" onRemove={() => { scrollToProductsAfterSync.current = true; setStockOnly(false); }} /> : null}
              </div>
            </div>

            {visible.length ? (
              <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((product, index) => {
                  const showCampaign =
                    !filtersActive &&
                    Boolean(campaign?.title || campaign?.image) &&
                    (visible.length > 6 ? index === 6 : index === visible.length - 1);
                  return (
                  <div key={product.slug} className={showCampaign ? "contents" : undefined}>
                    {showCampaign ? (
                      <FadeUp className="relative col-span-full min-h-[22rem] overflow-hidden bg-forest text-paper">
                        <Image
                          src={campaign?.image || campaignImage}
                          alt={campaign?.title || categoryLabel}
                          fill
                          sizes="80vw"
                          unoptimized={isUploadedMedia(campaign?.image || campaignImage)}
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-l from-forest/90 via-forest/45 to-transparent" />
                        <div className="relative flex min-h-[22rem] max-w-xl flex-col justify-end p-7 md:p-10">
                          <h3 className="text-4xl font-extralight tracking-tight md:text-6xl">{campaign?.title || categoryLabel}</h3>
                          {campaign?.subtitle ? <p className="mt-4 max-w-md leading-7 text-paper/70">{campaign.subtitle}</p> : null}
                        </div>
                      </FadeUp>
                    ) : null}
                    <FadeUp delay={Math.min((index % 6) * 0.04, 0.16)}>
                      <CommerceProductCard product={product} />
                    </FadeUp>
                  </div>
                  );
                })}
              </div>
            ) : (
              <div className="border border-dashed border-forest/20 px-6 py-20 text-center">
                <p className="text-2xl font-light text-forest">محصولی پیدا نشد</p>
                <p className="mt-3 text-sm text-forest/55">عبارت جستجو یا فیلترها را تغییر دهید.</p>
                <Link href="/products" className="mt-6 inline-block text-sm text-brick">
                  نمایش همه محصولات
                </Link>
              </div>
            )}

            {visibleCount < filtered.length ? (
              <div className="mt-16 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((count) => count + 18)}
                  className="group inline-flex min-w-52 items-center justify-center gap-3 rounded-full border border-forest/25 px-8 py-4 text-sm text-forest transition-colors hover:bg-forest hover:text-paper"
                >
                  نمایش محصولات بیشتر
                  <span className="transition-transform group-hover:translate-y-1">↓</span>
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className={cn("fixed inset-0 z-[70] lg:hidden", filterOpen ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!filterOpen}>
        <button
          type="button"
          aria-label="بستن فیلتر"
          onClick={() => setFilterOpen(false)}
          className={cn("absolute inset-0 bg-forest/50 backdrop-blur-sm transition-opacity", filterOpen ? "opacity-100" : "opacity-0")}
        />
        <div
          data-lenis-prevent
          className={cn(
            "absolute inset-x-0 bottom-0 max-h-[88svh] overflow-y-auto rounded-t-[2rem] bg-paper p-6 pb-10 transition-transform duration-500 ease-out-expo",
            filterOpen ? "translate-y-0" : "translate-y-full",
          )}
        >
          <div className="mb-7 flex items-center justify-between">
            <p className="text-xl font-medium text-forest">فیلترها</p>
            <button type="button" onClick={() => setFilterOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-forest/5 text-xl text-forest">
              ×
            </button>
          </div>
          {filterPanel}
          <button type="button" onClick={() => setFilterOpen(false)} className="mt-8 w-full rounded-full bg-forest px-6 py-4 text-sm text-paper">
            مشاهده {toFa(filtered.length)} محصول
          </button>
        </div>
      </div>
    </section>
  );
}

function ScrollableFilterList({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      data-lenis-prevent
      onWheel={(event) => event.stopPropagation()}
      className={cn("mt-4 max-h-56 space-y-2.5 overflow-y-auto overscroll-contain pl-2 pr-1", className)}
    >
      {children}
    </div>
  );
}

function FilterRadio({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center justify-between gap-4 py-1.5 text-right text-sm">
      <span className="flex items-center gap-3">
        <span className={cn("flex h-4 w-4 items-center justify-center rounded-full border", active ? "border-forest" : "border-forest/25")}>
          {active ? <span className="h-2 w-2 rounded-full bg-forest" /> : null}
        </span>
        <span className={active ? "text-forest" : "text-forest/65"}>{label}</span>
      </span>
      <span className="text-xs text-forest/35">{toFa(count)}</span>
    </button>
  );
}

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button type="button" onClick={onRemove} className="inline-flex items-center gap-2 rounded-full bg-forest/5 px-3 py-1.5 text-xs text-forest">
      {label} <span className="text-forest/45">×</span>
    </button>
  );
}
