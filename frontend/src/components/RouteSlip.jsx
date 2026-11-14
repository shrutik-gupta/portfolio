import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { PAGE_ORDER, ROUTES, useAudience } from '../lib/audience';
import { useSectionNav } from '../lib/sectionNav';
import { ArrowRight } from './Doodles';

/**
 * The route slip: a scrap of paper pinned to the top-right corner.
 *
 * Closed, it says who you are visiting as. Open, it offers three shorter
 * routes through the same page. Once a route is chosen it also shows the
 * next stop, so a recruiter can get from "who is this" to "contact" in
 * four taps without scrolling past everything in between.
 */
const RouteSlip = ({ active }) => {
  const { audience, setAudience, route } = useAudience();
  const goToSection = useSectionNav();
  const [open, setOpen] = useState(false);
  const root = useRef(null);

  // Click-away and Escape close the slip.
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!root.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // The next stop is the first one further down the page than the reader.
  const here = active ? PAGE_ORDER.indexOf(active) : -1;
  const stops = route?.stops ?? [];
  const next = stops.find((s) => PAGE_ORDER.indexOf(s.id) > here);
  const currentStop = stops.findIndex((s) => s.id === active);

  const choose = (id) => {
    setAudience(id);
    setOpen(false);
    if (id) goToSection(ROUTES[id].stops[0].id);
  };

  return (
    <div
      ref={root}
      className="fixed right-3 top-3 z-[72] flex flex-col items-end gap-2 sm:right-5 sm:top-4"
    >
      <div className="paper flex -rotate-1 items-stretch border-2 border-text-primary shadow-hard transition-transform duration-300 ease-spring hover:rotate-0">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="route-options"
          className="flex items-center gap-2 px-3 py-2 text-left"
        >
          <span className="flex flex-col leading-none">
            <span className="label text-[0.62rem] text-text-muted">
              {route ? 'Your route' : 'Short on time?'}
            </span>
            <span className="mt-1 text-fluid--1 font-semibold">
              {route ? route.name : 'Pick a route'}
            </span>
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {route && next && (
          <button
            type="button"
            onClick={() => goToSection(next.id)}
            className="group flex items-center gap-2 border-l-2 border-text-primary bg-highlight px-3 py-2 text-left"
          >
            <span className="flex flex-col leading-none">
              <span className="label text-[0.62rem]">Next stop</span>
              <span className="mt-1 max-w-[9rem] truncate text-fluid--1 font-semibold">
                {next.label}
              </span>
            </span>
            <ArrowRight className="h-4 w-6 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        )}
      </div>

      {open && (
        <div
          id="route-options"
          className="paper w-[min(21rem,calc(100vw-1.5rem))] animate-pop-in border-2 border-text-primary p-4 shadow-hard"
        >
          <p className="hand text-accent-secondary">Who’s visiting?</p>
          <p className="mt-1 text-fluid--2 text-text-secondary">
            Same page either way. A route just points out the parts you came for.
          </p>

          <ul className="mt-3 flex flex-col">
            {Object.entries(ROUTES).map(([id, r]) => {
              const selected = audience === id;
              return (
                <li key={id} className="border-t border-text-primary/20">
                  <button
                    type="button"
                    onClick={() => choose(id)}
                    aria-pressed={selected}
                    className="group flex w-full items-center justify-between gap-3 py-2.5 text-left"
                  >
                    <span>
                      <span className="block font-display text-fluid-1 font-semibold leading-tight transition-colors group-hover:text-accent-primary">
                        {r.door}
                      </span>
                      <span className="block text-fluid--2 text-text-secondary">{r.hint}</span>
                    </span>
                    {selected ? (
                      <Check className="h-4 w-4 shrink-0 text-accent-primary" aria-hidden="true" />
                    ) : (
                      <ArrowRight className="h-4 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {route && (
            <div className="mt-2 border-t-2 border-text-primary pt-3">
              <p className="label text-text-muted">Stops on this route</p>
              <ol className="mt-2 flex flex-col gap-1">
                {stops.map((s, i) => (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        goToSection(s.id);
                      }}
                      className={`flex w-full items-baseline gap-3 text-left text-fluid--1 hover:text-accent-primary ${
                        i === currentStop ? 'font-semibold text-accent-primary' : ''
                      }`}
                    >
                      <span className="label tabular-nums text-text-muted">{i + 1}</span>
                      {s.label}
                    </button>
                  </li>
                ))}
                {audience === 'hire' && (
                  <li>
                    <a
                      href="/resume.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-baseline gap-3 text-fluid--1 hover:text-accent-primary"
                    >
                      <span className="label text-text-muted">↗</span>
                      Open the résumé
                    </a>
                  </li>
                )}
              </ol>

              <button
                type="button"
                onClick={() => choose(null)}
                className="label mt-3 flex items-center gap-2 text-text-secondary hover:text-accent-primary"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Clear the route
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteSlip;
