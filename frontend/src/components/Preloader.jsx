import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/motion';

/**
 * Entrance curtain.
 *
 * The counter is tied to real readiness (fonts + window load) rather
 * than a fixed timer: it eases to 92% while assets resolve, then
 * completes. A hard timeout guarantees it always clears, because a
 * stalled third-party font request should never trap the whole site
 * behind the curtain.
 */
const Preloader = ({ onComplete }) => {
  const root = useRef(null);
  const [count, setCount] = useState(0);

  // The timeline is built once and must not capture a stale callback:
  // whatever `onComplete` is at the moment the curtain lifts is the one
  // that has to run, or the handover to the scroll engine is lost.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set(root.current, { autoAlpha: 0 });
        onCompleteRef.current?.();
        return;
      }

      const progress = { value: 0 };
      let settled = false;

      const tl = gsap.timeline();

      tl.from('[data-pre-meta]', {
        y: 14,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: 'sweep',
      });

      // Crawl toward 92 while we wait for the real signals.
      const crawl = gsap.to(progress, {
        value: 92,
        duration: 2.2,
        ease: 'power2.out',
        onUpdate: () => setCount(Math.round(progress.value)),
      });

      const finish = () => {
        if (settled) return;
        settled = true;
        crawl.kill();

        const out = gsap.timeline({
          onComplete: () => onCompleteRef.current?.(),
        });

        out
          .to(progress, {
            value: 100,
            duration: 0.5,
            ease: 'power2.inOut',
            onUpdate: () => setCount(Math.round(progress.value)),
          })
          .to(
            '[data-pre-meta]',
            { y: -20, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: 'cut' },
            '+=0.15',
          )
          .to(
            root.current,
            {
              // Wipe upward from the bottom edge — the hero is already
              // rendered underneath, so this reads as a reveal, not a fade.
              clipPath: 'inset(0% 0% 100% 0%)',
              duration: 1.05,
              ease: 'cut',
            },
            '-=0.25',
          )
          .set(root.current, { autoAlpha: 0, pointerEvents: 'none' });
      };

      const ready = Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        document.readyState === 'complete'
          ? Promise.resolve()
          : new Promise((res) => window.addEventListener('load', res, { once: true })),
      ]);

      // Minimum on-screen time keeps the sequence from flashing on a
      // warm cache; the 6s ceiling keeps a stalled asset from blocking.
      const floor = new Promise((res) => gsap.delayedCall(1.5, res));
      Promise.all([ready, floor]).then(finish);
      const bail = gsap.delayedCall(6, finish);

      return () => bail.kill();
    },
    { scope: root, dependencies: [] },
  );

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-bg-primary px-gutter py-[max(1.5rem,4vh)]"
      style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
    >
      <div className="flex items-start justify-between">
        <p
          data-pre-meta
          className="text-fluid--2 uppercase tracking-[0.28em] text-text-muted"
        >
          Shrutik Gupta
        </p>
        <p
          data-pre-meta
          className="text-fluid--2 uppercase tracking-[0.28em] text-text-muted"
        >
          Portfolio
        </p>
      </div>

      <div data-pre-meta className="mx-auto max-w-measure text-center">
        <p className="serif-italic text-fluid-3 text-text-secondary">
          Building for the web,
          <br />
          <span className="text-accent-primary">one considered detail at a time.</span>
        </p>
      </div>

      <div>
        <div className="mb-4 h-px w-full overflow-hidden bg-border-default">
          <div
            data-pre-bar
            className="h-full w-full origin-left bg-accent-primary"
            style={{ transform: `scaleX(${count / 100})` }}
          />
        </div>
        <div className="flex items-end justify-between">
          <span
            data-pre-meta
            className="text-fluid--2 uppercase tracking-[0.28em] text-text-muted"
          >
            Loading
          </span>
          <span className="text-fluid-5 font-light leading-none tabular-nums text-text-primary">
            {String(count).padStart(3, '0')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
