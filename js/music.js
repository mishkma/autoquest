/* AutoQuest — background chiptune (10 Sept 2026, user request: "давай музыку
   придумай.. начнём с одной повторяющейся 8-битной темы.. возьми за основу
   NES игры", then "давай сделаем 5 вариантов музыки под каждого
   персонажа"). Procedurally generated via the Web Audio API (oscillators +
   a noise buffer), not a pre-rendered mp3 — matches the project's own
   earlier plan for this backlog item (see ROADMAP.md) and keeps the whole
   course a zero-asset static site. All five loops below are ORIGINAL
   compositions written for this project, only in the STYLE of a classic
   NES soundtrack (two pulse/square channels' worth of melody+harmony, one
   triangle-wave bass, one noise-channel hi-hat — the NES 2A03 APU's actual
   channel layout) — none of them quote or reproduce any real game's theme.

   One theme per Signal Color / character (see CHARACTER_KEYS in app.js —
   Patch/mint, Trace/amber, Null/violet, Ping/cyan, Byte/rose), matching
   the personality already established for each: mint's adventurous rising
   arpeggio was the original single-theme pass and stays as Patch's;
   amber/Trace gets a steady, confident major-key march; violet/Null gets
   a slower, sparser minor/phrygian theme (the "mysterious" head shape);
   cyan/Ping gets a fast, bright, high-register theme; rose/Byte gets a
   playful, syncopated major-pentatonic bounce.

   Declared as a plain `Music` object on `window`, NOT inside an IIFE —
   same reason matchEn()/tr() live outside app.js's own IIFE (see
   js/modules-data.js's top-of-file comment): app.js needs to call into
   this from its own closure, and script tags don't share scope unless
   the thing being shared is attached to something both can see. */
window.Music = (function(){

  const STORAGE_KEY = 'autoquest-music';
  const VOL_KEY = 'autoquest-music-volume';
  const DEFAULT_VOLUME = 0.6;

  // ---- equal-temperament note table (A4 = 440Hz) — just the notes the
  // five themes below actually use, not a full 88-key table. ----
  const NOTE = {
    A1:55.00,
    C2:65.41, D2:73.42, E2:82.41, F2:87.31, FS2:92.50, G2:98.00, B2:123.47,
    C3:130.81, D3:146.83, F3:174.61,
    A3:220.00,
    C4:261.63, D4:293.66, DS4:311.13, E4:329.63, F4:349.23, G4:392.00,
    A4:440.00, B4:493.88,
    C5:523.25, D5:587.33, E5:659.25,
    FS5:739.99, GS5:830.61
  };

  // Every theme is a self-contained 16-step loop (two 4/4 bars of
  // eighth-notes) at its own tempo — lead+harmony on square waves, bass
  // on triangle, same NES-APU-style channel split for all five, only the
  // notes/rhythm/tempo differ. `null` = rest.
  const THEMES = {
    // Patch — original pass, A minor, brisk rising-and-falling arpeggio.
    mint: {
      tempo: 148,
      lead:    [NOTE.A4, NOTE.C5, NOTE.E5, NOTE.C5,  NOTE.A4, NOTE.G4, NOTE.A4, null,
                NOTE.F4, NOTE.A4, NOTE.C5, NOTE.A4,  NOTE.G4, NOTE.E4, NOTE.G4, null],
      harmony: [null, NOTE.E4, null, NOTE.E4,  null, null, null, null,
                null, NOTE.F4, null, NOTE.F4,  null, null, null, null],
      bass:    [NOTE.A2, null, NOTE.A2, null,  NOTE.E2, null, NOTE.E2, null,
                NOTE.F2, null, NOTE.F2, null,  NOTE.G2, null, NOTE.E2, null]
    },
    // Trace — C major, steady walking-bass march, confident/heroic.
    amber: {
      tempo: 140,
      lead:    [NOTE.C4, NOTE.E4, NOTE.G4, NOTE.E4,  NOTE.C4, NOTE.D4, NOTE.E4, null,
                NOTE.F4, NOTE.G4, NOTE.A4, NOTE.G4,  NOTE.F4, NOTE.E4, NOTE.D4, null],
      harmony: [NOTE.G4, null, NOTE.G4, null,  NOTE.G4, null, NOTE.G4, null,
                NOTE.A4, null, NOTE.A4, null,  NOTE.G4, null, NOTE.G4, null],
      bass:    [NOTE.C3, null, NOTE.G2, null,  NOTE.C3, null, NOTE.G2, null,
                NOTE.F2, null, NOTE.C3, null,  NOTE.G2, null, NOTE.C3, null]
    },
    // Null — D phrygian-ish minor, slower and sparser, deliberately
    // uneasy (the DS4 is the theme's one "off" color note).
    violet: {
      tempo: 116,
      lead:    [NOTE.D4, NOTE.F4, NOTE.A4, NOTE.F4,  NOTE.D4, NOTE.DS4, NOTE.D4, null,
                NOTE.C4, NOTE.D4, NOTE.F4, NOTE.D4,  NOTE.C4, NOTE.A3, NOTE.C4, null],
      harmony: [null, null, NOTE.A3, null,  null, null, null, null,
                null, null, NOTE.F3, null,  null, null, null, null],
      bass:    [NOTE.D2, null, NOTE.D2, null,  NOTE.C2, null, NOTE.C2, null,
                NOTE.D2, null, NOTE.D2, null,  NOTE.A1, null, NOTE.A1, null]
    },
    // Ping — E major pentatonic, fast and bright, high register.
    cyan: {
      tempo: 168,
      lead:    [NOTE.E5, NOTE.FS5, NOTE.GS5, NOTE.B4,  NOTE.E5, NOTE.FS5, NOTE.GS5, null,
                NOTE.B4, NOTE.GS5, NOTE.FS5, NOTE.E5,  NOTE.B4, NOTE.GS5, NOTE.E5, null],
      harmony: [null, NOTE.B4, null, null,  null, NOTE.B4, null, null,
                null, null, NOTE.B4, null,  null, null, NOTE.B4, null],
      bass:    [NOTE.E2, null, NOTE.B2, null,  NOTE.E2, null, NOTE.B2, null,
                NOTE.FS2, null, NOTE.B2, null,  NOTE.E2, null, NOTE.B2, null]
    },
    // Byte — F major pentatonic, playful and syncopated (rests land on
    // strong beats instead of weak ones, unlike the other four themes).
    rose: {
      tempo: 152,
      lead:    [null, NOTE.F4, NOTE.G4, null,  NOTE.A4, null, NOTE.F4, NOTE.G4,
                null, NOTE.A4, NOTE.C5, null,  NOTE.D5, null, NOTE.C5, NOTE.A4],
      harmony: [NOTE.F3, null, null, NOTE.F3,  null, null, NOTE.F3, null,
                null, NOTE.F3, null, null,  NOTE.F3, null, null, null],
      bass:    [NOTE.F2, null, null, NOTE.F2,  null, NOTE.C3, null, null,
                NOTE.F2, null, null, NOTE.F2,  null, NOTE.C3, null, null]
    }
  };
  const DEFAULT_THEME_KEY = 'mint';

  let activeThemeKey = DEFAULT_THEME_KEY;
  let activeTheme = THEMES[DEFAULT_THEME_KEY];
  let STEP = 60 / activeTheme.tempo / 2; // one eighth-note, in seconds

  let ctx = null, masterGain = null;
  let started = false, enabled = true;
  let schedulerId = null, stepIndex = 0, nextStepTime = 0;
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
    const t = activeTheme;
    const lead = t.lead[i % t.lead.length];
    const harmony = t.harmony[i % t.harmony.length];
    const bass = t.bass[i % t.bass.length];
    if(lead) playTone(lead, time, STEP * 0.92, 'square', 0.05);
    if(harmony) playTone(harmony, time, STEP * 0.9, 'square', 0.025);
    if(bass) playTone(bass, time, STEP * 1.9, 'triangle', 0.09);
    if(i % 2 === 1) playHat(time);
  }

  // Standard Web Audio "look-ahead" scheduler (setInterval polls slightly
  // ahead of real time and schedules exact-timed notes via the audio
  // clock, ctx.currentTime — a plain setTimeout-per-note drifts badly
  // over a multi-minute loop because JS timer delays aren't sample-
  // accurate; the audio graph's own clock is). Reads `STEP`/`activeTheme`
  // fresh every tick (not captured at start()), so setTheme() below can
  // change either mid-playback and have it take effect on the very next
  // scheduled step, no restart needed.
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

  // Called from applySignalEverywhere() in app.js — the one place a
  // Signal Color change (title screen swatch, or loaded from storage on
  // page load) already fans out to every other themed piece of UI. Not
  // exposed as "pick a theme directly" on purpose: the theme always
  // follows the character/Signal Color choice, there's no separate music
  // picker to keep in sync.
  function setTheme(signalKey){
    const theme = THEMES[signalKey] || THEMES[DEFAULT_THEME_KEY];
    if(theme === activeTheme) return;
    activeTheme = theme;
    activeThemeKey = THEMES[signalKey] ? signalKey : DEFAULT_THEME_KEY;
    STEP = 60 / activeTheme.tempo / 2;
  }

  function getThemeKey(){ return activeThemeKey; }

  enabled = getStoredEnabled();
  volume = getStoredVolume();

  return { start, setEnabled, isEnabled, setVolume, getVolume, setTheme, getThemeKey };
})();
