import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, prefersReducedMotion, clamp, lerp } from './motion';
import { pointer, scroll, flags } from './frameState';

const SmoothScrollContext = createContext(null);

/**
 * The single source of truth for scrolling and pointer input.
 *
 * Lenis drives momentum, GSAP's ticker drives Lenis, and ScrollTrigger
 * updates from Lenis' scroll event. Running all three off one clock is
 * what keeps pinned sections from jittering — two independent rAF loops
 * would resolve in an unpredictable order and pinned elements would lag
 * the content by a frame.
 */
export const SmoothScrollProvider = ({ children }) => {
  const [lenis, setLenis] = useState(null);
  const rawVelocity = useRef(0);
  // The instance also lives in a ref so the control callbacks below can
  // reach the *current* Lenis no matter how old the closure calling them
  // is. State alone is not enough: the instance is created in an effect,
  // so anything that captured a callback during the first render would
  // otherwise be holding a null and silently no-op.
  const lenisRef = useRef(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    flags.reducedMotion = reduced;

    // Pointer tracking is cheap and useful even without smooth scroll.
    const onPointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      pointer.dx = nx - pointer.x;
      pointer.dy = ny - pointer.y;
      pointer.x = nx;
      pointer.y = ny;
      pointer.px = e.clientX;
      pointer.py = e.clientY;
      pointer.active = true;
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    // Reduced motion: no momentum layer at all. ScrollTrigger falls back
    // to its own native-scroll listener, which is exactly what we want.
    if (reduced) {
      const onScroll = () => {
        scroll.y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        scroll.progress = max > 0 ? scroll.y / max : 0;
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      return () => {
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
      };
    }

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      // Native inertia on touch is better than any JS emulation of it,
      // and it keeps scroll off the main thread on mobile.
      syncTouch: false,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
      autoRaf: false, // GSAP's ticker owns the loop
    });

    instance.on('scroll', (e) => {
      scroll.y = e.animatedScroll ?? e.scroll ?? 0;
      scroll.progress = e.progress ?? 0;
      scroll.direction = e.direction || scroll.direction;
      rawVelocity.current = e.velocity ?? 0;
      ScrollTrigger.update();
    });

    const raf = (time) => {
      instance.raf(time * 1000);

      // Smooth and decay velocity here rather than in the scroll event:
      // Lenis stops emitting once motion settles, so a purely
      // event-driven value would freeze at its last non-zero reading.
      rawVelocity.current *= 0.92;
      scroll.velocity = lerp(scroll.velocity, rawVelocity.current, 0.12);
      scroll.intensity = clamp(Math.abs(scroll.velocity) / 32, 0, 1);

      // Eased pointer follow, shared by cursor + every WebGL scene.
      pointer.ex = lerp(pointer.ex, pointer.x, 0.06);
      pointer.ey = lerp(pointer.ey, pointer.y, 0.06);
    };

    gsap.ticker.add(raf);
    // Default lag smoothing would freeze Lenis after a long frame
    // (tab switch, heavy shader compile) and leave scroll stuck.
    gsap.ticker.lagSmoothing(0);

    lenisRef.current = instance;

    // Start locked; the preloader releases it when the entrance finishes.
    // If the release already happened (StrictMode remount, HMR, or a
    // fast cache), respect that rather than re-locking a page the
    // visitor is allowed to scroll.
    if (flags.locked) instance.stop();

    setLenis(instance);

    // Fonts land after first paint and reflow every measured trigger.
    const onFonts = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(onFonts);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      if (lenisRef.current === instance) lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  const value = useMemo(
    () => ({
      lenis,
      /** Scroll to an element, selector, or offset. */
      scrollTo: (target, options = {}) => {
        const opts = { offset: 0, duration: 1.4, ...options };
        const instance = lenisRef.current;
        if (instance) {
          instance.scrollTo(target, opts);
          return;
        }
        // Reduced-motion / pre-init path.
        const el =
          typeof target === 'string' ? document.querySelector(target) : target;
        if (el instanceof Element) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        }
      },
      start: () => {
        flags.locked = false;
        lenisRef.current?.start();
      },
      stop: () => {
        flags.locked = true;
        lenisRef.current?.stop();
      },
    }),
    [lenis],
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

export const useSmoothScroll = () => {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) {
    throw new Error('useSmoothScroll must be used within a SmoothScrollProvider');
  }
  return ctx;
};

export default SmoothScrollProvider;
