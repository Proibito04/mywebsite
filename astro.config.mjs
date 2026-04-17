import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  fonts:[{
    provider: fontProviders.fontsource(),
    name: "Source Sans Pro",
    cssVariable: "--font-source",
  }],
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