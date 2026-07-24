import { cn } from "@/lib/utils";

export const FORM_ENABLED = false;

export function fieldClass(hasError: boolean) {
  return cn(
    "w-full border-b bg-transparent py-2.5 text-forest placeholder:text-forest/55 transition-colors focus:outline-none",
    hasError ? "border-brick" : "border-forest/25 focus:border-forest",
  );
}

export function validatePhone(value: string): boolean {
  return /^[0-9\u06F0-\u06F9+\-\s]{7,}$/.test(value);
}

export function validateEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function required(value: string): boolean {
  return value.trim().length > 0;
}
