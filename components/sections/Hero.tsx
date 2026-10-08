"use client";

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { BRAND } from '../../constants/content';
import MagneticButton from '../ui/MagneticButton';
import Particles from '../ui/Particles';
import { ArrowRight, Github, Linkedin, Mail } from '../ui/icons';
import { scrollToSection } from '../../lib/scroll';
import { JAB_EVENT } from '../../lib/bot';

const SparringBot = dynamic(() => import('../hero/SparringBot'), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero({ cinematic }: { cinematic: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative w-full h-[100svh] min-h-[620px] lg:h-screen overflow-hidden bg-paper"
    >
      {cinematic && <Particles />}

      <div className="relative z-10 grid h-full w-full max-w-[1400px] mx-auto grid-rows-[minmax(0,1fr)_auto] lg:grid-rows-1 lg:grid-cols-2 lg:items-center">
        <div className="relative h-full min-h-0 lg:order-none">
          <SparringBot interactRef={sectionRef} className="absolute inset-0 cursor-crosshair touch-pan-y" />
          <div className="absolute bottom-3 left-6 lg:bottom-16 lg:left-12 z-10 flex items-center gap-3 text-[11px] text-dim">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(JAB_EVENT))}
              className="rounded-full border border-line/20 px-3 py-1.5 font-heading font-bold uppercase tracking-[0.18em] text-ink hover:border-accent hover:text-accent transition-colors"
            >
              Spar
            </button>
            <span className="hidden sm:inline">Shadow mode: it follows your cursor. Click to throw a jab.</span>
            <span className="sm:hidden">Tap the bot to throw a jab.</span>
          </div>
        </div>

        <div className="relative px-6 pb-10 pt-2 md:px-12 lg:p-8 flex flex-col items-start text-left">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease }}
            className="text-[clamp(2.75rem,7.5vw,6rem)] font-heading font-bold leading-[0.92] tracking-[-0.01em] uppercase mb-5 text-ink"
          >
            {BRAND.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
            className="text-dim font-body text-xs md:text-sm tracking-[0.16em] uppercase max-w-md leading-relaxed mb-8 md:mb-10"
          >
            {BRAND.role}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5, ease }}
            className="flex flex-col gap-5"
          >
            <div className="flex flex-wrap gap-3 items-center">
              <MagneticButton
                onClick={() => scrollToSection('projects')}
                className="bg-ink text-paper font-heading font-bold text-xs tracking-[0.2em] uppercase px-7 py-4 rounded-full flex items-center gap-2 shadow-[0_10px_30px_-12px_rgb(var(--ink)/0.5)] hover:bg-accent transition-colors duration-300"
              >
                View Projects <ArrowRight className="w-4 h-4" />
              </MagneticButton>

              <MagneticButton
                href={`mailto:${BRAND.email}`}
                className="border border-line/25 text-ink font-heading font-bold text-xs tracking-[0.2em] uppercase px-7 py-4 rounded-full flex items-center gap-2 hover:border-ink transition-colors"
              >
                Better call saul <ArrowRight className="w-4 h-4 opacity-70" />
              </MagneticButton>
            </div>

            <div className="flex gap-3 items-center">
              {[
                { href: `mailto:${BRAND.email}`, label: 'Email', Icon: Mail, external: false },
                { href: BRAND.linkedin, label: 'LinkedIn', Icon: Linkedin, external: true },
                { href: BRAND.github, label: 'GitHub', Icon: Github, external: true },
              ].map(({ href, label, Icon, external }) => (
                <MagneticButton
                  key={label}
                  href={href}
                  external={external}
                  aria-label={label}
                  className="flex items-center justify-center w-12 h-12 rounded-full border border-line/20 text-ink hover:border-accent hover:text-accent transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </MagneticButton>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {cinematic && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 pointer-events-none"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] font-heading text-dim">Scroll</span>
          <div className="w-px h-16 bg-ink/10 relative overflow-hidden">
            <motion.div
              animate={{ y: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="absolute top-0 left-0 w-full h-full bg-ink"
            />
          </div>
        </motion.div>
      )}
    </section>
  );
}
