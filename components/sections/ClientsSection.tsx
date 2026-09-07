"use client";

import { motion } from "framer-motion";
import { clients } from "@/lib/content";
import { FadeIn } from "@/components/ui/primitives";

export function ClientsSection() {
  return (
    <section className="border-b border-line bg-white py-12">
      <div className="wrap">
        <FadeIn>
          <p className="mb-4 text-center text-[11px] font-extrabold uppercase tracking-[0.12em] text-muted">
            {clients.label}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {clients.names.map((name, index) => (
              <motion.span
                key={name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  delay: index * 0.06,
                  type: "spring",
                  stiffness: 260,
                  damping: 18,
                }}
                whileHover={{ y: -3, scale: 1.03 }}
                className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-extrabold text-navy"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
