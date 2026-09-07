"use client";

import { about } from "@/lib/content";
import { Button, FadeIn, SectionHeading } from "@/components/ui/primitives";

export function AboutSection() {
  return (
    <section id="about" className="border-b border-line bg-white py-16">
      <div className="wrap">
        <SectionHeading
          kicker={about.kicker}
          title={about.title}
          notes={about.signals}
        />
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <FadeIn>
            <div className="space-y-4 text-sm text-muted">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>
                  {paragraph.includes("I'm Mohammad Moin") ? (
                    <>
                      <strong className="text-ink">
                        I&apos;m Mohammad Moin, an independent software engineering consultant
                        and corporate technology trainer.
                      </strong>{" "}
                      I work at the intersection of <strong>building</strong> and{" "}
                      <strong>teaching</strong>. As a full stack engineer, I design and ship web
                      and mobile applications across the JavaScript ecosystem — Angular, React,
                      Vue, Node, React Native — leading delivery from architecture through
                      production.
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
              <Button href={about.cta.href} variant="outline">
                {about.cta.label}
              </Button>
            </div>
          </FadeIn>
          <FadeIn delay={0.12}>
            <aside className="rounded-[var(--radius-card)] border border-line bg-[linear-gradient(135deg,#f8faff,#fff)] p-6 shadow-[0_18px_40px_-34px_rgba(20,35,63,0.25)]">
              <p className="font-display text-[clamp(22px,2.4vw,30px)] font-semibold leading-snug text-navy">
                “{about.quote}”
              </p>
            </aside>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
