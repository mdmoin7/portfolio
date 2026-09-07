"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function BlurText({
  text,
  play = true,
  delay = 45,
  animateBy = "letters",
  direction = "top",
  className,
  itemClassName,
  nowrap = false,
  as: Tag = "span",
}: {
  text: string;
  play?: boolean;
  delay?: number;
  animateBy?: "words" | "letters";
  direction?: "top" | "bottom";
  className?: string;
  itemClassName?: string;
  nowrap?: boolean;
  as?: "span" | "p" | "h1" | "h2";
}) {
  const segments = animateBy === "words" ? text.split(" ") : text.split("");
  const offset = direction === "top" ? -22 : 22;

  return (
    <Tag
      className={cn(
        "inline-flex justify-center",
        nowrap ? "flex-nowrap whitespace-nowrap" : "flex-wrap",
        className,
      )}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={`${segment}-${index}`}
          initial={{ opacity: 0, filter: "blur(12px)", y: offset }}
          animate={
            play
              ? { opacity: 1, filter: "blur(0px)", y: 0 }
              : { opacity: 0, filter: "blur(12px)", y: offset }
          }
          transition={{
            duration: 0.55,
            delay: (index * delay) / 1000,
            ease,
          }}
          className={cn("inline-block", itemClassName)}
        >
          {segment}
          {animateBy === "words" && index < segments.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </Tag>
  );
}
