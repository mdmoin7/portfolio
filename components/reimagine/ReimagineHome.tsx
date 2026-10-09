"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { CinematicAudioControl } from "@/components/audio/CinematicAudio";
import { DeferredThreeDSystem } from "@/components/reimagine/DeferredThreeDSystem";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { MoinBuddy } from "@/components/reimagine/MoinBuddy";
import { SpotlightCard } from "@/components/ui/spotlight-card";
const PROFILE_IMAGE =
  "https://cdn.jsdelivr.net/gh/mdmoin7/portfolio@reimagine/v2/assets/profile.webp";
const EMAIL = "mohammadmoin.tech@gmail.com";
const nodes = ["PEOPLE", "PROBLEM", "DESIGN", "BUILD", "IMPACT"] as const;
const tech = [
  "React",
  "Angular",
  "Node.js",
  "Azure",
  "Terraform",
  "Dataverse",
  "AI / RAG",
];
const services = [
  [
    "◌",
    "AI / RAG Solutions",
    "Build intelligent systems with LLMs, embeddings and real data.",
    "#labs",
  ],
  [
    "▦",
    "Real-world Projects",
    "From concept to production with measurable impact.",
    "#work",
  ],
];
function Arrow() {
  return <span aria-hidden="true">→</span>;
}

/* Hero entrance choreography: explicit per-element delays so the reveal order
   is stable and readable. Everything collapses to a static render when the
   visitor prefers reduced motion. */
function heroEnter(reduce: boolean | null, delay: number) {
  return {
    initial: reduce ? false : { opacity: 0, y: 26, filter: "blur(8px)" },
    animate: reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" },
    transition: { duration: 0.9, delay, ease: "easeOut" as const },
  };
}

/* Opacity-only reveal for elements that already carry a CSS float animation
   (a motion transform would fight the keyframes). */
function heroFade(reduce: boolean | null, delay: number) {
  return {
    initial: reduce ? false : { opacity: 0 },
    animate: reduce ? undefined : { opacity: 1 },
    transition: { duration: 1.1, delay, ease: "easeOut" as const },
  };
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
    <motion.div {...heroEnter(reduce, delay)}>
      <strong aria-label={`${value}${suffix}`}>
        {n}
        {suffix}
      </strong>
      <span>{label}</span>
    </motion.div>
  );
}
export function ReimagineHome() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const heroGlow = useTransform(scrollYProgress, [0, 0.2], [1, 0.18]);
  const heroRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const saved = window.localStorage.getItem("moin-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);
  useEffect(() => {
    window.localStorage.setItem("moin-theme", theme);
  }, [theme]);
  /* Cursor spotlight: feed normalized coordinates to the hero CSS layer so the
     light follows the pointer without re-rendering React. */
  useEffect(() => {
    const el = heroRef.current;
    if (!el || reduce) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--hero-mx", `${px}px`);
      el.style.setProperty("--hero-my", `${py}px`);
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
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key >= "1" && e.key <= "5") setActive(Number(e.key) - 1);
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);
  const context = useMemo(
    () => ({
      PEOPLE: "Developing the capability behind the technology.",
      PROBLEM: "Understanding the real constraint before choosing a tool.",
      DESIGN: "Turning complexity into systems people can reason about.",
      BUILD: "Shipping production-minded software, not presentationware.",
      IMPACT: "Leaving behind usable systems, capability, and momentum.",
    }),
    [],
  );
  return (
    <div className={`reimagine ${theme === "light" ? "is-light" : "is-dark"}`}>
      <header className="top-nav">
        <a className="brand-lockup" href="#thesis">
          <span className="brand-mark" aria-hidden="true"><span>M</span></span>
          <span>
            <strong>MOHAMMAD MOIN</strong>
            <small>Consult · Build · Train</small>
          </span>
        </a>
        <nav>
          {[
            ["About", "author"],
            ["What I Do", "capability"],
            ["Training", "training"],
            ["Projects", "work"],
            ["Insights", "insights"],
            ["Contact", "contact"],
          ].map(([x, id]) => (
            <a key={x} href={`#${id}`}>
              {x}
            </a>
          ))}
        </nav>
        <div className="nav-actions">
          <button
            className="mode-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            aria-pressed={theme === "dark"}
          >
            ◐
          </button>
          <a className="nav-cta" href={`mailto:${EMAIL}`}>
            Let's Talk <Arrow />
          </a>
        </div>
      </header>
      <main>
        <section className="hero-v2" id="thesis" ref={heroRef}>
          <motion.div
            className="hero-orbit"
            style={reduce ? undefined : { opacity: heroGlow }}
          />
          <div className="hero-grid" />
          <div className="hero-sweep" aria-hidden="true" />
          <div className="hero-spot" aria-hidden="true" />
          <motion.div className="hero-meta mono" {...heroFade(reduce, 0.1)}>
            TECHNOLOGY × PEOPLE × REAL IMPACT
          </motion.div>
          <div className="hero-copy">
            <motion.p className="eyebrow mono" {...heroEnter(reduce, 0.3)}>
              WHO I AM · INDEPENDENT SOFTWARE ENGINEERING CONSULTANT
              <br />& CORPORATE TECHNOLOGY TRAINER
            </motion.p>
            <h1>
              <motion.span className="hero-line" {...heroEnter(reduce, 0.44)}>
                Mohammad Moin.
              </motion.span>
              <motion.em className="hero-line" {...heroEnter(reduce, 0.6)}>
                Build People. Solve Problems. Innovate.
              </motion.em>
            </h1>
            <motion.p className="hero-lede" {...heroEnter(reduce, 0.78)}>
              I design and build modern software systems, advise engineering
              teams, and develop production-ready capability through practical,
              hands-on training.
            </motion.p>
            <motion.div className="hero-actions" {...heroEnter(reduce, 0.92)}>
              <a href="#capability" className="primary-action">
                What I Do <Arrow />
              </a>
              <a href="#training" className="secondary-action">
                Training <Arrow />
              </a>
            </motion.div>
            <div className="hero-stats">
              <HeroStat reduce={reduce} delay={1.05} value={15} suffix="K+" label="Professionals Trained" />
              <HeroStat reduce={reduce} delay={1.17} value={350} suffix="+" label="Training Sessions" />
              <HeroStat reduce={reduce} delay={1.29} value={14} suffix="+" label="Years Experience" />
            </div>
          </div>
          <div className="hero-visual">
            <DeferredThreeDSystem />
            <motion.div className="hero-system-label label-people mono" {...heroFade(reduce, 1.2)}>
              PEOPLE
              <br />
              <span>capability</span>
            </motion.div>
            <motion.div className="hero-system-label label-engineering mono" {...heroFade(reduce, 1.35)}>
              ENGINEERING
              <br />
              <span>systems</span>
            </motion.div>
            <motion.div className="hero-system-label label-ai mono" {...heroFade(reduce, 1.5)}>
              AI / RAG
              <br />
              <span>intelligence</span>
            </motion.div>
            <motion.div className="hero-system-label label-impact mono" {...heroFade(reduce, 1.65)}>
              IMPACT
              <br />
              <span>outcomes</span>
            </motion.div>
            <motion.div className="hero-system-caption" {...heroFade(reduce, 1.8)}>
              <span className="mono">THE MOIN SYSTEM</span>
              <p>People × Engineering × AI</p>
            </motion.div>
          </div>
          <motion.div className="hero-scroll mono" {...heroFade(reduce, 2)}>
            SCROLL TO EXPLORE <span>↓</span>
          </motion.div>
        </section>
        <section className="capability-section" id="capability">
          <div className="section-kicker mono">02 / WHAT I DO</div>
          <div className="capability-lead">
            <p className="eyebrow mono">CAPABILITY → IMPACT</p>
            <h2>
              What I Do
              <br />
              <em>In Practice</em>
            </h2>
            <p>
              I work across two equally important practices: building and
              advising on software systems, and building the people who operate
              them.
            </p>
            <a className="section-link" href="#contact">
              Start a Conversation <Arrow />
            </a>
          </div>
          <div className="capability-content">
            <div className="practice-grid">
              <SpotlightCard className="practice-card">
                <span className="practice-index mono">01</span>
                <div>
                  <p className="eyebrow mono">
                    CONSULTING · DEVELOPMENT · ARCHITECTURE
                  </p>
                  <h3>Build the system.</h3>
                  <p>
                    Consulting, architecture and hands-on engineering for modern
                    frontend, full-stack, enterprise and AI-enabled systems.
                  </p>
                  <div className="practice-tags">
                    React · Angular · TypeScript · Node.js · Azure · Terraform ·
                    AI / RAG
                  </div>
                  <a href="#work">
                    Explore Engineering Work <Arrow />
                  </a>
                </div>
              </SpotlightCard>
              <SpotlightCard className="practice-card">
                <span className="practice-index mono">02</span>
                <div>
                  <p className="eyebrow mono">CORPORATE TECHNOLOGY TRAINING</p>
                  <h3>Build the capability.</h3>
                  <p>
                    Role-based, practical programs that move engineers from
                    foundations to applied production work and ownership.
                  </p>
                  <div className="practice-tags">
                    React · Angular · JavaScript · TypeScript · Node.js · Azure
                    · Terraform · AI
                  </div>
                  <a href="#training">
                    Explore Training <Arrow />
                  </a>
                </div>
              </SpotlightCard>
            </div>
            <div className="service-grid">
              {services.map(([icon, title, body, href]) => (
                <SpotlightCard key={title}>
                  <span className="card-icon">{icon}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                  <a href={href}>
                    {title === "AI / RAG Solutions"
                      ? "Explore AI"
                      : "View Projects"}{" "}
                    <Arrow />
                  </a>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>
        <section className="system-section" id="about">
          <div className="section-marker mono">01 / APPROACH</div>
          <div className="system-intro">
            <p className="eyebrow mono">MY APPROACH</p>
            <h2>
              From People
              <br />
              To Real <em>Impact</em>
            </h2>
            <p className="section-lede">
              A practical, end-to-end approach to help teams and organizations
              turn complex problems into scalable, real-world solutions.
            </p>
          </div>
          <div className="system-map">
            {nodes.map((n, i) => (
              <button
                key={n}
                className={`system-node ${active === i ? "active" : ""}`}
                onClick={() => setActive(i)}
                aria-pressed={active === i}
              >
                <span className="node-icon">
                  {["◉", "◎", "◇", "⌘", "↗"][i]}
                </span>
                <span className="node-index mono">0{i + 1}</span>
                <span className="node-name">{n}</span>
                <span className="node-description">
                  {
                    [
                      "Understand teams, challenges and goals.",
                      "Define the right problem to solve.",
                      "Architect practical and scalable solutions.",
                      "Engineer, implement and iterate.",
                      "Deliver measurable outcomes.",
                    ][i]
                  }
                </span>
              </button>
            ))}
          </div>
          <a className="section-link" href="#capability">
            Discover My Approach <Arrow />
          </a>
        </section>
        <section className="technology-section" id="technology">
          <div className="tech-copy">
            <p className="eyebrow mono">TECHNOLOGY LANDSCAPE</p>
            <h2>
              Systems I<br />
              <em>Work With</em>
            </h2>
            <p className="tech-lede">
              Modern tools. Real solutions. Enterprise ready.
            </p>
          </div>
          <div className="constellation">
            {tech.map((x, i) => (
              <div key={x} className={`tech-node t${i + 1}`}>
                <span>{["⚛", "A", "◇", "☁", "▾", "▦", "◉"][i]}</span>
                <strong>{x}</strong>
              </div>
            ))}
          </div>
          <a className="tech-more" href="#work">
            And more <Arrow />
          </a>
        </section>
        <section className="work-section" id="work">
          <div className="section-marker mono">03 / SELECTED WORK</div>
          <div className="work-head">
            <div>
              <p className="eyebrow mono">REAL-WORLD PROJECTS</p>
              <h2>
                Problems → systems →<br />
                <em>outcomes.</em>
              </h2>
            </div>
            <p>
              Case-study thinking over screenshot galleries: problem → system →
              engineering → outcome.
            </p>
          </div>
          <div className="work-grid">
            <SpotlightCard className="work-card work-featured">
              <span className="mono">AQUATRACK / DATA → DECISIONS</span>
              <h3>Water consumption into an operational system.</h3>
              <p>
                Readings → analytics → billing → expenses → reporting → alerts.
              </p>
              <div className="work-tags">
                React · TypeScript · Firebase · Analytics
              </div>
              <a href="#contact">
                Discuss the system <Arrow />
              </a>
            </SpotlightCard>
            <SpotlightCard className="work-card">
              <span className="mono">INCOME TRACKER / STATE → TRUST</span>
              <h3>Authentication with lifecycle thinking.</h3>
              <p>Auth → token lifecycle → TTL → refresh → data.</p>
              <div className="work-tags">React · TypeScript · Supabase</div>
            </SpotlightCard>
            <SpotlightCard className="work-card">
              <span className="mono">
                ENTERPRISE REACT / IDENTITY → EXPERIENCE
              </span>
              <h3>Role-aware enterprise interfaces.</h3>
              <p>User → auth → role-aware UX → React → Dataverse.</p>
              <div className="work-tags">
                React · Entra ID · MSAL · Dataverse
              </div>
            </SpotlightCard>
          </div>
        </section>
        <section className="training-section" id="training">
          <div className="section-marker mono">04 / PEOPLE</div>
          <div className="training-layout">
            <div>
              <p className="eyebrow mono">BUILD PEOPLE</p>
              <h2>
                Training is capability
                <br />
                <em>engineering.</em>
              </h2>
              <p>
                Practical programs built around real stacks, production
                scenarios and the transition from learning to ownership.
              </p>
            </div>
            <div className="training-flow">
              {[
                "ASSESS",
                "FOUNDATION",
                "APPLIED",
                "PRODUCTION",
                "OWNERSHIP",
              ].map((x, i) => (
                <span key={x}>
                  {i > 0 && "→"}
                  <b>{x}</b>
                </span>
              ))}
            </div>
            <p className="training-note">
              15K+ engineers trained · 350+ sessions delivered · 14+ years in
              production
            </p>
            <a
              className="primary-action"
              href={`mailto:${EMAIL}?subject=Training%20engagement`}
            >
              Discuss a training program <Arrow />
            </a>
          </div>
        </section>
        <section className="labs-section" id="insights">
          <div className="labs-layout">
            <div>
              <p className="eyebrow mono">AI / RAG / ENGINEERING</p>
              <h2>
                Experiment, then
                <br />
                <em>make it useful.</em>
              </h2>
            </div>
            <div className="lab-list">
              <div>
                <span className="mono">01</span>
                <strong>AI / RAG systems</strong>
                <p>
                  LLM applications, embeddings, retrieval, vector search, and
                  practical AI workflows.
                </p>
              </div>
              <div>
                <span className="mono">02</span>
                <strong>Frontend architecture</strong>
                <p>
                  React, Angular, state, micro frontends, and design systems.
                </p>
              </div>
              <div>
                <span className="mono">03</span>
                <strong>Cloud / infrastructure</strong>
                <p>
                  Azure, Terraform, CI/CD, and systems that can be operated.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="about-v2" id="author">
          <div className="author-layout">
            <div className="author-photo">
              <img src={PROFILE_IMAGE} alt="Portrait of Mohammad Moin" />
            </div>
            <div>
              <p className="eyebrow mono">THE PERSON BEHIND THE SYSTEM</p>
              <h2>
                Build the system.
                <br />
                Develop the <em>capability.</em>
              </h2>
              <p>
                I work at the intersection of engineering, people, and practical
                delivery. I care about clear systems, useful abstractions,
                production reality, and helping teams move from knowing to
                doing.
              </p>
            </div>
          </div>
        </section>
      </main>
      <CinematicFooter id="contact" />
      <MoinBuddy />
    </div>
  );
}
