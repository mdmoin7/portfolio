"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { AuroraBackground } from "@/components/motion/AuroraBackground";
import { CinematicOverlay } from "@/components/motion/CinematicOverlay";
import { TextReveal } from "@/components/motion/TextReveal";
import { hero, intro, roles } from "@/lib/content";
import { useReducedMotion } from "@/lib/motion";

const ParticleScene = dynamic(
  () => import("./ParticleScene").then((m) => m.ParticleScene),
  { ssr: false },
);

const ease = [0.22, 1, 0.36, 1] as const;

export function IntroGate3D({ onEnter }: { onEnter: () => void }) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      onEnter();
    }
  }, [reducedMotion, onEnter]);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: "blur(16px)" }}
          transition={{ duration: 1.1, ease }}
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio introduction"
        >
          <ParticleScene className="absolute inset-0" intensity="intro" />
          <AuroraBackground variant="hero" className="opacity-70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,11,22,0.62)_72%)]" />
          <CinematicOverlay letterbox grain vignette sweep />

          <motion.div
            className="relative z-10 flex flex-col items-center px-6 text-center"
            initial={{ opacity: 0, y: 28, scale: 0.96 }}
            animate={ready ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 28, scale: 0.96 }}
            exit={{ opacity: 0, y: -36, scale: 1.04, filter: "blur(8px)" }}
            transition={{ duration: 0.95, ease }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.82 }}
              animate={ready ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.82 }}
              transition={{ duration: 0.85, ease }}
              className="relative mb-8"
            >
              <div className="absolute -inset-6 rounded-full bg-blue/20 blur-3xl" />
              <div className="absolute -inset-3 rounded-full bg-gold/10 blur-2xl" />
              <div className="cinematic-ring absolute -inset-[3px] rounded-full bg-[conic-gradient(from_0deg,rgba(201,162,39,0.55),rgba(36,84,216,0.35),transparent,rgba(88,166,255,0.45),rgba(201,162,39,0.55))] opacity-70" />
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
              initial={{ opacity: 0, y: 12, letterSpacing: "0.28em" }}
              animate={
                ready
                  ? { opacity: 1, y: 0, letterSpacing: "0.16em" }
                  : { opacity: 0, y: 12, letterSpacing: "0.28em" }
              }
              transition={{ delay: 0.15, duration: 0.7, ease }}
              className="font-mono text-[10px] font-extrabold uppercase text-blue-glow"
            >
              {intro.eyebrow}
            </motion.p>

            <TextReveal
              as="h1"
              text={intro.title}
              play={ready}
              delay={0.28}
              className="mt-4 justify-center font-display text-[clamp(36px,6vw,72px)] font-semibold leading-[1.02] tracking-[-0.04em] text-white"
            />

            <motion.p
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={
                ready
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 14, filter: "blur(6px)" }
              }
              transition={{ delay: 0.72, duration: 0.65, ease }}
              className="mt-4 max-w-xl text-base text-white/70"
            >
              {intro.subtitle}
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={ready ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.88, duration: 0.5 }}
              className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-gold"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIndex]}
                  initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                  transition={{ duration: 0.35 }}
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 1.05, duration: 0.55, ease }}
              onClick={() => setVisible(false)}
              className="group mt-12 flex flex-col items-center gap-3 border-0 bg-transparent text-white/55"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] transition-colors group-hover:text-white/80">
                Scroll or tap to enter
              </span>
              <motion.span
                animate={{ y: [0, 10, 0], opacity: [0.35, 1, 0.35] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                className="h-12 w-px bg-gradient-to-b from-transparent via-gold/90 to-transparent"
              />
            </motion.button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
