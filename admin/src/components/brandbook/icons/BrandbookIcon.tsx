import { cn } from "@/lib/utils";

export type BrandbookIconProps = {
  className?: string;
  size?: number;
  strokeWidth?: number;
};

type IconRootProps = BrandbookIconProps &
  React.SVGProps<SVGSVGElement> & {
    children: React.ReactNode;
  };

export function BrandbookIcon({
  className,
  size = 24,
  strokeWidth = 1.25,
  children,
  ...props
}: IconRootProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

export type BrandbookIconComponent = (props: BrandbookIconProps) => React.JSX.Element;
