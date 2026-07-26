import React from 'react';
import Stage from './Stage';
import ShardField from './ShardField';

/**
 * Hero WebGL layer. Lazy-imported by the Hero section so three.js stays
 * out of the initial bundle — the page is readable and interactive
 * before the scene arrives.
 *
 * The camera sits outside the field and near its ground plane, looking
 * across it. Inside the disc the nearest shards tower over the frame and
 * occlude everything; high above it, the shards foreshorten into flat
 * tiles. Roughly eye level with the tips is what reads as a skyline.
 */
const HeroCanvas = ({ progressRef, revealRef }) => (
  <Stage
    className="fill-parent"
    camera={{ position: [0, 1.4, 13], fov: 34, near: 0.1, far: 60 }}
  >
    <ShardField progressRef={progressRef} revealRef={revealRef} />
  </Stage>
);

export default HeroCanvas;
