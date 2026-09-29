"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { setMenuScrollLocked } from "@/lib/lenis-control";

const SCROLL_START_PX = 48;

/** Survives client navigations and resets only on a full page load. */
let closedUntilRefresh = false;

export default function ExperiencePromoPopup() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  const dismiss = () => {
    closedUntilRefresh = true;
    setOpen(false);
  };

  useEffect(() => {
    if (closedUntilRefresh) return;
    const onScroll = () => {
      if (closedUntilRefresh || window.scrollY < SCROLL_START_PX) return;
      setOpen(true);
      window.removeEventListener("scroll", onScroll);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => setVisible(true));
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
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
      className={`fixed inset-0 z-[90] flex items-center justify-center bg-forest/60 p-5 backdrop-blur-[3px] transition-opacity duration-500 sm:p-8 ${visible ? "opacity-100" : "opacity-0"}`}
      role="presentation"
      onClick={dismiss}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="experience-promo-title"
        className={`relative w-[min(74vw,17.5rem)] overflow-hidden bg-forest shadow-2xl transition-transform duration-500 sm:w-full sm:max-w-3xl ${visible ? "translate-y-0" : "translate-y-4"}`}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={dismiss}
          aria-label="بستن"
          className="absolute left-2.5 top-2.5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-paper/90 text-xl leading-none text-forest transition-colors hover:bg-paper sm:left-3 sm:top-3 sm:h-10 sm:w-10"
        >
          ×
        </button>
        <Link href="/Experience" className="block text-paper">
          <img
            src="/experience/wall-mobile.jpg"
            alt="نهمین نمایشگاه معماری تهران"
            className="h-auto max-h-[46dvh] w-full object-cover object-[center_32%] md:hidden"
          />
          <img
            src="/experience/wall-desktop.jpg"
            alt=""
            className="hidden h-auto max-h-[70dvh] w-full object-cover object-center md:block"
          />
          <span className="flex items-center justify-between gap-3 px-3.5 py-3 sm:gap-4 sm:px-6 sm:py-4">
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
