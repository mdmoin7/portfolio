"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

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
          x: x * 0.16,
          y: y * 0.16,
          rotationX: -y * 0.08,
          rotationY: x * 0.08,
          scale: 1.025,
          duration: 0.35,
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
          duration: 0.8,
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

    return (
      <Component
        ref={(node: HTMLElement | null) => {
          localRef.current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) {
            (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "12vh", scale: 0.82, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
            end: "bottom bottom",
            scrub: 1.2,
          },
        },
      );

      gsap.fromTo(
        headingRef.current,
        { y: 70, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top 70%",
            end: "top 28%",
            scrub: 1,
          },
        },
      );

      if (contentRef.current) {
        gsap.fromTo(
          Array.from(contentRef.current.children),
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: wrapper,
              start: "top 62%",
              end: "top 28%",
              scrub: 1,
            },
          },
        );
      }
    }, wrapper);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("resize", refresh);
    return () => {
      window.removeEventListener("resize", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <>
      <style>{`
        .motion-footer{position:relative;min-height:100svh;overflow:hidden;isolation:isolate;background:radial-gradient(circle at 50% 40%,rgba(120,153,212,.18),transparent 38%),linear-gradient(135deg,#1E2749,#273469 58%,#30343F);color:#FAFAFF;-webkit-font-smoothing:antialiased}
        .motion-footer-grid{position:absolute;inset:0;opacity:.7;pointer-events:none;background-size:60px 60px;background-image:linear-gradient(to right,rgba(250,250,255,.035) 1px,transparent 1px),linear-gradient(to bottom,rgba(250,250,255,.035) 1px,transparent 1px);mask-image:linear-gradient(to bottom,transparent,black 22%,black 78%,transparent);-webkit-mask-image:linear-gradient(to bottom,transparent,black 22%,black 78%,transparent)}
        .motion-footer-aurora{position:absolute;width:min(80vw,1000px);height:60vh;left:50%;top:42%;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(circle,rgba(120,153,212,.18),rgba(39,52,105,.08) 42%,transparent 72%);filter:blur(45px);pointer-events:none;animation:motion-footer-breathe 8s ease-in-out infinite alternate}
        .motion-footer-marquee{position:absolute;top:9vh;left:-4%;width:108%;overflow:hidden;transform:rotate(-2deg) scale(1.04);border-top:1px solid rgba(250,250,255,.12);border-bottom:1px solid rgba(250,250,255,.12);background:rgba(30,39,73,.46);backdrop-filter:blur(14px);z-index:3}
        .motion-footer-marquee-track{display:flex;width:max-content;padding:13px 0;animation:motion-footer-marquee 34s linear infinite;font:700 9px/1 var(--font-mono);letter-spacing:.22em;text-transform:uppercase;color:rgba(250,250,255,.72)}
        .motion-footer-marquee-item{display:flex;align-items:center;gap:22px;padding:0 20px;white-space:nowrap}.motion-footer-marquee-item i{color:#7899D4;font-style:normal}
        .motion-footer-giant{position:absolute;left:50%;bottom:-4vh;transform:translateX(-50%);z-index:0;pointer-events:none;user-select:none;white-space:nowrap;font:800 clamp(150px,25vw,390px)/.72 var(--font-display);letter-spacing:-.07em;color:transparent;-webkit-text-stroke:1px rgba(250,250,255,.07);background:linear-gradient(180deg,rgba(250,250,255,.11),transparent 62%);-webkit-background-clip:text;background-clip:text}
        .motion-footer-inner{position:relative;z-index:2;width:min(1180px,88vw);min-height:100svh;margin:0 auto;display:flex;flex-direction:column;justify-content:space-between;padding:34px 0 22px}
        .motion-footer-top{display:flex;justify-content:space-between;align-items:center;gap:20px;padding-bottom:18px;border-bottom:1px solid rgba(250,250,255,.12)}
        .motion-footer-kicker,.motion-footer-top a,.motion-footer-label,.motion-footer-bottom{font:700 8px/1.4 var(--font-mono);letter-spacing:.16em;text-transform:uppercase}
        .motion-footer-kicker{color:#BFD0F1}.motion-footer-top a{color:#FAFAFF;text-decoration:none}.motion-footer-top a:hover{color:#7899D4}
        .motion-footer-main{display:grid;grid-template-columns:minmax(0,1fr) minmax(280px,.7fr);align-items:end;gap:clamp(30px,7vw,110px);padding:clamp(100px,16vh,170px) 0 70px}
        .motion-footer-heading{margin:0;max-width:760px;font:500 clamp(64px,9.5vw,145px)/.82 var(--font-display);letter-spacing:-.065em}.motion-footer-heading em{color:#7899D4;font-style:normal}
        .motion-footer-copy{color:#C2CAD8;font-size:14px;line-height:1.7;max-width:360px;margin:0 0 28px}
        .motion-footer-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
        .motion-footer-pill{display:inline-flex;align-items:center;justify-content:space-between;min-width:0;padding:13px 16px;border:1px solid rgba(250,250,255,.12);border-radius:999px;color:#FAFAFF;text-decoration:none;background:linear-gradient(145deg,rgba(250,250,255,.07),rgba(250,250,255,.02));box-shadow:inset 0 1px 1px rgba(250,250,255,.08),0 10px 30px -16px rgba(0,0,0,.55);backdrop-filter:blur(14px);font-size:12px;line-height:1.2;transition:border-color .3s,background .3s}
        .motion-footer-pill:hover{border-color:rgba(120,153,212,.55);background:rgba(120,153,212,.12)}
        .motion-footer-bottom{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;padding-top:16px;border-top:1px solid rgba(250,250,255,.12);color:#AEB9CC}.motion-footer-bottom span:nth-child(2){text-align:center}.motion-footer-bottom span:last-child{text-align:right}
        @keyframes motion-footer-breathe{from{transform:translate(-50%,-50%) scale(1);opacity:.6}to{transform:translate(-50%,-50%) scale(1.08);opacity:1}}
        @keyframes motion-footer-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        @media(max-width:820px){.motion-footer-inner{width:88vw}.motion-footer-main{grid-template-columns:1fr;align-items:start;padding:130px 0 48px;gap:42px}.motion-footer-heading{font-size:clamp(58px,15vw,108px)}.motion-footer-copy{max-width:560px}}
        @media(max-width:560px){.motion-footer-inner{width:88vw;padding-top:24px}.motion-footer-top{align-items:flex-start;flex-direction:column;gap:11px}.motion-footer-marquee{top:108px}.motion-footer-main{padding-top:150px;gap:34px}.motion-footer-heading{font-size:clamp(52px,15vw,78px);line-height:.86}.motion-footer-copy{font-size:12px;margin-bottom:22px}.motion-footer-links{grid-template-columns:1fr}.motion-footer-pill{width:100%;box-sizing:border-box}.motion-footer-bottom{grid-template-columns:1fr;gap:7px;padding-bottom:6px}.motion-footer-bottom span,.motion-footer-bottom span:nth-child(2),.motion-footer-bottom span:last-child{text-align:left}.motion-footer-giant{font-size:46vw;bottom:2vh}}
        @media(prefers-reduced-motion:reduce){.motion-footer-aurora,.motion-footer-marquee-track{animation:none}.motion-footer-pill{transition:none}}
      `}</style>

      <footer ref={wrapperRef} className="motion-footer" id={id}>
        <div className="motion-footer-grid" aria-hidden="true" />
        <div className="motion-footer-aurora" aria-hidden="true" />
        <div ref={giantTextRef} className="motion-footer-giant" aria-hidden="true">MOIN</div>

        <div className="motion-footer-marquee" aria-hidden="true">
          <div className="motion-footer-marquee-track">
            <MarqueeItem /><MarqueeItem /><MarqueeItem /><MarqueeItem />
          </div>
        </div>

        <div className="motion-footer-inner">
          <div className="motion-footer-top">
            <span className="motion-footer-kicker">MOHAMMAD MOIN · 2026</span>
            <a href="#thesis">BACK TO TOP ↑</a>
          </div>

          <div className="motion-footer-main">
            <div>
              <h2 ref={headingRef} className="motion-footer-heading">
                Build people.<br />Solve problems.<br /><em>Innovate.</em>
              </h2>
            </div>
            <div ref={contentRef}>
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
    </>
  );
}
