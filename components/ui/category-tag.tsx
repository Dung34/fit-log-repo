import type { ExerciseCategory } from "@/lib/store/type";
import { cn } from "@/lib/utils/cn";

const TAG_STYLES: Record<
  ExerciseCategory,
  { label: string; bg: string; text: string }
> = {
  gym: {
    label: "Strength",
    bg: "bg-fit-accent-blue/20",
    text: "text-fit-accent-blue",
  },
  calisthenics: {
    label: "Muscle",
    bg: "bg-fit-accent-green/20",
    text: "text-fit-accent-green",
  },
  cardio: {
    label: "Cardio",
    bg: "bg-fit-accent-orange/20",
    text: "text-fit-accent-orange",
  },
};

interface CategoryTagProps {
  category: ExerciseCategory;
  className?: string;
}

export function CategoryTag({ category, className }: CategoryTagProps) {
  const style = TAG_STYLES[category];

  return (
    <span
      className={cn(
        "inline-flex rounded-[var(--fit-radius-pill)] px-2.5 py-0.5 text-xs font-medium",
        style.bg,
        style.text,
        className,
      )}
    >
      {style.label}
    </span>
  );
}
