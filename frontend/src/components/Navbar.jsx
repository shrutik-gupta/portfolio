import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { useSmoothScroll } from '../lib/SmoothScroll';
import { useSectionNav } from '../lib/sectionNav';
import { PAGE_ORDER } from '../lib/audience';
import ThemeDisc from './ThemeDisc';
import RouteSlip from './RouteSlip';
import logo from '../assets/logo.png';

const LINKS = [
  { label: 'About', section: 'about' },
  { label: 'Work', section: 'projects' },
  { label: 'Services', section: 'services' },
  { label: 'Skills', section: 'capabilities' },
  { label: 'Path', section: 'experience' },
  { label: 'Contact', section: 'contact' },
];

/**
 * Which section is under the reader's eye. One observer, re-attached per
 * route because the sections only exist on the home document.
 */
const useActiveSection = (pathname) => {
  const [active, setActive] = useState(null);

  useEffect(() => {
    const els = PAGE_ORDER.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) {
      setActive(null);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      // A thin band across the middle of the viewport.
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return active;
};

/**
 * Navigation, as part of the object rather than a bar on top of it.
 *
 *  - Desktop: a book spine down the left edge. Sections are index tabs;
 *    the one you are reading sticks out.
 *  - Mobile: a dock along the bottom with Home, Index and the theme disc.
 *    Index opens a contents page.
 *  - Everywhere: the route slip (top right) for visitors who want a
 *    shorter path through the page.
 */
const Navbar = () => {
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const { scrollTo } = useSmoothScroll();
  const goToSection = useSectionNav();
  const active = useActiveSection(pathname);

  const goTo = (section) => {
    setOpen(false);
    goToSection(section);
  };

  // The monogram always means "back to the start".
  const goHome = () => {
    setOpen(false);
    if (document.getElementById('hero')) scrollTo(0, { duration: 1.2 });
  };

  // Contents page (mobile).
  useGSAP(
    () => {
      const panel = menuRef.current;
      if (!panel) return;

      if (prefersReducedMotion()) {
        gsap.set(panel, { autoAlpha: open ? 1 : 0, clipPath: 'none' });
        gsap.set(panel, { pointerEvents: open ? 'auto' : 'none' });
        return;
      }

      if (open) {
        gsap.set(panel, { pointerEvents: 'auto' });
        gsap
          .timeline()
          .set(panel, { autoAlpha: 1 })
          .fromTo(
            panel,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'cut' },
          )
          .from(
            '[data-menu-item]',
            { yPercent: 110, duration: 0.6, stagger: 0.05, ease: 'sweep' },
            '-=0.4',
          );
      } else {
        gsap
          .timeline()
          .to(panel, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.5, ease: 'cut' })
          .set(panel, { autoAlpha: 0, pointerEvents: 'none' });
      }
    },
    { dependencies: [open] },
  );

  // Escape closes the contents page.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      {/* ---------- Spine (desktop) ---------- */}
      <header className="fixed inset-y-0 left-0 z-[70] hidden w-rail flex-col items-center justify-between border-r border-text-primary/15 bg-bg-secondary py-4 lg:flex">
        <Link
          to="/"
          onClick={goHome}
          aria-label="Shrutik Gupta — back to the start"
          data-cursor-label="Top"
          className="grid h-10 w-10 place-items-center transition-transform duration-500 ease-spring hover:-rotate-12 hover:scale-110"
        >
          <img src={logo} alt="" className="h-7 w-7 object-contain" />
        </Link>

        <nav aria-label="Sections" className="no-scrollbar min-h-0 w-full overflow-y-auto">
          <ul className="flex flex-col items-stretch">
            {LINKS.map((link) => {
              const isActive = active === link.section;
              return (
                <li key={link.section}>
                  <button
                    type="button"
                    onClick={() => goTo(link.section)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`group relative flex w-full justify-center py-3 transition-colors duration-300 ${
                      isActive ? 'text-text-inverse' : 'text-text-secondary hover:text-text-primary'
                    }`}
                  >
                    {/* The tab itself: slides out past the spine when active. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0.5 left-0 origin-left bg-accent-primary transition-transform duration-500 ease-out-expo ${
                        isActive ? 'scale-x-100' : 'scale-x-0'
                      }`}
                      style={{ width: 'calc(100% + 0.5rem)', clipPath: 'polygon(0 0, 88% 0, 100% 14%, 100% 86%, 88% 100%, 0 100%)' }}
                    />
                    <span className="label vertical relative rotate-180 transition-transform duration-300 group-hover:-translate-y-0.5">
                      {link.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col items-center gap-1">
          <ThemeDisc />
          <Link
            to="/preferences"
            aria-label="Preferences"
            title="Preferences"
            data-cursor-label="Prefs"
            className={`grid h-10 w-10 place-items-center transition-colors hover:text-accent-primary ${
              pathname === '/preferences' ? 'text-accent-primary' : 'text-text-secondary'
            }`}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Link>
        </div>
      </header>

      {/* ---------- Dock (mobile) ---------- */}
      <header className="fixed inset-x-0 bottom-0 z-[82] flex h-dock items-stretch justify-between border-t border-text-primary/20 bg-bg-secondary px-3 lg:hidden">
        <Link
          to="/"
          onClick={goHome}
          aria-label="Shrutik Gupta — back to the start"
          className="flex items-center gap-2 px-2"
        >
          <img src={logo} alt="" className="h-6 w-6 object-contain" />
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="contents"
          className="label flex flex-1 items-center justify-center gap-3 text-text-primary"
        >
          {/* Three rules, like the edge of a stack of pages. */}
          <span className="flex flex-col gap-[3px]" aria-hidden="true">
            <span className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${open ? 'translate-y-[5px] rotate-45' : ''}`} />
            <span className={`block h-[2px] w-5 bg-current transition-opacity duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block h-[2px] w-5 bg-current transition-transform duration-300 ${open ? '-translate-y-[5px] -rotate-45' : ''}`} />
          </span>
          {open ? 'Close' : 'Index'}
        </button>

        <div className="flex items-center">
          <ThemeDisc />
        </div>
      </header>

      {/* ---------- Contents page (mobile) ---------- */}
      <div
        id="contents"
        ref={menuRef}
        data-lenis-prevent
        className="fixed inset-0 z-[80] flex flex-col justify-between overflow-y-auto bg-bg-secondary px-gutter pb-[calc(var(--dock)+1.5rem)] pt-8 opacity-0 lg:hidden"
        style={{ pointerEvents: 'none', visibility: 'hidden' }}
        aria-hidden={!open}
      >
        <p className="label text-text-muted">Contents</p>

        <ul className="my-8 flex flex-col">
          {LINKS.map((link, i) => (
            <li key={link.section} className="line-mask border-b border-text-primary/15">
              <button
                data-menu-item
                type="button"
                tabIndex={open ? 0 : -1}
                onClick={() => goTo(link.section)}
                className="flex w-full items-baseline justify-between gap-4 py-3 text-left"
              >
                <span className="display text-fluid-5 text-text-primary">{link.label}</span>
                <span className="label tabular-nums text-accent-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap gap-x-6 gap-y-3 text-fluid--1 text-text-secondary">
          <li>
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1} className="link-ink">
              Résumé
            </a>
          </li>
          <li>
            <Link to="/parallel" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="link-ink">
              Off the record
            </Link>
          </li>
          <li>
            <Link to="/preferences" tabIndex={open ? 0 : -1} onClick={() => setOpen(false)} className="link-ink">
              Preferences
            </Link>
          </li>
        </ul>
      </div>

      <RouteSlip active={active} />
    </>
  );
};

export default Navbar;
