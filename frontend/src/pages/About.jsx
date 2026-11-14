import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { useReveal } from '../lib/reveal';
import KineticText from '../components/KineticText';
import LensNote from '../components/LensNote';
import { Arrow, ArrowRight } from '../components/Doodles';
import { CONTACT, FACTS } from '../helper/ProfileHelper';
import profile from '../assets/profile.png';

/**
 * The short version: a photo taped to the page, three short paragraphs,
 * and a fact sheet. A recruiter can stop reading here and still have
 * what they need — the résumé is one tap away.
 */
const About = () => {
  const root = useRef(null);
  useReveal(root);

  // The photo turns a few degrees as it travels up the screen, the way
  // a print shifts when you slide it across a table.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        '[data-photo]',
        { rotate: -5 },
        {
          rotate: 1.5,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-photo]',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="relative w-full py-[clamp(5rem,13vh,10rem)]">
      <div className="shell grid gap-x-16 gap-y-14 lg:grid-cols-12">
        {/* --- Photo --- */}
        <div className="lg:col-span-5">
          <div data-reveal="drop" className="relative mx-auto w-[min(100%,24rem)] lg:sticky lg:top-24 lg:mx-0 lg:w-full lg:max-w-[26rem]">
            <figure data-photo className="paper relative p-3 pb-4 shadow-print will-change-transform">
              <span className="tape -top-3 left-1/2 -translate-x-1/2 -rotate-3" aria-hidden="true" />
              <img
                src={profile}
                alt="Shrutik Gupta, in a grey blazer against a deep red wall with a round light behind him"
                width="1080"
                height="1350"
                loading="lazy"
                decoding="async"
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="hand mt-3 flex items-center justify-between text-text-secondary">
                <span>that’s me</span>
                <span className="label font-sans text-text-muted">Mumbai</span>
              </figcaption>
            </figure>
            <Arrow className="absolute -right-10 bottom-10 hidden h-10 w-14 rotate-[150deg] text-accent-secondary xl:block" />
          </div>
        </div>

        {/* --- Words --- */}
        <div className="flex flex-col gap-9 lg:col-span-7 lg:pt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p data-reveal className="label text-accent-primary">
              The short version
            </p>
            <LensNote show="hire">Hiring? This part takes 30 seconds.</LensNote>
          </div>

          <KineticText as="h2" className="text-fluid-5 text-text-primary" stagger={0.09}>
            I make things that work on the first click, and still work on the thousandth.
          </KineticText>

          <div className="flex flex-col gap-5 text-fluid-0 text-text-secondary">
            <p data-reveal className="measure">
              I build software end to end — the part you see, the part that
              runs behind it, and the data underneath. These days that mostly
              means AI systems in production: pipelines of agents that have to
              stay predictable even when the AI isn’t.
            </p>
            <p data-reveal className="measure">
              When I’m not debugging, I’m usually getting clean bowled by a
              syntax error — much like I do facing a googly on the cricket
              pitch. When the bugs get loud, the piano takes over.
            </p>
          </div>

          {/* Fact sheet */}
          <dl data-reveal className="grid border-t-2 border-text-primary sm:grid-cols-2">
            {FACTS.map((f, i) => (
              <div
                key={f.k}
                className={`flex flex-col gap-1 border-b border-text-primary/25 py-4 ${
                  i % 2 === 0 ? 'sm:pr-8' : 'sm:border-l sm:pl-8'
                }`}
              >
                <dt className="label text-text-muted">{f.k}</dt>
                <dd className="text-fluid-0 text-text-primary">{f.v}</dd>
              </div>
            ))}
          </dl>

          <div data-reveal className="flex flex-wrap items-center gap-x-8 gap-y-5">
            <a
              href={CONTACT.resume}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-label="PDF"
              className="stamp stamp--solid"
            >
              Read the résumé
              <ArrowRight className="h-4 w-6" />
            </a>
            <Link
              to="/parallel"
              data-cursor-label="Peek"
              className="link-ink text-fluid--1 text-text-secondary"
            >
              There’s a less official page about me
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
