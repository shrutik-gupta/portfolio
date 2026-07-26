/**
 * Mutable, module-scoped frame state.
 *
 * Pointer position and scroll velocity change every frame. Routing them
 * through React state would re-render the tree 60+ times a second, so
 * they live here instead: producers (SmoothScroll, PointerTracker) write,
 * consumers (useFrame in R3F, GSAP quickTo in DOM) read. Nothing in this
 * module ever triggers a React render.
 */

export const pointer = {
  /** Raw normalised device coords, -1..1, origin at viewport centre. */
  x: 0,
  y: 0,
  /** Eased follow of x/y — what most visuals should read. */
  ex: 0,
  ey: 0,
  /** Frame-to-frame delta, useful for speed-reactive effects. */
  dx: 0,
  dy: 0,
  /** Page coords in px. */
  px: 0,
  py: 0,
  /** False until the user has actually moved a pointer. */
  active: false,
};

export const scroll = {
  /** Current scroll offset in px. */
  y: 0,
  /** 0..1 through the whole document. */
  progress: 0,
  /** Signed px/frame, smoothed. Drives skew + shader turbulence. */
  velocity: 0,
  /** Normalised |velocity|, 0..1, clamped. */
  intensity: 0,
  /** 1 = down, -1 = up. */
  direction: 1,
};

/** Set by SmoothScroll; lets consumers bail out of motion work. */
export const flags = {
  reducedMotion: false,
  /** True while the preloader still covers the viewport. */
  locked: true,
};
