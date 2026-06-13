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
    return <div className="w-14 h-7 rounded-full" />;
  }

  const isDark = theme === "dark";

  return (
    <motion.button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center w-14 h-7 p-1 rounded-full cursor-pointer overflow-hidden transition-colors duration-500 border border-black/10 dark:border-white/10"
      style={{
        backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
      }}
      whileTap={{ scale: 0.9 }}
      aria-label="Toggle Dark Mode"
    >
      {/* Background Micro-Texture */}
      <div className="absolute inset-0 opacity-20 dark:opacity-40 mix-blend-overlay pointer-events-none" 
           style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}>
      </div>

      {/* Sun/Moon Icons baked into the background track */}
      <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-600">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 dark:text-gray-600">
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
      </div>

      {/* The Gravity Orb */}
      <motion.div
        layout
        initial={false}
        animate={{
          x: isDark ? 0 : 28,
          backgroundColor: isDark ? "#ffffff" : "#000000",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 1,
        }}
        className="relative z-10 w-5 h-5 rounded-full shadow-lg flex items-center justify-center"
      >
        {/* Inner glow/reflection of the orb */}
        <motion.div 
          className="absolute inset-0 rounded-full"
          animate={{
            boxShadow: isDark ? "inset -2px -2px 4px rgba(0,0,0,0.3)" : "inset 2px 2px 4px rgba(255,255,255,0.5)",
          }}
        />
      </motion.div>
    </motion.button>
  );
}
