'use client'

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SphereLayoutProps {
  hero: React.ReactNode;
  skills: React.ReactNode;
  projects: React.ReactNode;
  certifications: React.ReactNode;
  contact: React.ReactNode;
}

export default function SphereLayout({
  hero, skills, projects, certifications, contact
}: SphereLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const c0 = 0, c1 = 1/4, c2 = 2/4, c3 = 3/4, c4 = 1;

  // Optimize Performance: Use visibility instead of display to prevent massive DOM layout reflows (hanging)
  const heroVis = useTransform(scrollYProgress, v => v <= c1 + 0.05 ? "visible" : "hidden");
  const skillsVis = useTransform(scrollYProgress, v => v >= c0 && v <= c2 + 0.05 ? "visible" : "hidden");
  const projectsVis = useTransform(scrollYProgress, v => v >= c1 - 0.05 && v <= c3 + 0.05 ? "visible" : "hidden");
  const certVis = useTransform(scrollYProgress, v => v >= c2 - 0.05 && v <= c4 + 0.05 ? "visible" : "hidden");
  const contactVis = useTransform(scrollYProgress, v => v >= c3 - 0.05 ? "visible" : "hidden");

  // --- STRICT OPACITY & TRANSFORM MAPPINGS ---
  // Passing direct arrays avoids calling useTransform inside the render loop (which caused memory leaks)

  // 1. Hero
  const heroX = useTransform(scrollYProgress, [c0, c1], ["0vw", "-100vw"]);
  const heroScale = useTransform(scrollYProgress, [c0, c1], [1, 0.8]);
  const heroOpacity = useTransform(scrollYProgress, [c0, c1], [1, 0]);
  
  // 2. Skills
  const skillsX = useTransform(scrollYProgress, [c0, c1, c2], ["100vw", "0vw", "-100vw"]);
  const skillsScale = useTransform(scrollYProgress, [c0, c1, c2], [0.8, 1, 0.8]);
  const skillsOpacity = useTransform(scrollYProgress, [c0, c1, c2], [0, 1, 0]);

  // 3. Projects
  const projectsX = useTransform(scrollYProgress, [c1, c2], ["100vw", "0vw"]);
  const projectsScale = useTransform(scrollYProgress, [c2, c3], [1, 2]);
  const projectsOpacity = useTransform(scrollYProgress, [c1, c2, c3], [0, 1, 0]);

  // 4. Certifications
  const certScale = useTransform(scrollYProgress, [c2, c3], [0.5, 1]);
  const certY = useTransform(scrollYProgress, [c3, c4], ["0vh", "-100vh"]);
  const certOpacity = useTransform(scrollYProgress, [c2, c3, c4], [0, 1, 0]);

  // 5. Contact
  const contactY = useTransform(scrollYProgress, [c3, c4], ["100vh", "0vh"]);
  const contactOpacity = useTransform(scrollYProgress, [c3, c4], [0, 1]);

  // Common wrapper class to center everything properly and fill screen.
  // Performance: Removed hardware acceleration hacks that promote massive 100vw x 100vh layers to the GPU, causing VRAM exhaustion and browser freezing.
  const wrapperClass = "absolute inset-0 w-full h-full flex justify-center items-center overflow-hidden";

  return (
    <div ref={containerRef} className="relative w-full h-[1100vh] bg-transparent">
      {/* Sticky wrapper that holds the viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden perspective-1000">
        
        <motion.div className={wrapperClass} style={{ x: heroX, scale: heroScale, opacity: heroOpacity, visibility: heroVis }}>
          {hero}
        </motion.div>

        <motion.div className={wrapperClass} style={{ x: skillsX, scale: skillsScale, opacity: skillsOpacity, visibility: skillsVis }}>
          {skills}
        </motion.div>

        <motion.div className={wrapperClass} style={{ x: projectsX, scale: projectsScale, opacity: projectsOpacity, visibility: projectsVis }}>
          {projects}
        </motion.div>

        <motion.div className={wrapperClass} style={{ scale: certScale, y: certY, opacity: certOpacity, visibility: certVis }}>
          {certifications}
        </motion.div>

        <motion.div className={wrapperClass} style={{ y: contactY, opacity: contactOpacity, visibility: contactVis }}>
          {contact}
        </motion.div>

      </div>
    </div>
  );
}
