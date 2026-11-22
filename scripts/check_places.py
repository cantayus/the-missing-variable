# Dev helper: load every diorama in every season and report console errors, counts, and any tree left standing on a line.
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from shot import serve
from playwright.sync_api import sync_playwright
s = serve(8767)
seasons = sys.argv[1].split(',') if len(sys.argv) > 1 else ['fall', 'winter', 'spring', 'summer']
with sync_playwright() as p:
    b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
    pg = b.new_page(viewport={'width': 640, 'height': 400})
    errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None)
    pg.goto('http://127.0.0.1:8767/gallery.html?place=deckle&gfx=1'); pg.wait_for_timeout(800)
    places = pg.evaluate("Array.from(document.querySelectorAll('#gal a')).map(a => a.textContent)")
    bad = 0
    for pl in places:
        for se in seasons:
            errs.clear()
            pg.goto(f'http://127.0.0.1:8767/gallery.html?place={pl}&season={se}&gfx=1')
            pg.wait_for_timeout(450)
            info = pg.evaluate("window.__kit ? [window.__kit.npcs.length, window.__kit.fauna.length, window.__kit.g.children.length, window.__kit.tracks.length, window.__kit.treeSpots.filter(t => t.own && window.__kit.inWay(t.own)).length] : null")
            if errs or not info: bad += 1; print(pl, se, 'ERR', errs[:2])
            elif info[4]: bad += 1; print(pl, se, 'TREES ON A LINE', info[4])   # nothing may grow on a railway or in the way of a tram
            elif se == seasons[0]: print(pl, 'npcs', info[0], 'fauna', info[1], 'objects', info[2], 'lines', info[3])
    print('places', len(places), 'bad', bad)
    b.close()
s.shutdown()
