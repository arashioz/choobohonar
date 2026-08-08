"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminHomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-0 brandbook-grid opacity-60" aria-hidden />
      <div
        className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-peach/25 blur-[90px]"
        aria-hidden
      />

      <header className="relative z-10 border-b border-forest/8 bg-paper/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center px-5 py-4 sm:px-8">
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
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="mb-10 max-w-lg">
          <p className="eyebrow text-brick">Admin</p>
          <h1 className="mt-3 text-3xl font-light tracking-tightest text-forest sm:text-4xl">
            فضای مدیریت برند
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-forest/55 sm:text-base">
            فروشگاه، برندبوک، استودیو محتوا و ابزارهای مدیریت خانه چوب و هنر.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/admin/shop"
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-forest p-7 sm:p-8",
              "transition-all duration-500 ease-out-expo hover:shadow-xl hover:shadow-forest/20",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
            )}
          >
            <div className="pointer-events-none absolute inset-0 brandbook-grid-dark opacity-30" aria-hidden />
            <div
              className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-peach/25 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              aria-hidden
            />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-peach">Shop</p>
                <h2 className="mt-3 text-2xl font-light tracking-tightest text-paper">
                  فروشگاه
                </h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/60">
                  مدیریت محصولات، ویترین و پیشنهادات فروشگاهی.
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
                  <path d="M3 9h18l-1.5 11.5a2 2 0 0 1-2 1.5H6.5a2 2 0 0 1-2-1.5L3 9Z" />
                  <path d="M8 9V7a4 4 0 0 1 8 0v2" />
                </svg>
              </span>
            </div>

            <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-peach">
              مدیریت فروشگاه
              <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1">
                ←
              </span>
            </span>
          </Link>

          <Link
            href="/admin/content"
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white/70 p-7 sm:p-8",
              "transition-all duration-500 ease-out-expo hover:border-forest/20 hover:bg-white hover:shadow-lg hover:shadow-forest/8",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
            )}
          >
            <div className="pointer-events-none absolute inset-0 brandbook-grid opacity-40" aria-hidden />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-brick">Content Bot</p>
                <h2 className="mt-3 text-2xl font-light tracking-tightest text-forest">
                  چوب‌نویس
                </h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-forest/55">
                  ربات بانمک تولید خودکار مقاله، کپشن و معرفی محصول.
                </p>
              </div>

              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest text-peach transition-transform duration-500 ease-out-expo group-hover:-translate-x-1">
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
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
                  <path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
                  <circle cx="12" cy="12" r="3.25" />
                </svg>
              </span>
            </div>

            <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-forest/70">
              باز کردن استودیو
              <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1">
                ←
              </span>
            </span>
          </Link>

          <Link
            href="/admin/brandbook"
            className={cn(
              "group relative flex flex-col overflow-hidden rounded-2xl border border-forest/10 bg-white/70 p-7 sm:p-8 sm:col-span-2",
              "transition-all duration-500 ease-out-expo hover:border-forest/20 hover:bg-white hover:shadow-lg hover:shadow-forest/8",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-peach focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
            )}
          >
            <div className="pointer-events-none absolute inset-0 brandbook-grid opacity-40" aria-hidden />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-brick">Brandbook</p>
                <h2 className="mt-3 text-2xl font-light tracking-tightest text-forest">
                  برندبوک
                </h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-forest/55">
                  هویت بصری، زبان برند و راهنمای طراحی.
                </p>
              </div>

              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest text-peach transition-transform duration-500 ease-out-expo group-hover:-translate-x-1">
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

            <span className="relative mt-8 inline-flex items-center gap-2 text-sm font-medium text-forest/70">
              مشاهده برندبوک
              <span className="transition-transform duration-500 ease-out-expo group-hover:-translate-x-1">
                ←
              </span>
            </span>
          </Link>
        </div>
      </main>
    </div>
  );
}
