"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

export type ToonAct = {
  id: string;
  no: string;
  label: string;
  /** One-line walkthrough narration the toon speaks when this act is on screen. */
  tour?: string;
};

/**
 * Character-by-character reveal. Mounted with key={line} so each new line
 * starts fresh from a zero-initialized counter — no reset effect needed.
 * Under reduced motion the full text renders immediately.
 */
function TypeLine({ text, reduce }: { text: string; reduce: boolean | null }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) return;
    let i = 0;
    const id = globalThis.setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) globalThis.clearInterval(id);
    }, 17);
    return () => globalThis.clearInterval(id);
  }, [text, reduce]);

  return (
    <>
      {reduce ? text : text.slice(0, n)}
      <span className="cv-toon-caret" />
    </>
  );
}

/**
 * Speech bubble for one act's line. Mounted with key={act.id}, so arriving
 * at a new act remounts it: fresh entrance, fresh 7s auto-dismiss (fired
 * from the timer callback, not the effect body).
 */
function ToonBubble({
  actId,
  line,
  reduce,
}: {
  actId: string;
  line: string;
  reduce: boolean | null;
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = globalThis.setTimeout(() => setVisible(false), 7000);
    return () => globalThis.clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="cv-toon-bubble"
          key={actId}
          initial={reduce ? false : { opacity: 0, y: 8, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? undefined : { opacity: 0, y: 6, scale: 0.96 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        >
          <i>TOUR GUIDE</i>
          <p>
            <TypeLine key={line} text={line} reduce={reduce} />
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * MoinToon — a little cartoon guide who walks across the stage as you scroll.
 *
 * The character's horizontal position is bound to page scroll progress (left
 * to right going down, flipping to face the direction of travel). While the
 * page is moving it walks; when you stop, it idles and breathes. Each act it
 * passes triggers a short walkthrough line in a speech bubble, typed out
 * character by character and auto-dismissed after a beat.
 *
 * Decorative: the narration duplicates what the page itself says, so the whole
 * widget is hidden from assistive tech.
 */
export function MoinToon({
  acts,
  active,
}: {
  acts: readonly ToonAct[];
  active: string;
}) {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const [walking, setWalking] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  const [nearRight, setNearRight] = useState(false);

  const walkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProgress = useRef(0);

  /* Walk across the whole stage with scroll; parked for reduced motion. */
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["28px", "28px"] : ["7vw", "76vw"],
  );

  /* Animate the legs only while the page is actually moving; also track
     which half of the stage we're in so the bubble can flip its anchor and
     never hang off the right edge of the viewport. */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const delta = v - lastProgress.current;
    lastProgress.current = v;
    const right = v > 0.55;
    setNearRight((prev) => (prev === right ? prev : right));
    if (Math.abs(delta) < 0.0004) return;
    setFacingLeft(delta < 0);
    setWalking(true);
    if (walkTimer.current) globalThis.clearTimeout(walkTimer.current);
    walkTimer.current = globalThis.setTimeout(() => setWalking(false), 240);
  });

  useEffect(
    () => () => {
      if (walkTimer.current) globalThis.clearTimeout(walkTimer.current);
    },
    [],
  );

  const act = acts.find((a) => a.id === active);

  const classes = [
    "cv-toon",
    walking ? "is-walking" : "",
    facingLeft ? "is-flipped" : "",
    nearRight ? "is-right" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div className={classes} style={{ x }} aria-hidden="true">
      {act?.tour && (
        <ToonBubble
          key={act.id}
          actId={act.id}
          line={act.tour}
          reduce={reduce}
        />
      )}

      <svg
        className="cv-toon-figure"
        viewBox="0 0 72 90"
        width="62"
        height="78"
        role="presentation"
      >
        {/* back arm */}
        <rect
          className="cv-toon-arm cv-toon-arm--back"
          x="19"
          y="43"
          width="9"
          height="20"
          rx="4.5"
          fill="#41619b"
        />
        {/* legs — each grouped with its shoe so the whole limb swings from
            the hip (transform-origin: top center of the group's box) */}
        <g className="cv-toon-limb cv-toon-limb--a">
          <rect x="29" y="60" width="10" height="21" rx="5" fill="#2c3a53" />
          <rect x="27" y="78" width="14" height="6" rx="3" fill="#11141c" />
        </g>
        <g className="cv-toon-limb cv-toon-limb--b">
          <rect x="39" y="60" width="10" height="21" rx="5" fill="#35476a" />
          <rect x="37" y="78" width="14" height="6" rx="3" fill="#181c26" />
        </g>
        {/* torso */}
        <rect x="26" y="36" width="26" height="28" rx="10" fill="#7c9cd9" />
        <rect x="26" y="36" width="26" height="9" rx="4.5" fill="#93afe4" />
        <text className="cv-toon-badge" x="39" y="57" textAnchor="middle">
          M
        </text>
        {/* head */}
        <circle cx="39" cy="22" r="14.5" fill="#e8b489" />
        {/* hair */}
        <path
          d="M24.8 21.5 Q25 6.5 39 7 Q53.4 7.5 53.2 22 Q49.5 13.5 39 14.2 Q29.5 14.8 24.8 21.5 Z"
          fill="#20242e"
        />
        {/* eyes */}
        <g className="cv-toon-eyes">
          <ellipse cx="34.6" cy="22.4" rx="1.9" ry="2.6" fill="#20242e" />
          <ellipse cx="44.2" cy="22.4" rx="1.9" ry="2.6" fill="#20242e" />
        </g>
        {/* smile */}
        <path
          d="M35.2 28.8 Q39.4 32.4 43.6 28.8"
          stroke="#20242e"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* front arm */}
        <rect
          className="cv-toon-arm cv-toon-arm--front"
          x="50"
          y="43"
          width="9"
          height="20"
          rx="4.5"
          fill="#9ab8e6"
        />
      </svg>
    </motion.div>
  );
}
