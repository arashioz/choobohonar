"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

type Collection = {
  _id: string;
  name: string;
  slug: string;
  status: "draft" | "published" | "archived";
  excerpt: string;
  description: string;
  image: string;
  gallery: string[];
  series: string;
  tags: string[];
  publishedAt?: string;
  createdAt?: string;
};

const statusLabels: Record<string, string> = { draft: "پیش‌نویس", published: "منتشر‌شده", archived: "آرشیو" };
const statusColors: Record<string, string> = { draft: "bg-yellow-100 text-yellow-800", published: "bg-green-100 text-green-800", archived: "bg-gray-100 text-gray-600" };
const input = "w-full rounded-xl border border-forest/10 bg-[#faf8f5] px-3 py-2.5 text-xs text-forest outline-none focus:border-forest/30";

export default function CollectionsWorkspace() {
  const [items, setItems] = useState<Collection[]>([]);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Collection | null>(null);

  const [form, setForm] = useState({
    name: "", slug: "", excerpt: "", description: "", image: "", series: "", tags: "", status: "draft" as "draft" | "published" | "archived",
  });

  const load = useCallback(async () => {
    setLoading(true);
    setNotice("");
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      const r = await fetch(`/api/collections?${params}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setItems(data.items || []);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "دریافت کالکشن‌ها ناموفق بود");
    } finally {
      setLoading(false);
    }
  }, [q, statusFilter]);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);

  const stats = useMemo(() => ({
    total: items.length,
    published: items.filter((i) => i.status === "published").length,
    draft: items.filter((i) => i.status === "draft").length,
  }), [items]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setNotice("");
    try {
      const url = editing ? `/api/collections/${editing._id}` : "/api/collections";
      const method = editing ? "PATCH" : "POST";
      const r = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tags: form.tags.split(/[،,]/).map((v) => v.trim()).filter(Boolean) }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setForm({ name: "", slug: "", excerpt: "", description: "", image: "", series: "", tags: "", status: "draft" });
      setCreating(false);
      setEditing(null);
      await load();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "ذخیره کالکشن ناموفق بود");
    }
  }

  function startEdit(item: Collection) {
    setEditing(item);
    setForm({
      name: item.name || "",
      slug: item.slug || "",
      excerpt: item.excerpt || "",
      description: item.description || "",
      image: item.image || "",
      series: item.series || "",
      tags: Array.isArray(item.tags) ? item.tags.join(", ") : "",
      status: item.status || "draft",
    });
    setCreating(true);
  }

  async function remove(id: string) {
    if (!confirm("آیا از حذف این کالکشن مطمئن هستید؟")) return;
    await fetch(`/api/collections/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      <div className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8 lg:px-10">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-5 border-b border-forest/10 pb-7">
          <div>
            <p className="text-[10px] tracking-[.18em] text-brick" dir="ltr">COLLECTIONS</p>
            <h1 className="mt-2 text-3xl font-medium text-forest">کالکشن‌ها (سری محصولات)</h1>
            <p className="mt-2 text-xs text-forest/45">مدیریت کالکشن‌ها، تصاویر و سری محصولات. محصولات با سری مشترک خودکار در کالکشن قرار می‌گیرند.</p>
          </div>
          <button onClick={() => { setCreating(!creating); setEditing(null); setForm({ name: "", slug: "", excerpt: "", description: "", image: "", series: "", tags: "", status: "draft" }); }} className="rounded-xl bg-forest px-4 py-3 text-xs font-medium text-paper">
            {creating ? "بستن فرم" : "+ کالکشن جدید"}
          </button>
        </header>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[[stats.total, "کل کالکشن‌ها"], [stats.published, "منتشر‌شده"], [stats.draft, "پیش‌نویس"]].map(([value, label]) => (
            <div key={String(label)} className="rounded-2xl border border-forest/10 bg-white/70 p-4">
              <b className="text-xl text-forest">{Number(value).toLocaleString("fa-IR")}</b>
              <p className="mt-1 text-[10px] text-forest/40">{label}</p>
            </div>
          ))}
        </div>

        {creating && (
          <form onSubmit={submit} className="mt-5 grid gap-3 rounded-2xl border border-forest/10 bg-white/80 p-5 sm:grid-cols-2">
            <input required className={input} placeholder="نام کالکشن (مثلاً آلدر) *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input className={input} dir="ltr" placeholder="اسلاگ (اختیاری - خودکار ساخته می‌شود)" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
            <input required className={input} placeholder="سری محصول (مثلاً alder) *" dir="ltr" value={form.series} onChange={(e) => setForm({ ...form, series: e.target.value })} />
            <input className={input} placeholder="لینک تصویر شاخص" dir="ltr" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            <input className={input} placeholder="برچسب‌ها، با ویرگول جدا کنید" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            <select className={input} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" | "archived" })}>
              {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <textarea className={input} placeholder="توضیحات کوتاه" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
            <textarea className={`${input} sm:col-span-2`} placeholder="توضیحات کامل" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button type="submit" className="w-fit rounded-xl bg-forest px-5 py-3 text-xs text-paper">{editing ? "ذخیره تغییرات" : "ثبت کالکشن"}</button>
          </form>
        )}

        <section className="mt-5 overflow-hidden rounded-2xl border border-forest/10 bg-white/75">
          <div className="flex flex-wrap gap-3 border-b border-forest/10 p-4">
            <input className={`${input} max-w-sm`} placeholder="جست‌وجوی نام، سری، اسلاگ…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className={`${input} w-36`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">همه وضعیت‌ها</option>
              {Object.entries(statusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          {notice && <p className="m-4 rounded-xl bg-peach/30 px-3 py-2 text-xs text-brick">{notice}</p>}

          <div className="divide-y divide-forest/[.07]">
            {loading ? (
              <p className="p-10 text-center text-xs text-forest/40">در حال دریافت…</p>
            ) : !items.length ? (
              <p className="p-10 text-center text-xs text-forest/40">کالکشنی ثبت نشده است.</p>
            ) : (
              items.map((item) => (
                <article key={item._id} className="flex flex-wrap items-center gap-3 px-5 py-4">
                  <div className="min-w-[200px] flex-1">
                    <h2 className="text-sm font-medium text-forest">{item.name}</h2>
                    <p className="mt-1 text-[10px] text-forest/45" dir="ltr">{item.slug}{item.series ? ` · series: ${item.series}` : ""}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[9px] text-forest ${statusColors[item.status] || "bg-gray-100 text-gray-600"}`}>
                    {statusLabels[item.status] || item.status}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(item)} className="text-[10px] text-forest/50 underline">ویرایش</button>
                    <button onClick={() => remove(item._id)} className="text-[10px] text-red-400 underline">حذف</button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
