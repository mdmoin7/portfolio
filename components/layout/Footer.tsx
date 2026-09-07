"use client";

import { footer } from "@/lib/content";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { FadeIn } from "@/components/ui/primitives";

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_20%_0%,rgba(36,84,216,0.22),transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_100%,rgba(201,162,39,0.1),transparent_50%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-glow/40 to-transparent"
      />

      <div className="wrap relative py-16 md:py-20">
        <FadeIn>
          <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-sm md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <div className="mb-4 inline-flex items-center gap-2 font-mono text-[10px] font-extrabold uppercase tracking-[0.14em] text-blue-glow">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold shadow-[0_0_0_3px_rgba(201,162,39,0.25)]" />
                  {footer.eyebrow}
                </div>
                <h2 className="font-display text-[clamp(28px,3.8vw,48px)] font-semibold leading-[1.08] tracking-[-0.03em] text-white">
                  {footer.title}
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/65">{footer.note}</p>
              </div>
              <MagneticButton href={footer.cta.href} variant="primary" className="shrink-0 self-start">
                {footer.cta.label} ↗
              </MagneticButton>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                Services
              </span>
              <div className="mt-4 flex flex-col gap-2">
                {footer.links.slice(0, 2).map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="w-fit text-sm font-semibold text-white/80 no-underline transition hover:text-gold"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                Connect
              </span>
              <div className="mt-4 flex flex-col gap-2">
                {footer.links.slice(2).map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="w-fit text-sm font-semibold text-white/80 no-underline transition hover:text-blue-glow"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="md:text-right">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/45">
                {footer.location.label}
              </span>
              <strong className="mt-3 block font-display text-2xl text-white">
                {footer.location.city}
              </strong>
              <small className="mt-2 block text-sm text-white/55">{footer.location.note}</small>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.12}>
          <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[11px] font-semibold text-white/45 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            {footer.bottom.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
        </FadeIn>
      </div>
    </footer>
  );
}
