// Illustration: Blick aus Lucas Fenster im Jahr 2040 (Morgen- oder Abendstimmung).
// Liefert Handles für GSAP und registriert die Dauerbewegungen (Windräder, Drohnen, Bahn, Dampf).
function buildWindow(root, o = {}) {
  const dusk = !!o.dusk;
  const id = o.id || 'win';
  const R = rng(dusk ? 404 : 2040);
  const s = svg('svg', { viewBox: '0 0 1920 1080', width: 1920, height: 1080, class: 'abs', style: 'left:0;top:0' }, root);
  const defs = svg('defs', {}, s);
  const grad = (gid, stops, x2 = 0, y2 = 1) => {
    const g = svg('linearGradient', { id: gid, x1: 0, y1: 0, x2, y2 }, defs);
    for (const [off, col, op = 1] of stops) svg('stop', { offset: off, 'stop-color': col, 'stop-opacity': op }, g);
    return g;
  };
  const rgrad = (gid, stops) => {
    const g = svg('radialGradient', { id: gid, cx: .5, cy: .5, r: .5 }, defs);
    for (const [off, col, op = 1] of stops) svg('stop', { offset: off, 'stop-color': col, 'stop-opacity': op }, g);
    return g;
  };
  grad(id + 'sky', dusk
    ? [[0, '#0b1030'], [.38, '#2b1b5a'], [.62, '#7a2f6b'], [.8, '#e0566a'], [.92, '#ff9a5a'], [1, '#ffc27a']]
    : [[0, '#070d2e'], [.35, '#1b2366'], [.6, '#4a3486'], [.78, '#c25c87'], [.9, '#ff9b6a'], [1, '#ffd08a']]);
  rgrad(id + 'sun', [[0, '#fff6d8'], [.18, '#ffd58a'], [.45, '#ff9d5c', .55], [1, '#ff7a50', 0]]);
  grad(id + 'hill1', [[0, '#2a2560'], [1, '#141638']]);
  grad(id + 'hill2', [[0, '#1a1a48'], [1, '#0b0d26']]);
  grad(id + 'tower', [[0, '#1f2457'], [1, '#121535']]);
  grad(id + 'sill', [[0, '#141a38'], [.08, '#0b1024'], [1, '#04060f']]);
  grad(id + 'glare', [[0, '#ffffff', 0], [.5, '#ffffff', .07], [1, '#ffffff', 0]], 1, 1);
  grad(id + 'pot', [[0, '#2a2f55'], [1, '#14182f']]);

  const sky = svg('g', {}, s);
  svg('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: `url(#${id}sky)` }, sky);
  // Sterne
  const stars = svg('g', { opacity: dusk ? .5 : .8 }, sky);
  for (let i = 0; i < 90; i++) svg('circle', { cx: R() * 1920, cy: R() * 420, r: .6 + R() * 1.4, fill: '#dfe8ff', opacity: .3 + R() * .7 }, stars);
  // Sonne
  const sun = svg('g', {}, sky);
  svg('circle', { cx: 0, cy: 0, r: 300, fill: `url(#${id}sun)` }, sun);
  svg('circle', { cx: 0, cy: 0, r: 62, fill: '#fff1cf' }, sun);
  gsap.set(sun, { x: dusk ? 640 : 1270, y: dusk ? 770 : 800 });

  // Hügel hinten
  svg('path', { d: 'M0,760 C220,700 420,720 640,735 C860,750 1040,690 1260,705 C1480,720 1700,690 1920,715 L1920,1080 L0,1080 Z', fill: `url(#${id}hill1)`, opacity: .95 }, s);

  // Skyline
  const city = svg('g', {}, s);
  const lights = [];
  let x = 260;
  while (x < 1700) {
    const w = 34 + R() * 60, h = 70 + Math.pow(R(), 1.6) * 250;
    const base = 790;
    svg('rect', { x, y: base - h, width: w, height: h, fill: `url(#${id}tower)` }, city);
    if (R() < .35) {
      svg('line', { x1: x + w / 2, y1: base - h, x2: x + w / 2, y2: base - h - 26, stroke: '#2a3170', 'stroke-width': 2 }, city);
      lights.push(svg('circle', { cx: x + w / 2, cy: base - h - 27, r: 3, fill: '#ff5c7a' }, city));
    }
    for (let wy = base - h + 10; wy < base - 8; wy += 13) {
      for (let wx = x + 6; wx < x + w - 6; wx += 10) {
        if (R() < (dusk ? .42 : .26)) {
          svg('rect', { x: wx, y: wy, width: 4, height: 6, fill: R() < .75 ? '#ffd38a' : '#9feaff', opacity: .5 + R() * .45 }, city);
        }
      }
    }
    x += w + 4 + R() * 26;
  }

  // Hügel vorne mit Windrädern
  svg('path', { d: 'M0,820 C260,770 520,800 760,812 C1000,824 1260,780 1500,790 C1700,798 1820,786 1920,792 L1920,1080 L0,1080 Z', fill: `url(#${id}hill2)` }, s);
  const turbines = [];
  [[150, 795, 1], [330, 780, .8], [1540, 778, .9], [1700, 772, .75], [1840, 780, .62]].forEach(([tx, ty, sc]) => {
    const g = svg('g', { transform: `translate(${tx},${ty}) scale(${sc})` }, s);
    svg('path', { d: 'M-3,0 L-1.5,-150 L1.5,-150 L3,0 Z', fill: '#c9d3ff', opacity: .75 }, g);
    const rotor = svg('g', { transform: 'translate(0,-150)' }, g);
    for (let k = 0; k < 3; k++) svg('path', { d: 'M0,0 L-4,-8 L0,-92 L4,-8 Z', fill: '#e6ecff', opacity: .85, transform: `rotate(${k * 120})` }, rotor);
    svg('circle', { cx: 0, cy: 0, r: 4.5, fill: '#fff' }, rotor);
    turbines.push({ rotor, speed: 38 + R() * 22, ph: R() * 120 });
  });

  // Magnetbahn
  svg('line', { x1: 0, y1: 846, x2: 1920, y2: 836, stroke: '#3a4790', 'stroke-width': 3, opacity: .8 }, s);
  const train = svg('g', {}, s);
  svg('rect', { x: -220, y: -9, width: 220, height: 12, rx: 6, fill: '#e9f6ff' }, train);
  svg('rect', { x: -220, y: -9, width: 220, height: 12, rx: 6, fill: '#3be3ff', opacity: .55 }, train);
  svg('rect', { x: -520, y: -5, width: 300, height: 4, rx: 2, fill: '#3be3ff', opacity: .25 }, train);

  // Drohnen
  const drones = [0, 1, 2].map(i => {
    const g = svg('g', {}, s);
    svg('rect', { x: -9, y: -2, width: 18, height: 4, rx: 2, fill: '#0b0f26' }, g);
    const led = svg('circle', { cx: 0, cy: 3, r: 2.6, fill: i === 1 ? '#3be3ff' : '#ff5c7a' }, g);
    return { g, led, y: 330 + i * 120, sp: 26 + i * 11, ph: i * 600 };
  });

  // Fensterrahmen (Rahmen mit Ausschnitt, gerade Kanten wie Architekturfoto)
  const frame = svg('g', {}, s);
  svg('path', {
    d: 'M0,0 H1920 V1080 H0 Z M96,124 H1824 V884 H96 Z', 'fill-rule': 'evenodd', fill: '#03050d',
  }, frame);
  svg('rect', { x: 96, y: 124, width: 1728, height: 760, fill: 'none', stroke: '#ffffff', 'stroke-opacity': .08, 'stroke-width': 2 }, frame);
  svg('rect', { x: 1052, y: 124, width: 18, height: 760, fill: '#03050d' }, frame);
  svg('rect', { x: 1052, y: 124, width: 2, height: 760, fill: '#ffffff', opacity: .06 }, frame);
  svg('polygon', { points: '96,124 730,124 300,884 96,884', fill: `url(#${id}glare)`, opacity: .9 }, frame);
  svg('polygon', { points: '1150,124 1390,124 980,884 740,884', fill: `url(#${id}glare)`, opacity: .55 }, frame);
  // Fensterbank
  svg('rect', { x: 0, y: 884, width: 1920, height: 196, fill: `url(#${id}sill)` }, frame);
  svg('rect', { x: 0, y: 884, width: 1920, height: 2, fill: '#8fb6ff', opacity: .16 }, frame);

  // Pflanze
  const plant = svg('g', { transform: 'translate(250,884)' }, frame);
  const leaves = [[-30, -150, -32], [10, -175, 4], [44, -140, 34], [-58, -100, -60], [70, -95, 62], [-12, -120, -12], [24, -118, 18]];
  for (const [lx, ly, rot] of leaves) {
    svg('ellipse', { cx: lx * .55, cy: ly * .62, rx: 15, ry: 52, fill: '#0f3b33', stroke: '#41f0a6', 'stroke-opacity': .22, 'stroke-width': 2, transform: `rotate(${rot} ${lx * .55} ${ly * .62})` }, plant);
  }
  svg('path', { d: 'M-46,-40 L46,-40 L36,0 L-36,0 Z', fill: `url(#${id}pot)`, stroke: '#ffffff', 'stroke-opacity': .1 }, plant);

  // Tasse mit Dampf
  const mug = svg('g', { transform: 'translate(1650,884)' }, frame);
  svg('path', { d: 'M-34,-64 L34,-64 L30,-4 Q30,0 26,0 L-26,0 Q-30,0 -30,-4 Z', fill: '#d9e2ff' }, mug);
  svg('path', { d: 'M32,-52 C62,-52 62,-18 30,-18', fill: 'none', stroke: '#d9e2ff', 'stroke-width': 9 }, mug);
  svg('path', { d: 'M-34,-64 L34,-64 L33,-52 L-33,-52 Z', fill: '#ffffff', opacity: .4 }, mug);
  const steam = [-14, 4, 20].map((sx, k) => svg('path', { d: '', fill: 'none', stroke: '#ffffff', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: .0 }, mug));

  const state = { active: false, t0: o.t0 ?? 0 };
  FRAME.push(t => {
    if (t < (o.from ?? -1) || t > (o.to ?? 1e9)) return;
    for (const tb of turbines) tb.rotor.setAttribute('transform', `translate(0,-150) rotate(${(tb.ph + t * tb.speed) % 360})`);
    lights.forEach((l, i) => l.setAttribute('opacity', (Math.sin(t * 3 + i) > .2 ? .95 : .15).toFixed(2)));
    const tx = ((t * 260 + 300) % 2900) - 300;
    train.setAttribute('transform', `translate(${tx.toFixed(1)},${(846 - tx * 10 / 1920).toFixed(1)})`);
    drones.forEach((d, i) => {
      const dx = ((d.ph + t * d.sp) % 2200) - 140;
      const dy = d.y + Math.sin(t * .8 + i) * 16;
      d.g.setAttribute('transform', `translate(${dx.toFixed(1)},${dy.toFixed(1)})`);
      d.led.setAttribute('opacity', (Math.sin(t * 7 + i * 2) > 0 ? 1 : .2).toFixed(2));
    });
    steam.forEach((p, k) => {
      const ph = (t * .55 + k * .33) % 1;
      const yb = -70 - ph * 90;
      const xs = [-14, 4, 20][k];
      let d = `M${xs},${(-66).toFixed(1)}`;
      for (let j = 1; j <= 6; j++) {
        const yy = -66 - j * (14 + ph * 10);
        const xx = xs + Math.sin(j * 1.1 + t * 2.2 + k) * (5 + j * 1.8);
        d += ` L${xx.toFixed(1)},${yy.toFixed(1)}`;
      }
      p.setAttribute('d', d);
      p.setAttribute('opacity', (.28 * Math.sin(ph * Math.PI)).toFixed(3));
      p.setAttribute('transform', `translate(0,${(-ph * 20).toFixed(1)})`);
    });
  });
  return { svg: s, sun, stars, city, frame };
}
