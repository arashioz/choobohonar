"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "برندبوک",
    href: "/brandbook",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <circle cx="12" cy="10" r="3" />
        <path d="M9 16h6" />
      </svg>
    ),
  },
  {
    label: "ورود",
    href: "/login",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <polyline points="10 17 15 12 10 7" />
        <line x1="15" y1="12" x2="3" y2="12" />
      </svg>
    ),
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed right-0 top-0 z-40 flex h-screen w-[72px] flex-col border-l border-forest/10 bg-white/80 backdrop-blur-xl transition-all duration-300">
      <div className="flex h-16 items-center justify-center border-b border-forest/10">
        <Link href="/brandbook" className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest p-1.5 transition-colors duration-300 hover:bg-forest-700">
          <img src="/brand/monogram-black.svg" alt="چوب و هنر" className="h-full w-full object-contain brightness-0 invert" />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                "group relative flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300",
                isActive
                  ? "bg-forest text-peach shadow-md shadow-forest/20"
                  : "text-forest/40 hover:bg-forest/5 hover:text-forest"
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
        <a
          href="http://localhost:3000/admin"
          target="_blank"
          rel="noopener noreferrer"
          title="پنل مدیریت"
          className="group relative flex h-11 w-11 items-center justify-center rounded-xl text-forest/40 transition-all duration-300 hover:bg-forest/5 hover:text-forest"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-forest px-3 py-1.5 text-xs font-medium text-paper opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
            پنل مدیریت
          </span>
        </a>
      </div>
    </aside>
  );
}
