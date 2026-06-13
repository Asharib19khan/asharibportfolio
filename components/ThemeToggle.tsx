"use client";

import { useTheme } from "next-themes";
import { motion, useMotionValue, useTransform, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const y = useMotionValue(0);
  const controls = useAnimation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.y > 100) {
      // Toggle Theme
      setTheme(theme === "dark" ? "light" : "dark");
      // Snap sound / vibration effect could go here
      if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }
    // Snap back up
    controls.start({ y: 0, transition: { type: "spring", stiffness: 300, damping: 10 } });
  };

  // String stretches and fades color based on pull
  const stringColor = useTransform(y, [0, 150], ["var(--text-secondary)", "var(--text-primary)"]);
  const glowOpacity = useTransform(y, [0, 150], [0, 1]);

  if (!mounted) return null;

  return (
    <div className="fixed top-0 right-8 md:right-16 z-[100] h-[300px] pointer-events-none flex flex-col items-center">
      {/* The physical string */}
      <motion.div 
        className="w-[2px] bg-theme-muted origin-top"
        style={{ 
          height: y, 
          minHeight: "40px",
          backgroundColor: stringColor 
        }}
      />
      
      {/* The draggable handle */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.8}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ y }}
        className="w-8 h-12 rounded-full cursor-grab active:cursor-grabbing pointer-events-auto relative shadow-[0_4px_20px_rgba(0,0,0,0.3)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.1)] border border-theme-border bg-theme-glass backdrop-blur-md flex items-end justify-center pb-2 transition-colors"
      >
        <div className="w-4 h-4 rounded-full bg-theme-text opacity-50" />
        
        {/* Glow effect when pulling down */}
        <motion.div 
          className="absolute inset-0 rounded-full bg-theme-text blur-md -z-10"
          style={{ opacity: glowOpacity }}
        />
      </motion.div>
    </div>
  );
}
