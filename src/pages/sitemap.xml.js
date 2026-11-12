import { absolute } from '../config/paths.js';
import { services } from '../config/services.js';

const paths = [
  '/',
  '/servicios/',
  ...services.map((s) => s.path),
  '/nosotros/',
  '/preguntas-frecuentes/',
  '/contacto/',
  '/politica-de-privacidad/',
  '/terminos-y-condiciones/',
];

export function GET() {
  const urls = paths.map((p) => `  <url><loc>${absolute(p)}</loc></url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
}
