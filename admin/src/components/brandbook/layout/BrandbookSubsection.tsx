import { cn } from "@/lib/utils";
import BrandbookContainer from "./BrandbookContainer";

export const brandbookSectionSpacing = "py-20 md:py-28";
export const brandbookSectionHeaderSpacing = "mb-10 md:mb-12";

type BrandbookSubsectionProps = {
  id?: string;
  tone?: "default" | "tinted" | "accent" | "dark";
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
};

const toneClasses = {
  default: "",
  tinted: "bg-forest/[0.02]",
  accent: "bg-peach/10",
  dark: "bg-forest text-paper",
} as const;

export default function BrandbookSubsection({
  id,
  tone = "default",
  children,
  className,
  containerClassName,
}: BrandbookSubsectionProps) {
  return (
    <section
      id={id}
      className={cn(brandbookSectionSpacing, toneClasses[tone], className)}
    >
      <BrandbookContainer className={containerClassName}>{children}</BrandbookContainer>
    </section>
  );
}
