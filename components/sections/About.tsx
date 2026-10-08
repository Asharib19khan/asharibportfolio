"use client";

import { motion } from 'framer-motion';
import { ABOUT } from '../../constants/content';

const ease = [0.16, 1, 0.3, 1] as const;

export default function About({ cinematic }: { cinematic: boolean }) {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className={`relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col justify-center ${
        cinematic ? 'h-screen pt-24 pb-12' : 'py-24 border-t border-line/10'
      }`}
    >
      {cinematic && (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="text-[15vw] font-heading font-bold uppercase tracking-widest text-ink/[0.04]">
            About
          </span>
        </div>
      )}

      <div className="relative z-10 grid gap-10 lg:grid-cols-12 lg:gap-16 lg:items-center">
        <motion.h2
          id="about-title"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease }}
          className="lg:col-span-7 font-heading font-bold text-ink text-[clamp(2.25rem,5.2vw,4.75rem)] leading-[1.02] tracking-[-0.02em]"
        >
          {ABOUT.statement.lead}
          <span className="text-accent">{ABOUT.statement.accent}</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, delay: 0.12, ease }}
          className="lg:col-span-5 flex flex-col gap-8"
        >
          <div className="flex flex-col gap-4 text-[0.95rem] md:text-base text-dim leading-relaxed max-w-[60ch]">
            {ABOUT.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 border-t border-line/10 pt-6">
            {ABOUT.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-heading font-bold uppercase tracking-[0.18em] text-[10px] text-dim mb-1.5">
                  {fact.label}
                </dt>
                <dd className="text-sm md:text-[0.95rem] text-ink leading-snug">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
