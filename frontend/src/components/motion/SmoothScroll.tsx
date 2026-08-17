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

/**
 * Lenis smooth scroll bound to the GSAP ticker so ScrollTrigger and Lenis
 * stay perfectly in sync. Disabled entirely when the user prefers reduced motion.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useLayoutEffect(() => {
    registerGsap();
    document.documentElement.classList.add("motion-enabled");

    if (prefersReducedMotion()) {
      registerLenisInstance(null);
      refreshScrollTriggers();
      return () => {
        registerLenisInstance(null);
        document.documentElement.classList.remove("motion-enabled");
      };
    }

    const prefersCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const isMobileViewport = window.matchMedia("(max-width: 1023px)").matches;
    if (prefersCoarsePointer || isMobileViewport) {
      registerLenisInstance(null);
      refreshScrollTriggers();
      return () => {
        registerLenisInstance(null);
        document.documentElement.classList.remove("motion-enabled");
      };
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    enableLenisScroll(lenis);
    registerLenisInstance(lenis);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => refreshScrollTriggers();
    window.addEventListener("load", refresh);
    const t1 = window.setTimeout(refresh, 100);
    const t2 = window.setTimeout(refresh, 600);
    const t3 = window.setTimeout(refresh, 1500);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
      registerLenisInstance(null);
      disableLenisScroll();
      window.removeEventListener("load", refresh);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      document.documentElement.classList.remove("motion-enabled");
    };
  }, []);

  // Recalculate trigger positions after client navigations and layout shifts.
  useEffect(() => {
    registerGsap();
    const t1 = window.setTimeout(refreshScrollTriggers, 50);
    const t2 = window.setTimeout(refreshScrollTriggers, 400);
    const t3 = window.setTimeout(refreshScrollTriggers, 1200);
    const hashTimers = [120, 500, 1300].map((ms) => window.setTimeout(() => scrollToHash(), ms));
    const onHashChange = () => scrollToHash();
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      hashTimers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("hashchange", onHashChange);
    };
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href?.includes("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin || !url.hash) return;

      const current = window.location.pathname.replace(/\/$/, "") || "/";
      const target = url.pathname.replace(/\/$/, "") || "/";
      if (current !== target) return;

      const id = decodeURIComponent(url.hash.slice(1));
      if (!id || !document.getElementById(id)) return;

      event.preventDefault();
      if (window.location.hash !== url.hash) {
        window.history.pushState(null, "", url.hash);
      }
      scrollToTarget(id, 0);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return <>{children}</>;
}
