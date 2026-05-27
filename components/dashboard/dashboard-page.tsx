"use client";

import { Preloader } from "konsta/react";
import { motion } from "framer-motion";
import { ProgressHeroCard } from "@/components/dashboard/progress-hero-card";
import { SessionList } from "@/components/dashboard/session-list";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
      damping: 24,
    },
  },
} as const;

export function DashboardPage() {
  const hydrated = useStoreHydrated();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full bg-fit-bg-muted px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4"
    >
      <motion.header variants={itemVariants} className="mb-8 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="fit-caption inline-flex rounded-[var(--fit-radius-pill)] bg-fit-accent-yellow/15 px-2.5 py-0.5 uppercase tracking-wider !text-fit-accent-yellow font-bold text-[10px]">
              ⚡ Streak 5 ngày
            </span>
            <span className="fit-caption inline-flex rounded-[var(--fit-radius-pill)] bg-fit-accent-green/15 px-2.5 py-0.5 uppercase tracking-wider !text-fit-accent-green font-bold text-[10px]">
              Hội viên
            </span>
          </div>
          <p className="fit-caption uppercase tracking-wider">Chào mừng trở lại</p>
          <h1 className="fit-display mt-0.5">Xin chào, Dũng</h1>
        </div>
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-fit-accent-purple via-fit-accent-blue to-fit-accent-green p-[2px] shadow-sm transition cursor-pointer"
          aria-hidden
        >
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-fit-bg text-sm font-bold text-fit-text">
            D
          </div>
        </motion.div>
      </motion.header>

      <motion.section variants={itemVariants} className="mb-6">
        <ProgressHeroCard />
      </motion.section>

      <motion.section variants={itemVariants}>
        <h2 className="fit-title mb-3">Lịch sử tập</h2>
        {!hydrated ? (
          <div className="flex justify-center py-12">
            <Preloader />
          </div>
        ) : (
          <SessionList />
        )}
      </motion.section>
    </motion.div>
  );
}
