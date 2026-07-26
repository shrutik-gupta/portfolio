import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';
import { CustomEase } from 'gsap/CustomEase';
import { Observer } from 'gsap/Observer';

/**
 * Single registration point for every GSAP plugin the site uses.
 * Importing this module anywhere guarantees plugins are live, so no
 * component has to call registerPlugin itself.
 */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, CustomEase, Observer);

/* ------------------------------------------------------------------
 * Named eases — the motion signature of the site.
 * ------------------------------------------------------------------ */
CustomEase.create('sweep', '0.16, 1, 0.3, 1');       // long, expressive settle
CustomEase.create('cut', '0.76, 0, 0.24, 1');        // hard in/out, editorial
CustomEase.create('drift', '0.25, 0.46, 0.45, 0.94');// slow ambient motion

export const EASE = {
  sweep: 'sweep',
  cut: 'cut',
  drift: 'drift',
};

/* ------------------------------------------------------------------
 * Environment probes
 * ------------------------------------------------------------------ */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/**
 * Coarse device-capability tier. Drives 3D quality decisions
 * (instance counts, DPR ceiling, whether a scene mounts at all).
 */
export const deviceTier = () => {
  if (typeof window === 'undefined') return 'low';
  if (prefersReducedMotion()) return 'low';

  const cores = navigator.hardwareConcurrency || 4;
  const memory = navigator.deviceMemory || 4;
  const coarse = isTouch();

  if (coarse && (cores <= 4 || memory <= 4)) return 'low';
  if (coarse) return 'mid';
  if (cores >= 8 && memory >= 8) return 'high';
  return 'mid';
};

/* ------------------------------------------------------------------
 * Math helpers used across DOM + WebGL layers
 * ------------------------------------------------------------------ */
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
export const mapRange = (v, inMin, inMax, outMin, outMax) =>
  outMin + ((clamp(v, inMin, inMax) - inMin) / (inMax - inMin)) * (outMax - outMin);

/**
 * Framerate-independent lerp factor. Without this, smoothing speed
 * changes with refresh rate (120Hz displays feel twice as twitchy).
 */
export const damp = (factor, delta) => 1 - Math.pow(1 - factor, delta * 60);

/* ------------------------------------------------------------------
 * SplitText helper: returns the split instance plus a revert fn.
 * Callers must revert on unmount or the DOM keeps the wrapper spans.
 * ------------------------------------------------------------------ */
export const splitLines = (target, type = 'lines') => {
  const split = new SplitText(target, {
    type,
    linesClass: 'split-line',
    // Keeps line-height descenders from being clipped by the mask.
    mask: type.includes('lines') ? 'lines' : undefined,
  });
  return split;
};

// Dev-only handles so scroll layout can be inspected from the console.
if (import.meta.env.DEV && typeof window !== 'undefined') {
  window.gsap = gsap;
  window.ScrollTrigger = ScrollTrigger;
}

export { gsap, ScrollTrigger, SplitText, Observer };
