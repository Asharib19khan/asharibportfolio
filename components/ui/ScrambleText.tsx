"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+{}[]|:;<>,.?/~";

export default function ScrambleText({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const isAnimating = useRef(false);

  const runScramble = useCallback((startDelay = 0) => {
    if (!targetRef.current || isAnimating.current) return;
    isAnimating.current = true;
    const el = targetRef.current;
    const length = text.length;
    let iteration = 0;

    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        el.innerText = text
          .split("")
          .map((letter, index) => {
            if(index < iteration) {
              return text[index];
            }
            if (text[index] === " " || text[index] === "\n") return text[index];
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("");
        
        if (iteration >= length) {
          el.innerText = text;
          isAnimating.current = false;
          clearInterval(interval);
        }
        
        iteration += 1 / 3;
      }, 30);

      // We don't clear interval on unmount here because we want it to finish, 
      // but in a real massive app we might want a cleanup ref.
    }, startDelay * 1000);
    
    return () => clearTimeout(timeout);
  }, [text]);

  useEffect(() => {
    if (!containerRef.current) return;

    ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 90%',
      onEnter: () => setInView(true)
    });
  }, []);

  useEffect(() => {
    if (inView) {
      const cleanup = runScramble(delay);
      return cleanup;
    }
  }, [inView, delay, runScramble]);

  const handleMouseEnter = () => {
    if (!isAnimating.current && inView) {
      runScramble(0);
    }
  };

  return (
    <span 
      ref={containerRef} 
      className={`relative inline-block cursor-crosshair ${className || ''}`} 
      style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.2s' }}
      onMouseEnter={handleMouseEnter}
    >
      <span style={{ visibility: 'hidden', whiteSpace: 'pre-wrap' }}>{text}</span>
      <span ref={targetRef} style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', whiteSpace: 'pre-wrap' }}></span>
    </span>
  );
}
