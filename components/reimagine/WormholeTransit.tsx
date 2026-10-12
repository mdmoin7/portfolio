"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { swellCinematicAudio } from "@/components/audio/CinematicAudio";

/**
 * Wormhole transit: every act change flings the visitor through a lensing
 * ring with hyperspace streaks (0.95s, self-terminating CSS animation) and
 * swells the score. Skipped on the first act and for reduced motion.
 */
export function WormholeTransit({ act }: { act: string }) {
  const reduce = useReducedMotion();
  const first = useRef(true);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reduce) return;
    /* Fire through the rAF channel rather than a synchronous setState —
       the effect itself must not cascade renders. */
    const id = requestAnimationFrame(() => setPulse((p) => p + 1));
    swellCinematicAudio();
    return () => cancelAnimationFrame(id);
  }, [act, reduce]);

  if (reduce || pulse === 0) return null;

  /* Keyed remount restarts the CSS animations on every transit. */
  return (
    <div key={pulse} className="mo-wormhole" aria-hidden="true">
      <span className="mo-wormhole-streaks" />
      <span className="mo-wormhole-ring" />
    </div>
  );
}
