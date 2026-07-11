import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Button from "@/components/ui/Button";
import { consultationChannels } from "@/data/interior-architecture";

export default function InteriorConsultationCta() {
  return (
    <section className="bg-peach py-24 text-forest md:py-32">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <FadeUp className="lg:col-span-5">
            <p className="eyebrow text-brick">شروع همکاری</p>
            <h2 className="mt-6 text-balance text-[clamp(2rem,4vw,3.75rem)] font-light leading-[1.02] tracking-tightest">
              چیدمان فضای محبوبت را به ما بسپار
            </h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-forest/70">
              برای ثبت سفارش طراحی داخلی، فرم هوشمند را تکمیل کنید تا سلیقه و نیازهای فنی شما را بهتر بشناسیم؛ یا
              مستقیماً با کارشناسان ما در تماس باشید.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button href="/interior-architecture-services/order" variant="primary" showArrow>
                شروع فرم سفارش
              </Button>
              <Button href="/contact?intent=services" variant="secondary">
                تماس با کارشناس
              </Button>
            </div>
          </FadeUp>

          <div className="grid gap-4 lg:col-span-6 lg:col-start-7">
            {consultationChannels.map((channel, index) => (
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
