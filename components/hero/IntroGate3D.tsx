"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { hero, intro, roles } from "@/lib/content";
import { useReducedMotion } from "@/lib/motion";

const ParticleScene = dynamic(
  () => import("./ParticleScene").then((m) => m.ParticleScene),
  { ssr: false },
);

export function IntroGate3D({ onEnter }: { onEnter: () => void }) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) {
      onEnter();
    }
  }, [reducedMotion, onEnter]);

  useEffect(() => {
    if (reducedMotion || !visible) return;
    const timer = window.setInterval(() => {
      setRoleIndex((i) => (i + 1) % roles.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [reducedMotion, visible]);

  useEffect(() => {
    if (reducedMotion || !visible) return;
    const enter = () => setVisible(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        enter();
      }
    };
    window.addEventListener("wheel", enter, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("wheel", enter);
      window.removeEventListener("keydown", onKey);
    };
  }, [reducedMotion, onEnter, visible]);

  if (reducedMotion) return null;

  return (
    <AnimatePresence onExitComplete={onEnter}>
      {visible ? (
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center hero-gradient"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.02 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        role="dialog"
        aria-modal="true"
        aria-label="Portfolio introduction"
      >
        <ParticleScene className="absolute inset-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,11,22,0.55)_70%)]" />

        <div className="relative z-10 flex flex-col items-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 rounded-full bg-blue/25 blur-3xl" />
            <Image
              src={hero.profileImage}
              alt={hero.profileAlt}
              width={148}
              height={148}
              priority
              className="relative h-36 w-36 rounded-full border-[4px] border-white/25 object-cover shadow-[0_0_0_8px_rgba(36,84,216,0.15),0_30px_60px_-20px_rgba(0,0,0,0.65)]"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-mono text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-glow"
          >
            {intro.eyebrow}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.55 }}
            className="mt-4 font-display text-[clamp(36px,6vw,72px)] font-semibold leading-[1.02] tracking-[-0.04em] text-white"
          >
            {intro.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-4 max-w-xl text-base text-white/70"
          >
            {intro.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.45 }}
            className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-gold"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={roles[roleIndex]}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
              >
                {roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.85, duration: 0.45 }}
            onClick={() => setVisible(false)}
            className="mt-12 flex flex-col items-center gap-3 border-0 bg-transparent text-white/55"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
              Scroll or tap to enter
            </span>
            <motion.span
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.6 }}
              className="h-10 w-px bg-gradient-to-b from-transparent via-gold/80 to-transparent"
            />
          </motion.button>
        </div>
      </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
