"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useScroll, useTransform } from "framer-motion";
import { AuroraBackground } from "@/components/motion/AuroraBackground";
import { CinematicOverlay } from "@/components/motion/CinematicOverlay";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { hero, roles } from "@/lib/content";
import { useReducedMotion } from "@/lib/motion";

const ParticleScene = dynamic(
  () => import("./ParticleScene").then((m) => m.ParticleScene),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-navy" /> },
);

const ease = [0.22, 1, 0.36, 1] as const;

function CountUp({ value, suffix = "", play }: { value: number; suffix?: string; play: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? value : 0);
  const shouldRun = play && (inView || reducedMotion);

  useEffect(() => {
    if (!shouldRun) return;
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1400, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shouldRun, reducedMotion, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function HeroSection({ play = true }: { play?: boolean }) {
  const reducedMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  useEffect(() => {
    if (reducedMotion || !play) return;
    const t = window.setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2600);
    return () => window.clearInterval(t);
  }, [reducedMotion, play]);

  const headlineLines = [
    [
      { text: hero.headline.before, accent: false },
      { text: hero.headline.accent1, accent: true },
    ],
    [
      { text: hero.headline.middle, accent: false },
      { text: hero.headline.accent2, accent: true },
    ],
  ] as const;

  let wordDelay = 0.16;

  return (
    <header
      id="top"
      ref={ref}
      className="hero-gradient relative flex min-h-[100svh] flex-col overflow-hidden border-b border-white/10"
    >
      <ParticleScene className="absolute inset-0 opacity-90" intensity="hero" />
      <AuroraBackground variant="hero" className="opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,transparent_0%,rgba(5,11,22,0.68)_70%)]" />
      <CinematicOverlay grain vignette />

      <motion.div
        style={{ opacity, y, scale }}
        className="relative flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-24 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={play ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 10, filter: "blur(4px)" }}
          transition={{ delay: 0.08, duration: 0.6, ease }}
          className="font-mono text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-glow"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={roles[roleIndex]}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="inline-block"
            >
              {roles[roleIndex]}
            </motion.span>
          </AnimatePresence>
          <span className="text-white/35"> · </span>
          Bengaluru, India
        </motion.p>

        <h1 className="mt-5 flex max-w-5xl flex-col items-center gap-y-1 font-display text-[clamp(40px,7vw,84px)] font-semibold leading-[1.06] tracking-[-0.04em] text-white">
          {headlineLines.map((line, lineIndex) => (
            <span
              key={lineIndex}
              className="flex flex-wrap justify-center gap-x-[0.28em] gap-y-1"
            >
              {line.flatMap((part) =>
                part.text.split(" ").map((word, wordIndex) => {
                  const delay = wordDelay;
                  wordDelay += 0.05;
                  return (
                    <motion.span
                      key={`${lineIndex}-${part.text}-${wordIndex}`}
                      initial={{ opacity: 0, y: 22, filter: "blur(10px)" }}
                      animate={
                        play
                          ? { opacity: 1, y: 0, filter: "blur(0px)" }
                          : { opacity: 0, y: 22, filter: "blur(10px)" }
                      }
                      transition={{ delay, duration: 0.5, ease }}
                      className={part.accent ? "accent-gradient-text inline-block" : "inline-block"}
                    >
                      {word}
                    </motion.span>
                  );
                }),
              )}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16, filter: "blur(6px)" }}
          animate={play ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 16, filter: "blur(6px)" }}
          transition={{ delay: 0.55, duration: 0.65, ease }}
          className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/72"
        >
          {hero.lede}
        </motion.p>

        <motion.div
          style={{ y: photoY }}
          initial={{ opacity: 0, scale: 0.88, filter: "blur(8px)" }}
          animate={
            play
              ? { opacity: 1, scale: 1, filter: "blur(0px)" }
              : { opacity: 0, scale: 0.88, filter: "blur(8px)" }
          }
          transition={{ delay: 0.68, duration: 0.75, ease }}
          className="relative mt-10"
        >
          <div className="absolute -inset-5 rounded-full bg-gold/15 blur-2xl" />
          <div className="absolute -inset-3 rounded-full bg-blue/20 blur-xl" />
          <div className="cinematic-ring absolute -inset-[2px] rounded-full bg-[conic-gradient(from_180deg,rgba(201,162,39,0.4),rgba(36,84,216,0.25),transparent,rgba(88,166,255,0.35),rgba(201,162,39,0.4))] opacity-60" />
          <Image
            src={hero.profileImage}
            alt={hero.profileAlt}
            width={120}
            height={120}
            className="relative h-[120px] w-[120px] rounded-full border-[3px] border-white/20 object-cover shadow-[0_20px_50px_-25px_rgba(0,0,0,0.65)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ delay: 0.82, duration: 0.55, ease }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {hero.ctas.map((cta, index) => (
            <motion.div
              key={cta.label}
              initial={{ opacity: 0, y: 12 }}
              animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: 0.88 + index * 0.08, duration: 0.5, ease }}
            >
              <MagneticButton
                href={cta.href}
                external={"external" in cta ? cta.external : false}
                variant={cta.primary ? "primary" : "glass"}
              >
                {cta.label}
              </MagneticButton>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
        transition={{ delay: 0.95, duration: 0.65, ease }}
        className="relative border-t border-white/10 bg-[rgba(5,11,22,0.55)] backdrop-blur-md"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={play ? { scaleX: 1 } : { scaleX: 0 }}
          transition={{ delay: 1.05, duration: 0.9, ease }}
          className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-transparent via-gold/60 to-transparent"
        />
        <div className="wrap grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {hero.proofs.map((proof, index) => (
            <motion.div
              key={proof.label}
              initial={{ opacity: 0, y: 16 }}
              animate={play ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ delay: 1.1 + index * 0.07, duration: 0.5, ease }}
              className="text-center sm:text-left"
            >
              <strong className="block font-display text-2xl text-white">
                <CountUp value={proof.value} suffix={proof.suffix} play={play} />
              </strong>
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/50">
                {proof.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </header>
  );
}
