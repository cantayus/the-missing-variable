# Dev helper: sit in on a session and click through it the way a player who always asks Folio would.
# usage: python3 scripts/walk.py [fast] I-1 IV-15 ...   (fast: no 3D view, so the place is shown as a list; several times quicker)
import sys, os, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shot import serve
from playwright.sync_api import sync_playwright
ids = sys.argv[1:]; fast = bool(ids) and ids[0] == 'fast'; ids = ids[1:] if fast else ids
s = serve(8766)
STEP = """() => {
  const vis = (e) => e && e.offsetParent !== null && !e.disabled;
  const top = [...document.querySelectorAll('.veil')].pop() || document.querySelector('.table') || document;
  const go = [...top.querySelectorAll('button.go')].find((x) => vis(x) && (!x.closest('.table') || /^(go on|to the table|on to |file the evidence|step outside|next|continue)/i.test(x.textContent.trim())));
  if (go) { const t = go.textContent.trim(); go.click(); return 'go: ' + t; }
  const folio = [...document.querySelectorAll('.table button')].find((x) => vis(x) && /ask folio/i.test(x.textContent));
  if (folio) { folio.click(); return 'folio'; }
  const any = [...top.querySelectorAll('button')].find((x) => vis(x) && !/close|undo|formula|put it back|fresh/i.test(x.textContent));
  if (any && top !== document) { const t = any.textContent.trim(); any.click(); return 'btn: ' + t; }
  return null; }"""
with sync_playwright() as p:
    b = p.chromium.launch(args=['--disable-gpu', '--disable-3d-apis'] if fast else ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    bad = 0
    for sid in ids:
        ctx = b.new_context(viewport={'width': 1280, 'height': 720}); pg = ctx.new_page(); errs = []
        pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None); pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
        pg.goto(f'http://127.0.0.1:8766/index.html?gfx=0&unlock&sit={sid}'); pg.wait_for_timeout(1500); trail = []
        for i in range(60):
            r = pg.evaluate(STEP)
            if r is None: break
            if not trail or trail[-1] != r: trail.append(r)
            pg.wait_for_timeout(220 if fast else 350)
        pg.wait_for_timeout(700); errs = [e for e in errs if 'WebGL' not in e]
        save = pg.evaluate("() => { for (const k of Object.keys(localStorage)) { try { const v = JSON.parse(localStorage[k]); if (v && v.done) return { done: Object.keys(v.done), cards: Object.keys(v.cards || v.evidence || {}).length }; } catch {} } return null; }")
        print(sid, 'steps:', ' > '.join(t[:28] for t in trail)[:600]); print('   save:', json.dumps(save)[:200], 'errors:', errs[:3]); ctx.close()
        if errs or not save or sid not in save.get('done', []): bad += 1
    print('sessions', len(ids), 'bad', bad)
    b.close()
s.shutdown()
