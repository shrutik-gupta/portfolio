import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import KineticText from '../components/KineticText';
import profile from '../assets/profile.jpg';

const FACTS = [
  { k: 'Based in', v: 'Mumbai, India' },
  { k: 'Currently', v: 'MERN Developer' },
  { k: 'Focus', v: 'Full-stack product work' },
  { k: 'Off-hours', v: 'Cricket, piano, vlogs' },
];

const About = () => {
  const root = useRef(null);
  const plateRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set('[data-anim]', { visibility: 'visible' });
        return;
      }

      gsap.set('[data-anim]', { visibility: 'visible' });

      // The portrait uncovers itself, then drifts slower than the page.
      gsap.from(plateRef.current, {
        clipPath: 'inset(0% 0% 100% 0%)',
        duration: 1.4,
        ease: 'cut',
        scrollTrigger: { trigger: plateRef.current, start: 'top 82%', once: true },
      });

      gsap.to('[data-plate-img]', {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: plateRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.from('[data-fact]', {
        y: 20,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.07,
        ease: 'sweep',
        scrollTrigger: { trigger: '[data-facts]', start: 'top 85%', once: true },
      });
    },
    { scope: root },
  );

  return (
    <section
      id="about"
      ref={root}
      className="relative z-10 w-full bg-bg-primary py-[clamp(5rem,12vh,10rem)]"
    >
      <div className="px-gutter">
        <div className="line-mask mb-14">
          <p data-anim className="eyebrow">
            <span className="text-accent-primary">01</span> About
          </p>
        </div>

        <div className="grid gap-14 lg:grid-cols-[1.35fr_1fr] lg:gap-20">
          {/* Statement */}
          <div className="flex flex-col gap-10">
            <KineticText
              as="h2"
              className="text-fluid-4 text-text-primary"
              stagger={0.09}
            >
              I build things that work on the first click, and keep working on
              the thousandth.
            </KineticText>

            <div className="flex flex-col gap-6">
              <KineticText className="measure text-fluid-0 text-text-secondary">
                Most of my work lives in the MERN stack — React on the surface,
                Node and Express in the middle, Mongo underneath. Lately that
                has meant AI-assisted products: negotiation agents, generated
                assessments, systems that have to stay predictable even when
                the model in the middle isn&apos;t.
              </KineticText>

              <KineticText className="measure text-fluid-0 text-text-secondary">
                When I&apos;m not debugging, I&apos;m usually getting clean
                bowled by a syntax error — much like I do facing a googly on the
                cricket pitch. When the bugs get loud, the piano takes over.
              </KineticText>
            </div>

            <div data-facts className="mt-2 grid grid-cols-2 gap-x-8 gap-y-6 sm:max-w-xl">
              {FACTS.map((f) => (
                <div key={f.k} data-fact data-anim className="flex flex-col gap-1.5">
                  <span className="text-fluid--2 uppercase tracking-[0.24em] text-text-muted">
                    {f.k}
                  </span>
                  <span className="text-fluid-0 text-text-primary">{f.v}</span>
                </div>
              ))}
            </div>

            <Link
              to="/parallel"
              data-cursor="link"
              data-cursor-label="Peek"
              className="group inline-flex w-fit items-center gap-3 text-fluid--1 uppercase tracking-[0.2em] text-text-secondary transition-colors hover:text-accent-primary"
            >
              <span className="link-sweep">There is a less obvious page about me</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Portrait plate */}
          <figure className="lg:pt-6">
            <div
              ref={plateRef}
              className="relative overflow-hidden bg-bg-secondary"
              style={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            >
              <img
                data-plate-img
                src={profile}
                alt="Shrutik Gupta"
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full scale-110 object-cover object-center grayscale transition-[filter] duration-700 ease-out-expo hover:grayscale-0"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgb(var(--color-bg-primary) / 0.7), transparent 55%)',
                }}
              />
            </div>
            {/* <figcaption className="mt-4 flex items-baseline justify-between text-fluid--2 uppercase tracking-[0.24em] text-text-muted">
              <span>Plate 01</span>
              <span>Shrutik Gupta</span>
            </figcaption> */}
          </figure>
        </div>
      </div>
    </section>
  );
};

export default About;
