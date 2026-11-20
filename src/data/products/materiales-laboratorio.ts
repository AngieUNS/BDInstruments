import type { ProductCardItem } from '../products';

const UPLOADS = 'https://bdinstruments.com/wp-content/uploads/';
const OLD_SITE = 'https://bdinstruments.com/';

export const laboratoryMaterialsProducts: ProductCardItem[] = [
  // --- Importado de la web antigua (2026-11-11) ---
  {
    slug: 'equipos-de-trasiego',
    name: 'Equipos de trasiego',
    brand: 'Burkle',
    category: 'materiales-laboratorio',
    image: `${UPLOADS}2023/06/Equipos-de-trasiego.png`,
    href: `${OLD_SITE}equipos-de-trasiego/`,
  },
  {
    slug: 'muestreadores',
    name: 'Muestreadores',
    brand: 'Burkle',
    category: 'materiales-laboratorio',
    image: `${UPLOADS}2023/06/Muestreadores.png`,
    href: `${OLD_SITE}muestreadores/`,
  },
  {
    slug: 'recipientes',
    name: 'Recipientes',
    brand: 'Burkle',
    category: 'materiales-laboratorio',
    image: `${UPLOADS}2023/06/Recipientes.png`,
    href: `${OLD_SITE}recipientes/`,
  },
  {
    slug: 'material-de-laboratorio-e-industrial',
    name: 'Material de laboratorio e industrial',
    brand: 'Burkle',
    category: 'materiales-laboratorio',
    image: `${UPLOADS}2023/06/Material-de-laboratorio-e-industrial.png`,
    href: `${OLD_SITE}material-de-laboratorio-e-industrial/`,
  },
];
