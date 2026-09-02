"use client";

import { useEffect, useState } from "react";

type MagazineSource = "static" | "cms" | "both";
type SmsPanelProvider = "kavenegar" | "twilio" | "smsir" | "daaghoadaman" | "mobilepayment" | "none";

type Settings = {
  googleSearchConsoleVerification: string;
  googleAnalyticsMeasurementId: string;
  magazineSource: MagazineSource;
  siteDomain: string;
  smsProvider: SmsPanelProvider;
  smsApiKey: string;
  smsApiSecret: string;
  smsFromNumber: string;
  smsEnabled: boolean;
  landingEnabled: boolean;
  landingPath: string;
};

const inputClass = "mt-2 w-full rounded-xl border border-forest/10 bg-[#faf8f5] px-3.5 py-3 text-sm text-forest outline-none focus:border-forest-35 focus:bg-white";
const selectClass = "mt-2 w-full rounded-xl border border-forest/10 bg-[#faf8f5] px-3.5 py-3 text-sm text-forest outline-none focus:border-forest-35 focus:bg-white";

const providerLabels: Record<SmsPanelProvider, string> = {
  none: "غیرفعال",
  kavenegar: "کافه‌نباغار (Kavenegar)",
  twilio: "توییو (Twilio)",
  smsir: "پیامک.آی‌آر (SMS.ir)",
  daaghoadaman: "دعا همگام (Daaghoadaman)",
  mobilepayment: "موبایل پیامک (MobilePayment)",
};

export default function SeoSettings() {
  const [form, setForm] = useState<Settings>({
    googleSearchConsoleVerification: "",
    googleAnalyticsMeasurementId: "",
    magazineSource: "both",
    siteDomain: "",
    smsProvider: "none",
    smsApiKey: "",
    smsApiSecret: "",
    smsFromNumber: "",
    smsEnabled: false,
    landingEnabled: false,
    landingPath: "/landing",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [activeTab, setActiveTab] = useState<"seo" | "sms" | "landing">("seo");

  useEffect(() => {
    fetch("/admin/api/settings")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message);
        const magSrc = data.magazineSource === "static" || data.magazineSource === "cms" ? data.magazineSource : "both";
        setForm({ ...data, magazineSource: magSrc as MagazineSource });
      })
      .catch((e) => setNotice(e.message || "دریافت تنظیمات ناموفق بود"))
      .finally(() => setLoading(false));
  }, []);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    try {
      const r = await fetch("/admin/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message);
      const magSrc = data.magazineSource === "static" || data.magazineSource === "cms" ? data.magazineSource : "both";
      setForm({ ...data, magazineSource: magSrc as MagazineSource });
      setNotice("تنظیمات ذخیره شد.");
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "ذخیره ناموفق بود");
    } finally {
      setSaving(false);
    }
  }

  const tabs: { key: "seo" | "sms" | "landing"; label: string }[] = [
    { key: "seo", label: "SEO و گوگل" },
    { key: "sms", label: "پنل پیامک" },
    { key: "landing", label: "لندینگ و دامنه" },
  ];

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      <div className="mx-auto max-w-3xl px-5 py-8 sm:px-8">
        <p className="text-[10px] font-medium tracking-[.18em] text-brick" dir="ltr">SETTINGS</p>
        <h1 className="mt-2 text-3xl font-medium text-forest">تنظیمات سایت</h1>

        {/* Tabs */}
        <div className="mt-6 flex gap-1 rounded-xl bg-white/50 p-1">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-lg py-2.5 text-center transition-all ${activeTab === tab.key ? 'bg-white text-forest shadow-sm' : 'text-forest/45 hover:text-forest/65'}`}
            >
              <span className="block text-xs font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <form onSubmit={save} className="mt-7 space-y-5 rounded-2xl border border-forest/10 bg-white/75 p-5 sm:p-7">
          {/* SEO Tab */}
          {activeTab === "seo" && (
            <>
              <label className="block text-sm font-medium text-forest/70">
                کد تأیید Google Search Console
                <input className={inputClass} dir="ltr" value={form.googleSearchConsoleVerification || ""} onChange={(e) => setForm({ ...form, googleSearchConsoleVerification: e.target.value })} placeholder="کد content یا کل meta tag گوگل" />
              </label>
              <p className="-mt-3 text-[11px] leading-6 text-forest/40">در Search Console روش HTML tag را انتخاب کنید؛ مقدار content یا کل تگ را اینجا Paste کنید.</p>
              
              <label className="block text-sm font-medium text-forest/70">
                Google Analytics Measurement ID <span className="font-normal text-forest/35">(اختیاری)</span>
                <input className={inputClass} dir="ltr" value={form.googleAnalyticsMeasurementId || ""} onChange={(e) => setForm({ ...form, googleAnalyticsMeasurementId: e.target.value })} placeholder="G-XXXXXXXXXX" />
              </label>

              <fieldset className="pt-2">
                <legend className="text-sm font-medium text-forest/70">منبع نمایش مقالات مجله</legend>
                <p className="mt-1 text-[11px] leading-6 text-forest/40">انتخاب کنید کدام مقالات در صفحه مجله و بخش مجله سایت نمایش داده شوند.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {([['both', 'هر دو'], ['static', 'مقالات فعلی سایت'], ['cms', 'مقالات CMS']] as const).map(([value, label]) => (
                    <label key={value} className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-xs transition-colors ${form.magazineSource === value ? 'border-forest bg-forest/5 text-forest' : 'border-forest/10 text-forest/60 hover:border-forest/30'}`}>
                      <input type="radio" name="magazineSource" value={value} checked={form.magazineSource === value} onChange={() => setForm({ ...form, magazineSource: value })} className="accent-forest" />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>
            </>
          )}

          {/* SMS Panel Tab */}
          {activeTab === "sms" && (
            <>
              <div className="rounded-xl bg-peach/15 p-4">
                <p className="text-xs text-brick">به پنل پیامک متصل شوید تا بتوانید به مشتریان خود اطلاع‌رسانی کنید. حالت Dev فعلاً غیرفعال است و پیامکی ارسال نمی‌شود.</p>
              </div>

              <label className="block text-sm font-medium text-forest/70">
                انتخاب پنل پیامک
                <select className={selectClass} value={form.smsProvider} onChange={(e) => setForm({ ...form, smsProvider: e.target.value as SmsPanelProvider })}>
                  {Object.entries(providerLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>

              {form.smsProvider !== "none" && (
                <>
                  <label className="block text-sm font-medium text-forest/70">
                    API Key / Access Key
                    <input className={inputClass} dir="ltr" value={form.smsApiKey || ""} onChange={(e) => setForm({ ...form, smsApiKey: e.target.value })} placeholder="کلید ورود به API پنل" />
                  </label>

                  <label className="block text-sm font-medium text-forest/70">
                    API Secret / Password
                    <input className={inputClass} dir="ltr" type="password" value={form.smsApiSecret || ""} onChange={(e) => setForm({ ...form, smsApiSecret: e.target.value })} placeholder="رمز ورود به API پنل" />
                  </label>

                  <label className="block text-sm font-medium text-forest/70">
                    شماره فرستنده (Sender)
                    <input className={inputClass} dir="ltr" value={form.smsFromNumber || ""} onChange={(e) => setForm({ ...form, smsFromNumber: e.target.value })} placeholder="مثال: 10001234567 یا خط خدماتی" />
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer mt-2">
                    <input type="checkbox" checked={form.smsEnabled} onChange={(e) => setForm({ ...form, smsEnabled: e.target.checked })} className="rounded border-forest/20 accent-forest h-4 w-4" />
                    <span className="text-sm text-forest/70">فعال‌سازی ارسال پیامک از اپلیکیشن</span>
                  </label>
                </>
              )}
            </>
          )}

          {/* Landing & Domain Tab */}
          {activeTab === "landing" && (
            <>
              <div className="rounded-xl bg-sage/15 p-4">
                <p className="text-xs text-forest/70">
                  لینک‌های اختصاصی برای هر مشتری ایجاد می‌شود تا مستقیماً به صفحه فرود مراجعه کنند. دسته‌بندی مشتری (VIP/Silver/Gold) به صورت خودکار به URL اضافه می‌شود.
                </p>
              </div>

              <label className="block text-sm font-medium text-forest/70">
                دامنه اصلی سایت (بدون https://)
                <input className={inputClass} dir="ltr" value={form.siteDomain || ""} onChange={(e) => setForm({ ...form, siteDomain: e.target.value })} placeholder="example.com" />
              </label>
              <p className="text-[11px] text-forest/40">دامنه‌ای که برای لندینگ‌پیج استفاده می‌شود. مثال: choobohonar.com</p>

              <label className="block text-sm font-medium text-forest/70">
                مسیر لندینگ (Landing Path)
                <input className={inputClass} dir="ltr" value={form.landingPath || "/landing"} onChange={(e) => setForm({ ...form, landingPath: e.target.value })} placeholder="/landing" />
              </label>
              <p className="text-[11px] text-forest/40">مسیری که لینک‌های دعوت مشتریان به آن ارجاع می‌شوند. مثال: /landing → example.com/landing/cname-hashcode</p>

              <label className="flex items-center gap-3 cursor-pointer mt-2">
                <input type="checkbox" checked={form.landingEnabled} onChange={(e) => setForm({ ...form, landingEnabled: e.target.checked })} className="rounded border-forest/20 accent-forest h-4 w-4" />
                <span className="text-sm text-forest/70">فعال‌سازی لندینگ پیج کمپین</span>
              </label>

              {form.landingEnabled && form.siteDomain && (
                <div className="mt-3 rounded-xl bg-white/60 p-4">
                  <p className="text-[10px] text-forest/40 mb-2">پیش‌نمایش لینک نمونه:</p>
                  <code className="block break-all text-xs text-brick" dir="ltr">
                    {form.siteDomain.replace(/^https?:\/\//, '')}{form.landingPath}/customer-sample-vip
                  </code>
                </div>
              )}
            </>
          )}

          {notice && <p className="rounded-xl bg-sage/20 px-4 py-3 text-xs text-forest">{notice}</p>}
          <button disabled={loading || saving} className="rounded-xl bg-forest px-5 py-3 text-sm font-medium text-paper disabled:opacity-50">
            {saving ? "در حال ذخیره…" : "ذخیره تنظیمات"}
          </button>
        </form>
      </div>
    </main>
  );
} 
