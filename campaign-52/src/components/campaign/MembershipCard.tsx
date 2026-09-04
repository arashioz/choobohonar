import Image from "next/image";
import { type ClubTier } from "@/data/campaign";
import { brandAssets } from "@/lib/brand-assets";
import { cn, toFa } from "@/lib/utils";
import ClubTag from "@/components/campaign/ClubTag";

const surface: Record<ClubTier["tone"], string> = {
  vip: "bg-[linear-gradient(145deg,#061910_0%,#092B1C_48%,#135034_100%)] text-paper",
  gold: "bg-[linear-gradient(145deg,#f6ead8_0%,#e8d3b0_52%,#c4a574_100%)] text-forest",
  silver: "bg-[linear-gradient(145deg,#f4f2ee_0%,#e4e0d8_55%,#c5c1b8_100%)] text-forest",
  guest: "bg-[linear-gradient(145deg,#f7f3ee_0%,#efe8de_100%)] text-forest ring-1 ring-inset ring-forest/10",
};

const gleam: Record<ClubTier["tone"], string> = {
  vip: "rgba(167,216,183,0.16)",
  gold: "rgba(255,236,198,0.62)",
  silver: "rgba(255,255,255,0.5)",
  guest: "rgba(255,255,255,0.42)",
};

export default function MembershipCard({
  tier,
  name,
  compact = false,
  className,
}: {
  tier: ClubTier;
  name?: string;
  compact?: boolean;
  className?: string;
}) {
  const displayName = name?.trim() || "عضو باشگاه";
  const serial = `CH52-${String(tier.rank).padStart(2, "0")}${tier.club ? "C" : "G"}`;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[1.35rem] shadow-[0_18px_40px_rgba(9,43,28,0.12)]",
        surface[tier.tone],
        compact ? "aspect-[1.7] p-5" : "aspect-[1.586] p-6 md:p-7",
        className,
      )}
      style={{
        ["--gleam" as string]: gleam[tier.tone],
        ["--gleam-delay" as string]: `${(tier.rank - 1) * 0.85}s`,
      }}
    >
      <div aria-hidden className="pointer-events-none absolute -left-6 -top-10 h-36 w-36 opacity-[0.12]">
        <Image src={tier.tone === "vip" ? brandAssets.monogram.white : brandAssets.monogram.black} alt="" fill sizes="144px" className="object-contain" />
      </div>
      <span aria-hidden className={cn("card-gleam", tier.tone === "vip" && "card-gleam-soft")} />
      <div className="relative flex h-full flex-col justify-between">
        <ClubTag tier={tier} invert={tier.tone === "vip"} size={compact ? "sm" : "md"} />
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 text-start">
            <p className="text-[10px] tracking-[0.2em] opacity-45">MEMBER</p>
            <p className={cn("mt-1 font-light tracking-tight", compact ? "text-lg" : "text-xl md:text-2xl")}>{displayName}</p>
            <p className="mt-2 text-right font-mono text-[10px] tracking-[0.18em] opacity-45" dir="ltr">
              {serial}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end text-left">
            <Chip invert={tier.tone === "vip"} />
            <p className={cn("mt-2 text-left text-[10px] tracking-[0.18em]", tier.tone === "vip" ? "text-peach" : "opacity-55")}>
              {toFa(52)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function Chip({ invert }: { invert?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative block h-8 w-[2.65rem] overflow-hidden rounded-[6px]",
        invert ? "bg-gradient-to-br from-peach/80 to-[#c4a574]" : "bg-gradient-to-br from-[#d7c39a] to-[#a8884e]",
      )}
    >
      <span className="absolute inset-[3px] rounded-[3px] border border-forest/20" />
      <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-forest/15" />
      <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-forest/15" />
    </span>
  );
}
