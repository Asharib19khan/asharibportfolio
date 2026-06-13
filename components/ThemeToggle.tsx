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
      className="relative flex items-center w-14 h-[28px] p-1 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle Dark Mode"
    >
      <motion.div
        layout
        initial={false}
        animate={{
          x: isDark ? 28 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25, bounce: 0.2 }}
        className="absolute w-5 h-5 rounded-full bg-white dark:bg-[#1a1a1a] shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)] border border-black/5 dark:border-white/10"
      />

      <div className="relative z-10 flex w-full justify-between px-[3px]">
        {/* Sun Icon for Light Mode */}
        <motion.svg
          animate={{ rotate: isDark ? -90 : 0, scale: isDark ? 0.8 : 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-colors duration-500 ${isDark ? "text-gray-500" : "text-black"}`}
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </motion.svg>

        {/* Moon Icon for Dark Mode */}
        <motion.svg
          animate={{ rotate: isDark ? 0 : 90, scale: isDark ? 1 : 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-colors duration-500 ${isDark ? "text-white" : "text-gray-400"}`}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </motion.svg>
      </div>
    </motion.button>
  );
}
