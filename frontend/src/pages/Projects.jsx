import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { useReveal } from '../lib/reveal';
import ProjectCard from '../components/ProjectCard';
import LensNote from '../components/LensNote';
import { Spark } from '../components/Doodles';
import projects from '../helper/ProjectHelper';

/**
 * Work, as a wall of prints.
 *
 * The page scrolls normally — nothing is pinned or hijacked. Each print
 * is set down as it arrives, then turns very slightly as it passes, and
 * leans toward the pointer when hovered. No two rows share a layout.
 */
const Projects = () => {
  const root = useRef(null);
  useReveal(root);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.utils.toArray('[data-print]', root.current).forEach((print) => {
        const tilt = parseFloat(print.dataset.tilt || 0);
        gsap.fromTo(
          print,
          { rotate: tilt * 1.8 },
          {
            rotate: -tilt * 0.4,
            ease: 'none',
            scrollTrigger: {
              trigger: print,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section
      id="projects"
      ref={root}
      className="relative w-full overflow-x-clip bg-bg-secondary py-[clamp(5rem,13vh,10rem)]"
    >
      <div className="shell">
        <header className="mb-[clamp(3.5rem,9vh,7rem)] flex flex-wrap items-end justify-between gap-6">
          <div>
            <p data-reveal className="label mb-4 text-accent-primary">
              Selected work
            </p>
            <h2 data-reveal className="text-fluid-7 text-text-primary">
              Things I’ve{' '}
              <span className="display-i text-accent-primary">built</span>
              <Spark className="ml-3 inline-block h-[0.35em] w-[0.35em] -translate-y-[0.9em] text-accent-secondary" />
            </h2>
          </div>
          <div className="flex flex-col items-end gap-2">
            <LensNote show="freelance">This is what my work looks like.</LensNote>
            <LensNote show="wander">Hover the prints.</LensNote>
            <p data-reveal className="label text-text-muted">
              {String(projects.length).padStart(2, '0')} projects · tap a print to open it
            </p>
          </div>
        </header>

        <div className="flex flex-col gap-[clamp(5rem,14vh,10rem)]">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} total={projects.length} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
