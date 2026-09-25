"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { storeKindLabel, type Store } from "@/data/stores";

const VISIBLE = 6;
const FADE_MS = 1100;
const PAUSE_MS = 500;

type Swap = { index: number; id: string; visible: boolean };

export default function ExperienceStoreCycle({ stores }: { stores: Store[] }) {
  const [slots, setSlots] = useState(() => stores.slice(0, VISIBLE).map((store) => store.id));
  const slotsRef = useRef(slots);
  slotsRef.current = slots;
  const [swap, setSwap] = useState<Swap | null>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (stores.length <= VISIBLE || prefersReducedMotion()) return;

    const timers = new Set<number>();
    let frame = 0;
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.add(id);
    };

    const swapOne = () => {
      const current = slotsRef.current;
      const slot = Math.floor(Math.random() * Math.min(VISIBLE, current.length));
      const waiting = stores.map((store) => store.id).filter((id) => !current.includes(id));
      if (!waiting.length) return;
      const next = waiting[Math.floor(Math.random() * waiting.length)];
      setSwap({ index: slot, id: next, visible: false });
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => {
          setSwap((active) => (active && active.index === slot ? { ...active, visible: true } : active));
        });
      });
      later(() => {
        setSettled(true);
        setSlots(current.map((id, index) => (index === slot ? next : id)));
        setSwap(null);
        frame = window.requestAnimationFrame(() => setSettled(false));
        later(swapOne, PAUSE_MS);
      }, FADE_MS);
    };

    later(swapOne, PAUSE_MS);

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
      window.cancelAnimationFrame(frame);
    };
  }, [stores]);

  const byId = new Map(stores.map((store) => [store.id, store]));

  return (
    <ul className="mt-14 divide-y divide-forest/10 border-y border-forest/10">
      {slots.map((id, index) => {
        const store = byId.get(id);
        const incoming = swap?.index === index ? byId.get(swap.id) : null;
        if (!store) return null;
        return (
          <li key={index} className="relative">
            <StoreLine
              store={store}
              className={cn(
                motionClass(settled),
                incoming && swap?.visible ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100",
              )}
            />
            {incoming ? (
              <StoreLine
                store={incoming}
                className={cn(
                  "absolute inset-0",
                  motionClass(settled),
                  swap?.visible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

function motionClass(settled: boolean) {
  return cn(
    "ease-[cubic-bezier(0.45,0,0.2,1)]",
    settled ? "transition-none" : "transition-[opacity,transform] duration-[1100ms]",
  );
}

function StoreLine({ store, className }: { store: Store; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1 bg-paper py-6 md:flex-row md:items-center md:gap-x-6", className)}>
      <p className="shrink-0 truncate whitespace-nowrap text-sm text-brick">
        {storeKindLabel[store.kind]} · {store.city}
      </p>
      <p className="truncate whitespace-nowrap text-xl font-light text-forest md:w-[34%] md:shrink-0" title={store.name}>
        {store.name}
      </p>
      <p className="min-w-0 truncate whitespace-nowrap text-sm leading-7 text-forest/65 md:flex-1" title={store.address}>
        {store.address}
      </p>
    </div>
  );
}
