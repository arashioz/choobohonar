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

export function scrollToTarget(id: string, offset = -24) {
  const el = document.getElementById(id);
  if (!el) return;

  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset, duration: 1.2 });
    return;
  }

  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
