"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { campaign, nav } from "@/data/campaign";
import { cn } from "@/lib/utils";
import BrandMark from "@/components/brand/BrandMark";

export default function Header() {
  const pathname = usePathname();
  const onLanding = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

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

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ease-out-expo",
        scrolled ? "border-b border-forest/8 bg-paper/92 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-container items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 md:px-10 lg:px-16">
        <Link
          href={onLanding ? "#top" : "/"}
          aria-label={campaign.slogan}
          className="min-w-0 max-w-[min(70vw,16rem)] shrink"
        >
          <BrandMark adaptive solid={scrolled} />
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
            href={onLanding ? "#scope" : "/#scope"}
            className={cn(
              "rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors duration-300",
              scrolled ? "bg-forest text-paper hover:bg-forest-700" : "bg-peach text-forest hover:bg-peach-deep",
            )}
          >
            شعبه‌ها
          </a>
        </nav>
      </div>
    </header>
  );
}
