"use client";

import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
  fade = "light",
}: {
  items: string[];
  className?: string;
  fade?: "light" | "muted";
}) {
  const track = [...items, ...items];
  const fadeFrom = fade === "muted" ? "from-[#f7f9fc]" : "from-white";

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r to-transparent",
          fadeFrom,
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l to-transparent",
          fadeFrom,
        )}
      />
      <div className="marquee-track flex w-max gap-3 py-1">
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="whitespace-nowrap rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-navy shadow-[0_10px_30px_-20px_rgba(10,22,40,0.25)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
