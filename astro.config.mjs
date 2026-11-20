// @ts-check
import { defineConfig } from 'astro/config';

// `astro dev` → no optimizamos imágenes remotas (las páginas abren al instante mientras trabajas).
const isDev = process.argv.includes('dev');

export default defineConfig({
  site: 'https://bdinstruments.com',
  compressHTML: true,
  // Al pasar el mouse sobre un enlace, el navegador precarga esa página: el clic se siente instantáneo.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  image: {
    // Las imágenes de productos aún viven en el WordPress antiguo. Al compilar, Astro las descarga
    // y genera versiones WebP más livianas que se publican junto al sitio (dist/_astro).
    // En desarrollo no se autoriza el dominio: las imágenes del Markdown se muestran tal cual.
    // OJO: si se apaga WordPress antes de llevar las imágenes al proyecto, la compilación fallará.
    domains: isDev ? [] : ['bdinstruments.com'],
  },
});
