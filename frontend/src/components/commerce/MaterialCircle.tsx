import Image from "next/image";
import { isUploadedMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

export default function MaterialCircle({
  src,
  alt,
  className,
  zoom = false,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Crop to the middle of a studio photo so the white margin stays outside the circle. */
  zoom?: boolean;
}) {
  if (!src) return null;
  return (
    <span className={cn("relative block size-full overflow-hidden rounded-full", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="36px"
        unoptimized={isUploadedMedia(src)}
        className={cn("object-cover object-center", zoom && "scale-[2.4]")}
      />
    </span>
  );
}
