import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { useReveal } from '../lib/reveal';
import ExperienceCard from '../components/ExperienceCard';
import LensNote from '../components/LensNote';
import { ArrowRight } from '../components/Doodles';
import experience from '../helper/ExperienceHeper';
import { AWARDS, COURSES } from '../helper/ProfileHelper';

/** A wandering dotted line, drawn once and stretched to any height. */
const ROUTE = (() => {
  let d = 'M20 0';
  const bends = 9;
  for (let i = 0; i < bends; i += 1) {
    const y0 = (i / bends) * 1000;
    const y1 = ((i + 1) / bends) * 1000;
    const x = i % 2 === 0 ? 34 : 6;
    d += ` C ${x} ${y0 + 40}, ${x} ${y1 - 40}, 20 ${y1}`;
  }
  return d;
})();

/**
 * The path so far, drawn as a route on a map. The dotted line is
 * uncovered as the reader scrolls, so it always ends where they are.
 * Below it: the wins and the courses, and a ticket to the page that is
 * not on the résumé.
 */
const Experience = () => {
  const root = useRef(null);
  useReveal(root);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '[data-route]',
        { clipPath: 'inset(0% 0% 100% 0%)' },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-route-list]',
            start: 'top 75%',
            end: 'bottom 60%',
            scrub: 0.5,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <>
      <section id="experience" ref={root} className="relative w-full py-[clamp(5rem,13vh,10rem)]">
        <div className="shell">
          <header className="mb-[clamp(3rem,8vh,6rem)] flex flex-wrap items-end justify-between gap-6">
            <div>
              <p data-reveal className="label mb-4 text-accent-primary">
                Path
              </p>
              <h2 data-reveal className="text-fluid-7 text-text-primary">
                Where I’ve <span className="display-i text-accent-primary">been</span>
              </h2>
            </div>
            <LensNote show="hire">Work first, then campus roles.</LensNote>
          </header>

          <div className="relative mx-auto max-w-6xl">
            {/* Route line */}
            <div
              data-route
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-2 w-10 text-accent-secondary md:left-1/2 md:-translate-x-1/2"
            >
              <svg viewBox="0 0 40 1000" preserveAspectRatio="none" className="h-full w-full" fill="none">
                <path
                  d={ROUTE}
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="1 11"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>

            <ul data-route-list className="relative flex flex-col">
              {experience.map((item, i) => (
                <ExperienceCard key={`${item.company}-${item.duration}`} item={item} index={i} />
              ))}
            </ul>
          </div>

          {/* --- Wins + courses --- */}
          <div className="mt-[clamp(2rem,6vh,5rem)] grid gap-x-16 gap-y-12 border-t-2 border-text-primary pt-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p data-reveal className="label mb-6 text-accent-primary">
                Awards
              </p>
              <ul className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
                {AWARDS.map((a, i) => (
                  <li key={a.event} data-reveal data-reveal-delay={i * 0.08} className="flex items-center gap-4">
                    {/* Rosette */}
                    <span
                      aria-hidden="true"
                      className="grid h-16 w-16 shrink-0 place-items-center rounded-full border-2 border-dashed bg-highlight font-display text-fluid-1 font-semibold transition-transform duration-500 ease-spring hover:rotate-12"
                      style={{ color: 'rgb(var(--marker-ink))', borderColor: 'rgb(var(--marker-ink))' }}
                    >
                      {a.badge}
                    </span>
                    <span className="flex flex-col">
                      <span className="label text-text-muted">
                        {a.place} · {a.year}
                      </span>
                      <span className="font-display text-fluid-1 font-semibold leading-tight text-text-primary">
                        {a.event}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-5">
              <p data-reveal className="label mb-6 text-accent-primary">
                Courses
              </p>
              <ul className="flex flex-col">
                {COURSES.map((c) => (
                  <li
                    key={c.name}
                    data-reveal
                    className="flex items-baseline justify-between gap-6 border-t border-text-primary/25 py-3 text-fluid--1"
                  >
                    <span className="text-text-primary">{c.name}</span>
                    <span className="label shrink-0 text-right text-text-muted">
                      {c.by} · {c.year}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- Off the record: a ticket to the other page --- */}
      <OffHours />
    </>
  );
};

const OffHours = () => {
  const root = useRef(null);
  useReveal(root);

  return (
    <section
      id="offhours"
      ref={root}
      className="relative w-full overflow-x-clip bg-bg-secondary py-[clamp(4rem,10vh,8rem)]"
    >
      <div className="shell flex flex-col items-center gap-6">
        <LensNote show="wander" arrow={false}>
          You’ll like this one.
        </LensNote>

        <div data-reveal="drop" className="w-full max-w-3xl">
          <Link
            to="/parallel"
            data-cursor-label="Peek"
            className="ticket paper group relative flex -rotate-2 items-stretch shadow-print transition-transform duration-500 ease-spring hover:rotate-0 hover:scale-[1.02]"
          >
            <div className="flex flex-1 flex-col gap-3 py-7 pl-10 pr-6 sm:py-9 sm:pl-14">
              <span className="label text-accent-primary">Admit one · Off the record</span>
              <span className="display text-fluid-5 leading-[0.95]">
                The part that isn’t on the <span className="display-i text-accent-primary">résumé</span>
              </span>
              <span className="text-fluid-0 text-text-secondary">
                Cricket, piano, and a vlog. Three small confessions.
              </span>
            </div>
            <div className="perforation flex w-24 shrink-0 flex-col items-center justify-center gap-2 pr-6 sm:w-36 sm:pr-8">
              <span className="label vertical rotate-180 text-text-muted">No. 01</span>
              <ArrowRight className="h-5 w-8 text-accent-primary transition-transform duration-300 group-hover:translate-x-1.5" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Experience;
