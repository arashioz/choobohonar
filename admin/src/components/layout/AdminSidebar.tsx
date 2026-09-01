"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

type IconName = "home" | "shop" | "article" | "bot" | "archive" | "book" | "settings" | "customers" | "leads" | "logout";

const navItems: { label: string; description: string; href: string; icon: IconName }[] = [
  { label: "نمای کلی", description: "صفحه اصلی پنل", href: "/admin", icon: "home" },
  { label: "فروشگاه", description: "محصولات، سفارش‌ها و فاکتورها", href: "/admin/shop", icon: "shop" },
  { label: "مقالات", description: "ایجاد، ویرایش و انتشار", href: "/admin/articles", icon: "article" },
  { label: "صفحات سایت", description: "ناوبری، برند و فرم‌ها", href: "/admin/pages", icon: "book" },
  { label: "مشتریان", description: "CRM و پیگیری ارتباط", href: "/admin/customers", icon: "customers" },
  { label: "درخواست‌ها", description: "فرم‌های سایت و بریف معماری", href: "/admin/leads", icon: "leads" },
  { label: "چوب‌نویس", description: "دستیار هوشمند محتوا", href: "/admin/content", icon: "bot" },
  { label: "مدیریت آثار", description: "محصول، پروژه و کالکشن", href: "/admin/manage", icon: "archive" },
  { label: "برندبوک دیجیتال", description: "راهنمای هویت برند", href: "/admin/brandbook", icon: "book" },
  { label: "تنظیمات سئو", description: "Google Search Console", href: "/admin/settings", icon: "settings" },
];

function NavIcon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "home") return <svg {...common}><path d="m3.5 10.5 8.5-7 8.5 7" /><path d="M5.5 9v11h13V9" /><path d="M9.5 20v-6h5v6" /></svg>;
  if (name === "shop") return <svg {...common}><path d="M3 9h18l-1.5 11.5a2 2 0 0 1-2 1.5H6.5a2 2 0 0 1-2-1.5L3 9Z" /><path d="M8 9V7a4 4 0 0 1 8 0v2" /></svg>;
  if (name === "article") return <svg {...common}><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 12h7M9 16h7"/></svg>;
  if (name === "bot") return <svg {...common}><rect x="4" y="7" width="16" height="12" rx="3"/><path d="M9 12h.01M15 12h.01M9 16h6M12 7V4M10 4h4"/></svg>;
  if (name === "archive") return <svg {...common}><path d="M4 7.5h16v12H4z" /><path d="M3 4h18v3.5H3z" /><path d="M9 12h6" /></svg>;
  if (name === "book") return <svg {...common}><path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h12.5v17H7a2.5 2.5 0 0 0-2.5 2Z" /><path d="M4.5 5.5V22" /><path d="M9 8h6M9 12h7" /></svg>;
  if (name === "settings") return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.1 2.1-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56v.1h-3v-.1A1.7 1.7 0 0 0 10.7 18.6a1.7 1.7 0 0 0-1.88.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 0 0 7.06 15a1.7 1.7 0 0 0-1.56-1.03h-.1v-3h.1A1.7 1.7 0 0 0 7.06 9.94a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.1-2.1.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56v-.1h3v.1a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.1 2.1-.06.06a1.7 1.7 0 0 0-.34 1.88 1.7 1.7 0 0 0 1.56 1.03h.1v3h-.1A1.7 1.7 0 0 0 19.4 15Z" /></svg>;
  if (name === "customers") return <svg {...common}><circle cx="9" cy="8" r="3" /><path d="M3.5 20c.5-3.3 2.3-5 5.5-5s5 1.7 5.5 5M16 5.5a3 3 0 0 1 0 5.8M17 15.2c2.1.3 3.3 1.9 3.7 4.8" /></svg>;
  if (name === "leads") return <svg {...common}><path d="M5 4h14v16H5z" /><path d="M8 8h8M8 12h8M8 16h4" /><path d="m16.5 16.5 1.2 1.2 2.8-3" /></svg>;
  return <svg {...common}><path d="M10 4H5v16h5" /><path d="M14 8l4 4-4 4M18 12H9" /></svg>;
}

function isItemActive(pathname: string, href: string) {
  return pathname === href || (href !== "/admin" && pathname.startsWith(href));
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <>
      <aside className="fixed inset-y-0 right-0 z-40 hidden w-[248px] flex-col border-l border-forest/[0.08] bg-[#f3efe8]/95 px-5 backdrop-blur-xl md:flex">
        <div className="flex h-[102px] items-center border-b border-forest/[0.07] px-1">
          <Link href="/admin" className="relative block h-[58px] w-[148px]" aria-label="خانه پنل مدیریت">
            <Image src="/brand/downloads/choobohonar-lockup-persian-black.svg" alt="خانه چوب و هنر" fill priority className="object-contain object-right opacity-[0.86]" />
          </Link>
        </div>

        <div className="px-2 pb-2.5 pt-7 text-[9px] font-medium tracking-[0.12em] text-forest/28">فضای مدیریت</div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors duration-200",
                  active ? "bg-white/80 text-forest shadow-[0_1px_0_rgba(9,43,28,0.05)]" : "text-forest/48 hover:bg-white/45 hover:text-forest",
                )}
              >
                <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors", active ? "bg-peach/35 text-forest" : "text-forest/38 group-hover:text-forest/70")}>
                  <NavIcon name={item.icon} size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-medium">{item.label}</span>
                  <span className="mt-0.5 block truncate text-[9px] text-forest/30">{item.description}</span>
                </span>
                {active && <span className="absolute -right-5 top-1/2 h-6 w-0.5 -translate-y-1/2 rounded-l-full bg-brick/70" />}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-forest/[0.07] py-4">
          <div className="mb-1 flex items-center gap-3 rounded-xl px-2.5 py-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-forest/[0.07] text-[10px] font-semibold text-forest">مد</span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-forest">مدیر مجموعه</span>
              <span className="mt-0.5 block text-[9px] text-forest/32">دسترسی کامل</span>
            </span>
            <span className="h-2 w-2 rounded-full bg-[#54a879] ring-4 ring-[#54a879]/10" title="آنلاین" />
          </div>
          <button type="button" onClick={logout} disabled={loggingOut} className="flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-[10px] text-forest/38 transition-colors hover:bg-white/60 hover:text-brick disabled:opacity-50">
            <span className="flex h-8 w-8 items-center justify-center"><NavIcon name="logout" size={18} /></span>
            {loggingOut ? "در حال خروج…" : "خروج از حساب"}
          </button>
        </div>
      </aside>

      <header className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-forest/[0.08] bg-[#f3efe8]/95 px-5 backdrop-blur-xl md:hidden">
        <Link href="/admin" className="relative h-10 w-28">
          <Image src="/brand/downloads/choobohonar-lockup-persian-black.svg" alt="خانه چوب و هنر" fill className="object-contain object-right opacity-80" />
        </Link>
        <button type="button" onClick={logout} disabled={loggingOut} className="flex h-9 w-9 items-center justify-center rounded-xl border border-forest/10 text-forest/50" aria-label="خروج از حساب"><NavIcon name="logout" size={18} /></button>
      </header>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-9 rounded-2xl border border-forest/10 bg-[#f8f5f0]/95 p-1.5 shadow-xl shadow-forest/10 backdrop-blur-xl md:hidden" aria-label="منوی موبایل">
        {navItems.map((item) => {
          const active = isItemActive(pathname, item.href);
          return <Link key={item.href} href={item.href} className={cn("flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[8px] transition-colors", active ? "bg-peach/35 text-forest" : "text-forest/35")}><NavIcon name={item.icon} size={17} /><span className="truncate">{item.label.replace(" دیجیتال", "")}</span></Link>;
        })}
      </nav>
    </>
  );
}
