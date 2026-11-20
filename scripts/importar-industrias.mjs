#!/usr/bin/env node
/**
 * Importa el listado de industrias de la web antigua (https://bdinstruments.com/industrias/)
 * y genera src/data/industrias.ts (nombre + imagen de cada industria).
 *
 * Uso:
 *   node scripts/importar-industrias.mjs            → regenera src/data/industrias.ts
 *   node scripts/importar-industrias.mjs --dry-run  → muestra el resultado sin escribir
 *
 * Ojo: regenerar sobrescribe el archivo; si lo editaste a mano, revisa el cambio con git.
 */
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { UPLOADS, clean, cleanUrl, fetchPage, normalizeName, slugify } from './lib/elementor.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_FILE = path.join(ROOT, 'src/data/industrias.ts');
const dryRun = process.argv.includes('--dry-run');

/** Erratas y tildes que faltan en la web antigua. Amplíalo cuando haga falta. */
const FIXES = {
  'Mineria / Geologia': 'Minería / Geología',
  'Plásticos y Polimeros': 'Plásticos y Polímeros',
  'Alimento humano': 'Alimento Humano',
  'Alimento para mascotas': 'Alimento para Mascotas',
  'Cannabis medicinal': 'Cannabis Medicinal',
  Snackfood: 'Snack Food',
};

const page = await fetchPage('industrias');
if (!page) throw new Error('no existe la página "industrias" en WordPress');

const industries = parse(page.html)
  .querySelectorAll('.elementor-widget-image-box')
  .map((box) => {
    const raw = clean(box.querySelector('.elementor-image-box-title')?.text).replace(/\s+/g, ' ');
    const name = FIXES[raw] ?? normalizeName(raw);
    const image = cleanUrl(box.querySelector('img')?.getAttribute('src') ?? '');
    return { slug: slugify(name), name, image };
  })
  .filter((industry) => industry.name && industry.image);

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
const imageExpr = (url) => (url.startsWith(UPLOADS) ? `\`\${UPLOADS}${url.slice(UPLOADS.length)}\`` : `'${esc(url)}'`);

const file = `/**
 * Industrias que atiende BD Instruments.
 * Generado con \`node scripts/importar-industrias.mjs\` desde https://bdinstruments.com/industrias/
 * (se puede editar a mano).
 */
const UPLOADS = '${UPLOADS}';

export interface Industry {
  slug: string;
  name: string;
  image: string;
}

export const industries: Industry[] = [
${industries.map((i) => `  { slug: '${i.slug}', name: '${esc(i.name)}', image: ${imageExpr(i.image)} },`).join('\n')}
];
`;

if (dryRun) console.log(file);
else await writeFile(OUT_FILE, file, 'utf8');
console.log(`✔ ${industries.length} industrias${dryRun ? ' (sin escribir)' : ' → src/data/industrias.ts'}`);
