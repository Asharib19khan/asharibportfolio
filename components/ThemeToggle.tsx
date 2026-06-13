"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const ref = useRef<HTMLButtonElement>(null);

  // Magnetic Physics for the Toggle
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 rounded-full" />;
  }

  const isDark = theme === "dark";

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    // Magnetic pull limit
    x.set(distanceX * 0.4);
    y.set(distanceY * 0.4);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={toggleTheme}
      style={{ x: mouseXSpring, y: mouseYSpring }}
      whileTap={{ scale: 0.8 }}
      className="relative flex items-center justify-center w-8 h-8 rounded-full bg-transparent border border-black/5 dark:border-white/10 group overflow-hidden cursor-crosshair"
      aria-label="Toggle Cosmic Theme"
    >
      {/* Outer spinning event horizon (Dark Mode only) */}
      <motion.div
        animate={{ 
          rotate: isDark ? 360 : 0, 
          scale: isDark ? 1 : 0.5,
          opacity: isDark ? 1 : 0 
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: 6, ease: "linear" },
          scale: { type: "spring", stiffness: 100, damping: 20 },
          opacity: { duration: 0.4 }
        }}
        className="absolute inset-[-2px] rounded-full border-[1.5px] border-dashed border-white/40"
      />

      {/* The Core Orb (Star / Black Hole) */}
      <motion.div
        animate={{
          scale: isDark ? 0.35 : 1,
          backgroundColor: isDark ? "#000000" : "#ffffff",
          boxShadow: isDark 
            ? "0 0 10px 2px rgba(255, 255, 255, 0.9), inset 0 0 5px rgba(255,255,255,0.8)" 
            : "0 0 15px 3px rgba(255, 220, 100, 0.6), inset 0 0 10px rgba(255, 250, 200, 1)"
        }}
        transition={{ type: "spring", stiffness: 120, damping: 15 }}
        className="relative w-4 h-4 rounded-full flex items-center justify-center z-10"
      >
        {/* The Solar Corona (Light Mode only) */}
        <motion.div 
          animate={{ opacity: isDark ? 0 : 1, scale: isDark ? 0 : [1, 1.4, 1] }}
          transition={{ scale: { repeat: Infinity, duration: 3, ease: "easeInOut" } }}
          className="absolute inset-[-4px] rounded-full bg-yellow-300/40 blur-[3px] -z-10"
        />
      </motion.div>

      {/* The Eclipse Moon (Slides in to block the Star during transition to Dark Mode) */}
      <motion.div
        animate={{
          x: isDark ? "0%" : "-150%",
          y: isDark ? "0%" : "150%",
          scale: isDark ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 60, damping: 15 }}
        className="absolute w-6 h-6 rounded-full bg-[#fafafa] dark:bg-[#050505] shadow-[inset_-2px_-2px_5px_rgba(255,255,255,0.05)] z-20 pointer-events-none"
      />

      {/* Star Dust Particles (Orbiting in dark mode) */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: isDark ? [0, 360] : 0,
            opacity: isDark ? [0.2, 1, 0.2] : 0,
          }}
          transition={{
            rotate: { repeat: Infinity, duration: 3 + i * 1.5, ease: "linear" },
            opacity: { repeat: Infinity, duration: 1.5 + i, ease: "easeInOut" }
          }}
          className="absolute inset-0 z-30 pointer-events-none origin-center"
        >
          <div 
            className="absolute w-0.5 h-0.5 bg-white rounded-full" 
            style={{ 
              top: `${15 + i * 20}%`, 
              left: `${80 - i * 15}%`,
              boxShadow: "0 0 3px 1px rgba(255,255,255,0.8)"
            }} 
          />
        </motion.div>
      ))}
    </motion.button>
  );
}
