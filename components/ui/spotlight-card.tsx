"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SpotlightCardProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
};

export function SpotlightCard({
  as: Component = "article",
  className,
  children,
  onMouseMove,
  ...props
}: SpotlightCardProps) {
  const handleMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    onMouseMove?.(event);
  };

  return React.createElement(
    Component,
    {
      ...props,
      className: cn("spotlight-card", className),
      onMouseMove: handleMove,
    },
    React.createElement("span", { className: "spotlight-card-glow", "aria-hidden": true }),
    React.createElement("div", { className: "spotlight-card-content" }, children),
  );
}
