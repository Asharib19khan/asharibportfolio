"use client";

import { motion } from 'framer-motion';
import { CERTIFICATIONS } from '../constants/content';

export default function Certifications() {
  return (
    <section id="achievements" className="relative z-10 w-full py-32 px-6 md:px-12 max-w-[1400px] mx-auto border-t border-white/5">
      <motion.h2 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[12px] font-heading tracking-[0.4em] text-gray-400 mb-16 uppercase"
      >
        Achievements
      </motion.h2>
      
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {CERTIFICATIONS.map((cert, i) => (
          <motion.div 
            key={i}
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              show: { opacity: 1, scale: 1, transition: { type: "spring" } }
            }}
            className="flex flex-col justify-center bg-white/5 border-[0.5px] border-white/10 rounded-[16px] p-6 transition-colors duration-300 hover:border-white/30 hover:bg-white/10"
          >
            <h3 className="text-[15px] font-body font-bold text-white mb-3">
              {cert.name}
            </h3>
            <div className="flex justify-between items-center w-full">
              <span className="text-[12px] font-body text-gray-400 uppercase tracking-[0.1em]">{cert.org}</span>
              <span className="text-[11px] font-heading text-white/50 tracking-[0.2em]">{cert.date}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
