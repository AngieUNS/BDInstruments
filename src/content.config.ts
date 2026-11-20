import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Ficha extendida de cada producto.
 *
 * - Un archivo por producto en `src/content/productos/<slug>.md`.
 * - El nombre del archivo debe coincidir con el `slug` definido en `src/data/products/*.ts`.
 * - El cuerpo del Markdown es la descripción larga (párrafos, listas, imágenes, títulos con ##).
 * - El frontmatter guarda los datos estructurados (resumen, ficha técnica, modelos, video).
 *
 * Si un producto no tiene archivo aquí, la página muestra el bloque "Información en preparación".
 */
const productos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/productos' }),
  schema: z.object({
    /** Texto corto bajo el título. Si no se pone, se usa el `summary` de products.ts. */
    summary: z.string().optional(),
    /** Enlace a la ficha técnica / catálogo PDF. */
    brochureUrl: z.string().url().optional(),
    /** ID del video de YouTube (lo que va después de youtu.be/). */
    youtubeId: z.string().optional(),
    /** Título del bloque de modelos (por defecto "Modelos disponibles"). */
    modelsTitle: z.string().optional(),
    /** Variantes, accesorios o módulos, cada uno con su imagen. */
    models: z
      .array(
        z.object({
          name: z.string(),
          image: z.string().optional(),
          description: z.string().optional(),
        }),
      )
      .optional(),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  }),
});

/** Esquema común de las páginas con listado + detalle (proyectos y servicios). */
const pageSchema = z.object({
  title: z.string(),
  /** Texto corto de la tarjeta del listado y de la cabecera. */
  summary: z.string().optional(),
  image: z.string(),
  /** Posición en el listado (menor = primero). */
  order: z.number().default(99),
  /** Etiqueta sobre el título (p. ej. "Agroindustria"); si falta, se usa el nombre de la sección. */
  sector: z.string().optional(),
  brochureUrl: z.string().url().optional(),
  youtubeId: z.string().optional(),
  models: z
    .array(z.object({ name: z.string(), image: z.string().optional(), description: z.string().optional() }))
    .optional(),
});

/**
 * Proyectos realizados: un archivo por proyecto en `src/content/proyectos/<slug>.md`.
 * Se generan con `node scripts/importar-proyectos.mjs` y se pueden editar a mano.
 */
const proyectos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/proyectos' }),
  schema: pageSchema,
});

/**
 * Servicios: un archivo por servicio en `src/content/servicios/<slug>.md`.
 * Se generan con `node scripts/importar-servicios.mjs` y se pueden editar a mano.
 */
const servicios = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/servicios' }),
  schema: pageSchema,
});

export const collections = { productos, proyectos, servicios };
