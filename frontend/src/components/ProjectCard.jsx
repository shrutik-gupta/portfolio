import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import Magnetic from './Magnetic';

/**
 * A single case-study panel in the horizontal scrubber.
 *
 * The outer element is transformed every frame by the parent's scrub
 * loop (rotation + depth), so this component keeps its own transforms on
 * inner elements only — nesting them here would be overwritten.
 */
const ProjectCard = ({ project, index, total }) => {
  const { image, name, subtitle, year, role, description, tech, link, linkLabel } = project;

  return (
    <article className="flex h-full w-full flex-col justify-center gap-8 lg:flex-row lg:items-center lg:gap-14">
      {/* Plate */}
      <div className="relative w-full shrink-0 overflow-hidden bg-bg-secondary lg:w-[55%]">
        <div className="aspect-[16/10] max-h-[58vh] w-full overflow-hidden">
          <img
            data-project-image
            src={image}
            alt={`${name} — ${subtitle}`}
            loading="lazy"
            decoding="async"
            className="h-full w-full scale-[1.06] object-cover object-top"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, rgb(var(--color-bg-primary) / 0.55), transparent 60%)',
          }}
        />
        <span className="absolute left-4 top-4 text-fluid--2 uppercase tracking-[0.28em] text-text-primary/70">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
      </div>

      {/* Copy */}
      <div className="flex w-full flex-col gap-6 lg:w-[45%]">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-4 text-fluid--2 uppercase tracking-[0.24em] text-text-muted">
            <span className="text-accent-primary">{year}</span>
            <span className="h-px w-8 bg-border-hover" />
            <span>{role}</span>
          </div>
          <h3 className="text-fluid-5 leading-[0.95] text-text-primary">{name}</h3>
          <p className="serif-italic text-fluid-1 text-text-secondary">{subtitle}</p>
        </div>

        <p className="measure text-fluid--1 leading-relaxed text-text-secondary">
          {description}
        </p>

        <ul className="flex flex-wrap gap-x-2 gap-y-2">
          {tech.map((t) => (
            <li
              key={t}
              className="border border-border-default px-3 py-1.5 text-fluid--2 uppercase tracking-[0.12em] text-text-muted"
            >
              {t}
            </li>
          ))}
        </ul>

        <Magnetic strength={0.3} className="mt-2">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="view"
            data-cursor-label={linkLabel === 'Live site' ? 'Visit' : 'Code'}
            className="group inline-flex items-center gap-3 border-b border-accent-primary pb-2 text-fluid--1 uppercase tracking-[0.2em] text-accent-primary"
          >
            <span data-magnetic-inner>{linkLabel}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-1 group-hover:translate-x-1" />
          </a>
        </Magnetic>
      </div>
    </article>
  );
};

export default ProjectCard;
