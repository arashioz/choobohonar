import FadeUp from "@/components/motion/FadeUp";
import RevealLine from "@/components/motion/RevealLine";
import { cn } from "@/lib/utils";

type BrandbookSectionDividerProps = {
  number: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  className?: string;
};

export default function BrandbookSectionDivider({
  number,
  title,
  subtitle,
  align = "center",
  className,
}: BrandbookSectionDividerProps) {
  const centered = align === "center";

  return (
    <FadeUp>
      <div
        className={cn(
          "mb-10 md:mb-12",
          centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl text-right",
          className,
        )}
      >
        <span className="eyebrow text-brick">{number}</span>
        <h3 className="mt-2 text-2xl font-light tracking-tightest text-forest sm:text-3xl">
          {title}
        </h3>
        {subtitle && (
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed text-forest/60",
              centered && "mx-auto max-w-2xl",
            )}
          >
            {subtitle}
          </p>
        )}
        <RevealLine
          className={cn("mt-4 w-12", centered && "mx-auto")}
          origin={centered ? "center" : "right"}
        />
      </div>
    </FadeUp>
  );
}
