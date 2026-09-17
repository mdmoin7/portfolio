"use client";

import { useEffect, useState } from "react";

type AudioState = {
  context: AudioContext | null;
  master: GainNode | null;
  nodes: AudioNode[];
  timers: number[];
  playing: boolean;
};

const state: AudioState = {
  context: null,
  master: null,
  nodes: [],
  timers: [],
  playing: false,
};

function getAudioContext() {
  const AudioCtor = window.AudioContext ??
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  return AudioCtor ? new AudioCtor() : null;
}

export async function startCinematicAudio() {
  if (state.playing) return true;

  try {
    const context = state.context && state.context.state !== "closed"
      ? state.context
      : getAudioContext();
    if (!context) return false;

    state.context = context;
    if (context.state !== "running") await context.resume();

    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -22;
    compressor.knee.value = 18;
    compressor.ratio.value = 4;
    compressor.attack.value = 0.02;
    compressor.release.value = 0.5;
    master.gain.setValueAtTime(0, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.055, context.currentTime + 1.6);
    master.connect(compressor).connect(context.destination);
    state.master = master;

    const low = context.createOscillator();
    low.type = "sine";
    low.frequency.value = 55;
    const lowGain = context.createGain();
    lowGain.gain.value = 0.48;
    low.connect(lowGain).connect(master);

    const fifth = context.createOscillator();
    fifth.type = "sine";
    fifth.frequency.value = 82.41;
    const fifthGain = context.createGain();
    fifthGain.gain.value = 0.16;
    fifth.connect(fifthGain).connect(master);

    const air = context.createOscillator();
    air.type = "triangle";
    air.frequency.value = 164.81;
    const airGain = context.createGain();
    airGain.gain.value = 0.025;
    air.connect(airGain).connect(master);

    const lfo = context.createOscillator();
    lfo.frequency.value = 0.055;
    const lfoDepth = context.createGain();
    lfoDepth.gain.value = 0.16;
    lfo.connect(lfoDepth).connect(lowGain.gain);

    const noiseBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseData.length; i += 1) noiseData[i] = Math.random() * 2 - 1;
    const noise = context.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;
    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 850;
    filter.Q.value = 0.3;
    const noiseGain = context.createGain();
    noiseGain.gain.value = 0.006;
    noise.connect(filter).connect(noiseGain).connect(master);

    const delay = context.createDelay(1.5);
    delay.delayTime.value = 0.42;
    const feedback = context.createGain();
    feedback.gain.value = 0.16;
    const delayGain = context.createGain();
    delayGain.gain.value = 0.08;
    master.connect(delay).connect(feedback).connect(delay);
    delay.connect(delayGain).connect(master);

    [low, fifth, air, lfo, noise].forEach((node) => node.start());
    state.nodes = [low, lowGain, fifth, fifthGain, air, airGain, lfo, lfoDepth, noise, filter, noiseGain, delay, feedback, delayGain, master, compressor];
    state.playing = true;
    return true;
  } catch (error) {
    console.warn("Cinematic audio could not start.", error);
    await stopCinematicAudio();
    return false;
  }
}

export async function stopCinematicAudio() {
  const context = state.context;
  const master = state.master;
  if (context && master && context.state !== "closed") {
    const now = context.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(0.0001, now, 0.12);
    await new Promise((resolve) => window.setTimeout(resolve, 220));
  }

  state.timers.forEach((timer) => window.clearInterval(timer));
  state.timers = [];
  state.nodes.forEach((node) => node.disconnect());
  state.nodes = [];
  state.master = null;
  state.playing = false;

  if (context && context.state !== "closed") await context.suspend();
}

export function isCinematicAudioPlaying() {
  return state.playing;
}

export function CinematicAudioControl() {
  const [on, setOn] = useState(state.playing);

  useEffect(() => {
    const sync = () => setOn(state.playing);
    window.addEventListener("moin-audio-state", sync);
    return () => window.removeEventListener("moin-audio-state", sync);
  }, []);

  const toggle = async () => {
    if (state.playing) await stopCinematicAudio();
    else await startCinematicAudio();
    setOn(state.playing);
    window.dispatchEvent(new Event("moin-audio-state"));
  };

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      className="fixed bottom-5 right-5 z-[70] rounded-full border border-white/15 bg-navy/80 px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-white/70 shadow-lg backdrop-blur-xl transition hover:border-gold/50 hover:text-white"
      aria-pressed={on}
      aria-label={on ? "Turn cinematic sound off" : "Turn cinematic sound on"}
    >
      {on ? "Sound · On" : "Sound · Off"}
    </button>
  );
}

export function notifyCinematicAudioState() {
  window.dispatchEvent(new Event("moin-audio-state"));
}
