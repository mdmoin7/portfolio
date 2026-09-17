"use client";

import { useEffect, useRef, useState } from "react";

export function CinematicSound() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);

  useEffect(() => () => {
    nodesRef.current.forEach((node) => node.disconnect());
    void ctxRef.current?.close();
  }, []);

  const toggle = async () => {
    if (on) {
      nodesRef.current.forEach((node) => node.disconnect());
      nodesRef.current = [];
      await ctxRef.current?.suspend();
      setOn(false);
      return;
    }

    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = ctxRef.current ?? new AudioCtx();
    ctxRef.current = ctx;
    await ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0.018;
    master.connect(ctx.destination);

    const low = ctx.createOscillator();
    low.type = "sine";
    low.frequency.value = 54;
    const lowGain = ctx.createGain();
    lowGain.gain.value = 0.35;
    low.connect(lowGain).connect(master);

    const high = ctx.createOscillator();
    high.type = "sine";
    high.frequency.value = 108;
    const highGain = ctx.createGain();
    highGain.gain.value = 0.08;
    high.connect(highGain).connect(master);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.025;
    lfo.connect(lfoGain).connect(lowGain.gain);

    low.start(); high.start(); lfo.start();
    nodesRef.current = [low, lowGain, high, highGain, lfo, lfoGain, master];
    setOn(true);
  };

  return <button className={`sound-control ${on ? "on" : ""}`} onClick={toggle} aria-pressed={on} aria-label="Toggle cinematic soundscape">{on ? "SOUND ON" : "SOUND OFF"}</button>;
}
