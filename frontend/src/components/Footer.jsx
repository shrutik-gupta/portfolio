import React, { useRef } from 'react';
import { ArrowUp, Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { useTheme } from '../contexts/ThemeContext';
import { useSmoothScroll } from '../lib/SmoothScroll';
import Magnetic from './Magnetic';

/**
 * Closing plate. The wordmark is clipped by the section edge and rises
 * as the footer enters, so the page ends on a deliberate frame rather
 * than trailing off.
 */
const Footer = () => {
  const root = useRef(null);
  const { isDark, toggleTheme } = useTheme();
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('[data-anim]', { visibility: 'visible' });
        return;
      }
      gsap.set('[data-anim]', { visibility: 'visible' });

      gsap.from('[data-footer-mark]', {
        yPercent: 30,
        autoAlpha: 0,
        duration: 1.4,
        ease: 'sweep',
        scrollTrigger: { trigger: root.current, start: 'top 90%', once: true },
      });

      gsap.to('[data-footer-mark]', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <footer
      ref={root}
      className="relative w-full overflow-hidden border-t border-border-default bg-bg-primary"
    >
      <div className="flex flex-col gap-10 px-gutter pb-8 pt-[clamp(3rem,8vh,6rem)]">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div className="flex flex-col gap-2">
            <span className="text-fluid--2 uppercase tracking-[0.28em] text-text-muted">
              Say hello
            </span>
            <a
              href="mailto:shrutikgupta07@gmail.com"
              data-cursor="link"
              className="link-sweep text-fluid-2 text-text-primary transition-colors hover:text-accent-primary"
            >
              shrutikgupta07@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Magnetic strength={0.45}>
              <button
                type="button"
                onClick={toggleTheme}
                data-cursor="link"
                aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border-default text-text-secondary transition-colors duration-500 hover:border-accent-primary hover:text-accent-primary"
              >
                <span data-magnetic-inner className="flex">
                  {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </span>
              </button>
            </Magnetic>

            <Magnetic strength={0.45}>
              <button
                type="button"
                onClick={() => scrollTo(0, { duration: 1.6 })}
                data-cursor="link"
                aria-label="Back to top"
                className="flex h-12 items-center gap-3 rounded-full border border-border-default px-6 text-fluid--2 uppercase tracking-[0.2em] text-text-secondary transition-colors duration-500 hover:border-accent-primary hover:text-accent-primary"
              >
                <span data-magnetic-inner className="flex items-center gap-3">
                  Back to top
                  <ArrowUp className="h-4 w-4" />
                </span>
              </button>
            </Magnetic>
          </div>
        </div>

        {/* Wordmark, clipped by the page edge */}
        <div className="relative -mb-[0.12em] overflow-hidden">
          <h2
            data-footer-mark
            data-anim
            className="whitespace-nowrap text-[clamp(3rem,15.5vw,16rem)] font-medium leading-[0.85] tracking-[-0.05em] text-text-primary"
          >
            Shrutik<span className="text-accent-primary">.</span>
          </h2>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border-default pr-0 pt-6 text-fluid--2 uppercase tracking-[0.2em] text-text-muted sm:pr-20">
          <span>© {new Date().getFullYear()} Shrutik Gupta</span>
          <span className="hidden sm:block">React · Three.js · GSAP · Lenis</span>
          <Link
            to="/parallel"
            data-cursor="link"
            className="link-sweep transition-colors hover:text-accent-primary"
          >
            Off the record
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
