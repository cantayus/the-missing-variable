// A stand-in canvas so instruments can be drawn and driven without a browser.
export function stubDom() {
  const ctx2d = new Proxy({}, { get(t, k) { if (k === 'measureText') return (s) => ({ width: String(s).length * 6 }); if (k === 'createLinearGradient' || k === 'createRadialGradient') return () => ({ addColorStop() {} }); if (k === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) }); if (k === 'createImageData') return (w, h) => ({ data: new Uint8ClampedArray(w * h * 4), width: w, height: h }); if (k in t) return t[k]; return () => {}; }, set(t, k, v) { t[k] = v; return true; } });
  const canvas = { getContext: () => ctx2d, addEventListener() {}, setAttribute() {}, setPointerCapture() {}, style: {}, tabIndex: 0, width: 0, height: 0, getBoundingClientRect: () => ({ width: 900, height: 620, left: 0, top: 0 }) };
  globalThis.window = globalThis.window || { devicePixelRatio: 1 };
  globalThis.document = globalThis.document || { documentElement: {}, createElement: () => ({ getContext: () => ctx2d, width: 0, height: 0, style: {} }) };
  globalThis.getComputedStyle = () => ({ fontSize: '16px' });
  return canvas;
}
