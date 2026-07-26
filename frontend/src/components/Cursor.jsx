import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, isTouch, prefersReducedMotion, lerp, damp } from '../lib/motion';
import { pointer } from '../lib/frameState';

/**
 * Two-part cursor: a dot that tracks precisely and a ring that trails
 * with inertia. Any element carrying `data-cursor` swaps the ring into a
 * labelled state — that attribute is the whole API, so new interactive
 * elements opt in without touching this file.
 *
 * Position is read from the shared frame state, so this adds no pointer
 * listener of its own, and it moves on GSAP's ticker alongside every
 * other animation rather than on a private rAF.
 */
const Cursor = () => {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const [label, setLabel] = useState('');

  const enabled = !isTouch() && !prefersReducedMotion();

  useGSAP(() => {
    if (!enabled) return undefined;

    document.documentElement.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    const setDot = { x: gsap.quickSetter(dot, 'x', 'px'), y: gsap.quickSetter(dot, 'y', 'px') };
    const setRing = { x: gsap.quickSetter(ring, 'x', 'px'), y: gsap.quickSetter(ring, 'y', 'px') };

    const ringPos = { x: pointer.px, y: pointer.py };

    const tick = () => {
      const dt = gsap.ticker.deltaRatio(60) / 60;
      setDot.x(pointer.px);
      setDot.y(pointer.py);

      ringPos.x = lerp(ringPos.x, pointer.px, damp(0.18, dt));
      ringPos.y = lerp(ringPos.y, pointer.py, damp(0.18, dt));
      setRing.x(ringPos.x);
      setRing.y(ringPos.y);
    };
    gsap.ticker.add(tick);

    // --- Hover states -------------------------------------------------
    const activate = (mode, text) => {
      const isLabelled = Boolean(text);
      setLabel(text || '');
      gsap.to(ring, {
        scale: isLabelled ? 2.6 : mode === 'link' ? 1.9 : 1,
        borderColor:
          mode === 'none'
            ? 'rgb(var(--color-text-primary) / 0.35)'
            : 'rgb(var(--color-accent-primary) / 0.9)',
        backgroundColor:
          isLabelled
            ? 'rgb(var(--color-accent-primary) / 1)'
            : 'rgb(var(--color-accent-primary) / 0)',
        duration: 0.5,
        ease: 'sweep',
      });
      gsap.to(dot, {
        scale: mode === 'none' ? 1 : 0,
        duration: 0.35,
        ease: 'sweep',
      });
      if (labelRef.current) {
        gsap.to(labelRef.current, {
          autoAlpha: isLabelled ? 1 : 0,
          duration: 0.3,
          ease: 'sweep',
        });
      }
    };

    const onOver = (e) => {
      const target = e.target instanceof Element ? e.target : null;
      if (!target) return;
      const hit = target.closest('[data-cursor], a, button, input, textarea, label');
      if (!hit) {
        activate('none');
        return;
      }
      const mode = hit.getAttribute('data-cursor') || 'link';
      activate(mode, hit.getAttribute('data-cursor-label') || '');
    };

    const onLeaveWindow = () => gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 });
    const onEnterWindow = () => gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 });
    const onDown = () => gsap.to(ring, { scale: '-=0.35', duration: 0.25, ease: 'sweep' });
    const onUp = () => gsap.to(ring, { scale: '+=0.35', duration: 0.35, ease: 'sweep' });

    document.addEventListener('pointerover', onOver, { passive: true });
    document.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerup', onUp, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeaveWindow);
    document.documentElement.addEventListener('pointerenter', onEnterWindow);

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
      document.documentElement.removeEventListener('pointerenter', onEnterWindow);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[95] hidden md:block" aria-hidden="true">
      <div
        ref={ringRef}
        className="absolute -left-5 -top-5 flex h-10 w-10 items-center justify-center rounded-full border will-change-transform"
        style={{
          borderColor: 'rgb(var(--color-text-primary) / 0.35)',
          backgroundColor: 'rgb(var(--color-accent-primary) / 0)',
        }}
      >
        <span
          ref={labelRef}
          className="select-none text-[0.34rem] font-medium uppercase tracking-[0.18em] text-text-inverse opacity-0"
        >
          {label}
        </span>
      </div>
      <div
        ref={dotRef}
        className="absolute -left-[3px] -top-[3px] h-1.5 w-1.5 rounded-full bg-accent-primary will-change-transform"
      />
    </div>
  );
};

export default Cursor;
