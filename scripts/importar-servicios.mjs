#!/usr/bin/env node
/**
 * Importa los servicios de la web antigua (https://bdinstruments.com/servicios/) y genera
 * un borrador Markdown por servicio en src/content/servicios/<slug>.md.
 *
 * Del listado toma la tarjeta (título y resumen) y de la página de cada servicio el
 * contenido completo; la primera imagen de esa página se usa como imagen de la tarjeta.
 *
 * Uso:
 *   node scripts/importar-servicios.mjs              → importa los servicios nuevos
 *   node scripts/importar-servicios.mjs --dry-run    → muestra el resultado sin escribir
 *   node scripts/importar-servicios.mjs --force      → sobrescribe los .md existentes
 *                                                      (salvo los marcados "REVISADO A MANO")
 *
 * Los archivos generados son BORRADORES: revisa la redacción antes de publicarlos.
 */
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'node-html-parser';
import {
  clean,
  cleanUrl,
  convertPage,
  describe,
  fetchPage,
  normalizeName,
  pause,
  searchPage,
  slugOf,
  slugify,
  toMarkdownFile,
} from './lib/elementor.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'src/content/servicios');
const LISTING = 'servicios';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const force = args.has('--force');

const exists = (file) => access(file).then(() => true, () => false);
const oneLine = (t) => clean(t).replace(/\s+/g, ' ');

/** Cada columna del listado = icon-box (título y resumen) + botón "VER MÁS". */
async function readListing() {
  const page = await fetchPage(LISTING);
  if (!page) throw new Error(`no existe la página "${LISTING}" en WordPress`);
  const root = parse(page.html);

  const cards = [];
  for (const column of root.querySelectorAll('.elementor-column')) {
    const box = column.querySelector('.elementor-widget-icon-box');
    const link = column.querySelector('.elementor-widget-button a')?.getAttribute('href');
    // Solo columnas "hoja": la columna exterior también contiene tarjetas, pero no es una de ellas
    if (!box || !link || box.closest('.elementor-column') !== column) continue;
    if (cards.some((card) => slugOf(card.href) === slugOf(link))) continue;
    cards.push({
      title: oneLine(box.querySelector('.elementor-icon-box-title')?.text),
      summary: oneLine(box.querySelector('.elementor-icon-box-description')?.text),
      href: cleanUrl(link),
    });
  }
  return cards;
}

/**
 * Imagen para la tarjeta del listado: la primera del cuerpo que no use ya otro servicio
 * (en la web antigua algunas páginas repiten la imagen de otra) y que no sea una miniatura
 * de WordPress (p. ej. "104-300x252-1.png").
 */
function cardImage(markdown, taken) {
  const images = [...markdown.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g)].map((m) => m[1]);
  const isThumbnail = (url) => {
    const width = Number(url.match(/-(\d{2,4})x\d{2,4}(?:-\d+)?\.\w+$/)?.[1]);
    return width > 0 && width < 400;
  };
  const free = images.filter((url) => !taken.has(url));
  return free.find((url) => !isThumbnail(url)) ?? free[0] ?? images[0];
}

async function main() {
  const cards = await readListing();
  console.log(`Listado: ${cards.length} servicios en https://bdinstruments.com/${LISTING}/\n`);
  if (!dryRun) await mkdir(OUT_DIR, { recursive: true });

  const report = { creados: [], omitidos: [], fallidos: [] };
  const takenImages = new Set();
  for (const [index, card] of cards.entries()) {
    try {
      let page = await fetchPage(slugOf(card.href));
      if (!page) page = await searchPage(normalizeName(card.title));
      if (!page) throw new Error(`no encuentro la página de "${card.title}" (${card.href})`);

      const title = normalizeName(page.title || card.title);
      const slug = slugify(title);
      const outFile = path.join(OUT_DIR, `${slug}.md`);
      if (!dryRun && (await exists(outFile))) {
        const reviewed = (await readFile(outFile, 'utf8')).includes('REVISADO A MANO');
        if (reviewed || !force) {
          report.omitidos.push(`${slug} (${reviewed ? 'revisado a mano' : 'ya existe'})`);
          continue;
        }
      }

      const result = convertPage(page.html);
      const image = cardImage(result.markdown, takenImages);
      if (image) takenImages.add(image);
      else result.warnings.push('sin imagen para la tarjeta');
      const file = toMarkdownFile({
        source: page.link,
        fields: { title, summary: card.summary, image, order: index + 1 },
        ...result,
      });

      if (dryRun) console.log(`===== ${slug} =====\n${file}\n`);
      else await writeFile(outFile, file, 'utf8');
      report.creados.push(`${slug} (${describe(result)})`);
    } catch (error) {
      report.fallidos.push(`${card.title}: ${error.message}`);
    }
    await pause();
  }

  console.log(`✔ ${dryRun ? 'Procesados' : 'Creados'} (${report.creados.length})`);
  report.creados.forEach((line) => console.log(`  ${line}`));
  if (report.omitidos.length) {
    console.log(`\n↷ Omitidos (${report.omitidos.length})`);
    report.omitidos.forEach((line) => console.log(`  ${line}`));
  }
  if (report.fallidos.length) {
    console.log(`\n✖ Fallidos (${report.fallidos.length})`);
    report.fallidos.forEach((line) => console.log(`  ${line}`));
  }
}

main().catch((error) => {
  console.error(`✖ ${error.message}`);
  process.exit(1);
});
