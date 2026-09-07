"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleConstellation({
  count = 1200,
  radius = 5,
}: {
  count?: number;
  radius?: number;
}) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>(
    (() => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = radius * (0.55 + Math.random() * 0.55);
        arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        arr[i * 3 + 2] = r * Math.cos(phi);
      }
      return arr;
    })(),
  );

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.04;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.08;
  });

  return (
    <Points ref={ref} positions={positions.current} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#58a6ff"
        size={0.028}
        sizeAttenuation
        depthWrite={false}
        opacity={0.85}
      />
    </Points>
  );
}

function InnerScene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  useFrame((state) => {
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      mouse.current.x * 0.6,
      0.04,
    );
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      mouse.current.y * 0.35,
      0.04,
    );
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1.1} color="#2454d8" />
      <pointLight position={[-3, -2, 2]} intensity={0.5} color="#c9a227" />
      <ParticleConstellation count={1200} radius={5.5} />
      <ParticleConstellation count={400} radius={3.2} />
    </>
  );
}

export function ParticleScene({
  className,
  interactive = true,
}: {
  className?: string;
  interactive?: boolean;
}) {
  const mouse = useRef({ x: 0, y: 0 });

  return (
    <div className={className}>
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0, 9], fov: 50 }}
        dpr={[1, 2]}
        onPointerMove={
          interactive
            ? (event) => {
                mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 1.4;
                mouse.current.y = -(event.clientY / window.innerHeight - 0.5) * 0.9;
              }
            : undefined
        }
      >
        <InnerScene mouse={mouse} />
      </Canvas>
    </div>
  );
}
