"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function AdminHomePage() {
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
    <div className="relative min-h-screen overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-0 brandbook-grid opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-peach/25 blur-[90px]"
        aria-hidden
      />

      <header className="relative z-10 border-b border-forest/8 bg-paper/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="relative block h-9 w-8">
              <Image
                src="/brand/monogram-black.svg"
                alt=""
                fill
                className="object-contain"
              />
            </span>
            <div>
              <p className="text-sm font-medium text-forest">خانه چوب و هنر</p>
              <p className="text-xs text-forest/45">پنل مدیریت</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            disabled={loggingOut}
            className="rounded-xl px-3.5 py-2 text-xs font-medium text-forest/55 transition-colors hover:bg-forest/5 hover:text-forest disabled:opacity-60"
          >
            {loggingOut ? "خروج…" : "خروج"}
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-10 max-w-lg">
          <p className="eyebrow text-brick">Admin</p>
          <h1 className="mt-3 text-3xl font-light tracking-tightest text-forest sm:text-4xl">
            فضای مدیریت برند
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-forest/55 sm:text-base">
            از اینجا به برندبوک دیجیتال دسترسی دارید.
          </p>
        </div>

        <Link
          href="/brandbook"
          className={cn(
            "group relative flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-forest p-7 sm:p-9",
            "transition-all duration-500 ease-out-expo hover:shadow-xl hover:shadow-forest/20",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
          )}
        >
          <div className="pointer-events-none absolute inset-0 brandbook-grid-dark opacity-30" aria-hidden />
          <div
            className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-peach/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
            aria-hidden
          />

          <div className="relative flex items-start justify-between gap-6">
            <div>
              <p className="eyebrow text-peach">Brandbook</p>
              <h2 className="mt-3 text-2xl font-light tracking-tightest text-paper sm:text-3xl">
                برندبوک
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-paper/60">
                هویت بصری، زبان برند و راهنمای طراحی خانه چوب و هنر.
              </p>
            </div>

            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-peach text-forest transition-transform duration-500 ease-out-expo group-hover:-translate-x-1">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
            </span>
          </div>

          <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-peach">
            مشاهده برندبوک
            <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1">
              ←
            </span>
          </span>
        </Link>
      </main>
    </div>
  );
}
