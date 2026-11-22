# Dev helper: print page errors with stacks. usage: python3 scripts/err.py "gallery.html?place=apple&season=fall"
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shot import serve
from playwright.sync_api import sync_playwright
s = serve(8768)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 640, 'height': 400})
    pg.on('pageerror', lambda e: print('PAGEERROR', e.message, '\n', (e.stack or '')[:900]))
    pg.on('console', lambda m: print('CONSOLE', m.text[:300]) if m.type == 'error' else None)
    pg.goto('http://127.0.0.1:8768/' + sys.argv[1]); pg.wait_for_timeout(int(sys.argv[2]) if len(sys.argv) > 2 else 1500)
    b.close()
s.shutdown()
