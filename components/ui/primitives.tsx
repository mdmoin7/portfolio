"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  variant?: "primary" | "outline" | "ghost";
  href?: string;
  external?: boolean;
  children: React.ReactNode;
};

export function Button({
  className,
  variant = "primary",
  href,
  external,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg border px-3.5 py-2.5 text-xs font-extrabold transition duration-200 hover:-translate-y-0.5",
    variant === "primary" &&
      "border-transparent bg-blue text-white shadow-[0_10px_22px_-17px_var(--color-blue)]",
    variant === "outline" &&
      "border-[#bfcff0] bg-white text-blue hover:border-blue/30",
    variant === "ghost" && "border-transparent bg-transparent text-white/90 hover:bg-white/10",
    className,
  );

  if (href) {
    return (
      <motion.a
        whileTap={{ scale: 0.98 }}
        className={classes}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

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
      <div className="kicker mb-3">{kicker}</div>
      <h2 className="section-title">{title}</h2>
      {notes?.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {notes.map((note) => (
            <span
              key={note}
              className={cn(
                "rounded-full border border-line bg-surface px-3 py-1 text-[10px] font-bold text-muted",
                note.startsWith("+") && "text-blue-deep",
              )}
            >
              {note}
            </span>
          ))}
        </div>
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
