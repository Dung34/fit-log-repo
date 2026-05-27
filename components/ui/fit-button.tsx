import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface FitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "outline" | "ghost";
  fullWidth?: boolean;
}

export function FitButton({
  children,
  variant = "primary",
  fullWidth = false,
  className,
  ...props
}: FitButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-[var(--fit-radius-pill)] px-6 text-sm font-semibold transition active:opacity-90 disabled:opacity-50",
        fullWidth && "w-full",
        variant === "primary" &&
          "bg-fit-card-dark text-white shadow-[var(--fit-shadow-card)]",
        variant === "outline" &&
          "border border-fit-text/15 bg-fit-bg text-fit-text",
        variant === "ghost" && "bg-transparent text-fit-text",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
