import { useEffect, useState } from 'react';
import * as THREE from 'three';

const root = () => getComputedStyle(document.documentElement);

/** Reads an "r g b" design token and returns a colour-managed THREE.Color. */
const readColor = (name, fallback) => {
  const raw = typeof window === 'undefined' ? '' : root().getPropertyValue(name).trim();
  const parts = raw.split(/\s+/).map(Number);
  const [r, g, b] = parts.length === 3 && !parts.some(Number.isNaN) ? parts : fallback;
  return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
};

const readNumber = (name, fallback) => {
  const v = typeof window === 'undefined' ? NaN : parseFloat(root().getPropertyValue(name));
  return Number.isNaN(v) ? fallback : v;
};

const readPalette = () => ({
  base: readColor('--scene-base', [104, 62, 70]),
  red: readColor('--scene-red', [255, 116, 92]),
  blue: readColor('--scene-blue', [150, 184, 238]),
  butter: readColor('--scene-butter', [240, 205, 96]),
  cream: readColor('--scene-cream', [243, 233, 214]),
  shadowOpacity: readNumber('--scene-shadow-opacity', 0.3),
});

/**
 * Bridges the CSS design tokens into three.js so the blocks are painted
 * with the same inks as the page, and repaint when the theme flips.
 * Watching the root class keeps the canvases in sync with ThemeContext
 * without wiring every scene into React state.
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
