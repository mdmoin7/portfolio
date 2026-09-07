"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { hero, roles } from "@/lib/content";
import { Button } from "@/components/ui/primitives";
import { useReducedMotion } from "@/lib/motion";

const Scene3D = dynamic(() => import("./Scene3D").then((mod) => mod.Scene3D), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] w-full animate-pulse rounded-[18px] border border-white/10 bg-white/5" />
  ),
});

function CountUp({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
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
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
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

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % roles.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <header id="top" className="hero-gradient relative overflow-hidden border-b border-white/10 py-12 lg:py-16">
      <div className="wrap relative grid items-center gap-12 lg:grid-cols-[minmax(0,1.06fr)_minmax(320px,0.94fr)]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid items-center gap-8 md:grid-cols-[190px_minmax(0,1fr)]">
            <div className="relative mx-auto md:mx-0">
              <div className="absolute inset-0 rounded-full bg-blue/20 blur-2xl" />
              <Image
                src={hero.profileImage}
                alt={hero.profileAlt}
                width={176}
                height={176}
                priority
                className="relative h-44 w-44 rounded-full border-[5px] border-white object-cover shadow-[0_0_0_2px_rgba(36,84,216,0.22),0_0_0_9px_rgba(36,84,216,0.06),0_24px_50px_-25px_rgba(20,35,63,0.5)]"
              />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.08em] text-blue-soft">
                <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                Independent Consultant ·{" "}
                <motion.span
                  key={roles[roleIndex]}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  {roles[roleIndex]}
                </motion.span>
              </div>

              <h1 className="mt-3 font-display text-[clamp(40px,4.8vw,66px)] font-semibold leading-[1.04] tracking-[-0.035em] text-white">
                {hero.headline.before}{" "}
                <span className="text-blue">{hero.headline.accent1}</span>
                <br />
                {hero.headline.middle}{" "}
                <span className="text-blue">{hero.headline.accent2}</span>
              </h1>

              <p className="mt-4 max-w-[620px] text-base text-white/70">
                <strong className="font-bold text-white/90">
                  Mohammad Moin is an independent software engineering consultant and corporate
                  technology trainer based in Bengaluru, India.
                </strong>{" "}
                I specialize in frontend architecture, Angular, React, React Native and
                Terraform/Azure, while helping individuals and engineering teams build production
                systems and develop modern technical capabilities. Available for freelance
                consulting engagements and remote collaboration across time zones.
              </p>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {hero.ctas.map((cta) => (
                  <Button
                    key={cta.label}
                    href={cta.href}
                    external={"external" in cta ? cta.external : false}
                    variant={cta.primary ? "primary" : "outline"}
                    className={cta.primary ? "" : "border-white/20 bg-white/5 text-white hover:bg-white/10"}
                  >
                    {cta.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div
            className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
            aria-label="Professional highlights"
          >
            {hero.proofs.map((proof, index) => (
              <motion.div
                key={proof.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.45 }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
              >
                <div className="grid h-8 w-8 place-items-center rounded-full bg-blue/20 text-sm text-blue-soft">
                  ★
                </div>
                <div>
                  <strong className="block font-display text-xl text-white">
                    <CountUp value={proof.value} suffix={proof.suffix} />
                  </strong>
                  <span className="text-[10.5px] text-white/60">{proof.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-4"
        >
          <Scene3D />
          <div className="card-surface border-white/10 bg-white/95 p-5 backdrop-blur">
            <div className="mb-4 text-xs font-extrabold uppercase tracking-[0.08em] text-blue-deep">
              Key Focus Areas
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {hero.focusAreas.map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl bg-blue-soft text-blue">
                    ◆
                  </div>
                  <div>
                    <strong className="block text-sm text-navy">{item.title}</strong>
                    <span className="text-xs text-muted">{item.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
