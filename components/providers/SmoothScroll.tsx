"use client";

import { ReactLenis } from "lenis/react";
import { useEffect } from "react";
import { useReducedMotion } from "@/lib/motion";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const root = document.documentElement;
    root.classList.add("lenis", "lenis-smooth");

    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".reimagine section:not(.hero-v2), .reimagine .spotlight-card, .reimagine .motion-footer"
      )
    );

    revealTargets.forEach((element) => element.classList.add("scroll-reveal"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    revealTargets.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
      root.classList.remove("lenis", "lenis-smooth");
    };
  }, [reducedMotion]);

  return (
    <ReactLenis
      root
      options={{
        duration: 0.9,
        easing: (t: number) => 1 - Math.pow(1 - t, 4),
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 1,
        smoothTouch: false,
        syncTouch: false,
        autoRaf: true,
        anchors: true,
        prevent: (node: HTMLElement) => node.hasAttribute("data-lenis-prevent"),
      }}
    >
      {children}
    </ReactLenis>
  );
}
