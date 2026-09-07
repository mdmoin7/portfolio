"use client";

import { projects } from "@/lib/content";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { BentoCell, BentoGrid } from "@/components/ui/BentoGrid";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ProjectsSection() {
  return (
    <SectionReveal id="projects" className="section-bg-muted border-b border-line">
      <div className="wrap">
        <SectionHeader kicker={projects.kicker} title={projects.title} subtitle={projects.subtitle} />
        <BentoGrid className="mt-12">
          {projects.items.map((project, index) => {
            const featured = project.span === "2";
            return (
              <BentoCell key={project.title} span={project.span} variant={featured ? "featured" : "default"}>
                <span className={featured ? "tag-pill tag-pill-light" : "tag-pill"}>{project.tag}</span>
                <h3
                  className={`mt-4 font-display text-2xl font-semibold ${featured ? "text-white" : "text-navy"}`}
                >
                  {project.titleHref ? (
                    <a
                      href={project.titleHref}
                      className={`no-underline ${featured ? "text-white hover:text-blue-glow" : "hover:text-blue"}`}
                    >
                      {project.title}
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                <p className={`mt-3 text-sm leading-relaxed ${featured ? "text-white/70" : "text-muted"}`}>
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className={featured ? "tech-pill tech-pill-light" : "tech-pill"}>
                      {t}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link.href}
                  target={project.link.external ? "_blank" : undefined}
                  rel={project.link.external ? "noopener noreferrer" : undefined}
                  className={`mt-5 inline-flex text-sm font-bold no-underline ${featured ? "text-blue-glow hover:underline" : "text-blue hover:underline"}`}
                >
                  {project.link.label}
                </a>
                {!featured ? (
                  <span className="absolute bottom-6 right-6 font-mono text-[10px] font-bold text-blue-deep/40">
                    0{index + 1}
                  </span>
                ) : null}
              </BentoCell>
            );
          })}
        </BentoGrid>
      </div>
    </SectionReveal>
  );
}
