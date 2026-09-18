"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { GalleryFilter, GalleryItem } from "@/data/gallery";
import { filterGalleryItems, galleryFilters } from "@/data/gallery";
import type { AnyProduct } from "@/data/products";
import { getAllCatalogProducts } from "@/data/products";
import { fetchStorefrontProducts } from "@/lib/storefront-products";
import GalleryBentoGrid from "@/components/gallery/GalleryBentoGrid";
import GalleryLightbox from "@/components/gallery/GalleryLightbox";
import GalleryTasteQuiz from "@/components/gallery/GalleryTasteQuiz";
import FadeUp from "@/components/motion/FadeUp";
import { getApiBase } from "@/lib/api-base";
import {
  mixGalleryFeed,
  parseTasteAnswers,
  productToGalleryItem,
  readTasteState,
  writeTasteState,
  type GalleryTasteState,
} from "@/lib/gallery-taste";
import type { GalleryTasteAnswers } from "@/data/gallery-taste";
import { cn, toFa } from "@/lib/utils";

type Props = {
  items: GalleryItem[];
};

export default function GalleryExperience({ items }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initial = (searchParams.get("tag") as GalleryFilter | null) ?? "all";
  const validInitial = galleryFilters.some((f) => f.id === initial) ? initial : "all";

  const [filter, setFilter] = useState<GalleryFilter>(validInitial);
  const [active, setActive] = useState<GalleryItem | null>(null);
  const [taste, setTaste] = useState<GalleryTasteState | null>(null);
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);
  const [completedAnswers, setCompletedAnswers] = useState<GalleryTasteAnswers | null>(null);
  const [products, setProducts] = useState<AnyProduct[]>([]);
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;
    fetchStorefrontProducts()
      .then((list) => {
        if (!cancelled) setProducts(list.length ? list : getAllCatalogProducts());
      })
      .catch(() => {
        if (!cancelled) setProducts(getAllCatalogProducts());
      });

    fetch(`${getApiBase()}/public/account/me`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("unsigned");
        const payload = (await response.json()) as { customer?: { galleryTaste?: unknown } };
        if (cancelled) return;
        setSignedIn(true);
        const answers = parseTasteAnswers(payload.customer?.galleryTaste);
        if (answers) {
          writeTasteState({ status: "complete", answers });
          setTaste({ status: "complete", answers });
          setQuizOpen(false);
        } else {
          const stored = readTasteState();
          setTaste(stored);
          setQuizOpen(!stored);
        }
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setSignedIn(false);
        const stored = readTasteState();
        setTaste(stored);
        setQuizOpen(!stored);
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const next = (searchParams.get("tag") as GalleryFilter | null) ?? "all";
    if (galleryFilters.some((f) => f.id === next)) setFilter(next);
  }, [searchParams]);

  const productItems = useMemo(
    () => products.filter((product) => product.image).slice(0, 48).map(productToGalleryItem),
    [products],
  );

  const mixed = useMemo(() => {
    if (taste?.status !== "complete") return items;
    return mixGalleryFeed(items, productItems, taste.answers);
  }, [items, productItems, taste]);

  const filtered = useMemo(() => filterGalleryItems(mixed, filter), [mixed, filter]);

  const selectFilter = (next: GalleryFilter) => {
    setFilter(next);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === "all") params.delete("tag");
      else params.set("tag", next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  function persist(next: GalleryTasteState) {
    writeTasteState(next);
    setTaste(next);
  }

  async function saveSignedInTaste(answers: GalleryTasteAnswers) {
    await fetch(`${getApiBase()}/public/account/me`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ galleryTaste: answers }),
    });
  }

  const showQuiz = ready && quizOpen;

  return (
    <div>
      {showQuiz ? (
        <GalleryTasteQuiz
          needContact={!signedIn}
          onSkip={() => {
            persist({ status: "skipped" });
            setQuizOpen(false);
          }}
          onComplete={(answers) => {
            setCompletedAnswers(answers);
            persist({ status: "complete", answers });
            if (signedIn) {
              void saveSignedInTaste(answers);
              setQuizOpen(false);
            }
          }}
          onSubmitContact={async (input) => {
            if (!completedAnswers) return;
            const response = await fetch(`${getApiBase()}/public/account/gallery-taste`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...input, taste: completedAnswers }),
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(Array.isArray(payload.message) ? payload.message[0] : payload.message || "ارسال انجام نشد");
            setQuizOpen(false);
          }}
          onDismissContact={() => setQuizOpen(false)}
        />
      ) : null}

      <FadeUp className="flex flex-col gap-6 border-y border-forest/10 py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {galleryFilters.map((item) => {
            const selected = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectFilter(item.id)}
                className={cn(
                  "border px-4 py-2 text-xs tracking-[0.12em] transition-colors duration-300",
                  selected
                    ? "border-forest bg-forest text-paper"
                    : "border-forest/15 text-forest/65 hover:border-forest/40 hover:text-forest"
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>
        <p className="text-sm text-forest/50">{toFa(filtered.length)} تصویر</p>
      </FadeUp>

      <div className="mt-10 md:mt-14">
        <GalleryBentoGrid items={filtered} onOpen={setActive} />
      </div>

      {active ? (
        <GalleryLightbox item={active} catalog={mixed} onClose={() => setActive(null)} onSelect={setActive} />
      ) : null}
    </div>
  );
}
