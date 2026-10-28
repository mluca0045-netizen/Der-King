// Kapitel 1, Teil 2: Zamirs Dienstag – Meisterbetrieb für Solar und Wärmepumpen, KI-Brille vor Ort
function S01Z(tl, S) {
  const root = makeScene('scene2040z');
  const c = S.L('s1c'), d = S.L('s1d');
  sceneInOut(tl, root, S, { drift: false });

  // --- Baustelle im Morgenlicht (SVG) ---
  const world = box(root, 0, 0, 1920, 1080);
  gsap.set(world, { transformOrigin: '0 0' });
  const s = svg('svg', { viewBox: '0 0 1920 1080', width: 1920, height: 1080, class: 'abs', style: 'left:0;top:0' }, world);
  const defs = svg('defs', {}, s);
  const lin = (id, stops, x2 = 0, y2 = 1) => {
    const g = svg('linearGradient', { id, x1: 0, y1: 0, x2, y2 }, defs);
    for (const [o, col, op = 1] of stops) svg('stop', { offset: o, 'stop-color': col, 'stop-opacity': op }, g);
  };
  lin('zSky', [[0, '#0d1a4a'], [.45, '#3a3f8f'], [.72, '#c0628a'], [.86, '#ff9a6a'], [1, '#ffd08a']]);
  lin('zHill', [[0, '#2a2a66'], [1, '#161a3e']]);
  lin('zGround', [[0, '#1b2242'], [1, '#0a0e22']]);
  lin('zWall', [[0, '#2c3566'], [1, '#1d2347']]);
  lin('zRoof', [[0, '#141a3c'], [1, '#0d1230']]);
  lin('zPanel', [[0, '#1d3f9a'], [.5, '#152d74'], [1, '#0e1f52']]);
  lin('zGlint', [[0, '#ffffff', 0], [.5, '#ffe2b8', .55], [1, '#ffffff', 0]], 1, 0);
  lin('zVan', [[0, '#eef2ff'], [1, '#b9c3e6']]);
  const sg = svg('radialGradient', { id: 'zSun', cx: .5, cy: .5, r: .5 }, defs);
  [[0, '#fff3d0', 1], [.2, '#ffd58a', .9], [.5, '#ff9d5c', .4], [1, '#ff7a50', 0]].forEach(([o, col, op]) => svg('stop', { offset: o, 'stop-color': col, 'stop-opacity': op }, sg));

  svg('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: 'url(#zSky)' }, s);
  const sun = svg('g', {}, s);
  svg('circle', { cx: 0, cy: 0, r: 320, fill: 'url(#zSun)' }, sun);
  svg('circle', { cx: 0, cy: 0, r: 58, fill: '#fff1cf' }, sun);
  tl.fromTo(sun, { x: 1580, y: 820 }, { x: 1580, y: 690, duration: S.dur, ease: 'none' }, S.start);
  svg('path', { d: 'M0,770 C300,720 560,745 820,752 C1080,760 1300,715 1560,728 C1720,736 1840,724 1920,730 L1920,1080 L0,1080 Z', fill: 'url(#zHill)' }, s);
  const R = rng(11);
  const turbines = [];
  [[120, 760, .7], [260, 748, .55], [1760, 740, .6]].forEach(([tx, ty, sc]) => {
    const g = svg('g', { transform: `translate(${tx},${ty}) scale(${sc})` }, s);
    svg('path', { d: 'M-3,0 L-1.5,-150 L1.5,-150 L3,0 Z', fill: '#c9d3ff', opacity: .7 }, g);
    const rotor = svg('g', { transform: 'translate(0,-150)' }, g);
    for (let k = 0; k < 3; k++) svg('path', { d: 'M0,0 L-4,-8 L0,-92 L4,-8 Z', fill: '#e6ecff', opacity: .8, transform: `rotate(${k * 120})` }, rotor);
    turbines.push({ rotor, speed: 40 + R() * 20, ph: R() * 120 });
  });
  svg('rect', { x: 0, y: 880, width: 1920, height: 200, fill: 'url(#zGround)' }, s);
  svg('rect', { x: 0, y: 880, width: 1920, height: 2, fill: '#8fb6ff', opacity: .18 }, s);

  // Haus mit Solardach
  const house = svg('g', {}, s);
  svg('rect', { x: 370, y: 590, width: 760, height: 290, fill: 'url(#zWall)' }, house);
  svg('polygon', { points: '320,595 470,360 1030,360 1180,595', fill: 'url(#zRoof)' }, house);
  const panels = svg('g', {}, house);
  const rows = 3;
  for (let r = 0; r < rows; r++) {
    const y0 = 382 + r * 66, y1 = y0 + 58;
    const k0 = (y0 - 360) / 235, k1 = (y1 - 360) / 235;
    const xl0 = 470 - 150 * k0 + 40, xr0 = 1030 + 150 * k0 - 40;
    const xl1 = 470 - 150 * k1 + 40, xr1 = 1030 + 150 * k1 - 40;
    const n = 8;
    for (let i = 0; i < n; i++) {
      const a0 = xl0 + (xr0 - xl0) * i / n + 3, b0 = xl0 + (xr0 - xl0) * (i + 1) / n - 3;
      const a1 = xl1 + (xr1 - xl1) * i / n + 3, b1 = xl1 + (xr1 - xl1) * (i + 1) / n - 3;
      svg('polygon', { points: `${a0},${y0} ${b0},${y0} ${b1},${y1} ${a1},${y1}`, fill: 'url(#zPanel)', stroke: '#6f8fe0', 'stroke-opacity': .45, 'stroke-width': 1.2 }, panels);
    }
  }
  const glint = svg('rect', { x: -260, y: 360, width: 220, height: 240, fill: 'url(#zGlint)', opacity: .8 }, house);
  glint.setAttribute('clip-path', 'url(#zRoofClip)');
  const cp = svg('clipPath', { id: 'zRoofClip' }, defs);
  svg('polygon', { points: '320,595 470,360 1030,360 1180,595' }, cp);
  [[430, 660], [600, 660], [880, 660], [1030, 660]].forEach(([x, y], i) => {
    svg('rect', { x, y, width: 80, height: 90, rx: 6, fill: i === 1 ? '#ffd38a' : '#ffcf7a', opacity: i === 2 ? .35 : .8 }, house);
    svg('rect', { x: x + 38, y, width: 4, height: 90, fill: '#1d2347' }, house);
  });
  svg('rect', { x: 740, y: 720, width: 90, height: 160, rx: 6, fill: '#121735' }, house);
  // Wechselrichter mit Status-LED
  svg('rect', { x: 1052, y: 774, width: 62, height: 80, rx: 6, fill: '#cfd6f0' }, house);
  svg('rect', { x: 1060, y: 786, width: 46, height: 22, rx: 3, fill: '#1b2242' }, house);
  const led = svg('circle', { cx: 1083, cy: 832, r: 7, fill: '#ff5c7a' }, house);
  // Wärmepumpe mit Lüfter
  svg('rect', { x: 1180, y: 770, width: 150, height: 110, rx: 10, fill: '#d7ddf2' }, house);
  svg('circle', { cx: 1255, cy: 825, r: 40, fill: '#8f9bc4' }, house);
  const fan = svg('g', { transform: 'translate(1255,825)' }, house);
  for (let k = 0; k < 4; k++) svg('path', { d: 'M0,0 C10,-8 14,-30 2,-36 C-6,-30 -8,-12 0,0 Z', fill: '#2b3463', transform: `rotate(${k * 90})` }, fan);
  svg('circle', { cx: 0, cy: 0, r: 6, fill: '#eef2ff' }, fan);
  // Leiter
  const lad = svg('g', { opacity: .9 }, house);
  svg('line', { x1: 1140, y1: 880, x2: 1118, y2: 585, stroke: '#cfd6f0', 'stroke-width': 6 }, lad);
  svg('line', { x1: 1186, y1: 880, x2: 1164, y2: 585, stroke: '#cfd6f0', 'stroke-width': 6 }, lad);
  for (let k = 1; k < 10; k++) {
    const y = 880 - k * 30, dx = -22 * (k * 30 / 295);
    svg('line', { x1: 1140 + dx, y1: y, x2: 1186 + dx, y2: y, stroke: '#cfd6f0', 'stroke-width': 4 }, lad);
  }
  // Transporter des Betriebs
  const van = svg('g', { transform: 'translate(1380,690)' }, s);
  svg('path', { d: 'M0,40 Q0,10 30,10 L300,10 Q330,10 345,40 L392,110 Q404,128 404,150 L404,186 Q404,200 390,200 L14,200 Q0,200 0,186 Z', fill: 'url(#zVan)' }, van);
  svg('path', { d: 'M300,24 L338,28 L380,112 L300,112 Z', fill: '#1b2a5c', opacity: .9 }, van);
  svg('rect', { x: 0, y: 150, width: 404, height: 14, fill: '#ffb547' }, van);
  const logo = svg('g', {}, van);
  svg('path', { d: 'M40,62 L62,62 L50,84 L66,84 L36,120 L46,92 L32,92 Z', fill: '#ffb547' }, logo);
  const t1 = svg('text', { x: 80, y: 92, fill: '#1b2242', 'font-family': 'Inter Display', 'font-weight': 850, 'font-size': 40 }, logo);
  t1.textContent = 'ZAMIR';
  const t2 = svg('text', { x: 82, y: 122, fill: '#3a4680', 'font-family': 'JetBrains Mono', 'font-weight': 600, 'font-size': 17 }, logo);
  t2.textContent = 'ELEKTRO · MEISTERBETRIEB';
  for (const wx of [80, 320]) {
    svg('circle', { cx: wx, cy: 200, r: 34, fill: '#0b0f26' }, van);
    svg('circle', { cx: wx, cy: 200, r: 14, fill: '#8f9bc4' }, van);
  }

  FRAME.push(t => {
    if (t < S.start - .5 || t > S.end + .5) return;
    for (const tb of turbines) tb.rotor.setAttribute('transform', `translate(0,-150) rotate(${(tb.ph + t * tb.speed) % 360})`);
    fan.setAttribute('transform', `translate(1255,825) rotate(${(t * 420) % 360})`);
    const k = ((t - S.start) * .22) % 1.4;
    glint.setAttribute('x', (220 + k * 900).toFixed(1));
  });

  // --- Zamir-Profil ---
  const prof = box(root, 140, 150, 1000, 120, 'row', '', 'gap:26px;');
  prof.innerHTML = '<div style="width:104px;height:104px;border-radius:50%;background:linear-gradient(135deg,#ffb547,#ff6b6b);display:flex;align-items:center;justify-content:center;font:800 46px var(--display);color:#1a0f05;box-shadow:0 0 40px rgba(255,181,71,.5)">Z</div>' +
    '<div><div class="h-sm" style="font-size:52px;text-shadow:0 4px 30px rgba(0,0,0,.6)">Zamir, 32</div><div class="small" style="display:flex;align-items:center;gap:12px;margin-top:6px;text-shadow:0 2px 16px rgba(0,0,0,.8)">' +
    icon('zap', 32, '#ffb547', 2) + 'Elektro-Meisterbetrieb · Solar &amp; Wärmepumpen</div></div>';
  revealUp(tl, prof.children, c.start + .1, { stagger: .12 });
  sfx(c.start + .1, 'blip', .45);
  const tM = S.cue('s1c', ['meisterbetrieb']) - .2;
  const meta = box(root, 140, 300, 900, 50, 'row', '', 'gap:16px');
  meta.innerHTML = '<span class="chip amber" style="font-size:17px"><span class="dot"></span>eigener Betrieb</span><span class="chip amber" style="font-size:17px"><span class="dot"></span>2 Azubis</span>';
  revealUp(tl, meta.children, tM, { y: 10, stagger: .15 });
  tl.to(logo, { scale: 1.06, transformOrigin: '50% 50%', duration: .3, yoyo: true, repeat: 1 }, tM + .1);
  sfx(tM, 'pop', .45);
  // Kamerafahrt aufs Dach
  const tD = S.cue('s1c', ['dach']) - .6;
  tl.fromTo(world, { scale: 1, x: 0, y: 0 }, { scale: 1.12, x: -60, y: -40, duration: Math.max(1.5, d.start - tD - .2), ease: 'sine.inOut' }, tD);

  // --- KI-Brille: Blick auf den Wechselrichter ---
  const tB = S.cue('s1d', ['brille', 'ki']) - .45;
  // Zoom: Wechselrichtermitte (1083,814) → Bildpunkt (720,560), Faktor 2,4
  const Z = 2.4, px = 720 - Z * 1083, py = 560 - Z * 814;
  tl.to(world, { scale: Z, x: px, y: py, duration: .9, ease: 'power3.inOut' }, tB);
  tl.to(prof, { opacity: 0, y: -16, duration: .4 }, tB);
  tl.to(meta, { opacity: 0, duration: .3 }, tB);
  sfx(tB, 'whoosh', .5);
  const visor = box(root, 40, 40, 1840, 1000, '', '', 'border-radius:80px;border:2px solid rgba(59,227,255,.55);box-shadow:inset 0 0 120px rgba(59,227,255,.22),0 0 0 400px rgba(4,8,20,.35);opacity:0');
  const live = box(root, 120, 150, 600, 50, '', `<span class="chip cyan" style="font-size:17px">${icon('scan-line', 20, '#3be3ff', 2)} KI-Brille · Live-Diagnose</span>`);
  tl.to(visor, { opacity: 1, duration: .5 }, tB + .5);
  revealUp(tl, live, tB + .6, { y: 10 });
  const bx0 = 1052 * Z + px - 16, by0 = 774 * Z + py - 16, bw = 62 * Z + 32, bh = 80 * Z + 32;
  const bracket = box(root, bx0, by0, bw, bh, '', '', 'border:3px solid #3be3ff;border-radius:12px;box-shadow:0 0 30px rgba(59,227,255,.6);opacity:0');
  const scan = box(root, bx0, by0, bw, 4, '', '', 'background:#3be3ff;box-shadow:0 0 18px #3be3ff;opacity:0');
  tl.fromTo(bracket, { opacity: 0, scale: 1.3 }, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2)' }, tB + .8);
  tl.fromTo(scan, { opacity: 1, y: 0 }, { y: bh, duration: .9, ease: 'none', repeat: 1, yoyo: true }, tB + .9);
  tl.to(scan, { opacity: 0, duration: .2 }, tB + 2.7);
  sfx(tB + .9, 'scan', .45);
  const diag = box(root, bx0 + bw + 40, by0 - 10, 620, 250, 'glass solid', '', 'padding:24px 28px;border-radius:24px;border-color:rgba(59,227,255,.6)');
  diag.innerHTML = '<div class="tiny" style="letter-spacing:.16em;color:#3be3ff">WECHSELRICHTER WR-2</div>' +
    '<div style="font:800 38px var(--display);margin-top:8px">Lüfter blockiert</div>' +
    '<div class="tiny" style="margin-top:8px;font-size:20px">KI-Sicherheit 94 % · Ersatzteil im Transporter</div>' +
    `<div class="row" style="gap:10px;margin-top:16px">${icon('triangle-alert', 26, '#ffb547', 2)}<span style="font:650 24px var(--sans);color:#ffd08a">Anlage leistet nur 61 %</span></div>`;
  revealUp(tl, diag, tB + 1.3, { y: 16 });
  sfx(tB + 1.3, 'blip', .5);

  const tR = S.cue('s1d', ['reparieren']) - .2;
  const sign = box(root, bx0 + bw + 40, by0 + 260, 620, 92, 'glass solid', '', 'display:flex;align-items:center;gap:18px;padding:0 26px;border-radius:22px;border-color:rgba(65,240,166,.6)');
  sign.innerHTML = `${icon('signature', 44, '#41f0a6', 1.8)}<span style="font:750 30px var(--display)">Reparieren &amp; freigeben: der Meister</span>`;
  revealUp(tl, sign, tR, { y: 14 });
  tl.to(led, { attr: { fill: '#41f0a6' }, duration: .2 }, S.cue('s1d', ['geradestehen', 'selbst']) + .2);
  tl.to(diag.querySelector('.tiny'), { color: '#41f0a6', duration: .3 }, S.cue('s1d', ['geradestehen', 'selbst']) + .2);
  sfx(S.cue('s1d', ['geradestehen', 'selbst']) + .2, 'click', .5);

  const tH = S.cue('s1d', ['homeoffice']) - .15;
  const ho = box(root, 120, 840, 520, 70, '', `<span class="chip coral" style="font-size:19px">${icon('x', 22, '#ff5c7a', 2.4)} Homeoffice: geht nicht</span>`);
  popIn(tl, ho, tH, { from: .6 });
  sfx(tH, 'pop', .5);
  const tA = S.cue('s1d', ['auftragsbuch']) - .2;
  const book = box(root, bx0 + bw + 40, by0 + 372, 620, 150, 'glass solid', '', 'padding:22px 28px;border-radius:24px;border-color:rgba(255,181,71,.6)');
  const months = ['Nov', 'Dez', 'Jan', 'Feb', 'Mär'];
  book.innerHTML = `<div class="row" style="gap:12px">${icon('calendar-days', 30, '#ffb547', 1.9)}<span style="font:750 30px var(--display)">Auftragsbuch: voll bis März</span></div>` +
    '<div class="row" style="gap:10px;margin-top:16px">' + months.map(m => `<div style="flex:1"><div class="mb" style="height:12px;border-radius:6px;background:#ffb547;transform-origin:0 50%;transform:scaleX(0)"></div><div class="tiny" style="margin-top:6px;font-size:17px">${m}</div></div>`).join('') + '</div>';
  revealUp(tl, book, tA, { y: 18 });
  tl.to(book.querySelectorAll('.mb'), { scaleX: 1, duration: .35, stagger: .12, ease: 'power2.out' }, tA + .3);
  sfx(tA + .3, 'rise', .4);

  source(S.start + .3, S.end - .3, '<b>Szenario</b> · fiktive Zukunftsszene, abgeleitet aus aktuellen Trends');
}
