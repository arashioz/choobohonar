import { campaign } from "@/data/campaign";
import { toFa } from "@/lib/utils";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import MediaFrame from "@/components/campaign/MediaFrame";

const stats = [
  { value: "۱۳۵۳", label: "آغاز مسیر" },
  { value: "۱۳۸۵", label: "شکل‌گیری برند" },
  { value: toFa(52), label: "۵۲ سال همراهی" },
];

export default function StorySection() {
  return (
    <section id="story" className="bg-paper py-20 md:py-28">
      <Container>
        <div className="grid items-start gap-16 lg:grid-cols-12 lg:gap-20">
          <FadeUp className="lg:col-span-5">
            <p className="eyebrow text-brick">میراث</p>
            <h2 className="display-title mt-4 text-[clamp(1.85rem,3.6vw,3.15rem)] text-forest">
              {campaign.slogan}
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-forest/65 md:text-base">{campaign.heritage}</p>
            <p className="mt-5 text-[15px] leading-8 text-forest/65 md:text-base">{campaign.definitionLong}</p>
            <dl className="mt-10 grid grid-cols-3 gap-4">
              {stats.map((item) => (
                <div key={item.label}>
                  <dt className="text-[11px] leading-5 text-forest/45">{item.label}</dt>
                  <dd className="mt-1 text-xl font-light tracking-tight text-forest">{item.value}</dd>
                </div>
              ))}
            </dl>
          </FadeUp>

          <div className="lg:col-span-7">
            <MediaFrame
              src="/images/heritage.jpg"
              alt="میراث خانه چوب و هنر"
              sizes="(min-width: 1024px) 55vw, 100vw"
              aspect="aspect-[5/4] md:aspect-[16/10]"
              rounded={false}
              className="rounded-none"
            />
            <FadeUp delay={0.08} className="mt-10 max-w-xl">
              <p className="eyebrow text-brick">{campaign.tributeTitle}</p>
              <p className="mt-5 text-[17px] font-light leading-9 text-forest md:text-xl md:leading-10">
                {campaign.tribute}
              </p>
            </FadeUp>
          </div>
        </div>
      </Container>
    </section>
  );
}
