// Kapitel 3: KI und Jobs – Substituierbarkeit, WEF-Prognose, Demografie, Berufe im Wandel
function S03(tl, S) {
  const root = makeScene('jobs');
  const j1 = S.L('j1'), j2 = S.L('j2'), j3 = S.L('j3'), j4 = S.L('j4');
  sceneInOut(tl, root, S);

  // --- j1: 38 % ---
  const A = box(root, 0, 0, 1920, 1080);
  const big = box(A, 150, 250, 760, 260, '');
  big.innerHTML = '<span class="num grad" style="font-size:300px;line-height:1"><span class="v">0</span><span style="font-size:.55em;margin-left:.06em">%</span></span>';
  const v38 = big.querySelector('.v');
  const cap = box(A, 160, 590, 760, 220, '');
  cap.innerHTML = '<div class="body" style="font-size:38px;color:var(--ink)">der Beschäftigten arbeiteten <b>2022</b> in Berufen, deren Tätigkeiten zu <b class="c-cyan">über 70 %</b> technisch ersetzbar waren.</div>';
  const t38 = S.cue('j1', ['38', 'achtunddreißig']) - .3;
  revealUp(tl, big, t38 - .25, { y: 30, d: .6 });
  countUp(tl, v38, 0, 38, t38, 1.4, v => Math.round(v));
  revealUp(tl, cap, S.cue('j1', ['berufen']) - .3, { y: 20 });
  sfx(t38, 'count', .6);

  const grid = box(A, 1060, 220, 700, 640, '');
  const people = [];
  for (let i = 0; i < 100; i++) {
    const x = (i % 10) * 70, y = Math.floor(i / 10) * 64;
    const p = box(grid, x, y, 54, 54, '', icon('user-round', 46, '#3c4b78', 2));
    people.push(p);
  }
  tl.fromTo(people, { opacity: 0, scale: .4 }, { opacity: 1, scale: 1, duration: .35, stagger: { each: .008, from: 'start' }, ease: 'back.out(2)' }, j1.start + .2);
  const lit = people.slice(0, 38);
  tl.to(lit.map(p => p.querySelector('.ico')), { color: '#3be3ff', duration: .25, stagger: 1.3 / 38 }, t38);
  const legend = box(A, 1060, 880, 700, 40, 'tiny', '<span style="color:var(--cyan)">●</span> 1 Symbol = 1 % der Beschäftigten', 'font-size:21px');
  revealUp(tl, legend, t38 + .4, { y: 10 });
  source(S.start + .5, j1.end + .2, 'IAB-Kurzbericht 5/2024 · <b>Substituierbarkeitspotenzial 2022</b> (sozialversicherungspflichtig Beschäftigte)');

  // --- j2: WEF + Demografie ---
  const tB = j2.start - .25;
  tl.to(A, { opacity: 0, y: -40, filter: 'blur(10px)', duration: .55, ease: 'power2.in' }, tB);
  sfx(tB, 'whoosh', .45);
  const B = box(root, 0, 0, 1920, 1080);
  const wefHead = box(B, 150, 165, 900, 120, '');
  wefHead.innerHTML = '<div class="kicker">Weltwirtschaftsforum · Prognose bis 2030</div><div class="h-sm" style="margin-top:10px">Mehr neue Jobs als wegfallende</div>';
  revealUp(tl, wefHead.children, j2.start, { stagger: .1 });
  const sc = 3.1, bx = 150;
  const axis = box(B, bx, 360, 3, 300, '', '', 'background:rgba(255,255,255,.35)');
  const barN = box(B, bx + 3, 380, 170 * sc, 104, '', '', 'border-radius:4px 18px 18px 4px;background:linear-gradient(90deg,rgba(65,240,166,.3),#41f0a6);box-shadow:0 0 40px rgba(65,240,166,.35);transform-origin:0 50%');
  const barW = box(B, bx + 3, 530, 92 * sc, 104, '', '', 'border-radius:4px 18px 18px 4px;background:linear-gradient(90deg,rgba(255,92,122,.3),#ff5c7a);box-shadow:0 0 40px rgba(255,92,122,.3);transform-origin:0 50%');
  const labN = box(B, bx + 170 * sc + 26, 380, 330, 104, '', '<div class="num c-mint" style="font-size:60px;line-height:1">+170 Mio.</div><div class="tiny" style="margin-top:6px">neue Jobs</div>', 'display:flex;flex-direction:column;justify-content:center');
  const labW = box(B, bx + 92 * sc + 26, 530, 330, 104, '', '<div class="num c-coral" style="font-size:60px;line-height:1">−92 Mio.</div><div class="tiny" style="margin-top:6px">wegfallende Jobs</div>', 'display:flex;flex-direction:column;justify-content:center');
  const tBars = S.cue('j2', ['neue']) - .5;
  tl.fromTo(axis, { scaleY: 0, transformOrigin: '50% 0' }, { scaleY: 1, duration: .5 }, j2.start + .2);
  tl.fromTo(barN, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power3.out' }, tBars);
  tl.fromTo(barW, { scaleX: 0 }, { scaleX: 1, duration: 1.0, ease: 'power3.out' }, tBars + .35);
  revealUp(tl, labN, tBars + .6, { y: 14 });
  revealUp(tl, labW, tBars + .9, { y: 14 });
  sfx(tBars, 'rise', .5);
  const net = box(B, bx, 700, 760, 50, '', '<span class="chip mint"><span class="dot"></span>netto: +78 Mio. Jobs weltweit bis 2030</span>');
  revealUp(tl, net, tBars + 1.4, { y: 12 });

  const demo = box(B, 1040, 250, 760, 600, 'glass tint-amber', '', 'padding:46px 50px;');
  demo.innerHTML = '<div class="kicker" style="color:var(--amber)">Demografie Deutschland</div>' +
    '<div class="num" style="font-size:118px;margin-top:14px;color:#ffd08a"><span class="v">0,0</span> Mio.</div>' +
    '<div class="body" style="font-size:32px;margin-top:6px">Erwerbspersonen erreichen bis <b>2040</b> das Rentenalter – rund <b>30 %</b> aller Erwerbspersonen von 2025.</div>' +
    '<div class="ppl row" style="gap:14px;margin-top:34px"></div>';
  const ppl = demo.querySelector('.ppl');
  const walkers = [];
  for (let i = 0; i < 10; i++) {
    const p = el('span', { html: icon('user', 46, i < 3 ? '#ffb547' : '#9fb0d8', 2) }, ppl);
    if (i < 3) walkers.push(p);
  }
  const tD = S.cue('j2', ['babyboomer', 'rente']) - .45;
  tl.fromTo(demo, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: .7, ease: 'power3.out' }, tD);
  countUp(tl, demo.querySelector('.v'), 0, 13.3, tD + .3, 1.3, v => fmtDE(v, 1));
  tl.to(walkers, { x: 540, opacity: 0, duration: 1.6, ease: 'power1.in', stagger: .2 }, tD + 1.4);
  sfx(tD, 'count', .45);
  const gap = box(B, 1040, 880, 760, 50, '', '<span class="chip amber"><span class="dot"></span>Engpass: eher Menschen als Jobs</span>');
  revealUp(tl, gap, S.cue('j2', ['fehlen']) - .1, { y: 12 });
  source(j2.start, j2.end + .2, '<b>WEF</b>, Future of Jobs Report 2025 · <b>Destatis</b>, Mikrozensus 2025 (Erstergebnisse)');

  // --- j3: Berufe im Wandel ---
  const tC = j3.start - .25;
  tl.to(B, { opacity: 0, y: -40, filter: 'blur(10px)', duration: .55, ease: 'power2.in' }, tC);
  sfx(tC, 'whoosh', .45);
  const Cc = box(root, 0, 0, 1920, 1080);
  const doc = box(Cc, 150, 190, 980, 640, 'glass', '', 'padding:44px 50px;');
  doc.innerHTML = `<div class="row" style="gap:20px">${icon('stethoscope', 56, '#7fe9ff', 1.7)}<div><div class="kicker">Traumberuf im Wandel</div><div class="h-sm" style="font-size:52px">Ärztin, 2040</div></div></div>` +
    '<div class="scan" style="position:relative;margin-top:36px;height:250px"></div>' +
    `<div class="talk row" style="gap:18px;margin-top:30px">${icon('message-square', 44, '#41f0a6', 1.8)}<span style="font:700 34px var(--sans)">mehr Zeit für Gespräche</span></div>`;
  const scan = doc.querySelector('.scan');
  const imgs = [];
  for (let i = 0; i < 12; i++) {
    const x = (i % 6) * 146, y = Math.floor(i / 6) * 126;
    const im = box(scan, x, y, 132, 112, '', '', 'border-radius:14px;background:radial-gradient(ellipse 40% 55% at 50% 50%,rgba(220,235,255,.35),rgba(120,150,200,.08) 70%),#0b1230;border:1.5px solid rgba(255,255,255,.12);overflow:hidden');
    // stilisierte Rippen
    im.innerHTML = '<svg viewBox="0 0 132 112" width="132" height="112" style="position:absolute;left:0;top:0;opacity:.55">' +
      [0, 1, 2, 3].map(k => `<path d="M66,${22 + k * 18} C46,${16 + k * 18} 30,${24 + k * 18} 24,${36 + k * 18}" stroke="#dbe8ff" stroke-width="3" fill="none"/><path d="M66,${22 + k * 18} C86,${16 + k * 18} 102,${24 + k * 18} 108,${36 + k * 18}" stroke="#dbe8ff" stroke-width="3" fill="none"/>`).join('') +
      '<line x1="66" y1="14" x2="66" y2="98" stroke="#dbe8ff" stroke-width="4"/></svg>' +
      `<span class="mk" style="position:absolute;right:8px;top:8px;opacity:0">${icon(i % 5 === 2 ? 'triangle-alert' : 'check', 26, i % 5 === 2 ? '#ffb547' : '#41f0a6', 2.4)}</span>`;
    imgs.push(im);
  }
  const beam = box(scan, -20, -10, 8, 270, '', '', 'background:linear-gradient(180deg,transparent,#3be3ff,transparent);box-shadow:0 0 30px #3be3ff;opacity:0');
  const tR = S.cue('j3', ['röntgenbilder', 'roentgenbilder']) - .4;
  revealUp(tl, doc, j3.start - .05, { y: 30 });
  revealUp(tl, imgs, j3.start + .2, { y: 14, d: .4, stagger: .03 });
  tl.fromTo(beam, { x: 0, opacity: 0 }, { x: 870, opacity: 1, duration: 1.8, ease: 'power1.inOut' }, tR);
  tl.to(beam, { opacity: 0, duration: .3 }, tR + 1.8);
  imgs.forEach((im, i) => tl.to(im.querySelector('.mk'), { opacity: 1, duration: .2 }, tR + .15 + (i % 6) * .28));
  sfx(tR, 'scan', .5);
  const tk = doc.querySelector('.talk');
  revealUp(tl, tk, S.cue('j3', ['gespräche', 'gespraeche', 'zeit']) - .2, { y: 14 });
  const kiTag = box(doc, 560, 70, 360, 50, '', '<span class="chip violet"><span class="dot"></span>KI sortiert vor</span>', 'text-align:right');
  revealUp(tl, kiTag, tR + .1, { y: 10 });

  const jobs = [['hand-heart', 'Pflege', ['pflege'], 'Engpassberuf laut BA'], ['hammer', 'Handwerk', ['handwerk'], 'Engpassberuf laut BA'], ['wind', 'Energiewende', ['energiewende'], '≈ 216.000 Fachkräfte fehlen (2022)']];
  const jobCards = jobs.map(([ic, name, q, note], i) => {
    const c = box(Cc, 1200, 190 + i * 222, 570, 196, 'glass tint-mint', '', 'display:flex;align-items:center;gap:30px;padding:0 40px;');
    c.innerHTML = `${icon(ic, 70, '#41f0a6', 1.7)}<div><div class="row" style="gap:16px"><span style="font:800 46px var(--display)">${name}</span><span class="badge chip mint" style="font-size:16px;padding:6px 12px"><span class="dot"></span>Gesucht</span></div><div class="tiny" style="margin-top:10px;font-size:21px">${note}</div></div>`;
    const t = S.cue('j4', q) - .15;
    tl.fromTo(c, { opacity: 0, x: 80, filter: 'blur(8px)' }, { opacity: 1, x: 0, filter: 'blur(0px)', duration: .6, ease: 'power3.out' }, t);
    tl.fromTo(c.querySelector('.badge'), { scale: .6, opacity: 0 }, { scale: 1, opacity: 1, duration: .4, ease: 'back.out(3)' }, t + .3);
    sfx(t, 'pop', .45);
    return c;
  });
  const hire = box(Cc, 1200, 860, 570, 50, '', `<span class="chip amber" style="font-size:17px">${icon('hard-hat', 20, '#ffb547', 2)} Zamirs Betrieb: 3 offene Stellen</span>`);
  revealUp(tl, hire, S.cue('j4', ['einstellen', 'sofort']) - .3, { y: 10 });
  sfx(S.cue('j4', ['einstellen', 'sofort']) - .2, 'blip', .4);
  source(j3.start, S.end - .2, 'Idee „Traumberufe“: <b>neuneinhalb (WDR)</b> · <b>BA</b>-Engpassanalyse · <b>KOFA/IW</b> 2022 (Solar & Wind)');
}
