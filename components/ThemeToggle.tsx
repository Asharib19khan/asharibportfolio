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

  // Ultra-premium fluid spring physics
  const springConfig = { type: "spring", stiffness: 200, damping: 18, mass: 1.2 };

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10 text-amber-500 dark:text-blue-300 hover:bg-black/10 dark:hover:bg-white/20 transition-colors overflow-hidden group shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.05)]"
      whileTap={{ scale: 0.8, rotate: isDark ? -15 : 15 }}
      whileHover={{ scale: 1.05 }}
      aria-label="Toggle Dark Mode"
      title="Toggle Dark Mode"
    >
      {/* Background ambient glow inside the button */}
      <motion.div
        className="absolute inset-0 opacity-50"
        animate={{
          background: isDark
            ? "radial-gradient(circle at 50% 50%, rgba(147,197,253,0.3) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.3) 0%, transparent 70%)",
        }}
        transition={{ duration: 1 }}
      />

      {/* Shockwave ripple effect on click */}
      <motion.div
        key={isDark ? "dark" : "light"}
        initial={{ scale: 0, opacity: 0.8, borderWidth: "2px" }}
        animate={{ scale: 2.5, opacity: 0, borderWidth: "0px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute inset-0 rounded-full border-amber-400 dark:border-blue-400 pointer-events-none"
      />

      {/* Core Eclipse SVG Morph */}
      <motion.svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ rotate: isDark ? 40 : 0 }}
        transition={springConfig}
        className="relative z-10"
      >
        <mask id="moon-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <motion.circle
            cx={isDark ? 16 : 28}
            cy={isDark ? 6 : -6}
            r="8"
            fill="black"
            transition={springConfig}
          />
        </mask>

        {/* The celestial body (Sun -> Moon) */}
        <motion.circle
          cx="12"
          cy="12"
          fill={isDark ? "currentColor" : "none"} // Solid moon, outlined sun
          mask="url(#moon-mask)"
          animate={{ r: isDark ? 9 : 5 }}
          transition={springConfig}
        />

        {/* The Solar Rays */}
        <motion.g
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0.2 : 1 }}
          style={{ originX: "12px", originY: "12px" }}
          transition={springConfig}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </motion.g>
      </motion.svg>
    </motion.button>
  );
}
