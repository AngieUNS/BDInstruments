#!/usr/bin/env node
/**
 * Importa los proyectos de la web antigua (https://bdinstruments.com/proyectos/) y genera
 * un borrador Markdown por proyecto en src/content/proyectos/<slug>.md.
 *
 * Del listado toma la tarjeta (título, resumen e imagen) y de la página de cada proyecto
 * el contenido completo (texto, imágenes, video, ficha).
 *
 * Uso:
 *   node scripts/importar-proyectos.mjs              → importa los proyectos nuevos
 *   node scripts/importar-proyectos.mjs --dry-run    → muestra el resultado sin escribir
 *   node scripts/importar-proyectos.mjs --force      → sobrescribe los .md existentes
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
const OUT_DIR = path.join(ROOT, 'src/content/proyectos');
const LISTING = 'proyectos';

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const force = args.has('--force');

const exists = (file) => access(file).then(() => true, () => false);
const oneLine = (t) => clean(t).replace(/\s+/g, ' ');

/** "CÁMARA DE MADURACIÓN DE PALTA" → "Cámara de maduración de palta" (solo si viene todo en mayúsculas). */
function titleCase(title) {
  const letters = title.replace(/[^\p{L}]/gu, '');
  if (letters.length < 8 || letters !== letters.toLocaleUpperCase('es')) return normalizeName(title);
  const lower = title.toLocaleLowerCase('es');
  return lower.charAt(0).toLocaleUpperCase('es') + lower.slice(1);
}

/** Primer párrafo de texto del cuerpo, recortado a ~220 caracteres en un final de frase. */
function excerpt(markdown) {
  const paragraph = markdown
    .split('\n\n')
    .find((block) => block.length > 60 && !/^(##|- |\d+\. |!\[|\||\*)/.test(block));
  if (!paragraph) return undefined;
  const plain = paragraph.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  if (plain.length <= 220) return plain;
  const cut = plain.slice(0, 220);
  const end = cut.lastIndexOf('. ');
  return end > 100 ? cut.slice(0, end + 1) : `${cut.slice(0, cut.lastIndexOf(' '))}…`;
}

/** Cada fila del listado = imagen + icon-box (título y resumen) + botón "VER MÁS". */
async function readListing() {
  const page = await fetchPage(LISTING);
  if (!page) throw new Error(`no existe la página "${LISTING}" en WordPress`);
  const root = parse(page.html);

  const cards = [];
  for (const row of root.querySelectorAll('.elementor-inner-section')) {
    const box = row.querySelector('.elementor-widget-icon-box');
    const link = row.querySelector('.elementor-widget-button a')?.getAttribute('href');
    if (!box || !link) continue; // la cabecera "Proyectos" no tiene botón
    cards.push({
      title: oneLine(box.querySelector('.elementor-icon-box-title')?.text),
      summary: oneLine(box.querySelector('.elementor-icon-box-description')?.text),
      image: cleanUrl(row.querySelector('.elementor-widget-image img')?.getAttribute('src')),
      href: cleanUrl(link),
    });
  }
  return cards;
}

async function main() {
  const cards = await readListing();
  console.log(`Listado: ${cards.length} proyectos en https://bdinstruments.com/${LISTING}/\n`);
  if (!dryRun) await mkdir(OUT_DIR, { recursive: true });

  const report = { creados: [], omitidos: [], fallidos: [] };
  for (const [index, card] of cards.entries()) {
    try {
      // El enlace del listado puede tener erratas en el slug: si no existe, se busca por título
      let page = await fetchPage(slugOf(card.href));
      if (!page) page = await searchPage(normalizeName(card.title));
      if (!page) throw new Error(`no encuentro la página de "${card.title}" (${card.href})`);

      // El título de la página suele estar mejor escrito que el del listado ("ARMÓSFERA")
      const title = titleCase(page.title || card.title);
      const slug = slugify(title);
      const outFile = path.join(OUT_DIR, `${slug}.md`);
      if (!dryRun && (await exists(outFile))) {
        // Los archivos marcados "REVISADO A MANO" nunca se sobrescriben, ni siquiera con --force
        const reviewed = (await readFile(outFile, 'utf8')).includes('REVISADO A MANO');
        if (reviewed || !force) {
          report.omitidos.push(`${slug} (${reviewed ? 'revisado a mano' : 'ya existe'})`);
          continue;
        }
      }

      const result = convertPage(page.html);
      // En la web antigua varias tarjetas repiten el resumen de otra: entonces se usa el primer párrafo
      const copied = cards.slice(0, index).some((other) => other.summary === card.summary);
      const summary = copied || !card.summary ? excerpt(result.markdown) : card.summary;
      const file = toMarkdownFile({
        source: page.link,
        fields: { title, summary, image: card.image, order: index + 1 },
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
    console.log(`\n↷ Omitidos (${report.omitidos.length}) — usa --force para sobrescribir`);
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
