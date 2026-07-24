import FadeUp from "@/components/motion/FadeUp";
import RevealLine from "@/components/motion/RevealLine";
import { cn } from "@/lib/utils";

type BrandbookSectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
  as?: "h2" | "h3";
  showLine?: boolean;
  className?: string;
};

export default function BrandbookSectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "start",
  as = "h2",
  showLine = true,
  className,
}: BrandbookSectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-right";
  const lineOrigin = align === "center" ? "center" : "right";

  return (
    <header className={cn("mb-10 max-w-3xl md:mb-12", alignClass, className)}>
      {eyebrow && (
        <FadeUp as="span" className="eyebrow text-brick mb-6 block">
          {eyebrow}
        </FadeUp>
      )}

      <FadeUp
        as={as}
        delay={eyebrow ? 0.03 : 0}
        className="font-light tracking-tightest text-balance text-forest text-[clamp(2rem,5vw,4.25rem)] leading-[1.1]"
      >
        {title}
      </FadeUp>

      {subtitle && (
        <FadeUp
          as="p"
          delay={0.06}
          className="mt-5 text-base leading-relaxed text-forest/70 sm:text-lg"
        >
          {subtitle}
        </FadeUp>
      )}

      {showLine && (
        <RevealLine
          className={cn("mt-6 w-12", align === "center" && "mx-auto")}
          origin={lineOrigin}
        />
      )}
    </header>
  );
}
