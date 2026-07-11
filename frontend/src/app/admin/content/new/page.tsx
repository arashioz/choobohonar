"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, CreateJobInput } from "@/lib/api";

export default function NewContentJobPage() {
  const router = useRouter();
  const [type, setType] = useState<"blog" | "product">("blog");
  const [language, setLanguage] = useState<"fa" | "en">("fa");
  const [priority, setPriority] = useState<"high" | "normal" | "low">("normal");
  const [topic, setTopic] = useState("");
  const [keywords, setKeywords] = useState("");
  const [productName, setProductName] = useState("");
  const [materials, setMaterials] = useState("");
  const [features, setFeatures] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const input: CreateJobInput = { type, language, priority };
    if (type === "blog") {
      input.topic = topic;
      input.targetKeywords = keywords.split(",").map((k) => k.trim()).filter(Boolean);
    } else {
      input.productName = productName;
      input.materials = materials.split(",").map((m) => m.trim()).filter(Boolean);
      input.features = features.split(",").map((f) => f.trim()).filter(Boolean);
    }

    try {
      const job = await api.jobs.create(input);
      router.push(`/admin/content/${job._id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطا در ایجاد جاب");
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-gray-400";
  const selectClass = "w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-gray-400";

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-display text-xl text-gray-900 mb-1">جاب جدید</h1>
      <p className="text-gray-400 text-sm mb-7">تولید محتوا با هوش مصنوعی</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type */}
        <div>
          <label className="block text-xs eyebrow text-gray-400 mb-2.5">نوع محتوا</label>
          <div className="flex gap-3">
            {(["blog", "product"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  type === t
                    ? "bg-forest-900 text-white border-forest-900"
                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-400"
                }`}>
                {t === "blog" ? "📝 مقاله بلاگ" : "📦 معرفی محصول"}
              </button>
            ))}
          </div>
        </div>

        {/* Language + Priority */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs eyebrow text-gray-400 mb-2">زبان</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value as "fa" | "en")} className={selectClass}>
              <option value="fa">فارسی</option>
              <option value="en">English</option>
            </select>
          </div>
          <div>
            <label className="block text-xs eyebrow text-gray-400 mb-2">اولویت</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as "high" | "normal" | "low")} className={selectClass}>
              <option value="high">فوری</option>
              <option value="normal">معمولی</option>
              <option value="low">پایین</option>
            </select>
          </div>
        </div>

        {/* Blog fields */}
        {type === "blog" && (
          <>
            <div>
              <label className="block text-xs eyebrow text-gray-400 mb-2">موضوع مقاله</label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} required
                placeholder={language === "fa" ? "مثال: انواع چوب برای دکوراسیون داخلی" : "e.g. Types of wood for interior design"}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-xs eyebrow text-gray-400 mb-2">کلیدواژه‌ها (با کاما)</label>
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)}
                placeholder={language === "fa" ? "چوب دکوراسیون, طراحی داخلی" : "wood decor, interior design"}
                className={inputClass} />
            </div>
          </>
        )}

        {/* Product fields */}
        {type === "product" && (
          <>
            <div>
              <label className="block text-xs eyebrow text-gray-400 mb-2">نام محصول</label>
              <input value={productName} onChange={(e) => setProductName(e.target.value)} required
                placeholder={language === "fa" ? "مثال: میز ناهارخوری گردو ماسیو" : "e.g. Solid Walnut Dining Table"}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-xs eyebrow text-gray-400 mb-2">مواد اولیه (با کاما)</label>
              <input value={materials} onChange={(e) => setMaterials(e.target.value)}
                placeholder={language === "fa" ? "چوب گردو ماسیو, روغن طبیعی" : "solid walnut, natural oil"}
                className={inputClass} />
            </div>
            <div>
              <label className="block text-xs eyebrow text-gray-400 mb-2">ویژگی‌ها (با کاما)</label>
              <input value={features} onChange={(e) => setFeatures(e.target.value)}
                placeholder={language === "fa" ? "۸ نفره, ابعاد ۲۰۰×۱۰۰" : "seats 8, 200x100cm"}
                className={inputClass} />
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">{error}</div>
        )}

        <button type="submit" disabled={loading}
          className="w-full bg-forest-900 text-white py-3 rounded-xl font-medium text-sm hover:bg-forest-700 disabled:opacity-50 transition-colors">
          {loading ? "در حال ارسال..." : "شروع تولید محتوا"}
        </button>
      </form>
    </div>
  );
}
