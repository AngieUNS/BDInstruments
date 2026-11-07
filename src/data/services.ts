export interface Service {
  slug: string;
  title: string;
  summary: string;
  body: string;
  points: string[];
}

export const services: Service[] = [
  {
    slug: 'suministro',
    title: 'Suministro de equipos',
    summary: 'Definimos el instrumento según el método, la matriz y el rango de trabajo.',
    body: 'Revisamos con usted qué va a medir, con qué frecuencia y en qué condiciones. Con eso armamos una configuración concreta: equipo, accesorios y consumibles de arranque.',
    points: [
      'Comparación de rangos, resolución y accesorios',
      'Cotización con alcance de instalación',
      'Entrega coordinada con su laboratorio',
    ],
  },
  {
    slug: 'instalacion',
    title: 'Instalación y puesta en marcha',
    summary: 'Dejamos el equipo instalado, verificado y listo para la primera corrida.',
    body: 'Ubicamos el instrumento, conectamos servicios y comprobamos que la lectura de arranque esté dentro de lo esperado. El personal que lo va a usar presencia la puesta en marcha.',
    points: [
      'Ubicación, nivelación y conexiones',
      'Verificación inicial de funcionamiento',
      'Entrega de manuales y lista de arranque',
    ],
  },
  {
    slug: 'calibracion',
    title: 'Calibración y verificación',
    summary: 'Programamos verificaciones para sostener la confianza en el dato.',
    body: 'Acordamos puntos de control y periodicidad según el uso del equipo. Documentamos el resultado para que el laboratorio pueda mostrar el estado del instrumento.',
    points: [
      'Puntos de verificación acordados con el método',
      'Registro del resultado y de la fecha',
      'Recomendación de ajuste o de servicio si hace falta',
    ],
  },
  {
    slug: 'mantenimiento',
    title: 'Mantenimiento',
    summary: 'Preventivo para evitar paradas y correctivo cuando el equipo se detiene.',
    body: 'El plan preventivo sigue las horas de uso y las condiciones del laboratorio. Si hay una falla, diagnosticamos en sitio y definimos si se resuelve con ajuste, repuesto o retiro.',
    points: [
      'Rutinas preventivas por tipo de instrumento',
      'Diagnóstico en sitio',
      'Informe de lo realizado y del siguiente servicio',
    ],
  },
  {
    slug: 'capacitacion',
    title: 'Capacitación de usuarios',
    summary: 'Entrenamos a quien opera el equipo en el uso diario y en el cuidado básico.',
    body: 'La sesión ocurre con su propio instrumento y con el tipo de muestra que manejan. Cubrimos encendido, medición, limpieza y las señales que indican que hay que llamar a servicio.',
    points: [
      'Uso diario con el equipo ya instalado',
      'Limpieza y cuidados que evitan daños',
      'Criterios para escalar una falla',
    ],
  },
  {
    slug: 'repuestos',
    title: 'Repuestos y soporte',
    summary: 'Conseguimos repuestos compatibles y damos seguimiento hasta el cierre.',
    body: 'Identificamos la referencia a partir del modelo y del síntoma. Coordinamos la pieza, la instalación y la verificación posterior para que el equipo vuelva a medir.',
    points: [
      'Identificación de la referencia correcta',
      'Instalación y prueba después del cambio',
      'Un canal de contacto para el seguimiento',
    ],
  },
];
