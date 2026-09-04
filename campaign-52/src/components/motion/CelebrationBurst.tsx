"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const COLORS = ["#FBBEA6", "#F4EFE8", "#E8DED2", "#C4A574", "#F9A97B", "#135034", "#9A3110", "#FBBEA6"];

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
  face: string;
  alpha: number;
  decay: number;
  fold: number;
  spinX: number;
};

function spawn(width: number, height: number, count: number, originY = 0): Card[] {
  const cx = width / 2;
  const cy = height / 2 + originY;
  const spread = Math.min(width, height) * 0.28;
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.42;
    const dist = 12 + Math.random() * spread;
    const speed = 4.2 + Math.random() * 7.5;
    const tall = Math.random() > 0.4;
    return {
      x: cx + Math.cos(angle) * dist,
      y: cy + Math.sin(angle) * dist,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3.2,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.22,
      w: tall ? 10 + Math.random() * 16 : 22 + Math.random() * 28,
      h: tall ? 28 + Math.random() * 36 : 14 + Math.random() * 18,
      color: COLORS[i % COLORS.length],
      face: COLORS[(i + 3) % COLORS.length],
      alpha: 0.96,
      decay: 0.0018 + Math.random() * 0.0022,
      fold: 0.45 + Math.random() * 0.4,
      spinX: 0.6 + Math.random() * 0.8,
    };
  });
}

export default function CelebrationBurst({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !active || prefersReducedMotion()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    let cards = spawn(w, h, 64);

    const waves = [
      window.setTimeout(() => {
        cards = cards.concat(spawn(w, h, 48, -h * 0.04));
      }, 160),
      window.setTimeout(() => {
        cards = cards.concat(spawn(w, h, 36, h * 0.06));
      }, 340),
    ];

    let frame = 0;
    let running = true;
    const started = performance.now();

    const tick = (now: number) => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      cards = cards.filter((c) => c.alpha > 0.04);
      for (const c of cards) {
        c.vy += 0.028;
        c.vx *= 0.992;
        c.x += c.vx;
        c.y += c.vy;
        c.rot += c.vr;
        c.alpha -= c.decay;
        const flip = Math.abs(Math.cos(c.rot * c.spinX));
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.scale(1, 0.35 + flip * 0.65);
        ctx.globalAlpha = Math.max(c.alpha, 0);
        ctx.fillStyle = flip > 0.45 ? c.color : c.face;
        paper(ctx, -c.w / 2, -c.h / 2, c.w, c.h, c.fold);
        ctx.fill();
        ctx.restore();
      }
      if (now - started < 5200 && (cards.length > 0 || now - started < 500)) {
        frame = window.requestAnimationFrame(tick);
      }
    };
    frame = window.requestAnimationFrame(tick);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      waves.forEach((id) => window.clearTimeout(id));
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[2] h-full w-full"
    />
  );
}

function paper(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  fold: number,
) {
  ctx.beginPath();
  const r = Math.min(4, w * 0.18);
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y + h * (1 - fold) * 0.08);
  ctx.quadraticCurveTo(x + w, y + h * 0.08, x + w, y + r + h * 0.08);
  ctx.lineTo(x + w * 0.97, y + h - r);
  ctx.quadraticCurveTo(x + w * 0.97, y + h, x + w * 0.97 - r, y + h);
  ctx.lineTo(x + r * 0.6, y + h * 0.96);
  ctx.quadraticCurveTo(x, y + h * 0.94, x, y + h * 0.94 - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
