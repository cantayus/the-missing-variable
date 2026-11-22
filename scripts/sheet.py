# Dev helper: contact sheet of dioramas. usage: python3 scripts/sheet.py out.png season hour place1 place2 ...
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shot import serve
from playwright.sync_api import sync_playwright
from PIL import Image
out, season, hour, places = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4:]
s = serve(8766); shots = []
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 800, 'height': 500})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    for pl in places:
        errs.clear()
        ps = pl.split(':'); se = ps[1] if len(ps) > 1 else season; hr = ps[2] if len(ps) > 2 else hour; pl = ps[0]
        pg.goto(f'http://127.0.0.1:8766/gallery.html?place={pl}&season={se}&hour={hr}&gfx=2')
        pg.wait_for_timeout(2600)
        f = f'/tmp/sheet_{pl}.png'; pg.screenshot(path=f); shots.append(f)
        if errs: print(pl, 'ERR', errs[:3])
    b.close()
s.shutdown()
cols = 3; rows = (len(shots) + cols - 1) // cols; tw, th = 426, 266
sheet = Image.new('RGB', (cols * tw, rows * th), 'white')
for i, f in enumerate(shots):
    im = Image.open(f).convert('RGB').resize((tw, th)); sheet.paste(im, ((i % cols) * tw, (i // cols) * th))
sheet.save(out); print('ok', len(shots))
