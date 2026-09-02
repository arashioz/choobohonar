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

type Product = {
  _id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  series?: string;
  room?: string;
  shortDescription: string;
  status: string;
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
  const [showProducts, setShowProducts] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

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
      const r = await fetch(`/admin/api/collections?${params}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setItems(data.items || []);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "دریافت کالکشن‌ها ناموفق بود");
    } finally {
      setLoading(false);
    }
  }, [q, statusFilter]);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    try {
      const r = await fetch("/admin/api/collections/products");
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setAllProducts(data || []);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "دریافت محصولات ناموفق بود");
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);
  useEffect(() => { if (showProducts && !allProducts.length) loadProducts(); }, [showProducts, allProducts.length, loadProducts]);

  const stats = useMemo(() => ({
    total: items.length,
    published: items.filter((i) => i.status === "published").length,
    draft: items.filter((i) => i.status === "draft").length,
  }), [items]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setNotice("");
    try {
      const url = editing ? `/admin/api/collections/${editing._id}` : "/admin/api/collections";
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
    await fetch(`/admin/api/collections/${id}`, { method: "DELETE" });
    await load();
  }

  async function seedFromProducts() {
    if (!confirm("آیا می‌خواهید کالکشن‌ها را از سری محصولات موجود بسازید؟")) return;
    setNotice("");
    try {
      const r = await fetch("/admin/api/collections/seed");
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setNotice(`✅ ${data.created} کالکشن جدید ساخته شد از ${data.series.length} سری محصول`);
      await load();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "ساخت خودکار ناموفق بود");
    }
  }

  async function updateProductSeries(productId: string, series: string) {
    try {
      const r = await fetch(`/admin/api/shop/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ series }),
      });
      if (!r.ok) {
        const data = await r.json();
        throw new Error(data.message);
      }
      await loadProducts();
      setNotice("✅ سری محصول به‌روزرسانی شد");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "به‌روزرسانی ناموفق بود");
    }
  }

  const productsBySeries = useMemo(() => {
    const map: Record<string, Product[]> = {};
    allProducts.forEach((p) => {
      const s = p.series || "";
      if (!s) return;
      if (!map[s]) map[s] = [];
      map[s].push(p);
    });
    return map;
  }, [allProducts]);

  const productsWithoutSeries = useMemo(() => allProducts.filter((p) => !p.series), [allProducts]);

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      <div className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8 lg:px-10">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-5 border-b border-forest/10 pb-7">
          <div>
            <p className="text-[10px] tracking-[.18em] text-brick" dir="ltr">COLLECTIONS</p>
            <h1 className="mt-2 text-3xl font-medium text-forest">کالکشن‌ها (سری محصولات)</h1>
            <p className="mt-2 text-xs text-forest/45">مدیریت کالکشن‌ها، تصاویر و سری محصولات. محصولات با سری مشترک خودکار در کالکشن قرار می‌گیرند.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowProducts(!showProducts)} className="rounded-xl border border-forest/20 bg-white px-4 py-3 text-xs font-medium text-forest">
              {showProducts ? "بستن محصولات" : "📦 مدیریت محصولات"}
            </button>
            <button onClick={seedFromProducts} className="rounded-xl bg-sage/40 px-4 py-3 text-xs font-medium text-forest">
              🔄 ساخت خودکار از سری محصولات
            </button>
            <button onClick={() => { setCreating(!creating); setEditing(null); setForm({ name: "", slug: "", excerpt: "", description: "", image: "", series: "", tags: "", status: "draft" }); }} className="rounded-xl bg-forest px-4 py-3 text-xs font-medium text-paper">
              {creating ? "بستن فرم" : "+ کالکشن جدید"}
            </button>
          </div>
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

        {showProducts && (
          <section className="mt-5 overflow-hidden rounded-2xl border border-forest/10 bg-white/75">
            <div className="border-b border-forest/10 p-4">
              <h3 className="text-sm font-medium text-forest">مدیریت محصولات و سری‌ها</h3>
              <p className="mt-1 text-[10px] text-forest/45">برای افزودن محصول به یک کالکشن، فیلد سری (series) آن را ویرایش کنید.</p>
            </div>
            {productsLoading ? (
              <p className="p-10 text-center text-xs text-forest/40">در حال دریافت…</p>
            ) : (
              <div className="divide-y divide-forest/[.07]">
                {productsWithoutSeries.length > 0 && (
                  <div className="bg-peach/10 p-4">
                    <h4 className="mb-2 text-xs font-medium text-brick">محصولات بدون سری ({productsWithoutSeries.length})</h4>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {productsWithoutSeries.slice(0, 12).map((p) => (
                        <div key={p._id} className="flex items-center gap-2 rounded-lg bg-white p-2">
                          <div className="h-10 w-10 shrink-0 rounded bg-forest/5 bg-cover bg-center" style={{ backgroundImage: p.image ? `url(${p.image})` : undefined }} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] text-forest">{p.name}</p>
                            <input
                              className="mt-1 w-full rounded border border-forest/10 px-1.5 py-0.5 text-[9px]"
                              placeholder="سری محصول..."
                              onBlur={(e) => { if (e.target.value.trim()) updateProductSeries(p._id, e.target.value.trim()); }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {Object.entries(productsBySeries).map(([series, products]) => (
                  <div key={series} className="p-4">
                    <h4 className="mb-2 text-xs font-medium text-forest">
                      سری &quot;{series}&quot; ({products.length} محصول)
                    </h4>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                      {products.map((p) => (
                        <div key={p._id} className="flex items-center gap-2 rounded-lg border border-forest/5 p-2">
                          <div className="h-10 w-10 shrink-0 rounded bg-forest/5 bg-cover bg-center" style={{ backgroundImage: p.image ? `url(${p.image})` : undefined }} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] text-forest">{p.name}</p>
                            <p className="text-[9px] text-forest/40">{p.category}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        <section className="mt-5 overflow-hidden rounded-2xl border border-forest/10 bg-white/75">
          <div className="flex flex-wrap gap-3 border-b border-forest/10 p-4">
            <input className={`${input} max-w-sm`} placeholder="جست‌وجوی نام، سری، اسلاگ…" value={q} onChange={(e) => setQ(e.target.value)} />
            <select className={`${input} w-36`} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">همه وضعیت‌ها</option>
              {Object.entries(statusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>

          {notice && <p className="m-4 rounded-xl bg-sage/20 px-3 py-2 text-xs text-forest">{notice}</p>}

          <div className="divide-y divide-forest/[.07]">
            {loading ? (
              <p className="p-10 text-center text-xs text-forest/40">در حال دریافت…</p>
            ) : !items.length ? (
              <p className="p-10 text-center text-xs text-forest/40">کالکشنی ثبت نشده است. از دکمه «ساخت خودکار» استفاده کنید.</p>
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
                  <span className="text-[10px] text-forest/45">
                    {productsBySeries[item.series]?.length || 0} محصول
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
