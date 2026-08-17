"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const BRANDBOOK_URL =
  process.env.NEXT_PUBLIC_BRANDBOOK_URL || "/admin/brandbook";

export default function AdminDashboard() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      router.replace("/admin");
      return;
    }
    setReady(true);
  }, [router]);

  function logout() {
    localStorage.removeItem("admin_token");
    router.replace("/admin");
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        در حال بارگذاری…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
          <div>
            <p className="text-sm font-medium text-gray-900">خانه چوب و هنر</p>
            <p className="text-xs text-gray-500">پنل مدیریت</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            خروج
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12">
        <h1 className="text-2xl font-semibold text-gray-900">داشبورد</h1>
        <p className="mt-2 text-sm text-gray-500">
          از اینجا به برندبوک دیجیتال دسترسی دارید.
        </p>

        <Link
          href={BRANDBOOK_URL}
          className="mt-8 flex items-center justify-between rounded-2xl bg-gray-900 p-7 text-white transition hover:bg-gray-800"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Brandbook
            </p>
            <h2 className="mt-2 text-2xl font-light">برندبوک</h2>
            <p className="mt-2 max-w-md text-sm text-white/60">
              هویت بصری، زبان برند و راهنمای طراحی
            </p>
            <span className="mt-6 inline-block text-sm text-white/80">
              مشاهده برندبوک ←
            </span>
          </div>
        </Link>
      </main>
    </div>
  );
}
