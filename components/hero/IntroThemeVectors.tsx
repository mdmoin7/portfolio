"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/motion";

type VectorSpec = {
  id: string;
  className: string;
  size: number;
  delay: number;
  duration: number;
  children: ReactNode;
};

function CodeBracketsIcon() {
  return (
    <path
      d="M8 6L2 16l6 10M16 6l6 10-6 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );
}

function BookIcon() {
  return (
    <>
      <path
        d="M4 5c4-2 8-2 12 0v14c-4-2-8-2-12 0V5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M16 5v14" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 9h4M8 13h3" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </>
  );
}

function GraduationCapIcon() {
  return (
    <>
      <path
        d="M2 10 12 5l10 5-10 5-10-5z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M6 12v5c2 1.5 4 1.5 6 0v-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M20 10v6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </>
  );
}

function ChipIcon() {
  return (
    <>
      <rect
        x="7"
        y="7"
        width="10"
        height="10"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M10 7V4M14 7V4M10 17v3M14 17v3M7 10H4M7 14H4M17 10h3M17 14h3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </>
  );
}

function NetworkIcon() {
  return (
    <>
      <circle cx="6" cy="6" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="18" cy="8" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="18" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7.5l8 .5M7.5 8.5l3.5 8M14.5 10l-1 6.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </>
  );
}

function LayersIcon() {
  return (
    <>
      <path d="M12 4 3 9l9 5 9-5-9-5z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 13l9 5 9-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M3 17l9 5 9-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </>
  );
}

function UsersIcon() {
  return (
    <>
      <circle cx="9" cy="8" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M3 19c0-3 2.5-5 6-5s6 2 6 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="17" cy="9" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.3" />
      <path d="M14 19c.4-2 1.8-3.5 4-3.5" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </>
  );
}

function TerminalIcon() {
  return (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 10l3 3-3 3M12 16h5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

const vectors: VectorSpec[] = [
  {
    id: "code",
    className: "left-[6%] top-[14%] text-blue-glow/35",
    size: 52,
    delay: 0,
    duration: 7,
    children: <CodeBracketsIcon />,
  },
  {
    id: "book",
    className: "right-[7%] top-[16%] text-gold/30",
    size: 48,
    delay: 0.4,
    duration: 8,
    children: <BookIcon />,
  },
  {
    id: "cap",
    className: "left-[10%] bottom-[18%] text-gold/28",
    size: 50,
    delay: 0.8,
    duration: 7.5,
    children: <GraduationCapIcon />,
  },
  {
    id: "chip",
    className: "right-[9%] bottom-[20%] text-blue-glow/32",
    size: 46,
    delay: 1.1,
    duration: 6.5,
    children: <ChipIcon />,
  },
  {
    id: "network",
    className: "left-[18%] top-[42%] text-blue/25",
    size: 44,
    delay: 0.6,
    duration: 9,
    children: <NetworkIcon />,
  },
  {
    id: "layers",
    className: "right-[14%] top-[38%] text-blue-glow/28",
    size: 42,
    delay: 1.4,
    duration: 8.5,
    children: <LayersIcon />,
  },
  {
    id: "users",
    className: "left-[4%] top-[52%] hidden text-gold/22 sm:block",
    size: 50,
    delay: 0.2,
    duration: 8,
    children: <UsersIcon />,
  },
  {
    id: "terminal",
    className: "right-[5%] top-[58%] hidden text-blue-glow/26 md:block",
    size: 48,
    delay: 1.8,
    duration: 7.2,
    children: <TerminalIcon />,
  },
];

function FloatingVector({ spec, reducedMotion }: { spec: VectorSpec; reducedMotion: boolean }) {
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute ${spec.className}`}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={
        reducedMotion
          ? { opacity: 1, scale: 1, y: 0, rotate: 0 }
          : {
              opacity: [0.55, 0.95, 0.55],
              y: [0, -14, 0],
              rotate: [-6, 6, -6],
              scale: [1, 1.04, 1],
            }
      }
      transition={
        reducedMotion
          ? { duration: 0.4 }
          : {
              duration: spec.duration,
              delay: spec.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }
      }
    >
      <svg
        viewBox="0 0 24 24"
        width={spec.size}
        height={spec.size}
        className="drop-shadow-[0_0_18px_rgba(36,84,216,0.18)]"
      >
        {spec.children}
      </svg>
    </motion.div>
  );
}

export function IntroThemeVectors({ className }: { className?: string }) {
  const reducedMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {vectors.map((spec) => (
        <FloatingVector key={spec.id} spec={spec} reducedMotion={reducedMotion} />
      ))}

      {/* Soft orbit rings — tie vectors to the particle sphere motif */}
      <div className="absolute left-1/2 top-1/2 h-[min(88vw,680px)] w-[min(88vw,680px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-glow/10" />
      <div className="absolute left-1/2 top-1/2 h-[min(62vw,480px)] w-[min(62vw,480px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/10" />
    </div>
  );
}
