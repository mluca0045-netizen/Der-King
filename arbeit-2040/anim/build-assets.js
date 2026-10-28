// Erzeugt anim/assets/icons.js (Lucide-Icons, ISC-Lizenz) und anim/assets/world.js
// (Punkt-Weltkarte aus Natural-Earth-Daten via world-atlas). Aufruf: node anim/build-assets.js
const fs = require('fs');
const path = require('path');
const topojson = require('topojson-client');
const d3 = require('d3-geo');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'assets');
fs.mkdirSync(OUT, { recursive: true });

const ICONS = [
  'stethoscope', 'smartphone', 'piggy-bank', 'rocket', 'trending-up', 'trending-down', 'shopping-cart',
  'store', 'sofa', 'moon', 'laptop', 'scan-line', 'train-front', 'users', 'user', 'map-pin', 'power',
  'wrench', 'sun', 'wind', 'zap', 'triangle-alert', 'message-square', 'sparkles', 'bot', 'scale',
  'briefcase', 'monitor', 'house', 'building-2', 'factory', 'cog', 'brain-circuit', 'cpu', 'hand-heart',
  'heart-pulse', 'hammer', 'hard-hat', 'battery-charging', 'coins', 'hand-coins', 'graduation-cap',
  'lightbulb', 'chart-line', 'chart-candlestick', 'clock', 'calendar-days', 'globe', 'coffee', 'landmark',
  'baby', 'heart', 'bell-ring', 'check', 'x', 'arrow-right', 'circle-check', 'sprout', 'school',
  'book-open', 'puzzle', 'target', 'user-round', 'crown', 'bike', 'banknote', 'wallet', 'building',
  'lock', 'shield-check', 'signature', 'file-text', 'list-checks', 'bell-off', 'bed', 'mail',
];

const icons = {};
for (const name of ICONS) {
  const svg = fs.readFileSync(path.join(ROOT, 'node_modules/lucide-static/icons', name + '.svg'), 'utf8');
  icons[name] = svg.replace(/<!--.*?-->/s, '').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/\s+/g, ' ').trim();
}
fs.writeFileSync(path.join(OUT, 'icons.js'),
  '// Lucide Icons (https://lucide.dev), ISC-Lizenz\nwindow.ICONS = ' + JSON.stringify(icons) + ';\n');

// Punkt-Weltkarte: Equal-Earth-Projektion, Raster aus Landflächen-Treffern
const world = require('world-atlas/land-110m.json');
const land = topojson.feature(world, world.objects.land);
const W = 1600, H = 780;
const proj = d3.geoEqualEarth().fitExtent([[10, 10], [W - 10, H - 10]], { type: 'Sphere' });
const inv = proj.invert;
const STEP = 13;
const dots = [];
for (let y = STEP / 2; y < H; y += STEP) {
  for (let x = STEP / 2; x < W; x += STEP) {
    const ll = inv([x, y]);
    if (!ll || !isFinite(ll[0])) continue;
    if (ll[1] < -58) continue; // Antarktis weglassen
    if (d3.geoContains(land, ll)) dots.push([Math.round(x), Math.round(y)]);
  }
}
const cities = {
  Leipzig: [12.37, 51.34], Lissabon: [-9.14, 38.72], Seoul: [126.98, 37.57],
};
const cityXY = {};
for (const [k, v] of Object.entries(cities)) cityXY[k] = proj(v).map(Math.round);
fs.writeFileSync(path.join(OUT, 'world.js'),
  '// Landflächen: Natural Earth (gemeinfrei) via world-atlas (ISC)\nwindow.WORLD = ' +
  JSON.stringify({ w: W, h: H, step: STEP, dots, cities: cityXY }) + ';\n');
console.log('icons', Object.keys(icons).length, 'dots', dots.length, cityXY);
