import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { scrollState, damp } from "./scrollStore";

/** A wide orbit that keeps the centered home legible from every side. */
const PATH = [
  new THREE.Vector3(14, 6.8, 15),
  new THREE.Vector3(18, 9, 7),
  new THREE.Vector3(7, 6.5, -16),
  new THREE.Vector3(-13.5, 10, -16),
  new THREE.Vector3(-19, 12, 4),
];

const TARGETS = [
  new THREE.Vector3(0, 4.15, 0.5),
  new THREE.Vector3(0, 4.85, 0.25),
  new THREE.Vector3(0, 3.85, 0),
  new THREE.Vector3(0, 4.9, 0),
  new THREE.Vector3(0, 4.65, 0.2),
];

export function CinematicCamera() {
  const camera = useThree((s) => s.camera);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(PATH, false, "catmullrom", 0.4), []);
  const targetCurve = useMemo(
    () => new THREE.CatmullRomCurve3(TARGETS, false, "catmullrom", 0.5),
    [],
  );

  const pos = useRef(new THREE.Vector3().copy(PATH[0]));
  const look = useRef(new THREE.Vector3().copy(TARGETS[0]));
  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());
  const intro = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const reduce = scrollState.reducedMotion;
    intro.current = Math.min(intro.current + dt / 3.2, 1);
    const introEase = 1 - Math.pow(1 - intro.current, 3);

    const t = scrollState.smooth;
    curve.getPoint(t, tmpPos.current);
    targetCurve.getPoint(t, tmpLook.current);

    // cinematic opening: start further out and lower, ease in
    tmpPos.current.multiplyScalar(1 + (1 - introEase) * 0.5);
    tmpPos.current.y += (1 - introEase) * -0.9;

    // restrained pointer parallax, like looking around a physical model
    const par = reduce ? 0.12 : 1;
    tmpPos.current.x += scrollState.px * 1.5 * par;
    tmpPos.current.y += -scrollState.py * 0.9 * par;
    tmpLook.current.x += scrollState.px * 0.8 * par;
    tmpLook.current.y += -scrollState.py * 0.5 * par;

    const lambda = reduce ? 6 : 2.1 + scrollState.energy * 1.6;
    pos.current.x = damp(pos.current.x, tmpPos.current.x, lambda, dt);
    pos.current.y = damp(pos.current.y, tmpPos.current.y, lambda, dt);
    pos.current.z = damp(pos.current.z, tmpPos.current.z, lambda, dt);
    look.current.x = damp(look.current.x, tmpLook.current.x, lambda * 0.85, dt);
    look.current.y = damp(look.current.y, tmpLook.current.y, lambda * 0.85, dt);
    look.current.z = damp(look.current.z, tmpLook.current.z, lambda * 0.85, dt);

    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });

  return null;
}
