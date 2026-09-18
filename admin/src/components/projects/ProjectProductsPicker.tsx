"use client";

import { useEffect, useMemo, useState } from "react";
import { shopApi, type ShopProduct } from "@/lib/shop-api";

const inputClass =
  "w-full rounded-xl border border-forest/10 bg-[#faf8f5] px-3.5 py-3 text-xs text-forest placeholder:text-forest/25 transition-colors focus:border-forest/30 focus:bg-white focus:outline-none";

type Props = {
  value: string[];
  onChange: (slugs: string[]) => void;
};

export default function ProjectProductsPicker({ value, onChange }: Props) {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    shopApi
      .list({ status: "published", limit: 1000 })
      .then((result) => setProducts(result.items))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    products.forEach((product) => {
      if (product.category) counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
    });
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0], "fa"));
  }, [products]);

  const selected = useMemo(
    () =>
      value.map((slug) => products.find((product) => product.slug === slug) || { slug, name: slug, category: "", image: "" }),
    [products, value],
  );

  const available = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      if (value.includes(product.slug)) return false;
      if (category && product.category !== category) return false;
      if (!q) return true;
      return product.name.toLowerCase().includes(q) || product.slug.toLowerCase().includes(q);
    });
  }, [products, value, category, query]);

  function add(slug: string) {
    if (!slug || value.includes(slug)) return;
    onChange([...value, slug]);
  }

  return (
    <div>
      <span className="mb-2 block text-[11px] font-medium text-forest/60">محصولات استفاده‌شده در پروژه</span>
      <p className="mb-3 text-[10px] leading-5 text-forest/38">
        از لیست فروشگاه انتخاب کنید. همین محصولات با کارت واقعی در صفحه پروژه سایت نمایش داده می‌شوند.
      </p>
      {loading ? (
        <p className="text-[11px] text-forest/35">در حال دریافت محصولات فروشگاه…</p>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-[1fr_1.4fr]">
            <select value={category} onChange={(event) => setCategory(event.target.value)} className={inputClass}>
              <option value="">همه دسته‌ها</option>
              {categories.map(([name, count]) => (
                <option key={name} value={name}>
                  {name} ({count.toLocaleString("fa-IR")})
                </option>
              ))}
            </select>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className={inputClass}
              placeholder="جست‌وجوی نام محصول"
            />
          </div>
          <select
            value=""
            onChange={(event) => {
              add(event.target.value);
              event.currentTarget.value = "";
            }}
            className={inputClass}
            disabled={!available.length}
          >
            <option value="">{available.length ? "افزودن محصول از دیتابیس" : "محصول دیگری در این فیلتر نیست"}</option>
            {available.map((product) => (
              <option key={product._id || product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </select>
          {selected.length ? (
            <ul className="space-y-2">
              {selected.map((product) => (
                <li key={product.slug} className="flex items-center gap-3 rounded-xl border border-forest/10 bg-[#faf8f5] p-2">
                  <span
                    className="h-12 w-12 shrink-0 rounded-lg bg-[#e8e2d9] bg-cover bg-center"
                    style={product.image ? { backgroundImage: `url(${product.image})` } : undefined}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs font-medium text-forest">{product.name}</span>
                    <span className="mt-0.5 block truncate text-[10px] text-forest/40" dir="ltr">
                      {product.category ? `${product.category} · ` : ""}
                      {product.slug}
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => onChange(value.filter((slug) => slug !== product.slug))}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-forest/30 hover:bg-brick/[0.05] hover:text-brick"
                    aria-label={`حذف ${product.name}`}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed border-forest/15 px-3 py-4 text-center text-[11px] text-forest/35">
              هنوز محصولی به این پروژه وصل نشده است.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
