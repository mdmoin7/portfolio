"use client";

import { whatIDo } from "@/lib/content";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { BentoCell, BentoGrid } from "@/components/ui/BentoGrid";
import { FadeIn } from "@/components/ui/primitives";

export function WhatIDoSection() {
  return (
    <SectionReveal id="what-i-do" className="border-b border-line bg-white">
      <div className="wrap">
        <FadeIn>
          <div className="kicker mb-3">{whatIDo.kicker}</div>
          <TextReveal as="h2" text={whatIDo.title} className="section-title max-w-3xl" />
          <p className="mt-4 max-w-2xl text-muted">{whatIDo.subtitle}</p>
        </FadeIn>
        <BentoGrid className="mt-10">
          {whatIDo.items.map((item) => (
            <BentoCell key={item.title} href={item.href} span={item.span}>
              <span className="text-2xl">◆</span>
              <h3 className="mt-4 font-display text-xl font-semibold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              <span className="mt-4 inline-flex text-xs font-bold text-blue">Learn more →</span>
            </BentoCell>
          ))}
        </BentoGrid>
      </div>
    </SectionReveal>
  );
}
