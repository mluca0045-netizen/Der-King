// Kapitel 5: Börse und Handel – Muster statt Aktientipps
function S05(tl, S) {
  const root = makeScene('market');
  const m1 = S.L('m1'), m2 = S.L('m2'), m3 = S.L('m3');
  sceneInOut(tl, root, S);

  // dekorative Kerzen im Hintergrund (Zufallsbewegung, keine echten Kurse)
  const deco = svg('svg', { width: 1920, height: 1080, class: 'abs', style: 'left:0;top:0;opacity:.0' }, root);
  const R = rng(5);
  let v = 600;
  const candles = svg('g', {}, deco);
  for (let i = 0; i < 70; i++) {
    const o = v, c = v + (R() - .48) * 60, hi = Math.min(o, c) - R() * 30, lo = Math.max(o, c) + R() * 30;
    const x = 40 + i * 27, up = c < o;
    svg('line', { x1: x, x2: x, y1: hi, y2: lo, stroke: up ? '#41f0a6' : '#ff5c7a', 'stroke-width': 2 }, candles);
    svg('rect', { x: x - 7, y: Math.min(o, c), width: 14, height: Math.max(3, Math.abs(c - o)), fill: up ? '#41f0a6' : '#ff5c7a', rx: 2 }, candles);
    v = c;
  }
  tl.to(deco, { opacity: .13, duration: 1 }, S.start);
  tl.fromTo(candles, { x: 0 }, { x: -300, duration: S.dur, ease: 'none' }, S.start);

  // --- m1 ---
  const A = box(root, 0, 0, 1920, 1080);
  const l1 = box(A, 0, 330, 1920, 130, 'center h-lg', 'Keine <span class="tip" style="position:relative;display:inline-block">Aktientipps<span class="strike" style="position:absolute;left:-2%;top:52%;width:104%;height:10px;border-radius:6px;background:#ff5c7a;transform-origin:0 50%;transform:scaleX(0)"></span></span> aus der Zukunft.');
  const l2 = box(A, 0, 520, 1920, 70, 'center kicker', 'Aber ein Muster:', 'font-size:30px');
  const l3 = box(A, 0, 600, 1920, 130, 'center h-lg grad', 'Die Börse reagiert zuerst.');
  revealUp(tl, l1, m1.start, { y: 30 });
  tl.to(l1.querySelector('.strike'), { scaleX: 1, duration: .45, ease: 'power3.out' }, S.cue('m1', ['nicht']) - .1);
  sfx(S.cue('m1', ['nicht']), 'swipe', .5);
  revealUp(tl, l2, S.cue('m1', ['muster']) - .25, { y: 16 });
  revealUp(tl, l3, S.cue('m1', ['börse', 'boerse']) - .2, { y: 24 });
  sfx(S.cue('m1', ['börse', 'boerse']), 'impact', .55);

  // --- m2: zwei Kurven ---
  const tB = m2.start - .25;
  tl.to(A, { opacity: 0, y: -40, filter: 'blur(10px)', duration: .55, ease: 'power2.in' }, tB);
  sfx(tB, 'whoosh', .45);
  const B = box(root, 0, 0, 1920, 1080);
  const chart = (x, title, ic, col, data, xr, yr, ticks, unit) => {
    const P = box(B, x, 200, 790, 640, 'glass', '', 'padding:36px 40px;');
    P.innerHTML = `<div class="row" style="gap:16px">${icon(ic, 44, col, 1.8)}<div><div style="font:800 40px var(--display)">${title[0]}</div><div class="tiny">${title[1]}</div></div></div>`;
    const W2 = 700, H2 = 380, ox = 40 + 20, oy = 170;
    const s = svg('svg', { width: 790, height: 640, class: 'abs', style: 'left:0;top:0' }, P);
    const sx = t => ox + (t - xr[0]) / (xr[1] - xr[0]) * (W2 - 40);
    const sy = v => oy + H2 - (v - yr[0]) / (yr[1] - yr[0]) * H2;
    for (const tv of ticks) {
      svg('line', { x1: ox, x2: ox + W2 - 40, y1: sy(tv), y2: sy(tv), stroke: '#fff', 'stroke-opacity': tv ? .07 : .25 }, s);
      const tt = svg('text', { x: ox + W2 - 30, y: sy(tv) + 7, fill: '#8ea0c6', 'font-family': 'JetBrains Mono', 'font-size': 19 }, s);
      tt.textContent = tv + unit;
    }
    for (let yr0 = Math.ceil(xr[0]); yr0 <= xr[1]; yr0++) {
      const tt = svg('text', { x: sx(yr0), y: oy + H2 + 36, 'text-anchor': 'middle', fill: '#8ea0c6', 'font-family': 'JetBrains Mono', 'font-size': 19 }, s);
      tt.textContent = yr0;
    }
    const path = svg('path', { d: pathFrom(data, sx, sy, .15), fill: 'none', stroke: col, 'stroke-width': 5.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, s);
    return { P, s, sx, sy, path };
  };
  const nv = chart(130, ['Nvidia', 'Börsenwert in Billionen US-$ · KI-Chips'], 'cpu', '#41f0a6',
    [[2022.0, .73], [2022.45, .42], [2022.8, .28], [2023.0, .36], [2023.4, 1.0], [2023.9, 1.2], [2024.15, 2.0], [2024.43, 3.0], [2024.6, 2.9], [2024.95, 3.3], [2025.27, 2.4], [2025.52, 4.0], [2025.83, 5.0]],
    [2022, 2026], [0, 5.4], [0, 1, 2, 3, 4, 5], '');
  const zm = chart(1000, ['Zoom', 'Aktienkurs in US-$ · Videokonferenzen'], 'users', '#ff5c7a',
    [[2019.9, 68], [2020.1, 72], [2020.25, 150], [2020.45, 250], [2020.65, 440], [2020.8, 589], [2021.1, 400], [2021.4, 320], [2021.9, 190], [2022.5, 105], [2022.78, 70], [2023.4, 63], [2024.5, 60], [2025.0, 80], [2025.88, 81]],
    [2019.8, 2026], [0, 640], [0, 200, 400, 600], '');
  const tN = S.cue('m2', ['nvidia']) - .6;
  tl.fromTo(nv.P, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, tN - .2);
  drawIn(tl, nv.path, tN + .2, 2.4, 'power1.inOut');
  const nvMark = box(nv.P, nv.sx(2025.52) - 15, nv.sy(4.0) - 15, 30, 30, '', '', 'border-radius:50%;background:#41f0a6;box-shadow:0 0 30px #41f0a6');
  const nvLab = box(nv.P, 60, 120, 600, 120, '', '<div class="num c-mint" style="font-size:66px">&gt; 4 Billionen $</div><div class="tiny">9. Juli 2025: erstes Unternehmen über dieser Marke</div>');
  const t4 = S.cue('m2', ['vier', 'billionen']) - .2;
  popIn(tl, nvMark, t4);
  revealUp(tl, nvLab, t4 + .05, { y: 14 });
  sfx(t4, 'rise', .5);

  const tZ = S.cue('m2', ['zoom']) - .5;
  tl.fromTo(zm.P, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, tZ - .2);
  // erst Aufstieg, dann Absturz: gleicher Pfad, zweistufig gezeichnet
  const zl = zm.path.getTotalLength();
  let best = 0, minY = 1e9;
  for (let i = 0; i <= 400; i++) { const pt = zm.path.getPointAtLength(zl * i / 400); if (pt.y < minY) { minY = pt.y; best = i / 400; } }
  tl.fromTo(zm.path, { drawSVG: '0% 0%' }, { drawSVG: `0% ${(best * 100).toFixed(1)}%`, duration: 1.2, ease: 'power2.in' }, tZ + .2);
  const tV = S.cue('m2', ['verlor']) - .2;
  tl.to(zm.path, { drawSVG: '0% 100%', duration: 1.8, ease: 'power2.out' }, tV);
  const zPeak = box(zm.P, zm.sx(2020.8) - 14, zm.sy(589) - 14, 28, 28, '', '', 'border-radius:50%;background:#ffb547;box-shadow:0 0 26px #ffb547');
  const zPeakLab = box(zm.P, zm.sx(2020.8) + 26, zm.sy(589) - 30, 330, 70, '', '<div class="mono" style="font-size:22px;color:#ffd08a;font-weight:600">Hoch: Okt. 2020</div><div class="tiny">Homeoffice-Hype</div>');
  popIn(tl, zPeak, S.cue('m2', ['explodierte']) - .1);
  revealUp(tl, zPeakLab, S.cue('m2', ['explodierte']), { y: 10 });
  sfx(S.cue('m2', ['explodierte']), 'rise', .45);
  const zLab = box(zm.P, 400, 330, 360, 120, '', '<div class="num c-coral" style="font-size:84px">−86 %</div><div class="tiny">bis Nov. 2025</div>');
  revealUp(tl, zLab, tV + 1.0, { y: 14 });
  sfx(tV + 1.0, 'down', .55);
  const foot = box(B, 130, 862, 1660, 40, 'tiny', 'vereinfachte Darstellung, gerundete Werte – keine Anlageempfehlung', 'font-size:19px');
  revealUp(tl, foot, tZ + .5, { y: 8 });
  source(m2.start, m2.end + .2, 'Kursdaten gerundet: <b>Nvidia</b> 4 Bio. $ am 9.7.2025 · <b>Zoom</b> Hoch 588,84 $ (19.10.2020), ≈ 81 $ (Nov. 2025)');

  // --- m3: Algorithmen + junge Anleger ---
  const tC = m3.start - .25;
  tl.to(B, { opacity: 0, y: -40, filter: 'blur(10px)', duration: .55, ease: 'power2.in' }, tC);
  sfx(tC, 'whoosh', .45);
  const Cc = box(root, 0, 0, 1920, 1080);
  const flow = el('canvas', { attrs: { width: 1920, height: 1080 }, css: 'position:absolute;left:0;top:0;opacity:0' }, Cc);
  const fg = flow.getContext('2d');
  const RS = rng(77);
  const streaks = Array.from({ length: 90 }, () => ({ y: 150 + RS() * 520, sp: 900 + RS() * 1800, ph: RS() * 4000, len: 60 + RS() * 220, col: RS() < .5 ? '59,227,255' : (RS() < .5 ? '65,240,166' : '255,92,122') }));
  FRAME.push(t => {
    if (t < m3.start - .5 || t > S.end) return;
    fg.clearRect(0, 0, 1920, 1080);
    for (const s of streaks) {
      const x = ((s.ph + t * s.sp) % 2400) - 240;
      const gr = fg.createLinearGradient(x - s.len, 0, x, 0);
      gr.addColorStop(0, `rgba(${s.col},0)`); gr.addColorStop(1, `rgba(${s.col},.85)`);
      fg.fillStyle = gr; fg.fillRect(x - s.len, s.y, s.len, 2.4);
      fg.fillStyle = `rgba(${s.col},1)`; fg.fillRect(x - 3, s.y - 1.5, 5, 5.4);
    }
  });
  tl.to(flow, { opacity: 1, duration: .6 }, m3.start - .1);
  const alg = box(Cc, 150, 170, 1000, 140, '');
  alg.innerHTML = `<div class="kicker">Handel in Millisekunden</div><div class="h-sm" style="margin-top:10px;display:flex;gap:18px;align-items:center">${icon('bot', 56, '#7fe9ff', 1.8)} Immer mehr Orders kommen von Algorithmen</div>`;
  revealUp(tl, alg.children, m3.start, { stagger: .1 });
  sfx(m3.start, 'swipe', .4);

  const tY = S.cue('m3', ['junge']) - .3;
  tl.to(flow, { opacity: .25, duration: .6 }, tY);
  const inv = box(Cc, 150, 520, 1620, 360, 'glass tint-cyan', '', 'padding:40px 50px;display:flex;align-items:center;gap:70px');
  inv.innerHTML = '<div class="row ppl" style="gap:22px"></div><div><div class="num grad" style="font-size:120px;line-height:1"><span class="v">0,0</span> Mio.</div>' +
    '<div class="body" style="font-size:31px;margin-top:10px">Menschen in Deutschland besaßen 2025 Aktien, Fonds oder ETFs – <b>jede/r Fünfte</b> ab 14 Jahren. Größte Gruppe: <b>14- bis 39-Jährige</b>.</div></div>';
  const ppl = inv.querySelector('.ppl');
  const figs = [];
  for (let i = 0; i < 5; i++) figs.push(el('span', { html: icon('user', 92, i === 2 ? '#3be3ff' : '#55648c', 1.8) }, ppl));
  revealUp(tl, inv, tY, { y: 30 });
  tl.fromTo(figs, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .4, stagger: .08 }, tY + .2);
  const tF = S.cue('m3', ['fünfte', 'fuenfte', 'jeder']) - .1;
  tl.to(figs[2], { scale: 1.18, y: -12, duration: .5, ease: 'back.out(2.5)' }, tF);
  tl.to(figs[2].querySelector('.ico'), { filter: 'drop-shadow(0 0 18px #3be3ff)', duration: .5 }, tF);
  countUp(tl, inv.querySelector('.v'), 0, 14.1, tY + .5, 1.4, v => fmtDE(v, 1));
  sfx(tF, 'pop', .55);
  source(m3.start, S.end - .2, '<b>Deutsches Aktieninstitut</b>: Aktionärszahlen 2025 (Jan. 2026) – Rekord, 19,9 % der Bevölkerung ab 14');
}
