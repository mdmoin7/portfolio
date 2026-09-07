import Link from "next/link";
import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/ui/primitives";
import type { SubpageSection } from "@/lib/subpages/types";
import { SubpageActions, SubpageCallout, TopicPills } from "./SubpageBlocks";

function SectionShell({
  muted,
  children,
}: {
  muted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "border-b border-line py-12 md:py-14",
        muted ? "section-bg-muted" : "section-bg-light",
      )}
    >
      <div className="wrap">{children}</div>
    </section>
  );
}

function SectionHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro?: string;
}) {
  return (
    <FadeIn>
      <span className="kicker">{kicker}</span>
      <h2 className="section-title mt-3">{title}</h2>
      {intro ? <p className="subpage-intro mt-4">{intro}</p> : null}
    </FadeIn>
  );
}

export function SubpageSections({ sections }: { sections: SubpageSection[] }) {
  return (
    <main>
      {sections.map((section, index) => {
        const key = `${section.type}-${section.kicker}-${index}`;

        if (section.type === "intro") {
          return (
            <SectionShell key={key} muted={section.muted}>
              <SectionHeader kicker={section.kicker} title={section.title} intro={section.intro} />
              {section.facts?.length ? (
                <FadeIn delay={0.06} className="mt-8 grid gap-3 sm:grid-cols-3">
                  {section.facts.map((fact) => (
                    <div key={fact.strong} className="subpage-fact">
                      <strong>{fact.strong}</strong>
                      <span>{fact.span}</span>
                    </div>
                  ))}
                </FadeIn>
              ) : null}
              {section.callout ? (
                <FadeIn delay={0.1} className="mt-6">
                  <SubpageCallout title={section.callout.title} body={section.callout.body} />
                </FadeIn>
              ) : null}
            </SectionShell>
          );
        }

        if (section.type === "cards") {
          return (
            <SectionShell key={key} muted={section.muted}>
              <SectionHeader kicker={section.kicker} title={section.title} intro={section.intro} />
              <div className="mt-8 grid gap-3.5 sm:grid-cols-2">
                {section.cards.map((card) => (
                  <FadeIn key={card.title}>
                    <article className="subpage-card h-full">
                      {card.tag ? <div className="tag-pill mb-3">{card.tag}</div> : null}
                      <h3 className="font-display text-lg font-semibold text-navy">{card.title}</h3>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">{card.description}</p>
                      {card.topics?.length ? (
                        <TopicPills topics={card.topics} className="mt-4" />
                      ) : null}
                      {card.actions?.length ? (
                        <div className="mt-4">
                          <SubpageActions actions={card.actions} />
                        </div>
                      ) : null}
                    </article>
                  </FadeIn>
                ))}
              </div>
              {section.callout ? (
                <FadeIn delay={0.08} className="mt-6">
                  <SubpageCallout title={section.callout.title} body={section.callout.body} />
                </FadeIn>
              ) : null}
            </SectionShell>
          );
        }

        if (section.type === "topics") {
          return (
            <SectionShell key={key} muted={section.muted}>
              <SectionHeader kicker={section.kicker} title={section.title} intro={section.intro} />
              <FadeIn delay={0.06} className="mt-6">
                <TopicPills topics={section.topics} />
              </FadeIn>
              {section.callout ? (
                <FadeIn delay={0.1} className="mt-6">
                  <SubpageCallout title={section.callout.title} body={section.callout.body} />
                </FadeIn>
              ) : null}
            </SectionShell>
          );
        }

        if (section.type === "steps") {
          return (
            <SectionShell key={key} muted={section.muted}>
              <SectionHeader kicker={section.kicker} title={section.title} intro={section.intro} />
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {section.steps.map((step) => (
                  <FadeIn key={step.number}>
                    <div className="subpage-step">
                      <span>{step.number}</span>
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </SectionShell>
          );
        }

        if (section.type === "decisions") {
          return (
            <SectionShell key={key} muted={section.muted}>
              <SectionHeader kicker={section.kicker} title={section.title} intro={section.intro} />
              <div className="mt-8 grid gap-3">
                {section.items.map((item) => (
                  <FadeIn key={item.title}>
                    <div className="subpage-decision">
                      <strong>{item.title}</strong>
                      <p>{item.body}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </SectionShell>
          );
        }

        if (section.type === "flow") {
          return (
            <SectionShell key={key} muted={section.muted}>
              <SectionHeader kicker={section.kicker} title={section.title} />
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {section.items.map((item) => (
                  <FadeIn key={item.title}>
                    <div className="subpage-flow-item">
                      <strong>{item.title}</strong>
                      <span>{item.subtitle}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>
              {section.topics?.length ? (
                <FadeIn delay={0.08} className="mt-6">
                  <TopicPills topics={section.topics} />
                </FadeIn>
              ) : null}
            </SectionShell>
          );
        }

        if (section.type === "links") {
          return (
            <SectionShell key={key} muted={section.muted}>
              <SectionHeader kicker={section.kicker} title={section.title} intro={section.intro} />
              <FadeIn delay={0.06} className="mt-6">
                <SubpageActions actions={section.links} />
              </FadeIn>
            </SectionShell>
          );
        }

        if (section.type === "related") {
          return (
            <SectionShell key={key} muted={section.muted}>
              <SectionHeader kicker={section.kicker} title={section.title} />
              <FadeIn delay={0.06} className="mt-6 flex flex-wrap gap-2.5">
                {section.links.map((link) => (
                  <Link key={link.href} href={link.href} className="subpage-related-link">
                    {link.label}
                  </Link>
                ))}
              </FadeIn>
            </SectionShell>
          );
        }

        if (section.type === "cta") {
          return (
            <section key={key} className="subpage-cta border-b border-line py-12 md:py-14">
              <div className="wrap">
                <FadeIn>
                  <span className="kicker">{section.kicker}</span>
                  <h2 className="section-title mt-3">{section.title}</h2>
                  {section.intro ? <p className="subpage-intro mt-4">{section.intro}</p> : null}
                  <div className="mt-6">
                    <SubpageActions actions={section.actions} />
                  </div>
                </FadeIn>
              </div>
            </section>
          );
        }

        return null;
      })}
    </main>
  );
}
