"use client";

import { useMemo, useState } from "react";
import { posts, postCategories } from "@/data/posts";
import { cn } from "@/lib/utils";
import FadeUp from "@/components/motion/FadeUp";
import PostCard from "@/components/magazine/PostCard";

export default function MagazineList() {
  const [active, setActive] = useState("همه");

  const filtered = useMemo(
    () => (active === "همه" ? posts : posts.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div>
      <FadeUp className="mt-14 flex flex-wrap gap-3 md:mt-20">
        {postCategories.map((cat) => {
          const selected = cat === active;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm transition-all duration-300",
                selected
                  ? "border-forest bg-forest text-paper"
                  : "border-forest/15 text-forest/60 hover:border-forest/40 hover:text-forest"
              )}
            >
              {cat}
            </button>
          );
        })}
      </FadeUp>

      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 md:mt-14 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <FadeUp key={p.slug} delay={i * 0.07}>
            <PostCard post={p} />
          </FadeUp>
        ))}
      </div>
    </div>
  );
}
