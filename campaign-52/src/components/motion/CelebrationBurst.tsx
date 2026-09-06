"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const COLORS = ["#FBBEA6", "#F4EFE8", "#E8DED2", "#C4A574", "#D7C39A", "#135034"];

type Card = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  alpha: number;
  decay: number;
};

function spawn(width: number, height: number, count: number): Card[] {
  const cx = width / 2;
  const cy = height / 2;
  const spread = Math.min(width, height) * 0.18;
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
    const speed = 2.4 + Math.random() * 3.6;
    const tall = Math.random() > 0.45;
    return {
      x: cx + Math.cos(angle) * (8 + Math.random() * spread),
      y: cy + Math.sin(angle) * (8 + Math.random() * spread),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.12,
      w: tall ? 8 + Math.random() * 12 : 16 + Math.random() * 18,
      h: tall ? 20 + Math.random() * 22 : 10 + Math.random() * 12,
      color: COLORS[i % COLORS.length],
      alpha: 0.92,
      decay: 0.0034 + Math.random() * 0.002,
    };
  });
}

export default function CelebrationBurst({ delay = 0 }: { delay?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    const mobile = window.matchMedia("(max-width: 767px)").matches;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let cards: Card[] = [];
    let frame = 0;
    let running = false;
    let started = 0;
    const startTimer = window.setTimeout(() => {
      cards = spawn(canvas.clientWidth, canvas.clientHeight, mobile ? 28 : 40);
      running = true;
      started = performance.now();
      frame = window.requestAnimationFrame(tick);
    }, delay);

    const tick = (now: number) => {
      if (!running) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const c of cards) {
        if (c.alpha <= 0.05) continue;
        alive += 1;
        c.vy += 0.018;
        c.vx *= 0.994;
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.vr;
        c.alpha -= c.decay;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.globalAlpha = c.alpha;
        ctx.fillStyle = c.color;
        const r = Math.min(3, c.w * 0.16);
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") ctx.roundRect(-c.w / 2, -c.h / 2, c.w, c.h, r);
        else ctx.rect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.fill();
        ctx.restore();
      }
      if (now - started < 2800 && alive > 0) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener("resize", resize, { passive: true });
    return () => {
      running = false;
      window.clearTimeout(startTimer);
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [delay]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 h-full w-full [will-change:transform]"
    />
  );
}
