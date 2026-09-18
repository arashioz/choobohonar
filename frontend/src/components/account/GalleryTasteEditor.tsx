"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { tasteQuestions, type GalleryTasteAnswers, type TasteQuestionId } from "@/data/gallery-taste";
import { parseTasteAnswers, writeTasteState } from "@/lib/gallery-taste";
import { cn } from "@/lib/utils";

type Props = {
  initial: unknown;
  onSaved: (answers: GalleryTasteAnswers | null) => void;
  save: (answers: GalleryTasteAnswers | null) => Promise<void>;
};

const empty: Record<TasteQuestionId, string> = {
  space: "",
  material: "",
  atmosphere: "",
  object: "",
};

export default function GalleryTasteEditor({ initial, onSaved, save }: Props) {
  const parsed = parseTasteAnswers(initial);
  const [picked, setPicked] = useState<Record<TasteQuestionId, string>>(parsed || empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setPicked(parseTasteAnswers(initial) || empty);
  }, [initial]);

  const complete = parseTasteAnswers(picked);

  async function persist(answers: GalleryTasteAnswers | null) {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      await save(answers);
      if (answers) writeTasteState({ status: "complete", answers });
      else writeTasteState({ status: "skipped" });
      onSaved(answers);
      setMessage(answers ? "سلیقه گالری ذخیره شد. فید بر اساس همین چهار پاسخ چیده می‌شود." : "فید گالری به حالت پیش‌فرض برگشت.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره سلیقه انجام نشد");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-20 border-t border-forest/10 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-display text-sm text-brick">04</p>
          <h2 className="mt-3 text-3xl font-light tracking-tight text-forest md:text-4xl">سلیقه فید گالری</h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-forest/55">
            همان چهار سؤال گالری: فضا، سطح، حس خانه، و چیزی که به خانه می‌آورید. ذخیره روی حساب می‌نشیند و صفحه گالری همان منطق را برای چیدن فید استفاده می‌کند.
          </p>
        </div>
        <Link href="/gallery" className="text-sm text-brick underline decoration-brick/30 underline-offset-4">
          مشاهده فید گالری ←
        </Link>
      </div>

      <div className="mt-10 space-y-12">
        {tasteQuestions.map((question, index) => (
          <div key={question.id}>
            <p className="text-[10px] tracking-[0.16em] text-forest/35" dir="ltr">0{index + 1}</p>
            <h3 className="mt-2 text-xl font-light text-forest">{question.prompt}</h3>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
              {question.options.map((option) => {
                const selected = picked[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPicked((current) => ({ ...current, [question.id]: option.id }))}
                    className={cn(
                      "overflow-hidden bg-forest/5 text-right transition-shadow",
                      selected ? "ring-2 ring-forest" : "hover:ring-1 hover:ring-forest/30",
                    )}
                  >
                    <span className="relative block aspect-[4/3]">
                      <Image src={option.src} alt={option.alt} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover" />
                    </span>
                    <span className="block px-3 py-2.5 text-sm text-forest">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error ? <p className="mt-6 text-sm text-brick">{error}</p> : null}
      {message ? <p className="mt-6 text-sm text-forest/70">{message}</p> : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={saving || !complete}
          onClick={() => void persist(complete)}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-forest px-6 text-sm text-paper disabled:opacity-40"
        >
          {saving ? "در حال ذخیره…" : "ذخیره سلیقه گالری"}
        </button>
        <button
          type="button"
          disabled={saving || !parsed}
          onClick={() => void persist(null)}
          className="inline-flex min-h-12 items-center justify-center rounded-full border border-forest/20 px-6 text-sm text-forest/60 disabled:opacity-40"
        >
          بازگرداندن فید پیش‌فرض
        </button>
      </div>
    </section>
  );
}
