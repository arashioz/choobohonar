import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import { interiorBenefits as fallbackBenefits } from "@/data/interior-architecture";
import { INTERIOR_PAGE_DEFAULTS, type InteriorPageContent } from "@/lib/interior-page-content";
import { toFa } from "@/lib/utils";

export default function InteriorBenefitsSection({
  heading = INTERIOR_PAGE_DEFAULTS.benefitsHeading,
  items = fallbackBenefits,
}: {
  heading?: InteriorPageContent["benefitsHeading"];
  items?: typeof fallbackBenefits;
}) {
  return (
    <section className="border-t border-forest/10 bg-paper py-24 md:py-32">
      <Container>
        <FadeUp className="max-w-2xl">
          <p className="eyebrow text-brick">{heading.eyebrow}</p>
          <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-tightest text-forest">
            {heading.title}
          </h2>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <FadeUp key={item.title} delay={index * 0.06} className="border border-forest/10 bg-peach/20 p-6 md:p-8">
              <span className="text-sm font-medium tracking-[0.24em] text-brick">{toFa(index + 1)}</span>
              <h3 className="mt-4 text-xl font-light tracking-tight text-forest">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-forest/68 md:text-base">{item.body}</p>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
