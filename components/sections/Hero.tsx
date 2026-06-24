"use client";

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BRAND } from '../../constants/content';
import MagneticButton from '../ui/MagneticButton';
import { SplineScene } from "@/components/ui/splite";
const ArrowRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);
const Sparkles = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
);
const Mail = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const Linkedin = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);
const Github = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

export default function Hero() {
  return (
    <section id="home" className="relative w-full h-screen flex flex-col items-center justify-center px-6 z-10 overflow-hidden bg-white dark:bg-[#050505] transition-colors duration-700">

      <div className="flex w-full h-full max-w-[1400px] mx-auto items-center">
        {/* Left content: Massive Spline Robot */}
        <div className="flex-1 relative h-full w-full hidden md:block pointer-events-none">
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full absolute scale-[1.15] origin-center translate-y-12 -left-10"
          />
        </div>

        {/* Right content: Hero Text */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center items-start text-left">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-5xl md:text-[80px] font-heading font-black transition-colors duration-700 leading-[0.9] uppercase mb-6 bg-clip-text text-transparent bg-gradient-to-br from-zinc-800 via-black to-zinc-900 dark:from-zinc-400 dark:via-zinc-600 dark:to-zinc-800 drop-shadow-sm"
          >
            {BRAND.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-gray-600 dark:text-gray-400 transition-colors duration-700 font-body text-sm md:text-lg tracking-[0.3em] uppercase max-w-lg mb-10"
          >
            {BRAND.role}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col gap-6 z-20 magnetic"
          >
            {/* First row of buttons */}
            <div className="flex flex-wrap gap-4 items-center">
              <div className="relative group/btn z-20">
                <div className="absolute -inset-1 bg-gradient-to-r from-zinc-300 via-gray-100 to-zinc-300 dark:from-zinc-500 dark:via-zinc-300 dark:to-zinc-500 rounded-full blur-md opacity-40 group-hover/btn:opacity-100 transition duration-1000 group-hover/btn:duration-300 animate-pulse pointer-events-none"></div>
                <MagneticButton
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="relative bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-black/10 dark:border-white/20 text-black dark:text-white font-heading font-bold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full flex items-center gap-2 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 shadow-xl"
                >
                  View Projects <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </div>

              <MagneticButton
                onClick={() => window.location.href = `mailto:${BRAND.email}`}
                className="bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white font-heading font-bold text-xs tracking-[0.2em] uppercase px-8 py-4 rounded-full flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                Better call saul <ArrowRight className="w-4 h-4 opacity-70" />
              </MagneticButton>
            </div>

            {/* Second row of icon buttons */}
            <div className="flex gap-4 items-center pl-2">
              <MagneticButton
                onClick={() => window.location.href = `mailto:${BRAND.email}`}
                className="flex items-center justify-center w-12 h-12 rounded-full border border-black/20 dark:border-white/20 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton
                onClick={() => window.open(BRAND.linkedin, '_blank')}
                className="flex items-center justify-center w-12 h-12 rounded-full border border-black/20 dark:border-white/20 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton
                onClick={() => window.open(BRAND.github, '_blank')}
                className="flex items-center justify-center w-12 h-12 rounded-full border border-black/20 dark:border-white/20 bg-transparent hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
                aria-label="Github"
              >
                <Github className="w-4 h-4" />
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Elegant Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none"
      >
        <span className="text-[10px] uppercase tracking-[0.4em] font-heading text-gray-500">Scroll</span>
        <div className="w-[1px] h-16 bg-black/5 dark:bg-white/5 transition-colors duration-700 relative overflow-hidden">
          <motion.div
            animate={{ y: ['-100%', '100%'] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute top-0 left-0 w-full h-full bg-white"
          />
        </div>
      </motion.div>
    </section>
  );
}
