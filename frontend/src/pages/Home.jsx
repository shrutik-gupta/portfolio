import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Hero from './Hero';
import About from './About';
import Capabilities from './Capabilities';
import Projects from './Projects';
import Services from './Services';
import Experience from './Experience';
import ContactMe from './ContactMe';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Chat from '../components/Chat';
import { useAppReady } from '../lib/ready';
import { useSmoothScroll } from '../lib/SmoothScroll';
import { ScrollTrigger } from '../lib/motion';

/**
 * The whole document. Sections are ordered as one continuous read:
 * cover → short version → work → services → skills → path → contact.
 */
const Home = ({ section }) => {
  const location = useLocation();
  const { ready } = useAppReady();
  const { scrollTo, lenis } = useSmoothScroll();

  // Deep links (/projects, or a nav click from another route) settle on
  // their section once the entrance is done and triggers are measured —
  // jumping earlier lands at the wrong offset because pinned sections
  // have not claimed their spacers yet.
  useEffect(() => {
    const target = section || location.state?.section;
    if (!target || !ready) return undefined;

    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      // Coming from a shorter page, the scroll engine still holds that
      // page's height and would clamp the jump to zero.
      lenis?.resize();
      const el = document.getElementById(target);
      if (el) scrollTo(el, { duration: 1.2 });
    });
    return () => cancelAnimationFrame(id);
  }, [section, location.state, ready, scrollTo, lenis]);

  return (
    <main className="page relative w-full">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Services />
      <Capabilities />
      <Experience />
      <ContactMe />
      <Footer />
      <Chat />
    </main>
  );
};

export default Home;
