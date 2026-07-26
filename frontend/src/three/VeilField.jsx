import React, { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { snoise2, dither } from './glsl/common';
import { useThemeColors } from './useThemeColors';
import { pointer, scroll } from '../lib/frameState';
import { damp, lerp } from '../lib/motion';

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  ${snoise2}
  ${dither}

  uniform float uTime;
  uniform float uIntensity;
  uniform float uHover;
  uniform vec2  uPointer;
  uniform vec2  uAspect;
  uniform vec3  uBase;
  uniform vec3  uAccent;
  uniform vec3  uCool;

  varying vec2 vUv;

  void main() {
    vec2 uv = (vUv - 0.5) * uAspect;

    // Domain warping: sample the noise field at a position that is
    // itself displaced by noise. Two cheap samples buy the impression
    // of a much more expensive fluid.
    vec2 q = vec2(
      snoise(uv * 1.1 + vec2(0.0, uTime * 0.05)),
      snoise(uv * 1.1 + vec2(4.3, -uTime * 0.04))
    );

    vec2 warp = uv + q * (0.55 + uIntensity * 0.35);
    float f = snoise(warp * 1.6 + vec2(uTime * 0.03, 0.0)) * 0.6
            + snoise(warp * 3.4 - vec2(0.0, uTime * 0.05)) * 0.25;

    // Warm bloom trailing the cursor.
    float d = distance(uv, uPointer);
    float bloom = exp(-d * d * 3.2) * (0.35 + uHover * 0.65);

    float t = smoothstep(-0.35, 0.65, f);

    vec3 col = mix(uBase, uCool, t * 0.55);
    col = mix(col, uAccent, pow(t, 3.0) * 0.5 + bloom * 0.55);

    // Fade to the page background at the edges so the plane has no seam.
    float edge = smoothstep(0.5, 0.12, length((vUv - 0.5) * vec2(1.0, 1.35)));
    col = mix(uBase, col, edge);

    col += bayer(gl_FragCoord.xy) * 0.012; // break up gradient banding

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * The footer's fluid veil: a single full-bleed plane running a
 * domain-warped noise field that thickens with scroll energy and blooms
 * warm around the cursor.
 *
 * One quad, one fragment pass, four noise samples — the whole effect is
 * a single draw call with no geometry to speak of.
 */
const VeilField = ({ hoverRef }) => {
  const colors = useThemeColors();
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0 },
      uHover: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uAspect: { value: new THREE.Vector2(1, 1) },
      uBase: { value: new THREE.Color() },
      uAccent: { value: new THREE.Color() },
      uCool: { value: new THREE.Color() },
    }),
    [],
  );

  useEffect(() => {
    uniforms.uBase.value.copy(colors.background);
    uniforms.uAccent.value.copy(colors.accent);
    uniforms.uCool.value.copy(colors.cool);
  }, [colors, uniforms]);

  useEffect(() => {
    const a = viewport.width / viewport.height;
    uniforms.uAspect.value.set(Math.max(a, 1), Math.max(1 / a, 1));
  }, [viewport.width, viewport.height, uniforms]);

  const target = useRef(new THREE.Vector2());

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    uniforms.uTime.value += dt;
    uniforms.uIntensity.value = lerp(
      uniforms.uIntensity.value,
      scroll.intensity,
      damp(0.06, dt),
    );
    uniforms.uHover.value = lerp(
      uniforms.uHover.value,
      hoverRef?.current ?? 0,
      damp(0.08, dt),
    );

    target.current.set(
      pointer.ex * uniforms.uAspect.value.x * 0.5,
      pointer.ey * uniforms.uAspect.value.y * 0.5,
    );
    uniforms.uPointer.value.lerp(target.current, damp(0.05, dt));
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  );
};

export default VeilField;
