import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ExperienceCard = ({ title, company, duration, description, logo }) => {
  const cardRef = useRef();

  useGSAP(() => {
    gsap.fromTo(cardRef.current,
      {
        opacity: 0,
        x: -40,
      },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none reset",
        }
      }
    );
  }, []);

  return (
    <div 
      ref={cardRef}
      className="bg-bg-card rounded-2xl shadow-xl p-6 sm:p-8 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          {logo && (
            <img
              src={logo}
              alt={`${company} logo`}
              className="w-10 h-10 object-contain rounded-lg"
            />
          )}
          <div>
            <p className="text-accent-primary font-semibold text-lg">{company}</p>
            <h3 className="text-xl font-bold text-text-primary">{title}</h3>
          </div>
        </div>
        <span className="text-sm text-text-secondary font-medium sm:text-right">{duration}</span>
      </div>
      <p className="text-text-secondary leading-relaxed text-[0.95rem]">{description}</p>
    </div>
  );
};

export default ExperienceCard;
