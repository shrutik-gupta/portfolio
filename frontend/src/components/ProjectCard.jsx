import React, { useRef } from 'react';
import { ArrowRight } from './Doodles';
import { isTouch, prefersReducedMotion } from '../lib/motion';

/**
 * One project on the wall: a print taped up at a slight angle, with the
 * words beside it.
 *
 * Three nested layers keep the motions from fighting over `transform`:
 *   [data-reveal]  the entrance (owned by useReveal)
 *   [data-print]   a slow turn tied to scroll (owned by Projects)
 *   the sheet      tilts toward the pointer (owned here, via CSS vars)
 */
const LAYOUTS = [
  { print: 'lg:col-span-8', copy: 'lg:col-span-4 lg:self-end', flip: false, tilt: -2, tape: 'left-10 -rotate-6' },
  { print: 'lg:col-span-7', copy: 'lg:col-span-4 lg:self-start lg:pt-10', flip: true, tilt: 2.5, tape: 'right-12 rotate-3' },
  { print: 'lg:col-span-6 lg:col-start-2', copy: 'lg:col-span-4 lg:self-center', flip: false, tilt: 1.5, tape: 'left-1/2 -translate-x-1/2 rotate-2' },
  { print: 'lg:col-span-7', copy: 'lg:col-span-5 lg:self-end', flip: true, tilt: -3, tape: 'left-8 rotate-6' },
  { print: 'lg:col-span-8 lg:col-start-3', copy: 'lg:col-span-6 lg:col-start-1 lg:row-start-2 lg:-mt-6', flip: false, tilt: 2, tape: 'right-16 -rotate-3' },
];

const ProjectCard = ({ project, index, total }) => {
  const { image, name, subtitle, year, role, description, tech, link, linkLabel, note } = project;
  const layout = LAYOUTS[index % LAYOUTS.length];
  const sheet = useRef(null);

  const canTilt = !isTouch() && !prefersReducedMotion();

  const onMove = (e) => {
    if (!canTilt) return;
    const el = sheet.current;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${px * 7}deg`);
    el.style.setProperty('--rx', `${-py * 6}deg`);
  };
  const onLeave = () => {
    sheet.current?.style.setProperty('--ry', '0deg');
    sheet.current?.style.setProperty('--rx', '0deg');
  };

  return (
    <article
      id={`project-${project.id}`}
      className="grid scroll-mt-24 items-start gap-x-10 gap-y-7 lg:grid-cols-12"
    >
      {/* --- Print --- */}
      <div className={`${layout.print} ${layout.flip ? 'lg:order-2 lg:col-start-6' : ''}`}>
        <div data-reveal="drop">
          <div data-print data-tilt={layout.tilt} className="will-change-transform" style={{ perspective: '1100px' }}>
            <a
              ref={sheet}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              onPointerMove={onMove}
              onPointerLeave={onLeave}
              data-cursor-label={linkLabel === 'Live site' ? 'Visit' : 'Code'}
              aria-label={`${name} — open ${linkLabel.toLowerCase()}`}
              className="paper group relative block p-2.5 pb-3 shadow-print transition-[transform,box-shadow] duration-500 ease-out-expo hover:shadow-print-lift sm:p-3.5 sm:pb-4"
              style={{ transform: 'rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))' }}
            >
              <span className={`tape -top-3 ${layout.tape}`} aria-hidden="true" />
              <div className="overflow-hidden bg-text-primary">
                <img
                  src={image}
                  alt={`Screenshot of ${name}`}
                  width="1900"
                  height="860"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[2.2/1] w-full object-cover object-top transition-transform duration-700 ease-out-expo group-hover:scale-[1.03]"
                />
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-4">
                <span className="hand text-text-secondary">{note || subtitle}</span>
                <span className="label tabular-nums text-text-muted">
                  {String(index + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* --- Words --- */}
      <div className={`flex flex-col gap-4 ${layout.copy} ${layout.flip ? 'lg:order-1 lg:col-start-1' : ''}`}>
        <p data-reveal className="label text-text-muted">
          <span className="text-accent-primary">{year}</span>
          <span className="mx-2">·</span>
          {role}
        </p>
        <h3 data-reveal className="display text-fluid-6 text-text-primary">
          {name}
        </h3>
        <p data-reveal className="display-i text-fluid-2 leading-tight text-text-secondary">
          {subtitle}
        </p>
        <p data-reveal className="measure text-fluid-0 text-text-secondary">
          {description}
        </p>
        <p data-reveal className="text-fluid--1 text-text-muted">
          <span className="label mr-2">Made with</span>
          {tech.join(', ')}
        </p>
        <a
          data-reveal
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-1 inline-flex w-fit items-center gap-3 text-fluid-0 font-semibold text-text-primary"
        >
          <span className="link-ink">{linkLabel === 'Live site' ? 'Visit the live site' : 'Read the source'}</span>
          <ArrowRight className="h-4 w-7 text-accent-primary transition-transform duration-300 group-hover:translate-x-1.5" />
        </a>
      </div>
    </article>
  );
};

export default ProjectCard;
