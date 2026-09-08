import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState } from "./scrollStore";

export function AtmosphericParticles({ count = 210 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);

  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sp = new Float32Array(count);
    const cool = new THREE.Color("#82e4df");
    const warm = new THREE.Color("#e8c9a2");
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 44;
      positions[i * 3 + 1] = Math.random() * 9 + 0.15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 52;
      const col = Math.random() > 0.5 ? cool : warm;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
      sp[i] = 0.06 + Math.random() * 0.16;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return { geometry: g, speeds: sp };
  }, [count]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const g = points.current?.geometry as THREE.BufferGeometry | undefined;
    if (!g) return;
    const arr = g.attributes.position.array as Float32Array;
    const turb = 1 + scrollState.energy * 2.2;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 1] += speeds[i] * dt * turb;
      arr[i3] += Math.sin(t * 0.3 + i) * 0.004 * turb;
      if (arr[i3 + 1] > 9.5) arr[i3 + 1] = 0.15;
    }
    g.attributes.position.needsUpdate = true;
    if (mat.current) mat.current.opacity = 0.1 + Math.min(scrollState.smooth * 3, 1) * 0.16;
  });

  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        ref={mat}
        size={0.055}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.12}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
