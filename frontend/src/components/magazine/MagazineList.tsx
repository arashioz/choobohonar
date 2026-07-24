"use client";

import { useMemo, useState } from "react";
import { posts, postCategories, CATEGORY_DESCRIPTIONS } from "@/data/posts";
import { cn } from "@/lib/utils";
import FadeUp from "@/components/motion/FadeUp";
import PostCard from "@/components/magazine/PostCard";

export default function MagazineList() {
  const [active, setActive] = useState("همه");

  const filtered = useMemo(
    () => (active === "همه" ? posts : posts.filter((p) => p.category === active)),
    [active],
  );

  const categoryDescription =
    active !== "همه" ? CATEGORY_DESCRIPTIONS[active] : undefined;

  return (
    <div>
      <FadeUp className="mt-14 flex flex-wrap gap-3 md:mt-20">
        {postCategories.map((cat) => {
          const selected = cat === active;
          const count = cat === "همه" ? posts.length : posts.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm transition-all duration-300",
                selected
                  ? "border-forest bg-forest text-paper"
                  : "border-forest/15 text-forest/60 hover:border-forest/40 hover:text-forest",
              )}
            >
              {cat}
              <span className={cn("mr-1.5 tabular-nums", selected ? "text-paper/70" : "text-forest/35")}>
                ({count})
              </span>
            </button>
          );
        })}
      </FadeUp>

      {categoryDescription && (
        <FadeUp className="mt-8 max-w-2xl text-base leading-relaxed text-forest/60">
          {categoryDescription}
        </FadeUp>
      )}

      {filtered.length === 0 ? (
        <FadeUp className="mt-16 text-center text-forest/50">
          در این دسته هنوز مقاله‌ای منتشر نشده است.
        </FadeUp>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <FadeUp key={p.slug} delay={i * 0.07}>
              <PostCard post={p} />
            </FadeUp>
          ))}
        </div>
      )}
    </div>
  );
}
