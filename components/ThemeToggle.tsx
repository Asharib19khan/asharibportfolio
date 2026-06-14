"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Physics & Drag state
  const constraintsRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();
  const x = useMotionValue(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[100px] h-8 rounded-full bg-black/5 dark:bg-white/10" />;
  }

  const isDark = theme === "dark";

  // Map the drag distance to dynamic visual effects
  const pullTextOpacity = useTransform(x, [0, 40], [1, 0]);
  const iconRotate = useTransform(x, [0, 60], [0, 180]);
  const backgroundWidth = useTransform(x, [0, 60], ["32px", "100%"]);

  const handleDragEnd = (event: any, info: any) => {
    const threshold = 40; // If pulled more than 40px, trigger toggle
    if (info.offset.x > threshold) {
      // Trigger toggle!
      setTheme(isDark ? "light" : "dark");
      
      // Flash effect before snapping back
      controls.start({
        x: 0,
        scale: [1, 1.2, 1],
        transition: { type: "spring", stiffness: 400, damping: 15 }
      });
    } else {
      // Snap back if not pulled far enough
      controls.start({ x: 0, transition: { type: "spring", stiffness: 500, damping: 25 } });
    }
  };

  return (
    <div 
      ref={constraintsRef}
      className="relative flex items-center w-[100px] h-8 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 overflow-hidden shadow-inner group"
      title="Drag to switch theme"
    >
      {/* Dynamic fill background that stretches as you pull */}
      <motion.div 
        style={{ width: backgroundWidth }}
        className="absolute left-0 top-0 bottom-0 bg-black/10 dark:bg-white/20 origin-left"
      />

      {/* "PULL" Label that fades out as you drag */}
      <motion.div 
        style={{ opacity: pullTextOpacity }}
        className="absolute inset-0 flex items-center justify-end pr-4 pointer-events-none"
      >
        <span className="text-[9px] font-heading font-bold tracking-[0.2em] text-gray-500 dark:text-gray-400 select-none">
          PULL
        </span>
      </motion.div>

      {/* The Draggable Thumb */}
      <motion.div
        drag="x"
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ cursor: "grabbing" }}
        className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-[#1a1a1a] shadow-md border border-black/5 dark:border-white/20 cursor-grab"
      >
        <motion.div style={{ rotate: iconRotate }}>
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-black">
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
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
