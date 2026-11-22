// Saves: one versioned key, with export to a file and import from one.
import { bus } from './util.js';

const KEY = 'the-missing-variable.save';
export const VERSION = 1;

export function fresh() {
  return {
    v: VERSION,
    seed: 20261121,
    name: '',
    started: false,
    place: 'deckle',
    part: 1,
    done: {},        // sessionId -> { solved, clean, taught, var: {variationId: true} }
    evidence: {},    // sessionId -> true
    entries: {},     // field guide id -> true
    eggs: {},        // egg id -> true
    notes: {},       // margin note id -> true
    carriage: {},    // carriage problem id -> true
    challenges: {},  // 1..4 -> result
    postcards: [],   // { place, when, img }
    wren: false,
    intro: {},       // one-off flags
    finale: null,
    samples: {},     // place -> observations the player counted there
    fauna: {},       // species -> how many noted
    talked: 0,
    settings: { music: 0.6, amb: 0.5, sfx: 0.6, text: 1, motion: true, gfx: 2, smooth: false, folioTalk: true, openAll: false },
  };
}

let mem = null;
function storage() { try { return window.localStorage; } catch { return null; } }

export function load() {
  if (mem) return mem;
  let s = null;
  try { const raw = storage()?.getItem(KEY); if (raw) s = JSON.parse(raw); } catch { s = null; }
  mem = migrate(s);
  return mem;
}
export function migrate(s) {
  const base = fresh();
  if (!s || typeof s !== 'object') return base;
  // older saves keep what they have; anything missing gets a default
  const out = { ...base, ...s, settings: { ...base.settings, ...(s.settings || {}) } };
  out.v = VERSION;
  return out;
}
let timer = null;
export function save(now = false) {
  if (!mem) return;
  const write = () => { try { storage()?.setItem(KEY, JSON.stringify(mem)); } catch { /* private mode: play on without saving */ } bus.emit('saved'); };
  if (now) { clearTimeout(timer); write(); return; }
  clearTimeout(timer); timer = setTimeout(write, 400);
}
export function reset() { mem = fresh(); save(true); return mem; }
export function exportFile() {
  const blob = new Blob([JSON.stringify(mem, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'the-missing-variable-save.json'; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
export async function importFile(file) {
  const text = await file.text();
  const s = JSON.parse(text);
  if (!s || typeof s !== 'object' || !('done' in s)) throw new Error('That file is not a save from this game.');
  mem = migrate(s); save(true); return mem;
}
export const S = () => load();
