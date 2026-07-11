"use client";

import { useState } from "react";
import { getProduct } from "@/data/products";
import type { ProjectNarrative } from "@/data/projects";
import { getProductShopUrl } from "@/lib/shop";
import { cn, toFa } from "@/lib/utils";

type Props = {
  products: NonNullable<ProjectNarrative["products"]>;
};

function ProductEntry({
  productSlug,
  body,
  faded,
}: {
  productSlug: string;
  body: string;
  faded?: boolean;
}) {
  const product = getProduct(productSlug);
  if (!product) return null;

  return (
    <article
      className={cn(
        "relative border-r-2 border-peach pr-6 md:pr-8",
        faded && "max-h-[7.5rem] overflow-hidden md:max-h-[8.5rem]"
      )}
    >
      <p className="font-display text-sm text-brick">{product.series}</p>
      <h4 className="mt-1 text-xl font-light tracking-tight text-forest md:text-2xl">{product.name}</h4>
      <p className="mt-4 text-base leading-[1.85] text-forest/70 md:text-lg md:leading-[1.9]">{body}</p>
      {!faded && (
        <a
          href={getProductShopUrl(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-forest transition-colors hover:text-brick"
        >
          {"\u0627\u0637\u0644\u0627\u0639\u0627\u062a \u0628\u06cc\u0634\u062a\u0631 \u062f\u0631 \u0686\u0648\u0628 \u0648 \u0647\u0646\u0631"}
          <span aria-hidden>{"\u2197"}</span>
        </a>
      )}
      {faded && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-paper to-transparent"
        />
      )}
    </article>
  );
}

export default function ProjectNarrativeProducts({ products }: Props) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = products.length > 1;

  if (!products.length) return null;

  const visible = expanded ? products : products.slice(0, 2);

  return (
    <div className="mt-16 border-t border-forest/10 pt-12 md:mt-20 md:pt-16">
      <p className="eyebrow text-brick">{"\u0686\u0631\u0627 \u0627\u06cc\u0646 \u0645\u062d\u0635\u0648\u0644\u0627\u062a\u061f"}</p>
      <h3 className="mt-4 text-2xl font-light tracking-tightest text-forest md:text-3xl">
        {"\u062f\u0644\u06cc\u0644 \u0627\u0646\u062a\u062e\u0627\u0628 \u0642\u0637\u0639\u0627\u062a \u0628\u0631\u0627\u06cc \u0627\u06cc\u0646 \u0641\u0636\u0627"}
      </h3>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-forest/60 md:text-lg">
        {"\u0647\u0631 \u0645\u062d\u0635\u0648\u0644 \u0628\u0631 \u0627\u0633\u0627\u0633 \u0646\u06cc\u0627\u0632 \u0641\u0636\u0627\u060c \u062f\u0648\u0627\u0645 \u0648 \u0647\u0648\u06cc\u062a \u0628\u0635\u0631\u06cc \u067e\u0631\u0648\u0698\u0647 \u0627\u0646\u062a\u062e\u0627\u0628 \u0634\u062f\u0647 \u2014 \u0646\u0647 \u0635\u0631\u0641\u0627 \u0628\u0647\u200c\u062e\u0627\u0637\u0631 \u062a\u0632\u0626\u06cc\u0646\u06cc."}
      </p>

      <div className="mt-10 flex flex-col gap-10 md:gap-12">
        {visible.map((entry, i) => {
          const isPeek = !expanded && i === 1 && hasMore;
          return (
            <ProductEntry
              key={entry.productSlug}
              productSlug={entry.productSlug}
              body={entry.body}
              faded={isPeek}
            />
          );
        })}
      </div>

      {hasMore && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="mt-10 inline-flex items-center gap-2 rounded-xl border border-forest/20 px-6 py-3 text-sm font-medium text-forest transition-colors hover:border-forest hover:bg-forest/5"
        >
          {"\u0645\u062d\u0635\u0648\u0644\u0627\u062a \u0628\u06cc\u0634\u062a\u0631"}
          <span aria-hidden className="text-forest/50">
            ({toFa(products.length - 1)} {"\u0645\u0648\u0631\u062f \u062f\u06cc\u06af\u0631"})
          </span>
        </button>
      )}

      {expanded && (
        <p className="mt-10 text-sm text-forest/50">
          {toFa(products.length)} {"\u0645\u062d\u0635\u0648\u0644 \u062f\u0631 \u0627\u06cc\u0646 \u067e\u0631\u0648\u0698\u0647 \u0628\u0647 \u06a9\u0627\u0631 \u0631\u0641\u062a\u0647 \u0627\u0633\u062a."}
        </p>
      )}
    </div>
  );
}
