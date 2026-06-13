"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full" />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center w-14 h-7 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)] ring-1 ring-white/10 dark:ring-black/20 focus:outline-none transition-colors"
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle Dark Mode"
    >
      {/* Dynamic Background */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: isDark
            ? "linear-gradient(to bottom, #0f172a, #1e1b4b)"
            : "linear-gradient(to bottom, #38bdf8, #bae6fd)",
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />

      {/* Stars (Dark Mode) */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={false}
        animate={{ opacity: isDark ? 1 : 0, y: isDark ? 0 : 10 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="absolute top-1.5 left-2.5 w-0.5 h-0.5 bg-white rounded-full opacity-80" />
        <div className="absolute top-3.5 left-5 w-px h-px bg-white rounded-full opacity-60" />
        <div className="absolute top-2 left-8 w-0.5 h-0.5 bg-white rounded-full opacity-90" />
      </motion.div>

      {/* Clouds (Light Mode) */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={false}
        animate={{ opacity: isDark ? 0 : 1, y: isDark ? -10 : 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <div className="absolute top-2 right-2 w-3 h-1 bg-white/80 rounded-full" />
        <div className="absolute top-3 right-5 w-2 h-1 bg-white/60 rounded-full" />
      </motion.div>

      {/* The Celestial Body (Sun/Moon) */}
      <motion.div
        className="relative z-10 w-5 h-5 rounded-full shadow-md flex items-center justify-center overflow-hidden"
        initial={false}
        animate={{
          x: isDark ? 32 : 4,
          // Hop effect
          y: isDark ? [0, -4, 0] : [0, -4, 0],
          background: isDark
            ? "linear-gradient(to bottom right, #f8fafc, #94a3b8)"
            : "linear-gradient(to bottom right, #fef08a, #f59e0b)",
        }}
        transition={{
          x: { type: "spring", stiffness: 200, damping: 20 },
          y: { duration: 0.4, ease: "easeInOut" },
          background: { duration: 0.5 },
        }}
      >
        {/* Moon Craters */}
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: isDark ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute top-1 left-1 w-1 h-1 bg-slate-400/50 rounded-full" />
          <div className="absolute top-2.5 left-2.5 w-1.5 h-1.5 bg-slate-400/50 rounded-full" />
          <div className="absolute bottom-0.5 right-1 w-1 h-1 bg-slate-400/50 rounded-full" />
        </motion.div>

        {/* Solar Glow */}
        <motion.div
          className="absolute inset-0 shadow-[inset_0_0_4px_rgba(255,255,255,0.8)] rounded-full"
          initial={false}
          animate={{ opacity: isDark ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    </motion.button>
  );
}
