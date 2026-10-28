// Schluss: zurück im Jahr 2040 – die Zukunft ist eine Entscheidung
function S10(tl, S) {
  const root = makeScene('outro');
  const o1 = S.L('o1'), o2 = S.L('o2'), o3 = S.L('o3');
  sceneInOut(tl, root, S, { drift: false, tout: S.end - .9, dout: .9 });

  const winWrap = box(root, 0, 0, 1920, 1080);
  const win = buildWindow(winWrap, { id: 'w2', dusk: true, from: S.start - .5, to: S.end + .5 });
  tl.fromTo(win.sun, { y: 700 }, { y: 860, duration: S.dur, ease: 'none' }, S.start);
  tl.fromTo(winWrap, { scale: 1.0 }, { scale: 1.07, duration: S.dur, ease: 'none' }, S.start);
  const dim = box(root, 0, 0, 1920, 1080, '', '', 'background:linear-gradient(90deg,rgba(4,6,18,.9) 0%,rgba(4,6,18,.7) 45%,rgba(4,6,18,.15) 100%)');
  tl.fromTo(dim, { opacity: 0 }, { opacity: 1, duration: 1 }, S.start + .3);

  const txt = box(root, 160, 250, 1100, 300, '');
  txt.innerHTML = '<div class="kicker" style="color:#ffb59a">Zurück im Jahr 2040</div><div class="h-lg" style="margin-top:14px;font-size:84px">Unser 2040 ist das Ergebnis eurer Entscheidungen.</div>';
  revealUp(tl, txt.children, o1.start - .1, { stagger: .12 });
  const chips = box(root, 160, 560, 1200, 80, 'row', '', 'gap:22px');
  const items = [['school', 'in der Schule', ['schule']], ['briefcase', 'im ersten Job', ['job', 'ersten']], ['landmark', 'an der Wahlurne', ['wahlurne']]];
  items.forEach(([ic, label, q]) => {
    const c = el('span', { cls: 'chip', html: `${icon(ic, 24, '#ffd0b8', 2)} ${label}`, css: 'color:#ffd0b8;font-size:20px;padding:14px 24px' }, chips);
    popIn(tl, c, S.cue('o1', q) - .15, { from: .6 });
    sfx(S.cue('o1', q), 'pop', .4);
  });

  // Schlusssatz
  const tE = o2.start - .2;
  tl.to([txt, chips], { opacity: 0, y: -30, filter: 'blur(8px)', duration: .5, ease: 'power2.in' }, tE - .55);
  const dim2 = box(root, 0, 0, 1920, 1080, '', '', 'background:rgba(4,6,18,.72);opacity:0');
  tl.to(dim2, { opacity: 1, duration: .9, ease: 'power1.inOut' }, tE - .5);
  const fin = box(root, 0, 360, 1920, 260, 'center');
  fin.innerHTML = '<div class="h-lg" style="font-size:96px">Die Zukunft der Arbeit</div><div class="h-lg grad-warm" style="font-size:96px;margin-top:8px">ist kein Schicksal.</div>';
  revealUp(tl, fin.children, tE + .05, { stagger: .25, y: 36 });
  sfx(tE + .25, 'impact', .7);
  const see = box(root, 0, 660, 1920, 60, 'center mono', 'Wir sehen uns.', 'font-size:30px;color:#ffd0b8;letter-spacing:.3em;text-transform:uppercase');
  revealUp(tl, see, o3.start - .1, { y: 10 });

  // Endkarte
  const tEnd = o3.end + .5;
  tl.to([fin, see], { opacity: 0, scale: .96, duration: .6, ease: 'power2.in' }, tEnd);
  const logo = box(root, 0, 380, 1920, 320, 'center');
  logo.innerHTML = '<div class="h-xxl" style="font-size:180px;letter-spacing:-.01em">ARBEIT <span class="grad">4.0</span></div>' +
    '<div class="kicker" style="margin-top:20px;letter-spacing:.42em">Eine Nachricht aus dem Jahr 2040</div>' +
    '<div style="margin-top:34px"><span class="chip coral"><span class="dot"></span>Nachricht beendet</span></div>';
  revealUp(tl, logo.children, tEnd + .4, { stagger: .18, y: 30 });
  sfx(tEnd + .4, 'swell', .6);
}

// Abspann mit Quellen
function S11(tl, S) {
  const root = makeScene('credits');
  sceneInOut(tl, root, S, { drift: false, tout: S.end - 1.2, dout: 1.2 });
  const h = box(root, 150, 120, 1620, 80, '', '<div class="kicker">Quellen &amp; Produktion</div>');
  const srcs = [
    'ifo Schnelldienst 3/2024: Krause, Trumpp, Dichtl, Kiese, Rutsch – „Neue Arbeitswelt, neue Arbeitsorte“',
    'teachEconomy (Joachim Herz Stiftung): „Arbeiten 4.0 – Wie sieht die zukünftige Arbeitswelt aus?“',
    'neuneinhalb (WDR): „KI auf dem Arbeitsmarkt: So könnte die Zukunft aussehen“',
    'BMAS (2015): Grünbuch Arbeiten 4.0',
    'IAB-Kurzbericht 5/2024: Substituierbarkeitspotenziale 2022',
    'World Economic Forum (2025): Future of Jobs Report',
    'Destatis: Mikrozensus 2025 (Erstergebnisse) – Erwerbspersonen im Rentenalter bis 2040',
    'Bundesagentur für Arbeit: Engpassanalyse · KOFA/IW (2022): Fachkräfte Solar & Wind',
    'Deutsches Aktieninstitut (Jan. 2026): Aktionärszahlen 2025',
    'Universität Münster & Intraprenör (2024): Pilotprojekt Vier-Tage-Woche',
    'Brynjolfsson, Chandar & Chen (2025): Canaries in the Coal Mine? – Stanford Digital Economy Lab',
    'IWF (2024): Gen-AI and the Future of Work · K. Georgieva, Blog 14.1.2024',
    'Deutsche Bundesbank: Vermögensbefragung 2023 (Monatsbericht April 2025)',
    'OECD (2018): A Broken Social Elevator? How to Promote Social Mobility',
    'Deutscher Bundestag (16.10.2026): Gesetz zur Frühstart-Rente',
    'Kursdaten Nvidia/Zoom: Börsenberichte, gerundet · Recht auf Nichterreichbarkeit: FR 2017, AUS 2024',
  ];
  const list = box(root, 150, 210, 1620, 640, '', '', 'columns:2;column-gap:70px');
  list.innerHTML = srcs.map(s => `<div style="font:500 21px/1.4 var(--sans);color:#c9d6f2;margin-bottom:14px;break-inside:avoid">${s}</div>`).join('');
  const prod = box(root, 150, 880, 1620, 80, '', '<div class="tiny" style="font-size:19px;line-height:1.6">Zukunftsszene 2040 mit Luca &amp; Zamir: fiktiv · Zahlen: Stand Oktober 2026 · Stimmen: KI-generiert (Qwen3-TTS, Apache-2.0) · Musik &amp; Klänge: eigens synthetisiert · Animation: HTML/GSAP · Icons: Lucide (ISC) · Karte: Natural Earth</div>');
  revealUp(tl, h, S.start + .2, { y: 12 });
  revealUp(tl, list.children, S.start + .4, { y: 12, stagger: .05, d: .5 });
  revealUp(tl, prod, S.start + 1.4, { y: 10 });
}
