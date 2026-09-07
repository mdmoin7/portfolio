"use client";

import { whatIDo } from "@/lib/content";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { BentoCell, BentoGrid } from "@/components/ui/BentoGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function WhatIDoSection() {
  return (
    <SectionReveal id="what-i-do" className="section-bg-light border-b border-line">
      <div className="wrap">
        <SectionHeader kicker={whatIDo.kicker} title={whatIDo.title} subtitle={whatIDo.subtitle} />
        <BentoGrid className="mt-12 grid-cols-1 sm:grid-cols-2 md:grid-cols-2">
          {whatIDo.items.map((item, index) => (
            <BentoCell key={item.title} href={item.href} index={`0${index + 1}`}>
              <h3 className="font-display text-xl font-semibold text-navy md:text-[1.35rem]">
                {item.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{item.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-blue">
                Learn more <span aria-hidden="true">→</span>
              </span>
            </BentoCell>
          ))}
        </BentoGrid>
      </div>
    </SectionReveal>
  );
}
