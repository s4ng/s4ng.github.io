// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "s4ng's blog",
  tagline: '개발 블로그와 공부 정리',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://s4ng.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served.
  // User site (s4ng.github.io) is served at the root.
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 's4ng', // GitHub org/user name.
  projectName: 's4ng.github.io', // Repo name.

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, this field sets useful
  // metadata like html lang. Content is Korean.
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          editUrl:
            'https://github.com/s4ng/s4ng.github.io/tree/main/',
        },
        blog: {
          routeBasePath: '/', // 블로그를 사이트 루트에 서빙
          blogTitle: "s4ng's blog",
          blogDescription: '개발 블로그와 공부 정리',
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl:
            'https://github.com/s4ng/s4ng.github.io/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: "s4ng's blog",
        logo: {
          alt: "s4ng's blog Logo",
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: '공부 정리',
          },
          {
            href: 'https://github.com/s4ng',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: '콘텐츠',
            items: [
              {
                label: 'Blog',
                to: '/',
              },
              {
                label: '공부 정리',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: '링크',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/s4ng',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} s4ng. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
