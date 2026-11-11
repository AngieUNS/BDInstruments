import type { CategorySlug } from './categories';
import { instrumentationProducts } from './products/instrumentacion-analitica';
import { laboratoryEquipmentProducts } from './products/equipos-laboratorio';
import { laboratoryFurnitureProducts } from './products/mobiliario-laboratorio';
import { laboratoryMaterialsProducts } from './products/materiales-laboratorio';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
  image?: string;
  imageAlt?: string;
}

export interface ProductCardItem {
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  image: string;
  summary?: string;
  description?: string;
  applications?: string[];
  specs?: ProductSpec[];
  sections?: ProductSection[];
  brochureUrl?: string;
  /** Referencia a la página anterior para facilitar la migración del contenido. */
  href?: string;
}

export { instrumentationProducts, laboratoryEquipmentProducts, laboratoryFurnitureProducts, laboratoryMaterialsProducts };

export const products: ProductCardItem[] = [
  ...instrumentationProducts,
  ...laboratoryEquipmentProducts,
  ...laboratoryFurnitureProducts,
  ...laboratoryMaterialsProducts,
];

export const getProductsByCategory = (slug: CategorySlug) =>
  products.filter((product) => product.category === slug);

export const getProductsByBrand = (brand: string) =>
  products.filter((product) => product.brand === brand);

export const getProduct = (slug: string) =>
  products.find((product) => product.slug === slug);

export const brands = [...new Set(products.map((product) => product.brand))].sort();
export const featuredProducts = products.slice(0, 3);
