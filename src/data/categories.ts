// src/data/categories.ts
export interface Category {
  slug: string;
  name: string;
  description: string;
}

export const categories = [
  {
    slug: 'instrumentacion-analitica',
    name: 'Instrumentación Analítica',
    description: 'Equipos especializados para análisis instrumental, medición y control en la industria.',
  },
  {
    slug: 'equipos-laboratorio',
    name: 'Equipos de Laboratorio',
    description: 'Soluciones de equipamiento para laboratorios de investigación, control de calidad e industria.',
  },
  {
    slug: 'mobiliario-laboratorio',
    name: 'Mobiliario de Laboratorio',
    description: 'Soluciones de mobiliario para laboratorios de investigación, control de calidad e industria.',
  },
  {
    slug: 'materiales-laboratorio',
    name: 'Materiales de Laboratorio',
    description: 'Suministros y materiales esenciales para el funcionamiento eficiente de los laboratorios.',
  },
] as const satisfies readonly Category[];

export type CategorySlug = (typeof categories)[number]['slug'];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}