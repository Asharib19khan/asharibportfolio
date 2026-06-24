"use client";

import { useState, useEffect } from 'react';
import Lenis from 'lenis';

import Navbar from '../components/layout/Navbar';
import BackgroundNoise from '../components/layout/BackgroundNoise';
import SphereLayout from '../components/layout/SphereLayout';
import Hero from '../components/sections/Hero';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Certifications from '../components/sections/Certifications';
import Contact from '../components/sections/Contact';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const lenis = new Lenis({
      lerp: 0.04, // Extremely smooth, cinematic lerp
      smoothWheel: true,
      wheelMultiplier: 1.2, // Slightly more responsive wheel
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Prevent hydration mismatch by not rendering main layout until mounted
  if (!mounted) return null;

  return (
    <>
      <main className="relative w-full bg-gray-50 dark:bg-[#050505] transition-colors duration-700">
        <Navbar />
        
        <SphereLayout 
          hero={<Hero />}
          skills={<Skills />}
          projects={<Projects />}
          certifications={<Certifications />}
          contact={<Contact />}
        />
      </main>
    </>
  );
}
