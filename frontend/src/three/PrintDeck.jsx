import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useThemeColors } from './useThemeColors';
import { MaquetteRig, clamp01, easeInOut } from './rig';
import { pointer } from '../lib/frameState';
import { damp, lerp } from '../lib/motion';
import projects from '../helper/ProjectHelper';

const FIT = [7.6, 5.7];
const LOOK_AT = [0, 0, -0.3];

// One print: a sheet of paper with a screenshot on it and a strip of tape.
const W = 3.3;
const H = 1.74;
const IMG_W = W - 0.22;
const IMG_ASPECT = 2.2;
const IMG_H = IMG_W / IMG_ASPECT;
const IMG_Z = -(H - IMG_H) / 2 + 0.11; // pushed up, leaving a caption margin

/** Paper is never perfectly flat: one corner curls up a little. */
const curl = (geo, amount) => {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i += 1) {
    const x = pos.getX(i) / (W / 2); // -1…1
    const z = pos.getZ(i) / (H / 2);
    const lift = Math.max(0, x) ** 2 * 0.09 + Math.max(0, x * 0.6 + z * 0.6) ** 2 * 0.07;
    pos.setY(i, pos.getY(i) + lift * amount);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
};

const sheet = (w, h, y, z = 0) => {
  const geo = new THREE.PlaneGeometry(w, h, 24, 8);
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, y, z);
  return curl(geo, 0.2);
};

/**
 * Where the prints lie, top of the pile first. The top one is fully
 * visible; the others show enough to be recognised and picked.
 */
const SLOTS = [
  { pos: [0.55, 0.26, 0.95], yaw: -0.09 },
  { pos: [-0.85, 0.2, -0.05], yaw: 0.15 },
  { pos: [0.95, 0.14, -0.95], yaw: -0.05 },
  { pos: [-0.35, 0.08, -1.85], yaw: 0.2 },
  { pos: [0.4, 0.02, -2.5], yaw: -0.14 },
];

/** The same prints after the page "fell over" (404): scattered wide. */
const SCATTER = [
  { pos: [1.3, 0.26, 1.2], yaw: -0.5 },
  { pos: [-1.5, 0.2, 0.3], yaw: 0.7 },
  { pos: [1.4, 0.14, -1.2], yaw: 0.35 },
  { pos: [-0.9, 0.08, -1.9], yaw: -0.9 },
  { pos: [0.2, 0.02, -0.4], yaw: 1.4 },
];

/** Crop a texture to the print's window, keeping the top of the image. */
const fitTexture = (texture, maxAnisotropy) => {
  const a = texture.image.width / texture.image.height;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = Math.min(8, maxAnisotropy);
  if (a < IMG_ASPECT) {
    texture.repeat.set(1, a / IMG_ASPECT);
    texture.offset.set(0, 1 - a / IMG_ASPECT);
  } else {
    texture.repeat.set(IMG_ASPECT / a, 1);
    texture.offset.set((1 - IMG_ASPECT / a) / 2, 0);
  }
  texture.needsUpdate = true;
};

/**
 * The hero object: a loose pile of prints — the actual projects — lying
 * in the light of the disc.
 *
 * It is still until something happens to it.
 *   - On load the prints are dealt onto the table one by one (`revealRef`).
 *   - The pile turns a few degrees toward the cursor.
 *   - Hover a print and it lifts off the table.
 *   - Click a print to bring it to the top; click the top one to go and
 *     read about that project (`onOpen`).
 *   - As the hero scrolls away the prints slide off toward the Work
 *     section below (`progressRef`), where the same prints hang on the wall.
 *
 * `fallen` scatters them and turns one face down (404 page).
 */
const PrintDeck = ({ progressRef, revealRef, fallen = false, onTop, onOpen }) => {
  const colors = useThemeColors();
  const { gl } = useThree();
  const group = useRef(null);
  const cards = useRef([]);

  const deck = useMemo(() => projects.slice(0, SLOTS.length), []);
  const textures = useLoader(
    THREE.TextureLoader,
    deck.map((p) => p.image),
  );

  useEffect(() => {
    const max = gl.capabilities.getMaxAnisotropy();
    textures.forEach((t) => fitTexture(t, max));
  }, [textures, gl]);

  const geo = useMemo(
    () => ({
      paper: sheet(W, H, 0),
      image: sheet(IMG_W, IMG_H, 0.004, IMG_Z),
      tape: sheet(0.62, 0.2, 0.008, -H / 2 + 0.02),
    }),
    [],
  );

  const mats = useMemo(
    () => ({
      paper: new THREE.MeshStandardMaterial({ roughness: 0.95, side: THREE.DoubleSide }),
      tape: new THREE.MeshStandardMaterial({ roughness: 0.9, transparent: true, opacity: 0.85 }),
      images: textures.map((map) => new THREE.MeshBasicMaterial({ map, toneMapped: false })),
    }),
    [textures],
  );

  useEffect(() => {
    mats.paper.color.copy(colors.cream);
    mats.tape.color.copy(colors.butter);
  }, [colors, mats]);

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
    },
    [geo],
  );
  useEffect(
    () => () => {
      mats.paper.dispose();
      mats.tape.dispose();
      mats.images.forEach((m) => m.dispose());
    },
    [mats],
  );

  // Plain mutable state: nothing here touches React.
  const state = useMemo(
    () => ({
      // order[slot] = index of the print lying in that slot
      order: deck.map((_, i) => i),
      hovered: -1,
      sim: deck.map(() => ({
        pos: new THREE.Vector3(),
        yaw: 0,
        tilt: 0,
        lift: 0,
        placed: false,
      })),
    }),
    [deck],
  );

  // Tell the page which project is on top (for the caption under the pile).
  useEffect(() => {
    onTop?.(deck[state.order[0]]);
  }, [deck, state, onTop]);

  const pick = (i) => {
    const slot = state.order.indexOf(i);
    if (slot === 0) {
      if (!fallen) onOpen?.(deck[i]);
      return;
    }
    // Pull it out and lay it on top; everything above it shifts down one.
    state.order.splice(slot, 1);
    state.order.unshift(i);
    onTop?.(deck[i]);
  };

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.04);
    const p = easeInOut(clamp01(progressRef?.current ?? 0));
    const reveal = revealRef ? revealRef.current : 1;
    const layout = fallen ? SCATTER : SLOTS;

    if (group.current) {
      group.current.rotation.y = lerp(group.current.rotation.y, pointer.ex * 0.12, damp(0.06, dt));
      group.current.rotation.x = lerp(group.current.rotation.x, -pointer.ey * 0.04, damp(0.06, dt));
    }

    for (let i = 0; i < deck.length; i += 1) {
      const card = cards.current[i];
      if (!card) continue;
      const s = state.sim[i];
      const slot = state.order.indexOf(i);
      const home = layout[slot];

      // Dealt in from the right, bottom of the pile first.
      const dealt = clamp01((reveal * 1.9 - (deck.length - 1 - slot) * 0.22) / 0.7);
      const deal = 1 - (1 - dealt) ** 3;
      card.visible = dealt > 0;

      // Leaving: each print slides down the screen, toward the wall below.
      const side = i % 2 === 0 ? 1 : -1;
      const tx = home.pos[0] + (1 - deal) * 7 + side * p * 1.6;
      const tz = home.pos[2] - (1 - deal) * 1.5 + p * (3.5 + slot * 0.6);
      const tyaw = home.yaw + (1 - deal) * 0.9 + side * p * 0.5;

      if (!s.placed) {
        s.pos.set(tx, home.pos[1], tz);
        s.yaw = tyaw;
        s.placed = true;
      }

      const f = damp(0.12, dt);
      // While a print is travelling between slots it arcs up, so it
      // passes over the others instead of through them.
      const travel = Math.min(1, Math.hypot(tx - s.pos.x, tz - s.pos.z) / 1.2);
      s.pos.x = lerp(s.pos.x, tx, f);
      s.pos.z = lerp(s.pos.z, tz, f);
      s.yaw = lerp(s.yaw, tyaw, f);

      const hover = state.hovered === i && p < 0.05 ? 1 : 0;
      s.lift = lerp(s.lift, hover, damp(0.16, dt));
      s.tilt = lerp(s.tilt, hover, damp(0.12, dt));

      card.position.set(
        s.pos.x,
        home.pos[1] + s.lift * 0.45 + travel * 0.7 * deal + (1 - deal) * 1.2,
        s.pos.z,
      );
      // Hovering straightens the print and tips it toward the reader.
      card.rotation.set(
        -s.tilt * 0.16 + (fallen && slot === 4 ? Math.PI : 0),
        s.yaw * (1 - s.tilt * 0.6),
        0,
      );
      card.renderOrder = deck.length - slot;
    }
  });

  return (
    <>
      <MaquetteRig fit={FIT} lookAt={LOOK_AT} shadowOpacity={colors.shadowOpacity} />
      <group ref={group}>
        {deck.map((project, i) => (
          <group
            key={project.id}
            ref={(el) => {
              cards.current[i] = el;
            }}
            visible={false}
            onPointerOver={(e) => {
              e.stopPropagation();
              state.hovered = i;
              gl.domElement.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              if (state.hovered === i) state.hovered = -1;
              gl.domElement.style.cursor = '';
            }}
            onClick={(e) => {
              e.stopPropagation();
              pick(i);
            }}
          >
            <mesh geometry={geo.paper} material={mats.paper} castShadow receiveShadow />
            <mesh geometry={geo.image} material={mats.images[i]} />
            <mesh geometry={geo.tape} material={mats.tape} rotation={[0, i % 2 ? 0.1 : -0.08, 0]} />
          </group>
        ))}
      </group>
    </>
  );
};

export default PrintDeck;
