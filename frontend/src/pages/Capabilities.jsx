import React, { Suspense, lazy, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { useSmoothScroll } from '../lib/SmoothScroll';

const StrataCanvas = lazy(() => import('../three/StrataCanvas'));

/**
 * The stack, read as depth rather than as a grid of logos. Each stratum
 * is a layer of the same system: what runs in the browser sits above
 * what runs on the server, which sits above what persists.
 */
const STRATA = [
  {
    id: '01',
    label: 'Interface',
    blurb: 'What the person actually touches. Layout, motion, state, feel.',
    items: ['React', 'Tailwind CSS', 'GSAP', 'Three.js', 'HTML', 'CSS'],
  },
  {
    id: '02',
    label: 'Services',
    blurb: 'The contract between screen and store. Routing, auth, integrations.',
    items: ['Node.js', 'Express.js', 'REST APIs', 'JWT Auth', 'LLM Orchestration'],
  },
  {
    id: '03',
    label: 'Persistence',
    blurb: 'Where the truth lives. Schema design, relations, query shape.',
    items: ['MongoDB', 'Mongoose', 'MySQL'],
  },
  {
    id: '04',
    label: 'Languages',
    blurb: 'The tools underneath the tools.',
    items: ['JavaScript', 'C++', 'Python'],
  },
  {
    id: '05',
    label: 'Foundations',
    blurb: 'The part that does not go out of date.',
    items: ['DSA', 'OOP', 'DBMS', 'Git & GitHub'],
  },
];

const Capabilities = () => {
  const root = useRef(null);
  const activeRef = useRef(0); // fractional, read by the shader
  const triggerRef = useRef(null);
  const [active, setActive] = useState(0);
  const { scrollTo } = useSmoothScroll();

  // The rail is a shortcut into the pinned range, not independent state —
  // jumping to a stratum means scrolling to where that stratum lives.
  const goToLayer = (i) => {
    const st = triggerRef.current;
    if (!st) {
      setActive(i);
      return;
    }
    const ratio = i / (STRATA.length - 1);
    scrollTo(st.start + (st.end - st.start) * ratio, { duration: 1 });
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return undefined;

      if (prefersReducedMotion()) {
        gsap.set('[data-anim]', { visibility: 'visible' });
        return undefined;
      }

      // Pin for one screen-height per stratum, then release.
      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top top',
        end: `+=${(STRATA.length - 1) * 75}%`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const fractional = self.progress * (STRATA.length - 1);
          activeRef.current = fractional;
          // React only hears about whole-layer changes; the in-between
          // values stay in the ref and go straight to the shader.
          setActive((prev) => {
            const next = Math.round(fractional);
            return next === prev ? prev : next;
          });
        },
      });
      triggerRef.current = st;

      gsap.set('[data-anim]', { visibility: 'visible' });
      gsap.from('[data-strata-head] > *', {
        yPercent: 100,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'sweep',
        scrollTrigger: { trigger: el, start: 'top 75%', once: true },
      });

      return () => st.kill();
    },
    { scope: root },
  );

  // Swap animation for the active stratum's detail column. The copy
  // changes at the midpoint between two strata, where the 3D is halfway
  // through its own interpolation — without a dissolve the text cuts
  // while everything around it is still moving, which reads as a glitch.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '[data-strata-copy]',
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.6, ease: 'sweep', overwrite: true },
      );
      gsap.fromTo(
        '[data-strata-item]',
        { yPercent: 60, autoAlpha: 0 },
        {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.7,
          stagger: 0.045,
          ease: 'sweep',
          overwrite: true,
        },
      );
    },
    { scope: root, dependencies: [active] },
  );

  const current = STRATA[active] ?? STRATA[0];

  return (
    <section
      id="capabilities"
      ref={root}
      className="relative h-[100svh] w-full overflow-hidden bg-bg-primary"
    >
      <div className="fill-parent z-0">
        <Suspense fallback={null}>
          <StrataCanvas activeRef={activeRef} layerCount={STRATA.length} />
        </Suspense>
        <div className="vignette" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between px-gutter py-[max(2rem,6vh)]">
        <div data-strata-head className="flex flex-col gap-4">
          <div className="line-mask">
            <p data-anim className="eyebrow">
              <span className="text-accent-primary">02</span> Capabilities
            </p>
          </div>
          <div className="line-mask">
            <h2 data-anim className="max-w-[14ch] text-fluid-5 text-text-primary">
              The stack, in{' '}
              <span className="serif-italic text-accent-primary">layers</span>
            </h2>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:items-end">
          {/* Index rail */}
          <ol className="flex flex-col gap-1">
            {STRATA.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    data-cursor="link"
                    onClick={() => goToLayer(i)}
                    className="group flex w-full items-baseline gap-4 border-b border-border-default/60 py-2 text-left transition-colors duration-500"
                  >
                    <span
                      className={`text-fluid--2 tabular-nums tracking-[0.2em] transition-colors duration-500 ${
                        isActive ? 'text-accent-primary' : 'text-text-muted'
                      }`}
                    >
                      {s.id}
                    </span>
                    <span
                      className={`text-fluid-2 transition-all duration-700 ease-out-expo ${
                        isActive
                          ? 'translate-x-2 text-text-primary'
                          : 'text-text-muted group-hover:translate-x-1 group-hover:text-text-secondary'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Detail column */}
          <div className="flex flex-col gap-6">
            <p
              data-strata-copy
              key={current.id}
              className="measure text-fluid-0 text-text-secondary"
            >
              {current.blurb}
            </p>
            <ul className="flex flex-wrap gap-x-3 gap-y-3">
              {current.items.map((item) => (
                <li
                  key={`${current.id}-${item}`}
                  data-strata-item
                  className="rounded-full border border-border-default px-4 py-2 text-fluid--1 text-text-primary backdrop-blur-[2px]"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-fluid--2 uppercase tracking-[0.28em] text-text-muted">
              Scroll to descend
              <span className="mx-3 text-accent-primary">/</span>
              {String(active + 1).padStart(2, '0')} — {String(STRATA.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Capabilities;
