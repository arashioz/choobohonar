import { brand } from "@/data/nav";
import { brandAssets } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

type BrandMarkSize = "header" | "footer";

type BrandMarkProps = {
  /** White lockup on dark grounds; black on light. */
  invert?: boolean;
  /** Header fades between tones as the bar turns solid. */
  adaptive?: boolean;
  solid?: boolean;
  size?: BrandMarkSize;
  className?: string;
  priority?: boolean;
};

/**
 * Horizontal FA lockup: monogram + wordmark.
 * --brand-x is the mark height (brandbook unit X). Internal gap is 0.28X.
 * Do not use lockupFa SVGs — their viewBox crops to the wordmark band.
 */
export default function BrandMark({
  invert = false,
  adaptive = false,
  solid = false,
  size = "header",
  className,
  priority = false,
}: BrandMarkProps) {
  const showBlack = adaptive ? solid : !invert;
  const showWhite = adaptive ? !solid : invert;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-[calc(var(--brand-x)*0.28)]",
        size === "header" && "[--brand-x:2.25rem] sm:[--brand-x:2.5rem] [--brand-word:5.75rem] sm:[--brand-word:6.5rem]",
        size === "footer" && "[--brand-x:2.75rem] [--brand-word:11.25rem]",
        className,
      )}
    >
      <span className="relative block h-[var(--brand-x)] w-[calc(var(--brand-x)*1.06)] shrink-0">
        <Layer src={brandAssets.monogram.white} visible={showWhite} priority={priority} />
        <Layer src={brandAssets.monogram.black} visible={showBlack} />
      </span>
      <span className="relative block h-[var(--brand-x)] w-[var(--brand-word)] shrink-0">
        {/* Native img — Next/Image squashes the two-line FA wordmark. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brandAssets.wordmarkFa.white}
          alt=""
          aria-hidden
          width={260}
          height={110}
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-contain object-right transition-opacity duration-300",
            showWhite ? "opacity-100" : "opacity-0",
          )}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brandAssets.wordmarkFa.black}
          alt={adaptive || !invert ? brand.nameFa : ""}
          aria-hidden={invert && !adaptive}
          width={260}
          height={110}
          decoding="async"
          className={cn(
            "absolute inset-0 h-full w-full object-contain object-right transition-opacity duration-300",
            showBlack ? "opacity-100" : "opacity-0",
          )}
        />
      </span>
    </span>
  );
}

function Layer({
  src,
  visible,
  priority = false,
}: {
  src: string;
  visible: boolean;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      aria-hidden
      width={175}
      height={165}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn(
        "absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
