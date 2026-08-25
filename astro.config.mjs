// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import remarkMermaid from './src/lib/remark-mermaid.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://s4ng.github.io',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkMermaid],
    shikiConfig: {
      // Both themes are emitted inline; global.css picks the dark one when the
      // page is in dark mode.
      themes: {
        light: 'github-light',
        dark: 'material-theme-darker',
      },
      wrap: true,
    },
  },
});
