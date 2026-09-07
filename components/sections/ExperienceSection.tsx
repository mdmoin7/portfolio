"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { experience } from "@/lib/content";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { BentoCell, BentoGrid } from "@/components/ui/BentoGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";

const tagTone: Record<string, string> = {
  Consulting: "from-blue to-blue-glow",
  Engineering: "from-blue-glow to-gold",
  Training: "from-gold to-gold-soft",
};

export function ExperienceSection() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start 80%", "end 30%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <SectionReveal id="experience" className="section-bg-muted border-b border-line">
      <div className="wrap">
        <SectionHeader
          kicker={experience.kicker}
          title={experience.title}
          subtitle={experience.subtitle}
        />

        <div ref={timelineRef} className="relative mt-12 md:pl-2">
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-0 left-4 top-0 hidden w-px origin-top bg-gradient-to-b from-blue via-blue-glow to-gold md:block"
          />
          <BentoGrid className="md:grid-cols-2">
            {experience.items.map((item, index) => (
              <BentoCell
                key={item.title}
                span={index === 1 ? "2" : "1"}
                className="relative md:ml-6"
              >
                <span
                  className="timeline-dot !left-0 !top-9 md:!-left-[26px]"
                  aria-hidden="true"
                />
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="tag-pill">{item.tag}</span>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                      {item.period[0]} — {item.period[1]}
                    </span>
                  </div>
                  <div
                    className={`mt-4 h-1 w-12 rounded-full bg-gradient-to-r ${tagTone[item.tag] ?? "from-blue to-blue-glow"}`}
                    aria-hidden="true"
                  />
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
