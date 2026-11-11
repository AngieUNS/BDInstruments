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
import { parse } from 'node-html-parser';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'src/data/products');
const OUT_DIR = path.join(ROOT, 'src/content/productos');
const API = 'https://bdinstruments.com/wp-json/wp/v2/pages';

const args = process.argv.slice(2);
const force = args.includes('--force');
const dryRun = args.includes('--dry-run');
const only = args.filter((arg) => !arg.startsWith('--'));

// ---------------------------------------------------------------------------
// 1. Lista de productos (slug nuevo → slug de WordPress) leída de src/data/products/*.ts
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// 2. HTML de Elementor → Markdown
// ---------------------------------------------------------------------------
const INVISIBLE = /[​-‍⁠﻿]/g; // espacios de ancho cero que WordPress cuela en textos y URLs
const clean = (text) => text.replace(INVISIBLE, '').replace(/ /g, ' ').replace(/[ \t]+/g, ' ').trim();
// En las URLs el carácter invisible es parte real del nombre del archivo: se codifica, no se borra.
const cleanUrl = (url) => url?.trim().replace(INVISIBLE, (char) => encodeURIComponent(char));

/** Texto en línea con **negritas** y [enlaces](url). */
function inline(node) {
  if (node.nodeType === 3) return node.text.replace(/\s+/g, ' ');
  const tag = node.rawTagName?.toLowerCase();
  if (tag === 'br') return '\n';
  const inner = node.childNodes.map(inline).join('');
  if (!inner.trim()) return inner;
  if (tag === 'b' || tag === 'strong') return `**${inner.trim()}** `;
  if (tag === 'em' || tag === 'i') return `*${inner.trim()}* `;
  if (tag === 'a') {
    const href = cleanUrl(node.getAttribute('href'));
    return href && href !== '#' ? `[${inner.trim()}](${href})` : inner;
  }
  return inner;
}

const isHeadingLine = (line) =>
  line.length <= 70 && !/[.:;,]$/.test(line) && !/^[-•]/.test(line);

/** Convierte un párrafo (que puede contener <br>) en bloques Markdown. */
function paragraphToBlocks(node) {
  const blocks = [];
  const lines = inline(node)
    .split('\n')
    .map((line) => clean(line).replace(/\*\*\s*\*\*/g, ''))
    .filter(Boolean);

  lines.forEach((line, index) => {
    const bold = line.match(/^\*\*(.+?)\*\*$/);
    // Un párrafo que es solo negrita, o una línea corta seguida de más texto → título
    const boldTitle = bold?.[1].trim().replace(/:$/, '');
    if (boldTitle && isHeadingLine(boldTitle)) blocks.push(`## ${boldTitle}`);
    else if (index === 0 && lines.length > 1 && isHeadingLine(line.replace(/\*\*/g, '')))
      blocks.push(`## ${line.replace(/\*\*/g, '').trim()}`);
    else blocks.push(line);
  });
  return blocks;
}

function textEditorToMarkdown(container) {
  const blocks = [];
  for (const node of container.childNodes) {
    const tag = node.rawTagName?.toLowerCase();
    if (node.nodeType === 3) {
      if (clean(node.text)) blocks.push(clean(node.text));
    } else if (tag === 'ul' || tag === 'ol') {
      const items = node.querySelectorAll('li').map((li, i) => {
        const text = clean(inline(li).replace(/\n/g, ' '));
        return tag === 'ol' ? `${i + 1}. ${text}` : `- ${text}`;
      });
      blocks.push(items.join('\n'));
    } else if (/^h[1-6]$/.test(tag)) {
      blocks.push(`## ${clean(node.text)}`);
    } else if (tag === 'table') {
      blocks.push(tableToMarkdown(node));
    } else if (tag === 'p' || tag === 'div' || tag === 'span') {
      blocks.push(...paragraphToBlocks(node));
    }
  }
  // Un párrafo suelto y corto, sin punto final, seguido de texto → título ("Sección de Química")
  return blocks.filter(Boolean).map((block, i, all) =>
    !/^(##|- |\d+\. |!\[|\||\*)/.test(block) && !block.includes('\n') && isHeadingLine(block) &&
    all[i + 1] && !all[i + 1].startsWith('## ')
      ? `## ${block}`
      : block,
  );
}

function tableToMarkdown(table) {
  const rows = table.querySelectorAll('tr').map((tr) =>
    tr.querySelectorAll('th,td').map((cell) => clean(cell.text).replace(/\|/g, '/')),
  );
  if (!rows.length) return '';
  const width = Math.max(...rows.map((row) => row.length));
  const pad = (row) => [...row, ...Array(width - row.length).fill('')];
  const [head, ...body] = rows.map(pad);
  return [`| ${head.join(' | ')} |`, `| ${head.map(() => '---').join(' | ')} |`, ...body.map((r) => `| ${r.join(' | ')} |`)].join('\n');
}

const imageOf = (widget) => {
  const img = widget.querySelector('img');
  if (!img) return null;
  return { src: cleanUrl(img.getAttribute('src')), alt: clean(img.getAttribute('alt') || '') };
};

// ---------------------------------------------------------------------------
// 3. Recorre los widgets de la página en orden
// ---------------------------------------------------------------------------
function convertPage(html, wpUrl) {
  const root = parse(html);
  const widgets = root.querySelectorAll('.elementor-widget');
  const data = { summary: undefined, brochureUrl: undefined, youtubeId: undefined, models: [] };
  const body = [];
  const warnings = [];

  // Agrupa por sección: una sección con [imagen + icon-box] es una tarjeta de "modelo".
  const sectionOf = (w) => w.closest('.elementor-inner-section') ?? w.closest('.elementor-section');
  const handled = new Set();
  let firstHeading = true;

  for (const widget of widgets) {
    if (handled.has(widget)) continue;
    const type = widget.getAttribute('data-widget_type')?.split('.')[0];
    const container = widget.querySelector('.elementor-widget-container') ?? widget;

    // Imagen + icon-box en la misma fila → modelo
    if (type === 'image' || type === 'icon-box') {
      const siblings = widgets.filter((w) => sectionOf(w) === sectionOf(widget));
      const types = siblings.map((w) => w.getAttribute('data-widget_type')?.split('.')[0]).sort();
      if (types.length === 2 && types[0] === 'icon-box' && types[1] === 'image') {
        const image = imageOf(siblings.find((w) => w.getAttribute('data-widget_type').startsWith('image')));
        const box = siblings.find((w) => w.getAttribute('data-widget_type').startsWith('icon-box'));
        const name = clean(box.querySelector('.elementor-icon-box-title')?.text ?? '');
        const description = clean(box.querySelector('.elementor-icon-box-description')?.text ?? '');
        if (name && description) {
          data.models.push({ name, image: image?.src, description });
          siblings.forEach((w) => handled.add(w));
          continue;
        }
      }
    }

    switch (type) {
      case 'icon-box': {
        const title = clean(widget.querySelector('.elementor-icon-box-title')?.text ?? '');
        const description = clean(widget.querySelector('.elementor-icon-box-description')?.text ?? '');
        if (/^productos$/i.test(title) || /BD Intru/i.test(description)) break; // migas de pan
        if (title) body.push(`## ${title}`);
        if (description) body.push(description);
        break;
      }
      case 'heading': {
        const text = clean(inline(container).replace(/\n+/g, ' — '));
        if (!text) break;
        if (firstHeading) {
          data.summary = text; // el título grande de la cabecera
          firstHeading = false;
        } else body.push(`## ${text}`);
        break;
      }
      case 'text-editor':
        body.push(...textEditorToMarkdown(container));
        break;
      case 'image': {
        const image = imageOf(widget);
        if (image?.src) body.push(`![${image.alt}](${image.src})`);
        break;
      }
      case 'image-box': {
        const image = imageOf(widget);
        const title = clean(widget.querySelector('.elementor-image-box-title')?.text ?? '');
        const description = clean(widget.querySelector('.elementor-image-box-description')?.text ?? '');
        if (image?.src) body.push(`![${image.alt || title}](${image.src})`);
        if (title) body.push(`*${title}*`);
        if (description) body.push(description);
        break;
      }
      case 'button': {
        const href = cleanUrl(widget.querySelector('a')?.getAttribute('href')) ?? '';
        if (/drive\.google|\.pdf($|\?)|dropbox/i.test(href)) data.brochureUrl ??= href;
        break; // los botones de WhatsApp se ignoran: la web nueva tiene su propio botón
      }
      case 'video': {
        const settings = widget.getAttribute('data-settings') ?? '';
        const id = settings.match(/(?:youtu\.be\\?\/|v=|embed\\?\/)([\w-]{11})/)?.[1];
        if (id) data.youtubeId ??= id;
        break;
      }
      case 'icon-list': {
        const items = widget
          .querySelectorAll('.elementor-icon-list-text')
          .map((item) => clean(item.text))
          .filter(Boolean);
        if (items.length) body.push(items.map((item) => `- ${item}`).join('\n'));
        break;
      }
      case 'divider':
      case 'spacer':
        break;
      default:
        warnings.push(`widget no reconocido: ${type}`);
        if (clean(container.text)) body.push(clean(container.text));
    }
  }

  // Une bloques, evitando títulos repetidos o vacíos consecutivos
  const blocks = body
    .map((block) => block.replace(/^## [|—–-]\s*/, '## ')) // "## | iPeak" → "## iPeak"
    .filter((block, i, all) => !(block.startsWith('## ') && all[i + 1]?.startsWith('## ')));
  if (!blocks.length) warnings.push('sin contenido de texto');
  return { data, markdown: blocks.join('\n\n'), warnings, wpUrl };
}

// ---------------------------------------------------------------------------
// 4. Escribe el .md
// ---------------------------------------------------------------------------
const yamlString = (value) => JSON.stringify(value); // JSON es YAML válido

function toFile({ data, markdown, wpUrl }) {
  const lines = ['---', `# Importado de ${wpUrl} — BORRADOR: revisar redacción`];
  if (data.summary) lines.push(`summary: ${yamlString(data.summary)}`);
  if (data.brochureUrl) lines.push(`brochureUrl: ${yamlString(data.brochureUrl)}`);
  if (data.youtubeId) lines.push(`youtubeId: ${yamlString(data.youtubeId)}`);
  if (data.models.length) {
    lines.push('models:');
    for (const model of data.models) {
      lines.push(`  - name: ${yamlString(model.name)}`);
      if (model.image) lines.push(`    image: ${yamlString(model.image)}`);
      lines.push(`    description: ${yamlString(model.description)}`);
    }
  }
  lines.push('---', '', markdown, '');
  return lines.join('\n');
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
      const url = `${API}?slug=${encodeURIComponent(product.wpSlug)}&_fields=link,content`;
      const response = await fetch(url, { headers: { 'User-Agent': 'bd-site-importer' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const [page] = await response.json();
      if (!page) throw new Error(`no existe la página "${product.wpSlug}" en WordPress`);

      const result = convertPage(page.content.rendered, page.link);
      // Si el "resumen" es solo el nombre del producto, no aporta nada
      if (result.data.summary?.toLowerCase() === product.name?.toLowerCase()) result.data.summary = undefined;
      const file = toFile(result);
      const note = [
        `${result.markdown.split('\n## ').length - 1} secciones`,
        `${result.data.models.length} modelos`,
        result.data.brochureUrl ? 'ficha' : 'sin ficha',
        result.data.youtubeId ? 'video' : null,
        ...result.warnings,
      ].filter(Boolean).join(', ');

      if (dryRun) console.log(`\n===== ${product.slug} =====\n${file}`);
      else await writeFile(outFile, file, 'utf8');
      report.creados.push(`${product.slug} (${note})`);
    } catch (error) {
      report.fallidos.push(`${product.slug}: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 300)); // no saturar el servidor
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
