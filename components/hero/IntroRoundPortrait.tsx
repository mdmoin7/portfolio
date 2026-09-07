"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

export function IntroRoundPortrait({
  imageUrl,
  alt,
  play = true,
}: {
  imageUrl: string;
  alt: string;
  play?: boolean;
}) {
  return (
    <div className="intro-round-portrait">
      <div className="intro-round-portrait-glow" aria-hidden="true" />

      <motion.div
        className="intro-round-portrait-figure"
        initial={{ opacity: 0, y: 20, scale: 0.88, filter: "blur(10px)" }}
        animate={
          play
            ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
            : { opacity: 0, y: 20, scale: 0.88, filter: "blur(10px)" }
        }
        transition={{ delay: 0.12, duration: 0.85, ease }}
      >
        <div className="cinematic-ring intro-round-portrait-ring" aria-hidden="true" />
        <div className="intro-round-portrait-frame">
          <Image
            src={imageUrl}
            alt={alt}
            fill
            priority
            sizes="(max-width: 1024px) 40vw, 240px"
            className="object-cover object-center"
          />
        </div>
      </motion.div>
    </div>
  );
}
