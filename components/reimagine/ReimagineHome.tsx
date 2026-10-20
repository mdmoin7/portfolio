"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { CinematicAudioControl } from "@/components/audio/CinematicAudio";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { MoinBuddy } from "@/components/reimagine/MoinBuddy";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { CommandPalette } from "@/components/reimagine/CommandPalette";
import { Terminal } from "@/components/reimagine/Terminal";
import { CustomCursor } from "@/components/reimagine/CustomCursor";
import { WormholeTransit } from "@/components/reimagine/WormholeTransit";
import {
  useScramble,
  useTypewriterCycle,
} from "@/components/reimagine/useTypewriter";

/* Self-hosted: the old mutable `@reimagine/v2` CDN ref silently re-pointed on
   every branch push. */
const PROFILE_IMAGE = "/assets/profile.webp";
const EMAIL = "mohammadmoin.tech@gmail.com";

/* Module-level so the typewriter's dep identity is stable across the
   every-second clock re-render. An inline array here restarted the loop. */
const ROLE_PHRASES = [
  "SOFTWARE SYSTEMS & ARCHITECTURE",
  "ENGINEERING TEAM ADVISORY",
  "CORPORATE TECHNOLOGY TRAINING",
] as const;

/* --------------------------------------------------------------------------
   System map
   -------------------------------------------------------------------------- */
const ACTS = [
  { id: "thesis", no: "01", label: "TITLE" },
  { id: "index", no: "02", label: "INDEX" },
  { id: "capability", no: "03", label: "PRACTICE" },
  { id: "approach", no: "04", label: "PIPELINE" },
  { id: "technology", no: "05", label: "STACK" },
  { id: "work", no: "06", label: "CASE FILES" },
  { id: "training", no: "07", label: "ACADEMY" },
  { id: "insights", no: "08", label: "LOG" },
  { id: "author", no: "09", label: "DOSSIER" },
  { id: "contact", no: "10", label: "CHANNEL" },
] as const;

const INDEX_ROWS = [
  {
    num: "01",
    id: "capability",
    title: "Practice",
    desc: "BUILD THE SYSTEM · BUILD THE CAPABILITY",
  },
  {
    num: "02",
    id: "approach",
    title: "Pipeline",
    desc: "PEOPLE → PROBLEM → DESIGN → BUILD → IMPACT",
  },
  {
    num: "03",
    id: "technology",
    title: "Stack",
    desc: "REACT · ANGULAR · NODE · AZURE · AI / RAG",
  },
  {
    num: "04",
    id: "work",
    title: "Case Files",
    desc: "PROBLEM → SYSTEM → OUTCOME",
  },
  {
    num: "05",
    id: "training",
    title: "Academy",
    desc: "15K+ ENGINEERS · 350+ SESSIONS",
  },
  {
    num: "06",
    id: "insights",
    title: "Log",
    desc: "AI / RAG · ARCHITECTURE · CLOUD",
  },
  {
    num: "07",
    id: "author",
    title: "Dossier",
    desc: "THE PERSON BEHIND THE SYSTEM",
  },
  {
    num: "08",
    id: "contact",
    title: "Channel",
    desc: "OPEN A TRANSMISSION",
  },
] as const;

const STATIONS = [
  { name: "PEOPLE", desc: "Understand teams, challenges and goals." },
  { name: "PROBLEM", desc: "Define the right problem to solve." },
  { name: "DESIGN", desc: "Architect practical and scalable solutions." },
  { name: "BUILD", desc: "Engineer, implement and iterate." },
  { name: "IMPACT", desc: "Deliver measurable outcomes." },
] as const;

const STACK = [
  "React",
  "Angular",
  "Node.js",
  "TypeScript",
  "Azure",
  "Terraform",
  "Dataverse",
  "Entra ID",
  "Supabase",
  "Firebase",
  "AI / RAG",
] as const;

const BOOT_LINES = [
  { text: "MOIN.OS v3.0 — DEEP FIELD ONLINE" },
  { text: "PRESSURIZING CABIN — LIFE SUPPORT", ok: true },
  { text: "PLOTTING COURSE — 14+ YEARS IN SERVICE", ok: true },
  { text: "CALIBRATING NAVIGATION — 350+ SESSIONS", ok: true },
  { text: "ALL SYSTEMS NOMINAL — WELCOME ABOARD" },
] as const;

/* --------------------------------------------------------------------------
   Motion helpers
   -------------------------------------------------------------------------- */
function enter(reduce: boolean | null, delay: number) {
  return {
    initial: reduce ? false : { opacity: 0, y: 28, filter: "blur(10px)" },
    animate: reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: {
      duration: 0.9,
      delay,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  };
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function HeroStat({
  value,
  suffix,
  label,
  delay,
  reduce,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  reduce: boolean | null;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    if (reduce) {
      const t = globalThis.setTimeout(() => setN(value), 80);
      return () => globalThis.clearTimeout(t);
    }
    let raf = 0;
    let start: number | null = null;
    const duration = 1500;
    const tick = (now: number) => {
      if (start === null) start = now;
      const p = Math.min(1, (now - start) / duration);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = globalThis.requestAnimationFrame(tick);
    };
    const timer = globalThis.setTimeout(() => {
      raf = globalThis.requestAnimationFrame(tick);
    }, delay * 1000);
    return () => {
      globalThis.clearTimeout(timer);
      globalThis.cancelAnimationFrame(raf);
    };
  }, [value, delay, reduce]);

  return (
    <motion.div className="mo-stat" {...enter(reduce, delay)}>
      <strong aria-label={`${value}${suffix}`}>
        {n}
        {suffix}
      </strong>
      <span>{label}</span>
    </motion.div>
  );
}

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

/* --------------------------------------------------------------------------
   Page
   -------------------------------------------------------------------------- */
export function ReimagineHome() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLElement | null>(null);

  const [booted, setBooted] = useState(false);
  const [active, setActive] = useState<string>("thesis");
  const [station, setStation] = useState(0);
  const [pct, setPct] = useState(0);
  const [clock, setClock] = useState("--:--:--");
  const [today, setToday] = useState("");

  /* Boot sequence — instant dismiss for reduced motion (CSS also hides it). */
  useEffect(() => {
    const t = globalThis.setTimeout(() => setBooted(true), reduce ? 0 : 1850);
    return () => globalThis.clearTimeout(t);
  }, [reduce]);

  /* Live clock in the status bar. */
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toLocaleTimeString("en-GB", { hour12: false }));
      setToday(
        d
          .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
          .toUpperCase(),
      );
    };
    tick();
    const id = globalThis.setInterval(tick, 1000);
    return () => globalThis.clearInterval(id);
  }, []);

  /* Section spy drives the rail dots and the status-bar act crumb. */
  useEffect(() => {
    const els = ACTS.map((a) => document.getElementById(a.id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setPct(Math.round(v * 100));
  });

  /* Cursor light feeding the hero CSS layer without React re-renders. */
  useEffect(() => {
    const el = heroRef.current;
    if (!el || reduce) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--mo-mx", `${px}px`);
      el.style.setProperty("--mo-my", `${py}px`);
    };
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      px = e.clientX - r.left;
      py = e.clientY - r.top;
      if (!raf) raf = globalThis.requestAnimationFrame(apply);
    };
    el.addEventListener("mousemove", onMove);
    return () => {
      el.removeEventListener("mousemove", onMove);
      if (raf) globalThis.cancelAnimationFrame(raf);
    };
  }, [reduce]);

  /* Number keys 1…5 inspect the pipeline stations. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "5") setStation(Number(e.key) - 1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const context = useMemo(
    () =>
      STATIONS.map(
        (s, i) => `STATION 0${i + 1} — ${s.name}. ${s.desc}`,
      ),
    [],
  );

  const activeMeta =
    ACTS.find((a) => a.id === active) ?? (ACTS[0] as (typeof ACTS)[number]);

  /* Jump helper shared by the launcher, terminal and rail. */
  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  /* Hero role line cycles through the three practices. Module-level so the
     hook's dep identity is stable across the every-second clock re-render. */
  const roleCycle = useTypewriterCycle(ROLE_PHRASES, {
    enabled: !reduce && booted,
  });

  /* Status-bar crumb settles in with a terminal-style scramble. */
  const crumbScramble = useScramble(
    `ACT ${activeMeta.no} / ${activeMeta.label}`,
    !reduce,
  );

  const heroBase = reduce ? 0 : 1.1;

  return (
    <div className="reimagine mo">
      {/* ---------------------------------------------------------------- */}
      {/* Boot sequence                                                     */}
      {/* ---------------------------------------------------------------- */}
      <AnimatePresence>
        {!booted && (
          <motion.div
            key="boot"
            className="mo-boot"
            aria-hidden="true"
            exit={{ y: "-100%" }}
            transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          >
            {BOOT_LINES.map((line) => (
              <p className="mo-boot-line" key={line.text}>
                {line.text}
                {"ok" in line && line.ok ? <b> ... OK</b> : null}
              </p>
            ))}
            <div className="mo-boot-bar">
              <i />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---------------------------------------------------------------- */}
      {/* Status bar                                                        */}
      {/* ---------------------------------------------------------------- */}
      <header className="mo-status">
        <a className="mo-status-brand" href="#thesis">
          MOIN<i>.OS</i>
          <small>v3.0</small>
        </a>
        <p className="mo-crumb" aria-live="polite">
          {crumbScramble}
        </p>
        <div className="mo-status-right">
          <button
            type="button"
            className="mo-launcher"
            data-cursor="⌘K"
            onClick={() =>
              globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))
            }
            aria-label="Open command launcher"
          >
            <span aria-hidden="true">⌘</span>
            <span className="mo-launcher-kbd">K</span>
            <span className="mo-launcher-text">LAUNCHER</span>
          </button>
          <button
            type="button"
            className="mo-console-btn"
            data-cursor="&gt;_"
            onClick={() =>
              globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "`" }))
            }
            aria-label="Open console"
          >
            &gt;_
          </button>
          <span className="mo-led">ALL SYSTEMS NOMINAL</span>
          <time className="mo-clock">{clock}</time>
          <a className="mo-cta" href={`mailto:${EMAIL}`}>
            <span className="mo-cta-long">START A TRANSMISSION</span>
            <span className="mo-cta-short">TRANSMIT</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </header>
      <motion.div
        className="mo-progress"
        style={{ scaleX: scrollYProgress }}
        aria-hidden="true"
      />

      {/* ---------------------------------------------------------------- */}
      {/* Left rail — section spy                                           */}
      {/* ---------------------------------------------------------------- */}
      <aside className="mo-rail" aria-label="Section navigator">
        <a className="mo-rail-brand" href="#thesis">
          MOIN<i>.OS</i> — ENDURANCE
        </a>
        <span className="mo-rail-line" aria-hidden="true" />
        <nav className="mo-rail-dots">
          {ACTS.map((a) => (
            <a
              key={a.id}
              href={`#${a.id}`}
              className={`mo-dot ${active === a.id ? "is-active" : ""}`}
              aria-label={`${a.no} ${a.label}`}
            >
              <span className="mo-dot-label">
                {a.no} · {a.label}
              </span>
            </a>
          ))}
        </nav>
        <span className="mo-rail-pct">{pct}%</span>
      </aside>

      <main>
        {/* ================================================================ */}
        {/* ACT 01 — title card                                              */}
        {/* ================================================================ */}
        <section className="mo-hero" id="thesis" ref={heroRef}>
          {/* Wormhole gate — the hero's background. The stack orbits the
              horizon and sinks in & out of the throat. */}
          <div className="mo-gate" aria-hidden="true">
            <span className="mo-gate-halo" />
            <span className="mo-gate-disk" />
            <span className="mo-gate-disk mo-gate-disk--in" />
            {STACK.map((t, i) => (
              <span
                className="mo-gate-arm"
                key={t}
                style={
                  {
                    "--a": `${(i * 360) / STACK.length}deg`,
                    "--dur": `${70 + (i % 5) * 16}s`,
                    "--sdur": `${10 + (i % 4) * 1.7}s`,
                    "--sdly": `-${i * 1.65}s`,
                    "--rk": (0.7 + (((i * 3) % 5) * 0.03)).toFixed(2),
                  } as CSSProperties
                }
              >
                <span className="mo-gate-radius">
                  <span className={`mo-gate-token${i % 2 ? " is-blue" : ""}`}>
                    {t}
                  </span>
                </span>
              </span>
            ))}
            <span className="mo-gate-photon" />
            <span className="mo-gate-core" />
          </div>

          <div className="mo-ghost" aria-hidden="true">
            MOIN.OS
          </div>
          <div className="mo-hero-inner">
            <div>
              <motion.p className="mo-slug" {...enter(reduce, heroBase)}>
                <i>LOG ENTRY 001:</i> ACT 01 — TITLE SEQUENCE
              </motion.p>
              <motion.h1 className="mo-h1" {...enter(reduce, heroBase + 0.14)}>
                Mohammad Moin.
                <em>Build People. Solve Problems. Innovate.</em>
              </motion.h1>
              <motion.p className="mo-hero-role" {...enter(reduce, heroBase + 0.3)}>
                INDEPENDENT <span className="mo-type">{roleCycle}</span>
                <span className="mo-caret" aria-hidden="true" />
                <br />& CORPORATE TECHNOLOGY TRAINER
              </motion.p>
              <motion.p className="mo-hero-lede" {...enter(reduce, heroBase + 0.42)}>
                I design and build modern software systems, advise engineering
                teams, and develop production-ready capability through
                practical, hands-on training.
              </motion.p>
              <motion.div className="mo-actions" {...enter(reduce, heroBase + 0.56)}>
                <a className="mo-btn mo-btn--solid" href={`mailto:${EMAIL}`}>
                  Start a Transmission <Arrow />
                </a>
                <a className="mo-btn mo-btn--ghost" href="#index">
                  Open the Index <span aria-hidden="true">↓</span>
                </a>
              </motion.div>
              <div className="mo-hero-stats">
                <HeroStat
                  reduce={reduce}
                  delay={heroBase + 0.7}
                  value={15}
                  suffix="K+"
                  label="Professionals Trained"
                />
                <HeroStat
                  reduce={reduce}
                  delay={heroBase + 0.82}
                  value={350}
                  suffix="+"
                  label="Training Sessions"
                />
                <HeroStat
                  reduce={reduce}
                  delay={heroBase + 0.94}
                  value={14}
                  suffix="+"
                  label="Years Experience"
                />
              </div>
            </div>

            <motion.div
              className="mo-portrait"
              {...enter(reduce, heroBase + 0.5)}
            >
              <span className="mo-stamp">14+ YEARS · IN PRODUCTION</span>
              <figure className="mo-frame">
                <Image
                  src={PROFILE_IMAGE}
                  alt="Portrait of Mohammad Moin"
                  width={380}
                  height={437}
                  priority
                  sizes="(max-width: 1024px) 340px, 350px"
                />
                <figcaption>
                  <span>
                    MOHAMMAD MOIN <i>· M</i>
                  </span>
                  <span>CONSULT — BUILD — TRAIN</span>
                </figcaption>
              </figure>
            </motion.div>
          </div>

          <motion.div
            className="mo-hero-foot"
            {...enter(reduce, heroBase + 1.1)}
          >
            <span className="mo-scrollcue">SCROLL TO BEGIN TRANSIT</span>
            <span>
              SESSION LOG · {today || "—"}
            </span>
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* Marquee band                                                     */}
        {/* ================================================================ */}
        <div className="mo-band" aria-hidden="true">
          <div className="mo-band-track">
            <span>
              BUILD PEOPLE <b>★</b> SOLVE PROBLEMS <b>★</b> INNOVATE{" "}
              <b>★</b> CONSULT <b>★</b> TRAIN <b>★</b> SHIP{" "}
              <b>★</b>
            </span>
            <span>
              BUILD PEOPLE <b>★</b> SOLVE PROBLEMS <b>★</b> INNOVATE{" "}
              <b>★</b> CONSULT <b>★</b> TRAIN <b>★</b> SHIP{" "}
              <b>★</b>
            </span>
          </div>
        </div>

        {/* ================================================================ */}
        {/* ACT 02 — the index                                               */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--dark" id="index">
          <div className="mo-wrap">
            <Reveal className="mo-index-head">
              <div>
                <p className="mo-kicker">
                  Index <span className="mo-act-no">ACT 02</span>
                </p>
                <h2 className="mo-h2">
                  Choose a <em>chapter.</em>
                </h2>
              </div>
              <p className="mo-index-note">
                The portfolio as an operating system — every module, one
                surface.
              </p>
            </Reveal>
            <Reveal className="mo-rows" delay={0.08}>
              {INDEX_ROWS.map((row) => (
                <a className="mo-row" key={row.id} href={`#${row.id}`}>
                  <span className="mo-row-num">{row.num}</span>
                  <h3 className="mo-row-title">{row.title}</h3>
                  <p className="mo-row-desc">{row.desc}</p>
                  <span className="mo-row-arrow" aria-hidden="true">
                    ↘
                  </span>
                </a>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ACT 03 — practice (paper)                                        */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--paper" id="capability">
          <div className="mo-wrap">
            <Reveal>
              <p className="mo-kicker">
                Practice <span className="mo-act-no">ACT 03</span>
              </p>
              <div className="mo-head-row">
                <h2 className="mo-h2">
                  What I do,
                  <br />
                  <em>in practice.</em>
                </h2>
                <p className="mo-lede">
                  I work across two equally important practices: building and
                  advising on software systems, and building the people who
                  operate them.
                </p>
              </div>
            </Reveal>

            <Reveal className="mo-panes" delay={0.1}>
              <SpotlightCard className="mo-pane">
                <div className="mo-pane-bar">
                  <span className="mo-win" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  PRACTICE-01.BUILD
                  <span className="mo-pane-no">01</span>
                </div>
                <div className="mo-pane-body">
                  <span className="mo-pane-idx">
                    CONSULTING · DEVELOPMENT · ARCHITECTURE
                  </span>
                  <h3>Build the system.</h3>
                  <p>
                    Consulting, architecture and hands-on engineering for modern
                    frontend, full-stack, enterprise and AI-enabled systems.
                  </p>
                  <div className="mo-tags">
                    <span>React</span>
                    <span>Angular</span>
                    <span>TypeScript</span>
                    <span>Node.js</span>
                    <span>Azure</span>
                    <span>Terraform</span>
                    <span>AI / RAG</span>
                  </div>
                  <a className="mo-link" href="#work">
                    Explore engineering work <Arrow />
                  </a>
                </div>
              </SpotlightCard>

              <SpotlightCard className="mo-pane">
                <div className="mo-pane-bar">
                  <span className="mo-win" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  PRACTICE-02.TEACH
                  <span className="mo-pane-no">02</span>
                </div>
                <div className="mo-pane-body">
                  <span className="mo-pane-idx">
                    CORPORATE TECHNOLOGY TRAINING
                  </span>
                  <h3>Build the capability.</h3>
                  <p>
                    Role-based, practical programs that move engineers from
                    foundations to applied production work and ownership.
                  </p>
                  <div className="mo-tags">
                    <span>React</span>
                    <span>Angular</span>
                    <span>JavaScript</span>
                    <span>TypeScript</span>
                    <span>Node.js</span>
                    <span>Azure</span>
                    <span>Terraform</span>
                    <span>AI</span>
                  </div>
                  <a className="mo-link" href="#training">
                    Explore training <Arrow />
                  </a>
                </div>
              </SpotlightCard>
            </Reveal>

            <Reveal className="mo-services" delay={0.16}>
              <SpotlightCard className="mo-service">
                <span className="card-icon" aria-hidden="true">
                  ◌
                </span>
                <h3>AI / RAG Solutions</h3>
                <p>Build intelligent systems with LLMs, embeddings and real data.</p>
                <a className="mo-link" href="#insights">
                  Explore AI <Arrow />
                </a>
              </SpotlightCard>
              <SpotlightCard className="mo-service">
                <span className="card-icon" aria-hidden="true">
                  ▦
                </span>
                <h3>Real-world Projects</h3>
                <p>From concept to production with measurable impact.</p>
                <a className="mo-link" href="#work">
                  View projects <Arrow />
                </a>
              </SpotlightCard>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ACT 04 — pipeline console                                        */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--dark" id="approach">
          <div className="mo-wrap">
            <Reveal>
              <p className="mo-kicker">
                Pipeline <span className="mo-act-no">ACT 04</span>
              </p>
              <div className="mo-head-row">
                <h2 className="mo-h2">
                  From people
                  <br />
                  to real <em>impact.</em>
                </h2>
                <p className="mo-lede">
                  A practical, end-to-end approach to help teams and
                  organizations turn complex problems into scalable, real-world
                  solutions.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mo-stations" role="group" aria-label="Approach stations">
                {STATIONS.map((s, i) => (
                  <button
                    key={s.name}
                    type="button"
                    aria-pressed={station === i}
                    className={`mo-station ${station === i ? "is-active" : ""}`}
                    onClick={() => setStation(i)}
                  >
                    <span className="mo-st-no">0{i + 1}</span>
                    <span className="mo-st-dot" aria-hidden="true" />
                    <span className="mo-st-name">{s.name}</span>
                  </button>
                ))}
              </div>

              <div className="mo-panel" aria-live="polite">
                <span className="mo-panel-idx">0{station + 1}</span>
                <div>
                  <h3 className="mo-panel-name">{STATIONS[station].name}</h3>
                  <p className="mo-panel-desc">{STATIONS[station].desc}</p>
                </div>
                <p className="mo-panel-hint">
                  TIP — PRESS 1…5 TO INSPECT EACH STATION ·{" "}
                  {context[station]}
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ACT 05 — stack                                                   */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--deep" id="technology">
          <div className="mo-wrap">
            <Reveal>
              <p className="mo-kicker">
                Stack <span className="mo-act-no">ACT 05</span>
              </p>
              <div className="mo-head-row">
                <h2 className="mo-h2">
                  Systems I
                  <br />
                  <em>work with.</em>
                </h2>
                <p className="mo-lede">
                  Modern tools. Real solutions. Enterprise ready.
                </p>
              </div>
            </Reveal>
            <Reveal className="mo-chipwall" delay={0.1}>
              {STACK.map((x) => (
                <span className="mo-chip" key={x}>
                  <i aria-hidden="true">◇</i>
                  {x}
                </span>
              ))}
            </Reveal>
            <Reveal delay={0.18}>
              <p className="mo-stack-note">
                AND MORE — ALWAYS SHIPPING <a href="#work">SEE IT APPLIED →</a>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ACT 06 — case files (paper)                                      */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--paper" id="work">
          <div className="mo-wrap">
            <Reveal>
              <p className="mo-kicker">
                Case Files <span className="mo-act-no">ACT 06</span>
              </p>
              <div className="mo-head-row">
                <h2 className="mo-h2">
                  Problems → systems →
                  <br />
                  <em>outcomes.</em>
                </h2>
                <p className="mo-lede">
                  Case-study thinking over screenshot galleries: problem →
                  system → engineering → outcome.
                </p>
              </div>
            </Reveal>

            <Reveal className="mo-cases" delay={0.1}>
              <SpotlightCard className="mo-case mo-case--wide">
                <span className="mo-case-stamp">CASE FILE 01</span>
                <span className="mo-case-tag">
                  AQUATRACK / DATA → DECISIONS
                </span>
                <h3>Water consumption into an operational system.</h3>
                <p className="mo-case-chain">
                  Readings <b>→</b> analytics <b>→</b> billing <b>→</b>{" "}
                  expenses <b>→</b> reporting <b>→</b> alerts
                </p>
                <div className="mo-case-foot">
                  <span className="mo-case-tags">
                    React · TypeScript · Firebase · Analytics
                  </span>
                  <a className="mo-link" href="#contact">
                    Discuss the system <Arrow />
                  </a>
                </div>
              </SpotlightCard>

              <SpotlightCard className="mo-case">
                <span className="mo-case-stamp">CASE FILE 02</span>
                <span className="mo-case-tag">
                  INCOME TRACKER / STATE → TRUST
                </span>
                <h3>Authentication with lifecycle thinking.</h3>
                <p className="mo-case-chain">
                  Auth <b>→</b> token lifecycle <b>→</b> TTL <b>→</b>{" "}
                  refresh <b>→</b> data
                </p>
                <div className="mo-case-foot">
                  <span className="mo-case-tags">
                    React · TypeScript · Supabase
                  </span>
                  <a className="mo-link" href="#contact">
                    Discuss the system <Arrow />
                  </a>
                </div>
              </SpotlightCard>

              <SpotlightCard className="mo-case">
                <span className="mo-case-stamp">CASE FILE 03</span>
                <span className="mo-case-tag">
                  ENTERPRISE REACT / IDENTITY → EXPERIENCE
                </span>
                <h3>Role-aware enterprise interfaces.</h3>
                <p className="mo-case-chain">
                  User <b>→</b> auth <b>→</b> role-aware UX <b>→</b> React{" "}
                  <b>→</b> Dataverse
                </p>
                <div className="mo-case-foot">
                  <span className="mo-case-tags">
                    React · Entra ID · MSAL · Dataverse
                  </span>
                  <a className="mo-link" href="#contact">
                    Discuss the system <Arrow />
                  </a>
                </div>
              </SpotlightCard>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ACT 07 — academy                                                 */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--gold" id="training">
          <div className="mo-wrap">
            <Reveal>
              <p className="mo-kicker">
                Academy <span className="mo-act-no">ACT 07</span>
              </p>
              <div className="mo-head-row">
                <h2 className="mo-h2">
                  Training is capability
                  <br />
                  <em>engineering.</em>
                </h2>
                <p className="mo-lede">
                  Practical programs built around real stacks, production
                  scenarios and the transition from learning to ownership.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mo-steps">
                {["ASSESS", "FOUNDATION", "APPLIED", "PRODUCTION", "OWNERSHIP"].map(
                  (x, i) => (
                    <span key={x} style={{ display: "contents" }}>
                      {i > 0 && (
                        <span className="mo-step-arrow" aria-hidden="true">
                          →
                        </span>
                      )}
                      <span className="mo-step">{x}</span>
                    </span>
                  ),
                )}
              </div>
              <p className="mo-record">
                <span>
                  <b>15K+</b> ENGINEERS TRAINED
                </span>
                <span>
                  <b>350+</b> SESSIONS DELIVERED
                </span>
                <span>
                  <b>14+</b> YEARS IN PRODUCTION
                </span>
              </p>
              <a
                className="mo-btn mo-btn--solid"
                href={`mailto:${EMAIL}?subject=Training%20engagement`}
              >
                Discuss a Training Program <Arrow />
              </a>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ACT 08 — log                                                     */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--dark" id="insights">
          <div className="mo-wrap">
            <div className="mo-log-grid">
              <Reveal>
                <p className="mo-kicker">
                  Log <span className="mo-act-no">ACT 08</span>
                </p>
                <h2 className="mo-h2">
                  Experiment,
                  <br />
                  then <em>make it useful.</em>
                </h2>
                <p className="mo-lede">
                  AI / RAG · ENGINEERING · INFRASTRUCTURE — field notes from
                  building and teaching.
                </p>
              </Reveal>
              <Reveal className="mo-log-rows" delay={0.1}>
                <div className="mo-log-row">
                  <span className="mo-log-idx">[ 01 ]</span>
                  <div>
                    <strong>AI / RAG systems</strong>
                    <p>
                      LLM applications, embeddings, retrieval, vector search,
                      and practical AI workflows.
                    </p>
                  </div>
                </div>
                <div className="mo-log-row">
                  <span className="mo-log-idx">[ 02 ]</span>
                  <div>
                    <strong>Frontend architecture</strong>
                    <p>
                      React, Angular, state, micro frontends, and design
                      systems.
                    </p>
                  </div>
                </div>
                <div className="mo-log-row">
                  <span className="mo-log-idx">[ 03 ]</span>
                  <div>
                    <strong>Cloud / infrastructure</strong>
                    <p>
                      Azure, Terraform, CI/CD, and systems that can be
                      operated.
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ACT 09 — dossier (paper)                                         */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--paper" id="author">
          <div className="mo-wrap">
            <div className="mo-dossier">
              <Reveal className="mo-idcard">
                <Image
                  src={PROFILE_IMAGE}
                  alt="Portrait of Mohammad Moin"
                  width={340}
                  height={374}
                  sizes="(max-width: 1024px) 90vw, 340px"
                />
                <p className="mo-idcard-cap">
                  <span>SUBJECT · M. MOIN</span>
                  <span>FILE 09</span>
                </p>
                <dl className="mo-data">
                  <div>
                    <dt>Role</dt>
                    <dd>Consultant · Trainer</dd>
                  </div>
                  <div>
                    <dt>Experience</dt>
                    <dd>14+ Years</dd>
                  </div>
                  <div>
                    <dt>Focus</dt>
                    <dd>Systems × People × AI</dd>
                  </div>
                  <div>
                    <dt>Mode</dt>
                    <dd>Independent</dd>
                  </div>
                </dl>
              </Reveal>
              <Reveal className="mo-dossier-copy" delay={0.1}>
                <p className="mo-kicker">
                  Dossier <span className="mo-act-no">ACT 09</span>
                </p>
                <h2 className="mo-h2">
                  Build the system.
                  <br />
                  Develop the <em>capability.</em>
                </h2>
                <p>
                  I work at the intersection of engineering, people, and
                  practical delivery. I care about clear systems, useful
                  abstractions, production reality, and helping teams move from
                  knowing to doing.
                </p>
                <div className="mo-actions">
                  <a className="mo-btn mo-btn--solid" href={`mailto:${EMAIL}`}>
                    Open a Channel <Arrow />
                  </a>
                  <a className="mo-btn mo-btn--ghost" href="#work">
                    See the Work <Arrow />
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      {/* ACT 10 — channel */}
      <CinematicFooter id="contact" />
      <CinematicAudioControl />
      <MoinBuddy />
      <CustomCursor />
      <CommandPalette acts={ACTS} onNavigate={goTo} />
      <Terminal acts={ACTS} onNavigate={goTo} />
      <WormholeTransit act={active} />
    </div>
  );
}
