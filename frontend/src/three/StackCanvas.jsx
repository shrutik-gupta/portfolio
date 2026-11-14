import React from 'react';
import Stage from './Stage';
import StackTower from './StackTower';

const CAMERA = { position: [7, 5.2, 8], near: 0.1, far: 60, zoom: 60 };

const StackCanvas = ({ activeRef, fallback = null, className = 'fill-parent' }) => (
  <Stage className={className} orthographic shadows camera={CAMERA} fallback={fallback}>
    <StackTower activeRef={activeRef} />
  </Stage>
);

export default StackCanvas;
