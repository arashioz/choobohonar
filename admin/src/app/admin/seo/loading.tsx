export default function SeoLoading() {
  return (
    <main className="min-h-screen animate-pulse bg-paper px-5 pt-32 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="h-4 w-32 rounded bg-brick/15" />
        <div className="mt-6 h-16 max-w-2xl rounded bg-forest/10 md:h-24" />
        <div className="mt-5 h-5 max-w-xl rounded bg-forest/[0.07]" />
        <div className="mt-16 grid gap-px bg-forest/10 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-32 bg-paper" />)}
        </div>
        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <div className="h-64 rounded bg-forest/[0.06]" />
          <div className="h-64 rounded bg-forest/[0.06]" />
        </div>
        <p className="mt-8 text-center text-xs text-forest/40">در حال آماده‌سازی داشبورد سئو…</p>
      </div>
    </main>
  );
}
