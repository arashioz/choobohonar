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
        size === "header" && "h-7 w-32 sm:h-8 sm:w-36",
        size === "footer" && "h-20 w-96",
        className,
      )}
    >
      <Layer src={brandAssets.logo.white} visible={showWhite} size={size} priority={priority} />
      <Layer src={brandAssets.logo.black} visible={showBlack} size={size} alt={brand.nameFa} />
    </span>
  );
}
function Layer({
  src,
  visible,
  size,
  alt = "",
  priority = false,
}: {
  src: string;
  visible: boolean;
  size: BrandMarkSize;
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
        "absolute left-1/2 top-[45%] max-w-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300",
        size === "header" ? "w-[100%]" : "w-[102%]",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
