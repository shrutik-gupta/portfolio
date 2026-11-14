import React from 'react';

/**
 * One stop on the path.
 *
 * Stops alternate sides of the route line on wide screens. The logo sits
 * on the line itself, like a rubber stamp at a checkpoint.
 */
const ExperienceCard = ({ item, index }) => {
  const { title, company, duration, description, highlights, logo } = item;
  const [org, branch] = company.split('|').map((s) => s.trim());
  const right = index % 2 === 1;

  return (
    <li className="relative grid md:grid-cols-2 md:gap-x-28">
      {/* Stamp on the line */}
      <span
        data-reveal="fade"
        aria-hidden="true"
        className="paper absolute left-0 top-0 grid h-14 w-14 place-items-center rounded-full border-2 border-dashed border-text-primary/60 p-2 shadow-print md:left-1/2 md:h-[4.5rem] md:w-[4.5rem] md:-translate-x-1/2"
      >
        {logo ? (
          <img src={logo} alt="" loading="lazy" className="h-full w-full rounded-full object-contain" />
        ) : (
          <span className="font-display text-fluid-1 font-semibold">
            {org.split(/\s+/).map((w) => w[0]).join('').slice(0, 3)}
          </span>
        )}
      </span>

      <div
        data-reveal={right ? 'right' : 'left'}
        className={`flex flex-col gap-3 pb-16 pl-20 md:pb-24 md:pl-0 ${
          right ? 'md:col-start-2' : 'md:col-start-1 md:items-end md:text-right'
        }`}
      >
        <p className="label w-fit border-2 border-accent-primary px-2 py-1 text-accent-primary -rotate-1">
          {duration}
        </p>
        <h3 className="text-fluid-4 text-text-primary">{org}</h3>
        <p className="display-i text-fluid-2 leading-tight text-text-secondary">
          {title}
          {branch && <span className="text-text-muted"> · {branch}</span>}
        </p>
        <p className="measure text-fluid-0 text-text-secondary">{description}</p>
        {highlights?.length > 0 && (
          // Always left-aligned: a ragged-left list is hard to scan.
          <ul className="measure mt-1 flex flex-col border-t border-text-primary/25 text-left text-fluid--1 text-text-secondary">
            {highlights.map((h) => (
              <li key={h} className="flex gap-3 border-b border-text-primary/15 py-2.5">
                <span className="mt-[0.55em] block h-1.5 w-1.5 shrink-0 rotate-45 bg-accent-primary" aria-hidden="true" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export default ExperienceCard;
