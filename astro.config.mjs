import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  fonts: [{
    provider: fontProviders.fontsource(),
    name: "Source Sans Pro",
    cssVariable: "--font-source",
  },
  {
    provider: fontProviders.local(),
    name: "TTnormal",
    cssVariable: "--font-ttnormal",
    options: {
      variants: [{
        src: ['./src/assets/fonts/TTNormsPro-Normal.ttf'],
        weight: 'normal',
        style: 'normal'
      }]
    }
  },
  {
    provider: fontProviders.local(),
    name: "TTrational",
    cssVariable: "--font-ttrational",
    options: {
      variants: [{
        src: ['./src/assets/fonts/TT-Rationalist-Medium.ttf'],
        weight: 'medium',
        style: 'normal'
      }]
    }
  }
  ],
  markdown: {
    shikiConfig: {
      defaultColor: false,
      themes: {
        light: 'github-light',
        dark: 'github-dark-default',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()
    ]
  },

  integrations: [mdx({
    include: ['**/*.md', '**/*.mdx'],
    extendMarkdownConfig: true,
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    }
  }), sitemap()]
});