import { clubTiers, campaign } from "@/data/campaign";
import { toFa, toFaMoney } from "@/lib/utils";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import Stagger from "@/components/motion/Stagger";
import ClubTag from "@/components/campaign/ClubTag";
import MembershipCard from "@/components/campaign/MembershipCard";

const rowTone: Record<string, string> = {
  vip: "bg-forest text-paper",
  gold: "bg-[#f6ead8] text-forest",
  silver: "bg-[#f0eeea] text-forest",
  guest: "bg-paper text-forest",
};

export default function TiersSection() {
  return (
    <section id="tiers" className="bg-sand/60 py-20 md:py-28">
      <Container>
        <FadeUp className="max-w-2xl">
          <p className="eyebrow text-brick">باشگاه مشتریان</p>
          <h2 className="display-title mt-4 text-[clamp(1.85rem,3.6vw,3.15rem)] text-forest">
            سطح باشگاه، سهم شما را می‌سازد
          </h2>
          <p className="mt-5 text-[15px] leading-8 text-forest/65 md:text-base">{campaign.tiersLead}</p>
        </FadeUp>

        <Stagger className="mt-14 grid gap-10 md:grid-cols-2 md:gap-x-8 md:gap-y-12 xl:grid-cols-4 xl:gap-x-10" amount={0.4}>
          {clubTiers.map((tier) => (
            <div key={tier.id} className="flex flex-col gap-3">
              <MembershipCard tier={tier} />
              <div className="flex items-end justify-between gap-4 px-1">
                <p className="max-w-[11rem] text-sm leading-6 text-forest/60">{tier.blurb}</p>
                <p className="shrink-0 text-end">
                  <span className="block text-[11px] text-forest/40">هر {toFa(200)} میلیون</span>
                  <span className="mt-0.5 block text-[1.65rem] font-light leading-none tracking-tight text-forest">
                    {toFa(tier.creditPerUnit)}
                    <span className="ms-1 text-sm text-forest/45">میلیون</span>
                  </span>
                </p>
              </div>
            </div>
          ))}
        </Stagger>

        <FadeUp className="mt-16 hidden overflow-hidden rounded-3xl bg-paper md:block">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 text-right">
            <caption className="sr-only">جدول تخصیص اعتبار خرید بر اساس سطح باشگاه</caption>
            <thead>
              <tr className="text-[11px] tracking-[0.16em] text-forest/45">
                <th className="px-6 py-4 font-medium">گروه مشتری</th>
                <th className="px-6 py-4 font-medium">سطح باشگاه</th>
                <th className="px-6 py-4 font-medium">مبنای خرید</th>
                <th className="px-6 py-4 font-medium">تخصیص اعتبار</th>
              </tr>
            </thead>
            <tbody>
              {clubTiers.map((tier) => (
                <tr key={tier.id} className={rowTone[tier.tone]}>
                  <td className="px-6 py-5 text-sm opacity-75 first:rounded-s-2xl">{tier.groupFa}</td>
                  <td className="px-6 py-5">
                    <ClubTag tier={tier} invert={tier.tone === "vip"} />
                  </td>
                  <td className="px-6 py-5 text-sm opacity-75">هر {toFaMoney(200)}</td>
                  <td className="px-6 py-5 text-lg font-light last:rounded-e-2xl">{toFaMoney(tier.creditPerUnit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="border-t border-forest/8 px-6 py-4 text-xs leading-6 text-forest/50">{campaign.unitNote}</p>
        </FadeUp>
      </Container>
    </section>
  );
}
