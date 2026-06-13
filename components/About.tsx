"use client";

import { useRef } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import { ABOUT } from '../constants/content';

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 50, damping: 20 } }
  };

  return (
    <section ref={ref} id="about" className="relative z-10 w-full min-h-[80vh] flex flex-col justify-center px-6 md:px-12 py-32 max-w-[1400px] mx-auto">
      <div className="absolute inset-0 bg-transparent -z-10"></div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="mb-8 mt-16 px-0 md:px-8"
      >
        <motion.h2 variants={itemVariants} className="text-[12px] font-heading tracking-[0.4em] text-gray-600 dark:text-gray-400 transition-colors duration-700 uppercase">
          About
        </motion.h2>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start px-0 md:px-8 mb-16"
      >
        <motion.div variants={itemVariants} className="lg:col-span-7">
          <h3 className="text-3xl md:text-5xl lg:text-[72px] font-heading font-bold text-black dark:text-white transition-colors duration-700 leading-[1.0] tracking-tight">
            {ABOUT.statement}
          </h3>
        </motion.div>

        <div className="lg:col-span-5 grid grid-cols-2 gap-x-4 md:gap-x-8 gap-y-8 md:gap-y-12">
          {ABOUT.stats.map((stat, i) => (
            <motion.div 
              variants={itemVariants}
              key={i} 
              className="flex flex-col border-l border-black/10 dark:border-white/10 transition-colors duration-700 pl-6"
            >
              <span className="text-5xl md:text-7xl font-heading font-light text-black dark:text-white transition-colors duration-700 mb-2">{stat.value}</span>
              <span className="text-[10px] font-body text-gray-600 dark:text-gray-400 transition-colors duration-700 uppercase tracking-[0.3em]">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
