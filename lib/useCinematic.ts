"use client";

import { useSyncExternalStore } from "react";

// The pinned scroll animation only runs where it performs and fits: a real pointer,
// a laptop-sized viewport, and a screen tall enough to hold each section in one view.
// Everything else (phones, tablets, short windows, reduced motion) gets a normal page.
export const CINEMATIC_QUERY =
  "(min-width: 1024px) and (min-height: 680px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(CINEMATIC_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

export function useCinematic() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(CINEMATIC_QUERY).matches,
    // Server HTML is the plain flow layout: every section is present and readable for crawlers.
    () => false,
  );
}

const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export function useReducedMotionPref() {
  return useSyncExternalStore(
    (cb) => {
      const mql = window.matchMedia(REDUCED_QUERY);
      mql.addEventListener("change", cb);
      return () => mql.removeEventListener("change", cb);
    },
    () => window.matchMedia(REDUCED_QUERY).matches,
    () => false,
  );
}
