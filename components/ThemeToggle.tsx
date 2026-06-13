"use client";

import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  const ref = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-12 h-12 rounded-full" />;
  }

  const isDark = theme === "dark";

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    // Magnetic pull distance
    mouseX.set((e.clientX - centerX) * 0.3);
    mouseY.set((e.clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <motion.button
      ref={ref}
      onClick={toggleTheme}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="relative flex items-center justify-center w-12 h-12 rounded-full overflow-hidden group shadow-lg dark:shadow-white/5 transition-shadow"
      aria-label="Toggle Dark Mode"
    >
      {/* Background Aurora / Sky */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={false}
        animate={{
          background: isDark 
            ? "radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 1) 0%, rgba(2, 6, 23, 1) 100%)"
            : "radial-gradient(circle at 50% 100%, rgba(253, 186, 116, 1) 0%, rgba(254, 240, 138, 1) 50%, rgba(186, 230, 253, 1) 100%)"
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      
      {/* Stars for Dark Mode */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={false}
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute top-[20%] left-[30%] w-[1.5px] h-[1.5px] bg-white rounded-full opacity-60" />
        <div className="absolute top-[40%] left-[70%] w-[2px] h-[2px] bg-white rounded-full opacity-80" />
        <div className="absolute top-[70%] left-[20%] w-[1px] h-[1px] bg-white rounded-full opacity-40" />
        <div className="absolute top-[80%] left-[60%] w-[1.5px] h-[1.5px] bg-white rounded-full opacity-50" />
        <div className="absolute top-[10%] left-[80%] w-[1px] h-[1px] bg-white rounded-full opacity-70" />
      </motion.div>

      {/* The Sun / Moon SVG */}
      <motion.div className="relative z-10 w-6 h-6 flex items-center justify-center">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <mask id="moon-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <motion.circle 
              r="9" 
              fill="black"
              initial={false}
              animate={{ 
                cx: isDark ? 16 : 30, 
                cy: isDark ? 8 : -10 
              }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            />
          </mask>

          {/* Core Body */}
          <motion.circle 
            cx="12" 
            cy="12" 
            mask="url(#moon-mask)"
            initial={false}
            animate={{
              r: isDark ? 9 : 5,
              fill: isDark ? "#ffffff" : "#f59e0b",
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
          />

          {/* Sun Rays */}
          <motion.g 
            stroke="#f59e0b" 
            strokeWidth="2" 
            strokeLinecap="round"
            initial={false}
            animate={{ 
              opacity: isDark ? 0 : 1,
              scale: isDark ? 0.5 : 1,
              rotate: isDark ? -90 : 0
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
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
        </svg>
      </motion.div>
      
      {/* Front Glass Reflection */}
      <div className="absolute inset-0 z-20 rounded-full shadow-[inset_0_1px_3px_rgba(255,255,255,0.4)] pointer-events-none" />
      <div className="absolute inset-0 z-20 rounded-full border border-black/10 dark:border-white/10 pointer-events-none" />
    </motion.button>
  );
}
