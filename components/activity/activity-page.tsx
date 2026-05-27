"use client";

import { Preloader } from "konsta/react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
} as const;

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full bg-fit-bg-muted px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4"
    >
      <motion.header variants={itemVariants} className="mb-6">
        <h1 className="fit-display">Hoạt động</h1>
        <p className="fit-caption mt-1">Theo dõi volume và buổi tập</p>
      </motion.header>

      <motion.section variants={itemVariants} className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {scrollDates.map((date) => {
            const isToday = date === todayISO();
            const active = date === selectedDate;

            return (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                key={date}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "shrink-0 rounded-[var(--fit-radius-pill)] px-4 py-2 fit-caption !font-medium transition cursor-pointer shadow-sm",
                  active
                    ? "bg-fit-accent-green !text-white"
                    : "bg-fit-bg !text-fit-text border border-black/5",
                )}
              >
                {isToday ? "Hôm nay" : formatDate(date)}
              </motion.button>
            );
          })}
        </div>
      </motion.section>

      <motion.section variants={itemVariants} className="mb-6 grid grid-cols-2 gap-4">
        {/* Bento Stats Block: Volume Hero (Dominant Metric) */}
        <motion.div 
          whileHover={{ scale: 1.01, y: -2 }}
          whileTap={{ scale: 0.99, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="col-span-2 relative overflow-hidden rounded-[var(--fit-radius-card)] bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-5 text-white shadow-md border border-white/5 cursor-pointer"
        >
          <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-fit-accent-green/10 blur-2xl" />
          <p className="fit-caption uppercase tracking-wider !text-white/50">Volume Tích Lũy Ngày</p>
          <p className="mt-2 fit-display !text-fit-accent-green font-mono-numbers leading-none">
            {(selectedStats?.totalVolume ?? 0).toLocaleString("vi-VN")}
            <span className="fit-body !text-white/60 ml-1">kg</span>
          </p>
          <div className="mt-3 flex items-center gap-1.5 fit-caption !text-white/60">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-fit-accent-green animate-pulse" />
            <span>Ngày: {formatDate(selectedDate)}</span>
          </div>
        </motion.div>

        {/* Bento Stats Column 1: Sets count */}
        <motion.div
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985, y: 0 }}
          transition={{ type: "spring", stiffness: 450, damping: 24 }}
          className="col-span-1"
        >
          <FitCard className="border border-black/5 bg-fit-bg p-4 shadow-sm flex flex-col justify-between min-h-[96px]">
            <p className="fit-caption uppercase tracking-wider">Hiệp tập (Sets)</p>
            <p className="mt-2 fit-title font-mono-numbers leading-none">
              {selectedStats?.setCount ?? 0}
              <span className="fit-caption ml-0.5"> sets</span>
            </p>
          </FitCard>
        </motion.div>

        {/* Bento Stats Column 2: Exercise count */}
        <motion.div
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.985, y: 0 }}
          transition={{ type: "spring", stiffness: 450, damping: 24 }}
          className="col-span-1"
        >
          <FitCard className="border border-black/5 bg-fit-bg p-4 shadow-sm flex flex-col justify-between min-h-[96px]">
            <p className="fit-caption uppercase tracking-wider">Số bài tập</p>
            <p className="mt-2 fit-title font-mono-numbers leading-none">
              {selectedStats?.exerciseCount ?? 0}
              <span className="fit-caption ml-0.5"> bài</span>
            </p>
          </FitCard>
        </motion.div>

        {/* Bento Stats Banner: Streak & Weekly session counter */}
        <div className="col-span-2 relative overflow-hidden rounded-[var(--fit-radius-card)] bg-gradient-to-r from-fit-accent-blue/10 via-fit-accent-purple/10 to-fit-accent-green/10 border border-fit-accent-blue/15 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm text-lg">
              🏆
            </div>
            <div>
              <p className="fit-caption uppercase tracking-wider !text-fit-accent-blue font-bold">Mục tiêu tuần</p>
              <p className="fit-body font-bold">
                Đã hoàn thành <span className="fit-title font-mono-numbers !text-fit-accent-blue">{sessionsThisWeek}</span> buổi tập
              </p>
            </div>
          </div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <FitButton
              variant="ghost"
              className="!min-h-9 shrink-0 !px-4 !py-1.5 fit-caption !font-bold !bg-fit-card-dark !text-white hover:!bg-slate-800 border-0 shadow-sm cursor-pointer"
              onClick={() => router.push(`/workout/${selectedDate}`)}
            >
              Chi tiết
            </FitButton>
          </motion.div>
        </div>
      </motion.section>

      <motion.section variants={itemVariants}>
        <h2 className="fit-title mb-3">Thống kê tuần này</h2>
        <FitCard className="border border-black/5 shadow-sm">
          <div className="flex h-44 items-end justify-between gap-2 px-1 pt-4">
            {weekDays.map((day, index) => {
              const height =
                day.volume > 0
                  ? Math.max(12, (day.volume / maxVolume) * 100)
                  : 8;

              return (
                <div
                  key={day.date}
                  className="flex flex-1 flex-col items-center gap-1.5"
                >
                  <div className="h-6 flex items-end justify-center">
                    {day.volume > 0 && (
                      <span className={cn(
                        "fit-caption font-mono-numbers font-bold",
                        day.isToday ? "!text-fit-accent-green" : "!text-fit-text-muted/80"
                      )}>
                        {day.volume >= 1000 ? `${(day.volume / 1000).toFixed(1)}k` : day.volume}
                      </span>
                    )}
                  </div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ type: "spring", stiffness: 180, damping: 20, delay: index * 0.05 }}
                    className={cn(
                      "w-full max-w-[1.25rem] rounded-full transition-all duration-300 cursor-pointer",
                      day.isToday
                        ? "bg-gradient-to-t from-fit-accent-green/80 to-fit-accent-green shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                        : "bg-slate-200/80 hover:bg-slate-300"
                    )}
                    title={`${day.volume} kg`}
                  />
                  <span
                    className={cn(
                      "fit-caption tracking-wide",
                      day.isToday ? "font-bold !text-fit-accent-green" : ""
                    )}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </FitCard>
      </motion.section>
    </motion.div>
  );
}
