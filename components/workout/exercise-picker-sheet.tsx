"use client";

import {
  Block,
  BlockTitle,
  Button,
  Link,
  List,
  ListItem,
  Searchbar,
  Segmented,
  SegmentedButton,
  Sheet,
} from "konsta/react";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ExerciseFormSheet } from "@/components/exercises/exercise-form-sheet";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import type { ExerciseCategory } from "@/lib/store/type";

type CategoryFilter = "all" | ExerciseCategory;

interface ExercisePickerSheetProps {
  opened: boolean;
  sessionId: string;
  onClose: () => void;
}

const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
} as const;

const listItemVariants = {
  hidden: { opacity: 0, y: 10 },
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

export function ExercisePickerSheet({
  opened,
  sessionId,
  onClose,
}: ExercisePickerSheetProps) {
  const addSet = useFitLogStore((state) => state.addSet);
  const getActiveExercises = useFitLogStore((state) => state.getActiveExercises);

  const [filter, setFilter] = useState<CategoryFilter>("all");
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);

  const exercises = useMemo(() => {
    const active = getActiveExercises();
    const normalizedQuery = query.trim().toLowerCase();

    return active.filter((exercise) => {
      if (filter !== "all" && exercise.category !== filter) {
        return false;
      }
      if (!normalizedQuery) {
        return true;
      }
      return exercise.name.toLowerCase().includes(normalizedQuery);
    });
  }, [filter, getActiveExercises, query]);

  const handleSelect = (exerciseId: string) => {
    addSet(sessionId, exerciseId);
    onClose();
  };

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  return (
    <>
      <Sheet opened={opened} onBackdropClick={handleClose}>
        <BlockTitle className="px-4 pt-4">Chọn bài tập</BlockTitle>
        <Block className="px-4">
          <Segmented strong rounded>
            <SegmentedButton
              active={filter === "all"}
              onClick={() => setFilter("all")}
            >
              Tất cả
            </SegmentedButton>
            <SegmentedButton
              active={filter === "gym"}
              onClick={() => setFilter("gym")}
            >
              Gym
            </SegmentedButton>
            <SegmentedButton
              active={filter === "calisthenics"}
              onClick={() => setFilter("calisthenics")}
            >
              Cali
            </SegmentedButton>
          </Segmented>
        </Block>
        <Block className="px-4">
          <Searchbar
            placeholder="Tìm bài tập..."
            value={query}
            onInput={(event) => setQuery(event.target.value)}
            onClear={() => setQuery("")}
          />
        </Block>
        <List strongIos outlineIos className="max-h-[50vh] overflow-y-auto">
          {exercises.length === 0 ? (
            <ListItem title="Không có bài tập phù hợp" />
          ) : (
            <motion.div
              variants={listContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {exercises.map((exercise) => (
                <motion.div key={exercise.id} variants={listItemVariants}>
                  <ListItem
                    title={exercise.name}
                    subtitle={exercise.category === "gym" ? "Gym" : "Calisthenics"}
                    link
                    onClick={() => handleSelect(exercise.id)}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </List>
        <Block className="px-4 pb-6">
          <Link onClick={() => setFormOpen(true)}>+ Thêm bài tập mới</Link>
          <Button large className="mt-4" onClick={handleClose}>
            Đóng
          </Button>
        </Block>
      </Sheet>

      <ExerciseFormSheet
        opened={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={() => setFormOpen(false)}
      />
    </>
  );
}
