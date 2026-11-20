/**
 * Textos de las secciones con listado + página de detalle (src/content/proyectos y src/content/servicios).
 * Los usan EntryCard.astro y EntryDetail.astro.
 */
export type SectionKey = 'proyectos' | 'servicios';

export interface SectionTexts {
  /** Ruta del listado, p. ej. "/proyectos". */
  base: string;
  /** Nombre en las migas de pan. */
  label: string;
  /** Etiqueta sobre el título cuando el .md no define `sector`. */
  kicker: string;
  /** Botón principal de la ficha. */
  cta: string;
  /** Texto bajo los botones de la cabecera. */
  help: string;
  infoKicker: string;
  infoTitle: string;
  /** Pregunta del recuadro fijo de la columna izquierda. */
  sideQuestion: string;
  galleryTitle: string;
  othersTitle: string;
  allLink: string;
  /** Texto del enlace de cada tarjeta. */
  cardCta: string;
  /** Cuando el .md no tiene texto ni galería. */
  emptyText: string;
}

export const sections: Record<SectionKey, SectionTexts> = {
  proyectos: {
    base: '/proyectos',
    label: 'Proyectos',
    kicker: 'Proyecto',
    cta: 'Solicitar asesoría',
    help: 'Diseñamos e implementamos soluciones a medida. Cuéntenos su necesidad.',
    infoKicker: 'Conozca el proyecto',
    infoTitle: 'Detalles del proyecto',
    sideQuestion: '¿Necesita un proyecto similar?',
    galleryTitle: 'Galería',
    othersTitle: 'Otros proyectos',
    allLink: 'Ver todos los proyectos',
    cardCta: 'Ver proyecto',
    emptyText: 'Consúltenos para conocer el alcance y los detalles de este proyecto.',
  },
  servicios: {
    base: '/servicios',
    label: 'Servicios',
    kicker: 'Servicio',
    cta: 'Solicitar servicio',
    help: 'Le acompañamos antes, durante y después de la compra de su equipo.',
    infoKicker: 'Conozca el servicio',
    infoTitle: 'Detalles del servicio',
    sideQuestion: '¿Necesita este servicio?',
    galleryTitle: 'Galería',
    othersTitle: 'Otros servicios',
    allLink: 'Ver todos los servicios',
    cardCta: 'Ver servicio',
    emptyText: 'Consúltenos para conocer el alcance de este servicio.',
  },
};
