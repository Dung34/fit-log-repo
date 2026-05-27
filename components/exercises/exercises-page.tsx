"use client";

import { Dialog, DialogButton, Preloader } from "konsta/react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExerciseFormSheet } from "@/components/exercises/exercise-form-sheet";
import { CategoryTag } from "@/components/ui/category-tag";
import { FitButton } from "@/components/ui/fit-button";
import { FitCard } from "@/components/ui/fit-card";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import type { Exercise, ExerciseCategory } from "@/lib/store/type";

const CATEGORY_LABELS: Record<ExerciseCategory, string> = {
  gym: "Gym",
  calisthenics: "Calisthenics",
  cardio: "Cardio",
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
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

function groupByCategory(exercises: Exercise[]) {
  return (["gym", "calisthenics", "cardio"] as const).map((category) => ({
    category,
    label: CATEGORY_LABELS[category],
    items: exercises.filter((exercise) => exercise.category === category),
  }));
}

export function ExercisesPage() {
  const hydrated = useStoreHydrated();
  const getActiveExercises = useFitLogStore((state) => state.getActiveExercises);
  const deleteExercise = useFitLogStore((state) => state.deleteExercise);
  const exercises = useFitLogStore((state) => state.exercises);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Exercise | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<Exercise | null>(null);

  const groups = useMemo(
    () => groupByCategory(getActiveExercises()),
    [exercises, getActiveExercises],
  );

  const openCreate = () => {
    setEditing(undefined);
    setFormOpen(true);
  };

  const openEdit = (exercise: Exercise) => {
    setEditing(exercise);
    setFormOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    try {
      deleteExercise(deleteTarget.id);
      setDeleteTarget(null);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Không thể xóa");
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-full bg-fit-bg-muted px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4"
    >
      <motion.header variants={itemVariants} className="mb-6">
        <h1 className="fit-display">Bài tập</h1>
        <p className="fit-caption mt-1">Danh mục Gym & Calisthenics</p>
      </motion.header>

      <motion.div 
        variants={itemVariants}
        whileHover={{ scale: 1.015, y: -2 }}
        whileTap={{ scale: 0.985, y: 0 }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
        onClick={openCreate}
        className="mb-8 cursor-pointer relative overflow-hidden rounded-[var(--fit-radius-card)] bg-gradient-to-r from-fit-accent-purple/10 to-fit-accent-blue/10 border border-fit-accent-purple/15 p-5 shadow-sm group"
      >
        <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full bg-fit-accent-purple/5 blur-2xl" />
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="fit-caption inline-flex rounded-[var(--fit-radius-pill)] bg-fit-accent-purple/15 px-2.5 py-0.5 uppercase tracking-wider !text-fit-accent-purple font-bold text-[9px]">
              Tùy biến bài tập
            </span>
            <h3 className="fit-title text-fit-text mt-1.5 leading-none">
              Thêm bài tập custom
            </h3>
            <p className="fit-caption mt-1 text-[11px]">
              Tự thiết lập bài tập của riêng bạn ngoài danh sách mặc định.
            </p>
          </div>
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-fit-card-dark text-xl text-white shadow-sm transition group-hover:scale-105">
            +
          </div>
        </div>
      </motion.div>

      {!hydrated ? (
        <div className="flex justify-center py-12">
          <Preloader />
        </div>
      ) : (
        groups.map(({ category, label, items }) => (
          <motion.section variants={itemVariants} key={category} className="mb-8">
            <div className="mb-3.5 flex items-center gap-2">
              <h2 className="fit-title">{label}</h2>
              <CategoryTag category={category} />
            </div>
            {items.length === 0 ? (
              <FitCard className="border border-black/5 bg-fit-bg">
                <p className="fit-caption">Chưa có bài tập trong nhóm này.</p>
              </FitCard>
            ) : (
              <div className="grid grid-cols-1 gap-2.5">
                {items.map((exercise) => (
                  <motion.div
                    whileHover={{ scale: 1.015, y: -1 }}
                    whileTap={{ scale: 0.985, y: 0 }}
                    transition={{ type: "spring", stiffness: 450, damping: 25 }}
                    key={exercise.id}
                    className="flex items-center justify-between gap-4 rounded-[20px] border border-black/5 bg-fit-bg px-4 py-3 shadow-[var(--fit-shadow-card)] cursor-pointer"
                  >
                    <div className="min-w-0" onClick={() => openEdit(exercise)}>
                      <p className="fit-body font-bold text-fit-text truncate">
                        {exercise.name}
                      </p>
                      <span className="fit-caption inline-block mt-0.5 tracking-wider font-bold uppercase !text-fit-text-muted/65 text-[10px]">
                        {exercise.isCustom ? "Custom" : "Mặc định"}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-sm font-semibold transition cursor-pointer"
                        aria-label={`Sửa ${exercise.name}`}
                        onClick={() => openEdit(exercise)}
                      >
                        ✎
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold transition cursor-pointer"
                        aria-label={`Xóa ${exercise.name}`}
                        onClick={() => setDeleteTarget(exercise)}
                      >
                        ✕
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        ))
      )}

      <ExerciseFormSheet
        opened={formOpen}
        exercise={editing}
        onClose={() => setFormOpen(false)}
        onSaved={() => setFormOpen(false)}
      />

      <Dialog
        opened={Boolean(deleteTarget)}
        onBackdropClick={() => setDeleteTarget(null)}
        title="Ẩn bài tập?"
        content={
          deleteTarget
            ? `Ẩn "${deleteTarget.name}" khỏi danh sách?`
            : ""
        }
        buttons={
          <>
            <DialogButton onClick={() => setDeleteTarget(null)}>
              Hủy
            </DialogButton>
            <DialogButton strong onClick={confirmDelete}>
              Ẩn
            </DialogButton>
          </>
        }
      />
    </motion.div>
  );
}
