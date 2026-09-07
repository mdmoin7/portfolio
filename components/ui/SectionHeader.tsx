"use client";

import { TextReveal } from "@/components/motion/TextReveal";
import { LineReveal } from "@/components/motion/TextReveal";
import { FadeIn } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function SectionHeader({
  kicker,
  title,
  subtitle,
  className,
  align = "left",
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <FadeIn className={cn("relative", align === "center" && "mx-auto max-w-3xl text-center", className)}>
      <div
        className={cn(
          "mb-5 flex items-center gap-4",
          align === "center" && "justify-center",
        )}
      >
        <span className="kicker rounded-full border border-blue/15 bg-blue-soft px-3.5 py-1.5 shadow-[0_8px_24px_-16px_rgba(36,84,216,0.45)]">
          {kicker}
        </span>
        <span
          className={cn(
            "section-header-rule hidden h-px md:block",
            align === "center" ? "w-16" : "max-w-[140px] flex-1",
          )}
          aria-hidden="true"
        />
      </div>
      <TextReveal as="h2" text={title} className="section-title max-w-3xl" />
      {subtitle ? (
        <LineReveal delay={0.12} className={cn("mt-4 max-w-2xl", align === "center" && "mx-auto")}>
          <p className="text-[16px] leading-relaxed text-muted">{subtitle}</p>
        </LineReveal>
      ) : null}
    </FadeIn>
  );
}
