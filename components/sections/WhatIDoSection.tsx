"use client";

import { motion } from "framer-motion";
import { whatIDo } from "@/lib/content";
import { SectionHeading, StaggerContainer, StaggerItem } from "@/components/ui/primitives";

const icons = ["⚡", "🏗", "🎓", "📚"];

export function WhatIDoSection() {
  return (
    <section id="what-i-do" className="border-b border-line bg-white py-16">
      <div className="wrap">
        <SectionHeading kicker={whatIDo.kicker} title="What I do for clients and teams" />
        <StaggerContainer className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {whatIDo.items.map((item, index) => (
            <StaggerItem key={item.title}>
              <motion.a
                href={item.href}
                whileHover={{ y: -4, rotateX: 2, rotateY: -2 }}
                className="group block rounded-[var(--radius-card)] border border-line bg-surface p-5 no-underline shadow-[0_18px_40px_-34px_rgba(20,35,63,0.35)] transition hover:border-blue/25 hover:bg-white"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-blue-soft text-lg text-blue transition group-hover:scale-110">
                  {icons[index]}
                </div>
                <strong className="block text-base text-navy">{item.title}</strong>
                <span className="mt-1 block text-sm text-muted">{item.description}</span>
              </motion.a>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
