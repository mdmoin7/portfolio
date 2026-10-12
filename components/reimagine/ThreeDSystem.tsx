"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";

const NODES = [
  [0, 1.72, 0.1], [1.48, 0.86, 0], [1.48, -0.86, 0.1], [0, -1.72, -0.1],
  [-1.48, -0.86, 0], [-1.48, 0.86, 0.1],
] as const;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/* Seeded PRNG so the particle layout is identical on every render (and every
   visit) instead of calling Math.random during render. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Connector({ from, to }: { from: readonly number[]; to: readonly number[] }) {
  const points: [number, number, number][] = [
    [from[0], from[1], from[2]],
    [to[0], to[1], to[2]],
  ];

  return <Line points={points} color="#7899D4" transparent opacity={0.24} lineWidth={1} />;
}

/** Ambient dust shell so the scene reads as depth, not a sticker. */
function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  const material = useRef<THREE.PointsMaterial>(null);

  const positions = useMemo(() => {
    const random = mulberry32(0x5eed1a);
    const COUNT = 300;
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.5 + random() * 2.8;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.cos(phi) * 0.85;
      arr[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    return arr;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ref.current) {
      ref.current.rotation.y = t * 0.035;
      ref.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }
    if (material.current) {
      material.current.opacity = 0.36 + Math.sin(t * 1.25) * 0.13;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={material}
        size={0.035}
        color="#BFD0F1"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/** Packets of light travelling from each node back into the core. */
function EnergyPacket({ node, delay }: { node: readonly number[]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const period = 3.4;
    const p = ((state.clock.elapsedTime + delay) % period) / period;
    const travelling = p < 0.68;
    const k = travelling ? easeInOut(p / 0.68) : 1;
    ref.current.position.set(
      node[0] * (1 - k),
      node[1] * (1 - k),
      node[2] * (1 - k),
    );
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = travelling ? 0.85 * Math.min(1, k * 4) : 0.85 * (1 - (p - 0.68) / 0.32);
    const s = travelling ? 0.5 + 0.5 * Math.sin(k * Math.PI) : 1;
    ref.current.scale.setScalar(Math.max(0.001, s));
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshBasicMaterial color="#FAFAFF" transparent opacity={0.8} depthWrite={false} />
    </mesh>
  );
}

/** Two satellites riding different orbital planes. */
function Satellites() {
  const outer = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (outer.current) outer.current.rotation.y += delta * 0.5;
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.36;
      inner.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.4) * 0.18;
    }
  });

  return (
    <>
      <group ref={outer} rotation={[0.5, 0, 0.35]}>
        <group position={[2.3, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshBasicMaterial color="#FAFAFF" depthWrite={false} />
          </mesh>
          <mesh scale={3.2}>
            <sphereGeometry args={[0.055, 12, 12]} />
            <meshBasicMaterial color="#7899D4" transparent opacity={0.12} depthWrite={false} />
          </mesh>
        </group>
      </group>
      <group ref={inner} rotation={[-0.7, 0, 0.5]}>
        <group position={[1.95, 0, 0]}>
          <mesh>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshBasicMaterial color="#BFD0F1" depthWrite={false} />
          </mesh>
          <mesh scale={3}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color="#FAFAFF" transparent opacity={0.1} depthWrite={false} />
          </mesh>
        </group>
      </group>
    </>
  );
}

function CoreScene() {
  const root = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  const ring = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);
  const pulse = useRef<THREE.Mesh>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const intro = useRef(0);

  /* Cinematic mouse parallax — listens on the window because the hero visual
     layer sits under pointer-events:none. */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    /* Entrance: scale up + unwind into place over ~1.9s. */
    if (intro.current < 1) intro.current = Math.min(1, intro.current + delta / 1.9);
    const e = easeOutCubic(intro.current);

    smooth.current.x += (pointer.current.x - smooth.current.x) * Math.min(1, delta * 2.5);
    smooth.current.y += (pointer.current.y - smooth.current.y) * Math.min(1, delta * 2.5);

    if (root.current) {
      const s = 0.55 + 0.45 * e + Math.sin(e * Math.PI) * 0.05;
      root.current.scale.setScalar(s);
    }

    if (group.current) {
      group.current.rotation.y = t * 0.1 + (1 - e) * -2.3 + smooth.current.x * 0.14;
      group.current.rotation.x = Math.sin(t * 0.18) * 0.045 + (1 - e) * 0.35 - smooth.current.y * 0.1;
    }
    if (ring.current) {
      ring.current.rotation.x += delta * 0.15;
      ring.current.rotation.z -= delta * 0.08;
    }
    if (inner.current) inner.current.rotation.y -= delta * 0.2;
    if (halo.current) {
      const scale = 1.5 * (1 + Math.sin(t * 0.7) * 0.045);
      halo.current.scale.setScalar(scale);
    }
    if (pulse.current) {
      const phase = (t % 3.4) / 3.4;
      const ps = 0.72 + phase * 1.15;
      pulse.current.scale.setScalar(ps);
      const mat = pulse.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.45 * (1 - phase) * e;
    }
  });

  const core = [0, 0, 0] as const;

  return (
    <group ref={root}>
      <group ref={group} rotation={[0.16, -0.35, 0]}>
        <mesh ref={halo} scale={1.5}>
          <icosahedronGeometry args={[1.05, 2]} />
          <meshBasicMaterial color="#7899D4" transparent opacity={0.035} side={THREE.BackSide} />
        </mesh>

        {NODES.map((node, i) => <Connector key={`connector-${i}`} from={core} to={node} />)}
        {NODES.map((node, i) => (
          <EnergyPacket key={`packet-${i}`} node={node} delay={i * 0.55} />
        ))}

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

        {/* Cinematic shockwave: a ring that expands out of the core and fades. */}
        <mesh ref={pulse} rotation={[Math.PI / 2.7, 0.2, 0]}>
          <torusGeometry args={[1.48, 0.02, 8, 128]} />
          <meshBasicMaterial color="#BFD0F1" transparent opacity={0} depthWrite={false} />
        </mesh>

        <Satellites />

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
      <ParticleField />
    </group>
  );
}

export function ThreeDSystem() {
  const [ready, setReady] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const start = () => {
      if (!cancelled) setReady(true);
    };

    const idleWindow = globalThis as typeof globalThis & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof idleWindow.requestIdleCallback === "function") {
      const idleId = idleWindow.requestIdleCallback(start, { timeout: 900 });
      return () => {
        cancelled = true;
        idleWindow.cancelIdleCallback?.(idleId);
      };
    }

    const timeoutId = globalThis.setTimeout(start, 500);
    return () => {
      cancelled = true;
      globalThis.clearTimeout(timeoutId);
    };
  }, []);

  if (reduce) return <div className="three-d-system-placeholder" aria-hidden="true" />;

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
