// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import remarkMermaid from './src/lib/remark-mermaid.mjs';
import { blogLastmod } from './src/lib/blog-dates.mjs';

// Resolved once at config load; the sitemap integration reuses it per URL.
const lastmod = blogLastmod();

// https://astro.build/config
export default defineConfig({
  site: 'https://s4ng.github.io',
  integrations: [
    sitemap({
      serialize(item) {
        const date = lastmod.get(new URL(item.url).pathname);
        if (date) item.lastmod = date.toISOString();
        return item;
      },
    }),
  ],
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
