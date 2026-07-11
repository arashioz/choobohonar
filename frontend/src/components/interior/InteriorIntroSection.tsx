import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import { interiorIntro } from "@/data/interior-architecture";

export default function InteriorIntroSection() {
  return (
    <section className="bg-paper py-24 md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <FadeUp className="lg:col-span-4">
            <p className="eyebrow text-brick">{interiorIntro.eyebrow}</p>
            <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tightest text-forest">
              {interiorIntro.title}
            </h2>
          </FadeUp>
          <FadeUp delay={0.08} className="lg:col-span-7 lg:col-start-6">
            <p className="text-pretty text-lg leading-relaxed text-forest/70 md:text-xl">{interiorIntro.body}</p>
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
