"use client";

import { pillars } from "@/lib/content";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { BentoCell, BentoGrid } from "@/components/ui/BentoGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FadeIn } from "@/components/ui/primitives";

export function PillarsSection() {
  return (
    <SectionReveal id="stack" className="section-bg-light border-b border-line">
      <div className="wrap">
        <SectionHeader kicker={pillars.kicker} title={pillars.title} subtitle={pillars.intro} />

        <BentoGrid className="mt-12">
          {pillars.cards.map((card, index) => (
            <BentoCell
              key={card.title}
              href={card.href}
              span={index === 0 ? "2" : "1"}
              variant={index === 0 ? "featured" : "default"}
              index={index === 0 ? "Core" : undefined}
            >
              <h3
                className={`font-display text-xl font-semibold ${index === 0 ? "text-white md:text-2xl" : "text-navy"}`}
              >
                {card.title}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${index === 0 ? "text-white/72" : "text-muted"}`}>
                {card.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className={index === 0 ? "tag-pill tag-pill-light" : "stack-pill"}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </BentoCell>
          ))}
        </BentoGrid>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {pillars.stackGroups.map((group, groupIndex) => (
            <FadeIn key={group.title} delay={groupIndex * 0.08}>
              <BentoCell span="1" className="h-full" stagger={false}>
                <span className="tag-pill">{groupIndex === 0 ? "Stack" : "Training"}</span>
                <h3 className="mt-4 font-display text-lg font-semibold text-navy">{group.title}</h3>
                <div className="mt-5 space-y-5">
                  {group.blocks.map((block) => (
                    <div key={block.label}>
                      <div className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
                        {block.label}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {block.badges.map((badge) => (
                          <span key={badge} className="tech-pill">
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </BentoCell>
            </FadeIn>
          ))}
        </div>
      </div>
    </SectionReveal>
  );
}
