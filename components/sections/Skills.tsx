"use client";

import { motion } from 'framer-motion';
import { SKILLS } from '../../constants/content';

const CATEGORY_COLORS = [
  "rgba(55,118,171, 0.25)", // Python Blue
  "rgba(247,223,30, 0.15)", // JS Yellow
  "rgba(97,218,251, 0.25)", // React Blue
  "rgba(68,206,123, 0.15)", // Node Green
  "rgba(255,111,0, 0.15)", // AI Orange
  "rgba(51,103,145, 0.25)", // DB Blue
  "rgba(220,38,38, 0.15)", // Cyber Red
  "rgba(240,80,50, 0.15)"  // Git Orange
];

export default function Skills() {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    for (const card of document.getElementsByClassName("spotlight-card")) {
      const rect = (card as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      (card as HTMLElement).style.setProperty("--mouse-x", `${x}px`);
      (card as HTMLElement).style.setProperty("--mouse-y", `${y}px`);
    }
  };

  const handleMouseMoveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -6; 
    const rotateY = ((x - centerX) / centerX) * 6;
    
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeaveCard = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <section id="skills" className="relative z-10 w-full py-32 px-6 md:px-12 max-w-[1400px] mx-auto border-t border-black/10 dark:border-white/10 transition-colors duration-700">
      
      {/* Background Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="text-[15vw] font-black uppercase tracking-widest text-black/5 dark:text-white/5">
          Skills
        </span>
      </div>

      <motion.h2 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[12px] font-heading tracking-[0.4em] text-gray-500 mb-20 uppercase relative z-10 flex items-center gap-4 justify-center md:justify-start"
      >
        <span className="w-12 h-[1px] bg-gray-500/50"></span>
        Architecture Stack
        <span className="w-12 h-[1px] bg-gray-500/50 hidden md:block"></span>
      </motion.h2>
      
      <div 
        className="group/grid grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 lg:grid-rows-2 gap-3 md:gap-4 relative z-10 w-full lg:h-[70vh] lg:min-h-[550px] lg:max-h-[800px]"
        onMouseMove={handleMouseMove}
      >
        {SKILLS.map((cat, i) => {
          // Compute editorial grid spans for a perfect 5x2 single-screen aesthetic
          let gridSpanClass = "";
          let isHeadline = false;
          switch(i) {
            case 0: gridSpanClass = "md:col-span-2 lg:col-span-2 lg:row-span-1"; isHeadline = true; break; // Wide feature
            case 1: gridSpanClass = "md:col-span-1 lg:col-span-1 lg:row-span-1"; break; // Standard block
            case 2: gridSpanClass = "md:col-span-1 lg:col-span-1 lg:row-span-1"; break; // Standard block
            case 3: gridSpanClass = "md:col-span-1 lg:col-span-1 lg:row-span-1"; break; // Standard block
            case 4: gridSpanClass = "md:col-span-1 lg:col-span-1 lg:row-span-1"; break; // Standard block
            case 5: gridSpanClass = "md:col-span-1 lg:col-span-1 lg:row-span-1"; break; // Standard block
            case 6: gridSpanClass = "md:col-span-2 lg:col-span-2 lg:row-span-1"; isHeadline = true; break; // Wide feature
            case 7: gridSpanClass = "md:col-span-1 lg:col-span-1 lg:row-span-1"; break; // Standard block
            default: gridSpanClass = "md:col-span-1 lg:col-span-1 lg:row-span-1";
          }

          return (
            <motion.div 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                show: { opacity: 1, y: 0, transition: { staggerChildren: 0.05, duration: 0.6 } }
              }}
              key={i} 
              className={`flex flex-col h-[280px] lg:h-full ${gridSpanClass}`}
              style={{ perspective: "1000px" }}
            >
              <div 
                className="spotlight-card group relative rounded-3xl bg-black/5 dark:bg-white/[0.05] overflow-hidden flex flex-col h-full w-full transition-transform duration-100 ease-linear will-change-transform shadow-lg dark:shadow-2xl border border-transparent hover:border-black/10 dark:hover:border-white/[0.05]"
                onMouseMove={handleMouseMoveCard}
                onMouseLeave={handleMouseLeaveCard}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* The Border Glow (tracks mouse across the entire grid) */}
                <div 
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/grid:opacity-100 dark:mix-blend-normal mix-blend-multiply"
                  style={{
                    background: `radial-gradient(500px circle at var(--mouse-x) var(--mouse-y), rgba(150,150,150,0.15), transparent 40%)`
                  }}
                />

                {/* The Inner Card Background (leaves 1px gap for the glowing border) */}
                <div className="absolute inset-[1px] bg-white dark:bg-[#070707] rounded-[calc(1.5rem-1px)] z-0" />
                
                {/* The Inner Hover Spotlight (colored based on category) */}
                <div 
                  className="pointer-events-none absolute inset-[1px] opacity-0 transition-opacity duration-500 group-hover:opacity-100 rounded-[calc(1.5rem-1px)] z-0 dark:mix-blend-screen mix-blend-multiply"
                  style={{
                    background: `radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}, transparent 40%)`
                  }}
                />

                {/* Content */}
                <div className="relative z-10 flex flex-col p-5 md:p-7 h-full transform-gpu" style={{ transform: "translateZ(30px)" }}>
                  <h3 className={`${isHeadline ? "text-xl md:text-2xl font-black tracking-widest" : "text-[10px] md:text-[11px] font-bold tracking-[0.25em]"} text-zinc-500 uppercase mb-4 md:mb-6 group-hover:text-black dark:group-hover:text-zinc-100 transition-colors duration-500 border-b border-black/5 dark:border-white/5 pb-3 md:pb-4 leading-tight`}>
                    {cat.category}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {cat.items.map((skill: string, idx: number) => (
                      <motion.span 
                        variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { type: "spring", damping: 12 } } }}
                        key={idx} 
                        className="px-2.5 py-1.5 md:px-3 md:py-1.5 border border-black/5 dark:border-white/5 rounded-lg text-[10px] md:text-[11px] font-medium text-zinc-600 dark:text-zinc-400 bg-black/[0.02] dark:bg-white/[0.02] backdrop-blur-sm group-hover:border-black/20 dark:group-hover:border-white/20 group-hover:text-black dark:group-hover:text-zinc-200 hover:!bg-black dark:hover:!bg-white hover:!text-white dark:hover:!text-black hover:!border-black dark:hover:!border-white transition-all duration-300 cursor-default shadow-sm dark:shadow-lg"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
