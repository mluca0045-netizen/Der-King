// Kapitel 1: Ein Dienstag im Jahr 2040 – Zukunftsszene
function S01(tl, S) {
  const root = makeScene('scene2040');
  const nova = S.L('nova1'), a = S.L('s1a'), b = S.L('s1b');
  sceneInOut(tl, root, S, { drift: false });

  // --- Fensterblick ---
  const winWrap = box(root, 0, 0, 1920, 1080);
  const win = buildWindow(winWrap, { id: 'w1', from: S.start - .5, to: S.end + .5 });
  tl.fromTo(win.sun, { y: 820 }, { y: 690, duration: S.dur, ease: 'none' }, S.start);
  tl.fromTo(win.stars, { opacity: .85 }, { opacity: .15, duration: S.dur * .8, ease: 'none' }, S.start);
  tl.fromTo(winWrap, { scale: 1.06 }, { scale: 1.0, duration: b.start - S.start + .4, ease: 'sine.out' }, S.start);
  const dim = box(root, 0, 0, 1920, 1080, '', '', 'background:linear-gradient(90deg,rgba(4,7,20,.86),rgba(4,7,20,.55));opacity:0');

  // --- NOVA-Panel ---
  const panel = box(root, 1150, 150, 640, 640, 'glass tint-cyan');
  const orbWrap = box(panel, 40, 38, 96, 96);
  const ring2 = box(orbWrap, -18, -18, 132, 132, '', '', 'border-radius:50%;border:1.5px solid rgba(59,227,255,.35)');
  const ring1 = box(orbWrap, -6, -6, 108, 108, '', '', 'border-radius:50%;border:2px solid rgba(139,108,255,.55)');
  const orb = box(orbWrap, 0, 0, 96, 96, '', '',
    'border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffffff 0%,#b8f4ff 18%,#3be3ff 45%,#6d5bff 80%,#3a2a9a 100%);box-shadow:0 0 50px rgba(59,227,255,.7)');
  box(panel, 164, 46, 300, 40, '', '<span style="font:800 34px var(--display);letter-spacing:.02em">NOVA</span>');
  box(panel, 164, 90, 420, 30, 'tiny', 'KI-ASSISTENZ · ONLINE', 'letter-spacing:.16em;color:var(--cyan);white-space:nowrap');
  box(panel, 440, 50, 160, 40, 'mono', '07:31', 'font-size:32px;font-weight:600;text-align:right;color:var(--ink2)');
  const greet = box(panel, 40, 178, 560, 60, 'h-sm', 'Guten Morgen, Lea.', 'font-size:46px');
  const row = (y, ic, col, big, small) => {
    const r = box(panel, 40, y, 560, 112, 'glass', '', 'border-radius:22px;display:flex;align-items:center;gap:22px;padding:0 26px;');
    r.innerHTML = icon(ic, 46, col, 2) + `<div><div style="font:700 32px var(--sans)">${big}</div><div class="tiny" style="margin-top:4px">${small}</div></div>`;
    return r;
  };
  const r1 = row(268, 'circle-check', 'var(--mint)', '41 Aufgaben erledigt', 'über Nacht · 3 KI-Agenten');
  const r2 = row(398, 'triangle-alert', 'var(--amber)', '2 Entscheidungen', 'warten auf dich · Priorität hoch');
  const r3 = row(528, 'calendar-days', 'var(--cyan)', '09:30 · Team-Call', 'Lissabon · Seoul · Leipzig');

  tl.fromTo(panel, { opacity: 0, x: 60, filter: 'blur(10px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .8, ease: 'power3.out' }, S.start + .4);
  sfx(S.start + .45, 'blip', .7);
  revealUp(tl, greet, nova.start + .05, { y: 20 });
  revealUp(tl, r1, S.cue('nova1', ['41', 'einundvierzig']) - .1, { y: 24 });
  sfx(S.cue('nova1', ['41', 'einundvierzig']), 'blip', .5);
  revealUp(tl, r2, S.cue('nova1', ['entscheidungen']) - .15, { y: 24 });
  sfx(S.cue('nova1', ['entscheidungen']), 'blip', .5);
  revealUp(tl, r3, nova.end + .1, { y: 24 });
  sfx(nova.end + .1, 'blip', .35);
  FRAME.push(t => {
    if (t < S.start || t > S.end) return;
    const lv = voiceLevel(t, 'nova');
    const pulse = 1 + lv * .16 + .02 * Math.sin(t * 2.4);
    orb.style.transform = `scale(${pulse.toFixed(3)})`;
    ring1.style.transform = `scale(${(1 + lv * .28).toFixed(3)}) rotate(${(t * 40) % 360}deg)`;
    ring2.style.transform = `scale(${(1 + lv * .42).toFixed(3)})`;
    ring2.style.opacity = (.35 + lv * .65).toFixed(2);
  });

  // --- Arbeitsteilung Mensch/KI (s1a) ---
  const tA = a.start - .1;
  tl.to(panel, { x: 120, opacity: 0, filter: 'blur(8px)', duration: .6, ease: 'power2.in' }, tA);
  tl.to(dim, { opacity: 1, duration: .8 }, tA);
  const prof = box(root, 200, 170, 900, 120, 'row', '', 'gap:28px;');
  prof.innerHTML = '<div style="width:110px;height:110px;border-radius:50%;background:linear-gradient(135deg,#3be3ff,#8b6cff);display:flex;align-items:center;justify-content:center;font:800 42px var(--display);box-shadow:0 0 40px rgba(59,227,255,.45)">LM</div>' +
    '<div><div class="h-sm" style="font-size:52px">Lea M., 32</div><div class="small" style="display:flex;align-items:center;gap:12px;margin-top:6px">' +
    icon('battery-charging', 34, 'var(--mint)', 2) + 'Projektleiterin · Batteriespeicher</div></div>';
  revealUp(tl, prof.children, S.cue('s1a', ['leite', 'projekte']) - .2, { stagger: .12 });
  sfx(S.cue('s1a', ['leite']), 'blip', .45);

  const agents = [['Agent 1', 'Berichte schreiben', 1.9], ['Agent 2', 'Angebote rechnen', 2.6], ['Agent 3', 'Anfragen beantworten', 2.2]];
  const tAg = S.cue('s1a', ['ki', 'agenten']) - .15;
  const cards = agents.map(([n, task, sp], i) => {
    const c = box(root, 200 + i * 520, 380, 480, 200, 'glass tint-violet', '', 'padding:28px 30px;');
    c.innerHTML = `<div class="row" style="gap:16px">${icon('bot', 44, '#b3a1ff', 2)}<div><div class="tiny" style="letter-spacing:.16em;color:#b3a1ff">${n.toUpperCase()}</div>` +
      `<div style="font:700 31px var(--sans);margin-top:2px">${task}</div></div></div>` +
      `<div style="margin-top:30px;height:10px;border-radius:6px;background:rgba(255,255,255,.08);overflow:hidden"><div class="pb" style="height:100%;width:100%;transform-origin:0 50%;transform:scaleX(0);background:linear-gradient(90deg,#8b6cff,#3be3ff)"></div></div>` +
      `<div class="tiny st" style="margin-top:12px">läuft …</div>`;
    const t0 = tAg + i * .22;
    revealUp(tl, c, t0, { y: 30 });
    tl.to(c.querySelector('.pb'), { scaleX: 1, duration: sp, ease: 'power1.inOut' }, t0 + .4);
    tl.set(c.querySelector('.st'), { innerHTML: '<span style="color:var(--mint)">✓ erledigt</span>' }, t0 + .4 + sp);
    sfx(t0, 'tick', .3);
    return c;
  });
  const dec = box(root, 450, 660, 1020, 150, 'glass tint-mint', '', 'display:flex;align-items:center;gap:28px;padding:0 40px;');
  dec.innerHTML = icon('signature', 62, 'var(--mint)', 1.8) +
    '<div><div class="tiny" style="letter-spacing:.18em;color:var(--mint)">MENSCH</div><div style="font:750 40px var(--display)">entscheiden · verhandeln · verantworten</div></div>';
  const lines = svg('svg', { width: 1920, height: 1080, class: 'abs', style: 'left:0;top:0' }, root);
  const conn = [440, 960, 1480].map(x => svg('path', { d: `M${x},580 C${x},630 960,620 960,660`, fill: 'none', stroke: '#41f0a6', 'stroke-width': 2.5, 'stroke-dasharray': '2 9', 'stroke-linecap': 'round', opacity: .8 }, lines));
  const tDec = S.cue('s1a', ['entscheide']) - .1;
  drawIn(tl, conn, tDec - .3, .6, 'power2.out', .05);
  revealUp(tl, dec, tDec, { y: 26 });
  sfx(tDec, 'pop', .6);

  // --- Team weltweit + Woche (s1b) ---
  const tB = b.start - .2;
  tl.to([prof, ...cards, dec, lines], { opacity: 0, y: -20, filter: 'blur(8px)', duration: .55, ease: 'power2.in', stagger: .03 }, tB - .1);
  tl.to(winWrap, { opacity: 0, duration: .8 }, tB);
  tl.to(dim, { opacity: 0, duration: .8 }, tB + .3);
  sfx(tB, 'whoosh', .5);

  const map = svg('svg', { width: 1920, height: 1080, class: 'abs', style: 'left:0;top:0' }, root);
  const K = 1.55, ox = 960 - 1030 * K, oy = 440 - 150 * K;
  const mg = svg('g', { transform: `translate(${ox},${oy}) scale(${K})` }, map);
  const P = (c) => [c[0] * K + ox, c[1] * K + oy];
  const C = WORLD.cities;
  for (const [x, y] of WORLD.dots) {
    const sx = x * K + ox, sy = y * K + oy;
    if (sx < -20 || sx > 1940 || sy < -20 || sy > 1100) continue;
    let near = 1e9;
    for (const c of Object.values(C)) near = Math.min(near, Math.hypot(c[0] - x, c[1] - y));
    const glow = clamp(1 - near / 140);
    svg('circle', { cx: x, cy: y, r: 3.1, fill: glow > .02 ? `rgb(${lerp(90, 120, glow) | 0},${lerp(120, 230, glow) | 0},255)` : '#5a6fb8', opacity: (.32 + glow * .5).toFixed(2) }, mg);
  }
  tl.fromTo(map, { opacity: 0, scale: .92, transformOrigin: '50% 45%' }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, tB + .2);

  const arcs = svg('g', {}, map);
  const pLe = P(C.Leipzig), pLi = P(C.Lissabon), pSe = P(C.Seoul);
  const arc1 = svg('path', { d: `M${pLe} Q${(pLe[0] + pLi[0]) / 2 - 40},${Math.min(pLe[1], pLi[1]) - 80} ${pLi}`, fill: 'none', stroke: '#3be3ff', 'stroke-width': 3, opacity: .9 }, arcs);
  const arc2 = svg('path', { d: `M${pLe} Q${(pLe[0] + pSe[0]) / 2},${Math.min(pLe[1], pSe[1]) - 230} ${pSe}`, fill: 'none', stroke: '#8b6cff', 'stroke-width': 3, opacity: .9 }, arcs);
  const pulses = [arc1, arc2].map((p, i) => ({ p, c: svg('circle', { r: 6, fill: '#fff', opacity: 0 }, arcs), len: 0, i }));

  const pin = (p, name, time, dx, dy, tcue, anchorRight = false) => {
    const g = box(root, p[0] - 13, p[1] - 13, 26, 26, '', '', 'border-radius:50%;background:#fff;box-shadow:0 0 0 7px rgba(59,227,255,.25),0 0 26px #3be3ff;');
    const ring = box(root, p[0] - 13, p[1] - 13, 26, 26, '', '', 'border-radius:50%;border:2px solid #3be3ff;opacity:0;');
    const lab = box(root, p[0] + dx, p[1] + dy, 260, 80, '', `<div style="font:750 36px var(--display)">${name}</div><div class="tiny" style="color:var(--cyan);font-size:22px">${time}</div>`, anchorRight ? 'text-align:right' : '');
    popIn(tl, g, tcue - .1, { from: .2 });
    tl.fromTo(ring, { scale: 1, opacity: .9 }, { scale: 3.4, opacity: 0, duration: 1.4, repeat: 3, ease: 'power1.out', immediateRender: false }, tcue);
    revealUp(tl, lab, tcue, { y: 14, d: .55 });
    sfx(tcue, 'pop', .55);
    return [g, ring, lab];
  };
  const tLi = S.cue('s1b', ['lissabon']), tSe = S.cue('s1b', ['seoul']), tLe = S.cue('s1b', ['leipzig']);
  const pinsEls = [
    ...pin(pLi, 'Lissabon', '06:31 Uhr', -290, 6, tLi, true),
    ...pin(pSe, 'Seoul', '15:31 Uhr', 28, -86, tSe),
    ...pin(pLe, 'Leipzig', '07:31 Uhr · Lea', 26, -92, tLe),
  ];
  drawIn(tl, arc1, tLe + .25, .7, 'power2.out');
  drawIn(tl, arc2, tLe + .45, .9, 'power2.out');
  FRAME.push(t => {
    if (t < tLe + 1 || t > S.end) return;
    for (const u of pulses) {
      if (!u.len) u.len = u.p.getTotalLength();
      const k = ((t - tLe - 1) * .55 + u.i * .5) % 1;
      const pt = u.p.getPointAtLength(u.len * k);
      u.c.setAttribute('cx', pt.x.toFixed(1)); u.c.setAttribute('cy', pt.y.toFixed(1));
      u.c.setAttribute('opacity', (Math.sin(k * Math.PI) * .95).toFixed(2));
    }
  });
  const teamChip = box(root, 0, 175, 1920, 50, 'center', '<span class="chip cyan"><span class="dot"></span>Ein Team · drei Zeitzonen</span>');
  revealUp(tl, teamChip, tLi - .3, { y: 14 });

  // Woche
  const days = [['MO', 'Remote', 'house'], ['DI', 'Büro', 'building-2'], ['MI', 'Remote', 'house'], ['DO', 'Büro', 'building-2'], ['FR', 'frei', 'sun']];
  const tW = S.cue('s1b', ['büro', 'buero']) - .2;
  const tiles = days.map(([d, l, ic], i) => {
    const c = box(root, 420 + i * 220, 780, 200, 130, 'glass', '', 'border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;');
    c.innerHTML = `<div class="tiny" style="letter-spacing:.2em">${d}</div><div class="row" style="gap:10px">${icon(ic, 30, 'var(--ink2)', 2)}<span style="font:700 30px var(--sans)">${l}</span></div>`;
    revealUp(tl, c, tW + i * .07, { y: 26, d: .5 });
    return c;
  });
  const tZ = S.cue('s1b', ['zweimal']);
  [tiles[1], tiles[3]].forEach(c => {
    tl.to(c, { borderColor: 'rgba(59,227,255,.8)', boxShadow: '0 0 40px rgba(59,227,255,.35), inset 0 1px 0 rgba(255,255,255,.2)', y: -10, duration: .4 }, tZ);
  });
  sfx(tZ, 'blip', .45);
  const tF = S.cue('s1b', ['freitags']);
  tl.to(tiles[4], { borderColor: 'rgba(65,240,166,.95)', background: 'linear-gradient(180deg,rgba(65,240,166,.28),rgba(65,240,166,.08))', boxShadow: '0 0 60px rgba(65,240,166,.5)', y: -14, scale: 1.08, duration: .5, ease: 'back.out(2)' }, tF);
  tl.to(tiles[4].querySelector('.ico'), { color: '#ffb547', rotate: 90, duration: .8 }, tF);
  sfx(tF, 'pop', .7);

  source(S.start + .5, S.end - .3, '<b>Szenario</b> · fiktive Zukunftsszene, abgeleitet aus aktuellen Trends');
}
