"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import {
  registerGsap,
  gsap,
  prefersReducedMotion,
  refreshScrollTriggers,
  enableLenisScroll,
  disableLenisScroll,
} from "@/lib/gsap";
import { registerLenisInstance, scrollToHash, scrollToTarget } from "@/lib/lenis-control";
import { afterIntro, isIntroLocked, lockIntro, pinScrollTop, unlockIntro } from "@/lib/intro";

const IGNORE_HASH = new Set(["", "top", "main-content"]);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    lockIntro();
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    registerGsap();
    document.documentElement.classList.add("motion-enabled");
    const unlockTimer = window.setTimeout(() => {
      if (isIntroLocked()) unlockIntro();
    }, 5600);

    if (prefersReducedMotion()) {
      registerLenisInstance(null);
      const off = afterIntro(() => {
        pinScrollTop();
        refreshScrollTriggers();
      });
      return () => {
        off();
        window.clearTimeout(unlockTimer);
        registerLenisInstance(null);
        document.documentElement.classList.remove("motion-enabled");
      };
    }

    const prefersCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;
    if (prefersCoarsePointer || isMobileViewport) {
      registerLenisInstance(null);
      const off = afterIntro(() => {
        pinScrollTop();
        refreshScrollTriggers();
        requestAnimationFrame(pinScrollTop);
      });
      return () => {
        off();
        window.clearTimeout(unlockTimer);
        registerLenisInstance(null);
        document.documentElement.classList.remove("motion-enabled");
      };
    }

    const lenis = new Lenis({
      lerp: 0.14,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    enableLenisScroll(lenis);
    registerLenisInstance(lenis);
    if (isIntroLocked()) lenis.stop();

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(500, 33);

    const off = afterIntro(() => {
      pinScrollTop();
      lenis.scrollTo(0, { immediate: true });
      lenis.start();
      refreshScrollTriggers();
      requestAnimationFrame(pinScrollTop);
    });

    return () => {
      off();
      window.clearTimeout(unlockTimer);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      registerLenisInstance(null);
      disableLenisScroll();
      document.documentElement.classList.remove("motion-enabled");
    };
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      if (isIntroLocked()) return;
      const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      if (!IGNORE_HASH.has(id)) scrollToHash();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const id = decodeURIComponent(href.slice(1));
      if (!id || !document.getElementById(id)) return;
      event.preventDefault();
      if (isIntroLocked()) return;
      if (window.location.hash !== href) window.history.pushState(null, "", href);
      scrollToTarget(id, 0);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <>{children}</>;
}
