"use client";

import { useEffect, useState } from "react";

type AudioState = { context: AudioContext | null; master: GainNode | null; nodes: AudioNode[]; timers: number[]; playing: boolean };
const state: AudioState = { context: null, master: null, nodes: [], timers: [], playing: false };
function getAudioContext() { const Ctor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext; return Ctor ? new Ctor() : null; }
function notify() { window.dispatchEvent(new Event("moin-audio-state")); }

export async function startCinematicAudio() {
  if (state.playing) return true;
  try {
    const context = state.context && state.context.state !== "closed" ? state.context : getAudioContext();
    if (!context) return false;
    state.context = context;
    if (context.state !== "running") await context.resume();
    const now = context.currentTime;
    const master = context.createGain();
    const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -24; compressor.knee.value = 18; compressor.ratio.value = 3; compressor.attack.value = 0.03; compressor.release.value = 0.7;
    master.gain.setValueAtTime(0.0001, now); master.gain.exponentialRampToValueAtTime(0.045, now + 2.2); master.connect(compressor).connect(context.destination); state.master = master;

    const makeTone = (frequency: number, gainValue: number, type: OscillatorType) => { const osc = context.createOscillator(); const gain = context.createGain(); osc.type = type; osc.frequency.value = frequency; gain.gain.value = gainValue; osc.connect(gain).connect(master); osc.start(); return [osc, gain] as const; };
    const low = makeTone(55, 0.30, "sine");
    const fifth = makeTone(82.41, 0.07, "sine");
    const high = makeTone(164.81, 0.012, "sine");

    const lfo = context.createOscillator(); const lfoGain = context.createGain(); lfo.frequency.value = 0.035; lfoGain.gain.value = 0.055; lfo.connect(lfoGain).connect(low[1].gain); lfo.start();
    const slowPan = context.createOscillator(); const panDepth = context.createGain(); slowPan.frequency.value = 0.017; panDepth.gain.value = 0.012; slowPan.connect(panDepth).connect(master.gain); slowPan.start();

    const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate); const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
    const noise = context.createBufferSource(); noise.buffer = buffer; noise.loop = true;
    const filter = context.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 420; filter.Q.value = 0.25;
    const noiseGain = context.createGain(); noiseGain.gain.value = 0.0025; noise.connect(filter).connect(noiseGain).connect(master); noise.start();

    const delay = context.createDelay(1.5); delay.delayTime.value = 0.58; const feedback = context.createGain(); feedback.gain.value = 0.11; const wet = context.createGain(); wet.gain.value = 0.035; master.connect(delay).connect(feedback).connect(delay); delay.connect(wet).connect(master);
    state.nodes = [low[0], low[1], fifth[0], fifth[1], high[0], high[1], lfo, lfoGain, slowPan, panDepth, noise, filter, noiseGain, delay, feedback, wet, master, compressor];
    state.playing = true; notify(); return true;
  } catch (error) { console.warn("Cinematic audio could not start.", error); await stopCinematicAudio(); return false; }
}

export async function stopCinematicAudio() {
  const context = state.context; const master = state.master;
  if (context && master && context.state !== "closed") { const now = context.currentTime; master.gain.cancelScheduledValues(now); master.gain.setTargetAtTime(0.0001, now, 0.18); await new Promise(resolve => window.setTimeout(resolve, 300)); }
  state.timers.forEach(timer => window.clearInterval(timer)); state.timers = []; state.nodes.forEach(node => node.disconnect()); state.nodes = []; state.master = null; state.playing = false; notify();
  if (context && context.state !== "closed") await context.suspend();
}
export function isCinematicAudioPlaying() { return state.playing; }

export function CinematicAudioControl() {
  const [on, setOn] = useState(state.playing);
  useEffect(() => { const sync = () => setOn(state.playing); window.addEventListener("moin-audio-state", sync); return () => window.removeEventListener("moin-audio-state", sync); }, []);
  const toggle = async () => { if (state.playing) await stopCinematicAudio(); else await startCinematicAudio(); setOn(state.playing); };
  return <button type="button" onClick={() => void toggle()} className="sound-control" aria-pressed={on} aria-label={on ? "Turn cinematic sound off" : "Turn cinematic sound on"}>{on ? "SOUND · ON" : "SOUND · OFF"}</button>;
}
export function notifyCinematicAudioState() { notify(); }
