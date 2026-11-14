import React from 'react';

/**
 * Hand-drawn marks. All of them inherit `currentColor` and are decorative,
 * so they are hidden from assistive tech.
 */
const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

/** A curved arrow. Rotate/flip it with classes to point where you need. */
export const Arrow = ({ className = '' }) => (
  <svg viewBox="0 0 80 60" className={className} {...base}>
    <path d="M5 9 C 30 2, 57 13, 62 47" />
    <path d="M49 39 L 63 49 L 70 32" />
  </svg>
);

/** A straight-ish arrow for inline use (→). */
export const ArrowRight = ({ className = '' }) => (
  <svg viewBox="0 0 48 24" className={className} {...base}>
    <path d="M3 13 C 14 10, 26 14, 43 12" />
    <path d="M34 4 L 44 12 L 35 20" />
  </svg>
);

/** Wavy underline; stretches to the width of its box. */
export const Squiggle = ({ className = '' }) => (
  <svg viewBox="0 0 200 12" preserveAspectRatio="none" className={className} {...base}>
    <path
      vectorEffect="non-scaling-stroke"
      d="M2 8 C 18 0, 30 12, 50 6 S 80 0, 100 6 S 130 12, 150 6 S 184 0, 198 6"
    />
  </svg>
);

/** A little spark. */
export const Spark = ({ className = '' }) => (
  <svg viewBox="0 0 40 40" className={className} {...base}>
    <path d="M20 3 V 37 M3 20 H 37 M8 8 L 32 32 M32 8 L 8 32" />
  </svg>
);

/** A loose circle, for ringing something. */
export const Ring = ({ className = '' }) => (
  <svg viewBox="0 0 120 60" preserveAspectRatio="none" className={className} {...base}>
    <path
      vectorEffect="non-scaling-stroke"
      d="M62 5 C 20 2, 4 18, 6 32 C 9 52, 60 58, 92 50 C 122 42, 120 12, 84 7 C 70 5, 52 5, 40 9"
    />
  </svg>
);

/** Printer's registration mark. */
export const Registration = ({ className = '' }) => (
  <svg viewBox="0 0 40 40" className={className} {...base} strokeWidth={1.2}>
    <circle cx="20" cy="20" r="9" />
    <path d="M20 2 V 38 M2 20 H 38" />
  </svg>
);
