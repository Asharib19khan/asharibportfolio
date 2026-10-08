"use client";

import { motion } from 'framer-motion';
import { BRAND } from '../../constants/content';
import MagneticButton from '../ui/MagneticButton';
import { ArrowUpRight, Github, Instagram, Linkedin } from '../ui/icons';

const ease = [0.16, 1, 0.3, 1] as const;

export default function Contact({ cinematic }: { cinematic: boolean }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease } }
  };

  return (
    <section
      id="contact"
      className={`relative z-10 w-full flex flex-col items-center justify-center px-6 ${
        cinematic ? 'h-screen' : 'min-h-[80svh] py-24 border-t border-line/10'
      }`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="flex flex-col items-center w-full"
      >
        <motion.h2 variants={itemVariants} className="text-[clamp(2.75rem,11vw,6rem)] font-heading font-bold leading-[0.92] tracking-[-0.01em] text-center uppercase mb-12 md:mb-16 text-ink">
          Let&apos;s Build<br />
          <span className="text-dim">Something.</span>
        </motion.h2>

        <motion.div variants={itemVariants} className="mb-12 md:mb-16 max-w-full">
          <MagneticButton
            href={`mailto:${BRAND.email}`}
            className="group/btn bg-ink text-paper font-heading font-bold text-xs sm:text-sm md:text-lg tracking-[0.14em] md:tracking-[0.2em] uppercase px-6 sm:px-10 py-5 rounded-full flex items-center gap-3 md:gap-4 shadow-[0_18px_40px_-18px_rgb(var(--ink)/0.55)] hover:bg-accent transition-colors duration-300 max-w-full"
          >
            <span className="truncate">{BRAND.email}</span>
            <ArrowUpRight className="w-5 h-5 shrink-0 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
          </MagneticButton>
        </motion.div>

        <motion.div variants={itemVariants} className="flex items-center gap-8">
          <a
            href={BRAND.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim hover:text-ink transition-colors duration-300"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-8 h-8" />
          </a>
          <a
            href={BRAND.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim hover:text-ink transition-colors duration-300"
            aria-label="GitHub"
          >
            <Github className="w-8 h-8" />
          </a>
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim hover:text-ink transition-colors duration-300"
            aria-label="Instagram"
          >
            <Instagram className="w-8 h-8" />
          </a>
        </motion.div>

        <motion.p variants={itemVariants} className="mt-14 text-[11px] text-dim/80 text-center max-w-md">
          Hero head scan:{' '}
          <a
            href="https://www.ir-ltd.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-ink transition-colors"
          >
            &ldquo;Infinite&rdquo; by Lee Perry-Smith
          </a>
          , licensed{' '}
          <a
            href="https://creativecommons.org/licenses/by/3.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-ink transition-colors"
          >
            CC BY 3.0
          </a>
          . Android shell and skin effect are original.
        </motion.p>
      </motion.div>
    </section>
  );
}
