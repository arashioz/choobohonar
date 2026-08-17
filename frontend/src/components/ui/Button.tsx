"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  variant?: ButtonVariant;
  as?: "a" | "button";
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  children: React.ReactNode;
  showArrow?: boolean;
  target?: string;
  rel?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

const variantBase: Record<ButtonVariant, string> = {
  primary: "bg-forest",
  secondary: "border border-forest/25",
};

const fillColor: Record<ButtonVariant, string> = {
  primary: "bg-peach",
  secondary: "bg-forest",
};

const labelColor: Record<ButtonVariant, string> = {
  primary: "text-paper group-hover:text-forest group-focus-visible:text-forest",
  secondary: "text-forest group-hover:text-paper group-focus-visible:text-paper",
};

/**
 * Shared CTA. Motion is CSS-only: buttons remain immediately usable and we do
 * not allocate a ScrollTrigger for every control rendered on a page.
 */
export default function Button({
  variant = "primary",
  as = "a",
  href,
  type = "button",
  className,
  children,
  showArrow = false,
  target,
  rel,
  disabled = false,
  onClick,
}: ButtonProps) {
  const classes = cn(
    "group relative inline-flex min-h-12 select-none items-center justify-center gap-2 overflow-hidden rounded-xl px-7 py-4 text-sm font-medium",
    "transition-[transform,opacity,border-color] duration-300 ease-out-expo active:scale-[0.985]",
    "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-45 disabled:active:scale-100",
    variantBase[variant],
    className,
  );

  const inner = (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 origin-right scale-x-0 transition-transform duration-500 ease-out-expo",
          "group-hover:scale-x-100 group-focus-visible:scale-x-100",
          fillColor[variant],
        )}
      />
      <span
        className={cn(
          "relative z-10 inline-flex items-center gap-2 transition-colors duration-500 ease-out-expo",
          labelColor[variant],
        )}
      >
        {children}
        {showArrow ? (
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 ease-out-expo group-hover:-translate-x-1 group-focus-visible:-translate-x-1"
          >
            ←
          </span>
        ) : null}
      </span>
    </>
  );

  if (as === "button") {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        className={classes}
      >
        {inner}
      </button>
    );
  }

  if (!href) return null;

  const anchorProps = {
    target,
    rel,
    onClick: onClick as React.MouseEventHandler<HTMLAnchorElement>,
    className: classes,
  };

  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...anchorProps}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={href} {...anchorProps}>
      {inner}
    </a>
  );
}
