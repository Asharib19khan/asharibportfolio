"use client";

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import Lenis from 'lenis';

import Navbar from './Navbar';
import BackgroundNoise from './BackgroundNoise';
import SphereLayout from './SphereLayout';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Skills from '../sections/Skills';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';
import { useCinematic } from '../../lib/useCinematic';
import { registerLenis } from '../../lib/scroll';

// WebGL backdrop is desktop-only and never server-rendered.
const ThreeBackground = dynamic(() => import('./ThreeBackground'), { ssr: false });

/**
 * Laptop/desktop: the pinned, cinematic scroll (unchanged feel) with smooth wheel scrolling.
 * Phones, tablets, short windows and reduced motion: a plain vertical page with native
 * scrolling and no background WebGL, which is what keeps it smooth on mobile hardware.
 */
export default function SiteShell() {
  const cinematic = useCinematic();

  useEffect(() => {
    if (!cinematic) return;
    const lenis = new Lenis({
      lerp: 0.08, // Smooth but responsive: 0.04 kept gliding long after the wheel stopped, which read as lag
      smoothWheel: true,
      wheelMultiplier: 1.2, // Slightly more responsive wheel
    });
    registerLenis(lenis);

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      registerLenis(null);
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, [cinematic]);

  const hero = <Hero cinematic={cinematic} />;
  const about = <About cinematic={cinematic} />;
  const skills = <Skills cinematic={cinematic} />;
  const projects = <Projects cinematic={cinematic} />;
  const contact = <Contact cinematic={cinematic} />;

  return (
    <>
      <Navbar cinematic={cinematic} />
      <main className="relative w-full bg-paper">
        {cinematic && (
          <>
            <ThreeBackground />
            <BackgroundNoise />
          </>
        )}

        {cinematic ? (
          <SphereLayout hero={hero} about={about} skills={skills} projects={projects} contact={contact} />
        ) : (
          <>
            {hero}
            {about}
            {skills}
            {projects}
            {contact}
          </>
        )}
      </main>
    </>
  );
}
