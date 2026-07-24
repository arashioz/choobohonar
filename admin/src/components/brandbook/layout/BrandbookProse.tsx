import { cn } from "@/lib/utils";

type BrandbookProseProps = {
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center";
  width?: "narrow" | "medium";
};

export default function BrandbookProse({
  children,
  className,
  align = "start",
  width = "narrow",
}: BrandbookProseProps) {
  return (
    <div
      className={cn(
        width === "narrow" ? "max-w-3xl" : "max-w-4xl",
        align === "center" ? "mx-auto text-center" : "text-right",
        className,
      )}
    >
      {children}
    </div>
  );
}
