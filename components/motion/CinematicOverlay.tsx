"use client";

import { cn } from "@/lib/utils";

export function CinematicOverlay({
  className,
  letterbox = false,
  grain = true,
  vignette = true,
  sweep = false,
}: {
  className?: string;
  letterbox?: boolean;
  grain?: boolean;
  vignette?: boolean;
  sweep?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {letterbox ? (
        <>
          <div className="cinematic-bar cinematic-bar-top" />
          <div className="cinematic-bar cinematic-bar-bottom" />
        </>
      ) : null}
      {vignette ? <div className="cinematic-vignette" /> : null}
      {grain ? <div className="cinematic-grain" /> : null}
      {sweep ? <div className="cinematic-sweep" /> : null}
    </div>
  );
}
