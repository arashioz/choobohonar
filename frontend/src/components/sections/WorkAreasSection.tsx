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
            aria-hidden={i !== active}
            className={cn(
              "absolute inset-0 transition-[opacity,transform] duration-[1400ms] ease-out-expo motion-reduce:transform-none",
              i === active ? "scale-100 opacity-100" : "scale-[1.045] opacity-0"
            )}
          >
            <Image src={area.image} alt="" fill sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-forest/75" />
            <div className="absolute inset-0 bg-gradient-to-l from-forest/90 via-transparent to-forest/50" />
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
                aria-pressed={i === active}
                aria-controls={`work-area-${area.id}`}
                className="group relative flex w-full items-start justify-between gap-6 py-5 text-right md:items-center md:py-7"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-y-0 right-0 w-px origin-bottom bg-peach transition-transform duration-500 ease-out-expo",
                    i === active ? "scale-y-100" : "scale-y-0",
                  )}
                />
                <span className="flex min-w-0 flex-1 items-baseline gap-4 pr-4 sm:gap-5">
                  <span className={cn("font-sans text-lg transition-colors duration-300", i === active ? "text-peach" : "text-paper/55")}>
                    {toFa(`0${i + 1}`)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={cn(
                        "block text-[clamp(1.75rem,5vw,4rem)] font-light leading-none tracking-tightest transition-[transform,color] duration-500 ease-out-expo",
                        i === active ? "-translate-x-2 text-paper" : "text-paper/70",
                      )}
                    >
                      {area.label}
                    </span>
                    <span
                      id={`work-area-${area.id}`}
                      className={cn(
                        "grid text-sm leading-7 text-paper/65 transition-[grid-template-rows,opacity] duration-500 ease-out-expo md:hidden",
                        i === active ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <span className="overflow-hidden">{area.description}</span>
                    </span>
                  </span>
                </span>
                <span className={cn("hidden max-w-xs text-sm leading-7 text-paper/60 transition-[opacity,transform] duration-500 md:block", i === active ? "translate-x-0 opacity-100" : "translate-x-3 opacity-0")}>
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
