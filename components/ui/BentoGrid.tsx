"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { StaggerItem } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

type BentoCellProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  external?: boolean;
  span?: "1" | "2" | "3" | "row-2";
  variant?: "default" | "featured" | "quote";
  index?: string;
  stagger?: boolean;
};

const spanClass = {
  "1": "",
  "2": "md:col-span-2",
  "3": "md:col-span-3",
  "row-2": "md:row-span-2",
};

const variantClass = {
  default: "bento-card",
  featured: "bento-card bento-featured text-white",
  quote: "bento-card bento-quote",
};

export function BentoGrid({
  children,
  className,
  stagger = true,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: boolean;
}) {
  const grid = (
    <div className={cn("grid gap-4 md:grid-cols-3 md:gap-5", className)}>{children}</div>
  );

  if (!stagger) return grid;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {grid}
    </motion.div>
  );
}

export function BentoCell({
  children,
  className,
  href,
  external,
  span = "1",
  variant = "default",
  index,
  stagger = true,
}: BentoCellProps) {
  const classes = cn(
    "group relative overflow-hidden p-6 transition duration-300 md:p-7",
    "hover:-translate-y-1",
    variantClass[variant],
    variant === "default" &&
      "hover:border-blue/25 hover:shadow-[0_28px_60px_-38px_rgba(36,84,216,0.35)]",
    variant === "featured" &&
      "hover:shadow-[0_32px_70px_-30px_rgba(36,84,216,0.45)]",
    spanClass[span],
    className,
  );

  const inner = (
    <>
      <div
        className={cn(
          "bento-accent-bar",
          variant === "featured" && "bento-accent-bar-light",
        )}
        aria-hidden="true"
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100",
          variant === "featured"
            ? "bg-[radial-gradient(circle_at_20%_0%,rgba(88,166,255,0.18),transparent_55%)]"
            : "bg-[radial-gradient(circle_at_20%_0%,rgba(36,84,216,0.08),transparent_55%)]",
        )}
      />
      <div className="relative flex h-full flex-col">
        {index ? (
          <span
            className={cn(
              "mb-4 inline-flex w-fit font-mono text-[11px] font-extrabold tracking-[0.14em]",
              variant === "featured" ? "text-blue-glow/90" : "text-blue-deep/70",
            )}
          >
            {index}
          </span>
        ) : null}
        {children}
      </div>
    </>
  );

  const cell = href ? (
    <motion.div whileHover={{ scale: 1.008 }} className={classes}>
      {external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full no-underline text-inherit"
        >
          {inner}
        </a>
      ) : (
        <Link href={href} className="block h-full no-underline text-inherit">
          {inner}
        </Link>
      )}
    </motion.div>
  ) : (
    <motion.div whileHover={{ scale: 1.008 }} className={classes}>
      {inner}
    </motion.div>
  );

  return stagger ? <StaggerItem>{cell}</StaggerItem> : cell;
}
