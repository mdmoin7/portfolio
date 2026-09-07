"use client";

import { pillars } from "@/lib/content";
import {
  FadeIn,
  SectionHeading,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function PillarsSection() {
  return (
    <section id="stack" className="border-b border-line bg-white py-16">
      <div className="wrap">
        <SectionHeading
          kicker={pillars.kicker}
          title={pillars.title}
          notes={pillars.notes}
        />
        <FadeIn>
          <p className="mb-8 max-w-4xl text-sm text-muted">{pillars.intro}</p>
        </FadeIn>

        <StaggerContainer className="grid gap-4 lg:grid-cols-3 xl:grid-cols-5">
          {pillars.cards.map((card) => (
            <StaggerItem key={card.title}>
              <a
                href={card.href}
                className="glass-card block h-full p-5 no-underline transition hover:-translate-y-1 hover:border-blue/25"
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-blue-soft text-blue">
                  ◈
                </div>
                <h3 className="font-display text-lg font-semibold text-navy">{card.title}</h3>
                <p className="mt-2 text-sm text-muted">{card.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "rounded-md border border-line bg-surface px-2 py-1 text-[10px] font-bold text-muted",
                        tag.startsWith("+") && "text-blue-deep",
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </a>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="mt-12 space-y-8">
          {pillars.stackGroups.map((group) => (
            <FadeIn key={group.title}>
              <div className="glass-card p-6">
                <div className="mb-5 font-display text-xl font-semibold text-navy">
                  {group.title}
                </div>
                <div className="space-y-5">
                  {group.blocks.map((block) => (
                    <div key={block.label}>
                      <div className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted">
                        {block.label}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {block.badges.map((badge) => (
                          <span
                            key={badge.label}
                            className={cn(
                              "rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-bold text-muted",
                              badge.lead && "border-blue/20 bg-blue-soft text-blue-deep",
                              badge.more && "border-gold/25 bg-gold-soft/50 text-blue-deep",
                            )}
                          >
                            {badge.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
