"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { IntroRoundPortrait } from "@/components/hero/IntroRoundPortrait";
import { IntroThemeVectors } from "@/components/hero/IntroThemeVectors";
import { BlurText } from "@/components/motion/BlurText";
import { AuroraBackground } from "@/components/motion/AuroraBackground";
import { CinematicOverlay } from "@/components/motion/CinematicOverlay";
import { hero, intro, roles } from "@/lib/content";
import { useReducedMotion } from "@/lib/motion";

const ParticleScene = dynamic(
  () => import("./ParticleScene").then((m) => m.ParticleScene),
  { ssr: false },
);

const ease = [0.22, 1, 0.36, 1] as const;
const [firstName, lastName] = intro.title.split(" ");

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
          exit={{ opacity: 0, scale: 1.04, filter: "blur(14px)" }}
          transition={{ duration: 1, ease }}
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio introduction"
        >
          <ParticleScene className="absolute inset-0" intensity="intro" />
          <IntroThemeVectors />
          <AuroraBackground variant="hero" className="opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,11,22,0.68)_74%)]" />
          <CinematicOverlay letterbox grain vignette sweep />

          <div className="relative z-10 flex min-h-full w-full flex-col items-center justify-center px-4 py-[clamp(72px,11vh,112px)]">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.05, duration: 0.55, ease }}
              className="mb-8 font-mono text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-glow"
            >
              {intro.eyebrow}
            </motion.p>

            <div className="grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20">
              <div className="mx-auto w-full max-w-[240px] lg:mx-0">
                <IntroRoundPortrait
                  imageUrl={hero.profileImage}
                  alt={hero.profileAlt}
                  play={ready}
                />
              </div>

              <div className="flex flex-col text-center lg:text-left">
                <h1 className="pointer-events-none select-none">
                  <span className="block whitespace-nowrap font-display text-[clamp(36px,7vw,88px)] font-semibold leading-[0.82] tracking-[-0.04em] text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
                    <BlurText
                      as="span"
                      text={firstName.toUpperCase()}
                      play={ready}
                      delay={55}
                      nowrap
                      className="lg:justify-start"
                    />
                  </span>
                  <span className="accent-gradient-text block whitespace-nowrap font-display text-[clamp(36px,7vw,88px)] font-semibold leading-[0.82] tracking-[-0.04em] drop-shadow-[0_12px_40px_rgba(36,84,216,0.25)]">
                    <BlurText
                      as="span"
                      text={lastName.toUpperCase()}
                      play={ready}
                      delay={55}
                      nowrap
                      className="lg:justify-start"
                      itemClassName="text-transparent"
                    />
                  </span>
                </h1>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ delay: 0.72, duration: 0.6, ease }}
                  className="mt-6 max-w-md lg:max-w-none"
                >
                  <BlurText
                    as="p"
                    text={intro.subtitle}
                    play={ready}
                    animateBy="words"
                    delay={70}
                    className="justify-center text-[15px] leading-relaxed text-white/68 sm:text-[17px] lg:justify-start"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={ready ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.95, duration: 0.5 }}
                  className="mt-5 font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-gold"
                >
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={roles[roleIndex]}
                      initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                      transition={{ duration: 0.3 }}
                    >
                      {roles[roleIndex]}
                    </motion.span>
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={ready ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 1.15, duration: 0.55, ease }}
              onClick={() => setVisible(false)}
              className="group mt-10 flex flex-col items-center gap-3 border-0 bg-transparent text-white/55"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] transition-colors group-hover:text-white/85">
                Scroll or tap to enter
              </span>
              <motion.span
                animate={{ y: [0, 10, 0], opacity: [0.35, 1, 0.35] }}
                transition={{
                  repeat: Infinity,
                  duration: 2.2,
                  ease: "easeInOut",
                }}
                className="h-12 w-px bg-gradient-to-b from-transparent via-gold/90 to-transparent"
              />
            </motion.button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
