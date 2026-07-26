import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { snoise2, fbm2 } from './glsl/common';
import { useThemeColors } from './useThemeColors';
import { pointer, scroll } from '../lib/frameState';
import { deviceTier, damp, lerp } from '../lib/motion';

const GRID = { high: 22, mid: 16, low: 12 }; // tiles per side, per layer
const SPACING = 0.5;
const LAYER_GAP = 1.35;

const vertexShader = /* glsl */ `
  ${snoise2}
  ${fbm2}

  attribute float aLayer;
  attribute float aSeed;
  attribute float aRadius;

  uniform float uTime;
  uniform float uActive;    // fractional layer index — interpolates
  uniform float uIntensity;
  uniform vec2  uPointer;

  varying float vAct;
  varying float vRad;
  varying float vRim;
  varying float vLift;

  void main() {
    vec3 base = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);

    // Proximity to the layer the reader is currently on.
    float act = 1.0 - smoothstep(0.0, 1.15, abs(aLayer - uActive));

    vec3 transformed = position * mix(0.55, 1.0, act);

    float n = fbm(base.xz * 0.32 + vec2(uTime * 0.09, aLayer * 4.7));

    // The active stratum breathes; dormant ones stay nearly flat.
    float lift = n * 0.4 * act + sin(uTime * 0.8 + aSeed * 6.2831) * 0.04;

    float pd = distance(base.xz, uPointer);
    float rip = exp(-pd * pd * 0.16) * act;
    lift += rip * 0.7 + uIntensity * n * 0.25 * act;

    transformed.y += lift;

    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(transformed, 1.0);

    vec3 nrm = normalize(normalMatrix * normal);
    vRim = pow(1.0 - abs(dot(nrm, normalize(-mvPosition.xyz))), 3.0);

    vAct = act;
    vRad = aRadius;
    vLift = lift;

    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uDim;
  uniform vec3 uAccent;
  uniform vec3 uCool;

  varying float vAct;
  varying float vRad;
  varying float vRim;
  varying float vLift;

  void main() {
    vec3 col = mix(uDim * 2.6, uCool * 1.2, 0.55);
    col = mix(col, uAccent * 1.15, pow(vAct, 1.3) * clamp(vLift * 1.6 + 0.45, 0.0, 1.0));
    col += uAccent * vRim * 0.45 * vAct;

    // Circular dissolve so the lattice has no visible square edge.
    float edge = 1.0 - smoothstep(0.62, 1.0, vRad);
    float alpha = edge * mix(0.3, 1.0, vAct);
    if (alpha < 0.01) discard;

    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

/**
 * The capability stack rendered as geological strata: one lattice per
 * discipline, stacked in depth. Scroll drives `activeRef`, and the whole
 * stack travels so the current layer sits at eye level while the others
 * recede into ghosted context.
 *
 * All layers live in a single InstancedMesh keyed by an `aLayer`
 * attribute, so moving between strata costs one uniform write rather
 * than swapping geometry.
 */
const StrataField = ({ activeRef, layerCount = 5 }) => {
  const meshRef = useRef(null);
  const groupRef = useRef(null);
  const colors = useThemeColors();
  const { camera } = useThree();

  const tier = deviceTier();
  const side = GRID[tier];

  const { geometry, matrices, count } = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.34, 0.055, 0.34);

    const mats = [];
    const layers = [];
    const seeds = [];
    const radii = [];
    const dummy = new THREE.Object3D();
    const half = (side - 1) / 2;
    const maxR = Math.hypot(half, half) * SPACING;

    for (let l = 0; l < layerCount; l += 1) {
      for (let ix = 0; ix < side; ix += 1) {
        for (let iz = 0; iz < side; iz += 1) {
          const x = (ix - half) * SPACING;
          const z = (iz - half) * SPACING;
          const r = Math.hypot(x, z);
          if (r > maxR * 0.92) continue; // trim to a disc

          dummy.position.set(x, -l * LAYER_GAP, z);
          dummy.rotation.set(0, 0, 0);
          dummy.scale.set(1, 1, 1);
          dummy.updateMatrix();
          mats.push(dummy.matrix.clone());

          layers.push(l);
          seeds.push(Math.random());
          radii.push(r / maxR);
        }
      }
    }

    geo.setAttribute('aLayer', new THREE.InstancedBufferAttribute(new Float32Array(layers), 1));
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(new Float32Array(seeds), 1));
    geo.setAttribute('aRadius', new THREE.InstancedBufferAttribute(new Float32Array(radii), 1));

    return { geometry: geo, matrices: mats, count: mats.length };
  }, [side, layerCount]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uActive: { value: 0 },
      uIntensity: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uDim: { value: new THREE.Color() },
      uAccent: { value: new THREE.Color() },
      uCool: { value: new THREE.Color() },
    }),
    [],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.frustumCulled = false;
  }, [matrices]);

  useEffect(() => {
    uniforms.uDim.value.copy(colors.surface);
    uniforms.uAccent.value.copy(colors.accent);
    uniforms.uCool.value.copy(colors.cool);
  }, [colors, uniforms]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  const pointerTarget = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    uniforms.uTime.value += dt;

    const target = activeRef?.current ?? 0;
    uniforms.uActive.value = lerp(uniforms.uActive.value, target, damp(0.09, dt));
    uniforms.uIntensity.value = lerp(
      uniforms.uIntensity.value,
      scroll.intensity,
      damp(0.08, dt),
    );

    pointerTarget.current.set(pointer.ex * 4.5, -pointer.ey * 3);
    uniforms.uPointer.value.lerp(pointerTarget.current, damp(0.07, dt));

    // Travel the stack so the active stratum stays centred.
    if (groupRef.current) {
      groupRef.current.position.y = uniforms.uActive.value * LAYER_GAP;
      groupRef.current.rotation.y = lerp(
        groupRef.current.rotation.y,
        pointer.ex * 0.18,
        damp(0.04, dt),
      );
      groupRef.current.rotation.x = lerp(
        groupRef.current.rotation.x,
        -0.06 + pointer.ey * 0.05,
        damp(0.04, dt),
      );
    }

    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </instancedMesh>
    </group>
  );
};

export default StrataField;
