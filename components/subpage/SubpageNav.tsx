"use client";

import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { subpageNavCta, subpageNavLinks } from "@/lib/subpages/nav";
import type { SubpageNavId } from "@/lib/subpages/types";

export function SubpageNav({ active }: { active: SubpageNavId }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      <nav className="subpage-nav relative border-b border-line bg-white/85 backdrop-blur-xl">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-blue/45 to-transparent"
        />
        <div className="wrap flex h-[70px] items-center gap-6 lg:gap-8">
          <Link href="/" className="min-w-[200px] shrink-0 no-underline lg:min-w-[245px]">
            <strong className="block font-display text-[20px] font-semibold leading-none tracking-[-0.02em] text-navy lg:text-[21px]">
              Mohammad Moin
            </strong>
            <span className="mt-1 block text-[10px] font-bold text-muted">
              Independent Consultant &amp; Corporate Trainer
            </span>
          </Link>

          <div
            className={cn(
              "hidden flex-1 items-center justify-center gap-6 lg:flex lg:gap-7",
              open &&
                "absolute left-3.5 right-3.5 top-[62px] z-50 flex flex-col rounded-xl border border-line bg-white p-4 shadow-[0_20px_40px_-28px_rgba(10,22,40,0.35)] lg:static lg:flex-row lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none",
            )}
            id="subpage-navlinks"
          >
            {subpageNavLinks.map((link) => {
              const isActive = link.id === active;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "relative py-1 text-xs font-extrabold no-underline transition-colors duration-200",
                    "text-[#4e5d75] hover:text-blue",
                    isActive && "text-blue",
                  )}
                >
                  {link.label}
                  {isActive ? (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-blue" />
                  ) : null}
                </Link>
              );
            })}
          </div>

          <MagneticButton
            href={subpageNavCta.href}
            variant="primary"
            className="hidden shrink-0 px-3.5 py-2 text-[11px] md:inline-flex"
          >
            {subpageNavCta.label}
          </MagneticButton>

          <button
            type="button"
            className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-navy transition-colors hover:border-blue/20 hover:bg-blue-soft lg:hidden"
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
