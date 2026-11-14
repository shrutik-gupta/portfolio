import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * Shared camera + light rig for the block scenes.
 *
 * The camera is orthographic and looks down from a corner, so the blocks
 * read like an architect's maquette rather than a game scene. `fit` is the
 * world-space box that must always stay in frame; zoom is derived from the
 * canvas size, so the object scales with its container.
 */
export const MaquetteRig = ({ fit = [7, 6], lookAt = [0, 1.2, 0], shadowOpacity = 0.3 }) => {
  const { camera, size, invalidate } = useThree();
  const light = useRef(null);

  useLayoutEffect(() => {
    camera.zoom = Math.min(size.width / fit[0], size.height / fit[1]);
    camera.lookAt(...lookAt);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, size.width, size.height, fit, lookAt, invalidate]);

  useEffect(() => {
    const cam = light.current?.shadow.camera;
    if (!cam) return;
    cam.left = -7;
    cam.right = 7;
    cam.top = 7;
    cam.bottom = -7;
    cam.near = 0.5;
    cam.far = 30;
    cam.updateProjectionMatrix();
  }, []);

  return (
    <>
      <ambientLight intensity={1.55} />
      <directionalLight
        ref={light}
        position={[-5, 10, 6]}
        intensity={1.9}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-radius={5}
      />
      <directionalLight position={[6, 3, -4]} intensity={0.35} />
      {/* The table: invisible except for the shadows that land on it. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={shadowOpacity} />
      </mesh>
    </>
  );
};

/* --- Easing used by both scenes --- */
export const clamp01 = (v) => Math.min(1, Math.max(0, v));

export const bounceOut = (t) => {
  const n = 7.5625;
  const d = 2.75;
  if (t < 1 / d) return n * t * t;
  if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75;
  if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375;
  return n * (t -= 2.625 / d) * t + 0.984375;
};

export const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
