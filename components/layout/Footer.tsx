"use client";

import { footer } from "@/lib/content";
import { AuroraBackground } from "@/components/motion/AuroraBackground";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { TextReveal } from "@/components/motion/TextReveal";
import { BentoCell, BentoGrid } from "@/components/ui/BentoGrid";
import { FadeIn } from "@/components/ui/primitives";

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-line bg-white py-20">
      <AuroraBackground variant="footer" />
      <div className="wrap relative">
        <FadeIn>
          <div className="kicker mb-3">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-blue" />
            {footer.eyebrow}
          </div>
          <TextReveal as="h2" text={footer.title} className="section-title max-w-3xl" />
          <div className="mt-8">
            <MagneticButton href={footer.cta.href} variant="primary">
              {footer.cta.label} ↗
            </MagneticButton>
          </div>
        </FadeIn>

        <BentoGrid className="mt-12">
          <BentoCell span="2">
            <p className="text-sm leading-relaxed text-muted">{footer.note}</p>
          </BentoCell>
          <BentoCell span="1">
            <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-muted">
              {footer.location.label}
            </span>
            <strong className="mt-2 block font-display text-xl text-navy">{footer.location.city}</strong>
            <small className="mt-1 block text-xs text-muted">{footer.location.note}</small>
          </BentoCell>
        </BentoGrid>

        <nav className="mt-8 flex flex-wrap gap-3" aria-label="Footer navigation">
          {footer.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="glass-card rounded-lg px-3 py-2 text-xs font-bold text-blue-deep no-underline transition hover:border-blue/30"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-10 flex flex-wrap gap-4 text-[11px] font-semibold text-muted">
          {footer.bottom.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
