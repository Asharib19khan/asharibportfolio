"use client";

import { useId, useState } from 'react';
import { motion } from 'framer-motion';
import { PROJECTS } from '../../constants/content';
import { ArrowRight, ArrowUpRight, Plus } from '../ui/icons';

type Project = (typeof PROJECTS)[number] & {
  featured?: boolean;
  modules?: { name: string; summary: string; signature: string }[];
  flow?: string[];
  purpose?: string;
};

const WIDE_HOVER = '(min-width: 1024px) and (hover: hover)';

export default function Projects({ cinematic }: { cinematic: boolean }) {
  const headingChars = "Projects".split("");
  // The featured project (DevDay) is open by default.
  const [active, setActive] = useState<number>(0);
  const baseId = useId();

  const isWide = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches;

  return (
    <section
      id="projects"
      className={`relative w-full px-4 md:px-8 max-w-[1400px] mx-auto flex flex-col ${
        cinematic ? 'h-screen pt-24 pb-8 justify-center' : 'py-24 border-t border-line/10'
      }`}
    >
      {cinematic && (
        <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="text-[15vw] font-heading font-bold uppercase tracking-widest text-ink/[0.04]">
            Project
          </span>
        </div>
      )}

      <motion.h2
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          visible: { transition: { staggerChildren: 0.05 } },
          hidden: {}
        }}
        aria-label="Projects"
        className="flex justify-center text-xl md:text-2xl font-heading tracking-[0.4em] text-dim mb-8 lg:mb-10 uppercase overflow-hidden relative z-10"
      >
        {headingChars.map((char, index) => (
          <motion.span
            key={index}
            aria-hidden="true"
            variants={{
              hidden: { y: "100%", opacity: 0 },
              visible: { y: "0%", opacity: 1, transition: { type: "spring" as const, damping: 15 } }
            }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </motion.h2>

      <div
        className={`w-full relative z-10 mx-auto max-w-7xl flex flex-col gap-3 lg:flex-row lg:gap-4 ${
          cinematic ? 'lg:flex-1 lg:min-h-0 lg:max-h-[740px]' : 'lg:h-[min(72vh,740px)] lg:min-h-[560px]'
        }`}
      >
        {(PROJECTS as Project[]).map((proj, idx) => {
          const isActive = active === idx;
          const panelId = `${baseId}-panel-${idx}`;
          const buttonId = `${baseId}-btn-${idx}`;

          return (
            <article
              key={proj.title}
              onPointerMove={(e) => {
                // Only a real hand on the mouse opens a column; content scrolling under a
                // resting cursor (zero movement) must not steal focus from DevDay.
                if (isActive || e.pointerType !== 'mouse' || (!e.movementX && !e.movementY)) return;
                if (window.matchMedia(WIDE_HOVER).matches) setActive(idx);
              }}
              className={`group relative rounded-3xl overflow-hidden border transition-[flex,background-color,border-color] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] lg:min-w-0 flex flex-col ${
                isActive
                  ? 'lg:flex-[7] bg-surface border-line/15 shadow-[0_24px_60px_-30px_rgb(var(--ink)/0.35)]'
                  : 'lg:flex-[1] bg-ink/[0.03] border-line/10 hover:border-line/25'
              }`}
            >
              {proj.featured && (
                <span aria-hidden="true" className={`absolute top-0 inset-x-0 h-px bg-accent transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
              )}

              <h3 className="contents">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isActive}
                  aria-controls={panelId}
                  onClick={() => setActive((a) => (a === idx && !isWide() ? -1 : idx))}
                  className={`relative z-20 text-left w-full flex items-start justify-between gap-4 p-5 md:p-7 ${
                    isActive ? 'lg:px-10 lg:pt-10 lg:pb-0 lg:cursor-default' : 'lg:absolute lg:inset-0 lg:p-0 lg:items-center lg:justify-center'
                  }`}
                >
                  {/* Strip label for collapsed columns on wide screens */}
                  <span
                    className={`hidden ${isActive ? '' : 'lg:flex'} items-center gap-3 whitespace-nowrap -rotate-90 font-heading font-bold tracking-[0.3em] text-xs uppercase text-dim group-hover:text-ink transition-colors duration-300`}
                  >
                    {proj.featured && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                    {proj.title}
                  </span>

                  <span className={`flex flex-col gap-1.5 min-w-0 ${isActive ? '' : 'lg:hidden'}`}>
                    <span className={`font-heading font-bold tracking-tight text-ink ${isActive ? 'text-2xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                      {proj.title}
                    </span>
                    {proj.meta && (
                      <span className={`text-xs md:text-sm ${proj.featured ? 'text-accent' : 'text-dim'}`}>
                        {proj.featured ? `Featured · ${proj.meta}` : proj.meta}
                      </span>
                    )}
                  </span>

                  <Plus
                    className={`lg:hidden shrink-0 mt-1 w-5 h-5 text-dim transition-transform duration-300 ${isActive ? 'rotate-45' : ''}`}
                  />
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                inert={!isActive}
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex-1 lg:min-h-0 ${
                  isActive ? 'grid-rows-[1fr] opacity-100 lg:delay-150' : 'grid-rows-[0fr] opacity-0 lg:pointer-events-none'
                }`}
              >
                <div className="min-h-0 overflow-hidden lg:overflow-y-auto" data-lenis-prevent>
                  <ProjectBody proj={proj} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function ProjectBody({ proj }: { proj: Project }) {
  return (
    <div className="px-5 pb-6 md:px-7 md:pb-8 lg:px-10 lg:pb-10 lg:pt-5 lg:min-w-[560px] flex flex-col gap-6 h-full">
      <p className="text-sm md:text-base text-dim leading-relaxed max-w-[68ch]">{proj.description}</p>

      {proj.modules && (
        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {proj.modules.map((m) => (
            <div key={m.name} className="border-t border-line/15 pt-4">
              <p className="font-heading font-bold text-ink text-base md:text-lg mb-2">{m.name}</p>
              <p className="text-[13px] md:text-sm text-dim leading-relaxed mb-3">{m.summary}</p>
              <code className="inline-block max-w-full font-mono text-[11px] text-ink bg-ink/[0.05] border border-line/10 rounded-md px-2 py-1">
                {m.signature}
              </code>
            </div>
          ))}
        </div>
      )}

      {proj.flow && (
        <ol aria-label="How a decision reaches the participant" className="flex flex-wrap items-center gap-x-1.5 gap-y-2 text-[10px] md:text-[11px] uppercase tracking-[0.1em] font-heading font-bold">
          {proj.flow.map((stage, i) => (
            <li key={stage} className="flex items-center gap-1.5">
              <span className={`whitespace-nowrap rounded-full border px-2.5 py-1 ${i === proj.flow!.length - 1 ? 'border-accent text-accent' : 'border-line/20 text-ink'}`}>
                {stage}
              </span>
              {i < proj.flow!.length - 1 && <ArrowRight className="w-3 h-3 text-dim" />}
            </li>
          ))}
        </ol>
      )}

      {proj.purpose && (
        <div className="max-w-[68ch]">
          <p className="font-heading font-bold uppercase tracking-[0.18em] text-[10px] text-ink mb-1.5">Built for</p>
          <p className="text-[13px] md:text-sm text-dim leading-relaxed">{proj.purpose}</p>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
          {proj.tech.map((t) => (
            <li key={t} className="px-2.5 py-1 border border-line/15 rounded-md text-[11px] font-medium text-dim">
              {t}
            </li>
          ))}
        </ul>
        {(proj.link || proj.github) && (
          <a
            href={(proj.link || proj.github)!}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 inline-flex items-center gap-2 rounded-full bg-ink text-paper px-5 py-2.5 text-xs font-heading font-bold tracking-[0.16em] uppercase hover:bg-accent transition-colors"
          >
            GitHub repo <ArrowUpRight className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
