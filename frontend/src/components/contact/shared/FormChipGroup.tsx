"use client";

import { cn } from "@/lib/utils";

export default function FormChipGroup({
  label,
  name,
  required,
  value,
  onChange,
  options,
  error,
  columns = 2,
}: {
  label: string;
  name: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  error?: string;
  columns?: 2 | 3 | 4 | 5;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2.5 text-sm text-forest/70">
        {label}
        {required ? <span className="text-brick"> *</span> : null}
      </legend>
      <div
        className={cn(
          "grid gap-2",
          columns === 2 && "grid-cols-2",
          columns === 3 && "grid-cols-2 sm:grid-cols-3",
          columns === 4 && "grid-cols-2 sm:grid-cols-4",
          columns === 5 && "grid-cols-2 sm:grid-cols-5",
        )}
        role="radiogroup"
        aria-label={label}
      >
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <label
              key={opt}
              className={cn(
                "cursor-pointer rounded-sm border px-3 py-2.5 text-center text-sm transition-all duration-200",
                selected
                  ? "border-forest bg-forest text-paper"
                  : "border-forest/12 bg-paper text-forest/75 hover:border-forest/30",
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt}
                checked={selected}
                onChange={() => onChange(opt)}
                className="sr-only"
              />
              {opt}
            </label>
          );
        })}
      </div>
      {error ? <span className="mt-1.5 block text-xs text-brick">{error}</span> : null}
    </fieldset>
  );
}
