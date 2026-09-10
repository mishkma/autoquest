/* AutoQuest — background chiptune (10 Sept 2026, user request: "давай музыку
   придумай.. начнём с одной повторяющейся 8-битной темы.. возьми за основу
   NES игры"). Procedurally generated via the Web Audio API (oscillators +
   a noise buffer), not a pre-rendered mp3 — matches the project's own
   earlier plan for this backlog item (see ROADMAP.md) and keeps the whole
   course a zero-asset static site. The melody/bassline below is an
   ORIGINAL composition written for this project, only in the STYLE of a
   classic NES soundtrack (two pulse/square channels' worth of melody+
   harmony, one triangle-wave bass, one noise-channel hi-hat — the NES
   2A03 APU's actual channel layout) — it does not quote or reproduce any
   real game's theme.

   Declared as a plain `Music` object on `window`, NOT inside an IIFE —
   same reason matchEn()/tr() live outside app.js's own IIFE (see
   js/modules-data.js's top-of-file comment): app.js needs to call into
   this from its own closure, and script tags don't share scope unless
   the thing being shared is attached to something both can see. */
window.Music = (function(){

  const STORAGE_KEY = 'autoquest-music';

  // ---- equal-temperament note table (A4 = 440Hz), just the notes this
  // riff actually uses — no need for a full 88-key table here. ----
  const NOTE = {
    E2:82.41, F2:87.31, G2:98.00, A2:110.00,
    A3:220.00,
    E4:329.63, F4:349.23, G4:392.00, A4:440.00, C5:523.25, E5:659.25
  };

  const TEMPO = 148; // BPM — brisk, upbeat, matches the arcade/adventure framing
  const STEP = 60 / TEMPO / 2; // one eighth-note, in seconds

  // 16-step loop (two 4/4 bars of eighth-notes), A minor. Lead is a short
  // rising-and-falling arpeggio figure (classic NES "overworld/action"
  // shape); bass holds simple root notes under it; the hi-hat lands on
  // every off-beat, the way a lot of 2A03 noise-channel percussion does.
  const LEAD = [
    NOTE.A4, NOTE.C5, NOTE.E5, NOTE.C5,
    NOTE.A4, NOTE.G4, NOTE.A4, null,
    NOTE.F4, NOTE.A4, NOTE.C5, NOTE.A4,
    NOTE.G4, NOTE.E4, NOTE.G4, null
  ];
  const HARMONY = [
    null, NOTE.E4, null, NOTE.E4,
    null, null, null, null,
    null, NOTE.F4, null, NOTE.F4,
    null, null, null, null
  ];
  const BASS = [
    NOTE.A2, null, NOTE.A2, null,
    NOTE.E2, null, NOTE.E2, null,
    NOTE.F2, null, NOTE.F2, null,
    NOTE.G2, null, NOTE.E2, null
  ];

  let ctx = null, masterGain = null;
  let started = false, enabled = true;
  let schedulerId = null, stepIndex = 0, nextStepTime = 0;

  const VOL_KEY = 'autoquest-music-volume';
  const DEFAULT_VOLUME = 0.6;
  let volume = DEFAULT_VOLUME;

  function getStoredEnabled(){
    try{
      const v = localStorage.getItem(STORAGE_KEY);
      return v === null ? true : v === '1';
    }catch(e){ return true; }
  }
  function setStoredEnabled(on){
    try{ localStorage.setItem(STORAGE_KEY, on ? '1' : '0'); }catch(e){}
  }
  function getStoredVolume(){
    try{
      const v = parseFloat(localStorage.getItem(VOL_KEY));
      return isFinite(v) && v >= 0 && v <= 1 ? v : DEFAULT_VOLUME;
    }catch(e){ return DEFAULT_VOLUME; }
  }
  function setStoredVolume(v){
    try{ localStorage.setItem(VOL_KEY, String(v)); }catch(e){}
  }

  // Effective output level: 0 whenever muted, `volume` otherwise — one
  // gain node, one place this combination is computed, so mute and the
  // slider can never fight over what the node's actual value should be.
  function applyGain(){
    if(!masterGain || !ctx) return;
    masterGain.gain.setTargetAtTime(enabled ? volume : 0, ctx.currentTime, 0.05);
  }

  function ensureContext(){
    if(ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return; // no Web Audio support — Music quietly does nothing
    ctx = new AC();
    masterGain = ctx.createGain();
    masterGain.gain.value = enabled ? volume : 0;
    masterGain.connect(ctx.destination);
  }

  // Short attack + exponential decay envelope on every note — without
  // this, square/triangle oscillators starting/stopping at full volume
  // produce an audible "click" at each note boundary.
  function playTone(freq, time, dur, type, peakVol){
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(peakVol, time + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(g);
    g.connect(masterGain);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  // Noise-channel hi-hat: a short burst of white noise through a
  // highpass filter, the standard cheap way to fake the NES APU's own
  // noise channel for a percussive tick rather than a tuned pitch.
  function playHat(time){
    const dur = 0.035;
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 6500;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.05, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(masterGain);
    src.start(time);
    src.stop(time + dur);
  }

  function scheduleStep(i, time){
    const lead = LEAD[i % LEAD.length];
    const harmony = HARMONY[i % HARMONY.length];
    const bass = BASS[i % BASS.length];
    if(lead) playTone(lead, time, STEP * 0.92, 'square', 0.05);
    if(harmony) playTone(harmony, time, STEP * 0.9, 'square', 0.025);
    if(bass) playTone(bass, time, STEP * 1.9, 'triangle', 0.09);
    if(i % 2 === 1) playHat(time);
  }

  // Standard Web Audio "look-ahead" scheduler (setInterval polls slightly
  // ahead of real time and schedules exact-timed notes via the audio
  // clock, ctx.currentTime — a plain setTimeout-per-note drifts badly
  // over a multi-minute loop because JS timer delays aren't sample-
  // accurate; the audio graph's own clock is).
  const LOOKAHEAD_MS = 25;
  const SCHEDULE_AHEAD_S = 0.15;
  function schedulerTick(){
    while(nextStepTime < ctx.currentTime + SCHEDULE_AHEAD_S){
      scheduleStep(stepIndex, nextStepTime);
      stepIndex++;
      nextStepTime += STEP;
    }
  }

  function start(){
    if(started) return;
    ensureContext();
    if(!ctx) return;
    if(ctx.state === 'suspended') ctx.resume();
    started = true;
    stepIndex = 0;
    nextStepTime = ctx.currentTime + 0.1;
    schedulerId = setInterval(schedulerTick, LOOKAHEAD_MS);
  }

  function setEnabled(on){
    enabled = on;
    setStoredEnabled(on);
    applyGain();
    // First unmute after page load also doubles as the required user-
    // gesture to actually start playback — browsers block audio until
    // one, and the mute button's own click already satisfies that.
    if(on) start();
  }

  function isEnabled(){ return enabled; }

  function setVolume(v){
    volume = Math.max(0, Math.min(1, v));
    setStoredVolume(volume);
    applyGain();
  }

  function getVolume(){ return volume; }

  enabled = getStoredEnabled();
  volume = getStoredVolume();

  return { start, setEnabled, isEnabled, setVolume, getVolume };
})();
