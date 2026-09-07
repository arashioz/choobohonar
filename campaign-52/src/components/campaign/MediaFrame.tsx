import { cn } from "@/lib/utils";
import { landingPublicPath } from "@/lib/brand-assets";
import ClipReveal from "@/components/motion/ClipReveal";
import Parallax from "@/components/motion/Parallax";

export default function MediaFrame({
  src,
  alt,
  sizes,
  className,
  aspect = "aspect-[16/10]",
  delay = 0,
  parallax = true,
  rounded = true,
  fit = "cover",
  imageClassName,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  aspect?: string;
  delay?: number;
  parallax?: boolean;
  rounded?: boolean;
  fit?: "cover" | "contain";
  imageClassName?: string;
}) {
  const imageSrc = /^https?:\/\//i.test(src) ? src : landingPublicPath(src);

  return (
    <ClipReveal delay={delay} className={cn("group overflow-hidden", rounded ? "rounded-[1.75rem]" : "rounded-none", className)}>
      <div className={cn("relative overflow-hidden", fit === "contain" ? "bg-[#e7e7e8]" : "bg-sand", aspect)}>
        {parallax ? (
          <Parallax speed={32} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={alt}
              loading="lazy"
              sizes={sizes}
              className={cn(
                "absolute inset-0 h-full w-full object-center transition-transform duration-[1400ms] ease-out-expo will-change-transform group-hover:scale-[1.03]",
                fit === "contain" ? "object-contain" : "object-cover",
                imageClassName,
              )}
            />
          </Parallax>
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={alt}
              loading="lazy"
              sizes={sizes}
              className={cn("media-hover absolute inset-0 h-full w-full object-center", fit === "contain" ? "object-contain" : "object-cover", imageClassName)}
            />
          </>
        )}
      </div>
    </ClipReveal>
  );
}
