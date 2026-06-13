"use client";

import { useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar() {
  const [activeId, setActiveId] = useState('home');
  const [hidden, setHidden] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  const { scrollY } = useScroll();

  // Smart Hide on Scroll Down
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  useEffect(() => {
    // Setup ScrollTriggers for each section to detect active state
    NAV_ITEMS.forEach(({ id }) => {
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => {
          if (self.isActive) setActiveId(id);
        }
      });
    });
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.offsetTop,
        behavior: 'smooth'
      });
    }
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
        className="flex items-center gap-1 p-1.5 rounded-full bg-black/10 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-white/10 relative"
        onMouseLeave={() => setHoveredId(null)}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;
          
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => handleClick(e, item.id)}
              onMouseEnter={() => setHoveredId(item.id)}
              className={`relative px-5 py-2.5 rounded-full text-xs font-heading tracking-[0.1em] uppercase transition-colors duration-300 z-10 ${
                isActive ? 'text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
              
              {/* Fluid Active Background (Minimalist Glow) */}
              {isActive && (
                <motion.div 
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-white/10 border border-white/20 rounded-full -z-10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                />
              )}
              
              {/* Fluid Hover Background */}
              {isHovered && !isActive && (
                <motion.div 
                  layoutId="hoverNavIndicator"
                  className="absolute inset-0 bg-white/5 rounded-full -z-20"
                  transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                />
              )}
            </a>
          );
        })}
      </nav>
    </motion.div>
  );
}
