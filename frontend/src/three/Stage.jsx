import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { deviceTier, prefersReducedMotion } from '../lib/motion';

const DPR_CEILING = { high: 2, mid: 1.5, low: 1.25 };

/**
 * Shared WebGL surface.
 *
 * Every canvas on the site mounts through here so the performance rules
 * live in exactly one place:
 *   - resolution is capped per device tier, then trimmed further if the
 *     frame budget slips;
 *   - the render loop is suspended whenever the canvas leaves the
 *     viewport or the tab is hidden, so an off-screen scene costs zero;
 *   - the context is released on unmount rather than lingering until GC.
 *
 * Scenes are small, self-contained objects that sit beside the content,
 * never behind it. A scene only receives pointer events when it asks for
 * them with `interactive`; vertical touch scrolling always passes through.
 */
const Stage = ({
  children,
  className = '',
  camera = { position: [0, 0, 5], fov: 42 },
  /** Let the scene handle hover/click on its objects. */
  interactive = false,
  /** Skip WebGL entirely on low-capability devices. */
  requireTier = 'low',
  /** Shown instead of the canvas when WebGL is skipped (reduced motion). */
  fallback = null,
  ...canvasProps
}) => {
  const wrapRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [tabActive, setTabActive] = useState(true);

  const tier = deviceTier();
  const reduced = prefersReducedMotion();
  const order = { low: 0, mid: 1, high: 2 };
  const enabled = !reduced && order[tier] >= order[requireTier];

  const [dpr, setDpr] = useState(() =>
    Math.min(
      typeof window !== 'undefined' ? window.devicePixelRatio : 1,
      DPR_CEILING[tier],
    ),
  );

  useEffect(() => {
    if (!enabled) return undefined;
    const el = wrapRef.current;
    if (!el) return undefined;

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '10% 0px' },
    );
    io.observe(el);

    const onVisibility = () => setTabActive(!document.hidden);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled]);

  if (!enabled) return fallback;

  const running = visible && tabActive;

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <Canvas
        frameloop={running ? 'always' : 'never'}
        dpr={dpr}
        camera={camera}
        flat
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
        }}
        style={{
          pointerEvents: interactive ? 'auto' : 'none',
          touchAction: 'pan-y',
        }}
        onCreated={({ gl }) => gl.setClearAlpha(0)}
        {...canvasProps}
      >
        <PerformanceMonitor
          bounds={() => [45, 60]}
          onDecline={() => setDpr((d) => Math.max(1, d - 0.25))}
          onIncline={() => setDpr((d) => Math.min(DPR_CEILING[tier], d + 0.25))}
        />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
};

export default Stage;
