"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { id: "seo-overview", label: "نمای کلی" },
  { id: "seo-performance", label: "سرچ‌کنسول" },
  { id: "seo-issues", label: "ایندکس و باگ‌ها" },
  { id: "seo-keywords", label: "کیوردها" },
  { id: "seo-competitors", label: "رقبا" },
  { id: "seo-pillars", label: "پیلارها" },
  { id: "seo-calendar", label: "تقویم محتوا" },
  { id: "seo-plan", label: "برنامه اجرا" },
] as const;

export default function SeoWorkspaceShell({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<(typeof sections)[number]["id"]>("seo-overview");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActive(visible.target.id as (typeof sections)[number]["id"]);
      },
      { rootMargin: "-28% 0px -62% 0px" },
    );
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  function navigate(id: (typeof sections)[number]["id"]) {
    setLoading(true);
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => setLoading(false), 420);
  }

  return (
    <div dir="rtl" className="min-h-screen bg-paper text-forest">
      <header className="sticky top-0 z-40 border-b border-forest/10 bg-paper/95 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-[1440px] items-center justify-between gap-4 px-5 sm:px-8 lg:px-10">
          <Link
            href="/admin"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-forest/15 bg-white px-4 py-2 text-[11px] font-medium text-forest transition-colors hover:border-forest hover:bg-forest hover:text-paper"
          >
            <span aria-hidden>→</span>
            بازگشت به پنل اصلی
          </Link>
          <div className="min-w-0 text-left">
            <p className="text-[9px] font-medium tracking-[0.2em] text-brick" dir="ltr">SEARCH OPERATIONS</p>
            <p className="mt-0.5 truncate text-xs text-forest/55">داشبورد مستقل سئو</p>
          </div>
        </div>
        <nav className="no-scrollbar mx-auto flex max-w-[1440px] gap-1 overflow-x-auto border-t border-forest/[0.07] px-4 py-2 sm:px-7 lg:px-9" aria-label="بخش‌های داشبورد سئو">
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => navigate(section.id)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-[10px] transition-colors",
                active === section.id ? "bg-forest text-paper" : "text-forest/50 hover:bg-forest/[0.06] hover:text-forest",
              )}
            >
              {section.label}
            </button>
          ))}
        </nav>
        {loading ? <span className="absolute inset-x-0 bottom-0 h-0.5 animate-pulse bg-brick" role="status" aria-label="در حال جابه‌جایی در داشبورد سئو" /> : null}
      </header>
      {children}
    </div>
  );
}
