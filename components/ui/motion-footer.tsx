"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export type MagneticButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> &
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const EMAIL = "mohammadmoin.tech@gmail.com";

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      const element = localRef.current;
      if (!element || window.matchMedia("(pointer: coarse)").matches) return;

      const move = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;

        gsap.to(element, {
          x: x * 0.14,
          y: y * 0.14,
          rotationX: -y * 0.06,
          rotationY: x * 0.06,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
      };

      const leave = () =>
        gsap.to(element, {
          x: 0,
          y: 0,
          rotationX: 0,
          rotationY: 0,
          scale: 1,
          duration: 0.7,
          ease: "elastic.out(1, 0.35)",
          overwrite: true,
        });

      element.addEventListener("mousemove", move);
      element.addEventListener("mouseleave", leave);

      return () => {
        element.removeEventListener("mousemove", move);
        element.removeEventListener("mouseleave", leave);
      };
    }, []);

    const elementProps = {
      ...props,
      ref: (node: HTMLElement | null) => {
        localRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
        }
      },
      className: cn("cursor-pointer", className),
    };

    return React.createElement(Component, elementProps, children);
  },
);

MagneticButton.displayName = "MagneticButton";

function MarqueeItem() {
  return (
    <div className="motion-footer-marquee-item">
      <span>Build People</span><i>✦</i>
      <span>Solve Problems</span><i>✦</i>
      <span>Innovate</span><i>✦</i>
      <span>Engineering × People × AI</span><i>✦</i>
    </div>
  );
}

export function CinematicFooter({ id = "footer" }: { id?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <footer className="motion-footer" id={id}>
      <style>{`
        .motion-footer{
          --footer-bg:#1E2749;
          --footer-bg-2:#273469;
          --footer-fg:#FAFAFF;
          --footer-muted:#C2CAD8;
          --footer-accent:#7899D4;
          position:relative;
          min-height:88svh;
          overflow:hidden;
          isolation:isolate;
          background:
            radial-gradient(circle at 52% 38%,rgba(120,153,212,.16),transparent 36%),
            linear-gradient(135deg,var(--footer-bg),var(--footer-bg-2) 58%,#30343F);
          color:var(--footer-fg);
          -webkit-font-smoothing:antialiased;
        }
        .motion-footer-grid{
          position:absolute;
          inset:0;
          opacity:.65;
          pointer-events:none;
          background-size:60px 60px;
          background-image:
            linear-gradient(to right,rgba(250,250,255,.035) 1px,transparent 1px),
            linear-gradient(to bottom,rgba(250,250,255,.035) 1px,transparent 1px);
          mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent);
          -webkit-mask-image:linear-gradient(to bottom,transparent,black 20%,black 80%,transparent);
        }
        .motion-footer-aurora{
          position:absolute;
          width:min(72vw,920px);
          height:54vh;
          left:50%;
          top:42%;
          transform:translate(-50%,-50%);
          border-radius:50%;
          background:radial-gradient(circle,rgba(120,153,212,.17),transparent 68%);
          filter:blur(42px);
          pointer-events:none;
        }
        .motion-footer-marquee{
          position:absolute;
          top:8.5vh;
          left:-4%;
          width:108%;
          overflow:hidden;
          transform:rotate(-2deg) scale(1.03);
          border-top:1px solid rgba(250,250,255,.11);
          border-bottom:1px solid rgba(250,250,255,.11);
          background:rgba(30,39,73,.45);
          backdrop-filter:blur(14px);
          -webkit-backdrop-filter:blur(14px);
          z-index:3;
        }
        .motion-footer-marquee-track{
          display:flex;
          width:max-content;
          padding:12px 0;
          animation:motion-footer-marquee 34s linear infinite;
          font:700 9px/1 var(--font-mono);
          letter-spacing:.22em;
          text-transform:uppercase;
          color:rgba(250,250,255,.72);
        }
        .motion-footer-marquee-item{
          display:flex;
          align-items:center;
          gap:22px;
          padding:0 20px;
          white-space:nowrap;
        }
        .motion-footer-marquee-item i{
          color:#7899D4;
          font-style:normal;
        }
        .motion-footer-giant{display:none;
          position:absolute;
          left:50%;
          bottom:-3vh;
          transform:translateX(-50%);
          z-index:0;
          pointer-events:none;
          user-select:none;
          white-space:nowrap;
          font:800 clamp(150px,24vw,360px)/.72 var(--font-display);
          letter-spacing:-.07em;
          color:transparent;
          -webkit-text-stroke:1px rgba(250,250,255,.065);
          background:linear-gradient(180deg,rgba(250,250,255,.10),transparent 62%);
          -webkit-background-clip:text;
          background-clip:text;
        }
        .motion-footer-inner{
          position:relative;
          z-index:2;
          width:min(1180px,88vw);
          min-height:88svh;
          margin:0 auto;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
          padding:30px 0 22px;
        }
        .motion-footer-top{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:20px;
          padding-bottom:17px;
          border-bottom:1px solid rgba(250,250,255,.12);
        }
        .motion-footer-kicker,
        .motion-footer-top a,
        .motion-footer-bottom{
          font:700 8px/1.4 var(--font-mono);
          letter-spacing:.16em;
          text-transform:uppercase;
        }
        .motion-footer-kicker{color:#BFD0F1}
        .motion-footer-top a{
          color:#FAFAFF;
          text-decoration:none;
        }
        .motion-footer-main{
          display:grid;
          grid-template-columns:minmax(0,1.15fr) minmax(310px,.85fr);
          align-items:end;
          gap:clamp(40px,7vw,110px);
          padding:clamp(90px,12vh,125px) 0 54px;
        }
        .motion-footer-heading{
          margin:0;
          font:500 clamp(58px,7.5vw,118px)/.84 var(--font-display);
          letter-spacing:-.065em;
          color:#FAFAFF;
        }
        .motion-footer-heading em{
          color:#7899D4;
          font-style:normal;
        }
        .motion-footer-heading-line{
          display:block;
          overflow:hidden;
        }
        .motion-footer-heading-line > span{
          display:block;
          transform:translateY(105%);
          will-change:transform;
          animation:motion-footer-reveal 1s cubic-bezier(.16,1,.3,1) forwards;
        }
        .motion-footer-heading-line:nth-child(2) > span{animation-delay:.08s}
        .motion-footer-heading-line:nth-child(3) > span{animation-delay:.16s}
        @keyframes motion-footer-reveal{
          from{transform:translateY(105%)}
          to{transform:translateY(0)}
        }
        .motion-footer-copy{
          max-width:390px;
          margin:0 0 26px;
          color:#C2CAD8;
          font-size:13px;
          line-height:1.7;
        }
        .motion-footer-links{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:10px;
        }
        .motion-footer-pill{
          display:inline-flex;
          align-items:center;
          justify-content:space-between;
          min-width:0;
          min-height:44px;
          padding:12px 15px;
          border:1px solid rgba(250,250,255,.12);
          border-radius:999px;
          color:#FAFAFF;
          text-decoration:none;
          background:linear-gradient(145deg,rgba(250,250,255,.07),rgba(250,250,255,.02));
          box-shadow:inset 0 1px 1px rgba(250,250,255,.08),0 10px 30px -16px rgba(0,0,0,.5);
          backdrop-filter:blur(14px);
          -webkit-backdrop-filter:blur(14px);
          font-size:11px;
          line-height:1.2;
          transition:border-color .3s ease,background .3s ease;
        }
        .motion-footer-pill:hover{
          border-color:rgba(120,153,212,.55);
          background:rgba(120,153,212,.12);
        }
        .motion-footer-bottom{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:16px;
          padding-top:15px;
          border-top:1px solid rgba(250,250,255,.12);
          color:#AEB9CC;
        }
        .motion-footer-bottom span:nth-child(2){text-align:center}
        .motion-footer-bottom span:last-child{text-align:right}

        @keyframes motion-footer-marquee{
          from{transform:translateX(0)}
          to{transform:translateX(-50%)}
        }

        @media(max-width:820px){
          .motion-footer{min-height:760px}
          .motion-footer-inner{width:88vw;min-height:760px}
          .motion-footer-main{
            grid-template-columns:1fr;
            gap:38px;
            padding:130px 0 42px;
          }
          .motion-footer-heading{font-size:clamp(54px,14vw,92px)}
        }

        @media(max-width:560px){
          .motion-footer-inner{width:88vw;padding-top:24px}
          .motion-footer-top{align-items:flex-start;flex-direction:column;gap:10px}
          .motion-footer-marquee{top:106px}
          .motion-footer-main{padding-top:144px;gap:28px}
          .motion-footer-heading{font-size:clamp(48px,14.5vw,72px)}
          .motion-footer-links{grid-template-columns:1fr}
          .motion-footer-bottom{grid-template-columns:1fr;gap:7px}
          .motion-footer-bottom span,
          .motion-footer-bottom span:nth-child(2),
          .motion-footer-bottom span:last-child{text-align:left}
          .motion-footer-giant{font-size:44vw}
        }

        @media(prefers-reduced-motion:reduce){
          .motion-footer-marquee-track{animation:none}
          .motion-footer-heading-line > span{animation:none;transform:none}
        }
      `}</style>

      <div className="motion-footer-grid" aria-hidden="true" />
      <motion.div
        className="motion-footer-aurora"
        aria-hidden="true"
        animate={reduceMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.65, 1, 0.65] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="motion-footer-giant"
        aria-hidden="true"
        initial={reduceMotion ? false : { y: "10vh", scale: 0.86 }}
        whileInView={reduceMotion ? undefined : { y: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      >
        MOIN
      </motion.div>

      <div className="motion-footer-marquee" aria-hidden="true">
        <div className="motion-footer-marquee-track">
          <MarqueeItem /><MarqueeItem /><MarqueeItem /><MarqueeItem />
        </div>
      </div>

      <div className="motion-footer-inner">
        <div className="motion-footer-brand" aria-label="Mohammad Moin">
          <span className="motion-footer-brand-word motion-footer-brand-word-1">MOHAMMAD</span>
          <span className="motion-footer-brand-word motion-footer-brand-word-2"><em>MOIN.</em></span>
        </div>
        <div className="motion-footer-top">
          <span className="motion-footer-kicker">MOHAMMAD MOIN · 2026</span>
          <a href="#thesis">BACK TO TOP ↑</a>
        </div>

        <div className="motion-footer-main">
          <h2 className="motion-footer-heading" aria-label="Build people. Solve problems. Innovate.">
            {["Build people.", "Solve problems.", "Innovate."].map((line) => (
              <span className="motion-footer-heading-line" key={line}>
                <span>{line === "Innovate." ? <em>{line}</em> : line}</span>
              </span>
            ))}
          </h2>

          <div>
            <p className="motion-footer-copy">
              Independent software engineering consultant and corporate technology trainer.
              Consulting, engineering, architecture and practical technology training.
            </p>
            <div className="motion-footer-links">
              <MagneticButton as="a" href="#capability" className="motion-footer-pill">What I Do <span>→</span></MagneticButton>
              <MagneticButton as="a" href="#work" className="motion-footer-pill">Selected Work <span>→</span></MagneticButton>
              <MagneticButton as="a" href="#training" className="motion-footer-pill">Training <span>→</span></MagneticButton>
              <MagneticButton as="a" href={`mailto:${EMAIL}`} className="motion-footer-pill">Let's Talk <span>→</span></MagneticButton>
            </div>
          </div>
        </div>

        <div className="motion-footer-bottom">
          <span>CONSULT · BUILD · TRAIN</span>
          <span>ENGINEERING × PEOPLE × AI</span>
          <span>© 2026 MOHAMMAD MOIN</span>
        </div>
      </div>
    </footer>
  );
}
