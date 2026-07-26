"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "پنل",
    href: "/admin",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "برندبوک",
    href: "/admin/brandbook",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <circle cx="12" cy="10" r="3" />
        <path d="M9 16h6" />
      </svg>
    ),
  },
];

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
    <aside className="fixed right-0 top-0 z-40 flex h-screen w-[72px] flex-col border-l border-forest/10 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-center border-b border-forest/10">
        <Link
          href="/admin"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-forest p-1.5 transition-colors duration-300 hover:bg-forest-700"
        >
          <Image
            src="/brand/monogram-black.svg"
            alt="چوب و هنر"
            width={28}
            height={28}
            className="object-contain brightness-0 invert"
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300",
                isActive
                  ? "bg-forest text-peach shadow-md shadow-forest/20"
                  : "text-forest/40 hover:bg-forest/5 hover:text-forest",
              )}
            >
              {item.icon}
              {isActive && (
                <span className="absolute -right-3 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-forest" />
              )}
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-forest px-3 py-1.5 text-xs font-medium text-paper opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col items-center gap-1 border-t border-forest/10 px-3 py-4">
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          title="خروج"
          className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-forest/40 transition-all duration-300 hover:bg-forest/5 hover:text-forest disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-forest px-3 py-1.5 text-xs font-medium text-paper opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            {loggingOut ? "خروج…" : "خروج"}
          </span>
        </button>
      </div>
    </aside>
  );
}
