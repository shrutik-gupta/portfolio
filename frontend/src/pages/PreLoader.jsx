import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

const PreLoader = () => {
  const container = useRef();
  const text = "Hi, I'm Shrutik";

  useGSAP(() => {
    const words = gsap.utils.toArray('.word');

    const tl = gsap.timeline();
    tl.from(words, {
      y: 40,
      opacity: 0,
      stagger: 0.15,
      ease: 'back.out(1.7)',
      duration: 0.6,
    });

    tl.to({}, { duration: 0.8 });
    
    tl.to(words, {
      y: -100,
      opacity: 0,
      ease: 'power1.in',
      duration: 0.4,
    });
  }, { scope: container });

  return (
    <div
      ref={container}
      className="fixed inset-0 flex flex-col items-center justify-center bg-bg-primary z-50"
    >
      <div className="flex flex-wrap gap-2 text-4xl font-semibold text-accent-primary mx-2">
        {text.split(' ').map((word, i) => (
          <span key={i} className="word inline-block">
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PreLoader;