"use client";

import { useEffect, useId, useState } from "react";
import Container from "@/components/layout/Container";
import { cn } from "@/lib/utils";
import { moderateExperience } from "./moderateExperience";

type Story = {
  id: string;
  name: string;
  note: string;
};

const seeds: Story[] = [
  { id: "s1", name: "مریم", note: "نور روی چوب، فضا را آرام‌تر از چیزی که انتظار داشتم کرد." },
  { id: "s2", name: "کیان", note: "جزئیات دسته‌ها و بافت پارچه از نزدیک جور دیگری دیده می‌شد." },
  { id: "s3", name: "نگار", note: "چیدمان نشیمن حس یک خانهٔ واقعی را داشت، آرام و بدون شلوغی." },
  { id: "s4", name: "آرمین", note: "ساعت دیواری و فرش کنار هم، مقیاس فضا را درست نشان می‌داد." },
  { id: "s5", name: "هستی", note: "آدم دلش می‌خواست همان‌جا بنشیند و عجله‌ای برای رفتن نداشته باشد." },
  { id: "s6", name: "رضا", note: "رنگ چوب‌ها گرم بود و با نور عصر برج میلاد خوب می‌نشست." },
  { id: "s7", name: "سارا", note: "هر شیء جای خودش را داشت؛ چیزی برای پر کردن فضا اضافه نشده بود." },
  { id: "s8", name: "پویا", note: "از نزدیک، ساخت و اتصال‌ها دقیق‌تر از عکس‌های کاتالوگ بود." },
];

const storageKey = "exhibition-stories";

export default function ExperienceStories() {
  const titleId = useId();
  const [stories, setStories] = useState<Story[]>(seeds);
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"name" | "note">("name");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]") as Story[];
      if (Array.isArray(saved) && saved.length) {
        setStories([...saved.filter((item) => item?.name && item?.note), ...seeds]);
      }
    } catch {
      /* keep the curated wall */
    }
  }, []);

  const close = () => {
    setOpen(false);
    setStep("name");
    setName("");
    setNote("");
    setError("");
  };

  const publish = () => {
    const verdict = moderateExperience(name, note);
    if (!verdict.ok) {
      setError(verdict.reason);
      return;
    }
    const next: Story = {
      id: `u-${Date.now()}`,
      name: name.trim().replace(/\s+/g, " "),
      note: note.trim().replace(/\s+/g, " "),
    };
    const stored = [next, ...stories.filter((item) => item.id.startsWith("u-"))];
    localStorage.setItem(storageKey, JSON.stringify(stored));
    setStories([next, ...stories]);
    close();
  };

  const span = Math.ceil(stories.length / 3);
  const rows = [0, 1, 2].map((index) => {
    const slice = stories.slice(index * span, (index + 1) * span);
    return slice.length ? slice : stories;
  });

  return (
    <section className="overflow-hidden bg-paper py-16 text-forest md:py-24">
      <Container>
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow text-brick">تجربه نمایشگاه</p>
            <h2 className="mt-5 text-[clamp(2.2rem,4.4vw,4.4rem)] font-extralight leading-none tracking-tightest">
              آنچه از نزدیک ماند
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex w-fit items-center rounded-full bg-forest px-5 py-3 text-sm text-paper transition-colors hover:bg-brick"
          >
            ثبت تجربه
          </button>
        </div>
      </Container>

      <div className="mt-12 space-y-4 md:mt-16">
        {rows.map((row, index) => (
          <StoryRow key={index} stories={row} reverse={index === 1} duration={58 + index * 8} />
        ))}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-forest/55 p-4 sm:items-center" role="presentation" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="w-full max-w-md bg-paper p-6 text-forest shadow-2xl sm:p-8"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <p id={titleId} className="text-sm text-brick">
                {step === "name" ? "۰۱  نام" : "۰۲  نظر"}
              </p>
              <button type="button" onClick={close} className="text-sm text-forest/45">
                بستن
              </button>
            </div>
            <h3 className="mt-6 text-2xl font-light leading-snug">
              {step === "name" ? "نامتان را بنویسید" : "از نمایشگاه چه ماند؟"}
            </h3>
            {step === "name" ? (
              <form
                className="mt-8"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (name.trim().length < 2) {
                    setError("نام را کامل‌تر بنویسید.");
                    return;
                  }
                  setError("");
                  setStep("note");
                }}
              >
                <input
                  autoFocus
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="مثلاً سارا"
                  className="w-full border-b border-forest/20 bg-transparent py-3 text-lg outline-none placeholder:text-forest/30"
                />
                {error ? <p className="mt-4 text-sm text-brick">{error}</p> : null}
                <button type="submit" className="mt-8 rounded-full bg-forest px-5 py-3 text-sm text-paper">
                  ادامه
                </button>
              </form>
            ) : (
              <form
                className="mt-8"
                onSubmit={(event) => {
                  event.preventDefault();
                  publish();
                }}
              >
                <textarea
                  autoFocus
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  rows={4}
                  placeholder="یک جمله از چیزی که دیدید"
                  className="w-full resize-none border-b border-forest/20 bg-transparent py-3 text-lg outline-none placeholder:text-forest/30"
                />
                {error ? <p className="mt-4 text-sm text-brick">{error}</p> : null}
                <div className="mt-8 flex items-center gap-4">
                  <button type="submit" className="rounded-full bg-forest px-5 py-3 text-sm text-paper">
                    ثبت روی دیوار
                  </button>
                  <button type="button" onClick={() => setStep("name")} className="text-sm text-forest/50">
                    بازگشت
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

const cardTones = ["bg-[#f7f3ee]", "bg-[#f3ebe3]", "bg-[#fbf8f4]", "bg-[#efe6db]"];

function cardTone(id: string) {
  const seed = [...id].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return cardTones[seed % cardTones.length];
}

function StoryRow({ stories, reverse, duration }: { stories: Story[]; reverse?: boolean; duration: number }) {
  const repeats = Math.max(1, Math.ceil(12 / Math.max(stories.length, 1)));
  const sequence = Array.from({ length: repeats }, () => stories).flat();

  return (
    <div dir="ltr" className="relative overflow-hidden">
      <div
        className={cn("experience-marquee flex w-max", reverse && "experience-marquee-reverse")}
        style={{ animationDuration: `${duration * repeats}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex" aria-hidden={copy === 1}>
            {sequence.map((story, index) => (
              <article
                key={`${copy}-${story.id}-${index}`}
                dir="rtl"
                className={cn(
                  "mx-2 w-[18rem] shrink-0 border border-forest/10 px-5 py-6 sm:w-[22rem]",
                  cardTone(story.id),
                )}
              >
                <p className="text-[1.05rem] font-light leading-8 text-forest">«{story.note}»</p>
                <p className="mt-6 text-sm text-brick">{story.name} این را در مورد نمایشگاه گفت</p>
              </article>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
