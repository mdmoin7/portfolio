"use client";

import { useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DeferredThreeDSystem } from "@/components/reimagine/DeferredThreeDSystem";

type Variant = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J";

const variants: { id: Variant; name: string; description: string }[] = [
  { id: "A", name: "The Moin System", description: "Scroll assembles the way you think." },
  { id: "B", name: "Choose the Problem", description: "The visitor becomes part of the story." },
  { id: "C", name: "Unfinished Identity", description: "Typography constructs your identity." },
  { id: "D", name: "The Question", description: "A question resolves into your positioning." },
  { id: "E", name: "Unfolding Blueprint", description: "A technical blueprint reveals the system." },
  { id: "F", name: "Cinematic Light Field", description: "Light, depth and typography without objects." },
  { id: "G", name: "Living Knowledge Graph", description: "People, engineering and AI continuously connect." },
  { id: "H", name: "What Makes a Good System?", description: "Sticky scroll-driven word choreography." },
  { id: "I", name: "Current 3D System", description: "The existing hero as the baseline." },
  { id: "J", name: "Living System", description: "Identity, capability and impact assemble as one system." },
];

function ScrollWord({ word, index, total, progress }: { word: string; index: number; total: number; progress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const start = index / total;
  const end = (index + 1) / total;
  const range = [Math.max(0, start - 0.18), start, end, Math.min(1, end + 0.18)];
  return <motion.div className="hero-lab-scroll-word" style={{ opacity: useTransform(progress, range, [0.12, 1, 1, 0.12]), scale: useTransform(progress, range, [0.72, 1, 1, 0.72]), y: useTransform(progress, range, [70, 0, 0, -70]) }}>{word}</motion.div>;
}

function ScrollWords({ words }: { words: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });
  return (
    <div ref={ref} className="hero-lab-scroll-stage" data-lenis-prevent="true" tabIndex={0} aria-label="Scrollable hero concept">
      <div className="hero-lab-scroll-track">
        <div className="hero-lab-sticky">
          <div className="hero-lab-word-stack">
            {words.map((word, i) => <ScrollWord key={word + "-" + i} word={word} index={i} total={words.length} progress={scrollYProgress} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

const livingNodes = [
  { label: "PEOPLE", x: "18%", y: "25%" },
  { label: "ENGINEERING", x: "76%", y: "24%" },
  { label: "AI", x: "82%", y: "68%" },
  { label: "PROBLEM", x: "20%", y: "70%" },
  { label: "IMPACT", x: "50%", y: "86%" },
];

function LivingSystemNode({
  label,
  x,
  y,
  index,
  progress,
}: {
  label: string;
  x: string;
  y: string;
  index: number;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, [0, 0.12 + index * 0.03, 0.62, 0.86, 1], [0, 1, 1, 0.75, 1]);
  const scale = useTransform(progress, [0, 0.18, 0.72, 1], [0.72, 1, 1, 0.94]);
  const moveX = useTransform(progress, [0, 0.48, 0.8, 1], [index % 2 === 0 ? -24 : 24, 0, 0, 0]);
  const moveY = useTransform(progress, [0, 0.48, 0.8, 1], [index < 2 ? -16 : 16, 0, 0, 0]);

  return (
    <motion.div
      className={"living-system-node " + (index === 4 ? "is-impact" : "")}
      style={{ left: x, top: y, opacity, scale, x: moveX, y: moveY }}
    >
      {label}
    </motion.div>
  );
}

function LivingSystem() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: ref });

  const identityOpacity = useTransform(scrollYProgress, [0.62, 0.78, 1], [0, 1, 1]);
  const identityY = useTransform(scrollYProgress, [0.62, 0.84], [34, 0]);
  const identityScale = useTransform(scrollYProgress, [0.62, 0.84, 1], [0.82, 1, 1]);

  const lineOpacity = useTransform(scrollYProgress, [0.18, 0.48, 0.78], [0, 0.5, 0.85]);
  const principleOpacity = useTransform(scrollYProgress, [0.78, 0.9, 1], [0, 0, 1]);

  return (
    <div ref={ref} className="living-system-stage" data-lenis-prevent="true" tabIndex={0} aria-label="Scrollable Living System hero concept">
      <div className="living-system-track">
        <div className="living-system-sticky">
          <div className="living-system-grid" aria-hidden="true" />
          <div className="living-system-orbit living-system-orbit-a" aria-hidden="true" />
          <div className="living-system-orbit living-system-orbit-b" aria-hidden="true" />

          <motion.div className="living-system-lines" style={{ opacity: lineOpacity }} aria-hidden="true">
            {livingNodes.map((node, index) => (
              <span key={node.label} className={"living-system-line living-system-line-" + index} />
            ))}
          </motion.div>

          {livingNodes.map((node, index) => (
            <LivingSystemNode key={node.label} {...node} index={index} progress={scrollYProgress} />
          ))}

          <motion.div
            className="living-system-core"
            style={{
              scale: useTransform(scrollYProgress, [0, 0.35, 0.7, 1], [0.86, 1, 1.04, 1]),
              opacity: useTransform(scrollYProgress, [0, 0.18, 0.75, 1], [0.35, 0.72, 1, 1]),
            }}
          >
            <span className="living-system-core-mark">M</span>
            <span className="living-system-core-label">MOHAMMAD MOIN</span>
          </motion.div>

          <motion.div className="living-system-identity" style={{ opacity: identityOpacity, y: identityY, scale: identityScale }}>
            <span className="living-system-kicker">ENGINEERING × PEOPLE × AI</span>
            <strong>Build People.<br />Solve Problems.<br />Innovate.</strong>
          </motion.div>

          <motion.div className="living-system-principle" style={{ opacity: principleOpacity }}>
            <span>PEOPLE → PROBLEM → DESIGN → BUILD → IMPACT</span>
          </motion.div>

          <div className="living-system-scroll-hint">
            <span>SCROLL TO ASSEMBLE</span>
            <i>↓</i>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroVariant({ id }: { id: Variant }) {
  const graphNodes = [["PEOPLE", "18%", "23%"], ["ENGINEERING", "64%", "18%"], ["AI", "78%", "53%"], ["PROBLEM", "27%", "58%"], ["IMPACT", "62%", "76%"], ["MOIN", "48%", "48%"]];
  if (id === "I") return <section className="hero-lab-variant hero-lab-current"><div className="hero-lab-copy"><span className="hero-lab-eyebrow">WHO I AM · BASELINE</span><h1>Mohammad Moin.</h1><p>Build People. Solve Problems. Innovate.</p></div><div className="hero-lab-3d"><DeferredThreeDSystem /></div></section>;
  if (id === "J") return <section className="hero-lab-variant hero-lab-living"><div className="hero-lab-living-intro"><span className="hero-lab-eyebrow">THE LIVING SYSTEM · NEW CONCEPT</span><h1>Watch the<br /><em>identity assemble.</em></h1><p>Not a diagram. A professional system revealed through interaction.</p></div><LivingSystem /></section>;
  if (id === "B") return <section className="hero-lab-variant hero-lab-problem"><span className="hero-lab-eyebrow">START WITH THE PROBLEM</span><h1>What are you<br /><em>trying to do?</em></h1><div className="hero-lab-choice-grid">{["BUILD", "TRANSFORM", "DEVELOP"].map((x, i) => <motion.div key={x} whileHover={{ y: -8, scale: 1.02 }} className="hero-lab-choice"><span>0{i + 1}</span><strong>{x}</strong></motion.div>)}</div><div className="hero-lab-convergence">BUILD · TRANSFORM · DEVELOP <b>→ IMPACT</b></div></section>;
  if (id === "C") return <section className="hero-lab-variant hero-lab-unfinished"><span className="hero-lab-eyebrow">AN IDENTITY IN MOTION</span><ScrollWords words={["ENGINEERING", "+", "PEOPLE", "+", "AI", "=", "IMPACT"]} /><div className="hero-lab-endmark">MOHAMMAD MOIN<span>Build People. Solve Problems. Innovate.</span></div></section>;
  if (id === "D") return <section className="hero-lab-variant hero-lab-question"><span className="hero-lab-eyebrow">A DIFFERENT INTRODUCTION</span><ScrollWords words={["WHAT", "MAKES", "A GOOD", "SYSTEM?"]} /><div className="hero-lab-answer">PEOPLE × ENGINEERING × AI<br /><small>working together.</small></div></section>;
  if (id === "E") return <section className="hero-lab-variant hero-lab-blueprint"><div className="blueprint-corner">SYSTEM / 01<br />MOIN METHOD</div><div className="blueprint-lines" /><div className="blueprint-core"><span>PEOPLE</span><i>↓</i><span>PROBLEM</span><i>↓</i><span>DESIGN</span><i>↓</i><span>BUILD</span><i>↓</i><strong>IMPACT</strong></div><div className="blueprint-note">SCROLL TO DECODE THE SYSTEM</div></section>;
  if (id === "F") return <section className="hero-lab-variant hero-lab-lightfield"><div className="lightfield-orb" /><div className="lightfield-copy"><span>ENGINEERING × PEOPLE × AI</span><h1>Ideas become<br /><em>systems.</em></h1><p>Scroll into the work.</p></div><div className="lightfield-axis">01 — THINK<br />02 — BUILD<br />03 — ENABLE</div></section>;
  if (id === "G") return <section className="hero-lab-variant hero-lab-graph"><span className="hero-lab-eyebrow">THE KNOWLEDGE GRAPH</span><div className="graph-lines" />{graphNodes.map(([name, x, y]) => <motion.div key={name} className={"graph-node " + (name === "MOIN" ? "is-core" : "")} style={{ left: x, top: y }} whileHover={{ scale: 1.12 }}>{name}</motion.div>)}<div className="graph-caption">Everything connects. The work is finding the useful connection.</div></section>;
  if (id === "H") return <section className="hero-lab-variant hero-lab-scroll-narrative"><div className="hero-lab-narrative-intro"><span className="hero-lab-eyebrow">A SYSTEM IS MORE THAN ITS PARTS</span><h1>What makes a<br /><em>good system?</em></h1></div><ScrollWords words={["TECHNOLOGY", "ARCHITECTURE", "CODE", "PEOPLE", "IT'S ALL OF THEM."]} /><div className="hero-lab-narrative-end"><span>PEOPLE × ENGINEERING × AI</span><h2>Working together.</h2><strong>MOHAMMAD MOIN</strong></div></section>;
  return <section className="hero-lab-variant hero-lab-system"><div className="hero-lab-system-copy"><span className="hero-lab-eyebrow">THE MOIN SYSTEM</span><h1>How I<br /><em>work.</em></h1><p>Scroll to assemble the system.</p></div><ScrollWords words={["PEOPLE", "PROBLEM", "DESIGN", "BUILD", "IMPACT"]} /></section>;
}

export function HeroExplorer() {
  const [active, setActive] = useState<Variant>("J");
  const current = useMemo(() => variants.find((x) => x.id === active)!, [active]);
  return <main className="hero-lab"><header className="hero-lab-header"><div><span className="hero-lab-kicker">MOHAMMAD MOIN / HERO EXPLORATION</span><h1>Which introduction<br /><em>makes you scroll?</em></h1></div><p>Interactive prototypes. Same identity, radically different opening experiences.</p></header><nav className="hero-lab-selector" aria-label="Hero concepts">{variants.map((x) => <button key={x.id} className={active === x.id ? "is-active" : ""} onClick={() => setActive(x.id)}><b>{x.id}</b><span>{x.name}</span></button>)}</nav><div className="hero-lab-title"><span>OPTION {current.id}</span><h2>{current.name}</h2><p>{current.description}</p></div><HeroVariant id={active} /><footer className="hero-lab-footer"><span>HERO LAB</span><p>Prototype only · reimagine/v2 · vercel-deploy remains untouched</p></footer></main>;
}
