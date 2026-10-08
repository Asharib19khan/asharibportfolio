'use client'

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { SECTION_PROGRESS } from '../../lib/scroll';

interface SphereLayoutProps {
  hero: React.ReactNode;
  skills: React.ReactNode;
  projects: React.ReactNode;
  contact: React.ReactNode;
}

// Each section rests fully on screen for ±HOLD of scroll progress around its stop,
// so a section can be read and used before the next transition starts.
const HOLD = 0.04;

/** Desktop-only pinned layout: one sticky viewport, sections fly in and out on scroll. */
export default function SphereLayout({ hero, skills, projects, contact }: SphereLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [c0, c1, c2, c3] = SECTION_PROGRESS;
  const h = HOLD;

  // Visibility (not display) keeps off-screen panels out of paint without layout reflows.
  const vis = (from: number, to: number) =>
    (v: number) => (v >= from - 0.02 && v <= to + 0.02 ? "visible" : "hidden");
  const heroVis = useTransform(scrollYProgress, vis(c0, c1 - h));
  const skillsVis = useTransform(scrollYProgress, vis(c0 + h, c2 - h));
  const projectsVis = useTransform(scrollYProgress, vis(c1 + h, c3 - h));
  const contactVis = useTransform(scrollYProgress, vis(c2 + h, c3));

  // Opacity is hardware-accelerated by framer-motion as a native scroll timeline; its keyframes
  // must span the whole 0..1 range or the browser falls back to the inline value past the ends.

  // 1. Hero: slides out left
  const heroX = useTransform(scrollYProgress, [c0 + h, c1 - h], ["0vw", "-100vw"]);
  const heroScale = useTransform(scrollYProgress, [c0 + h, c1 - h], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [c0, c0 + h, c1 - h, c3], [1, 1, 0, 0]);

  // 2. Skills: in from the right, out to the left
  const skillsRange = [c0 + h, c1 - h, c1 + h, c2 - h];
  const skillsX = useTransform(scrollYProgress, skillsRange, ["100vw", "0vw", "0vw", "-100vw"]);
  const skillsScale = useTransform(scrollYProgress, skillsRange, [0.8, 1, 1, 0.8]);
  const skillsOpacity = useTransform(scrollYProgress, [c0, ...skillsRange, c3], [0, 0, 1, 1, 0, 0]);

  // 3. Projects: in from the right, then zooms past the camera
  const projectsX = useTransform(scrollYProgress, [c1 + h, c2 - h], ["100vw", "0vw"]);
  const projectsScale = useTransform(scrollYProgress, [c2 + h, c3 - h], [1, 2]);
  const projectsOpacity = useTransform(scrollYProgress, [c0, c1 + h, c2 - h, c2 + h, c3 - h, c3], [0, 0, 1, 1, 0, 0]);

  // 4. Contact: rises from below
  const contactY = useTransform(scrollYProgress, [c2 + h, c3 - h], ["100vh", "0vh"]);
  const contactOpacity = useTransform(scrollYProgress, [c0, c2 + h, c3 - h, c3], [0, 0, 1, 1]);

  // GPU-composited panels that fill the sticky viewport.
  const wrapperClass = "absolute inset-0 w-full h-full flex justify-center items-center overflow-hidden [transform:translateZ(0)] [backface-visibility:hidden]";

  return (
    <div ref={containerRef} data-pinned-layout className="relative w-full h-[850vh] bg-transparent">
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        <motion.div data-panel className={wrapperClass} style={{ x: heroX, scale: heroScale, opacity: heroOpacity, visibility: heroVis }}>
          {hero}
        </motion.div>

        <motion.div data-panel className={wrapperClass} style={{ x: skillsX, scale: skillsScale, opacity: skillsOpacity, visibility: skillsVis }}>
          {skills}
        </motion.div>

        <motion.div data-panel className={wrapperClass} style={{ x: projectsX, scale: projectsScale, opacity: projectsOpacity, visibility: projectsVis }}>
          {projects}
        </motion.div>

        <motion.div data-panel className={wrapperClass} style={{ y: contactY, opacity: contactOpacity, visibility: contactVis }}>
          {contact}
        </motion.div>
      </div>
    </div>
  );
}
