"use client";

import { Preloader } from "konsta/react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FitButton } from "@/components/ui/fit-button";
import { FitCard } from "@/components/ui/fit-card";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import {
  countSessionsThisWeek,
  getWeeklyVolumeByDay,
} from "@/lib/utils/activity";
import { formatDate, todayISO } from "@/lib/utils/date";
import { calcSessionStats } from "@/lib/utils/volume";
import { cn } from "@/lib/utils/cn";

export function ActivityPage() {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const sessions = useFitLogStore((state) => state.sessions);
  const sets = useFitLogStore((state) => state.sets);
  const [selectedDate, setSelectedDate] = useState(todayISO());

  const weekDays = useMemo(
    () => getWeeklyVolumeByDay(sessions, sets),
    [sessions, sets],
  );

  const maxVolume = useMemo(
    () => Math.max(...weekDays.map((day) => day.volume), 1),
    [weekDays],
  );

  const selectedSession = sessions.find((s) => s.date === selectedDate);
  const selectedStats = selectedSession
    ? calcSessionStats(selectedSession.id, sets)
    : null;

  const sessionsThisWeek = countSessionsThisWeek(sessions, sets);

  const sessionDates = useMemo(
    () =>
      [...sessions]
        .filter((session) =>
          sets.some((set) => set.sessionId === session.id),
        )
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((s) => s.date),
    [sessions, sets],
  );

  const scrollDates = useMemo(() => {
    const dateSet = new Set(sessionDates);
    dateSet.add(todayISO());
    return [...dateSet].sort((a, b) => b.localeCompare(a));
  }, [sessionDates]);

  if (!hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Preloader />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-fit-bg-muted px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4">
      <header className="mb-6">
        <h1 className="fit-h1">Hoạt động</h1>
        <p className="fit-caption mt-1">Theo dõi volume và buổi tập</p>
      </header>

      <section className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {scrollDates.map((date) => {
            const isToday = date === todayISO();
            const active = date === selectedDate;

            return (
              <button
                key={date}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "shrink-0 rounded-[var(--fit-radius-pill)] px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-fit-card-dark text-white"
                    : "bg-fit-bg text-fit-text shadow-[var(--fit-shadow-card)]",
                )}
              >
                {isToday ? "Hôm nay" : formatDate(date)}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mb-6 grid grid-cols-2 gap-3">
        <FitCard>
          <p className="fit-caption">Volume</p>
          <p className="mt-1 text-2xl font-semibold text-fit-accent-green">
            {(selectedStats?.totalVolume ?? 0).toLocaleString("vi-VN")}
            <span className="text-sm font-normal text-fit-text-muted"> kg</span>
          </p>
        </FitCard>
        <FitCard>
          <p className="fit-caption">Sets</p>
          <p className="mt-1 text-2xl font-semibold text-fit-text">
            {selectedStats?.setCount ?? 0}
          </p>
        </FitCard>
        <FitCard>
          <p className="fit-caption">Số bài</p>
          <p className="mt-1 text-2xl font-semibold text-fit-text">
            {selectedStats?.exerciseCount ?? 0}
          </p>
        </FitCard>
        <FitCard>
          <p className="fit-caption">Buổi tuần này</p>
          <p className="mt-1 text-2xl font-semibold text-fit-accent-purple">
            {sessionsThisWeek}
          </p>
        </FitCard>
      </section>

      <FitCard className="mb-6 flex items-center justify-between gap-3 !py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl" aria-hidden>
            👑
          </span>
          <p className="fit-body font-medium">
            Đã hoàn thành {sessionsThisWeek} buổi tuần này
          </p>
        </div>
        <FitButton
          variant="primary"
          className="!min-h-9 shrink-0 !px-4 !py-1.5 !text-xs"
          onClick={() => router.push(`/workout/${selectedDate}`)}
        >
          Chi tiết
        </FitButton>
      </FitCard>

      <section>
        <h2 className="fit-h2 mb-3">Statistic</h2>
        <FitCard>
          <div className="flex h-40 items-end justify-between gap-1">
            {weekDays.map((day) => {
              const height =
                day.volume > 0
                  ? Math.max(12, (day.volume / maxVolume) * 100)
                  : 8;

              return (
                <div
                  key={day.date}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  {day.isToday && day.volume > 0 && (
                    <span className="fit-caption text-[10px] font-medium text-fit-accent-green">
                      {day.volume.toLocaleString("vi-VN")}
                    </span>
                  )}
                  <div
                    className={cn(
                      "w-full max-w-[2rem] rounded-t-lg transition-all",
                      day.isToday ? "bg-fit-accent-green" : "bg-fit-accent-purple/70",
                    )}
                    style={{ height: `${height}%` }}
                    title={`${day.volume} kg`}
                  />
                  <span
                    className={cn(
                      "fit-caption text-[10px]",
                      day.isToday && "font-semibold text-fit-text",
                    )}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </FitCard>
      </section>
    </div>
  );
}
