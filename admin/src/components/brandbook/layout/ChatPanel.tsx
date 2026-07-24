"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  AttachIcon,
  CloseIcon,
  HistoryIcon,
  PlusIcon,
  SendIcon,
  ToolsIcon,
} from "@/components/brandbook/icons";
import {
  BrandAuditResult,
  BrandMode,
  buildBrandConversationPlan,
  formatAuditAsText,
  runBrandAudit,
} from "@/lib/brand-orchestrator";

type Attachment = {
  name: string;
  url?: string;
};

type BrandAgentMode = "identity" | "ideation" | "audit";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  attachments?: Attachment[];
  agentMode?: BrandAgentMode;
  audit?: BrandAuditResult;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
  tool?: OptionalTool | null;
};

type OptionalTool = "tone-guard" | "campaign";

type OptionalToolConfig = {
  id: OptionalTool;
  title: string;
  desc: string;
  mode: BrandMode;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const API_TIMEOUT_MS = 18000;

const OPTIONAL_TOOLS: OptionalToolConfig[] = [
  {
    id: "tone-guard",
    title: "محافظ لحن برند",
    desc: "بررسی هماهنگی کپشن و متن با زبان برند",
    mode: "audit",
  },
  {
    id: "campaign",
    title: "دستیار طراحی کمپین",
    desc: "ایده و سناریوی محتوا با هویت برند",
    mode: "ideation",
  },
];

function formatToolLabel(tool: OptionalTool | null | undefined): string {
  if (tool === "tone-guard") return "محافظ لحن برند";
  if (tool === "campaign") return "دستیار کمپین";
  return "راهنمای برند";
}

function formatAgentLabel(mode: BrandAgentMode | undefined): string {
  if (mode === "audit") return "محافظ لحن";
  if (mode === "ideation") return "دستیار کمپین";
  return "راهنمای هویت";
}

const initialSession: ChatSession = {
  id: "session-1",
  title: "گفتگوی برند",
  tool: null,
  messages: [
    {
      id: "welcome-1",
      role: "assistant",
      content:
        "سلام. من راهنمای برند خانه چوب و هنر هستم — درباره هویت، زبان و اصول برند می‌توانید بپرسید. برای بررسی لحن یا طراحی کمپین، از دکمه ابزار کنار نوار پیام استفاده کنید.",
      agentMode: "identity",
    },
  ],
};

export default function ChatPanel() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [sessions, setSessions] = useState<ChatSession[]>([initialSession]);
  const [activeSessionId, setActiveSessionId] = useState<string>("session-1");
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showToolMenu, setShowToolMenu] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState<string>("");

  const [input, setInput] = useState<string>("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorBanner, setErrorBanner] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toolMenuRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const messages = activeSession.messages;
  const optionalTool = activeSession.tool ?? null;

  const getEffectiveMode = (): BrandMode => {
    if (optionalTool === "tone-guard") return "audit";
    if (optionalTool === "campaign") return "ideation";
    return "auto";
  };

  const setOptionalTool = (tool: OptionalTool | null) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId ? { ...session, tool } : session,
      ),
    );
    setShowToolMenu(false);
  };

  const ensureBottom = (behavior?: ScrollBehavior) => {
    const container = scrollRef.current;
    if (!container) return;
    if (behavior === "smooth") {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
      return;
    }
    container.scrollTop = container.scrollHeight;
  };

  useEffect(() => {
    const timeout = requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      ensureBottom("auto");
    });
    return () => cancelAnimationFrame(timeout);
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowToolMenu(false);
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!showToolMenu) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (toolMenuRef.current?.contains(target)) return;
      setShowToolMenu(false);
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [showToolMenu]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: "گفتگوی جدید",
      tool: null,
      messages: [
        {
          id: `welcome-${Date.now()}`,
          role: "assistant",
          content: "گفتگوی تازه آغاز شد. سؤال برند خود را بپرسید یا یک ابزار تخصصی فعال کنید.",
          agentMode: "identity",
        },
      ],
    };

    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setShowHistory(false);
    setShowToolMenu(false);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      handleNewChat();
      return;
    }
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    if (activeSessionId === id) setActiveSessionId(updated[0].id);
  };

  const handleRename = (id: string) => {
    if (editTitle.trim()) {
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, title: editTitle.trim() } : s)),
      );
    }
    setEditingId(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newAtts: Attachment[] = Array.from(files).map((f) => ({
      name: f.name,
      url: f.type.includes("image") ? URL.createObjectURL(f) : undefined,
    }));
    setAttachments((prev) => [...prev, ...newAtts]);
  };

  const queryApi = async (prompt: string): Promise<string> => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

    try {
      const res = await fetch(`${API_BASE}/ai/brand-chat/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Brand API responded with status ${res.status}`);
      }

      const payload = (await res.json()) as { answer?: string };
      if (!payload?.answer || !payload.answer.trim()) {
        throw new Error("پاسخ خالی از API دریافت شد");
      }
      return payload.answer;
    } finally {
      clearTimeout(timeout);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const addAssistantMsg = (
    content: string,
    agentMode: BrandAgentMode,
    options?: {
      audit?: BrandAuditResult;
    },
  ) => {
    const msg: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content,
      agentMode,
      audit: options?.audit,
    };

    setSessions((prev) =>
      prev.map((s) => (s.id === activeSessionId ? { ...s, messages: [...s.messages, msg] } : s)),
    );
  };

  const getLocalRagAnswer = (query: string, resolvedMode: BrandAgentMode): string => {
    const q = query.toLowerCase().trim();

    if (resolvedMode === "audit") {
      const audit = runBrandAudit(query);
      return formatAuditAsText(audit);
    }

    if (/^(سلام|درود|خوبی|چطوری)/.test(q)) {
      return "سلام و درود! روزگارتان خوش. من دستیار هوشمند خانه چوب و هنر هستم. می‌توانیم درباره هویت، لحن، محتوا، ایده کمپین یا ممیزی متن صحبت کنیم.";
    }

    if (resolvedMode === "ideation") {
      return [
        "ایده‌پردازی هویتی در مسیر خانه چوب و هنر:",
        "",
        "1) یک زاویه احساسی واقعی: یک لحظه زندگی خانه‌ای که این محصول/متن آن را بهتر می‌کند.",
        "2) یک جزئیات متریال: چوب، نور، بافت، اتصالات یا کاربری.",
        "3) یک دلیل قابل راستی‌آزمایی: دوام، کارکرد، و هم‌نشینی با سبک زندگی.",
        "4) یک اقدام آرام: سؤال کوتاه برای تعامل با مخاطب.",
        "",
        "اگر متن اولیه‌تان را بفرستید، نسخه دقیق و قابل‌استفاده برای کانال شما را می‌دم.",
      ].join("\n");
    }

    if (/(رنگ|کد|پالت|هگز|cmyk)/.test(q)) {
      return "در پالت رسمی خانه چوب و هنر، سبز جنگلی (#092B1C) با سهم ۸۰٪ رنگ غالب است و هلویی گرم (#FBBEA6) با سهم ۲۰٪ اکسنت اصلی محسوب می‌شود.";
    }

    if (/(نقل قول|شیرپور|بنیان|تاریخچه)/.test(q)) {
      return "نقل‌قول بنیان‌گذار (غلامحسین شیرپور):\n«اعتبار و جایگاه یک نام، سال‌ها زمان می‌برد تا ساخته شود. اگر روزی نتوانستید کاری در شأن نام معتبرتان انجام دهید، انجام ندادنش درست‌تر خواهد بود.»";
    }

    return `درباره «${query}»: خانه چوب و هنر روی معماری، اصالت متریال و آرامش عملی تمرکز می‌کند؛ نه شعارهای سطحی یا ادعاهای بزرگ‌نمایانه."`;
  };

  const executeSend = async (text: string, atts: Attachment[]) => {
    if (!text.trim() && atts.length === 0) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      attachments: atts.length > 0 ? [...atts] : undefined,
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          const autoTitle = s.title === "گفتگوی جدید" && text.trim() ? text.trim().slice(0, 18) : s.title;
          return {
            ...s,
            messages: [...s.messages, userMsg],
            title: autoTitle,
          };
        }
        return s;
      }),
    );

    setInput("");
    setAttachments([]);
    setIsTyping(true);

    const plan = buildBrandConversationPlan(getEffectiveMode(), text);
    setErrorBanner("");

    if (!plan.allowResponse) {
      addAssistantMsg(plan.guardMessage || "این درخواست قابل پاسخ‌دهی نیست.", "identity");
      setIsTyping(false);
      return;
    }

    if (plan.resolvedMode === "audit") {
      const audit = runBrandAudit(text);
      addAssistantMsg(formatAuditAsText(audit), "audit", { audit });
      setIsTyping(false);
      return;
    }

    try {
      const answer = await queryApi(plan.backendPrompt);
      addAssistantMsg(answer, plan.resolvedMode);
    } catch {
      setErrorBanner("سرویس هوش مصنوعی در حال حاضر در دسترس نیست؛ پاسخ از دیتای داخلی نمایش داده شد.");
      addAssistantMsg(getLocalRagAnswer(text, plan.resolvedMode), plan.resolvedMode);
    } finally {
      setIsTyping(false);
    }
  };

  const auditBadge = (result: BrandAuditResult | undefined) => {
    if (!result) return null;

    return (
      <div className="mt-2 space-y-2 rounded-xl border border-forest/15 bg-forest/[0.04] p-2.5 text-[11px] leading-6 text-forest/75">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-forest/80">گزارش ممیزی</span>
          <span className="rounded-full border border-forest/20 px-2 py-0.5 text-[10px]">امتیاز: {result.score}/100</span>
        </div>

        <p>{result.summary}</p>

        <div>
          {result.metrics.map((metric) => (
            <div key={metric.label} className="mb-1 flex items-start justify-between gap-2 border-b border-forest/10 pb-1 last:border-b-0">
              <span className="max-w-[62%]">{metric.label}</span>
              <span className="font-semibold text-forest">{metric.score}/100</span>
              <span className="max-w-[42%] text-forest/55">{metric.insight}</span>
            </div>
          ))}
        </div>

        {result.criticalIssues.length > 0 && (
          <div>
            <p className="font-semibold text-forest/75">موارد مهم برای اصلاح:</p>
            <ul className="list-disc list-inside text-forest/65">
              {result.criticalIssues.map((issue) => (
                <li key={issue}>{issue}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <p className="font-semibold text-forest/75">پلن 24 ساعته اصلاح:</p>
          <ul className="list-disc list-inside text-forest/65">
            {result.actionPlan.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          title="باز کردن استودیو برند"
          aria-label="باز کردن استودیو برند"
          className="fixed bottom-[5.35rem] left-3 z-[66] flex items-center gap-2.5 rounded-full border border-peach/25 bg-forest px-3 py-2.5 text-paper shadow-[0_18px_50px_rgba(9,43,28,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-700 sm:bottom-5 sm:left-5 sm:px-4"
        >
          <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-peach">
            <Image src="/brand/monogram-black.svg" alt="" width={17} height={17} className="object-contain" />
          </span>
          <span className="hidden text-right sm:block">
            <span className="block text-[11px] font-medium">استودیو برند</span>
            <span className="mt-0.5 block text-[8px] tracking-[0.12em] text-paper/45">خانه چوب و هنر</span>
          </span>
        </button>
      )}

      <button
        type="button"
        className={cn(
          "fixed inset-0 z-[68] bg-forest/35 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => {
          setIsOpen(false);
          setShowToolMenu(false);
        }}
        aria-label="بستن استودیو برند"
        tabIndex={isOpen ? 0 : -1}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="استودیو برند"
        className={cn(
          "fixed inset-x-0 bottom-0 z-[70] flex h-[min(82dvh,720px)] w-full flex-col rounded-t-[1.75rem] border border-forest/15 bg-paper pb-[env(safe-area-inset-bottom)] shadow-[0_-24px_80px_rgba(9,43,28,0.24)] transition-transform duration-500 ease-out-expo sm:bottom-4 sm:left-4 sm:right-auto sm:h-[min(720px,calc(100dvh-2rem))] sm:w-[400px] sm:rounded-[1.75rem] sm:pb-0 sm:shadow-[0_28px_90px_rgba(9,43,28,0.26)]",
          isOpen
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-[110%] sm:translate-x-[-120%] sm:translate-y-0",
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[inherit]">
        <div className="flex h-[4.25rem] shrink-0 items-center justify-between border-b border-forest/10 bg-forest px-4 text-paper">
          <div className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-peach">
              <Image src="/brand/monogram-black.svg" alt="" width={17} height={17} className="object-contain" />
            </div>
            <div>
              <span className="block max-w-[160px] truncate text-xs font-medium">{activeSession.title}</span>
              <span className="mt-0.5 block text-[9px] text-paper/50">{formatToolLabel(optionalTool)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowHistory(!showHistory)}
              title="تاریخچه گفت‌وگوها"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-paper/55 transition-colors hover:bg-paper/10 hover:text-paper"
            >
              <HistoryIcon size={15} strokeWidth={1.8} />
            </button>

            <button
              onClick={handleNewChat}
              title="چت جدید"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-paper/55 transition-colors hover:bg-paper/10 hover:text-paper"
            >
              <PlusIcon size={15} strokeWidth={2} />
            </button>

            <button
              onClick={() => setIsOpen(false)}
              title="بستن"
              aria-label="بستن استودیو برند"
              className="ml-1 flex h-8 w-8 items-center justify-center rounded-full text-paper/55 transition-colors hover:bg-paper/10 hover:text-paper"
            >
              <CloseIcon size={15} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        {showHistory && (
          <div className="absolute left-3 right-3 top-[4.25rem] z-50 rounded-2xl border border-forest/10 bg-paper p-2 shadow-xl sm:w-72">
            <div className="mb-2 flex items-center justify-between px-2 text-[11px] font-semibold text-forest/40">
              <span>تاریخچه گفت‌وگوها</span>
              <button onClick={handleNewChat} className="text-forest hover:underline">+ جدید</button>
            </div>
            <div className="max-h-48 overflow-y-auto space-y-0.5 no-scrollbar">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSessionId(s.id);
                    setShowHistory(false);
                    setShowToolMenu(false);
                  }}
                  className={cn(
                    "group flex items-center justify-between rounded-lg px-2 py-1.5 text-xs transition-colors cursor-pointer",
                    activeSessionId === s.id
                      ? "bg-forest/10 font-medium text-forest"
                      : "text-forest/70 hover:bg-forest/5",
                  )}
                >
                  {editingId === s.id ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onBlur={() => handleRename(s.id)}
                      onKeyDown={(e) => e.key === "Enter" && handleRename(s.id)}
                      autoFocus
                      className="w-full bg-transparent outline-none border-b border-forest text-xs"
                    />
                  ) : (
                    <span className="truncate max-w-[140px]">{s.title}</span>
                  )}

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(s.id);
                        setEditTitle(s.title);
                      }}
                      className="text-[10px] text-forest/40 hover:text-forest"
                    >
                      ✏️
                    </button>
                    <button onClick={(e) => handleDeleteSession(s.id, e)} className="text-[10px] text-forest/40 hover:text-red-500">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto bg-paper p-4 no-scrollbar sm:p-5">
          {messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={cn(
                "group relative flex flex-col",
                msg.role === "user" ? "items-start" : "items-end",
              )}
            >
              <div
                className={cn(
                  "max-w-[92%] text-[13px] leading-7",
                  msg.role === "user"
                    ? "rounded-2xl rounded-tr-md bg-forest px-4 py-3 text-paper"
                    : "rounded-2xl rounded-tl-md border border-forest/10 bg-white/70 px-4 py-3 text-forest/85 shadow-[0_8px_30px_rgba(9,43,28,0.04)]",
                )}
              >
                {msg.role === "assistant" && msg.agentMode && (
                  <p className="mb-2 text-[10px] font-medium tracking-[0.08em] text-brick">
                    {formatAgentLabel(msg.agentMode)}
                  </p>
                )}

                {msg.attachments && (
                  <div className="mb-1.5 flex flex-wrap gap-1">
                    {msg.attachments.map((att, i) => (
                      <span key={i} className="rounded bg-forest/10 px-1.5 py-0.5 text-[10px]">
                        {att.name}
                      </span>
                    ))}
                  </div>
                )}

                <p className="whitespace-pre-line">{msg.content}</p>
                {msg.audit && auditBadge(msg.audit)}
              </div>

              {msg.role === "assistant" && (
                <div className="mt-1.5 flex items-center gap-3 text-[10px] text-forest/35 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="transition-colors hover:text-forest"
                  >
                    {copiedId === msg.id ? "کپی شد" : "کپی"}
                  </button>

                  <button
                    onClick={() => {
                      const prevUser = [...messages].slice(0, idx).reverse().find((m) => m.role === "user");
                      if (prevUser) executeSend(prevUser.content, prevUser.attachments || []);
                    }}
                    className="transition-colors hover:text-forest"
                  >
                    تولید مجدد
                  </button>
                </div>
              )}
            </div>
          ))}

          {errorBanner && (
            <div className="rounded-xl border border-brick/20 bg-peach/20 px-3 py-2 text-[11px] text-brick">
              {errorBanner}
            </div>
          )}

          {isTyping && (
            <div className="flex items-end justify-end gap-1 px-2 py-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest/30" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest/30 [animation-delay:120ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest/30 [animation-delay:240ms]" />
            </div>
          )}
        </div>
        </div>

        <div className="relative z-30 shrink-0 border-t border-forest/10 bg-paper p-3">
          {optionalTool && (
            <div className="mb-2 flex items-center gap-2 px-1">
              <span className="rounded-full border border-forest/15 bg-forest/[0.05] px-2.5 py-1 text-[10px] font-medium text-forest">
                {formatToolLabel(optionalTool)}
              </span>
              <button
                type="button"
                onClick={() => setOptionalTool(null)}
                className="text-[10px] text-forest/40 transition-colors hover:text-forest"
              >
                غیرفعال
              </button>
            </div>
          )}

          {attachments.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1 px-1">
              {attachments.map((att, i) => (
                <span key={i} className="flex items-center gap-1 rounded bg-forest/5 px-2 py-0.5 text-[10px] text-forest">
                  {att.name}
                  <button
                    onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                    className="hover:text-red-500 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-end gap-1.5 rounded-2xl border border-forest/10 bg-white px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <div ref={toolMenuRef} className="relative shrink-0">
              {showToolMenu && (
                <div className="absolute bottom-[calc(100%+0.5rem)] start-0 z-40 w-[min(13.5rem,calc(100vw-2.5rem))] overflow-hidden rounded-xl border border-forest/10 bg-paper p-1 shadow-[0_10px_30px_rgba(9,43,28,0.12)]">
                  <p className="px-2 py-1 text-[9px] text-forest/40">ابزار اختیاری</p>
                  <div className="space-y-0.5">
                    {OPTIONAL_TOOLS.map((tool) => (
                      <button
                        key={tool.id}
                        type="button"
                        onClick={() => setOptionalTool(optionalTool === tool.id ? null : tool.id)}
                        className={cn(
                          "w-full rounded-lg px-2 py-1.5 text-right transition-colors",
                          optionalTool === tool.id
                            ? "bg-forest text-paper"
                            : "text-forest hover:bg-forest/[0.05]",
                        )}
                      >
                        <span className="block text-[11px] font-medium">{tool.title}</span>
                        <span
                          className={cn(
                            "mt-0.5 block text-[10px] leading-5",
                            optionalTool === tool.id ? "text-paper/70" : "text-forest/45",
                          )}
                        >
                          {tool.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowToolMenu((value) => !value)}
                title="ابزارهای تخصصی"
                aria-expanded={showToolMenu}
                aria-haspopup="menu"
                className={cn(
                  "rounded-lg p-1.5 transition-colors",
                  optionalTool || showToolMenu
                    ? "bg-forest text-paper"
                    : "text-forest/40 hover:bg-forest/5 hover:text-forest",
                )}
              >
                <ToolsIcon size={15} strokeWidth={1.8} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="افزودن فایل"
              className="rounded-lg p-1.5 text-forest/40 transition-colors hover:bg-forest/5 hover:text-forest self-end"
            >
              <AttachIcon size={15} strokeWidth={1.8} />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              className="hidden"
            />

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  executeSend(input, attachments);
                }
              }}
              placeholder={
                optionalTool === "tone-guard"
                  ? "متن یا کپشن را برای بررسی لحن برند بنویسید..."
                  : optionalTool === "campaign"
                    ? "ایده یا هدف کمپین را توضیح دهید..."
                    : "سؤال برند، راهنمای هویت یا زبان برند..."
              }
              rows={1}
              className="max-h-24 min-h-8 flex-1 resize-none bg-transparent py-1 text-[13px] leading-6 text-forest placeholder:text-forest/30 outline-none"
            />

            <button
              onClick={() => executeSend(input, attachments)}
              disabled={(!input.trim() && attachments.length === 0) || isTyping}
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center self-end rounded-xl transition-all",
                input.trim() || attachments.length > 0
                  ? "bg-forest text-paper hover:bg-forest-700"
                  : "cursor-not-allowed text-forest/20",
              )}
            >
              <SendIcon size={13} strokeWidth={2} className="rotate-180" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
