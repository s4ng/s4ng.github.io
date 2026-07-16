// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkMermaid from './src/lib/remark-mermaid.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://s4ng.github.io',
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [remarkMermaid],
    shikiConfig: {
      theme: 'material-theme-darker',
      wrap: true,
    },
  },
});
