# Dev helper: open instruments in the workbench, one screenshot per round, before and after Folio's demonstration.
# usage: python3 scripts/tour.py outdir [solved] ID ID ...
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shot import serve
from playwright.sync_api import sync_playwright
from PIL import Image
out = sys.argv[1]; ids = sys.argv[2:]; solved = False
if ids and ids[0] == 'solved': solved = True; ids = ids[1:]
os.makedirs(out, exist_ok=True); s = serve(8766)
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}); pg.set_default_timeout(4000); errs = []
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None); pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
    for i in ids:
        errs.clear(); shots = []
        pg.goto(f'http://127.0.0.1:8766/index.html?gfx=0&unlock&open={i}'); pg.wait_for_timeout(1500)
        for k in range(3):
            pg.evaluate("k => { const t = document.querySelectorAll('.table .rounds span'); if (t[k]) t[k].click(); }", k); pg.wait_for_timeout(400)
            if solved:
                [pg.evaluate("() => { const b = [...document.querySelectorAll('.table button')].find((x) => /ask folio/i.test(x.textContent)); if (b) b.click(); }") for _ in range(3)]; pg.wait_for_timeout(500)
            f = f'{out}/{i}_{k}.png'; pg.screenshot(path=f); shots.append(f)
        sheet = Image.new('RGB', (1280, 720 * 3 // 2 + 0), 'white')
        ims = [Image.open(f).convert('RGB') for f in shots]
        sheet = Image.new('RGB', (1280 * 3 // 2, 720 // 2 * 3 // 1 // 1), 'white')
        w, h = 640, 360; sheet = Image.new('RGB', (w * 3, h), 'white')
        for k, im in enumerate(ims): sheet.paste(im.resize((w, h)), (k * w, 0))
        sheet.save(f'{out}/{i}.png')
        print(i, 'errors:', errs[:4])
    b.close()
s.shutdown()
