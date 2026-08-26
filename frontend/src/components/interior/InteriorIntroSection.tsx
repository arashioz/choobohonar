import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import InteriorIntroSlider from "@/components/interior/InteriorIntroSlider";
import { interiorIntro as fallbackIntro, interiorStyles as fallbackStyles } from "@/data/interior-architecture";

export default function InteriorIntroSection({
  content = fallbackIntro,
  styles = fallbackStyles,
}: {
  content?: typeof fallbackIntro;
  styles?: typeof fallbackStyles;
}) {
  return (
    <section className="bg-paper py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-16">
          <FadeUp className="lg:col-span-5">
            <p className="eyebrow text-brick">{content.eyebrow}</p>
            <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tightest text-forest">
              {content.title}
            </h2>
            <InteriorIntroSlider styles={styles} />
          </FadeUp>
          <FadeUp delay={0.08} className="lg:col-span-6 lg:col-start-7 lg:pt-16">
            <p className="text-pretty text-lg leading-relaxed text-forest/70 md:text-xl">{content.body}</p>
            <p className="mt-6 text-pretty text-base leading-relaxed text-forest/60">
              در انتخاب سایز و مدل مناسب مبلمان برای نشیمن خانه‌ی نو تردید دارید؟ به دنبال فرشی هستید که با دیگر وسایل
              خانه جور دربیاید؟ برای چیدن دفتر کار خود به نظر یک کارشناس حرفه‌ای احتیاج دارید؟ تیم معماری داخلی خانه
              چوب و هنر در کنار شماست.
            </p>
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
