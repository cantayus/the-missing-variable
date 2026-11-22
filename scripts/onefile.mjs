// Pack the whole game into one HTML file that opens with a double click. usage: node scripts/onefile.mjs [out.html]
// Needs esbuild once: (cd tools && npm install esbuild)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), dist = path.join(root, 'dist'), out = process.argv[2] || path.join(root, 'build', 'The-Missing-Variable.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
const tmp = path.join(root, 'build', 'bundle.js');
execFileSync(path.join(root, 'tools', 'node_modules', '.bin', 'esbuild'), [path.join(dist, 'js', 'main.js'), '--bundle', '--format=esm', '--minify-whitespace', '--charset=utf8', '--alias:three=' + path.join(dist, 'vendor', 'three.module.min.js'), '--outfile=' + tmp, '--log-level=warning'], { stdio: 'inherit' });
let css = fs.readFileSync(path.join(dist, 'css', 'app.css'), 'utf8');
css = css.replace(/url\('\.\.\/fonts\/([^']+)'\)/g, (_, f) => `url('data:font/woff2;base64,${fs.readFileSync(path.join(dist, 'fonts', f)).toString('base64')}')`);
let js = fs.readFileSync(tmp, 'utf8').replace(/<\/script/gi, '<\\/script');
// pictures named in the code as 'img/...' are packed in as well
const imgDir = path.join(dist, 'img');
if (fs.existsSync(imgDir)) for (const f of fs.readdirSync(imgDir)) { const type = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml' }[path.extname(f).toLowerCase()]; if (!type) continue; const uri = `data:${type};base64,${fs.readFileSync(path.join(imgDir, f)).toString('base64')}`; js = js.split(`"img/${f}"`).join(`"${uri}"`).split(`'img/${f}'`).join(`'${uri}'`); }
let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
html = html.replace('<link rel="stylesheet" href="css/app.css">', () => '<style>\n' + css + '\n</style>').replace(/<script type="importmap">.*?<\/script>\n?/, '').replace('<script type="module" src="js/main.js"></script>', () => '<script type="module">\n' + js + '\n</script>');
const notice = '<!--\n  The Missing Variable, packed into one file.\n  Bundled: three.js (MIT licence); Atkinson Hyperlegible, DM Mono and Caveat (SIL Open Font Licence);\n  Lewis Carroll, "Alice\'s Adventures in Wonderland", 1865 (public domain).\n-->\n';
html = html.replace('<!doctype html>\n', '<!doctype html>\n' + notice);
fs.writeFileSync(out, html); fs.rmSync(tmp);
console.log(out, (fs.statSync(out).size / 1e6).toFixed(2) + ' MB');
