"use client";

import { about } from "@/lib/content";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { BentoCell, BentoGrid } from "@/components/ui/BentoGrid";
import { FadeIn } from "@/components/ui/primitives";

export function AboutSection() {
  return (
    <SectionReveal id="about" className="border-b border-line bg-white">
      <div className="wrap">
        <FadeIn>
          <div className="kicker mb-3">{about.kicker}</div>
          <TextReveal as="h2" text={about.title} className="section-title max-w-3xl" />
          <p className="mt-4 max-w-2xl text-muted">{about.subtitle}</p>
        </FadeIn>

        <BentoGrid className="mt-10">
          <BentoCell span="2">
            <div className="space-y-4 text-sm leading-relaxed text-muted">
              {about.paragraphs.map((p) => (
                <p key={p.slice(0, 32)}>{p}</p>
              ))}
              <MagneticButton href={about.cta.href} variant="outline">
                {about.cta.label}
              </MagneticButton>
            </div>
          </BentoCell>
          <BentoCell span="1" className="flex items-center bg-[linear-gradient(135deg,#f8faff,#fff)]">
            <blockquote className="font-display text-[clamp(22px,2.5vw,28px)] font-semibold leading-snug text-navy">
              “{about.quote}”
            </blockquote>
            <span className="mt-6 block text-[10px] font-bold uppercase tracking-[0.12em] text-gold">
              Training philosophy
            </span>
          </BentoCell>
        </BentoGrid>
      </div>
    </SectionReveal>
  );
}
