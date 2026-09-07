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
        className="aurora-blob left-[-12%] top-[-18%] h-[460px] w-[460px] bg-violet/45"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="aurora-blob right-[-8%] top-[2%] h-[380px] w-[380px] bg-cyan/30"
        style={{ animationDelay: "-5s" }}
      />
      <div
        className="aurora-blob bottom-[-12%] left-[35%] h-[320px] w-[320px] bg-blue/35"
        style={{ animationDelay: "-10s" }}
      />
      <div
        className="aurora-blob right-[20%] bottom-[10%] h-[240px] w-[240px] bg-violet/25"
        style={{ animationDelay: "-14s" }}
      />
      {variant === "footer" ? (
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(248,247,255,0.96),transparent_62%)]" />
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(3,3,8,0.45),transparent_55%)]" />
      )}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,85,247,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.7) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />
    </div>
  );
}
