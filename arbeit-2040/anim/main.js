// Baut die Gesamt-Zeitleiste und stellt window.seek(t) für den Bild-für-Bild-Renderer bereit.
(async function main() {
  await document.fonts.ready;
  await Promise.all([
    '900 100px "Inter Display"', '850 100px "Inter Display"', '800 100px "Inter Display"', '750 60px "Inter Display"',
    '700 40px "Inter Display"', '700 30px Inter', '600 30px Inter', '500 30px Inter', '600 20px "JetBrains Mono"', '500 20px "JetBrains Mono"',
  ].map(f => document.fonts.load(f)));

  const tl = gsap.timeline({ paused: true });
  const builders = {
    intro: window.S00, scene2040: window.S01, scene2040z: window.S01Z, history: window.S02, jobs: window.S03, place: window.S04,
    market: window.S05, private: window.S06, career: window.S07, wealth: window.S08, rich: window.S09,
    outro: window.S10, credits: window.S11,
  };
  TL.scenes.forEach((sc, i) => {
    const S = sceneCtx(sc);
    const th = THEMES[sc.id];
    if (th) for (const k of ['a', 'b', 'c']) {
      tl.to(BG[k], { r: th[k][0], g: th[k][1], b: th[k][2], duration: 1.8, ease: 'sine.inOut' }, Math.max(0, sc.start - .6));
    }
    if (i > 0) sfx(sc.start - .15, 'whoosh', .75);
    const fn = builders[sc.id];
    if (fn) fn(tl, S);
  });
  tl.set({}, {}, TL.duration);

  window.TOTAL = TL.duration;
  window.SFX_EVENTS = SFX;
  window.seek = t => {
    tl.seek(t, false);
    for (const f of FRAME) f(t);
  };
  const q = new URLSearchParams(location.search);
  window.seek(q.has('t') ? parseFloat(q.get('t')) : 0);
  window.READY = true;
})().catch(e => { window.ERROR = String(e && e.stack || e); console.error(e); });
