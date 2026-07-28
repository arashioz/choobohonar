import FadeUp from "@/components/motion/FadeUp";
import RevealLine from "@/components/motion/RevealLine";
import BrandbookContainer from "@/components/brandbook/layout/BrandbookContainer";
import { cn } from "@/lib/utils";

type BrandbookChapterHeaderProps = {
  chapter: string;
  title: string;
  subtitle?: string;
  className?: string;
};

export default function BrandbookChapterHeader({
  chapter,
  title,
  subtitle,
  className,
}: BrandbookChapterHeaderProps) {
  return (
    <div className={cn("relative py-20 md:py-28", className)}>
      <BrandbookContainer className="relative text-center">
        <FadeUp>
          <span className="eyebrow text-brick">{chapter}</span>
        </FadeUp>

        <FadeUp
          as="h2"
          delay={0.05}
          className="mx-auto mt-4 max-w-4xl text-balance font-light tracking-tightest text-forest text-[clamp(2.25rem,5vw,3.75rem)] leading-[1.12]"
        >
          {title}
        </FadeUp>

        {subtitle && (
          <FadeUp
            as="p"
            delay={0.1}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-forest/65 sm:text-lg"
          >
            {subtitle}
          </FadeUp>
        )}

        <FadeUp delay={0.14}>
          <RevealLine className="mx-auto mt-6 w-16" origin="center" />
        </FadeUp>
      </BrandbookContainer>
    </div>
  );
}
