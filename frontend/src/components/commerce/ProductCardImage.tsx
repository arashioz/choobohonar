"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

const STOPS = 12;

type Backdrop = {
  /** Wider than the frame: bands above and below the photo; otherwise bands on its sides. */
  letterboxed: boolean;
  first: string;
  second: string;
};

/** Colours along one edge strip of the photo, or null when the strip is transparent. */
function stripGradient(
  img: HTMLImageElement,
  [sx, sy, sw, sh]: [number, number, number, number],
  horizontal: boolean,
): string | null {
  const canvas = document.createElement("canvas");
  canvas.width = horizontal ? STOPS : 1;
  canvas.height = horizontal ? 1 : STOPS;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  const stops: string[] = [];
  for (let i = 0; i < STOPS; i++) {
    if (data[i * 4 + 3] < 250) return null;
    stops.push(`rgb(${data[i * 4]}, ${data[i * 4 + 1]}, ${data[i * 4 + 2]})`);
  }
  return `linear-gradient(${horizontal ? "to right" : "to bottom"}, ${stops.join(", ")})`;
}

/**
 * Extends the photo's own edge colours into the empty bands `object-contain` leaves,
 * so studio shots on flat, gradient or vignetted backdrops read as one continuous frame.
 */
function edgeBackdrop(img: HTMLImageElement): Backdrop | null {
  const { naturalWidth: w, naturalHeight: h, clientWidth, clientHeight } = img;
  if (!w || !h || !clientWidth || !clientHeight) return null;
  const edge = Math.max(1, Math.round(Math.min(w, h) * 0.004));
  const letterboxed = w / h >= clientWidth / clientHeight;
  try {
    const first = letterboxed
      ? stripGradient(img, [0, 0, w, edge], true)
      : stripGradient(img, [0, 0, edge, h], false);
    const second = letterboxed
      ? stripGradient(img, [0, h - edge, w, edge], true)
      : stripGradient(img, [w - edge, 0, edge, h], false);
    return first && second ? { letterboxed, first, second } : null;
  } catch {
    // Cross-origin images without CORS headers taint the canvas.
    return null;
  }
}

/** Product image shown whole (`object-contain`) on a backdrop continuing the photo's edges. */
export default function ProductCardImage({ alt, className, onLoad, ...props }: ImageProps) {
  const [backdrop, setBackdrop] = useState<Backdrop | null>(null);

  return (
    <>
      <span aria-hidden className="absolute inset-0 bg-white" />
      {backdrop ? (
        <>
          <span
            aria-hidden
            className={cn("absolute", backdrop.letterboxed ? "inset-x-0 top-0 h-1/2" : "inset-y-0 left-0 w-1/2")}
            style={{ backgroundImage: backdrop.first }}
          />
          <span
            aria-hidden
            className={cn("absolute", backdrop.letterboxed ? "inset-x-0 bottom-0 h-1/2" : "inset-y-0 right-0 w-1/2")}
            style={{ backgroundImage: backdrop.second }}
          />
        </>
      ) : null}
      <Image
        {...props}
        alt={alt}
        className={className}
        onLoad={(event) => {
          setBackdrop(edgeBackdrop(event.currentTarget));
          onLoad?.(event);
        }}
      />
    </>
  );
}
