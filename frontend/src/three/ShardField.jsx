import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { snoise2, fbm2 } from './glsl/common';
import { useThemeColors } from './useThemeColors';
import { pointer, scroll } from '../lib/frameState';
import { deviceTier, damp, lerp } from '../lib/motion';

const COUNT = { high: 3000, mid: 1600, low: 700 };
const RADIUS = 8;

const vertexShader = /* glsl */ `
  ${snoise2}
  ${fbm2}

  attribute float aSeed;

  uniform float uTime;
  uniform float uIntensity;   // scroll energy, 0..1
  uniform float uProgress;    // hero exit progress, 0..1
  uniform float uReveal;      // entrance growth, 0..1
  uniform vec2  uPointer;     // pointer projected onto the field plane

  varying float vHeight;
  varying float vY;
  varying float vRim;
  varying float vDepth;
  varying float vRadial;

  void main() {
    // Instance origin in field space. Everything is driven from here so
    // neighbouring shards share the same noise sample and read as one
    // continuous surface rather than independent objects.
    vec3 base = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
    float radial = length(base.xz);

    float drift = fbm(base.xz * 0.15 + vec2(uTime * 0.045, -uTime * 0.03));

    // Pointer acts as a pressure source: a decaying ring travels outward
    // from it, lifting shards as it passes.
    float pd = distance(base.xz, uPointer);
    float falloff = exp(-pd * pd * 0.028);
    float ripple = sin(pd * 1.5 - uTime * 2.1) * falloff * 0.7;

    float height = 0.55 + drift * 0.85 + ripple + uIntensity * drift * 1.1;
    height = max(height, 0.06);

    // Entrance grows the field outward from the centre, and the exit
    // sinks it back into the ground. Both act on height rather than
    // opacity so the material can stay opaque — see the note on the
    // material below.
    float grow = smoothstep(radial * 0.05, radial * 0.05 + 0.4, uReveal);
    height *= grow * (1.0 - uProgress * 0.92);

    vec3 transformed = position;
    transformed.y *= height;

    // Sway scales with local height so the tips move and the bases don't.
    float sway = sin(uTime * 0.55 + aSeed * 6.2831) * 0.1;
    transformed.x += sway * position.y;
    transformed.z += cos(uTime * 0.42 + aSeed * 6.2831) * 0.07 * position.y;

    // Lean away from the pointer.
    vec2 away = pd > 0.001 ? normalize(base.xz - uPointer) : vec2(0.0);
    transformed.xz += away * falloff * 0.45 * position.y;

    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);

    vec3 worldNormal = normalize(normalMatrix * normal);
    vec3 viewDir = normalize(-mvPosition.xyz);
    vRim = pow(1.0 - abs(dot(worldNormal, viewDir)), 2.5);

    vHeight = height;
    vY = position.y;
    vRadial = radial;
    // Distance from the camera, not from the field origin. Fogging on
    // origin-distance is what previously made the shards nearest the
    // camera the most faded ones.
    vDepth = -mvPosition.z;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3  uBase;
  uniform vec3  uAccent;
  uniform vec3  uCool;
  uniform vec3  uFog;
  uniform float uFogNear;
  uniform float uFogFar;

  varying float vHeight;
  varying float vY;
  varying float vRim;
  varying float vDepth;
  varying float vRadial;

  void main() {
    // Tall shards catch the warm key light; short ones stay in shadow.
    float lift = smoothstep(0.25, 1.7, vHeight);
    vec3 col = mix(uBase * 2.4, uCool * 1.15, 0.5);
    col = mix(col, uAccent, lift * lift * 1.1);

    // Vertical falloff — bases sit in darkness, tips read as lit metal.
    col *= mix(0.22, 1.65, vY);
    col += uAccent * vRim * 0.5 * lift;

    // Depth fog, plus a radial fade so the disc has no hard boundary.
    float fog = smoothstep(uFogNear, uFogFar, vDepth);
    float edge = smoothstep(${(RADIUS * 0.55).toFixed(1)}, ${RADIUS.toFixed(1)}, vRadial);
    col = mix(col, uFog, max(fog, edge));

    // Opaque on purpose. The canvas sits directly on the page
    // background, so fading toward uFog is visually identical to fading
    // alpha — but it keeps depth sorting correct. As a transparent
    // material with depthWrite, faded near shards wrote depth while
    // contributing almost no colour, masking the whole field behind an
    // invisible wall.
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * The hero's WebGL substrate: an instanced field of thin metallic shards
 * displaced by a slow noise field, the cursor, and scroll energy.
 *
 * One InstancedMesh, one draw call, 24 verts per shard. All motion lives
 * in the vertex shader — the CPU only writes a handful of uniforms per
 * frame, so instance count barely moves the frame budget.
 */
const ShardField = ({ progressRef, revealRef }) => {
  const meshRef = useRef(null);
  const groupRef = useRef(null);
  const colors = useThemeColors();
  const { camera } = useThree();

  const tier = deviceTier();
  const count = COUNT[tier];

  // --- Geometry + per-instance data -------------------------------
  const { geometry, matrices } = useMemo(() => {
    const geo = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
    geo.translate(0, 0.5, 0); // anchor at the base so scaling grows upward

    const seedArray = new Float32Array(count);
    const mats = [];
    const dummy = new THREE.Object3D();
    const golden = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i += 1) {
      // Sunflower distribution: even coverage with no visible grid lines.
      const r = Math.sqrt((i + 0.5) / count) * RADIUS;
      const theta = i * golden;
      const jitter = 0.35;
      const x = Math.cos(theta) * r + (Math.random() - 0.5) * jitter;
      const z = Math.sin(theta) * r + (Math.random() - 0.5) * jitter;

      const width = 0.05 + Math.random() * 0.05;
      const height = 0.7 + Math.random() * 2.1;

      dummy.position.set(x, 0, z);
      dummy.rotation.set(0, Math.random() * Math.PI, 0);
      dummy.scale.set(width, height, width);
      dummy.updateMatrix();
      mats.push(dummy.matrix.clone());

      seedArray[i] = Math.random();
    }

    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seedArray, 1));
    return { geometry: geo, matrices: mats };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uProgress: { value: 0 },
      uReveal: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uFogNear: { value: 7 },
      uFogFar: { value: 21 },
      uBase: { value: new THREE.Color() },
      uAccent: { value: new THREE.Color() },
      uCool: { value: new THREE.Color() },
      uFog: { value: new THREE.Color() },
    }),
    [],
  );

  // Write instance matrices once the mesh exists.
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false; // the field is always on screen
  }, [matrices]);

  // Theme changes mutate the existing uniforms rather than rebuilding
  // the material, so no shader recompile on a theme toggle.
  useEffect(() => {
    uniforms.uBase.value.copy(colors.surface);
    uniforms.uAccent.value.copy(colors.accent);
    uniforms.uCool.value.copy(colors.cool);
    uniforms.uFog.value.copy(colors.background);
  }, [colors, uniforms]);

  // Explicit disposal: the geometry is created outside JSX, so R3F's
  // automatic cleanup does not cover it.
  useEffect(() => () => geometry.dispose(), [geometry]);

  const pointerTarget = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05); // clamp after a tab switch
    uniforms.uTime.value += dt;
    uniforms.uProgress.value = progressRef?.current ?? 0;
    uniforms.uReveal.value = revealRef?.current ?? 1;
    uniforms.uIntensity.value = lerp(
      uniforms.uIntensity.value,
      scroll.intensity,
      damp(0.08, dt),
    );

    // Project the cursor onto the field plane. The multipliers are wider
    // than the visible frame so the ripple keeps travelling after the
    // cursor leaves the viewport edge.
    pointerTarget.current.set(pointer.ex * 7, -pointer.ey * 4 - 1.0);
    uniforms.uPointer.value.lerp(pointerTarget.current, damp(0.06, dt));

    if (groupRef.current) {
      groupRef.current.rotation.y = lerp(
        groupRef.current.rotation.y,
        pointer.ex * 0.05,
        damp(0.04, dt),
      );
    }

    // The camera looks across the field from outside it, and lifts away
    // as the hero exits.
    const p = progressRef?.current ?? 0;
    camera.position.x = lerp(camera.position.x, pointer.ex * 1.1, damp(0.04, dt));
    camera.position.y = lerp(
      camera.position.y,
      1.4 - pointer.ey * 0.35 + p * 2.6,
      damp(0.05, dt),
    );
    camera.lookAt(0, 0.7 - p * 0.9, 0);
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          side={THREE.FrontSide}
        />
      </instancedMesh>
    </group>
  );
};

export default ShardField;
