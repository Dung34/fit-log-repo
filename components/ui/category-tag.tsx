import type { ExerciseCategory } from "@/lib/store/type";
import { cn } from "@/lib/utils/cn";

const TAG_STYLES: Record<
  ExerciseCategory,
  { label: string; bg: string; text: string }
> = {
  gym: {
    label: "Strength",
    bg: "bg-[#A890FE33]",
    text: "text-[#6B52D9]",
  },
  calisthenics: {
    label: "Muscle",
    bg: "bg-[#FFD16633]",
    text: "text-[#C9A020]",
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
