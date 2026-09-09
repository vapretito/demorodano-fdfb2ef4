import * as THREE from "three";

const white = <meshStandardMaterial color="#ebe9e3" roughness={0.78} />;
const charcoal = <meshStandardMaterial color="#202727" roughness={0.5} metalness={0.32} />;
const glass = <meshStandardMaterial color="#172a31" roughness={0.14} metalness={0.36} />;
const stone = <meshStandardMaterial color="#a79b88" roughness={0.92} />;
const concrete = <meshStandardMaterial color="#c7c2b8" roughness={0.9} />;

function Block({
  position,
  size,
  material = white,
}: {
  position: [number, number, number];
  size: [number, number, number];
  material?: React.ReactNode;
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      {material}
    </mesh>
  );
}

function Window({ position, size }: { position: [number, number, number]; size: [number, number] }) {
  return (
    <group position={position}>
      <Block position={[0, 0, 0]} size={[size[0] + 0.14, size[1] + 0.14, 0.11]} material={charcoal} />
      <Block position={[0, 0, 0.07]} size={[size[0], size[1], 0.04]} material={glass} />
      <Block position={[0, 0, 0.11]} size={[0.055, size[1], 0.025]} material={charcoal} />
    </group>
  );
}

function StoneCladding({ x }: { x: number }) {
  return (
    <group position={[x, 3.35, 0.13]}>
      <Block position={[0, 0, 0]} size={[1.48, 5.7, 0.24]} material={stone} />
      {Array.from({ length: 36 }).map((_, index) => (
        <Block
          key={index}
          position={[((index % 4) - 1.5) * 0.32 + (Math.floor(index / 4) % 2) * 0.07, -2.48 + Math.floor(index / 4) * 0.56, 0.14]}
          size={[0.27, 0.04, 0.025]}
          material={concrete}
        />
      ))}
    </group>
  );
}

function Pergola({ x }: { x: number }) {
  return (
    <group position={[x, 2.25, 1.25]}>
      <Block position={[0, 0, 0]} size={[3.8, 0.12, 1.9]} material={charcoal} />
      {[-1.75, -0.9, 0, 0.9, 1.75].map((beam) => (
        <Block key={beam} position={[beam, 0.12, 0]} size={[0.08, 0.1, 2.05]} material={charcoal} />
      ))}
      {[-1.7, 1.7].map((post) => (
        <Block key={post} position={[post, -1.12, 0.76]} size={[0.1, 2.25, 0.1]} material={charcoal} />
      ))}
    </group>
  );
}

function StoneFeatureWall() {
  const rocks = Array.from({ length: 42 }, (_, index) => {
    const row = Math.floor(index / 6);
    const column = index % 6;
    const width = 0.38 + ((index * 7) % 3) * 0.08;
    const height = 0.18 + ((index * 11) % 3) * 0.05;
    return {
      position: [-5.45 + column * 0.42 + (row % 2) * 0.16, 0.12 + row * 0.24, 2.84 + ((index * 3) % 2) * 0.04] as [number, number, number],
      width,
      height,
    };
  });
  return (
    <group>
      <Block position={[-4.35, 0.7, 2.72]} size={[3.1, 1.4, 0.26]} material={stone} />
      {rocks.map((rock, index) => (
        <Block
          key={index}
          position={rock.position}
          size={[rock.width, rock.height, 0.12]}
          material={<meshStandardMaterial color={index % 3 ? "#a99b86" : "#8e816f"} roughness={0.96} />}
        />
      ))}
    </group>
  );
}

function RoofRailing({ x, y, width }: { x: number; y: number; width: number }) {
  return (
    <group position={[x, y, -0.92]}>
      <Block position={[0, 0, 0]} size={[width, 0.08, 0.08]} material={charcoal} />
      {Array.from({ length: 11 }).map((_, index) => (
        <Block key={index} position={[-width / 2 + index * (width / 10), -0.42, 0]} size={[0.045, 0.85, 0.045]} material={charcoal} />
      ))}
    </group>
  );
}

function PlantCluster({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 8) * Math.PI * 2;
        return (
          <mesh key={index} position={[Math.cos(angle) * 0.25, 0.42, Math.sin(angle) * 0.18]} rotation-z={Math.cos(angle) * 0.25} castShadow>
            <capsuleGeometry args={[0.045, 0.64 + (index % 3) * 0.12, 4, 7]} />
            <meshStandardMaterial color={index % 2 ? "#415a3b" : "#627148"} roughness={0.94} />
          </mesh>
        );
      })}
    </group>
  );
}

/** A color architectural model inspired by the supplied contemporary duplex reference. */
export function ContemporaryHome() {
  return (
    <group position={[0, 0, 0]} scale={1.48}>
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.12, 0]} receiveShadow>
        <planeGeometry args={[34, 30]} />
        <meshStandardMaterial color="#777d72" roughness={1} />
      </mesh>
      {/* The two stepped, narrow facades follow the reference duplex volumes. */}
      <Block position={[0, 3.2, 0]} size={[11.8, 6.4, 1.15]} />
      {/* blank lateral volumes match the tall, stepped side elevations in the reference */}
      <Block position={[-5.05, 3.85, -0.38]} size={[1.5, 7.7, 1.7]} />
      <Block position={[-3.9, 4.2, -0.28]} size={[1.05, 8.4, 1.45]} />
      <Block position={[4.85, 3.8, -0.32]} size={[1.85, 7.6, 1.6]} />
      <Block position={[1.42, 4.35, 0.32]} size={[1.18, 7.15, 0.52]} />
      <Block position={[-1.42, 4.35, 0.32]} size={[1.18, 7.15, 0.52]} />

      <StoneCladding x={-2.85} />
      <StoneCladding x={2.85} />

      <Window position={[-4.35, 4.7, 0.84]} size={[0.58, 2.05]} />
      <Window position={[-2.85, 4.55, 0.84]} size={[0.48, 1.55]} />
      <Window position={[-1.42, 4.45, 0.84]} size={[0.54, 1.92]} />
      <Window position={[1.42, 4.45, 0.84]} size={[0.54, 1.92]} />
      <Window position={[2.85, 4.55, 0.84]} size={[0.48, 1.55]} />
      <Window position={[4.35, 4.7, 0.84]} size={[0.58, 2.05]} />
      <Window position={[-4.3, 1.35, 0.84]} size={[1.65, 0.58]} />
      <Window position={[4.3, 1.35, 0.84]} size={[1.65, 0.58]} />

      {/* parapets and roof terraces stop the roof from reading as a flat slab */}
      <Block position={[-4.2, 8.42, -0.28]} size={[2.95, 0.18, 1.5]} />
      <Block position={[4.45, 7.72, -0.22]} size={[2.85, 0.18, 1.6]} />
      <RoofRailing x={-4.2} y={8.9} width={2.65} />
      <RoofRailing x={4.45} y={8.2} width={2.55} />

      {/* recessed entries and warm timber-like door planes */}
      <Block position={[-1.35, 1.1, 0.66]} size={[0.78, 2.2, 0.09]} material={charcoal} />
      <Block position={[1.35, 1.1, 0.66]} size={[0.78, 2.2, 0.09]} material={charcoal} />
      <Block position={[-1.35, 1.1, 0.73]} size={[0.5, 1.96, 0.035]} material={<meshStandardMaterial color="#76533a" roughness={0.72} />} />
      <Block position={[1.35, 1.1, 0.73]} size={[0.5, 1.96, 0.035]} material={<meshStandardMaterial color="#76533a" roughness={0.72} />} />

      <Pergola x={-4.25} />
      <Pergola x={4.25} />
      <Block position={[0, 0.1, 1.15]} size={[13.4, 0.2, 3.35]} material={concrete} />

      {/* a low boundary wall keeps the architectural setting connected to the pool */}
      <Block position={[0, 0.55, 2.6]} size={[12.5, 1.1, 0.22]} material={white} />
      {[-5.25, 5.25].map((x) => (
        <Block key={x} position={[x, 1.25, 2.6]} size={[0.18, 2.5, 0.22]} material={charcoal} />
      ))}
      <StoneFeatureWall />
      <PlantCluster position={[-2.55, 0, 2.55]} />
      <PlantCluster position={[0.15, 0, 2.55]} />
      <PlantCluster position={[5.3, 0, 2.55]} />
    </group>
  );
}
