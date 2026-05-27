"use client";

import { Preloader } from "konsta/react";
import { ProgressHeroCard } from "@/components/dashboard/progress-hero-card";
import { SessionList } from "@/components/dashboard/session-list";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";

export function DashboardPage() {
  const hydrated = useStoreHydrated();

  return (
    <div className="min-h-full bg-fit-bg-muted px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
      <header className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="fit-caption">Welcome back</p>
          <h1 className="fit-h1">Xin chào, Dũng</h1>
        </div>
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fit-accent-blue/30 text-lg font-semibold text-fit-card-dark"
          aria-hidden
        >
          D
        </div>
      </header>

      <section className="mb-6">
        <ProgressHeroCard />
      </section>

      <section>
        <h2 className="fit-h2 mb-3">Lịch sử tập</h2>
        {!hydrated ? (
          <div className="flex justify-center py-12">
            <Preloader />
          </div>
        ) : (
          <SessionList />
        )}
      </section>
    </div>
  );
}
