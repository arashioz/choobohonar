import { cn } from "@/lib/utils";
import { toFa } from "@/lib/utils";

type Step = { id: string; label: string };

export default function FormProgress({
  steps,
  currentIndex,
  className,
}: {
  steps: Step[];
  currentIndex: number;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center gap-1.5">
        {steps.map((step, i) => (
          <span
            key={step.id}
            title={step.label}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === currentIndex ? "w-6 bg-forest" : i < currentIndex ? "w-1.5 bg-forest/50" : "w-1.5 bg-forest/15",
            )}
          />
        ))}
      </div>
      <span className="text-xs text-forest/50">
        {steps[currentIndex]?.label} · {toFa(currentIndex + 1)}/{toFa(steps.length)}
      </span>
    </div>
  );
}
