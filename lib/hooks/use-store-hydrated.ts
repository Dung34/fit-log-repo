"use client";

import { useEffect, useState } from "react";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";

export function useStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const persistApi = useFitLogStore.persist;

    if (!persistApi) {
      setHydrated(true);
      return;
    }

    const markHydrated = () => {
      setHydrated(true);
    };

    if (persistApi.hasHydrated()) {
      markHydrated();
      return;
    }

    const unsubscribe = persistApi.onFinishHydration(markHydrated);

    // Fail-safe: force hydration attempt and avoid permanent loading UI.
    const rehydrateResult = persistApi.rehydrate();
    if (rehydrateResult && typeof rehydrateResult.then === "function") {
      void rehydrateResult.finally(markHydrated);
    } else {
      markHydrated();
    }
    const timeoutId = window.setTimeout(markHydrated, 1200);

    return () => {
      unsubscribe();
      window.clearTimeout(timeoutId);
    };
  }, []);

  return hydrated;
}
