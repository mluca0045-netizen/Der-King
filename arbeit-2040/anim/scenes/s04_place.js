// Kapitel 4: Homeoffice und Büro (ifo Schnelldienst 3/2024)
function S04(tl, S) {
  const root = makeScene('place');
  const p1 = S.L('p1'), p2 = S.L('p2'), p3 = S.L('p3');
  sceneInOut(tl, root, S);

  // --- p1: Homeoffice-Quote ---
  const A = box(root, 0, 0, 1920, 1080);
  const head = box(A, 150, 150, 1200, 140, '');
  head.innerHTML = '<div class="kicker">Homeoffice-Quote in Deutschland</div><div class="h-md" style="margin-top:10px">Vom Notfall zur Normalität</div>';
  revealUp(tl, head.children, S.start + .2, { stagger: .1 });

  const X0 = 230, X1 = 1500, Y0 = 820, Y1 = 330;
  const sx = yr => X0 + (yr - 2019) / (2024.2 - 2019) * (X1 - X0);
  const sy = v => Y0 - v / 40 * (Y0 - Y1);
  const ch = svg('svg', { width: 1920, height: 1080, class: 'abs', style: 'left:0;top:0' }, A);
  const defs = svg('defs', {}, ch);
  const ag = svg('linearGradient', { id: 'hoArea', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  svg('stop', { offset: 0, 'stop-color': '#3be3ff', 'stop-opacity': .35 }, ag);
  svg('stop', { offset: 1, 'stop-color': '#3be3ff', 'stop-opacity': 0 }, ag);
  for (const v of [0, 10, 20, 30, 40]) {
    svg('line', { x1: X0, x2: X1, y1: sy(v), y2: sy(v), stroke: '#ffffff', 'stroke-opacity': v ? .07 : .3, 'stroke-width': 1.5 }, ch);
    const t = svg('text', { x: X0 - 22, y: sy(v) + 8, 'text-anchor': 'end', fill: '#8ea0c6', 'font-family': 'JetBrains Mono', 'font-size': 22 }, ch);
    t.textContent = v + ' %';
  }
  for (const y of [2019, 2020, 2021, 2022, 2023, 2024]) {
    const t = svg('text', { x: sx(y), y: Y0 + 44, 'text-anchor': 'middle', fill: '#8ea0c6', 'font-family': 'JetBrains Mono', 'font-size': 22 }, ch);
    t.textContent = y;
  }
  // vereinfacht nach ifo Schnelldienst 3/2024, Abb. 4
  const pts = [[2019, 5], [2019.6, 5], [2020.0, 6], [2020.27, 34], [2020.6, 29], [2021.05, 32], [2021.5, 28.5], [2022.0, 28], [2022.3, 25], [2023.0, 25], [2023.5, 23.5], [2024.05, 24]];
  const d = pathFrom(pts, sx, sy, .12);
  const area = svg('path', { d: d + ` L${sx(2024.05)},${Y0} L${sx(2019)},${Y0} Z`, fill: 'url(#hoArea)', opacity: 0 }, ch);
  const line = svg('path', { d, fill: 'none', stroke: '#3be3ff', 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ch);
  const tLine = S.cue('p1', ['corona']) - .4;
  drawIn(tl, line, tLine, Math.max(2.5, S.cue('p1', ['viertel'], .9) - tLine), 'power1.inOut');
  tl.to(area, { opacity: 1, duration: 1 }, S.cue('p1', ['viertel'], .9));

  const callout = (x, y, html, t, col = '#3be3ff', dx = 20, dy = -90) => {
    const dot = box(A, x - 11, y - 11, 22, 22, '', '', `border-radius:50%;background:${col};box-shadow:0 0 24px ${col}`);
    const lab = box(A, x + dx, y + dy, 420, 90, '', html);
    popIn(tl, dot, t, { from: .2 });
    revealUp(tl, lab, t + .05, { y: 12, d: .5 });
    sfx(t, 'blip', .45);
  };
  callout(sx(2019.9), sy(5), '<div class="num" style="font-size:56px">≈ 5 %</div><div class="tiny">vor Corona</div>', S.cue('p1', ['fünf', 'fuenf', '5']) - .1, '#8ea0c6', 10, -120);
  callout(sx(2020.27), sy(34), '<div class="num c-cyan" style="font-size:56px">bis 34 %</div><div class="tiny">im Lockdown</div>', tLine + 1.0, '#3be3ff', 24, -60);
  callout(sx(2023.0), sy(25), '<div class="num grad" style="font-size:64px">≈ 25 %</div><div class="tiny">stabil seit 2022</div>', S.cue('p1', ['viertel'], .9) - .2, '#8b6cff', -60, -150);
  const mix = box(A, 1560, 420, 280, 260, 'col', '', 'gap:18px');
  mix.innerHTML = '<span class="chip cyan" style="font-size:17px"><span class="dot"></span>17 % hybrid</span><span class="chip violet" style="font-size:17px"><span class="dot"></span>7 % nur zu Hause</span>' +
    `<div class="row" style="gap:12px;margin-top:10px">${icon('house', 40, '#cfe6ff', 1.7)}${icon('laptop', 40, '#cfe6ff', 1.7)}</div>`;
  revealUp(tl, mix.children, S.cue('p1', ['viertel'], .9) + .3, { y: 12, stagger: .15 });
  source(S.start + .4, p1.end + .2, '<b>ifo Schnelldienst 3/2024</b> (Krause et al.), Abb. 4 – vereinfacht · hybrid/nur zu Hause: Destatis 2023');

  // --- p2: Büroflächen ---
  const tB = p2.start - .25;
  tl.to(A, { opacity: 0, y: -40, filter: 'blur(10px)', duration: .55, ease: 'power2.in' }, tB);
  sfx(tB, 'whoosh', .45);
  const B = box(root, 0, 0, 1920, 1080);
  const cities = ['Berlin', 'Hamburg', 'München', 'Köln', 'Frankfurt', 'Stuttgart', 'Düsseldorf'];
  const heights = [430, 360, 400, 320, 520, 340, 380];
  const R = rng(12);
  const allWins = [];
  const towers = cities.map((c, i) => {
    const w = 150, h = heights[i];
    const x = 130 + i * 178, y = 860 - h;
    const t = box(B, x, y, w, h, '', '', 'border-radius:10px 10px 0 0;background:linear-gradient(180deg,#1f2a5e,#121838);border:1.5px solid rgba(120,160,255,.25);overflow:hidden');
    const wins = [];
    for (let wy = 16; wy < h - 14; wy += 26) {
      for (let wx = 14; wx < w - 14; wx += 26) {
        const wn = box(t, wx, wy, 16, 16, '', '', 'border-radius:3px;background:#ffd38a;box-shadow:0 0 8px rgba(255,211,138,.6)');
        wins.push(wn); allWins.push(wn);
      }
    }
    const lab = box(B, x - 20, 878, w + 40, 40, 'tiny center', c, 'font-size:19px');
    return { t, lab, wins };
  });
  const floor = box(B, 110, 860, 1290, 3, '', '', 'background:rgba(255,255,255,.3)');
  tl.fromTo(towers.map(o => o.t), { scaleY: 0, transformOrigin: '50% 100%' }, { scaleY: 1, duration: .8, ease: 'power3.out', stagger: .06 }, p2.start);
  revealUp(tl, towers.map(o => o.lab), p2.start + .4, { y: 10, d: .4, stagger: .04 });
  tl.fromTo(floor, { scaleX: 0, transformOrigin: '0 50%' }, { scaleX: 1, duration: .6 }, p2.start);
  sfx(p2.start + .1, 'rise', .45);

  // 12 % der Fenster gehen aus
  const off = allWins.filter(() => R() < .12);
  const t12 = S.cue('p2', ['zwölf', 'zwoelf', '12']) - .2;
  tl.to(off, { background: '#141a3a', boxShadow: '0 0 0 rgba(0,0,0,0)', duration: .2, stagger: { each: 1.2 / off.length, from: 'random' } }, t12);
  const stat = box(B, 1430, 250, 460, 560, 'col', '', 'gap:8px');
  stat.innerHTML = '<div class="kicker" style="color:var(--coral)">Bürofläche · Top-7-Städte</div>' +
    '<div class="num grad-warm" style="font-size:150px;line-height:1;white-space:nowrap">−<span class="v">0</span> %</div>' +
    '<div class="small" style="font-size:27px">langfristiger Minderbedarf<br>(wahrscheinliches Szenario,<br>Spanne 4–24 %)</div>' +
    '<div class="glass" style="margin-top:22px;padding:20px 24px;border-radius:20px"><div class="num" style="font-size:44px">≈ 11,5 Mio. m²</div><div class="tiny" style="margin-top:6px">≈ 1.600 Fußballfelder</div></div>';
  revealUp(tl, stat.children[0], p2.start + .3, { y: 12 });
  revealUp(tl, [stat.children[1], stat.children[2]], t12 - .2, { y: 20, stagger: .12 });
  countUp(tl, stat.querySelector('.v'), 0, 12, t12, 1.2, v => Math.round(v));
  revealUp(tl, stat.children[3], t12 + 1.1, { y: 20 });
  sfx(t12, 'down', .55);
  const vac = box(B, 150, 165, 1200, 60, '', '<span class="chip amber"><span class="dot"></span>Leerstand: unter 3 % (2019) → 6,1 % (2023)</span>');
  revealUp(tl, vac, p2.start + .8, { y: 12 });
  source(p2.start, p2.end + .2, '<b>ifo Schnelldienst 3/2024</b> · Daten: ifo-Umfragen &amp; Colliers (35.000 Mietverträge, 2013–2023)');

  // --- p3: Büro als Treffpunkt, Umbau schwierig ---
  const tM = S.cue('p3', ['treffpunkten', 'treffpunkt']) - .5;
  const meet = box(B, 130 + 4 * 178 - 40, 300, 230, 120, 'glass tint-cyan', '', 'display:flex;align-items:center;justify-content:center;gap:12px;border-radius:22px');
  meet.innerHTML = icon('users', 44, '#7fe9ff', 1.8) + icon('lightbulb', 40, '#ffd38a', 1.8) + icon('coffee', 40, '#cfe6ff', 1.8);
  tl.to(towers[4].t, { borderColor: 'rgba(59,227,255,.9)', boxShadow: '0 0 60px rgba(59,227,255,.35)', duration: .5 }, tM);
  popIn(tl, meet, tM, { from: .6 });
  const meetLab = box(B, 130 + 4 * 178 - 140, 240, 430, 50, 'center', '<span class="chip cyan" style="font-size:16px"><span class="dot"></span>Treffpunkt: Team · Ideen · Kultur</span>');
  revealUp(tl, meetLab, tM + .2, { y: 10 });
  sfx(tM, 'pop', .5);

  const tW = S.cue('p3', ['bürotürme', 'buerotuerme', 'leere']) - .3;
  const conv = box(B, 130 + 1 * 178 - 30, 230, 210, 130, 'glass tint-coral', '', 'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border-radius:22px');
  conv.innerHTML = `<div class="row" style="gap:10px">${icon('building-2', 38, '#ffb3c0', 1.8)}${icon('arrow-right', 28, '#ffb3c0', 2)}${icon('house', 38, '#ffb3c0', 1.8)}</div><div class="tiny" style="color:#ffd0d8;font-size:19px">nur ≈ 10 % umbaubar</div>`;
  tl.to(towers[1].t, { borderColor: 'rgba(255,92,122,.9)', duration: .5 }, tW);
  popIn(tl, conv, tW, { from: .6 });
  const lux = box(B, 130 + 1 * 178 - 160, 168, 470, 50, 'center', `<span class="chip coral" style="font-size:16px">${icon('gem', 20, '#ff5c7a', 2)} oft eher Luxuswohnungen</span>`);
  revealUp(tl, lux, S.cue('p3', ['bezahlbaren', 'wohnungen']) - .1, { y: 10 });
  sfx(tW, 'pop', .5);
  tl.to(vac, { opacity: 0, duration: .4 }, tW - .2);
  source(p3.start, S.end - .2, 'Umbau zu Wohnungen: <b>ifo 3/2024</b> nach Gupta et al. (2023, USA) – oft Luxus- statt bezahlbarer Wohnungen');
}
