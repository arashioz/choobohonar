type BrandAgentMode = "identity" | "ideation" | "audit";
export type BrandMode = "auto" | "identity" | "ideation" | "audit";

type AuditState = "aligned" | "partial" | "offbrand";

export interface BrandAuditMetric {
  label: string;
  score: number;
  status: "strong" | "needs-improvement" | "weak";
  insight: string;
}

export interface BrandAuditResult {
  state: AuditState;
  score: number;
  summary: string;
  metrics: BrandAuditMetric[];
  criticalIssues: string[];
  recommendations: string[];
  actionPlan: string[];
  nextStep: string;
}

export interface OrchestratorPlan {
  requestedMode: BrandMode;
  resolvedMode: BrandAgentMode;
  guardMessage?: string;
  backendPrompt: string;
  allowResponse: boolean;
}

const FORBIDDEN_TONE = [
  "لوکس",
  "بی‌نظیر",
  "فوق‌العاده",
  "رویایی",
  "بسیار زیاد",
  "شگفت‌انگیز",
  "معجزه",
  "10/10",
  "unbeatable",
  "perfect",
  "luxury",
  "stunning",
  "miracle",
];

const MANDATORY_BRAND_TERMS = [
  "چوب",
  "خانه",
  "متریال",
  "نجار",
  "نجاری",
  "طراحی",
  "کیفیت",
  "اعتماد",
];

const BRAND_VOCAB = [
  "ساده",
  "اصالت",
  "شفاف",
  "حس",
  "نور",
  "رگه",
  "اتصالات",
  "طبیعی",
  "دوام",
];

const IDENTITY_TRIGGERS = [
  "هویت برند",
  "هویت",
  "داستان برند",
  "گایدلاین",
  "گفتگو",
  "تعریف",
  "پالت",
  "رنگ",
  "ارزش",
  "چوب و هنر",
  "خانه چوب و هنر",
  "log",
  "لوگو",
  "logotype",
];

const IDEATION_TRIGGERS = [
  "ایده",
  "سناریو",
  "جمله",
  "سرخط",
  "caption",
  "متن تبلیغی",
  "کمپین",
  "کانسپت",
  "توصیف",
  "محتوا",
  "طرح",
];

const AUDIT_TRIGGERS = [
  "ممیزی",
  "ارزیابی",
  "چک",
  "سنجش",
  "چقدر",
  "هماهنگ",
  "لحن",
  "audit",
  "brand",
  "بررسی",
  "مطابقت",
];

function toPlain(input: string): string {
  return input.toLowerCase().replace(/\s+/g, " ").trim();
}

function includesAny(text: string, values: string[]): boolean {
  return values.some((value) => text.includes(value));
}

export function resolveBrandMode(mode: BrandMode, message: string): BrandAgentMode {
  const normalized = toPlain(message);

  if (mode === "identity") return "identity";
  if (mode === "ideation") return "ideation";
  if (mode === "audit") return "audit";

  if (includesAny(normalized, AUDIT_TRIGGERS)) return "audit";
  if (includesAny(normalized, IDEATION_TRIGGERS)) return "ideation";
  if (includesAny(normalized, IDENTITY_TRIGGERS)) return "identity";

  return "identity";
}

export function buildBrandConversationPlan(mode: BrandMode, message: string): OrchestratorPlan {
  const normalized = toPlain(message);
  const resolvedMode = resolveBrandMode(mode, message);

  if (!message.trim()) {
    return {
      requestedMode: mode,
      resolvedMode,
      guardMessage: "پیام خالی است. لطفا دقیق‌تر توضیح دهید که چه بخشی از برندبوک را می‌خواهید بررسی کنیم.",
      backendPrompt: message,
      allowResponse: false,
    };
  }

  if (
    includesAny(normalized, ["سرقت", "تقلب", "هک", "روش غیرقانونی", "عکس شخص دیگر", "حقوقی"])
  ) {
    return {
      requestedMode: mode,
      resolvedMode,
      guardMessage:
        "برای حفظ شفافیت و ایمنی برندبوک، این درخواست خارج از دامنه‌ی خدمات محتوا و هویت برند است. می‌توانم فقط روی تعریف هویت، ایده‌پردازی و ممیزی برند کمک کنم.",
      backendPrompt: message,
      allowResponse: false,
    };
  }

  const promptByMode: Record<BrandAgentMode, string> = {
    identity:
      "راهنمایی برند: فقط درباره تاریخچه، هویت، ارزش‌ها، اصول بصری، رفتار زبانی و هر داده مرتبط با برند خانه چوب و هنر پاسخ بده.",
    ideation:
      "راهنمایی ایده‌پردازی: یک پیشنهاد تخصصی تولید محتوا یا ایده‌ریزی کمپین بده که وفادار به هویت «خانه چوب و هنر» باشد.",
    audit:
      "ارزیابی برند: فقط متن کاربر را در برابر چارچوب لحن و هویت خانه چوب و هنر بسنج و وضعیت هماهنگی را بده.",
  };

  return {
    requestedMode: mode === "auto" ? resolvedMode : (mode as BrandAgentMode),
    resolvedMode,
    backendPrompt: `${promptByMode[resolvedMode]}\n\nکاربر: ${message}`,
    allowResponse: true,
  };
}

function tokenScore(content: string, terms: string[]): number {
  const normalized = toPlain(content);
  let hits = 0;
  for (const term of terms) {
    if (normalized.includes(term)) hits += 1;
  }
  return Math.min(100, Math.round((hits / terms.length) * 100));
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function runBrandAudit(text: string): BrandAuditResult {
  const normalized = toPlain(text);
  const sentenceCount = text.split(/[\n.!?؟!؛]/g).filter((line) => line.trim()).length;
  const bannedCount = FORBIDDEN_TONE.reduce((total, word) => {
    const regex = new RegExp(word, "gi");
    const matches = normalized.match(regex);
    return total + (matches ? matches.length : 0);
  }, 0);

  const mandatoryScore = tokenScore(normalized, MANDATORY_BRAND_TERMS);
  const vocabularyScore = tokenScore(normalized, BRAND_VOCAB);
  const stylePenalty = Math.min(45, bannedCount * 12);

  const clarityScore =
    sentenceCount > 0 ? Math.min(100, 90 - Math.max(0, Math.floor(sentenceCount / 2) - 2) * 8) : 50;

  const toneMetric = clamp(100 - stylePenalty);
  const materialMetric = clamp(55 + (mandatoryScore * 0.5));
  const clarityMetric = clamp(clarityScore);
  const vocabMetric = clamp(65 + (vocabularyScore * 0.5));

  const metrics: BrandAuditMetric[] = [
    {
      label: "لحن و دقت زبانی",
      score: toneMetric,
      status: toneMetric >= 75 ? "strong" : toneMetric >= 60 ? "needs-improvement" : "weak",
      insight:
        toneMetric >= 75
          ? "رگ صدا نزدیک و کنترل‌شده است. از اغراق‌های زیاد پرهیز شده."
          : toneMetric >= 60
            ? "حداقل یک مورد اغراق یا عبارت هیجان‌زای غیرضروری وجود دارد؛ بهتر است جایگزین دقیق‌تری بگیرید."
            : "لحن از نظر برند نامتعادل است و چند عبارت بیش از حد تبلیغاتی دیده می‌شود.",
    },
    {
      label: "وفاداری به متریال و هویت",
      score: materialMetric,
      status: materialMetric >= 75 ? "strong" : materialMetric >= 60 ? "needs-improvement" : "weak",
      insight:
        materialMetric >= 75
          ? "متریال، کارکرد و کیفیت نقش کلیدی در متن دیده شده است."
          : materialMetric >= 60
            ? "لحن برند قابل‌اجراست اما برای هم‌راستایی بهتر باید اشاره‌های ملموس به کیفیت/دوام/چوب را قوی‌تر کنید."
            : "متن بیشتر روی ادعا و شعار تکیه دارد تا واقعیت طراحی و کیفیت.",
    },
    {
      label: "وضوح پیام",
      score: clarityMetric,
      status: clarityMetric >= 75 ? "strong" : clarityMetric >= 60 ? "needs-improvement" : "weak",
      insight:
        clarityMetric >= 75
          ? "جمله‌بندی تمیز است و ساختار مفهوم‌ها قابل‌فهم است."
          : clarityMetric >= 60
            ? "ساختار مفهوم‌ها خوب است اما نیاز به کوتاه‌سازی و یک پیام محوری دارد."
            : "پیام پیچیده یا پراکنده است؛ یک خط اصلی برای پیام مرکزی اضافه کنید.",
    },
    {
      label: "میزان تطابق ادبیات برند",
      score: vocabMetric,
      status: vocabMetric >= 75 ? "strong" : vocabMetric >= 60 ? "needs-improvement" : "weak",
      insight:
        vocabMetric >= 75
          ? "واژگان انتخاب‌شده با شخصیت آرام و معماری برند هم‌راستا است."
          : vocabMetric >= 60
            ? "می‌توان از واژگان تصویری‌تر و مرتبط‌ با چوب/فضا/ساخت استفاده کرد تا لحن حرفه‌ای‌تر شود."
            : "زبان برند به‌درستی تثبیت نشده؛ از اصطلاحات عمومی تبلیغاتی دوری شود.",
    },
  ];

  const base = Math.round((toneMetric + materialMetric + clarityMetric + vocabMetric) / 4);
  let state: AuditState = "offbrand";
  if (base >= 82) state = "aligned";
  else if (base >= 62) state = "partial";

  const criticalIssues: string[] = [];
  const recommendations: string[] = [];
  const actionPlan: string[] = [];

  if (bannedCount > 0) {
    criticalIssues.push("چند صفت تبلیغاتی بیش از حد در متن دیده شد.");
    recommendations.push("«لوکس/بی‌نظیر/فوق‌العاده» را با جزئیات دقیق محصول یا تجربه جایگزین کنید.");
    actionPlan.push("فهرست ادعاهای غیرضروری را حذف یا کم کنید.");
  }

  if (mandatoryScore < 45) {
    criticalIssues.push("متریال، کیفیت یا ارزش‌های ملموس برند در متن ضعیف آمده.");
    recommendations.push("یک عبارت صریح درباره جنس، بافت، نور، دوام یا کارکرد واقعی اضافه کنید.");
    actionPlan.push("هر جمله را با یک رفرنس ساختی یا کاربردی تقویت کنید.");
  }

  if (clarityMetric < 65) {
    criticalIssues.push("رسالت یا پیام مرکزی متن چندوجهی و پخش است.");
    recommendations.push("هر پاراگراف را روی یک پیام واحد نگه دارید؛ ابتدا واقعیت، سپس احساس، سپس دعوت به اقدام.");
    actionPlan.push("برای هر نسخه یک تیتر یک‌خطی تعریف کنید.");
  }

  if (criticalIssues.length === 0) {
    recommendations.push("برای نسخه نهایی، دو مثال کوتاه عملی (قبل/بعد) اضافه کن تا قابلیت اجرا در تیم بیشتر شود.");
    actionPlan.push("متن را برای مخاطب هدف (صاحب‌خانه آگاه) به یک لحن نزدیک‌تر شخصی‌سازی کن.");
  }

  return {
    state,
    score: base,
    summary:
      state === "aligned"
        ? "متن از نظر هویت صوتی و لحن برند، پایه‌ای هم‌راستا است."
        : state === "partial"
          ? "متن در مسیر درست است اما برای اجرای برند، چند اصلاح هدفمند لازم دارد."
          : "متن نیازمند بازنویسی است تا با هویت «خانه چوب و هنر» هم‌راستا شود.",
    metrics,
    criticalIssues,
    recommendations,
    actionPlan,
    nextStep:
      state === "aligned"
        ? "برای نسخه نهایی، همین لحن را حفظ کنید و برای هر کانال یک نسخه ۸۰-۱۰۰ کلمه‌ای بسازید."
        : "یک نسخه بازنویسی‌شده ۲۵ درصد کوتاه‌تر بنویسید و فقط واژه‌های دقیق و متریال‌محور وارد کنید.",
  };
}

export function formatAuditAsText(result: BrandAuditResult): string {
  const metrics = result.metrics
    .map((metric) => `- ${metric.label}: ${metric.score}/100 — ${metric.insight}`)
    .join("\n");

  const risks = result.criticalIssues.length > 0 ? result.criticalIssues.map((r) => `- ${r}`).join("\n") : "- مورد بحرانی جدی مشاهده نشد";
  const actions = result.actionPlan.map((action) => `- ${action}`).join("\n");
  const suggestions = result.recommendations.map((r) => `- ${r}`).join("\n");

  return [
    `وضعیت ممیزی: ${result.state}`,
    `امتیاز کل: ${result.score}/100`,
    "",
    result.summary,
    "",
    "شاخص‌های ارزیابی:",
    metrics,
    "",
    "نقاط بهبود فوری:",
    risks,
    "",
    "دستورالعمل پیشنهادی:",
    suggestions,
    "",
    "پلن اقدام:",
    actions,
    "",
    `قدم بعدی: ${result.nextStep}`,
  ].join("\n");
}

export function isBrandOrchestratorMode(value: string): value is BrandAgentMode {
  return value === "identity" || value === "ideation" || value === "audit";
}
