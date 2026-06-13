"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";

const Particles = ({ isDark }: { isDark: boolean }) => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`${isDark ? 'dark' : 'light'}-particle-${i}`}
          initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
          animate={{
            x: Math.cos((i * 60 * Math.PI) / 180) * 16,
            y: Math.sin((i * 60 * Math.PI) / 180) * 16,
            scale: [0, 1, 0],
            opacity: [1, 1, 0],
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`absolute w-1 h-1 rounded-full ${isDark ? 'bg-white' : 'bg-yellow-400'}`}
        />
      ))}
    </div>
  );
};

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isExploding, setIsExploding] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-14 h-8 rounded-full" />;
  }

  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
    setIsExploding(true);
    setTimeout(() => setIsExploding(false), 400);
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If they drag it more than 10px in the opposite direction, trigger the toggle
    if (isDark && info.offset.x < -10) {
      handleToggle();
    } else if (!isDark && info.offset.x > 10) {
      handleToggle();
    }
  };

  return (
    <div 
      className="relative flex items-center w-14 h-8 px-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 cursor-pointer overflow-visible transition-colors duration-700"
      onClick={handleToggle}
      title="Toggle Theme"
    >
      {/* Background track icons (Optional visual guides) */}
      <div className="absolute inset-0 flex justify-between items-center px-2 pointer-events-none opacity-30">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-white">
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
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black dark:text-white">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </div>

      <motion.div
        className="relative flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-[#050505] shadow-[0_2px_10px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_10px_rgba(255,255,255,0.1)] border border-black/5 dark:border-white/20 z-10"
        layout
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
          mass: 1.2
        }}
        animate={{
          x: isDark ? 24 : 0,
        }}
        drag="x"
        dragConstraints={{ left: isDark ? 24 : 0, right: isDark ? 24 : 0 }}
        dragElastic={0.4}
        onDragEnd={handleDragEnd}
        // Prevent click bubbling when dragging
        onPointerDown={(e) => e.stopPropagation()}
      >
        {isExploding && <Particles isDark={isDark} />}
        
        {/* The Eclipsing Orb SVG */}
        <div className="relative w-4 h-4 overflow-hidden rounded-full">
          {/* Base Sun */}
          <motion.div
            className="absolute inset-0 bg-yellow-400 rounded-full"
            animate={{
              scale: isDark ? 1 : 1,
              opacity: isDark ? 0.3 : 1,
              backgroundColor: isDark ? '#ffffff' : '#fbbf24'
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Eclipsing Moon Mask */}
          <motion.div
            className="absolute inset-0 bg-[#050505] rounded-full"
            initial={false}
            animate={{
              x: isDark ? "0%" : "-100%",
              scale: isDark ? 0.8 : 1
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              delay: isDark ? 0 : 0.1
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
