"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { roles } from "@/lib/content";
import { useReducedMotion } from "@/lib/motion";

export function IntroOverlay({ onDismiss }: { onDismiss: () => void }) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const name = "Mohammad Moin";

  useEffect(() => {
    if (reducedMotion) onDismiss();
  }, [reducedMotion, onDismiss]);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % roles.length);
    }, 2600);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !visible) return;

    const dismiss = () => {
      setVisible(false);
      onDismiss();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        dismiss();
      }
    };

    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("touchstart", dismiss, { passive: true });

    return () => {
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("touchstart", dismiss);
    };
  }, [reducedMotion, onDismiss, visible]);

  if (reducedMotion || !visible) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center hero-gradient"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => {
            setVisible(false);
            onDismiss();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio introduction"
        >
          <div className="wrap relative z-10 text-center">
            <div className="mb-6 flex justify-center gap-1.5">
              {name.split("").map((char, index) => (
                <motion.span
                  key={`${char}-${index}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 + index * 0.035,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="font-display text-[clamp(36px,7vw,84px)] font-semibold tracking-[-0.04em] text-white"
                >
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="mx-auto max-w-3xl text-[clamp(18px,2.4vw,28px)] font-medium leading-snug text-white/85"
            >
              I build scalable <span className="text-blue">software</span> and develop{" "}
              <span className="text-blue">people.</span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85, duration: 0.45 }}
              className="mt-6 font-mono text-[11px] font-extrabold uppercase tracking-[0.12em] text-blue-soft/80"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={roles[roleIndex]}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                >
                  {roles[roleIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.45 }}
              className="mt-14 flex flex-col items-center gap-3 text-white/60"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
                Scroll or tap to enter
              </span>
              <motion.span
                aria-hidden="true"
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                className="h-10 w-px bg-gradient-to-b from-transparent via-white/70 to-transparent"
              />
            </motion.div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(36,84,216,0.25),transparent_55%)]"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
