// Kapitel 8: Arm und Reich – Kapital, Vermögensverteilung, Aufstiegschancen, Homeoffice-Privileg
function S08(tl, S) {
  const root = makeScene('wealth');
  const w1 = S.L('w1'), w2 = S.L('w2'), w3 = S.L('w3');
  sceneInOut(tl, root, S);

  // --- w1: Maschinen gehören wem? ---
  const A = box(root, 0, 0, 1920, 1080);
  const head = box(A, 150, 150, 1400, 130, '');
  head.innerHTML = '<div class="kicker" style="color:var(--amber)">Wer wird reicher?</div><div class="h-md" style="margin-top:8px">Vor allem die, denen die Maschinen gehören</div>';
  revealUp(tl, head.children[0], w1.start - .1, { y: 14 });
  revealUp(tl, head.children[1], S.cue('w1', ['maschinen', 'gehören']) - .5, { y: 20 });

  const bots = [0, 1, 2].map(i => box(A, 170 + i * 190, 400, 160, 160, 'glass tint-violet', icon('bot', 80, '#c9bcff', 1.7), 'border-radius:36px;display:flex;align-items:center;justify-content:center'));
  const vault = box(A, 1400, 360, 260, 240, 'glass tint-amber', `${icon('landmark', 96, '#ffb547', 1.6)}<div style="font:750 28px var(--display);margin-top:10px">Eigentümer</div><div class="tiny">Aktien · Firmen · Daten</div>`,
    'border-radius:36px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center');
  const workers = box(A, 1400, 640, 260, 150, 'glass', `${icon('users', 60, '#cfe6ff', 1.7)}<div style="font:700 26px var(--sans);margin-top:6px">Beschäftigte</div>`,
    'border-radius:30px;display:flex;flex-direction:column;align-items:center;justify-content:center');
  const tM = S.cue('w1', ['maschinen']) - .5;
  popIn(tl, bots, tM, { from: .5, stagger: .1 });
  popIn(tl, vault, tM + .4, { from: .6 });
  popIn(tl, workers, tM + .6, { from: .6 });
  sfx(tM, 'pop', .45);
  // Geldströme: dicker Strom zu den Eigentümern, dünner zu den Beschäftigten
  const flow = el('canvas', { attrs: { width: 1920, height: 1080 }, css: 'position:absolute;left:0;top:0' }, A);
  const fg = flow.getContext('2d');
  const coinsT0 = tM + .9;
  FRAME.push(t => {
    if (t < coinsT0 || t > w2.start + .5) { if (t > w2.start + .5 && t < w2.start + 1) fg.clearRect(0, 0, 1920, 1080); return; }
    fg.clearRect(0, 0, 1920, 1080);
    const ramp = clamp((t - coinsT0) / .8);
    const draw = (n, y0, y1, col, size, speed) => {
      for (let i = 0; i < n; i++) {
        const k = ((t - coinsT0) * speed + i / n) % 1;
        const x = 760 + k * 620;
        const y = lerp(y0, y1, smooth(k)) + Math.sin(k * 9 + i) * 6;
        fg.globalAlpha = Math.sin(k * Math.PI) * ramp;
        fg.fillStyle = col;
        fg.beginPath(); fg.arc(x, y, size, 0, 6.283); fg.fill();
      }
      fg.globalAlpha = 1;
    };
    draw(22, 480, 470, '#ffb547', 11, .45);
    draw(5, 490, 715, '#9fb4ff', 7, .45);
  });
  const lab1 = box(A, 860, 380, 420, 50, 'center', '<span class="chip amber" style="font-size:17px">Gewinne aus Kapital</span>');
  const lab2 = box(A, 860, 650, 420, 50, 'center', '<span class="chip muted" style="font-size:17px">Löhne</span>');
  revealUp(tl, [lab1, lab2], coinsT0 + .3, { y: 10, stagger: .2 });

  const quote = box(A, 150, 820, 1500, 110, 'glass', '', 'padding:22px 34px;display:flex;align-items:center;gap:26px;border-radius:24px');
  quote.innerHTML = `${icon('scale', 52, '#ffb547', 1.7)}<div><div style="font:650 30px var(--sans);font-style:italic">„In den meisten Szenarien wird KI die Ungleichheit insgesamt wahrscheinlich verschärfen.“</div><div class="tiny" style="margin-top:6px">Kristalina Georgieva, Chefin des Internationalen Währungsfonds, Januar 2024</div></div>`;
  revealUp(tl, quote, S.cue('w1', ['währungsfonds', 'waehrungsfonds', 'internationale']) - .3, { y: 20 });
  sfx(S.cue('w1', ['währungsfonds', 'internationale']), 'blip', .45);
  source(w1.start, w1.end + .2, '<b>IWF</b> (2024): Gen-AI and the Future of Work · Blog K. Georgieva, 14.1.2024');

  // --- w2: Vermögen + Aufstieg ---
  const tB = w2.start - .25;
  tl.to(A, { opacity: 0, y: -40, filter: 'blur(10px)', duration: .55, ease: 'power2.in' }, tB);
  sfx(tB, 'whoosh', .45);
  const B = box(root, 0, 0, 1920, 1080);
  const bh = box(B, 150, 150, 1600, 120, '');
  bh.innerHTML = '<div class="kicker" style="color:var(--amber)">Deutschland · Nettovermögen der Haushalte 2023</div>';
  revealUp(tl, bh.children, w2.start, { y: 12 });
  const people = box(B, 150, 230, 1620, 120, 'row', '', 'gap:0;justify-content:space-between');
  const figs = [];
  for (let i = 0; i < 10; i++) figs.push(el('span', { html: icon('user', 88, i === 0 ? '#ffb547' : '#6f7fa8', 1.8) }, people));
  tl.fromTo(figs, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .4, stagger: .05 }, w2.start + .1);
  const bar = box(B, 150, 380, 1620, 110, '', '', 'border-radius:22px;overflow:hidden;display:flex;border:1.5px solid rgba(255,255,255,.18)');
  const segTop = el('div', { css: 'width:54%;height:100%;background:linear-gradient(90deg,#ffb547,#ff8a5c);display:flex;align-items:center;padding-left:30px;transform-origin:0 50%' }, bar);
  segTop.innerHTML = '<span style="font:850 46px var(--display);color:#1a0f05">reichste 10 % besitzen 54 %</span>';
  const segRest = el('div', { css: 'width:46%;height:100%;background:linear-gradient(90deg,#2a3768,#1c2550);display:flex;align-items:center;justify-content:flex-end;padding-right:30px' }, bar);
  segRest.innerHTML = '<span style="font:700 34px var(--sans);color:#cfe0ff">übrige 90 %: 46 %</span>';
  const tW = S.cue('w2', ['reichsten', 'zehn']) - .3;
  tl.fromTo(bar, { opacity: 0 }, { opacity: 1, duration: .3 }, tW);
  tl.fromTo(segTop, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.out' }, tW + .1);
  tl.fromTo(segTop.firstChild, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: .45 }, tW + .95);
  tl.fromTo(segRest.firstChild, { opacity: 0 }, { opacity: 1, duration: .4 }, tW + .9);
  tl.to(figs[0], { scale: 1.25, y: -6, duration: .5, ease: 'back.out(2)' }, tW + .2);
  sfx(tW, 'rise', .5);
  const half = box(B, 150, 510, 1620, 44, 'tiny', 'Die ärmere Hälfte der Haushalte besitzt zusammen nur wenige Prozent.', 'font-size:23px;color:#cfd8f0');
  revealUp(tl, half, tW + 1.2, { y: 8 });

  const gen = box(B, 150, 590, 1620, 340, 'glass', '', 'padding:26px 40px');
  gen.innerHTML = '<div class="row" style="justify-content:space-between;align-items:center"><div class="kicker">OECD · sozialer Aufstieg in Deutschland</div><div class="six num" style="font-size:46px;color:#ffd08a">≈ 6 Generationen</div></div>' +
    '<div class="tiny" style="position:absolute;right:40px;bottom:22px">OECD-Schnitt: 4,5 Generationen · Dänemark: 2</div>';
  const gsv = svg('svg', { width: 1540, height: 240, class: 'abs', style: 'left:40px;top:84px' }, gen);
  const avgY = 34;
  svg('line', { x1: 0, x2: 1540, y1: avgY, y2: avgY, stroke: '#ffb547', 'stroke-dasharray': '10 10', 'stroke-width': 2.5 }, gsv);
  const avgT = svg('text', { x: 0, y: avgY - 10, fill: '#ffd08a', 'font-family': 'JetBrains Mono', 'font-size': 19 }, gsv);
  avgT.textContent = 'Durchschnittseinkommen';
  const gx = i => 150 + i * 250;
  const gy = i => 196 - i * 30;
  const stepPath = svg('path', { d: 'M' + [0, 1, 2, 3, 4, 5].map(i => `${gx(i)},${gy(i)}`).join(' L'), fill: 'none', stroke: '#3be3ff', 'stroke-width': 3, 'stroke-dasharray': '4 10', 'stroke-linecap': 'round' }, gsv);
  const gens = [0, 1, 2, 3, 4, 5].map(i => {
    const g = box(gen, 40 + gx(i) - 26, 84 + gy(i) - 26, 52, 52, '', icon('user-round', 52, i === 5 ? '#ffb547' : '#7fe9ff', 1.9),
      'border-radius:50%;background:#0b1230');
    const n = box(gen, 40 + gx(i) + 34, 84 + gy(i) - 10, 110, 26, 'tiny', `${i + 1}. Gen.`, 'font-size:18px');
    return [g, n];
  });
  const tO = S.cue('w2', ['oecd']) - .4;
  revealUp(tl, gen, tO, { y: 24 });
  drawIn(tl, stepPath, tO + .5, 1.9, 'none');
  gens.forEach(([g, n], i) => {
    popIn(tl, g, tO + .5 + i * .32, { from: .4 });
    tl.fromTo(n, { opacity: 0 }, { opacity: 1, duration: .3 }, tO + .55 + i * .32);
  });
  const six = gen.querySelector('.six');
  revealUp(tl, six, S.cue('w2', ['sechs', 'generationen']) - .2, { y: 10 });
  sfx(S.cue('w2', ['sechs', 'generationen']), 'pop', .5);
  source(w2.start, w2.end + .2, '<b>Deutsche Bundesbank</b>: Vermögensbefragung 2023 (Monatsbericht 4/2025) · <b>OECD</b> (2018): A Broken Social Elevator?');

  // --- w3: Homeoffice-Privileg ---
  const tC = w3.start - .25;
  tl.to(B, { opacity: 0, y: -40, filter: 'blur(10px)', duration: .55, ease: 'power2.in' }, tC);
  sfx(tC, 'whoosh', .45);
  const Cc = box(root, 0, 0, 1920, 1080);
  const ch = box(Cc, 150, 150, 1600, 130, '');
  ch.innerHTML = '<div class="kicker">Ungleich verteilt</div><div class="h-md" style="margin-top:8px">Homeoffice ist ein Privileg</div>';
  revealUp(tl, ch.children, w3.start - .1, { stagger: .1 });
  const left = box(Cc, 150, 340, 760, 460, 'glass tint-cyan', '', 'padding:40px 46px');
  left.innerHTML = `<div class="row" style="gap:18px">${icon('laptop', 64, '#7fe9ff', 1.7)}${icon('house', 64, '#7fe9ff', 1.7)}</div>` +
    '<div style="font:800 46px var(--display);margin-top:24px">„Bürobranchen“</div><div class="body" style="font-size:30px;margin-top:8px">IT, Beratung, Finanzen, Verwaltung</div>' +
    '<div class="num c-cyan" style="font-size:84px;margin-top:20px">bis 70 %</div><div class="tiny">Homeoffice-Anteil in Spitzenbranchen</div>';
  const right = box(Cc, 1010, 340, 760, 460, 'glass tint-coral', '', 'padding:40px 46px');
  right.innerHTML = '<div class="row items" style="gap:26px"></div>' +
    '<div style="font:800 46px var(--display);margin-top:24px">Pflege · Bau · Verkauf</div><div class="body" style="font-size:30px;margin-top:8px">Arbeit, die vor Ort passiert</div>' +
    '<div class="num c-coral" style="font-size:84px;margin-top:20px">kaum</div><div class="tiny">Homeoffice möglich</div>';
  const items = right.querySelector('.items');
  const its = [['hand-heart', ['pflegt']], ['hard-hat', ['baut']], ['store', ['verkauft']]].map(([ic, q]) => {
    const e = el('span', { html: icon(ic, 64, '#ff8da1', 1.7) }, items);
    popIn(tl, e, S.cue('w3', q) - .1, { from: .4 });
    return e;
  });
  revealUp(tl, left, w3.start + .1, { y: 24 });
  revealUp(tl, right, S.cue('w3', ['pflegt']) - .5, { y: 24 });
  sfx(S.cue('w3', ['pflegt']), 'pop', .4);
  source(w3.start, S.end - .2, '<b>ifo Schnelldienst 3/2024</b>: höchste Homeoffice-Anteile in „Bürobranchen“, wenig u. a. in Handel und Bau');
}
