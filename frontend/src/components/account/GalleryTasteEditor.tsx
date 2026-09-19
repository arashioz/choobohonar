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
      setMessage(answers ? "سلیقه گالری ذخیره شد." : "فید گالری به حالت پیش‌فرض برگشت.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "ذخیره سلیقه انجام نشد");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-20 border-t border-forest/10 pt-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 className="text-2xl font-extralight tracking-tight text-forest">سلیقه فید گالری</h2>
        <Link href="/gallery" className="text-xs text-forest/40 transition-colors hover:text-forest">
          مشاهده فید ←
        </Link>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-x-16 gap-y-16 md:grid-cols-2 md:gap-x-20 md:gap-y-20">
        {tasteQuestions.map((question) => (
          <div key={question.id} className="min-w-0">
            <h3 className="max-w-xs text-sm font-light leading-6 text-forest/60">{question.prompt}</h3>
            <div className="mt-7 grid max-w-sm grid-cols-2 gap-5">
              {question.options.map((option) => {
                const selected = picked[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPicked((current) => ({ ...current, [question.id]: option.id }))}
                    className="group text-right"
                  >
                    <span
                      className={cn(
                        "relative block aspect-square overflow-hidden bg-forest/[0.04] transition-[box-shadow,opacity]",
                        selected ? "ring-1 ring-forest" : "opacity-80 hover:opacity-100",
                      )}
                    >
                      <Image src={option.src} alt="" fill sizes="(max-width: 768px) 40vw, 12vw" className="object-cover" />
                    </span>
                    <span className={cn("mt-2.5 block text-[11px] leading-5", selected ? "text-forest" : "text-forest/45 group-hover:text-forest/70")}>
                      {option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {error ? <p className="mt-12 text-xs text-brick">{error}</p> : null}
      {message ? <p className="mt-12 text-xs text-forest/50">{message}</p> : null}

      <div className="mt-14 flex flex-wrap items-center gap-8">
        <button
          type="button"
          disabled={saving || !complete}
          onClick={() => void persist(complete)}
          className="text-sm text-forest underline decoration-forest/20 underline-offset-8 disabled:opacity-40"
        >
          {saving ? "در حال ذخیره…" : "ذخیره سلیقه"}
        </button>
        <button
          type="button"
          disabled={saving || !parsed}
          onClick={() => void persist(null)}
          className="text-xs text-forest/35 hover:text-forest disabled:opacity-40"
        >
          بازگرداندن پیش‌فرض
        </button>
      </div>
    </section>
  );
}
