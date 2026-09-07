"use client";

import { motion } from "framer-motion";
import { footer } from "@/lib/content";
import { FadeIn } from "@/components/ui/primitives";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-[linear-gradient(180deg,#fff_0%,#f8faff_100%)] py-16">
      <div className="wrap">
        <FadeIn>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.08em] text-blue-deep">
                <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                {footer.eyebrow}
              </div>
              <h2 className="font-display text-[clamp(32px,4vw,52px)] font-semibold leading-[1.05] tracking-[-0.03em] text-navy">
                Have a project, a team,
                <br />
                or a technical challenge?
              </h2>
            </div>
            <motion.a
              href={footer.cta.href}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group inline-flex items-center gap-4 rounded-2xl border border-line bg-white px-6 py-4 text-sm font-extrabold text-navy no-underline shadow-[0_18px_40px_-28px_rgba(20,35,63,0.45)]"
            >
              <span>{footer.cta.label}</span>
              <b className="text-blue transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </b>
            </motion.a>
          </div>
        </FadeIn>

        <div className="my-8 h-px bg-line" />

        <FadeIn delay={0.08}>
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_0.8fr]">
            <p className="max-w-xl text-sm text-muted">{footer.note}</p>
            <nav className="flex flex-wrap gap-3" aria-label="Footer navigation">
              {footer.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="rounded-lg border border-line bg-white px-3 py-2 text-xs font-extrabold text-blue-deep no-underline transition hover:border-blue/30 hover:bg-blue-soft"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-[0.08em] text-muted">
                {footer.location.label}
              </span>
              <strong className="mt-1 block font-display text-xl text-navy">
                {footer.location.city}
              </strong>
              <small className="mt-1 block text-xs text-muted">
                {footer.location.note}
              </small>
            </div>
          </div>
        </FadeIn>

        <div className="mt-10 flex flex-wrap gap-4 text-[11px] font-semibold text-muted">
          {footer.bottom.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
