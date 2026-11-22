# Dev helper: open a list of URLs and report console errors. usage: python3 scripts/smoke.py url url ...
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shot import serve
from playwright.sync_api import sync_playwright
s = serve(8766); bad = 0
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}); pg.set_default_timeout(8000); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None); pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
    for u in sys.argv[1:]:
        errs.clear()
        try: pg.goto('http://127.0.0.1:8766/' + u); pg.wait_for_timeout(1300)
        except Exception as e: errs.append('LOAD ' + str(e)[:100])
        txt = pg.evaluate("() => (document.querySelector('.sheet, .table, #tablet.open, #mapview, #fallback') || document.body).innerText.length")
        if errs: bad += 1
        print(('ERR ' if errs else 'ok  ') + u, txt, errs[:2] if errs else '')
    b.close()
s.shutdown(); print('bad', bad)
