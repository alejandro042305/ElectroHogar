import { company } from './company.js';

/**
 * Rutas del sitio. Permiten publicarlo en la raíz de un dominio (/) o en una
 * subcarpeta, como GitHub Pages (/ElectroHogar/), sin tocar los enlaces.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Ruta interna con la base aplicada: link('/neveras/') → '/ElectroHogar/neveras/'. */
export const link = (path) => (path.startsWith('/') ? `${BASE}${path}` : path);

/** URL absoluta para canonical, sitemap, Open Graph y Schema.org. */
export const absolute = (path) => `${company.siteUrl}${link(path)}`;

/** Quita la base de una ruta para compararla con las del menú. */
export const stripBase = (pathname) => (BASE && pathname.startsWith(`${BASE}/`) ? pathname.slice(BASE.length) : pathname);
