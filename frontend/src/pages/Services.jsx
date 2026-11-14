import React, { useRef } from 'react';
import { useReveal } from '../lib/reveal';
import { useSectionNav } from '../lib/sectionNav';
import { useAudience } from '../lib/audience';
import LensNote from '../components/LensNote';
import { ArrowRight, Squiggle } from '../components/Doodles';
import { SERVICES } from '../helper/ProfileHelper';

/**
 * What I can build for someone — set as a short price-list without the
 * prices: four plain lines, each pointing at a project that proves it.
 * No cards. The type does the work.
 */
const Services = () => {
  const root = useRef(null);
  const goToSection = useSectionNav();
  const { setAudience } = useAudience();
  useReveal(root);

  return (
    <section id="services" ref={root} className="relative w-full py-[clamp(5rem,13vh,10rem)]">
      <div className="shell grid gap-x-16 gap-y-12 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <div className="flex flex-col gap-5 lg:sticky lg:top-24">
            <p data-reveal className="label text-accent-primary">
              Working together
            </p>
            <h2 data-reveal className="text-fluid-5 text-text-primary">
              Got an idea?
              <br />
              <span className="relative inline-block">
                <span className="display-i text-accent-primary">I can build it.</span>
                <Squiggle className="absolute -bottom-2 left-0 h-3 w-full text-accent-secondary" />
              </span>
            </h2>
            <p data-reveal className="measure text-fluid-0 text-text-secondary">
              I take on freelance projects. Tell me what you need in plain
              words, and I’ll tell you how I’d build it.
            </p>
            <LensNote show="freelance" className="mt-2">
              This list is for you.
            </LensNote>
          </div>
        </header>

        <div className="lg:col-span-8">
          <ol className="border-t-2 border-text-primary">
            {SERVICES.map((s, i) => (
              <li
                key={s.name}
                data-reveal
                className="group grid gap-x-8 gap-y-2 border-b border-text-primary/25 py-7 transition-[padding] duration-500 ease-out-expo hover:pl-3 sm:grid-cols-[auto_1fr] sm:py-9"
              >
                <span className="label pt-2 tabular-nums text-text-muted transition-colors group-hover:text-accent-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-fluid-4 text-text-primary">{s.name}</h3>
                  <p className="measure text-fluid-0 text-text-secondary">{s.text}</p>
                  {s.see && (
                    <button
                      type="button"
                      onClick={() => goToSection(`project-${s.see.id}`, { offset: -80 })}
                      className="hand mt-1 flex w-fit items-center gap-2 text-accent-secondary"
                    >
                      like {s.see.label}
                      <ArrowRight className="h-4 w-6 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <div data-reveal className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <button
              type="button"
              onClick={() => {
                setAudience('freelance');
                goToSection('contact');
              }}
              className="stamp stamp--solid"
            >
              Tell me about your project
              <ArrowRight className="h-4 w-6" />
            </button>
            <p className="text-fluid--1 text-text-muted">No brief needed. A few lines is enough.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
