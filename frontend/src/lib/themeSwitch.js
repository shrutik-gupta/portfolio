let timer = null;

/**
 * Call right before changing the theme. For a moment every colour on the
 * page eases to its new value instead of snapping (see index.css).
 * Presentation only — the theme itself still lives in ThemeContext.
 */
export const easeThemeChange = () => {
  const root = document.documentElement;
  root.classList.add('theme-switching');
  clearTimeout(timer);
  timer = setTimeout(() => root.classList.remove('theme-switching'), 750);
};
