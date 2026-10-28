// Kapitel 7: Aufstieg – die fehlende unterste Sprosse
function S07(tl, S) {
  const root = makeScene('career');
  const c1 = S.L('c1'), c2 = S.L('c2'), c3 = S.L('c3');
  sceneInOut(tl, root, S);

  const head = box(root, 150, 150, 1200, 130, '');
  head.innerHTML = '<div class="kicker">Karriereleiter</div><div class="h-md" style="margin-top:8px">Am härtesten ist der Einstieg</div>';
  revealUp(tl, head.children, c1.start - .1, { stagger: .1 });

  const LX1 = 360, LX2 = 560, TOP = 330, BOT = 920;
  const rungsY = [850, 700, 550, 400];
  const labels = ['Einstieg', 'Fachkraft', 'Expertise', 'Leitung'];
  const sv = svg('svg', { width: 1920, height: 1080, class: 'abs', style: 'left:0;top:0' }, root);
  const rails = [LX1, LX2].map(x => svg('line', { x1: x, x2: x, y1: BOT, y2: TOP, stroke: '#9fb4ff', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: .85 }, sv));
  const rungs = rungsY.map(y => svg('line', { x1: LX1, x2: LX2, y1: y, y2: y, stroke: '#cfe0ff', 'stroke-width': 10, 'stroke-linecap': 'round' }, sv));
  drawIn(tl, rails, c1.start, .8, 'power2.out');
  drawIn(tl, rungs, c1.start + .4, .4, 'power2.out', .08);
  const labs = rungsY.map((y, i) => {
    const l = box(root, LX2 + 40, y - 24, 380, 50, '', `<span style="font:700 32px var(--sans)">${labels[i]}</span>`);
    revealUp(tl, l, c1.start + .5 + i * .08, { y: 10, d: .4 });
    return l;
  });
  const person = box(root, (LX1 + LX2) / 2 - 40, BOT - 60, 80, 80, '', icon('user-round', 80, '#7fe9ff', 1.9));
  popIn(tl, person, c1.start + .7, { from: .5 });

  // KI nimmt die Einstiegsaufgaben
  const tasks = ['Recherche', 'Protokolle', 'erste Entwürfe', 'Tabellen'];
  const tA = S.cue('c1', ['aufgaben', 'erledigt']) - .3;
  const bot = box(root, 1560, 760, 160, 160, 'glass tint-violet', icon('bot', 86, '#c9bcff', 1.7), 'border-radius:40px;display:flex;align-items:center;justify-content:center');
  popIn(tl, bot, tA - .2, { from: .5 });
  const chipEls = tasks.map((t, i) => {
    const c = box(root, 820 + (i % 2) * 300, 770 + Math.floor(i / 2) * 76, 270, 60, '', `<span class="chip muted" style="font-size:18px">${t}</span>`);
    revealUp(tl, c, tA + i * .1, { y: 12, d: .35 });
    tl.to(c, { x: 1600 - (820 + (i % 2) * 300), y: 830 - (770 + Math.floor(i / 2) * 76), scale: .3, opacity: 0, duration: .7, ease: 'power2.in' }, tA + 1.3 + i * .12);
    return c;
  });
  sfx(tA + 1.3, 'swipe', .5);
  tl.to(labs[0], { opacity: .4, duration: .4 }, tA + 1.6);

  // c2: Stanford-Befund + Sprosse bricht
  const stat = box(root, 1060, 330, 720, 340, 'glass tint-coral', '', 'padding:40px 46px');
  stat.innerHTML = '<div class="kicker" style="color:var(--coral)">USA · Stanford-Studie 2025</div>' +
    '<div class="num" style="font-size:150px;line-height:1;margin-top:12px;color:#ff8da1">−<span class="v">0</span> %</div>' +
    '<div class="body" style="font-size:30px;margin-top:10px">Beschäftigung der <b>22- bis 25-Jährigen</b> in stark KI-betroffenen Berufen – relativ zu weniger betroffenen Berufen.</div>';
  const tS = S.cue('c2', ['stanford']) - .3;
  tl.to(bot, { opacity: 0, scale: .6, duration: .4 }, tS - .2);
  revealUp(tl, stat, tS, { y: 30 });
  const t16 = S.cue('c2', ['sechzehn', '16']);
  const tc16 = Math.max(tS + .4, t16 - 1.2);
  const num16 = stat.querySelector('.num');
  tl.fromTo(num16, { opacity: 0 }, { opacity: 1, duration: .25 }, tc16);
  countUp(tl, stat.querySelector('.v'), 0, 16, tc16, Math.max(.8, t16 - tc16), v => Math.round(v));
  sfx(tc16, 'down', .55);
  source(c1.start, c2.end + .2, '<b>Brynjolfsson, Chandar &amp; Chen</b>: „Canaries in the Coal Mine?“, Stanford Digital Economy Lab (Nov. 2025)');

  const tBreak = S.cue('c2', ['sprosse', 'unterste']) - .2;
  const r0 = rungs[0];
  const halfL = svg('line', { x1: LX1, x2: (LX1 + LX2) / 2 - 6, y1: rungsY[0], y2: rungsY[0], stroke: '#ff8da1', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0 }, sv);
  const halfR = svg('line', { x1: (LX1 + LX2) / 2 + 6, x2: LX2, y1: rungsY[0], y2: rungsY[0], stroke: '#ff8da1', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0 }, sv);
  tl.to(r0, { opacity: 0, duration: .05 }, tBreak);
  tl.set([halfL, halfR], { opacity: 1 }, tBreak);
  tl.to(halfL, { rotation: -38, y: 160, opacity: 0, transformOrigin: '0% 50%', duration: 1.1, ease: 'power2.in' }, tBreak + .05);
  tl.to(halfR, { rotation: 42, y: 170, opacity: 0, transformOrigin: '100% 50%', duration: 1.1, ease: 'power2.in' }, tBreak + .05);
  tl.to(labs[0], { opacity: 0, x: -20, duration: .4 }, tBreak);
  const gapLab = box(root, LX2 + 40, rungsY[0] - 24, 460, 50, '', '<span class="chip coral" style="font-size:18px"><span class="dot"></span>unterste Sprosse fehlt</span>');
  revealUp(tl, gapLab, tBreak + .3, { y: 10 });
  tl.to(person, { y: -26, duration: .18, yoyo: true, repeat: 1, ease: 'power2.out' }, tBreak + .2);
  sfx(tBreak, 'break', .7);

  // c3: neue Sprossen, Aufstieg, Verantwortung
  const tN = S.cue('c3', ['projekte', 'echte']) - .3;
  const newR = svg('line', { x1: LX1, x2: LX2, y1: rungsY[0], y2: rungsY[0], stroke: '#41f0a6', 'stroke-width': 12, 'stroke-linecap': 'round' }, sv);
  drawIn(tl, newR, tN, .5, 'power2.out');
  tl.to(gapLab, { opacity: 0, duration: .3 }, tN);
  const nl1 = box(root, LX2 + 40, rungsY[0] - 26, 560, 54, '', `<span class="chip mint" style="font-size:19px">${icon('rocket', 22, '#41f0a6', 2)} echte Projekte · Praktika · Ausbildung</span>`);
  revealUp(tl, nl1, tN + .1, { y: 10 });
  sfx(tN, 'pop', .55);
  const tL = S.cue('c3', ['lernen']) - .3;
  const nl2 = box(root, LX2 + 300, rungsY[1] - 26, 360, 54, '', `<span class="chip cyan" style="font-size:19px">${icon('book-open', 22, '#3be3ff', 2)} nie aufhören zu lernen</span>`);
  revealUp(tl, nl2, tL, { y: 10 });
  tl.to(person, { y: -(BOT - 60 - (rungsY[1] - 80)), duration: .9, ease: 'power2.inOut' }, tL + .1);
  tl.to(person, { y: -(BOT - 60 - (rungsY[2] - 80)), duration: .8, ease: 'power2.inOut' }, tL + 1.0);
  sfx(tL + .1, 'rise', .45);
  const tR = S.cue('c3', ['verantwortung']) - .2;
  tl.to(rungs[3], { stroke: '#ffb547', duration: .4 }, tR);
  tl.to(person, { y: -(BOT - 60 - (rungsY[3] - 80)), duration: .8, ease: 'power2.inOut' }, tR - .1);
  tl.to(labs[3], { opacity: 0, duration: .3 }, tR);
  const resp = box(root, LX2 + 40, rungsY[3] - 40, 1000, 84, 'glass tint-amber', '', 'border-radius:22px;display:flex;align-items:center;gap:18px;padding:0 26px;white-space:nowrap');
  resp.innerHTML = `${icon('signature', 46, '#ffb547', 1.8)}<span style="font:750 32px var(--display)">Verantwortung übernehmen kann keine Maschine</span>`;
  revealUp(tl, resp, tR + .1, { y: 14 });

  // Zamirs Weg als Beispiel
  const way = box(root, 1250, 470, 540, 250, 'glass tint-amber', '', 'padding:24px 30px;border-radius:24px');
  const steps = [['graduation-cap', 'Ausbildung', ['ausbildung']], ['wrench', 'Meister', ['meister']], ['building', 'eigener Betrieb', ['betrieb']]];
  way.innerHTML = '<div class="tiny" style="letter-spacing:.16em;color:#ffb547">ZAMIRS WEG · SZENARIO</div><div class="col st" style="gap:12px;margin-top:16px"></div>';
  const col = way.querySelector('.st');
  revealUp(tl, way, S.cue('c3', ['ausbildung']) - .4, { y: 18 });
  steps.forEach(([ic, label, q]) => {
    const st = el('div', { cls: 'row', css: 'gap:14px;font:700 30px var(--sans);white-space:nowrap', html: `${icon(ic, 34, '#ffb547', 1.9)}${label}` }, col);
    tl.fromTo(st, { opacity: .15, x: -8 }, { opacity: 1, x: 0, duration: .3 }, S.cue('c3', q) - .1);
  });
  sfx(S.cue('c3', ['ausbildung']) - .2, 'blip', .4);
  tl.to(stat, { opacity: 0, x: 80, filter: 'blur(6px)', duration: .5, ease: 'power2.in' }, tN - .2);
  sfx(tR, 'impact', .55);
}
