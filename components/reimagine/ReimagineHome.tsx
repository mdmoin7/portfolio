"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { CinematicSound } from "@/components/reimagine/CinematicSound";

const nodes = ["PEOPLE", "PROBLEM", "DESIGN", "BUILD", "IMPACT"] as const;
const tech = ["React", "Angular", "TypeScript", "Node.js", "Next.js", "Azure", "Terraform", "Dynamics 365", "Entra ID", "Firebase", "Supabase", "AI / RAG"];

function Arrow() { return <span aria-hidden="true">↗</span>; }

export function ReimagineHome() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const [active, setActive] = useState(0);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const heroGlow = useTransform(scrollYProgress, [0, .18], [1, .25]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key >= "1" && e.key <= "5") setActive(Number(e.key) - 1); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const context = useMemo(() => ({
    PEOPLE: "Developing the capability behind the technology.",
    PROBLEM: "Understanding the real constraint before choosing a tool.",
    DESIGN: "Turning complexity into systems people can reason about.",
    BUILD: "Shipping production-minded software, not presentationware.",
    IMPACT: "Leaving behind usable systems, capability, and momentum.",
  }), []);

  return (
    <div className={`reimagine ${theme === "light" ? "is-light" : "is-dark"}`}>
      <aside className="spatial-nav" aria-label="Portfolio navigation">
        <div className="spatial-brand">MM<span>/</span>26</div><div className="spatial-line" aria-hidden="true" />
        <nav>{["THESIS", "SYSTEM", "CAPABILITY", "WORK", "TRAINING", "LABS", "CONTACT"].map((item) => <a key={item} href={`#${item.toLowerCase()}`} className="spatial-link"><span>{item}</span></a>)}</nav>
        <button className="mode-toggle" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle visual environment"><span aria-hidden="true">{theme === "dark" ? "◐" : "◑"}</span></button>
      </aside>

      <main>
        <section className="hero-v2" id="thesis">
          <motion.div className="hero-orbit" style={reduce ? undefined : { opacity: heroGlow }} aria-hidden="true" /><div className="hero-grid" aria-hidden="true" />
          <div className="hero-meta mono"><span>MOHAMMAD MOIN</span><span>·</span><span>INDEPENDENT CONSULTANT</span><span>·</span><span>CORPORATE TECHNOLOGY TRAINER</span></div>
          <div className="hero-copy"><p className="eyebrow mono">ENGINEERING × PEOPLE × AI</p><h1>Technology becomes<br /><em>capability.</em></h1><p className="hero-lede">I help organizations turn technology into capability — by building the solution and developing the people who operate it.</p><div className="hero-actions"><a href="#work" className="primary-action">Explore the work <Arrow /></a><a href="mailto:mohammad.nicoll@gmail.com" className="text-action">Start a conversation <Arrow /></a></div></div>
          <div className="hero-signature mono">BUILD PEOPLE.<br />SOLVE PROBLEMS.<br />INNOVATE.</div><div className="hero-scroll mono">SCROLL TO ENTER SYSTEM <span>↓</span></div>
        </section>

        <section className="system-section" id="system"><div className="section-marker mono">01 / SYSTEM</div><div className="system-intro"><p className="eyebrow mono">HOW I THINK</p><h2>A system is only useful<br />when people can <em>own</em> it.</h2></div>
          <div className="system-map" role="group" aria-label="People to impact system map"><div className="system-track" aria-hidden="true" />{nodes.map((node, i) => <button key={node} className={`system-node ${active === i ? "active" : ""}`} onClick={() => setActive(i)} aria-pressed={active === i}><span className="node-index mono">0{i + 1}</span><span className="node-name">{node}</span><span className="node-dot" aria-hidden="true" /></button>)}</div>
          <motion.div className="system-context" key={nodes[active]} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><span className="mono">{nodes[active]}</span><p>{context[nodes[active]]}</p></motion.div>
        </section>

        <section className="capability-section" id="capability"><div className="section-marker mono">02 / CAPABILITY</div><div className="capability-copy"><p className="eyebrow mono">WHAT I BRING</p><h2>Think clearly.<br /><em>Build deliberately.</em></h2></div><div className="capability-grid">
          <article><span className="card-num mono">01</span><h3>Consulting</h3><p>Architecture, engineering decisions, enterprise applications, and the path from ambiguous problem to working system.</p><a href="mailto:mohammad.nicoll@gmail.com?subject=Consulting%20engagement">Discuss consulting <Arrow /></a></article>
          <article><span className="card-num mono">02</span><h3>Training</h3><p>Hands-on corporate technology programs designed around production scenarios, engineering practice, and ownership.</p><a href="mailto:mohammad.nicoll@gmail.com?subject=Corporate%20training">Discuss training <Arrow /></a></article>
          <article><span className="card-num mono">03</span><h3>AI / RAG</h3><p>An emerging engineering direction: LLM applications, retrieval, embeddings, vector search, and practical AI workflows.</p><a href="#labs">Explore labs <Arrow /></a></article>
        </div></section>

        <section className="technology-section" id="technology" aria-labelledby="technology-title"><div className="section-marker mono">03 / TECHNOLOGY</div><div className="tech-copy"><p className="eyebrow mono">THE LANDSCAPE</p><h2 id="technology-title">Tools are nodes.<br />Capability is the <em>network.</em></h2></div><div className="constellation" aria-label="Technology constellation">{tech.map((item, i) => <button key={item} className={`tech-node t${i + 1}`} onClick={() => setActive(i % 5)}>{item}</button>)}<div className="constellation-core">ENGINEERING<br /><small>+ AI</small></div></div></section>

        <section className="work-section" id="work"><div className="section-marker mono">04 / WORK</div><div className="work-head"><div><p className="eyebrow mono">SELECTED SYSTEMS</p><h2>Problems made <em>concrete.</em></h2></div><p>Short case studies. High signal. The architecture and decisions matter more than a gallery of screenshots.</p></div><div className="work-grid">
          <article className="work-card work-featured"><span className="mono">AQUATRACK / DATA → DECISIONS</span><h3>Water consumption into an operational system.</h3><p>Readings → analytics → billing → expenses → reporting → alerts.</p><div className="work-tags">React · TypeScript · Firebase · Analytics</div><a href="#contact">Discuss the system <Arrow /></a></article>
          <article className="work-card"><span className="mono">INCOME TRACKER / STATE → TRUST</span><h3>Authentication with lifecycle thinking.</h3><p>Auth → token lifecycle → TTL → refresh → data.</p><div className="work-tags">React · TypeScript · Supabase</div></article>
          <article className="work-card"><span className="mono">ENTERPRISE REACT / IDENTITY → EXPERIENCE</span><h3>Role-aware enterprise interfaces.</h3><p>User → auth → role-aware UX → React → Dataverse.</p><div className="work-tags">React · Entra ID · MSAL · Dataverse</div></article>
        </div></section>

        <section className="training-section" id="training"><div className="section-marker mono">05 / TRAINING</div><div className="training-layout"><div><p className="eyebrow mono">BUILD PEOPLE</p><h2>Training is not content delivery.<br /><em>It is capability engineering.</em></h2></div><div className="training-flow"><div>ASSESS</div><span>→</span><div>FOUNDATION</div><span>→</span><div>APPLIED</div><span>→</span><div>PRODUCTION</div><span>→</span><div>OWNERSHIP</div></div><p className="training-note">15K+ engineers trained · 350+ sessions delivered · 14+ years in production</p><a className="primary-action" href="mailto:mohammad.nicoll@gmail.com?subject=Training%20engagement">Discuss a training program <Arrow /></a></div></section>

        <section className="labs-section" id="labs"><div className="section-marker mono">06 / LABS</div><div className="labs-layout"><div><p className="eyebrow mono">EXPERIMENT / LEARN / BUILD</p><h2>Curiosity, with<br /><em>an engineering bias.</em></h2></div><div className="lab-list"><div><span className="mono">01</span><strong>AI / RAG systems</strong><p>Retrieval, embeddings, vector search, and useful LLM workflows.</p></div><div><span className="mono">02</span><strong>Frontend architecture</strong><p>React, Angular, state, micro frontends, and design systems.</p></div><div><span className="mono">03</span><strong>Cloud / infrastructure</strong><p>Azure, Terraform, CI/CD, and systems that can be operated.</p></div></div></div></section>

        <section className="about-v2" id="about"><div className="section-marker mono">07 / AUTHOR</div><div className="author-layout"><div className="author-photo"><img src="/assets/profile.webp" alt="Portrait of Mohammad Moin, independent technology consultant and corporate technology trainer" /></div><div><p className="eyebrow mono">THE PERSON BEHIND THE SYSTEM</p><h2>Technology should leave people<br />with <em>more capability.</em></h2><p>I work at the intersection of engineering, people, and practical delivery. I care about clear systems, useful abstractions, production reality, and helping teams move from knowing to doing.</p><p>The measure is simple: the solution works, the people can operate it, and the organization can keep moving.</p></div></div></section>

        <section className="contact-v2" id="contact"><div className="section-marker mono">08 / CONTACT</div><div className="contact-center"><p className="eyebrow mono">WHEN YOU'RE READY</p><h2>Have a problem worth<br /><em>building around?</em></h2><p>Consulting, corporate training, engineering work, or a conversation about what comes next.</p><a className="contact-link" href="mailto:mohammad.nicoll@gmail.com">mohammad.nicoll@gmail.com <Arrow /></a><div className="contact-meta mono"><span>BUILD PEOPLE</span><span>SOLVE PROBLEMS</span><span>INNOVATE</span></div></div></section>
      </main>
      <footer className="footer-v2"><span>MOHAMMAD MOIN</span><span>INDEPENDENT CONSULTANT · CORPORATE TECHNOLOGY TRAINER</span><span>© 2026</span></footer>
      <CinematicSound />
    </div>
  );
}
