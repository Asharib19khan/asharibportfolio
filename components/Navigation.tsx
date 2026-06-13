"use client";

import { useState, useEffect } from 'react';
import { BRAND } from '../constants/content';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      const sections = ['projects', 'skills', 'contact'];
      let current = '';
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = section;
          }
        }
      }
      setActive(current);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-300 ${
      scrolled 
        ? 'bg-[rgba(8,8,8,0.85)] backdrop-blur-sm border-b border-[rgba(255,255,255,0.06)] py-4' 
        : 'bg-transparent py-6'
    }`}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex justify-between items-center">
        <div 
          className="text-ice font-heading font-bold text-xl cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {BRAND.alias}
        </div>

        <div className="hidden md:flex items-center gap-8">
          {['WORK', 'SKILLS', 'CONTACT'].map((item) => {
            const id = item === 'WORK' ? 'projects' : item.toLowerCase();
            return (
              <button
                key={item}
                onClick={() => scrollTo(id)}
                className={`text-[12px] uppercase tracking-[0.2em] font-body transition-colors duration-200 ${
                  active === id ? 'text-ember' : 'text-muted hover:text-ice'
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
