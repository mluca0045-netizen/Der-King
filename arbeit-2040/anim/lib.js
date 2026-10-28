// Hilfsfunktionen für Szenenaufbau, Timing und wiederkehrende Animationen.
gsap.registerPlugin(SplitText, DrawSVGPlugin, CustomEase, ScrambleTextPlugin);
gsap.config({ force3D: false });

const W = 1920, H = 1080;
const FRAME = [];   // Funktionen, die pro Bild mit der Zeit t aufgerufen werden
const SFX = [];     // Ton-Ereignisse für die Mischung: {t, type, gain}
const SOURCES = []; // Quellenzeile unten rechts: {t0, t1, html}
const SVGNS = 'http://www.w3.org/2000/svg';

CustomEase.create('soft', 'M0,0 C0.25,0.1 0.25,1 1,1');
CustomEase.create('snap', 'M0,0 C0.12,0.9 0.25,1 1,1');

function el(tag, opts = {}, parent) {
  const e = document.createElement(tag);
  if (opts.cls) e.className = opts.cls;
  if (opts.css) e.style.cssText = opts.css;
  if (opts.html != null) e.innerHTML = opts.html;
  if (opts.text != null) e.textContent = opts.text;
  if (opts.attrs) for (const [k, v] of Object.entries(opts.attrs)) e.setAttribute(k, v);
  (parent || opts.parent)?.appendChild(e);
  return e;
}

// absolut positionierter Block; x/y = linke obere Ecke
function box(parent, x, y, w, h, cls = '', html = '', css = '') {
  return el('div', {
    cls: 'abs ' + cls, html,
    css: `left:${x}px;top:${y}px;${w != null ? `width:${w}px;` : ''}${h != null ? `height:${h}px;` : ''}${css}`,
  }, parent);
}

function svg(tag, attrs = {}, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  parent?.appendChild(e);
  return e;
}

function icon(name, size = 48, color = 'currentColor', sw = 1.75, extra = '') {
  const inner = (window.ICONS && ICONS[name]) || '';
  return `<span class="ico" style="width:${size}px;height:${size}px;color:${color};${extra}">` +
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg></span>`;
}

function fmtDE(n, dec = 0) {
  return Number(n).toLocaleString('de-DE', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

// deterministischer Zufall
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s += 0x6D2B79F5; let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, k) => a + (b - a) * k;
const smooth = k => k * k * (3 - 2 * k);

// ---------- Timing ----------
function normTxt(s) { return s.toLowerCase().normalize('NFC').replace(/[^\p{L}\p{N}]+/gu, ''); }

function sceneCtx(sc) {
  const lines = {};
  for (const l of sc.lines) lines[l.id] = l;
  const L = id => {
    if (!lines[id]) throw new Error('Zeile fehlt: ' + id);
    return lines[id];
  };
  // Zeitpunkt, an dem ein Wort gesprochen wird (Whisper-Zeitstempel, sonst Textposition)
  const cue = (id, queries, fallback = 0, useEnd = false) => {
    const l = L(id);
    const qs = (Array.isArray(queries) ? queries : [queries]).map(normTxt);
    if (l.words) {
      for (const q of qs) {
        const w = l.words.find(w => normTxt(w.w).includes(q) || (q.length > 3 && q.includes(normTxt(w.w)) && normTxt(w.w).length > 3));
        if (w) return l.start + (useEnd ? w.e : w.s);
      }
    }
    const tts = normTxt(l.tts);
    for (const q of qs) {
      const i = tts.indexOf(q);
      if (i >= 0) return l.start + l.dur * ((i + (useEnd ? q.length : 0)) / tts.length);
    }
    return l.start + l.dur * fallback;
  };
  return { id: sc.id, start: sc.start, end: sc.end, dur: sc.end - sc.start, L, cue, sc };
}

function source(t0, t1, html) { SOURCES.push({ t0, t1, html }); }
function sfx(t, type, gain = 1) { SFX.push({ t: +t.toFixed(3), type, gain }); }

// ---------- wiederkehrende Animationen ----------
function revealUp(tl, targets, t, o = {}) {
  tl.fromTo(targets, { y: o.y ?? 46, opacity: 0, filter: `blur(${o.blur ?? 10}px)` },
    { y: 0, opacity: 1, filter: 'blur(0px)', duration: o.d ?? .8, ease: o.ease ?? 'power3.out', stagger: o.stagger ?? .06 }, t);
}

function popIn(tl, targets, t, o = {}) {
  tl.fromTo(targets, { scale: o.from ?? .5, opacity: 0 },
    { scale: 1, opacity: 1, duration: o.d ?? .6, ease: o.ease ?? 'back.out(1.8)', stagger: o.stagger ?? .08 }, t);
}

function fadeOut(tl, targets, t, o = {}) {
  tl.to(targets, { opacity: 0, y: o.y ?? 0, scale: o.scale ?? 1, filter: o.blur ? `blur(${o.blur}px)` : 'none',
    duration: o.d ?? .5, ease: o.ease ?? 'power2.in', stagger: o.stagger ?? 0 }, t);
}

function splitWords(node) {
  return new SplitText(node, { type: 'words', wordsClass: 'w' }).words;
}

function splitChars(node) {
  return new SplitText(node, { type: 'chars', charsClass: 'c' }).chars;
}

// Wörter eines Satzes tauchen synchron zur Sprache auf (gleichmäßig über [t0, t1])
function wordsAlong(tl, words, t0, t1, o = {}) {
  const n = words.length;
  words.forEach((w, i) => {
    const t = t0 + (t1 - t0) * (i / Math.max(1, n));
    tl.fromTo(w, { opacity: 0, y: o.y ?? 24, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: o.d ?? .45, ease: 'power2.out' }, t);
  });
}

function countUp(tl, node, from, to, t, d, fmt = v => fmtDE(v)) {
  const p = { v: from };
  node.textContent = fmt(from);
  tl.to(p, { v: to, duration: d, ease: 'power2.out', onUpdate: () => { node.textContent = fmt(p.v); } }, t);
}

function drawIn(tl, paths, t, d = 1, ease = 'power2.inOut', stagger = 0) {
  tl.fromTo(paths, { drawSVG: '0%' }, { drawSVG: '100%', duration: d, ease, stagger }, t);
}

// Szenencontainer ein-/ausblenden (weiche Kamerafahrt)
function sceneInOut(tl, node, S, o = {}) {
  const tin = o.tin ?? S.start, tout = o.tout ?? S.end - .6;
  tl.set(node, { autoAlpha: 1 }, tin);
  tl.fromTo(node, { opacity: 0, scale: o.scaleIn ?? 1.035, filter: 'blur(10px)' },
    { opacity: 1, scale: 1, filter: 'blur(0px)', duration: o.din ?? .8, ease: 'power2.out' }, tin);
  if (o.drift !== false) tl.fromTo(node, { x: 0 }, { x: o.driftX ?? -18, duration: Math.max(1, tout - tin), ease: 'none' }, tin);
  tl.to(node, { opacity: 0, scale: o.scaleOut ?? .975, filter: 'blur(8px)', duration: o.dout ?? .6, ease: 'power2.in' }, tout);
  tl.set(node, { autoAlpha: 0 }, tout + (o.dout ?? .6));
}

function makeScene(id) {
  return el('section', { cls: 'scene', attrs: { id: 'sc-' + id } }, document.getElementById('scenes'));
}

// Linien-/Flächendiagramm als SVG-Pfad aus Datenpunkten
function pathFrom(points, sx, sy, smoothK = 0) {
  const P = points.map(([x, y]) => [sx(x), sy(y)]);
  if (!smoothK) return 'M' + P.map(p => p.map(v => v.toFixed(1)).join(',')).join(' L');
  let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) * smoothK, p1[1] + (p2[1] - p0[1]) * smoothK];
    const c2 = [p2[0] - (p3[0] - p1[0]) * smoothK, p2[1] - (p3[1] - p1[1]) * smoothK];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

// Lautstärke der Stimme zur Zeit t (0..1) – für Wellenform und KI-Orb
function voiceLevel(t, speaker) {
  for (const sc of TL.scenes) {
    if (t < sc.start - 1 || t > sc.end + 1) continue;
    for (const l of sc.lines) {
      if ((speaker && l.speaker !== speaker) || !l.env) continue;
      if (t >= l.start && t < l.end) {
        const f = (t - l.start) * TL.fps;
        const i = Math.floor(f), k = f - i;
        return lerp(l.env[i] ?? 0, l.env[i + 1] ?? 0, k);
      }
    }
  }
  return 0;
}
