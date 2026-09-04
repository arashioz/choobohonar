import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";

export default function JoinSection() {
  return (
    <section id="join" className="bg-sand/40 py-20 md:py-28">
      <Container>
        <FadeUp className="max-w-2xl">
          <p className="eyebrow text-brick">باشگاه مشتریان</p>
          <h2 className="display-title mt-4 text-[clamp(1.85rem,3.6vw,3.15rem)] text-forest">
            عضویت را در شعبه کامل کنید
          </h2>
          <p className="mt-5 text-[15px] leading-8 text-forest/65 md:text-base">
            سهم بیشتر مال اعضای باشگاه است. در شوروم بگویید عضوید — یا همان‌جا به باشگاه بپیوندید.
          </p>
        </FadeUp>
      </Container>
    </section>
  );
}
