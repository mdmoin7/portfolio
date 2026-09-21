"use client";

import { useEffect, useState } from "react";

type AudioState = { context: AudioContext | null; master: GainNode | null; nodes: AudioNode[]; timers: number[]; playing: boolean };
const state: AudioState = { context: null, master: null, nodes: [], timers: [], playing: false };
const PHRASE = [220, 261.63, 329.63, 392, 329.63, 293.66, 261.63, 196];
function getAudioContext() { const Ctor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext; return Ctor ? new Ctor() : null; }
function notify() { window.dispatchEvent(new Event("moin-audio-state")); }
function makeVoice(context: AudioContext, destination: AudioNode, frequency: number, type: OscillatorType, level: number) {
  const osc = context.createOscillator(); const filter = context.createBiquadFilter(); const gain = context.createGain();
  osc.type = type; osc.frequency.value = frequency; filter.type = "lowpass"; filter.frequency.value = type === "sine" ? 1800 : 1250; filter.Q.value = 0.45; gain.gain.value = 0.0001;
  osc.connect(filter).connect(gain).connect(destination); osc.start(); gain.gain.setTargetAtTime(level, context.currentTime, 1.4);
  return { osc, filter, gain };
}
function pluck(context: AudioContext, destination: AudioNode, frequency: number) {
  const now = context.currentTime; const osc = context.createOscillator(); const overtone = context.createOscillator(); const gain = context.createGain(); const filter = context.createBiquadFilter();
  osc.type = "sine"; overtone.type = "triangle"; osc.frequency.setValueAtTime(frequency, now); overtone.frequency.setValueAtTime(frequency * 2, now);
  filter.type = "lowpass"; filter.frequency.setValueAtTime(2400, now); filter.frequency.exponentialRampToValueAtTime(700, now + 1.1);
  gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(0.045, now + 0.018); gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);
  osc.connect(filter); overtone.connect(filter); filter.connect(gain).connect(destination); osc.start(now); overtone.start(now); osc.stop(now + 1.3); overtone.stop(now + 1.3);
  state.nodes.push(osc, overtone, gain, filter);
}
function pulse(context: AudioContext, destination: AudioNode) {
  const now = context.currentTime; const osc = context.createOscillator(); const gain = context.createGain();
  osc.type = "sine"; osc.frequency.setValueAtTime(82.41, now); osc.frequency.exponentialRampToValueAtTime(61.74, now + 0.5);
  gain.gain.setValueAtTime(0.0001, now); gain.gain.exponentialRampToValueAtTime(0.022, now + 0.035); gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.72);
  osc.connect(gain).connect(destination); osc.start(now); osc.stop(now + 0.8); state.nodes.push(osc, gain);
}
export async function startCinematicAudio() {
  if (state.playing) return true;
  try {
    const context = state.context && state.context.state !== "closed" ? state.context : getAudioContext(); if (!context) return false;
    state.context = context; if (context.state !== "running") await context.resume();
    const now = context.currentTime; const master = context.createGain(); const compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -30; compressor.knee.value = 18; compressor.ratio.value = 2; compressor.attack.value = 0.05; compressor.release.value = 0.9;
    master.gain.setValueAtTime(0.0001, now); master.gain.exponentialRampToValueAtTime(0.048, now + 2.8); master.connect(compressor).connect(context.destination); state.master = master;
    const low = makeVoice(context, master, 55, "sine", 0.012);
    const bed = makeVoice(context, master, 110, "triangle", 0.006);
    let step = 0;
    pluck(context, master, PHRASE[0]);
    const phraseTimer = window.setInterval(() => { step = (step + 1) % PHRASE.length; pluck(context, master, PHRASE[step]); }, 1500);
    const pulseTimer = window.setInterval(() => pulse(context, master), 6000);
    state.timers = [phraseTimer, pulseTimer]; state.nodes = [low.osc, low.filter, low.gain, bed.osc, bed.filter, bed.gain, master, compressor]; state.playing = true; notify(); return true;
  } catch(error) { console.warn("Cinematic score could not start.", error); await stopCinematicAudio(); return false; }
}
export async function stopCinematicAudio() {
  const context = state.context; const master = state.master;
  if (context && master && context.state !== "closed") { const now = context.currentTime; master.gain.cancelScheduledValues(now); master.gain.setTargetAtTime(0.0001, now, 0.18); await new Promise(resolve => window.setTimeout(resolve, 360)); }
  state.timers.forEach(timer => window.clearInterval(timer)); state.timers = []; state.nodes.forEach(node => { try { node.disconnect(); } catch {} }); state.nodes = []; state.master = null; state.playing = false; if (context && context.state !== "closed") await context.suspend(); notify();
}
export function isCinematicAudioPlaying() { return state.playing; }
export function CinematicAudioControl() {
  const [on, setOn] = useState(state.playing); useEffect(() => { const sync = () => setOn(state.playing); window.addEventListener("moin-audio-state", sync); return () => window.removeEventListener("moin-audio-state", sync); }, []);
  const toggle = async () => { if (state.playing) await stopCinematicAudio(); else await startCinematicAudio(); setOn(state.playing); };
  return <button type="button" onClick={() => void toggle()} className="sound-control" aria-pressed={on} aria-label={on ? "Turn cinematic score off" : "Play cinematic score"}><span aria-hidden="true">{on ? "◉" : "▶"}</span> {on ? "SCORE · PLAYING" : "PLAY CINEMATIC SCORE"}</button>;
}
export function notifyCinematicAudioState() { notify(); }
