"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Link from "next/link";
import { cn, toFa, formatBytes } from "@/lib/utils";

export interface FileEntryItem {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  updatedAt: string;
  extension?: string;
  category?: "image" | "video" | "audio" | "document" | "archive" | "other";
  url?: string;
  itemsCount?: number;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface ListApiResponse {
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
  items: FileEntryItem[];
  foldersCount: number;
  filesCount: number;
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  message?: string;
}

export default function FileManagerWorkspace() {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
    { name: "uploads", path: "" },
  ]);
  const [items, setItems] = useState<FileEntryItem[]>([]);
  const [totalFiles, setTotalFiles] = useState<number>(0);
  const [totalFolders, setTotalFolders] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & sorting
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [filterType, setFilterType] = useState<
    "all" | "images" | "videos" | "documents" | "folders"
  >("all");
  const [sortBy, setSortBy] = useState<string>("date_desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Actions state
  const [previewItem, setPreviewItem] = useState<FileEntryItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FileEntryItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState<boolean>(false);
  const [newFolderName, setNewFolderName] = useState<string>("");
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Upload state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [uploadCurrentFile, setUploadCurrentFile] = useState<string>("");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Show auto-dismissing toast
  const showToast = useCallback(
    (type: "success" | "error", text: string, durationMs = 3500) => {
      setToastMessage({ type, text });
      setTimeout(() => {
        setToastMessage((prev) => (prev?.text === text ? null : prev));
      }, durationMs);
    },
    [],
  );

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch directory contents
  const loadFiles = useCallback(
    async (path = currentPath, pageNum = page) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          path,
          page: String(pageNum),
          limit: "100",
          sort: sortBy,
        });
        if (debouncedSearch.trim()) {
          params.set("search", debouncedSearch.trim());
        }
        if (filterType !== "all") {
          params.set("type", filterType);
        }

        const res = await fetch(`/admin/api/files?${params.toString()}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "خطا در دریافت لیست فایل‌ها");
        }

        const data: ListApiResponse = await res.json();
        setItems(data.items || []);
        setBreadcrumbs(data.breadcrumbs || [{ name: "uploads", path: "" }]);
        setTotalFiles(data.filesCount || 0);
        setTotalFolders(data.foldersCount || 0);
        setTotalPages(data.totalPages || 1);
      } catch (err: any) {
        setError(err.message || "خطا در برقراری ارتباط با سرور");
      } finally {
        setLoading(false);
      }
    },
    [currentPath, page, sortBy, debouncedSearch, filterType],
  );

  useEffect(() => {
    loadFiles(currentPath, page);
  }, [loadFiles, currentPath, page]);

  // Navigate to path
  function navigateTo(path: string) {
    setCurrentPath(path);
    setPage(1);
    setSearchQuery("");
  }

  // Parent directory navigation
  function navigateUp() {
    if (!currentPath) return;
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    navigateTo(parts.join("/"));
  }

  // Copy link
  async function copyLink(url: string) {
    try {
      const fullUrl = url.startsWith("http")
        ? url
        : `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedUrl(url);
      showToast("success", "لینک فایل در کلیپ‌بورد کپی شد");
      setTimeout(() => setCopiedUrl(null), 2500);
    } catch {
      showToast("error", "خطا در کپی لینک");
    }
  }

  // Delete item
  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch("/admin/api/files", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: deleteTarget.path }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "خطا در حذف مورد");
      }
      showToast(
        "success",
        deleteTarget.isDirectory ? "پوشه حذف شد" : "فایل با موفقیت حذف شد",
      );
      setDeleteTarget(null);
      loadFiles(currentPath, page);
    } catch (err: any) {
      showToast("error", err.message || "خطا در حذف");
    } finally {
      setIsDeleting(false);
    }
  }

  // Create new folder
  async function handleCreateFolder(e: React.FormEvent) {
    e.preventDefault();
    const clean = newFolderName.trim();
    if (!clean) return;
    setIsCreatingFolder(true);
    try {
      const res = await fetch("/admin/api/files/folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: currentPath, name: clean }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "خطا در ساخت پوشه");
      }
      showToast("success", data.message || `پوشه «${clean}» ساخته شد`);
      setNewFolderName("");
      setShowNewFolderModal(false);
      loadFiles(currentPath, 1);
    } catch (err: any) {
      showToast("error", err.message || "خطا در ساخت پوشه");
    } finally {
      setIsCreatingFolder(false);
    }
  }

  // Upload one file via XHR for progress tracking
  function uploadSingleFile(file: File, targetPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/admin/api/files/upload");
      xhr.withCredentials = true;

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          setUploadPercent(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err.message || "خطا در آپلود فایل"));
          } catch {
            reject(new Error(`آپلود ناموفق بود (کد ${xhr.status})`));
          }
        }
      });

      xhr.addEventListener("error", () => reject(new Error("خطای ارتباط در آپلود")));
      xhr.addEventListener("abort", () => reject(new Error("آپلود لغو شد")));

      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", targetPath);
      xhr.send(formData);
    });
  }

  // Process batch of uploaded files sequentially
  async function handleUploadFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    if (!files.length) return;

    setIsUploading(true);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadCurrentFile(`${file.name} (${toFa(i + 1)} از ${toFa(files.length)})`);
      setUploadPercent(0);
      try {
        await uploadSingleFile(file, currentPath);
        successCount++;
      } catch (err: any) {
        failCount++;
        showToast("error", `خطا در آپلود ${file.name}: ${err.message}`);
      }
    }

    setIsUploading(false);
    setUploadPercent(0);
    setUploadCurrentFile("");

    if (successCount > 0) {
      showToast(
        "success",
        `${toFa(successCount)} فایل با موفقیت در پوشه جاری ذخیره شد`,
      );
      loadFiles(currentPath, 1);
    }
  }

  // Drag and drop handlers
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFiles(e.dataTransfer.files);
    }
  }

  return (
    <main
      className="relative min-h-screen bg-[#f6f3ee] pb-24 text-forest transition-colors"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drag & drop overlay indicator */}
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest/70 p-6 backdrop-blur-sm">
          <div className="flex max-w-md flex-col items-center rounded-3xl border-2 border-dashed border-paper/60 bg-forest/90 p-10 text-center text-paper shadow-2xl">
            <svg
              className="h-16 w-16 animate-bounce text-peach"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <h3 className="mt-4 text-xl font-medium">رها کردن فایل‌ها برای آپلود</h3>
            <p className="mt-2 text-xs text-paper/70">
              فایل‌ها مستقیماً در پوشه «{currentPath || "uploads"}» بارگذاری می‌شوند.
            </p>
          </div>
        </div>
      )}

      {/* Floating toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex max-w-md items-center gap-3 rounded-2xl border border-forest/15 bg-white/95 px-5 py-3.5 shadow-2xl shadow-forest/15 backdrop-blur-md transition-all duration-300">
          <span
            className={cn(
              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white",
              toastMessage.type === "success" ? "bg-[#3e8457]" : "bg-brick",
            )}
          >
            {toastMessage.type === "success" ? (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </span>
          <p className="text-xs font-medium text-forest">{toastMessage.text}</p>
        </div>
      )}

      {/* Uploading progress notification bar */}
      {isUploading && (
        <div className="fixed bottom-6 right-6 z-50 w-80 rounded-2xl border border-forest/10 bg-white/95 p-4 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="flex items-center gap-2 text-forest">
              <svg className="h-4 w-4 animate-spin text-brick" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              در حال آپلود…
            </span>
            <span className="font-mono text-brick">{toFa(uploadPercent)}٪</span>
          </div>
          <p className="mt-1 truncate text-[10px] text-forest/50">{uploadCurrentFile}</p>
          <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-forest/10">
            <div
              className="h-full rounded-full bg-brick transition-all duration-200"
              style={{ width: `${uploadPercent}%` }}
            />
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        {/* Page Header */}
        <header className="border-b border-forest/10 pb-6">
          <div className="mb-2 flex items-center gap-2 text-[10px] text-forest/35">
            <Link href="/admin" className="transition-colors hover:text-forest">
              پنل مدیریت
            </Link>
            <span>/</span>
            <span className="font-medium text-forest/70">فایل منیجر</span>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-medium tracking-[0.18em] text-brick" dir="ltr">
                STORAGE & MEDIA ASSETS
              </p>
              <h1 className="mt-1.5 text-2xl font-medium tracking-tightest text-forest sm:text-3xl">
                فایل منیجر
              </h1>
              <p className="mt-1.5 text-xs text-forest/50">
                مرور، مدیریت، مشاهده پیش‌نمایش، کپی لینک مستقیم و حذف فایل‌ها و پوشه‌های بارگذاری‌شده
              </p>
            </div>

            {/* Top primary actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowNewFolderModal(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-forest/15 bg-white/80 px-3.5 py-2.5 text-xs font-medium text-forest shadow-sm transition hover:bg-white hover:shadow"
              >
                <svg className="h-4 w-4 text-forest/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                  <line x1="12" y1="10" x2="12" y2="16" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                </svg>
                پوشه جدید
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-medium text-paper shadow transition hover:bg-forest/90 disabled:opacity-50"
              >
                <svg className="h-4 w-4 text-peach" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                آپلود فایل
              </button>

              <button
                type="button"
                onClick={() => loadFiles(currentPath, page)}
                disabled={loading}
                title="تازه‌سازی لیست"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-forest/15 bg-white/70 text-forest/60 transition hover:bg-white hover:text-forest"
                aria-label="تازه‌سازی"
              >
                <svg className={cn("h-4 w-4", loading && "animate-spin")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                  <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                  <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                  <path d="M21 21v-5h-5" />
                </svg>
              </button>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleUploadFiles(e.target.files);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          </div>
        </header>

        {/* Directory Breadcrumbs & Info Ribbon */}
        <section className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest/10 bg-white/75 px-4 py-3 shadow-sm">
          {/* Breadcrumbs path */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {currentPath ? (
              <button
                type="button"
                onClick={navigateUp}
                title="یک سطح بالاتر"
                className="mr-1 inline-flex h-7 w-7 items-center justify-center rounded-lg border border-forest/15 bg-[#faf8f5] text-forest/70 transition hover:bg-white hover:text-forest"
              >
                <svg className="h-3.5 w-3.5 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ) : null}

            {breadcrumbs.map((crumb, idx) => {
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <div key={crumb.path || "root"} className="flex items-center gap-1.5">
                  {idx > 0 && <span className="text-forest/30">/</span>}
                  <button
                    type="button"
                    onClick={() => navigateTo(crumb.path)}
                    className={cn(
                      "rounded-lg px-2 py-1 transition-colors",
                      isLast
                        ? "bg-forest/10 font-semibold text-forest"
                        : "text-forest/60 hover:bg-forest/5 hover:text-forest",
                    )}
                  >
                    {crumb.name === "uploads" ? "ریشه (uploads)" : crumb.name}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Directory stats */}
          <div className="flex items-center gap-3 text-[11px] text-forest/45">
            <span>
              <strong className="font-semibold text-forest">{toFa(totalFolders)}</strong> پوشه
            </span>
            <span>·</span>
            <span>
              <strong className="font-semibold text-forest">{toFa(totalFiles)}</strong> فایل
            </span>
          </div>
        </section>

        {/* Toolbar: Search, Filters, View Modes */}
        <section className="mt-4 flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white/60 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:max-w-xs">
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-forest/35">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی نام فایل…"
                className="w-full rounded-xl border border-forest/10 bg-white py-2 pl-3 pr-9 text-xs placeholder:text-forest/30 focus:border-forest/30 focus:outline-none focus:ring-1 focus:ring-forest/20"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 left-0 flex items-center pl-2.5 text-forest/30 hover:text-forest"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Type filters tabs */}
            <div className="flex items-center gap-1 rounded-xl bg-forest/[0.04] p-1 text-[11px]">
              {(
                [
                  { id: "all", label: "همه" },
                  { id: "images", label: "تصاویر" },
                  { id: "videos", label: "ویدیوها" },
                  { id: "folders", label: "پوشه‌ها" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setFilterType(tab.id);
                    setPage(1);
                  }}
                  className={cn(
                    "rounded-lg px-2.5 py-1 font-medium transition",
                    filterType === tab.id
                      ? "bg-white text-forest shadow-sm"
                      : "text-forest/50 hover:text-forest",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-forest/10 bg-white px-3 py-2 text-xs text-forest/70 focus:border-forest/30 focus:outline-none"
            >
              <option value="date_desc">جدیدترین</option>
              <option value="date_asc">قدیمی‌ترین</option>
              <option value="name_asc">نام (الف - ی)</option>
              <option value="name_desc">نام (ی - الف)</option>
              <option value="size_desc">بیشترین حجم</option>
              <option value="size_asc">کمترین حجم</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border border-forest/10 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="نمایش شبکه‌ای"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition",
                  viewMode === "grid" ? "bg-forest/10 text-forest" : "text-forest/35 hover:text-forest",
                )}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                title="نمایش لیستی"
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition",
                  viewMode === "table" ? "bg-forest/10 text-forest" : "text-forest/35 hover:text-forest",
                )}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* Content Area */}
        <section className="mt-5 min-h-[420px]">
          {loading ? (
            <div className="flex h-72 flex-col items-center justify-center gap-3 text-forest/40">
              <svg className="h-8 w-8 animate-spin text-brick" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
                <path d="M12 2a10 10 0 0 1 10 10" />
              </svg>
              <p className="text-xs">در حال بارگذاری فایل‌ها…</p>
            </div>
          ) : error ? (
            <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-2xl border border-brick/20 bg-brick/[0.04] p-8 text-center">
              <p className="text-sm font-medium text-brick">{error}</p>
              <button
                type="button"
                onClick={() => loadFiles(currentPath, page)}
                className="rounded-xl bg-forest px-4 py-2 text-xs text-paper"
              >
                تلاش مجدد
              </button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-forest/15 bg-white/40 p-8 text-center text-forest/40">
              <svg className="h-12 w-12 text-forest/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              </svg>
              <p className="text-xs font-medium text-forest/60">هیچ فایل یا پوشه‌ای در این بخش پیدا نشد</p>
              <p className="text-[11px] text-forest/40">
                می‌توانید فایلی را به اینجا بکشید یا دکمه «آپلود فایل» را بزنید.
              </p>
            </div>
          ) : viewMode === "grid" ? (
            /* GRID VIEW */
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {items.map((item) => (
                <FileGridCard
                  key={item.path}
                  item={item}
                  copiedUrl={copiedUrl}
                  onOpenFolder={() => navigateTo(item.path)}
                  onPreview={() => setPreviewItem(item)}
                  onCopyLink={() => item.url && copyLink(item.url)}
                  onDelete={() => setDeleteTarget(item)}
                />
              ))}
            </div>
          ) : (
            /* TABLE VIEW */
            <div className="overflow-hidden rounded-2xl border border-forest/10 bg-white/80 shadow-sm">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-forest/10 bg-forest/[0.02] text-[11px] font-medium text-forest/50">
                    <th className="py-3 pr-4">نام</th>
                    <th className="py-3 px-3">نوع</th>
                    <th className="py-3 px-3">حجم</th>
                    <th className="py-3 px-3">تاریخ ویرایش</th>
                    <th className="py-3 pl-4 text-left">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest/[0.06]">
                  {items.map((item) => (
                    <FileTableRow
                      key={item.path}
                      item={item}
                      copiedUrl={copiedUrl}
                      onOpenFolder={() => navigateTo(item.path)}
                      onPreview={() => setPreviewItem(item)}
                      onCopyLink={() => item.url && copyLink(item.url)}
                      onDelete={() => setDeleteTarget(item)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Pagination */}
        {totalPages > 1 && (
          <footer className="mt-6 flex items-center justify-between border-t border-forest/10 pt-4 text-xs text-forest/60">
            <div>
              صفحه <strong className="font-semibold text-forest">{toFa(page)}</strong> از{" "}
              <strong className="font-semibold text-forest">{toFa(totalPages)}</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="rounded-lg border border-forest/15 bg-white px-3 py-1.5 text-xs disabled:opacity-40"
              >
                صفحه قبل
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="rounded-lg border border-forest/15 bg-white px-3 py-1.5 text-xs disabled:opacity-40"
              >
                صفحه بعد
              </button>
            </div>
          </footer>
        )}
      </div>

      {/* MODAL: Lightbox Media Preview */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative flex max-h-[92vh] max-w-4xl flex-col overflow-hidden rounded-3xl bg-[#1b221d] text-paper shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
              <div className="min-w-0 pr-2">
                <h3 className="truncate text-sm font-medium text-white">{previewItem.name}</h3>
                <p className="mt-0.5 text-[10px] text-white/50">
                  {formatBytes(previewItem.size)} · {new Date(previewItem.updatedAt).toLocaleDateString("fa-IR")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewItem(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Media Body */}
            <div className="flex flex-1 items-center justify-center overflow-auto p-4 max-h-[70vh]">
              {previewItem.category === "image" ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewItem.url}
                  alt={previewItem.name}
                  className="max-h-[65vh] w-auto max-w-full rounded-xl object-contain shadow-md"
                />
              ) : previewItem.category === "video" ? (
                <video
                  src={previewItem.url}
                  controls
                  autoPlay
                  className="max-h-[65vh] max-w-full rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center text-white/50">
                  <svg className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <p className="mt-3 text-sm">پیش‌نمایش این فرمت در مرورگر پشتیبانی نمی‌شود</p>
                </div>
              )}
            </div>

            {/* Modal Footer / Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-black/40 px-6 py-3.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => previewItem.url && copyLink(previewItem.url)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-3 py-1.5 text-xs text-white transition hover:bg-white/25"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  {copiedUrl === previewItem.url ? "کپی شد!" : "کپی لینک مستقیم"}
                </button>

                {previewItem.url && (
                  <a
                    href={previewItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 px-3 py-1.5 text-xs text-white/80 transition hover:bg-white/10 hover:text-white"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    باز کردن در برگه جدید
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  const target = previewItem;
                  setPreviewItem(null);
                  setDeleteTarget(target);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-brick/80 px-3 py-1.5 text-xs text-white transition hover:bg-brick"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
                حذف فایل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Confirm Delete */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => !isDeleting && setDeleteTarget(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-forest/15 bg-[#faf8f5] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brick/10 text-brick">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </div>

            <h3 className="mt-4 text-base font-semibold text-forest">
              حذف {deleteTarget.isDirectory ? "پوشه" : "فایل"}
            </h3>
            <p className="mt-2 text-xs leading-6 text-forest/70">
              آیا از حذف «<strong className="text-brick font-semibold">{deleteTarget.name}</strong>» مطمئن هستید؟
              {deleteTarget.isDirectory && (
                <span className="mt-1 block font-medium text-brick">
                  توجه: تمام فایل‌ها و زیرپوشه‌های موجود در این پوشه به طور کامل حذف خواهند شد!
                </span>
              )}
            </p>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-xs font-medium text-forest/70 hover:bg-forest/5 disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 rounded-xl bg-brick px-4 py-2.5 text-xs font-medium text-white shadow transition hover:bg-brick/90 disabled:opacity-50"
              >
                {isDeleting ? "در حال حذف…" : "حذف قطعی"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create New Folder */}
      {showNewFolderModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => !isCreatingFolder && setShowNewFolderModal(false)}
        >
          <form
            onSubmit={handleCreateFolder}
            className="w-full max-w-md rounded-3xl border border-forest/15 bg-[#faf8f5] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-forest/10 text-forest">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                <line x1="12" y1="10" x2="12" y2="16" />
                <line x1="9" y1="13" x2="15" y2="13" />
              </svg>
            </div>

            <h3 className="mt-4 text-base font-semibold text-forest">ایجاد پوشه جدید</h3>
            <p className="mt-1 text-xs text-forest/50">
              پوشه در مسیر «{currentPath || "uploads"}» ایجاد خواهد شد.
            </p>

            <div className="mt-4">
              <label htmlFor="folderName" className="block text-xs font-medium text-forest/70">
                نام پوشه
              </label>
              <input
                id="folderName"
                type="text"
                autoFocus
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="مثال: banners یا products"
                className="mt-1.5 w-full rounded-xl border border-forest/15 bg-white px-3.5 py-2.5 text-xs text-forest focus:border-forest/40 focus:outline-none focus:ring-1 focus:ring-forest/20"
              />
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                disabled={isCreatingFolder}
                className="rounded-xl border border-forest/15 bg-white px-4 py-2.5 text-xs font-medium text-forest/70 hover:bg-forest/5 disabled:opacity-50"
              >
                انصراف
              </button>
              <button
                type="submit"
                disabled={isCreatingFolder || !newFolderName.trim()}
                className="rounded-xl bg-forest px-4 py-2.5 text-xs font-medium text-paper shadow transition hover:bg-forest/90 disabled:opacity-50"
              >
                {isCreatingFolder ? "در حال ایجاد…" : "ایجاد پوشه"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

/* =========================================================================
   GRID CARD COMPONENT
   ========================================================================= */
function FileGridCard({
  item,
  copiedUrl,
  onOpenFolder,
  onPreview,
  onCopyLink,
  onDelete,
}: {
  item: FileEntryItem;
  copiedUrl: string | null;
  onOpenFolder: () => void;
  onPreview: () => void;
  onCopyLink: () => void;
  onDelete: () => void;
}) {
  const isCopied = item.url && copiedUrl === item.url;

  if (item.isDirectory) {
    return (
      <div
        onClick={onOpenFolder}
        className="group relative flex cursor-pointer flex-col justify-between rounded-2xl border border-forest/10 bg-white/80 p-3.5 shadow-sm transition-all duration-200 hover:border-forest/25 hover:bg-white hover:shadow-md"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-peach/25 text-forest/80 transition-transform group-hover:scale-105">
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
            </svg>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="حذف پوشه"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-forest/25 opacity-0 transition-all hover:bg-brick/10 hover:text-brick group-hover:opacity-100"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            </svg>
          </button>
        </div>

        <div className="mt-3">
          <p className="truncate text-xs font-medium text-forest" title={item.name}>
            {item.name}
          </p>
          <p className="mt-1 text-[10px] text-forest/40">
            {typeof item.itemsCount === "number" ? `${toFa(item.itemsCount)} مورد` : "پوشه"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-forest/10 bg-white/80 p-2.5 shadow-sm transition-all duration-200 hover:border-forest/25 hover:bg-white hover:shadow-md">
      {/* Thumbnail area */}
      <div
        onClick={onPreview}
        className="relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-forest/[0.04]"
      >
        {item.category === "image" && item.url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={item.url}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : item.category === "video" ? (
          <div className="flex flex-col items-center justify-center gap-1.5 text-forest/40">
            <svg className="h-8 w-8 text-brick" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span className="text-[9px] uppercase font-mono">{item.extension || "video"}</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-1.5 text-forest/40">
            <svg className="h-8 w-8 text-forest/35" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span className="text-[9px] uppercase font-mono">{item.extension || "file"}</span>
          </div>
        )}

        {/* Hover overlay quick actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 backdrop-blur-[2px] transition-opacity duration-200 group-hover:opacity-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview();
            }}
            title="دیدن پیش‌نمایش"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-forest shadow hover:bg-paper"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopyLink();
            }}
            title="کپی لینک"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-forest shadow hover:bg-paper"
          >
            {isCopied ? (
              <svg className="h-4 w-4 text-[#3e8457]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            title="حذف فایل"
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-brick shadow hover:bg-paper"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            </svg>
          </button>
        </div>
      </div>

      {/* Item info & always-accessible actions */}
      <div className="mt-2.5 px-0.5">
        <p className="truncate text-xs font-medium text-forest" title={item.name}>
          {item.name}
        </p>
        <div className="mt-1 flex items-center justify-between text-[10px] text-forest/40">
          <span>{formatBytes(item.size)}</span>
          <span className="uppercase font-mono text-[9px]">{item.extension}</span>
        </div>

        {/* Action buttons row */}
        <div className="mt-2 flex items-center justify-between border-t border-forest/[0.06] pt-1.5">
          <button
            type="button"
            onClick={onCopyLink}
            className={cn(
              "flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-medium transition",
              isCopied
                ? "bg-[#3e8457]/15 text-[#3e8457]"
                : "text-forest/60 hover:bg-forest/5 hover:text-forest",
            )}
            title="کپی آدرس لینک فایل"
          >
            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {isCopied ? "کپی شد" : "لینک"}
          </button>

          <div className="flex items-center gap-1">
            {item.url && (
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                title="باز کردن فایل در برگه جدید"
                className="flex h-6 w-6 items-center justify-center rounded-md text-forest/40 hover:bg-forest/5 hover:text-forest"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            )}

            <button
              type="button"
              onClick={onDelete}
              title="حذف فایل"
              className="flex h-6 w-6 items-center justify-center rounded-md text-forest/35 hover:bg-brick/10 hover:text-brick"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M3 6h18" />
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TABLE ROW COMPONENT
   ========================================================================= */
function FileTableRow({
  item,
  copiedUrl,
  onOpenFolder,
  onPreview,
  onCopyLink,
  onDelete,
}: {
  item: FileEntryItem;
  copiedUrl: string | null;
  onOpenFolder: () => void;
  onPreview: () => void;
  onCopyLink: () => void;
  onDelete: () => void;
}) {
  const isCopied = item.url && copiedUrl === item.url;

  return (
    <tr
      onClick={item.isDirectory ? onOpenFolder : onPreview}
      className="group cursor-pointer transition hover:bg-forest/[0.03]"
    >
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          {item.isDirectory ? (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-peach/25 text-forest/80">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
              </svg>
            </div>
          ) : item.category === "image" && item.url ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={item.url}
              alt={item.name}
              className="h-8 w-8 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-forest/[0.05] text-forest/40">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate font-medium text-forest" title={item.name}>
              {item.name}
            </p>
          </div>
        </div>
      </td>

      <td className="py-3 px-3 text-forest/50">
        {item.isDirectory ? (
          <span className="rounded-md bg-forest/5 px-2 py-0.5 text-[10px]">پوشه</span>
        ) : (
          <span className="rounded-md bg-forest/5 px-2 py-0.5 font-mono uppercase text-[10px]">
            {item.extension || "فایل"}
          </span>
        )}
      </td>

      <td className="py-3 px-3 text-forest/50">
        {item.isDirectory
          ? typeof item.itemsCount === "number"
            ? `${toFa(item.itemsCount)} مورد`
            : "—"
          : formatBytes(item.size)}
      </td>

      <td className="py-3 px-3 text-forest/50">
        {new Date(item.updatedAt).toLocaleDateString("fa-IR")}
      </td>

      <td className="py-3 pl-4 text-left">
        <div
          className="flex items-center justify-end gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          {!item.isDirectory && (
            <>
              <button
                type="button"
                onClick={onPreview}
                title="مشاهده پیش‌نمایش"
                className="flex h-7 w-7 items-center justify-center rounded-lg text-forest/50 hover:bg-forest/5 hover:text-forest"
              >
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>

              <button
                type="button"
                onClick={onCopyLink}
                title="کپی آدرس لینک فایل"
                className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-lg transition",
                  isCopied
                    ? "bg-[#3e8457]/15 text-[#3e8457]"
                    : "text-forest/50 hover:bg-forest/5 hover:text-forest",
                )}
              >
                {isCopied ? (
                  <svg className="h-3.5 w-3.5 text-[#3e8457]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="باز کردن در برگه جدید"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-forest/50 hover:bg-forest/5 hover:text-forest"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </a>
              )}
            </>
          )}

          <button
            type="button"
            onClick={onDelete}
            title={item.isDirectory ? "حذف پوشه" : "حذف فایل"}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-forest/35 hover:bg-brick/10 hover:text-brick"
          >
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
}
