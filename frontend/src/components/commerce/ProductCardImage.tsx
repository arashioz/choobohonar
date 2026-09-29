"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const SAMPLE = 24;
const MAX_CORNER_SPREAD = 18;

/** Solid backdrop colour of a studio shot, read from its four corners; null for photos without one. */
function edgeColor(img: HTMLImageElement): string | null {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = SAMPLE;
    canvas.height = SAMPLE;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, SAMPLE, SAMPLE);
    const corners = [
      [0, 0],
      [SAMPLE - 1, 0],
      [0, SAMPLE - 1],
      [SAMPLE - 1, SAMPLE - 1],
    ].map(([x, y]) => Array.from(ctx.getImageData(x, y, 1, 1).data.slice(0, 3)));
    for (let channel = 0; channel < 3; channel++) {
      const values = corners.map((corner) => corner[channel]);
      if (Math.max(...values) - Math.min(...values) > MAX_CORNER_SPREAD) return null;
    }
    const [r, g, b] = [0, 1, 2].map((channel) =>
      Math.round(corners.reduce((sum, corner) => sum + corner[channel], 0) / corners.length),
    );
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    // Cross-origin images without CORS headers taint the canvas.
    return null;
  }
}

/** Product image shown whole (`object-contain`) on a backdrop matching the photo, so the frame reads as one colour. */
export default function ProductCardImage({ alt, className, onLoad, ...props }: ImageProps) {
  const [backdrop, setBackdrop] = useState<string | null>(null);

  return (
    <>
      <span
        aria-hidden
        className="absolute inset-0 bg-white transition-colors duration-300"
        style={backdrop ? { backgroundColor: backdrop } : undefined}
      />
      <Image
        {...props}
        alt={alt}
        className={className}
        onLoad={(event) => {
          setBackdrop(edgeColor(event.currentTarget));
          onLoad?.(event);
        }}
      />
    </>
  );
}
