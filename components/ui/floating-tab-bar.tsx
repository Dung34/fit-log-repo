"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const TABS = [
  { href: "/", label: "Trang chủ", icon: "⌂" },
  { href: "/activity", label: "Hoạt động", icon: "▦" },
  { href: "/exercises", label: "Bài tập", icon: "⚡" },
] as const;

export function FloatingTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      aria-label="Điều hướng chính"
    >
      <div className="pointer-events-auto flex w-full max-w-lg items-center justify-around rounded-t-3xl border border-black/5 bg-fit-bg px-2 py-2 shadow-[0_-4px_24px_rgb(0_0_0/0.1)]">
        {TABS.map((tab) => {
          const active =
            tab.href === "/"
              ? pathname === "/"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex min-h-11 min-w-[4.5rem] flex-col items-center justify-center gap-0.5 rounded-2xl px-3 py-1.5 text-xs font-medium transition",
                active
                  ? "bg-fit-card-dark text-white"
                  : "text-fit-text-muted",
              )}
            >
              <span className="text-lg leading-none" aria-hidden>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
