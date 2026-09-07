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
                whileHover={{ y: -6, rotateX: 2, rotateY: -2 }}
                className="glass-card group block p-5 no-underline transition hover:border-navy/20"
                style={{ transformStyle: "preserve-3d" }}
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-lg text-navy transition group-hover:border-blue group-hover:text-blue">
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
