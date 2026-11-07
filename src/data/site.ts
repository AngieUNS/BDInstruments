/** Datos públicos de BD Instruments en Lima. */
export const site = {
  name: 'BD Instruments',
  tagline: 'Instrumentación analítica y equipos de laboratorio',
  description:
    'Suministro, instalación y soporte de instrumentación analítica y equipos de laboratorio en Lima, Perú.',
  email: 'ventas@bdinstruments.com',
  infoEmail: 'info@bdinstruments.com',
  phoneDisplay: '(01) 304 3765',
  phoneTel: '+5113043765',
  whatsappDisplay: '+51 925 634 419',
  whatsapp: '51925634419',
  whatsappMessage: 'Hola, deseo información sobre equipos o servicios de BD Instruments.',
  address: 'Av. Marginal 601, Ate – Salamanca',
  city: 'Lima, Perú',
  hours: 'Lunes a viernes, 8:30 a.m. – 5:00 p.m.',
} as const;

export function whatsappHref(message = site.whatsappMessage) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
}
