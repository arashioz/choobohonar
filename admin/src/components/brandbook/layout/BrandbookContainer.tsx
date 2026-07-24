import { cn } from "@/lib/utils";

type BrandbookContainerProps = {
  children: React.ReactNode;
  className?: string;
  /** Reserve space for the fixed chapter navigation on md+ */
  clearNav?: boolean;
};

export const brandbookContainerClass =
  "mx-auto max-w-[1600px] px-5 sm:px-6 md:px-10 lg:pl-16 lg:pr-24 xl:pr-28";

export default function BrandbookContainer({
  children,
  className,
  clearNav = true,
}: BrandbookContainerProps) {
  return (
    <div
      className={cn(
        brandbookContainerClass,
        !clearNav && "lg:pr-16 xl:pr-16",
        className,
      )}
    >
      {children}
    </div>
  );
}
