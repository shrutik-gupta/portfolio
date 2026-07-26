import React, { Suspense, lazy, useRef } from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText, prefersReducedMotion } from '../lib/motion';
import { useAppReady } from '../lib/ready';
import { useSmoothScroll } from '../lib/SmoothScroll';
import Magnetic from '../components/Magnetic';

const HeroCanvas = lazy(() => import('../three/HeroCanvas'));

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/shrutik-gupta' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/shrutik-gupta' },
  { label: 'Email', href: 'mailto:shrutikgupta07@gmail.com' },
];

const Hero = () => {
  const root = useRef(null);
  const headlineRef = useRef(null);
  const { ready } = useAppReady();
  const { scrollTo } = useSmoothScroll();

  // Written every frame by the exit ScrollTrigger, read by the shader.
  // Refs rather than state: the canvas must never re-render React.
  const progressRef = useRef(0);
  const revealRef = useRef(0);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) return undefined;

      if (prefersReducedMotion()) {
        gsap.set('[data-anim]', { visibility: 'visible' });
        revealRef.current = 1;
        return undefined;
      }

      const split = SplitText.create(headlineRef.current, {
        type: 'lines,chars',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          gsap.set(headlineRef.current, { visibility: 'visible' });

          // Held until the curtain lifts — otherwise the entrance plays
          // out of sight behind the preloader and is over on reveal.
          if (!ready) {
            gsap.set(self.chars, { yPercent: 110 });
            return undefined;
          }

          const tl = gsap.timeline({ defaults: { ease: 'sweep' } });

          tl.set('[data-anim]', { visibility: 'visible' })
            .from(self.chars, {
              yPercent: 110,
              duration: 1.25,
              stagger: { each: 0.022, from: 'start' },
            })
            .from(
              '[data-hero-meta]',
              { yPercent: 100, autoAlpha: 0, duration: 0.9, stagger: 0.06 },
              0.35,
            )
            .from(
              '[data-hero-sub] > *',
              { y: 24, autoAlpha: 0, duration: 1, stagger: 0.08 },
              0.55,
            )
            .from(
              '[data-hero-cta]',
              { y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.08 },
              0.7,
            )
            // Drives the shader's centre-out entrance wipe.
            .to(revealRef, { current: 1, duration: 1.8, ease: 'power2.out' }, 0.1)
            .fromTo(
              '[data-hero-rule]',
              { scaleX: 0 },
              { scaleX: 1, duration: 1.4, ease: 'cut' },
              0.3,
            );

          return tl;
        },
      });

      // --- Exit: hold the hero, let the next section travel over it ----
      //
      // pinSpacing is off on purpose. With spacing on, the pin inserts a
      // viewport-tall spacer, so the hero finished its exit and then sat
      // there empty for a full screen before About arrived — a dead zone
      // that reads as a hard cut between sections. Without spacing the
      // hero stays fixed as a receding backdrop and About slides up over
      // it, so the two sections are on screen together throughout.
      const exit = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: false,
          anticipatePin: 1,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            progressRef.current = self.progress;
          },
        },
      });

      exit
        // The whole content block recedes as one, so nothing (like the
        // hairline rule) is left floating over an empty stage.
        .to(
          '[data-hero-content]',
          { yPercent: -18, scale: 0.97, autoAlpha: 0, ease: 'power1.in' },
          0,
        )
        .to(headlineRef.current, { yPercent: -22, ease: 'none' }, 0);

      return () => {
        split.revert();
        exit.scrollTrigger?.kill();
        exit.kill();
      };
    },
    { scope: root, dependencies: [ready], revertOnUpdate: true },
  );

  // Looping scroll cue, independent of the entrance timeline.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '[data-scroll-cue-line]',
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.4,
          repeat: -1,
          repeatDelay: 0.2,
          ease: 'power2.inOut',
          transformOrigin: 'top',
        },
      );
    },
    { scope: root },
  );

  return (
    <section
      id="hero"
      ref={root}
      className="relative min-h-[100svh] w-full overflow-hidden bg-bg-primary"
    >
      {/* --- WebGL substrate ------------------------------------- */}
      <div className="fill-parent z-0">
        <Suspense fallback={null}>
          <HeroCanvas progressRef={progressRef} revealRef={revealRef} />
        </Suspense>
        <div className="vignette" />
        {/* Horizon wash: seats the field on a ground plane and hides the
            canvas edge where the shards fade out. */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4"
          style={{
            background:
              'linear-gradient(to top, rgb(var(--color-bg-primary)) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* --- Content --------------------------------------------- */}
      <div
        data-hero-content
        className="relative z-10 flex min-h-[100svh] flex-col justify-between px-gutter pb-8 pt-28 sm:pt-32"
      >
        {/* Top meta */}
        <div className="flex items-start justify-between gap-6">
          <div className="line-mask">
            <p
              data-hero-meta
              data-anim
              className="text-fluid--2 uppercase tracking-[0.28em] text-text-muted"
            >
              Mumbai, India
              <span className="mx-2 text-accent-primary">·</span>
              19.07° N
            </p>
          </div>
          <div className="line-mask">
            <p
              data-hero-meta
              data-anim
              className="flex items-center gap-2 text-fluid--2 uppercase tracking-[0.28em] text-text-muted"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Open to work
            </p>
          </div>
        </div>

        {/* Headline */}
        <div className="flex flex-1 flex-col justify-center py-10">
          <h1
            ref={headlineRef}
            data-anim
            className="display max-w-[16ch] text-text-primary"
          >
            Full–stack developer{' '}
            <span className="serif-italic text-accent-primary">&amp; builder</span>
          </h1>

          <div
            data-hero-rule
            className="my-8 h-px w-full origin-left bg-border-default sm:my-10"
          />

          <div
            data-hero-sub
            className="grid gap-8 sm:grid-cols-[1fr_auto] sm:items-end"
          >
            <p data-anim className="measure text-fluid-0 text-text-secondary">
              I design and build web applications end to end — from the database
              schema to the last easing curve. Currently shipping AI-assisted
              products on the MERN stack.
            </p>

            <ul
              data-anim
              className="flex flex-wrap gap-x-5 gap-y-2 text-fluid--2 uppercase tracking-[0.2em] text-text-muted sm:justify-end"
            >
              {['React', 'Node', 'MongoDB', 'Express', 'GSAP', 'WebGL'].map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTAs + footer row */}
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap items-center gap-4">
            <Magnetic strength={0.4}>
              <button
                data-hero-cta
                data-anim
                data-cursor="link"
                type="button"
                onClick={() => scrollTo('#contact')}
                className="group relative flex items-center gap-3 overflow-hidden rounded-full border border-accent-primary px-7 py-3.5 text-fluid--1 font-medium uppercase tracking-[0.16em] text-accent-primary transition-colors duration-500 ease-out-expo hover:text-text-inverse"
              >
                <span
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-accent-primary transition-transform duration-500 ease-out-expo group-hover:scale-y-100"
                  aria-hidden="true"
                />
                <span data-magnetic-inner className="flex items-center gap-3">
                  Start a conversation
                  <ArrowDownRight className="h-4 w-4" />
                </span>
              </button>
            </Magnetic>

            <Magnetic strength={0.4}>
              <a
                data-hero-cta
                data-anim
                data-cursor="link"
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-2 py-3.5 text-fluid--1 uppercase tracking-[0.16em] text-text-secondary transition-colors duration-500 hover:text-text-primary"
              >
                <span data-magnetic-inner className="link-sweep">
                  Résumé
                </span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </Magnetic>
          </div>

          <div
            data-hero-foot
            className="flex items-end justify-between gap-6 border-t border-border-default pr-0 pt-6 sm:pr-20"
          >
            <div className="flex items-center gap-3">
              <span className="block h-8 w-px overflow-hidden bg-border-default">
                <span
                  data-scroll-cue-line
                  className="block h-full w-full origin-top bg-accent-primary"
                />
              </span>
              <span className="text-fluid--2 uppercase tracking-[0.28em] text-text-muted">
                Scroll
              </span>
            </div>

            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {SOCIALS.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="link-sweep text-fluid--2 uppercase tracking-[0.2em] text-text-secondary transition-colors hover:text-accent-primary"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
