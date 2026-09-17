"use client";

import { useEffect, useState } from "react";

type AudioState = { context: AudioContext | null; master: GainNode | null; nodes: AudioNode[]; timers: number[]; playing: boolean };
const state: AudioState = { context: null, master: null, nodes: [], timers: [], playing: false };
const CHORDS = [[130.81,155.56,196,261.63],[116.54,146.83,174.61,233.08],[98,130.81,164.81,196],[110,146.83,174.61,220]];
function getAudioContext() { const Ctor = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext; return Ctor ? new Ctor() : null; }
function notify() { window.dispatchEvent(new Event("moin-audio-state")); }
function makePadVoice(context: AudioContext, master: GainNode, frequency: number, detune: number) {
  const osc = context.createOscillator(); const filter = context.createBiquadFilter(); const gain = context.createGain();
  osc.type = "triangle"; osc.frequency.value = frequency; osc.detune.value = detune;
  filter.type = "lowpass"; filter.frequency.value = 1050; filter.Q.value = .4; gain.gain.value = .0001;
  osc.connect(filter).connect(gain).connect(master); osc.start(); return { osc, filter, gain };
}
function schedulePulse(context: AudioContext, master: GainNode) {
  const now = context.currentTime; const osc = context.createOscillator(); const gain = context.createGain(); const filter = context.createBiquadFilter();
  osc.type = "sine"; osc.frequency.setValueAtTime(392, now); osc.frequency.exponentialRampToValueAtTime(196, now + .34);
  filter.type = "lowpass"; filter.frequency.value = 1700;
  gain.gain.setValueAtTime(.0001, now); gain.gain.exponentialRampToValueAtTime(.035, now + .015); gain.gain.exponentialRampToValueAtTime(.0001, now + .7);
  osc.connect(filter).connect(gain).connect(master); osc.start(now); osc.stop(now + .75); state.nodes.push(osc, gain, filter);
}
export async function startCinematicAudio() {
  if (state.playing) return true;
  try {
    const context = state.context && state.context.state !== "closed" ? state.context : getAudioContext(); if (!context) return false;
    state.context = context; if (context.state !== "running") await context.resume();
    const now = context.currentTime; const master = context.createGain(); const compressor = context.createDynamicsCompressor();
    compressor.threshold.value=-25; compressor.knee.value=16; compressor.ratio.value=2.4; compressor.attack.value=.04; compressor.release.value=.8;
    master.gain.setValueAtTime(.0001,now); master.gain.exponentialRampToValueAtTime(.055,now+3.5); master.connect(compressor).connect(context.destination); state.master=master;
    const voices=CHORDS[0].map((frequency,index)=>makePadVoice(context,master,frequency,index===0?-5:index===3?4:0)); const bass=makePadVoice(context,master,65.41,-3); bass.filter.frequency.value=420;
    voices.forEach((voice,index)=>voice.gain.setTargetAtTime(index===0?.018:.012,now,2.2)); bass.gain.setTargetAtTime(.018,now,2.8);
    const delay=context.createDelay(2); const feedback=context.createGain(); const wet=context.createGain(); delay.delayTime.value=.72; feedback.gain.value=.16; wet.gain.value=.08; master.connect(delay).connect(feedback).connect(delay); delay.connect(wet).connect(master);
    let step=0;
    const chordTimer=window.setInterval(()=>{ step=(step+1)%CHORDS.length; const t=context.currentTime; CHORDS[step].forEach((frequency,index)=>voices[index].osc.frequency.setTargetAtTime(frequency,t,1.8)); bass.osc.frequency.setTargetAtTime(CHORDS[step][0]/2,t,2.2); },8000);
    const pulseTimer=window.setInterval(()=>schedulePulse(context,master),4000);
    state.timers=[chordTimer,pulseTimer]; state.nodes=[...voices.flatMap(voice=>[voice.osc,voice.filter,voice.gain]),bass.osc,bass.filter,bass.gain,delay,feedback,wet,master,compressor]; state.playing=true; notify(); return true;
  } catch(error) { console.warn("Cinematic score could not start.",error); await stopCinematicAudio(); return false; }
}
export async function stopCinematicAudio() {
  const context=state.context; const master=state.master;
  if(context&&master&&context.state!=="closed"){const now=context.currentTime;master.gain.cancelScheduledValues(now);master.gain.setTargetAtTime(.0001,now,.22);await new Promise(resolve=>window.setTimeout(resolve,420));}
  state.timers.forEach(timer=>window.clearInterval(timer)); state.timers=[]; state.nodes.forEach(node=>{try{node.disconnect()}catch{}}); state.nodes=[]; state.master=null; state.playing=false; if(context&&context.state!=="closed")await context.suspend(); notify();
}
export function isCinematicAudioPlaying(){return state.playing;}
export function CinematicAudioControl(){
  const [on,setOn]=useState(state.playing); useEffect(()=>{const sync=()=>setOn(state.playing);window.addEventListener("moin-audio-state",sync);return()=>window.removeEventListener("moin-audio-state",sync)},[]);
  const toggle=async()=>{if(state.playing)await stopCinematicAudio();else await startCinematicAudio();setOn(state.playing)};
  return <button type="button" onClick={()=>void toggle()} className="sound-control" aria-pressed={on} aria-label={on?"Turn cinematic score off":"Play ambient cinematic score"}><span aria-hidden="true">{on?"◉":"▶"}</span> {on?"SCORE · PLAYING":"PLAY AMBIENT SCORE"}</button>;
}
export function notifyCinematicAudioState(){notify();}
