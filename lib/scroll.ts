import type Lenis from "lenis";

export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/** Scroll progress (0..1) through the pinned layout at which each section is fully on screen. */
export const SECTION_PROGRESS = SECTIONS.map((_, i) => i / (SECTIONS.length - 1));

let lenis: Lenis | null = null;
export function registerLenis(instance: Lenis | null) {
  lenis = instance;
}

/** Absolute scroll position for a section, in either layout. */
export function sectionTop(id: SectionId): number | null {
  const pinned = document.querySelector<HTMLElement>("[data-pinned-layout]");
  if (pinned) {
    const index = SECTIONS.findIndex((s) => s.id === id);
    const start = pinned.getBoundingClientRect().top + window.scrollY;
    return start + SECTION_PROGRESS[index] * (pinned.offsetHeight - window.innerHeight);
  }
  const el = document.getElementById(id);
  if (!el) return null;
  return el.getBoundingClientRect().top + window.scrollY;
}

export function scrollToSection(id: SectionId) {
  const top = sectionTop(id);
  if (top === null) return;
  if (lenis) {
    lenis.scrollTo(top, { duration: 1.6 });
    return;
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
}
