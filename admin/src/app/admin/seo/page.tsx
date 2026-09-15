import type { Metadata } from "next";
import SeoPlaybook from "@/components/seo/SeoPlaybook";

export const metadata: Metadata = { title: "داشبورد سئو" };

export default function SeoDashboardPage() {
  return (
    <div className="relative min-h-screen bg-paper">
      <header className="relative z-10 border-b border-forest/8 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <div>
            <p className="eyebrow text-brick">SEO DASHBOARD</p>
            <h1 className="mt-1 text-2xl font-light tracking-tightest text-forest">داشبورد سئو</h1>
          </div>
        </div>
      </header>
      <SeoPlaybook />
    </div>
  );
}
