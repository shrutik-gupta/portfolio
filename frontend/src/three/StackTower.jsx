import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { useThemeColors } from './useThemeColors';
import { MaquetteRig, bounceOut, clamp01 } from './rig';
import { pointer } from '../lib/frameState';
import { damp, lerp } from '../lib/motion';

const FIT = [5.8, 7.6];
const LOOK_AT = [0, 2.4, 0];

/**
 * "The stack", built as an actual stack — bottom first.
 * Each layer's shape says what it is: the database is a drum, the
 * interface is a screen standing on top.
 */
const LAYERS = [
  { color: 'base', h: 0.45, geo: () => new RoundedBoxGeometry(3.1, 0.45, 3.1, 3, 0.05) },                       // foundations
  { color: 'cream', h: 0.65, geo: () => new RoundedBoxGeometry(2.5, 0.65, 2.5, 3, 0.05) },                      // languages
  { color: 'blue', h: 0.75, geo: () => new THREE.CylinderGeometry(1.1, 1.1, 0.75, 48) },                        // data
  { color: 'butter', h: 0.4, geo: () => new THREE.CylinderGeometry(1.3, 1.3, 0.4, 48) },                        // cloud
  { color: 'cream', h: 0.7, rotY: Math.PI / 4, geo: () => new RoundedBoxGeometry(1.5, 0.7, 1.5, 3, 0.05) },     // server
  { color: 'blue', h: 0.6, rotY: 0.2, geo: () => new RoundedBoxGeometry(1.1, 0.6, 1.1, 3, 0.05) },              // ai
  { color: 'red', h: 1.1, rotY: -0.5, geo: () => new RoundedBoxGeometry(1.45, 1.1, 0.22, 3, 0.06) },            // interface
];

/**
 * `activeRef` is a fractional count of layers that have landed (0…7),
 * written by the Skills section's ScrollTrigger. The scene only moves
 * when that number does — i.e. when the reader scrolls.
 */
const StackTower = ({ activeRef }) => {
  const colors = useThemeColors();
  const group = useRef(null);
  const meshes = useRef([]);
  const smooth = useRef(0);

  const layers = useMemo(() => {
    let y = 0;
    return LAYERS.map((l) => {
      const layer = { ...l, geometry: l.geo(), y: y + l.h / 2 };
      y += l.h;
      return layer;
    });
  }, []);

  const materials = useMemo(() => {
    const make = () => new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 });
    return { base: make(), red: make(), blue: make(), butter: make(), cream: make() };
  }, []);

  useEffect(() => {
    Object.keys(materials).forEach((k) => materials[k].color.copy(colors[k]));
  }, [colors, materials]);

  useEffect(
    () => () => {
      layers.forEach((l) => l.geometry.dispose());
      Object.values(materials).forEach((m) => m.dispose());
    },
    [layers, materials],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.04);
    smooth.current = lerp(smooth.current, activeRef?.current ?? LAYERS.length, damp(0.12, dt));
    const n = smooth.current;
    const top = Math.min(LAYERS.length - 1, Math.floor(n - 0.001));

    if (group.current) {
      // The tower turns as it grows, and leans toward the cursor a touch.
      group.current.rotation.y = lerp(
        group.current.rotation.y,
        -0.35 + n * 0.08 + pointer.ex * 0.18,
        damp(0.08, dt),
      );
    }

    for (let i = 0; i < layers.length; i += 1) {
      const mesh = meshes.current[i];
      if (!mesh) continue;
      const t = clamp01(n - i);
      mesh.visible = t > 0.01;
      mesh.position.y = layers[i].y + (1 - bounceOut(t)) * 6.5;
      // The newest layer sits a hair larger, so the eye knows which one
      // the text beside it is talking about.
      const target = i === top && t > 0.9 ? 1.045 : 1;
      const s = lerp(mesh.scale.x, target, damp(0.12, dt));
      mesh.scale.setScalar(s);
    }
  });

  return (
    <>
      <MaquetteRig fit={FIT} lookAt={LOOK_AT} shadowOpacity={colors.shadowOpacity} />
      <group ref={group}>
        {layers.map((layer, i) => (
          <mesh
            key={i}
            ref={(el) => {
              meshes.current[i] = el;
            }}
            geometry={layer.geometry}
            material={materials[layer.color]}
            rotation={[0, layer.rotY || 0, 0]}
            castShadow
            receiveShadow
          />
        ))}
      </group>
    </>
  );
};

export default StackTower;
