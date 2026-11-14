import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { useSmoothScroll } from '../lib/SmoothScroll';
import { CONTACT } from '../helper/ProfileHelper';
import ThemeDisc from './ThemeDisc';
import { Arrow } from './Doodles';

const INKS = ['bg-text-primary', 'bg-accent-primary', 'bg-accent-secondary', 'bg-highlight', 'bg-paper'];

/**
 * The colophon — the last page of a printed thing, where it says how it
 * was made. The name rises from the bottom edge as the page ends, and
 * the printer's colour bar signs it off.
 */
const Footer = () => {
  const root = useRef(null);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      gsap.set('[data-anim]', { visibility: 'visible' });
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        '[data-footer-mark]',
        { yPercent: 45 },
        {
          yPercent: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top bottom',
            end: 'bottom bottom',
            scrub: 0.6,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative w-full overflow-hidden border-t-2 border-text-primary bg-bg-secondary">
      <div className="shell flex flex-col gap-10 pb-6 pt-[clamp(3rem,8vh,6rem)]">
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-12">
          <div className="flex flex-col gap-3 lg:col-span-6">
            <p className="hand text-accent-secondary">That’s everything. Thanks for scrolling.</p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="link-ink w-fit break-all font-display text-fluid-3 font-semibold leading-tight text-text-primary"
            >
              {CONTACT.email}
            </a>
          </div>

          <div className="flex flex-col gap-2 text-fluid--1 text-text-secondary lg:col-span-3">
            <p className="label text-text-muted">Colophon</p>
            <p>Set in Fraunces and Bricolage Grotesque, with notes in Caveat.</p>
            <p>Built with React, Three.js, GSAP and Lenis.</p>
          </div>

          <div className="flex flex-col gap-2 text-fluid--1 lg:col-span-3">
            <p className="label text-text-muted">Elsewhere</p>
            <Link to="/parallel" data-cursor-label="Peek" className="link-ink w-fit">
              Off the record
            </Link>
            <Link to="/preferences" className="link-ink w-fit">
              Preferences
            </Link>
            <a href={CONTACT.resume} target="_blank" rel="noopener noreferrer" className="link-ink w-fit">
              Résumé
            </a>
          </div>
        </div>

        {/* Wordmark, rising out of the page edge */}
        <div className="relative -mb-[0.1em] overflow-hidden pt-4">
          <p
            data-footer-mark
            data-anim
            aria-hidden="true"
            className="display whitespace-nowrap text-[clamp(4rem,21vw,21rem)] leading-[0.8] text-text-primary"
          >
            Shrutik<span className="display-i text-accent-primary">.</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-text-primary/25 pt-5 lg:pr-52">
          <span className="label text-text-muted">© {new Date().getFullYear()} Shrutik Gupta</span>

          {/* Printer's colour bar: the five inks this site is printed in. */}
          <div className="flex items-center gap-3" aria-hidden="true">
            <div className="flex border-2 border-text-primary">
              {INKS.map((ink) => (
                <span key={ink} className={`block h-4 w-6 ${ink}`} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeDisc />
            <button
              type="button"
              onClick={() => scrollTo(0, { duration: 1.6 })}
              className="hand flex items-center gap-1 text-text-secondary transition-colors hover:text-accent-primary"
            >
              back to top
              <Arrow className="h-6 w-8 -rotate-[130deg]" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
