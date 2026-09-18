"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type Message = { role: "user" | "assistant"; content: string };
type BuddyState = "idle" | "peek" | "fly" | "open" | "thinking";

const starters = [
  "What does Mohammad do?",
  "Tell me about his training.",
  "What has he built?",
];

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
      <AnimatePresence>
        {open && (
          <motion.section
            className="moin-buddy-panel"
            initial={{ opacity: 0, y: 18, scale: 0.96, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
            aria-label="Ask Moin"
          >
            <div className="moin-buddy-head">
              <div>
                <span className="mono">ASK MOIN</span>
                <strong>Curious about my work?</strong>
              </div>
              <button
                type="button"
                className="moin-buddy-close"
                onClick={() => setOpen(false)}
                aria-label="Close Ask Moin"
              >
                ×
              </button>
            </div>

            <div className="moin-buddy-body">
              {messages.length === 0 ? (
                <div className="moin-buddy-intro">
                  <p>
                    A brief AI guide to Mohammad&apos;s engineering, consulting,
                    training, and projects.
                  </p>
                  <div className="moin-buddy-starters">
                    {starters.map((starter) => (
                      <button key={starter} type="button" onClick={() => void ask(starter)}>
                        {starter} <span>↗</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="moin-buddy-messages" aria-live="polite">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`moin-buddy-message moin-buddy-message-${message.role}`}
                    >
                      {message.content}
                    </div>
                  ))}
                  {loading && (
                    <div className="moin-buddy-message moin-buddy-message-assistant moin-buddy-thinking">
                      <i /><i /><i />
                    </div>
                  )}
                </div>
              )}
            </div>

            <form className="moin-buddy-form" onSubmit={submit}>
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
            <small className="moin-buddy-note">Brief answers · text only</small>
          </motion.section>
        )}
      </AnimatePresence>

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
        <span className="moin-buddy-hero" aria-hidden="true">
          <span className="moin-buddy-cape" />
          <motion.span
            className="moin-buddy-head"
            style={{ x: eyeX, y: eyeY }}
            transition={{ type: "spring", stiffness: 180, damping: 16 }}
          >
            <i /><i />
          </motion.span>
          <span className="moin-buddy-body"><b>M</b></span>
        </span>
      </motion.button>
    </div>
  );
}
