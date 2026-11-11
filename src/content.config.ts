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
          description: z.string(),
        }),
      )
      .optional(),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  }),
});

export const collections = { productos };
