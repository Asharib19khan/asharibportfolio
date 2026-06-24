"use client";

import { motion } from 'framer-motion';
import { CERTIFICATIONS } from '../../constants/content';

export default function Certifications() {
  return (
    <section id="certifications" className="relative z-10 w-full py-32 px-6 md:px-12 max-w-[1400px] mx-auto border-t border-black/10 dark:border-white/10 transition-colors duration-700">
      <motion.h2 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-xs md:text-sm font-heading font-bold tracking-[0.4em] text-gray-400 dark:text-gray-500 mb-16 uppercase text-center"
      >
        Certifications
      </motion.h2>
      
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {CERTIFICATIONS.map((cert, i) => (
          <motion.a 
            href={cert.link}
            target="_blank"
            rel="noopener noreferrer"
            key={i}
            variants={{
              hidden: { opacity: 0, y: 30 },
              show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60, damping: 15 } }
            }}
            className="group relative flex items-center justify-center bg-white/5 dark:bg-white/5 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl p-4 hover:bg-white/10 dark:hover:bg-white/10 transition-all duration-500 shadow-lg hover:shadow-2xl cursor-pointer overflow-hidden aspect-[4/3]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200/20 to-transparent dark:from-zinc-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />
            
            <img 
              src={cert.link}
              alt={cert.name}
              className="w-full h-full object-contain rounded-xl transition-transform duration-700 group-hover:scale-[1.02]"
            />
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
