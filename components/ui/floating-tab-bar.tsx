"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

function HomeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5.5 10.8V20h13V10.8" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M8 3v3M16 3v3" />
      <path d="M4.5 8.5h15" />
      <path d="M6 6h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
      <path d="M8 12h3M8 16h3M13 12h3M13 16h3" />
    </svg>
  );
}

function WorkoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 7h10v10H7z" />
      <path d="M4 12h3M17 12h3M12 4v3M12 17v3" />
    </svg>
  );
}

const TABS = [
  { href: "/", label: "Trang chủ", Icon: HomeIcon },
  { href: "/activity", label: "Hoạt động", Icon: CalendarIcon },
  { href: "/exercises", label: "Bài tập", Icon: WorkoutIcon },
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
                  ? "bg-fit-accent-green text-white shadow-[var(--fit-shadow-card)]"
                  : "text-fit-text-muted",
              )}
            >
              <span className="flex items-center justify-center leading-none">
                <tab.Icon />
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
