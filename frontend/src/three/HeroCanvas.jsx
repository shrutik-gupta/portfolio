import React from 'react';
import Stage from './Stage';
import Maquette from './Maquette';

const CAMERA = { position: [7, 5.4, 8], near: 0.1, far: 60, zoom: 60 };

/**
 * The maquette's canvas. Lazy-imported, so three.js stays out of the
 * initial bundle — the page is readable before the blocks arrive.
 *
 * `onMiss` fires when a click lands on the canvas but not on a block,
 * which lets whatever sits behind the canvas (the hero's disc) still
 * respond to it.
 */
const HeroCanvas = ({ progressRef, revealRef, fallen = false, onMiss, className = 'fill-parent' }) => (
  <Stage
    className={className}
    orthographic
    shadows
    interactive
    camera={CAMERA}
    onPointerMissed={onMiss}
  >
    <Maquette progressRef={progressRef} revealRef={revealRef} fallen={fallen} />
  </Stage>
);

export default HeroCanvas;
