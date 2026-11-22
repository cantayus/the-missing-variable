// Drives every instrument without a browser: set up each round, draw it, let Folio demonstrate, and check the goal is met.
import test from 'node:test';
import assert from 'node:assert/strict';
import { stubDom } from './stub.mjs';
const canvas = stubDom();
const { Board } = await import('../dist/js/instruments/board.js');
const { makeCtx } = await import('../dist/js/instruments/frame.js').catch(() => ({}));
const { ALL } = await import('../dist/js/instruments/index.js');
const { CASE } = await import('../dist/js/sim/case-data.js');
const { RNG, hash } = await import('../dist/js/core/rng.js');
const ctxFor = (def, round, extra = {}) => ({ seed: 1, rng: (tag = '') => new RNG(hash(def.id + ':' + tag + ':' + (extra.example || 0))), sample: extra.sample || [], bias: 0, caseData: CASE, variant: extra.variant || null, example: extra.example || 0, round, mode: 'session' });
const words = (s) => s.trim().split(/\s+/).length;
for (const def of ALL) {
  test(def.id + ' ' + def.name, () => {
    assert.ok(def.limit && def.formula && def.teach?.length === 3, 'limit, formula and three teaching steps');
    for (const round of ['play', 'twist', 'case']) {
      assert.ok(def.rounds[round]?.brief, 'brief for ' + round); assert.ok(words(def.rounds[round].brief) <= 40, `${round} brief is ${words(def.rounds[round].brief)} words`);
      assert.ok(def.hints?.[round]?.length >= 2, 'two hints for ' + round);
      const ctx = ctxFor(def, round), s = def.init(round, ctx), b = new Board(canvas); b.resize();
      structuredClone(s);
      def.draw(b, s, ctx); const m0 = def.meter(s, ctx); assert.equal(typeof m0.text, 'string'); assert.ok(!m0.met, `${round} starts unsolved (${m0.text})`);
      def.controls?.(s, ctx);
      for (const h of b.handles.slice(0, 40)) { if (def.click) def.click(s, h.x, h.y, h.id, ctx); if (def.drag && !h.zone) { def.down?.(s, h.id, h.x, h.y, ctx); def.drag(s, h.id, h.x + 0.01, h.y + 0.01, ctx); def.up?.(s, h.id, h.x, h.y, ctx, true); } def.draw(b, s, ctx); def.meter(s, ctx); }
      if (def.tick) for (let i = 0; i < 30; i++) def.tick(s, 0.05, ctx);
      const s2 = def.init(round, ctx); def.demo(s2, ctx); def.draw(b, s2, ctx); const m = def.meter(s2, ctx); assert.ok(m.met, `${round}: demonstration reaches the goal (${m.text})`);
      structuredClone(s2);
    }
    for (const v of def.variants || []) { const ctx = ctxFor(def, 'play', { variant: v.id }), s = def.init('play', ctx), b = new Board(canvas); b.resize(); def.draw(b, s, ctx); def.meter(s, ctx); def.demo(s, ctx); def.draw(b, s, ctx); }
    for (const ex of [1, 3, 5]) { const ctx = ctxFor(def, 'play', { example: ex }), s = def.init('play', ctx), b = new Board(canvas); b.resize(); def.draw(b, s, ctx); }
  });
}
