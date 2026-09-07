"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { navActions, navLinks } from "@/lib/content";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [active, setActive] = useState<string>(navLinks[0].href);
  const [open, setOpen] = useState(false);
  const [onHero, setOnHero] = useState(true);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const sections = navLinks
      .map((link) => ({ href: link.href, el: document.querySelector(link.href) }))
      .filter((item) => item.el);

    const onScroll = () => {
      const offset = 96;
      const scrollY = window.scrollY;
      let current = sections[0]?.href ?? "#top";
      sections.forEach((section) => {
        const top = section.el?.getBoundingClientRect().top ?? 0;
        if (top + window.scrollY - offset <= scrollY) current = section.href;
      });
      setActive(current);
      setOnHero(scrollY < window.innerHeight * 0.75);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={cn(
          "relative border-b backdrop-blur-xl transition-colors duration-300",
          onHero
            ? "border-white/10 bg-[rgba(5,11,22,0.55)]"
            : "glass-nav border-line bg-white/85",
        )}
      >
        <motion.div
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-blue via-blue-glow to-gold"
          style={{ scaleX }}
        />
        <div className="wrap flex h-[70px] items-center gap-8">
          <a href="#top" className="min-w-[245px] no-underline">
            <strong
              className={cn(
                "block font-display text-[21px] font-semibold leading-none",
                onHero ? "text-white" : "text-navy",
              )}
            >
              Mohammad Moin
            </strong>
            <span className={cn("mt-1 block text-[10px] font-bold", onHero ? "text-white/55" : "text-muted")}>
              Independent Consultant &amp; Corporate Trainer
            </span>
          </a>

          <div
            className={cn(
              "hidden flex-1 items-center justify-center gap-7 lg:flex",
              open &&
                "absolute left-3.5 right-3.5 top-[62px] flex flex-col rounded-[10px] border border-line bg-white p-4 shadow-[0_20px_40px_-28px_rgba(20,35,63,0.5)] lg:static lg:flex-row lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none",
            )}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  setActive(link.href);
                  setOpen(false);
                }}
                className={cn(
                  "text-xs font-semibold no-underline transition",
                  onHero ? "text-white/65 hover:text-white" : "text-[#4e5d75] hover:text-blue",
                  active === link.href && (onHero ? "text-white" : "text-blue"),
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2.5 md:flex">
            {navActions.map((action) => (
              <MagneticButton
                key={action.label}
                href={action.href}
                external={action.external}
                variant={action.primary ? "primary" : onHero ? "glass" : "outline"}
                className="px-3.5 py-2 text-xs"
              >
                {action.label}
              </MagneticButton>
            ))}
          </div>

          <button
            type="button"
            className={cn(
              "ml-auto flex h-10 w-10 items-center justify-center rounded-lg border lg:hidden",
              onHero ? "border-white/15 bg-white/5 text-white" : "border-line bg-white text-navy",
            )}
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-current" aria-hidden="true">
              <line x1="4" y1="7" x2="20" y2="7" strokeWidth="2" />
              <line x1="4" y1="12" x2="20" y2="12" strokeWidth="2" />
              <line x1="4" y1="17" x2="20" y2="17" strokeWidth="2" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
