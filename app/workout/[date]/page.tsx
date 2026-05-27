"use client";

import { useParams, useRouter } from "next/navigation";
import { FitButton } from "@/components/ui/fit-button";
import { FitCard } from "@/components/ui/fit-card";
import { WorkoutEditor } from "@/components/workout/workout-editor";
import { parseDate } from "@/lib/utils/date";

export default function WorkoutPage() {
  const router = useRouter();
  const params = useParams<{ date: string }>();
  const rawDate = params.date ?? "";
  const date = (() => {
    try {
      return parseDate(rawDate);
    } catch {
      return null;
    }
  })();

  if (!date) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-fit-bg-muted px-4 pt-[max(1rem,env(safe-area-inset-top))]">
        <FitCard className="max-w-sm text-center">
          <p className="fit-caption">
            Ngày không hợp lệ: {rawDate || "—"}
          </p>
          <FitButton fullWidth className="mt-4" onClick={() => router.push("/")}>
            Về trang chủ
          </FitButton>
        </FitCard>
      </div>
    );
  }

  return <WorkoutEditor date={date} />;
}
