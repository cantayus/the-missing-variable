// Sound made in the browser: a slow pad for each season, a few soft effects, and a tone that follows the meter.
// Nothing is recorded and nothing is downloaded. It starts only after the first tap or key.
import { bus } from '../core/util.js';
let ac = null, master, musicG, sfxG, ambG, bossG, vol = { music: 0.6, amb: 0.5, sfx: 0.6 }, patch = 'fall', meterOsc = null, meterG = null, started = false, bossOn = false, bossTension = 0, bossTimer = 0, bossBar = 0;
export const SCALES = { fall: [220, 261.63, 293.66, 329.63, 392, 440], winter: [196, 233.08, 261.63, 293.66, 349.23, 392], spring: [233.08, 293.66, 349.23, 392, 440, 523.25], summer: [246.94, 311.13, 369.99, 415.3, 466.16, 554.37], home: [174.61, 220, 261.63, 293.66, 349.23, 440], table: [261.63, 293.66, 329.63, 392, 440, 523.25], night: [146.83, 174.61, 220, 261.63, 293.66, 349.23] };
export const PATCH_NAMES = { fall: 'Fall: leaves on the mill race', winter: 'Winter: the long reading room', spring: 'Spring: the junction at six', summer: 'Summer: the children’s room', home: 'Home: above the bindery', table: 'The glass table', night: 'The night flight' };
export function initAudio() {
  if (started) return; started = true;
  try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch { ac = null; return; }
  master = ac.createGain(); master.gain.value = 0.9; master.connect(ac.destination);
  const conv = ac.createConvolver(), len = Math.floor(ac.sampleRate * 2.4), buf = ac.createBuffer(2, len, ac.sampleRate); for (let c = 0; c < 2; c++) { const d = buf.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); } conv.buffer = buf; conv.connect(master);
  musicG = ac.createGain(); musicG.connect(master); const send = ac.createGain(); send.gain.value = 0.5; musicG.connect(send); send.connect(conv);
  sfxG = ac.createGain(); sfxG.connect(master); ambG = ac.createGain(); ambG.connect(master);
  bossG = ac.createGain(); bossG.connect(musicG);
  setVolumes(vol); loop(); ambience();
}
export function setVolumes(v) { vol = { ...vol, ...v }; if (!ac) return; musicG.gain.value = vol.music * 0.5; sfxG.gain.value = vol.sfx * 0.6; ambG.gain.value = vol.amb * 0.25; }
export function setPatch(name) { patch = SCALES[name] ? name : 'fall'; }
export const patchNow = () => patch;
function note(freq, t, dur, g = 0.12, type = 'sine', dest = musicG) { const o = ac.createOscillator(), a = ac.createGain(); o.type = type; o.frequency.value = freq; a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(g, t + dur * 0.3); a.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(a); a.connect(dest); o.start(t); o.stop(t + dur + 0.05); }
function loop() { // a slow, sparse figure that never quite repeats
  if (!ac) return; if (bossOn) { setTimeout(loop, 2500); return; } const sc = SCALES[patch], t = ac.currentTime + 0.05, r = Math.random;
  const root = sc[Math.floor(r() * 3)]; note(root / 2, t, 7, 0.1, 'sine'); note((root / 2) * 1.5, t + 0.4, 6.5, 0.05, 'triangle');
  const n = 2 + Math.floor(r() * 3); for (let i = 0; i < n; i++) note(sc[Math.floor(r() * sc.length)] * (r() < 0.25 ? 2 : 1), t + 0.8 + i * (0.9 + r() * 1.2), 2.6 + r() * 2, 0.045, r() < 0.5 ? 'sine' : 'triangle');
  setTimeout(loop, 5200 + r() * 2600);
}
function ambience() { // soft wind: filtered noise that swells slowly
  const len = ac.sampleRate * 4, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0); let last = 0; for (let i = 0; i < len; i++) { last = last * 0.985 + (Math.random() * 2 - 1) * 0.015; d[i] = last * 6; }
  const src = ac.createBufferSource(); src.buffer = buf; src.loop = true; const f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 500; f.Q.value = 0.6; const g = ac.createGain(); g.gain.value = 0.5; src.connect(f); f.connect(g); g.connect(ambG); src.start();
  const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 0.35; lfo.connect(lg); lg.connect(g.gain); lfo.start();
}
// ---- professors: an entrance, a theme to argue over, and a flourish when one is won over ----
// Everything here is written for this game: a short-short-long figure on D, a tritone to raise the hair, and a low
// pattern in D minor that quickens as the professor runs out of certainties.
const D2 = 73.42, F2 = 87.31, G2 = 98, A2 = 110, Bb2 = 116.54, D3 = 146.83, F3 = 174.61, Ab3 = 207.65, A3 = 220, Bb3 = 233.08, D4 = 293.66, F4 = 349.23, Fs4 = 369.99, A4 = 440, Ab4 = 415.3, D5 = 587.33;
function brass(freq, t, dur, g = 0.07, dest = bossG) { const o = ac.createOscillator(), o2 = ac.createOscillator(), f = ac.createBiquadFilter(), a = ac.createGain(); o.type = o2.type = 'sawtooth'; o.frequency.value = freq; o2.frequency.value = freq * 1.006; f.type = 'lowpass'; f.Q.value = 0.8; f.frequency.setValueAtTime(260, t); f.frequency.linearRampToValueAtTime(1700, t + Math.min(0.1, dur * 0.3)); f.frequency.exponentialRampToValueAtTime(420, t + dur); a.gain.setValueAtTime(0, t); a.gain.linearRampToValueAtTime(g, t + 0.03); a.gain.setValueAtTime(g, t + dur * 0.55); a.gain.exponentialRampToValueAtTime(0.0001, t + dur); o.connect(f); o2.connect(f); f.connect(a); a.connect(dest); o.start(t); o2.start(t); o.stop(t + dur + 0.05); o2.stop(t + dur + 0.05); }
function drum(t, g = 0.4, dest = bossG) { const o = ac.createOscillator(), a = ac.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.28); a.gain.setValueAtTime(g, t); a.gain.exponentialRampToValueAtTime(0.0001, t + 0.8); o.connect(a); a.connect(dest); o.start(t); o.stop(t + 0.85); }
function strings(freq, t, dur, g = 0.03, swell = true, dest = bossG) { const o = ac.createOscillator(), f = ac.createBiquadFilter(), a = ac.createGain(), l = ac.createOscillator(), lg = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = freq; f.type = 'lowpass'; f.frequency.value = 1500; l.frequency.value = 11; lg.gain.value = g * 0.45; a.gain.setValueAtTime(0.0001, t); if (swell) a.gain.exponentialRampToValueAtTime(g, t + dur * 0.85); else { a.gain.linearRampToValueAtTime(g, t + 0.3); a.gain.setValueAtTime(g, t + dur * 0.7); } a.gain.exponentialRampToValueAtTime(0.0001, t + dur); l.connect(lg); lg.connect(a.gain); o.connect(f); f.connect(a); a.connect(dest); o.start(t); l.start(t); o.stop(t + dur + 0.05); l.stop(t + dur + 0.05); }
function entrance(t, big) {
  const k = big ? 1.25 : 1;
  [0, 0.38].forEach((d) => { drum(t + d, 0.4 * k); brass(D2, t + d, 0.3, 0.08 * k); brass(D3, t + d, 0.3, 0.05 * k); });
  drum(t + 0.76, 0.55 * k); brass(F2, t + 0.76, 0.55, 0.09 * k); brass(F3, t + 0.76, 0.55, 0.06 * k); brass(A3, t + 0.76, 0.55, 0.04 * k);
  strings(Ab4, t + 1.3, 1.25, 0.035 * k); strings(D5, t + 1.3, 1.25, 0.03 * k); brass(Ab3, t + 1.5, 0.5, 0.06 * k); brass(Ab3 / 2, t + 1.5, 0.5, 0.07 * k);
  let end = t + 2.15;
  if (big) { [A3, Ab3, F3].forEach((f, i) => { brass(f, end + i * 0.34, 0.36, 0.07); brass(f / 2, end + i * 0.34, 0.36, 0.07); drum(end + i * 0.34, 0.3); }); end += 1.1; note(D2 / 2, end, 4, 0.16, 'sine', bossG); }
  drum(end, 0.6 * k); [D2, D3, F3, A3, D4].forEach((f) => brass(f, end, 1.9, 0.055 * k)); strings(D5, end, 1.9, 0.02, false);
  return end - t + 2;
}
function bars() { // two bars of the theme, then call again
  if (!ac || !bossOn) return; const beat = 0.3 - 0.07 * bossTension, t = ac.currentTime + 0.06, A = [D2, D2, A2, D2, F2, D2, A2, G2], B = [D2, D2, Bb2, D2, A2, D2, G2, F2];
  [...A, ...B].forEach((f, i) => { const at = t + i * beat; note(f, at, beat * 0.9, 0.1, 'triangle', bossG); if (bossTension > 0.5) note(f * 2, at + beat / 2, beat * 0.45, 0.035, 'triangle', bossG); if (i % 4 === 0) drum(at, i % 8 === 0 ? 0.24 : 0.14); });
  strings(D4, t, beat * 16, 0.016, false); strings(F4, t, beat * 16, 0.014, false);
  if (bossBar % 2 === 1) [A3, Bb3, A3, F3].forEach((f, i) => brass(f, t + (8 + i * 2) * beat, beat * 1.8, 0.035));
  bossBar++; bossTimer = setTimeout(bars, beat * 16 * 1000 - 40);
}
// Start or stop the theme. tension runs from 0 (the professor is sure) to 1 (one certainty left).
export function bossMusic(on, tension = 0) {
  bossTension = Math.max(0, Math.min(1, tension)); if (!ac) { bossOn = false; return; }
  if (on && !bossOn) { bossOn = true; bossBar = 0; bossG.gain.cancelScheduledValues(ac.currentTime); bossG.gain.setValueAtTime(1, ac.currentTime); clearTimeout(bossTimer); bossTimer = setTimeout(bars, 50); }
  else if (!on && bossOn) { bossOn = false; clearTimeout(bossTimer); bossG.gain.cancelScheduledValues(ac.currentTime); bossG.gain.setValueAtTime(bossG.gain.value, ac.currentTime); bossG.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.7); }
}
// One-off moments: 'enter', 'final' (the last professor's longer entrance), 'hit', 'miss', 'won'. Returns the length in seconds.
export function bossSound(kind) {
  if (!ac || vol.music <= 0) return 0; const t = ac.currentTime + 0.03;
  if (!bossOn) { bossG.gain.cancelScheduledValues(ac.currentTime); bossG.gain.setValueAtTime(1, ac.currentTime); }
  if (kind === 'enter' || kind === 'final') return entrance(t, kind === 'final');
  if (kind === 'hit') { drum(t, 0.3); brass(A3, t, 0.16, 0.05); brass(D4, t + 0.13, 0.4, 0.06); return 0.6; }
  if (kind === 'miss') { brass(Bb2, t, 0.3, 0.07); brass(A2, t + 0.26, 0.6, 0.08); drum(t + 0.26, 0.2); return 0.9; }
  if (kind === 'won') { [D4, Fs4, A4, D5].forEach((f, i) => brass(f, t + i * 0.14, 0.3, 0.06)); drum(t + 0.6, 0.45); [D3, A3, D4, Fs4, A4, D5].forEach((f) => brass(f, t + 0.6, 2.2, 0.045)); return 3; }
  return 0;
}
// For checking without ears: render one of the moments off-line and report how loud it is.
export async function probe(kind, seconds = 6) {
  const keep = { ac, bossG, musicG, vol, bossOn, bossTension }, off = new OfflineAudioContext(1, Math.floor(44100 * seconds), 44100);
  ac = off; bossG = off.createGain(); bossG.connect(off.destination); musicG = bossG; vol = { ...vol, music: 0.6 };
  try { if (kind === 'theme') { bossOn = true; bossTension = 0.6; bars(); clearTimeout(bossTimer); bossOn = false; } else bossSound(kind); } finally { ({ ac, bossG, musicG, vol, bossOn, bossTension } = keep); }
  const d = (await off.startRendering()).getChannelData(0); let peak = 0, sq = 0, last = 0; for (let i = 0; i < d.length; i++) { const v = Math.abs(d[i]); if (v > peak) peak = v; sq += v * v; if (v > 0.002) last = i; }
  return { peak: +peak.toFixed(3), rms: +Math.sqrt(sq / d.length).toFixed(4), seconds: +(last / 44100).toFixed(2) };
}
export function sfx(name) {
  if (!ac || vol.sfx <= 0) return; const t = ac.currentTime + 0.01;
  if (name === 'tap') note(660, t, 0.12, 0.08, 'sine', sfxG);
  else if (name === 'page') { note(900, t, 0.06, 0.04, 'triangle', sfxG); note(1200, t + 0.05, 0.08, 0.03, 'triangle', sfxG); }
  else if (name === 'met') [523.25, 659.25, 783.99].forEach((f, i) => note(f, t + i * 0.11, 0.9, 0.09, 'sine', sfxG));
  else if (name === 'file') [392, 523.25, 659.25, 880].forEach((f, i) => note(f, t + i * 0.09, 1.2, 0.07, 'triangle', sfxG));
  else if (name === 'find') [880, 1174.66].forEach((f, i) => note(f, t + i * 0.08, 0.6, 0.06, 'sine', sfxG));
  else if (name === 'bell') { note(196, t, 3, 0.1, 'sine', sfxG); note(392, t, 2.2, 0.05, 'sine', sfxG); }
}
// the meter is heard: a quiet tone that rises as the goal comes closer
let wasMet = false;
bus.on('meter', ({ frac, met, id }) => {
  if (!ac) return;
  if (!id) { if (meterG) meterG.gain.linearRampToValueAtTime(0, ac.currentTime + 0.4); wasMet = false; return; }
  if (met && !wasMet) sfx('met'); wasMet = met;
  if (vol.music <= 0) return;
  if (!meterOsc) { meterOsc = ac.createOscillator(); meterOsc.type = 'sine'; meterG = ac.createGain(); meterG.gain.value = 0; meterOsc.connect(meterG); meterG.connect(musicG); meterOsc.start(); }
  const f = 196 * Math.pow(2, Math.max(0, Math.min(1, frac))); meterOsc.frequency.linearRampToValueAtTime(f, ac.currentTime + 0.15); meterG.gain.linearRampToValueAtTime(met ? 0.05 : 0.025, ac.currentTime + 0.15);
});
