import Image from "next/image";
import { eligibleGoods, campaign, stores, googleMapsUrl } from "@/data/campaign";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import ClipReveal from "@/components/motion/ClipReveal";
import Stagger from "@/components/motion/Stagger";
import MediaFrame from "@/components/campaign/MediaFrame";
import Parallax from "@/components/motion/Parallax";

export default function GoodsAndScope() {
  return (
    <>
      <section id="goods" className="bg-paper py-20 md:py-28">
        <Container>
          <FadeUp className="max-w-2xl">
            <p className="eyebrow text-brick">خرج اعتبار</p>
            <h2 className="display-title mt-4 text-[clamp(1.85rem,3.6vw,3.15rem)] text-forest">
              اکسسوری، کالای خواب و تشک
            </h2>
            <p className="mt-5 text-[15px] leading-8 text-forest/65 md:text-base">{campaign.purchaseNote}</p>
          </FadeUp>
          <div className="mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6">
            {eligibleGoods.map((item, index) => (
              <FadeUp key={item.id} delay={index * 0.08} className="group">
                <a href={item.href} target="_blank" rel="noreferrer" className="block">
                  <MediaFrame
                    src={item.image}
                    alt={item.title}
                    sizes="(min-width: 768px) 30vw, 100vw"
                    aspect="aspect-square"
                    delay={index * 0.05}
                    fit={item.id === "mattress" ? "contain" : "cover"}
                    parallax={item.id !== "mattress"}
                  />
                  <div className="px-1 pt-5">
                    <h3 className="text-xl font-light tracking-tight text-forest">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-forest/65">{item.body}</p>
                  </div>
                </a>
              </FadeUp>
            ))}
          </div>
        </Container>
      </section>

      <section id="scope" className="bg-paper">
        <div className="relative h-[78svh] min-h-[32rem] w-full overflow-hidden">
          <Parallax speed={56} className="absolute inset-[-10%]">
            <Image
              src="/images/showroom.jpg"
              alt="شوروم خانه چوب و هنر"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </Parallax>
          <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/55 to-forest/15" />
          <div className="absolute inset-0 flex flex-col justify-end">
            <Container className="pb-16 md:pb-24">
              <div className="max-w-xl">
                <FadeUp>
                  <p className="eyebrow text-peach">شعب و نمایندگی‌ها</p>
                </FadeUp>
                <ClipReveal className="mt-4" delay={0.08}>
                  <h2 className="display-title text-[clamp(1.85rem,3.6vw,3.15rem)] text-paper">
                    همین قاعده، در تمام خانه‌های ما
                  </h2>
                </ClipReveal>
                <FadeUp delay={0.16}>
                  <p className="mt-5 text-[15px] leading-8 text-paper/75 md:text-base">{campaign.scope}</p>
                </FadeUp>
              </div>
            </Container>
          </div>
        </div>
        <Container className="py-16 md:py-24">
          <Stagger className="grid gap-px overflow-hidden rounded-[1.75rem] bg-forest/10 sm:grid-cols-2 lg:grid-cols-3" amount={0.28}>
            {stores.map((store) => (
              <div key={store.id} className="bg-paper p-6">
                <p className="text-[10px] tracking-[0.22em] text-forest/40">{store.city}</p>
                <h3 className="mt-2 text-lg font-light text-forest">{store.name}</h3>
                <p className="mt-2 text-sm leading-7 text-forest/60">{store.address}</p>
                {store.hours ? <p className="mt-1 text-xs text-forest/40">{store.hours}</p> : null}
                <a
                  href={googleMapsUrl(store.mapsQuery)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-brick transition-colors hover:text-forest"
                >
                  مسیریابی در گوگل‌مپ
                  <span aria-hidden>←</span>
                </a>
              </div>
            ))}
          </Stagger>
        </Container>
      </section>
    </>
  );
}
