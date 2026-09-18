"use client";

import { useEffect, useMemo, useState } from "react";
import { shopApi } from "@/lib/shop-api";

export type MaterialSwatch = {
  slug: string;
  name: string;
  family: string;
  color: string;
  hex: string;
  image: string;
  excerpt: string;
  href: string;
  sample: boolean;
};

type Props = {
  value: string[];
  onChange: (slugs: string[]) => void;
};

export default function ProductMaterialsPicker({ value, onChange }: Props) {
  const [items, setItems] = useState<MaterialSwatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    shopApi
      .materials()
      .then((rows) => setItems(rows.filter((item) => item.sample !== false)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  const selected = useMemo(
    () => value.map((slug) => items.find((item) => item.slug === slug)).filter(Boolean) as MaterialSwatch[],
    [items, value],
  );
  const available = items.filter((item) => !value.includes(item.slug));

  function toggle(slug: string) {
    onChange(value.includes(slug) ? value.filter((item) => item !== slug) : [...value, slug]);
  }

  return (
    <div>
      <span className="mb-2 block text-[11px] font-medium text-forest/60">متریال، رنگ و فینیش</span>
      <p className="mb-3 text-[10px] leading-5 text-forest/38">
        از کتابخانه متریال سایت انتخاب کنید. همین نمونه‌ها به‌صورت دایره تصویری در صفحه محصول نمایش داده می‌شوند.
      </p>
      {loading ? (
        <p className="text-[11px] text-forest/35">در حال دریافت متریال‌ها…</p>
      ) : (
        <>
          {selected.length ? (
            <div className="mb-3 flex flex-wrap gap-2">
              {selected.map((item) => (
                <button
                  key={item.slug}
                  type="button"
                  onClick={() => toggle(item.slug)}
                  className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-white px-2 py-1.5 text-[11px] text-forest"
                >
                  <span
                    className="h-7 w-7 rounded-full bg-cover bg-center ring-1 ring-forest/10"
                    style={{ backgroundImage: item.image ? `url(${item.image})` : undefined, backgroundColor: item.hex || "#c9b8a3" }}
                  />
                  {item.name}
                  <span className="text-forest/30">×</span>
                </button>
              ))}
            </div>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {available.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => toggle(item.slug)}
                title={item.name}
                className="group relative h-10 w-10 overflow-hidden rounded-full border border-forest/12 bg-[#e8e2d9] hover:border-forest/35"
              >
                {item.image ? (
                  <span className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.image})` }} />
                ) : (
                  <span className="absolute inset-0" style={{ backgroundColor: item.hex || "#c9b8a3" }} />
                )}
              </button>
            ))}
          </div>
          {!items.length ? (
            <p className="mt-2 text-[10px] text-forest/35">هنوز متریالی در کتابخانه ثبت نشده است.</p>
          ) : null}
        </>
      )}
    </div>
  );
}
