import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const notes = defineCollection({
  loader: glob({ base: './src/content/notes', pattern: '**/*.md', }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).default([]),
  }),
});

const writeups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/writeups' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    machine: z.string().optional(),
    difficulty: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { notes, writeups };
