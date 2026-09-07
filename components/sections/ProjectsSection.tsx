"use client";

import { motion } from "framer-motion";
import { projects } from "@/lib/content";
import {
  SectionHeading,
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/primitives";

function ProjectVisual({ type }: { type: "dashboard" | "shop" | "consulting" }) {
  if (type === "dashboard") {
    return (
      <div className="rounded-xl border border-line bg-[linear-gradient(180deg,#f8faff,#eef3ff)] p-4">
        <div className="mb-3 h-3 rounded bg-white" />
        <div className="mb-2 h-2 rounded bg-white/80" />
        <div className="mb-4 h-2 w-2/3 rounded bg-white/80" />
        <div className="h-24 rounded-lg bg-[linear-gradient(135deg,#2454d8,#7aa2ff)] opacity-80" />
      </div>
    );
  }

  if (type === "shop") {
    return (
      <div className="rounded-xl border border-line bg-[linear-gradient(180deg,#fff,#f7f9fc)] p-4">
        <div className="mb-3 h-3 rounded bg-surface" />
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="aspect-[4/3] rounded-md bg-blue-soft" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-[180px] items-center justify-center rounded-xl border border-line bg-navy p-6 text-center font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-blue-soft">
      Architecture
      <br />
      Consulting
      <br />
      <strong className="mt-2 block text-white">Delivery · Teams · Systems</strong>
    </div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="border-b border-line bg-white py-16">
      <div className="wrap">
        <SectionHeading
          kicker={projects.kicker}
          title={projects.title}
          notes={projects.notes}
        />
        <StaggerContainer className="grid gap-6 xl:grid-cols-3">
          {projects.items.map((project) => (
            <StaggerItem key={project.title}>
              <motion.article
                whileHover={{ y: -6 }}
                className="grid h-full gap-5 rounded-[var(--radius-card)] border border-line bg-surface p-5 lg:grid-cols-[0.95fr_1.05fr]"
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                >
                  <ProjectVisual type={project.visual} />
                </motion.div>
                <div>
                  <span className="rounded-full border border-line bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-blue-deep">
                    {project.tag}
                  </span>
                  <h3 className="mt-3 font-display text-2xl font-semibold text-navy">
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
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-line bg-white px-2 py-1 text-[10px] font-bold text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.link.href}
                    target={project.link.external ? "_blank" : undefined}
                    rel={project.link.external ? "noopener noreferrer" : undefined}
                    className="mt-4 inline-flex text-sm font-extrabold text-blue no-underline hover:underline"
                  >
                    {project.link.label}
                  </a>
                </div>
              </motion.article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
