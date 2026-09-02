"use client";
import { useCallback, useEffect, useMemo, useState } from "react";

type Status = "lead" | "active" | "inactive";
type Tier = "vip" | "silver" | "gold" | null;
type Customer = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  status: Status;
  tier: Tier;
  tags: string[];
  source?: string;
  note?: string;
  referralSlug?: string | null;
  smsOptions?: { enabled: boolean };
  createdAt?: string;
};

const statusLabels: Record<Status, string> = { lead: "سرنخ", active: "فعال", inactive: "غیرفعال" };
const tierLabelsMap: Record<"vip" | "silver" | "gold", string> = { vip: "ویژه (VIP)", silver: "نقره‌ای", gold: "طلایی" };
const tierColorsMap: Record<"vip" | "silver" | "gold", string> = {
  vip: "bg-amber-100 text-amber-800 ring-amber-200",
  silver: "bg-gray-100 text-gray-700 ring-gray-300",
  gold: "bg-yellow-50 text-[#9a7e3f] ring-yellow-200",
};
const tierLabelFor = (tier: Tier) => tier ? tierLabelsMap[tier] : "بدون دسته‌بندی";
const tierColorFor = (tier: Tier) => tier ? tierColorsMap[tier] : "bg-forest/[.04] text-forest/40 ring-transparent";
const input = "w-full rounded-xl border border-forest/10 bg-[#faf8f5] px-3 py-2.5 text-xs text-forest outline-none focus:border-forest/30";
const badge = "rounded-lg px-2.5 py-0.5 text-[9px] font-medium ring-1";

export default function CustomersWorkspace() {
  const [items, setItems] = useState<Customer[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingTier, setEditingTier] = useState(false);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [creating, setCreating] = useState(false);
  const [copyingSlug, setCopyingSlug] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", phone: "", email: "", city: "", source: "", note: "", status: "lead" as Status, tier: "" as string, tags: ""
  });

  const load = useCallback(async () => {
    setLoading(true);
    setNotice("");
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      const r = await fetch(`/admin/api/customers?${params}`);
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setItems(data.items || []);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "دریافت مشتریان ناموفق بود");
    } finally {
      setLoading(false);
    }
  }, [q, statusFilter]);

  const selectedCustomer = useMemo(() => items.find(c => c._id === selectedId) || null, [items, selectedId]);

  useEffect(() => { const timer = setTimeout(load, 250); return () => clearTimeout(timer); }, [load]);
  useEffect(() => { setSelectedId(null); }, [statusFilter]);

  const stats = useMemo(() => ({
    total: items.length,
    active: items.filter((i) => i.status === "active").length,
    vip: items.filter((i) => i.tier === "vip").length,
    silver: items.filter((i) => i.tier === "silver").length,
    gold: items.filter((i) => i.tier === "gold").length,
  }), [items]);

  async function create(event: React.FormEvent) {
    event.preventDefault(); setNotice("");
    try {
      const r = await fetch("/admin/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tier: form.tier || null,
          tags: form.tags.split(/[،,]/).map((v) => v.trim()).filter(Boolean),
        }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setForm({ name: "", phone: "", email: "", city: "", source: "", note: "", status: "lead", tier: "", tags: "" });
      setCreating(false);
      await load();
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "ثبت مشتری ناموفق بود");
    }
  }

  async function updateTier(customerId: string, tier: Tier) {
    try {
      const r = await fetch(`/admin/api/customers/${customerId}/tier`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tier || null }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setItems(prev => prev.map(c => c._id === customerId ? { ...c, tier } : c));
      setEditingTier(false);
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "تغییر دسته‌بندی ناموفق بود");
    }
  }

  async function generateReferralLink(customerId: string) {
    try {
      const r = await fetch(`/admin/api/customers/${customerId}/referral`, { method: "POST" });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      setItems(prev => prev.map(c => c._id === customerId ? { ...c, referralSlug: data.referralSlug } : c));
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "ایجاد لینک ناموفق بود");
    }
  }

  function copySlug(slug: string) {
    navigator.clipboard.writeText(slug);
    setCopyingSlug(slug);
    setTimeout(() => setCopyingSlug(null), 1500);
  }

  const getLandingUrl = (slug: string) => {
    const base = "/landing";
    return `${base}/${encodeURIComponent(slug)}`;
  };

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      <div className="mx-auto max-w-[1400px] px-5 py-7 sm:px-8 lg:px-10">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-5 border-b border-forest/10 pb-7">
          <div>
            <p className="text-[10px] tracking-[.18em] text-brick" dir="ltr">CUSTOMER CRM — TIERS & REFERRAL</p>
            <h1 className="mt-2 text-3xl font-medium text-forest">مدیریت مشتریان</h1>
            <p className="mt-2 text-xs text-forest/45">ثبت مشتری، دسته‌بندی VIP/Silver/Gold و ایجاد لینک دعوت.</p>
          </div>
          <button onClick={() => setCreating(!creating)} className="rounded-xl bg-forest px-4 py-3 text-xs font-medium text-paper">
            {creating ? "بستن فرم" : "+ مشتری جدید"}
          </button>
        </header>

        {/* Stats */}
        <div className="mt-5 grid gap-3 sm:grid-cols-5">
          {[
            [stats.total, "کل کاربران"],
            [stats.active, "کاربر فعال"],
            [stats.vip, "مشتری ویژه (VIP)"],
            [stats.silver, "نقره‌ای"],
            [stats.gold, "طلايی"],
          ].map(([value, label]) => (
            <div key={String(label)} className="rounded-2xl border border-forest/10 bg-white/70 p-4">
              <b className="text-xl text-forest">{Number(value).toLocaleString("fa-IR")}</b>
              <p className="mt-1 text-[10px] text-forest/40">{label}</p>
            </div>
          ))}
        </div>

        {/* Create Form */}
        {creating && (
          <form onSubmit={create} className="mt-5 grid gap-3 rounded-2xl border border-forest/10 bg-white/80 p-5 sm:grid-cols-2">
            <input required className={input} placeholder="نام و نام خانوادگی *" value={form.name} onChange={(e) => setForm({...form,name:e.target.value})} />
            <input required className={input} dir="ltr" placeholder="شماره تماس *" value={form.phone} onChange={(e) => setForm({...form,phone:e.target.value})} />
            <input className={input} dir="ltr" placeholder="ایمیل" value={form.email} onChange={(e) => setForm({...form,email:e.target.value})} />
            <input className={input} placeholder="شهر" value={form.city} onChange={(e) => setForm({...form,city:e.target.value})} />
            <select className={input} value={form.status} onChange={(e) => setForm({...form,status:e.target.value as Status})}>
              {Object.entries(statusLabels).map(([value,label]) => <option key={value} value={value}>{label}</option>)}
            </select>
            <select className={input} value={form.tier} onChange={(e) => setForm({...form,tier:e.target.value})}>
              <option value="">دسته‌بندی (اختیاری)</option>
              <option value="vip">🌟 ویژه (VIP)</option>
              <option value="silver">🥈 نقره‌ای</option>
              <option value="gold">🥇 طلایی</option>
            </select>
            <input className={input} placeholder="منبع آشنایی" value={form.source} onChange={(e) => setForm({...form,source:e.target.value})} />
            <input className={input} placeholder="برچسب‌ها، با ویرگول جدا کنید" value={form.tags} onChange={(e) => setForm({...form,tags:e.target.value})} />
            <textarea className={`${input} sm:col-span-2`} placeholder="یادداشت اولیه" value={form.note} onChange={(e) => setForm({...form,note:e.target.value})} />
            <button type="submit" className="w-fit rounded-xl bg-forest px-5 py-3 text-xs text-paper">ثبت مشتری</button>
          </form>
        )}

        {/* Filters */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-forest/10 bg-white/75">
          <div className="flex flex-wrap gap-3 border-b border-forest/10 p-4">
            <input className={`${input} max-w-sm`} placeholder="جست‌وجوی نام، تلفن، ایمیل…" value={q} onChange={(e)=>setQ(e.target.value)} />
            <select className={`${input} w-32`} value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value as "all"|Status)}>
              <option value="all">همه وضعیت‌ها</option>
              {Object.entries(statusLabels).map(([v,l])=><option key={v} value={v}>{l}</option>)}
            </select>
            <select className={`${input} w-36`} value={tierFilter} onChange={(e)=>setTierFilter(e.target.value)}>
              <option value="all">همه دسته‌بندی‌ها</option>
              <option value="vip">ویژه (VIP)</option>
              <option value="silver">نقره‌ای</option>
              <option value="gold">طلايی</option>
            </select>
          </div>

          {/* Detail Panel + List */}
          <div className="grid min-h-[400px] grid-cols-1 lg:grid-cols-5">
            {/* Customer List */}
            <div className={`divide-y divide-forest/[.07] ${selectedId ? "hidden lg:block lg:col-span-2" : "col-span-full"}`}>
              {notice && <p className="m-4 rounded-xl bg-peach/30 px-3 py-2 text-xs text-brick">{notice}</p>}
              {loading ? <p className="p-10 text-center text-xs text-forest/40">در حال دریافت…</p> : !items.length ? (
                <p className="p-10 text-center text-xs text-forest/40">مشتری ثبت نشده است.</p>
              ) : (
                items
                  .filter((c) => tierFilter === "all" || c.tier === tierFilter)
                  .map(item => (
                    <article
                      key={item._id}
                      className={`flex cursor-pointer flex-wrap items-center gap-3 px-5 py-4 transition-colors hover:bg-forest/[.02] ${selectedId === item._id ? "bg-forest/[.04]" : ""}`}
                      onClick={() => setSelectedId(item._id)}
                    >
                      <div className="min-w-[180px] flex-1">
                        <h2 className="text-sm font-medium text-forest">{item.name}</h2>
                        <p className="mt-1 text-[10px] text-forest/45" dir="ltr">{item.phone}{item.email ? ` · ${item.email}` : ""}</p>
                      </div>
                      <span className="text-[10px] text-forest/45">{item.city || "—"}</span>
                      <span className={badge + ` ${tierColorFor(item.tier)}`}>
                        {tierLabelFor(item.tier)}
                      </span>
                      <span className="rounded-full bg-sage/25 px-2.5 py-1 text-[9px] text-forest">{statusLabels[item.status]}</span>
                    </article>
                  ))
              )}
            </div>

            {/* Detail Panel */}
            <div className={`col-span-3 border-l border-forest/[.07] ${!selectedId ? "hidden lg:block" : "block"}`}>
              {selectedCustomer ? (
                <div className="p-5">
                  <div className="mb-5 flex items-start justify-between lg:hidden">
                    <button onClick={() => setSelectedId(null)} className="text-xs text-forest/50 underline">بازگشت به لیست</button>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-forest">{selectedCustomer.name}</h3>
                    <p className="mt-1 text-xs text-forest/45" dir="ltr">{selectedCustomer.phone}{selectedCustomer.email ? ` · ${selectedCustomer.email}` : ""}</p>
                    <p className="mt-1 text-[10px] text-forest/35">{selectedCustomer.city} • {selectedCustomer.source || ""}</p>
                  </div>

                  {/* Tier Management */}
                  <div className="mb-4 rounded-xl bg-white/60 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-xs font-medium text-forest">دسته‌بندی کمپین</h4>
                      {editingTier ? (
                        <button onClick={() => { updateTier(selectedCustomer._id, selectedCustomer.tier); }} className="text-[9px] text-forest/50 underline">ذخیره</button>
                      ) : (
                        <button onClick={() => setEditingTier(true)} className="text-[9px] text-forest/50 underline">ویرایش</button>
                      )}
                    </div>
                    {!editingTier ? (
                      <span className={`inline-block ${badge} ${tierColorFor(selectedCustomer.tier)}`}>
                        {tierLabelFor(selectedCustomer.tier)}
                      </span>
                    ) : (
                      <div className="flex gap-2">
                        <select
                          className="rounded-lg border border-forest/10 bg-white px-2 py-1 text-[10px]"
                          value={selectedCustomer.tier || ""}
                          onChange={(e) => {
                            const t = e.target.value || null;
                            setItems(prev => prev.map(c => c._id === selectedCustomer._id ? {...c, tier: t as Tier} : c));
                            if (selectedId) setSelectedId(selectedId);
                          }}
                          onBlur={() => updateTier(selectedCustomer._id, selectedCustomer.tier)}
                        >
                          <option value="">بدون دسته</option>
                          <option value="vip">🌟 ویژه (VIP)</option>
                          <option value="silver">🥈 نقره‌ای</option>
                          <option value="gold">🥇 طلایی</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* SMS Options */}
                  <div className="mb-4 rounded-xl bg-white/60 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-xs font-medium text-forest">ارسال پیامک (Dev Mode)</h4>
                    </div>
                    <p className="mb-3 text-[10px] text-forest/40">
                      در حالت توسعه پیامک ارسال نمی‌شود. پس از راه‌اندازی پنل SMS، فعال‌سازی نیازمند تکمیل تنظیمات پنل در بخش تنظیمات است.
                    </p>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCustomer.smsOptions?.enabled || false}
                        onChange={async (e) => {
                          const newVal = e.target.checked;
                          setItems(prev => prev.map(c => c._id === selectedCustomer._id ? {...c, smsOptions: { enabled: newVal }} : c));
                          await fetch(`/admin/api/customers/${selectedCustomer._id}`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ smsOptions: { enabled: newVal } }),
                          }).then(r => r.json()).catch(err => setNotice(err.message));
                          await load();
                        }}
                        className="rounded border-forest/20 accent-forest"
                      />
                      <span className="text-[10px] text-forest/50">فعال‌سازی پیامک برای این مشتری</span>
                    </label>
                  </div>

                  {/* Referral Link */}
                  {!selectedCustomer.referralSlug && (
                    <button
                      onClick={() => generateReferralLink(selectedCustomer._id)}
                      className="mb-4 w-full rounded-xl bg-peach/30 px-4 py-3 text-xs text-brick ring-1 ring-peach/30"
                    >
                      ایجاد لینک دعوت
                    </button>
                  )}

                  {selectedCustomer.referralSlug && (
                    <div className="mb-4 rounded-xl bg-white/60 p-4">
                      <div className="mb-3">
                        <h4 className="text-xs font-medium text-forest">لینک لندینگ</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 rounded-lg bg-forest/[.04] px-3 py-2 text-[10px] text-forest/60" dir="ltr">
                          {getLandingUrl(selectedCustomer.referralSlug)}
                        </code>
                        <button
                          onClick={() => copySlug(selectedCustomer.referralSlug!)}
                          className="rounded-lg bg-forest px-3 py-2 text-[9px] text-paper"
                        >
                          {copyingSlug === selectedCustomer.referralSlug ? "کپی شد ✓" : "کپی"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedCustomer.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {selectedCustomer.tags.map(tag => (
                        <span key={tag} className="rounded bg-forest/[.06] px-2 py-1 text-[9px] text-forest/55">{tag}</span>
                      ))}
                    </div>
                  )}

                  {/* Notes */}
                  {selectedCustomer.note && (
                    <div className="mb-4 rounded-xl bg-peach/15 p-3">
                      <h4 className="mb-1 text-[10px] font-medium text-brick">یادداشت:</h4>
                      <p className="text-[10px] text-forest/60">{selectedCustomer.note}</p>
                    </div>
                  )}

                  {/* Remove Button */}
                  <button
                    onClick={async () => {
                      if (!confirm("آیا از حذف این مشتری مطمئن هستید؟")) return;
                      await fetch(`/admin/api/customers/${selectedCustomer._id}`, { method: "DELETE" }).then(() => load());
                      setSelectedId(null);
                    }}
                    className="text-xs text-red-400 hover:text-red-500"
                  >
                    حذف مشتری
                  </button>
                </div>
              ) : (
                <div className="flex h-full items-center justify-center p-10">
                  <p className="text-center text-xs text-forest/35">یک مشتری را از لیست انتخاب کنید</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
} 
