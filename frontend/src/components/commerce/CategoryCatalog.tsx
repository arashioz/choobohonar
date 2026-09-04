"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CommerceProductCard from "@/components/commerce/CommerceProductCard";
import FadeUp from "@/components/motion/FadeUp";
import type { ShopProduct } from "@/data/products";
import { getCollectionName } from "@/lib/commerce";
import { cn, toFa } from "@/lib/utils";

type CategoryCatalogProps = {
  products: ShopProduct[];
  categoryLabel: string;
  campaignImage: string;
};

type SortMode = "featured" | "newest" | "popular" | "price-asc" | "price-desc";

function numericPrice(product: ShopProduct): number {
  return Number(product.prices?.value ?? Number.MAX_SAFE_INTEGER);
}

export default function CategoryCatalog({ products, categoryLabel, campaignImage }: CategoryCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [type, setType] = useState(searchParams.get("type") ?? "all");
  const [collection, setCollection] = useState(searchParams.get("collection") ?? "all");
  const [stockOnly, setStockOnly] = useState(searchParams.get("stock") === "1");
  const [sort, setSort] = useState<SortMode>((searchParams.get("sort") as SortMode) ?? "featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(18);
  const catalogRef = useRef<HTMLElement>(null);
  const scrollToProductsAfterSync = useRef(false);

  const typeOptions = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => counts.set(product.category, (counts.get(product.category) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [products]);

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
      if (type !== "all" && product.category !== type) return false;
      if (collection !== "all" && getCollectionName(product) !== collection) return false;
      if (stockOnly && !product.isInStock) return false;
      return true;
    });

    if (sort === "newest") next.sort((a, b) => b.id - a.id);
    if (sort === "popular") next.sort((a, b) => b.reviewCount - a.reviewCount);
    if (sort === "price-asc") next.sort((a, b) => numericPrice(a) - numericPrice(b));
    if (sort === "price-desc") next.sort((a, b) => numericPrice(b) - numericPrice(a));
    return next;
  }, [collection, products, query, sort, stockOnly, type]);

  useEffect(() => {
    setVisibleCount(18);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
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
  }, [collection, pathname, query, router, searchParams, sort, stockOnly, type]);

  useEffect(() => {
    if (!filterOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [filterOpen]);

  const visible = filtered.slice(0, visibleCount);
  const activeFilterCount = Number(type !== "all") + Number(collection !== "all") + Number(stockOnly);

  const clearFilters = () => {
    scrollToProductsAfterSync.current = true;
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

      <fieldset>
        <legend className="text-sm font-medium text-forest">نوع محصول</legend>
        <div className="mt-4 max-h-64 space-y-2.5 overflow-y-auto pl-2">
          <FilterRadio label="همه" count={products.length} active={type === "all"} onClick={() => { scrollToProductsAfterSync.current = true; setType("all"); }} />
          {typeOptions.map(([label, count]) => (
            <FilterRadio key={label} label={label} count={count} active={type === label} onClick={() => { scrollToProductsAfterSync.current = true; setType(label); }} />
          ))}
        </div>
      </fieldset>

      {collectionOptions.length ? (
        <fieldset>
          <legend className="text-sm font-medium text-forest">کالکشن</legend>
          <div className="mt-4 max-h-56 space-y-2.5 overflow-y-auto pl-2">
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
          </div>
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
          <aside className="sticky top-40 hidden lg:block">{filterPanel}</aside>

          <div className="min-w-0">
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-forest/10 pb-5 text-sm text-forest/55">
              <p>{toFa(filtered.length)} نتیجه</p>
              <div className="flex flex-wrap gap-2">
                {type !== "all" ? <ActiveChip label={type} onRemove={() => { scrollToProductsAfterSync.current = true; setType("all"); }} /> : null}
                {collection !== "all" ? <ActiveChip label={`کالکشن ${collection}`} onRemove={() => { scrollToProductsAfterSync.current = true; setCollection("all"); }} /> : null}
                {stockOnly ? <ActiveChip label="موجود" onRemove={() => { scrollToProductsAfterSync.current = true; setStockOnly(false); }} /> : null}
              </div>
            </div>

            {visible.length ? (
              <div className="grid gap-x-5 gap-y-14 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((product, index) => (
                  <div key={product.slug} className={index === 6 ? "contents" : undefined}>
                    {index === 6 ? (
                      <FadeUp className="relative col-span-full min-h-[22rem] overflow-hidden bg-forest text-paper">
                        <Image src={campaignImage} alt="کمپین اختصاصی خانه چوب و هنر" fill sizes="80vw" className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-l from-forest/90 via-forest/45 to-transparent" />
                        <div className="relative flex min-h-[22rem] max-w-xl flex-col justify-end p-7 md:p-10">
                          <p className="eyebrow text-peach">Campaign slot / 01</p>
                          <h3 className="mt-5 text-4xl font-extralight tracking-tight md:text-6xl">انتخابی برای سال‌ها</h3>
                          <p className="mt-4 max-w-md leading-7 text-paper/70">فضای آماده برای بنرهای کمپین، معرفی کالکشن یا پیشنهادهای زمان‌دار هر دسته.</p>
                        </div>
                      </FadeUp>
                    ) : null}
                    <FadeUp delay={Math.min((index % 6) * 0.04, 0.16)}>
                      <CommerceProductCard product={product} />
                    </FadeUp>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-forest/20 px-6 py-20 text-center">
                <p className="text-2xl font-light text-forest">محصولی پیدا نشد</p>
                <p className="mt-3 text-sm text-forest/55">عبارت جستجو یا فیلترها را تغییر دهید.</p>
                <button type="button" onClick={() => { setQuery(""); clearFilters(); setSort("featured"); router.replace(pathname, { scroll: false }); }} className="mt-6 text-sm text-brick">
                  نمایش همه محصولات
                </button>
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
