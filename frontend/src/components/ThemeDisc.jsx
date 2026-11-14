import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { easeThemeChange } from '../lib/themeSwitch';

/**
 * The theme switch, drawn as the site's disc: a sun by day, and by night
 * a moon with a bite taken out of it.
 */
const ThemeDisc = ({ className = '', size = '1.6rem' }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={() => {
        easeThemeChange();
        toggleTheme();
      }}
      aria-label={isDark ? 'Switch to the light theme' : 'Switch to the dark theme'}
      title={isDark ? 'Daylight' : 'After dark'}
      data-cursor-label={isDark ? 'Sunrise' : 'Sunset'}
      className={`group relative grid place-items-center ${className}`}
      style={{ width: `calc(${size} + 1rem)`, height: `calc(${size} + 1rem)` }}
    >
      <span
        className="relative block overflow-hidden rounded-full bg-disc transition-transform duration-500 ease-spring group-hover:scale-110 group-active:scale-90"
        style={{ width: size, height: size }}
      >
        <span
          className={`absolute inset-0 rounded-full bg-bg-secondary transition-transform duration-700 ease-out-expo ${
            isDark ? 'translate-x-[32%] -translate-y-[22%]' : 'translate-x-[110%] -translate-y-[110%]'
          }`}
        />
      </span>
    </button>
  );
};

export default ThemeDisc;
