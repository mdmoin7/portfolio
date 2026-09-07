"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { hero, roles } from "@/lib/content";
import { AuroraBackground } from "@/components/motion/AuroraBackground";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { useReducedMotion } from "@/lib/motion";

function CountUp({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotion();
  const [display, setDisplay] = useState(reducedMotion ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reducedMotion) {
      setDisplay(value);
      return;
    }
    let frame = 0;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
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

function HeroMockup() {
  return (
    <div className="glass-card-dark relative overflow-hidden p-5">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="mx-auto font-mono text-[10px] text-white/45">moin@portfolio</span>
      </div>
      <div className="space-y-3 font-mono text-[11px] leading-relaxed text-white/75">
        {hero.terminalLines.map((line) => (
          <p key={line}>
            <span className="font-bold text-blue-glow">→</span> {line}
          </p>
        ))}
        <p className="text-white/90">
          <span className="font-bold text-gold">✦</span> Building products. Teaching engineers.
        </p>
      </div>
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-gold/15 blur-3xl" />
    </div>
  );
}

export function HeroSection() {
  const reducedMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const name = hero.name;

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % roles.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <header id="top" className="hero-gradient relative overflow-hidden border-b border-white/10 pb-14 pt-10 lg:pb-20 lg:pt-14">
      <AuroraBackground />

      <div className="wrap relative">
        {/* Merged intro: name reveal on load */}
        <motion.div
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center lg:mb-12"
        >
          <div className="mb-3 flex flex-wrap justify-center gap-1">
            {name.split("").map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                initial={reducedMotion ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  delay: 0.04 + index * 0.035,
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display text-[clamp(28px,5vw,56px)] font-semibold tracking-[-0.04em] text-white"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
          <motion.p
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mx-auto max-w-2xl text-sm text-white/60 lg:text-base"
          >
            Independent Consultant ·{" "}
            <AnimatePresence mode="wait">
              <motion.span
                key={roles[roleIndex]}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
                className="font-semibold text-blue-glow"
              >
                {roles[roleIndex]}
              </motion.span>
            </AnimatePresence>
          </motion.p>
        </motion.div>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="grid items-center gap-8 md:grid-cols-[164px_minmax(0,1fr)]">
              <motion.div
                initial={reducedMotion ? false : { opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.65, duration: 0.5 }}
                className="relative mx-auto md:mx-0"
              >
                <div className="absolute inset-0 rounded-full bg-blue/25 blur-2xl" />
                <Image
                  src={hero.profileImage}
                  alt={hero.profileAlt}
                  width={164}
                  height={164}
                  priority
                  className="relative h-40 w-40 rounded-full border-[4px] border-white/20 object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_24px_50px_-25px_rgba(0,0,0,0.55)]"
                />
              </motion.div>

              <div>
                <h1 className="font-display text-[clamp(34px,4.5vw,58px)] font-semibold leading-[1.04] tracking-[-0.035em] text-white">
                  {hero.headline.before}{" "}
                  <span className="accent-gradient-text">{hero.headline.accent1}</span>
                  <br />
                  {hero.headline.middle}{" "}
                  <span className="accent-gradient-text">{hero.headline.accent2}</span>
                </h1>

                <p className="mt-4 max-w-[620px] text-[15px] text-white/70">
                  <strong className="font-semibold text-white/90">
                    Mohammad Moin is an independent software engineering consultant and corporate
                    technology trainer based in Bengaluru, India.
                  </strong>{" "}
                  I specialize in frontend architecture, Angular, React, React Native and
                  Terraform/Azure, while helping individuals and engineering teams build production
                  systems and develop modern technical capabilities.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <MagneticButton href="#projects" variant="primary">
                    ↗ Explore Engineering Work
                  </MagneticButton>
                  <MagneticButton href="/assets/resume.pdf" external variant="glass">
                    Download Engineering CV
                  </MagneticButton>
                </div>
              </div>
            </div>

            <motion.div
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
              aria-label="Professional highlights"
            >
              {hero.proofs.map((proof, index) => (
                <motion.div
                  key={proof.label}
                  initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08, duration: 0.45 }}
                  whileHover={{ y: -3 }}
                  className="glass-card-dark flex items-center gap-3 px-4 py-3"
                >
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-blue/20 text-xs font-bold text-blue-glow">
                    {index === 3 ? "◆" : "★"}
                  </div>
                  <div>
                    <strong className="block font-display text-xl text-white">
                      <CountUp value={proof.value} suffix={proof.suffix} />
                    </strong>
                    <span className="text-[10.5px] text-white/55">{proof.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.75, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4"
          >
            <HeroMockup />
            <div className="glass-card-dark p-5">
              <div className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em] text-gold">
                Key Focus Areas
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {hero.focusAreas.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={reducedMotion ? false : { opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.08 * index, duration: 0.4 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5 text-xs font-bold text-blue-glow">
                      {index + 1}
                    </div>
                    <div>
                      <strong className="block text-sm text-white">{item.title}</strong>
                      <span className="text-xs text-white/55">{item.description}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </header>
  );
}
