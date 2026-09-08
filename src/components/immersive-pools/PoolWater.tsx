import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, damp } from "./scrollStore";
import { EXPERIENCE_CONFIG } from "./config";

const vertex = /* glsl */ `
uniform float uTime;
uniform float uEnergy;
uniform vec2 uPointer;
varying vec3 vWorldPos;
varying vec3 vNormalW;
varying vec2 vUv;
varying float vWave;

float waveHeight(vec2 p, float t) {
  float h = 0.0;
  h += sin(p.x * 0.28 + t * 0.32) * 0.085;
  h += sin(p.y * 0.19 - t * 0.24) * 0.075;
  h += sin((p.x + p.y) * 0.55 + t * 0.55) * 0.030;
  h += sin((p.x * 0.9 - p.y * 1.3) + t * 0.9) * 0.014;
  h += sin(p.x * 3.1 + t * 1.6) * 0.006;
  h += sin(p.y * 4.3 - t * 1.9) * 0.005;
  return h;
}

void main() {
  vUv = uv;
  vec3 pos = position;
  float t = uTime;
  float amp = 1.0 + uEnergy * 0.9;
  // subtle pointer ripple
  vec2 pp = uPointer * vec2(9.0, 18.0);
  float d = length(pos.xy - pp);
  float ripple = sin(d * 0.9 - t * 1.6) * 0.02 * exp(-d * 0.12);

  float h = waveHeight(pos.xy, t) * amp + ripple;
  pos.z += h;
  vWave = h;

  float e = 0.35;
  float hx = waveHeight(pos.xy + vec2(e, 0.0), t) * amp;
  float hy = waveHeight(pos.xy + vec2(0.0, e), t) * amp;
  vec3 tx = normalize(vec3(e, 0.0, hx - h));
  vec3 ty = normalize(vec3(0.0, e, hy - h));
  vec3 n = normalize(cross(tx, ty));

  vec4 world = modelMatrix * vec4(pos, 1.0);
  vWorldPos = world.xyz;
  vNormalW = normalize(mat3(modelMatrix) * n);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

const fragment = /* glsl */ `
uniform float uTime;
uniform float uWarm;      // 0 = twilight, 1 = sunset
uniform float uBright;
uniform vec3 uDeep;
uniform vec3 uShallow;
uniform vec3 uAqua;
uniform vec3 uSky;
uniform vec3 uWarmLight;
varying vec3 vWorldPos;
varying vec3 vNormalW;
varying vec2 vUv;
varying float vWave;

void main() {
  vec3 n = normalize(vNormalW);
  vec3 viewDir = normalize(cameraPosition - vWorldPos);
  float fres = pow(1.0 - clamp(dot(n, viewDir), 0.0, 1.0), 3.0);

  // depth gradient: deeper toward the centre of the pool
  float centre = 1.0 - smoothstep(0.0, 0.55, length(vUv - 0.5));
  vec3 base = mix(uShallow, uDeep, centre * 0.85);

  // caustic-style moving light bands
  float c = sin(vWorldPos.x * 2.2 + uTime * 0.45) * sin(vWorldPos.z * 2.7 - uTime * 0.35);
  c += sin(vWorldPos.x * 4.4 - uTime * 0.7) * 0.5;
  float caustic = smoothstep(0.55, 1.4, c + 0.6) * 0.22;

  vec3 col = base + uAqua * caustic * (0.5 + centre * 0.6);

  // refraction-like distortion tint driven by the wave slope
  col += uAqua * clamp(vWave * 2.2, -0.2, 0.35) * 0.35;

  // reflections
  vec3 refl = mix(uSky, uWarmLight, uWarm);
  col = mix(col, refl, fres * (0.55 + uWarm * 0.25));

  // specular glint
  vec3 lightDir = normalize(mix(vec3(-0.4, 0.55, 0.7), vec3(0.75, 0.22, -0.5), uWarm));
  float spec = pow(max(dot(reflect(-lightDir, n), viewDir), 0.0), 90.0);
  col += mix(uAqua, uWarmLight, uWarm) * spec * (0.35 + uWarm * 0.5);

  col *= uBright;
  gl_FragColor = vec4(col, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
`;

const c = (hex: string) => new THREE.Color(hex);

export function PoolWater({ width, length }: { width: number; length: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const p = EXPERIENCE_CONFIG.palette;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uWarm: { value: 0 },
      uBright: { value: 0.35 },
      uPointer: { value: new THREE.Vector2() },
      uDeep: { value: c("#04323d") },
      uShallow: { value: c(p.water) },
      uAqua: { value: c(p.aqua) },
      uSky: { value: c("#123641") },
      uWarmLight: { value: c("#f0c79a") },
    }),
    [p],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const u = mat.current?.uniforms;
    if (!u) return;
    const reduce = scrollState.reducedMotion;
    u.uTime.value += dt * (reduce ? 0.45 : 1);
    u.uEnergy.value = damp(
      u.uEnergy.value,
      reduce ? 0 : scrollState.energy * 0.8,
      3,
      dt,
    );
    u.uPointer.value.set(scrollState.px, scrollState.py);
    const s = scrollState.smooth;
    u.uWarm.value = damp(u.uWarm.value, Math.pow(s, 1.4), 2.5, dt);
    u.uBright.value = damp(u.uBright.value, 0.4 + Math.min(s * 2.2, 1) * 0.75, 2, dt);
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0.02, 0]}>
      <planeGeometry args={[width, length, 180, 260]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}
