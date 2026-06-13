export default function BackgroundNoise() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] mix-blend-overlay">
      <svg className="w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>
    </div>
  );
}
