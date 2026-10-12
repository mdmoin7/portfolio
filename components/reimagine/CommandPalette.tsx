"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type Cmd = {
  id: string;
  group: string;
  title: string;
  hint: string;
  icon: string;
  shortcut?: string;
  run: () => void;
};

const EMAIL = "mohammadmoin.tech@gmail.com";

/* Subsequence fuzzy match — returns a rough score (lower is better) or -1. */
function score(query: string, target: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const t = target.toLowerCase();
  if (t.includes(q)) return t.indexOf(q);
  let ti = 0;
  let gaps = 0;
  for (const ch of q) {
    const found = t.indexOf(ch, ti);
    if (found === -1) return -1;
    gaps += found - ti;
    ti = found + 1;
  }
  return 100 + gaps;
}

export function CommandPalette({
  acts,
  onNavigate,
}: {
  acts: readonly { id: string; no: string; label: string }[];
  onNavigate: (id: string) => void;
}) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [exiting, setExiting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Cmd[]>(() => {
    const jump = (id: string) => () => {
      setExiting(true);
      setOpen(false);
      setQuery("");
      /* Let the close animation start before the smooth scroller moves. */
      globalThis.setTimeout(() => onNavigate(id), 120);
    };

    const goto = (href: string) => () => {
      setExiting(true);
      setOpen(false);
      globalThis.location.assign(href);
    };

    const actCmds: Cmd[] = acts.map((a, i) => ({
      id: `act-${a.id}`,
      group: "Navigate acts",
      title: `${a.no} · ${a.label}`,
      hint: `Jump to act ${a.no}`,
      icon: "▸",
      shortcut: i < 9 ? `${i + 1}` : undefined,
      run: jump(a.id),
    }));

    return [
      {
        id: "email",
        group: "Actions",
        title: "Start a transmission",
        hint: EMAIL,
        icon: "✉",
        shortcut: "E",
        run: () => {
          setExiting(true);
          setOpen(false);
          globalThis.location.href = `mailto:${EMAIL}`;
        },
      },
      {
        id: "resume",
        group: "Actions",
        title: "Open résumé",
        hint: "/resume — printable record",
        icon: "▤",
        shortcut: "R",
        run: goto("/resume"),
      },
      {
        id: "top",
        group: "Actions",
        title: "Return to title card",
        hint: "Back to act 01",
        icon: "⟲",
        run: jump("thesis"),
      },
      ...actCmds,
    ];
  }, [acts, onNavigate]);

  const results = useMemo(() => {
    if (!query.trim()) return commands;
    return commands
      .map((c) => ({ c, s: score(query, `${c.title} ${c.hint} ${c.group}`) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => a.s - b.s)
      .map((x) => x.c);
  }, [commands, query]);

  /* Open/close wired to ⌘K / Ctrl+K / Ctrl+/ … */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const metaK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      const slash = e.ctrlKey && e.key === "/";
      if (metaK || slash) {
        e.preventDefault();
        if (open) {
          setExiting(true);
          setOpen(false);
        } else {
          setQuery("");
          setCursor(0);
          setExiting(false);
          setOpen(true);
        }
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setExiting(true);
        setOpen(false);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const t = globalThis.setTimeout(() => inputRef.current?.focus(), 40);
    return () => globalThis.clearTimeout(t);
  }, [open]);

  /* Clamp the highlight at render instead of syncing it in an effect — the
     result set shrinks as the query narrows, so a stored index can overrun. */
  const safeCursor = results.length ? cursor % results.length : 0;

  /* Keep the highlighted row in view while arrowing. */
  useEffect(() => {
    const el = listRef.current?.children[safeCursor] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [safeCursor]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => (results.length ? (c + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[safeCursor]?.run();
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (results[safeCursor]) setQuery(results[safeCursor].title);
    }
  };

  const grouped: [string, Cmd[]][] = [];
  for (const c of results) {
    const last = grouped[grouped.length - 1];
    if (last && last[0] === c.group) last[1].push(c);
    else grouped.push([c.group, [c]]);
  }

  let flatIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="mo-palette-scrim"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={exiting ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.18 }}
          onMouseDown={() => {
            setExiting(true);
            setOpen(false);
          }}
        >
          <motion.div
            className="mo-palette"
            role="dialog"
            aria-modal="true"
            aria-label="Command launcher"
            initial={reduce ? false : { opacity: 0, y: -14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={exiting ? { opacity: 0, y: -10, scale: 0.99 } : undefined}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="mo-palette-head">
              <span aria-hidden="true">⌘</span>
              <input
                ref={inputRef}
                value={query}
                placeholder="Type a command or act…"
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                aria-label="Command input"
                spellCheck={false}
                autoComplete="off"
              />
              <kbd>ESC</kbd>
            </div>

            <div className="mo-palette-list" ref={listRef}>
              {                      results.length === 0 && (
                <p className="mo-palette-empty">
                  NO SIGNAL — nothing matches “{query}”
                </p>
              )}
              {grouped.map(([group, items]) => (
                <div key={group}>
                  <p className="mo-palette-group">{group}</p>
                  {items.map((c) => {
                    flatIndex += 1;
                    const active = flatIndex === safeCursor;
                    const idx = flatIndex;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        className={`mo-palette-item ${active ? "is-active" : ""}`}
                        onMouseMove={() => setCursor(idx)}
                        onClick={() => c.run()}
                      >
                        <span className="mo-palette-icon" aria-hidden="true">
                          {c.icon}
                        </span>
                        <span className="mo-palette-body">
                          <strong>{c.title}</strong>
                          <small>{c.hint}</small>
                        </span>
                        {c.shortcut && <kbd>{c.shortcut}</kbd>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mo-palette-foot">
              <span>
                <kbd>↑↓</kbd> navigate
              </span>
              <span>
                <kbd>↵</kbd> open
              </span>
              <span>
                <kbd>tab</kbd> complete
              </span>
              <span className="mo-palette-foot-right">MOIN.OS LAUNCHER v3.0</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
