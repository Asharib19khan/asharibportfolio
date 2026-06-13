"use client";

import { motion } from 'framer-motion';
import { SKILLS } from '../constants/content';

export default function Skills() {
  return (
    <section id="skills" className="relative z-10 w-full py-32 px-6 md:px-12 max-w-[1400px] mx-auto border-t border-white/5">
      <motion.h2 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[12px] font-heading tracking-[0.4em] text-gray-400 mb-20 uppercase"
      >
        Architecture Stack
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
        {SKILLS.map((cat, i) => (
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.05 } }
            }}
            key={i} className="flex flex-col"
          >
            <motion.h3 variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }} className="text-[14px] font-heading font-bold text-white mb-8 tracking-[0.2em] uppercase border-b border-white/10 pb-4">
              {cat.category}
            </motion.h3>
            <div className="flex flex-wrap gap-3">
              {cat.items.map((skill: string, idx: number) => (
                <motion.span 
                  variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1, transition: { type: "spring" as const } } }}
                  key={idx} 
                  className="px-5 py-2 border border-white/10 rounded-full text-xs font-body text-gray-300 bg-white/5 hover:border-white hover:text-white transition-colors duration-300 cursor-default"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
