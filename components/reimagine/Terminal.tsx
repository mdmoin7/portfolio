"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const EMAIL = "mohammadmoin.tech@gmail.com";

type Line = { kind: "in" | "out" | "ok" | "err" | "cmd"; text: string };

const HELP: Line[] = [
  { kind: "out", text: "Available commands:" },
  { kind: "out", text: "  whoami        identity + role" },
  { kind: "out", text: "  ls            list the acts" },
  { kind: "out", text: "  open <act>    jump to an act (e.g. open work)" },
  { kind: "out", text: "  stack         core technologies" },
  { kind: "out", text: "  training      capability programs" },
  { kind: "out", text: "  stats         the numbers" },
  { kind: "out", text: "  contact       open a channel" },
  { kind: "out", text: "  hire          start a transmission" },
  { kind: "out", text: "  date          current session time" },
  { kind: "out", text: "  clear         wipe the buffer" },
  { kind: "out", text: "  exit          close the console" },
  { kind: "out", text: "Tip: ↑/↓ walks history, Tab completes." },
];

const ACT_TARGETS = [
  "thesis", "index", "capability", "approach", "technology",
  "work", "training", "insights", "author", "contact",
];

const ALIASES: Record<string, string> = {
  home: "thesis", title: "thesis", top: "thesis",
  practice: "capability", pipeline: "approach",
  academy: "training", log: "insights", dossier: "author",
  channel: "contact", projects: "work", casefiles: "work",
};

const STACK_LINE =
  "React · Angular · TypeScript · Node.js · Azure · Terraform · Dataverse · Entra ID · Supabase · Firebase · AI / RAG";

const BANNER: Line[] = [
  { kind: "cmd", text: "MOIN.OS CONSOLE v3.0 — type 'help' to begin" },
];

/* Commands that produce a playful refusal or an easter egg. */
const EASTER: Record<string, string[]> = {
  sudo: ["nice try. this system answers to no one."],
  hack: ["intrusion detected. countermeasure: an awkward silence."],
  bitcoin: ["mining… just kidding. try 'stack' instead."],
  coffee: ["brewing… ☕ capability reloaded."],
  love: ["returning 1 value: <3"],
  joke: ["why do frontend engineers make bad magicians? they always drop the DOM."],
};

export function Terminal({
  acts,
  onNavigate,
}: {
  acts: readonly { id: string; no: string; label: string }[];
  onNavigate: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [value, setValue] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setExiting(true);
    setOpen(false);
  };

  /* Open/close: ` or Ctrl+` or Ctrl+T, Escape closes. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const backtick = e.key === "`" || e.key === "~";
      const ctrlT = e.ctrlKey && e.key.toLowerCase() === "t";
      const inField =
        e.target instanceof HTMLElement &&
        (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA");
      if (backtick && !inField) {
        e.preventDefault();
        setExiting(false);
        setOpen((o) => !o);
        return;
      }
      if (ctrlT) {
        e.preventDefault();
        setExiting(false);
        setOpen((o) => !o);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        close();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      const t = globalThis.setTimeout(() => inputRef.current?.focus(), 60);
      return () => globalThis.clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, open]);

  const push = (...l: Line[]) => setLines((prev) => [...prev, ...l]);

  const resolveAct = (raw: string) => {
    const key = (raw || "").toLowerCase().replace(/^#/, "");
    const id = ALIASES[key] ?? key;
    return ACT_TARGETS.includes(id) ? id : null;
  };

  const execute = (raw: string) => {
    const cmd = raw.trim();
    if (!cmd) return;
    push({ kind: "in", text: cmd });
    setHist((h) => [cmd, ...h]);
    setHIdx(-1);

    const [head, ...rest] = cmd.split(/\s+/);
    const arg = rest.join(" ");
    const c = head.toLowerCase();

    if (c === "clear") {
      setLines(BANNER);
      return;
    }
    if (c === "exit" || c === "quit" || c === "close") {
      push({ kind: "out", text: "closing console…" });
      close();
      return;
    }
    if (c === "help" || c === "?") {
      push(...HELP);
      return;
    }
    if (c === "whoami" || c === "id") {
      push(
        { kind: "ok", text: "mohammad moin — independent software engineering consultant" },
        { kind: "out", text: "focus: systems × people × ai · 14+ yrs in production" },
      );
      return;
    }
    if (c === "ls" || c === "acts") {
      push(
        { kind: "out", text: "acts:" },
        ...acts.map<Line>((a) => ({
          kind: "out",
          text: `  ${a.no}  ${a.label.toLowerCase().padEnd(12)} → open ${a.id}`,
        })),
      );
      return;
    }
    if (c === "open" || c === "goto" || c === "jump") {
      const id = resolveAct(arg);
      if (!id) {
        push({ kind: "err", text: `unknown act: '${arg || "—"}'. try 'ls'.` });
        return;
      }
      push({ kind: "ok", text: `routing → ${id} …` });
      close();
      globalThis.setTimeout(() => onNavigate(id), 140);
      return;
    }
    if (c === "stack" || c === "tech") {
      push({ kind: "out", text: STACK_LINE });
      return;
    }
    if (c === "training" || c === "academy") {
      push(
        { kind: "out", text: "role-based programs: assess → foundation → applied → production → ownership" },
        { kind: "ok", text: "15K+ engineers trained · 350+ sessions delivered" },
        { kind: "out", text: "jump: open training" },
      );
      return;
    }
    if (c === "stats" || c === "numbers") {
      push(
        { kind: "ok", text: "15K+ professionals trained" },
        { kind: "ok", text: "350+ training sessions" },
        { kind: "ok", text: "14+ years in production" },
      );
      return;
    }
    if (c === "contact" || c === "email") {
      push(
        { kind: "out", text: `channel: ${EMAIL}` },
        { kind: "out", text: "opening mail client…" },
      );
      globalThis.location.href = `mailto:${EMAIL}`;
      return;
    }
    if (c === "hire" || c === "work" || c === "collab") {
      push(
        { kind: "ok", text: "transmission armed." },
        { kind: "out", text: `send the brief → ${EMAIL}` },
      );
      globalThis.location.href = `mailto:${EMAIL}?subject=Engagement%20enquiry`;
      return;
    }
    if (c === "date" || c === "time" || c === "uptime") {
      push({ kind: "out", text: new Date().toString() });
      return;
    }
    if (EASTER[c]) {
      push(...EASTER[c].map((t) => ({ kind: "ok", text: t } as Line)));
      return;
    }
    push({ kind: "err", text: `command not found: ${head}. type 'help'.` });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      execute(value);
      setValue("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!hist.length) return;
      const next = Math.min(hIdx + 1, hist.length - 1);
      setHIdx(next);
      setValue(hist[next] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = hIdx - 1;
      if (next < 0) {
        setHIdx(-1);
        setValue("");
      } else {
        setHIdx(next);
        setValue(hist[next] ?? "");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      const parts = value.split(/\s+/);
      if (parts.length <= 1) {
        const cmds = ["help", "whoami", "ls", "open", "stack", "training", "stats", "contact", "hire", "date", "clear", "exit"];
        const match = cmds.find((k) => k.startsWith(parts[0].toLowerCase()));
        if (match) setValue(match);
      } else {
        const match = resolveAct(parts[1] ?? "") ?? ACT_TARGETS.find((a) => a.startsWith((parts[1] ?? "").toLowerCase()));
        if (match) setValue(`${parts[0]} ${match}`);
      }
    }
  };

  const tone: Record<Line["kind"], string> = {
    in: "mo-t-in",
    out: "mo-t-out",
    ok: "mo-t-ok",
    err: "mo-t-err",
    cmd: "mo-t-cmd",
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mo-term-scrim"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={exiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
          onMouseDown={close}
        >
          <motion.div
            className="mo-term"
            role="dialog"
            aria-modal="true"
            aria-label="MOIN.OS console"
            initial={reduce ? false : { opacity: 0, y: 26, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={exiting ? { opacity: 0, y: 18, scale: 0.99 } : undefined}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mo-term-bar">
              <span className="mo-win" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="mo-term-title">moin@os — console</span>
              <button type="button" onClick={close} aria-label="Close console">
                ✕
              </button>
            </div>

            <div className="mo-term-body" ref={bodyRef} onClick={() => inputRef.current?.focus()}>
              {lines.map((l, i) => (
                <p key={i} className={tone[l.kind]}>
                  {l.kind === "in" ? <span className="mo-t-prompt">› </span> : null}
                  {l.text}
                </p>
              ))}
              <div className="mo-term-input">
                <span className="mo-t-prompt">›</span>
                <input
                  ref={inputRef}
                  value={value}
                  placeholder="type a command…"
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  aria-label="Console command"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
