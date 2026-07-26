import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, SplitText, prefersReducedMotion } from '../lib/motion';
import { useAppReady } from '../lib/ready';

/**
 * Scroll-triggered typographic reveal.
 *
 * Uses SplitText's `autoSplit` so lines are re-measured when fonts land
 * or the viewport is resized — a one-shot split produces stale line
 * boxes and visibly broken masks after a resize.
 *
 * `mask: 'lines'` wraps each line in its own overflow-hidden element, so
 * type slides out from behind a clean edge instead of fading in.
 */
const KineticText = ({
  children,
  as: Tag = 'p',
  type = 'lines',
  stagger = 0.08,
  duration = 1.1,
  delay = 0,
  y = '105%',
  rotate = 0,
  start = 'top 85%',
  once = true,
  gateOnReady = false,
  className = '',
  ...rest
}) => {
  const ref = useRef(null);
  const { ready } = useAppReady();
  const gated = gateOnReady && !ready;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || gated) return undefined;

      if (prefersReducedMotion()) {
        gsap.set(el, { visibility: 'visible' });
        return undefined;
      }

      const targetKey = type.includes('chars') ? 'chars' : type.includes('words') ? 'words' : 'lines';

      const split = SplitText.create(el, {
        type: `lines,${targetKey}`,
        mask: 'lines',
        linesClass: 'overflow-hidden',
        autoSplit: true,
        onSplit(self) {
          gsap.set(el, { visibility: 'visible' });
          return gsap.from(self[targetKey], {
            yPercent: parseFloat(y),
            rotate,
            duration,
            delay,
            ease: 'sweep',
            stagger: targetKey === 'chars' ? stagger * 0.35 : stagger,
            scrollTrigger: {
              trigger: el,
              start,
              once,
            },
          });
        },
      });

      return () => split.revert();
    },
    { dependencies: [gated], revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} data-anim className={className} {...rest}>
      {children}
    </Tag>
  );
};

export default KineticText;
