"use client";

import { about } from "@/lib/content";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { BentoCell } from "@/components/ui/BentoGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/primitives";

export function AboutSection() {
  return (
    <SectionReveal id="about" className="section-bg-muted border-b border-line">
      <div className="wrap">
        <SectionHeader kicker={about.kicker} title={about.title} subtitle={about.subtitle} />

        <div className="mt-12 grid gap-5 lg:grid-cols-12 lg:gap-6">
          <FadeIn className="lg:col-span-7">
            <div className="bento-card h-full p-6 md:p-8">
              <div className="grid gap-3 sm:grid-cols-3">
                {about.highlights.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-line bg-surface px-4 py-3 text-center sm:text-left"
                  >
                    <strong className="block font-display text-2xl text-navy">{item.value}</strong>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-muted">
                {about.paragraphs.map((p) => (
                  <p key={p.slice(0, 32)}>{p}</p>
                ))}
              </div>

              <MagneticButton href={about.cta.href} variant="outline" className="mt-8">
                {about.cta.label}
              </MagneticButton>
            </div>
          </FadeIn>

          <div className="lg:col-span-5">
            <BentoCell variant="featured" className="min-h-full" stagger={false}>
              <span className="tag-pill tag-pill-light">Training philosophy</span>
              <span
                className="mt-6 block font-display text-6xl leading-none text-blue-glow/30"
                aria-hidden="true"
              >
                “
              </span>
              <blockquote className="mt-2 font-display text-[clamp(22px,2.4vw,30px)] font-semibold leading-snug text-white">
                {about.quote}
              </blockquote>
              <p className="mt-8 text-sm leading-relaxed text-white/60">
                Production depth first — then structured transfer so teams keep shipping after the
                engagement ends.
              </p>
            </BentoCell>
          </div>
        </div>
      </div>
    </SectionReveal>
  );
}
