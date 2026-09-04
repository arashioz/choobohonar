"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { campaign, nav } from "@/data/campaign";
import { cn } from "@/lib/utils";
import BrandMark from "@/components/brand/BrandMark";
import { setMenuScrollLocked } from "@/lib/lenis-control";

export default function Header() {
  const pathname = usePathname();
  const onLanding = pathname === "/";
  const [scrolled, setScrolled] = useState(!onLanding);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(!onLanding || window.scrollY > 24);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [onLanding]);

  useEffect(() => {
    setMenuScrollLocked(open);
    if (!open) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ease-out-expo",
        scrolled || open ? "border-b border-forest/8 bg-paper/92 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-container items-center justify-between px-5 py-4 sm:px-6 md:px-10 lg:px-16">
        <Link href={onLanding ? "#top" : "/"} aria-label={campaign.slogan} onClick={() => setOpen(false)}>
          <BrandMark adaptive solid={scrolled || open} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={onLanding ? item.href : `/${item.href}`}
              className={cn(
                "text-[13px] transition-colors duration-300",
                scrolled ? "text-forest/70 hover:text-forest" : "text-paper/80 hover:text-peach",
              )}
            >
              {item.label}
            </a>
          ))}
          <a
            href={onLanding ? "#join" : "/#join"}
            className={cn(
              "rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors duration-300",
              scrolled ? "bg-forest text-paper hover:bg-forest-700" : "bg-peach text-forest hover:bg-peach-deep",
            )}
          >
            عضویت در باشگاه
          </a>
        </nav>

        <button
          type="button"
          className={cn("lg:hidden", scrolled || open ? "text-forest" : "text-paper")}
          aria-expanded={open}
          aria-label={open ? "بستن منو" : "باز کردن منو"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-4 w-6">
            <span className={cn("mb-1.5 block h-px w-full", scrolled || open ? "bg-forest" : "bg-paper")} />
            <span className={cn("block h-px w-3/4", scrolled || open ? "bg-forest" : "bg-paper")} />
          </span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-forest/8 bg-paper px-6 py-8 lg:hidden">
          <nav className="flex flex-col gap-5">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="text-lg text-forest" onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
            <a href="#join" className="text-lg text-brick" onClick={() => setOpen(false)}>
              عضویت در باشگاه
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
