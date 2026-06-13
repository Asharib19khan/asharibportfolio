"use client";

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { BRAND } from '../constants/content';

export default function Preloader({ setPreloaderDone }: { setPreloaderDone: (b: boolean) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      finishLoading();
    }, 2500);

    const ctx = gsap.context(() => {
      gsap.to(barRef.current, { 
        width: '100%', 
        duration: 2, 
        ease: 'power2.inOut',
        onComplete: finishLoading
      });
    }, containerRef);

    let isDone = false;
    function finishLoading() {
      if (isDone) return;
      isDone = true;
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => setPreloaderDone(true)
      });
    }

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [setPreloaderDone]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-void"
    >
      <div className="flex flex-col items-center w-[200px]">
        <h1 className="text-ice text-3xl font-heading tracking-[0.4em] mb-4 uppercase text-center w-full">
          {BRAND.alias}
        </h1>
        <div className="w-full h-[2px] bg-[rgba(255,255,255,0.1)] relative overflow-hidden">
          <div 
            ref={barRef}
            className="absolute top-0 left-0 h-full w-0 bg-ember"
          />
        </div>
      </div>
    </div>
  );
}
