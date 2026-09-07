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
        size === "header" && "h-10 w-32 min-[400px]:w-36 sm:h-11 sm:w-40",
        size === "footer" && "h-14 w-56",
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
