import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ReadyProvider, useAppReady } from './lib/ready';
import { SmoothScrollProvider, useSmoothScroll } from './lib/SmoothScroll';
import { ScrollTrigger } from './lib/motion';

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Preference from './pages/Preference';
import Parallel from './pages/Parallel';
import Cursor from './components/Cursor';
import Preloader from './components/Preloader';

/**
 * Resets scroll and re-measures every trigger on navigation. Without the
 * refresh, triggers created on the previous route keep their old start
 * and end offsets and fire at the wrong scroll positions.
 */
const RouteEffects = () => {
  const { pathname } = useLocation();
  const { lenis } = useSmoothScroll();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return null;
};

const AppShell = () => {
  const { ready, setReady } = useAppReady();
  const { start } = useSmoothScroll();

  const handleLoaded = () => {
    setReady(true);
    start();
    // The curtain was covering a full-height element; measurements taken
    // before it lifts can be stale.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <>
      <Cursor />
      <div className="grain" aria-hidden="true" />
      {!ready && <Preloader onComplete={handleLoaded} />}

      <Router>
        <RouteEffects />
        <div className="min-h-screen bg-bg-primary text-text-primary">
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Legacy section URLs stay valid: they land on the home
                document and settle on the requested section. */}
            <Route path="/about" element={<Home section="about" />} />
            <Route path="/projects" element={<Home section="projects" />} />
            <Route path="/experience" element={<Home section="experience" />} />
            <Route path="/contact" element={<Home section="contact" />} />
            <Route path="/preferences" element={<Preference />} />
            <Route path="/parallel" element={<Parallel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ReadyProvider>
        <SmoothScrollProvider>
          <AppShell />
        </SmoothScrollProvider>
      </ReadyProvider>
    </ThemeProvider>
  );
}

export default App;
