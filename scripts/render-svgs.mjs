import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');

function write(relativePath, svg) {
  const file = join(root, relativePath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, svg);
}

function frame(inner, tint) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" fill="none">
  <rect width="640" height="480" fill="${tint}"/>
  <rect x="36" y="28" width="568" height="424" rx="28" fill="#F7F4EE"/>
  ${inner}
</svg>`;
}

function seal(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" fill="none">
  <rect width="128" height="128" rx="28" fill="#102833"/>
  <circle cx="64" cy="64" r="38" stroke="#E7C7B4" stroke-width="2"/>
  ${inner}
</svg>`;
}

const ink = '#102833';
const teal = '#1F6F6A';
const copper = '#C4622D';
const paper = '#F7F4EE';

const products = {
  'espectrofotometro-uv-vis': frame(
    `<rect x="120" y="150" width="400" height="210" rx="18" fill="${paper}" stroke="${ink}" stroke-width="4"/>
     <rect x="150" y="186" width="150" height="86" rx="8" fill="${ink}"/>
     <path d="M168 230c22-36 44-36 66 0 18 30 40 30 58 0" stroke="#7FCDC6" stroke-width="4" fill="none" stroke-linecap="round"/>
     <circle cx="430" cy="250" r="52" fill="#E7EEEF" stroke="${ink}" stroke-width="4"/>
     <circle cx="430" cy="250" r="18" fill="${copper}"/>
     <rect x="150" y="300" width="42" height="24" rx="6" fill="${teal}"/>
     <rect x="204" y="300" width="42" height="24" rx="6" fill="${ink}"/>
     <rect x="258" y="300" width="42" height="24" rx="6" fill="${copper}"/>`,
    '#E4EEF0',
  ),
  'phmetro-de-mesa': frame(
    `<rect x="150" y="120" width="220" height="250" rx="18" fill="${paper}" stroke="${ink}" stroke-width="4"/>
     <rect x="176" y="150" width="168" height="90" rx="10" fill="${ink}"/>
     <path d="M196 196h128" stroke="#7FCDC6" stroke-width="6" stroke-linecap="round"/>
     <circle cx="196" cy="320" r="16" fill="${teal}"/>
     <circle cx="246" cy="320" r="16" fill="${copper}"/>
     <path d="M400 150c40 10 70 70 40 140" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
     <circle cx="430" cy="300" r="22" fill="#E7F3F1" stroke="${teal}" stroke-width="4"/>
     <path d="M430 286v28" stroke="${teal}" stroke-width="3"/>`,
    '#E7F3F1',
  ),
  'centrifuga-refrigerada': frame(
    `<rect x="140" y="110" width="360" height="270" rx="24" fill="${paper}" stroke="${ink}" stroke-width="4"/>
     <circle cx="320" cy="230" r="92" fill="#E7EEEF" stroke="${ink}" stroke-width="4"/>
     <circle cx="320" cy="230" r="18" fill="${copper}"/>
     <path d="M320 230 L320 150 M320 230 L392 268 M320 230 L248 268" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
     <rect x="176" y="318" width="70" height="22" rx="6" fill="${teal}"/>
     <rect x="260" y="318" width="120" height="22" rx="6" fill="${ink}"/>`,
    '#E4EEF0',
  ),
  'autoclave-vertical': frame(
    `<rect x="220" y="90" width="200" height="300" rx="90" fill="${paper}" stroke="${ink}" stroke-width="4"/>
     <rect x="200" y="150" width="240" height="28" rx="8" fill="${ink}"/>
     <rect x="248" y="196" width="144" height="110" rx="12" fill="#E7EEEF" stroke="${teal}" stroke-width="3"/>
     <circle cx="320" cy="118" r="18" fill="${copper}"/>
     <path d="M300 250h40M320 230v40" stroke="${teal}" stroke-width="4" stroke-linecap="round"/>
     <rect x="250" y="330" width="140" height="16" rx="6" fill="${ink}"/>`,
    '#F3EBE3',
  ),
  'microscopio-binocular': frame(
    `<path d="M250 120h140" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
     <circle cx="270" cy="120" r="22" fill="none" stroke="${ink}" stroke-width="4"/>
     <circle cx="370" cy="120" r="22" fill="none" stroke="${ink}" stroke-width="4"/>
     <path d="M320 142 v70" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
     <circle cx="320" cy="230" r="28" fill="#E7F3F1" stroke="${teal}" stroke-width="4"/>
     <path d="M320 258 v70" stroke="${ink}" stroke-width="6"/>
     <rect x="220" y="328" width="200" height="22" rx="6" fill="${ink}"/>
     <path d="M250 350 v36 M390 350 v36 M230 386 h180" stroke="#8D6B45" stroke-width="6" stroke-linecap="round"/>`,
    '#E7F3F1',
  ),
  'incubadora-co2': frame(
    `<rect x="160" y="80" width="320" height="320" rx="20" fill="${paper}" stroke="${ink}" stroke-width="4"/>
     <rect x="196" y="116" width="248" height="200" rx="12" fill="#E7F3F1" stroke="${teal}" stroke-width="3"/>
     <path d="M230 210c20-30 40-30 60 0 16 24 36 24 52 0" stroke="${teal}" stroke-width="4" fill="none"/>
     <circle cx="250" cy="300" r="10" fill="${copper}"/>
     <circle cx="290" cy="300" r="10" fill="${ink}"/>
     <rect x="340" y="286" width="70" height="28" rx="6" fill="${ink}"/>`,
    '#E7F3F1',
  ),
  'balanza-analitica': frame(
    `<rect x="170" y="150" width="300" height="200" rx="16" fill="${paper}" stroke="${ink}" stroke-width="4"/>
     <rect x="210" y="186" width="220" height="120" rx="8" fill="#E7EEEF" stroke="${teal}" stroke-width="3"/>
     <path d="M250 300 h140" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
     <rect x="286" y="300" width="68" height="18" rx="4" fill="${ink}"/>
     <rect x="250" y="214" width="120" height="28" rx="6" fill="${ink}"/>
     <path d="M262 228 h96" stroke="#7FCDC6" stroke-width="4" stroke-linecap="round"/>`,
    '#F3EBE3',
  ),
  'estufa-de-secado': frame(
    `<rect x="170" y="90" width="300" height="300" rx="16" fill="${paper}" stroke="${ink}" stroke-width="4"/>
     <rect x="206" y="126" width="228" height="180" rx="10" fill="#F8E7DC" stroke="${copper}" stroke-width="3"/>
     <path d="M240 200 h160M240 230 h160M240 260 h160" stroke="${copper}" stroke-width="3" stroke-linecap="round"/>
     <circle cx="250" cy="340" r="12" fill="${ink}"/>
     <rect x="290" y="328" width="90" height="24" rx="6" fill="${ink}"/>`,
    '#F8EFE8',
  ),
  'agitador-magnetico': frame(
    `<rect x="150" y="220" width="340" height="90" rx="16" fill="${paper}" stroke="${ink}" stroke-width="4"/>
     <rect x="180" y="248" width="120" height="34" rx="8" fill="${ink}"/>
     <circle cx="360" cy="265" r="16" fill="${copper}"/>
     <path d="M230 220c20-90 160-90 180 0" fill="#E7F3F1" stroke="${teal}" stroke-width="4"/>
     <rect x="300" y="168" width="40" height="10" rx="3" fill="${ink}"/>`,
    '#E7F3F1',
  ),
  'bano-maria': frame(
    `<rect x="140" y="160" width="360" height="180" rx="20" fill="${paper}" stroke="${ink}" stroke-width="4"/>
     <path d="M180 230c20-20 40 20 60 0s40 20 60 0 40 20 60 0 40 20 60 0" stroke="${teal}" stroke-width="4" fill="none" stroke-linecap="round"/>
     <rect x="190" y="120" width="28" height="90" rx="8" fill="#E7EEEF" stroke="${ink}" stroke-width="3"/>
     <rect x="250" y="100" width="28" height="110" rx="8" fill="#E7EEEF" stroke="${ink}" stroke-width="3"/>
     <rect x="310" y="130" width="28" height="80" rx="8" fill="#E7EEEF" stroke="${ink}" stroke-width="3"/>
     <rect x="180" y="292" width="80" height="18" rx="6" fill="${copper}"/>`,
    '#E4EEF0',
  ),
  'cabina-flujo-laminar': frame(
    `<path d="M140 120 h360 v220 H140z" fill="${paper}" stroke="${ink}" stroke-width="4"/>
     <path d="M140 120 l40-48 h280 l40 48" fill="#E7EEEF" stroke="${ink}" stroke-width="4"/>
     <path d="M200 160 v140 M280 160 v140 M360 160 v140 M440 160 v140" stroke="#7FCDC6" stroke-width="3"/>
     <rect x="180" y="300" width="280" height="16" rx="4" fill="${ink}"/>
     <circle cx="460" cy="150" r="8" fill="${copper}"/>`,
    '#E7F3F1',
  ),
  'set-micropipetas': frame(
    `<g stroke="${ink}" stroke-width="4" fill="${paper}">
      <path d="M230 90 h28 v150 l-8 28 h-12 l-8-28z"/>
      <path d="M306 120 h28 v150 l-8 28 h-12 l-8-28z"/>
      <path d="M382 150 h28 v150 l-8 28 h-12 l-8-28z"/>
    </g>
     <path d="M236 150 h16 M312 176 h16 M388 206 h16" stroke="${teal}" stroke-width="4" stroke-linecap="round"/>
     <rect x="200" y="330" width="240" height="28" rx="8" fill="${ink}"/>
     <circle cx="244" cy="188" r="6" fill="${copper}"/>
     <circle cx="320" cy="214" r="6" fill="${copper}"/>
     <circle cx="396" cy="244" r="6" fill="${copper}"/>`,
    '#F3EBE3',
  ),
};

const seals = {
  analitica: seal(
    `<path d="M40 78c8-20 14-20 22 0 6 16 14 16 20 0 6 14 12 14 18-6" stroke="#F3EFE6" stroke-width="3" fill="none" stroke-linecap="round"/>`,
  ),
  microbiologia: seal(
    `<circle cx="64" cy="64" r="16" stroke="#F3EFE6" stroke-width="3"/>
     <circle cx="64" cy="64" r="5" fill="#C4622D"/>`,
  ),
  pesaje: seal(
    `<path d="M40 78h48M64 50v28M46 50h36" stroke="#F3EFE6" stroke-width="3" stroke-linecap="round"/>
     <path d="M46 50l-10 16h20zM82 50l-10 16h20z" fill="#E7C7B4"/>`,
  ),
  temperatura: seal(
    `<rect x="58" y="36" width="12" height="48" rx="6" stroke="#F3EFE6" stroke-width="3"/>
     <circle cx="64" cy="86" r="12" fill="#C4622D"/>`,
  ),
  bioseguridad: seal(
    `<path d="M64 36l22 10v18c0 16-10 26-22 30-12-4-22-14-22-30V46z" stroke="#F3EFE6" stroke-width="3" fill="none"/>`,
  ),
  consumibles: seal(
    `<path d="M58 36h12v34l-6 22h0l-6-22z" fill="#F3EFE6"/>
     <path d="M60 52h8" stroke="#102833" stroke-width="2"/>`,
  ),
};

function scene(shapes) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" fill="none">
    <rect width="800" height="520" fill="#E7EEEF"/>
    <rect x="28" y="28" width="744" height="464" rx="28" fill="#F7F4EE"/>
    ${shapes}
  </svg>`;
}

const projects = {
  'laboratorio-clinico': scene(
    `<rect x="80" y="120" width="280" height="280" rx="20" fill="#E7F3F1" stroke="#102833" stroke-width="4"/>
     <circle cx="220" cy="250" r="70" fill="#F7F4EE" stroke="#102833" stroke-width="4"/>
     <path d="M220 250l0-60M220 250l54 30M220 250l-54 30" stroke="#102833" stroke-width="5" stroke-linecap="round"/>
     <rect x="420" y="150" width="260" height="220" rx="16" fill="#102833"/>
     <path d="M460 230h180M460 270h120" stroke="#7FCDC6" stroke-width="6" stroke-linecap="round"/>
     <circle cx="470" cy="320" r="12" fill="#C4622D"/>`,
  ),
  'calidad-alimentos': scene(
    `<rect x="90" y="160" width="260" height="200" rx="16" fill="#F7F4EE" stroke="#102833" stroke-width="4"/>
     <path d="M140 250h160" stroke="#102833" stroke-width="8" stroke-linecap="round"/>
     <rect x="168" y="200" width="100" height="24" rx="6" fill="#102833"/>
     <path d="M430 140c30 20 70 120 40 200" stroke="#1F6F6A" stroke-width="8" stroke-linecap="round"/>
     <rect x="500" y="180" width="180" height="180" rx="16" fill="#F8E7DC" stroke="#C4622D" stroke-width="4"/>
     <path d="M540 240h100M540 280h100" stroke="#C4622D" stroke-width="4" stroke-linecap="round"/>`,
  ),
  'agua-potable': scene(
    `<rect x="80" y="140" width="360" height="240" rx="18" fill="#F7F4EE" stroke="#102833" stroke-width="4"/>
     <rect x="110" y="176" width="150" height="80" rx="8" fill="#102833"/>
     <path d="M128 216c18-24 36-24 54 0 14 20 30 20 44 0" stroke="#7FCDC6" stroke-width="4" fill="none"/>
     <circle cx="340" cy="250" r="48" fill="#E7F3F1" stroke="#1F6F6A" stroke-width="4"/>
     <path d="M520 120c20 80 20 140 0 240" stroke="#1F6F6A" stroke-width="8" stroke-linecap="round"/>
     <path d="M560 160c16 60 16 120 0 180" stroke="#8D6B45" stroke-width="6" stroke-linecap="round"/>
     <path d="M600 190c12 40 12 80 0 130" stroke="#C4622D" stroke-width="6" stroke-linecap="round"/>`,
  ),
  investigacion: scene(
    `<rect x="90" y="100" width="250" height="300" rx="18" fill="#F7F4EE" stroke="#102833" stroke-width="4"/>
     <rect x="124" y="140" width="182" height="150" rx="10" fill="#E7F3F1" stroke="#1F6F6A" stroke-width="3"/>
     <rect x="400" y="220" width="280" height="80" rx="14" fill="#F7F4EE" stroke="#102833" stroke-width="4"/>
     <path d="M470 220c16-70 120-70 140 0" fill="#E7F3F1" stroke="#1F6F6A" stroke-width="4"/>
     <path d="M430 150h24v70l-8 16h-8l-8-16z" fill="#F7F4EE" stroke="#102833" stroke-width="3"/>
     <path d="M490 170h24v70l-8 16h-8l-8-16z" fill="#F7F4EE" stroke="#102833" stroke-width="3"/>`,
  ),
};

for (const [name, svg] of Object.entries(products)) {
  write(`public/images/productos/${name}.svg`, svg);
}
for (const [name, svg] of Object.entries(seals)) {
  write(`public/images/marcas/${name}.svg`, svg);
}
for (const [name, svg] of Object.entries(projects)) {
  write(`public/images/proyectos/${name}.svg`, svg);
}

console.log('SVGs escritos');
