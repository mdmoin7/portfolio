"use client";

import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const track = [...items, ...items];

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
      <div className="marquee-track flex w-max gap-3 py-1">
        {track.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="whitespace-nowrap rounded-full border border-violet/15 bg-blue-soft px-5 py-2.5 text-sm font-semibold text-navy"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
