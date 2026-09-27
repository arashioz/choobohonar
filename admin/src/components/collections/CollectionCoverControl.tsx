"use client";

import { useState } from "react";
import { cmsRequest, type CmsEntry } from "@/lib/cms";
import { uploadMedia } from "@/lib/upload";

export function collectionCoverUrl(item: CmsEntry): string {
  const cover = item.data?.coverImage;
  if (typeof cover === "string" && cover.trim()) return cover.trim();
  return item.images?.[0] || "";
}

export default function CollectionCoverControl({
  item,
  onSaved,
  onError,
}: {
  item: CmsEntry;
  onSaved: () => Promise<void> | void;
  onError: (message: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const cover = typeof item.data?.coverImage === "string" ? item.data.coverImage.trim() : "";

  async function save(coverImage: string, uploadedUrl?: string) {
    setBusy(true);
    onError("");
    try {
      const previous = cover;
      const images = uploadedUrl
        ? [uploadedUrl, ...(item.images || []).filter((image) => image !== uploadedUrl)]
        : (item.images || []).filter((image) => !previous || image !== previous);
      await cmsRequest(`collection/${item._id}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: item.title,
          slug: item.slug,
          status: item.status,
          excerpt: item.excerpt,
          description: item.description,
          content: item.content,
          images,
          seo: item.seo,
          tags: item.tags,
          data: { ...(item.data || {}), coverImage },
        }),
      });
      await onSaved();
    } catch (error) {
      onError(error instanceof Error ? error.message : "ذخیره تصویر شاخص ناموفق بود");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <label className={`cursor-pointer text-[10px] font-medium text-brick ${busy ? "pointer-events-none opacity-45" : ""}`}>
        {busy ? "در حال ذخیره…" : "تصویر شاخص"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="sr-only"
          disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.currentTarget.value = "";
            if (!file) return;
            setBusy(true);
            uploadMedia(file)
              .then((url) => save(url, url))
              .catch((error) => {
                setBusy(false);
                onError(error instanceof Error ? error.message : "آپلود تصویر ناموفق بود");
              });
          }}
        />
      </label>
      {cover ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => void save("")}
          className="text-[10px] text-forest/45 underline disabled:opacity-45"
        >
          پیش‌فرض
        </button>
      ) : null}
    </div>
  );
}
