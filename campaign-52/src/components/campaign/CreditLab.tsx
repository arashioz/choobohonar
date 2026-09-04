"use client";

import { useMemo, useState } from "react";
import { clubTiers, campaign } from "@/data/campaign";
import { computeShare, PURCHASE_UNIT } from "@/lib/credit";
import { toFa } from "@/lib/utils";
import Container from "@/components/layout/Container";
import FadeUp from "@/components/motion/FadeUp";
import MembershipCard from "@/components/campaign/MembershipCard";

const MAX = 2000;

export default function CreditLab() {
  const [amount, setAmount] = useState(770);
  const result = useMemo(() => computeShare(amount), [amount]);
  const current = clubTiers.find((item) => item.id === result.tier)!;
  const fill = Math.min(100, (amount / MAX) * 100);

  return (
    <section id="share" className="bg-forest py-20 text-paper md:py-28">
      <Container>
        <FadeUp className="max-w-xl">
          <p className="eyebrow text-peach">سهم ۵۲</p>
          <h2 className="display-title mt-4 text-[clamp(1.85rem,3.6vw,3.15rem)]">
            سهم خود را بسنجید
          </h2>
          <p className="mt-5 text-[15px] leading-8 text-paper/70 md:text-base">{campaign.shareLead}</p>
        </FadeUp>

        <div className="mt-14 grid items-end gap-12 lg:grid-cols-12 lg:gap-20">
          <FadeUp className="lg:col-span-7">
            <div className="flex items-end justify-between gap-6">
              <label className="eyebrow text-peach/75" htmlFor="purchase-amount">
                خرید
              </label>
              <span className="text-[10px] tracking-[0.22em] text-paper/30">میلیون تومان</span>
            </div>

            <div className="relative mt-3">
              <p className="pointer-events-none text-[clamp(4.2rem,14vw,7rem)] font-extralight leading-none tracking-tight text-paper">
                {toFa(amount)}
              </p>
              <input
                id="purchase-amount"
                type="number"
                min={0}
                max={MAX}
                step={10}
                value={amount}
                onChange={(e) => setAmount(Math.min(MAX, Math.max(0, Number(e.target.value) || 0)))}
                className="share-amount absolute inset-0 cursor-text opacity-0"
                aria-label="مبلغ خرید قطعی به میلیون تومان"
              />
            </div>

            <input
              type="range"
              min={0}
              max={MAX}
              step={10}
              dir="ltr"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="share-range mt-8 w-full"
              aria-label="تنظیم مبلغ خرید"
              style={{
                background: `linear-gradient(to right, #FBBEA6 ${fill}%, rgba(244,239,232,0.14) ${fill}%)`,
              }}
            />

            <div className="mt-10 flex items-end justify-between gap-8">
              <div>
                <p className="text-[10px] tracking-[0.28em] text-paper/30">سطح</p>
                <p className="mt-2 text-[1.65rem] font-light leading-none tracking-tight text-peach">{current.labelFa}</p>
                <p className="mt-2 text-[11px] text-paper/35">
                  {result.units > 0
                    ? `${toFa(result.units)} × ${toFa(result.creditPerUnit)}`
                    : `تا ${toFa(PURCHASE_UNIT)}`}
                </p>
              </div>
              <div className="text-left">
                <p className="text-[10px] tracking-[0.28em] text-paper/30">اعتبار</p>
                <p
                  key={`${result.tier}-${result.credit}`}
                  className="mt-1 font-extralight leading-none tracking-tight text-paper"
                  style={{ fontSize: "clamp(3.4rem, 11vw, 5.6rem)" }}
                >
                  {toFa(result.credit)}
                </p>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.08} className="lg:col-span-5">
            <MembershipCard tier={current} name="باشگاه مشتریان" />
          </FadeUp>
        </div>
      </Container>
    </section>
  );
}
