#!/usr/bin/env node
/**
 * Importa el LISTADO de productos de una categoría desde la web antigua (WordPress)
 * y los agrega a src/data/products/<categoria>.ts. Después genera sus fichas .md
 * con scripts/importar-wordpress.mjs.
 *
 * Uso:
 *   node scripts/importar-categoria.mjs equipos-laboratorio
 *   node scripts/importar-categoria.mjs equipos-laboratorio https://bdinstruments.com/equipos-de-laboratorio-3/
 *
 * Opciones:
 *   --dry-run        muestra qué agregaría, sin escribir nada
 *   --solo-pagina    no sigue los botones "Página N" (solo la URL indicada)
 *   --sin-fichas     agrega los productos al catálogo pero no importa sus fichas
 *
 * Categorías: instrumentacion-analitica, equipos-laboratorio, mobiliario-laboratorio, materiales-laboratorio
 * Los productos que ya existen (mismo enlace a la web antigua) se omiten.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import { SITE, UPLOADS, clean, cleanUrl, fetchPage, normalizeName, pause, slugOf, slugify } from './lib/elementor.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'src/data/products');

/** Página de inicio del listado de cada categoría en la web antigua. */
const START_PAGES = {
  'instrumentacion-analitica': 'instrumentacion-analitica',
  'equipos-laboratorio': 'equipos-de-laboratorio',
  'mobiliario-laboratorio': 'mobiliario-de-laboratorio',
  'materiales-laboratorio': 'material-de-laboratorio',
};

/** Marcas escritas de forma irregular en la web antigua → nombre correcto. Amplíalo cuando haga falta. */
const BRAND_ALIASES = {
  'konica minolta': 'Konica Minolta',
  gas: 'G.A.S.',
  'turner design': 'Turner Designs',
  weisstechnik: 'Weiss Technik',
  'lab tech': 'Lab Tech',
  'w.s.tyler': 'W.S. Tyler',
};

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const [category, startUrl] = args.filter((a) => !a.startsWith('--'));
const dryRun = flags.has('--dry-run');

if (!START_PAGES[category]) {
  console.error(`Uso: node scripts/importar-categoria.mjs <categoria> [url-del-listado]\nCategorías: ${Object.keys(START_PAGES).join(', ')}`);
  process.exit(1);
}

// Texto en una sola línea (los títulos del listado a veces traen saltos de línea)
const text = (t = '') => clean(t).replace(/\s+/g, ' ');
const capitalize = (w) => w.charAt(0).toLocaleUpperCase('es') + w.slice(1).toLocaleLowerCase('es');

/** "(Konica minolta)" → "Konica Minolta"; "(huber)" → "Huber". */
function normalizeBrand(raw) {
  const brand = text(raw).replace(/^\(|\)$/g, '').replace(/,?\s*inc\.?$/i, '').trim();
  if (!brand) return 'Sin marca';
  const alias = BRAND_ALIASES[brand.toLowerCase()];
  if (alias) return alias;
  const isLower = brand === brand.toLowerCase();
  const isUpper = brand === brand.toUpperCase() && brand.length > 4;
  return isLower || isUpper ? brand.split(' ').map(capitalize).join(' ') : brand;
}

// ---------------------------------------------------------------------------
// 1. Recorre las páginas del listado (siguiendo los botones "Página N")
// ---------------------------------------------------------------------------

async function crawlListing(firstSlug) {
  const queue = [firstSlug];
  const visited = new Set();
  const found = new Map(); // wpSlug → producto
  const warnings = [];

  while (queue.length) {
    const wpSlug = queue.shift();
    if (visited.has(wpSlug)) continue;
    visited.add(wpSlug);

    const page = await fetchPage(wpSlug);
    const root = page && parse(page.html);
    if (!root) {
      warnings.push(`no existe la página de listado "${wpSlug}"`);
      continue;
    }

    for (const box of root.querySelectorAll('.elementor-widget-image-box')) {
      const name = normalizeName(box.querySelector('.elementor-image-box-title')?.text);
      const rawBrand = text(box.querySelector('.elementor-image-box-description')?.text);
      const href = box.querySelector('a')?.getAttribute('href') ?? '';
      const hasPage = href.startsWith(SITE);
      // Sin enlace ni marca "(…)" → es un adorno del listado (p. ej. el título de la categoría)
      if (!name || (!hasPage && !/^\(.+\)$/.test(rawBrand))) continue;
      if (!hasPage) warnings.push(`"${name}" no tiene página en la web antigua: se agrega sin ficha`);

      const key = hasPage ? slugOf(href) : slugify(name);
      if (found.has(key)) continue;
      found.set(key, {
        wpSlug: hasPage ? key : null,
        name,
        brand: normalizeBrand(rawBrand),
        image: cleanUrl(box.querySelector('img')?.getAttribute('src') ?? ''),
      });
    }

    if (!flags.has('--solo-pagina')) {
      for (const link of root.querySelectorAll('.elementor-widget-button a')) {
        const href = link.getAttribute('href') ?? '';
        if (/p[aá]gina/i.test(link.text) && href.startsWith(SITE)) queue.push(slugOf(href));
      }
    }
    await pause();
  }
  return { products: [...found.values()], pages: [...visited], warnings };
}

// ---------------------------------------------------------------------------
// 2. Compara con lo que ya existe y escribe en src/data/products/<categoria>.ts
// ---------------------------------------------------------------------------
async function loadExisting() {
  const slugs = new Set();
  const wpSlugs = new Set();
  const images = new Set();
  for (const file of await readdir(DATA_DIR)) {
    if (!file.endsWith('.ts')) continue;
    const src = await readFile(path.join(DATA_DIR, file), 'utf8');
    for (const m of src.matchAll(/slug:\s*'([^']+)'/g)) slugs.add(m[1]);
    for (const m of src.matchAll(/href:\s*`([^`]+)`/g)) wpSlugs.add(slugOf(m[1].replace(/^\$\{\w+\}/, '')));
    for (const m of src.matchAll(/image:\s*[`']([^`']+)[`']/g)) images.add(m[1].replace(/^\$\{UPLOADS\}/, UPLOADS));
  }
  return { slugs, wpSlugs, images };
}

const esc = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

function toEntry(p) {
  const image = p.image.startsWith(UPLOADS) ? `\`\${UPLOADS}${p.image.slice(UPLOADS.length)}\`` : `'${esc(p.image)}'`;
  return [
    '  {',
    `    slug: '${p.slug}',`,
    `    name: '${esc(p.name)}',`,
    `    brand: '${esc(p.brand)}',`,
    `    category: '${category}',`,
    `    image: ${image},`,
    ...(p.wpSlug ? [`    href: \`\${OLD_SITE}${p.wpSlug}/\`,`] : []),
    '  },',
  ].join('\n');
}

async function writeProducts(newProducts) {
  const file = path.join(DATA_DIR, `${category}.ts`);
  let src = await readFile(file, 'utf8');

  if (!src.includes('const UPLOADS')) {
    src = src.replace(
      /(import type[^\n]+\n)/,
      `$1\nconst UPLOADS = '${UPLOADS}';\nconst OLD_SITE = '${SITE}';\n`,
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const block = `\n  // --- Importado de la web antigua (${today}) ---\n${newProducts.map(toEntry).join('\n')}\n`;
  const end = src.lastIndexOf('];');
  if (end === -1) throw new Error(`no encuentro el cierre "];" en ${file}`);
  const before = src.slice(0, end).replace(/\[\s*$/, '[');
  src = `${before}${block}${src.slice(end)}`;
  await writeFile(file, src, 'utf8');
}

// ---------------------------------------------------------------------------
async function main() {
  const firstSlug = startUrl ? slugOf(startUrl) : START_PAGES[category];
  console.log(`Leyendo listado de "${category}" desde ${SITE}${firstSlug}/ …`);

  const { products, pages, warnings } = await crawlListing(firstSlug);
  const existing = await loadExisting();

  // Ya existe si coincide el enlace a la web antigua, la URL nueva o la misma imagen
  // (la imagen cubre productos cuyo enlace o nombre cambió, p. ej. el ASX-560 escrito "ASK-560")
  const exists = (p) =>
    (p.wpSlug && existing.wpSlugs.has(p.wpSlug)) ||
    existing.slugs.has(slugify(p.name)) ||
    (p.image && existing.images.has(p.image));
  const skipped = products.filter(exists);
  const toAdd = products.filter((p) => !exists(p));
  for (const p of toAdd) {
    // URL nueva a partir del nombre visible; si se repite, se le añade la marca
    const base = slugify(p.name);
    let slug = existing.slugs.has(base) ? `${base}-${slugify(p.brand)}` : base;
    for (let n = 2; existing.slugs.has(slug); n++) slug = `${base}-${n}`;
    existing.slugs.add(slug);
    p.slug = slug;
  }

  console.log(`\nPáginas recorridas (${pages.length}): ${pages.join(', ')}`);
  console.log(`Productos encontrados: ${products.length} · ya existían: ${skipped.length} · nuevos: ${toAdd.length}`);
  toAdd.forEach((p) => console.log(`  + ${p.name}  [${p.brand}]  → /productos/${p.slug}`));
  if (warnings.length) {
    console.log('\nAvisos:');
    warnings.forEach((w) => console.log(`  ! ${w}`));
  }

  if (dryRun || !toAdd.length) {
    if (dryRun) console.log('\n(--dry-run: no se escribió nada)');
    return;
  }

  await writeProducts(toAdd);
  console.log(`\n✔ Agregados a src/data/products/${category}.ts`);

  const withPage = toAdd.filter((p) => p.wpSlug).map((p) => p.slug);
  // Ojo: sin slugs, importar-wordpress.mjs procesaría TODO el catálogo
  if (!flags.has('--sin-fichas') && withPage.length) {
    console.log('\nImportando fichas…');
    spawnSync(process.execPath, [path.join(ROOT, 'scripts/importar-wordpress.mjs'), ...withPage], {
      stdio: 'inherit',
    });
  }
}

main().catch((error) => {
  console.error(`✖ ${error.message}`);
  process.exit(1);
});
