"use client";

import { Button } from "konsta/react";
import { useFitLogStore } from "@/lib/store/use-fit-log-store";
import { motion, AnimatePresence } from "framer-motion";
import type { WorkoutSet } from "@/lib/store/type";
import { useState } from "react";

interface CalorieEstimatorProps {
  sessionId: string;
}

export function CalorieEstimator({ sessionId }: CalorieEstimatorProps) {
  const getOrCreateSession = useFitLogStore((state) => state.getOrCreateSession);
  const getSetsBySession = useFitLogStore((state) => state.getSetsBySession);
  const getExerciseById = useFitLogStore((state) => state.getExerciseById);
  const updateSessionCalories = useFitLogStore((state) => state.updateSessionCalories);
  const userProfile = useFitLogStore((state) => state.userProfile);
  const updateUserProfile = useFitLogStore((state) => state.updateUserProfile);

  const [loading, setLoading] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [height, setHeight] = useState(userProfile.height?.toString() || "");
  const [weight, setWeight] = useState(userProfile.weight?.toString() || "");

  // Temporary fix to avoid hooks in conditions, find the session here
  // Note: getOrCreateSession expects a date, but we have sessionId.
  // Actually, we can just use `sessions.find`
  const session = useFitLogStore((state) =>
    state.sessions.find((s) => s.id === sessionId)
  );

  if (!session) return null;

  const sets = getSetsBySession(sessionId);

  const handleCalculate = async () => {
    if (!userProfile.height || !userProfile.weight) {
      setProfileModalOpen(true);
      return;
    }
    await calculateCalories();
  };

  const calculateCalories = async () => {
    try {
      setLoading(true);

      const sessionData = sets.map((set) => ({
        ...set,
        exercise: getExerciseById(set.exerciseId),
      }));

      const res = await fetch("/api/calories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: userProfile,
          sessionData,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to calculate calories");
      }

      const data = await res.json();
      if (data.estimatedCalories) {
        updateSessionCalories(sessionId, data.estimatedCalories);
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tính calo. Vui lòng kiểm tra lại API Key.");
    } finally {
      setLoading(false);
    }
  };

  const saveProfileAndCalculate = () => {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w) {
      alert("Vui lòng nhập số hợp lệ.");
      return;
    }
    updateUserProfile({ height: h, weight: w });
    setProfileModalOpen(false);

    // We use a timeout to let state update before calculating, 
    // or just calculate immediately since we have the variables.
    // However `userProfile` might not be updated synchronously.
    // It's better to just pass them directly if needed, but since we save them to store:
    setTimeout(calculateCalories, 100);
  };

  return (
    <>
      <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
        {session.calories ? (
          <div className="flex-1 rounded-2xl bg-fit-accent-purple/10 border border-fit-accent-purple/20 px-4 py-3 min-w-full sm:min-w-0">
            <div className="flex items-center justify-between">
              <p className="fit-caption !text-fit-accent-purple/80 font-medium flex items-center gap-1">
                🔥 Calo tiêu thụ (AI)
              </p>
              <button
                onClick={handleCalculate}
                className="text-xs text-fit-accent-purple font-medium bg-fit-accent-purple/10 px-2 py-1 rounded-full hover:bg-fit-accent-purple/20"
              >
                Tính lại
              </button>
            </div>
            <p className="text-2xl font-bold text-fit-accent-purple font-mono-numbers mt-1">
              {loading ? "..." : session.calories.toLocaleString("vi-VN")}{" "}
              <span className="text-sm font-normal text-fit-accent-purple/75">kcal</span>
            </p>
          </div>
        ) : (
          <div className="flex-1">
            <Button
              large
              className="bg-gradient-to-r from-fit-accent-purple to-fit-accent-blue border-0 shadow-md text-white font-semibold flex items-center justify-center gap-2"
              onClick={handleCalculate}
              disabled={loading}
            >
              {loading ? (
                <span>Đang tính...</span>
              ) : (
                <>
                  <span>🔥</span>
                  <span>Tính lượng Calo (AI)</span>
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {profileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setProfileModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-sm rounded-[32px] bg-fit-bg border border-white/10 p-6 shadow-2xl overflow-hidden"
            >
              {/* Decorative background element */}
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br from-fit-accent-purple/20 to-fit-accent-blue/20 blur-3xl pointer-events-none" />

              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-fit-accent-purple/10 mb-4">
                  <span className="text-2xl">🔥</span>
                </div>

                <h3 className="text-xl font-bold text-white text-center mb-2">
                  Thông tin cơ thể
                </h3>
                <p className="text-sm text-white/60 text-center mb-6 px-2">
                  Để AI có thể tính toán lượng calo đốt cháy chuẩn xác nhất, hãy cung cấp chỉ số của bạn.
                </p>

                <div className="space-y-4 mb-8">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                      Chiều cao (cm)
                    </label>
                    <input
                      type="number"
                      placeholder="VD: 170"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-lg font-medium text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fit-accent-purple/50 focus:border-fit-accent-purple transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/50 mb-1.5 ml-1">
                      Cân nặng (kg)
                    </label>
                    <input
                      type="number"
                      placeholder="VD: 65"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-lg font-medium text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-fit-accent-purple/50 focus:border-fit-accent-purple transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setProfileModalOpen(false)}
                    className="flex-1 rounded-2xl bg-white/10 py-3.5 text-sm font-bold text-white/80 hover:bg-white/20 active:scale-95 transition-all"
                  >
                    Để sau
                  </button>
                  <button
                    type="button"
                    onClick={saveProfileAndCalculate}
                    className="flex-[2] rounded-2xl bg-gradient-to-r from-fit-accent-purple to-fit-accent-blue py-3.5 text-sm font-bold text-white shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Lưu & Tính Calo</span>
                    <span className="font-mono">→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
