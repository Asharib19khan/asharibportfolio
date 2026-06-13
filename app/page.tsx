"use client";

import { useState, useEffect } from 'react';
import Lenis from 'lenis';

import CustomCursor from '../components/CustomCursor';
import Navbar from '../components/Navbar';
import BackgroundNoise from '../components/BackgroundNoise';
import ThreeBackground from '../components/ThreeBackground';
import SphereLayout from '../components/SphereLayout';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Education from '../components/Education';
import Certifications from '../components/Certifications';
import Contact from '../components/Contact';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
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
      <main className="relative w-full bg-[#050505]">
        <ThreeBackground />
        <BackgroundNoise />
        <Navbar />
        
        <SphereLayout 
          hero={<Hero />}
          about={<About />}
          skills={<Skills />}
          projects={<Projects />}
          education={<Education />}
          certifications={<Certifications />}
          contact={<Contact />}
        />
      </main>
    </>
  );
}
