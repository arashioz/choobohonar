import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "پنل مدیریت محتوا | چوب و هنر",
};

export default function AdminContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900" dir="rtl">
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display text-base text-gray-800">چوب و هنر</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-400 eyebrow text-xs">پنل هوش مصنوعی</span>
        </div>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/admin/content"
            className="text-gray-500 hover:text-gray-900 transition-colors"
          >
            لیست جاب‌ها
          </Link>
          <Link
            href="/admin/content/new"
            className="bg-forest-900 text-paper px-4 py-1.5 rounded-full text-xs font-medium hover:bg-forest-700 transition-colors"
          >
            + جاب جدید
          </Link>
        </nav>
      </header>
      <main className="p-6 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
