"use client";

import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import { useStoreHydrated } from "@/lib/hooks/use-store-hydrated";
import { todayISO } from "@/lib/utils/date";
import { Block, Button, List, ListItem, Navbar, Page } from "konsta/react";
import { useCallback, useState } from "react";

interface SmokeResult {
  name: string;
  pass: boolean;
  detail: string;
}

function runSmokeTests(): SmokeResult[] {
  const store = useFitLogStore.getState();
  const results: SmokeResult[] = [];

  const testDate = "2026-05-26";

  try {
    const custom = store.addExercise({
      name: `Smoke Test ${Date.now()}`,
      category: "gym",
      isCustom: true,
    });
    const found = store.getExerciseById(custom.id);
    results.push({
      name: "Tạo exercise custom",
      pass: found?.name === custom.name,
      detail: found ? `Created: ${found.name}` : "Exercise not found after add",
    });
  } catch (error) {
    results.push({
      name: "Tạo exercise custom",
      pass: false,
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }

  try {
    store.addExercise({ name: "Duplicate Name Test", category: "gym" });
    store.addExercise({ name: "Duplicate Name Test", category: "gym" });
    results.push({
      name: "Validation tên trùng",
      pass: false,
      detail: "Expected throw on duplicate name",
    });
  } catch (error) {
    results.push({
      name: "Validation tên trùng",
      pass: true,
      detail: error instanceof Error ? error.message : "Duplicate rejected",
    });
  }

  const session1 = store.getOrCreateSession(testDate);
  const session2 = store.getOrCreateSession(testDate);
  results.push({
    name: "getOrCreateSession idempotent",
    pass: session1.id === session2.id,
    detail: `session1=${session1.id}, session2=${session2.id}`,
  });

  const exercise = store.getActiveExercises()[0];
  if (!exercise) {
    results.push({
      name: "Add 3 sets (order 0,1,2)",
      pass: false,
      detail: "No seed exercises available",
    });
  } else {
    useFitLogStore.setState({
      sets: store.sets.filter((set) => set.sessionId !== session1.id),
    });

    const set0 = store.addSet(session1.id, exercise.id);
    store.updateSet(set0.id, { weight: 60, reps: 10 });

    const set1 = store.addSet(session1.id, exercise.id);
    store.updateSet(set1.id, { weight: 65, reps: 8 });

    const set2 = store.addSet(session1.id, exercise.id);
    store.updateSet(set2.id, { weight: 70, reps: 6 });

    const sessionSets = store.getSetsBySession(session1.id);
    const orders = sessionSets.map((set) => set.order);
    results.push({
      name: "Add 3 sets (order 0,1,2)",
      pass:
        sessionSets.length === 3 &&
        orders[0] === 0 &&
        orders[1] === 1 &&
        orders[2] === 2,
      detail: `orders=${orders.join(",")}`,
    });

    const duplicated = store.duplicateSet(set1.id);
    const afterDuplicate = store.getSetsBySession(session1.id);
    const dupSet = afterDuplicate.find((set) => set.id === duplicated.id);
    const shiftedSet2 = afterDuplicate.find((set) => set.id === set2.id);

    results.push({
      name: "Duplicate set #1",
      pass:
        afterDuplicate.length === 4 &&
        dupSet?.order === 1 &&
        dupSet.weight === 65 &&
        dupSet.reps === 8 &&
        shiftedSet2?.order === 2,
      detail: `dup order=${dupSet?.order}, set2 order=${shiftedSet2?.order}`,
    });

    const expectedVolume = 60 * 10 + 65 * 8 + 65 * 8 + 70 * 6;
    const actualVolume = store.calcTotalVolume(session1.id);
    results.push({
      name: "calcTotalVolume(sessionId)",
      pass: actualVolume === expectedVolume,
      detail: `expected=${expectedVolume}, actual=${actualVolume}`,
    });
  }

  const stats = store.getSessionsWithStats();
  results.push({
    name: "getSessionsWithStats",
    pass: stats.some((item) => item.session.id === session1.id),
    detail: `${stats.length} session(s) with stats`,
  });

  try {
    const toDelete = store.getActiveExercises().find((item) => item.isCustom);
    if (toDelete) {
      store.deleteExercise(toDelete.id);
      const stillInStore = store.getExerciseById(toDelete.id);
      const hiddenFromActive = !store
        .getActiveExercises()
        .some((item) => item.id === toDelete.id);
      results.push({
        name: "Soft-delete exercise",
        pass: Boolean(stillInStore?.deletedAt) && hiddenFromActive,
        detail: stillInStore?.deletedAt
          ? `deletedAt=${stillInStore.deletedAt}`
          : "deletedAt not set",
      });
    }
  } catch (error) {
    results.push({
      name: "Soft-delete exercise",
      pass: false,
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }

  return results;
}

export default function Sprint2SmokePage() {
  const [results, setResults] = useState<SmokeResult[]>([]);
  const hydrated = useStoreHydrated();
  const exerciseCount = useFitLogStore((state) => state.exercises.length);
  const sessionCount = useFitLogStore((state) => state.sessions.length);
  const setCount = useFitLogStore((state) => state.sets.length);

  const handleRun = useCallback(() => {
    setResults(runSmokeTests());
  }, []);

  const passCount = results.filter((result) => result.pass).length;

  return (
    <Page>
      <Navbar title="Sprint 2 Smoke Test" />
      <Block strong inset>
        <p className="text-sm text-black/60 dark:text-white/60">
          Hydrated: {hydrated ? "yes" : "pending"} · Exercises: {exerciseCount}{" "}
          · Sessions: {sessionCount} · Sets: {setCount}
        </p>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          Chạy kịch bản CRUD + persist. Sau khi pass, refresh trang (F5) để xác
          nhận dữ liệu còn trong LocalStorage.
        </p>
      </Block>
      <Block inset>
        <Button large onClick={handleRun} disabled={!hydrated}>
          Chạy smoke tests
        </Button>
      </Block>
      {results.length > 0 && (
        <Block strong inset>
          <p className="mb-2 font-semibold">
            {passCount}/{results.length} passed
          </p>
          <List strongIos outlineIos>
            {results.map((result) => (
              <ListItem
                key={result.name}
                title={result.name}
                subtitle={result.detail}
                after={result.pass ? "PASS" : "FAIL"}
                media={
                  <span
                    className={
                      result.pass ? "text-green-600" : "text-red-600"
                    }
                  >
                    {result.pass ? "✓" : "✗"}
                  </span>
                }
              />
            ))}
          </List>
        </Block>
      )}
      <Block inset>
        <p className="text-xs text-black/50 dark:text-white/50">
          Today: {todayISO()} · Storage key: fitlog-storage
        </p>
      </Block>
    </Page>
  );
}
