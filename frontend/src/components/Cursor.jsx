import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, isTouch, prefersReducedMotion } from '../lib/motion';

/**
 * A paper tag that trails the pointer with a hint.
 *
 * The real cursor is left alone. Any element carrying
 * `data-cursor-label="…"` makes the tag appear with that word — that
 * attribute is the whole API, so new elements opt in without touching
 * this file.
 */
const Cursor = () => {
  const tagRef = useRef(null);
  const [label, setLabel] = useState('');

  const enabled = !isTouch() && !prefersReducedMotion();

  useGSAP(() => {
    if (!enabled) return undefined;
    const tag = tagRef.current;

    const x = gsap.quickTo(tag, 'x', { duration: 0.45, ease: 'sweep' });
    const y = gsap.quickTo(tag, 'y', { duration: 0.45, ease: 'sweep' });
    let shown = false;

    const onMove = (e) => {
      x(e.clientX + 14);
      y(e.clientY + 18);
    };

    const onOver = (e) => {
      const target = e.target instanceof Element ? e.target : null;
      const hit = target?.closest('[data-cursor-label]');
      const text = hit?.getAttribute('data-cursor-label') || '';
      if (text) setLabel(text);
      if (Boolean(text) === shown) return;
      shown = Boolean(text);
      gsap.to(tag, {
        autoAlpha: shown ? 1 : 0,
        scale: shown ? 1 : 0.6,
        rotate: shown ? -4 : 6,
        duration: 0.35,
        ease: shown ? 'back.out(2)' : 'power2.in',
        overwrite: 'auto',
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed left-0 top-0 z-[95] hidden md:block" aria-hidden="true">
      <span
        ref={tagRef}
        className="label invisible absolute left-0 top-0 origin-top-left whitespace-nowrap border-2 border-text-primary bg-highlight px-2 py-1 opacity-0"
        style={{ color: 'rgb(var(--marker-ink))', borderColor: 'rgb(var(--marker-ink))' }}
      >
        {label}
      </span>
    </div>
  );
};

export default Cursor;
