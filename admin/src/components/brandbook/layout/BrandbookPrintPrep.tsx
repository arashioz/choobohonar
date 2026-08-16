"use client";

import { useEffect } from "react";

export default function BrandbookPrintPrep() {
  useEffect(() => {
    const root = document.documentElement;

    const revealAll = () => {
      document
        .querySelectorAll(
          ".motion-reveal, [data-hero-line], [data-hero-soft], [data-hero-logo], [data-hero-cue], [data-revealed]",
        )
        .forEach((el) => {
          const node = el as HTMLElement;
          node.style.opacity = "1";
          node.style.transform = "none";
          node.style.visibility = "visible";
        });
    };

    const waitForImages = () =>
      Promise.all(
        Array.from(document.images).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          });
        }),
      );

    const prepare = async () => {
      revealAll();

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      document.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
        const height = el.style.height || "";
        const minHeight = el.style.minHeight || "";
        if (/vh|dvh|svh/i.test(height) || /vh|dvh|svh/i.test(minHeight)) {
          el.style.height = "auto";
          el.style.minHeight = "0";
        }
      });

      const doc = document.querySelector(".brandbook-print-document") as HTMLElement | null;
      const scrollHeight = Math.min(
        doc?.scrollHeight || document.body.scrollHeight,
        200000,
      );
      const step = Math.max(window.innerHeight * 0.75, 640);
      for (let y = 0; y <= scrollHeight; y += step) {
        window.scrollTo(0, y);
        revealAll();
        await new Promise((r) => setTimeout(r, 80));
      }
      window.scrollTo(0, 0);

      await waitForImages();
      revealAll();

      root.dataset.printReady = "true";
    };

    prepare().catch(() => {
      root.dataset.printReady = "true";
    });
  }, []);

  return null;
}
