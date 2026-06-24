"use client";

import { motion } from 'framer-motion';
import { BRAND } from '../../constants/content';
import MagneticButton from '../ui/MagneticButton';

const GithubIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function Contact() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60, damping: 20 } }
  };

  return (
    <section id="contact" className="relative z-10 w-full min-h-[80vh] flex flex-col items-center justify-center px-6 border-t border-black/10 dark:border-white/10 transition-colors duration-700">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col items-center"
      >
        <motion.h2 variants={itemVariants} className="text-[12vw] md:text-[80px] lg:text-[100px] font-heading font-black leading-[0.9] tracking-tighter text-center uppercase mb-16 drop-shadow-sm">
          <span className="text-black dark:text-white transition-colors duration-700">Let's Build</span><br />
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-zinc-800 via-black to-zinc-900 dark:from-zinc-400 dark:via-zinc-600 dark:to-zinc-800">Something.</span>
        </motion.h2>
        
        <motion.div variants={itemVariants} className="relative group/btn z-20 mb-16">
          <div className="absolute -inset-1 bg-gradient-to-r from-zinc-300 via-gray-100 to-zinc-300 dark:from-zinc-500 dark:via-zinc-300 dark:to-zinc-500 rounded-full blur-xl opacity-30 group-hover/btn:opacity-80 transition duration-1000 group-hover/btn:duration-300 animate-pulse pointer-events-none"></div>
          <MagneticButton
            onClick={() => window.location.href = `mailto:${BRAND.email}`}
            className="relative bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/20 text-black dark:text-white font-heading font-bold text-sm md:text-xl tracking-[0.2em] uppercase px-10 py-5 rounded-full flex items-center gap-4 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-xl"
          >
            {BRAND.email}
          </MagneticButton>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center gap-8">
          <a 
            href={BRAND.linkedin} 
            target="_blank" 
            rel="noreferrer"
            className="text-gray-500 hover:text-black dark:text-white transition-colors duration-700 transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-8 h-8" />
          </a>
          <a 
            href={BRAND.github} 
            target="_blank" 
            rel="noreferrer"
            className="text-gray-500 hover:text-black dark:text-white transition-colors duration-700 transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="w-8 h-8" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
