type LenisLike = {
  stop: () => void;
  start: () => void;
  scrollTo: (
    target: HTMLElement | string | number,
    options?: { offset?: number; duration?: number; immediate?: boolean },
  ) => void;
};

let lenisInstance: LenisLike | null = null;

export function registerLenisInstance(instance: LenisLike | null) {
  lenisInstance = instance;
}

export function setMenuScrollLocked(locked: boolean) {
  lenisInstance?.[locked ? "stop" : "start"]();
}

export function scrollToTarget(id: string, offset = 0) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset, duration: 1.15 });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
}

export function scrollToHash(hash = typeof window === "undefined" ? "" : window.location.hash) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return;
  scrollToTarget(id, 0);
}
