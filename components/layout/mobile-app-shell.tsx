"use client";

import { usePathname } from "next/navigation";
import { FloatingTabBar } from "@/components/ui/floating-tab-bar";
import { cn } from "@/lib/utils/cn";

interface MobileAppShellProps {
  children: React.ReactNode;
}

export function MobileAppShell({ children }: MobileAppShellProps) {
  const pathname = usePathname();
  const showTabBar =
    !pathname.startsWith("/workout") && !pathname.startsWith("/~offline");

  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-fit-bg-muted">
      <main className={cn("flex-1", showTabBar && "fit-page-pad")}>
        {children}
      </main>
      {showTabBar && <FloatingTabBar />}
    </div>
  );
}
