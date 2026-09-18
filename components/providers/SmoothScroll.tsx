"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "@/lib/motion";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.88,
      touchMultiplier: 0.9,
      anchors: false,
      autoRaf: false,
    });

    const root = document.documentElement;
    root.classList.add("lenis", "lenis-smooth");

    let frame = 0;
    let destroyed = false;

    const raf = (time: number) => {
      if (destroyed) return;
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    const handleAnchor = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target as Element | null;
      const link = target?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!link) return;

      const href = link.getAttribute("href");
      if (!href || href === "#" || link.hasAttribute("download")) return;

      const id = decodeURIComponent(href.slice(1));
      const destination = document.getElementById(id);
      if (!destination) return;

      event.preventDefault();
      lenis.scrollTo(destination, {
        offset: -24,
        duration: 1.25,
        lock: true,
        force: true,
      });
      window.history.replaceState(null, "", href);
    };

    const handleResize = () => {
      lenis.resize();
    };

    document.addEventListener("click", handleAnchor);
    window.addEventListener("resize", handleResize);

    frame = requestAnimationFrame(raf);

    return () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      document.removeEventListener("click", handleAnchor);
      window.removeEventListener("resize", handleResize);
      lenis.destroy();
      root.classList.remove("lenis", "lenis-smooth");
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
