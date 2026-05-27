"use client";

import {
  Block,
  BlockTitle,
  Button,
  Fab,
  Navbar,
  NavbarBackLink,
  Page,
  Preloader,
} from "konsta/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ExercisePickerSheet } from "@/components/workout/exercise-picker-sheet";
import { SetRow } from "@/components/workout/set-row";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import { addDays, formatDate } from "@/lib/utils/date";

interface WorkoutEditorProps {
  date: string;
}

export function WorkoutEditor({ date }: WorkoutEditorProps) {
  const router = useRouter();
  const hydrated = useStoreHydrated();
  const getOrCreateSession = useFitLogStore((state) => state.getOrCreateSession);
  const getSetsBySession = useFitLogStore((state) => state.getSetsBySession);
  const calcTotalVolume = useFitLogStore((state) => state.calcTotalVolume);
  const allSets = useFitLogStore((state) => state.sets);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    const session = getOrCreateSession(date);
    setSessionId(session.id);
  }, [date, getOrCreateSession, hydrated]);

  const sets = useMemo(() => {
    if (!sessionId) {
      return [];
    }
    return getSetsBySession(sessionId);
  }, [getSetsBySession, sessionId, allSets]);

  const totalVolume = sessionId ? calcTotalVolume(sessionId) : 0;

  if (!hydrated) {
    return (
      <Page>
        <Navbar title={formatDate(date)} />
        <Block strong inset className="flex justify-center py-12">
          <Preloader />
        </Block>
      </Page>
    );
  }

  return (
    <Page>
      <Navbar
        title={formatDate(date)}
        subtitle={date}
        left={<NavbarBackLink onClick={() => router.push("/")} />}
        right={
          <Button clear small onClick={() => router.push("/exercises")}>
            Bài tập
          </Button>
        }
      />

      <Block strong inset className="flex gap-2">
        <Button
          outline
          className="flex-1"
          onClick={() => router.push(`/workout/${addDays(date, -1)}`)}
        >
          ← Trước
        </Button>
        <Button
          outline
          className="flex-1"
          onClick={() => router.push(`/workout/${addDays(date, 1)}`)}
        >
          Sau →
        </Button>
      </Block>

      <Block strong inset>
        <p className="text-sm text-black/60 dark:text-white/60">
          {sets.length} set · {totalVolume.toLocaleString("vi-VN")} kg volume
        </p>
      </Block>

      <BlockTitle>Hiệp tập</BlockTitle>
      {sets.length === 0 ? (
        <Block strong inset>
          <p className="text-center text-black/60 dark:text-white/60">
            Chưa có set nào. Bấm + để thêm bài tập.
          </p>
        </Block>
      ) : (
        sets.map((set) => <SetRow key={set.id} set={set} />)
      )}

      {sessionId && (
        <Fab
          icon={<span className="text-2xl leading-none">+</span>}
          onClick={() => setPickerOpen(true)}
        />
      )}

      {sessionId && (
        <ExercisePickerSheet
          opened={pickerOpen}
          sessionId={sessionId}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </Page>
  );
}
