"use client";

import { motion } from "framer-motion";
import { ActivityPage } from "@/components/activity/activity-page";

export default function ActivityRoutePage() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <ActivityPage />
    </motion.div>
  );
}
