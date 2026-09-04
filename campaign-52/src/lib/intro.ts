const EVENT = "campaign:intro-done";

export function isIntroLocked() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("is-intro");
}

export function pinScrollTop() {
  if (typeof window === "undefined") return;
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
}

export function lockIntro() {
  if (typeof document === "undefined") return;
  document.documentElement.classList.add("is-intro");
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  pinScrollTop();
}

export function unlockIntro() {
  if (typeof document === "undefined") return;
  if (!document.documentElement.classList.contains("is-intro") && document.documentElement.dataset.intro === "done") {
    return;
  }
  document.documentElement.classList.remove("is-intro");
  document.documentElement.dataset.intro = "done";
  pinScrollTop();
  window.dispatchEvent(new Event(EVENT));
  pinScrollTop();
  window.requestAnimationFrame(() => {
    pinScrollTop();
    window.requestAnimationFrame(pinScrollTop);
  });
}

export function afterIntro(fn: () => void) {
  if (typeof window === "undefined") return () => undefined;
  if (!document.documentElement.classList.contains("is-intro")) {
    fn();
    return () => undefined;
  }
  window.addEventListener(EVENT, fn, { once: true });
  return () => window.removeEventListener(EVENT, fn);
}
