"use client";

import { pillars } from "@/lib/content";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { BentoCell, BentoGrid } from "@/components/ui/BentoGrid";
import { FadeIn } from "@/components/ui/primitives";

export function PillarsSection() {
  return (
    <SectionReveal id="stack" className="border-b border-line bg-white">
      <div className="wrap">
        <FadeIn>
          <div className="kicker mb-3">{pillars.kicker}</div>
          <TextReveal as="h2" text={pillars.title} className="section-title max-w-3xl" />
          <p className="mt-4 max-w-3xl text-muted">{pillars.intro}</p>
        </FadeIn>

        <BentoGrid className="mt-10">
          {pillars.cards.map((card, index) => (
            <BentoCell
              key={card.title}
              href={card.href}
              span={index === 0 ? "2" : "1"}
            >
              <h3 className="font-display text-xl font-semibold text-navy">{card.title}</h3>
              <p className="mt-2 text-sm text-muted">{card.description}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {card.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-blue-soft px-2.5 py-1 text-[10px] font-bold text-blue-deep">
                    {tag}
                  </span>
                ))}
              </div>
            </BentoCell>
          ))}
        </BentoGrid>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {pillars.stackGroups.map((group) => (
            <FadeIn key={group.title}>
              <BentoCell span="1" className="h-full">
                <h3 className="font-display text-lg font-semibold text-navy">{group.title}</h3>
                <div className="mt-5 space-y-4">
                  {group.blocks.map((block) => (
                    <div key={block.label}>
                      <div className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.1em] text-muted">
                        {block.label}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {block.badges.map((badge) => (
                          <span
                            key={badge}
                            className="rounded-md border border-line bg-surface px-2.5 py-1 text-[11px] font-semibold text-ink"
                          >
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
