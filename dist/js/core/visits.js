// Counting visits, if the host has switched it on in config.js. One anonymous count per visit.
import { CONFIG } from '../config.js';
const V = CONFIG.visits || {};
const optedOut = () => V.respectDoNotTrack !== false && (navigator.doNotTrack === '1' || window.doNotTrack === '1' || navigator.globalPrivacyControl === true);
export function countVisit() {
  if (!V.provider || optedOut() || location.hostname === 'localhost' || location.hostname === '127.0.0.1') return;
  const add = (src, attrs) => { const s = document.createElement('script'); s.async = true; s.src = src; for (const [k, v] of Object.entries(attrs || {})) s.setAttribute(k, v); document.head.append(s); };
  try {
    if (V.provider === 'beacon' && V.url) fetch(V.url, { method: 'POST', mode: 'cors', keepalive: true, credentials: 'omit', headers: { 'content-type': 'text/plain' }, body: JSON.stringify({ from: document.referrer ? new URL(document.referrer).hostname : '' }) }).catch(() => {});
    else if (V.provider === 'script' && V.src) add(V.src, V.attrs);
    else if (V.provider === 'goatcounter' && V.site) add('https://gc.zgo.at/count.js', { 'data-goatcounter': `https://${V.site}.goatcounter.com/count` });
  } catch { /* counting must never get in the way of the game */ }
}
