"use client";

import { Block } from "konsta/react";
import { SessionSummaryCard } from "@/components/dashboard/session-summary-card";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import { useRouter } from "next/navigation";

export function SessionList() {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const getSessionsWithStats = useFitLogStore(
    (state) => state.getSessionsWithStats,
  );
  const sessionsWithStats = getSessionsWithStats();

  if (!hydrated) {
    return null;
  }

  if (sessionsWithStats.length === 0) {
    return (
      <Block strong inset>
        <p className="text-center text-black/60 dark:text-white/60">
          Chưa có buổi tập nào. Bấm &quot;Bắt đầu tập hôm nay&quot; để ghi log.
        </p>
      </Block>
    );
  }

  return (
    <Block strong inset className="space-y-3">
      {sessionsWithStats.map(({ session, stats }) => (
        <button
          key={session.id}
          type="button"
          className="w-full text-left"
          onClick={() => router.push(`/workout/${session.date}`)}
        >
          <SessionSummaryCard date={session.date} stats={stats} />
        </button>
      ))}
    </Block>
  );
}
