import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import ProductStoriesRail, { type ProductStory } from "@/components/commerce/ProductStoriesRail";

export default function ProductStoriesSection({ stories }: { stories: ProductStory[] }) {
  if (!stories.length) return null;

  return (
    <section className="overflow-hidden bg-forest py-16 text-paper md:py-20">
      <Container>
        {stories.length === 1 ? (
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:gap-16">
            <FadeUp>
              <p className="eyebrow text-peach">Product Stories</p>
              <h2 className="mt-6 text-[clamp(2.8rem,6vw,6rem)] font-extralight leading-[0.9] tracking-tightest">
                نزدیک‌تر
                <br />
                از همیشه
              </h2>
            </FadeUp>
            <ProductStoriesRail stories={stories} compact />
          </div>
        ) : (
          <>
            <FadeUp>
              <p className="eyebrow text-peach">Product Stories</p>
              <h2 className="mt-6 text-[clamp(2.8rem,6vw,6rem)] font-extralight leading-[0.9] tracking-tightest">
                نزدیک‌تر
                <br />
                از همیشه
              </h2>
            </FadeUp>
            <ProductStoriesRail stories={stories} />
          </>
        )}
      </Container>
    </section>
  );
}
