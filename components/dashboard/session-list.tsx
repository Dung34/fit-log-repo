"use client";

import { SessionSummaryCard } from "@/components/dashboard/session-summary-card";
import { FitCard } from "@/components/ui/fit-card";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import { getDominantCategory } from "@/lib/utils/activity";
import { useRouter } from "next/navigation";

export function SessionList() {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const getSessionsWithStats = useFitLogStore(
    (state) => state.getSessionsWithStats,
  );
  const getExerciseById = useFitLogStore((state) => state.getExerciseById);
  const sets = useFitLogStore((state) => state.sets);
  const sessionsWithStats = getSessionsWithStats();

  if (!hydrated) {
    return null;
  }

  if (sessionsWithStats.length === 0) {
    return (
      <FitCard>
        <p className="fit-caption text-center">
          Chưa có buổi tập nào. Bấm &quot;Bắt đầu tập hôm nay&quot; để ghi log.
        </p>
      </FitCard>
    );
  }

  return (
    <ul className="space-y-3">
      {sessionsWithStats.map(({ session, stats }) => (
        <li key={session.id}>
          <button
            type="button"
            className="w-full text-left"
            onClick={() => router.push(`/workout/${session.date}`)}
          >
            <SessionSummaryCard
              date={session.date}
              stats={stats}
              category={getDominantCategory(
                session.id,
                sets,
                getExerciseById,
              )}
            />
          </button>
        </li>
      ))}
    </ul>
  );
}
