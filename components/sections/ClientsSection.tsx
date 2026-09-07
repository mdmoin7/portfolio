"use client";

import { clients } from "@/lib/content";
import { Marquee } from "@/components/motion/Marquee";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { FadeIn } from "@/components/ui/primitives";

export function ClientsSection() {
  return (
    <SectionReveal className="section-bg-muted py-16 md:py-20">
      <div className="wrap">
        <FadeIn>
          <p className="mb-2 text-center font-mono text-[10px] font-extrabold uppercase tracking-[0.16em] text-blue-deep">
            Trusted by
          </p>
          <p className="mb-8 text-center font-display text-[clamp(22px,2.5vw,32px)] font-semibold text-navy">
            {clients.label}
          </p>
        </FadeIn>
        <Marquee items={[...clients.names, "+ Many more"]} fade="muted" />
      </div>
    </SectionReveal>
  );
}
