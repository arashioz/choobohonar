"use client";

import { useState } from "react";
import Image from "next/image";
import { workAreas } from "@/data/workAreas";
import { toFa, cn } from "@/lib/utils";

export default function WorkAreasSection() {
  const [active, setActive] = useState(0);

  return (
    <section id="work-areas" className="relative min-h-screen overflow-hidden bg-forest text-paper">
      <div className="absolute inset-0">
        {workAreas.map((area, i) => (
          <div
            key={area.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-out-expo",
              i === active ? "opacity-100" : "opacity-0"
            )}
          >
            <Image src={area.image} alt={area.label} fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-forest/70" />
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-container flex-col justify-center px-6 py-28 md:px-10 lg:px-16">
        <p className="eyebrow text-peach">حوزه‌های کاری</p>

        <ul className="mt-10 flex flex-col">
          {workAreas.map((area, i) => (
            <li key={area.id} className="border-b border-paper/15">
              <button
                type="button"
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                className="group flex w-full items-center justify-between gap-6 py-5 text-right md:py-7"
              >
                <span className="flex items-baseline gap-5">
                  <span className={cn("font-sans text-lg transition-colors duration-300", i === active ? "text-peach" : "text-paper/55")}>
                    {toFa(`0${i + 1}`)}
                  </span>
                  <span
                    className={cn(
                      "text-[clamp(1.75rem,5vw,4rem)] font-light leading-none tracking-tightest transition-all duration-300 ease-out-expo",
                      i === active ? "translate-x-[-0.5rem] text-paper" : "text-paper/70"
                    )}
                  >
                    {area.label}
                  </span>
                </span>
                <span className={cn("hidden max-w-xs text-sm text-paper/60 transition-opacity duration-300 md:block", i === active ? "opacity-100" : "opacity-0")}>
                  {area.description}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
