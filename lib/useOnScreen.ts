"use client";

import { RefObject, useEffect, useState } from "react";

/**
 * True while the element is actually visible. Handles both layouts: in the flow layout an
 * IntersectionObserver is enough, but in the pinned layout every panel always "intersects"
 * the sticky viewport, so we also check the panel's visibility/opacity on scroll.
 * Used to stop WebGL/canvas render loops for anything the visitor can't see.
 */
export function useOnScreen(ref: RefObject<HTMLElement | null>) {
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let intersecting = true;
    let raf = 0;

    const evaluate = () => {
      raf = 0;
      const panel = el.closest<HTMLElement>("[data-panel]");
      let shown = intersecting;
      if (shown && panel) {
        const style = getComputedStyle(panel);
        shown = style.visibility !== "hidden" && parseFloat(style.opacity) > 0.02;
      }
      setOnScreen((prev) => (prev === shown ? prev : shown));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(evaluate);
    };

    const io = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      schedule();
    });
    io.observe(el);
    window.addEventListener("scroll", schedule, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);

  return onScreen;
}
