export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  summary: string;
  description: string;
  applications: string[];
  specs: ProductSpec[];
  image: string;
  featured: boolean;
}

export const products: Product[] = [
  {
    slug: 'espectrofotometro-uv-vis',
    name: 'Espectrofotómetro UV-Vis',
    category: 'analitica',
    summary: 'Lectura de absorbancia en el rango ultravioleta y visible para curvas y controles.',
    description:
      'Sirve para métodos que dependen de una longitud de onda fija o de un barrido corto. La cabina de muestra acepta cubetas estándar de 10 mm y el panel permite guardar métodos de uso frecuente.',
    applications: ['Agua y ambiental', 'Control de calidad', 'Docencia de química analítica'],
    specs: [
      { label: 'Rango', value: '190–1100 nm' },
      { label: 'Ancho de banda', value: '4 nm' },
      { label: 'Fuentes', value: 'Deuterio y tungsteno' },
      { label: 'Cubeta', value: '10 mm' },
    ],
    image: '/images/productos/espectrofotometro-uv-vis.svg',
    featured: true,
  },
  {
    slug: 'phmetro-de-mesa',
    name: 'pH-metro de mesa',
    category: 'analitica',
    summary: 'Medición de pH con compensación de temperatura y electrodos intercambiables.',
    description:
      'Está pensado para el mesón de control, con soporte de electrodo y calibración en puntos de buffer. La compensación de temperatura reduce el error cuando la muestra no está a la misma temperatura del buffer.',
    applications: ['Alimentos y bebidas', 'Agua de proceso', 'Formulación química'],
    specs: [
      { label: 'Rango de pH', value: '0–14' },
      { label: 'Resolución', value: '0,01 pH' },
      { label: 'Compensación', value: 'Temperatura automática' },
      { label: 'Electrodos', value: 'Intercambiables' },
    ],
    image: '/images/productos/phmetro-de-mesa.svg',
    featured: false,
  },
  {
    slug: 'centrifuga-refrigerada',
    name: 'Centrífuga refrigerada',
    category: 'analitica',
    summary: 'Separación de muestras con control de velocidad y temperatura de cámara.',
    description:
      'La refrigeración mantiene la muestra estable durante corridas largas. Los rotores se intercambian según el volumen del tubo y el equipo muestra la velocidad en rpm y en fuerza centrífuga relativa.',
    applications: ['Laboratorio clínico', 'Biología molecular', 'Control de calidad'],
    specs: [
      { label: 'Capacidad', value: '4 × 100 mL' },
      { label: 'Velocidad', value: 'Hasta 15 000 rpm' },
      { label: 'Temperatura', value: 'Hasta 4 °C' },
      { label: 'Rotores', value: 'Intercambiables' },
    ],
    image: '/images/productos/centrifuga-refrigerada.svg',
    featured: true,
  },
  {
    slug: 'autoclave-vertical',
    name: 'Autoclave vertical',
    category: 'microbiologia',
    summary: 'Esterilización de medios, vidriería e instrumental en ciclos de 121 °C y 134 °C.',
    description:
      'La cámara vertical aprovecha el espacio de un laboratorio pequeño. El control guarda el ciclo y permite repetir el programa de medios o el de material seco sin reprogramar cada vez.',
    applications: ['Preparación de medios', 'Esterilización de instrumental', 'Laboratorios de docencia'],
    specs: [
      { label: 'Cámara', value: '50 L' },
      { label: 'Temperatura', value: '121 °C y 134 °C' },
      { label: 'Control', value: 'Microprocesador' },
      { label: 'Registro', value: 'Ciclo en pantalla' },
    ],
    image: '/images/productos/autoclave-vertical.svg',
    featured: true,
  },
  {
    slug: 'microscopio-binocular',
    name: 'Microscopio binocular',
    category: 'microbiologia',
    summary: 'Observación de rutina con objetivos hasta 100x e iluminación LED.',
    description:
      'El cabezal binocular y la platina mecánica permiten revisar laminillas durante un turno completo. La iluminación LED mantiene el color de la muestra y baja el calor sobre la preparación.',
    applications: ['Hematología y frotis', 'Microbiología básica', 'Prácticas universitarias'],
    specs: [
      { label: 'Objetivos', value: '4x, 10x, 40x y 100x' },
      { label: 'Cabezal', value: 'Binocular' },
      { label: 'Iluminación', value: 'LED' },
      { label: 'Platina', value: 'Mecánica' },
    ],
    image: '/images/productos/microscopio-binocular.svg',
    featured: false,
  },
  {
    slug: 'incubadora-co2',
    name: 'Incubadora de CO₂',
    category: 'microbiologia',
    summary: 'Cámara de cultivo con control de temperatura y atmósfera de dióxido de carbono.',
    description:
      'Mantiene cultivos que necesitan 37 °C y una atmósfera cercana al 5 % de CO₂. El sensor infrarrojo sigue la concentración aunque cambie la humedad de la cámara.',
    applications: ['Cultivo celular', 'Investigación', 'Laboratorios de referencia'],
    specs: [
      { label: 'Volumen', value: '160 L' },
      { label: 'CO₂', value: 'Control al 5 %' },
      { label: 'Temperatura', value: '37 °C' },
      { label: 'Sensor', value: 'Infrarrojo' },
    ],
    image: '/images/productos/incubadora-co2.svg',
    featured: true,
  },
  {
    slug: 'balanza-analitica',
    name: 'Balanza analítica',
    category: 'pesaje',
    summary: 'Pesaje de alta resolución con cabina anti-corrientes y calibración interna.',
    description:
      'La legibilidad de 0,1 mg cubre preparación de estándares y control de materia prima fina. La cabina reduce el efecto del aire del laboratorio y la calibración interna se ejecuta desde el teclado.',
    applications: ['Preparación de estándares', 'Formulación', 'Control de materia prima'],
    specs: [
      { label: 'Capacidad', value: '220 g' },
      { label: 'Legibilidad', value: '0,1 mg' },
      { label: 'Calibración', value: 'Interna' },
      { label: 'Cabina', value: 'Anti-corrientes' },
    ],
    image: '/images/productos/balanza-analitica.svg',
    featured: true,
  },
  {
    slug: 'estufa-de-secado',
    name: 'Estufa de secado',
    category: 'temperatura',
    summary: 'Secado y acondicionamiento térmico con control PID hasta 250 °C.',
    description:
      'Sirve para humedad, secado de vidriería y acondicionamiento de muestras. La convección natural es adecuada cuando la muestra no debe recibir un flujo de aire fuerte.',
    applications: ['Humedad', 'Secado de material', 'Estabilidad térmica'],
    specs: [
      { label: 'Volumen', value: '80 L' },
      { label: 'Rango', value: 'Ambiente +10 °C a 250 °C' },
      { label: 'Control', value: 'PID' },
      { label: 'Convección', value: 'Natural' },
    ],
    image: '/images/productos/estufa-de-secado.svg',
    featured: false,
  },
  {
    slug: 'agitador-magnetico',
    name: 'Agitador magnético con plancha',
    category: 'temperatura',
    summary: 'Agitación y calentamiento simultáneos para preparaciones de hasta 5 litros.',
    description:
      'La plancha y el imán se controlan por separado. Es el equipo de mesón para disolver, calentar suavemente y mantener una mezcla homogénea mientras se prepara un reactivo.',
    applications: ['Preparación de reactivos', 'Docencia', 'Digestiones suaves'],
    specs: [
      { label: 'Volumen', value: 'Hasta 5 L' },
      { label: 'Agitación', value: '50–1500 rpm' },
      { label: 'Plancha', value: 'Hasta 300 °C' },
      { label: 'Control', value: 'Digital' },
    ],
    image: '/images/productos/agitador-magnetico.svg',
    featured: false,
  },
  {
    slug: 'bano-maria',
    name: 'Baño María de circulación',
    category: 'temperatura',
    summary: 'Temperatura uniforme en agua para incubaciones y descongelación controlada.',
    description:
      'La circulación reparte la temperatura en todo el tanque, de modo que los tubos del borde y del centro trabajen en la misma condición. La tapa reduce evaporación en corridas largas.',
    applications: ['Incubación de tubos', 'Descongelación', 'Ensayos serológicos'],
    specs: [
      { label: 'Volumen', value: '12 L' },
      { label: 'Rango', value: 'Ambiente +5 °C a 100 °C' },
      { label: 'Circulación', value: 'Sí' },
      { label: 'Tapa', value: 'Abatible' },
    ],
    image: '/images/productos/bano-maria.svg',
    featured: true,
  },
  {
    slug: 'cabina-flujo-laminar',
    name: 'Cabina de flujo laminar',
    category: 'bioseguridad',
    summary: 'Área de trabajo con aire filtrado HEPA para preparar material limpio.',
    description:
      'El flujo laminar baña la superficie de trabajo con aire que pasó por un filtro HEPA. Sirve para preparar medios y material estéril cuando el proceso pide una zona limpia de mesón.',
    applications: ['Preparación de medios', 'Ensamble de material estéril', 'Control microbiológico'],
    specs: [
      { label: 'Ancho útil', value: '120 cm' },
      { label: 'Flujo', value: 'Laminar vertical' },
      { label: 'Filtro', value: 'HEPA H14' },
      { label: 'Iluminación', value: 'LED de trabajo' },
    ],
    image: '/images/productos/cabina-flujo-laminar.svg',
    featured: false,
  },
  {
    slug: 'set-micropipetas',
    name: 'Set de micropipetas',
    category: 'consumibles',
    summary: 'Tres volúmenes variables para transferir desde 0,5 µL hasta 1000 µL.',
    description:
      'El set cubre el rango de trabajo más frecuente en preparación de curvas, PCR y diluciones. Cada pipeta se entrega con su control de calibración y un soporte de mesa.',
    applications: ['Diluciones', 'Curvas de calibración', 'Biología molecular'],
    specs: [
      { label: 'Rangos', value: '0,5–10, 10–100 y 100–1000 µL' },
      { label: 'Eyector', value: 'De puntas' },
      { label: 'Calibración', value: 'Individual' },
      { label: 'Incluye', value: 'Soporte de mesa' },
    ],
    image: '/images/productos/set-micropipetas.svg',
    featured: false,
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((product) => product.category === slug);
}

export const featuredProducts = products.filter((product) => product.featured);
