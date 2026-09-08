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

  // broad slow pool movement
  h += sin(p.x * 0.65 + t * 0.48) * 0.012;
  h += sin(p.y * 0.72 - t * 0.42) * 0.010;

  // crossed smaller ripples
  h += sin((p.x + p.y) * 1.35 + t * 0.7) * 0.004;
  h += sin((p.x * 1.8 - p.y * 1.35) - t * 0.6) * 0.003;

  // tiny surface detail
  h += sin(p.x * 4.6 + t * 1.1) * 0.0018;
  h += sin(p.y * 5.1 - t * 1.0) * 0.0015;

  return h;
}
void main() {
  vUv = uv;
  vec3 pos = position;
  float t = uTime;
  float amp = 1.0 + uEnergy * 0.25;
  // subtle pointer ripple
  vec2 pp = uPointer * vec2(5.0, 2.75);
  float d = length(pos.xy - pp);
float ripple =
  sin(d * 1.8 - t * 2.0)
  * 0.0025
  * exp(-d * 0.75);
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
uniform float uWarm;
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

vec3 aces(vec3 x) {
  return clamp(
    (x * (2.51 * x + 0.03)) /
    (x * (2.43 * x + 0.59) + 0.14),
    0.0,
    1.0
  );
}

vec3 toSRGB(vec3 x) {
  return mix(
    x * 12.92,
    1.055 *
      pow(
        max(x, vec3(0.0001)),
        vec3(1.0 / 2.4)
      ) -
      0.055,
    step(0.0031308, x)
  );
}

void main() {

  vec3 n = normalize(vNormalW);
  vec3 viewDir =
    normalize(cameraPosition - vWorldPos);

  /* -------------------------
     FRESNEL
  ------------------------- */

  float fres =
    pow(
      1.0 -
      clamp(
        dot(n, viewDir),
        0.0,
        1.0
      ),
      3.0
    );

  /* -------------------------
     DEPTH
  ------------------------- */

  float edgeDistance =
    min(
      min(vUv.x, 1.0 - vUv.x),
      min(vUv.y, 1.0 - vUv.y)
    );

  float centre =
    smoothstep(
      0.02,
      0.32,
      edgeDistance
    );

  vec3 base =
    mix(
      uShallow,
      uDeep,
      centre * 0.48
    );

  /* -------------------------
     CAUSTICS
  ------------------------- */

  float c1 = sin(vWorldPos.x * 5.2 + uTime * 0.45) + sin(vWorldPos.z * 7.1 - uTime * 0.38);
  float c2 = sin(vWorldPos.x * 8.4 + vWorldPos.z * 5.8 - uTime * 0.56);
  float c3 = sin(vWorldPos.x * 12.0 - vWorldPos.z * 10.5 + uTime * 0.36);
  float caustic = smoothstep(1.2, 2.4, c1 * 0.72 + c2 * 0.42 + c3 * 0.22) * 0.28;

  vec3 col =
    base +
    uAqua *
    caustic *
    (0.7 + centre * 0.7);

  /* -------------------------
     WAVE TINT
  ------------------------- */

  col +=
    uAqua *
    clamp(
      vWave * 2.0,
      -0.1,
      0.18
    ) *
    0.16;

  /* -------------------------
     SKY REFLECTION
  ------------------------- */

  vec3 refl =
    mix(
      uSky,
      uWarmLight,
      uWarm
    );

  col =
    mix(
      col,
      refl,
      fres * 0.38
    );

  /* -------------------------
     SUN
  ------------------------- */

  vec3 lightDir =
    normalize(
      vec3(
        -0.45,
        0.78,
        0.35
      )
    );

  vec3 reflectedLight =
    reflect(
      -lightDir,
      n
    );

  float spec =
    pow(
      max(
        dot(
          reflectedLight,
          viewDir
        ),
        0.0
      ),
      180.0
    );

  float broadSpec =
    pow(
      max(
        dot(
          reflectedLight,
          viewDir
        ),
        0.0
      ),
      18.0
    );

  col +=
    vec3(
      1.0,
      0.96,
      0.84
    ) *
    (
      spec * 1.42 +
      broadSpec * 0.13
    );

  col *= uBright;

  gl_FragColor =
    vec4(
      toSRGB(
        aces(col)
      ),
      0.82
    );
}
`;

const c = (hex: string) => new THREE.Color(hex);

export function PoolWater({ width, length }: { width: number; length: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const p = EXPERIENCE_CONFIG.palette;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },

      uEnergy: {
        value: 0,
      },

      uWarm: {
        value: 0.1,
      },

      uBright: {
        value: 1,
      },

      uPointer: {
        value: new THREE.Vector2(),
      },

      uDeep: {
        value: c("#1596c2"),
      },

      uShallow: {
        value: c("#61d2ed"),
      },

      uAqua: {
        value: c("#b9f5ff"),
      },

      uSky: {
        value: c("#87d9f5"),
      },

      uWarmLight: {
        value: c("#fff5df"),
      },
    }),
    [],
  );

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const u = mat.current?.uniforms;
    if (!u) return;
    const reduce = scrollState.reducedMotion;
    u.uTime.value += dt * (reduce ? 0.45 : 1);
    u.uEnergy.value = damp(u.uEnergy.value, reduce ? 0 : scrollState.energy * 0.35, 3, dt);
    u.uPointer.value.set(scrollState.px, scrollState.py);
    const s = scrollState.smooth;
    u.uWarm.value = damp(u.uWarm.value, 0.12, 2.5, dt);
    u.uBright.value = damp(u.uBright.value, 0.85 + Math.min(s * 1.2, 1) * 0.18, 2, dt);
  });

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -0.055, 0]}>
      <planeGeometry args={[width, length, 100, 140]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}
