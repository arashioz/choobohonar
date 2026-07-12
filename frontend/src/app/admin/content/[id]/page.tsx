"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Image from "next/image";
import { api, ContentJob } from "@/lib/api";
import { bodyToBlocks, resultFromJob } from "@/lib/content-types";
import type { ContentJobResult } from "@/lib/content-types";
import ArticleEditor from "@/components/admin/ArticleEditor";

const STATUS_LABEL: Record<string, string> = {
  pending: "در صف",
  processing: "در پردازش",
  image_generation: "تولید تصویر",
  awaiting_review: "منتظر بررسی",
  approved: "تایید شده",
  rejected: "رد شده",
  published: "منتشر شده",
};

interface LogEntry {
  step: string;
  message: string;
  progress: number;
  time: string;
}

function initDraft(job: ContentJob): ContentJobResult {
  const base = resultFromJob(job.result);
  if (job.type === "blog" && (!base.content || base.content.length === 0) && base.body) {
    base.content = bodyToBlocks(base.body);
  }
  if (!base.coverImage && base.imageUrl) base.coverImage = base.imageUrl;
  if (!base.slug && base.title) {
    base.slug = base.title
      .replace(/\s*\|\s*.+$/, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60);
  }
  return base;
}

export default function ContentJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<ContentJob | null>(null);
  const [draft, setDraft] = useState<ContentJobResult | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  const applyJob = useCallback((j: ContentJob) => {
    setJob(j);
    setDraft(initDraft(j));
  }, []);

  useEffect(() => {
    const loadJob = async () => {
      try {
        applyJob(await api.jobs.get(id));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    loadJob();

    const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";

    // Derive the API origin to connect the socket. Support three cases:
    // 1) Explicit full URL via NEXT_PUBLIC_API_URL (e.g. http://localhost:3001/api)
    // 2) Relative API on same origin (default '/api') -> use window.location origin
    // 3) Other relative paths -> resolve against current origin
    let apiOrigin = apiBase.replace(/\/api\/?$/, "");

    if (!apiOrigin) {
      apiOrigin = `${window.location.protocol}//${window.location.host}`;
    } else if (!/^https?:\/\//.test(apiOrigin)) {
      // relative path like '/api' or '/some' -> make absolute against current origin
      apiOrigin = `${window.location.protocol}//${window.location.host}${apiOrigin}`;
    }

    const socket = io(`${apiOrigin}/content`);
    socketRef.current = socket;
    socket.emit("content:subscribe", { jobId: id });

    socket.on("content:progress", (data: { jobId: string; step: string; message: string; progress: number }) => {
      if (data.jobId !== id) return;
      setLogs((prev) => [
        ...prev,
        { step: data.step, message: data.message, progress: data.progress, time: new Date().toLocaleTimeString("fa-IR") },
      ]);
      setJob((prev) =>
        prev ? { ...prev, status: "processing", currentStep: data.message, progress: data.progress } : prev
      );
    });

    socket.on("content:ready", async (data: { jobId: string }) => {
      if (data.jobId !== id) return;
      applyJob(await api.jobs.get(id));
    });

    return () => { socket.disconnect(); };
  }, [id, applyJob]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleSaveDraft = async () => {
    if (!draft) return;
    setActionLoading(true);
    setSaveMsg("");
    try {
      const updated = await api.jobs.update(id, draft);
      applyJob(updated);
      setSaveMsg("ذخیره شد");
      setTimeout(() => setSaveMsg(""), 2500);
    } catch (e) {
      setSaveMsg(e instanceof Error ? e.message : "خطا در ذخیره");
    } finally {
      setActionLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await api.jobs.review(id, { action: "approved" });
      applyJob(await api.jobs.get(id));
    } finally { setActionLoading(false); }
  };

  const handleSaveAndApprove = async () => {
    if (!draft) return;
    setActionLoading(true);
    try {
      await api.jobs.review(id, { action: "edited", changes: draft });
      applyJob(await api.jobs.get(id));
    } finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await api.jobs.review(id, { action: "rejected", reason: rejectReason });
      applyJob(await api.jobs.get(id));
      setShowReject(false);
    } finally { setActionLoading(false); }
  };

  const handlePublish = async () => {
    setActionLoading(true);
    try {
      if (draft) await api.jobs.update(id, draft);
      applyJob(await api.jobs.publish(id));
    } finally { setActionLoading(false); }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">در حال بارگذاری...</div>;
  if (!job || !draft) return <div className="text-center py-20 text-red-400">جاب یافت نشد.</div>;

  const isProcessing = job.status === "processing" || job.status === "image_generation";
  const isAwaitingReview = job.status === "awaiting_review";
  const isEditable = !["rejected", "published"].includes(job.status);
  const readOnly = !isEditable;
  const showEditor = job.type === "blog" && !isProcessing && job.status !== "pending";

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/admin/content" className="text-xs text-gray-400 hover:text-gray-600 mb-2 inline-block">
            ← بازگشت به لیست
          </Link>
          <div className="text-gray-400 text-xs eyebrow mb-1.5">
            {job.type === "blog" ? "مقاله بلاگ" : "معرفی محصول"} · {job.language === "fa" ? "فارسی" : "English"}
          </div>
          <h1 className="text-xl font-display text-gray-900">
            {draft.title || job.input.topic || job.input.productName}
          </h1>
          {draft.slug && (
            <p className="text-xs text-gray-400 mt-1" dir="ltr">
              /magazine/{draft.slug}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full">
            {STATUS_LABEL[job.status]}
          </span>
          {saveMsg && (
            <span className={`text-xs ${saveMsg === "ذخیره شد" ? "text-green-600" : "text-red-500"}`}>
              {saveMsg}
            </span>
          )}
        </div>
      </div>

      {isProcessing && (
        <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-600 text-sm">{job.currentStep}</span>
            <span className="text-gray-400 text-xs">{job.progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-400 transition-all duration-500 rounded-full" style={{ width: `${job.progress}%` }} />
          </div>
          {logs.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto font-mono text-xs space-y-1.5">
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3 text-gray-500">
                  <span className="text-gray-300 shrink-0">{log.time}</span>
                  <span className="text-blue-400 shrink-0">[{log.step}]</span>
                  <span>{log.message}</span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          )}
        </div>
      )}

      {job.status === "pending" && (
        <div className="text-center py-16 text-gray-400 bg-white rounded-xl border">
          <div className="text-5xl mb-4">⏳</div>
          <div>در صف انتظار است...</div>
        </div>
      )}

      {showEditor && job.type === "blog" && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-6">
          <ArticleEditor
            draft={draft}
            onChange={setDraft}
            readOnly={readOnly}
            publishedSlug={job.status === "published" ? draft.slug : undefined}
          />
        </div>
      )}

      {showEditor && job.type === "product" && (
        <ProductPreview draft={draft} onChange={setDraft} readOnly={readOnly} />
      )}

      {isEditable && showEditor && (
        <div className="sticky bottom-4 bg-white/95 backdrop-blur border border-gray-200 rounded-xl p-4 shadow-lg flex flex-wrap gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={actionLoading || readOnly}
            className="px-4 py-2.5 text-sm border border-gray-200 rounded-lg hover:border-gray-400 disabled:opacity-50"
          >
            ذخیره پیش‌نویس
          </button>

          {isAwaitingReview && (
            <>
              <button onClick={handleSaveAndApprove} disabled={actionLoading}
                className="px-4 py-2.5 text-sm bg-forest-900 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50">
                ذخیره و تایید
              </button>
              <button onClick={handleApprove} disabled={actionLoading}
                className="px-4 py-2.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                تایید بدون تغییر
              </button>
              <button onClick={() => setShowReject(true)} disabled={actionLoading}
                className="px-4 py-2.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                رد
              </button>
            </>
          )}

          {job.status === "approved" && (
            <button onClick={handlePublish} disabled={actionLoading}
              className="px-4 py-2.5 text-sm bg-forest-900 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50">
              انتشار در سایت
            </button>
          )}
        </div>
      )}

      {showReject && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
          <div className="text-red-600 text-sm font-medium">دلیل رد کردن</div>
          <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
            rows={3} className="w-full bg-white border border-red-200 rounded-lg px-3 py-2.5 text-sm resize-none" />
          <div className="flex gap-3">
            <button onClick={handleReject} disabled={actionLoading} className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm">تایید رد</button>
            <button onClick={() => setShowReject(false)} className="flex-1 bg-white border py-2 rounded-lg text-sm">انصراف</button>
          </div>
        </div>
      )}

      {job.status === "published" && (
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
          <div className="text-emerald-700 font-medium">منتشر شد</div>
          {job.publishedAt && (
            <div className="text-emerald-500 text-xs mt-1">
              {new Date(job.publishedAt).toLocaleDateString("fa-IR")}
            </div>
          )}
          {draft.slug && (
            <Link href={`/magazine/${draft.slug}`} className="text-sm text-emerald-700 underline mt-2 inline-block">
              مشاهده مقاله
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

const inputClass =
  "w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-gray-400";

function ProductPreview({
  draft,
  onChange,
  readOnly,
}: {
  draft: ContentJobResult;
  onChange: (d: ContentJobResult) => void;
  readOnly?: boolean;
}) {
  const cover = draft.coverImage || draft.imageUrl;
  return (
    <div className="space-y-4 bg-white border rounded-xl p-5">
      {cover && (
        <div className="relative w-full h-52 rounded-xl overflow-hidden">
          <Image src={cover} alt={draft.title || ""} fill className="object-cover" unoptimized />
        </div>
      )}
      <input value={draft.title || ""} onChange={(e) => onChange({ ...draft, title: e.target.value })} disabled={readOnly} className={inputClass} placeholder="عنوان" />
      <textarea value={draft.body || ""} onChange={(e) => onChange({ ...draft, body: e.target.value })} disabled={readOnly} rows={8} className={`${inputClass} resize-y`} />
      <input value={draft.coverImage || ""} onChange={(e) => onChange({ ...draft, coverImage: e.target.value, imageUrl: e.target.value })} disabled={readOnly} className={inputClass} placeholder="URL تصویر" dir="ltr" />
    </div>
  );
}
