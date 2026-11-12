/* Genera favicon e imagen Open Graph en public/. Uso: node scripts/generate-brand-assets.mjs */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const mark = (size) => `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40">
  <rect width="40" height="40" rx="11" fill="#7C3AED"/>
  <path d="M7.5 19.6 20 8.5l12.5 11.1V30a2.2 2.2 0 0 1-2.2 2.2H9.7A2.2 2.2 0 0 1 7.5 30Z" fill="#fff"/>
  <path d="M22 13.6 14.8 23h4.7l-1.4 6.6 7.1-9.4h-4.6Z" fill="#7C3AED"/>
</svg>`;

await writeFile('public/favicon.svg', mark(40));
await sharp(Buffer.from(mark(32))).png().toFile('public/favicon-32.png');
await sharp(Buffer.from(mark(180))).flatten({ background: '#7C3AED' }).png().toFile('public/apple-touch-icon.png');

const overlay = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset=".42" stop-color="#1F2937"/><stop offset=".75" stop-color="#1F2937" stop-opacity="0"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <g transform="translate(64 70) scale(1.6)">
    <rect width="40" height="40" rx="11" fill="#7C3AED"/>
    <path d="M7.5 19.6 20 8.5l12.5 11.1V30a2.2 2.2 0 0 1-2.2 2.2H9.7A2.2 2.2 0 0 1 7.5 30Z" fill="#fff"/>
    <path d="M22 13.6 14.8 23h4.7l-1.4 6.6 7.1-9.4h-4.6Z" fill="#7C3AED"/>
  </g>
  <text x="146" y="118" font-family="Segoe UI, Arial, sans-serif" font-size="42" font-weight="700" fill="#fff">ElectroHogar</text>
  <g font-family="Segoe UI, Arial, sans-serif" font-weight="700" font-size="56" fill="#fff">
    <text x="64" y="290">Servicio técnico</text>
    <text x="64" y="356">especializado</text>
    <text x="64" y="422">para tu hogar</text>
  </g>
  <text x="64" y="500" font-family="Segoe UI, Arial, sans-serif" font-size="27" fill="#D1D5DB">Bogotá y alrededores</text>
</svg>`;

await sharp('src/assets/images/tecnico-lavadora.jpg')
  .resize(1200, 630, { fit: 'cover', position: 'right' })
  .composite([{ input: Buffer.from(overlay) }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og-image.jpg');

console.log('Recursos de marca generados en public/');
