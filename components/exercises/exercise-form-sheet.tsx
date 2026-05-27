"use client";

import {
  Block,
  BlockTitle,
  Button,
  ListInput,
  Segmented,
  SegmentedButton,
  Sheet,
} from "konsta/react";
import { useEffect, useState } from "react";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import type { Exercise, ExerciseCategory } from "@/lib/store/type";

interface ExerciseFormSheetProps {
  opened: boolean;
  onClose: () => void;
  exercise?: Exercise;
  onSaved?: (exercise: Exercise) => void;
}

export function ExerciseFormSheet({
  opened,
  onClose,
  exercise,
  onSaved,
}: ExerciseFormSheetProps) {
  const addExercise = useFitLogStore((state) => state.addExercise);
  const updateExercise = useFitLogStore((state) => state.updateExercise);

  const isEdit = Boolean(exercise);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ExerciseCategory>("gym");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!opened) {
      return;
    }
    setName(exercise?.name ?? "");
    setCategory(exercise?.category ?? "gym");
    setError(null);
  }, [opened, exercise]);

  const handleSubmit = () => {
    try {
      if (isEdit && exercise) {
        updateExercise(exercise.id, { name, category });
        onSaved?.({ ...exercise, name: name.trim(), category });
      } else {
        const created = addExercise({ name, category, isCustom: true });
        onSaved?.(created);
      }
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error ? submitError.message : "Không thể lưu",
      );
    }
  };

  const handleClose = () => {
    setError(null);
    onClose();
  };

  return (
    <Sheet opened={opened} onBackdropClick={handleClose}>
      <BlockTitle className="px-4 pt-4">
        {isEdit ? "Sửa bài tập" : "Thêm bài tập"}
      </BlockTitle>
      <Block strong inset className="space-y-4">
        <ListInput
          label="Tên bài tập"
          type="text"
          placeholder="VD: Incline Bench Press"
          value={name}
          onInput={(event) => setName(event.target.value)}
          error={error ?? false}
        />
        <div>
          <p className="mb-2 text-sm text-black/60 dark:text-white/60">
            Phân loại
          </p>
          <Segmented strong rounded>
            <SegmentedButton
              active={category === "gym"}
              onClick={() => setCategory("gym")}
            >
              Gym
            </SegmentedButton>
            <SegmentedButton
              active={category === "calisthenics"}
              onClick={() => setCategory("calisthenics")}
            >
              Calisthenics
            </SegmentedButton>
          </Segmented>
        </div>
        <Button large onClick={handleSubmit}>
          {isEdit ? "Lưu" : "Thêm"}
        </Button>
        <Button large outline onClick={handleClose}>
          Hủy
        </Button>
      </Block>
    </Sheet>
  );
}
