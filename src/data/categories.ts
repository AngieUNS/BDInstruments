
export interface Category {
  slug: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    slug: 'instrumentacion-analitica',
    name: 'Instrumentación Analítica',
    description:
        'Equipos especializados para análisis instrumental, medición y control en la industria.',
  },
  {
    slug: 'equipos-laboratorio',
    name: 'Equipos de Laboratorio',
    description:
        'Soluciones de equipamiento para laboratorios de investigación, control de calidad e industria.',
  },
  {
    slug: 'proyectos-ingenieria',
    name: 'Proyectos e Ingeniería',
    description:
        'Desarrollo de proyectos y soluciones de ingeniería orientados a las necesidades de cada cliente.',
  },
  {
    slug: 'servicios',
    name: 'Servicios',
    description:
        'Capacitación, mantenimiento, soporte técnico y asistencia especializada para tus equipos.',
  },
];

export function getCategory(slug: string) {
  return categories.find((category) => category.slug === slug);
}
