import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Preference from './pages/Preference';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Experience from './pages/Experience';
import ContactMe from './pages/ContactMe';
import About from './pages/About';
import NotFound from './pages/NotFound';
import CustomCursor from './components/CustomCursor';
import PreLoader from './pages/PreLoader';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider>
      <CustomCursor />
      {loading ? (
        <PreLoader />
      ) : (
        <Router>
          <div className="min-h-screen bg-bg-primary text-text-primary transition-colors duration-300">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/contact" element={<ContactMe />} />
              <Route path="/preferences" element={<Preference />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      )}
    </ThemeProvider>
  );
}

export default App;
