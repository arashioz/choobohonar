"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;
let lenisActive = false;

export function registerGsap() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Shared ScrollTrigger options — must match the Lenis scroller proxy target. */
export function scrollTriggerConfig(
  overrides: ScrollTrigger.Vars = {}
): ScrollTrigger.Vars {
  return {
    scroller: lenisActive ? document.documentElement : undefined,
    invalidateOnRefresh: true,
    ...overrides,
  };
}

type LenisLike = {
  scroll: number;
  scrollTo: (value: number, opts?: { immediate?: boolean }) => void;
  on: (event: "scroll", cb: () => void) => void;
  destroy: () => void;
};

/** Wire Lenis to ScrollTrigger so pin/scrub/reveal triggers track smooth scroll. */
export function enableLenisScroll(lenis: LenisLike) {
  registerGsap();
  lenisActive = true;

  ScrollTrigger.scrollerProxy(document.documentElement, {
    scrollTop(value?: number) {
      if (arguments.length) {
        lenis.scrollTo(value!, { immediate: true });
      }
      return lenis.scroll;
    },
    getBoundingClientRect() {
      return {
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      };
    },
    pinType: document.documentElement.style.transform ? "transform" : "fixed",
  });

  ScrollTrigger.defaults({
    scroller: document.documentElement,
    invalidateOnRefresh: true,
  });

  lenis.on("scroll", ScrollTrigger.update);
}

export function disableLenisScroll() {
  if (typeof window === "undefined") return;
  lenisActive = false;
  ScrollTrigger.scrollerProxy(document.documentElement, {});
  ScrollTrigger.clearScrollMemory();
  ScrollTrigger.defaults({
    scroller: undefined,
    invalidateOnRefresh: true,
  });
}

/** Force-show an element that was hidden for scroll-in animation. */
export function revealElement(el: HTMLElement) {
  el.style.opacity = "1";
  el.style.transform = "none";
  el.dataset.revealed = "true";
  el.classList.add("is-visible");
}

export function isElementHidden(el: HTMLElement): boolean {
  return parseFloat(getComputedStyle(el).opacity) === 0;
}

/** If the element is already in (or near) the viewport, reveal immediately. */
export function revealIfInViewport(el: HTMLElement, threshold = 0.9): boolean {
  const rect = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;
  if (rect.top < vh * threshold && rect.bottom > 0) {
    revealElement(el);
    return true;
  }
  return false;
}

export function scheduleRevealFailsafe(el: HTMLElement, delayMs = 2500): () => void {
  const id = window.setTimeout(() => {
    if (isElementHidden(el)) revealElement(el);
  }, delayMs);
  return () => window.clearTimeout(id);
}

export function refreshScrollTriggers() {
  if (typeof window === "undefined") return;
  registerGsap();
  ScrollTrigger.refresh(true);
}

export { gsap, ScrollTrigger };
