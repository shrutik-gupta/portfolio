import React, { Suspense, lazy, useRef } from 'react';
import { Check } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { useAppReady } from '../lib/ready';
import { useSectionNav } from '../lib/sectionNav';
import { ROUTES, useAudience } from '../lib/audience';
import { useTheme } from '../contexts/ThemeContext';
import { easeThemeChange } from '../lib/themeSwitch';
import { CONTACT } from '../helper/ProfileHelper';
import { Arrow, Registration } from '../components/Doodles';

const HeroCanvas = lazy(() => import('../three/HeroCanvas'));

const DOOR_TILT = ['-rotate-2', 'rotate-1', '-rotate-1'];

/**
 * The cover.
 *
 * One sentence says who, what and what kind. Beside it sits the maquette
 * in front of the disc — the sun by day, the moon after dark. Tapping the
 * disc changes the theme. Under the sentence, three doors offer a shorter
 * route through the page; walking past them is fine too.
 */
const Hero = () => {
  const root = useRef(null);
  const discRef = useRef(null);
  const { ready } = useAppReady();
  const goToSection = useSectionNav();
  const { audience, setAudience } = useAudience();
  const { isDark, toggleTheme } = useTheme();

  // Written by GSAP, read by the 3D scene every frame.
  // Refs rather than state: the canvas must never re-render React.
  const progressRef = useRef(0);
  const revealRef = useRef(0);

  const switchTheme = () => {
    easeThemeChange();
    toggleTheme();
    if (prefersReducedMotion()) return;
    // The disc dips below the horizon and comes back as the other one.
    gsap.fromTo(
      discRef.current,
      { yPercent: 46, scale: 0.86 },
      { yPercent: 0, scale: 1, duration: 1.1, ease: 'sweep', overwrite: 'auto' },
    );
  };

  // A click on the canvas that misses every block still counts as a tap
  // on the disc, if that is what was under the pointer.
  const onCanvasMiss = (e) => {
    const disc = discRef.current?.getBoundingClientRect();
    if (!disc) return;
    const r = disc.width / 2;
    const dx = e.clientX - (disc.left + r);
    const dy = e.clientY - (disc.top + r);
    if (dx * dx + dy * dy <= r * r) switchTheme();
  };

  const openDoor = (id) => {
    setAudience(id);
    goToSection(ROUTES[id].stops.find((s) => s.id !== 'hero').id);
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return undefined;

      gsap.set('[data-anim]', { visibility: 'visible' });

      if (prefersReducedMotion()) {
        revealRef.current = 1;
        return undefined;
      }

      // Held until the curtain lifts — otherwise the entrance plays out
      // of sight behind the preloader and is over on reveal.
      if (!ready) {
        gsap.set('[data-hero-line]', { yPercent: 115 });
        gsap.set('[data-hero-fade], [data-hero-door]', { autoAlpha: 0 });
        gsap.set(discRef.current, { yPercent: 60, scale: 0.7, autoAlpha: 0 });
        return undefined;
      }

      const tl = gsap.timeline({ defaults: { ease: 'sweep' } });
      tl.fromTo(
        '[data-hero-line]',
        { yPercent: 115 },
        { yPercent: 0, duration: 1.15, stagger: 0.1 },
      )
        .fromTo(
          discRef.current,
          { yPercent: 60, scale: 0.7, autoAlpha: 0 },
          { yPercent: 0, scale: 1, autoAlpha: 1, duration: 1.5 },
          0.1,
        )
        // Drives the maquette's pieces dropping in, one by one.
        .to(revealRef, { current: 1, duration: 1.7, ease: 'none' }, 0.35)
        .fromTo(
          '[data-hero-fade]',
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9, stagger: 0.07 },
          0.5,
        )
        .fromTo(
          '[data-hero-door]',
          { y: 40, rotate: -8, autoAlpha: 0 },
          {
            y: 0,
            rotate: 0,
            autoAlpha: 1,
            duration: 0.9,
            stagger: 0.09,
            ease: 'back.out(1.6)',
            clearProps: 'transform',
          },
          0.85,
        );

      // Leaving: the pieces drift apart and the disc sinks a little.
      // Nothing is pinned — the page keeps scrolling at its own speed.
      const exit = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });
      exit.to('[data-hero-disc-wrap]', { yPercent: 22, ease: 'none' }, 0);

      return () => {
        tl.kill();
        exit.scrollTrigger?.kill();
        exit.kill();
      };
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );

  return (
    <section
      id="hero"
      ref={root}
      className="relative flex min-h-[100svh] w-full flex-col overflow-hidden px-gutter pb-8 pt-20 lg:pt-10"
    >
      {/* Printer's marks: this is the cover sheet. */}
      <span className="crop left-3 top-3 hidden lg:block" aria-hidden="true" />
      <span className="crop bottom-3 left-3 hidden lg:block" aria-hidden="true" />
      <span className="crop bottom-3 right-3 hidden lg:block" aria-hidden="true" />

      {/* --- Masthead --- */}
      <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 pr-0 lg:pr-56">
        <p data-hero-fade data-anim className="label text-text-secondary">
          Shrutik Gupta <span className="mx-1 text-accent-primary">/</span> Software developer
        </p>
        <p data-hero-fade data-anim className="label flex items-center gap-2 text-text-secondary">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          Open to work <span className="mx-1 text-accent-primary">/</span> Mumbai, India
        </p>
      </div>

      {/* --- The sentence + the object --- */}
      <div className="relative flex flex-1 flex-col justify-center py-8 lg:py-10">
        <h1
          data-anim
          className="display relative z-10 w-fit text-[clamp(2.6rem,11.4vw,6rem)] text-text-primary lg:text-[clamp(4rem,7.6vw,9.2rem)]"
        >
          <span className="line-mask">
            <span data-hero-line className="block">
              Shrutik builds
            </span>
          </span>
          <span className="line-mask">
            <span data-hero-line className="block">
              <span className="marker">websites &amp; apps,</span>
            </span>
          </span>
          <span className="line-mask">
            <span data-hero-line className="display-i block text-accent-primary">
              start to finish.
            </span>
          </span>
        </h1>

        {/* The object. On large screens it stands to the right of the
            sentence; on small ones it gets its own row underneath. */}
        <div className="relative mx-auto mt-6 aspect-[5/4] w-full max-w-md lg:absolute lg:-right-[2%] lg:top-1/2 lg:mx-0 lg:mt-0 lg:aspect-auto lg:h-[min(92%,44rem)] lg:w-[46%] lg:max-w-none lg:-translate-y-1/2">
          <div data-hero-disc-wrap className="fill-parent grid place-items-center">
            <button
              ref={discRef}
              type="button"
              onClick={switchTheme}
              data-anim
              aria-label={isDark ? 'Switch to the light theme' : 'Switch to the dark theme'}
              data-cursor-label={isDark ? 'Sunrise' : 'Sunset'}
              className="aspect-square w-[62%] rounded-full bg-disc lg:w-[min(64%,28rem)]"
            />
          </div>

          <Suspense fallback={null}>
            {/* The mask fades the table's shadow out before the canvas edge. */}
            <HeroCanvas
              progressRef={progressRef}
              revealRef={revealRef}
              onMiss={onCanvasMiss}
              className="fill-parent [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_80%,transparent)]"
            />
          </Suspense>

          <p
            data-hero-fade
            data-anim
            className="hand pointer-events-none absolute right-[4%] top-[2%] flex items-end gap-1 text-text-secondary lg:right-[10%] lg:top-[6%]"
          >
            <span className="max-w-[7.5rem] text-right">
              tap the {isDark ? 'moon' : 'sun'},<br />poke the blocks
            </span>
            <Arrow className="mb-1 h-7 w-9 -scale-x-100 rotate-[20deg]" />
          </p>
        </div>

        <p
          data-hero-fade
          data-anim
          className="relative z-10 mt-7 max-w-[34ch] text-fluid-1 leading-snug text-text-secondary lg:mt-9"
        >
          I’m a software developer from Mumbai. I build AI-powered products
          and the back ends that keep them running.
        </p>

        {/* --- Three doors --- */}
        <div className="relative z-10 mt-9 w-full sm:w-fit lg:mt-12">
          <p data-hero-fade data-anim className="hand mb-3 text-accent-secondary">
            What brings you here?
          </p>
          <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            {Object.entries(ROUTES).map(([id, r], i) => {
              const selected = audience === id;
              return (
                <li key={id} data-hero-door data-anim>
                  <button
                    type="button"
                    onClick={() => openDoor(id)}
                    aria-pressed={selected}
                    className={`paper group relative flex w-full items-center gap-3 border-2 border-text-primary px-4 py-3 text-left shadow-hard transition-transform duration-300 ease-spring hover:-translate-y-1 hover:rotate-0 active:translate-y-0.5 sm:w-auto ${DOOR_TILT[i]}`}
                  >
                    <span
                      className={`label grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-text-primary transition-colors ${
                        selected ? 'bg-accent-primary text-text-inverse' : 'group-hover:bg-highlight'
                      }`}
                    >
                      {selected ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                    </span>
                    <span>
                      <span className="block font-display text-fluid-1 font-semibold leading-tight">
                        {r.door}
                      </span>
                      <span className="block text-fluid--2 text-text-secondary">{r.hint}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* --- Foot of the cover --- */}
      <div
        data-hero-fade
        data-anim
        className="relative z-10 flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-t border-text-primary/25 pt-5"
      >
        <button
          type="button"
          onClick={() => goToSection('about')}
          className="hand flex items-center gap-2 text-text-secondary transition-colors hover:text-accent-primary"
        >
          or just scroll
          <Arrow className="h-6 w-8 animate-nudge rotate-[35deg]" />
        </button>

        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-fluid--1">
          {CONTACT.channels.map((c) => (
            <li key={c.label}>
              <a href={c.href} target="_blank" rel="noopener noreferrer" className="link-ink">
                {c.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={CONTACT.resume}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="PDF"
              className="link-ink font-semibold"
            >
              Résumé ↗
            </a>
          </li>
        </ul>

        <Registration className="hidden h-6 w-6 text-text-muted lg:block" />
      </div>
    </section>
  );
};

export default Hero;
