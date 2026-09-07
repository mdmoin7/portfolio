"use client";

import { motion } from "framer-motion";
import { about } from "@/lib/content";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { LineReveal } from "@/components/motion/TextReveal";
import { SectionHeading, FadeIn } from "@/components/ui/primitives";

export function AboutSection() {
  return (
    <section id="about" className="border-b border-line bg-surface py-16">
      <div className="wrap">
        <SectionHeading kicker={about.kicker} title={about.title} notes={about.signals} />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <FadeIn>
            <div className="space-y-4 text-sm text-muted">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>
                  {paragraph.includes("I'm Mohammad Moin") ? (
                    <>
                      <strong className="text-ink">
                        I&apos;m Mohammad Moin, an independent software engineering consultant
                        and corporate technology trainer.
                      </strong>{" "}
                      I work at the intersection of <strong>building</strong> and{" "}
                      <strong>teaching</strong>. As a full stack engineer, I design and ship web
                      and mobile applications across the JavaScript ecosystem — Angular, React,
                      Vue, Node, React Native — leading delivery from architecture through
                      production.
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
              <MagneticButton href={about.cta.href} variant="outline">
                {about.cta.label}
              </MagneticButton>
            </div>
          </FadeIn>
          <LineReveal delay={0.12}>
            <aside className="glass-card relative overflow-hidden p-6">
              <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gold/20 blur-2xl" />
              <p className="relative font-display text-[clamp(22px,2.4vw,30px)] font-semibold leading-snug text-navy">
                “{about.quote}”
              </p>
              <span className="mt-4 block text-[10px] font-bold uppercase tracking-[0.12em] text-gold">
                Training philosophy
              </span>
            </aside>
          </LineReveal>
        </div>
      </div>
    </section>
  );
}
