# Dev helper: serve dist/ and take screenshots with headless Chromium.
# usage: python3 scripts/shot.py out.png "gallery.html?place=deckle" [width height wait_ms]
import sys, threading, http.server, socketserver, functools, os
from playwright.sync_api import sync_playwright
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'dist')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a): pass
def serve(port=8765):
    h = functools.partial(Q, directory=root)
    socketserver.TCPServer.allow_reuse_address = True
    s = socketserver.TCPServer(('127.0.0.1', port), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s
if __name__ == '__main__':
    out, url = sys.argv[1], sys.argv[2]
    w = int(sys.argv[3]) if len(sys.argv) > 3 else 1280; h = int(sys.argv[4]) if len(sys.argv) > 4 else 720
    wait = int(sys.argv[5]) if len(sys.argv) > 5 else 2500
    s = serve()
    with sync_playwright() as p:
        b = p.chromium.launch(args=['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'])
        pg = b.new_page(viewport={'width': w, 'height': h})
        errs = []
        pg.on('console', lambda m: errs.append(m.text) if m.type in ('error',) else None)
        pg.on('pageerror', lambda e: errs.append('PAGEERROR ' + str(e)))
        pg.goto('http://127.0.0.1:8765/' + url)
        pg.wait_for_timeout(wait)
        pg.screenshot(path=out)
        print('errors:', errs[:8])
        b.close()
    s.shutdown()
