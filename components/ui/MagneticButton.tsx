"use client";

import { ReactNode, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type MagneticProps = {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  'aria-label'?: string;
};

// Pulls toward the cursor on fine pointers. Renders a real <a> when given an href,
// so links stay links (middle-click, copy address, screen readers).
export default function MagneticButton({ children, className, onClick, href, external, ...aria }: MagneticProps) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    // Magnetic pull strength (0.3 is smooth and subtle)
    x.set((e.clientX - (left + width / 2)) * 0.3);
    y.set((e.clientY - (top + height / 2)) * 0.3);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const shared = {
    onMouseMove: handleMouse,
    onMouseLeave: reset,
    style: { x: springX, y: springY },
    className,
    ...aria,
  };

  if (href) {
    return (
      <motion.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onClick={onClick}
        {...shared}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button ref={ref as React.Ref<HTMLButtonElement>} type="button" onClick={onClick} {...shared}>
      {children}
    </motion.button>
  );
}
