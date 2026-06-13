"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BRAND } from '../constants/content';
import MagneticButton from './MagneticButton';
import { SplineScene } from "@/components/ui/splite";
import { Spotlight } from "@/components/ui/spotlight";

export default function Hero() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 768);
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  return (
    <section id="home" className="relative w-full h-screen flex flex-col items-center justify-center px-6 z-10 overflow-hidden bg-[#050505]">
      {/* Dramatic Spotlight from the top left */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" size={150} />

      <div className="flex w-full h-full max-w-[1400px] mx-auto items-center">
        {/* Left content: Massive Spline Robot */}
        <div className="flex-1 relative h-full w-full hidden md:block">
          {isDesktop && (
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full absolute scale-[1.15] origin-center translate-y-12 -left-10"
            />
          )}
        </div>

        {/* Right content: Hero Text */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center items-start text-left">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="text-5xl md:text-[80px] font-heading font-black text-white leading-[0.9] uppercase mb-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400"
          >
            {BRAND.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
            className="text-gray-400 font-body text-sm md:text-lg tracking-[0.3em] uppercase max-w-lg mb-10"
          >
            {BRAND.role}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex gap-6 z-20 magnetic"
          >
            <MagneticButton
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-black font-heading font-bold text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-gray-200 transition-colors rounded-full"
            >
              View Work
            </MagneticButton>
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
        <div className="w-[1px] h-16 bg-white/10 relative overflow-hidden">
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
