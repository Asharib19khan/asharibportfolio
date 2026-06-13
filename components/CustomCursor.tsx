"use client";

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>();

  useEffect(() => {
    let cursorX = window.innerWidth / 2;
    let cursorY = window.innerHeight / 2;
    let outerX = cursorX;
    let outerY = cursorY;

    const onMouseMove = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      
      // Inner dot follows instantly
      if (innerRef.current) {
        innerRef.current.style.transform = `translate(${cursorX - 4}px, ${cursorY - 4}px)`;
      }
    };

    const loop = () => {
      outerX += (cursorX - outerX) * 0.15;
      outerY += (cursorY - outerY) * 0.15;
      
      if (outerRef.current) {
        outerRef.current.style.transform = `translate(${outerX - 20}px, ${outerY - 20}px)`;
      }
      
      requestRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMouseMove);
    requestRef.current = requestAnimationFrame(loop);

    const handleMouseEnter = () => {
      if (outerRef.current) {
        outerRef.current.style.width = '80px';
        outerRef.current.style.height = '80px';
        outerRef.current.style.backgroundColor = 'white';
        outerRef.current.style.marginLeft = '-20px';
        outerRef.current.style.marginTop = '-20px';
      }
      if (innerRef.current) {
        innerRef.current.style.opacity = '0';
      }
    };

    const handleMouseLeave = () => {
      if (outerRef.current) {
        outerRef.current.style.width = '40px';
        outerRef.current.style.height = '40px';
        outerRef.current.style.backgroundColor = 'transparent';
        outerRef.current.style.marginLeft = '0px';
        outerRef.current.style.marginTop = '0px';
      }
      if (innerRef.current) {
        innerRef.current.style.opacity = '1';
      }
    };

    const addListeners = () => {
      const elements = document.querySelectorAll('a, button, h1, h2, h3, .project-card, .magnetic');
      elements.forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
      });
      return elements;
    };

    let elements = addListeners();
    
    // Mutation observer to handle dynamically loaded elements
    const observer = new MutationObserver(() => {
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
      elements = addListeners();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      observer.disconnect();
      elements.forEach(el => {
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      });
    };
  }, []);

  return (
    <div className="pointer-events-none z-[9999] fixed inset-0 mix-blend-difference">
      <div 
        ref={outerRef} 
        className="absolute top-0 left-0 w-10 h-10 rounded-full border-[1.5px] border-white transition-all duration-300 ease-out"
        style={{ willChange: 'transform, width, height, background-color' }}
      />
      <div 
        ref={innerRef} 
        className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full transition-opacity duration-200"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
