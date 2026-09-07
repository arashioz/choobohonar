import { brand } from "@/data/campaign";
import { brandAssets, landingPublicPath } from "@/lib/brand-assets";
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
        "relative inline-block max-w-full overflow-hidden",
        size === "header" && "h-7 w-24 min-[400px]:h-8 min-[400px]:w-28 sm:h-10 sm:w-36",
        size === "footer" && "h-12 w-60",
        className,
      )}
    >
      <Layer src={brandAssets.logo.white} visible={showWhite} />
      <Layer src={brandAssets.logo.black} visible={showBlack} alt={brand.nameFa} />
    </span>
  );
}
function Layer({ src, visible, alt = "" }: { src: string; visible: boolean; alt?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={landingPublicPath(src)}
      alt={alt}
      aria-hidden={!alt}
      width={3509}
      height={2482}
      decoding="async"
      className={cn(
        "absolute left-1/2 top-1/2 w-[175%] max-w-none -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0",
      )}
    />
  );
}
