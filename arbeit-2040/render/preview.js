// Vorschau einzelner Zeitpunkte: node render/preview.js <outdir> t1 t2 ...
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [outDir, ...times] = process.argv.slice(2);
  const b = await chromium.launch({ args: ['--force-color-profile=srgb', '--disable-gpu', '--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errs = [];
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  await p.goto('file://' + path.join(__dirname, '..', 'anim', 'index.html'));
  await p.waitForFunction(() => window.READY || window.ERROR, null, { timeout: 120000 });
  const err = await p.evaluate(() => window.ERROR);
  if (err) console.log('ERROR', err);
  console.log('TOTAL', await p.evaluate(() => window.TOTAL));
  for (const t of times) {
    await p.evaluate(t => window.seek(t), parseFloat(t));
    await p.screenshot({ path: path.join(outDir, `t_${String(t).padStart(6, '0')}.jpg`), type: 'jpeg', quality: 85 });
  }
  if (errs.length) console.log(errs.filter(e => !e.includes('ERR_FILE_NOT_FOUND')).slice(0, 20).join('\n'));
  await b.close();
})();
