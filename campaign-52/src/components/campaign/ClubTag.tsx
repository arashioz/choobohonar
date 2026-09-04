import { cn } from "@/lib/utils";
import type { ClubTier } from "@/data/campaign";

const metal: Record<ClubTier["tone"], string> = {
  vip: "from-[#f7d7c4] via-[#FBBEA6] to-[#e8a07a] text-forest",
  gold: "from-[#efe0c4] via-[#c4a574] to-[#a8884e] text-forest",
  silver: "from-[#f3f1ec] via-[#cfcbc3] to-[#9e9a91] text-forest",
  guest: "from-paper via-sand to-[#ddd4c8] text-forest/80",
};

const metalOnDark: Record<ClubTier["tone"], string> = {
  vip: "from-peach/25 via-peach/10 to-transparent text-peach ring-1 ring-peach/35",
  gold: "from-[#e4c9a0]/25 via-[#c4a574]/10 to-transparent text-[#e4c9a0] ring-1 ring-[#c4a574]/35",
  silver: "from-paper/15 via-paper/5 to-transparent text-paper/85 ring-1 ring-paper/20",
  guest: "from-paper/8 to-transparent text-paper/70 ring-1 ring-paper/15",
};

export default function ClubTag({
  tier,
  invert = false,
  size = "md",
  className,
}: {
  tier: ClubTier;
  invert?: boolean;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-gradient-to-l font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
        invert ? metalOnDark[tier.tone] : metal[tier.tone],
        size === "sm" ? "px-2.5 py-1" : "px-3.5 py-1.5",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.7)]",
          size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
          invert ? "bg-current" : "bg-forest/55",
        )}
      />
      <span className={cn("tracking-[0.22em]", size === "sm" ? "text-[9px]" : "text-[10px]")}>{tier.labelEn}</span>
      <span className="h-3 w-px bg-current/25" aria-hidden />
      <span className={cn(size === "sm" ? "text-[10px]" : "text-[11px]")}>{tier.labelFa}</span>
    </span>
  );
}
