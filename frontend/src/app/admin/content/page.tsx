"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, ContentJob, QueueStats } from "@/lib/api";

const STATUS_LABEL: Record<string, string> = {
  pending: "در صف",
  processing: "در پردازش",
  image_generation: "تولید تصویر",
  awaiting_review: "منتظر بررسی",
  approved: "تایید شده",
  rejected: "رد شده",
  published: "منتشر شده",
};

const STATUS_COLOR: Record<string, string> = {
  pending: "bg-gray-100 text-gray-500",
  processing: "bg-blue-50 text-blue-600",
  image_generation: "bg-blue-50 text-blue-600",
  awaiting_review: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-600",
  published: "bg-emerald-50 text-emerald-700",
};

const PRIORITY_LABEL: Record<string, string> = {
  high: "فوری",
  normal: "معمولی",
  low: "پایین",
};

const TYPE_LABEL: Record<string, string> = {
  blog: "بلاگ",
  product: "محصول",
};

export default function ContentListPage() {
  const [jobs, setJobs] = useState<ContentJob[]>([]);
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [jobList, queueStats] = await Promise.all([
        api.jobs.list(filter || undefined),
        api.stats(),
      ]);
      setJobs(jobList);
      setStats(queueStats);
      setError("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "خطای ناشناخته");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    setLoading(true);
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "در صف", value: stats.pending, color: "text-gray-500", bg: "bg-white" },
            { label: "در پردازش", value: stats.processing, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "منتظر بررسی", value: stats.awaitingReview, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "منتشر امروز", value: stats.completedToday, color: "text-emerald-600", bg: "bg-emerald-50" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-5 border border-gray-200`}>
              <div className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-400 mt-1 eyebrow">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {["", "pending", "processing", "awaiting_review", "approved", "published", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${
              filter === s
                ? "bg-forest-900 text-white font-medium"
                : "bg-white text-gray-500 hover:text-gray-900 border border-gray-200"
            }`}
          >
            {s ? STATUS_LABEL[s] : "همه"}
          </button>
        ))}
        <button
          onClick={load}
          className="mr-auto text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          بروزرسانی
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">
          خطا در بارگذاری داده: {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">در حال بارگذاری...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-4">📭</div>
          <div>هیچ جابی وجود ندارد</div>
          <Link href="/admin/content/new" className="mt-4 inline-block text-forest-900 text-sm hover:underline">
            اولین جاب را بسازید
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs eyebrow bg-gray-50">
                <th className="text-right p-4 font-medium">نوع</th>
                <th className="text-right p-4 font-medium">موضوع / محصول</th>
                <th className="text-right p-4 font-medium">زبان</th>
                <th className="text-right p-4 font-medium">اولویت</th>
                <th className="text-right p-4 font-medium">وضعیت</th>
                <th className="text-right p-4 font-medium">تاریخ</th>
                <th className="text-right p-4 font-medium">اقدام</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {TYPE_LABEL[job.type]}
                    </span>
                  </td>
                  <td className="p-4 text-gray-800 max-w-xs truncate">
                    {job.input.topic || job.input.productName || "—"}
                    {(job.status === "processing" || job.status === "image_generation") && (
                      <div className="text-xs text-blue-500 mt-0.5">{job.currentStep}</div>
                    )}
                  </td>
                  <td className="p-4 text-gray-400">{job.language === "fa" ? "فارسی" : "EN"}</td>
                  <td className="p-4 text-gray-400 text-xs">{PRIORITY_LABEL[job.priority]}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[job.status]}`}>
                        {STATUS_LABEL[job.status]}
                      </span>
                      {(job.status === "processing" || job.status === "image_generation") && (
                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-400 transition-all duration-500"
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-gray-400 text-xs">
                    {new Date(job.createdAt).toLocaleDateString("fa-IR")}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/content/${job._id}`}
                      className={`text-xs font-medium hover:underline ${
                        job.status === "awaiting_review" ? "text-amber-600" : "text-gray-400"
                      }`}
                    >
                      {job.status === "awaiting_review" ? "بررسی کن" : "مشاهده"}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
