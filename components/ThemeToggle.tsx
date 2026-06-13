"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const springConfig = { type: "spring" as const, stiffness: 250, damping: 20 };

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
      className="relative flex items-center justify-center w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:bg-black/10 dark:hover:bg-white/20 transition-colors overflow-hidden group"
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle Dark Mode"
    >
      {/* Outer hover spin effect */}
      <motion.div
        className="relative flex items-center justify-center w-full h-full"
        animate={{ rotate: isDark ? 0 : 90 }}
        transition={{ ...springConfig, damping: 15 }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ overflow: "visible" }}
        >
          <defs>
            <mask id="moon-mask">
              {/* The white rect keeps everything visible by default */}
              <rect x="0" y="0" width="24" height="24" fill="white" />
              {/* The black circle cuts out the crescent moon shape */}
              <motion.circle
                initial={false}
                animate={{
                  cx: isDark ? 16 : 30,
                  cy: isDark ? 8 : 0,
                  r: isDark ? 6 : 0,
                }}
                transition={springConfig}
                fill="black"
              />
            </mask>
          </defs>

          {/* Central Orb: Sun or Crescent */}
          <motion.circle
            cx="12"
            cy="12"
            fill="currentColor"
            initial={false}
            animate={{
              r: isDark ? 8 : 5,
              fillOpacity: isDark ? 1 : 0,
              strokeWidth: isDark ? 0 : 2,
            }}
            transition={springConfig}
            mask="url(#moon-mask)"
          />

          {/* Sun Rays */}
          <motion.g
            initial={false}
            animate={{
              opacity: isDark ? 0 : 1,
              scale: isDark ? 0.3 : 1,
            }}
            transition={springConfig}
            strokeWidth="2"
            style={{ transformOrigin: "12px 12px" }}
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

          {/* Stars for Moon Mode */}
          <motion.g
            initial={false}
            animate={{
              opacity: isDark ? 1 : 0,
              scale: isDark ? 1 : 0.2,
            }}
            transition={{ ...springConfig, delay: isDark ? 0.1 : 0 }}
            fill="currentColor"
            stroke="none"
            style={{ transformOrigin: "16px 8px" }}
          >
            {/* Tiny star shapes or dots */}
            <circle cx="18" cy="4" r="1.5" />
            <circle cx="21" cy="9" r="1" />
            <circle cx="15" cy="2" r="0.8" />
          </motion.g>
        </svg>
      </motion.div>
    </motion.button>
  );
}
