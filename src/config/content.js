import { company } from './company.js';

export const heroIndicators = [
  { icon: 'house', label: 'Atención a domicilio' },
  { icon: 'user-check', label: 'Técnicos capacitados' },
  { icon: 'package-check', label: 'Repuestos originales cuando corresponda' },
  { icon: 'map-pin', label: 'Servicio en Bogotá y alrededores' },
];

export const trustItems = [
  { icon: 'award', title: `${company.yearsOfExperience} años`, text: 'de experiencia' },
  { icon: 'house', title: 'A domicilio', text: 'atendemos en tu hogar' },
  { icon: 'map-pin', title: 'Cobertura', text: 'Bogotá y municipios cercanos' },
  { icon: 'shield-check', title: 'Calidad y garantía', text: 'en cada trabajo' },
  { icon: 'wrench', title: 'Especializada', text: 'atención técnica' },
];

export const highlights = [
  {
    title: 'Reparación de electrodomésticos',
    text: 'Diagnosticamos la falla y te explicamos qué necesita tu equipo antes de repararlo.',
    image: 'tecnico-lavadora-superior',
    alt: 'Técnico reparando por dentro una lavadora de carga superior',
    position: '50% 40%',
    wa: 'reparacion',
    size: 'wide',
  },
  {
    title: 'Mantenimiento preventivo',
    text: 'Limpieza, ajuste y revisión de componentes para conservar tus equipos en buen estado.',
    image: 'tecnico-nevera',
    alt: 'Técnico limpiando con un cepillo el condensador trasero de una nevera',
    position: '60% 40%',
    wa: 'mantenimiento',
    size: 'narrow',
  },
  {
    title: 'Instalación de electrodomésticos',
    text: 'Instalamos neveras, lavadoras y secadoras directamente en tu hogar.',
    image: 'lavadora-frontal',
    alt: 'Lavadora de carga frontal instalada en una zona de ropas',
    position: '60% 60%',
    wa: 'instalacion',
    size: 'narrow',
  },
  {
    title: 'Cambio de filtros de agua',
    text: 'Cambiamos e instalamos filtros de agua para neveras, incluso los que ya compraste.',
    image: 'nevecon',
    alt: 'Nevecón con dispensador de agua en la puerta, en una cocina moderna',
    position: '25% 40%',
    wa: 'filtros',
    size: 'wide',
  },
];

export const whyChooseUs = [
  { icon: 'award', title: 'Experiencia', text: 'Contamos con experiencia en soluciones técnicas para diferentes tipos de electrodomésticos.' },
  { icon: 'sparkles', title: 'Calidad', text: 'Trabajamos con profesionalismo, responsabilidad y compromiso en cada servicio.' },
  { icon: 'shield-check', title: 'Garantía', text: 'Los trabajos cuentan con garantía sobre las instalaciones y los repuestos suministrados, de acuerdo con las condiciones del servicio.' },
  { icon: 'house', title: 'Servicio a domicilio', text: 'Atendemos directamente en el hogar de nuestros clientes.' },
  { icon: 'package-check', title: 'Repuestos originales', text: 'Priorizamos repuestos originales y adecuados para cada equipo.' },
  { icon: 'map-pin', title: 'Cobertura', text: 'Prestamos servicios en Bogotá y municipios cercanos.' },
];

export const processSteps = [
  { icon: 'message-circle', title: 'Contáctanos por WhatsApp o teléfono', text: 'Escríbenos o llámanos por el canal que prefieras.' },
  { icon: 'clipboard-list', title: 'Cuéntanos qué electrodoméstico presenta el problema', text: 'Indícanos el tipo de equipo y lo que está ocurriendo.' },
  { icon: 'calendar-check', title: 'Coordinamos la visita técnica y el diagnóstico', text: 'Acordamos contigo la fecha y el horario de la visita.' },
  { icon: 'badge-check', title: 'Recibe la solución y las recomendaciones del técnico', text: 'Te explicamos el trabajo y cómo cuidar tu equipo.' },
];

/** Testimonios publicados por la empresa. No agregar opiniones nuevas sin respaldo. */
export const testimonials = [
  { name: 'María G.', city: 'Bogotá', text: 'Mi lavadora LG no centrifugaba y pensé que debía reemplazarla. El técnico encontró la falla rápidamente y la dejó funcionando el mismo día. Excelente servicio.' },
  { name: 'Carlos R.', city: 'Chía', text: 'Solicité mantenimiento preventivo para mi lavadora Samsung. Fueron puntuales, explicaron todo el proceso y dejaron el equipo funcionando perfectamente.' },
  { name: 'Andrea P.', city: 'Bogotá', text: 'Tenía una fuga de agua en mi lavadora de carga frontal. El diagnóstico fue rápido y la reparación quedó con garantía. Muy recomendados.' },
  { name: 'Juan C.', city: 'Cajicá', text: 'Excelente atención. Mi lavadora hacía mucho ruido al centrifugar y solucionaron el problema sin necesidad de cambiar el equipo.' },
  { name: 'José C.', city: 'Bogotá', text: 'Me ayudaron con un filtro LG que no conseguía. Servicio rápido y garantía.' },
];

export const faqs = [
  { q: '¿Cuándo cambiar tu filtro?', a: 'Cada seis meses aproximadamente, cuando disminuya el flujo de agua, cambie el sabor o el olor, o se encienda el indicador del filtro.' },
  { q: '¿Cuánto dura un filtro?', a: 'Aproximadamente seis meses, dependiendo del uso y las recomendaciones del fabricante.' },
  { q: '¿Instalan filtros comprados por el cliente?', a: 'Sí, realizamos instalación de filtros comprados por el cliente.' },
  { q: '¿Trabajan a domicilio?', a: 'Sí, prestamos servicio técnico a domicilio en Bogotá y municipios cercanos.' },
  { q: '¿El filtro debe ser original?', a: 'Siempre es lo más recomendable.' },
  { q: '¿Ofrecen garantía?', a: 'Sí, los trabajos cuentan con garantía sobre la instalación y los repuestos suministrados.' },
  { q: '¿Realizan mantenimiento preventivo de neveras?', a: 'Sí, realizamos limpieza, revisión de componentes, verificación de temperatura, drenajes y funcionamiento general.' },
  { q: '¿También reparan lavadoras y secadoras?', a: 'Sí, realizamos diagnóstico, mantenimiento y reparación de lavadoras y secadoras de múltiples marcas.' },
  { q: '¿Cuánto cuesta una visita técnica?', a: 'El valor depende de la ubicación y del tipo de servicio requerido. Contáctanos para recibir una cotización.' },
  { q: '¿Atienden emergencias el mismo día?', a: 'Según disponibilidad, podemos programar visitas el mismo día para casos urgentes.' },
  { q: '¿Cómo puedo agendar una cita?', a: 'Puedes comunicarte por WhatsApp o llamarnos directamente para coordinar fecha y horario.' },
];
