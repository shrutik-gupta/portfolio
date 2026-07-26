import React from 'react';
import Stage from './Stage';
import StrataField from './StrataField';

const StrataCanvas = ({ activeRef, layerCount }) => (
  <Stage
    className="fill-parent"
    camera={{ position: [0, 2.6, 4.6], fov: 44, near: 0.1, far: 40 }}
  >
    <StrataField activeRef={activeRef} layerCount={layerCount} />
  </Stage>
);

export default StrataCanvas;
