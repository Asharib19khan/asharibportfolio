"use client";

import { motion } from 'framer-motion';
import { SKILLS } from '../../constants/content';

// Editorial 5x2 grid on wide screens: two wide feature tiles, the rest standard.
const WIDE_TILES = new Set([0, 6]);

export default function Skills({ cinematic }: { cinematic: boolean }) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    for (const card of e.currentTarget.querySelectorAll<HTMLElement>("[data-spotlight]")) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }
  };

  const handleMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cinematic) return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -6;
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeaveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = '';
  };

  return (
    <section
      id="skills"
      className={`relative z-10 w-full px-6 md:px-12 max-w-[1400px] mx-auto flex flex-col ${
        cinematic ? 'h-screen pt-28 pb-10 justify-center' : 'py-24 border-t border-line/10'
      }`}
    >
      {cinematic && (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="text-[15vw] font-heading font-bold uppercase tracking-widest text-ink/[0.04]">
            Skills
          </span>
        </div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-[12px] font-heading tracking-[0.4em] text-dim mb-10 lg:mb-12 uppercase relative z-10 flex items-center gap-4 justify-center md:justify-start"
      >
        <span aria-hidden="true" className="w-12 h-px bg-ink/30"></span>
        Architecture Stack
        <span aria-hidden="true" className="w-12 h-px bg-ink/30 hidden md:block"></span>
      </motion.h2>

      <div
        className={`group/grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 lg:grid-rows-2 gap-3 md:gap-4 relative z-10 w-full ${
          cinematic ? 'lg:flex-1 lg:min-h-0 lg:max-h-[680px]' : ''
        }`}
        onMouseMove={handleMouseMove}
      >
        {SKILLS.map((cat, i) => {
          const isHeadline = WIDE_TILES.has(i);
          return (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              variants={{
                hidden: { opacity: 0, y: 24 },
                show: { opacity: 1, y: 0, transition: { staggerChildren: 0.04, duration: 0.6 } }
              }}
              key={cat.category}
              className={`flex flex-col min-h-[200px] lg:min-h-0 lg:h-full ${isHeadline ? 'sm:col-span-2 lg:col-span-2' : ''}`}
            >
              <div
                data-spotlight
                className="group relative rounded-3xl bg-ink/[0.06] overflow-hidden flex flex-col h-full w-full transition-transform duration-100 ease-linear will-change-transform"
                onMouseMove={handleMouseMoveCard}
                onMouseLeave={handleMouseLeaveCard}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Border glow that tracks the cursor across the whole grid */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/grid:opacity-100"
                  style={{ background: `radial-gradient(420px circle at var(--mouse-x) var(--mouse-y), rgb(var(--ink) / 0.22), transparent 40%)` }}
                />

                {/* Inner surface, leaving a 1px rim for the glow */}
                <div aria-hidden="true" className="absolute inset-px bg-surface rounded-[calc(1.5rem-1px)] z-0" />

                {/* Inner spotlight in the accent colour */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-[calc(1.5rem-1px)] z-0"
                  style={{ background: `radial-gradient(360px circle at var(--mouse-x) var(--mouse-y), rgb(var(--accent) / 0.12), transparent 45%)` }}
                />

                <div className="relative z-10 flex flex-col p-5 md:p-7 h-full" style={{ transform: "translateZ(30px)" }}>
                  <h3 className={`${isHeadline ? "text-xl md:text-2xl font-bold tracking-[0.12em]" : "text-[11px] font-bold tracking-[0.25em]"} text-dim uppercase mb-5 group-hover:text-ink transition-colors duration-500 border-b border-line/10 pb-3 md:pb-4 leading-tight`}>
                    {cat.category}
                  </h3>

                  <ul className="flex flex-wrap gap-2 mt-auto">
                    {cat.items.map((skill: string) => (
                      <motion.li
                        variants={{ hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1, transition: { type: "spring", damping: 14 } } }}
                        key={skill}
                        className="px-2.5 py-1.5 border border-line/10 rounded-lg text-[11px] font-medium text-dim group-hover:border-line/20 group-hover:text-ink hover:!bg-ink hover:!text-paper hover:!border-ink transition-colors duration-300 cursor-default"
                      >
                        {skill}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
