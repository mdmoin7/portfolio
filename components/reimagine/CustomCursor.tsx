"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ranger-class cursor: a delta ship that chases the pointer, banks into its
 * turns and burns harder the faster it moves, plus a lagging target-lock
 * reticle that snaps to interactive elements.
 * Only mounts on fine pointers where the visitor hasn't asked for reduced
 * motion — everyone else keeps the native cursor.
 */
export function CustomCursor() {
  const shipRef = useRef<HTMLDivElement>(null);
  const plumeRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [visible, setVisible] = useState(false);
  const [down, setDown] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("mo-has-cursor");

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let sx = x;
    let sy = y;
    let rx = x;
    let ry = y;
    let angle = -90; /* radians→deg heading; -90 points the ship up */
    let lastSx = x;
    let lastSy = y;
    let thrust = 0;
    let pressed = false;
    let raf = 0;

    const INTERACTIVE =
      "a, button, input, textarea, [role='button'], .mo-row, .mo-station, .mo-dot";

    const onMove = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;
      setVisible(true);

      const el = document.elementFromPoint(x, y);
      const target = el?.closest?.(INTERACTIVE) as HTMLElement | null;
      if (target) {
        const r = target.getBoundingClientRect();
        /* Steer toward the target's centre so the lock reads as magnetic. */
        x = r.left + r.width / 2;
        y = r.top + r.height / 2;
        setLabel(
          target.getAttribute("data-cursor") ??
            (target.tagName === "A" || target.tagName === "BUTTON" ? "open" : ""),
        );
      } else {
        setLabel("");
      }
    };
    const onDown = () => {
      pressed = true;
      setDown(true);
    };
    const onUp = () => {
      pressed = false;
      setDown(false);
    };
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    const tick = () => {
      /* The ship chases the aim point with weight; heading follows the
         velocity vector, so it banks through turns instead of snapping. */
      sx += (x - sx) * 0.2;
      sy += (y - sy) * 0.2;
      const dx = sx - lastSx;
      const dy = sy - lastSy;
      const speed = Math.hypot(dx, dy);
      if (speed > 0.6) {
        const target = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
        const diff = ((target - angle + 540) % 360) - 180;
        angle += diff * 0.2;
      }
      lastSx = sx;
      lastSy = sy;
      thrust += (Math.min(1, speed / 24) - thrust) * 0.15;

      if (shipRef.current) {
        shipRef.current.style.transform = `translate3d(${sx}px, ${sy}px, 0) rotate(${angle}deg)`;
      }
      if (plumeRef.current) {
        const burn = 0.7 + thrust * 1.6 + (pressed ? 0.6 : 0);
        plumeRef.current.style.transform = `translateX(-50%) scaleY(${burn})`;
      }
      if (ringRef.current) {
        rx += (x - rx) * 0.16;
        ry += (y - ry) * 0.16;
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    addEventListener("mousemove", onMove);
    addEventListener("mousedown", onDown);
    addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("mousemove", onMove);
      removeEventListener("mousedown", onDown);
      removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("mo-has-cursor");
    };
  }, []);

  /* Never mounted on touch / reduced-motion, so nothing to clean up. */
  if (typeof window !== "undefined") {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return null;
  }

  return (
    <div className="mo-cursor" aria-hidden="true">
      <div ref={shipRef} className={`mo-ship ${down ? "is-down" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none">
          {/* Hull — sleek delta arrowhead, nose up. */}
          <path
            d="M12 1.5 L14.8 9.2 L20.5 21 L12 16.6 L3.5 21 L9.2 9.2 Z"
            fill="#eef3ff"
            stroke="#f0a45a"
            strokeWidth="1"
            strokeLinejoin="round"
          />
          {/* Cockpit — amber glass. */}
          <path d="M12 4.6 L13.5 10.2 L12 9.1 L10.5 10.2 Z" fill="#f0a45a" />
        </svg>
        <span ref={plumeRef} className="mo-ship-plume" />
      </div>
      <div
        ref={ringRef}
        className={`mo-cursor-ring ${visible ? "is-visible" : ""} ${label ? "is-active" : ""}`}
      >
        {label ? <span className="mo-cursor-label">{label}</span> : null}
      </div>
    </div>
  );
}
