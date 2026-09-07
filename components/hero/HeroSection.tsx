"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { hero, roles } from "@/lib/content";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useReducedMotion } from "@/lib/motion";

const ParticleScene = dynamic(
  () => import("./ParticleScene").then((m) => m.ParticleScene),
  { ssr: false, loading: () => <div className="absolute inset-0 bg-navy" /> },
);

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / 1200, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reducedMotion, value]);

  return (
    <span ref={ref}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);

  useEffect(() => {
    if (reducedMotion) return;
    const t = window.setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2600);
    return () => window.clearInterval(t);
  }, [reducedMotion]);

  return (
    <header
      id="top"
      ref={ref}
      className="hero-gradient relative flex min-h-[100svh] flex-col overflow-hidden border-b border-white/10"
    >
      <ParticleScene className="absolute inset-0 opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,transparent_0%,rgba(5,11,22,0.72)_68%)]" />

      <motion.div style={{ opacity, y }} className="relative flex flex-1 flex-col items-center justify-center px-6 pb-28 pt-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-glow"
        >
          {roles[roleIndex]} · Bengaluru, India
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-5xl font-display text-[clamp(40px,7vw,84px)] font-semibold leading-[1.02] tracking-[-0.04em] text-white"
        >
          {hero.headline.before}{" "}
          <span className="accent-gradient-text">{hero.headline.accent1}</span>
          <br />
          {hero.headline.middle}{" "}
          <span className="accent-gradient-text">{hero.headline.accent2}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22, duration: 0.55 }}
          className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/72"
        >
          {hero.lede}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34, duration: 0.5 }}
          className="relative mt-10"
        >
          <div className="absolute inset-0 rounded-full bg-gold/15 blur-2xl" />
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
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {hero.ctas.map((cta) => (
            <MagneticButton
              key={cta.label}
              href={cta.href}
              external={"external" in cta ? cta.external : false}
              variant={cta.primary ? "primary" : "glass"}
            >
              {cta.label}
            </MagneticButton>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5 }}
        className="relative border-t border-white/10 bg-[rgba(5,11,22,0.55)] backdrop-blur-md"
      >
        <div className="wrap grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {hero.proofs.map((proof) => (
            <div key={proof.label} className="text-center sm:text-left">
              <strong className="block font-display text-2xl text-white">
                <CountUp value={proof.value} suffix={proof.suffix} />
              </strong>
              <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/50">
                {proof.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </header>
  );
}
