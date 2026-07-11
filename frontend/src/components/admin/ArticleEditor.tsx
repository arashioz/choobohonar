"use client";

import { useState } from "react";
import Image from "next/image";
import type { ContentBlock, ContentJobResult, GalleryImage, InternalLink } from "@/lib/content-types";
import { ARTICLE_CATEGORIES, estimateReadingTime, slugify } from "@/lib/content-types";

const inputClass =
  "w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-gray-400";
const labelClass = "block text-xs text-gray-400 mb-1.5 eyebrow";

type Tab = "content" | "media" | "seo" | "links" | "preview";

type Props = {
  draft: ContentJobResult;
  onChange: (next: ContentJobResult) => void;
  readOnly?: boolean;
  publishedSlug?: string;
};

export default function ArticleEditor({ draft, onChange, readOnly, publishedSlug }: Props) {
  const [tab, setTab] = useState<Tab>("content");

  const set = <K extends keyof ContentJobResult>(key: K, value: ContentJobResult[K]) => {
    onChange({ ...draft, [key]: value });
  };

  const blocks = draft.content?.length ? draft.content : [];

  const updateBlocks = (next: ContentBlock[]) => {
    onChange({
      ...draft,
      content: next,
      body: next
        .filter((b) => b.type === "paragraph" || b.type === "heading")
        .map((b) => b.text)
        .join("\n\n"),
      readingTime: estimateReadingTime(next),
    });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: "content", label: "محتوا" },
    { id: "media", label: "رسانه" },
    { id: "seo", label: "SEO" },
    { id: "links", label: "بک‌لینک" },
    { id: "preview", label: "پیش‌نمایش" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-1 flex-wrap border-b border-gray-200 pb-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 text-xs rounded-t-lg transition-colors ${
              tab === t.id
                ? "bg-white border border-b-white border-gray-200 text-forest-900 font-medium -mb-px"
                : "text-gray-400 hover:text-gray-700"
            }`}
          >
            {t.label}
          </button>
        ))}
        {publishedSlug && (
          <a
            href={`/magazine/${publishedSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mr-auto text-xs text-forest-700 hover:underline self-center"
          >
            مشاهده در سایت ↗
          </a>
        )}
      </div>

      {tab === "content" && (
        <ContentTab draft={draft} set={set} blocks={blocks} updateBlocks={updateBlocks} readOnly={readOnly} />
      )}
      {tab === "media" && <MediaTab draft={draft} set={set} readOnly={readOnly} />}
      {tab === "seo" && <SeoTab draft={draft} set={set} readOnly={readOnly} />}
      {tab === "links" && <LinksTab draft={draft} set={set} readOnly={readOnly} />}
      {tab === "preview" && <PreviewTab draft={draft} />}
    </div>
  );
}

function ContentTab({
  draft,
  set,
  blocks,
  updateBlocks,
  readOnly,
}: {
  draft: ContentJobResult;
  set: <K extends keyof ContentJobResult>(key: K, value: ContentJobResult[K]) => void;
  blocks: ContentBlock[];
  updateBlocks: (b: ContentBlock[]) => void;
  readOnly?: boolean;
}) {
  const addBlock = (type: ContentBlock["type"]) => {
    const defaults: Record<ContentBlock["type"], ContentBlock> = {
      paragraph: { type: "paragraph", text: "" },
      heading: { type: "heading", text: "" },
      quote: { type: "quote", text: "", cite: "" },
      image: { type: "image", src: "", caption: "", alt: "" },
    };
    updateBlocks([...blocks, defaults[type]]);
  };

  const patchBlock = (index: number, patch: Partial<ContentBlock>) => {
    updateBlocks(blocks.map((b, i) => (i === index ? ({ ...b, ...patch } as ContentBlock) : b)));
  };

  const removeBlock = (index: number) => updateBlocks(blocks.filter((_, i) => i !== index));

  const moveBlock = (index: number, dir: -1 | 1) => {
    const next = [...blocks];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    updateBlocks(next);
  };

  const blockLabels = { paragraph: "پاراگراف", heading: "سرتیتر", quote: "نقل‌قول", image: "تصویر" };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>عنوان مقاله</label>
          <input value={draft.title || ""} onChange={(e) => { set("title", e.target.value); if (!draft.slug) set("slug", slugify(e.target.value)); }} disabled={readOnly} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Slug (URL)</label>
          <div className="flex gap-2">
            <input value={draft.slug || ""} onChange={(e) => set("slug", slugify(e.target.value))} disabled={readOnly} className={inputClass} dir="ltr" />
            {!readOnly && (
              <button type="button" onClick={() => set("slug", slugify(draft.title || ""))} className="shrink-0 px-3 text-xs border border-gray-200 rounded-lg hover:border-gray-400">از عنوان</button>
            )}
          </div>
          <p className="text-xs text-gray-300 mt-1" dir="ltr">/magazine/{draft.slug || "..."}</p>
        </div>
      </div>

      <div>
        <label className={labelClass}>Excerpt</label>
        <textarea value={draft.excerpt || ""} onChange={(e) => set("excerpt", e.target.value)} disabled={readOnly} rows={2} className={`${inputClass} resize-y`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>دسته‌بندی</label>
          <select value={draft.category || ""} onChange={(e) => set("category", e.target.value)} disabled={readOnly} className={inputClass}>
            <option value="">انتخاب کنید</option>
            {ARTICLE_CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>
        </div>
        <div>
          <label className={labelClass}>نویسنده</label>
          <input value={draft.author || ""} onChange={(e) => set("author", e.target.value)} disabled={readOnly} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>زمان مطالعه</label>
          <input value={draft.readingTime || ""} onChange={(e) => set("readingTime", e.target.value)} disabled={readOnly} placeholder="6 min" className={inputClass} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={labelClass}>بلوک‌های محتوا</label>
          {!readOnly && (
            <div className="flex gap-2 flex-wrap">
              {(["paragraph", "heading", "quote", "image"] as const).map((type) => (
                <button key={type} type="button" onClick={() => addBlock(type)} className="text-xs px-2.5 py-1 border border-gray-200 rounded-lg hover:border-gray-400">+ {blockLabels[type]}</button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-3">
          {blocks.length === 0 && <div className="text-center py-8 text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl">بلوکی وجود ندارد</div>}
          {blocks.map((block, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 uppercase">{block.type}</span>
                {!readOnly && (
                  <div className="flex gap-1">
                    <button type="button" onClick={() => moveBlock(i, -1)} className="text-xs px-2 py-0.5 text-gray-400">↑</button>
                    <button type="button" onClick={() => moveBlock(i, 1)} className="text-xs px-2 py-0.5 text-gray-400">↓</button>
                    <button type="button" onClick={() => removeBlock(i)} className="text-xs px-2 py-0.5 text-red-400">حذف</button>
                  </div>
                )}
              </div>
              {(block.type === "paragraph" || block.type === "heading" || block.type === "quote") && (
                <textarea value={block.text} onChange={(e) => patchBlock(i, { text: e.target.value })} disabled={readOnly} rows={block.type === "heading" ? 2 : 4} className={`${inputClass} resize-y`} />
              )}
              {block.type === "quote" && (
                <input value={block.cite || ""} onChange={(e) => patchBlock(i, { cite: e.target.value })} disabled={readOnly} placeholder="cite" className={inputClass} />
              )}
              {block.type === "image" && (
                <>
                  <input value={block.src} onChange={(e) => patchBlock(i, { src: e.target.value })} disabled={readOnly} placeholder="Image URL" className={inputClass} dir="ltr" />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={block.alt || ""} onChange={(e) => patchBlock(i, { alt: e.target.value })} disabled={readOnly} placeholder="Alt" className={inputClass} />
                    <input value={block.caption || ""} onChange={(e) => patchBlock(i, { caption: e.target.value })} disabled={readOnly} placeholder="Caption" className={inputClass} />
                  </div>
                  {block.src && (
                    <div className="relative w-full h-40 rounded-lg overflow-hidden bg-gray-50">
                      <Image src={block.src} alt={block.alt || ""} fill className="object-cover" unoptimized />
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className={labelClass}>CTA</label>
        <input value={draft.marketingCopy || ""} onChange={(e) => set("marketingCopy", e.target.value)} disabled={readOnly} className={inputClass} />
      </div>
    </div>
  );
}

function MediaTab({ draft, set, readOnly }: { draft: ContentJobResult; set: <K extends keyof ContentJobResult>(key: K, value: ContentJobResult[K]) => void; readOnly?: boolean; }) {
  const gallery = draft.gallery || [];
  const addGallery = () => set("gallery", [...gallery, { url: "", alt: "", caption: "" }]);
  const patchGallery = (index: number, patch: Partial<GalleryImage>) => set("gallery", gallery.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  const removeGallery = (index: number) => set("gallery", gallery.filter((_, i) => i !== index));
  const cover = draft.coverImage || draft.imageUrl || "";

  return (
    <div className="space-y-5">
      <div>
        <label className={labelClass}>Cover Image</label>
        <input value={draft.coverImage || ""} onChange={(e) => { set("coverImage", e.target.value); set("imageUrl", e.target.value); }} disabled={readOnly} placeholder="/images/..." className={inputClass} dir="ltr" />
        {cover && <div className="relative w-full h-56 mt-3 rounded-xl overflow-hidden border"><Image src={cover} alt={draft.title || "cover"} fill className="object-cover" unoptimized /></div>}
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={labelClass}>Gallery</label>
          {!readOnly && <button type="button" onClick={addGallery} className="text-xs px-3 py-1.5 bg-forest-900 text-white rounded-lg">+ Add</button>}
        </div>
        <div className="space-y-3">
          {gallery.map((img, i) => (
            <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-start bg-gray-50 rounded-xl p-3">
              <input value={img.url} onChange={(e) => patchGallery(i, { url: e.target.value })} disabled={readOnly} placeholder="URL" className={inputClass} dir="ltr" />
              <input value={img.caption || ""} onChange={(e) => patchGallery(i, { caption: e.target.value })} disabled={readOnly} placeholder="Caption" className={inputClass} />
              {!readOnly && <button type="button" onClick={() => removeGallery(i)} className="text-xs text-red-500 px-2 py-2">Del</button>}
              {img.url && <div className="md:col-span-3 relative h-32 rounded-lg overflow-hidden"><Image src={img.url} alt={img.alt || ""} fill className="object-cover" unoptimized /></div>}
            </div>
          ))}
        </div>
      </div>
      <div>
        <label className={labelClass}>AI Image Prompt</label>
        <textarea value={draft.imagePrompt || ""} onChange={(e) => set("imagePrompt", e.target.value)} disabled={readOnly} rows={2} className={`${inputClass} resize-y`} dir="ltr" />
      </div>
    </div>
  );
}

function SeoTab({ draft, set, readOnly }: { draft: ContentJobResult; set: <K extends keyof ContentJobResult>(key: K, value: ContentJobResult[K]) => void; readOnly?: boolean; }) {
  const tagsStr = (draft.tags || []).join(", ");
  const keywordsStr = (draft.keywords || []).join(", ");
  return (
    <div className="space-y-4">
      <div><label className={labelClass}>Meta Title</label><input value={draft.metaTitle || ""} onChange={(e) => set("metaTitle", e.target.value)} disabled={readOnly} className={inputClass} /><p className="text-xs text-gray-300 mt-1">{(draft.metaTitle || "").length} chars</p></div>
      <div><label className={labelClass}>Meta Description</label><textarea value={draft.metaDescription || ""} onChange={(e) => set("metaDescription", e.target.value)} disabled={readOnly} rows={3} className={`${inputClass} resize-y`} /></div>
      <div><label className={labelClass}>Canonical URL</label><input value={draft.canonicalUrl || ""} onChange={(e) => set("canonicalUrl", e.target.value)} disabled={readOnly} className={inputClass} dir="ltr" /></div>
      <div><label className={labelClass}>Keywords</label><input value={keywordsStr} onChange={(e) => set("keywords", e.target.value.split(/[,\u060C]/).map((k) => k.trim()).filter(Boolean))} disabled={readOnly} className={inputClass} /></div>
      <div><label className={labelClass}>Tags</label><input value={tagsStr} onChange={(e) => set("tags", e.target.value.split(/[,\u060C]/).map((k) => k.trim()).filter(Boolean))} disabled={readOnly} className={inputClass} /></div>
    </div>
  );
}

function LinksTab({ draft, set, readOnly }: { draft: ContentJobResult; set: <K extends keyof ContentJobResult>(key: K, value: ContentJobResult[K]) => void; readOnly?: boolean; }) {
  const links = draft.internalLinks || [];
  const addLink = () => set("internalLinks", [...links, { label: "", url: "", anchor: "", rel: "dofollow" }]);
  const patchLink = (index: number, patch: Partial<InternalLink>) => set("internalLinks", links.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  const removeLink = (index: number) => set("internalLinks", links.filter((_, i) => i !== index));

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Internal backlinks to site pages for SEO.</p>
      {!readOnly && <button type="button" onClick={addLink} className="text-xs px-3 py-1.5 bg-forest-900 text-white rounded-lg">+ Add link</button>}
      <div className="space-y-3">
        {links.map((link, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4 space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input value={link.label} onChange={(e) => patchLink(i, { label: e.target.value })} disabled={readOnly} placeholder="Label" className={inputClass} />
              <input value={link.url} onChange={(e) => patchLink(i, { url: e.target.value })} disabled={readOnly} placeholder="/products/..." className={inputClass} dir="ltr" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <input value={link.anchor || ""} onChange={(e) => patchLink(i, { anchor: e.target.value })} disabled={readOnly} placeholder="Anchor" className={inputClass} />
              <select value={link.rel || "dofollow"} onChange={(e) => patchLink(i, { rel: e.target.value as "dofollow" | "nofollow" })} disabled={readOnly} className={inputClass}>
                <option value="dofollow">dofollow</option>
                <option value="nofollow">nofollow</option>
              </select>
            </div>
            {!readOnly && <button type="button" onClick={() => removeLink(i)} className="text-xs text-red-500">Remove</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

function PreviewTab({ draft }: { draft: ContentJobResult }) {
  const cover = draft.coverImage || draft.imageUrl;
  const blocks = draft.content || [];
  return (
    <div className="bg-paper rounded-xl border border-gray-200 overflow-hidden">
      {cover && <div className="relative w-full h-64"><Image src={cover} alt={draft.title || ""} fill className="object-cover" unoptimized /></div>}
      <div className="p-6 md:p-8 space-y-4">
        <div className="flex flex-wrap gap-2 text-xs text-gray-400">
          {draft.category && <span className="bg-white px-2 py-0.5 rounded-full border">{draft.category}</span>}
          {draft.readingTime && <span>{draft.readingTime}</span>}
        </div>
        <h2 className="font-display text-2xl text-forest-900">{draft.title}</h2>
        {draft.excerpt && <p className="text-gray-600 text-sm">{draft.excerpt}</p>}
        <div className="space-y-4">
          {blocks.map((block, i) => {
            if (block.type === "heading") return <h3 key={i} className="font-display text-lg text-forest-900">{block.text}</h3>;
            if (block.type === "quote") return <blockquote key={i} className="border-r-4 border-peach pr-4 italic text-gray-600">{block.text}</blockquote>;
            if (block.type === "image" && block.src) return (
              <figure key={i}><div className="relative w-full h-48 rounded-lg overflow-hidden"><Image src={block.src} alt={block.alt || ""} fill className="object-cover" unoptimized /></div>{block.caption && <figcaption className="text-xs text-gray-400 mt-2 text-center">{block.caption}</figcaption>}</figure>
            );
            if (block.type === "paragraph") {
              return <p key={i} className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.text}</p>;
            }
            return null;
          })}
        </div>
        {(draft.internalLinks || []).length > 0 && (
          <div className="border-t pt-4 flex flex-wrap gap-3">
            {draft.internalLinks!.map((l, i) => (<span key={i} className="text-sm text-teal underline" dir="ltr">{l.label || l.url}</span>))}
          </div>
        )}
      </div>
    </div>
  );
}
