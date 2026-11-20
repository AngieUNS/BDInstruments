/**
 * Utilidades compartidas por los importadores: leen páginas del WordPress antiguo
 * (construidas con Elementor) y las convierten en Markdown.
 */
import { parse } from 'node-html-parser';

export const SITE = 'https://bdinstruments.com/';
export const UPLOADS = `${SITE}wp-content/uploads/`;
const API = `${SITE}wp-json/wp/v2/pages`;

// ---------------------------------------------------------------------------
// Texto
// ---------------------------------------------------------------------------
/** Espacios de ancho cero que WordPress cuela en textos y URLs. */
const INVISIBLE = new RegExp('[\\u200b-\\u200d\\u2060\\ufeff]', 'g');
const NBSP = new RegExp('\\u00a0', 'g');

export const clean = (text = '') => text.replace(INVISIBLE, '').replace(NBSP, ' ').replace(/[ \t]+/g, ' ').trim();
/** En las URLs el carácter invisible es parte real del nombre del archivo: se codifica, no se borra. */
export const cleanUrl = (url) => url?.trim().replace(INVISIBLE, (char) => encodeURIComponent(char));
export const slugOf = (url) => url.replace(/\/+$/, '').split('/').pop();

/** "Baño María (Lab Tech)" → "bano-maria-lab-tech" */
export const slugify = (text) =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const capitalize = (w) => w.charAt(0).toLocaleUpperCase('es') + w.slice(1).toLocaleLowerCase('es');

/** "ANALIZADOR DE LECHE" → "Analizador de Leche"; respeta siglas cortas (PCR, FSA, RH2). */
export function normalizeName(name) {
  const small = new Set(['de', 'del', 'la', 'las', 'el', 'los', 'y', 'e', 'o', 'para', 'por', 'en', 'con', 'a']);
  const result = clean(name)
    .replace(/\s+/g, ' ')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/(^|\s)(\|{1,3})(?=\s|$)/g, (_, space, bars) => space + 'I'.repeat(bars.length)) // "Tipo ||" → "Tipo II"
    .split(' ')
    .map((word, i) => {
      const letters = word.replace(/[^\p{L}]/gu, '');
      const isCaps = letters.length > 4 && letters === letters.toLocaleUpperCase('es');
      if (!isCaps) return word;
      const lower = word.toLocaleLowerCase('es');
      return i > 0 && small.has(lower) ? lower : capitalize(word);
    })
    .join(' ');
  return result.charAt(0).toLocaleUpperCase('es') + result.slice(1);
}

// ---------------------------------------------------------------------------
// API de WordPress
// ---------------------------------------------------------------------------
/** Devuelve { link, title, content } de una página por su slug, o null si no existe. */
export async function fetchPage(wpSlug) {
  const res = await fetch(`${API}?slug=${encodeURIComponent(wpSlug)}&_fields=link,title,content`, {
    headers: { 'User-Agent': 'bd-site-importer' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} en "${wpSlug}"`);
  const [page] = await res.json();
  return page ? { link: page.link, title: clean(page.title?.rendered ?? ''), html: page.content.rendered } : null;
}

/** Busca una página por texto (para enlaces rotos con erratas en el slug). */
export async function searchPage(text) {
  const res = await fetch(`${API}?search=${encodeURIComponent(text)}&_fields=slug&per_page=5`, {
    headers: { 'User-Agent': 'bd-site-importer' },
  });
  if (!res.ok) return null;
  const [first] = await res.json();
  return first ? fetchPage(first.slug) : null;
}

export const pause = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------------------------------------------------------------------------
// HTML de Elementor → Markdown
// ---------------------------------------------------------------------------
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

const isHeadingLine = (line) => line.length <= 70 && !/[.:;,]$/.test(line) && !/^[-•]/.test(line);

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

function tableToMarkdown(table) {
  const rows = table.querySelectorAll('tr').map((tr) =>
    tr.querySelectorAll('th,td').map((cell) => clean(cell.text).replace(/\|/g, '/')),
  );
  if (!rows.length) return '';
  const width = Math.max(...rows.map((row) => row.length));
  const pad = (row) => [...row, ...Array(width - row.length).fill('')];
  const [head, ...body] = rows.map(pad);
  return [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...body.map((r) => `| ${r.join(' | ')} |`),
  ].join('\n');
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
    !/^(##|- |\d+\. |!\[|\||\*)/.test(block) &&
    !block.includes('\n') &&
    isHeadingLine(block) &&
    all[i + 1] &&
    !all[i + 1].startsWith('## ')
      ? `## ${block}`
      : block,
  );
}

const imageOf = (widget) => {
  const img = widget.querySelector('img');
  if (!img) return null;
  return { src: cleanUrl(img.getAttribute('src')), alt: clean(img.getAttribute('alt') || '') };
};

/** "## LIBRE DE ESTRÉS" → "## Libre de estrés" (solo títulos escritos enteramente en mayúsculas). */
function sentenceCaseHeading(block) {
  const match = block.match(/^## (.+)$/);
  if (!match) return block;
  const letters = match[1].replace(/[^\p{L}]/gu, '');
  if (letters.length < 5 || letters !== letters.toLocaleUpperCase('es')) return block;
  const lower = match[1].toLocaleLowerCase('es');
  return `## ${lower.charAt(0).toLocaleUpperCase('es')}${lower.slice(1)}`;
}

/** Migas de pan de la cabecera ("Productos" / "BD Instruments - Proyectos - …"). */
const isBreadcrumb = (title, description) =>
  /^(productos|proyectos)$/i.test(title) || /^BD\s*In?s?tru/i.test(description); // "BD Instruments" o la errata "BD Intrumetns"

/**
 * Recorre los widgets de una página de Elementor en orden y devuelve
 * { data: { summary, brochureUrl, youtubeId, models }, markdown, warnings }.
 */
export function convertPage(html) {
  const root = parse(html);
  const widgets = root.querySelectorAll('.elementor-widget');
  const data = { summary: undefined, brochureUrl: undefined, youtubeId: undefined, models: [] };
  const body = [];
  const warnings = [];

  // Agrupa por sección: una sección con [imagen + icon-box] es una tarjeta de "modelo".
  const sectionOf = (w) => w.closest('.elementor-inner-section') ?? w.closest('.elementor-section');
  const typeOf = (w) => w.getAttribute('data-widget_type')?.split('.')[0];
  const handled = new Set();
  let firstHeading = true;

  for (const widget of widgets) {
    if (handled.has(widget)) continue;
    const type = typeOf(widget);
    const container = widget.querySelector('.elementor-widget-container') ?? widget;

    // Imagen + icon-box en la misma fila → modelo
    if (type === 'image' || type === 'icon-box') {
      const siblings = widgets.filter((w) => sectionOf(w) === sectionOf(widget));
      const types = siblings.map(typeOf).sort();
      if (types.length === 2 && types[0] === 'icon-box' && types[1] === 'image') {
        const image = imageOf(siblings.find((w) => typeOf(w) === 'image'));
        const box = siblings.find((w) => typeOf(w) === 'icon-box');
        const name = clean(box.querySelector('.elementor-icon-box-title')?.text ?? '');
        const description = clean(box.querySelector('.elementor-icon-box-description')?.text ?? '');
        if (name && description && !isBreadcrumb(name, description)) {
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
        if (isBreadcrumb(title, description)) break;
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
        // Galería de subproductos: imagen + título + "(Marca)" → tarjeta de modelo
        if (title && image?.src && /^\(.+\)$/.test(description)) {
          data.models.push({ name: title.charAt(0).toLocaleUpperCase('es') + title.slice(1), image: image.src });
          break;
        }
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
  const isPlainLine = (block) => !/^(##|- |\d+\. |!\[|\||\*)/.test(block) && !block.includes('\n');
  const blocks = body
    .map((block) => block.replace(/^## [|—–-]\s*/, '## ')) // "## | iPeak" → "## iPeak"
    .map(sentenceCaseHeading) // "## LIBRE DE ESTRÉS" → "## Libre de estrés"
    // Línea corta suelta justo antes de una lista → título ("Especificaciones de la cámara",
    // "Ofrecemos los siguientes servicios:")
    .map((block, i, all) => {
      const line = block.replace(/:$/, '');
      return isPlainLine(block) && isHeadingLine(line) && all[i + 1]?.startsWith('- ') ? `## ${line}` : block;
    })
    .filter((block, i, all) => !(block.startsWith('## ') && all[i + 1]?.startsWith('## ')));
  if (!blocks.length) warnings.push('sin contenido de texto');
  return { data, markdown: blocks.join('\n\n'), warnings };
}

// ---------------------------------------------------------------------------
// Escritura del .md
// ---------------------------------------------------------------------------
export const yamlString = (value) => JSON.stringify(value); // JSON es YAML válido

/** Frontmatter + cuerpo. `fields` va primero (en orden); luego los datos extraídos de la página. */
export function toMarkdownFile({ source, fields = {}, data, markdown }) {
  const lines = ['---', `# Importado de ${source} — BORRADOR: revisar redacción`];
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined && value !== '') lines.push(`${key}: ${yamlString(value)}`);
  }
  if (data.summary && fields.summary === undefined) lines.push(`summary: ${yamlString(data.summary)}`);
  if (data.brochureUrl) lines.push(`brochureUrl: ${yamlString(data.brochureUrl)}`);
  if (data.youtubeId) lines.push(`youtubeId: ${yamlString(data.youtubeId)}`);
  if (data.models.length) {
    lines.push('models:');
    for (const model of data.models) {
      lines.push(`  - name: ${yamlString(model.name)}`);
      if (model.image) lines.push(`    image: ${yamlString(model.image)}`);
      if (model.description) lines.push(`    description: ${yamlString(model.description)}`);
    }
  }
  lines.push('---', '', markdown, '');
  return lines.join('\n');
}

/** Resumen de una conversión para el reporte por consola. */
export const describe = ({ data, markdown, warnings }) =>
  [
    `${markdown.split('\n## ').length - 1} secciones`,
    `${data.models.length} modelos`,
    data.brochureUrl ? 'ficha' : 'sin ficha',
    data.youtubeId ? 'video' : null,
    ...warnings,
  ]
    .filter(Boolean)
    .join(', ');
