"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-10 h-10 rounded-full" />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-gray-800 dark:text-gray-100 hover:bg-black/10 dark:hover:bg-white/20 transition-colors overflow-hidden group"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label="Toggle Dark Mode"
    >
      {/* Background ambient glow on hover */}
      <motion.div 
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isDark 
            ? "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1), transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(0,0,0,0.05), transparent 70%)"
        }}
      />

      <motion.svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={false}
        animate={{
          rotate: isDark ? 90 : 0,
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 1 }}
        style={{ originX: "50%", originY: "50%" }}
      >
        <mask id="moon-mask">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          <motion.circle
            initial={false}
            animate={{
              cx: isDark ? 8 : 25,
              cy: isDark ? 8 : -5,
              r: 8
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20, mass: 1.2 }}
            fill="black"
          />
        </mask>

        {/* Central Core (Sun / Moon) */}
        <motion.circle
          cx="12"
          cy="12"
          mask="url(#moon-mask)"
          fill="currentColor"
          initial={false}
          animate={{
            r: isDark ? 9 : 5,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20, mass: 1 }}
        />

        {/* Sun Rays */}
        <motion.g
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          initial={false}
          animate={{
            opacity: isDark ? 0 : 1,
            scale: isDark ? 0.2 : 1,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 20, mass: 1 }}
          style={{ originX: "50%", originY: "50%" }}
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

        {/* Night Stars */}
        <motion.g
          fill="currentColor"
          initial={false}
          animate={{
            opacity: isDark ? 1 : 0,
            scale: isDark ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15, mass: 1, delay: isDark ? 0.1 : 0 }}
          style={{ originX: "50%", originY: "50%" }}
        >
          <motion.circle 
            cx="19" cy="5" r="1.5" 
            animate={{ scale: isDark ? [1, 1.3, 1] : 1, opacity: isDark ? [1, 0.7, 1] : 0 }} 
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          />
          <motion.circle 
            cx="20" cy="11" r="1" 
            animate={{ scale: isDark ? [1, 1.5, 1] : 1, opacity: isDark ? [1, 0.5, 1] : 0 }} 
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.circle 
            cx="16" cy="18" r="1" 
            animate={{ scale: isDark ? [1, 1.4, 1] : 1, opacity: isDark ? [1, 0.6, 1] : 0 }} 
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut", delay: 1 }}
          />
        </motion.g>
      </motion.svg>
    </motion.button>
  );
}
