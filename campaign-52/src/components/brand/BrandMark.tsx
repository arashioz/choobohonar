import { brand } from "@/data/campaign";
import { brandAssets } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  invert?: boolean;
  adaptive?: boolean;
  solid?: boolean;
  size?: "header" | "footer";
  className?: string;
};

export default function BrandMark({
  invert = false,
  adaptive = false,
  solid = false,
  size = "header",
  className,
}: BrandMarkProps) {
  const showBlack = adaptive ? solid : !invert;
  const showWhite = adaptive ? !solid : invert;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-[calc(var(--brand-x)*0.28)]",
        size === "header" &&
          "[--brand-x:2.25rem] sm:[--brand-x:2.5rem] [--brand-word:5.75rem] sm:[--brand-word:6.5rem]",
        size === "footer" && "[--brand-x:2.75rem] [--brand-word:11.25rem]",
        className,
      )}
    >
      <span className="relative block h-[var(--brand-x)] w-[calc(var(--brand-x)*1.06)] shrink-0">
        <Layer src={brandAssets.monogram.white} visible={showWhite} />
        <Layer src={brandAssets.monogram.black} visible={showBlack} />
      </span>
      <span className="relative block h-[var(--brand-x)] w-[var(--brand-word)] shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brandAssets.wordmarkFa.white}
          alt=""
          aria-hidden
          width={260}
          height={110}
          className={cn(
            "absolute inset-0 h-full w-full object-contain object-right transition-opacity duration-300",
            showWhite ? "opacity-100" : "opacity-0",
          )}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brandAssets.wordmarkFa.black}
          alt={showBlack ? brand.nameFa : ""}
          width={260}
          height={110}
          className={cn(
            "absolute inset-0 h-full w-full object-contain object-right transition-opacity duration-300",
            showBlack ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    </span>
  );
}

function Layer({ src, visible }: { src: string; visible: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      width={175}
      height={165}
      className={cn(
        "absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
