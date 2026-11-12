import { company } from './company.js';
import { contact } from './contact.js';
import { absolute } from './paths.js';

const businessId = `${absolute('/')}#negocio`;

/**
 * Datos estructurados del negocio. Solo incluye información confirmada:
 * sin horarios, coordenadas, valoraciones ni identificadores empresariales.
 */
export const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': businessId,
  name: company.name,
  description: company.description,
  url: absolute('/'),
  image: absolute('/og-image.jpg'),
  telephone: contact.phoneE164,
  email: contact.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.address.street,
    addressLocality: company.address.city,
    addressCountry: company.address.countryCode,
  },
  areaServed: { '@type': 'City', name: company.address.city },
};

export function serviceSchema({ name, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absolute(path),
    provider: { '@id': businessId },
    areaServed: { '@type': 'City', name: company.address.city },
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absolute(item.href),
    })),
  };
}

export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}
