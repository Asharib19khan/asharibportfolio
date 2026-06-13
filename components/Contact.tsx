"use client";

import { motion } from 'framer-motion';
import { BRAND } from '../constants/content';

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
    <section id="contact" className="relative z-10 w-full min-h-[80vh] flex flex-col items-center justify-center px-6 border-t border-white/5">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col items-center"
      >
        <motion.h2 variants={itemVariants} className="text-[12vw] md:text-[80px] lg:text-[100px] font-heading font-black text-white leading-[0.9] tracking-tighter text-center uppercase mb-12">
          Let's Build<br />
          <span className="text-gray-400">Something.</span>
        </motion.h2>
        
        <motion.a 
          variants={itemVariants}
          href={`mailto:${BRAND.email}`}
          className="text-lg md:text-2xl font-heading text-white border-b border-white/20 pb-2 mb-12 hover:text-gray-300 hover:border-gray-300 transition-colors tracking-wide"
        >
          {BRAND.email}
        </motion.a>

        <motion.div variants={itemVariants} className="flex items-center gap-8">
          <a 
            href={BRAND.linkedin} 
            target="_blank" 
            rel="noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="w-8 h-8" />
          </a>
          <a 
            href={BRAND.github} 
            target="_blank" 
            rel="noreferrer"
            className="text-gray-500 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="w-8 h-8" />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
