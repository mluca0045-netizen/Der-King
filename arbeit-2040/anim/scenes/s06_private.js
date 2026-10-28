// Kapitel 6: Privatleben – gewonnene Zeit und Kehrseite
function S06(tl, S) {
  const root = makeScene('private');
  const p1 = S.L('pr1'), p2 = S.L('pr2');
  sceneInOut(tl, root, S);

  // --- linke Spalte: gewonnen ---
  const L = box(root, 140, 160, 780, 760, '');
  const lh = box(L, 0, 0, 780, 120, '');
  lh.innerHTML = '<div class="kicker" style="color:var(--mint)">Gewonnen</div><div class="h-md" style="margin-top:8px">Zeit statt Pendeln</div>';
  revealUp(tl, lh.children, p1.start - .1, { stagger: .1 });

  const com = box(L, 0, 150, 780, 90, 'glass', '', 'border-radius:22px;display:flex;align-items:center;gap:20px;padding:0 26px');
  com.innerHTML = `${icon('train-front', 44, '#cfe6ff', 1.8)}<div style="flex:1"><div class="tiny">Pendelweg</div><div style="margin-top:8px;height:12px;border-radius:7px;background:rgba(255,255,255,.08);overflow:hidden"><div class="cb" style="height:100%;width:100%;background:linear-gradient(90deg,#ff5c7a,#ffb547);transform-origin:0 50%"></div></div></div>` +
    '<span class="chip mint hw" style="font-size:16px;padding:8px 14px">Homeoffice ≈ +8 % Gehalt wert</span>';
  const tP = S.cue('pr1', ['pendeln']) - .3;
  revealUp(tl, com, tP, { y: 18 });
  tl.fromTo(com.querySelector('.cb'), { scaleX: 1 }, { scaleX: .12, duration: 1.2, ease: 'power2.inOut' }, tP + .4);
  sfx(tP + .4, 'down', .35);
  popIn(tl, com.querySelector('.hw'), tP + 1.3, { from: .7 });

  const life = [['heart', 'Familie', ['familie']], ['users', 'Freunde', ['freunde']], ['bike', 'Sport', ['freunde']]];
  life.forEach(([ic, name, q], i) => {
    const c = box(L, i * 266, 270, 246, 150, 'glass tint-mint', '', 'border-radius:24px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px');
    c.innerHTML = `${icon(ic, 52, '#41f0a6', 1.8)}<span style="font:700 30px var(--sans)">${name}</span>`;
    const t = S.cue('pr1', q) - .15 + (i === 2 ? .35 : 0);
    popIn(tl, c, t, { from: .6 });
    sfx(t, 'pop', .35);
  });

  const pilot = box(L, 0, 450, 780, 300, 'glass', '', 'padding:30px 34px');
  pilot.innerHTML = '<div class="row" style="justify-content:space-between"><div><div class="kicker" style="font-size:19px">Pilotprojekt 2024</div><div style="font:800 38px var(--display);margin-top:6px">Vier-Tage-Woche</div></div>' +
    '<div class="row days" style="gap:8px"></div></div>' +
    '<div class="tiny" style="margin-top:8px">45 Organisationen · 6 Monate · Uni Münster</div>' +
    '<div class="row" style="gap:26px;margin-top:26px">' +
    `<div class="glass tint-mint" style="flex:1;padding:18px 22px;border-radius:18px"><div class="tiny">Lebenszufriedenheit</div><div class="row" style="gap:10px;margin-top:6px">${icon('trending-up', 40, '#41f0a6', 2.2)}<span style="font:800 36px var(--display);color:#41f0a6">steigt</span></div></div>` +
    `<div class="glass" style="flex:1;padding:18px 22px;border-radius:18px"><div class="tiny">Produktivität</div><div class="row" style="gap:10px;margin-top:6px"><span style="font:800 40px var(--display);color:#cfe6ff">=</span><span style="font:800 36px var(--display)">stabil</span></div></div>` +
    '</div>';
  const days = pilot.querySelector('.days');
  ['M', 'D', 'M', 'D', 'F'].forEach((d, i) => el('span', {
    text: d, css: `width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font:700 20px var(--mono);` +
      (i < 4 ? 'background:rgba(59,227,255,.2);color:#bff4ff;border:1.5px solid rgba(59,227,255,.6)' : 'background:rgba(65,240,166,.18);color:#41f0a6;border:1.5px dashed rgba(65,240,166,.8)'),
  }, days));
  const tV = S.cue('pr1', ['pilotprojekt', 'vier']) - .3;
  revealUp(tl, pilot, tV, { y: 26 });
  const [m1, m2] = pilot.querySelectorAll('.glass');
  popIn(tl, m1, S.cue('pr1', ['lebenszufriedenheit', 'stieg']) - .1, { from: .7 });
  popIn(tl, m2, S.cue('pr1', ['produktivität', 'produktivitaet', 'gleicher']) - .1, { from: .7 });
  sfx(S.cue('pr1', ['lebenszufriedenheit', 'stieg']), 'rise', .4);
  source(p1.start, p1.end + .3, '<b>Uni Münster &amp; Intraprenör</b> (2024), nicht repräsentativ · 8 %: Studien zit. in <b>ifo 3/2024</b>');

  // --- rechte Spalte: Kehrseite ---
  const Rr = box(root, 1010, 160, 780, 760, '');
  const rh = box(Rr, 0, 0, 780, 120, '');
  rh.innerHTML = '<div class="kicker" style="color:var(--coral)">Kehrseite</div><div class="h-md" style="margin-top:8px">Grenzen verschwimmen</div>';
  revealUp(tl, rh.children, p2.start - .1, { stagger: .1 });
  tl.to(L, { opacity: .35, filter: 'blur(2px)', duration: .6 }, p2.start - .1);

  const phone = box(Rr, 0, 150, 380, 600, '', '', 'border-radius:46px;background:linear-gradient(180deg,#141a3a,#0b1030);border:2px solid rgba(255,255,255,.18);box-shadow:0 30px 80px rgba(0,0,0,.5);overflow:hidden');
  const clock = box(phone, 0, 40, 380, 80, 'center mono', '23:05', 'font-size:58px;font-weight:600;color:#eef4ff');
  const sofa = box(phone, 0, 120, 380, 40, 'center tiny', 'Wohnzimmer · Feierabend?', 'font-size:18px');
  revealUp(tl, phone, p2.start + .1, { y: 30 });
  const notes = [['Teams', 'Kurze Frage zum Angebot …', '21:47'], ['Mail', 'Kannst du heute noch …', '22:13'], ['Chat', 'Bist du noch online?', '23:05']];
  const tN = S.cue('pr2', ['verschwimmen']) - .4;
  const noteEls = notes.map(([app, txt, tm], i) => {
    const n = box(phone, 22, 190 + i * 118, 336, 102, '', '', 'border-radius:20px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.14);padding:14px 18px');
    n.innerHTML = `<div class="row" style="justify-content:space-between"><span class="row" style="gap:8px">${icon('bell-ring', 22, '#ffb547', 2)}<span class="tiny" style="color:#ffd08a">${app}</span></span><span class="tiny">${tm}</span></div><div style="font:600 23px var(--sans);margin-top:8px">${txt}</div>`;
    tl.fromTo(n, { opacity: 0, y: -30, scale: .9 }, { opacity: 1, y: 0, scale: 1, duration: .45, ease: 'back.out(2)' }, tN + i * .5);
    sfx(tN + i * .5, 'notify', .45);
    return n;
  });
  const chips = box(Rr, 420, 190, 360, 300, 'col', '', 'gap:22px');
  chips.innerHTML = `<span class="chip coral">${icon('bell-ring', 22, '#ff5c7a', 2)} Dauer-Erreichbarkeit</span><span class="chip violet">${icon('user', 22, '#b3a1ff', 2)} Einsamkeit</span>`;
  revealUp(tl, chips.children[0], S.cue('pr2', ['dauer', 'erreichbarkeit']) - .1, { y: 12 });
  revealUp(tl, chips.children[1], S.cue('pr2', ['einsamkeit']) - .1, { y: 12 });
  const lone = box(Rr, 470, 360, 260, 260, '', '', '');
  lone.innerHTML = '<div style="position:absolute;left:55px;top:55px;width:150px;height:150px;border-radius:50%;border:2px dashed rgba(179,161,255,.5)"></div>' +
    `<div style="position:absolute;left:96px;top:92px">${icon('user', 68, '#c9bcff', 1.8)}</div>` +
    `<div style="position:absolute;left:0;top:0;opacity:.3">${icon('user', 34, '#8ea0c6', 1.8)}</div><div style="position:absolute;left:214px;top:10px;opacity:.3">${icon('user', 34, '#8ea0c6', 1.8)}</div><div style="position:absolute;left:220px;top:210px;opacity:.3">${icon('user', 34, '#8ea0c6', 1.8)}</div>`;
  popIn(tl, lone, S.cue('pr2', ['einsamkeit']), { from: .7 });

  // Abschalten
  const tOff = S.cue('pr2', ['abschalten']) - .2;
  const pwr = box(Rr, 130, 360, 120, 120, '', icon('power', 64, '#06101e', 2.6),
    'border-radius:50%;background:radial-gradient(circle at 40% 35%,#9dffd3,#41f0a6 60%,#1fbf7d);display:flex;align-items:center;justify-content:center;box-shadow:0 0 60px rgba(65,240,166,.7)');
  popIn(tl, pwr, tOff, { from: .3, ease: 'back.out(2.4)' });
  tl.to(pwr, { scale: .86, duration: .12, yoyo: true, repeat: 1 }, tOff + .6);
  sfx(tOff + .6, 'click', .7);
  tl.to(noteEls, { opacity: 0, x: 120, duration: .4, stagger: .06, ease: 'power2.in' }, tOff + .7);
  tl.to(phone, { background: 'linear-gradient(180deg,#05070f,#03040a)', duration: .6 }, tOff + .75);
  tl.to([clock, sofa], { opacity: .25, duration: .5 }, tOff + .75);
  const moon = box(phone, 140, 300, 100, 100, '', icon('moon', 100, '#c9bcff', 1.5), 'opacity:0');
  tl.to(moon, { opacity: 1, duration: .6 }, tOff + 1.0);
  tl.to(pwr, { opacity: 0, scale: .6, duration: .4 }, tOff + 1.4);
  const skill = box(root, 1010, 930 - 60, 780, 60, '', `<span class="chip mint" style="font-size:20px">${icon('shield-check', 24, '#41f0a6', 2)} Abschalten ist eine Fähigkeit</span>`);
  revealUp(tl, skill, S.cue('pr2', ['fähigkeit', 'faehigkeit']) - .3, { y: 12 });
  tl.to([chips, lone], { opacity: .4, duration: .5 }, tOff + .8);
  source(p2.start, S.end - .2, 'Recht auf Nichterreichbarkeit gibt es z. B. in <b>Frankreich</b> (2017) und <b>Australien</b> (2024)');
}
