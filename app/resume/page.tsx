"use client";
import "./MoinResume.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CinematicFooter } from "@/components/ui/motion-footer";
import { MoinBuddy } from "@/components/reimagine/MoinBuddy";
import GlyphPortal from "@/components/ui/glyph-portal";

/* -------------------------------------------------------------------------
   Fill these in — the only hand-typed placeholders in this file.
   ------------------------------------------------------------------------- */
const CONTACT = {
  email: "hello@example.com", // TODO: real email
  linkedin: "https://linkedin.com/in/mdmoin7", // TODO: confirm handle
  github: "https://github.com/mdmoin7", // TODO: confirm handle
  cvPdf: "/moin-resume.pdf", // TODO: path to a downloadable CV
};

/* -------------------------------------------------------------------------
   Content. Edit freely — nothing here is derived from anything but what's
   already true of the work; dates left as ranges where exact start dates
   weren't on hand.
   ------------------------------------------------------------------------- */
const record = [
  {
    year: "2012 — Present",
    role: "Full Stack Engineer",
    org: "Independent / Freelance",
    body: "Fourteen-plus years across the JavaScript ecosystem — Angular, React, Vue, Node.js, React Native, TypeScript, NestJS. Recent builds include a water consumption and billing platform for apartment societies, and an internal email-automation API pairing templated content with AI-generated sections.",
    tags: ["React", "Angular", "Vue", "Node.js", "TypeScript", "NestJS"],
  },
  {
    year: "Ongoing · alongside the above",
    role: "Corporate Trainer",
    org: "Freelance — enterprise clients",
    body: "Design and deliver engineering curricula for enterprise teams: frontend frameworks, backend architecture, DevOps tooling, and cross-stack bridge courses. Thousands of engineers trained across hundreds of sessions.",
    tags: ["IBM", "Amazon", "Walmart", "SAP", "Dell"],
  },
] as const;

const stats = [
  { value: "14+", label: "years in the JS ecosystem" },
  { value: "1000s", label: "engineers trained" },
  { value: "100s", label: "training sessions delivered" },
  { value: "5", label: "enterprise training clients" },
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
  { year: "—", title: "Add degree, institution, and year", detail: "" },
] as const;

/* ------------------------------------------------------------------------- */

export default function MoinResume() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = window.localStorage.getItem("moin-theme");
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    window.localStorage.setItem("moin-theme", theme);
  }, [theme]);

  return (
    <div className={`reimagine is-${theme} resume-page`}>
      <header className="top-nav resume-nav">
        <a className="brand-lockup" href="/">
          <span className="brand-mark" aria-hidden="true"><span>M</span></span>
          <span>
            <strong>MOHAMMAD MOIN</strong>
            <small>Consult · Build · Train</small>
          </span>
        </a>
        <nav>
          {[
            ["About", "/#author"],
            ["What I Do", "/#capability"],
            ["Training", "/#training"],
            ["Projects", "/#work"],
            ["Insights", "/#insights"],
            ["Contact", "/#contact"],
          ].map(([label, href]) => (
            <a key={label} href={href}>{label}</a>
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
          <a className="nav-cta" href="mailto:mohammadmoin.tech@gmail.com">
            Let's Talk <span aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <main className="resume-main">
        <section className="moin-resume" aria-label="Resume">
      <GlyphPortal
        className="resume-glyph-portal"
        word="MOIN"
        focusChar="M"
        scrollLength={2.2}
        interactive
        enterLabel="View resume"
        style={{
          "--gp-paper": theme === "dark" ? "#1E2749" : "#FAFAFF",
          "--gp-ink": theme === "dark" ? "#FAFAFF" : "#1E2749",
          "--gp-field": theme === "dark" ? "#273469" : "#1E2749",
          "--gp-foreground": "#FAFAFF",
        }}
        background={
          <div
            className="resume-glyph-field"
            aria-hidden="true"
          />
        }
        front={
          <>
            <div className="resume-glyph-meta">
              <span>CURRICULUM VITAE</span>
              <span>MOHAMMAD MOIN · 2026</span>
            </div>
            <div className="resume-glyph-center">
              <span>INDEPENDENT SOFTWARE ENGINEERING CONSULTANT</span>
              <span>× CORPORATE TECHNOLOGY TRAINER</span>
            </div>
          </>
        }
      >
        <div className="resume-glyph-content">
          <span className="moin-resume-eyebrow mono">Curriculum Vitae</span>
          <h1>I build software, then I teach it.</h1>
          <p className="moin-resume-sub">
            Full stack engineer and freelance corporate trainer based in
            Bengaluru, India — fourteen-plus years across the JavaScript
            ecosystem, shipping products and running the curricula that bring
            enterprise teams up to speed on them.
          </p>
          <div className="moin-resume-cta-row">
            <a className="moin-resume-btn moin-resume-btn-primary" href={CONTACT.cvPdf}>
              Download resume ↓
            </a>
            <a className="moin-resume-btn moin-resume-btn-ghost" href={`mailto:${CONTACT.email}`}>
              Write to me
            </a>
          </div>
          <div className="moin-resume-stat-row">
            {stats.map((s) => (
              <div className="moin-resume-stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </GlyphPortal>

      {/* The record */}
      <div className="moin-resume-section">
        <div className="moin-resume-section-head">
          <span className="moin-resume-index mono">01</span>
          <h2>The record</h2>
          <p>
            Engineering work runs the whole way through; the training practice
            runs alongside it.
          </p>
        </div>
        <ol className="moin-resume-record">
          {record.map((r, i) => (
            <li className="moin-resume-record-item" key={r.role}>
              <span className="moin-resume-record-num mono">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="moin-resume-record-body">
                <span className="moin-resume-record-year mono">{r.year}</span>
                <h3>{r.role}</h3>
                <span className="moin-resume-record-org">{r.org}</span>
                <p>{r.body}</p>
                <div className="moin-resume-chip-row">
                  {r.tags.map((t) => (
                    <span className="moin-resume-chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      {/* What I teach */}
      <div className="moin-resume-section">
        <div className="moin-resume-section-head">
          <span className="moin-resume-index mono">02</span>
          <h2>What I teach</h2>
          <p>
            Curricula built for enterprise teams — most delivered as structured,
            formatted courseware.
          </p>
        </div>
        <div className="moin-resume-curriculum-grid">
          {curriculum.map((c) => (
            <div className="moin-resume-curriculum-card" key={c.group}>
              <h3>{c.group}</h3>
              <ul>
                {c.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* What I build */}
      <div className="moin-resume-section">
        <div className="moin-resume-section-head">
          <span className="moin-resume-index mono">03</span>
          <h2>What I build</h2>
          <p>Selected products, shipped end to end.</p>
        </div>
        <div className="moin-resume-project-grid">
          {projects.map((p) => (
            <div className="moin-resume-project-card" key={p.name}>
              <div className="moin-resume-project-head">
                <h3>{p.name}</h3>
                <span className="mono">{p.role}</span>
              </div>
              <p>{p.body}</p>
              <div className="moin-resume-chip-row">
                {p.stack.map((s) => (
                  <span className="moin-resume-chip" key={s}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="moin-resume-section">
        <div className="moin-resume-section-head">
          <span className="moin-resume-index mono">04</span>
          <h2>Education</h2>
        </div>
        <ul className="moin-resume-education">
          {education.map((e) => (
            <li key={e.title}>
              <span className="mono">{e.year}</span>
              <span>{e.title}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Contact */}
      <div className="moin-resume-contact">
        <div className="moin-resume-contact-copy">
          <span className="moin-resume-index mono">05</span>
          <h2>Open to the right problem.</h2>
          <p>
            Freelance engineering engagements, and corporate training programs.
          </p>
        </div>
        <div className="moin-resume-contact-meta">
          <div>
            <span className="mono">Based</span>
            <span>Bengaluru, India</span>
          </div>
          <div>
            <span className="mono">Email</span>
            <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          </div>
          <div>
            <span className="mono">Elsewhere</span>
            <span>
              <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              {" · "}
              <a href={CONTACT.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            </span>
          </div>
        </div>
      </div>
        </section>
      </main>
      <CinematicFooter id="resume-footer" homeHref="/" />
      <MoinBuddy />
    </div>
  );
}
