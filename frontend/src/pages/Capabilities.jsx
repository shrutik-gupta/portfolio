import React, { Suspense, lazy, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { useReveal } from '../lib/reveal';
import LensNote from '../components/LensNote';
import { STACK } from '../helper/ProfileHelper';

const StackCanvas = lazy(() => import('../three/StackCanvas'));

/** Shown instead of the 3D stack when motion is reduced. Same idea, flat. */
const FlatStack = () => (
  <div className="flex h-full flex-col-reverse items-center justify-center gap-1.5" aria-hidden="true">
    {STACK.map((layer, i) => (
      <span
        key={layer.label}
        className={`block h-10 border-2 border-text-primary ${layer.swatch}`}
        style={{ width: `${82 - i * 10}%` }}
      />
    ))}
  </div>
);

/**
 * Skills, as the thing developers already call them: a stack.
 *
 * The list on the right is read bottom layer first. Each group's block
 * drops onto the tower as that group reaches the middle of the screen, so
 * by the end of the list the whole stack is standing. Scrolling back up
 * takes it apart again. Nothing is pinned.
 */
const Capabilities = () => {
  const root = useRef(null);
  const listRef = useRef(null);
  // Fractional count of landed layers, read by the scene. The foundation
  // is always there, so the table is never empty.
  const activeRef = useRef(1);
  const [active, setActive] = useState(0);

  useReveal(root);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        activeRef.current = STACK.length;
        setActive(-1);
        return undefined;
      }

      // Each block is tied to its own line, not to the list as a whole:
      // it starts to fall when that line's heading comes up to 3/4 of the
      // way down the screen, and has landed by the time the heading
      // reaches the middle — i.e. while the line is being read.
      const FALL_FROM = 0.75;
      const FALL_TO = 0.5;
      const rows = gsap.utils.toArray('[data-layer]', listRef.current);
      let tops = [];

      const measure = () => {
        tops = rows.map((row) => row.getBoundingClientRect().top + window.scrollY);
      };

      const update = (self) => {
        const vh = window.innerHeight;
        const y = self.scroll();
        let landed = 1; // the foundation is always on the table
        let index = 0;
        for (let i = 1; i < rows.length; i += 1) {
          const fromTop = (tops[i] - y) / vh; // heading position, 0 = top of screen
          const t = Math.min(1, Math.max(0, (FALL_FROM - fromTop) / (FALL_FROM - FALL_TO)));
          landed += t;
          // The line is marked once its block is most of the way down.
          if (t >= 0.6) index = i;
        }
        activeRef.current = landed;
        // React only hears about whole-layer changes.
        setActive((prev) => (prev === index ? prev : index));
      };

      const st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top bottom',
        end: 'bottom top',
        onRefresh: (self) => {
          measure();
          update(self);
        },
        onUpdate: update,
      });
      measure();

      return () => st.kill();
    },
    { scope: root },
  );

  return (
    <section
      id="capabilities"
      ref={root}
      className="relative w-full bg-bg-secondary py-[clamp(5rem,13vh,10rem)]"
    >
      <div className="shell">
        <header className="mb-[clamp(2.5rem,7vh,5rem)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <p data-reveal className="label mb-4 text-accent-primary">
              Skills
            </p>
            <h2 data-reveal className="text-fluid-7 text-text-primary">
              The stack, <span className="display-i text-accent-primary">stacked</span>
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <LensNote show="hire">Every keyword is in this list.</LensNote>
            <LensNote show="wander">Scroll slowly here.</LensNote>
            <p data-reveal className="label text-text-muted">Built from the ground up — keep scrolling</p>
          </div>
        </header>

        <div className="grid gap-x-16 gap-y-8 lg:grid-cols-12">
          {/* --- The tower. Stays in view while the list scrolls past. --- */}
          <div className="sticky top-0 z-10 -mx-[var(--gutter)] h-[34svh] self-start border-b border-text-primary/15 bg-bg-secondary lg:top-[12vh] lg:col-span-5 lg:mx-0 lg:h-[76vh] lg:border-0">
            <div className="relative h-full w-full">
              <Suspense fallback={null}>
                <StackCanvas activeRef={activeRef} fallback={<FlatStack />} />
              </Suspense>
            </div>
          </div>

          {/* --- The list --- */}
          <ol ref={listRef} className="flex flex-col lg:col-span-7 lg:pb-[18vh] lg:pt-[10vh]">
            {STACK.map((layer, i) => {
              const isActive = active === i;
              const landed = active === -1 || i <= active;
              return (
                <li
                  key={layer.label}
                  data-layer
                  className={`grid grid-cols-[auto_1fr] gap-x-5 border-t border-text-primary/25 py-8 transition-opacity duration-500 sm:gap-x-8 lg:py-[7vh] ${
                    landed ? 'opacity-100' : 'opacity-45'
                  }`}
                >
                  <span className="flex flex-col items-center gap-3 pt-2">
                    <span
                      aria-hidden="true"
                      className={`block h-4 w-4 border-2 border-text-primary transition-transform duration-500 ease-spring ${layer.swatch} ${
                        isActive ? 'rotate-45 scale-125' : ''
                      }`}
                    />
                    <span className="label tabular-nums text-text-muted">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </span>

                  <div className="flex flex-col gap-3">
                    <h3 className="text-fluid-4 text-text-primary">
                      <span className={isActive ? 'marker' : ''}>{layer.label}</span>
                    </h3>
                    <p className="measure text-fluid-0 text-text-secondary">{layer.blurb}</p>
                    <ul className="flex flex-wrap gap-x-2 gap-y-1 font-display text-fluid-2 leading-snug text-text-primary">
                      {layer.items.map((item, j) => (
                        <li key={item} className="flex items-center gap-2">
                          {item}
                          {j < layer.items.length - 1 && (
                            <span className="text-accent-primary" aria-hidden="true">
                              /
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
