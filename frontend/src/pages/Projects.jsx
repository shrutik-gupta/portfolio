import React, { useRef, useEffect } from "react";
import ProjectCard from "../components/ProjectCard";
import projects from "../helper/ProjectHelper";

import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const projectArray = Object.values(projects);
  const containerRef = useRef();
  const trackRef = useRef();

  useGSAP(() => {
    const container = containerRef.current;
    const track = trackRef.current;

    if (!container || !track) return;

    const setupAnimation = () => {
      const cards = track.children;
      const numProjects = cards.length;
      if (numProjects === 0) return;

      const cardWidth = cards[0].offsetWidth;
      const gap = 32; // Tailwind gap-8
      const totalWidth = cardWidth * numProjects + gap * (numProjects - 1);
      const viewportWidth = window.innerWidth;

      if (totalWidth > viewportWidth) {
        const scrollDistance = totalWidth - viewportWidth;
        gsap.to(track, {
          x: -scrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: `top 20%`, 
            end: `top -150%`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              // update active dot
              const progress = self.progress * numProjects;
              const active = Math.min(numProjects - 1, Math.floor(progress));
              projectArray.forEach((_, i) => {
                const dot = document.getElementById(`project-indicator-${i}`);
                if (dot) {
                  dot.classList.toggle(
                    'bg-accent-secondary',
                    i === active
                  );
                  dot.classList.toggle(
                    'bg-accent-primary/30',
                    i !== active
                  );
                }
              });
            }
          }
        });
      }
    };

    const timer = setTimeout(setupAnimation, 100);
    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [projectArray.length]);

  useEffect(() => {
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <section
      id="projects"
      className="relative w-full min-h-screen bg-bg-primary dark:bg-bg-primary-dark"
    >
      {/* Header */}
      <div className="text-center py-16 px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
          My Projects
        </h2>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          Here are some of the projects I’ve worked on recently
        </p>
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={containerRef} className="relative overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 px-3"
        >
          {projectArray.map((proj, idx) => (
            <div
              key={idx}
              className="flex-shrink-0"
              style={{ width: '95vw' }}
            >
              <ProjectCard {...proj} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
