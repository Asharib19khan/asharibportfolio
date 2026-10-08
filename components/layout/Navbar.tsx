"use client";

import { useEffect, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import ThemeToggle from '../ui/ThemeToggle';
import { SECTIONS, SECTION_PROGRESS, SectionId, scrollToSection } from '../../lib/scroll';

export default function Navbar({ cinematic }: { cinematic: boolean }) {
  const [activeId, setActiveId] = useState<SectionId>('home');
  const [hidden, setHidden] = useState(false);
  const [hoveredId, setHoveredId] = useState<SectionId | null>(null);

  const { scrollY, scrollYProgress } = useScroll();

  // Smart hide on scroll down
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    setHidden(latest > previous && latest > 150);
  });

  // Pinned layout: the closest section stop to the current scroll progress is active.
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!cinematic) return;
    let closest = 0;
    SECTION_PROGRESS.forEach((p, i) => {
      if (Math.abs(latest - p) < Math.abs(latest - SECTION_PROGRESS[closest])) closest = i;
    });
    setActiveId(SECTIONS[closest].id);
  });

  // Flow layout: whichever section crosses the middle of the viewport is active.
  useEffect(() => {
    if (cinematic) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id as SectionId);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [cinematic]);

  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-150%", opacity: 0 }
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      // Centred with flex, not translate: framer-motion owns this element's transform.
      className="fixed top-4 md:top-6 inset-x-0 z-50 flex justify-center px-4 pointer-events-none [&>nav]:pointer-events-auto"
    >
      <nav
        aria-label="Sections"
        className="flex items-center gap-0.5 md:gap-1 p-1.5 rounded-full bg-paper/80 backdrop-blur-md shadow-[0_8px_30px_-12px_rgb(var(--ink)/0.25)] border border-line/10 relative max-w-full overflow-x-auto no-scrollbar"
        onMouseLeave={() => setHoveredId(null)}
      >
        {SECTIONS.map((item) => {
          const isActive = activeId === item.id;
          const isHovered = hoveredId === item.id;

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(item.id);
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              className={`relative px-2 sm:px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-heading tracking-[0.04em] sm:tracking-[0.1em] uppercase transition-colors duration-300 z-10 whitespace-nowrap ${
                isActive ? 'text-ink font-bold' : 'text-dim hover:text-ink'
              }`}
            >
              {item.label}

              {isActive && (
                <motion.div
                  layoutId="activeNavIndicator"
                  className="absolute inset-0 bg-ink/[0.08] border border-line/10 rounded-full -z-10"
                  transition={{ type: "spring" as const, bounce: 0.15, duration: 0.5 }}
                />
              )}

              {isHovered && !isActive && (
                <motion.div
                  layoutId="hoverNavIndicator"
                  className="absolute inset-0 bg-ink/[0.04] rounded-full -z-20"
                  transition={{ type: "spring" as const, bounce: 0.15, duration: 0.4 }}
                />
              )}
            </a>
          );
        })}

        <div className="w-px h-6 bg-line/10 mx-0.5 sm:mx-1 shrink-0" />
        <ThemeToggle />
      </nav>
    </motion.header>
  );
}
