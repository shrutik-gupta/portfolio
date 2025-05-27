import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Checking localStorage first
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme;
      }
      
      // Checking system preference
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      return systemTheme;
    }
    return 'dark';
  });

  const [language, setLanguage] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('language');
      if (savedLanguage) {
        return savedLanguage;
      }
      
      // Check browser language
      const browserLang = navigator.language.split('-')[0];
      const supportedLanguages = ['english', 'hindi', 'spanish', 'french'];
      const langMap = {
        'en': 'english',
        'hi': 'hindi', 
        'es': 'spanish',
        'fr': 'french'
      };
      return langMap[browserLang] || 'english';
    }
    return 'english';
  });

  // Apply theme to document and save to localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes first
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    root.classList.add(theme);
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a theme
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    // Add listener for system theme changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const updateTheme = (newTheme) => {
    if (['light', 'dark'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  const updateLanguage = (newLanguage) => {
    const supportedLanguages = ['english', 'hindi', 'spanish', 'french'];
    if (supportedLanguages.includes(newLanguage)) {
      setLanguage(newLanguage);
    }
  };

  const resetToSystem = () => {
    // Remove saved preferences
    localStorage.removeItem('theme');
    localStorage.removeItem('language');
    
    // Set to system preferences
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? 'dark' 
      : 'light';
    const browserLang = navigator.language.split('-')[0];
    const langMap = {
      'en': 'english',
      'hi': 'hindi', 
      'es': 'spanish',
      'fr': 'french'
    };
    
    setTheme(systemTheme);
    setLanguage(langMap[browserLang] || 'english');
  };

  const value = {
    theme,
    language,
    toggleTheme,
    updateTheme,
    updateLanguage,
    resetToSystem,
    isLight: theme === 'light',
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};