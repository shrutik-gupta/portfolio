import React from 'react';
import Stage from './Stage';
import VeilField from './VeilField';

/**
 * Opaque stage: the veil paints its own background, so there is no need
 * to composite an alpha channel over the page.
 */
const VeilCanvas = ({ hoverRef }) => (
  <Stage
    className="fill-parent"
    camera={{ position: [0, 0, 5], fov: 50 }}
    alpha={false}
    requireTier="mid"
  >
    <VeilField hoverRef={hoverRef} />
  </Stage>
);

export default VeilCanvas;
