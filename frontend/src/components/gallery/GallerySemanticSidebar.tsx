"use client";

import { useMemo, useState } from "react";
import type { GalleryItem } from "@/data/gallery";
import { sourceLabels } from "@/data/gallery";
import { cn } from "@/lib/utils";

type Props = {
  items: GalleryItem[];
  onFilter: (ids: Set<string> | null) => void;
};

function normalize(text: string) {
  return text.trim().toLowerCase();
}

function itemMatches(item: GalleryItem, query: string) {
  const q = normalize(query);
  if (!q) return true;
  const haystack = [
    item.primary.label,
    item.alt,
    sourceLabels[item.primary.source],
    ...item.related.map((l) => l.label),
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(q);
}

export default function GallerySemanticSidebar({ items, onFilter }: Props) {
  const [query, setQuery] = useState("");

  const suggestions = useMemo(() => {
    const tags = new Set<string>();
    items.forEach((item) => {
      tags.add(sourceLabels[item.primary.source]);
      item.primary.label.split(/\s+/).slice(0, 2).forEach((w) => {
        if (w.length > 2) tags.add(w);
      });
    });
    return Array.from(tags).slice(0, 8);
  }, [items]);

  const handleChange = (value: string) => {
    setQuery(value);
    const q = normalize(value);
    if (!q) {
      onFilter(null);
      return;
    }
    const ids = new Set(items.filter((item) => itemMatches(item, q)).map((i) => i.id));
    onFilter(ids);
  };

  return (
    <aside
      className={cn(
        "fixed inset-y-0 start-0 z-40 hidden w-56 flex-col border-e border-forest/[0.08] bg-white/95 pt-28 backdrop-blur-md lg:flex xl:w-60",
        "pb-8 ps-5 pe-4"
      )}
      aria-label={"\u062c\u0633\u062a\u062c\u0648\u06cc \u0633\u0645\u0646\u062a\u06cc\u06a9 \u06af\u0627\u0644\u0631\u06cc"}
    >
      <p className="text-[0.6rem] tracking-[0.32em] text-forest/35 uppercase">
        {"\u062c\u0633\u062a\u062c\u0648\u06cc \u0633\u0645\u0646\u062a\u06cc\u06a9"}
      </p>
      <input
        type="search"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={"\u0645\u062b\u0644\u0627\u064b: \u0645\u0628\u0644\u060c \u067e\u0631\u0648\u0698\u0647\u2026"}
        className="mt-4 w-full border-b border-forest/15 bg-transparent py-2 text-sm font-light text-forest outline-none placeholder:text-forest/30 focus:border-forest/40"
      />

      <div className="mt-6 flex flex-col gap-2">
        <p className="text-[0.55rem] tracking-[0.28em] text-forest/30 uppercase">
          {"\u067e\u06cc\u0634\u0646\u0647\u0627\u062f\u0647\u0627"}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {suggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => handleChange(tag)}
              className="rounded-full border border-forest/10 px-2.5 py-1 text-[0.65rem] text-forest/50 transition-colors hover:border-forest/25 hover:text-forest"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {query && (
        <p className="mt-auto text-[0.65rem] leading-relaxed text-forest/40">
          {"\u0641\u06cc\u0644\u062a\u0631 \u0633\u0645\u0646\u062a\u06cc\u06a9 \u0631\u0648\u06cc \u0639\u0646\u0648\u0627\u0646 \u0648 \u0646\u0648\u0639 \u062a\u0635\u0648\u06cc\u0631 \u0627\u0639\u0645\u0627\u0644 \u0645\u06cc\u200c\u0634\u0648\u062f."}
        </p>
      )}
    </aside>
  );
}

export { itemMatches };
