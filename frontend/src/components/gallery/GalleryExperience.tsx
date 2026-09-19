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
  catalogProducts?: AnyProduct[];
};

export default function GalleryExperience({ items, catalogProducts = [] }: Props) {
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
  const [products, setProducts] = useState<AnyProduct[]>(() =>
    catalogProducts.length ? catalogProducts : getAllCatalogProducts(),
  );
  const [, startTransition] = useTransition();

  useEffect(() => {
    let cancelled = false;

    const productsReady = catalogProducts.length
      ? Promise.resolve(catalogProducts)
      : fetchStorefrontProducts()
          .then((list) => (list.length ? list : getAllCatalogProducts()))
          .catch(() => getAllCatalogProducts());

    const sessionReady = fetch(`${getApiBase()}/public/account/me`, { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) throw new Error("unsigned");
        const payload = (await response.json()) as { customer?: { galleryTaste?: unknown } };
        return { signedIn: true as const, answers: parseTasteAnswers(payload.customer?.galleryTaste) };
      })
      .catch(() => ({ signedIn: false as const, answers: null as ReturnType<typeof parseTasteAnswers> }));

    Promise.all([productsReady, sessionReady]).then(([list, session]) => {
      if (cancelled) return;
      setProducts(list);
      setSignedIn(session.signedIn);
      if (session.answers) {
        const next = { status: "complete" as const, answers: session.answers };
        writeTasteState(next);
        setTaste(next);
        setQuizOpen(false);
      } else {
        const stored = readTasteState();
        setTaste(stored);
        setQuizOpen(stored?.status !== "complete");
      }
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [catalogProducts]);

  useEffect(() => {
    const next = (searchParams.get("tag") as GalleryFilter | null) ?? "all";
    if (galleryFilters.some((f) => f.id === next)) setFilter(next);
  }, [searchParams]);

  const productItems = useMemo(
    () => products.filter((product) => product.image).map(productToGalleryItem),
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
        <div>
          {taste?.status === "complete" ? (
            <p className="mb-3 text-xs text-forest/45">فید بر اساس سلیقه شما چیده شده؛ عکس محصول‌های هماهنگ بین آرشیو می‌آیند.</p>
          ) : taste?.status === "skipped" ? (
            <p className="mb-3 text-xs text-forest/45">ترتیب پیش‌فرض آرشیو. سلیقه برای این مرورگر رد شده است.</p>
          ) : (
            <p className="mb-3 text-xs text-forest/45">با چند سؤال کوتاه، ترتیب گالری را با سلیقه شما می‌چینیم.</p>
          )}
        <div className="flex flex-wrap items-center gap-2">
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
          <button
            type="button"
            onClick={() => setQuizOpen(true)}
            className="border border-brick/30 px-4 py-2 text-xs tracking-[0.12em] text-brick transition-colors duration-300 hover:border-brick hover:bg-brick hover:text-paper"
          >
            {taste?.status === "complete" ? "تغییر سلیقه" : "شخصی‌سازی فید"}
          </button>
        </div>
        </div>
        <p className="text-sm text-forest/50">{ready ? `${toFa(filtered.length)} تصویر` : "در حال چیدن فید…"}</p>
      </FadeUp>

      <div className="mt-10 md:mt-14">
        {ready ? (
          <GalleryBentoGrid items={filtered} onOpen={setActive} />
        ) : (
          <div className="h-40 animate-pulse bg-forest/5" />
        )}
      </div>

      {active ? (
        <GalleryLightbox item={active} catalog={mixed} onClose={() => setActive(null)} onSelect={setActive} />
      ) : null}
    </div>
  );
}
