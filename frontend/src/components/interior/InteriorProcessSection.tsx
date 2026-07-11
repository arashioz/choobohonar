import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import { interiorProcessSteps } from "@/data/interior-architecture";
import { toFa } from "@/lib/utils";

export default function InteriorProcessSection() {
  return (
    <section className="bg-forest py-24 text-paper md:py-32">
      <Container>
        <FadeUp className="max-w-2xl">
          <p className="eyebrow text-peach">فرآیند اجرا</p>
          <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.5rem)] font-light leading-[1.05] tracking-tightest">
            گام‌به‌گام در فرآیند اجرای پروژه
          </h2>
        </FadeUp>

        <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-paper/10 bg-paper/10 md:grid-cols-2">
          {interiorProcessSteps.map((step, index) => (
            <FadeUp
              key={step.n}
              delay={index * 0.05}
              className="flex flex-col justify-between bg-forest p-8 md:min-h-[16rem] md:p-10"
            >
              <span className="font-sans text-[clamp(3rem,8vw,5rem)] font-light leading-none text-peach/90">
                {toFa(step.n)}
              </span>
              <div className="mt-8">
                <h3 className="text-2xl font-light tracking-tight">{step.title}</h3>
                <p className="mt-3 max-w-md text-sm leading-7 text-paper/72 md:text-base">{step.body}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </Container>
    </section>
  );
}
