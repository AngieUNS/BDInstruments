/**
 * Industrias que atiende BD Instruments.
 * Generado con `node scripts/importar-industrias.mjs` desde https://bdinstruments.com/industrias/
 * (se puede editar a mano).
 */
const UPLOADS = 'https://bdinstruments.com/wp-content/uploads/';

export interface Industry {
  slug: string;
  name: string;
  image: string;
}

export const industries: Industry[] = [
  { slug: 'agroindustria', name: 'Agroindustria', image: `${UPLOADS}2023/04/1-9.jpg` },
  { slug: 'agropecuario', name: 'Agropecuario', image: `${UPLOADS}2023/04/Agropecuario.png` },
  { slug: 'alimento-animal', name: 'Alimento Animal', image: `${UPLOADS}2023/04/Alimento-Animal.png` },
  { slug: 'alimento-humano', name: 'Alimento Humano', image: `${UPLOADS}2023/04/Alimento-humano.png` },
  { slug: 'alimento-para-mascotas', name: 'Alimento para Mascotas', image: `${UPLOADS}2026/03/alimento_mascota-1.webp` },
  { slug: 'automatizacion', name: 'Automatización', image: `${UPLOADS}2026/03/automatizacion.webp` },
  { slug: 'azucareras-etanol', name: 'Azucareras/Etanol', image: `${UPLOADS}2023/04/Azucareras_Etanol.png` },
  { slug: 'bebidas', name: 'Bebidas', image: `${UPLOADS}2023/04/Bebidas.png` },
  { slug: 'biotecnologia', name: 'Biotecnología', image: `${UPLOADS}2023/04/Biotecnologia.png` },
  { slug: 'cannabis-medicinal', name: 'Cannabis Medicinal', image: `${UPLOADS}2023/04/Cannabis-medicinal%E2%80%8B.png` },
  { slug: 'carnicos', name: 'Cárnicos', image: `${UPLOADS}2023/04/Carnicos.png` },
  { slug: 'ciencia', name: 'Ciencia', image: `${UPLOADS}2023/04/Ciencia.png` },
  { slug: 'construccion', name: 'Construcción', image: `${UPLOADS}2023/04/Construccion.png` },
  { slug: 'cosmetico', name: 'Cosmético', image: `${UPLOADS}2023/04/Cosmetico.png` },
  { slug: 'diagnostico-clinico', name: 'Diagnóstico Clínico', image: `${UPLOADS}2023/04/Diagnostico-Clinico%E2%80%8B.png` },
  { slug: 'educacion-escolar', name: 'Educación Escolar', image: `${UPLOADS}2023/04/Educacion-Escolar.png` },
  { slug: 'educacion-superior', name: 'Educación Superior', image: `${UPLOADS}2023/04/Educaion-Superior.png` },
  { slug: 'electronica', name: 'Electrónica', image: `${UPLOADS}2023/04/Electronica.png` },
  { slug: 'energia', name: 'Energía', image: `${UPLOADS}2023/04/Energia.png` },
  { slug: 'farmaceuticas', name: 'Farmacéuticas', image: `${UPLOADS}2023/04/Farmaceuticas.png` },
  { slug: 'forestal', name: 'Forestal', image: `${UPLOADS}2023/04/Forestal.png` },
  { slug: 'hidrocarburos', name: 'Hidrocarburos', image: `${UPLOADS}2023/04/Hidrocarburos.png` },
  { slug: 'investigacion-cientifica', name: 'Investigación Científica', image: `${UPLOADS}2023/04/Investigacion-Cientifica%E2%80%8B.png` },
  { slug: 'industria-alimentaria', name: 'Industria Alimentaria', image: `${UPLOADS}2023/04/Industria-Alimentaria%E2%80%8B.png` },
  { slug: 'industria-textil', name: 'Industria Textil', image: `${UPLOADS}2023/04/Indsutria-Textil.png` },
  { slug: 'laboratorio-clinico', name: 'Laboratorio Clínico', image: `${UPLOADS}2023/04/Laboratorio-Clinico%E2%80%8B.png` },
  { slug: 'laboratorio-de-servicio', name: 'Laboratorio de Servicio', image: `${UPLOADS}2023/04/Laboratorio-de-Servicio%E2%80%8B.png` },
  { slug: 'lacteos', name: 'Lácteos', image: `${UPLOADS}2023/04/Lacteos.png` },
  { slug: 'madereras', name: 'Madereras', image: `${UPLOADS}2023/04/Madereras.png` },
  { slug: 'mantenimiento', name: 'Mantenimiento', image: `${UPLOADS}2023/04/Mantenimiento.png` },
  { slug: 'manufactura', name: 'Manufactura', image: `${UPLOADS}2023/04/Manufactura.png` },
  { slug: 'mecanica', name: 'Mecánica', image: `${UPLOADS}2023/04/Mecanica.png` },
  { slug: 'medicina', name: 'Medicina', image: `${UPLOADS}2023/04/Medicicna.png` },
  { slug: 'medicina-forense', name: 'Medicina Forense', image: `${UPLOADS}2023/04/Medicina-Forense.png` },
  { slug: 'medio-ambiente', name: 'Medio Ambiente', image: `${UPLOADS}2023/04/Medio-Ambiente.png` },
  { slug: 'mineria-geologia', name: 'Minería / Geología', image: `${UPLOADS}2023/04/Mineria-_-Geologia.png` },
  { slug: 'molineria', name: 'Molinería', image: `${UPLOADS}2023/04/Molineria.png` },
  { slug: 'oleaginosas', name: 'Oleaginosas', image: `${UPLOADS}2023/04/Oleaginosas.png` },
  { slug: 'panificadoras', name: 'Panificadoras', image: `${UPLOADS}2023/04/Panificadoras.png` },
  { slug: 'papel-carton', name: 'Papel/Cartón', image: `${UPLOADS}2023/04/Papel_Carton.png` },
  { slug: 'pesquero', name: 'Pesquero', image: `${UPLOADS}2023/04/Pesquera.png` },
  { slug: 'petroquimica', name: 'Petroquímica', image: `${UPLOADS}2023/04/Petroquimica.png` },
  { slug: 'plasticos-y-polimeros', name: 'Plásticos y Polímeros', image: `${UPLOADS}2023/04/Plasticos-y-Polimeros.png` },
  { slug: 'quimica', name: 'Química', image: `${UPLOADS}2023/04/Quimica.png` },
  { slug: 'salud', name: 'Salud', image: `${UPLOADS}2023/04/Salud.png` },
  { slug: 'siderurgicas', name: 'Siderúrgicas', image: `${UPLOADS}2023/04/Siderurgicas.png` },
  { slug: 'snack-food', name: 'Snack Food', image: `${UPLOADS}2023/04/Snackfood.png` },
];
