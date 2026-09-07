import { brand } from "@/data/nav";
import { brandAssets } from "@/lib/brand-assets";
import { cn } from "@/lib/utils";

type BrandMarkSize = "header" | "footer";

type BrandMarkProps = {
  /** White logo on dark grounds; black on light. */
  invert?: boolean;
  /** Header fades between tones as the bar turns solid. */
  adaptive?: boolean;
  solid?: boolean;
  size?: BrandMarkSize;
  className?: string;
  priority?: boolean;
};

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
        "relative inline-block overflow-hidden",
        size === "header" && "h-9 w-32 sm:h-10 sm:w-36",
        size === "footer" && "h-11 w-60",
        className,
      )}
    >
      <Layer src={brandAssets.logo.white} visible={showWhite} priority={priority} />
      <Layer src={brandAssets.logo.black} visible={showBlack} alt={brand.nameFa} />
    </span>
  );
}
function Layer({
  src,
  visible,
  alt = "",
  priority = false,
}: {
  src: string;
  visible: boolean;
  alt?: string;
  priority?: boolean;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      aria-hidden={!alt}
      width={3509}
      height={2482}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn(
        "absolute left-1/2 top-1/2 w-[175%] max-w-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
