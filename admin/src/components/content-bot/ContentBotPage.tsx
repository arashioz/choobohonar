"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SendIcon, SparkleIcon, PlusIcon } from "@/components/brandbook/icons";

type ContentMode = "blog" | "product" | "caption" | "newsletter";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  mode?: ContentMode;
};

const MODES: {
  id: ContentMode;
  label: string;
  hint: string;
  emoji: string;
}[] = [
  {
    id: "blog",
    label: "مقاله بلاگ",
    hint: "عنوان، ساختار و پیش‌نویس سئو",
    emoji: "✎",
  },
  {
    id: "product",
    label: "معرفی محصول",
    hint: "متن فروش با لحن برند",
    emoji: "◆",
  },
  {
    id: "caption",
    label: "کپشن شبکه",
    hint: "کوتاه، گرم، قابل‌اشتراک",
    emoji: "✦",
  },
  {
    id: "newsletter",
    label: "خبرنامه",
    hint: "نامهٔ آرام برای مخاطب وفادار",
    emoji: "✉",
  },
];

const SUGGESTIONS = [
  "مقاله درباره نگهداری میز چوبی در رطوبت تهران",
  "معرفی یک قفسه مینیمال برای اتاق کار",
  "کپشن اینستا برای مجموعه جدید بهار",
  "خبرنامه معرفی پروژهٔ معماری داخلی",
];

const DEMO_REPLIES = [
  "ایدهٔ قشنگیه — وقتی موتور تولید روشن بشه، از همین‌جا پیش‌نویس کامل می‌سازم. فعلاً دارم قلم‌موهام رو مرتب می‌کنم.",
  "یادداشت شد. چوب‌نویس هنوز در کارگاه آماده‌سازی‌ست؛ به‌زودی همین گفتگو به مقاله، کپشن یا معرفی محصول تبدیل می‌شه.",
  "فهمیدم چی می‌خوای. فعلاً فقط صحنه رو چیده‌ایم — تولید واقعی محتوا به‌زودی اینجاست.",
  "خوبه که از همین‌جا شروع کردی. نسخهٔ زندهٔ من هنوز پشت درِ کارگاه منتظر اجازه‌ست.",
];

function BotAvatar({ pulse }: { pulse?: boolean }) {
  return (
    <div className="relative shrink-0">
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-2xl bg-forest text-peach shadow-md shadow-forest/15",
          pulse && "animate-pulse",
        )}
      >
        <SparkleIcon size={18} strokeWidth={1.6} />
      </div>
      <span className="absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full border-2 border-paper bg-sage" />
    </div>
  );
}

export default function ContentBotPage() {
  const [mode, setMode] = useState<ContentMode>("blog");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "سلام، من چوب‌نویسم — دستیار تولید محتوای خانه چوب و هنر.\nموضوع بده، نوع محتوا رو انتخاب کن؛ من ساختار، لحن و پیش‌نویس رو برات می‌چینم.\n\nفعلاً این صفحه پیش‌نمایش استودیوست؛ موتور تولید به‌زودی روشن می‌شه.",
    },
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const [replyIndex, setReplyIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const activeMode = MODES.find((m) => m.id === mode)!;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  const pushDemoReply = () => {
    setIsThinking(true);
    const delay = 900 + Math.random() * 700;
    window.setTimeout(() => {
      const reply = DEMO_REPLIES[replyIndex % DEMO_REPLIES.length];
      setReplyIndex((i) => i + 1);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: reply,
          mode,
        },
      ]);
      setIsThinking(false);
    }, delay);
  };

  const handleSend = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value || isThinking) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `user-${Date.now()}`,
        role: "user",
        content: value,
        mode,
      },
    ]);
    setInput("");
    pushDemoReply();
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        content:
          "گفتگوی تازه. موضوع جدیدت چیه؟ مقاله، محصول، کپشن یا خبرنامه — بگو از کجا شروع کنیم.",
      },
    ]);
    setInput("");
    setIsThinking(false);
  };

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-paper">
      <div className="pointer-events-none absolute inset-0 brandbook-grid opacity-50" aria-hidden />
      <div
        className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-peach/30 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-16 bottom-20 h-64 w-64 rounded-full bg-sage/25 blur-[90px]"
        aria-hidden
      />

      <header className="relative z-10 border-b border-forest/8 bg-paper/75 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-forest/40 transition-colors hover:bg-forest/5 hover:text-forest"
              title="بازگشت به پنل"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </Link>
            <BotAvatar />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-medium text-forest">چوب‌نویس</h1>
                <span className="rounded-full border border-peach/40 bg-peach/25 px-2 py-0.5 text-[9px] font-medium tracking-wide text-brick">
                  پیش‌نمایش
                </span>
              </div>
              <p className="mt-0.5 text-[11px] text-forest/45">
                ربات تولید خودکار محتوا · خانه چوب و هنر
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNewChat}
            className="flex items-center gap-1.5 rounded-xl border border-forest/10 bg-white/70 px-3 py-2 text-[11px] font-medium text-forest/70 transition-colors hover:border-forest/20 hover:bg-white hover:text-forest"
          >
            <PlusIcon size={13} strokeWidth={2} />
            گفتگوی جدید
          </button>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 sm:px-8">
        <div className="pt-5 sm:pt-6">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={cn(
                  "shrink-0 rounded-2xl border px-3.5 py-2.5 text-right transition-all duration-300",
                  mode === m.id
                    ? "border-forest bg-forest text-paper shadow-lg shadow-forest/15"
                    : "border-forest/10 bg-white/60 text-forest/70 hover:border-forest/20 hover:bg-white",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs",
                      mode === m.id ? "text-peach" : "text-brick/70",
                    )}
                  >
                    {m.emoji}
                  </span>
                  <span className="text-[12px] font-medium">{m.label}</span>
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-[10px]",
                    mode === m.id ? "text-paper/50" : "text-forest/40",
                  )}
                >
                  {m.hint}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-4 flex-1 space-y-5 overflow-y-auto pb-4 no-scrollbar"
          style={{ minHeight: "280px", maxHeight: "calc(100dvh - 280px)" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "flex-row-reverse" : "flex-row",
              )}
            >
              {msg.role === "assistant" ? (
                <BotAvatar />
              ) : (
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-peach/40">
                  <Image
                    src="/brand/monogram-black.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="object-contain opacity-70"
                  />
                </div>
              )}

              <div
                className={cn(
                  "max-w-[min(100%,28rem)] text-[13px] leading-7",
                  msg.role === "user"
                    ? "rounded-2xl rounded-tl-md bg-forest px-4 py-3 text-paper"
                    : "rounded-2xl rounded-tr-md border border-forest/10 bg-white/75 px-4 py-3 text-forest/85 shadow-[0_10px_36px_rgba(9,43,28,0.05)]",
                )}
              >
                {msg.role === "assistant" && (
                  <p className="mb-1.5 text-[10px] font-medium tracking-[0.12em] text-brick">
                    چوب‌نویس
                    {msg.mode
                      ? ` · ${MODES.find((m) => m.id === msg.mode)?.label}`
                      : ""}
                  </p>
                )}
                <p className="whitespace-pre-line">{msg.content}</p>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex gap-3">
              <BotAvatar pulse />
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tr-md border border-forest/10 bg-white/70 px-4 py-3">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest/35" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest/35 [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest/35 [animation-delay:240ms]" />
                <span className="ms-2 text-[11px] text-forest/40">داره فکر می‌کنه…</span>
              </div>
            </div>
          )}

          {messages.length <= 1 && !isThinking && (
            <div className="pt-2">
              <p className="mb-2.5 text-[11px] text-forest/40">پیشنهاد شروع سریع</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleSend(s)}
                    className="rounded-full border border-forest/10 bg-white/70 px-3.5 py-2 text-[11px] text-forest/70 transition-all hover:border-forest/25 hover:bg-white hover:text-forest hover:shadow-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 z-20 border-t border-forest/8 bg-paper/90 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
          <div className="mb-2 flex items-center justify-between gap-3 px-1">
            <p className="text-[10px] text-forest/40">
              حالت فعال:{" "}
              <span className="font-medium text-forest/65">{activeMode.label}</span>
              <span className="mx-1.5 text-forest/20">·</span>
              تولید واقعی هنوز وصل نیست
            </p>
          </div>

          <div className="flex items-end gap-2 rounded-[1.35rem] border border-forest/10 bg-white px-3 py-2.5 shadow-[0_12px_40px_rgba(9,43,28,0.06)]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              placeholder={
                mode === "blog"
                  ? "موضوع مقاله را بنویس…"
                  : mode === "product"
                    ? "نام محصول و ویژگی‌ها…"
                    : mode === "caption"
                      ? "ایده یا حس کپشن…"
                      : "موضوع خبرنامه…"
              }
              className="max-h-28 min-h-10 flex-1 resize-none bg-transparent py-2 text-[13px] leading-6 text-forest placeholder:text-forest/30 outline-none"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isThinking}
              className={cn(
                "mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300",
                input.trim() && !isThinking
                  ? "bg-forest text-peach shadow-md shadow-forest/20 hover:bg-forest-700"
                  : "cursor-not-allowed bg-forest/5 text-forest/25",
              )}
              aria-label="ارسال"
            >
              <SendIcon size={14} strokeWidth={2} className="rotate-180" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
