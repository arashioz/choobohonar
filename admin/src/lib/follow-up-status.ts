/** Keep keys aligned with backend/src/common/follow-up-status.ts. */
export const FOLLOW_UP_STATUSES = [
  "new",
  "reviewed",
  "contacted",
  "follow_up",
  "quoted",
  "final_payment",
  "settled",
  "lost",
  "archived",
] as const;

export type FollowUpStatus = (typeof FOLLOW_UP_STATUSES)[number];

export const FOLLOW_UP_STATUS_LABELS: Record<FollowUpStatus, string> = {
  new: "جدید",
  reviewed: "بررسی شد",
  contacted: "تماس با مشتری",
  follow_up: "پیگیری",
  quoted: "پیش‌فاکتور صادر شد",
  final_payment: "پرداخت نهایی",
  settled: "تصویه",
  lost: "ناموفق",
  archived: "بایگانی",
};

export function followUpLabel(value?: string | null) {
  if (value === "read") return FOLLOW_UP_STATUS_LABELS.reviewed;
  if (value && value in FOLLOW_UP_STATUS_LABELS) {
    return FOLLOW_UP_STATUS_LABELS[value as FollowUpStatus];
  }
  return FOLLOW_UP_STATUS_LABELS.new;
}
