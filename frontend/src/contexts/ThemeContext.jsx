import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const systemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const ThemeProvider = ({ children }) => {
  // Dark is the designed default — the palette, the WebGL layers and the
  // grain are all tuned for it. The system preference only takes over
  // when the visitor explicitly resets. This mirrors the inline script in
  // index.html, which resolves the same value before first paint.
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = localStorage.getItem('theme');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.style.backgroundColor = theme === 'light' ? '#f0ede7' : '#0a0a0c';
  }, [theme]);

  const updateTheme = useCallback((next) => {
    if (next !== 'dark' && next !== 'light') return;
    localStorage.setItem('theme', next);
    setTheme(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  /**
   * Clears the stored choice and follows the OS again. Because the
   * preference is only written on an explicit change, the listener below
   * keeps tracking the system from this point on.
   */
  const resetToSystem = useCallback(() => {
    localStorage.removeItem('theme');
    setTheme(systemTheme());
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const value = {
    theme,
    updateTheme,
    toggleTheme,
    resetToSystem,
    isLight: theme === 'light',
    isDark: theme === 'dark',
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
