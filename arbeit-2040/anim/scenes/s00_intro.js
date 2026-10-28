// Intro: eingehende Nachricht aus 2040 + Titel
function S00(tl, S) {
  const root = makeScene('intro');
  const i1 = S.L('intro1'), i2 = S.L('intro2');
  tl.set(root, { autoAlpha: 1 }, 0);

  // Signal-Linie
  const line = box(root, 500, 538, 920, 3, '', '',
    'background:linear-gradient(90deg,transparent,#3be3ff 30%,#b8f4ff 50%,#3be3ff 70%,transparent);box-shadow:0 0 22px #3be3ff;');
  tl.fromTo(line, { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: .9, ease: 'power3.out' }, .2);
  sfx(.2, 'swell', .8);

  // Nachrichtenkarte
  const card = box(root, 420, 290, 1080, 500, 'glass tint-cyan', '', 'overflow:hidden;');
  tl.fromTo(card, { scaleY: .006, opacity: 0 }, { scaleY: 1, opacity: 1, duration: .75, ease: 'power4.out' }, 1.0);
  tl.to(line, { opacity: 0, duration: .35 }, 1.05);
  sfx(1.0, 'whoosh', .45);

  const hdr = box(card, 46, 38, 988, 46, 'row', '', 'justify-content:space-between;');
  hdr.innerHTML = '<span class="chip coral"><span class="dot"></span>Eingehende Nachricht</span>' +
    '<span class="tiny" style="letter-spacing:.16em">VERSCHLÜSSELT · 2040 → 2026</span>';
  revealUp(tl, hdr.children, 1.5, { y: 12, blur: 4, d: .5, stagger: .12 });
  sfx(1.55, 'blip', .6);

  const rows = [
    ['VON', 'Lea M. · 32 · Projektleiterin Energiespeicher'],
    ['GESENDET', 'Dienstag, 30.10.2040 · 07:31 Uhr'],
    ['AN', 'Abiturjahrgang 2026'],
  ];
  const vals = rows.map(([k, v], i) => {
    const r = box(card, 46, 124 + i * 66, 988, 54, 'row', '', 'gap:30px;');
    el('span', { cls: 'tiny', css: 'width:170px;letter-spacing:.2em;color:var(--cyan);font-weight:600', text: k }, r);
    const vv = el('span', { css: 'font:600 36px var(--sans);color:var(--ink);white-space:nowrap', text: '' }, r);
    const t0 = 1.75 + i * .38;
    tl.fromTo(r, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: .3 }, t0);
    tl.to(vv, { duration: .9, scrambleText: { text: v, chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·', speed: .9, revealDelay: .2 } }, t0);
    sfx(t0, 'tick', .4);
    return vv;
  });

  // Hervorhebungen synchron zur Stimme
  const hl = (node, t, col = '#41f0a6') => {
    tl.to(node, { color: col, textShadow: '0 0 24px rgba(65,240,166,0.55)', duration: .25 }, t);
    tl.to(node, { color: '#eef4ff', textShadow: '0 0 0px rgba(65,240,166,0)', duration: .6 }, t + 1.3);
  };
  hl(vals[2], S.cue('intro1', ['jahrgang', '2026']));
  hl(vals[0], S.cue('intro1', ['lea']));
  hl(vals[1], S.cue('intro1', ['2040', 'zweitausendvierzig'], .9));

  // große Wellenform in der Karte
  const wv = el('canvas', { attrs: { width: 988, height: 120 }, css: 'position:absolute;left:46px;top:340px;width:988px;height:120px;' }, card);
  const wg = wv.getContext('2d');
  FRAME.push(t => {
    if (t > i2.start + 1.2) return;
    wg.clearRect(0, 0, 988, 120);
    const n = 104;
    for (let i = 0; i < n; i++) {
      const lv = voiceLevel(t - Math.abs(i - n / 2) * .012, 'lea');
      const idle = .05 + .04 * Math.sin(t * 3 + i * .5);
      const h = Math.max(3, (lv * (.6 + .4 * Math.abs(Math.sin(i * 2.31 + t * 9))) + idle) * 104);
      const k = 1 - Math.abs(i - n / 2) / (n / 2);
      wg.fillStyle = `rgba(${lerp(139, 59, k) | 0},${lerp(108, 227, k) | 0},255,${(.45 + .55 * k).toFixed(2)})`;
      wg.fillRect(i * 9.5, 60 - h / 2, 5, h);
    }
  });
  tl.fromTo(wv, { opacity: 0 }, { opacity: 1, duration: .6 }, 2.6);

  // Übergang zum Titel
  const tOut = i2.start - .15;
  tl.to(card, { y: -150, scale: .86, opacity: 0, filter: 'blur(10px)', duration: .7, ease: 'power3.in' }, tOut);
  sfx(tOut + .3, 'whoosh', .7);

  const tw = box(root, 0, 300, 1920, 520, 'center');
  const kick = el('div', { cls: 'kicker', css: 'font-size:26px;letter-spacing:.42em;margin-bottom:26px', text: 'Eine Nachricht aus dem Jahr 2040' }, tw);
  const title = el('div', { cls: 'h-xxl', css: 'font-size:250px;white-space:nowrap;letter-spacing:-.012em' }, tw);
  const tA = el('span', { text: 'ARBEIT', css: 'display:inline-block' }, title);
  el('span', { text: ' ', css: 'display:inline-block;width:.22em' }, title);
  const tB = el('span', { cls: 'grad', text: '4.0', css: 'display:inline-block;padding-right:.04em' }, title);
  const travel = box(tw, 560, 400, 800, 60, '');
  travel.innerHTML = '<span class="tiny abs" style="left:-96px;top:14px;font-size:24px;color:var(--ink2)">2026</span>' +
    '<span class="tiny abs" style="right:-96px;top:14px;font-size:24px;color:var(--ink2)">2040</span>' +
    '<div class="abs" style="left:0;top:29px;width:800px;height:2px;background:linear-gradient(90deg,rgba(59,227,255,.25),rgba(139,108,255,.9))"></div>';
  const dot = el('div', { cls: 'abs', css: 'left:-9px;top:21px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 0 22px #3be3ff,0 0 6px #fff' }, travel);

  const t1 = i2.start + .15;
  revealUp(tl, kick, t1, { y: 20, d: .7 });
  const chars = splitChars(tA);
  tl.fromTo(chars, { y: 120, opacity: 0, filter: 'blur(14px)' },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: .9, ease: 'power4.out', stagger: .055 }, t1 + .1);
  tl.fromTo(tB, { scale: 1.6, opacity: 0, filter: 'blur(20px)' },
    { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 1.0, ease: 'expo.out' }, t1 + .45);
  sfx(t1 + .45, 'impact', .9);
  tl.fromTo(travel, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .6 }, t1 + .9);
  tl.fromTo(dot, { x: 0 }, { x: 800, duration: Math.max(1.5, i2.end - t1 - .6), ease: 'power2.inOut' }, t1 + 1.0);

  // Zukunftsboden einblenden
  tl.to(BG, { grid: .85, duration: 1.6, ease: 'power2.out' }, t1);
  tl.to(BG, { grid: 0, duration: .9, ease: 'power2.in' }, S.end - .9);

  // Abgang
  tl.to(tw, { scale: 1.18, opacity: 0, filter: 'blur(14px)', duration: .8, ease: 'power3.in' }, S.end - .8);
  tl.fromTo('#flash', { opacity: 0 }, { opacity: .08, duration: .12, yoyo: true, repeat: 1 }, S.end - .12);
  tl.set(root, { autoAlpha: 0 }, S.end + .05);
}
