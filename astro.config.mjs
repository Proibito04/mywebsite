import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
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
  })]
});