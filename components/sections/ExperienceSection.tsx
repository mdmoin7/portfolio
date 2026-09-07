"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { experience } from "@/lib/content";
import {
  SectionHeading,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/primitives";

export function ExperienceSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end 20%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="experience" className="border-b border-line bg-surface py-16">
      <div className="wrap">
        <SectionHeading
          kicker={experience.kicker}
          title={experience.title}
          notes={experience.notes}
        />
        <div ref={containerRef} className="relative">
          <motion.div
            style={{ scaleY: lineScale }}
            className="absolute bottom-0 left-[18px] top-0 hidden w-px origin-top bg-blue/30 md:block"
          />
          <StaggerContainer className="space-y-6">
            {experience.items.map((item) => (
              <StaggerItem key={item.title}>
                <article className="grid gap-4 md:grid-cols-[36px_120px_minmax(0,1fr)] md:items-start">
                  <div className="hidden md:flex md:justify-center">
                    <span className="relative z-10 mt-2 grid h-4 w-4 place-items-center rounded-full border-2 border-blue bg-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                    </span>
                  </div>
                  <div className="font-mono text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted">
                    <span className="block text-navy">{item.period[0]}</span>
                    <span className="block">{item.period[1]}</span>
                  </div>
                  <div className="rounded-[var(--radius-card)] border border-line bg-white p-5">
                    <span className="rounded-full border border-line bg-blue-soft px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-blue-deep">
                      {item.tag}
                    </span>
                    <h3 className="mt-3 font-display text-xl font-semibold text-navy">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{item.description}</p>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </div>
    </section>
  );
}
