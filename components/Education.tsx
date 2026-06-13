"use client";

import { motion } from 'framer-motion';

const EDUCATION_DATA = [
  {
    institution: "FAST-NUCES Karachi",
    degree: "BS FinTech",
    date: "Current",
    details: "Focusing on financial technology, algorithms, and autonomous financial pipelines."
  }
];

export default function Education() {
  return (
    <section id="education" className="relative z-10 w-full py-32 px-6 md:px-12 max-w-[1400px] mx-auto border-t border-white/5">
      <motion.h2 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[12px] font-heading tracking-[0.4em] text-gray-400 mb-20 uppercase"
      >
        Education
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
      >
        {EDUCATION_DATA.map((edu, i) => (
          <motion.div 
            key={i}
            variants={{
              hidden: { opacity: 0, y: 100 },
              show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 60, damping: 20 } }
            }}
            className="flex flex-col justify-between bg-white/5 backdrop-blur-xl border-[0.5px] border-white/10 rounded-[24px] p-10 transition-colors duration-500 hover:border-white/30 hover:bg-white/10"
          >
            <div>
              <h3 className="text-3xl font-heading font-bold text-white mb-2">
                {edu.institution}
              </h3>
              <p className="text-[12px] font-heading tracking-[0.3em] text-white/50 uppercase mb-8">
                {edu.degree}
              </p>
              <p className="text-gray-400 font-body text-base leading-[1.8] mb-8">
                {edu.details}
              </p>
            </div>
            
            <div className="border-t border-white/10 pt-6">
              <span className="text-[11px] font-heading uppercase tracking-[0.3em] text-gray-400">
                {edu.date}
              </span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
