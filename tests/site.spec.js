import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = ['/', '/servicios/', '/neveras/', '/lavadoras/', '/secadoras/', '/aires-acondicionados/', '/filtros-de-agua/', '/nosotros/', '/preguntas-frecuentes/', '/contacto/', '/politica-de-privacidad/', '/terminos-y-condiciones/'];
const isMobile = (info) => info.project.name === 'mobile';

async function scrollThrough(page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo({ top: y, behavior: 'instant' });
      await new Promise((r) => setTimeout(r, 40));
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  });
}

for (const route of routes) {
  test(`ruta ${route}: carga, SEO, imágenes y consola`, async ({ page }) => {
    const errors = [];
    page.on('console', (m) => {
      if (m.type() === 'error' && !/google|gstatic/.test(m.text() + m.location().url)) errors.push(m.text());
    });
    page.on('pageerror', (e) => errors.push(e.message));

    const response = await page.goto(route);
    expect(response.status()).toBe(200);
    await scrollThrough(page);

    await expect(page.locator('h1')).toHaveCount(1);
    expect((await page.title()).length).toBeGreaterThan(10);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description.length).toBeGreaterThan(40);
    expect(description.length).toBeLessThanOrEqual(170);
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toMatch(new RegExp(`${route}$`));

    const broken = await page.locator('img').evaluateAll(async (imgs) => {
      await Promise.all(imgs.map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); }));
      return imgs.filter((i) => !i.complete || i.naturalWidth === 0 || !i.alt).map((i) => i.currentSrc || i.src);
    });
    expect(broken).toEqual([]);

    expect(await page.locator('a[href="#"], a:not([href])').count()).toBe(0);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });

  test(`ruta ${route}: accesibilidad y contraste`, async ({ page }) => {
    await page.goto(route);
    await scrollThrough(page);
    await page.waitForTimeout(800);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).exclude('iframe').analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`)).toEqual([]);
  });
}

test('todos los enlaces internos responden', async ({ page, request }) => {
  const seen = new Set();
  for (const route of routes) {
    await page.goto(route);
    const hrefs = await page.locator('a[href^="/"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
    hrefs.forEach((h) => seen.add(h.split('#')[0]));
  }
  for (const href of seen) expect((await request.get(href)).status(), href).toBe(200);
});

test('WhatsApp: número y mensaje según el servicio', async ({ page }) => {
  const expected = { '/neveras/': 'mi nevera', '/lavadoras/': 'una lavadora', '/secadoras/': 'una secadora', '/aires-acondicionados/': 'aire acondicionado', '/filtros-de-agua/': 'filtro de agua', '/': 'servicios de ElectroHogar' };
  for (const [route, text] of Object.entries(expected)) {
    await page.goto(route);
    const href = await page.locator('.wa-float').getAttribute('href');
    expect(href).toMatch(/^https:\/\/wa\.me\/573132071358\?text=/);
    expect(decodeURIComponent(href)).toContain(text);
  }
});

test('contacto: enlaces de teléfono, correo y mapa', async ({ page }) => {
  await page.goto('/contacto/');
  await expect(page.locator('.contact-actions a[href="tel:3132071358"]')).toHaveText(/Llamar ahora/);
  await expect(page.locator('.contact-actions a[href="mailto:servicentrobogota15@gmail.com"]')).toHaveText(/Enviar correo/);
  expect(await page.locator('iframe.map-frame').getAttribute('src')).toContain('Carrera%20106');
});

test('navegación de escritorio: desplegable y logo', async ({ page }, info) => {
  test.skip(isMobile(info));
  await page.goto('/nosotros/');
  const dropdown = page.locator('#nav-services');
  await expect(dropdown).toBeHidden();
  await page.locator('.nav__item--sub').hover();
  await expect(dropdown).toBeVisible();
  await page.locator('.dropdown__link', { hasText: 'Lavadoras' }).click();
  await expect(page).toHaveURL(/\/lavadoras\/$/);
  await page.locator('.nav__logo').click();
  await expect(page).toHaveURL(/localhost:4321\/$/);

  await page.mouse.move(0, 500);
  await page.locator('[data-dropdown-toggle]').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#nav-services')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('#nav-services')).toBeHidden();
});

test('navegación móvil: hamburguesa y submenú', async ({ page }, info) => {
  test.skip(!isMobile(info));
  await page.goto('/');
  const menu = page.locator('#nav-menu');
  await expect(menu).toBeHidden();
  await page.locator('[data-nav-toggle]').click();
  await expect(menu).toBeVisible();
  await page.locator('[data-dropdown-toggle]').click();
  await page.locator('.dropdown__link', { hasText: 'Filtros de agua' }).click();
  await expect(page).toHaveURL(/\/filtros-de-agua\/$/);
  await expect(page.locator('#nav-menu')).toBeHidden();
});

test('preguntas frecuentes: acordeón', async ({ page }) => {
  await page.goto('/preguntas-frecuentes/');
  await expect(page.locator('[data-accordion-trigger]')).toHaveCount(11);
  const first = page.locator('[data-accordion-trigger]').nth(0);
  const second = page.locator('[data-accordion-trigger]').nth(1);
  await expect(page.locator('#faq-a0 p')).toBeHidden();
  await first.click();
  await expect(page.locator('#faq-a0 p')).toBeVisible();
  await second.click();
  await expect(first).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#faq-a1 p')).toBeVisible();
});

test('testimonios: carrusel', async ({ page }, info) => {
  await page.goto('/');
  const track = page.locator('[data-carousel-track]');
  await track.scrollIntoViewIfNeeded();
  await expect(track.locator('.testimonial')).toHaveCount(5);
  const dots = page.locator('[data-carousel-dot]:visible');
  const lastDot = dots.last();
  await lastDot.click();
  await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeGreaterThan(50);
  await expect(lastDot).toHaveAttribute('aria-current', 'true');
  if (!isMobile(info)) {
    const next = page.locator('[data-carousel-next]');
    const prev = page.locator('[data-carousel-prev]');
    await expect(next).toBeDisabled();
    await prev.click();
    await expect(next).toBeEnabled();
    await prev.click();
    await expect(prev).toBeDisabled();
    await expect.poll(() => track.evaluate((el) => el.scrollLeft)).toBeLessThan(5);
  }
});

async function fillForm(page, overrides = {}) {
  const values = { '#f-name': 'Ana Pérez', '#f-phone': '300 123 4567', '#f-email': 'ana@correo.com', '#f-brand': 'LG', '#f-problem': 'La lavadora no centrifuga bien.', '#f-address': 'Chapinero, Bogotá', ...overrides };
  for (const [selector, value] of Object.entries(values)) await page.fill(selector, value);
  await page.selectOption('#f-service', 'Reparación');
  await page.selectOption('#f-appliance', 'Lavadora');
  await page.selectOption('#f-schedule', 'Mañana');
  await page.check('#f-privacy');
}

test('formulario: valida campos obligatorios y formatos', async ({ page }) => {
  await page.goto('/contacto/');
  await page.click('[data-submit]');
  await expect(page.locator('#f-name-e')).not.toBeEmpty();
  await expect(page.locator('#f-privacy-e')).not.toBeEmpty();
  await expect(page.locator('#f-name')).toBeFocused();
  await expect(page.locator('[data-status]')).toBeHidden();

  await fillForm(page, { '#f-email': 'correo-malo', '#f-phone': '123' });
  await page.click('[data-submit]');
  await expect(page.locator('#f-email-e')).toContainText('formato');
  await expect(page.locator('#f-phone-e')).toContainText('10 dígitos');
  await expect(page.locator('[data-status]')).toBeHidden();
});

test('formulario: entrega por WhatsApp sin afirmar que fue recibida', async ({ page, context }) => {
  await context.route('https://wa.me/**', (route) => route.fulfill({ status: 200, body: 'wa' }));
  await page.goto('/contacto/');
  await fillForm(page);
  const [popup] = await Promise.all([context.waitForEvent('page'), page.click('[data-submit]')]);
  const message = decodeURIComponent(popup.url());
  expect(popup.url()).toContain('wa.me/573132071358');
  expect(message).toContain('Ana Pérez');
  expect(message).toContain('Marca: LG');
  await expect(page.locator('[data-status]')).toContainText('presiona enviar en WhatsApp');
  await expect(page.locator('[data-status]')).not.toContainText('Recibimos');
});

/** Simula un sitio con `formEndpoint` configurado. */
async function withEndpoint(page, status) {
  await page.route('**/contacto/', async (route) => {
    const response = await route.fetch();
    const body = (await response.text()).replace('data-contact-form', 'data-contact-form data-endpoint="/api/solicitud"');
    await route.fulfill({ response, body });
  });
  await page.route('**/api/solicitud', (route) => route.fulfill({ status, body: '{}' }));
}

test('formulario con endpoint: confirma si el servidor responde bien', async ({ page }) => {
  await withEndpoint(page, 200);
  await page.goto('/contacto/');
  await fillForm(page);
  await page.click('[data-submit]');
  await expect(page.locator('[data-status]')).toContainText('Recibimos tu solicitud');
  await expect(page.locator('#f-name')).toHaveValue('');
});

test('formulario con endpoint: un fallo no se presenta como éxito', async ({ page }) => {
  await withEndpoint(page, 500);
  await page.goto('/contacto/');
  await fillForm(page);
  await page.click('[data-submit]');
  await expect(page.locator('[data-status]')).toContainText('No pudimos enviar');
  await expect(page.locator('#f-name')).toHaveValue('Ana Pérez');
});

test('sitemap y robots', async ({ request }) => {
  const sitemap = await (await request.get('/sitemap.xml')).text();
  for (const route of routes) expect(sitemap).toContain(`${route}</loc>`);
  expect(await (await request.get('/robots.txt')).text()).toContain('Sitemap:');
});

test('datos estructurados válidos y sin datos no confirmados', async ({ page }) => {
  await page.goto('/neveras/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const data = blocks.map((b) => JSON.parse(b));
  expect(data.map((d) => d['@type'])).toEqual(expect.arrayContaining(['LocalBusiness', 'Service', 'BreadcrumbList']));
  expect(blocks.join()).not.toMatch(/aggregateRating|openingHours|"geo"/);
});
