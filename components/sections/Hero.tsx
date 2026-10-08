"use client";

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { BRAND } from '../../constants/content';
import MagneticButton from '../ui/MagneticButton';
import Particles from '../ui/Particles';
import { ArrowRight, Github, Instagram, Linkedin, Mail } from '../ui/icons';
import { scrollToSection } from '../../lib/scroll';
import { PROVOKE_EVENT } from '../../lib/android';

const AndroidHead = dynamic(() => import('../hero/AndroidHead'), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero({ cinematic }: { cinematic: boolean }) {
  const [androidReady, setAndroidReady] = useState(false);
  const handleReady = useCallback(() => setAndroidReady(true), []);

  return (
    <section
      id="home"
      className="relative w-full h-[100svh] min-h-[620px] lg:h-screen overflow-hidden bg-paper"
    >
      {cinematic && <Particles />}

      <div className="relative z-10 grid h-full w-full max-w-[1400px] mx-auto grid-rows-[minmax(0,1fr)_auto] lg:grid-rows-1 lg:grid-cols-2 lg:items-center">
        <div className="relative h-full min-h-0 lg:order-none">
          <AndroidHead
            onReady={handleReady}
            className={`absolute inset-0 cursor-crosshair touch-pan-y transition-[opacity,filter] duration-[1400ms] ease-out ${
              androidReady ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'
            }`}
          />
          <div className="absolute bottom-3 left-6 lg:bottom-16 lg:left-12 z-10 flex items-center gap-3 text-[11px] text-dim">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event(PROVOKE_EVENT))}
              className="rounded-full border border-line/20 px-3 py-1.5 font-heading font-bold uppercase tracking-[0.18em] text-ink hover:border-accent hover:text-accent transition-colors"
            >
              Provoke
            </button>
            <span className="hidden sm:inline">Move over the face to see what&apos;s under the skin.</span>
            <span className="sm:hidden">Drag across the face to see what&apos;s underneath.</span>
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
          {/* Role as a readable headline + summary, not one long tracked-out caps line. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease }}
            className="max-w-[30rem] mb-8 md:mb-10"
          >
            <p className="font-heading font-medium text-ink text-lg md:text-[1.375rem] leading-snug tracking-[-0.01em] [text-wrap:balance]">
              {BRAND.headline}
            </p>
            <p className="mt-2.5 font-body text-dim text-[0.95rem] md:text-base leading-relaxed">
              {BRAND.summary}
            </p>
          </motion.div>

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
                { href: BRAND.instagram, label: 'Instagram', Icon: Instagram, external: true },
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
