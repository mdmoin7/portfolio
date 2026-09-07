"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { navActions, navLinks } from "@/lib/content";
import { Button } from "@/components/ui/primitives";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [active, setActive] = useState<string>(navLinks[0].href);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const sections = navLinks
      .map((link) => ({
        href: link.href,
        el: document.querySelector(link.href),
      }))
      .filter((item) => item.el);

    const onScroll = () => {
      const offset = 96;
      const scrollY = window.scrollY;
      let current = sections[0]?.href ?? "#top";

      sections.forEach((section) => {
        const top = section.el?.getBoundingClientRect().top ?? 0;
        if (top + window.scrollY - offset <= scrollY) {
          current = section.href;
        }
      });

      setActive(current);
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
      <nav className="glass-nav relative">
        <motion.div
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-blue"
          style={{ scaleX }}
        />
        <div className="wrap flex h-[70px] items-center gap-8">
          <a href="#top" className="min-w-[245px] no-underline">
            <strong className="block font-display text-[21px] font-semibold leading-none text-navy">
              Mohammad Moin
            </strong>
            <span className="mt-1 block text-[10px] font-bold text-muted">
              Independent Consultant &amp; Corporate Trainer
            </span>
          </a>

          <div
            className={cn(
              "hidden flex-1 items-center justify-center gap-7 lg:flex",
              open && "absolute left-3.5 right-3.5 top-[62px] flex flex-col rounded-[10px] border border-line bg-white p-4 shadow-[0_20px_40px_-28px_rgba(20,35,63,0.5)] lg:static lg:flex-row lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none",
            )}
            id="navlinks"
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
                  "text-xs font-extrabold text-[#4e5d75] no-underline transition hover:text-blue",
                  active === link.href && "text-blue",
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-2.5 md:flex">
            {navActions.map((action) => (
              <Button
                key={action.label}
                href={action.href}
                external={action.external}
                variant={action.primary ? "primary" : "outline"}
              >
                {action.label}
              </Button>
            ))}
          </div>

          <button
            type="button"
            className="ml-auto flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-white lg:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 stroke-navy" aria-hidden="true">
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
