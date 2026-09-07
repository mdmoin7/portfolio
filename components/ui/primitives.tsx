"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/TextReveal";

export function SectionHeading({
  kicker,
  title,
  notes,
  className,
}: {
  kicker: string;
  title: string;
  notes?: string[];
  className?: string;
}) {
  return (
    <div className={cn("mb-8", className)}>
      <LineReveal>
        <div className="kicker mb-3">{kicker}</div>
      </LineReveal>
      <TextReveal as="h2" text={title} className="section-title" />
      {notes?.length ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mt-4 flex flex-wrap gap-2"
        >
          {notes.map((note) => (
            <span
              key={note}
              className={cn(
                "rounded-full border border-line bg-surface px-3 py-1 text-[10px] font-bold text-muted",
                note.startsWith("+") && "border-gold/30 bg-gold-soft/40 text-blue-deep",
              )}
            >
              {note}
            </span>
          ))}
        </motion.div>
      ) : null}
    </div>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
