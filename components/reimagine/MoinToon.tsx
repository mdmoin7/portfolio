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

/* Flight path mirror — must match the x useTransform below (7vw → 76vw). */
const TOON_X = (progress: number) => (0.07 + progress * 0.69) * 100;

/**
 * Which edge the bubble should hug for a given scroll progress: anchored to
 * the guide's x in vw against the bubble's ~248px footprint, so it never
 * hangs off either side of the viewport (on narrow screens both edges are
 * reachable; on wide ones it simply stays centered).
 */
function bubbleSide(progress: number): "left" | "center" | "right" {
  if (typeof window === "undefined") return "center";
  /* Reduced motion parks the guide at 28px, far left of any path point. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    return "left";
  const x = TOON_X(progress);
  const bubbleVw = ((248 + 24) / window.innerWidth) * 100;
  const half = bubbleVw / 2;
  if (x - half < 2) return "left";
  if (x + half > 98) return "right";
  return "center";
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
 * MoinToon — the astronaut tour guide who flies across the stage as you
 * scroll, drawn to match the buddy mascot's suit (white helmet, navy visor
 * with gold eyes and beacon, cream suit, steel pack).
 *
 * The character's position is bound to page scroll progress: left to right
 * going down, through a swooping mid-air path (low at the takeoff, weaving
 * up and down, finishing high), flipping to face the direction of travel.
 * While the page moves it flies — fluttering limbs and a forward lean —
 * and when you stop it hovers in place like the mascot. Each act it passes
 * triggers a short walkthrough line in a speech bubble, typed out character
 * by character and auto-dismissed after a beat.
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

  const [flying, setFlying] = useState(false);
  const [facingLeft, setFacingLeft] = useState(false);
  /* Which edge the speech bubble should hug so it never hangs off-screen:
     the guide crosses the full stage, so on narrow viewports the centered
     bubble clips the left edge early on and the right edge later. */
  const [side, setSide] = useState<"left" | "center" | "right">("center");

  const flyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastProgress = useRef(0);

  /* Fly across the whole stage with scroll; parked for reduced motion. */
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["28px", "28px"] : ["7vw", "76vw"],
  );

  /* …and swoop through a mid-air band of the viewport on the way: low for
     the takeoff, weaving up and down, finishing high by the channels. */
  const y = useTransform(
    scrollYProgress,
    [0, 0.15, 0.35, 0.55, 0.75, 1],
    reduce
      ? ["38vh", "38vh"]
      : ["62vh", "40vh", "52vh", "30vh", "46vh", "34vh"],
  );

  /* Flutter the limbs only while the page is actually moving; also track
     which edge the bubble needs to hug based on where the guide actually
     is in viewport pixels, not just scroll progress. */
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const delta = v - lastProgress.current;
    lastProgress.current = v;
    setSide((prev) => {
      const next = bubbleSide(v);
      return prev === next ? prev : next;
    });
    if (Math.abs(delta) < 0.0004) return;
    setFacingLeft(delta < 0);
    setFlying(true);
    if (flyTimer.current) globalThis.clearTimeout(flyTimer.current);
    flyTimer.current = globalThis.setTimeout(() => setFlying(false), 240);
  });

  /* The event above only fires on scroll changes, but the page can load
     already scrolled (browser restore), so settle the anchor once after
     mount — deferred asynchronously so the server-rendered markup stays
     hydration-clean (and, unlike rAF, it also fires in a backgrounded tab). */
  useEffect(() => {
    const settle = globalThis.setTimeout(() => {
      setSide((prev) => {
        const next = bubbleSide(scrollYProgress.get());
        return prev === next ? prev : next;
      });
    }, 0);
    return () => {
      globalThis.clearTimeout(settle);
      if (flyTimer.current) globalThis.clearTimeout(flyTimer.current);
    };
  }, [scrollYProgress]);

  const act = acts.find((a) => a.id === active);

  const classes = [
    "cv-toon",
    flying ? "is-flying" : "",
    facingLeft ? "is-flipped" : "",
    side === "left" ? "is-left" : side === "right" ? "is-right" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div className={classes} style={{ x, y }} aria-hidden="true">
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
        {/* Same palette as the buddy mascot so the pair read as one crew:
            white helmet, navy visor with warm under-glow, gold eyes and
            beacon, cream suit, navy collar/gloves/boots, steel pack. */}
        <defs>
          <linearGradient id="cvtoon-helmet" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.58" stopColor="#e6ebf6" />
            <stop offset="1" stopColor="#b9c2d8" />
          </linearGradient>
          <linearGradient id="cvtoon-suit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6efe0" />
            <stop offset="1" stopColor="#d9d0ba" />
          </linearGradient>
          <linearGradient id="cvtoon-navy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3a476e" />
            <stop offset="1" stopColor="#1b2438" />
          </linearGradient>
          <linearGradient id="cvtoon-pack" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#aeb7cc" />
            <stop offset="1" stopColor="#7d879f" />
          </linearGradient>
          {/* Visor: warm cabin glow rising from below into deep navy. */}
          <radialGradient id="cvtoon-visor" cx="50%" cy="118%" r="125%">
            <stop offset="0" stopColor="#f0a45a" stopOpacity="0.55" />
            <stop offset="0.58" stopColor="#18203a" />
            <stop offset="1" stopColor="#0a0f1c" />
          </radialGradient>
        </defs>

        {/* life-support pack, peeking behind the back */}
        <rect x="15.5" y="37" width="13" height="21" rx="4" fill="url(#cvtoon-pack)" />
        <rect x="18" y="41" width="8" height="1.6" rx="0.8" fill="rgba(16,24,48,.35)" />
        <rect x="18" y="45.5" width="8" height="1.6" rx="0.8" fill="rgba(16,24,48,.28)" />

        {/* back arm — sleeve + glove swing as one unit from the shoulder */}
        <g className="cv-toon-arm cv-toon-arm--back">
          <rect x="16.5" y="41" width="9" height="13" rx="4.5" fill="#ded6c4" />
          <rect x="16" y="50" width="10" height="7" rx="3.5" fill="url(#cvtoon-navy)" />
        </g>

        {/* legs — each grouped with its boot so the whole limb swings from
            the hip (transform-origin: top center of the group's box) */}
        <g className="cv-toon-limb cv-toon-limb--a">
          <rect x="28.5" y="55" width="10.5" height="19" rx="5.25" fill="#e2dac9" />
          <rect x="26.5" y="70" width="14.5" height="9" rx="3.5" fill="url(#cvtoon-navy)" />
          <rect x="26" y="75.5" width="15.5" height="3.5" rx="1.75" fill="#11141c" />
        </g>
        <g className="cv-toon-limb cv-toon-limb--b">
          <rect x="39" y="55" width="10.5" height="19" rx="5.25" fill="url(#cvtoon-suit)" />
          <rect x="37.5" y="70" width="14.5" height="9" rx="3.5" fill="url(#cvtoon-navy)" />
          <rect x="37" y="75.5" width="15.5" height="3.5" rx="1.75" fill="#181c26" />
        </g>

        {/* torso: cream suit, navy collar and belt, striped console, patch */}
        <rect x="25.5" y="34" width="27" height="24" rx="10" fill="url(#cvtoon-suit)" />
        <rect x="25.5" y="49.5" width="27" height="4.5" rx="2" fill="#222c47" />
        <rect x="31" y="31" width="18" height="5" rx="2.5" fill="url(#cvtoon-navy)" />
        <rect x="29" y="39" width="10.5" height="9" rx="2" fill="#0a0f1c" />
        <rect x="30" y="40.5" width="8.5" height="2" rx="1" fill="#f0a45a" />
        <rect x="30" y="44.5" width="8.5" height="2" rx="1" fill="#f0a45a" opacity="0.75" />
        <circle cx="46.5" cy="41.5" r="5" fill="#0a0f1c" />
        <text
          className="cv-toon-badge"
          x="46.5"
          y="44.3"
          textAnchor="middle"
          fontSize="7"
          fontWeight="700"
          fill="#f0a45a"
        >
          M
        </text>

        {/* front arm */}
        <g className="cv-toon-arm cv-toon-arm--front">
          <rect x="49" y="41" width="9" height="13" rx="4.5" fill="url(#cvtoon-suit)" />
          <rect x="48.5" y="50" width="10" height="7" rx="3.5" fill="url(#cvtoon-navy)" />
        </g>

        {/* helmet: shell, hinge caps, visor, glowing eyes, glint, beacon */}
        <rect x="21" y="25" width="6.5" height="9" rx="3.2" fill="url(#cvtoon-navy)" />
        <rect x="50.5" y="25" width="6.5" height="9" rx="3.2" fill="url(#cvtoon-navy)" />
        <circle cx="39" cy="19.5" r="16" fill="url(#cvtoon-helmet)" />
        <ellipse
          cx="39"
          cy="20.5"
          rx="12.5"
          ry="11"
          fill="url(#cvtoon-visor)"
          stroke="rgba(10,15,28,.65)"
          strokeWidth="0.8"
        />
        {/* soft halos behind the eyes, then the blink group itself */}
        <ellipse cx="35.4" cy="20.3" rx="3.4" ry="5" fill="#f0a45a" opacity="0.26" />
        <ellipse cx="43.6" cy="20.3" rx="3.4" ry="5" fill="#f0a45a" opacity="0.26" />
        <g className="cv-toon-eyes">
          <rect x="33.6" y="16.6" width="3.6" height="7.5" rx="1.8" fill="#f0a45a" />
          <rect x="41.8" y="16.6" width="3.6" height="7.5" rx="1.8" fill="#f0a45a" />
        </g>
        <path
          d="M30.5 14.6 Q34.4 11 39.6 11.3"
          stroke="rgba(255,255,255,.5)"
          strokeWidth="1.6"
          strokeLinecap="round"
          fill="none"
        />
        {/* helmet beacon, same blink cadence as the mascot's status light */}
        <circle className="cv-toon-beacon-halo" cx="50.5" cy="9.5" r="4.6" fill="#f0a45a" />
        <circle className="cv-toon-beacon" cx="50.5" cy="9.5" r="2.4" fill="#ffd9a8" />
      </svg>
    </motion.div>
  );
}
