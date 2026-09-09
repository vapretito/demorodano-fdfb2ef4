import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { AtmosphericParticles } from "./AtmosphericParticles";
import { CinematicCamera } from "./CinematicCamera";
import { ContemporaryHome } from "./ContemporaryHome";
import { EXPERIENCE_CONFIG } from "./config";
import { PoolWater } from "./PoolWater";
import { damp, scrollState } from "./scrollStore";

export const POOL_W = 10;
export const POOL_L = 5.5;
// Temporary presentation mode: focus the experience on the home model.
// Set this back to true when the pool should return to the scene.
const SHOW_POOL = false;
const DEPTH = 1.45;
const COPING_W = 0.46;

function OptionalModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}
const linerMaterial = <meshStandardMaterial color="#78cce2" roughness={0.56} metalness={0.02} />;

function PoolShell() {
  const walls = [
    { position: [-POOL_W / 2, -DEPTH / 2, 0], size: [0.08, DEPTH, POOL_L] },
    { position: [POOL_W / 2, -DEPTH / 2, 0], size: [0.08, DEPTH, POOL_L] },
    { position: [0, -DEPTH / 2, -POOL_L / 2], size: [POOL_W, DEPTH, 0.08] },
    { position: [0, -DEPTH / 2, POOL_L / 2], size: [POOL_W, DEPTH, 0.08] },
  ];
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -DEPTH, 0]} receiveShadow>
        <planeGeometry args={[POOL_W, POOL_L]} />
        {linerMaterial}
      </mesh>
      {walls.map((wall, index) => (
        <mesh key={index} position={wall.position as [number, number, number]} receiveShadow>
          <boxGeometry args={wall.size as [number, number, number]} />
          {linerMaterial}
        </mesh>
      ))}
    </group>
  );
}
function PoolSteps() {
  return (
    <group>
      {[0, 1, 2].map((index) => {
        const height = 0.24 + index * 0.28;
        return (
          <mesh
            key={index}
            position={[0, -height / 2, -POOL_L / 2 + 0.52 * (index + 0.5)]}
            receiveShadow
          >
            <boxGeometry args={[7.5 - index * 0.35, height, 0.55]} />
            <meshStandardMaterial color={index === 0 ? "#9adced" : "#86d2e6"} roughness={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}
function PoolCoping() {
  const stone = <meshStandardMaterial color="#e8dfcf" roughness={0.88} metalness={0.01} />;
  const pieces = [
    {
      position: [0, 0.03, -(POOL_L / 2 + COPING_W / 2)],
      size: [POOL_W + COPING_W * 2, 0.16, COPING_W],
    },
    {
      position: [0, 0.03, POOL_L / 2 + COPING_W / 2],
      size: [POOL_W + COPING_W * 2, 0.16, COPING_W],
    },
    { position: [-(POOL_W / 2 + COPING_W / 2), 0.03, 0], size: [COPING_W, 0.16, POOL_L] },
    { position: [POOL_W / 2 + COPING_W / 2, 0.03, 0], size: [COPING_W, 0.16, POOL_L] },
  ];
  return (
    <>
      {pieces.map((piece, index) => (
        <mesh
          key={index}
          position={piece.position as [number, number, number]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={piece.size as [number, number, number]} />
          {stone}
        </mesh>
      ))}
    </>
  );
}
function Shrub({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      {Array.from({ length: 5 }).map((_, index) => {
        const angle = (index / 5) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.28, 0.42, Math.sin(angle) * 0.22]}
            rotation-z={Math.cos(angle) * 0.32}
            castShadow
          >
            <capsuleGeometry args={[0.09, 0.55, 4, 8]} />
            <meshStandardMaterial color={index % 2 ? "#526c45" : "#3f5c3d"} roughness={0.92} />
          </mesh>
        );
      })}
    </group>
  );
}
function PrivacyFence() {
  return (
    <group position={[0, 0, -5.15]}>
      {Array.from({ length: 11 }).map((_, index) => (
        <mesh key={index} position={[0, 0.32 + index * 0.27, 0]} castShadow receiveShadow>
          <boxGeometry args={[17.5, 0.18, 0.12]} />
          <meshStandardMaterial color={index % 2 ? "#292d2c" : "#242827"} roughness={0.86} />
        </mesh>
      ))}
      {[-8.55, -5.7, -2.85, 0, 2.85, 5.7, 8.55].map((x) => (
        <mesh key={x} position={[x, 1.55, 0.05]} castShadow>
          <boxGeometry args={[0.13, 3.2, 0.2]} />
          <meshStandardMaterial color="#191d1d" roughness={0.8} />
        </mesh>
      ))}
      {[-7, -4.8, -2.6, -0.4, 1.8, 4, 6.3].map((x, index) => (
        <Shrub key={x} position={[x, 0, 0.38]} scale={0.78 + (index % 2) * 0.12} />
      ))}
    </group>
  );
}
function Planter() {
  return (
    <group position={[-5.9, 0, 3.25]}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.48, 0.58, 0.76, 8]} />
        <meshStandardMaterial color="#303535" roughness={0.72} />
      </mesh>
      {Array.from({ length: 7 }).map((_, index) => {
        const angle = (index / 7) * Math.PI * 2;
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.18, 1.05, Math.sin(angle) * 0.18]}
            rotation-z={Math.cos(angle) * 0.3}
            castShadow
          >
            <capsuleGeometry args={[0.045, 0.8, 4, 7]} />
            <meshStandardMaterial color="#526b42" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}
function ProceduralPool() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.09, 0]} receiveShadow>
        <planeGeometry args={[25, 18]} />
        <meshStandardMaterial color="#5f8a42" roughness={1} />
      </mesh>
      <PoolShell />
      <PoolSteps />
      <PoolCoping />
      <PrivacyFence />
      <Planter />
      <Shrub position={[5.9, 0, 3.3]} scale={1.05} />
    </group>
  );
}
function CinematicLighting() {
  const sun = useRef<THREE.DirectionalLight>(null);
  const fill = useRef<THREE.AmbientLight>(null);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const reveal = Math.min(scrollState.smooth * 6, 1);
    if (sun.current)
      sun.current.intensity = damp(sun.current.intensity, 1.55 + reveal * 0.45, 2, dt);
    if (fill.current)
      fill.current.intensity = damp(fill.current.intensity, 0.55 + reveal * 0.12, 2, dt);
  });
  return (
    <>
      <ambientLight ref={fill} intensity={0.55} color="#d9efff" />
      <hemisphereLight args={["#bfe7ff", "#6d8358", 0.48]} />
      <directionalLight
        ref={sun}
        position={[-10, 16, 10]}
        intensity={1.6}
        color="#fff4df"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0004}
      />
      <Environment resolution={128}>
        <Lightformer
          intensity={1.15}
          position={[0, 9, 2]}
          scale={[16, 12, 1]}
          rotation-x={Math.PI / 2}
          color="#b9e7ff"
        />
        <Lightformer intensity={0.35} position={[0, 4, -7]} scale={[14, 3, 1]} color="#fff5df" />
      </Environment>
    </>
  );
}

/** Daylight changes subtly through the construction story rather than staying flat blue. */
function DynamicBackdrop() {
  const scene = useThree((state) => state.scene);
  const fog = useRef<THREE.FogExp2>(null);
  const background = useMemo(() => new THREE.Color("#d6e7eb"), []);
  const target = useMemo(() => new THREE.Color(), []);
  const palette = useMemo(
    () => [
      new THREE.Color("#d6e7eb"), // architectural morning blue
      new THREE.Color("#e7dfd2"), // warm plaster and stone
      new THREE.Color("#b8c7c2"), // concrete and landscape
      new THREE.Color("#344447"), // graphite finish
    ],
    [],
  );

  useFrame((_, delta) => {
    const progress = Math.min(Math.max(scrollState.smooth, 0), 1);
    const stage = Math.min(Math.floor(progress * 3), 2);
    const local = (progress - stage / 3) * 3;
    target.copy(palette[stage]).lerp(palette[stage + 1], local);
    background.lerp(target, 1 - Math.exp(-Math.min(delta, 0.05) * 1.4));
    scene.background = background;
    if (fog.current) fog.current.color.copy(background);
  });

  return <fogExp2 ref={fog} args={["#d6e7eb", 0.012]} />;
}

export function PoolScene() {
  const modelUrl = EXPERIENCE_CONFIG.model.url;
  return (
    <>
      <DynamicBackdrop />
      <CinematicLighting />
      <CinematicCamera />
      {modelUrl ? (
        <Suspense fallback={null}>
          <OptionalModel url={modelUrl} />
        </Suspense>
      ) : SHOW_POOL ? (
        <ProceduralPool />
      ) : null}
      {!modelUrl && <ContemporaryHome />}
      {SHOW_POOL && <PoolWater width={POOL_W} length={POOL_L} />}
      <AtmosphericParticles />
    </>
  );
}
