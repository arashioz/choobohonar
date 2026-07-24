"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "@/lib/utils";
import { scrollToTarget } from "@/lib/lenis-control";
import type { BrandbookNavItem } from "@/data/brandbook-nav";

export type { BrandbookNavItem };

type BrandbookNavigationProps = {
  items: BrandbookNavItem[];
  activeId: string;
};

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-4 w-4" aria-hidden>
      <span
        className={cn(
          "absolute left-0 top-[3px] h-px w-4 bg-current transition-transform duration-300",
          open && "translate-y-[5px] rotate-45",
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-[8px] h-px w-4 bg-current transition-opacity duration-300",
          open && "opacity-0",
        )}
      />
      <span
        className={cn(
          "absolute left-0 top-[13px] h-px w-4 bg-current transition-transform duration-300",
          open && "-translate-y-[5px] -rotate-45",
        )}
      />
    </span>
  );
}

export default function BrandbookNavigation({
  items,
  activeId,
}: BrandbookNavigationProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const activeIndex = Math.max(
    0,
    items.findIndex((item) => item.id === activeId),
  );
  const active = items[activeIndex];

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navigate = (id: string) => {
    setOpen(false);
    window.setTimeout(() => scrollToTarget(id), 80);
  };

  return (
    <>
      <div className="fixed right-4 top-1/2 z-[60] hidden -translate-y-1/2 md:block lg:right-6 pointer-events-none">
        <div className="pointer-events-auto relative">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label="فهرست فصل‌های برندبوک"
          className={cn(
            "group flex w-[3.25rem] flex-col items-center gap-3 rounded-full border px-2 py-4 shadow-[0_14px_45px_rgba(9,43,28,0.12)] backdrop-blur-xl transition-all duration-500 ease-out-expo",
            open
              ? "border-forest bg-forest text-paper"
              : "border-forest/10 bg-paper/90 text-forest hover:border-forest/25",
          )}
        >
          <MenuIcon open={open} />
          <span className="font-display text-[11px] tracking-[0.16em]" dir="ltr">
            {active.number}
          </span>
          <span className="h-10 w-px bg-current opacity-15" />
          <span className="text-[9px] font-medium [writing-mode:vertical-rl]">
            فهرست
          </span>
        </button>

        <div
          id={menuId}
          className={cn(
            "absolute right-full top-1/2 mr-3 w-[21rem] -translate-y-1/2 overflow-hidden rounded-[1.5rem] border border-forest/10 bg-paper/95 p-2 shadow-[0_24px_80px_rgba(9,43,28,0.18)] backdrop-blur-2xl transition-all duration-500 ease-out-expo",
            open
              ? "pointer-events-auto translate-x-0 opacity-100"
              : "pointer-events-none translate-x-4 opacity-0",
          )}
        >
          <div className="flex items-end justify-between px-4 pb-4 pt-3">
            <div>
              <p className="eyebrow text-brick">Digital Brandbook</p>
              <p className="mt-1 text-sm text-forest/55">راهنمای زنده هویت برند</p>
            </div>
            <span className="font-display text-xs text-forest/35" dir="ltr">
              {String(activeIndex + 1).padStart(2, "0")} /{" "}
              {String(items.length).padStart(2, "0")}
            </span>
          </div>

          <nav className="space-y-1" aria-label="فصل‌های برندبوک">
            {items.map((item, index) => {
              const isActive = item.id === activeId;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate(item.id)}
                  className={cn(
                    "group/item grid w-full grid-cols-[2.25rem_1fr_auto] items-center gap-3 rounded-2xl px-3 py-2.5 text-right transition-all duration-300",
                    isActive
                      ? "bg-forest text-paper"
                      : "text-forest hover:bg-forest/[0.055]",
                  )}
                >
                  <span
                    className={cn(
                      "font-display text-[11px]",
                      isActive ? "text-peach" : "text-forest/35",
                    )}
                    dir="ltr"
                  >
                    {item.number}
                  </span>
                  <span>
                    <span className="block text-[13px] font-medium">{item.label}</span>
                    <span
                      className={cn(
                        "mt-0.5 block text-[9px] uppercase tracking-[0.16em]",
                        isActive ? "text-paper/45" : "text-forest/35",
                      )}
                      dir="ltr"
                    >
                      {item.titleEn}
                    </span>
                  </span>
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full transition-transform duration-300",
                      isActive
                        ? "scale-100 bg-peach"
                        : "scale-0 bg-forest group-hover/item:scale-100",
                    )}
                  />
                  <span className="sr-only">بخش {index + 1}</span>
                </button>
              );
            })}
          </nav>
        </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-[64] px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls={`${menuId}-mobile`}
          className="mx-auto flex w-full max-w-md items-center justify-between rounded-2xl border border-forest/10 bg-paper/95 px-4 py-3 text-forest shadow-[0_18px_55px_rgba(9,43,28,0.2)] backdrop-blur-xl"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest text-paper">
              <MenuIcon open={false} />
            </span>
            <span className="text-right">
              <span className="block text-xs font-medium">{active.label}</span>
              <span className="mt-0.5 block text-[9px] text-forest/40" dir="ltr">
                {active.titleEn}
              </span>
            </span>
          </span>
          <span className="font-display text-[11px] text-brick" dir="ltr">
            {active.number}
          </span>
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-[80] bg-forest/35 backdrop-blur-sm transition-opacity duration-400 md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <div
        id={`${menuId}-mobile`}
        role="dialog"
        aria-modal="true"
        aria-label="فهرست برندبوک"
        className={cn(
          "fixed inset-x-0 bottom-0 z-[85] max-h-[82dvh] overflow-y-auto rounded-t-[2rem] bg-paper px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-24px_70px_rgba(9,43,28,0.25)] transition-transform duration-500 ease-out-expo md:hidden",
          open ? "translate-y-0" : "translate-y-[105%]",
        )}
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-forest/15" />
        <div className="mb-4 flex items-center justify-between px-1">
          <div>
            <p className="eyebrow text-brick">Digital Brandbook</p>
            <h2 className="mt-1 text-lg font-light text-forest">فهرست فصل‌ها</h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-forest/10 text-forest"
            aria-label="بستن فهرست"
          >
            <MenuIcon open />
          </button>
        </div>

        <nav className="grid gap-2" aria-label="فصل‌های برندبوک در موبایل">
          {items.map((item) => {
            const isActive = item.id === activeId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.id)}
                className={cn(
                  "flex items-center justify-between rounded-2xl border px-4 py-3 text-right",
                  isActive
                    ? "border-forest bg-forest text-paper"
                    : "border-forest/[0.08] bg-white/55 text-forest",
                )}
              >
                <span>
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span
                    className={cn(
                      "mt-1 block text-[9px] uppercase tracking-[0.14em]",
                      isActive ? "text-paper/45" : "text-forest/35",
                    )}
                    dir="ltr"
                  >
                    {item.titleEn}
                  </span>
                </span>
                <span
                  className={cn(
                    "font-display text-[11px]",
                    isActive ? "text-peach" : "text-brick",
                  )}
                  dir="ltr"
                >
                  {item.number}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
