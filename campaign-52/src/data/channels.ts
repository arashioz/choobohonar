export type UtmChannel = {
  id: string;
  labelFa: string;
  source: string;
  medium: string;
  content: string;
  note: string;
  /** Public short path on 52.choobohonar.com — SMS stays on the root. */
  path: string;
};

export const CAMPAIGN_UTM = "52years";

export const utmChannels: UtmChannel[] = [
  {
    id: "sms",
    labelFa: "پیامک",
    source: "sms",
    medium: "sms",
    content: "sms-blast",
    note: "لینک کوتاه ساب‌دامین برای پیامک؛ بدون پارامتر.",
    path: "/",
  },
  {
    id: "telegram",
    labelFa: "تلگرام",
    source: "telegram",
    medium: "social",
    content: "channel-post",
    note: "پست کانال و پیام‌های مستقیم تلگرام.",
    path: "/telegram",
  },
  {
    id: "instagram",
    labelFa: "اینستاگرام",
    source: "instagram",
    medium: "social",
    content: "bio-story",
    note: "بایو، استوری و پست‌های اسپانسر.",
    path: "/instagram",
  },
  {
    id: "linkedin",
    labelFa: "لینکدین",
    source: "linkedin",
    medium: "social",
    content: "organic-post",
    note: "پست سازمانی و پیام اینباکس لینکدین.",
    path: "/linkedin",
  },
  {
    id: "yektanet",
    labelFa: "یکتانت",
    source: "yektanet",
    medium: "cpc",
    content: "display-native",
    note: "کمپین کلیکی نمایشی و نیتیو.",
    path: "/yektanet",
  },
  {
    id: "aparat",
    labelFa: "آپارات",
    source: "aparat",
    medium: "video",
    content: "video-description",
    note: "توضیحات ویدیو و بنر کانال آپارات.",
    path: "/aparat",
  },
];

export type UtmState = {
  source: string;
  medium: string;
  campaign: string;
  content: string;
  term: string;
  channel: string;
};

export function campaignOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://52.choobohonar.com").replace(/\/$/, "");
}

export function buildCampaignUrl(channel: UtmChannel, extra?: Record<string, string>) {
  const url = new URL(campaignOrigin());
  url.searchParams.set("utm_source", channel.source);
  url.searchParams.set("utm_medium", channel.medium);
  url.searchParams.set("utm_campaign", CAMPAIGN_UTM);
  url.searchParams.set("utm_content", channel.content);
  url.searchParams.set("ch", channel.id);
  if (extra) {
    Object.entries(extra).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });
  }
  return url.toString();
}

/** Short public URL for ads and SMS. SMS is the bare subdomain. */
export function buildShortUrl(channel: UtmChannel) {
  const origin = campaignOrigin();
  if (channel.id === "sms") return `${origin}/`;
  return `${origin}${channel.path}`;
}

export function parseUtm(search: string): UtmState {
  const params = new URLSearchParams(search);
  const source = params.get("utm_source") || "";
  const channelFromQuery = params.get("ch") || "";
  const matched = utmChannels.find((item) => item.source === source || item.id === channelFromQuery);
  return {
    source,
    medium: params.get("utm_medium") || "",
    campaign: params.get("utm_campaign") || CAMPAIGN_UTM,
    content: params.get("utm_content") || "",
    term: params.get("utm_term") || "",
    channel: matched?.id || channelFromQuery || source,
  };
}

export const smsDefaultUtm: UtmState = {
  source: "sms",
  medium: "sms",
  campaign: CAMPAIGN_UTM,
  content: "sms-blast",
  term: "",
  channel: "sms",
};

export const UTM_STORAGE_KEY = "ch52-utm";
