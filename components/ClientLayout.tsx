"use client";

import { useState, useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [preloaderDone, setPreloaderDone] = useState(false);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tick);
    };
  }, []);

  return (
    <div className="relative w-full">
      {/* We can pass setPreloaderDone using a Context if needed, but since Preloader is sibling to the main content, 
          we can render it here and toggle visibility of children. */}
      {/* Since Preloader is requested as a separate component, I'll just conditionally fade the children. */}
      <div className={`transition-opacity duration-1000 ${!preloaderDone ? 'opacity-0 h-screen overflow-hidden' : 'opacity-100'}`}>
        {children}
      </div>
    </div>
  );
}
