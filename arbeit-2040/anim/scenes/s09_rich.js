// Kapitel 9: Wie wird man reich? – Eigentum + Zeit, Lernen, Gründen (mit Vorsicht)
function S09(tl, S) {
  const root = makeScene('rich');
  const r1 = S.L('r1'), r2 = S.L('r2'), r3 = S.L('r3');
  sceneInOut(tl, root, S);

  // --- r1 ---
  const A = box(root, 0, 0, 1920, 1080);
  const q = box(A, 0, 300, 1920, 130, 'center h-lg', 'Wie wird man reich?');
  revealUp(tl, q, r1.start - .1, { y: 30 });
  const eq = box(A, 0, 500, 1920, 140, 'row', '', 'justify-content:center;gap:50px');
  eq.innerHTML = '<span class="sal" style="position:relative;font:800 72px var(--display);color:#8ea0c6">Gehalt allein<span class="st" style="position:absolute;left:-3%;top:52%;width:106%;height:8px;border-radius:5px;background:#ff5c7a;transform-origin:0 50%;transform:scaleX(0)"></span></span>' +
    '<span style="font:800 72px var(--display);color:#56658a">→</span>' +
    '<span class="own grad-mint" style="font:850 84px var(--display)">Eigentum + Zeit</span>';
  const [sal, , own] = eq.children;
  revealUp(tl, sal, S.cue('r1', ['gehalt']) - .3, { y: 20 });
  tl.to(sal.querySelector('.st'), { scaleX: 1, duration: .4, ease: 'power3.out' }, S.cue('r1', ['allein']) + .1);
  revealUp(tl, [eq.children[1], own], S.cue('r1', ['eigentum']) - .3, { y: 20, stagger: .12 });
  sfx(S.cue('r1', ['eigentum']), 'impact', .55);

  // --- r2: Zinseszins ---
  const tB = r2.start - .25;
  tl.to(A, { opacity: 0, y: -40, filter: 'blur(10px)', duration: .55, ease: 'power2.in' }, tB);
  sfx(tB, 'whoosh', .45);
  const B = box(root, 0, 0, 1920, 1080);
  const panel = box(B, 130, 170, 1180, 740, 'glass', '', 'padding:32px 40px');
  panel.innerHTML = '<div class="kicker">Beispielrechnung · 50 € pro Monat, breit gestreut</div><div class="tiny" style="margin-top:6px">Annahme: 6 % Rendite pro Jahr – vor Steuern, Kosten und Inflation</div>';
  revealUp(tl, panel, r2.start, { y: 30 });
  const X0 = 110, X1 = 1110, Y0 = 640, Y1 = 150;
  const sx = age => X0 + (age - 16) / (67 - 16) * (X1 - X0);
  const sy = v => Y0 - v / 210000 * (Y0 - Y1);
  const cs = svg('svg', { width: 1180, height: 740, class: 'abs', style: 'left:0;top:0' }, panel);
  const defs = svg('defs', {}, cs);
  const mkGrad = (id, col) => {
    const g = svg('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    svg('stop', { offset: 0, 'stop-color': col, 'stop-opacity': .32 }, g);
    svg('stop', { offset: 1, 'stop-color': col, 'stop-opacity': 0 }, g);
  };
  mkGrad('ciA', '#3be3ff'); mkGrad('ciB', '#8b6cff');
  for (const v of [0, 50000, 100000, 150000, 200000]) {
    svg('line', { x1: X0, x2: X1, y1: sy(v), y2: sy(v), stroke: '#fff', 'stroke-opacity': v ? .07 : .3 }, cs);
    const t = svg('text', { x: X0 - 16, y: sy(v) + 7, 'text-anchor': 'end', fill: '#8ea0c6', 'font-family': 'JetBrains Mono', 'font-size': 19 }, cs);
    t.textContent = v ? fmtDE(v / 1000) + 'k €' : '0';
  }
  for (const a of [16, 26, 36, 46, 56, 67]) {
    const t = svg('text', { x: sx(a), y: Y0 + 36, 'text-anchor': 'middle', fill: '#8ea0c6', 'font-family': 'JetBrains Mono', 'font-size': 19 }, cs);
    t.textContent = a + ' J.';
  }
  const series = (start) => {
    const pts = [], paid = [];
    let v = 0, p = 0;
    for (let m = 0; m <= (67 - 16) * 12; m++) {
      const age = 16 + m / 12;
      if (m > (start - 16) * 12) { v = v * (1 + .06 / 12) + 50; p += 50; }
      if (m % 6 === 0) { pts.push([age, v]); paid.push([age, p]); }
    }
    return { pts, paid, end: v, paidEnd: p };
  };
  const SA = series(16), SB = series(36);
  const mkCurve = (Sx, col, grad) => {
    const d = pathFrom(Sx.pts, sx, sy);
    const area = svg('path', { d: d + ` L${sx(67)},${Y0} L${sx(16)},${Y0} Z`, fill: `url(#${grad})`, opacity: 0 }, cs);
    const line = svg('path', { d, fill: 'none', stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' }, cs);
    const paid = svg('path', { d: pathFrom(Sx.paid, sx, sy), fill: 'none', stroke: col, 'stroke-width': 2.5, 'stroke-dasharray': '8 9', opacity: .7 }, cs);
    return { area, line, paid };
  };
  const CA = mkCurve(SA, '#3be3ff', 'ciA'), CB = mkCurve(SB, '#8b6cff', 'ciB');
  const tA = S.cue('r2', ['sechzehn', '16']) - .3;
  const tA2 = S.cue('r2', ['zweihunderttausend', '200']) - .2;
  drawIn(tl, [CA.paid], tA, Math.max(1.5, tA2 - tA), 'none');
  drawIn(tl, [CA.line], tA, Math.max(1.5, tA2 - tA), 'power2.in');
  tl.to(CA.area, { opacity: 1, duration: .8 }, tA2 - .2);
  const tBs = S.cue('r2', ['sechsunddreißig', 'sechsunddreissig', '36']) - .3;
  const tB2 = S.cue('r2', ['fünfzigtausend', 'fuenfzigtausend', '50']) - .1;
  drawIn(tl, [CB.paid], tBs, Math.max(1.2, tB2 - tBs), 'none');
  drawIn(tl, [CB.line], tBs, Math.max(1.2, tB2 - tBs), 'power2.in');
  tl.to(CB.area, { opacity: 1, duration: .8 }, tB2 - .2);
  const legend = box(panel, 110, 694, 1000, 40, 'row', '<span class="tiny" style="font-size:19px">– – eingezahlt</span><span class="tiny" style="font-size:19px">—— Depotwert</span>', 'gap:40px');
  revealUp(tl, legend, tA + .6, { y: 8 });

  const card = (y, col, tint, title, end, paid, t, tc) => {
    const c = box(B, 1350, y, 440, 200, 'glass ' + tint, '', 'padding:26px 30px');
    c.innerHTML = `<div class="tiny" style="color:${col};letter-spacing:.14em">${title}</div><div class="num" style="font-size:60px;margin-top:8px;white-space:nowrap">≈ <span class="v">0</span> €</div><div class="tiny" style="margin-top:6px">eingezahlt: ${fmtDE(paid)} €</div>`;
    revealUp(tl, c, t, { y: 20 });
    const p = { k: 0 };
    const vEl = c.querySelector('.v');
    vEl.textContent = '0';
    tl.to(p, { k: 1, duration: Math.max(1.2, tc - t), ease: 'power2.in', onUpdate: () => { vEl.textContent = fmtDE(Math.round(end * p.k / 100) * 100); } }, t + .05);
    sfx(tc, 'pop', .5);
    return c;
  };
  card(200, '#3be3ff', 'tint-cyan', 'START MIT 16 → MIT 67', SA.end, SA.paidEnd, tA, tA2);
  card(430, '#b3a1ff', 'tint-violet', 'START MIT 36 → MIT 67', SB.end, SB.paidEnd, tBs, tB2);
  const tG = S.cue('r2', ['garantiert']) - .2;
  const warn = box(B, 1350, 660, 440, 120, 'glass tint-amber', '', 'padding:20px 26px;display:flex;align-items:center;gap:18px');
  warn.innerHTML = `${icon('triangle-alert', 46, '#ffb547', 2)}<div style="font:650 24px var(--sans)">Keine Garantie: Kurse können zeitweise stark fallen.</div>`;
  revealUp(tl, warn, tG, { y: 16 });
  sfx(tG, 'blip', .5);
  const fr = box(B, 1350, 800, 440, 110, '', '', 'padding:14px 18px;border-radius:20px;border:1.5px dashed rgba(65,240,166,.6);background:rgba(65,240,166,.07)');
  fr.innerHTML = '<div class="tiny" style="color:#41f0a6;letter-spacing:.12em">NEU BESCHLOSSEN · 16.10.2026</div><div style="font:650 22px var(--sans);margin-top:4px">Frühstart-Rente: 10 € pro Monat vom Staat für 6- bis 18-Jährige</div>';
  revealUp(tl, fr, tG + 1.0, { y: 14 });
  source(r2.start, r2.end + .2, 'Eigene Beispielrechnung (monatliche Verzinsung) · Frühstart-Rente: <b>Deutscher Bundestag</b>, Beschluss vom 16.10.2026');

  // --- r3: drei Hebel ---
  const tC = r3.start - .25;
  tl.to(B, { opacity: 0, y: -40, filter: 'blur(10px)', duration: .55, ease: 'power2.in' }, tC);
  sfx(tC, 'whoosh', .45);
  const Cc = box(root, 0, 0, 1920, 1080);
  const pillars = [
    ['①', 'coins', 'Eigentum + Zeit', 'früh, breit gestreut, lange', '#41f0a6', 'tint-mint', r3.start],
    ['②', 'brain-circuit', 'Lernen, was KI ergänzt', 'Urteilskraft · Kommunikation · Fachwissen', '#3be3ff', 'tint-cyan', S.cue('r3', ['zweitens']) - .1],
    ['③', 'rocket', 'Gründen mit KI-Hebel', 'kleine Teams, große Reichweite', '#ffb547', 'tint-amber', S.cue('r3', ['drittens']) - .1],
  ];
  pillars.forEach(([n, ic, title, sub, col, tint, t], i) => {
    const c = box(Cc, 130 + i * 565, 190, 530, 330, 'glass ' + tint, '', 'padding:34px 36px');
    c.innerHTML = `<div class="row" style="justify-content:space-between">${icon(ic, 64, col, 1.7)}<span class="num" style="font-size:54px;color:${col}">${n}</span></div>` +
      `<div style="font:800 40px var(--display);margin-top:26px">${title}</div><div class="tiny" style="margin-top:10px;font-size:21px">${sub}</div>`;
    revealUp(tl, c, t, { y: 30 });
    sfx(t, 'pop', .45);
  });
  // Survivorship Bias
  const sb = box(Cc, 130, 580, 1660, 300, 'glass', '', 'padding:26px 34px');
  sb.innerHTML = '<div class="row" style="justify-content:space-between"><div class="kicker" style="color:#ffb547">Vorsicht: Survivorship Bias</div><div class="tiny">Man sieht nur die Gewinner – nicht die vielen, die scheitern.</div></div>';
  const tS = S.cue('r3', ['erfolgsstory', 'aber']) - .3;
  revealUp(tl, sb, tS, { y: 20 });
  const RR = rng(31);
  const rockets = [];
  for (let i = 0; i < 48; i++) {
    const x = 40 + (i % 24) * 66, y = 80 + Math.floor(i / 24) * 90;
    const win = [5, 18, 33].includes(i);
    const r = box(sb, x, y, 48, 48, '', icon('rocket', 40, win ? '#ffb547' : '#9fb4ff', 1.8));
    rockets.push({ r, win, d: RR() });
  }
  tl.fromTo(rockets.map(o => o.r), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: .3, stagger: .012 }, tS + .2);
  const tF = S.cue('r3', ['scheitern']) - .4;
  rockets.forEach(o => {
    if (o.win) tl.to(o.r, { scale: 1.35, filter: 'drop-shadow(0 0 14px #ffb547)', duration: .5, ease: 'back.out(2)' }, tF + .4);
    else tl.to(o.r, { opacity: .12, y: 26 + o.d * 30, rotation: 60 + o.d * 90, duration: .9, ease: 'power2.in' }, tF + o.d * .5);
  });
  sfx(tF, 'down', .5);
  source(r3.start, S.end - .2, '<b>Survivorship Bias</b>: Denkfehler, nur die sichtbaren Erfolgsfälle zu betrachten');
}
