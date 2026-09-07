"use client";

import { cn } from "@/lib/utils";

export function AuroraBackground({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "footer";
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {/* Monochrome atmosphere — gray luminance only, single blue whisper */}
      <div
        className="aurora-blob left-[-8%] top-[-12%] h-[400px] w-[400px] bg-white/10"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="aurora-blob right-[-6%] top-[8%] h-[320px] w-[320px] bg-white/[0.06]"
        style={{ animationDelay: "-8s" }}
      />
      <div
        className="aurora-blob bottom-[-8%] left-[40%] h-[260px] w-[260px] bg-blue/15"
        style={{ animationDelay: "-14s" }}
      />
      {variant === "footer" ? (
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(250,250,250,0.98),transparent_65%)]" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.5),transparent_55%)]" />
      )}
      <div className="mono-grid absolute inset-0 opacity-80" />
    </div>
  );
}
