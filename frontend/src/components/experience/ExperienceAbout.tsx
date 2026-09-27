import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import { aboutPage } from "@/data/about";
import { toFa } from "@/lib/utils";

export default function ExperienceAbout() {
  return (
    <section className="bg-paper text-forest">
      <div className="relative overflow-hidden bg-forest text-paper">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_12%,rgba(232,184,138,0.2),transparent_34%)]"
        />
        <Container className="relative grid items-end gap-12 py-24 md:py-32 lg:grid-cols-12">
          <FadeUp className="lg:col-span-7">
            <p className="eyebrow text-peach">{aboutPage.eyebrow}</p>
            <h2 className="mt-6 max-w-3xl text-balance text-[clamp(3.2rem,8vw,6.5rem)] font-extralight leading-[0.9] tracking-tightest">
              {aboutPage.title}
            </h2>
          </FadeUp>
          <FadeUp delay={0.08} className="lg:col-span-5">
            <p className="max-w-md text-pretty text-base leading-8 text-paper/72 md:text-lg">{aboutPage.intro[0]}</p>
          </FadeUp>
        </Container>
      </div>

      <Container className="py-20 md:py-28">
        <p className="max-w-3xl text-pretty text-lg leading-9 text-forest/72">{aboutPage.intro[1]}</p>

        <div className="mt-16 grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="eyebrow text-brick">{aboutPage.distinction.title}</p>
            <p className="mt-5 text-pretty text-2xl font-light leading-snug text-forest">{aboutPage.distinction.body}</p>
          </div>
          <ol className="divide-y divide-forest/10 border-y border-forest/10 lg:col-span-8">
            {aboutPage.distinction.items.map((item, index) => (
              <li key={item} className="grid grid-cols-[auto_1fr] gap-6 py-7 md:gap-10">
                <span className="pt-1 text-sm text-brick">{toFa(String(index + 1).padStart(2, "0"))}</span>
                <p className="text-lg leading-8 text-forest/78">{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>

      <div className="border-t border-forest/10 bg-[#f4efe8]">
        <Container className="grid gap-10 py-16 md:grid-cols-12 md:py-24">
          <h3 className="text-balance text-[clamp(2rem,4vw,3.25rem)] font-extralight leading-none tracking-tightest md:col-span-4">
            {aboutPage.factory.title}
          </h3>
          <div className="md:col-span-8">
            <p className="max-w-2xl text-pretty text-base leading-8 text-forest/70">{aboutPage.factory.body}</p>
            <ul className="mt-10 grid gap-px overflow-hidden border border-forest/10 bg-forest/10 sm:grid-cols-2">
              {aboutPage.factory.facts.map((fact) => (
                <li key={fact} className="bg-[#f4efe8] px-5 py-6 text-sm leading-7 text-forest/75">
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </section>
  );
}
