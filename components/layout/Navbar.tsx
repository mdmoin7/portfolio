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
      let current = sections[0]?.href ?? "#what-i-do";
      sections.forEach((section) => {
        const top = section.el?.getBoundingClientRect().top ?? 0;
        if (top + window.scrollY - offset <= scrollY) current = section.href;
      });
      setActive(current);
      setOnHero(scrollY < window.innerHeight * 0.72);
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
          "relative border-b backdrop-blur-xl transition-[background-color,border-color,box-shadow] duration-500",
          onHero
            ? "border-white/10 bg-[rgba(10,22,40,0.78)] shadow-[0_8px_32px_-20px_rgba(0,0,0,0.45)]"
            : "border-line bg-[rgba(255,255,255,0.9)] shadow-[0_8px_30px_-24px_rgba(10,22,40,0.12)]",
        )}
      >
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-gradient-to-r from-blue via-blue-glow to-gold"
          style={{ scaleX }}
        />
        <div className="wrap flex h-[70px] items-center gap-6 lg:gap-8">
          <a href="#top" className="min-w-[200px] shrink-0 no-underline lg:min-w-[245px]">
            <strong
              className={cn(
                "block font-display text-[20px] font-semibold leading-none tracking-[-0.02em] lg:text-[21px]",
                onHero ? "text-white" : "text-navy",
              )}
            >
              Mohammad Moin
            </strong>
            <span
              className={cn(
                "mt-1 block text-[10px] font-bold",
                onHero ? "text-white/50" : "text-muted",
              )}
            >
              Independent Consultant &amp; Corporate Trainer
            </span>
          </a>

          <div
            className={cn(
              "hidden flex-1 items-center justify-center gap-6 lg:flex lg:gap-7",
              open &&
                "absolute left-3.5 right-3.5 top-[62px] z-50 flex flex-col rounded-xl border border-line bg-white p-4 shadow-[0_20px_40px_-28px_rgba(10,22,40,0.35)] lg:static lg:flex-row lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none",
            )}
            id="navlinks"
          >
            {navLinks.map((link) => {
              const isActive = active === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => {
                    setActive(link.href);
                    setOpen(false);
                  }}
                  className={cn(
                    "relative py-1 text-xs font-extrabold no-underline transition-colors duration-200",
                    onHero && !open && "text-white/60 hover:text-white",
                    !onHero && !open && "text-[#4e5d75] hover:text-blue",
                    open && "text-[#4e5d75] hover:text-blue",
                    isActive && onHero && !open && "text-white",
                    isActive && (!onHero || open) && "text-blue",
                  )}
                >
                  {link.label}
                  {isActive ? (
                    <span
                      className={cn(
                        "absolute -bottom-1 left-0 h-0.5 w-full rounded-full",
                        onHero && !open ? "bg-gold" : "bg-blue",
                      )}
                    />
                  ) : null}
                </a>
              );
            })}
          </div>

          <div className="hidden shrink-0 items-center gap-2 md:flex">
            {navActions.map((action) => (
              <MagneticButton
                key={action.label}
                href={action.href}
                external={action.external}
                variant={action.primary ? "primary" : onHero ? "glass" : "outline"}
                className="px-3.5 py-2 text-[11px]"
              >
                {action.label}
              </MagneticButton>
            ))}
          </div>

          <button
            type="button"
            className={cn(
              "ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors lg:hidden",
              onHero
                ? "border-white/15 bg-white/5 text-white hover:bg-white/10"
                : "border-line bg-white text-navy hover:border-blue/20 hover:bg-blue-soft",
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
