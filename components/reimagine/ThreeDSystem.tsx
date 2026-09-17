"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function CoreScene() {
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
    if (ring.current) {
      ring.current.rotation.x += delta * 0.16;
      ring.current.rotation.z -= delta * 0.09;
    }
    if (inner.current) inner.current.rotation.y -= delta * 0.22;
  });

  const nodes = [
    [0, 1.65, 0], [1.35, .82, 0], [1.35, -.82, 0], [0, -1.65, 0],
    [-1.35, -.82, 0], [-1.35, .82, 0],
  ] as const;

  return (
    <group ref={group} rotation={[0.2, -0.4, 0]}>
      <mesh>
        <icosahedronGeometry args={[1.05, 3]} />
        <meshPhysicalMaterial color="#7899D4" roughness={0.16} metalness={0.55} transmission={0.18} thickness={0.7} transparent opacity={0.78} />
      </mesh>
      <mesh ref={inner} scale={0.62}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial color="#FAFAFF" wireframe transparent opacity={0.55} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.7, 0.2, 0]}>
        <torusGeometry args={[1.48, 0.012, 12, 96]} />
        <meshBasicMaterial color="#FAFAFF" transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[0.8, 0, 1.1]}>
        <torusGeometry args={[1.78, 0.008, 10, 96]} />
        <meshBasicMaterial color="#7899D4" transparent opacity={0.55} />
      </mesh>
      {nodes.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh>
            <sphereGeometry args={[0.095, 20, 20]} />
            <meshBasicMaterial color="#FAFAFF" />
          </mesh>
          <mesh scale={1.8}>
            <sphereGeometry args={[0.095, 16, 16]} />
            <meshBasicMaterial color="#7899D4" transparent opacity={0.12} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export function ThreeDSystem() {
  return (
    <div className="three-d-system" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5.4], fov: 35 }} dpr={[1, 1.6]} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={1.4} />
        <pointLight position={[3, 3, 4]} intensity={12} color="#7899D4" />
        <pointLight position={[-3, -2, 2]} intensity={7} color="#FAFAFF" />
        <CoreScene />
      </Canvas>
    </div>
  );
}
