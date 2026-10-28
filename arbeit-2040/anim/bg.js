// Hintergrund (Aurora, Partikel, Perspektivgitter), Filmkorn, HUD-Elemente – alles als Funktion der Zeit.
const BG = {
  a: { r: 59, g: 227, b: 255 }, b: { r: 139, g: 108, b: 255 }, c: { r: 40, g: 70, b: 190 },
  grid: 0, stars: 1, glow: 1, horizon: 742,
};

const THEMES = {
  intro: { a: [59, 227, 255], b: [139, 108, 255], c: [36, 64, 180] },
  scene2040: { a: [255, 160, 90], b: [139, 108, 255], c: [40, 110, 220] },
  scene2040z: { a: [255, 181, 71], b: [59, 227, 255], c: [60, 90, 200] },
  history: { a: [76, 141, 255], b: [139, 108, 255], c: [59, 227, 255] },
  jobs: { a: [59, 227, 255], b: [65, 240, 166], c: [50, 80, 200] },
  place: { a: [76, 141, 255], b: [59, 227, 255], c: [120, 90, 255] },
  market: { a: [65, 240, 166], b: [59, 227, 255], c: [110, 80, 255] },
  private: { a: [139, 108, 255], b: [255, 110, 150], c: [50, 90, 210] },
  career: { a: [59, 227, 255], b: [255, 181, 71], c: [110, 90, 255] },
  wealth: { a: [255, 181, 71], b: [255, 92, 122], c: [120, 80, 220] },
  rich: { a: [65, 240, 166], b: [255, 181, 71], c: [59, 160, 255] },
  outro: { a: [255, 150, 90], b: [255, 92, 140], c: [139, 108, 255] },
};

(function setupBackground() {
  const cv = document.getElementById('bg');
  const g = cv.getContext('2d');
  const R = rng(7);
  const P = Array.from({ length: 170 }, () => ({
    x: R() * W, y: R() * H, r: .6 + R() * 1.8, vx: (R() - .5) * 6, vy: 4 + R() * 14,
    ph: R() * 6.28, tw: .4 + R() * 1.4, depth: .3 + R() * .7,
  }));
  const rgba = (c, a) => `rgba(${c.r | 0},${c.g | 0},${c.b | 0},${a})`;

  FRAME.push(t => {
    g.globalCompositeOperation = 'source-over';
    const base = g.createLinearGradient(0, 0, 0, H);
    base.addColorStop(0, '#050814'); base.addColorStop(.6, '#081028'); base.addColorStop(1, '#060a1c');
    g.fillStyle = base; g.fillRect(0, 0, W, H);

    g.globalCompositeOperation = 'lighter';
    const blobs = [
      [BG.a, .24 + .07 * Math.sin(t * .071), .30 + .06 * Math.cos(t * .053), 980, .23],
      [BG.b, .80 + .06 * Math.cos(t * .062), .70 + .07 * Math.sin(t * .047), 920, .21],
      [BG.c, .52 + .10 * Math.sin(t * .036 + 1), .10 + .05 * Math.sin(t * .05), 820, .19],
    ];
    for (const [c, bx, by, r, a] of blobs) {
      const x = bx * W, y = by * H;
      const gr = g.createRadialGradient(x, y, 0, x, y, r);
      gr.addColorStop(0, rgba(c, a * BG.glow));
      gr.addColorStop(.45, rgba(c, a * .45 * BG.glow));
      gr.addColorStop(1, rgba(c, 0));
      g.fillStyle = gr; g.fillRect(0, 0, W, H);
    }

    // Partikel / Sterne
    if (BG.stars > .01) {
      for (const p of P) {
        const x = ((p.x + p.vx * t) % W + W) % W;
        const y = ((p.y - p.vy * t * p.depth) % H + H) % H;
        const a = (.18 + .32 * (.5 + .5 * Math.sin(p.ph + t * p.tw))) * BG.stars;
        g.fillStyle = `rgba(190,220,255,${a.toFixed(3)})`;
        g.beginPath(); g.arc(x, y, p.r * p.depth, 0, 6.283); g.fill();
      }
    }

    // Perspektivgitter („Boden der Zukunft“)
    if (BG.grid > .01) {
      const hz = BG.horizon, vx = W / 2;
      g.globalCompositeOperation = 'lighter';
      const hg = g.createLinearGradient(0, hz - 60, 0, hz + 40);
      hg.addColorStop(0, rgba(BG.a, 0)); hg.addColorStop(.6, rgba(BG.a, .22 * BG.grid)); hg.addColorStop(1, rgba(BG.a, 0));
      g.fillStyle = hg; g.fillRect(0, hz - 60, W, 100);
      g.lineWidth = 1.4;
      const off = (t * .45) % 1;
      for (let i = 0; i < 16; i++) {
        const d = i + 1 - off;
        const y = hz + 300 / d;
        if (y > H) continue;
        const a = clamp((1 - d / 16)) * .5 * BG.grid;
        g.strokeStyle = rgba(BG.a, a.toFixed(3));
        g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
      }
      for (let i = -14; i <= 14; i++) {
        const xb = vx + i * 190;
        const grd = g.createLinearGradient(0, hz, 0, H);
        grd.addColorStop(0, rgba(BG.a, 0)); grd.addColorStop(1, rgba(BG.a, .42 * BG.grid));
        g.strokeStyle = grd;
        g.beginPath(); g.moveTo(vx + i * 8, hz); g.lineTo(xb * 1.0 + (xb - vx) * 1.6, H); g.stroke();
      }
    }
    g.globalCompositeOperation = 'source-over';
  });
})();

(function setupGrain() {
  const cv = document.getElementById('grain');
  const g = cv.getContext('2d');
  const R = rng(99);
  const tiles = [];
  for (let k = 0; k < 5; k++) {
    const img = g.createImageData(cv.width, cv.height);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (R() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v; img.data[i + 3] = 255;
    }
    tiles.push(img);
  }
  FRAME.push(t => { g.putImageData(tiles[Math.floor(t * TL.fps) % tiles.length], 0, 0); });
})();

(function setupHud() {
  const chap = document.getElementById('hud-chapter');
  const chapNum = chap.querySelector('.num'), chapTitle = chap.querySelector('.title');
  const mode = document.getElementById('hud-mode');
  const msg = document.getElementById('hud-msg');
  const src = document.getElementById('hud-src');
  const prog = document.getElementById('hud-progress');
  const bar = prog.querySelector('.bar');
  const wave = document.getElementById('wave').getContext('2d');
  let lastChap = null, lastMode = null, lastSrc = null;
  const ramp = (t, a, b, f = .45) => clamp(Math.min((t - a) / f, (b - t) / f));
  // aufeinanderfolgende Szenen mit gleichem Kapitel/Modus bilden einen durchgehenden Abschnitt
  const runs = key => {
    const out = {};
    TL.scenes.forEach((sc, i) => {
      let a = i, b = i;
      while (a > 0 && TL.scenes[a - 1][key] === sc[key]) a--;
      while (b < TL.scenes.length - 1 && TL.scenes[b + 1][key] === sc[key]) b++;
      out[sc.id] = { start: TL.scenes[a].start, end: TL.scenes[b].end };
    });
    return out;
  };
  const chapRun = runs('chapter'), modeRun = runs('mode');
  const SPK = {
    luca: { name: 'LUCA', rgb: '59,227,255' },
    zamir: { name: 'ZAMIR', rgb: '255,181,71' },
    nova: { name: 'NOVA', rgb: '179,161,255' },
  };
  const lines = TL.scenes.flatMap(sc => sc.lines);
  const spk = document.getElementById('hud-spk');
  let lastSpk = null;

  FRAME.push(t => {
    const sc = TL.scenes.find(s => t >= s.start && t < s.end) || TL.scenes[TL.scenes.length - 1];
    // Kapitel
    let ca = 0;
    if (sc.chapter) {
      const r = chapRun[sc.id];
      ca = ramp(t, r.start + .5, r.end - .2, .5);
      if (lastChap !== sc.chapter) {
        const [n, ...rest] = sc.chapter.split(' · ');
        chapNum.textContent = 'KAPITEL ' + n; chapTitle.textContent = rest.join(' · ');
        lastChap = sc.chapter;
      }
    }
    chap.style.opacity = ca.toFixed(3);
    chap.style.transform = `translateY(${((1 - ca) * -10).toFixed(1)}px)`;
    // Modus-Chip
    const md = sc.mode;
    if (md !== lastMode) {
      mode.className = 'chip ' + (md === 'fakt' ? 'cyan' : 'violet');
      mode.innerHTML = '<span class="dot"></span>' + (md === 'fakt' ? 'Fakten · Stand 2026' : 'Szenario 2040');
      lastMode = md;
    }
    const mr = modeRun[sc.id];
    mode.style.opacity = ramp(t, mr.start + .35, mr.end - .1, .45).toFixed(3);
    // Nachricht, Sprecher und Wellenform
    const ma = ramp(t, 3.2, TL.duration - 3.5, .8);
    msg.style.opacity = (ma * .95).toFixed(3);
    prog.style.opacity = (ramp(t, TL.scenes[1].start, TL.duration - 3.5, 1) * .9).toFixed(3);
    bar.style.transform = `scaleX(${clamp(t / TL.duration).toFixed(4)})`;
    let cur = null;
    for (const l of lines) if (t >= l.start - .15 && t < l.end + .6) cur = l;
    const who = cur ? cur.speaker : null;
    if (who && who !== lastSpk) {
      spk.textContent = SPK[who].name;
      spk.style.color = `rgb(${SPK[who].rgb})`;
      spk.style.borderColor = `rgba(${SPK[who].rgb},.7)`;
      lastSpk = who;
    }
    spk.style.opacity = (cur ? ramp(t, cur.start - .15, cur.end + .6, .2) : 0).toFixed(3);
    const rgb = SPK[lastSpk || 'luca'].rgb;
    wave.clearRect(0, 0, 300, 44);
    const n = 36;
    for (let i = 0; i < n; i++) {
      const lv = voiceLevel(t - (n - 1 - i) * .028);
      const jit = .55 + .45 * Math.abs(Math.sin(i * 1.93 + t * 11.3));
      const h = Math.max(2.5, lv * 40 * jit);
      const a = .35 + .65 * (i / n);
      wave.fillStyle = `rgba(${rgb},${a.toFixed(2)})`;
      wave.fillRect(i * 8.3, 22 - h / 2, 4.2, h);
    }
    // Quellenzeile
    const s = SOURCES.find(s => t >= s.t0 && t < s.t1);
    if (s) {
      if (s !== lastSrc) { src.innerHTML = s.html; lastSrc = s; }
      src.style.opacity = (ramp(t, s.t0, s.t1, .4) * .95).toFixed(3);
    } else { src.style.opacity = 0; }
  });
})();
