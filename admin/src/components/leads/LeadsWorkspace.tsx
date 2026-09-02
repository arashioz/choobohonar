"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Status = "new" | "read" | "archived";
type Kind = "lead" | "interior";
type RequestItem = {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  status: Status;
  adminNote?: string;
  createdAt?: string;
  type?: "contact" | "consultation" | "cooperation" | "representation";
  source?: string;
  data?: Record<string, unknown>;
  styles?: string[];
  location?: string;
  area?: string;
  spaceType?: string;
  roomCount?: string;
  budget?: string;
  timeline?: string;
  consultation?: string;
  notes?: string;
};

const statusLabels: Record<Status, string> = { new: "جدید", read: "بررسی‌شده", archived: "بایگانی" };
const typeLabels: Record<NonNullable<RequestItem["type"]>, string> = {
  contact: "تماس",
  consultation: "مشاوره",
  cooperation: "همکاری",
  representation: "نمایندگی",
};
const inputClass = "w-full rounded-lg border border-forest/10 bg-white px-3 py-2.5 text-xs text-forest outline-none focus:border-forest/35";

function date(value?: string) {
  return value ? new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)) : "—";
}

function details(item: RequestItem, kind: Kind): [string, string][] {
  if (kind === "interior") {
    return [
      ["سبک‌ها", item.styles?.join("، ") || "—"],
      ["موقعیت", item.location || "—"],
      ["متراژ", item.area || "—"],
      ["نوع فضا", item.spaceType || "—"],
      ["تعداد اتاق", item.roomCount || "—"],
      ["بودجه", item.budget || "—"],
      ["زمان‌بندی", item.timeline || "—"],
      ["نحوه مشاوره", item.consultation || "—"],
      ["توضیحات", item.notes || "—"],
    ];
  }

  return [
    ["نوع درخواست", item.type ? typeLabels[item.type] : "—"],
    ["مبدأ", item.source || "—"],
    ...Object.entries(item.data || {}).map(([key, value]): [string, string] => [key, Array.isArray(value) ? value.join("، ") : String(value ?? "—")]),
  ];
}

export default function LeadsWorkspace() {
  const [kind, setKind] = useState<Kind>("lead");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [items, setItems] = useState<RequestItem[]>([]);
  const [selected, setSelected] = useState<RequestItem | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ kind });
      if (status !== "all") params.set("status", status);
      const response = await fetch(`/admin/api/leads?${params}`, { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "دریافت درخواست‌ها ناموفق بود");
      setItems(data);
      setSelected((current) => data.find((item: RequestItem) => item._id === current?._id) || null);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "دریافت درخواست‌ها ناموفق بود");
    } finally {
      setLoading(false);
    }
  }, [kind, status]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => { setSelected(null); setNote(""); }, [kind]);

  const counts = useMemo(() => ({
    total: items.length,
    fresh: items.filter((item) => item.status === "new").length,
    read: items.filter((item) => item.status === "read").length,
  }), [items]);

  function select(item: RequestItem) {
    setSelected(item);
    setNote(item.adminNote || "");
    setNotice("");
  }

  async function update(nextStatus: Status) {
    if (!selected || saving) return;
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch(`/admin/api/leads/${selected._id}?kind=${kind}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus, adminNote: note.trim() }),
      });
      const updated = await response.json();
      if (!response.ok) throw new Error(updated.message || "ذخیره تغییرات ناموفق بود");
      setItems((current) => current.map((item) => item._id === updated._id ? updated : item));
      setSelected(updated);
      setNotice("تغییرات ذخیره شد.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "ذخیره تغییرات ناموفق بود");
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!selected || saving || !window.confirm("این درخواست حذف شود؟ این عمل قابل بازگشت نیست.")) return;
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch(`/admin/api/leads/${selected._id}?kind=${kind}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "حذف درخواست ناموفق بود");
      }
      setItems((current) => current.filter((item) => item._id !== selected._id));
      setSelected(null);
      setNotice("درخواست حذف شد.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "حذف درخواست ناموفق بود");
    } finally {
      setSaving(false);
    }
  }

  return <main className="min-h-screen bg-[#f6f3ee]">
    <div className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 lg:px-10">
      <header className="border-b border-forest/10 pb-7">
        <p className="text-[10px] tracking-[.18em] text-brick" dir="ltr">INQUIRIES</p>
        <h1 className="mt-2 text-3xl font-medium text-forest">درخواست‌های سایت</h1>
        <p className="mt-2 text-xs text-forest/45">پیام‌های تماس، مشاوره، همکاری، نمایندگی و بریف‌های معماری داخلی.</p>
      </header>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[[counts.total, "کل درخواست‌ها"], [counts.fresh, "جدید"], [counts.read, "بررسی‌شده"]].map(([value, label]) => <div key={String(label)} className="rounded-xl border border-forest/10 bg-white/70 p-4"><b className="text-xl text-forest">{Number(value).toLocaleString("fa-IR")}</b><p className="mt-1 text-[10px] text-forest/40">{label}</p></div>)}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="inline-flex rounded-lg border border-forest/10 bg-white p-1">
          <button type="button" onClick={() => setKind("lead")} className={`rounded-md px-3 py-2 text-xs ${kind === "lead" ? "bg-forest text-paper" : "text-forest/55"}`}>فرم‌های عمومی</button>
          <button type="button" onClick={() => setKind("interior")} className={`rounded-md px-3 py-2 text-xs ${kind === "interior" ? "bg-forest text-paper" : "text-forest/55"}`}>بریف معماری</button>
        </div>
        <select value={status} onChange={(event) => setStatus(event.target.value as "all" | Status)} className="rounded-lg border border-forest/10 bg-white px-3 py-2 text-xs text-forest outline-none">
          <option value="all">همه وضعیت‌ها</option>
          {Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>

      {notice ? <p className="mt-4 rounded-lg bg-peach/30 px-3 py-2 text-xs text-brick">{notice}</p> : null}

      <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section className="overflow-hidden rounded-xl border border-forest/10 bg-white/75">
          {loading ? <p className="p-10 text-center text-xs text-forest/40">در حال دریافت…</p> : items.length ? <div className="divide-y divide-forest/[.07]">
            {items.map((item) => <button key={item._id} type="button" onClick={() => select(item)} className={`flex w-full flex-wrap items-center gap-3 px-5 py-4 text-right transition-colors hover:bg-forest/[.025] ${selected?._id === item._id ? "bg-peach/20" : ""}`}>
              <span className="min-w-[150px] flex-1"><b className="block text-sm font-medium text-forest">{item.name}</b><span className="mt-1 block text-[10px] text-forest/45" dir="ltr">{item.phone}{item.email ? ` · ${item.email}` : ""}</span></span>
              <span className="text-[10px] text-forest/45">{kind === "interior" ? item.spaceType || "بریف معماری" : item.type ? typeLabels[item.type] : "فرم"}</span>
              <span className="text-[10px] text-forest/40">{date(item.createdAt)}</span>
              <span className="rounded-full bg-sage/25 px-2.5 py-1 text-[9px] text-forest">{statusLabels[item.status]}</span>
            </button>)}
          </div> : <p className="p-10 text-center text-xs text-forest/40">درخواستی برای این فیلتر وجود ندارد.</p>}
        </section>

        <aside className="h-fit rounded-xl border border-forest/10 bg-white/80 p-5 xl:sticky xl:top-6">
          {selected ? <>
            <div className="flex items-start justify-between gap-3 border-b border-forest/10 pb-4"><div><h2 className="text-lg font-medium text-forest">{selected.name}</h2><p className="mt-1 text-xs text-forest/50" dir="ltr">{selected.phone}{selected.email ? ` · ${selected.email}` : ""}</p></div><span className="text-[10px] text-forest/40">{date(selected.createdAt)}</span></div>
            <dl className="mt-4 space-y-3">{details(selected, kind).map(([label, value]) => <div key={label}><dt className="text-[10px] text-forest/40">{label}</dt><dd className="mt-1 whitespace-pre-wrap text-xs leading-6 text-forest/75">{value}</dd></div>)}</dl>
            <div className="mt-5 border-t border-forest/10 pt-4"><label className="text-[10px] text-forest/45">یادداشت مدیر</label><textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className={`${inputClass} mt-2 resize-y`} placeholder="نتیجه تماس یا پیگیری…" />
              <div className="mt-3 flex flex-wrap gap-2"><select value={selected.status} onChange={(event) => void update(event.target.value as Status)} disabled={saving} className={`${inputClass} w-auto`}><option value="new">جدید</option><option value="read">بررسی‌شده</option><option value="archived">بایگانی</option></select><button type="button" onClick={() => void update(selected.status)} disabled={saving} className="rounded-lg bg-forest px-3 py-2 text-xs text-paper disabled:opacity-50">{saving ? "در حال ذخیره…" : "ذخیره یادداشت"}</button><button type="button" onClick={() => void remove()} disabled={saving} className="rounded-lg border border-brick/25 px-3 py-2 text-xs text-brick disabled:opacity-50">حذف</button></div>
            </div>
          </> : <p className="py-12 text-center text-xs leading-6 text-forest/45">یک درخواست را برای دیدن جزئیات و پیگیری انتخاب کنید.</p>}
        </aside>
      </div>
    </div>
  </main>;
}
