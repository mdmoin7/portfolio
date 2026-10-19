"use client";

import { useEffect, useState } from "react";

/* ==========================================================================
   Cinematic score — the Interstellar main theme.
   The track is served from /audio and routed through Web Audio
   (element → gain → destination) so the wormhole transit can bloom the
   master while it plays. Everything is created lazily on the first start.
   Autoplay is attempted on mount where policy allows; otherwise the
   visitor's first interaction anywhere arms it (browsers require a user
   gesture before audible playback). To swap the music, replace
   public/audio/interstellar-main-theme.m4a and SCORE_SRC.
   ========================================================================== */

const SCORE_SRC = "/audio/interstellar-main-theme.m4a";
const BASE_VOLUME = 0.6;

type ScoreState = {
  context: AudioContext | null;
  element: HTMLAudioElement | null;
  gain: GainNode | null;
  playing: boolean;
};

const state: ScoreState = {
  context: null,
  element: null,
  gain: null,
  playing: false,
};

function notify() {
  window.dispatchEvent(new Event("moin-audio-state"));
}

/* Lazily build element + graph. Only ever called from a user gesture. */
function ensureGraph() {
  if (!state.element) {
    const el = new Audio();
    el.src = SCORE_SRC;
    el.loop = true;
    el.preload = "none";
    state.element = el;
  }
  if (!state.context || state.context.state === "closed") {
    const Ctor =
      window.AudioContext ??
      (window as typeof window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return false;
    state.context = new Ctor();
    state.gain = null;
  }
  if (!state.gain && state.context) {
    const source = state.context.createMediaElementSource(state.element);
    const gain = state.context.createGain();
    gain.gain.value = 0.0001;
    source.connect(gain).connect(state.context.destination);
    state.gain = gain;
  }
  return true;
}

export async function startCinematicAudio() {
  if (state.playing) return true;
  try {
    if (!ensureGraph()) return false;
    const context = state.context!;
    const gain = state.gain!;
    if (context.state !== "running") await context.resume();

    /* Cinematic fade-in under the opening bars. */
    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
    gain.gain.exponentialRampToValueAtTime(BASE_VOLUME, now + 2.6);

    await state.element!.play();
    state.playing = true;
    notify();
    return true;
  } catch (error) {
    console.warn("Cinematic score could not start.", error);
    await stopCinematicAudio();
    return false;
  }
}

export async function stopCinematicAudio() {
  const context = state.context;
  const gain = state.gain;
  if (context && gain && context.state === "running") {
    const now = context.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
    await new Promise((resolve) => window.setTimeout(resolve, 400));
  }
  state.element?.pause();
  state.playing = false;
  if (context && context.state === "running") await context.suspend();
  notify();
}

/**
 * Wormhole swell: bloom the master for a couple of seconds as the transit
 * fires, then settle back. No-op when the score isn't running.
 */
export function swellCinematicAudio() {
  const context = state.context;
  if (!state.playing || !context || context.state !== "running" || !state.gain) {
    return;
  }
  const now = context.currentTime;
  const gain = state.gain.gain;
  gain.cancelScheduledValues(now);
  gain.setValueAtTime(Math.max(0.0001, gain.value), now);
  gain.linearRampToValueAtTime(Math.min(1, BASE_VOLUME * 1.5), now + 0.9);
  gain.setTargetAtTime(BASE_VOLUME, now + 1.7, 1.1);
}

export function isCinematicAudioPlaying() {
  return state.playing;
}

export function CinematicAudioControl() {
  const [on, setOn] = useState(state.playing);

  useEffect(() => {
    const sync = () => setOn(state.playing);
    window.addEventListener("moin-audio-state", sync);

    /* Autoplay: try straight away where policy allows it, and arm the
       visitor's first interaction anywhere on the page as the gesture
       that unlocks it otherwise. Once they stop it, it stays stopped. */
    let armed = true;
    const disarm = () => {
      armed = false;
      window.removeEventListener("pointerdown", tryStart);
      window.removeEventListener("keydown", tryStart);
      window.removeEventListener("touchstart", tryStart);
    };
    const tryStart = async () => {
      const started = await startCinematicAudio();
      if (started || !armed) disarm();
    };

    // Calling play() forces the download even when it will be rejected, so
    // only probe up-front where the browser can tell us a gesture has
    // already happened (revisit, or a pre-hydration click).
    const activation = (navigator as Navigator & {
      userActivation?: { hasBeenActive: boolean };
    }).userActivation;
    if (activation ? activation.hasBeenActive : true) {
      void tryStart();
    }

    window.addEventListener("pointerdown", tryStart);
    window.addEventListener("keydown", tryStart);
    window.addEventListener("touchstart", tryStart, { passive: true });

    return () => {
      window.removeEventListener("moin-audio-state", sync);
      disarm();
    };
  }, []);

  const toggle = async () => {
    if (state.playing) await stopCinematicAudio();
    else await startCinematicAudio();
    setOn(state.playing);
  };

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      className="sound-control"
      aria-pressed={on}
      aria-label={on ? "Turn the Interstellar score off" : "Play the Interstellar score"}
    >
      <span className="sound-glyph" aria-hidden="true">
        {on ? "◉" : "▶"}
      </span>
      <b className="sound-label">
        {on ? "INTERSTELLAR · PLAYING" : "PLAY INTERSTELLAR SCORE"}
      </b>
    </button>
  );
}

export function notifyCinematicAudioState() {
  notify();
}
