#!/usr/bin/env node
/**
 * Importa la información de los productos desde la web antigua (WordPress + Elementor)
 * y genera un borrador Markdown por producto en src/content/productos/<slug>.md.
 *
 * Uso:
 *   node scripts/importar-wordpress.mjs                 → todos los productos con `href`
 *   node scripts/importar-wordpress.mjs slug1 slug2     → solo esos productos
 *   node scripts/importar-wordpress.mjs --force ...     → sobrescribe archivos existentes
 *   node scripts/importar-wordpress.mjs --dry-run ...   → muestra el resultado sin escribir
 *
 * Los archivos generados son BORRADORES: revisa la redacción antes de publicarlos.
 * Nunca sobrescribe un .md existente salvo con --force.
 */
import { readFile, writeFile, readdir, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { convertPage, describe, fetchPage, pause, toMarkdownFile } from './lib/elementor.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'src/data/products');
const OUT_DIR = path.join(ROOT, 'src/content/productos');

const args = process.argv.slice(2);
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');
const only = args.filter((arg) => !arg.startsWith('--'));

/** Lista de productos (slug nuevo → slug de WordPress) leída de src/data/products/*.ts */
async function loadProducts() {
  const products = [];
  for (const file of await readdir(DATA_DIR)) {
    if (!file.endsWith('.ts')) continue;
    const source = await readFile(path.join(DATA_DIR, file), 'utf8');
    for (const block of source.split(/\n\s*\{\s*\n/)) {
      const slug = block.match(/slug:\s*'([^']+)'/)?.[1];
      const name = block.match(/name:\s*'([^']+)'/)?.[1];
      const href = block.match(/href:\s*`([^`]+)`/)?.[1];
      if (!slug || !href) continue;
      const wpSlug = href.replace(/^\$\{\w+\}/, '').replace(/\/+$/, '').split('/').pop();
      products.push({ slug, name, wpSlug });
    }
  }
  return products;
}

const exists = (file) => access(file).then(() => true, () => false);

async function main() {
  let products = await loadProducts();
  if (only.length) products = products.filter((p) => only.includes(p.slug));
  if (!products.length) {
    console.error('No hay productos que importar (¿el slug es correcto y tiene `href`?).');
    process.exit(1);
  }

  const report = { creados: [], omitidos: [], fallidos: [] };
  for (const product of products) {
    const outFile = path.join(OUT_DIR, `${product.slug}.md`);
    if (!force && !dryRun && (await exists(outFile))) {
      report.omitidos.push(`${product.slug} (ya existe)`);
      continue;
    }
    try {
      const page = await fetchPage(product.wpSlug);
      if (!page) throw new Error(`no existe la página "${product.wpSlug}" en WordPress`);

      const result = convertPage(page.html);
      // Si el "resumen" es solo el nombre del producto, no aporta nada
      if (result.data.summary?.toLowerCase() === product.name?.toLowerCase()) result.data.summary = undefined;
      const file = toMarkdownFile({ source: page.link, ...result });

      if (dryRun) console.log(`\n===== ${product.slug} =====\n${file}`);
      else await writeFile(outFile, file, 'utf8');
      report.creados.push(`${product.slug} (${describe(result)})`);
    } catch (error) {
      report.fallidos.push(`${product.slug}: ${error.message}`);
    }
    await pause(); // no saturar el servidor
  }

  console.log(`\n✔ ${dryRun ? 'Procesados' : 'Creados'} (${report.creados.length})`);
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

main();
