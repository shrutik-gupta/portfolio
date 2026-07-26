import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/motion';
import { useSmoothScroll } from '../lib/SmoothScroll';
import Magnetic from './Magnetic';
import logo from '../assets/logo.png';

const LINKS = [
  { label: 'About', section: 'about', path: '/about' },
  { label: 'Stack', section: 'capabilities', path: '/about' },
  { label: 'Work', section: 'projects', path: '/projects' },
  { label: 'Path', section: 'experience', path: '/experience' },
  { label: 'Contact', section: 'contact', path: '/contact' },
];

const Navbar = () => {
  const root = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { scrollTo } = useSmoothScroll();

  /**
   * Section links resolve to a scroll on the home page and a navigation
   * everywhere else. The scroll is deferred to the next frame after a
   * route change so the target section exists before we measure it.
   */
  const goTo = (link) => {
    setOpen(false);
    if (location.pathname === '/' || location.pathname === link.path) {
      const el = document.getElementById(link.section);
      if (el) {
        scrollTo(el, { offset: 0 });
        return;
      }
    }
    navigate('/', { state: { section: link.section } });
  };

  // Hide the bar on the way down, bring it back on the way up.
  useGSAP(
    () => {
      const el = root.current;
      if (!el || prefersReducedMotion()) return undefined;

      const show = gsap.quickTo(el, 'yPercent', { duration: 0.5, ease: 'sweep' });
      let hidden = false;

      const st = ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (self) => {
          if (open) return;
          const goingDown = self.direction === 1;
          const past = self.scroll() > 120;
          if (goingDown && past && !hidden) {
            hidden = true;
            show(-140);
          } else if ((!goingDown || !past) && hidden) {
            hidden = false;
            show(0);
          }
        },
      });

      return () => st.kill();
    },
    { scope: root, dependencies: [open] },
  );

  // Full-screen menu on small viewports.
  useGSAP(
    () => {
      const panel = menuRef.current;
      if (!panel) return;

      if (prefersReducedMotion()) {
        gsap.set(panel, { autoAlpha: open ? 1 : 0, clipPath: 'none' });
        return;
      }

      if (open) {
        gsap.set(panel, { pointerEvents: 'auto' });
        gsap
          .timeline()
          .set(panel, { autoAlpha: 1 })
          .fromTo(
            panel,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'cut' },
          )
          .from(
            '[data-menu-item]',
            { yPercent: 110, autoAlpha: 0, duration: 0.7, stagger: 0.06, ease: 'sweep' },
            '-=0.45',
          );
      } else {
        gsap
          .timeline()
          .to(panel, {
            clipPath: 'inset(0% 0% 100% 0%)',
            duration: 0.55,
            ease: 'cut',
          })
          .set(panel, { autoAlpha: 0, pointerEvents: 'none' });
      }
    },
    { dependencies: [open] },
  );

  // The menu locks the page; Escape closes it.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header
        ref={root}
        className="fixed inset-x-0 top-0 z-[70] will-change-transform"
      >
        <div className="flex items-center justify-between px-gutter py-5">
          <Magnetic strength={0.4}>
            <Link
              to="/"
              data-cursor="link"
              aria-label="Home"
              className="flex items-center gap-3"
            >
              <img src={logo} alt="" className="h-6 w-6 object-contain" />
              <span className="hidden text-fluid--2 uppercase tracking-[0.28em] text-text-secondary sm:block">
                Shrutik Gupta
              </span>
            </Link>
          </Magnetic>

          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                data-cursor="link"
                onClick={() => goTo(link)}
                className="link-sweep text-fluid--2 uppercase tracking-[0.2em] text-text-secondary transition-colors duration-500 hover:text-text-primary"
              >
                {link.label}
              </button>
            ))}
            <Link
              to="/preferences"
              data-cursor="link"
              className="link-sweep text-fluid--2 uppercase tracking-[0.2em] text-text-muted transition-colors duration-500 hover:text-text-primary"
            >
              Prefs
            </Link>
          </nav>

          {/* Menu trigger — two rules that cross into an X. */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            data-cursor="link"
            className="relative z-[81] flex h-10 w-10 flex-col items-center justify-center gap-2 md:hidden"
          >
            <span
              className={`block h-px w-6 bg-text-primary transition-transform duration-500 ease-out-expo ${
                open ? 'translate-y-[4.5px] rotate-45' : ''
              }`}
            />
            <span
              className={`block h-px w-6 bg-text-primary transition-transform duration-500 ease-out-expo ${
                open ? '-translate-y-[4.5px] -rotate-45' : ''
              }`}
            />
          </button>
        </div>
      </header>

      <div
        ref={menuRef}
        className="fixed inset-0 z-[80] flex flex-col justify-center bg-bg-secondary px-gutter opacity-0 md:hidden"
        style={{ pointerEvents: 'none' }}
      >
        <ul className="flex flex-col gap-2">
          {LINKS.map((link) => (
            <li key={link.label} className="line-mask">
              <button
                data-menu-item
                type="button"
                onClick={() => goTo(link)}
                className="block py-1 text-fluid-6 leading-[0.95] text-text-primary"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li className="line-mask mt-6">
            <Link
              data-menu-item
              to="/preferences"
              onClick={() => setOpen(false)}
              className="block text-fluid--1 uppercase tracking-[0.24em] text-text-muted"
            >
              Preferences
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
