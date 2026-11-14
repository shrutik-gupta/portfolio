import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { useThemeColors } from './useThemeColors';
import { MaquetteRig, bounceOut, clamp01, easeInOut } from './rig';
import { pointer } from '../lib/frameState';
import { damp, lerp } from '../lib/motion';

const FIT = [7.4, 6.4];
const LOOK_AT = [0, 1.45, 0];
const SLAB_TOP = 0.35;

/** An arch: a block with a doorway cut through it. Origin at its base. */
const archGeometry = () => {
  const s = new THREE.Shape();
  s.moveTo(-0.85, 0);
  s.lineTo(-0.85, 1.5);
  s.lineTo(0.85, 1.5);
  s.lineTo(0.85, 0);
  s.lineTo(0.5, 0);
  s.lineTo(0.5, 0.55);
  s.absarc(0, 0.55, 0.5, 0, Math.PI, false);
  s.lineTo(-0.5, 0);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, {
    depth: 0.8,
    bevelEnabled: true,
    bevelSize: 0.03,
    bevelThickness: 0.03,
    bevelSegments: 2,
    curveSegments: 24,
  });
  geo.translate(0, 0, -0.4);
  return geo;
};

/**
 * The pieces. `pos` is where a piece rests, `on` is the piece it sits on
 * (so it rides along when that one hops), `away` is the direction it
 * drifts as the hero scrolls out, `fallen` is where it lies on the 404.
 */
const PIECES = [
  {
    key: 'slab',
    color: 'base',
    geo: () => new RoundedBoxGeometry(4.4, SLAB_TOP, 3, 3, 0.05),
    pos: [0, SLAB_TOP / 2, 0],
    away: [0, -0.4, 0],
    fixed: true,
    fallen: { pos: [0, SLAB_TOP / 2, 0], rot: [0, 0.1, 0] },
  },
  {
    key: 'arch',
    color: 'blue',
    geo: archGeometry,
    pos: [-1.15, SLAB_TOP, -0.55],
    away: [-1.1, 1.3, -0.4],
    spin: [0.2, -0.5, 0.15],
    fallen: { pos: [-1.2, SLAB_TOP + 0.42, 0.1], rot: [-Math.PI / 2, 0, 0.5] },
  },
  {
    key: 'ball',
    color: 'red',
    geo: () => new THREE.SphereGeometry(0.5, 40, 28),
    pos: [-1.15, SLAB_TOP + 1.5 + 0.5, -0.55],
    on: 'arch',
    away: [-0.6, 3.1, 0.3],
    spin: [1, 0.6, 0],
    fallen: { pos: [2.9, 0.5, 1.6], rot: [0, 0, 0] },
  },
  {
    key: 'column',
    color: 'cream',
    geo: () => new THREE.CylinderGeometry(0.38, 0.38, 1.9, 40),
    pos: [1.35, SLAB_TOP + 0.95, -0.75],
    away: [1.2, 1.0, -0.6],
    spin: [0.3, 0, -0.4],
    fallen: { pos: [1.0, SLAB_TOP + 0.38, -0.6], rot: [0, 0.5, Math.PI / 2] },
  },
  {
    key: 'cone',
    color: 'butter',
    geo: () => new THREE.ConeGeometry(0.5, 0.85, 40),
    pos: [1.35, SLAB_TOP + 1.9 + 0.425, -0.75],
    on: 'column',
    away: [1.5, 2.9, 0.2],
    spin: [-0.8, 0.4, 0.7],
    fallen: { pos: [-2.9, 0.42, 1.5], rot: [0, 0, 0] },
  },
  {
    key: 'cube',
    color: 'red',
    geo: () => new RoundedBoxGeometry(0.9, 0.9, 0.9, 3, 0.06),
    pos: [0.85, SLAB_TOP + 0.45, 0.8],
    rot: [0, 0.45, 0],
    away: [1.3, 0.7, 1.1],
    spin: [0.5, 0.9, 0.3],
    fallen: { pos: [0.9, SLAB_TOP + 0.45, 0.85], rot: [0, 0.9, 0] },
  },
  {
    key: 'coin',
    color: 'butter',
    geo: () => new THREE.CylinderGeometry(0.5, 0.5, 0.26, 40),
    pos: [-0.55, SLAB_TOP + 0.13, 0.95],
    away: [-1.4, 0.5, 1.2],
    spin: [1.2, 0, 0.6],
    fallen: { pos: [-0.3, SLAB_TOP + 0.13, 1.0], rot: [0, 0, 0] },
  },
];

/**
 * The hero object: a small maquette of building blocks.
 *
 * It is still until something happens to it.
 *   - On load the pieces drop into place one after another (`revealRef`).
 *   - The whole model turns a few degrees toward the cursor.
 *   - Hover a piece and it hops; click it and it hops higher.
 *   - As the hero scrolls away the pieces drift apart (`progressRef`),
 *     "taken apart" — they come back as the stack in the Skills section.
 *
 * `fallen` lays the same pieces on their sides, for the 404 page.
 */
const Maquette = ({ progressRef, revealRef, fallen = false }) => {
  const colors = useThemeColors();
  const { gl } = useThree();
  const group = useRef(null);
  const meshes = useRef([]);

  const pieces = useMemo(
    () =>
      PIECES.map((p) => ({
        ...p,
        geometry: p.geo(),
        home: new THREE.Vector3(...(fallen ? p.fallen.pos : p.pos)),
        homeRot: new THREE.Euler(...(fallen ? p.fallen.rot : p.rot || [0, 0, 0])),
        parent: fallen ? -1 : PIECES.findIndex((q) => q.key === p.on),
      })),
    [fallen],
  );

  // Per-piece motion state. Plain objects: nothing here touches React.
  const sim = useMemo(
    () => pieces.map(() => ({ y: 0, vy: 0, tilt: 0, vtilt: 0, yaw: 0, vyaw: 0 })),
    [pieces],
  );

  const materials = useMemo(() => {
    const make = () => new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 });
    return { base: make(), red: make(), blue: make(), butter: make(), cream: make() };
  }, []);

  useEffect(() => {
    Object.keys(materials).forEach((k) => materials[k].color.copy(colors[k]));
  }, [colors, materials]);

  useEffect(
    () => () => {
      pieces.forEach((p) => p.geometry.dispose());
    },
    [pieces],
  );
  useEffect(() => () => Object.values(materials).forEach((m) => m.dispose()), [materials]);

  const kick = (i, strength = 1) => {
    const piece = pieces[i];
    if (piece.fixed) return;
    const s = sim[i];
    // Only from rest (or near it), so a held hover cannot juggle a piece.
    if (s.y > 0.25) return;
    s.vy = 4.2 * strength;
    s.vtilt += (Math.random() - 0.5) * 5 * strength;
    s.vyaw += (Math.random() - 0.5) * 6 * strength;
    // Whatever is sitting on this piece gets thrown a little higher.
    pieces.forEach((q, j) => {
      if (q.parent === i) {
        sim[j].vy = 5.2 * strength;
        sim[j].vyaw += (Math.random() - 0.5) * 4;
      }
    });
  };

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.04);
    const p = easeInOut(clamp01(progressRef?.current ?? 0));
    const reveal = revealRef ? revealRef.current : 1;

    if (group.current) {
      group.current.rotation.y = lerp(
        group.current.rotation.y,
        pointer.ex * 0.22 + p * 0.5,
        damp(0.06, dt),
      );
      group.current.rotation.x = lerp(
        group.current.rotation.x,
        -pointer.ey * 0.05,
        damp(0.06, dt),
      );
    }

    for (let i = 0; i < pieces.length; i += 1) {
      const piece = pieces[i];
      const mesh = meshes.current[i];
      const s = sim[i];
      if (!mesh) continue;

      // Hop: gravity pulls back to rest, with one small bounce.
      s.vy -= 16 * dt;
      s.y += s.vy * dt;
      if (s.y < 0) {
        s.y = 0;
        s.vy = s.vy < -1.2 ? -s.vy * 0.32 : 0;
      }
      // Wobble: springs back upright.
      s.vtilt += (-70 * s.tilt - 7 * s.vtilt) * dt;
      s.tilt += s.vtilt * dt;
      s.vyaw += (-30 * s.yaw - 5 * s.vyaw) * dt;
      s.yaw += s.vyaw * dt;

      // Entrance: each piece falls in on its own beat.
      const t = clamp01((reveal * 1.7 - i * 0.16) / 0.55);
      const drop = (1 - bounceOut(t)) * 7;
      mesh.visible = t > 0;

      const carried = piece.parent >= 0 ? sim[piece.parent].y : 0;
      const away = piece.away || [0, 0, 0];
      const spin = piece.spin || [0, 0, 0];

      mesh.position.set(
        piece.home.x + away[0] * p * 1.6,
        piece.home.y + s.y + carried + drop + away[1] * p * 1.6,
        piece.home.z + away[2] * p * 1.6,
      );
      mesh.rotation.set(
        piece.homeRot.x + s.tilt * 0.35 + spin[0] * p,
        piece.homeRot.y + s.yaw * 0.5 + spin[1] * p,
        piece.homeRot.z + s.tilt * 0.25 + spin[2] * p,
      );
    }
  });

  return (
    <>
      <MaquetteRig fit={FIT} lookAt={LOOK_AT} shadowOpacity={colors.shadowOpacity} />
      <group ref={group}>
        {pieces.map((piece, i) => (
          <mesh
            key={piece.key}
            ref={(el) => {
              meshes.current[i] = el;
            }}
            geometry={piece.geometry}
            material={materials[piece.color]}
            castShadow
            receiveShadow
            onPointerOver={(e) => {
              e.stopPropagation();
              kick(i, 1);
              if (!piece.fixed) gl.domElement.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              gl.domElement.style.cursor = '';
            }}
            onClick={(e) => {
              e.stopPropagation();
              kick(i, 1.5);
            }}
          />
        ))}
      </group>
    </>
  );
};

export default Maquette;
