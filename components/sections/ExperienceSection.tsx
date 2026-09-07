"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { experience } from "@/lib/content";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { BentoCell, BentoGrid } from "@/components/ui/BentoGrid";
import { FadeIn } from "@/components/ui/primitives";

export function ExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 30%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <SectionReveal id="experience" className="border-b border-line bg-surface">
      <div className="wrap">
        <FadeIn>
          <div className="kicker mb-3">{experience.kicker}</div>
          <TextReveal as="h2" text={experience.title} className="section-title max-w-3xl" />
          <p className="mt-4 max-w-2xl text-muted">{experience.subtitle}</p>
        </FadeIn>

        <div ref={timelineRef} className="relative mt-10">
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-0 left-4 top-0 hidden w-px origin-top bg-gradient-to-b from-blue via-blue-glow to-gold md:block"
          />
          <BentoGrid className="md:grid-cols-2">
            {experience.items.map((item, index) => (
              <BentoCell key={item.title} span={index === 1 ? "2" : "1"}>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-blue/15 bg-blue-soft px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-blue-deep">
                    {item.tag}
                  </span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                    {item.period[0]} — {item.period[1]}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
              </BentoCell>
            ))}
          </BentoGrid>
        </div>
      </div>
    </SectionReveal>
  );
}
