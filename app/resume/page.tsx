"use client";
import "./MoinResume.css";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CinematicAudioControl } from "@/components/audio/CinematicAudio";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { MoinBuddy } from "@/components/reimagine/MoinBuddy";
import { MoinToon } from "@/components/reimagine/MoinToon";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { CommandPalette } from "@/components/reimagine/CommandPalette";
import { Terminal } from "@/components/reimagine/Terminal";
import { CustomCursor } from "@/components/reimagine/CustomCursor";
import { WormholeTransit } from "@/components/reimagine/WormholeTransit";
import {
  useScramble,
  useTypewriterCycle,
} from "@/components/reimagine/useTypewriter";

/* Single point of contact — the same address the footer, palette and console
   use, so the page ships no placeholder channels. */
const EMAIL = "mohammadmoin.tech@gmail.com";

const CONTACT = {
  email: EMAIL,
  linkedin: "https://linkedin.com/in/mdmoin7", // TODO: confirm handle
  github: "https://github.com/mdmoin7", // TODO: confirm handle
  cvPdf: "/assets/resume.pdf",
};

/* Module-level so the typewriter's dep identity is stable across the
   every-second clock re-render. Same three practices as the home page. */
const ROLE_PHRASES = [
  "SOFTWARE SYSTEMS & ARCHITECTURE",
  "ENGINEERING TEAM ADVISORY",
  "CORPORATE TECHNOLOGY TRAINING",
] as const;

/* -------------------------------------------------------------------------- */
/* Content. Edit freely — nothing here is derived from anything but what's     */
/* already true of the work; dates left as ranges where exact start dates      */
/* weren't on hand.                                                            */
/* -------------------------------------------------------------------------- */
const record = [
  {
    year: "2012 — Present",
    span: "2012",
    role: "Full Stack Engineer",
    org: "Independent / Freelance",
    body: "Fourteen-plus years across the JavaScript ecosystem — Angular, React, Vue, Node.js, React Native, TypeScript, NestJS. Recent builds include a water consumption and billing platform for apartment societies, and an internal email-automation API pairing templated content with AI-generated sections.",
    tags: ["React", "Angular", "Vue", "Node.js", "TypeScript", "NestJS"],
  },
  {
    year: "Ongoing · alongside the above",
    span: "15K+",
    role: "Corporate Trainer",
    org: "Freelance — enterprise clients",
    body: "Design and deliver engineering curricula for enterprise teams: frontend frameworks, backend architecture, DevOps tooling, and cross-stack bridge courses. 15K+ engineers trained across 350+ sessions.",
    tags: ["IBM", "Amazon", "Walmart", "SAP", "Dell"],
  },
] as const;

const curriculum = [
  {
    group: "Frontend",
    items: [
      "Angular (standalone + signals)",
      "React",
      "Vue → Angular migration",
      "Next.js",
      "TypeScript",
    ],
  },
  {
    group: "Backend & platform",
    items: ["Node.js", "NestJS", "Azure & .NET", "GenAI-powered .NET apps"],
  },
  {
    group: "DevOps & tooling",
    items: [
      "GitHub Actions",
      "Ansible",
      "Nx monorepos",
      "Code quality & standards",
    ],
  },
  {
    group: "Bridge courses",
    items: ["JS/TS → Python", "Java → Frontend engineering"],
  },
] as const;

const projects = [
  {
    name: "AquaTrack",
    role: "Product & engineering",
    body: "Water consumption and cost-recovery billing platform for apartment societies — tanker tracking, resident billing, and analytics.",
    stack: ["React", "TypeScript", "Vite", "Tailwind", "Firebase"],
  },
  {
    name: "Email Automation API",
    role: "Backend build",
    body: "API for sending routine business emails — proposals, TOCs — blending fixed templates with AI-generated sections over SMTP.",
    stack: ["Node.js", "Supabase", "Nodemailer"],
  },
  {
    name: "Portfolio",
    role: "Design & build",
    body: "Personal site built on a dual-pillar architecture separating engineering work from training work, with performance and SEO passes.",
    stack: ["React", "Next.js"],
  },
] as const;

const education = [
  // TODO: confirm degree / institution / years
  { year: "—", title: "Add degree, institution, and year" },
] as const;

/* Section spy drives the rail dots, the status-bar act crumb, and the toon's
   per-act walkthrough narration. */
const ACTS = [
  {
    id: "title",
    no: "01",
    label: "TITLE",
    tour: "Hi — I'm Moin's guide. Scroll on, I'll fly you through the record.",
  },
  {
    id: "record",
    no: "02",
    label: "RECORD",
    tour: "Fourteen-plus years in production: full stack engineering, end to end.",
  },
  {
    id: "academy",
    no: "03",
    label: "ACADEMY",
    tour: "He trains too — 15K+ engineers across 350+ enterprise sessions.",
  },
  {
    id: "work",
    no: "04",
    label: "CASE FILES",
    tour: "Selected builds. AquaTrack, the email API, this site — shipped.",
  },
  {
    id: "file",
    no: "05",
    label: "FILE",
    tour: "The formal record, plus every direct way to reach him.",
  },
  {
    id: "contact",
    no: "06",
    label: "CHANNEL",
    tour: "That's the walkthrough. Open a channel whenever you're ready.",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Motion helpers — same choreography as the home page title sequence.         */
/* -------------------------------------------------------------------------- */
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
  children: React.ReactNode;
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

function Arrow() {
  return <span aria-hidden="true">→</span>;
}

/* -------------------------------------------------------------------------- */
/* Page — MOIN.OS frame (status bar + left rail) with the CV acts behind it.   */
/* -------------------------------------------------------------------------- */
export default function MoinResume() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroRef = useRef<HTMLElement | null>(null);

  const [active, setActive] = useState<string>("title");
  const [pct, setPct] = useState(0);
  const [clock, setClock] = useState("--:--:--");
  const [today, setToday] = useState("");

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

  /* --- ktzm-style opening: pin the name, grow the portrait inside it ------
     All values are read from the hero's own progress (0 → 1 across the hero
     block), not page progress, so the choreography is independent of how
     tall the rest of the page is. Drives transforms directly — no re-render.
     With reduced motion every range collapses to a static composition. */
  /* Framer's scroll acceleration attaches a native WAAPI ViewTimeline for
     target-based progress — but the nearest scroll container of the hero is
     the .reimagine wrapper (overflow: hidden), which never scrolls, and the
     "contain" named range it maps to is degenerate for a 300vh subject. The
     result is a frozen mid-transition animation overriding inline styles.
     Mirror the (correctly tracked) JS progress into a plain MotionValue:
     plain values have no accelerate config, so every derived transform below
     renders through the regular per-frame path. */
  const { scrollYProgress: heroProgressRaw } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"],
  });
  const heroProgress = useMotionValue(0);
  useMotionValueEvent(heroProgressRaw, "change", (v) =>
    heroProgress.set(v),
  );

  const nameScale = useTransform(
    heroProgress,
    [0, 0.62],
    reduce ? [1, 1] : [1, 8.5],
  );
  /* y owns the -50% that centers the name on the 50% line (CSS top alone
     would leave it hanging below); the drift is the ktzm push-up. */
  const nameY = useTransform(
    heroProgress,
    [0, 0.62],
    reduce ? ["-50%", "-50%"] : ["-50%", "-56%"],
  );
  /* Name holds, then dissolves as the portrait takes over the frame. */
  const nameOpacity = useTransform(
    heroProgress,
    [0.5, 0.7],
    reduce ? [1, 1] : [1, 0],
  );
  /* The masked portrait bleeds to a full-frame photo, then dims for the copy. */
  const photoOpacity = useTransform(
    heroProgress,
    [0.34, 0.6, 0.92],
    reduce ? [0, 0, 0] : [0, 1, 0.34],
  );
  /* Slow push-in on the photo while it owns the frame. */
  const photoScale = useTransform(
    heroProgress,
    [0.34, 1],
    reduce ? [1, 1] : [1.12, 1],
  );
  const ctaOpacity = useTransform(
    heroProgress,
    [0, 0.16],
    reduce ? [1, 1] : [1, 0],
  );
  const statementOpacity = useTransform(
    heroProgress,
    [0.62, 0.8, 0.97],
    reduce ? [0, 0, 0] : [0, 1, 1],
  );
  const statementY = useTransform(
    heroProgress,
    [0.62, 0.8],
    reduce ? ["0%", "0%"] : ["26px", "0%"],
  );
  /* The faded UI must not keep intercepting clicks (opacity ≠ inert). */
  const uiPointer = useTransform(
    heroProgress,
    [0.15, 0.16],
    reduce ? ["auto", "auto"] : ["auto", "none"],
  );

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

  const activeMeta =
    ACTS.find((a) => a.id === active) ?? (ACTS[0] as (typeof ACTS)[number]);

  /* Jump helper shared by the launcher, terminal and rail. */
  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };

  /* Hero role line cycles through the three practices. */
  const roleCycle = useTypewriterCycle(ROLE_PHRASES, { enabled: !reduce });

  /* Status-bar crumb settles in with a terminal-style scramble. */
  const crumbScramble = useScramble(
    `ACT ${activeMeta.no} / ${activeMeta.label}`,
    !reduce,
  );

  const heroBase = reduce ? 0 : 0.1;

  return (
    <div className="reimagine mo resume-page">
      {/* ---------------------------------------------------------------- */}
      {/* Status bar                                                        */}
      {/* ---------------------------------------------------------------- */}
      <header className="mo-status">
        <Link className="mo-status-brand" href="/">
          MOIN<i>.OS</i>
          <small>v3.0</small>
        </Link>
        <p className="mo-crumb" aria-live="polite">
          {crumbScramble}
        </p>
        <div className="mo-status-right">
          <button
            type="button"
            className="mo-launcher"
            data-cursor="⌘K"
            onClick={() =>
              globalThis.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true }),
              )
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
            data-cursor=">_"
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
        <span className="mo-rail-brand">
          MOIN<i>.OS</i> — RESUME
        </span>
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
        <section className="cv-hero" id="title" ref={heroRef}>
          {/* Sticky viewport. The name stays pinned while you scroll; the
              portrait masked inside it grows until it takes over the frame,
              then hands off to a statement line — the ktzm-style opening. */}
          <div className="cv-hero-sticky">
            <div className="cv-hero-grid" aria-hidden="true" />

            {/* Full-frame portrait layer — takes over from the masked name. */}
            <motion.span
              className="cv-name-photo"
              style={{ opacity: photoOpacity, scale: photoScale }}
              aria-hidden="true"
            />

            {/* Giant name with the portrait clipped inside the letterforms. */}
            <motion.h1
              className="cv-name"
              aria-hidden="true"
              style={{ scale: nameScale, y: nameY, opacity: nameOpacity }}
            >
              MOIN
            </motion.h1>

            {/* Statement that takes over once the portrait fills the frame. */}
            <motion.p
              className="cv-statement"
              style={{ opacity: statementOpacity, y: statementY }}
            >
              I build software,
              <em>then I teach it.</em>
            </motion.p>

            <motion.div
              className="cv-hero-ui"
              style={{ opacity: ctaOpacity, pointerEvents: uiPointer }}
            >
              <motion.p className="cv-slug" {...enter(reduce, heroBase)}>
                <i>CURRICULUM VITAE:</i> MOHAMMAD MOIN · ACT 01
              </motion.p>

              <h1 className="cv-sr">Mohammad Moin — resume</h1>

              <div className="cv-hero-copy">
                <motion.p
                  className="cv-tagline"
                  {...enter(reduce, heroBase + 0.3)}
                >
                  Full stack engineer and corporate technology trainer in
                  Bengaluru.
                  <br />&amp; <span className="cv-type">{roleCycle}</span>
                  <span className="mo-caret" aria-hidden="true" />
                </motion.p>

                <motion.div
                  className="cv-actions"
                  {...enter(reduce, heroBase + 0.5)}
                >
                  <a
                    className="cv-dl"
                    href={CONTACT.cvPdf}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Download the CV <span aria-hidden="true">↓</span>
                  </a>
                </motion.div>
              </div>

              <motion.div
                className="cv-hero-foot"
                {...enter(reduce, heroBase + 0.7)}
              >
                <a className="cv-foot-mail" href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
                <span className="cv-scrollcue">
                  Read the full record <span aria-hidden="true">↘</span>
                </span>
                <span className="cv-foot-log">
                  SESSION LOG · {today || "—"}
                </span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Marquee band */}
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
        {/* ACT 02 — the record                                              */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--dark" id="record">
          <div className="mo-wrap">
            <Reveal>
              <p className="mo-kicker">
                The Record <span className="mo-act-no">ACT 02</span>
              </p>
              <div className="mo-head-row">
                <h2 className="mo-h2">
                  The record,
                  <br />
                  <em>end to end.</em>
                </h2>
                <p className="mo-lede">
                  Engineering work runs the whole way through; the training
                  practice runs alongside it.
                </p>
              </div>
            </Reveal>

            <Reveal className="cv-timeline" delay={0.08}>
              {record.map((r) => (
                <article className="cv-entry" key={r.role}>
                  <span className="cv-entry-year" aria-hidden="true">
                    {r.span}
                  </span>
                  <div className="cv-entry-body">
                    <span className="resume-meta-line">
                      {r.year} · {r.org}
                    </span>
                    <strong>{r.role}</strong>
                    <p>{r.body}</p>
                    <div className="resume-tags">
                      {r.tags.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ACT 03 — academy (what I teach)                                  */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--gold" id="academy">
          <div className="mo-wrap">
            <Reveal>
              <p className="mo-kicker">
                Academy <span className="mo-act-no">ACT 03</span>
              </p>
              <div className="mo-head-row">
                <h2 className="mo-h2">
                  Curricula built for
                  <br />
                  <em>enterprise teams.</em>
                </h2>
                <p className="mo-lede">
                  Frontend, backend, DevOps and bridge courses — most delivered
                  as structured, formatted courseware.
                </p>
              </div>
            </Reveal>

            <Reveal className="mo-log-rows" delay={0.08}>
              {curriculum.map((c, i) => (
                <div className="mo-log-row" key={c.group}>
                  <span className="mo-log-idx">
                    [ {String(i + 1).padStart(2, "0")} ]
                  </span>
                  <div>
                    <strong>{c.group}</strong>
                    <p>{c.items.join(" · ")}</p>
                  </div>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.14}>
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
        {/* ACT 04 — case files (what I build)                               */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--paper" id="work">
          <div className="mo-wrap">
            <Reveal>
              <p className="mo-kicker">
                Case Files <span className="mo-act-no">ACT 04</span>
              </p>
              <div className="mo-head-row">
                <h2 className="mo-h2">
                  What I build,
                  <br />
                  <em>shipped end to end.</em>
                </h2>
                <p className="mo-lede">
                  Selected products — problem, system, outcome.
                </p>
              </div>
            </Reveal>

            <Reveal className="mo-cases" delay={0.1}>
              {projects.map((p, i) => (
                <SpotlightCard
                  className={`mo-case${i === 0 ? " mo-case--wide" : ""}`}
                  key={p.name}
                >
                  <span className="mo-case-stamp">
                    CASE FILE {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mo-case-tag">
                    {p.name.toUpperCase()} / {p.role.toUpperCase()}
                  </span>
                  <h3>{p.name}</h3>
                  <p>{p.body}</p>
                  <div className="mo-case-foot">
                    <span className="mo-case-tags">{p.stack.join(" · ")}</span>
                    <a className="mo-link" href="#contact">
                      Open a channel <Arrow />
                    </a>
                  </div>
                </SpotlightCard>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* ACT 05 — file (education + direct channels)                      */}
        {/* ================================================================ */}
        <section className="mo-act mo-act--dark" id="file">
          <div className="mo-wrap">
            <Reveal>
              <p className="mo-kicker">
                File <span className="mo-act-no">ACT 05</span>
              </p>
              <div className="mo-head-row">
                <h2 className="mo-h2">
                  Education &amp;
                  <br />
                  <em>open channels.</em>
                </h2>
                <p className="mo-lede">
                  The formal record, and every direct way in.
                </p>
              </div>
            </Reveal>

            <Reveal className="resume-file" delay={0.1}>
              <div>
                <span className="resume-subhead">Education</span>
                <ul className="resume-edu">
                  {education.map((e) => (
                    <li key={e.title}>
                      <span className="resume-edu-year">{e.year}</span>
                      <span>{e.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="resume-subhead">Direct</span>
                <dl className="resume-meta">
                  <div>
                    <dt>Based</dt>
                    <dd>Bengaluru, India</dd>
                  </div>
                  <div>
                    <dt>Email</dt>
                    <dd>
                      <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                    </dd>
                  </div>
                  <div>
                    <dt>Elsewhere</dt>
                    <dd>
                      <a
                        href={CONTACT.linkedin}
                        target="_blank"
                        rel="noreferrer"
                      >
                        LinkedIn
                      </a>
                      {" · "}
                      <a href={CONTACT.github} target="_blank" rel="noreferrer">
                        GitHub
                      </a>
                    </dd>
                  </div>
                </dl>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* ACT 06 — channel */}
      <CinematicFooter id="contact" homeHref="/" />
      <CinematicAudioControl />
      <MoinBuddy />
      <MoinToon acts={ACTS} active={active} />
      <CustomCursor />
      <CommandPalette acts={ACTS} onNavigate={goTo} />
      <Terminal acts={ACTS} onNavigate={goTo} />
      <WormholeTransit act={active} />
    </div>
  );
}
