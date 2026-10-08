"use client";

import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useOnScreen } from '../../lib/useOnScreen';

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onScreen = useOnScreen(canvasRef);
  const { resolvedTheme } = useTheme();
  // Stars are ink-coloured so they read on both paper (light) and graphite (dark).
  const rgb = resolvedTheme === 'light' ? '17, 18, 20' : '255, 255, 255';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !onScreen) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const STAR_COUNT = 800;
    const stars: { x: number, y: number, z: number, o: number, size: number }[] = [];

    for (let i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000,
        o: Math.random() * 0.8 + 0.2, // Base opacity
        size: Math.random() * 1.5 + 0.5, // Extremely sharp, small, elegant dots
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;
    let targetSpeed = 0.5;
    let currentSpeed = 0.5;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - mouseX;
      const dy = e.clientY - mouseY;
      const moveSpeed = Math.sqrt(dx * dx + dy * dy);

      mouseX = e.clientX;
      mouseY = e.clientY;

      targetSpeed = Math.min(25, 0.5 + moveSpeed * 0.4);
    };

    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      targetSpeed = Math.max(0.5, targetSpeed * 0.94);
      currentSpeed += (targetSpeed - currentSpeed) * 0.1;

      const cx = width / 2;
      const cy = height / 2;

      const parallaxX = cx + (mouseX - cx) * 0.05;
      const parallaxY = cy + (mouseY - cy) * 0.05;

      stars.forEach(star => {
        star.z -= currentSpeed;

        if (star.z <= 0) {
          star.x = (Math.random() - 0.5) * 2000;
          star.y = (Math.random() - 0.5) * 2000;
          star.z = 2000;
        }

        const k = 256.0 / star.z;
        const px = star.x * k + parallaxX;
        const py = star.y * k + parallaxY;

        const prevK = 256.0 / (star.z + currentSpeed * 1.5);
        const prevPx = star.x * prevK + parallaxX;
        const prevPy = star.y * prevK + parallaxY;

        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const size = star.size * k;
          const opacity = Math.min(1, Math.max(0, (2000 - star.z) / 1000)) * star.o;

          ctx.beginPath();
          if (currentSpeed > 2.5) {
            ctx.moveTo(prevPx, prevPy);
            ctx.lineTo(px, py);
            ctx.lineWidth = size;
            ctx.strokeStyle = `rgba(${rgb}, ${opacity})`;
            ctx.stroke();
          } else {
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${rgb}, ${opacity})`;
            ctx.fill();

            if (size > 1) {
              ctx.beginPath();
              ctx.arc(px, py, size * 2, 0, Math.PI * 2);
              ctx.fillStyle = `rgba(${rgb}, ${opacity * 0.2})`;
              ctx.fill();
            }
          }
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [onScreen, rgb]);

  // Fainter on paper: dark streaks on a light page read as dust rather than stars.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none z-0 ${resolvedTheme === 'light' ? 'opacity-30' : 'opacity-60'}`}
    />
  );
}
