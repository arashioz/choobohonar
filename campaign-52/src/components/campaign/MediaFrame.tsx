import Image from "next/image";
import { cn } from "@/lib/utils";
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
  return (
    <ClipReveal delay={delay} className={cn("group overflow-hidden", rounded ? "rounded-[1.75rem]" : "rounded-none", className)}>
      <div className={cn("relative overflow-hidden", fit === "contain" ? "bg-[#e7e7e8]" : "bg-sand", aspect)}>
        {parallax ? (
          <Parallax speed={32} className="absolute inset-0">
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              className={cn(
                "object-center transition-transform duration-[1400ms] ease-out-expo will-change-transform group-hover:scale-[1.03]",
                fit === "contain" ? "object-contain" : "object-cover",
                imageClassName,
              )}
            />
          </Parallax>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            className={cn("media-hover object-center", fit === "contain" ? "object-contain" : "object-cover", imageClassName)}
          />
        )}
      </div>
    </ClipReveal>
  );
}
