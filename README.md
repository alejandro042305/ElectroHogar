# Valtec

Sitio web multipágina de Valtec, servicio técnico integral de electrodomésticos en Bogotá y alrededores.

Sitio publicado: <https://alejandro042305.github.io/Valtec/>

Construido con [Astro](https://astro.build): genera HTML estático, por lo que funciona en cualquier hosting.

## Comandos

```bash
npm install        # instala dependencias
npm run dev        # desarrollo en http://localhost:4321
npm run build      # genera el sitio final en dist/
npm run preview    # sirve dist/ para revisarlo
npm test           # pruebas automáticas (requiere npm run build y Google Chrome)
```

## Publicar

1. En `src/config/company.js` confirma `siteUrl` con el dominio definitivo.
2. Ejecuta `npm run build`.
3. Sube el contenido de `dist/` al hosting. Sirve en Netlify, Vercel, Cloudflare Pages o cPanel.

## Dónde cambiar cada cosa

| Qué | Archivo |
| --- | --- |
| Nombre, dominio, dirección, años de experiencia | `src/config/company.js` |
| Teléfono, correo, número y mensajes de WhatsApp, endpoint del formulario | `src/config/contact.js` |
| Servicios, menú y tarjetas | `src/config/services.js` |
| Testimonios, preguntas frecuentes, beneficios, pasos | `src/config/content.js` |
| Colores, tipografías y espaciados | `src/styles/variables.css` |
| Fotografías | `src/assets/images/` (ver `CREDITOS.md`) |

Para reemplazar una foto, guarda la nueva con el mismo nombre de archivo en `.jpg`.
El sitio genera automáticamente las versiones AVIF y WebP al compilar.

El logo original está en `src/assets/brand/valtec-logo-original.jpg`. Si lo cambias, reemplaza ese archivo
y ejecuta `node scripts/generate-brand-assets.mjs` para regenerar las versiones del logo, el favicon
y la imagen para redes sociales.

## Formulario de contacto

El sitio no tiene backend, así que el formulario valida los datos y prepara la solicitud en WhatsApp.
El cliente la envía desde la app; la página no afirma que ya fue recibida.

Para recibir las solicitudes directamente, crea un formulario en un servicio como Formspree y pega
su URL en `formEndpoint` (`src/config/contact.js`). El formulario enviará un POST con JSON y solo
mostrará confirmación si el servicio responde correctamente. No escribas claves secretas en ese archivo.

## Estructura

```
src/
  assets/      fotografías e íconos
  components/  Navbar, Footer, Hero, ServiceCard, FAQ, ContactForm, etc.
  config/      datos de la empresa, contacto, servicios, contenido y Schema.org
  layouts/     plantilla común con SEO
  pages/       una ruta por archivo, además de sitemap.xml y robots.txt
  scripts/     interacciones del navegador
  styles/      variables, estilos globales y componentes
tests/         pruebas con Playwright y axe
```
