"use client";

import { useEffect, useRef, useState } from "react";

export function CinematicSound() {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioNode[]>([]);
  const masterRef = useRef<GainNode | null>(null);

  useEffect(() => {
    return () => {
      nodesRef.current.forEach((node) => node.disconnect());
      nodesRef.current = [];
      masterRef.current?.disconnect();
      masterRef.current = null;
      void ctxRef.current?.close();
      ctxRef.current = null;
    };
  }, []);

  const stop = async () => {
    const ctx = ctxRef.current;
    const master = masterRef.current;

    if (ctx && master) {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setTargetAtTime(0, now, 0.08);
      await new Promise((resolve) => window.setTimeout(resolve, 180));
    }

    nodesRef.current.forEach((node) => node.disconnect());
    nodesRef.current = [];
    masterRef.current?.disconnect();
    masterRef.current = null;

    if (ctx && ctx.state !== "closed") await ctx.suspend();
    setOn(false);
  };

  const start = async () => {
    const AudioCtx = window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    let ctx = ctxRef.current;
    if (!ctx || ctx.state === "closed") {
      ctx = new AudioCtx();
      ctxRef.current = ctx;
    }

    // Start/resume only from the button click so browser autoplay policies are satisfied.
    if (ctx.state !== "running") await ctx.resume();

    const master = ctx.createGain();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.075, ctx.currentTime + 0.8);
    master.connect(ctx.destination);
    masterRef.current = master;

    const low = ctx.createOscillator();
    low.type = "sine";
    low.frequency.setValueAtTime(55, ctx.currentTime);
    const lowGain = ctx.createGain();
    lowGain.gain.value = 0.32;
    low.connect(lowGain).connect(master);

    const high = ctx.createOscillator();
    high.type = "sine";
    high.frequency.setValueAtTime(110, ctx.currentTime);
    const highGain = ctx.createGain();
    highGain.gain.value = 0.07;
    high.connect(highGain).connect(master);

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.025;
    lfo.connect(lfoGain).connect(lowGain.gain);

    low.start();
    high.start();
    lfo.start();
    nodesRef.current = [low, lowGain, high, highGain, lfo, lfoGain];
    setOn(true);
  };

  const toggle = async () => {
    try {
      if (on) await stop();
      else await start();
    } catch (error) {
      console.warn("Cinematic sound could not be started.", error);
      setOn(false);
    }
  };

  return (
    <button
      className={`sound-control ${on ? "on" : ""}`}
      onClick={() => void toggle()}
      aria-pressed={on}
      aria-label={on ? "Turn cinematic soundscape off" : "Turn cinematic soundscape on"}
      type="button"
    >
      {on ? "SOUND ON" : "SOUND OFF"}
    </button>
  );
}
