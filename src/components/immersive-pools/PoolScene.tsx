import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { PoolWater } from "./PoolWater";
import { AtmosphericParticles } from "./AtmosphericParticles";
import { CinematicCamera } from "./CinematicCamera";
import { EXPERIENCE_CONFIG } from "./config";
import { scrollState, damp } from "./scrollStore";

const POOL_W = 9;
const POOL_L = 20;
const DEPTH = 1.6;

function OptionalModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

function Lounger({ position, rotation }: { position: [number, number, number]; rotation: number }) {
  return (
    <group position={position} rotation-y={rotation}>
      <mesh position={[0, 0.34, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.78, 0.1, 2.0]} />
        <meshStandardMaterial color="#cfc7b8" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.62, -0.78]} rotation-x={-0.55} castShadow>
        <boxGeometry args={[0.78, 0.1, 0.9]} />
        <meshStandardMaterial color="#cfc7b8" roughness={0.75} />
      </mesh>
      {[-0.3, 0.3].map((x) =>
        [-0.8, 0.8].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 0.15, z]} castShadow>
            <boxGeometry args={[0.05, 0.3, 0.05]} />
            <meshStandardMaterial color="#3a3a38" roughness={0.5} metalness={0.3} />
          </mesh>
        )),
      )}
    </group>
  );
}

function Planting({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.56, 1.5]} />
        <meshStandardMaterial color="#c9c1b2" roughness={0.9} />
      </mesh>
      {Array.from({ length: 7 }).map((_, i) => {
        const a = (i / 7) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 0.35, 0.95, Math.sin(a) * 0.35]}
            rotation-z={Math.cos(a) * 0.25}
            castShadow
          >
            <capsuleGeometry args={[0.06, 0.85, 4, 8]} />
            <meshStandardMaterial color="#3d5c4a" roughness={0.85} />
          </mesh>
        );
      })}
    </group>
  );
}

function ProceduralPool() {
  const stone = "#d8d1c5";
  const liner = "#0e5f70";
  return (
    <group>
      {/* deck */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[70, 90]} />
        <meshStandardMaterial color={stone} roughness={0.95} />
      </mesh>
      {/* pool basin: four inner walls + floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -DEPTH, 0]} receiveShadow>
        <planeGeometry args={[POOL_W, POOL_L]} />
        <meshStandardMaterial color={liner} roughness={0.35} />
      </mesh>
      {[
        { p: [-POOL_W / 2, -DEPTH / 2, 0], r: [0, Math.PI / 2, 0], s: [POOL_L, DEPTH] },
        { p: [POOL_W / 2, -DEPTH / 2, 0], r: [0, -Math.PI / 2, 0], s: [POOL_L, DEPTH] },
        { p: [0, -DEPTH / 2, -POOL_L / 2], r: [0, 0, 0], s: [POOL_W, DEPTH] },
        { p: [0, -DEPTH / 2, POOL_L / 2], r: [0, Math.PI, 0], s: [POOL_W, DEPTH] },
      ].map((w, i) => (
        <mesh
          key={i}
          position={w.p as [number, number, number]}
          rotation={w.r as [number, number, number]}
          receiveShadow
        >
          <planeGeometry args={w.s as [number, number]} />
          <meshStandardMaterial color={liner} roughness={0.35} side={THREE.BackSide} />
        </mesh>
      ))}
      {/* coping edge */}
      {[
        { p: [-(POOL_W / 2 + 0.25), 0.06, 0], s: [0.5, 0.12, POOL_L + 1] },
        { p: [POOL_W / 2 + 0.25, 0.06, 0], s: [0.5, 0.12, POOL_L + 1] },
        { p: [0, 0.06, -(POOL_L / 2 + 0.25)], s: [POOL_W, 0.12, 0.5] },
        { p: [0, 0.06, POOL_L / 2 + 0.25], s: [POOL_W, 0.12, 0.5] },
      ].map((e, i) => (
        <mesh key={i} position={e.p as [number, number, number]} castShadow receiveShadow>
          <boxGeometry args={e.s as [number, number, number]} />
          <meshStandardMaterial color="#e2dbcf" roughness={0.85} />
        </mesh>
      ))}

      {/* house volume: slab + wall + columns */}
      <group position={[-14, 0, 2]}>
        <mesh position={[0, 3.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[12, 0.42, 22]} />
          <meshStandardMaterial color="#cdc6b8" roughness={0.9} />
        </mesh>
        <mesh position={[-4.2, 1.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 3.3, 22]} />
          <meshStandardMaterial color="#d5cec1" roughness={0.92} />
        </mesh>
        {[-8, -2, 4, 9.5].map((z) => (
          <mesh key={z} position={[4.6, 1.65, z]} castShadow>
            <boxGeometry args={[0.22, 3.3, 0.22]} />
            <meshStandardMaterial color="#2f3130" roughness={0.5} metalness={0.35} />
          </mesh>
        ))}
      </group>

      {/* low garden wall opposite the house */}
      <mesh position={[15, 0.8, -1]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 1.6, 26]} />
        <meshStandardMaterial color="#cfc7b8" roughness={0.95} />
      </mesh>

      <Lounger position={[-7.6, 0, -3.4]} rotation={Math.PI / 2} />
      <Lounger position={[-7.6, 0, -0.6]} rotation={Math.PI / 2} />
      <Planting position={[9.5, 0, -7.5]} />
      <Planting position={[10.5, 0, 5.5]} scale={1.25} />
      <Planting position={[-8.5, 0, 9]} scale={0.9} />
    </group>
  );
}

function CinematicLighting() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const cool = useRef<THREE.PointLight>(null);
  const amb = useRef<THREE.AmbientLight>(null);
  const rim = useRef<THREE.DirectionalLight>(null);
  const sunColor = useRef(new THREE.Color("#3b5c6b"));
  const warm = new THREE.Color("#ffbb70");
  const dawn = new THREE.Color("#4a6f80");

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = scrollState.smooth;
    const reveal = Math.min(s * 6, 1); // opening fade-in
    const warmth = Math.pow(s, 1.3);
    if (sun.current) {
      sun.current.intensity = damp(sun.current.intensity, 0.25 + reveal * (0.6 + warmth * 1.5), 2, dt);
      sunColor.current.lerpColors(dawn, warm, warmth);
      sun.current.color.copy(sunColor.current);
      sun.current.position.set(-18 + warmth * 46, 22 - warmth * 15, 14 - warmth * 30);
    }
    if (amb.current) amb.current.intensity = damp(amb.current.intensity, 0.06 + reveal * 0.28, 2, dt);
    if (cool.current) cool.current.intensity = damp(cool.current.intensity, 1.2 + (1 - warmth) * 2.4, 2, dt);
    if (rim.current) rim.current.intensity = damp(rim.current.intensity, 0.25 + warmth * 0.5, 2, dt);
  });

  return (
    <>
      <ambientLight ref={amb} intensity={0.05} color="#9fc6cf" />
      <directionalLight
        ref={sun}
        position={[-18, 22, 14]}
        intensity={0.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-32}
        shadow-camera-right={32}
        shadow-camera-top={32}
        shadow-camera-bottom={-32}
        shadow-bias={-0.0004}
      />
      <pointLight ref={cool} position={[0, 1.2, 0]} distance={26} decay={1.6} color="#19c2bb" intensity={1.4} />
      <directionalLight ref={rim} position={[6, 4, -22]} intensity={0.3} color="#82e4df" />
      <Environment resolution={256}>
        <Lightformer intensity={1.4} position={[0, 8, 0]} scale={[18, 18, 1]} rotation-x={Math.PI / 2} color="#8fb6c2" />
        <Lightformer intensity={0.7} position={[-10, 3, 6]} rotation-y={Math.PI / 2} scale={[24, 4, 1]} color="#d8d1c5" />
        <Lightformer intensity={0.6} position={[12, 2, -6]} rotation-y={-Math.PI / 2} scale={[24, 3, 1]} color="#0b7084" />
      </Environment>
    </>
  );
}

export function PoolScene() {
  const modelUrl = EXPERIENCE_CONFIG.model.url;
  return (
    <>
      <color attach="background" args={[EXPERIENCE_CONFIG.palette.background]} />
      <fogExp2 attach="fog" args={[EXPERIENCE_CONFIG.palette.deepBlue, 0.016]} />
      <CinematicLighting />
      <CinematicCamera />
      {modelUrl ? (
        <Suspense fallback={null}>
          <OptionalModel url={modelUrl} />
        </Suspense>
      ) : (
        <ProceduralPool />
      )}
      <PoolWater width={POOL_W} length={POOL_L} />
      <AtmosphericParticles />
    </>
  );
}
