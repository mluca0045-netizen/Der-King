// Rendert die Animation Bild für Bild (deterministisch über window.seek) in build/frames/.
// Aufruf: node render/render.js [--workers 3] [--fps 30] [--from 0] [--to <sek>] [--quality 92]
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const args = Object.fromEntries(process.argv.slice(2).reduce((a, v, i, arr) => {
  if (v.startsWith('--')) a.push([v.slice(2), arr[i + 1]]);
  return a;
}, []));
const WORKERS = parseInt(args.workers || '3', 10);
const FPS = parseInt(args.fps || '30', 10);
const QUALITY = parseInt(args.quality || '92', 10);
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'build', 'frames');
const URL = 'file://' + path.join(ROOT, 'anim', 'index.html');

async function openPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGEERROR', e.message));
  await page.goto(URL);
  await page.waitForFunction(() => window.READY || window.ERROR, null, { timeout: 180000 });
  const err = await page.evaluate(() => window.ERROR);
  if (err) throw new Error(err);
  return page;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const launch = () => chromium.launch({ args: ['--force-color-profile=srgb', '--disable-gpu', '--allow-file-access-from-files', '--font-render-hinting=none'] });
  const b0 = await launch();
  const p0 = await openPage(b0);
  const total = await p0.evaluate(() => window.TOTAL);
  const sfx = await p0.evaluate(() => window.SFX_EVENTS);
  fs.writeFileSync(path.join(ROOT, 'build', 'sfx.json'), JSON.stringify(sfx));
  await b0.close();

  const from = Math.round(parseFloat(args.from || '0') * FPS);
  const to = Math.min(Math.ceil(total * FPS), args.to ? Math.round(parseFloat(args.to) * FPS) : Infinity);
  const n = to - from;
  console.log(`Dauer ${total.toFixed(2)} s · Bilder ${from}..${to - 1} (${n}) · ${WORKERS} Prozesse · ${sfx.length} Toneffekte`);
  const t0 = Date.now();
  let done = 0;
  const chunk = Math.ceil(n / WORKERS);
  await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
    const a = from + w * chunk, b = Math.min(to, a + chunk);
    if (a >= b) return;
    const br = await launch();
    const pg = await openPage(br);
    for (let f = a; f < b; f++) {
      await pg.evaluate(t => window.seek(t), f / FPS);
      await pg.screenshot({ path: path.join(OUT, `f_${String(f).padStart(6, '0')}.jpg`), type: 'jpeg', quality: QUALITY });
      done++;
      if (done % 300 === 0) {
        const el = (Date.now() - t0) / 1000;
        console.log(`${done}/${n} Bilder · ${(done / el).toFixed(1)} fps · Rest ~${((n - done) / (done / el) / 60).toFixed(1)} min`);
      }
    }
    await br.close();
  }));
  console.log(`fertig in ${((Date.now() - t0) / 60000).toFixed(1)} min`);
})().catch(e => { console.error(e); process.exit(1); });
