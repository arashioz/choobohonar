"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import { tasteQuestions, type GalleryTasteAnswers, type TasteQuestionId } from "@/data/gallery-taste";
import { cn } from "@/lib/utils";

type Props = {
  needContact: boolean;
  onSkip: () => void;
  onComplete: (answers: GalleryTasteAnswers) => void;
  onSubmitContact: (input: { name: string; phone: string }) => Promise<void>;
  onDismissContact: () => void;
};

const empty = { space: "", material: "", atmosphere: "", object: "" };

export default function GalleryTasteQuiz({ needContact, onSkip, onComplete, onSubmitContact, onDismissContact }: Props) {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Record<TasteQuestionId, string>>(empty);
  const [contact, setContact] = useState({ name: "", phone: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [askingContact, setAskingContact] = useState(false);

  const question = tasteQuestions[step];

  function select(optionId: string) {
    if (!question) return;
    const next = { ...picked, [question.id]: optionId };
    setPicked(next);
    if (step < tasteQuestions.length - 1) {
      setStep(step + 1);
      return;
    }
    const answers = next as GalleryTasteAnswers;
    onComplete(answers);
    if (needContact) setAskingContact(true);
  }

  async function submitContact(event: FormEvent) {
    event.preventDefault();
    if (contact.name.trim().length < 2) {
      setError("نام را وارد کنید.");
      return;
    }
    if (!/^[0-9\u06F0-\u06F9+\-\s]{10,}$/.test(contact.phone.trim())) {
      setError("شماره موبایل معتبر وارد کنید.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmitContact({ name: contact.name.trim(), phone: contact.phone.trim() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "ارسال انجام نشد.");
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center bg-forest/50 p-0 backdrop-blur-[3px] md:items-center md:p-8" role="dialog" aria-modal="true" aria-labelledby="gallery-taste-title">
      <div className="max-h-[92dvh] w-full overflow-y-auto bg-paper px-5 py-7 text-forest shadow-2xl md:max-w-2xl md:px-10 md:py-10">
        {askingContact ? (
          <form onSubmit={submitContact} className="space-y-5">
            <p className="eyebrow text-brick">سلیقه شما</p>
            <h2 id="gallery-taste-title" className="text-3xl font-light">برای نگه داشتن این سلیقه، نام و موبایل را بگذارید.</h2>
            <label className="block text-sm">
              نام و نام خانوادگی
              <input value={contact.name} onChange={(event) => setContact((current) => ({ ...current, name: event.target.value }))} className="mt-2 w-full border border-forest/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest/40" />
            </label>
            <label className="block text-sm">
              شماره موبایل
              <input dir="ltr" inputMode="tel" value={contact.phone} onChange={(event) => setContact((current) => ({ ...current, phone: event.target.value }))} className="mt-2 w-full border border-forest/15 bg-white px-3 py-2.5 text-sm outline-none focus:border-forest/40" placeholder="0912 000 0000" />
            </label>
            {error ? <p className="text-sm text-brick">{error}</p> : null}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button type="submit" disabled={saving} className="border border-forest bg-forest px-5 py-2.5 text-xs tracking-[0.12em] text-paper disabled:opacity-50">
                ذخیره
              </button>
              <button type="button" onClick={onDismissContact} className="text-xs text-forest/55 underline">
                بعداً
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow text-brick">سلیقه شما</p>
                <h2 id="gallery-taste-title" className="mt-3 max-w-md text-2xl font-light leading-snug md:text-3xl">
                  {step === 0 ? "چند سوال کوتاه می‌پرسیم تا این صفحه را بر اساس سلیقه شما بچینیم." : question?.prompt}
                </h2>
              </div>
              <button type="button" onClick={onSkip} className="shrink-0 text-xs text-forest/45 underline">
                الان نه
              </button>
            </div>
            {question ? (
              <div className="mt-8 grid grid-cols-2 gap-3">
                {question.options.map((option) => {
                  const selected = picked[question.id] === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => select(option.id)}
                      className={cn(
                        "group relative overflow-hidden bg-forest/5 text-right",
                        selected ? "ring-2 ring-forest" : "hover:ring-1 hover:ring-forest/30",
                      )}
                    >
                      <span className="relative block aspect-[4/3]">
                        <Image src={option.src} alt={option.alt} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover" />
                      </span>
                      <span className="block px-3 py-2.5 text-sm">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
            <div className="mt-6 flex items-center justify-between text-xs text-forest/45">
              <span>{step + 1} از {tasteQuestions.length}</span>
              {step > 0 ? (
                <button type="button" onClick={() => setStep((current) => Math.max(0, current - 1))} className="underline">
                  قبلی
                </button>
              ) : (
                <span />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
