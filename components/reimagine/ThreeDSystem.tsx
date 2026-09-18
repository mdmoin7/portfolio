"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const NODES = [
  [0, 1.72, 0.1], [1.48, 0.86, 0], [1.48, -0.86, 0.1], [0, -1.72, -0.1],
  [-1.48, -0.86, 0], [-1.48, 0.86, 0.1],
] as const;

function Connector({ from, to }: { from: readonly number[]; to: readonly number[] }) {
  const points: [number, number, number][] = [
    [from[0], from[1], from[2]],
    [to[0], to[1], to[2]],
  ];

  return <Line points={points} color="#7899D4" transparent opacity={0.24} lineWidth={1} />;
}

function CoreScene() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += delta * 0.1;
      group.current.rotation.x = Math.sin(t * 0.18) * 0.045;
    }
    if (ring.current) {
      ring.current.rotation.x += delta * 0.15;
      ring.current.rotation.z -= delta * 0.08;
    }
    if (inner.current) inner.current.rotation.y -= delta * 0.2;
    if (halo.current) {
      const scale = 1 + Math.sin(t * 0.7) * 0.045;
      halo.current.scale.setScalar(scale);
    }
  });

  const core = [0, 0, 0] as const;

  return (
    <group ref={group} rotation={[0.16, -0.35, 0]}>
      <mesh ref={halo} scale={1.5}>
        <icosahedronGeometry args={[1.05, 2]} />
        <meshBasicMaterial color="#7899D4" transparent opacity={0.035} side={THREE.BackSide} />
      </mesh>

      {NODES.map((node, i) => <Connector key={`connector-${i}`} from={core} to={node} />)}

      <mesh>
        <icosahedronGeometry args={[1.05, 3]} />
        <meshPhysicalMaterial color="#273469" roughness={0.12} metalness={0.62} transmission={0.28} thickness={0.8} transparent opacity={0.86} clearcoat={1} clearcoatRoughness={0.12} />
      </mesh>
      <mesh ref={inner} scale={0.68}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#FAFAFF" wireframe transparent opacity={0.62} />
      </mesh>

      <mesh rotation={[Math.PI / 2.7, 0.2, 0]} ref={ring}>
        <torusGeometry args={[1.48, 0.015, 12, 128]} />
        <meshBasicMaterial color="#FAFAFF" transparent opacity={0.78} />
      </mesh>
      <mesh rotation={[0.8, 0, 1.1]}>
        <torusGeometry args={[1.78, 0.009, 10, 128]} />
        <meshBasicMaterial color="#7899D4" transparent opacity={0.68} />
      </mesh>
      <mesh rotation={[1.35, 0.65, 0.25]}>
        <torusGeometry args={[2.05, 0.006, 8, 128]} />
        <meshBasicMaterial color="#FAFAFF" transparent opacity={0.28} />
      </mesh>

      {NODES.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[0.085, 24, 24]} />
            <meshPhysicalMaterial color="#FAFAFF" emissive="#7899D4" emissiveIntensity={1.8} roughness={0.12} metalness={0.25} />
          </mesh>
          <mesh scale={2.4}>
            <sphereGeometry args={[0.085, 16, 16]} />
            <meshBasicMaterial color="#7899D4" transparent opacity={0.11} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function ThreeDSystem() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const start = () => {
      if (!cancelled) setReady(true);
    };

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(start, { timeout: 900 });
      return () => {
        cancelled = true;
        window.cancelIdleCallback(idleId);
      };
    }

    const timeoutId = window.setTimeout(start, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="three-d-system" aria-hidden="true">
      {ready ? <Canvas camera={{ position: [0, 0, 5.7], fov: 34 }} dpr={[1, 1.35]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.75} />
        <pointLight position={[3.5, 3, 4]} intensity={18} color="#7899D4" />
        <pointLight position={[-3, -2, 2]} intensity={8} color="#FAFAFF" />
        <pointLight position={[0, 0, 5]} intensity={5} color="#273469" />
        <CoreScene />
      </Canvas> : <div className="three-d-system-placeholder" />}
    </div>
  );
}
