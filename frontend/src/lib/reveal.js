import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from './motion';

/**
 * The site's one entrance: things are *set down* on the page.
 *
 * Mark an element with `data-reveal` and it arrives once, when it scrolls
 * into view. The value picks how:
 *   up    — rises a little (default; text)
 *   drop  — placed like a sheet of paper: a small turn, then it settles
 *   left / right — slides in from that side
 *   fade  — opacity only
 * `data-reveal-delay="0.1"` staggers siblings by hand.
 *
 * Transforms are cleared when the entrance ends, so hover states written
 * in CSS keep working afterwards.
 */
const FROM = {
  up: { y: 32 },
  drop: { y: 44, rotate: '-=4', scale: 1.03 },
  left: { x: -44 },
  right: { x: 44 },
  fade: {},
};

export const useReveal = (scope, dependencies = []) =>
  useGSAP(
    () => {
      const els = gsap.utils.toArray('[data-reveal]', scope.current);
      if (!els.length) return;

      gsap.set(els, { visibility: 'visible' });
      if (prefersReducedMotion()) return;

      els.forEach((el) => {
        const kind = FROM[el.dataset.reveal] ? el.dataset.reveal : 'up';
        gsap.from(el, {
          ...FROM[kind],
          opacity: 0,
          duration: kind === 'drop' ? 1.1 : 0.9,
          delay: parseFloat(el.dataset.revealDelay || 0),
          ease: 'sweep',
          clearProps: 'transform,opacity',
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
      });
    },
    { scope, dependencies },
  );

export default useReveal;
