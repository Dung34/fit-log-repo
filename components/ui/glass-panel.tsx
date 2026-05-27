import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

export function GlassPanel({ children, className }: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-t-3xl border border-white/60 bg-white/90 shadow-[0_-8px_32px_rgb(0_0_0/0.08)] backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
