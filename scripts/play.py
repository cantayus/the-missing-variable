# Dev helper: open the game, run a few steps, take screenshots. usage: python3 scripts/play.py "<url>" out.png [wait_ms] [js to run before the shot]
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shot import serve
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]; wait = int(sys.argv[3]) if len(sys.argv) > 3 else 3000; js = sys.argv[4] if len(sys.argv) > 4 else None
s = serve(8766)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1440, 'height': 810}); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None); pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
    pg.goto('http://127.0.0.1:8766/' + url); pg.wait_for_timeout(wait)
    if js: print('js:', pg.evaluate(js)); pg.wait_for_timeout(900)
    pg.screenshot(path=out); print('errors:', errs[:6]); b.close()
s.shutdown()
