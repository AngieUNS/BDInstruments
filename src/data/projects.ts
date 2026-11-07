export interface Project {
  slug: string;
  title: string;
  sector: string;
  summary: string;
  need: string;
  scope: string[];
  image: string;
}

export const projects: Project[] = [
  {
    slug: 'laboratorio-clinico',
    title: 'Laboratorio clínico',
    sector: 'Salud',
    summary: 'Montaje de centrifugación, microscopía y cabina para el área de procesamiento.',
    need: 'Un laboratorio que separa muestras, observa frotis y necesita una zona limpia para preparar material.',
    scope: [
      'Centrífuga, microscopio binocular y cabina de flujo laminar',
      'Instalación, verificación de arranque y capacitación del turno',
      'Plan de mantenimiento para los tres equipos',
    ],
    image: '/images/proyectos/laboratorio-clinico.svg',
  },
  {
    slug: 'calidad-alimentos',
    title: 'Control de calidad de alimentos',
    sector: 'Industria',
    summary: 'Pesaje, pH y estufa de secado para controles de recepción y producto terminado.',
    need: 'Una planta que registra humedad, acidez y peso de lote varias veces por turno.',
    scope: [
      'Balanza analítica, pH-metro y estufa de secado',
      'Puesta en marcha junto al método de la planta',
      'Verificación periódica de balanza y pH-metro',
    ],
    image: '/images/proyectos/calidad-alimentos.svg',
  },
  {
    slug: 'laboratorio-clinico',
    title: 'Laboratorio clínico',
    sector: 'Salud',
    summary: 'Montaje de centrifugación, microscopía y cabina para el área de procesamiento.',
    need: 'Un laboratorio que separa muestras, observa frotis y necesita una zona limpia para preparar material.',
    scope: [
      'Centrífuga, microscopio binocular y cabina de flujo laminar',
      'Instalación, verificación de arranque y capacitación del turno',
      'Plan de mantenimiento para los tres equipos',
    ],
    image: '/images/proyectos/laboratorio-clinico.svg',
  },
  {
    slug: 'investigacion',
    title: 'Laboratorio universitario',
    sector: 'Investigación',
    summary: 'Incubación, agitación y micropipetas para prácticas y proyectos de semestre.',
    need: 'Un aula-laboratorio compartida por varios cursos, con equipos robustos y fáciles de explicar.',
    scope: [
      'Incubadora, agitador magnético y set de micropipetas',
      'Instalación y guía corta de uso para docentes',
      'Mantenimiento entre periodos académicos',
    ],
    image: '/images/proyectos/investigacion.svg',
  },
];
