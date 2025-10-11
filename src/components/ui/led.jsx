import React from "react";
import { motion } from "framer-motion";

export function Led({ delay = 0, on = true }) {
  return (
    <motion.div
      initial={{ opacity: on ? 0.25 : 0.05 }}
      animate={{ opacity: on ? [0.25, 1, 0.25] : 0.08 }}
      transition={{ duration: 1.2, repeat: Infinity, delay }}
      className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px] shadow-emerald-500/80"
    />
  );
}

export function LedBus({ running }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: 12 }).map((_, i) => (
        <Led key={i} delay={running ? i * 0.12 : 0} on={running} />
      ))}
    </div>
  );
}