"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function createSpherePositions(count: number, radius: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * (0.45 + Math.random() * 0.55);
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

function ParticleShell({
  count,
  radius,
  color,
  size,
  opacity,
  speed = 1,
}: {
  count: number;
  radius: number;
  color: string;
  size: number;
  opacity: number;
  speed?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef(createSpherePositions(count, radius));

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed;
    ref.current.rotation.y = t * 0.035;
    ref.current.rotation.x = Math.sin(t * 0.12) * 0.1;
    ref.current.rotation.z = Math.cos(t * 0.08) * 0.04;
  });

  return (
    <Points ref={ref} positions={positions.current} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        opacity={opacity}
      />
    </Points>
  );
}

function InnerScene({
  mouse,
  intensity,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  intensity: "intro" | "hero";
}) {
  const isIntro = intensity === "intro";

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const parallax = isIntro ? 0.85 : 0.55;
    const dolly = isIntro ? 0.35 : 0.2;

    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      mouse.current.x * parallax,
      0.035,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      mouse.current.y * (parallax * 0.65),
      0.035,
    );
    state.camera.position.z = THREE.MathUtils.lerp(
      state.camera.position.z,
      9 + Math.sin(t * 0.22) * dolly,
      0.025,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <fog attach="fog" args={["#050b16", isIntro ? 7 : 8, isIntro ? 16 : 18]} />
      <ambientLight intensity={0.28} />
      <pointLight position={[4, 3, 2]} intensity={isIntro ? 1.35 : 1.05} color="#2454d8" />
      <pointLight position={[-4, -2, 3]} intensity={isIntro ? 0.75 : 0.45} color="#c9a227" />
      <pointLight position={[0, -3, -2]} intensity={0.25} color="#58a6ff" />
      <ParticleShell
        count={isIntro ? 1600 : 1200}
        radius={isIntro ? 6.2 : 5.5}
        color="#58a6ff"
        size={isIntro ? 0.032 : 0.028}
        opacity={0.82}
        speed={0.9}
      />
      <ParticleShell
        count={isIntro ? 520 : 400}
        radius={isIntro ? 3.6 : 3.2}
        color="#c9a227"
        size={isIntro ? 0.022 : 0.018}
        opacity={0.55}
        speed={1.35}
      />
      <ParticleShell
        count={220}
        radius={2.1}
        color="#2454d8"
        size={0.014}
        opacity={0.35}
        speed={1.8}
      />
    </>
  );
}

export function ParticleScene({
  className,
  interactive = true,
  intensity = "hero",
}: {
  className?: string;
  interactive?: boolean;
  intensity?: "intro" | "hero";
}) {
  const mouse = useRef({ x: 0, y: 0 });

  return (
    <div className={className}>
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0, 9], fov: intensity === "intro" ? 48 : 50 }}
        dpr={[1, 2]}
        onPointerMove={
          interactive
            ? (event) => {
                mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 1.6;
                mouse.current.y = -(event.clientY / window.innerHeight - 0.5) * 1.05;
              }
            : undefined
        }
      >
        <InnerScene mouse={mouse} intensity={intensity} />
      </Canvas>
    </div>
  );
}
