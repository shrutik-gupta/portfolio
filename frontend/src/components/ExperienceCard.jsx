import React from 'react';

/**
 * One row of the experience ledger.
 *
 * Hover state is reported upward rather than handled locally, because a
 * single shared preview plate follows the cursor across all rows —
 * mounting one plate per row would mean N elements tracking the pointer.
 */
const ExperienceCard = ({ item, index, onHover, onLeave }) => {
  const { title, company, duration, description } = item;

  return (
    <li
      data-exp-row
      className="group relative border-t border-border-default"
      onPointerEnter={() => onHover?.(index)}
      onPointerLeave={() => onLeave?.()}
    >
      {/* Wash that wipes in from the left on hover. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-bg-hover/50 transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
      />

      <div className="relative grid gap-4 py-8 md:grid-cols-[auto_1fr_1.1fr] md:items-baseline md:gap-10 md:py-10">
        <span className="text-fluid--2 uppercase tracking-[0.22em] text-text-muted md:w-[16ch]">
          {duration}
        </span>

        <div className="flex flex-col gap-1">
          <h3 className="text-fluid-2 text-text-primary transition-transform duration-700 ease-out-expo md:group-hover:translate-x-2">
            {company}
          </h3>
          <p className="text-fluid--1 text-accent-primary">{title}</p>
        </div>

        <p className="measure text-fluid--1 leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>
    </li>
  );
};

export default ExperienceCard;
