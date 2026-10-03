import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";
import { consultationChannels as fallbackChannels } from "@/data/interior-architecture";
import { INTERIOR_PAGE_DEFAULTS, type InteriorPageContent } from "@/lib/interior-page-content";

export default function InteriorConsultationCta({
  heading = INTERIOR_PAGE_DEFAULTS.consultation,
  channels = fallbackChannels,
}: {
  heading?: InteriorPageContent["consultation"];
  channels?: typeof fallbackChannels;
}) {
  return (
    <section className="bg-peach py-24 text-forest md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeUp className="lg:col-span-5">
            <p className="eyebrow text-brick">{heading.eyebrow}</p>
            <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.75rem)] font-light leading-[1.02] tracking-tightest">
              {heading.title}
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-forest/70">{heading.body}</p>
            <div className="mt-10">
              <Button href={heading.ctaHref} variant="primary" showArrow>
                {heading.ctaLabel}
              </Button>
            </div>
          </FadeUp>

          <div className="grid gap-4 lg:col-span-6 lg:col-start-7">
            {channels.map((channel, index) => (
              <FadeUp
                key={channel.title}
                delay={index * 0.06}
                className="border border-forest/10 bg-paper/55 p-6 md:p-8"
              >
                <h3 className="text-xl font-light tracking-tight">{channel.title}</h3>
                <p className="mt-3 text-sm leading-7 text-forest/68 md:text-base">{channel.body}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
