"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getCategoriesByRoom,
  productCategories,
  productRooms,
  roomLabels,
} from "@/data/product-categories";
import { finishes, getAllCatalogProducts } from "@/data/products";
import type { ProductRoom } from "@/data/products";
import { getProductShopUrl } from "@/lib/shop";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import { toFa } from "@/lib/utils";

const ALL_ROOMS = "all";
const ALL_CATEGORIES = "all";

export default function ProductsCatalogPage() {
  const searchParams = useSearchParams();
  const initialRoom = searchParams.get("room") ?? ALL_ROOMS;
  const initialCategory = searchParams.get("category") ?? ALL_CATEGORIES;
  const initialFinish = searchParams.get("finish") ?? "all";

  const [room, setRoom] = useState(initialRoom);
  const [category, setCategory] = useState(initialCategory);
  const [finish, setFinish] = useState(initialFinish);
  const [sort, setSort] = useState("featured");

  useEffect(() => {
    setRoom(searchParams.get("room") ?? ALL_ROOMS);
    setCategory(searchParams.get("category") ?? ALL_CATEGORIES);
    setFinish(searchParams.get("finish") ?? "all");
  }, [searchParams]);

  const categoryOptions = useMemo(() => {
    if (room === ALL_ROOMS) return productCategories;
    return getCategoriesByRoom(room as ProductRoom);
  }, [room]);

  const categoryCount = useMemo(() => new Set(getAllCatalogProducts().map((p) => p.category)).size, []);

  const filteredProducts = useMemo(() => {
    const next = getAllCatalogProducts().filter((p) => {
      if (category !== ALL_CATEGORIES && p.category !== category) return false;
      if (room !== ALL_ROOMS && p.room !== room) return false;
      if (finish !== "all") {
        if (!("finishes" in p)) return false;
        if (!p.finishes.includes(finish)) return false;
      }
      return true;
    });
    if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name, "fa"));
    if (sort === "category") next.sort((a, b) => a.category.localeCompare(b.category, "fa"));
    return next;
  }, [category, finish, room, sort]);

  return (
    <section className="bg-paper pt-32 pb-24 md:pt-40 md:pb-32">
      <Container>
        <nav className="mb-10 flex items-center gap-2 text-sm text-forest/55">
          <Link href="/" className="transition-colors hover:text-forest">
            خانه
          </Link>
          <span>/</span>
          <span className="text-forest">محصولات</span>
        </nav>
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <FadeUp as="h1" className="text-balance text-[clamp(2.5rem,7vw,6rem)] font-light leading-[0.95] tracking-tightest text-forest">
            محصولات
          </FadeUp>
          <FadeUp as="p" delay={0.1} className="max-w-md text-lg text-forest/60">
            دسته‌بندی محصولات مطابق فروشگاه خانه چوب و هنر — برای خرید به فروشگاه رسمی منتقل می‌شوید.
          </FadeUp>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 border-y border-forest/10 py-6 md:grid-cols-2 lg:grid-cols-4">
          <label className="flex flex-col gap-2 text-sm text-forest/65">
            فضا
            <select
              value={room}
              onChange={(e) => {
                setRoom(e.target.value);
                setCategory(ALL_CATEGORIES);
              }}
              className="border-b border-forest/20 bg-transparent py-3 text-base text-forest focus:outline-none"
            >
              <option value={ALL_ROOMS}>همه فضاها</option>
              {productRooms.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-forest/65">
            دسته‌بندی
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border-b border-forest/20 bg-transparent py-3 text-base text-forest focus:outline-none"
            >
              <option value={ALL_CATEGORIES}>همه دسته‌ها</option>
              {categoryOptions.map((item) => (
                <option key={item.id} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-forest/65">
            پرداخت چوب
            <select
              value={finish}
              onChange={(e) => setFinish(e.target.value)}
              className="border-b border-forest/20 bg-transparent py-3 text-base text-forest focus:outline-none"
            >
              <option value="all">همه پرداخت‌ها</option>
              {finishes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-forest/65">
            مرتب‌سازی
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border-b border-forest/20 bg-transparent py-3 text-base text-forest focus:outline-none"
            >
              <option value="featured">منتخب</option>
              <option value="name">نام محصول</option>
              <option value="category">دسته‌بندی</option>
            </select>
          </label>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {productRooms.map((item) => (
            <Link
              key={item.id}
              href={`/products?room=${item.id}`}
              className="rounded-full border border-forest/15 px-4 py-1.5 text-xs text-forest/70 transition-colors hover:border-forest hover:text-forest"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-sm text-forest/55">
          <p>
            {toFa(filteredProducts.length)} محصول
            {category !== ALL_CATEGORIES ? ` در «${category}»` : ""}
            {room !== ALL_ROOMS ? ` — ${roomLabels[room as ProductRoom]}` : ""}
            {" · "}
            {toFa(categoryCount)} دسته در کل کاتالوگ
          </p>
          <Link href="/collection" className="inline-flex items-center gap-2 text-forest transition-colors hover:text-brick">
            مشاهده کالکشن پرداخت‌ها
            <span>←</span>
          </Link>
        </div>

        {filteredProducts.length ? (
          <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
            {filteredProducts.map((p, i) => (
              <FadeUp key={p.slug} delay={Math.min(i * 0.04, 0.4)}>
                <article className="group block">
                  <Link href={`/products/${p.slug}`} className="block">
                    <div className="relative aspect-[4/5] w-full overflow-hidden bg-forest/5">
                      <Image
                        src={p.image}
                        alt={p.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="mt-4 flex items-baseline justify-between gap-3">
                      <h2 className="text-xl font-light tracking-tight text-forest">{p.name}</h2>
                      <span className="text-sm text-forest/65">{p.category}</span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-forest/60">{p.shortDescription}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm text-brick transition-colors group-hover:text-forest">
                      معرفی محصول
                      <span className="transition-transform duration-300 ease-out-expo group-hover:-translate-x-1">←</span>
                    </span>
                  </Link>
                  <a
                    href={getProductShopUrl(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-xs tracking-wide text-forest/50 transition-colors hover:text-brick"
                  >
                    خرید از فروشگاه ↗
                  </a>
                </article>
              </FadeUp>
            ))}
          </div>
        ) : (
          <div className="mt-16 border border-dashed border-forest/20 px-6 py-12 text-center text-forest/65">
            محصولی با فیلترهای انتخاب‌شده پیدا نشد. فیلترها را تغییر دهید یا{" "}
            <Link href="/products" className="text-brick underline-offset-4 hover:underline">
              همه محصولات
            </Link>{" "}
            را ببینید.
          </div>
        )}
      </Container>
    </section>
  );
}
