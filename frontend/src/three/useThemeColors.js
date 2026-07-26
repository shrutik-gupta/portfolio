import { useEffect, useState } from 'react';
import * as THREE from 'three';

const readVar = (name, fallback) => {
  if (typeof window === 'undefined') return fallback;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  if (!raw) return fallback;
  const [r, g, b] = raw.split(/\s+/).map(Number);
  if ([r, g, b].some(Number.isNaN)) return fallback;
  return `rgb(${r},${g},${b})`;
};

const make = (name, fallback) =>
  new THREE.Color(readVar(name, fallback)).convertSRGBToLinear();

const readPalette = () => ({
  background: make('--color-bg-primary', 'rgb(10,10,12)'),
  surface: make('--color-bg-surface', 'rgb(26,26,31)'),
  accent: make('--ambient-warm', 'rgb(201,150,94)'),
  cool: make('--ambient-cool', 'rgb(74,88,108)'),
  text: make('--color-text-primary', 'rgb(237,234,227)'),
});

/**
 * Bridges the CSS design tokens into three.js colour space so the WebGL
 * layers repaint when the theme flips. Watching the root class is what
 * keeps the canvases in sync with ThemeContext without wiring every
 * scene into React state.
 */
export const useThemeColors = () => {
  const [colors, setColors] = useState(readPalette);

  useEffect(() => {
    const observer = new MutationObserver(() => setColors(readPalette()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });
    return () => observer.disconnect();
  }, []);

  return colors;
};

export default useThemeColors;
