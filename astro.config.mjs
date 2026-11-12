import { defineConfig } from 'astro/config';
import { company } from './src/config/company.js';

export default defineConfig({
  site: company.siteUrl,
  // Subcarpeta de publicación, por ejemplo /ElectroHogar en GitHub Pages. En un dominio propio queda en /.
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
