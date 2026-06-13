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
    return <div className="w-14 h-7 rounded-full" />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center w-14 h-7 p-1 rounded-full border shadow-inner overflow-hidden cursor-pointer transition-colors duration-500 ease-in-out"
      style={{
        backgroundColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
        borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      }}
      whileTap={{ scale: 0.95 }}
      aria-label="Toggle Dark Mode"
    >
      {/* Sliding Thumb */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          mass: 1.5,
        }}
        className="relative flex items-center justify-center w-5 h-5 rounded-full shadow-md z-10"
        style={{
          backgroundColor: isDark ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,1)",
          x: isDark ? 28 : 0, // 56px (w-14) - 20px (w-5) - 8px (padding left/right) = 28px travel distance
        }}
      >
        {/* Sun Icon */}
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            opacity: isDark ? 0 : 1,
            rotate: isDark ? -90 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute inset-0 flex items-center justify-center text-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        </motion.div>

        {/* Moon Icon */}
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            opacity: isDark ? 1 : 0,
            rotate: isDark ? 0 : 90,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="absolute inset-0 flex items-center justify-center text-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </motion.div>
      </motion.div>

      {/* Decorative Track Background Details (Stars in Dark Mode, Clouds in Light Mode) */}
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none"
        initial={false}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-[4px] left-[6px] w-[2px] h-[2px] bg-white rounded-full opacity-60" />
        <div className="absolute top-[12px] left-[14px] w-[1px] h-[1px] bg-white rounded-full opacity-80" />
        <div className="absolute top-[18px] left-[8px] w-[2px] h-[2px] bg-white rounded-full opacity-40" />
      </motion.div>

      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none"
        initial={false}
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute top-[4px] right-[8px] w-[6px] h-[3px] bg-black/10 rounded-full" />
        <div className="absolute top-[12px] right-[14px] w-[8px] h-[4px] bg-black/10 rounded-full" />
      </motion.div>
    </motion.button>
  );
}
