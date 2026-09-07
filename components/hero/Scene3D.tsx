"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/motion";

const pillarColors = ["#2454d8", "#58a6ff", "#7aa2ff", "#173eae", "#4f7dff"];

function Particles({ count = 800 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>(
    (() => {
      const arr = new Float32Array(count * 3);
      for (let i = 0; i < count; i += 1) {
        arr[i * 3] = (Math.random() - 0.5) * 14;
        arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
      return arr;
    })(),
  );

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.05;
  });

  return (
    <Points ref={ref} positions={positions.current} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#7aa2ff"
        size={0.035}
        sizeAttenuation
        depthWrite={false}
        opacity={0.75}
      />
    </Points>
  );
}

function CoreShape({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.18 + mouse.current.y * 0.25;
      meshRef.current.rotation.y = t * 0.24 + mouse.current.x * 0.35;
    }

    orbitRefs.current.forEach((node, index) => {
      if (!node) return;
      const angle = t * 0.55 + (index / pillarColors.length) * Math.PI * 2;
      const radius = 2.2 + index * 0.08;
      node.position.x = Math.cos(angle) * radius;
      node.position.z = Math.sin(angle) * radius;
      node.position.y = Math.sin(t * 0.8 + index) * 0.35;
      node.rotation.x += 0.02;
      node.rotation.y += 0.03;
    });
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color="#2454d8"
          wireframe
          emissive="#173eae"
          emissiveIntensity={0.35}
        />
      </mesh>
      {pillarColors.map((color, index) => (
        <mesh
          key={color}
          ref={(node) => {
            orbitRefs.current[index] = node;
          }}
        >
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function SceneContent({
  mouse,
  reducedMotion,
}: {
  mouse: React.MutableRefObject<{ x: number; y: number }>;
  reducedMotion: boolean;
}) {
  useFrame((state) => {
    if (reducedMotion) return;
    const targetX = mouse.current.x * 0.45;
    const targetY = mouse.current.y * 0.25;
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 0.05);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 0.05);
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.55} />
      <pointLight position={[4, 4, 4]} intensity={1.2} color="#58a6ff" />
      <pointLight position={[-4, -2, -3]} intensity={0.6} color="#2454d8" />
      <Particles count={reducedMotion ? 200 : 800} />
      <CoreShape mouse={mouse} />
    </>
  );
}

function TerminalFallback() {
  return (
    <div className="card-surface overflow-hidden bg-[#0d1117] text-[#d8dee9]">
      <div className="flex h-9 items-center gap-2 border-b border-[#30363d] bg-[#161b22] px-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto font-mono text-[11px] text-[#8b949e]">~/moin-terminal</span>
      </div>
      <div className="space-y-2 p-5 font-mono text-xs leading-relaxed">
        <p>
          <span className="font-bold text-[#58a6ff]">moin@portfolio:~$</span> Building products.
          Teaching engineers.
        </p>
        <p>
          <span className="font-bold text-[#58a6ff]">moin@portfolio:~$</span> Always learning.
        </p>
      </div>
    </div>
  );
}

export function Scene3D() {
  const reducedMotion = useReducedMotion();
  const mouse = useRef({ x: 0, y: 0 });
  const [canRenderWebGL, setCanRenderWebGL] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setCanRenderWebGL(false);
      return;
    }
    try {
      const canvas = document.createElement("canvas");
      setCanRenderWebGL(!!canvas.getContext("webgl"));
    } catch {
      setCanRenderWebGL(false);
    }
  }, [reducedMotion]);

  if (!canRenderWebGL) {
    return <TerminalFallback />;
  }

  return (
    <div className="relative h-[420px] w-full overflow-hidden rounded-[18px] border border-white/10 bg-[#0d1117] shadow-[0_24px_60px_-34px_rgba(13,17,23,0.85)]">
      <Canvas
        aria-hidden="true"
        camera={{ position: [0, 0, 6], fov: 45 }}
        dpr={[1, 1.75]}
        onPointerMove={(event) => {
          if (window.innerWidth < 768) return;
          mouse.current.x = (event.clientX / window.innerWidth - 0.5) * 1.6;
          mouse.current.y = -(event.clientY / window.innerHeight - 0.5) * 1;
        }}
      >
        <SceneContent mouse={mouse} reducedMotion={reducedMotion} />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0d1117] to-transparent" />
    </div>
  );
}
