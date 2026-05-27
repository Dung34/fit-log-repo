import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface FitCardProps {
  children: ReactNode;
  variant?: "default" | "dark";
  className?: string;
  onClick?: () => void;
}

export function FitCard({
  children,
  variant = "default",
  className,
  onClick,
}: FitCardProps) {
  const Component = onClick ? "button" : "div";

  return (
    <Component
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "w-full rounded-[var(--fit-radius-card)] p-4 text-left transition active:scale-[0.99]",
        variant === "default" &&
          "bg-fit-bg text-fit-text shadow-[var(--fit-shadow-card)]",
        variant === "dark" && "bg-fit-card-dark text-white",
        onClick && "cursor-pointer",
        className,
      )}
    >
      {children}
    </Component>
  );
}
