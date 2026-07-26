import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';
import { deviceTier, prefersReducedMotion } from '../lib/motion';

const DPR_CEILING = { high: 1.75, mid: 1.35, low: 1 };

/**
 * Shared WebGL surface.
 *
 * Every canvas on the site mounts through here so the performance rules
 * live in exactly one place:
 *   - resolution is capped per device tier, then trimmed further if the
 *     frame budget slips;
 *   - the render loop is suspended whenever the canvas leaves the
 *     viewport or the tab is hidden, so an off-screen scene costs zero;
 *   - the context is released on unmount rather than lingering until GC
 *     (browsers cap simultaneous WebGL contexts, and a leaked one from a
 *     route change is enough to blank out the next scene).
 *
 * Scenes are decorative, so the canvas never takes pointer events —
 * cursor input is read from the shared frame state instead.
 */
const Stage = ({
  children,
  className = '',
  camera = { position: [0, 0, 5], fov: 42 },
  alpha = true,
  /** Skip WebGL entirely on low-capability devices. */
  requireTier = 'low',
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
      { rootMargin: '15% 0px' },
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
        gl={{
          alpha,
          antialias: false, // shader-side smoothing is cheaper than MSAA
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false,
        }}
        style={{ pointerEvents: 'none' }}
        onCreated={({ gl }) => {
          gl.setClearAlpha(alpha ? 0 : 1);
        }}
        {...canvasProps}
      >
        <PerformanceMonitor
          bounds={() => [50, 60]}
          onDecline={() => setDpr((d) => Math.max(0.75, d - 0.25))}
          onIncline={() =>
            setDpr((d) => Math.min(DPR_CEILING[tier], d + 0.25))
          }
        />
        <Suspense fallback={null}>{children}</Suspense>
      </Canvas>
    </div>
  );
};

export default Stage;
