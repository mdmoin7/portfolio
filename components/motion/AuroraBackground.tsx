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
      <div
        className="aurora-blob left-[-10%] top-[-15%] h-[420px] w-[420px] bg-blue/40"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="aurora-blob right-[-5%] top-[5%] h-[360px] w-[360px] bg-blue-glow/25"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="aurora-blob bottom-[-10%] left-[30%] h-[300px] w-[300px] bg-gold/20"
        style={{ animationDelay: "-12s" }}
      />
      {variant === "footer" ? (
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(247,249,252,0.95),transparent_60%)]" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(5,11,22,0.35),transparent_55%)]" />
      )}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}
