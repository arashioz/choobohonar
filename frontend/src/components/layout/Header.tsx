"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { brand, homeSectionLinks, navItems } from "@/data/nav";
import { setMenuScrollLocked } from "@/lib/lenis-control";
import { cn } from "@/lib/utils";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const hasTransparentHero =
    isHome || pathname === "/projects" || pathname === "/interior-architecture-services";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    setMenuScrollLocked(open);

    if (!open) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollY);
      setMenuScrollLocked(false);
    };
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  // On any page other than the landing page there is no dark hero behind the
  // header, so it always uses the solid (condensed) base from the landing page.
  const onSolid = scrolled || open || !hasTransparentHero;

  const homeHref = isHome ? "#top" : "/";

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out-expo",
          onSolid
            ? "bg-paper/90 py-3 shadow-[0_1px_0_rgba(9,43,28,0.08)] supports-[backdrop-filter]:backdrop-blur-md"
            : "bg-transparent py-4 sm:py-5 md:py-6"
        )}
      >
        <div className="mx-auto grid w-full max-w-container grid-cols-[1fr_auto] items-center gap-3 px-5 sm:gap-4 sm:px-6 md:px-10 lg:grid-cols-[1fr_auto_1fr] lg:gap-6 lg:px-16">
          <a
            href={homeHref}
            className="col-start-1 row-start-1 flex shrink-0 items-center gap-2.5 justify-self-start sm:gap-3"
            aria-label={brand.nameFa}
          >
            <span className="relative block h-9 w-8 sm:h-10 sm:w-9">
              <Image
                src="/brand/monogram-white.svg"
                alt=""
                fill
                priority
                aria-hidden
                className={cn(
                  "object-contain object-center transition-opacity duration-300",
                  onSolid ? "opacity-0" : "opacity-100"
                )}
              />
              <Image
                src="/brand/monogram-black.svg"
                alt=""
                fill
                aria-hidden
                className={cn(
                  "object-contain object-center transition-opacity duration-300",
                  onSolid ? "opacity-100" : "opacity-0"
                )}
              />
            </span>
            <span
              className={cn(
                "text-sm font-medium tracking-[0.02em] transition-colors duration-300 md:text-[15px]",
                onSolid ? "text-forest" : "text-paper"
              )}
            >
              {brand.nameFa}
            </span>
          </a>

          <nav
            className={cn(
              "hidden items-center justify-center gap-3 sm:gap-4 lg:col-start-2 lg:row-start-1 lg:flex xl:gap-7 2xl:gap-8",
              "text-[13px] font-medium xl:text-sm transition-colors duration-500",
              onSolid ? "text-forest" : "text-paper"
            )}
            aria-label="ناوبری اصلی"
          >
            {navItems.map((item) => (
              <div key={item.href} className="group relative shrink-0 py-1">
                <a href={item.href} className="relative block whitespace-nowrap opacity-90 transition-opacity hover:opacity-100">
                  {item.label}
                  <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-current transition-transform duration-300 ease-out-expo group-hover:scale-x-100" />
                </a>

                {item.children?.length ? (
                  <div className="pointer-events-none absolute right-0 top-full z-50 w-[min(20rem,calc(100vw-3rem))] translate-y-4 opacity-0 transition-all duration-300 group-hover:pointer-events-auto group-hover:translate-y-2 group-hover:opacity-100 xl:w-[22rem]">
                    <div className="mt-4 border border-forest/10 bg-paper p-3 text-right text-forest shadow-[0_16px_40px_rgba(9,43,28,0.08)] xl:p-4">
                      <p className="px-1 text-xs tracking-[0.2em] text-forest/65">دسته‌بندی محصولات</p>
                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        {item.children.map((child) => (
                          <a
                            key={child.href}
                            href={child.href}
                            className="rounded-xl px-3 py-2.5 text-sm font-medium text-forest transition-colors hover:bg-forest/5"
                          >
                            {child.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="col-start-2 row-start-1 flex shrink-0 items-center justify-self-end gap-2 sm:gap-3 lg:col-start-3 lg:gap-4">
            <a
              href="/contact"
              className={cn(
                "hidden rounded-xl border px-3 py-2 text-[11px] font-medium tracking-[0.16em] transition-colors duration-500 xl:px-4 xl:text-xs xl:tracking-[0.18em] lg:inline-flex",
                onSolid
                  ? "border-forest/15 text-forest hover:border-forest hover:bg-forest hover:text-paper"
                  : "border-paper/30 text-paper hover:border-paper hover:bg-paper hover:text-forest"
              )}
            >
              مشاوره
            </a>
            <button
              type="button"
              className={cn(
                "hidden text-[11px] font-medium tracking-widest transition-colors duration-500 xl:text-xs lg:block",
                onSolid ? "text-forest/70 hover:text-forest" : "text-paper/70 hover:text-paper"
              )}
            >
              FA / EN
            </button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className={cn(
                "relative z-[60] -me-1 flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full transition-colors duration-300 lg:hidden",
                onSolid ? "text-forest hover:bg-forest/5" : "text-paper hover:bg-paper/10"
              )}
            >
              <span
                className={cn(
                  "h-px w-5 bg-current transition-all duration-300 sm:w-6",
                  open && "translate-y-[7px] rotate-45"
                )}
              />
              <span className={cn("h-px w-5 bg-current transition-all duration-300 sm:w-6", open && "opacity-0")} />
              <span
                className={cn(
                  "h-px w-5 bg-current transition-all duration-300 sm:w-6",
                  open && "-translate-y-[7px] -rotate-45"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Outside header so backdrop-blur on the bar does not trap fixed positioning. */}
      <div
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="منوی موبایل"
        data-lenis-prevent
        className={cn(
          "fixed inset-0 z-[45] h-[100dvh] overflow-y-auto overscroll-y-contain bg-forest transition-all duration-500 ease-out-expo lg:hidden touch-pan-y",
          "pt-[calc(4.5rem+env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]",
          open ? "pointer-events-auto opacity-100 visible" : "pointer-events-none opacity-0 invisible"
        )}
        aria-hidden={!open}
      >
        <div className="mx-auto flex min-h-full max-w-container flex-col px-5 pb-6 sm:px-6 md:px-10">
          <nav className="flex flex-col gap-1 sm:gap-2" aria-label="ناوبری موبایل">
            {navItems.map((item, i) => (
              <div key={item.href} className="border-b border-paper/10 py-4 last:border-b-0 sm:py-5">
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block text-[clamp(1.625rem,6.5vw,2.125rem)] font-light leading-tight text-paper transition-all duration-500 active:opacity-70"
                  style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
                >
                  {item.label}
                </a>
                {item.children?.length ? (
                  <div className="mt-3 grid gap-1 sm:mt-4 sm:gap-2">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="flex min-h-10 items-center rounded-xl px-1 py-2 text-sm text-paper/75 transition-colors active:bg-paper/5 sm:min-h-11 sm:px-2 sm:text-[15px]"
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          {isHome ? (
            <div className="mt-6 border-t border-paper/10 pt-6 sm:mt-8 sm:pt-8">
              <p className="text-xs tracking-[0.24em] text-peach sm:text-sm sm:tracking-widest">بخش‌های خانه</p>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 sm:mt-4 sm:gap-x-5">
                {homeSectionLinks.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="inline-flex min-h-10 items-center text-sm text-paper/70 transition-colors active:text-paper"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-paper/10 pt-6 sm:gap-4 sm:pt-8">
            <a
              href="/contact"
              onClick={() => setOpen(false)}
              className="inline-flex min-h-11 items-center rounded-xl border border-peach px-4 py-2.5 text-xs tracking-[0.18em] text-peach transition-colors active:bg-peach/10"
            >
              درخواست مشاوره
            </a>
            <button type="button" className="min-h-11 px-2 text-sm tracking-widest text-peach/90">
              FA / EN
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
