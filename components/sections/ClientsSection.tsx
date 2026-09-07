"use client";

import { clients } from "@/lib/content";
import { Marquee } from "@/components/motion/Marquee";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { FadeIn } from "@/components/ui/primitives";

export function ClientsSection() {
  return (
    <SectionReveal className="bg-surface py-14">
      <div className="wrap">
        <FadeIn>
          <p className="mb-5 text-center text-[11px] font-extrabold uppercase tracking-[0.14em] text-muted">
            {clients.label}
          </p>
        </FadeIn>
        <Marquee items={[...clients.names, "+ Many more"]} />
      </div>
    </SectionReveal>
  );
}
