import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion, isTouch } from '../lib/motion';
import { pointer } from '../lib/frameState';
import ExperienceCard from '../components/ExperienceCard';
import experience from '../helper/ExperienceHeper';

/**
 * Experience as a ledger rather than a stack of cards: rows share one
 * vertical rule that fills as the section is read, and a single preview
 * plate follows the cursor to show the organisation being hovered.
 */
const Experience = () => {
  const root = useRef(null);
  const plateRef = useRef(null);
  const [hovered, setHovered] = useState(null);

  useGSAP(
    () => {
      gsap.set('[data-anim]', { visibility: 'visible' });
      if (prefersReducedMotion()) return;

      gsap.from('[data-exp-head] > *', {
        yPercent: 100,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'sweep',
        scrollTrigger: { trigger: root.current, start: 'top 75%', once: true },
      });

      gsap.from('[data-exp-row]', {
        y: 40,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'sweep',
        scrollTrigger: { trigger: '[data-exp-list]', start: 'top 80%', once: true },
      });

      // The rule fills in lockstep with the reader's position.
      gsap.fromTo(
        '[data-exp-rule]',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: '[data-exp-list]',
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 0.6,
          },
        },
      );
    },
    { scope: root },
  );

  // Cursor-following preview plate.
  useGSAP(
    () => {
      if (isTouch() || prefersReducedMotion()) return undefined;
      const plate = plateRef.current;
      if (!plate) return undefined;

      const x = gsap.quickTo(plate, 'x', { duration: 0.75, ease: 'sweep' });
      const y = gsap.quickTo(plate, 'y', { duration: 0.75, ease: 'sweep' });

      const tick = () => {
        x(pointer.px);
        y(pointer.py);
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { scope: root },
  );

  useGSAP(
    () => {
      if (isTouch() || prefersReducedMotion()) return;
      gsap.to(plateRef.current, {
        autoAlpha: hovered === null ? 0 : 1,
        scale: hovered === null ? 0.85 : 1,
        duration: 0.55,
        ease: 'sweep',
        overwrite: true,
      });
    },
    { dependencies: [hovered] },
  );

  const active = hovered === null ? null : experience[hovered];

  return (
    <section
      id="experience"
      ref={root}
      className="relative w-full bg-bg-primary py-[clamp(5rem,12vh,10rem)]"
    >
      <div className="px-gutter">
        <div data-exp-head className="mb-14 flex flex-col gap-3">
          <div className="line-mask">
            <p data-anim className="eyebrow">
              <span className="text-accent-primary">04</span> Path
            </p>
          </div>
          <div className="line-mask">
            <h2 data-anim className="max-w-[16ch] text-fluid-5 text-text-primary">
              Where I&apos;ve{' '}
              <span className="serif-italic text-accent-primary">been</span>
            </h2>
          </div>
        </div>

        <div className="relative">
          {/* Reading rule */}
          <span
            aria-hidden="true"
            className="absolute -left-[max(0.75rem,2vw)] top-0 hidden h-full w-px bg-border-default md:block"
          >
            <span
              data-exp-rule
              className="block h-full w-full origin-top bg-accent-primary"
            />
          </span>

          <ul data-exp-list className="flex flex-col border-b border-border-default">
            {experience.map((item, i) => (
              <ExperienceCard
                key={`${item.company}-${item.duration}`}
                item={item}
                index={i}
                onHover={setHovered}
                onLeave={() => setHovered(null)}
              />
            ))}
          </ul>
        </div>
      </div>

      {/* Shared preview plate */}
      <div
        ref={plateRef}
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0 z-[80] hidden opacity-0 md:block"
      >
        <div className="-translate-x-1/2 -translate-y-[130%]">
          {active?.logo && (
            <div className="flex items-center gap-3 border border-border-hover bg-bg-card/90 p-3 backdrop-blur-md">
              <img
                src={active.logo}
                alt=""
                className="h-12 w-12 object-contain"
                loading="lazy"
              />
              <span className="pr-2 text-fluid--2 uppercase tracking-[0.2em] text-text-secondary">
                {active.company.split('|')[0].trim()}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Experience;
