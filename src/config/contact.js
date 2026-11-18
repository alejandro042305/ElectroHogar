import { company, fullAddress } from './company.js';

/**
 * Canales de contacto y mensajes de WhatsApp. Para cambiar el número o un
 * mensaje basta con editar este archivo.
 */
export const contact = {
  phoneDisplay: '300 441 3066',
  phoneHref: 'tel:3004413066',
  phoneE164: '+573004413066',
  email: 'serviciovaltec@gmail.com',
  /** Número de WhatsApp con indicativo y sin signos (Colombia, +57). */
  whatsappNumber: '573004413066',
  /**
   * Endpoint opcional para el formulario (Formspree, Web3Forms, una función
   * propia...). Debe aceptar POST con JSON. Mientras esté vacío, el formulario
   * entrega la solicitud por WhatsApp. Nunca escribas aquí claves secretas.
   */
  formEndpoint: '',
};

export const whatsappMessages = {
  general: `Hola, quisiera información sobre los servicios de ${company.name}.`,
  neveras: 'Hola, quisiera solicitar un servicio técnico para mi nevera.',
  lavadoras: 'Hola, necesito información sobre reparación o mantenimiento de una lavadora.',
  secadoras: 'Hola, quisiera solicitar servicio técnico para una secadora.',
  aires: 'Hola, quisiera información sobre instalación, mantenimiento o reparación de aire acondicionado.',
  filtros: 'Hola, necesito información sobre cambio o instalación de un filtro de agua para mi nevera.',
  reparacion: 'Hola, necesito la reparación de un electrodoméstico.',
  mantenimiento: 'Hola, quisiera programar un mantenimiento preventivo para un electrodoméstico.',
  instalacion: 'Hola, necesito la instalación de un electrodoméstico.',
  cobertura: 'Hola, quisiera confirmar si tienen cobertura en mi zona.',
};

/** Devuelve el enlace de WhatsApp para una clave de `whatsappMessages`. */
export function whatsappUrl(key = 'general') {
  const text = whatsappMessages[key] ?? whatsappMessages.general;
  return `https://wa.me/${contact.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

export const emailHref = `mailto:${contact.email}`;
export const mapsQuery = encodeURIComponent(fullAddress);
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
export const mapsEmbedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;
