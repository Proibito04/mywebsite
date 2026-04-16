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
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writeups' }),
  schema: z.object({
    name: z.string(),
    starting_date: z.date(),
    modified: z.date(),
    machine_link: z.string().optional().nullable(),
    difficulty: z.string().optional().nullable().transform(v => v ?? "easy"),
    tags: z.array(z.string()).nullable().transform(v => v ?? []),
    private: z.boolean().default(false),
    created: z.date()
  }),
});

export const collections = { notes, writeups };
