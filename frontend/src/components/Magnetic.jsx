import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, isTouch, prefersReducedMotion } from '../lib/motion';

/**
 * Gives a child element magnetic pull toward the cursor.
 *
 * `strength` is the fraction of the distance from the element's centre
 * that it travels; `radius` scales the activation area beyond the
 * element's own box. An optional inner element marked `data-magnetic-inner`
 * moves further than its parent, which reads as parallax between a
 * button's fill and its label.
 */
const Magnetic = ({
  children,
  strength = 0.35,
  radius = 1.6,
  className = '',
  as: Tag = 'div',
  ...rest
}) => {
  const ref = useRef(null);

  useGSAP(() => {
    if (isTouch() || prefersReducedMotion()) return undefined;

    const el = ref.current;
    if (!el) return undefined;
    const inner = el.querySelector('[data-magnetic-inner]');

    const moveX = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'sweep' });
    const moveY = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'sweep' });
    const innerX = inner ? gsap.quickTo(inner, 'x', { duration: 0.9, ease: 'sweep' }) : null;
    const innerY = inner ? gsap.quickTo(inner, 'y', { duration: 0.9, ease: 'sweep' }) : null;

    // Bounds are re-read per pointer entry rather than cached: pinned
    // and horizontally-scrubbed sections move their children constantly,
    // so a cached rect would drift.
    let rect = null;

    const onEnter = () => {
      rect = el.getBoundingClientRect();
    };

    const onMove = (e) => {
      if (!rect) rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const reach = (Math.max(rect.width, rect.height) / 2) * radius;
      const dist = Math.hypot(dx, dy);
      const falloff = Math.max(0, 1 - dist / (reach * 2));

      moveX(dx * strength * falloff);
      moveY(dy * strength * falloff);
      innerX?.(dx * strength * 0.5 * falloff);
      innerY?.(dy * strength * 0.5 * falloff);
    };

    const onLeave = () => {
      rect = null;
      moveX(0);
      moveY(0);
      innerX?.(0);
      innerY?.(0);
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <Tag ref={ref} className={`inline-block will-change-transform ${className}`} {...rest}>
      {children}
    </Tag>
  );
};

export default Magnetic;
