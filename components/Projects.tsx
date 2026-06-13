"use client";

import { motion } from 'framer-motion';
import { PROJECTS } from '../constants/content';
import TiltCard from './TiltCard';
import ScrambleText from './ScrambleText';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" x2="21" y1="14" y2="3" />
  </svg>
);

function ProjectCard({ proj }: { proj: any }) {
  return (
    <TiltCard className="project-card h-full min-h-[400px]">
      <div className="p-6 md:p-10 flex flex-col h-full justify-between">
        <div>
          <h3 className="text-2xl md:text-[40px] font-heading font-bold text-black dark:text-white transition-colors duration-700 mb-6 leading-[1.1] tracking-tight hover:text-black dark:text-white transition-colors duration-700 transition-colors">
            <ScrambleText text={proj.title} />
          </h3>
          <p className="text-gray-600 dark:text-gray-400 transition-colors duration-700 font-body text-base leading-[1.8] mb-8">
            {proj.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-12">
            {proj.tech.map((t: string, idx: number) => (
              <span key={idx} className="text-[10px] font-heading tracking-[0.2em] uppercase text-black dark:text-white transition-colors duration-700 bg-black/5 dark:bg-white/5 transition-colors duration-700 px-4 py-2 rounded-full cursor-crosshair hover:bg-black/5 dark:bg-white/5 transition-colors duration-700 transition-colors">
                <ScrambleText text={t} />
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-auto border-t border-black/10 dark:border-white/10 transition-colors duration-700 pt-6">
          {proj.github && (
            <a 
              href={proj.github} 
              target="_blank" 
              rel="noreferrer"
              className="magnetic flex items-center gap-2 text-[11px] font-heading uppercase tracking-[0.3em] text-gray-600 dark:text-gray-400 transition-colors duration-700 hover:text-black dark:text-white transition-colors duration-700 transition-colors"
            >
              <GithubIcon className="w-4 h-4" /> Source
            </a>
          )}
          {proj.link && proj.link !== proj.github && (
            <a 
              href={proj.link} 
              target="_blank" 
              rel="noreferrer"
              className="magnetic flex items-center gap-2 text-[11px] font-heading uppercase tracking-[0.3em] text-gray-600 dark:text-gray-400 transition-colors duration-700 hover:text-black dark:text-white transition-colors duration-700 transition-colors"
            >
              <ExternalLinkIcon className="w-4 h-4" /> Live
            </a>
          )}
        </div>
      </div>
    </TiltCard>
  );
}

export default function Projects() {
  const headingChars = "Selected Works".split("");
  
  return (
    <section id="projects" className="relative z-10 w-full py-32 px-6 md:px-12 max-w-[1400px] mx-auto border-t border-black/10 dark:border-white/10 transition-colors duration-700">
      <motion.h2 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
          hidden: {}
        }}
        className="flex text-[12px] font-heading tracking-[0.4em] text-gray-600 dark:text-gray-400 transition-colors duration-700 mb-20 uppercase overflow-hidden"
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
      
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.15 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        style={{ perspective: 2000 }}
      >
        {PROJECTS.map((proj, i) => (
          <motion.div key={i} variants={{
            hidden: { opacity: 0, scale: 0.8, y: 100 },
            show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" as const, stiffness: 60, damping: 20 } }
          }} className="h-full">
            <ProjectCard proj={proj} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
