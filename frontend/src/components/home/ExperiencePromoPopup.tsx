"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { setMenuScrollLocked } from "@/lib/lenis-control";

const SCROLL_START_PX = 48;

export default function ExperiencePromoPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY < SCROLL_START_PX) return;
      setOpen(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    setMenuScrollLocked(true);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
      setMenuScrollLocked(false);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-end justify-center bg-forest/60 p-3 backdrop-blur-[3px] transition-opacity duration-500 sm:items-center sm:p-8 ${visible ? "opacity-100" : "opacity-0"}`}
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="experience-promo-title"
        className={`relative w-full max-w-3xl overflow-hidden bg-forest shadow-2xl transition-transform duration-500 ${visible ? "translate-y-0" : "translate-y-4"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="بستن"
          className="absolute left-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-xl leading-none text-forest transition-colors hover:bg-paper"
        >
          ×
        </button>
        <Link href="/Experience" className="block text-paper">
          <img
            src="/experience/wall-mobile.jpg"
            alt="نهمین نمایشگاه معماری تهران"
            className="h-auto max-h-[70dvh] w-full object-cover object-center md:hidden"
          />
          <img
            src="/experience/wall-desktop.jpg"
            alt=""
            className="hidden h-auto max-h-[70dvh] w-full object-cover object-center md:block"
          />
          <span className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
            <span id="experience-promo-title" className="text-sm font-medium sm:text-base">
              تجربه نمایشگاه
            </span>
            <span className="text-sm text-peach">
              ورود
              <span aria-hidden> ←</span>
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}
