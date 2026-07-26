import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger, prefersReducedMotion, clamp } from '../lib/motion';
import ProjectCard from '../components/ProjectCard';
import projects from '../helper/ProjectHelper';

/**
 * Selected work as a pinned horizontal scrubber.
 *
 * Vertical scroll is remapped to horizontal travel, and each panel is
 * transformed in 3D by its distance from the centre of the viewport, so
 * the panel being read is square-on while its neighbours turn away and
 * recede.
 *
 * Panel centres are measured once per ScrollTrigger refresh rather than
 * per frame: reading getBoundingClientRect inside the scrub loop would
 * force a layout on every frame, right after GSAP has written new
 * transforms — the classic cause of jank in this pattern.
 *
 * The pin runs slightly longer than the horizontal travel so the last
 * panel is held square-on before the section releases.
 */
const Projects = () => {
  const root = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const railRef = useRef(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const section = root.current;
      const track = trackRef.current;
      if (!section || !track) return undefined;

      gsap.set('[data-anim]', { visibility: 'visible' });

      if (prefersReducedMotion()) return undefined;

      const panels = gsap.utils.toArray('[data-panel]', track);
      const images = panels.map((p) => p.querySelector('[data-project-image]'));

      const setters = panels.map((panel) => ({
        rotY: gsap.quickSetter(panel, 'rotationY', 'deg'),
        scale: gsap.quickSetter(panel, 'scale'),
        z: gsap.quickSetter(panel, 'z', 'px'),
        alpha: gsap.quickSetter(panel, 'opacity'),
      }));
      const imageSetters = images.map((img) =>
        img ? gsap.quickSetter(img, 'x', 'px') : null,
      );
      // The rail is written directly rather than held in state — a
      // setState per scroll frame would re-render the whole section.
      const setRail = gsap.quickSetter(railRef.current, 'scaleX');

      let centers = [];
      let travel = 0;
      let hold = 0;
      let split = 1;

      const measure = () => {
        const viewport = viewportRef.current.offsetWidth;
        centers = panels.map((p) => p.offsetLeft + p.offsetWidth / 2);
        // Travel until the LAST panel sits dead centre. Deriving this from
        // track.scrollWidth instead only brings the track's right edge to
        // the viewport's, which leaves the final panel short of centre by
        // whatever right-hand padding the track carries — so it never goes
        // square-on before the pin releases.
        travel = Math.max(0, centers[centers.length - 1] - viewport / 2);
        // Scroll budget past the end of the travel, so the final panel is
        // held square-on for a beat rather than unpinning the instant it
        // arrives.
        hold = window.innerHeight * 0.45;
        split = travel > 0 ? travel / (travel + hold) : 1;
      };
      measure();

      const applyDepth = (self) => {
        const x = Number(gsap.getProperty(track, 'x')) || 0;
        const mid = viewportRef.current.offsetWidth / 2;

        let nearest = 0;
        let nearestDist = Infinity;

        for (let i = 0; i < panels.length; i += 1) {
          const offset = centers[i] + x - mid;
          const ratio = clamp(offset / viewportRef.current.offsetWidth, -1.5, 1.5);
          const abs = Math.min(Math.abs(ratio), 1);

          setters[i].rotY(ratio * -16);
          setters[i].scale(1 - abs * 0.13);
          setters[i].z(-abs * 260);
          setters[i].alpha(1 - abs * 0.55);
          imageSetters[i]?.(ratio * 42);

          if (Math.abs(offset) < nearestDist) {
            nearestDist = Math.abs(offset);
            nearest = i;
          }
        }

        setActive((prev) => (prev === nearest ? prev : nearest));
        // The rail tracks the panels, not the pin, so it reads full once the
        // last panel has landed rather than during the hold.
        setRail(self ? Math.min(1, self.progress / split) : 0);
      };

      const tween = gsap.to(track, {
        x: () => -travel,
        // Progress is remapped so the travel completes at `split` and the
        // remainder of the pin holds the last panel in place. Combined with
        // the end distance below this keeps a 1:1 mapping between pixels
        // scrolled and pixels travelled — any other ratio makes the
        // horizontal motion feel detached from the wheel.
        ease: (p) => (p < split ? p / split : 1),
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          // Measured here rather than in onRefresh: ScrollTrigger resolves
          // end before onRefresh fires, so measuring later would size the
          // pin from the previous layout after a resize.
          end: () => {
            measure();
            return `+=${travel + hold}`;
          },
          pin: true,
          anticipatePin: 1,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onRefresh: () => applyDepth(null),
          onUpdate: applyDepth,
        },
      });

      // Heading reveal, independent of the scrub.
      gsap.from('[data-work-head] > *', {
        yPercent: 100,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.08,
        ease: 'sweep',
        scrollTrigger: { trigger: section, start: 'top 70%', once: true },
      });

      applyDepth(null);

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    },
    { scope: root },
  );

  return (
    <section
      id="projects"
      ref={root}
      className="relative w-full overflow-hidden bg-bg-secondary"
    >
      <div className="flex h-[100svh] flex-col justify-center py-[max(2rem,5vh)]">
        {/* Header */}
        <div className="flex items-end justify-between gap-6 px-gutter pb-[max(1.5rem,4vh)]">
          <div data-work-head className="flex flex-col gap-3">
            <div className="line-mask">
              <p data-anim className="eyebrow">
                <span className="text-accent-primary">03</span> Selected work
              </p>
            </div>
            <div className="line-mask">
              <h2 data-anim className="text-fluid-5 text-text-primary">
                Things I&apos;ve{' '}
                <span className="serif-italic text-accent-primary">shipped</span>
              </h2>
            </div>
          </div>

          <div className="hidden shrink-0 items-baseline gap-3 sm:flex">
            <span className="text-fluid-2 tabular-nums text-text-primary">
              {String(active + 1).padStart(2, '0')}
            </span>
            <span className="text-fluid--2 text-text-muted">
              / {String(projects.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* Horizontal viewport */}
        <div
          ref={viewportRef}
          className="relative w-full flex-1 overflow-hidden"
          style={{ perspective: '1600px' }}
        >
          <div
            ref={trackRef}
            className="flex h-full items-center gap-[6vw] px-gutter will-change-transform"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {projects.map((project, i) => (
              <div
                key={project.id}
                data-panel
                className="h-full w-[86vw] shrink-0 will-change-transform lg:w-[74vw]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                <ProjectCard project={project} index={i} total={projects.length} />
              </div>
            ))}
          </div>
        </div>

        {/* Progress rail */}
        <div className="mt-[max(1.5rem,4vh)] px-gutter">
          <div className="h-px w-full bg-border-default">
            <div
              ref={railRef}
              className="h-full origin-left bg-accent-primary"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
