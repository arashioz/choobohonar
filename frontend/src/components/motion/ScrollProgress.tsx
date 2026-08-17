"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * A quiet, brand-coloured reading/scroll indicator shared by every storefront
 * route. It only writes a transform in rAF, so it does not trigger layout.
 */
export default function ScrollProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;

      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [pathname]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-0.5" aria-hidden>
      <div
        ref={barRef}
        className="h-full origin-right scale-x-0 bg-peach shadow-[0_0_12px_rgba(251,190,166,0.45)] will-change-transform"
      />
    </div>
  );
}
