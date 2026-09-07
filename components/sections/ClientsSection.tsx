"use client";

import { clients } from "@/lib/content";
import { Marquee } from "@/components/motion/Marquee";
import { LineReveal } from "@/components/motion/TextReveal";

export function ClientsSection() {
  return (
    <section className="border-b border-line bg-white py-12">
      <div className="wrap">
        <LineReveal>
          <p className="mb-5 text-center text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">
            {clients.label}
          </p>
        </LineReveal>
        <Marquee items={clients.names.filter((n) => !n.startsWith("+"))} />
        <p className="mt-4 text-center text-xs font-semibold text-muted">+ Many more</p>
      </div>
    </section>
  );
}
