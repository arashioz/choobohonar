import type { Product } from "@/data/products";
import { toFa } from "@/lib/utils";
import FadeUp from "@/components/motion/FadeUp";

export default function ProductHighlights({ product }: { product: Product }) {
  return (
    <div className="grid grid-cols-1 gap-px overflow-hidden border border-forest/10 bg-forest/10 md:grid-cols-3">
      {product.highlights.map((h, i) => (
        <FadeUp key={h.title} delay={i * 0.08} className="flex flex-col gap-3 bg-paper p-8">
          <span className="font-display text-2xl text-brick">{toFa(String(i + 1).padStart(2, "0"))}</span>
          <h3 className="text-xl font-light tracking-tight text-forest">{h.title}</h3>
          <p className="text-sm leading-relaxed text-forest/65">{h.description}</p>
        </FadeUp>
      ))}
    </div>
  );
}
