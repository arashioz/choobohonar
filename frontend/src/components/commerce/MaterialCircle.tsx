import Image from "next/image";
import { isUploadedMedia } from "@/lib/media";
import { cn } from "@/lib/utils";

export default function MaterialCircle({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
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
        className="object-cover"
      />
    </span>
  );
}
