"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BentoCellProps = {
  children: React.ReactNode;
  className?: string;
  href?: string;
  external?: boolean;
  span?: "1" | "2" | "3" | "row-2";
};

const spanClass = {
  "1": "",
  "2": "md:col-span-2",
  "3": "md:col-span-3",
  "row-2": "md:row-span-2",
};

export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-3", className)}>{children}</div>
  );
}

export function BentoCell({
  children,
  className,
  href,
  external,
  span = "1",
}: BentoCellProps) {
  const classes = cn(
    "glass-card group relative overflow-hidden p-6 transition duration-300",
    "hover:-translate-y-1 hover:border-blue/25 hover:shadow-[0_28px_60px_-38px_rgba(36,84,216,0.35)]",
    spanClass[span],
    className,
  );

  const inner = (
    <>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(36,84,216,0.08),transparent_55%)] opacity-0 transition group-hover:opacity-100" />
      <div className="relative">{children}</div>
    </>
  );

  if (href) {
    const Tag = external ? "a" : Link;
    return (
      <motion.div whileHover={{ scale: 1.01 }} className={classes}>
        <Tag
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="block h-full no-underline text-inherit"
        >
          {inner}
        </Tag>
      </motion.div>
    );
  }

  return (
    <motion.div whileHover={{ scale: 1.01 }} className={classes}>
      {inner}
    </motion.div>
  );
}
