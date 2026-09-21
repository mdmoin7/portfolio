"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Message = { role: "user" | "assistant"; content: string };
type BuddyState = "idle" | "peek" | "fly" | "open" | "thinking";

const starters = [
  ["What does Mohammad do?", "⌂"],
  ["What technologies does he use?", "</>"],
  ["Tell me about his projects.", "▣"],
  ["Does he provide corporate training?", "◇"],
  ["What's his professional approach?", "↗"],
  ["How can I work with him?", "✦"],
] as const;

function BuddyIcon({ className = "" }: { className?: string }) {
  return (
    <span className={`moin-buddy-hero ${className}`} aria-hidden="true">
      <span className="moin-buddy-cape" />
      <span className="moin-buddy-ear moin-buddy-ear-left"><i /></span>
      <span className="moin-buddy-ear moin-buddy-ear-right"><i /></span>
      <motion.span className="moin-buddy-head">
        <span className="moin-buddy-visor">
          <i />
          <i />
        </span>
      </motion.span>
      <span className="moin-buddy-arm moin-buddy-arm-left" />
      <span className="moin-buddy-arm moin-buddy-arm-right" />
      <span className="ask-moin-body">
        <b>M</b>
      </span>
      <span className="moin-buddy-foot moin-buddy-foot-left" />
      <span className="moin-buddy-foot moin-buddy-foot-right" />
    </span>
  );
}

export function MoinBuddy() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<BuddyState>("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const peekTimer = useRef<number | null>(null);
  const flyTimer = useRef<number | null>(null);

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 90, damping: 16, mass: 0.7 });
  const springY = useSpring(pointerY, { stiffness: 90, damping: 16, mass: 0.7 });
  const buddyX = useTransform(springX, (v) => v * 7);
  const buddyY = useTransform(springY, (v) => v * 5);
  const buddyRotate = useTransform(springX, (v) => v * 5);
  const buddyRotateY = useTransform(springX, (v) => v * -10);
  const eyeX = useTransform(springX, (v) => v * 2);
  const eyeY = useTransform(springY, (v) => v * 1.5);

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth - 0.5) * 2);
      pointerY.set((event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, [pointerX, pointerY]);

  useEffect(() => {
    if (open) {
      setState("open");
      window.setTimeout(() => inputRef.current?.focus(), 180);
      return;
    }

    if (loading) {
      setState("thinking");
      return;
    }

    const schedulePeek = () => {
      setState("idle");
      peekTimer.current = window.setTimeout(() => {
        setState("peek");
        window.setTimeout(() => setState("idle"), 1450);
      }, 12000);
    };

    const scheduleFly = () => {
      flyTimer.current = window.setTimeout(() => {
        setState("fly");
        window.setTimeout(() => {
          setState("idle");
          schedulePeek();
        }, 1100);
      }, 26000);
    };

    schedulePeek();
    scheduleFly();
    return () => {
      if (peekTimer.current) window.clearTimeout(peekTimer.current);
      if (flyTimer.current) window.clearTimeout(flyTimer.current);
    };
  }, [open, loading]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || loading) return;

    setMessages((current) => [...current, { role: "user", content: trimmed }]);
    setInput("");
    setLoading(true);
    setState("thinking");

    try {
      const response = await fetch("/api/ask-moin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      const data = (await response.json()) as { answer?: string };
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            data.answer ??
            "I can brief you on Mohammad's work, engineering, training, and projects.",
        },
      ]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Try again in a moment.",
        },
      ]);
    } finally {
      setLoading(false);
      if (!open) setState("idle");
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }

  const isPeeking = state === "peek";
  const isFlying = state === "fly";

  return (
    <div className={`moin-buddy moin-buddy-state-${state}`}>
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {open && (
            <div className="moin-buddy-portal" aria-label="Ask Moin">
          <motion.section
            className="ask-moin-panel"
            initial={{ opacity: 0, y: 18, scale: 0.96, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            aria-label="Ask Moin"
          >
            <div className="ask-moin-panel-head">
              <div className="ask-moin-title">
                <BuddyIcon className="ask-moin-panel-icon" />
                <div>
                  <span className="mono">ASK MOIN</span>
                  <strong>Curious about my work?</strong>
                </div>
              </div>
              <button
                type="button"
                className="ask-moin-close"
                onClick={() => setOpen(false)}
                aria-label="Close Ask Moin"
              >
                ×
              </button>
            </div>

            <div className="ask-moin-body">
              {messages.length === 0 ? (
                <div className="ask-moin-intro">
                  <div className="ask-moin-intro-copy">
                    <span className="ask-moin-intro-kicker mono">MOHAMMAD MOIN · ENGINEERING × PEOPLE × AI</span>
                    <h3>Curious about my work?</h3>
                    <p>
                      Ask me about Mohammad&apos;s experience, engineering,
                      consulting, training, or projects.
                    </p>
                  </div>
                  <div className="ask-moin-starters">
                    {starters.map(([starter, icon]) => (
                      <button key={starter} type="button" onClick={() => void ask(starter)}>
                        <span className="ask-moin-starter-icon" aria-hidden="true">{icon}</span>
                        <span>{starter}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="ask-moin-messages" aria-live="polite">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`ask-moin-message ask-moin-message-${message.role}`}
                    >
                      {message.content}
                    </div>
                  ))}
                  {loading && (
                    <div className="ask-moin-message ask-moin-message-assistant ask-moin-thinking">
                      <i /><i /><i />
                    </div>
                  )}
                </div>
              )}
            </div>

            <form className="ask-moin-form" onSubmit={submit}>
              <input
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about Mohammad..."
                aria-label="Ask about Mohammad"
                maxLength={500}
              />
              <button type="submit" disabled={!input.trim() || loading} aria-label="Send question">
                ↑
              </button>
            </form>
            <small className="ask-moin-note">Brief answers · text only</small>
          </motion.section>
          </div>
          )}
        </AnimatePresence>,
        document.body,
      )}

      <motion.button
        type="button"
        className={`moin-buddy-orb ${open ? "is-open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close Ask Moin" : "Open Ask Moin"}
        aria-expanded={open}
        style={{
          x: buddyX,
          y: buddyY,
          rotate: buddyRotate,
          rotateY: buddyRotateY,
        }}
        animate={{
          x: isPeeking ? -30 : isFlying ? -80 : 0,
          y: isPeeking ? 10 : isFlying ? -100 : 0,
          rotate: isFlying ? -8 : 0,
          scale: isFlying ? 1.04 : isPeeking ? 0.92 : 1,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 16, mass: 0.55 }}
        whileHover={{ scale: 1.06, y: -6 }}
        whileTap={{ scale: 0.94 }}
      >
        <motion.span className="moin-buddy-hero" style={{ x: eyeX, y: eyeY }}>
          <span className="moin-buddy-ear moin-buddy-ear-left"><i /></span>
          <span className="moin-buddy-ear moin-buddy-ear-right"><i /></span>
          <motion.span className="moin-buddy-head">
            <span className="moin-buddy-visor">
              <motion.i style={{ x: eyeX, y: eyeY }} />
              <motion.i style={{ x: eyeX, y: eyeY }} />
            </span>
          </motion.span>
          <span className="moin-buddy-arm moin-buddy-arm-left" />
          <span className="moin-buddy-arm moin-buddy-arm-right" />
          <span className="ask-moin-body"><b>M</b></span>
          <span className="moin-buddy-foot moin-buddy-foot-left" />
          <span className="moin-buddy-foot moin-buddy-foot-right" />
        </motion.span>
      </motion.button>
    </div>
  );
}
