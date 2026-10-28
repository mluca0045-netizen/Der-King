// Kapitel 2: Von Arbeit 1.0 zu 4.0 – und: KI übernimmt Tätigkeiten, nicht Berufe
function S02(tl, S) {
  const root = makeScene('history');
  const h1 = S.L('h1'), h2 = S.L('h2');
  sceneInOut(tl, root, S);

  const head = box(root, 120, 150, 1680, 120, '');
  head.innerHTML = '<div class="kicker">Rückblick</div><div class="h-md" style="margin-top:10px">Wie es so weit kam</div>';
  revealUp(tl, head.children, S.start + .2, { stagger: .1 });

  const stage = box(root, 0, 0, 1920, 1080);
  const sv = svg('svg', { width: 1920, height: 1080, class: 'abs', style: 'left:0;top:0' }, stage);
  const defs = svg('defs', {}, sv);
  const lg = svg('linearGradient', { id: 'histLine', x1: 0, y1: 0, x2: 1, y2: 0 }, defs);
  [[0, '#4c8dff', .5], [.7, '#3be3ff', 1], [1, '#8b6cff', 1]].forEach(([o, c, op]) => svg('stop', { offset: o, 'stop-color': c, 'stop-opacity': op }, lg));
  const base = svg('path', { d: 'M230,570 L1690,570', stroke: 'url(#histLine)', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, sv);

  const nodes = [
    ['1.0', 'cog', 'Dampfmaschine', 'Mechanisierung · ab ca. 1800', ['dampfmaschine']],
    ['2.0', 'factory', 'Fließband & Strom', 'Massenproduktion · ab ca. 1900', ['fließband', 'fliessband']],
    ['3.0', 'monitor', 'Computer', 'Automatisierung · ab ca. 1970', ['computer']],
    ['4.0', 'brain-circuit', 'Daten & KI', 'Vernetzung · heute', ['stufe', 'vier']],
  ];
  const xs = [330, 750, 1170, 1590];
  const tStart = S.cue('h1', ['dampfmaschine']) - .5;
  drawIn(tl, base, tStart, Math.max(1.5, S.cue('h1', ['stufe', 'vier']) - tStart), 'power1.inOut');
  const nodeEls = nodes.map(([v, ic, name, sub, q], i) => {
    const x = xs[i];
    const last = i === 3;
    const t = S.cue('h1', q) - .1;
    const ver = box(stage, x - 150, 372, 300, 60, 'center',
      `<span class="mono" style="font-size:${last ? 46 : 38}px;font-weight:700;${last ? '' : 'color:var(--cyan)'}" ${last ? 'class="grad"' : ''}>${v}</span>`);
    if (last) ver.firstChild.classList.add('grad');
    const c = box(stage, x - 86, 570 - 86, 172, 172, 'glass' + (last ? ' tint-violet' : ''), icon(ic, 76, last ? '#c9bcff' : '#cfe6ff', 1.6),
      'border-radius:50%;display:flex;align-items:center;justify-content:center;');
    const lab = box(stage, x - 190, 690, 380, 120, 'center',
      `<div style="font:750 40px var(--display)">${name}</div><div class="tiny" style="margin-top:8px">${sub}</div>`);
    popIn(tl, c, t, { from: .3 });
    revealUp(tl, [ver, lab], t + .1, { y: 18, stagger: .08, d: .6 });
    sfx(t, last ? 'impact' : 'pop', last ? .7 : .5);
    if (last) {
      const glow = box(stage, x - 130, 570 - 130, 260, 260, '', '', 'border-radius:50%;border:2px solid rgba(139,108,255,.6);box-shadow:0 0 60px rgba(139,108,255,.45);opacity:0');
      tl.fromTo(glow, { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .9, ease: 'power3.out' }, t + .1);
      tl.to(glow, { scale: 1.12, opacity: .45, duration: 1.2, yoyo: true, repeat: 3, ease: 'sine.inOut' }, t + 1);
      return [ver, c, lab, glow];
    }
    return [ver, c, lab];
  });
  source(S.start + .5, h2.start - .3, 'Begriff <b>„Arbeiten 4.0“</b>: Grünbuch des Bundesarbeitsministeriums (BMAS), 2015');

  // --- Tätigkeiten statt Berufe ---
  const tOut = h2.start - .25;
  tl.to([stage, head], { y: -60, opacity: 0, filter: 'blur(10px)', duration: .6, ease: 'power2.in' }, tOut);
  sfx(tOut, 'whoosh', .45);

  const q = box(root, 120, 150, 1680, 120, '');
  q.innerHTML = '<div class="kicker">Das Wichtigste vorweg</div><div class="h-md" style="margin-top:10px">KI ersetzt selten ganze Berufe.</div>';
  revealUp(tl, q.children, h2.start + .05, { stagger: .1 });

  const panel = box(root, 260, 340, 1400, 520, 'glass');
  const ptitle = box(panel, 60, 44, 1280, 60, 'row', '', 'gap:18px;justify-content:space-between');
  ptitle.innerHTML = `<div class="row" style="gap:18px">${icon('briefcase', 44, '#cfe6ff', 1.8)}<span style="font:750 40px var(--display)">Beispiel: ein Bürojob</span></div>` +
    '<span class="tiny" style="font-size:22px">= viele einzelne Tätigkeiten</span>';
  const tasks = [
    ['Belege erfassen', 1], ['Kunden beraten', 0], ['Daten abgleichen', 1], ['Entscheiden', 0],
    ['Standardbriefe', 1], ['Verhandeln', 0], ['Termine planen', 1], ['Team führen', 0],
  ];
  const tiles = tasks.map(([name, routine], i) => {
    const x = 60 + (i % 4) * 326, y = 150 + Math.floor(i / 4) * 130;
    const tile = box(panel, x, y, 300, 104, '', '', 'border-radius:20px;border:1.5px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);display:flex;align-items:center;gap:16px;padding:0 24px;');
    tile.innerHTML = `<span class="ti">${icon(routine ? 'file-text' : 'user', 34, '#cfe6ff', 1.8)}</span><span style="font:650 29px var(--sans);white-space:nowrap">${name}</span>`;
    return { tile, routine };
  });
  tl.fromTo(panel, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' }, h2.start + .3);
  revealUp(tl, ptitle, h2.start + .45, { y: 16 });
  revealUp(tl, tiles.map(o => o.tile), h2.start + .55, { y: 24, d: .5, stagger: .05 });

  const tT = S.cue('h2', ['tätigkeiten', 'taetigkeiten', 'einzelne']) - .2;
  tiles.forEach(({ tile, routine }, i) => {
    if (routine) {
      tl.to(tile, { borderColor: 'rgba(139,108,255,.9)', background: 'rgba(139,108,255,.22)', y: -8, duration: .45, ease: 'power2.out' }, tT + i * .04);
      tl.to(tile.querySelector('.ti'), { opacity: 0, duration: .15 }, tT + i * .04);
      tl.set(tile.querySelector('.ti'), { innerHTML: icon('bot', 34, '#c9bcff', 1.8) }, tT + i * .04 + .15);
      tl.to(tile.querySelector('.ti'), { opacity: 1, duration: .2 }, tT + i * .04 + .16);
    } else {
      tl.to(tile, { borderColor: 'rgba(65,240,166,.85)', background: 'rgba(65,240,166,.14)', duration: .45 }, tT + .35 + i * .04);
    }
  });
  sfx(tT, 'swell', .5);
  const legend = box(panel, 60, 430, 1280, 50, 'row', '', 'gap:40px');
  legend.innerHTML = '<span class="chip violet"><span class="dot"></span>KI übernimmt Routine</span><span class="chip mint"><span class="dot"></span>Mensch: Urteil & Beziehung</span>';
  revealUp(tl, legend.children, tT + .6, { y: 12, stagger: .15 });
  source(h2.start, S.end - .2, 'Konzept „Substituierbarkeitspotenzial“: <b>IAB</b> – bewertet einzelne Tätigkeiten, nicht ganze Berufe');
}
