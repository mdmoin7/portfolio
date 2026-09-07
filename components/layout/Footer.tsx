"use client";

import { motion } from "framer-motion";
import { footer } from "@/lib/content";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { FadeIn } from "@/components/ui/primitives";

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative overflow-hidden border-t border-line bg-[linear-gradient(180deg,#f8faff_0%,#fff_45%,#f7f9fc_100%)] py-16 md:py-20"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue/25 to-transparent"
      />
      <div className="wrap relative">
        <FadeIn>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.12em] text-blue-deep">
                <span className="h-1.5 w-1.5 rounded-full bg-blue shadow-[0_0_0_3px_rgba(36,84,216,0.15)]" />
                {footer.eyebrow}
              </div>
              <h2 className="font-display text-[clamp(30px,4vw,52px)] font-semibold leading-[1.06] tracking-[-0.03em] text-navy">
                Have a project, a team,
                <br />
                or a technical challenge?
              </h2>
            </div>
            <MagneticButton
              href={footer.cta.href}
              variant="primary"
              className="shrink-0 self-start lg:self-auto"
            >
              {footer.cta.label} ↗
            </MagneticButton>
          </div>
        </FadeIn>

        <div className="my-8 h-px bg-line md:my-10" />

        <FadeIn delay={0.06}>
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,0.85fr)] md:gap-8 md:items-start">
            <p className="max-w-md text-sm leading-relaxed text-muted">{footer.note}</p>

            <nav className="flex flex-col gap-2" aria-label="Footer navigation">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                Connect
              </span>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
                {footer.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="inline-flex w-fit items-center rounded-lg border border-line bg-white px-3.5 py-2 text-xs font-extrabold text-blue-deep no-underline transition hover:border-blue/25 hover:bg-blue-soft hover:text-blue"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>

            <div className="md:text-right">
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-muted">
                {footer.location.label}
              </span>
              <strong className="mt-2 block font-display text-xl text-navy">
                {footer.location.city}
              </strong>
              <small className="mt-1 block text-xs leading-relaxed text-muted">
                {footer.location.note}
              </small>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 text-[11px] font-semibold text-muted sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
            {footer.bottom.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
