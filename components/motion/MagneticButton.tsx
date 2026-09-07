"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/motion";

type MagneticButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  external?: boolean;
  variant?: "primary" | "glass" | "outline";
};

export function MagneticButton({
  href,
  children,
  className,
  external,
  variant = "primary",
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (reducedMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    setOffset({ x: x * 0.18, y: y * 0.18 });
  };

  const reset = () => setOffset({ x: 0, y: 0 });

  const variants = {
    primary:
      "border border-violet/35 bg-gradient-to-r from-violet to-blue-deep text-white shadow-[0_16px_40px_-18px_rgba(139,92,246,0.75)] hover:from-violet hover:to-violet",
    glass:
      "border border-cyan/25 bg-white/8 text-white backdrop-blur-md hover:border-cyan/40 hover:bg-cyan/10",
    outline:
      "border border-line bg-white text-navy hover:border-violet/30 hover:bg-blue-soft",
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      animate={{ x: offset.x, y: offset.y }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 350, damping: 18, mass: 0.4 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-3 text-sm font-semibold no-underline transition-colors duration-200",
        variants[variant],
        className,
      )}
    >
      <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.22),transparent_55%)]" />
      <span className="relative">{children}</span>
    </motion.a>
  );
}
