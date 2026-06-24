"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../../constants/content';

export default function Projects() {
  const headingChars = "Projects".split("");
  // Keep the first project expanded by default
  const [active, setActive] = useState<number>(0);

  return (
    <section id="projects" className="relative w-full py-24 px-4 md:px-8 max-w-[1400px] mx-auto border-t border-black/10 dark:border-white/10 transition-colors duration-700 min-h-screen flex flex-col justify-center">
      
      {/* Background Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
        <span className="text-[15vw] font-black uppercase tracking-widest text-black/5 dark:text-white/5">
          Project
        </span>
      </div>

      <motion.h2 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
          hidden: {}
        }}
        className="flex justify-center text-xl md:text-2xl font-heading tracking-[0.4em] text-gray-600 dark:text-gray-400 mb-12 uppercase overflow-hidden relative z-10"
      >
        {headingChars.map((char, index) => (
          <motion.span 
            key={index} 
            variants={{
              hidden: { y: "100%", opacity: 0 },
              visible: { y: "0%", opacity: 1, transition: { type: "spring" as const, damping: 15 } }
            }}
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.h2>
      
      {/* 
        Hover Accordion Gallery:
        This fits perfectly on one screen, using flex-grow transitions
        to elegantly expand the hovered project while collapsing the rest.
      */}
      <div className="w-full relative z-40 mx-auto max-w-7xl h-[65vh] min-h-[550px] max-h-[750px] flex gap-3 md:gap-4">
        {PROJECTS.map((proj, idx) => {
          const isActive = active === idx;
          
          return (
            <div
              key={idx}
              onMouseEnter={() => setActive(idx)}
              className={`group relative h-full rounded-3xl overflow-hidden cursor-pointer shadow-2xl transition-[flex] duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? "flex-[6] md:flex-[8] bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-white via-gray-50 to-gray-200 dark:from-zinc-800/40 dark:via-zinc-950/90 dark:to-black border border-black/10 dark:border-white/20 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.05)]" : "flex-[1] bg-gradient-to-b from-gray-100 to-gray-200 dark:from-zinc-900/30 dark:to-black border border-black/5 hover:border-black/10 dark:border-white/5 dark:hover:border-white/10"}`}
            >
              <div className={`absolute inset-0 bg-black/[0.03] dark:bg-white/[0.03] opacity-0 transition-opacity duration-500 pointer-events-none ${!isActive && 'group-hover:opacity-100'}`} />

              {/* Active State Content */}
              <div 
                className={`absolute inset-0 p-6 md:p-10 flex flex-col justify-between transition-all duration-500 min-w-[300px] md:min-w-[600px] ${isActive ? "opacity-100 delay-200 translate-x-0 z-20" : "opacity-0 -translate-x-8 pointer-events-none z-0"}`}
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-black/10 dark:from-white/10 to-transparent border border-black/10 dark:border-white/20 flex items-center justify-center text-black dark:text-white shadow-[0_0_20px_rgba(0,0,0,0.05)] dark:shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                  </div>
                  {proj.link || proj.github ? (
                    <a href={proj.link || proj.github} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-full border border-black/10 dark:border-white/20 flex items-center justify-center gap-2.5 bg-gradient-to-r from-black/5 dark:from-white/10 to-transparent dark:to-white/5 text-black dark:text-white hover:from-black hover:to-black hover:text-white dark:hover:from-white dark:hover:to-white dark:hover:text-black transition-all duration-300 hover:scale-105 pointer-events-auto shadow-sm dark:shadow-lg backdrop-blur-md">
                      <span className="text-xs font-bold tracking-wider">GITHUB REPO</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                      </svg>
                    </a>
                  ) : (
                    <div className="px-4 py-2 md:px-5 md:py-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 flex items-center justify-center bg-black/5 dark:bg-black/40 text-zinc-500 pointer-events-none shadow-inner backdrop-blur-md">
                      <span className="text-[8px] md:text-[9px] font-bold tracking-widest uppercase text-center">Github repo not available for live products</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-end flex-grow mt-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-4 tracking-tight drop-shadow-md dark:drop-shadow-2xl">{proj.title}</h3>
                  <p className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6 max-w-2xl">{proj.description}</p>
                  
                  {proj.purpose && (
                    <div className="mb-8 p-4 md:p-5 rounded-2xl bg-gradient-to-r from-black/[0.03] dark:from-white/[0.05] to-transparent border border-black/5 dark:border-white/10 max-w-2xl backdrop-blur-sm shadow-inner">
                      <p className="text-xs md:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed flex flex-col md:flex-row md:items-center gap-2 md:gap-3"><span className="font-bold text-black dark:text-white uppercase tracking-wider text-[10px] bg-black/10 dark:bg-white/10 px-2.5 py-1 rounded-md inline-block w-max">Target Market</span> {proj.purpose}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2.5">
                    {proj.tech.map((t, i) => (
                      <span key={i} className="px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-md text-[11px] font-medium text-black/70 dark:text-white/70 tracking-wide shadow-sm">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Inactive State Content (Vertical Title) */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 pointer-events-none ${isActive ? "opacity-0 scale-50" : "opacity-100 delay-200 scale-100"}`}>
                <span className="whitespace-nowrap -rotate-90 origin-center text-black/30 dark:text-white/30 font-bold tracking-[0.3em] text-[10px] md:text-xs uppercase group-hover:text-black/80 dark:group-hover:text-white/80 transition-colors duration-300">
                  {proj.title}
                </span>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
