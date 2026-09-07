"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { footer } from "@/lib/content";
import { AuroraBackground } from "@/components/motion/AuroraBackground";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/TextReveal";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.35, 1], [0.4, 0.85, 1]);

  return (
    <footer
      id="contact"
      ref={ref}
      className="relative overflow-hidden border-t border-line bg-surface py-20"
    >
      <AuroraBackground variant="footer" />
      <motion.div style={{ y, opacity }} className="wrap relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-blue" />
              {footer.eyebrow}
            </div>
            <TextReveal
              as="h2"
              text="Have a project, a team, or a technical challenge?"
              className="max-w-3xl font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.03em] text-navy"
            />
          </div>
          <MagneticButton href={footer.cta.href} variant="primary" className="shrink-0">
            {footer.cta.label} ↗
          </MagneticButton>
        </div>

        <div className="my-8 h-px bg-line" />

        <LineReveal delay={0.08}>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_0.8fr]">
            <p className="max-w-xl text-sm text-muted">{footer.note}</p>
            <nav className="flex flex-wrap gap-3" aria-label="Footer navigation">
              {footer.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="glass-card rounded-lg px-3 py-2 text-xs font-semibold text-blue-deep no-underline transition hover:border-blue/30"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                {footer.location.label}
              </span>
              <strong className="mt-1 block font-display text-xl text-navy">
                {footer.location.city}
              </strong>
              <small className="mt-1 block text-xs text-muted">{footer.location.note}</small>
            </div>
          </div>
        </LineReveal>

        <LineReveal delay={0.14}>
          <div className="mt-10 flex flex-wrap gap-4 text-[11px] font-semibold text-muted">
            {footer.bottom.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </LineReveal>
      </motion.div>
    </footer>
  );
}
