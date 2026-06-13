'use client'

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SphereLayoutProps {
  hero: React.ReactNode;
  about: React.ReactNode;
  skills: React.ReactNode;
  projects: React.ReactNode;
  education: React.ReactNode;
  certifications: React.ReactNode;
  contact: React.ReactNode;
}

export default function SphereLayout({
  hero, about, skills, projects, education, certifications, contact
}: SphereLayoutProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const c0 = 0, c1 = 1/6, c2 = 2/6, c3 = 3/6, c4 = 4/6, c5 = 5/6, c6 = 1;

  // The isMobile block was here, moved to the bottom

  // Optimize Performance: Use visibility instead of display to prevent massive DOM layout reflows (hanging)
  const heroVis = useTransform(scrollYProgress, v => v <= c1 + 0.05 ? "visible" : "hidden");
  const aboutVis = useTransform(scrollYProgress, v => v >= c0 && v <= c2 + 0.05 ? "visible" : "hidden");
  const skillsVis = useTransform(scrollYProgress, v => v >= c1 - 0.05 && v <= c3 + 0.05 ? "visible" : "hidden");
  const projectsVis = useTransform(scrollYProgress, v => v >= c2 - 0.05 && v <= c4 + 0.05 ? "visible" : "hidden");
  const eduVis = useTransform(scrollYProgress, v => v >= c3 - 0.05 && v <= c5 + 0.05 ? "visible" : "hidden");
  const certVis = useTransform(scrollYProgress, v => v >= c4 - 0.05 && v <= c6 ? "visible" : "hidden");
  const contactVis = useTransform(scrollYProgress, v => v >= c5 - 0.05 ? "visible" : "hidden");

  // --- STRICT OPACITY & TRANSFORM MAPPINGS ---
  // Passing direct arrays avoids calling useTransform inside the render loop (which caused memory leaks)

  // 1. Hero
  const heroX = useTransform(scrollYProgress, [c0, c1], ["0vw", "-100vw"]);
  const heroOpacity = useTransform(scrollYProgress, [c0, c1], [1, 0]);
  
  // 2. About
  const aboutX = useTransform(scrollYProgress, [c0, c1], ["100vw", "0vw"]);
  const aboutY = useTransform(scrollYProgress, [c1, c2], ["0vh", "-100vh"]);
  const aboutOpacity = useTransform(scrollYProgress, [c0, c1, c2], [0, 1, 0]);
  
  // 3. Skills
  const skillsY = useTransform(scrollYProgress, [c1, c2], ["100vh", "0vh"]);
  const skillsX = useTransform(scrollYProgress, [c2, c3], ["0vw", "-100vw"]);
  const skillsOpacity = useTransform(scrollYProgress, [c1, c2, c3], [0, 1, 0]);

  // 4. Projects
  const projectsX = useTransform(scrollYProgress, [c2, c3], ["100vw", "0vw"]);
  const projectsScale = useTransform(scrollYProgress, [c3, c4], [1, 2]);
  const projectsOpacity = useTransform(scrollYProgress, [c2, c3, c4], [0, 1, 0]);

  // 5. Education
  const eduScale = useTransform(scrollYProgress, [c3, c4], [0.5, 1]);
  const eduX = useTransform(scrollYProgress, [c4, c5], ["0vw", "-100vw"]);
  const eduOpacity = useTransform(scrollYProgress, [c3, c4, c5], [0, 1, 0]);

  // 6. Certifications
  const certX = useTransform(scrollYProgress, [c4, c5], ["100vw", "0vw"]);
  const certY = useTransform(scrollYProgress, [c5, c6], ["0vh", "-100vh"]);
  const certOpacity = useTransform(scrollYProgress, [c4, c5, c6], [0, 1, 0]);

  // 7. Contact
  const contactY = useTransform(scrollYProgress, [c5, c6], ["100vh", "0vh"]);
  const contactOpacity = useTransform(scrollYProgress, [c5, c6], [0, 1]);

  // Common wrapper class to center everything properly and fill screen.
  // Performance: Removed will-change to prevent VRAM exhaustion on mobile devices when stacking 7 full-screen GPU layers.
  const wrapperClass = "absolute inset-0 w-full h-full flex justify-center items-center overflow-hidden";

  if (isMobile) {
    return (
      <div className="w-full flex flex-col items-center overflow-x-hidden pt-20">
        {hero}
        {about}
        {skills}
        {projects}
        {education}
        {certifications}
        {contact}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-[1400vh] bg-transparent">
      {/* Sticky wrapper that holds the viewport */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden perspective-1000">
        
        <motion.div className={wrapperClass} style={{ x: heroX, opacity: heroOpacity, visibility: heroVis }}>
          {hero}
        </motion.div>

        <motion.div className={wrapperClass} style={{ x: aboutX, y: aboutY, opacity: aboutOpacity, visibility: aboutVis }}>
          {about}
        </motion.div>

        <motion.div className={wrapperClass} style={{ y: skillsY, x: skillsX, opacity: skillsOpacity, visibility: skillsVis }}>
          {skills}
        </motion.div>

        <motion.div className={wrapperClass} style={{ x: projectsX, scale: projectsScale, opacity: projectsOpacity, visibility: projectsVis }}>
          {projects}
        </motion.div>

        <motion.div className={wrapperClass} style={{ scale: eduScale, x: eduX, opacity: eduOpacity, visibility: eduVis }}>
          {education}
        </motion.div>

        <motion.div className={wrapperClass} style={{ x: certX, y: certY, opacity: certOpacity, visibility: certVis }}>
          {certifications}
        </motion.div>

        <motion.div className={wrapperClass} style={{ y: contactY, opacity: contactOpacity, visibility: contactVis }}>
          {contact}
        </motion.div>

      </div>
    </div>
  );
}
