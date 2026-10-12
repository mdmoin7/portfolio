"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Types through a rotating list of phrases, holds, then deletes.
 * Returns the currently visible text so callers can render it inline.
 */
export function useTypewriterCycle(
  phrases: readonly string[],
  { typeMs = 55, deleteMs = 28, holdMs = 1900, startDelay = 2200, enabled = true } = {},
) {
  const [live, setLive] = useState<string | null>(null);
  const rafRef = useRef<number>(0);

  /* Static case derives at render so a disabled visitor never re-renders. */
  const cycling = enabled && phrases.length > 1;

  /* Read through a ref so an unstable array identity can never restart the
     loop mid-word. The phrase list is content, not changing state. */
  const phrasesRef = useRef(phrases);
  useEffect(() => {
    phrasesRef.current = phrases;
  }, [phrases]);

  useEffect(() => {
    /* Reset through the rAF channel rather than a synchronous setState —
       the effect is disabled, and this keeps the rule's contract. */
    if (!cycling) {
      const id = requestAnimationFrame(() => setLive(null));
      return () => cancelAnimationFrame(id);
    }
    let p = 0;
    let len = 0;
    let deleting = false;
    let last = performance.now();
    let holdUntil = last + startDelay;

    const tick = (now: number) => {
      const list = phrasesRef.current;
      const current = list[p % list.length] ?? "";
      if (now < holdUntil) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const step = now - last;
      if (step >= (deleting ? deleteMs : typeMs)) {
        last = now;
        len += deleting ? -1 : 1;
        len = Math.max(0, Math.min(len, current.length));
        setLive(current.slice(0, len));
        if (!deleting && len === current.length) {
          deleting = true;
          holdUntil = now + holdMs;
        } else if (deleting && len === 0) {
          deleting = false;
          p += 1;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [cycling, typeMs, deleteMs, holdMs, startDelay]);

  return live ?? (phrases[0] ?? "");
}

/**
 * Scrambles toward the next label when it changes — a fast terminal-style
 * settle that keeps the status-bar crumb feeling alive.
 */export function useScramble(target: string, enabled = true) {
  /* `null` means "settled" — rendering falls through to the real target so a
     disabled visitor (or the final frame) costs no extra render. */
  const [text, setText] = useState<string | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    /* Same rAF-scheduled reset as the typewriter above. */
    if (!enabled) {
      const id = requestAnimationFrame(() => setText(null));
      return () => cancelAnimationFrame(id);
    }
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·";
    const start = performance.now();
    const duration = 420;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const reveal = Math.floor(t * target.length);
      let out = target.slice(0, reveal);
      for (let i = reveal; i < target.length; i += 1) {
        out += target[i] === " " ? " " : glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      setText(out);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setText(null);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, enabled]);

  return text ?? target;
}
