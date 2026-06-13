"use client";

import { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

// Matching SphereLayout chunks:
// c0=0, c1=1/6, c2=2/6, c3=3/6, c4=4/6, c5=5/6, c6=1
const NAV_ITEMS = [
  { id: 'home', label: 'Home', chunk: 0 },
  { id: 'about', label: 'About', chunk: 1/6 },
  { id: 'skills', label: 'Skills', chunk: 2/6 },
  { id: 'projects', label: 'Projects', chunk: 3/6 },
  { id: 'education', label: 'Education', chunk: 4/6 },
  { id: 'achievements', label: 'Achievements', chunk: 5/6 },
  { id: 'contact', label: 'Contact', chunk: 1 },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState('home');
  const [hidden, setHidden] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const { scrollY, scrollYProgress } = useScroll();

  // Smart Hide on Scroll Down
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  // Track active section based on scroll progress chunks
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Find the closest chunk
    let closestId = 'home';
    let minDiff = Infinity;
    
    NAV_ITEMS.forEach(item => {
      const diff = Math.abs(latest - item.chunk);
      if (diff < minDiff) {
        minDiff = diff;
        closestId = item.id;
      }
    });
    
    setActiveId(closestId);
  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, chunk: number) => {
    e.preventDefault();
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const targetY = docHeight * chunk;
    
    window.scrollTo({
      top: targetY,
      behavior: 'smooth'
    });
  };

  return (
    <motion.div 
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 pointer-events-auto"
    >
      <nav 
        className="flex items-center gap-1 p-1.5 rounded-full bg-white/40 dark:bg-black/20 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-black/5 dark:border-white/10 relative overflow-x-auto max-w-[90vw] no-scrollbar transition-colors duration-700"
        onMouseLeave={() => setHoveredId(null)}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;
          
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.chunk)}
              onMouseEnter={() => setHoveredId(item.id)}
              className={`relative px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-heading tracking-[0.1em] uppercase transition-colors duration-300 z-10 whitespace-nowrap ${
                isActive ? 'text-black dark:text-white font-bold' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              {item.label}
              
              {isActive && (
                <motion.div 
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-white/60 dark:bg-white/10 border border-black/5 dark:border-white/20 rounded-full -z-10 shadow-[0_0_15px_rgba(0,0,0,0.05)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  transition={{ type: "spring" as const, bounce: 0.15, duration: 0.5 }}
                />
              )}
              
              {isHovered && !isActive && (
                <motion.div 
                  layoutId="hoverNavIndicator"
                  className="absolute inset-0 bg-white/40 dark:bg-white/5 rounded-full -z-20"
                  transition={{ type: "spring" as const, bounce: 0.15, duration: 0.4 }}
                />
              )}
            </a>
          );
        })}

        <div className="w-[1px] h-6 bg-black/10 dark:bg-white/10 mx-1 transition-colors duration-700" />
        <ThemeToggle />
      </nav>
    </motion.div>
  );
}
