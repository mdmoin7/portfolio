"use client";

import { projects } from "@/lib/content";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { BentoCell, BentoGrid } from "@/components/ui/BentoGrid";
import { FadeIn } from "@/components/ui/primitives";

export function ProjectsSection() {
  return (
    <SectionReveal id="projects" className="border-b border-line bg-surface">
      <div className="wrap">
        <FadeIn>
          <div className="kicker mb-3">{projects.kicker}</div>
          <TextReveal as="h2" text={projects.title} className="section-title max-w-3xl" />
          <p className="mt-4 max-w-2xl text-muted">{projects.subtitle}</p>
        </FadeIn>
        <BentoGrid className="mt-10">
          {projects.items.map((project) => (
            <BentoCell key={project.title} span={project.span}>
              <span className="rounded-full border border-blue/15 bg-blue-soft px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-blue-deep">
                {project.tag}
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold text-navy">
                {project.titleHref ? (
                  <a href={project.titleHref} className="no-underline hover:text-blue">
                    {project.title}
                  </a>
                ) : (
                  project.title
                )}
              </h3>
              <p className="mt-2 text-sm text-muted">{project.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <span key={t} className="rounded-md border border-line bg-white px-2 py-1 text-[10px] font-bold text-muted">
                    {t}
                  </span>
                ))}
              </div>
              <a
                href={project.link.href}
                target={project.link.external ? "_blank" : undefined}
                rel={project.link.external ? "noopener noreferrer" : undefined}
                className="mt-4 inline-flex text-sm font-bold text-blue no-underline hover:underline"
              >
                {project.link.label}
              </a>
            </BentoCell>
          ))}
        </BentoGrid>
      </div>
    </SectionReveal>
  );
}
