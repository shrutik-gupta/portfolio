import React from 'react';
import { useAudience } from '../lib/audience';
import { Arrow } from './Doodles';

/**
 * A handwritten margin note that only appears for the visitor it is
 * meant for. `show` is one audience id or a list of them.
 */
const LensNote = ({ show, children, className = '', arrow = true }) => {
  const { audience } = useAudience();
  const list = Array.isArray(show) ? show : [show];
  if (!audience || !list.includes(audience)) return null;

  return (
    <p
      className={`hand flex animate-pop-in items-start gap-2 text-accent-secondary ${className}`}
    >
      {arrow && <Arrow className="mt-1 h-6 w-8 shrink-0 -scale-y-100 rotate-90" />}
      <span>{children}</span>
    </p>
  );
};

export default LensNote;
